from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

# Get database URL from environment or use SQLite as default
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./employability_ai.db")

# Create engine with appropriate settings based on database type
if DATABASE_URL.startswith("postgresql"):
    # PostgreSQL specific settings
    engine = create_engine(
        DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        echo=False
    )
else:
    # SQLite settings
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True)
    name = Column(String)
    email = Column(String, unique=True)
    institution = Column(String)
    degree = Column(String)
    created_at = Column(DateTime, default=datetime.now)

class ScoreCard(Base):
    __tablename__ = "scorecards"
    id = Column(Integer, primary_key=True)
    student_id = Column(String, index=True)
    technical_score = Column(Float, default=0)
    communication_score = Column(Float, default=0)
    behavioral_score = Column(Float, default=0)
    cognitive_score = Column(Float, default=0)
    resume_score = Column(Float, default=0)
    overall_score = Column(Float, default=0)
    placement_probability = Column(Float, default=0)
    suitable_roles = Column(JSON, default=list)
    skill_gaps = Column(JSON, default=list)
    updated_at = Column(DateTime, default=datetime.now)

class AssessmentLog(Base):
    __tablename__ = "assessment_logs"
    id = Column(Integer, primary_key=True)
    student_id = Column(String, index=True)
    test_type = Column(String)
    score = Column(Float)
    raw_result = Column(JSON)
    taken_at = Column(DateTime, default=datetime.now)

class Employer(Base):
    __tablename__ = "employers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_name = Column(String)
    role = Column(String)
    email = Column(String, unique=True, nullable=True)
    linkedin_url = Column(String)
    industry = Column(String, index=True)
    company_size = Column(String)
    priority = Column(String, default="warm")  # hot / warm / cold
    status = Column(String, default="prospect")  # prospect / connected / responded / meeting / partner / closed
    tags = Column(JSON, default=list)
    source = Column(String, default="linkedin")
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

class OutreachLog(Base):
    __tablename__ = "outreach_logs"
    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, index=True)
    step = Column(String)  # connection_request, survey, value_message, follow_up, meeting, partnership
    channel = Column(String, default="linkedin")
    status = Column(String, default="pending")  # pending/sent/replied/done/failed
    log_metadata = Column(JSON, default=dict)
    sent_at = Column(DateTime, default=datetime.now)

class SurveyResponse(Base):
    __tablename__ = "survey_responses"
    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, index=True)
    survey_url = Column(String)
    responses = Column(JSON, default=dict)
    skill_gaps = Column(JSON, default=list)
    interest_level = Column(String, default="warm")
    collected_at = Column(DateTime, default=datetime.now)

class Meeting(Base):
    __tablename__ = "meetings"
    id = Column(Integer, primary_key=True, index=True)
    employer_id = Column(Integer, index=True)
    meeting_link = Column(String)
    scheduled_at = Column(DateTime)
    status = Column(String, default="scheduled")  # scheduled/completed/cancelled
    notes = Column(String)
    created_at = Column(DateTime, default=datetime.now)

def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")
    print("  students table")
    print("  scorecards table")
    print("  assessment_logs table")
    print("  employers table")
    print("  outreach_logs table")
    print("  survey_responses table")
    print("  meetings table")

if __name__ == "__main__":
    create_tables()


