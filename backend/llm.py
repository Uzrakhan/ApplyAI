
import os

from groq import Groq
from dotenv import load_dotenv
import json

from models import (
    JobAnalysis,
    CandidateAnalysis,
    FullAnalysis,
    MatchExplanation,
    ResumeOptimization,
    CoverLetter,
)

load_dotenv()

# -----------------------------
# GROQ CONFIGURATION
# -----------------------------

api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("GROQ_API_KEY is not configured")

client = Groq(api_key=api_key)

MODEL = "openai/gpt-oss-120b"


# -----------------------------
# CORE LLM FUNCTIONS
# -----------------------------

def ask_llm(prompt):
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content



def generate_structured_response(prompt, response_model):
    schema = response_model.model_json_schema()

    system_prompt = f"""
You are a structured data extraction assistant.

You MUST return a valid JSON object that follows the provided schema exactly.

Rules:
- Use exactly the field names defined in the schema.
- Do not rename, omit, or add fields.
- Follow the required data types.
- Fields defined as arrays must always be JSON arrays.
- Do not return objects where arrays of strings are expected.
- Do not return explanatory text outside the JSON object.
- If information is unavailable, use an empty string for string fields
  and an empty array for list fields.
- Never invent information.

Required JSON schema:
{json.dumps(schema, indent=2)}
"""

    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.1
    )

    content = response.choices[0].message.content

    if not content:
        raise ValueError("Groq returned an empty response")

    print(f"Groq raw response for {response_model.__name__}:")
    print(content)

    return response_model.model_validate_json(content)
    


# -----------------------------
# JOB ANALYSIS
# -----------------------------

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

    return generate_structured_response(prompt, JobAnalysis)


# -----------------------------
# CANDIDATE ANALYSIS
# -----------------------------

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

    return generate_structured_response(prompt, CandidateAnalysis)


# -----------------------------
# COMPLETE APPLICATION ANALYSIS
# -----------------------------

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

    return generate_structured_response(prompt, FullAnalysis)


# -----------------------------
# MATCH EXPLANATION
# -----------------------------

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

    return generate_structured_response(prompt, MatchExplanation)


# -----------------------------
# RESUME OPTIMIZATION
# -----------------------------

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

    return generate_structured_response(prompt, ResumeOptimization)


# -----------------------------
# COVER LETTER GENERATION
# -----------------------------

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

    return generate_structured_response(prompt, CoverLetter)
