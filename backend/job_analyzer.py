from llm import analyze_job_with_llm

skills = [
    "python",
    "fastapi",
    "react",
    "typescript",
    "postgresql",
    "docker"
]


def analyze_job(job_description):
    return analyze_job_with_llm(job_description)

