from typing import Dict, List

QUESTIONS = [
    {"id": 1, "text": "I am talkative",
     "trait": "extraversion", "reverse": False},
    {"id": 2, "text": "I tend to find fault with others",
     "trait": "agreeableness", "reverse": True},
    {"id": 3, "text": "I do a thorough job",
     "trait": "conscientiousness", "reverse": False},
    {"id": 4, "text": "I get nervous easily",
     "trait": "neuroticism", "reverse": False},
    {"id": 5, "text": "I have an active imagination",
     "trait": "openness", "reverse": False},
    {"id": 6, "text": "I am reserved",
     "trait": "extraversion", "reverse": True},
    {"id": 7, "text": "I am helpful and unselfish",
     "trait": "agreeableness", "reverse": False},
    {"id": 8, "text": "I can be careless",
     "trait": "conscientiousness", "reverse": True},
]

class PsychometricEngine:
    TRAITS = ["extraversion", "agreeableness",
              "conscientiousness", "neuroticism", "openness"]

    def get_questions(self) -> List[Dict]:
        return [{"id": q["id"], "text": q["text"]} for q in QUESTIONS]

    def score_responses(self, responses: Dict[int, int]) -> Dict:
        trait_scores = {t: [] for t in self.TRAITS}
        for q in QUESTIONS:
            qid = q["id"]
            if qid not in responses:
                continue
            score = responses[qid]
            if q["reverse"]:
                score = 6 - score
            trait_scores[q["trait"]].append(score)

        result = {}
        for trait, scores in trait_scores.items():
            if scores:
                avg = sum(scores) / len(scores)
                result[trait] = round(((avg - 1) / 4) * 100, 2)
            else:
                result[trait] = 0.0

        result["behavioral_score"] = round(
            result.get("conscientiousness", 0) * 0.4 +
            result.get("agreeableness", 0) * 0.3 +
            result.get("openness", 0) * 0.3, 2
        )
        return result

if __name__ == "__main__":
    engine = PsychometricEngine()
    print("Psychometric Questions:")
    for q in engine.get_questions():
        print(f"  {q['id']}. {q['text']} (rate 1-5)")
    
    sample_responses = {1: 4, 2: 2, 3: 5, 4: 2, 5: 4, 6: 2, 7: 4, 8: 2}
    scores = engine.score_responses(sample_responses)
    print("\nPersonality Scores:")
    for trait, score in scores.items():
        print(f"  {trait}: {score}")
