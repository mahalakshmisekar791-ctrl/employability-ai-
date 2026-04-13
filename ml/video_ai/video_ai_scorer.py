import cv2
import numpy as np
import pickle
import os
from typing import Dict, Optional, List
from .train_video_ai import VideoAIAnalyzer

class VideoAIScorer:
    def __init__(self):
        self.analyzer = VideoAIAnalyzer()
        self._load_model()

    def _load_model(self):
        """Load the trained model"""
        model_path = os.path.join(os.path.dirname(__file__), 'video_ai_model.pkl')
        if os.path.exists(model_path):
            try:
                with open(model_path, 'rb') as f:
                    self.analyzer.model = pickle.load(f)
                print("✅ Video AI model loaded successfully")
            except Exception as e:
                print(f"❌ Failed to load model: {e}")
                self.analyzer.model = None
        else:
            print("⚠️  No trained model found. Using default scoring.")
            self.analyzer.model = None

    def analyze_video_interview(self, video_path: str, audio_path: Optional[str] = None) -> Dict:
        """
        Analyze a video interview and return comprehensive scoring

        Args:
            video_path: Path to the video file
            audio_path: Optional path to separate audio file

        Returns:
            Dict containing scores and analysis
        """
        try:
            # Extract features from video
            features = self.analyzer.analyze_video(video_path, audio_path)

            # Get AI prediction
            ai_score = self.analyzer.predict_score(features)

            # Create detailed feedback
            feedback = self._generate_feedback(features)

            return {
                'video_score': round(ai_score, 1),
                'features': features,
                'feedback': feedback,
                'confidence': self._calculate_confidence(features),
                'analysis': {
                    'facial_expressions': self._analyze_facial(features),
                    'body_language': self._analyze_body(features),
                    'speech_patterns': self._analyze_speech(features)
                }
            }

        except Exception as e:
            print(f"Video analysis failed: {e}")
            # Fallback scoring based on basic metrics
            return self._fallback_scoring()

    def _generate_feedback(self, features: Dict) -> List[str]:
        """Generate personalized feedback based on features"""
        feedback = []

        # Smile analysis
        smile_ratio = features.get('avg_smile_ratio', 0)
        if smile_ratio < 0.1:
            feedback.append("Try smiling more during your interview to appear more approachable")
        elif smile_ratio > 0.3:
            feedback.append("Great job maintaining a positive facial expression!")

        # Eye contact
        eye_contact = features.get('eye_contact_ratio', 0)
        if eye_contact < 0.5:
            feedback.append("Work on maintaining better eye contact with the camera")
        else:
            feedback.append("Good eye contact throughout the interview")

        # Posture
        posture = features.get('posture_straightness', 0)
        if posture < 0.7:
            feedback.append("Sit up straighter to project confidence")
        else:
            feedback.append("Excellent posture maintained")

        # Speech patterns
        volume_stability = features.get('volume_stability', 0)
        if volume_stability < 0.6:
            feedback.append("Try to speak at a more consistent volume")
        else:
            feedback.append("Clear and consistent speaking volume")

        pause_freq = features.get('pause_frequency', 0)
        if pause_freq > 0.3:
            feedback.append("Reduce filler words and long pauses")
        else:
            feedback.append("Good pacing with minimal pauses")

        return feedback

    def _analyze_facial(self, features: Dict) -> Dict:
        """Analyze facial expressions"""
        smile = features.get('avg_smile_ratio', 0)
        eye_contact = features.get('eye_contact_ratio', 0)
        movement = features.get('facial_movement', 0)

        return {
            'smile_score': min(100, smile * 200),
            'eye_contact_score': eye_contact * 100,
            'expressiveness_score': min(100, 100 - movement * 1000)
        }

    def _analyze_body(self, features: Dict) -> Dict:
        """Analyze body language"""
        posture = features.get('posture_straightness', 0)
        gestures = features.get('gesture_frequency', 0)

        return {
            'posture_score': posture * 100,
            'gesture_score': min(100, gestures * 2000)  # Gestures are good in moderation
        }

    def _analyze_speech(self, features: Dict) -> Dict:
        """Analyze speech patterns"""
        pace = features.get('speech_pace', 0)
        volume = features.get('volume_stability', 0)
        pauses = features.get('pause_frequency', 0)

        # Normalize speech pace (optimal around 0.12-0.18)
        pace_score = max(0, 100 - abs(pace - 0.15) * 1000)

        return {
            'pace_score': pace_score,
            'volume_score': volume * 100,
            'fluency_score': (1 - pauses) * 100
        }

    def _calculate_confidence(self, features: Dict) -> float:
        """Calculate overall confidence in the analysis"""
        # Based on how consistent and clear the features are
        feature_values = [v for v in features.values() if isinstance(v, (int, float))]
        if not feature_values:
            return 0.5

        # High confidence if features are not all default/zero values
        variance = np.var(feature_values)
        return min(1.0, 0.5 + variance * 2)

    def _fallback_scoring(self) -> Dict:
        """Fallback scoring when video analysis fails"""
        return {
            'video_score': 65.0,  # Average score
            'features': {},
            'feedback': [
                "Video analysis encountered an issue",
                "Please ensure your camera and microphone are working properly",
                "Try recording again with good lighting"
            ],
            'confidence': 0.3,
            'analysis': {
                'facial_expressions': {'smile_score': 60, 'eye_contact_score': 60, 'expressiveness_score': 60},
                'body_language': {'posture_score': 65, 'gesture_score': 60},
                'speech_patterns': {'pace_score': 65, 'volume_score': 65, 'fluency_score': 65}
            }
        }