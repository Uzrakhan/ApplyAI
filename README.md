# ApplyAI 

An AI-powered job application assistant that helps candidates understand how well their resume matches a job description and improve their application materials.



##  Live: 
https://apply-ai-ebon.vercel.app/

##  Features

-  **Resume Analysis**
  - Upload a resume in PDF format
  - Extract candidate skills, experience, projects, and education

-  **Job Description Analysis**
  - Extract job role, required skills, preferred skills, experience, responsibilities, and location

-  **Resume–Job Matching**
  - Compare candidate skills against job requirements
  - Calculate a skill-based match score
  - Identify matching and missing skills

-  **AI Match Explanation**
  - Generate an explanation of the match
  - Highlight candidate strengths and weaknesses
  - Provide practical recommendations

-  **AI Resume Optimization**
  - Tailor resume content to a specific job description
  - Improve wording and ATS-relevant keywords
  - Preserve the candidate's actual experience and skills

-  **AI Cover Letter Generation**
  - Generate a job-specific cover letter
  - Uses the candidate's actual experience, skills, and projects
  - Avoids fabricated information and generic wording

##  Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Python
- FastAPI
- Pydantic

### AI

- Google Gemini API
- Structured JSON outputs
- Prompt-based resume and job analysis

### Other

- PDF text extraction
- REST APIs
- Git & GitHub

##  Architecture

```text
                    ┌─────────────────────┐
                    │      Next.js        │
                    │     Frontend        │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │       FastAPI       │
                    │       Backend       │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │   PDF Parsing   │          │   Gemini API    │
       │     (pypdf)     │          │   AI Analysis   │
       └─────────────────┘          └─────────────────┘