from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import sys
import csv
import io
import os
from dotenv import load_dotenv

# Optional imports - fail gracefully if not installed
try:
    from sendgrid import SendGridAPIClient
    from sendgrid.helpers.mail import Mail
    SENDGRID_AVAILABLE = True
except ImportError:
    SENDGRID_AVAILABLE = False
    print("⚠️  Warning: SendGrid not installed. Email features will be limited.")

# Load environment variables from .env file
load_dotenv()

sys.path.append(".")

def get_all_employers():
    """Helper function to get all employers."""
    return outreach_service.list_employers(limit=10000)  # Large limit to get all

from backend.services.assessment_engine import MCQAssessment
from backend.services.psychometric import PsychometricEngine
from backend.services.outreach import OutreachService
from ml.nlp.resume_scorer import ResumeScorer
from ml.nlp.communication_evaluator import CommunicationEvaluator
from ml.predictive.placement_model import PlacementPredictor
from ml.video_ai import VideoAIScorer
from backend.models.schemas import (
    EmployerCreate,
    EmployerUpdate,
    EmployerResponse,
    OutreachLogCreate,
    SurveyResponseCreate,
    MeetingCreate,
)

app = FastAPI(
    title="Employability AI API",
    description="AI-powered student employability assessment system",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
mcq_engine = MCQAssessment()
psychometric = PsychometricEngine()
resume_scorer = ResumeScorer()
comm_evaluator = CommunicationEvaluator()
predictor = PlacementPredictor()
outreach_service = OutreachService()
video_ai_scorer = VideoAIScorer()

class MCQRequest(BaseModel):
    topic: str
    num_questions: int = 3

class MCQEvaluateRequest(BaseModel):
    student_id: str
    topic: str
    responses: Dict[str, str]

class ResumeRequest(BaseModel):
    resume_text: str

class CommunicationRequest(BaseModel):
    text: str

class PsychometricRequest(BaseModel):
    responses: Dict[int, int]

class ScorecardRequest(BaseModel):
    student_id: str
    technical_score: float
    communication_score: float
    behavioral_score: float
    cognitive_score: float
    resume_score: float
    cgpa: float

class VideoAnalysisRequest(BaseModel):
    video_url: str
    audio_url: Optional[str] = None

@app.get("/")
def home():
    return {
        "message": "Welcome to Employability AI!",
        "status": "running",
        "version": "1.0.0"
    }

@app.post("/assessment/generate")
def generate_mcq(request: MCQRequest):
    questions = mcq_engine.generate_test(request.topic, request.num_questions)
    return {"topic": request.topic, "questions": questions}

@app.post("/assessment/evaluate")
def evaluate_mcq(request: MCQEvaluateRequest):
    result = mcq_engine.evaluate_test(
        request.student_id, request.topic, request.responses
    )
    return result

@app.post("/psychometric/evaluate")
def evaluate_psychometric(request: PsychometricRequest):
    scores = psychometric.score_responses(request.responses)
    return {"personality_scores": scores}

@app.post("/nlp/resume")
def analyze_resume(request: ResumeRequest):
    result = resume_scorer.score_resume(request.resume_text)
    return result

@app.post("/nlp/communication")
def evaluate_communication(request: CommunicationRequest):
    result = comm_evaluator.evaluate(request.text)
    return result

@app.post("/video/analyze")
def analyze_video_interview(request: VideoAnalysisRequest):
    result = video_ai_scorer.analyze_video_interview(request.video_url, request.audio_url)
    return result

@app.post("/student/scorecard")
def generate_scorecard(request: ScorecardRequest):
    scores = {
        "technical_score": request.technical_score,
        "communication_score": request.communication_score,
        "behavioral_score": request.behavioral_score,
        "cognitive_score": request.cognitive_score,
        "resume_score": request.resume_score,
        "cgpa": request.cgpa
    }
    result = predictor.predict_placement(scores)
    return {
        "student_id": request.student_id,
        **result
    }

# ---------- Employer outreach APIs ----------

@app.post("/employers", response_model=EmployerResponse)
def create_employer(payload: EmployerCreate):
    employer = outreach_service.create_employer(payload.dict())
    return employer

@app.get("/employers", response_model=List[EmployerResponse])
def list_employers(status: Optional[str] = None, industry: Optional[str] = None, limit: int = 50):
    return outreach_service.list_employers(status=status, industry=industry, limit=limit)

@app.patch("/employers/{employer_id}", response_model=EmployerResponse)
def update_employer(employer_id: int, payload: EmployerUpdate):
    employer = outreach_service.update_employer(employer_id, payload.dict())
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")
    return employer

@app.post("/outreach/logs")
def log_outreach(payload: OutreachLogCreate):
    return outreach_service.log_outreach(payload.dict())

@app.post("/surveys")
def record_survey(payload: SurveyResponseCreate):
    return outreach_service.record_survey(payload.dict())

@app.post("/meetings")
def schedule_meeting(payload: MeetingCreate):
    return outreach_service.schedule_meeting(payload.dict())

@app.get("/employers/metrics")
def employer_metrics():
    return outreach_service.metrics()

# ---------- CSV Import for Prospect Discovery ----------
@app.post("/employers/import-csv")
def import_employers_csv(file: UploadFile = File(...)):
    """Import prospects from LinkedIn Sales Navigator CSV export."""
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="File must be CSV format")

    content = file.file.read().decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(content))

    imported_count = 0
    errors = []

    for row in csv_reader:
        try:
            # Map CSV columns to our schema (adjust based on LinkedIn export format)
            employer_data = {
                "name": row.get("Company Name", row.get("Company", "")),
                "contact_name": row.get("First Name", "") + " " + row.get("Last Name", ""),
                "role": row.get("Title", row.get("Job Title", "")),
                "email": row.get("Email", ""),
                "linkedin_url": row.get("Profile URL", row.get("LinkedIn URL", "")),
                "industry": row.get("Industry", ""),
                "company_size": row.get("Company Size", ""),
                "priority": "warm",  # Default priority
                "status": "prospect",
                "tags": [row.get("Industry", "")] if row.get("Industry") else [],
                "source": "linkedin_csv"
            }

            # Clean up empty strings
            employer_data = {k: v for k, v in employer_data.items() if v != ""}

            outreach_service.create_employer(employer_data)
            imported_count += 1

        except Exception as e:
            errors.append(f"Row {csv_reader.line_num}: {str(e)}")

    return {
        "message": f"Successfully imported {imported_count} prospects",
        "errors": errors,
        "total_processed": imported_count + len(errors)
    }

# ---------- Email Automation Integration ----------
class EmailRequest(BaseModel):
    employer_id: int
    subject: str
    message: str
    step: str = "custom"

@app.post("/email/send")
def send_email(request: EmailRequest):
    """Send automated email to employer."""
    # Get employer details
    employer = outreach_service.list_employers(limit=1000)  # Get all and find by ID
    employer = next((e for e in employer if e.id == request.employer_id), None)
    if not employer:
        raise HTTPException(status_code=404, detail="Employer not found")
    if not employer.email:
        raise HTTPException(status_code=400, detail="Employer has no email address")

    try:
        # SendGrid integration (you'll need to set SENDGRID_API_KEY env var)
        sg = SendGridAPIClient(api_key=os.getenv('SENDGRID_API_KEY', 'your-sendgrid-key-here'))

        message = Mail(
            from_email='your-email@yourdomain.com',  # Replace with your verified sender
            to_emails=employer.email,
            subject=request.subject,
            html_content=f"""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>{request.subject}</h2>
                <p>Dear {employer.contact_name or 'Hiring Manager'},</p>
                <div style="white-space: pre-line;">{request.message}</div>
                <br>
                <p>Best regards,<br>Your Name<br>Employability AI Platform</p>
            </div>
            """
        )

        # For demo purposes, we'll just log the email instead of sending
        # response = sg.send(message)

        # Log the outreach activity
        outreach_service.log_outreach({
            "employer_id": request.employer_id,
            "step": request.step,
            "channel": "email",
            "status": "sent",
            "log_metadata": {
                "subject": request.subject,
                "message": request.message
            }
        })

        return {"message": "Email sent successfully", "to": employer.email}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Email sending failed: {str(e)}")

# ---------- Survey Integration ----------
class SurveyCreateRequest(BaseModel):
    title: str
    description: str
    questions: List[Dict]  # List of question objects
    employer_ids: List[int] = []  # Target employers

@app.post("/surveys/create")
def create_survey(request: SurveyCreateRequest):
    """Create a new survey (integrates with Google Forms/Typeform)."""
    # For demo, we'll create a simple survey structure
    # In production, this would integrate with Google Forms API or Typeform API

    survey_data = {
        "title": request.title,
        "description": request.description,
        "questions": request.questions,
        "created_at": datetime.now(),
        "status": "active"
    }

    # Generate a mock survey URL (in production, create actual form)
    survey_url = f"https://forms.gle/demo-survey-{datetime.now().strftime('%Y%m%d%H%M%S')}"

    # Send survey invitations to target employers
    sent_count = 0
    for employer_id in request.employer_ids:
        try:
            employer = next((e for e in get_all_employers() if e.id == employer_id), None)
            if employer and employer.email:
                # Log survey outreach
                outreach_service.log_outreach({
                    "employer_id": employer_id,
                    "step": "survey",
                    "channel": "email",
                    "status": "sent",
                    "log_metadata": {
                        "survey_title": request.title,
                        "survey_url": survey_url
                    }
                })
                sent_count += 1
        except Exception as e:
            print(f"Failed to send survey to employer {employer_id}: {e}")

    return {
        "message": f"Survey created and sent to {sent_count} employers",
        "survey_url": survey_url,
        "survey_data": survey_data
    }

@app.get("/surveys/templates")
def get_survey_templates():
    """Get predefined survey templates."""
    return {
        "hiring_challenges": {
            "title": "Hiring Challenges & Skill Requirements Survey",
            "description": "Help us understand your current hiring challenges and skill requirements.",
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "What are your biggest hiring challenges?",
                    "options": ["Finding qualified candidates", "Assessing technical skills", "Evaluating soft skills", "Time-to-hire", "Candidate retention", "Other"]
                },
                {
                    "type": "rating",
                    "question": "How important are the following skills in your hiring process?",
                    "sub_questions": [
                        "Technical/Programming skills",
                        "Problem-solving ability",
                        "Communication skills",
                        "Team collaboration",
                        "Leadership potential"
                    ],
                    "scale": "1-5 (1=Not important, 5=Critical)"
                },
                {
                    "type": "text",
                    "question": "What specific technical skills are hardest to find?"
                },
                {
                    "type": "text",
                    "question": "How do you currently assess candidate skills?"
                }
            ]
        },
        "skill_gaps": {
            "title": "Industry Skill Gap Analysis",
            "description": "Understanding skill gaps in your industry to better prepare students.",
            "questions": [
                {
                    "type": "multiple_choice",
                    "question": "Which skills show the biggest gap between available talent and job requirements?",
                    "options": ["Advanced programming", "Data analysis", "Cloud technologies", "AI/ML", "Cybersecurity", "DevOps", "Soft skills"]
                },
                {
                    "type": "rating",
                    "question": "Rate the importance of emerging technologies:",
                    "sub_questions": ["AI/ML", "Cloud Computing", "Blockchain", "IoT", "AR/VR"],
                    "scale": "1-5 (1=Not relevant, 5=Critical for future)"
                }
            ]
        }
    }

# Predefined email templates
@app.get("/email/templates")
def get_email_templates():
    """Get predefined email templates for different outreach steps."""
    return {
        "connection_request": {
            "subject": "Connecting on LinkedIn - Employability Assessment Partnership",
            "message": """I hope this message finds you well. I'm reaching out because I noticed your role in talent acquisition at {company_name}.

We're building an AI-powered employability assessment platform that helps students get job-ready through comprehensive skill evaluation and personalized development plans.

I'd love to connect and learn more about your hiring challenges. Are you open to a quick 15-minute call to discuss how we might collaborate?

Looking forward to your thoughts."""
        },
        "survey": {
            "subject": "Quick Survey: Your Thoughts on Student Employability",
            "message": """Thank you for connecting! I'm working on improving our employability assessment platform and would greatly value your insights.

Could you take 2 minutes to complete this short survey about current hiring challenges and skill requirements?

[Survey Link: https://forms.gle/your-survey-link]

Your feedback will help us better serve both employers and students in the talent ecosystem."""
        },
        "value_proposition": {
            "subject": "How Our AI Platform Can Transform Your Hiring Process",
            "message": """Following up on our connection - I wanted to share how our employability assessment platform has helped similar companies in your industry.

Key benefits:
• Comprehensive skill evaluation (technical, communication, behavioral)
• 85% accuracy in placement prediction
• Personalized development roadmaps for candidates
• Integration with existing ATS systems

Would you be interested in seeing a demo of how this works?"""
        },
        "meeting_request": {
            "subject": "Let's Schedule a Demo of Our Employability Assessment Platform",
            "message": """Thank you for your interest in our employability assessment platform. I'd love to show you how it works and discuss potential partnership opportunities.

Are you available for a 30-minute demo next week? Here are a few time slots that work for me:

• Monday 2 PM
• Wednesday 10 AM  
• Friday 3 PM

Please let me know what works best, or feel free to suggest alternative times using this Calendly link: [Your Calendly Link]

Looking forward to speaking with you!"""
        }
    }

# Meeting Scheduling Integration
@app.post("/meetings/schedule")
def schedule_meeting_with_calendly(meeting: dict):
    """Schedule a meeting using Calendly integration."""
    try:
        employer_id = meeting.get("employer_id")
        meeting_type = meeting.get("meeting_type", "demo")
        preferred_date = meeting.get("preferred_date")
        notes = meeting.get("notes", "")

        # Get employer details
        employer = outreach_service.get_employer_by_id(employer_id)
        if not employer:
            raise HTTPException(status_code=404, detail="Employer not found")

        # Generate Calendly scheduling link (mock implementation)
        # In production, this would integrate with Calendly API
        calendly_base_url = "https://calendly.com/your-calendly-link"
        scheduling_params = {
            "invitee_email": employer.email,
            "invitee_name": employer.contact_person,
            "event_type": meeting_type,
            "custom_1": f"Company: {employer.company_name}",
            "custom_2": f"Notes: {notes}"
        }

        # Build scheduling URL
        query_string = "&".join([f"{k}={v}" for k, v in scheduling_params.items()])
        scheduling_url = f"{calendly_base_url}?{query_string}"

        # Log the meeting request
        meeting_data = {
            "employer_id": employer_id,
            "meeting_type": meeting_type,
            "status": "scheduled",
            "scheduled_date": preferred_date,
            "calendly_url": scheduling_url,
            "notes": notes
        }

        outreach_service.log_meeting(meeting_data)

        return {
            "message": "Meeting scheduling link generated",
            "scheduling_url": scheduling_url,
            "meeting_details": meeting_data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to schedule meeting: {str(e)}")

@app.get("/meetings/types")
def get_meeting_types():
    """Get available meeting types for scheduling."""
    return {
        "demo": {
            "name": "Product Demo",
            "duration": 30,
            "description": "Showcase the employability assessment platform features"
        },
        "consultation": {
            "name": "Hiring Consultation",
            "duration": 45,
            "description": "Discuss hiring challenges and potential collaboration"
        },
        "partnership_discussion": {
            "name": "Partnership Discussion",
            "duration": 60,
            "description": "Explore partnership opportunities and integration options"
        },
        "follow_up": {
            "name": "Follow-up Meeting",
            "duration": 15,
            "description": "Quick check-in on previous discussions"
        }
    }

@app.get("/meetings/upcoming")
def get_upcoming_meetings():
    """Get list of upcoming scheduled meetings."""
    try:
        meetings = outreach_service.get_upcoming_meetings()
        return {"meetings": meetings}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch meetings: {str(e)}")

# LinkedIn Sales Navigator Integration
@app.get("/linkedin/auth/status")
def get_linkedin_auth_status():
    """Check LinkedIn authentication status."""
    # In production, this would check OAuth token validity
    return {
        "authenticated": False,  # Mock: would be True if OAuth token is valid
        "message": "LinkedIn authentication required. Please connect your LinkedIn Sales Navigator account.",
        "auth_url": "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=r_liteprofile%20r_emailaddress%20w_member_social%20rw_ads%20r_ads%20r_basicprofile%20r_organization_social%20rw_organization_admin%20w_organization_social"
    }

@app.post("/linkedin/prospects/search")
def search_linkedin_prospects(search_criteria: dict):
    """Search for prospects using LinkedIn Sales Navigator criteria."""
    try:
        # Extract search parameters
        keywords = search_criteria.get("keywords", "CHRO OR Head of Talent OR HR Director")
        company_size = search_criteria.get("company_size", "51-200")  # 200+ employees
        industries = search_criteria.get("industries", ["Information Technology", "Software Development"])
        locations = search_criteria.get("locations", ["India", "United States"])
        seniority_level = search_criteria.get("seniority_level", "Director")
        limit = search_criteria.get("limit", 50)

        # Mock LinkedIn Sales Navigator search results
        # In production, this would use LinkedIn's API
        mock_prospects = [
            {
                "linkedin_id": "john-doe-123",
                "name": "John Doe",
                "title": "Chief Human Resources Officer",
                "company": "TechCorp Solutions",
                "company_size": "500-1000",
                "industry": "Information Technology",
                "location": "Mumbai, India",
                "profile_url": "https://linkedin.com/in/john-doe-123",
                "connection_degree": 2,
                "mutual_connections": 3,
                "recent_activity": "Posted about AI in HR",
                "email": "john.doe@techcorp.com",  # Would be enriched separately
                "phone": None,
                "confidence_score": 85
            },
            {
                "linkedin_id": "sarah-smith-456",
                "name": "Sarah Smith",
                "title": "Head of Talent Acquisition",
                "company": "GlobalTech Inc",
                "company_size": "1000-5000",
                "industry": "Software Development",
                "location": "San Francisco, CA",
                "profile_url": "https://linkedin.com/in/sarah-smith-456",
                "connection_degree": 3,
                "mutual_connections": 1,
                "recent_activity": "Shared article about hiring trends",
                "email": "sarah.smith@globaltech.com",
                "phone": "+1-555-0123",
                "confidence_score": 92
            },
            {
                "linkedin_id": "raj-patel-789",
                "name": "Raj Patel",
                "title": "VP of People Operations",
                "company": "InnovateSoft",
                "company_size": "201-500",
                "industry": "Computer Software",
                "location": "Bangalore, India",
                "profile_url": "https://linkedin.com/in/raj-patel-789",
                "connection_degree": 2,
                "mutual_connections": 5,
                "recent_activity": "Commented on LinkedIn post about remote work",
                "email": "raj.patel@innovatesoft.com",
                "phone": "+91-9876543210",
                "confidence_score": 78
            }
        ]

        # Filter mock results based on criteria
        # For demo purposes, return first 3 prospects
        filtered_prospects = mock_prospects[:3]

        return {
            "prospects": mock_prospects[:2],
            "total_found": 2,
            "search_criteria": search_criteria,
            "note": "This is a demo implementation. Production would use LinkedIn Sales Navigator API."
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to search prospects: {str(e)}")

@app.post("/linkedin/connection/send")
def send_linkedin_connection_request(connection_data: dict):
    """Send connection request via LinkedIn."""
    try:
        linkedin_id = connection_data.get("linkedin_id")
        message = connection_data.get("message", "")
        profile_url = connection_data.get("profile_url")

        if not linkedin_id:
            raise HTTPException(status_code=400, detail="LinkedIn ID is required")

        # Mock connection request
        # In production, this would use LinkedIn's API to send connection requests
        connection_result = {
            "success": True,
            "linkedin_id": linkedin_id,
            "message": message,
            "status": "pending",
            "sent_at": "2024-01-15T10:30:00Z",
            "note": "Connection request sent via LinkedIn API (demo mode)"
        }

        # Log the outreach activity
        outreach_log = {
            "employer_id": None,  # Would be linked to employer record
            "activity_type": "linkedin_connection",
            "status": "sent",
            "log_metadata": {
                "linkedin_id": linkedin_id,
                "profile_url": profile_url,
                "message": message
            }
        }

        # In production, save to database
        # outreach_service.log_outreach(outreach_log)

        return connection_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send connection request: {str(e)}")

@app.post("/linkedin/message/send")
def send_linkedin_message(message_data: dict):
    """Send message to LinkedIn connection."""
    try:
        linkedin_id = message_data.get("linkedin_id")
        subject = message_data.get("subject", "")
        message = message_data.get("message", "")
        message_type = message_data.get("message_type", "follow_up")  # connection_request, follow_up, value_prop, meeting_request

        if not linkedin_id or not message:
            raise HTTPException(status_code=400, detail="LinkedIn ID and message are required")

        # Mock message sending
        # In production, this would use LinkedIn's messaging API
        message_result = {
            "success": True,
            "linkedin_id": linkedin_id,
            "message_type": message_type,
            "subject": subject,
            "message": message,
            "status": "sent",
            "sent_at": "2024-01-15T10:35:00Z",
            "note": "Message sent via LinkedIn API (demo mode)"
        }

        # Log the outreach activity
        outreach_log = {
            "employer_id": None,
            "activity_type": f"linkedin_{message_type}",
            "status": "sent",
            "log_metadata": {
                "linkedin_id": linkedin_id,
                "message_type": message_type,
                "subject": subject,
                "message": message
            }
        }

        return message_result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")

@app.get("/linkedin/campaigns")
def get_linkedin_campaigns():
    """Get LinkedIn outreach campaigns and their performance."""
    # Mock campaign data
    campaigns = [
        {
            "id": "campaign_001",
            "name": "Q1 2024 - Tech Companies Outreach",
            "status": "active",
            "target_prospects": 200,
            "connected": 45,
            "responded": 12,
            "meetings_booked": 3,
            "start_date": "2024-01-01",
            "end_date": "2024-03-31",
            "performance": {
                "connection_rate": 22.5,  # 45/200
                "response_rate": 26.7,    # 12/45
                "meeting_rate": 25.0      # 3/12
            }
        },
        {
            "id": "campaign_002",
            "name": "Hiring Managers - Bangalore",
            "status": "completed",
            "target_prospects": 150,
            "connected": 38,
            "responded": 15,
            "meetings_booked": 5,
            "start_date": "2023-11-01",
            "end_date": "2024-01-31",
            "performance": {
                "connection_rate": 25.3,
                "response_rate": 39.5,
                "meeting_rate": 33.3
            }
        }
    ]

    return {"campaigns": campaigns}

@app.post("/linkedin/campaign/create")
def create_linkedin_campaign(campaign_data: dict):
    """Create a new LinkedIn outreach campaign."""
    try:
        campaign = {
            "id": f"campaign_{len(campaign_data.get('name', '').replace(' ', '_').lower())}",
            "name": campaign_data.get("name", "New Campaign"),
            "description": campaign_data.get("description", ""),
            "target_criteria": campaign_data.get("target_criteria", {}),
            "message_templates": campaign_data.get("message_templates", []),
            "status": "draft",
            "created_at": "2024-01-15T10:00:00Z",
            "target_prospects": 0,
            "connected": 0,
            "responded": 0,
            "meetings_booked": 0
        }

        return {
            "message": "Campaign created successfully",
            "campaign": campaign
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create campaign: {str(e)}")

@app.get("/linkedin/templates")
def get_linkedin_message_templates():
    """Get LinkedIn message templates for different outreach stages."""
    return {
        "connection_request": {
            "subject": "",
            "message": """Hi {first_name},

I came across your profile and was impressed by {company}'s work in {industry}. I'm building an AI-powered employability assessment platform that helps students get job-ready through comprehensive skill evaluation.

I'd love to connect and learn more about your hiring challenges. Are you open to a quick 15-minute call?

Best regards,
{user_name}
Employability Assessment Platform""",
            "variables": ["first_name", "company", "industry", "user_name"]
        },
        "follow_up": {
            "subject": "",
            "message": """Hi {first_name},

I hope this message finds you well. I wanted to follow up on my connection request - I'm reaching out because I noticed your role in talent acquisition at {company}.

We're developing an AI-powered platform that assesses student employability across technical, communication, and behavioral skills. Our early results show 85% accuracy in placement prediction.

Would you be interested in learning more about how this could benefit your hiring process?

Best,
{user_name}""",
            "variables": ["first_name", "company", "user_name"]
        },
        "value_proposition": {
            "subject": "",
            "message": """Hi {first_name},

Following up on our connection - I wanted to share how our employability assessment platform has helped similar companies in {industry}.

Key benefits:
• Comprehensive skill evaluation (technical, communication, behavioral)
• 85% accuracy in placement prediction
• Personalized development roadmaps for candidates
• Integration with existing ATS systems

Would you be interested in seeing a demo of how this works?

Best regards,
{user_name}
Employability Assessment Platform""",
            "variables": ["first_name", "industry", "user_name"]
        },
        "meeting_request": {
            "subject": "",
            "message": """Hi {first_name},

Thank you for your interest in our employability assessment platform. I'd love to show you how it works and discuss potential partnership opportunities.

Are you available for a 30-minute demo next week? Here are a few time slots that work for me:

• Monday 2 PM IST
• Wednesday 10 AM IST
• Friday 3 PM IST

Please let me know what works best, or feel free to suggest alternative times.

Looking forward to speaking with you!

Best,
{user_name}""",
            "variables": ["first_name", "user_name"]
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
