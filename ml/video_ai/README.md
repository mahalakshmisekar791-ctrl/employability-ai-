# Video AI Module

This module provides AI-powered video interview analysis capabilities for the Employability AI system.

## Features

- **Facial Expression Analysis**: Detects smiles, eye contact, and facial movements
- **Body Language Analysis**: Evaluates posture and gestures
- **Speech Pattern Analysis**: Analyzes speech pace, volume stability, and fluency
- **Interview Scoring**: Provides comprehensive interview performance scores
- **Personalized Feedback**: Generates actionable feedback for improvement

## Components

### `train_video_ai.py`
The main training module that:
- Extracts features from video frames using MediaPipe
- Analyzes audio patterns using Librosa
- Trains a Random Forest model on interview performance data
- Supports both real and synthetic training data

### `video_ai_scorer.py`
The inference module that:
- Loads trained models
- Analyzes video interviews in real-time
- Provides detailed scoring and feedback
- Integrates with the FastAPI backend

### `demo.py`
Demonstration script showing:
- Model training process
- Inference with sample data
- Full analysis pipeline

## Installation

The required dependencies are already included in `requirements.txt`:

```bash
pip install -r requirements.txt
```

Key dependencies:
- `opencv-python`: Computer vision and video processing
- `mediapipe`: Facial and pose landmark detection
- `librosa`: Audio analysis
- `scikit-learn`: Machine learning algorithms
- `tensorflow`: Deep learning framework

## Training

To train the video AI model:

```bash
python ml/video_ai/train_video_ai.py
```

This will:
1. Generate synthetic training data (2000 samples by default)
2. Train a Random Forest regressor
3. Save the model to `ml/video_ai/video_ai_model.pkl`
4. Display training metrics (MAE, R² score)

## Usage

### Direct API Usage

```python
from ml.video_ai import VideoAIScorer

scorer = VideoAIScorer()
result = scorer.analyze_video_interview(video_path="interview.mp4", audio_path="interview.wav")

print(f"Score: {result['video_score']}%")
print("Feedback:", result['feedback'])
```

### Backend API Endpoint

The video AI is integrated into the FastAPI backend:

```bash
POST /video/analyze
{
  "video_url": "path/to/video.mp4",
  "audio_url": "path/to/audio.wav"  // optional
}
```

Response:
```json
{
  "video_score": 78.5,
  "features": {...},
  "feedback": [...],
  "confidence": 0.89,
  "analysis": {
    "facial_expressions": {...},
    "body_language": {...},
    "speech_patterns": {...}
  }
}
```

## Features Analyzed

### Facial Expressions
- **Smile Ratio**: Mouth width vs height analysis
- **Eye Contact**: Pupil alignment with camera
- **Expressiveness**: Facial movement variance

### Body Language
- **Posture**: Shoulder and hip alignment
- **Gestures**: Hand and body movements

### Speech Patterns
- **Pace**: Syllables per second
- **Volume Stability**: Audio level consistency
- **Fluency**: Pause frequency analysis

## Model Performance

Current model trained on synthetic data shows:
- **Mean Absolute Error**: ~4.2 points
- **R² Score**: ~0.69

For production use, train on real interview data with human-labeled scores.

## Integration with Frontend

The video AI integrates with the existing VideoPage component in `frontend/src/App.js`. The frontend captures video/audio and can send it to the `/video/analyze` endpoint for AI-powered scoring.

## Future Enhancements

- Real video dataset training
- Emotion recognition
- Voice tone analysis
- Cultural bias mitigation
- Multi-language support
- Real-time analysis during interviews

## Troubleshooting

### Model Not Found
If you get "No trained model found" errors:
```bash
python ml/video_ai/train_video_ai.py
```

### Video Processing Errors
- Ensure video files are in supported formats (MP4, AVI, MOV)
- Check file permissions
- Verify OpenCV installation

### Audio Analysis Issues
- Audio files should be in WAV format for best results
- Ensure Librosa can load the audio format

## Demo

Run the complete demo:

```bash
python ml/video_ai/demo.py
```

This shows training, inference, and analysis examples.