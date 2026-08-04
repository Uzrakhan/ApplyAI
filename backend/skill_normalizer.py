SKILL_ALIASES = {

    "react.js": "react",
    "reactjs": "react",

    "nodejs": "node.js",
    "node": "node.js",

    "postgres": "postgresql",

    "fast api": "fastapi",

    "js": "javascript",

    "ts": "typescript",

}



def normalize_skill(skill):
    skill = skill.lower().strip()

    return SKILL_ALIASES.get(skill, skill)


def normalize_skill_list(skills):
    normalized = []

    for skill in skills:
        normalized.append(
            normalize_skill(skill)
        )

    return normalized


