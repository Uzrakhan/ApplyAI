
import traceback

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from groq import APIError, RateLimitError

from resume_parser import extract_text_from_pdf
from llm import (
    analyze_application_with_llm,
    explain_match_with_llm,
    optimize_resume_with_llm,
    generate_cover_letter_with_llm,
)

from job_analyzer import analyze_job
from matcher import analyze_match
from candidate_analyzer import analyze_candidate


app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://apply-ai-ebon.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    job_description: str
    resume_text: str


class JobSearchProfileRequest(BaseModel):
    target_roles: list[str]
    locations: list[str]
    employment_types: list[str]
    work_modes: list[str]
    minimum_salary: int | None = None
    experience_level: str
    skills: list[str]
    excluded_keywords: list[str]


# Shared Groq error handler
def handle_groq_error(error: APIError):
    print("========== GROQ API ERROR ==========")
    print(f"Error type: {type(error).__name__}")
    print(f"Error message: {error}")

    traceback.print_exc()

    if isinstance(error, RateLimitError):
        raise HTTPException(
            status_code=429,
            detail="Groq API rate limit reached. Please try again later."
        )

    status_code = getattr(error, "status_code", None)

    if status_code is not None and status_code >= 500:
        raise HTTPException(
            status_code=503,
            detail="AI service is temporarily unavailable. Please try again."
        )

    raise HTTPException(
        status_code=502,
        detail="Groq API request failed."
    )


@app.get("/")
def home():
    return {"message": "ApplyAI is running"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):

    job = analyze_job(request.job_description)
    candidate = analyze_candidate(request.resume_text)

    match = analyze_match(
        job.required_skills,
        job.preferred_skills,
        candidate.skills
    )

    return {
        "job": job,
        "candidate": candidate,
        "match": match
    }


@app.post("/analyze-pdf")
async def analyze_pdf(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    if resume.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Resume must be a PDF file"
        )

    file_bytes = await resume.read()
    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the PDF"
        )

    stage = "resume and job analysis"

    try:
        print("\n========== STEP 1: GROQ ANALYSIS ==========")

        analysis = analyze_application_with_llm(
            resume_text,
            job_description
        )

        print("STEP 1 COMPLETED")

        job = analysis.job
        candidate = analysis.candidate

        match = analyze_match(
            job.required_skills,
            job.preferred_skills,
            candidate.skills
        )

        print("MATCH CALCULATION COMPLETED")

        stage = "match explanation"

        print("\n========== STEP 2: GROQ EXPLANATION ==========")

        explanation = explain_match_with_llm(
            resume_text,
            job_description,
            match["match_score"]
        )

        print("STEP 2 COMPLETED")

        return {
            "job": job,
            "candidate": candidate,
            "match": match,
            "explanation": explanation
        }

    except APIError as error:
        print(f"Failed stage: {stage}")
        handle_groq_error(error)


@app.post("/optimize-resume")
async def optimize_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    if resume.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Resume must be a PDF file"
        )

    file_bytes = await resume.read()
    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the PDF"
        )

    try:
        optimization = optimize_resume_with_llm(
            resume_text,
            job_description
        )

        print("========== OPTIMIZATION ==========")
        print(optimization)

        return optimization

    except APIError as error:
        handle_groq_error(error)


@app.post("/generate-cover-letter")
async def generate_cover_letter(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    if resume.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Resume must be a PDF file"
        )

    file_bytes = await resume.read()
    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the PDF"
        )

    try:
        cover_letter = generate_cover_letter_with_llm(
            resume_text,
            job_description
        )

        return cover_letter

    except APIError as error:
        handle_groq_error(error)


@app.post("/job-search-profile")
def create_job_search_profile(profile: JobSearchProfileRequest):

    return {
        "message": "Job search profile saved",
        "profile": profile
    }
