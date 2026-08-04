REQUIRED_WEIGHT = 10
PREFERRED_WEIGHT = 3


def calculate_weighted_score(
        required_skills,
        preffered_skills,
        candidate_skills
):
    earned_points = 0

    possible_points = (
        (len(required_skills) * REQUIRED_WEIGHT)
        + (len(preffered_skills) * PREFERRED_WEIGHT)
    )


    for skill in required_skills:
        if skill in candidate_skills:
            earned_points += REQUIRED_WEIGHT


    for skill in preffered_skills:
        if skill in candidate_skills:
            earned_points += PREFERRED_WEIGHT


    score = earned_points / possible_points * 100

    return score

