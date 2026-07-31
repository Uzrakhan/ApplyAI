from job_analyzer import analyze_job
from matcher import analyze_match
print("ApplyAI - Job Intelligence Agent")


job_description = input("\nPaste the job description: ")

result = analyze_job(job_description)


candidate_skills = [
    "React",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "Python",
    "MongoDB",
    "PostgreSQL"
]


match_result = analyze_match(
    result.skills,
    candidate_skills
)

print("\nAnalysis: ")
print("\nJob Role:")
print(result.role)


print("\nSkills:")
for skill in result.skills:
    print(f"-{skill}")



print("\n--- Match Analysis ---")

print(f"Match Score: {match_result['match_score']:.0f}%")

print("\nMatching Skills: ")
for skill in match_result["matching_skills"]:
    print(f"-{skill}")


print("\nMissing Skills: ")
for skill in match_result["missing_skills"]:
    print(f"-{skill}")

print("\nExperience:")
print(result.experience)

print("\nResponsibilities:")
for responsibility in result.responsibilities:
    print(f"-{responsibility}")

print("\nLocation:")
print(result.location)


