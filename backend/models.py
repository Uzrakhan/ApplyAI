from pydantic import BaseModel

class JobAnalysis(BaseModel):
    role: str
    skills: list[str]
    experience: str
    responsibilities: list[str]
    location: str


class CandidateAnalysis(BaseModel):
    skills: list[str]
    experience: list[str]
    projects: list[str]
    education: list[str]

class FullAnalysis(BaseModel):
    job: JobAnalysis
    candidate: CandidateAnalysis