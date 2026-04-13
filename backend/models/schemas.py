from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class SkillScore(BaseModel):
    technical_skills: float
    cognitive_ability: float
    communication: float
    behavioral_skills: float
    job_readiness: float

class StudentProfile(BaseModel):
    student_id: str
    name: str
    email: str
    institution: str
    degree: str
    graduation_year: int
    resume_text: Optional[str] = None
    scores: Optional[SkillScore] = None
    overall_score: Optional[float] = None
    placement_probability: Optional[float] = None
    suitable_roles: Optional[List[str]] = []
    skill_gaps: Optional[List[str]] = []
    created_at: datetime = datetime.now()

class AssessmentResult(BaseModel):
    student_id: str
    test_type: str
    score: float
    time_taken: int
    answers: dict
    evaluated_at: datetime = datetime.now()

class EmployerBase(BaseModel):
    name: str
    contact_name: Optional[str] = None
    role: Optional[str] = None
    email: Optional[str] = None
    linkedin_url: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    priority: str = "warm"
    status: str = "prospect"
    tags: List[str] = Field(default_factory=list)
    source: str = "linkedin"

class EmployerCreate(EmployerBase):
    pass

class EmployerUpdate(BaseModel):
    priority: Optional[str] = None
    status: Optional[str] = None
    tags: Optional[List[str]] = None

class EmployerResponse(EmployerBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class OutreachLogCreate(BaseModel):
    employer_id: int
    step: str
    channel: str = "linkedin"
    status: str = "pending"
    log_metadata: Dict = Field(default_factory=dict)

class SurveyResponseCreate(BaseModel):
    employer_id: int
    survey_url: Optional[str] = None
    responses: Dict = Field(default_factory=dict)
    skill_gaps: List[str] = Field(default_factory=list)
    interest_level: str = "warm"

class MeetingCreate(BaseModel):
    employer_id: int
    meeting_link: Optional[str] = None
    scheduled_at: datetime
    status: str = "scheduled"
    notes: Optional[str] = None
