import cv2
import mediapipe as mp
import numpy as np
import librosa
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os
from typing import Dict, List, Tuple
import warnings
warnings.filterwarnings('ignore')

class VideoAIAnalyzer:
    def __init__(self):
        # Initialize MediaPipe for face detection and landmark analysis
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        # Initialize MediaPipe for pose detection
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        self.model = None
        self.feature_columns = [
            'avg_smile_ratio', 'eye_contact_ratio', 'posture_straightness',
            'speech_pace', 'volume_stability', 'pause_frequency',
            'facial_movement', 'gesture_frequency', 'confidence_score'
        ]

    def extract_facial_features(self, frame) -> Dict:
        """Extract facial features from a video frame"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)

        features = {
            'smile_ratio': 0.0,
            'eye_contact': 0.0,
            'facial_movement': 0.0
        }

        if results.multi_face_landmarks:
            landmarks = results.multi_face_landmarks[0].landmark

            # Calculate smile ratio (distance between mouth corners / mouth width)
            mouth_left = landmarks[61]  # Left mouth corner
            mouth_right = landmarks[291]  # Right mouth corner
            mouth_top = landmarks[13]  # Upper lip
            mouth_bottom = landmarks[14]  # Lower lip

            mouth_width = abs(mouth_right.x - mouth_left.x)
            mouth_height = abs(mouth_bottom.y - mouth_top.y)

            if mouth_width > 0:
                features['smile_ratio'] = mouth_height / mouth_width

            # Eye contact (pupil positions relative to eye corners)
            left_eye_inner = landmarks[133]
            left_eye_outer = landmarks[33]
            right_eye_inner = landmarks[362]
            right_eye_outer = landmarks[263]

            # Simplified eye contact calculation
            eye_center_left = (left_eye_inner.x + left_eye_outer.x) / 2
            eye_center_right = (right_eye_inner.x + right_eye_outer.x) / 2
            face_center = (landmarks[1].x + landmarks[1].x) / 2  # Nose tip approximation

            eye_alignment = 1 - abs(eye_center_left - face_center) - abs(eye_center_right - face_center)
            features['eye_contact'] = max(0, min(1, eye_alignment + 0.5))

            # Facial movement (variance in landmark positions)
            landmark_positions = [(lm.x, lm.y, lm.z) for lm in landmarks]
            features['facial_movement'] = np.std(landmark_positions)

        return features

    def extract_pose_features(self, frame) -> Dict:
        """Extract body pose features"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(rgb_frame)

        features = {
            'posture_straightness': 0.0,
            'gesture_frequency': 0.0
        }

        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark

            # Posture straightness (shoulder and hip alignment)
            left_shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER]
            right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER]
            left_hip = landmarks[self.mp_pose.PoseLandmark.LEFT_HIP]
            right_hip = landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP]

            shoulder_level = abs(left_shoulder.y - right_shoulder.y)
            hip_level = abs(left_hip.y - right_hip.y)

            features['posture_straightness'] = 1 - (shoulder_level + hip_level) / 2

        return features

    def extract_audio_features(self, audio_path: str) -> Dict:
        """Extract audio features from audio file"""
        try:
            y, sr = librosa.load(audio_path)

            features = {}

            # Speech pace (syllables per second)
            # Simplified: using zero crossings as proxy for speech rate
            zero_crossings = librosa.zero_crossings(y)
            features['speech_pace'] = np.sum(zero_crossings) / len(y) * sr

            # Volume stability (RMS energy stability)
            rms = librosa.feature.rms(y=y)
            features['volume_stability'] = 1 / (1 + np.std(rms))

            # Pause frequency (silence detection)
            silence_threshold = np.percentile(np.abs(y), 10)
            silence_frames = np.abs(y) < silence_threshold
            features['pause_frequency'] = np.sum(silence_frames) / len(silence_frames)

            return features

        except Exception as e:
            print(f"Audio analysis failed: {e}")
            return {
                'speech_pace': 0.5,
                'volume_stability': 0.5,
                'pause_frequency': 0.5
            }

    def analyze_video(self, video_path: str, audio_path: str = None) -> Dict:
        """Analyze a complete video interview"""
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Could not open video: {video_path}")

        frame_count = 0
        facial_features = []
        pose_features = []

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1

            # Sample every 30th frame to reduce processing
            if frame_count % 30 == 0:
                face_feat = self.extract_facial_features(frame)
                pose_feat = self.extract_pose_features(frame)

                facial_features.append(face_feat)
                pose_features.append(pose_feat)

        cap.release()

        # Aggregate features across frames
        avg_features = {}

        if facial_features:
            avg_features.update({
                'avg_smile_ratio': np.mean([f['smile_ratio'] for f in facial_features]),
                'eye_contact_ratio': np.mean([f['eye_contact'] for f in facial_features]),
                'facial_movement': np.mean([f['facial_movement'] for f in facial_features])
            })

        if pose_features:
            avg_features.update({
                'posture_straightness': np.mean([f['posture_straightness'] for f in pose_features]),
                'gesture_frequency': np.mean([f['gesture_frequency'] for f in pose_features])
            })

        # Audio features
        if audio_path and os.path.exists(audio_path):
            audio_feat = self.extract_audio_features(audio_path)
            avg_features.update(audio_feat)
        else:
            avg_features.update({
                'speech_pace': 0.5,
                'volume_stability': 0.5,
                'pause_frequency': 0.5
            })

        # Calculate confidence score based on all features
        confidence_factors = [
            avg_features.get('avg_smile_ratio', 0) * 0.2,
            avg_features.get('eye_contact_ratio', 0) * 0.3,
            avg_features.get('posture_straightness', 0) * 0.2,
            avg_features.get('volume_stability', 0) * 0.2,
            (1 - avg_features.get('pause_frequency', 0)) * 0.1
        ]
        avg_features['confidence_score'] = np.mean(confidence_factors)

        return avg_features

    def generate_synthetic_data(self, num_samples: int = 1000) -> pd.DataFrame:
        """Generate synthetic training data for demonstration"""
        print(f"Generating {num_samples} synthetic video interview samples...")

        data = []
        for i in range(num_samples):
            # Generate realistic feature distributions
            smile_ratio = np.random.beta(2, 5) * 0.5  # Most people smile little
            eye_contact = np.random.beta(3, 2)  # Good eye contact distribution
            posture = np.random.beta(2.5, 2)  # Generally good posture
            speech_pace = np.random.normal(0.15, 0.05)  # Speech rate
            volume_stability = np.random.beta(3, 1)  # Stable volume
            pause_freq = np.random.beta(1, 3)  # Few pauses
            facial_move = np.random.exponential(0.1)  # Low movement
            gestures = np.random.exponential(0.05)  # Few gestures

            # Calculate confidence score
            confidence = (
                smile_ratio * 0.2 +
                eye_contact * 0.3 +
                posture * 0.2 +
                volume_stability * 0.2 +
                (1 - pause_freq) * 0.1
            )

            # Generate interview score based on features with some noise
            base_score = (
                smile_ratio * 20 +
                eye_contact * 30 +
                posture * 20 +
                speech_pace * 10 +
                volume_stability * 10 +
                (1 - pause_freq) * 10
            )
            noise = np.random.normal(0, 5)
            interview_score = np.clip(base_score + noise, 0, 100)

            data.append({
                'avg_smile_ratio': smile_ratio,
                'eye_contact_ratio': eye_contact,
                'posture_straightness': posture,
                'speech_pace': speech_pace,
                'volume_stability': volume_stability,
                'pause_frequency': pause_freq,
                'facial_movement': facial_move,
                'gesture_frequency': gestures,
                'confidence_score': confidence,
                'interview_score': interview_score
            })

        return pd.DataFrame(data)

    def train_model(self, data_path: str = None, synthetic_samples: int = 1000):
        """Train the video AI model"""
        print("🎥 Training Video AI Model...")

        if data_path and os.path.exists(data_path):
            print(f"Loading training data from {data_path}")
            data = pd.read_csv(data_path)
        else:
            print("No training data provided, generating synthetic data...")
            data = self.generate_synthetic_data(synthetic_samples)

        # Prepare features and target
        X = data[self.feature_columns]
        y = data['interview_score']

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Train model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )

        self.model.fit(X_train, y_train)

        # Evaluate
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)

        print(f"Training completed with MAE: {mae:.2f}")
        print(f"R² Score: {r2:.3f}")
        # Save model
        os.makedirs('ml/video_ai', exist_ok=True)
        with open('ml/video_ai/video_ai_model.pkl', 'wb') as f:
            pickle.dump(self.model, f)

        print("✅ Model trained and saved to ml/video_ai/video_ai_model.pkl")

        return {
            'mae': mae,
            'r2': r2,
            'model': self.model
        }

    def predict_score(self, features: Dict) -> float:
        """Predict interview score from features"""
        if self.model is None:
            # Load saved model
            try:
                with open('ml/video_ai/video_ai_model.pkl', 'rb') as f:
                    self.model = pickle.load(f)
            except:
                print("No trained model found. Please train the model first.")
                return 50.0  # Default score

        # Prepare feature vector
        feature_vector = []
        for col in self.feature_columns:
            feature_vector.append(features.get(col, 0.5))

        X = np.array(feature_vector).reshape(1, -1)
        prediction = self.model.predict(X)[0]

        return max(0, min(100, prediction))

def main():
    analyzer = VideoAIAnalyzer()

    # Train the model
    results = analyzer.train_model(synthetic_samples=2000)

    print("\n📊 Training Results:")
    print(f"Mean Absolute Error: {results['mae']:.2f}")
    print(f"R² Score: {results['r2']:.3f}")

    # Example prediction with synthetic features
    sample_features = {
        'avg_smile_ratio': 0.3,
        'eye_contact_ratio': 0.8,
        'posture_straightness': 0.9,
        'speech_pace': 0.12,
        'volume_stability': 0.85,
        'pause_frequency': 0.1,
        'facial_movement': 0.05,
        'gesture_frequency': 0.02,
        'confidence_score': 0.75
    }

    predicted_score = analyzer.predict_score(sample_features)
    print(f"Sample prediction: {predicted_score:.1f}")
if __name__ == "__main__":
    main()