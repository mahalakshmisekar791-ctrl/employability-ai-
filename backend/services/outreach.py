from datetime import datetime
from typing import Dict, List, Optional

from sqlalchemy import func

from backend.models.database import (
    SessionLocal,
    Employer,
    OutreachLog,
    SurveyResponse,
    Meeting,
)


def _get_session():
    return SessionLocal()


class OutreachService:
    """Encapsulates LinkedIn → CRM → survey → analytics data flow."""

    def create_employer(self, payload: Dict) -> Employer:
        with _get_session() as db:
            employer = Employer(**payload)
            db.add(employer)
            db.commit()
            db.refresh(employer)
            return employer

    def list_employers(
        self,
        status: Optional[str] = None,
        industry: Optional[str] = None,
        limit: int = 50,
    ) -> List[Employer]:
        with _get_session() as db:
            query = db.query(Employer).order_by(Employer.created_at.desc())
            if status:
                query = query.filter(Employer.status == status)
            if industry:
                query = query.filter(Employer.industry == industry)
            return query.limit(limit).all()

    def update_employer(self, employer_id: int, updates: Dict) -> Optional[Employer]:
        with _get_session() as db:
            employer = db.query(Employer).filter(Employer.id == employer_id).first()
            if not employer:
                return None
            for key, value in updates.items():
                if value is not None:
                    setattr(employer, key, value)
            employer.updated_at = datetime.now()
            db.commit()
            db.refresh(employer)
            return employer

    def log_outreach(self, payload: Dict) -> OutreachLog:
        with _get_session() as db:
            log = OutreachLog(**payload)
            db.add(log)
            db.commit()
            db.refresh(log)
            return log

    def record_survey(self, payload: Dict) -> SurveyResponse:
        with _get_session() as db:
            survey = SurveyResponse(**payload)
            db.add(survey)
            db.commit()
            db.refresh(survey)
            return survey

    def schedule_meeting(self, payload: Dict) -> Meeting:
        with _get_session() as db:
            meeting = Meeting(**payload)
            db.add(meeting)
            db.commit()
            db.refresh(meeting)
            return meeting

    def metrics(self) -> Dict[str, int]:
        """Aggregate funnel-style counts for quick dashboards."""
        with _get_session() as db:
            status_counts = dict(
                db.query(Employer.status, func.count(Employer.id))
                .group_by(Employer.status)
                .all()
            )
            interest_counts = dict(
                db.query(SurveyResponse.interest_level, func.count(SurveyResponse.id))
                .group_by(SurveyResponse.interest_level)
                .all()
            )
            meetings = db.query(func.count(Meeting.id)).scalar() or 0
            return {
                "by_status": status_counts,
                "by_interest": interest_counts,
                "meetings": meetings,
            }
