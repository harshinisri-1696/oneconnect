"""
FastAPI REST Application Entrypoint
Government Job AI Navigator Backend Service
Full-Stack 5-Step Workflow:
User Profile -> Eligibility Rules -> Compare Each Requirement -> Eligible Jobs -> AI Explanation
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

from jobs_dataset import GOVERNMENT_JOBS_RAW, get_all_jobs, get_job_by_id
from eligibility_engine import evaluate_eligibility, evaluate_all_jobs
from rag_service import generate_rag_answer, search_semantic_chunks

app = FastAPI(
    title="GovSetu AI — 116 Government Job Eligibility & RAG API",
    description="REST API for Deterministic Government Job Eligibility Matching with Point-by-Point Diff Engine & Bilingual RAG Grounding",
    version="2.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# PYDANTIC SCHEMAS
# ==========================================
class UserProfileSchema(BaseModel):
    name: str = Field("Jeeva Tharan R", example="Jeeva Tharan R")
    age: float = Field(22.0, example=22)
    state: str = Field("Tamil Nadu", example="Tamil Nadu")
    degree: str = Field("Bachelor's Degree", example="B.Com")
    specialization: str = Field("Corporate Finance & Accounts", example="Corporate Finance & Accounts")
    percentage: float = Field(68.5, example=68.5)
    experience: int = Field(0, example=0)
    category: str = Field("OBC", example="OBC")
    language: str = Field("en", example="en")

class SingleEligibilityRequest(BaseModel):
    job_id: Any = Field(..., example=1)
    user_profile: UserProfileSchema

class BatchEligibilityRequest(BaseModel):
    user_profile: UserProfileSchema

class ChatRequest(BaseModel):
    query: str = Field(..., example="What jobs can I apply for with B.Com?")
    language: Optional[str] = "en"

# ==========================================
# REST API ENDPOINTS
# ==========================================

@app.get("/")
def read_root():
    return {
        "service": "GovSetu AI 116 Government Jobs Backend",
        "version": "2.0.0",
        "total_jobs_indexed": len(GOVERNMENT_JOBS_RAW),
        "status": "Healthy & Online",
        "endpoints": ["/jobs", "/jobs/{job_id}", "/eligibility/check", "/eligibility/batch-evaluate", "/jobs/recommended", "/jobs/stats", "/chat"]
    }

@app.get("/jobs")
def get_jobs(
    government_level: Optional[str] = None,
    organization: Optional[str] = None,
    qualification: Optional[str] = None,
    location: Optional[str] = None,
    search: Optional[str] = None
):
    """Retrieves list of government jobs with multi-facet filters."""
    results = GOVERNMENT_JOBS_RAW

    if government_level and government_level.lower() != "all":
        results = [j for j in results if government_level.lower() in j["government_level"].lower()]

    if organization:
        results = [j for j in results if organization.lower() in j["organization"].lower()]

    if qualification:
        results = [j for j in results if qualification.lower() in j["minimum_qualification"].lower()]

    if location and location.lower() != "all":
        results = [j for j in results if location.lower() in j["location"].lower() or "india" in j["location"].lower()]

    if search:
        s = search.lower()
        results = [
            j for j in results
            if s in j["job_title"].lower() or s in j["organization"].lower() or s in j["specialization"].lower()
        ]

    return {
        "total": len(results),
        "jobs": results
    }

@app.get("/jobs/stats")
def get_job_stats():
    """Returns analytics and sector distributions across the 116 jobs."""
    levels: Dict[str, int] = {}
    orgs: Dict[str, int] = {}
    
    for j in GOVERNMENT_JOBS_RAW:
        lvl = j["government_level"]
        levels[lvl] = levels.get(lvl, 0) + 1
        
        org = j["organization"]
        orgs[org] = orgs.get(org, 0) + 1

    return {
        "total_jobs": len(GOVERNMENT_JOBS_RAW),
        "by_government_level": levels,
        "top_organizations": sorted(orgs.items(), key=lambda x: x[1], reverse=True)[:10]
    }

@app.get("/jobs/recommended")
def get_recommended_jobs(
    age: float = 22.0,
    degree: str = "Bachelor's Degree",
    specialization: str = "Corporate Finance & Accounts",
    percentage: float = 68.5,
    category: str = "OBC",
    state: str = "Tamil Nadu"
):
    """Returns top recommended and eligible government posts tailored to the profile."""
    profile = {
        "age": age,
        "degree": degree,
        "specialization": specialization,
        "percentage": percentage,
        "experience": 0,
        "category": category,
        "state": state
    }
    evaluation = evaluate_all_jobs(profile)
    top_recommendations = evaluation["eligible_jobs"][:15]
    if len(top_recommendations) < 10:
        top_recommendations.extend(evaluation["near_match_jobs"][: 10 - len(top_recommendations)])
    
    return {
        "candidate_summary": f"{degree} ({specialization}), Age {age:g} yrs, {category} in {state}",
        "total_matches": evaluation["eligible_count"],
        "recommended": top_recommendations
    }

@app.get("/jobs/{job_id}")
def get_single_job(job_id: int):
    """Fetches details for a specific job ID."""
    job = get_job_by_id(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found in database")
    return job

@app.post("/eligibility/check")
def check_single_eligibility(payload: SingleEligibilityRequest):
    """Deterministic requirement-by-requirement comparison for a specific job."""
    job = get_job_by_id(payload.job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Target job not found")

    result = evaluate_eligibility(payload.user_profile.model_dump(), job)
    return result

@app.post("/eligibility/batch-evaluate")
def batch_evaluate_candidate(payload: BatchEligibilityRequest):
    """
    Core Step 3 & 4: Evaluates candidate profile across all 116 jobs simultaneously.
    Returns categorized lists: 100% Eligible, Near Matches, Ineligible.
    """
    return evaluate_all_jobs(payload.user_profile.model_dump())

@app.post("/chat")
def chat_with_assistant(payload: ChatRequest):
    """Bilingual RAG Chatbot grounded in verified government notifications."""
    return generate_rag_answer(payload.query, payload.language or "en")

@app.post("/users/profile")
def save_profile(profile: UserProfileSchema):
    """Simulates storing candidate credentials into database."""
    return {
        "status": "success",
        "message": "User profile successfully synchronized with eligibility engine.",
        "profile": profile
    }

@app.post("/auth/login")
def login_candidate(credentials: Dict[str, str]):
    return {
        "access_token": "govsetu_token_2026_verified",
        "token_type": "bearer",
        "user": {"email": credentials.get("email", "candidate@govsetu.in"), "role": "candidate"}
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
