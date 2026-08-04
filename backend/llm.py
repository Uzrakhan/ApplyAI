import os

from google import genai
from models import JobAnalysis, CandidateAnalysis, FullAnalysis, MatchExplanation, ResumeOptimization, CoverLetter
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

    Extract only information explicitly supported by the job description.

    Extract:

    - Job role
    - Required technical skills
    - Preferred technical skills
    - Required experience
    - Responsibilities
    - Location

    Rules:

    - If the job description clearly separates required and preferred skills,
    return them in their respective fields.

    - If the job description does NOT distinguish between them,
    place every skill into required_skills and return an empty preferred_skills list.

    - If experience or location is not specified,
    return "Not specified".

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
    - preferred technical skills
    - required experience
    - responsibilities
    - location

    Rules:

    - If the JD explicitly marks skills as preferred,
    place them in preferred_skills.

    - Otherwise put all skills into required_skills.

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


def explain_match_with_llm(
        resume_text,
        job_description,
        match_score
):
    prompt = f"""
    You are an AI career coach.

    A candidate applied for a job.

    Resume:
    {resume_text}

    Job Description:
    {job_description}

    Match Score:
    {match_score}%  

    Explain the result.

    Return:

    - summary
    - strengths
    - weaknesses
    - recommendations

    Rules:

    Use only evidence supported by the resume and job description.

    Do not invent experience.

    Recommendations must be practical.
    """

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": MatchExplanation
        }
    )
    

    return MatchExplanation.model_validate_json(
        response.text
    )


def optimize_resume_with_llm(
        resume_text,
        job_description
):
    prompt = f"""
    You are an expert technical recruiter and resume writer.

    You are given:

    1. Candidate Resume
    2. Job Description

    Your task is to improve the resume for THIS specific job.

    Rules:

    - Do not invent projects.
    - Do not invent experience.
    - Do not invent technologies.

    You may:

    - Rewrite resume bullets
    - Highlight stronger achievements
    - Improve ATS keywords
    - Suggest better wording

    Return JSON.

    Resume:
    {resume_text}

    Job Description:
    {job_description}
    """

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": ResumeOptimization,
        },
    )

    return ResumeOptimization.model_validate_json(
        response.text
    )


def generate_cover_letter_with_llm(
    resume_text,
    job_description
):
    prompt = f"""
    You are an expert technical recruiter and professional resume writer.

    Write a modern, professional cover letter that is tailored specifically to this job.

    Focus on:

    - Why the candidate is a good fit.
    - Relevant technical skills.
    - Relevant projects.
    - Relevant experience.

    Keep the writing concise.

    Avoid generic phrases like:

    "I am writing to express my interest..."

    Avoid exaggerated claims.

    Sound natural and confident.

    Do not fabricate any information.

    Write in a tone suitable for a software engineer applying to a modern technology company.

    You are given:

    1. Candidate Resume
    2. Job Description

    Rules:

    - Use ONLY information supported by the resume.
    - Do NOT invent projects.
    - Do NOT invent skills.
    - Do NOT invent experience.
    - Mention projects only if they exist in the resume.
    - Mention skills only if they exist in the resume.
    - Tailor the letter naturally to the job description.
    - Keep the tone professional and concise.

    Return JSON with exactly these fields:

    subject
    greeting
    introduction
    body_paragraphs
    closing
    candidate_name

    Resume:
    {resume_text}

    Job Description:
    {job_description}
    """

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": CoverLetter,
        },
    )

    return CoverLetter.model_validate_json(response.text)