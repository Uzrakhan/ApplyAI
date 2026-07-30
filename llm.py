from google import genai
from models import JobAnalysis
import os


client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def ask_llm(prompt):
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    return response.text


def analyze_job_with_llm(job_description):
    prompt = f"""
    Analyze the fofllowing job description.JobAnalysis

    Extract only information supported by the job description.
    If experience or location is not specified, use "Not specified".JobAnalysis

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

