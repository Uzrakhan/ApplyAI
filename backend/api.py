
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
        analysis = analyze_application_with_llm(
            resume_text,
            job_description
        )


        print("\n==== JOB ====")
        print(analysis.job)

        print("\n===== CANDIDATE =====")
        print(analysis.candidate)




        job = analysis.job
        candidate = analysis.candidate

        # Normal Python matching — no Gemini request here
        match = analyze_match(
            job.required_skills,
            job.preferred_skills,
            candidate.skills
        )

        explanation = explain_match_with_llm(
            resume_text,
            job_description,
            match["match_score"]
        )

        return {
            "job": job,
            "candidate": candidate,
            "match": match,
            "explanation": explanation
        }

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