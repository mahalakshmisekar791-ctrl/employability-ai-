# Employability AI

AI-powered platform that assesses student employability, scores resumes and communication, predicts placement likelihood, and streamlines employer outreach.

## Project Structure
- `backend/` FastAPI service exposing assessment, NLP, video scoring, and outreach APIs.
- `ml/` Lightweight models for resume scoring, communication analysis, predictive placement, and video interview scoring.
- `frontend/` React UI (Create React App) for interacting with the services.
- `data/` Utility scripts to generate example datasets.

## Quick Start
1) **Environment**
   - Python 3.10+ with `pip install -r requirements.txt`
   - Node 18+ (for the React app)
   - Copy `.env.example` to `.env` and fill values (SendGrid keys optional; SQLite works by default).
2) **Run API**
   ```bash
   uvicorn backend.api.main:app --reload
   ```
   The API serves OpenAPI docs at `http://localhost:8000/docs`.
3) **Run Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   React dev server runs on `http://localhost:3000`.

## Notable Endpoints
- `POST /assessment/generate` / `POST /assessment/evaluate`: MCQ generation and scoring.
- `POST /nlp/resume`: Resume scoring.
- `POST /nlp/communication`: Communication assessment.
- `POST /video/analyze`: Video interview analysis.
- `POST /student/scorecard`: Placement prediction.
- `POST /employers`, `GET /employers`: Employer outreach utilities.

## Data & Samples
- `populate_sample_data.py` seeds demo records; adjust connection settings in `.env`.
- `frontend/public/prospects_import.csv` is a sample outreach import file.

## Testing
Run unit tests (frontend) with `npm test`. Add backend tests as you extend API logic.

## License
This project is licensed under the MIT License (see `LICENSE`).
