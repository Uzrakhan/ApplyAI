skills = ["React", "Python", "FastAPI", "Docker"]

def show_skills(skills):
    print("Required skills: ")

    for skill in skills:
        print(f"-{skill}")

def count_skills(skills):
    return len(skills)

total = count_skills(skills)

show_skills(skills)
print(total)










