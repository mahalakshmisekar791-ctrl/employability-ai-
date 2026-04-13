import re
from typing import Dict

FILLER_WORDS = ["um", "uh", "like", "you know", 
                "basically", "literally", "actually"]

GOOD_CONNECTORS = ["therefore", "however", "furthermore",
                   "consequently", "additionally", "moreover"]

class CommunicationEvaluator:
    def evaluate(self, text: str) -> Dict:
        words = text.lower().split()
        total_words = len(words)
        
        if total_words == 0:
            return {"error": "Empty text"}

        sentences = [s.strip() for s in re.split(r'[.!?]', text) if s.strip()]
        num_sentences = len(sentences)
        avg_sentence_len = total_words / num_sentences if num_sentences > 0 else 0

        unique_words = set(words)
        vocab_richness = len(unique_words) / total_words if total_words > 0 else 0

        filler_count = sum(text.lower().count(fw) for fw in FILLER_WORDS)

        connector_count = sum(text.lower().count(gc) for gc in GOOD_CONNECTORS)

        has_intro = any(w in text.lower() for w in ["i am", "my name", "i have"])
        has_experience = any(w in text.lower() for w in ["experience", "worked", "skills"])
        has_goal = any(w in text.lower() for w in ["goal", "aim", "want", "aspire"])

        vocab_score = min(vocab_richness * 100, 30)
        structure_score = 25 if (has_intro and has_experience) else 10
        connector_score = min(connector_count * 5, 20)
        filler_penalty = min(filler_count * 5, 25)
        goal_bonus = 10 if has_goal else 0
        length_score = 15 if total_words > 50 else 5

        total = max(vocab_score + structure_score + connector_score
                    - filler_penalty + goal_bonus + length_score, 0)
        total = min(total, 100)

        return {
            "communication_score": round(total, 2),
            "vocabulary_richness": round(vocab_richness * 100, 2),
            "avg_sentence_length": round(avg_sentence_len, 1),
            "filler_words_found": filler_count,
            "good_connectors_used": connector_count,
            "total_words": total_words,
            "num_sentences": num_sentences
        }

if __name__ == "__main__":
    evaluator = CommunicationEvaluator()

    sample_text = """
    I am a final year computer science student with strong programming skills.
    I have experience in Python and data analysis projects.
    Furthermore, I have worked on machine learning models.
    My goal is to become a data scientist and solve real world problems.
    Additionally, I have good teamwork and communication skills.
    """

    result = evaluator.evaluate(sample_text)
    print("Communication Evaluation:")
    print(f"  Score: {result['communication_score']}/100")
    print(f"  Vocabulary Richness: {result['vocabulary_richness']}%")
    print(f"  Avg Sentence Length: {result['avg_sentence_length']} words")
    print(f"  Filler Words: {result['filler_words_found']}")
    print(f"  Good Connectors Used: {result['good_connectors_used']}")
