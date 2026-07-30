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



def calculate_match_score(job_skills,candidate_skills):
    if len(job_skills) == 0:
        return 0
    
    matches = find_matches(job_skills,candidate_skills)

    score = (len(matches) / len(job_skills)) * 100

    return score



def analyze_match(job_skills,candidate_skills):
    matches = find_matches(job_skills,candidate_skills)
    missing = missing_skills(job_skills,candidate_skills)
    score = calculate_match_score(job_skills, candidate_skills)

    return {
        "matching_skills": matches,
        "missing_skills": missing,
        "total_required_skills": len(job_skills),
        "match_score": score
    }

