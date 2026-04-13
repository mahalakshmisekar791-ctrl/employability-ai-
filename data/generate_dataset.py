import csv
import random

def generate_dataset(num_students=200):
    students = []
    
    for i in range(1, num_students + 1):
        technical = round(random.uniform(30, 100), 1)
        communication = round(random.uniform(30, 100), 1)
        behavioral = round(random.uniform(30, 100), 1)
        cognitive = round(random.uniform(30, 100), 1)
        resume = round(random.uniform(30, 100), 1)
        cgpa = round(random.uniform(5.0, 10.0), 1)

        overall = (
            technical * 0.30 +
            communication * 0.20 +
            behavioral * 0.20 +
            cognitive * 0.15 +
            resume * 0.15
        )

        if overall >= 70 and cgpa >= 7.0:
            placed = 1
        elif overall >= 55 and cgpa >= 6.0:
            placed = 1 if random.random() > 0.4 else 0
        else:
            placed = 0

        if placed == 1:
            if technical >= 70:
                role = random.choice(["Software Engineer", "Data Analyst"])
            elif communication >= 70:
                role = "Business Analyst"
            else:
                role = "QA Engineer"
        else:
            role = "Not Placed"

        students.append({
            "student_id": f"STU{i:03d}",
            "name": f"Student_{i}",
            "cgpa": cgpa,
            "technical_score": technical,
            "communication_score": communication,
            "behavioral_score": behavioral,
            "cognitive_score": cognitive,
            "resume_score": resume,
            "overall_score": round(overall, 1),
            "is_placed": placed,
            "role": role
        })

    return students

def save_to_csv(students, filename="data/students.csv"):
    fieldnames = students[0].keys()
    with open(filename, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(students)
    print(f"Saved {len(students)} student records to {filename}")

def show_summary(students):
    placed = sum(1 for s in students if s["is_placed"] == 1)
    print("\nDataset Summary:")
    print(f"  Total Students : {len(students)}")
    print(f"  Placed         : {placed}")
    print(f"  Not Placed     : {len(students) - placed}")
    print(f"  Placement Rate : {round(placed/len(students)*100, 1)}%")
    print("\nSample Record:")
    s = students[0]
    for k, v in s.items():
        print(f"  {k}: {v}")

if __name__ == "__main__":
    print("Generating student dataset...")
    students = generate_dataset(200)
    save_to_csv(students)
    show_summary(students)
