from datetime import datetime

from backend.models.database import SessionLocal, create_tables
from backend.services.outreach import OutreachService

def populate_sample_data():
    # Create tables
    create_tables()

    service = OutreachService()

    # Sample employers
    sample_employers = [
        {
            "name": "TechCorp Solutions",
            "contact_name": "Sarah Johnson",
            "role": "CHRO",
            "email": "sarah.johnson@techcorp.com",
            "linkedin_url": "https://linkedin.com/in/sarahjohnson",
            "industry": "IT Services",
            "company_size": "500-1000",
            "priority": "hot",
            "status": "prospect",
            "tags": ["IT Services", "CHRO", "High Priority"]
        },
        {
            "name": "InnovateLabs",
            "contact_name": "Michael Chen",
            "role": "Head of Talent Acquisition",
            "email": "michael.chen@innovatelabs.com",
            "linkedin_url": "https://linkedin.com/in/michaelchen",
            "industry": "Product Company",
            "company_size": "200-500",
            "priority": "warm",
            "status": "connected",
            "tags": ["Product Company", "Talent Acquisition", "Startup"]
        },
        {
            "name": "GlobalTech Systems",
            "contact_name": "Emily Rodriguez",
            "role": "HR Director",
            "email": "emily.rodriguez@globaltech.com",
            "linkedin_url": "https://linkedin.com/in/emilyrodriguez",
            "industry": "GCC",
            "company_size": "1000+",
            "priority": "warm",
            "status": "responded",
            "tags": ["GCC", "HR Director", "Enterprise"]
        },
        {
            "name": "StartupXYZ",
            "contact_name": "David Kim",
            "role": "VP of Engineering",
            "email": "david.kim@startupxyz.com",
            "linkedin_url": "https://linkedin.com/in/davidkim",
            "industry": "Startup",
            "company_size": "50-200",
            "priority": "cold",
            "status": "prospect",
            "tags": ["Startup", "Engineering", "Low Priority"]
        },
        {
            "name": "DataFlow Inc",
            "contact_name": "Lisa Wang",
            "role": "Chief People Officer",
            "email": "lisa.wang@dataflow.com",
            "linkedin_url": "https://linkedin.com/in/lisawang",
            "industry": "IT Services",
            "company_size": "200-500",
            "priority": "hot",
            "status": "meeting",
            "tags": ["IT Services", "CPO", "Meeting Scheduled"]
        }
    ]

    print("Adding sample employers...")
    for employer_data in sample_employers:
        employer = service.create_employer(employer_data)
        print(f"Added: {employer.name} - {employer.contact_name}")

    # Sample outreach logs
    sample_logs = [
        {
            "employer_id": 2,
            "step": "connection_request",
            "channel": "linkedin",
            "status": "sent",
            "log_metadata": {"message": "Hi Michael, I'd love to connect and discuss talent acquisition strategies."}
        },
        {
            "employer_id": 3,
            "step": "survey",
            "channel": "linkedin",
            "status": "sent",
            "log_metadata": {"survey_url": "https://forms.gle/employer-survey"}
        },
        {
            "employer_id": 5,
            "step": "meeting",
            "channel": "calendly",
            "status": "scheduled",
            "log_metadata": {"meeting_link": "https://calendly.com/demo"}
        }
    ]

    print("Adding sample outreach logs...")
    for log_data in sample_logs:
        log = service.log_outreach(log_data)
        print(f"Added log: {log.step} for employer {log.employer_id}")

    # Sample survey responses
    sample_surveys = [
        {
            "employer_id": 3,
            "survey_url": "https://forms.gle/employer-survey",
            "responses": {
                "hiring_challenges": "Finding skilled developers",
                "current_process": "Campus recruitment + referrals",
                "pain_points": "Assessment quality, time-to-hire"
            },
            "skill_gaps": ["Technical assessment", "Soft skills evaluation"],
            "interest_level": "hot"
        }
    ]

    print("Adding sample survey responses...")
    for survey_data in sample_surveys:
        survey = service.record_survey(survey_data)
        print(f"Added survey response for employer {survey.employer_id}")

    # Sample meetings
    sample_meetings = [
        {
            "employer_id": 5,
            "meeting_link": "https://calendly.com/demo",
            "scheduled_at": datetime(2024, 12, 15, 14, 0, 0),
            "status": "scheduled",
            "notes": "Demo of employability assessment platform"
        }
    ]

    print("Adding sample meetings...")
    for meeting_data in sample_meetings:
        meeting = service.schedule_meeting(meeting_data)
        print(f"Added meeting for employer {meeting.employer_id}")

    print("Sample data populated successfully!")

if __name__ == "__main__":
    populate_sample_data()