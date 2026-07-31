import os

from google import genai
from models import JobAnalysis, CandidateAnalysis, FullAnalysis
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=api_key)


def ask_llm(prompt):
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text


def analyze_job_with_llm(job_description):
    prompt = f"""
    Analyze the following job description.

    Extract only information supported by the job description.
    If experience or location is not specified, use "Not specified".

    Job Description:
    {job_description}
    """

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": JobAnalysis
        }
    )

    return JobAnalysis.model_validate_json(response.text)


def analyze_candidate_with_llm(resume_text):
    prompt = f"""
    Analyze the following candidate resume.

    Extract only information supported by the resume.

    Extract:
    - Technical skills
    - Work and internship experience
    - Projects
    - Education

    Do not invent skills or experience that are not explicitly supported by the resume.

    Resume:
    {resume_text}
    """


    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": CandidateAnalysis
        }
    )


    return CandidateAnalysis.model_validate_json(response.text)


def analyze_application_with_llm(resume_text, job_description):
    prompt = f"""
    Analyze this candidate resume and job description.

    Extract the job information:
    - role
    - required technical skills
    - required experience
    - responsibilities
    - location

    Extract the candidate information:
    - technical skills
    - experience
    - projects
    - education

    Only use information supported by the provided text.
    Do not invent candidate skills or experience.

    RESUME:
    {resume_text}

    JOB DESCRIPTION:
    {job_description}
    """

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": FullAnalysis,
        },
    )

    return FullAnalysis.model_validate_json(response.text)