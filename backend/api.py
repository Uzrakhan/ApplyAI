
import traceback
from fastapi import FastAPI,UploadFile, File, Form, HTTPException
from resume_parser import extract_text_from_pdf
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google.genai.errors import ClientError, ServerError
from llm import analyze_application_with_llm,explain_match_with_llm,optimize_resume_with_llm,generate_cover_letter_with_llm


#for cors


from job_analyzer import analyze_job
from matcher import analyze_match
from candidate_analyzer import analyze_candidate


app = FastAPI()




#for cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://apply-ai-ebon.vercel.app",
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
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
    # Validate PDF
    if resume.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Resume must be a PDF file"
        )

    # Read PDF
    file_bytes = await resume.read()

    # Extract resume text
    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the PDF"
        )

    stage = "resume and job analysis"

    try:
        # STEP 1: Analyze resume and job description
        print("\n========== STEP 1: CALLING GEMINI ==========")

        analysis = analyze_application_with_llm(
            resume_text,
            job_description
        )

        print("STEP 1 COMPLETED: Resume analysis successful")

        job = analysis.job
        candidate = analysis.candidate

        print("\n========== JOB ==========")
        print(job)

        print("\n========== CANDIDATE ==========")
        print(candidate)

        # STEP 2: Calculate match using Python
        print("\n========== CALCULATING MATCH ==========")

        match = analyze_match(
            job.required_skills,
            job.preferred_skills,
            candidate.skills
        )

        print("MATCH CALCULATION COMPLETED")

        # STEP 3: Generate match explanation
        stage = "match explanation"

        print("\n========== STEP 2: CALLING GEMINI FOR EXPLANATION ==========")

        explanation = explain_match_with_llm(
            resume_text,
            job_description,
            match["match_score"]
        )

        print("STEP 2 COMPLETED: Match explanation successful")

        # Return response
        return {
            "job": job,
            "candidate": candidate,
            "match": match,
            "explanation": explanation
        }

    except ServerError as error:

        print("\n========== GEMINI SERVER ERROR ==========")
        print(f"Failed stage: {stage}")
        print(f"Error type: {type(error).__name__}")
        print(f"Error message: {error}")
        print(f"Status code: {getattr(error, 'status_code', None)}")

        traceback.print_exc()

        raise HTTPException(
            status_code=503,
            detail=f"Gemini service failed during {stage}."
        )

    except ClientError as error:

        print("\n========== GEMINI CLIENT ERROR ==========")
        print(f"Failed stage: {stage}")
        print(f"Error type: {type(error).__name__}")
        print(f"Error message: {error}")
        print(f"Status code: {getattr(error, 'status_code', None)}")

        traceback.print_exc()

        status_code = getattr(error, "status_code", None)

        if status_code == 429:
            raise HTTPException(
                status_code=429,
                detail="Gemini API quota reached. Please try again later."
            )

        raise HTTPException(
            status_code=502,
            detail="Gemini API request failed."
        )

@app.post("/optimize-resume")
async def optimize_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    # Make sure the uploaded file is a PDF
    if resume.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Resume must be a PDF file"
        )

    # Read PDF
    file_bytes = await resume.read()

    # Extract resume text
    resume_text = extract_text_from_pdf(file_bytes)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the PDF"
        )

    try:
        # ONE Gemini request analyzes both resume + JD
        optimization = optimize_resume_with_llm(
            resume_text,
            job_description
        )

        print("========== OPTIMIZATION ==========")
        print(optimization)
        print(type(optimization))


        return optimization
        

    except ServerError:
        raise HTTPException(
            status_code=503,
            detail="AI service is temporarily unavailable. Please try again shortly."
        )

    except ClientError as error:
        status_code = getattr(error, "status_code", None)

        if status_code == 429:
            raise HTTPException(
                status_code=429,
                detail="Gemini API quota reached. Please try again later."
            )

        raise HTTPException(
            status_code=502,
            detail="AI service request failed."
        )


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

    except ServerError:
        raise HTTPException(
            status_code=503,
            detail="AI service is temporarily unavailable. Please try again shortly."
        )

    except ClientError as error:
        status_code = getattr(error, "status_code", None)

        if status_code == 429:
            raise HTTPException(
                status_code=429,
                detail="Gemini API quota reached. Please try again later."
            )

        raise HTTPException(
            status_code=502,
            detail="AI service request failed."
        )



@app.post("/job-search-profile")
def create_job_search_profile(
    profile: JobSearchProfileRequest
):
    return {
        "message": "Job search profile saved",
        "profile": profile
    }