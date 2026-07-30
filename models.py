from pydantic import BaseModel

class JobAnalysis(BaseModel):
    role: str
    skills: list[str]
    experience: str
    responsibilities: list[str]
    location: str


