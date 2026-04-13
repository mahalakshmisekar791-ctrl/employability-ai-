import re
from typing import Dict, List

SKILL_KEYWORDS = {
    "python": ["python", "django", "flask", "fastapi"],
    "data": ["pandas", "numpy", "sql", "tableau", "excel"],
    "ml": ["machine learning", "scikit-learn", "tensorflow", "pytorch"],
    "soft": ["leadership", "communication", "teamwork", "problem solving"]
}

JOB_ROLES = {
    "Data Analyst": ["sql", "excel", "pandas", "tableau", "python"],
    "Software Engineer": ["python", "django", "flask", "algorithms"],
    "Business Analyst": ["communication", "excel", "sql", "reporting"]
}

class ResumeScorer:
    def extract_skills(self, resume_text: str) -> List[str]:
        text_lower = resume_text.lower()
        found = []
        for category, keywords in SKILL_KEYWORDS.items():
            for kw in keywords:
                if kw in text_lower:
                    found.append(kw)
        return list(set(found))

    def recommend_roles(self, skills: List[str]) -> List[str]:
        role_scores = {}
        for role, required in JOB_ROLES.items():
            matches = sum(1 for s in skills if s in required)
            role_scores[role] = matches
        sorted_roles = sorted(role_scores, key=role_scores.get, reverse=True)
        return [r for r in sorted_roles if role_scores[r] > 0]

    def score_resume(self, resume_text: str) -> Dict:
        skills = self.extract_skills(resume_text)
        base_score = min(len(skills) * 10, 100)
        word_count = len(resume_text.split())
        length_bonus = 10 if word_count > 100 else 0
        total = min(base_score + length_bonus, 100)
        roles = self.recommend_roles(skills)

        return {
            "resume_score": round(total, 2),
            "skills_found": skills,
            "skills_count": len(skills),
            "recommended_roles": roles,
            "word_count": word_count
        }

if __name__ == "__main__":
    sample_resume = """
    I am a computer science graduate with strong Python programming skills.
    I have experience with pandas, numpy, and SQL for data analysis.
    I have worked on machine learning projects using scikit-learn.
    I have good communication and teamwork skills.
    I am proficient in Excel and Tableau for reporting.
    """
    scorer = ResumeScorer()
    result = scorer.score_resume(sample_resume)
    print("Resume Analysis Results:")
    print(f"  Score: {result['resume_score']}/100")
    print(f"  Skills Found: {result['skills_found']}")
    print(f"  Recommended Roles: {result['recommended_roles']}")
    print(f"  Word Count: {result['word_count']}")
