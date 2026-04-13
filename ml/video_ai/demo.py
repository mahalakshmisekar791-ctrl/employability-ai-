#!/usr/bin/env python3
"""
Video AI Training and Testing Demo
This script demonstrates the video AI training and inference capabilities.
"""

import sys
import os
sys.path.append(".")

from ml.video_ai import VideoAIScorer, VideoAIAnalyzer

def demo_training():
    """Demonstrate the training process"""
    print("🎥 Video AI Training Demo")
    print("=" * 50)

    analyzer = VideoAIAnalyzer()

    # Train the model
    print("Training model with synthetic data...")
    results = analyzer.train_model(synthetic_samples=1000)

    print("\n📊 Training Results:")
    print(f"Mean Absolute Error: {results['mae']:.2f}")
    print(f"R² Score: {results['r2']:.3f}")
    print("✅ Model trained and saved!")

def demo_inference():
    """Demonstrate inference with sample features"""
    print("\n🎬 Video AI Inference Demo")
    print("=" * 50)

    scorer = VideoAIScorer()

    # Sample features from a "good" interview
    good_features = {
        'avg_smile_ratio': 0.25,
        'eye_contact_ratio': 0.85,
        'posture_straightness': 0.95,
        'speech_pace': 0.14,
        'volume_stability': 0.90,
        'pause_frequency': 0.08,
        'facial_movement': 0.03,
        'gesture_frequency': 0.01,
        'confidence_score': 0.82
    }

    # Sample features from a "poor" interview
    poor_features = {
        'avg_smile_ratio': 0.05,
        'eye_contact_ratio': 0.35,
        'posture_straightness': 0.60,
        'speech_pace': 0.08,
        'volume_stability': 0.50,
        'pause_frequency': 0.35,
        'facial_movement': 0.15,
        'gesture_frequency': 0.08,
        'confidence_score': 0.45
    }

    print("Testing with sample interview features...")

    # Test good interview
    result_good = scorer.analyzer.predict_score(good_features)
    print(f"Good interview score: {result_good:.1f}")
    # Test poor interview
    result_poor = scorer.analyzer.predict_score(poor_features)
    print(f"Poor interview score: {result_poor:.1f}")
def demo_full_analysis():
    """Demonstrate full analysis (without actual video)"""
    print("\n🔍 Full Video Analysis Demo")
    print("=" * 50)

    scorer = VideoAIScorer()

    # Simulate analysis result
    mock_result = {
        'video_score': 78.5,
        'features': {
            'avg_smile_ratio': 0.22,
            'eye_contact_ratio': 0.78,
            'posture_straightness': 0.88,
            'speech_pace': 0.13,
            'volume_stability': 0.85,
            'pause_frequency': 0.12,
            'facial_movement': 0.05,
            'gesture_frequency': 0.02,
            'confidence_score': 0.75
        },
        'feedback': [
            "Great job maintaining a positive facial expression!",
            "Good eye contact throughout the interview",
            "Excellent posture maintained",
            "Clear and consistent speaking volume",
            "Good pacing with minimal pauses"
        ],
        'confidence': 0.89,
        'analysis': {
            'facial_expressions': {'smile_score': 85.2, 'eye_contact_score': 78.0, 'expressiveness_score': 95.0},
            'body_language': {'posture_score': 88.0, 'gesture_score': 65.0},
            'speech_patterns': {'pace_score': 82.0, 'volume_score': 85.0, 'fluency_score': 88.0}
        }
    }

    print("Mock Video Analysis Result:")
    print(f"Overall Video Score: {mock_result['video_score']}%")
    print("\nFeedback:")
    for feedback in mock_result['feedback']:
        print(f"  • {feedback}")

    print("\nDetailed Analysis:")
    print(f"  Facial Expressions: {mock_result['analysis']['facial_expressions']}")
    print(f"  Body Language: {mock_result['analysis']['body_language']}")
    print(f"  Speech Patterns: {mock_result['analysis']['speech_patterns']}")

if __name__ == "__main__":
    try:
        demo_training()
        demo_inference()
        demo_full_analysis()

        print("\n🎉 Video AI Demo Complete!")
        print("\nTo use with actual videos:")
        print("1. Place video files in a directory")
        print("2. Call scorer.analyze_video_interview(video_path, audio_path)")
        print("3. The API endpoint /video/analyze is ready for video analysis requests")

    except Exception as e:
        print(f"❌ Demo failed: {e}")
        import traceback
        traceback.print_exc()