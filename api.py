from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
#for cors


from job_analyzer import analyze_job
from matcher import analyze_match


app = FastAPI()

#for cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class AnalyzeRequest(BaseModel):
    job_description: str


@app.get("/")
def home():
    return {"message": "ApplyAI is running"}

@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    job = analyze_job(request.job_description)

    candidate_skills = [
        "React",
        "Node.js",
        "JavaScript",
        "TypeScript",
        "Python",
        "MongoDB",
        "PostgreSQL"
    ]


    match = analyze_match(
        job.skills,
        candidate_skills
    )


    return {
        "job": job,
        "match": match
    }