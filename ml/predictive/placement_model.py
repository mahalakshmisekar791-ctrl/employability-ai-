import random
from typing import Dict, List

class PlacementPredictor:
    def identify_skill_gaps(self, scores: Dict) -> List[str]:
        gaps = []
        thresholds = {
            "technical_score": (60, "Technical Skills / Coding"),
            "communication_score": (65, "Business Communication"),
            "resume_score": (60, "Resume Quality"),
            "cognitive_score": (55, "Logical Reasoning"),
            "behavioral_score": (60, "Behavioral Skills"),
        }
        for key, (threshold, label) in thresholds.items():
            if scores.get(key, 0) < threshold:
                gaps.append(label)
        return gaps

    def predict_placement(self, scores: Dict) -> Dict:
        technical = scores.get("technical_score", 0)
        communication = scores.get("communication_score", 0)
        behavioral = scores.get("behavioral_score", 0)
        cognitive = scores.get("cognitive_score", 0)
        resume = scores.get("resume_score", 0)
        cgpa = scores.get("cgpa", 0)

        weighted = (
            technical * 0.30 +
            communication * 0.20 +
            behavioral * 0.20 +
            cognitive * 0.15 +
            resume * 0.15
        )

        cgpa_bonus = (cgpa / 10) * 10
        placement_prob = min(weighted * 0.85 + cgpa_bonus, 100)

        overall_score = round(weighted, 2)
        placement_prob = round(placement_prob, 2)

        if placement_prob >= 75:
            category = "High Placement Chance"
        elif placement_prob >= 50:
            category = "Moderate Placement Chance"
        else:
            category = "Needs Improvement"

        roles = self.recommend_roles(scores)
        gaps = self.identify_skill_gaps(scores)

        return {
            "overall_employability_score": overall_score,
            "placement_probability": placement_prob,
            "category": category,
            "recommended_roles": roles,
            "skill_gaps": gaps
        }

    def recommend_roles(self, scores: Dict) -> List[str]:
        technical = scores.get("technical_score", 0)
        communication = scores.get("communication_score", 0)
        roles = []
        if technical >= 70:
            roles.append("Software Engineer")
            roles.append("Data Analyst")
        if technical >= 60:
            roles.append("QA Engineer")
        if communication >= 70:
            roles.append("Business Analyst")
        if technical >= 50 and communication >= 50:
            roles.append("Technical Support Engineer")
        if not roles:
            roles.append("Junior Developer")
        return roles[:3]

if __name__ == "__main__":
    predictor = PlacementPredictor()

    student_scores = {
        "technical_score": 80,
        "communication_score": 65,
        "behavioral_score": 70,
        "cognitive_score": 68,
        "resume_score": 65,
        "cgpa": 7.8
    }

    result = predictor.predict_placement(student_scores)

    print("=" * 40)
    print("   STUDENT SCORECARD")
    print("=" * 40)
    print(f"Overall Employability Score: {result['overall_employability_score']}/100")
    print(f"Placement Probability: {result['placement_probability']}%")
    print(f"Category: {result['category']}")
    print(f"Recommended Roles: {result['recommended_roles']}")
    print(f"Skill Gaps: {result['skill_gaps']}")
    print("=" * 40)
