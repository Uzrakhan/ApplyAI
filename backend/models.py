from pydantic import BaseModel

class JobAnalysis(BaseModel):
    role: str
    required_skills: list[str]
    preferred_skills: list[str]
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


class MatchExplanation(BaseModel):
    summary: str
    strengths: list[str]
    weaknesses: list[str]
    recommendations: list[str]


class ResumeOptimization(BaseModel):
    summary: str
    improved_bullets: list[str]
    missing_keywords: list[str]
    suggestions: list[str]

class CoverLetter(BaseModel):
    subject: str
    greeting: str
    introduction: str
    body_paragraphs: list[str]
    closing: str
    candidate_name: str    