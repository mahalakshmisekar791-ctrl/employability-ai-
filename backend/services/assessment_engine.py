import random
from typing import List, Dict
from datetime import datetime

QUESTION_BANK = {
    "python": [
        {"id": "py_001", "question": "What is output of list(range(3))?",
         "options": ["[1,2,3]", "[0,1,2]", "[0,1,2,3]", "Error"],
         "answer": "[0,1,2]", "difficulty": "easy"},
        {"id": "py_002", "question": "Which keyword defines a function?",
         "options": ["func", "def", "define", "function"],
         "answer": "def", "difficulty": "easy"},
        {"id": "py_003", "question": "What does len('hello') return?",
         "options": ["4", "5", "6", "Error"],
         "answer": "5", "difficulty": "easy"},
    ],
    "sql": [
        {"id": "sql_001", "question": "Which filters rows AFTER grouping?",
         "options": ["WHERE", "HAVING", "FILTER", "ORDER BY"],
         "answer": "HAVING", "difficulty": "medium"},
        {"id": "sql_002", "question": "Which command retrieves data?",
         "options": ["GET", "FETCH", "SELECT", "RETRIEVE"],
         "answer": "SELECT", "difficulty": "easy"},
    ]
}

class MCQAssessment:
    def generate_test(self, topic: str, num_questions: int = 3) -> List[Dict]:
        questions = QUESTION_BANK.get(topic, [])
        selected = random.sample(questions, min(num_questions, len(questions)))
        return [{k: v for k, v in q.items() if k != "answer"} for q in selected]

    def evaluate_test(self, student_id: str, topic: str,
                      responses: Dict[str, str]) -> Dict:
        questions = QUESTION_BANK.get(topic, [])
        q_map = {q["id"]: q["answer"] for q in questions}
        correct = sum(1 for qid, ans in responses.items()
                      if q_map.get(qid) == ans)
        score = (correct / len(responses)) * 100 if responses else 0
        return {
            "student_id": student_id,
            "topic": topic,
            "score": round(score, 2),
            "correct": correct,
            "total": len(responses)
        }

if __name__ == "__main__":
    engine = MCQAssessment()
    test = engine.generate_test("python")
    print("Generated Test:")
    for q in test:
        print(f"  Q: {q['question']}")
    print("\nEvaluating answers...")
    result = engine.evaluate_test("STU001", "python",
                                   {"py_001": "[0,1,2]", "py_002": "def"})
    print(f"Score: {result['score']}%")
    print(f"Correct: {result['correct']}/{result['total']}")
