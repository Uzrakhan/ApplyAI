from skill_normalizer import normalize_skill_list
from scoring import calculate_weighted_score

def find_matches(job_skills, candidate_skills):
    matches = []

    for skill in job_skills:
        if skill in candidate_skills:
            matches.append(skill)


    return matches

def missing_skills(job_skills,candidate_skills):
    missing = []

    for skill in job_skills:
        if skill not in candidate_skills:
            missing.append(skill)

    return missing







def analyze_match(required_skills,
    preferred_skills,candidate_skills):

    required_skills = normalize_skill_list(required_skills)
    preferred_skills = normalize_skill_list(preferred_skills)
    candidate_skills = normalize_skill_list(candidate_skills)

    matches = find_matches(required_skills,candidate_skills)
    missing = missing_skills(required_skills,candidate_skills)
    score = calculate_weighted_score(required_skills, preferred_skills, candidate_skills)

    return {
        "matching_skills": matches,
        "missing_skills": missing,
        "required_skills": len(required_skills),
        "preferred_skills": len(preferred_skills),
        "match_score": round(score, 2)
    }

