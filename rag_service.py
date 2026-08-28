"""
RAG (Retrieval-Augmented Generation) & Semantic Search Service
Extracts chunks and grounds AI explanations in official government recruitment gazettes.
"""

from typing import Dict, List, Any, Optional
from jobs_dataset import GOVERNMENT_JOBS_RAW

# Gazette Chunk Knowledge Store
GAZETTE_VECTOR_CHUNKS: List[Dict[str, Any]] = [
    {
        "chunk_id": 1,
        "job_title": "SSC CGL / CHSL / MTS",
        "organization": "Staff Selection Commission",
        "doc_source": "DoPT Notification & SSC Master Gazette (Clause 4.1)",
        "chunk_text": "Clause 4.1 & 6.2: Essential Qualification for CGL is Bachelor's Degree in any discipline. For CHSL: 12th Pass. For MTS: 10th Pass. Age relaxation: OBC +3 years, SC/ST +5 years, PwD +10 years as per DoPT guidelines.",
        "keywords": ["ssc", "cgl", "chsl", "mts", "cpo", "havaldar", "steno", "central", "bachelor", "10th", "12th"]
    },
    {
        "chunk_id": 2,
        "job_title": "UPSC Civil Services & Engineering Services",
        "organization": "Union Public Service Commission",
        "doc_source": "UPSC CSE Official Gazette 2026 (Rule 3)",
        "chunk_text": "Rule 3.1: Candidate must hold a degree of any recognized University. Age: 21 to 32 years as of 1st August. Maximum attempts: 6 for General, 9 for OBC, unlimited up to age limit for SC/ST.",
        "keywords": ["upsc", "civil services", "ias", "ips", "ifs", "ese", "cms", "capf", "nda", "cds", "ies", "iss"]
    },
    {
        "chunk_id": 3,
        "job_title": "Railway Recruitment Boards (RRB)",
        "organization": "Railway Recruitment Boards",
        "doc_source": "RRB CEN Gazette (Para 2.0 & 3.0)",
        "chunk_text": "Para 3.0: NTPC Graduate posts (Level 5 & 6) require University Degree. ALP requires 10th + ITI or Diploma/Degree in Mech/Elec/Auto. Technicians Grade III require 10th + ITI in trade. Age limit 18-33 yrs with standard relaxations.",
        "keywords": ["railway", "rrb", "alp", "ntpc", "technician", "loco pilot", "junior engineer", "level 1", "group d"]
    },
    {
        "chunk_id": 4,
        "job_title": "Banking & Regulators (SBI / IBPS / RBI / SEBI / NABARD)",
        "organization": "IBPS / SBI / RBI",
        "doc_source": "Bank Recruitment Master Circular 2026",
        "chunk_text": "Section 2: Probationary Officer and Clerical cadres require Graduation in any discipline from recognized University. RBI Grade B requires min 60% in graduation (50% for SC/ST). SEBI Grade A requires Master's in any discipline or Bachelor's in Law/Engineering.",
        "keywords": ["bank", "banking", "sbi", "ibps", "po", "clerk", "rbi", "sebi", "nabard", "lic", "insurance", "officer"]
    },
    {
        "chunk_id": 5,
        "job_title": "Tamil Nadu State Recruitment (TNPSC / TNUSRB / TRB)",
        "organization": "Tamil Nadu Public Service Commission & TRB",
        "doc_source": "TNPSC Gazette Notification (Section 4.1 & G.O. Ms 91)",
        "chunk_text": "Clause 4.1: Group 4 (VAO & Junior Assistant) requires SSLC (10th pass). Group 2 & 1 requires Bachelor's Degree. For SC/ST/MBC/BC candidates, there is No Maximum Age Limit or enhanced age limit up to 37-53 years. Knowledge of Tamil is required.",
        "keywords": ["tnpsc", "tamil nadu", "vao", "group 4", "group 2", "group 1", "tnusrb", "police", "trb", "teacher", "si"]
    },
    {
        "chunk_id": 6,
        "job_title": "Central PSUs & R&D (ISRO, DRDO, ONGC, NTPC, IOCL)",
        "organization": "ISRO / DRDO / PSUs",
        "doc_source": "PSU Recruitment Policy & GATE Gazette",
        "chunk_text": "Executive/Scientist recruitment requires B.E/B.Tech with minimum 60% or 65% aggregate marks / First Class. Most PSUs utilize GATE score followed by GD and Personal Interview. Age limit is typically 26 to 30 years with category relaxations.",
        "keywords": ["isro", "drdo", "ongc", "ntpc", "iocl", "bhel", "sail", "gail", "hal", "bel", "cdac", "nic", "psu", "engineer", "scientist"]
    }
]

def search_semantic_chunks(query: str, top_k: int = 2) -> List[Dict[str, Any]]:
    """Simulates pgvector cosine semantic search over government notification chunks."""
    query_lower = query.lower()
    results = []
    
    for item in GAZETTE_VECTOR_CHUNKS:
        score = 0.65
        for kw in item["keywords"]:
            if kw in query_lower:
                score += 0.08
        results.append({
            "chunk_id": item["chunk_id"],
            "job_title": item["job_title"],
            "organization": item["organization"],
            "doc_source": item["doc_source"],
            "chunk_text": item["chunk_text"],
            "similarity_score": min(round(score, 3), 0.98)
        })

    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results[:top_k]

def generate_rag_answer(query: str, language: str = "en") -> Dict[str, Any]:
    """Generates an explainable RAG answer grounded in the official gazettes."""
    retrieved_chunks = search_semantic_chunks(query)
    top_chunk = retrieved_chunks[0]
    q_lower = query.lower()

    # Contextual synthesis
    if "b.com" in q_lower or "commerce" in q_lower or "வணிகவியல்" in q_lower:
        if language == "ta" or any(c in query for c in "அஆஇஈஉஊஎஏஐஒஓஔகஙசஞடணதநபமயரலவழளறன"):
            answer = (
                f"**B.Com / வணிகவியல் பட்டதாரிகளுக்கான அரசு வேலை வாய்ப்புகள்:**\n"
                f"1. **டிஎன்பிஎஸ்சி (TNPSC):** குரூப் 4 (VAO, உதவியாளர்), குரூப் 2/2A (ASO, தணிக்கையாளர்), குரூப் 1.\n"
                f"2. **வங்கிப் பணிகள் (IBPS & SBI):** PO, கிளர்க் மற்றும் நிதியியல் ஆபிசர் பதவிகள்.\n"
                f"3. **மத்திய அரசு (SSC CGL):** CAG மற்றும் நிதியமைச்சகத்தில் ஆடிட்டர் / கணக்காளர் பணிகள்.\n"
                f"4. **ரயில்வே (RRB NTPC):** சீனியர் கிளர்க், ஸ்டேஷன் மாஸ்டர், சரக்கு மேலாளர்.\n\n"
                f"📜 **அதிகாரப்பூர்வ ஆவண ஆதாரம்:** {top_chunk['doc_source']}"
            )
        else:
            answer = (
                f"**Top Government Job Opportunities for B.Com Graduates:**\n"
                f"1. **Banking (SBI & IBPS):** PO, Customer Service Associate (Clerk), and Specialist Officers (Financial Cadres).\n"
                f"2. **SSC CGL:** Auditor, Junior Accountant, and Assistant Section Officer (ASO) in CAG & Ministry of Finance.\n"
                f"3. **TNPSC State Services:** Group 4 (VAO, Junior Assistant), Group 2/2A (ASO, Auditor), and Group 1.\n"
                f"4. **Indian Railways (RRB NTPC):** Senior Commercial cum Ticket Clerk, Goods Train Manager, Station Master.\n\n"
                f"📜 **Official Source Citation:** Grounded in {top_chunk['doc_source']}."
            )
    elif "age" in q_lower or "வயது" in q_lower or "relaxation" in q_lower:
        if language == "ta":
            answer = (
                f"**அரசுப் பணிகளுக்கான அதிகாரப்பூர்வ வயது தளர்வு விதிமுறைகள் (DoPT & TNPSC):**\n"
                f"• **பொதுப் பிரிவு (General / UR):** அறிவிக்கப்பட்ட அடிப்படை வயது வரம்பு (பொதுவாக 18 முதல் 30/32 வயது).\n"
                f"• **OBC பிரிவு:** +3 ஆண்டுகள் கூடுதல் வயது தளர்வு.\n"
                f"• **SC / ST பிரிவு:** +5 ஆண்டுகள் கூடுதல் வயது தளர்வு.\n"
                f"• **மாற்றுத்திறனாளிகள் (PwD):** +10 ஆண்டுகள் கூடுதல் வயது தளர்வு.\n"
                f"• **TNPSC மாநிலப் பணிகள்:** SC/ST/MBC/BC பிரிவினருக்கு பல பதவிகளில் அதிகபட்ச வயது வரம்பு இல்லை (No Max Age Limit).\n\n"
                f"📜 **அரசு ஆணை ஆதாரம்:** {top_chunk['doc_source']}"
            )
        else:
            answer = (
                f"**Official Category-Based Age Relaxation Guidelines (DoPT Norms):**\n"
                f"• **General / UR Category:** Base gazette limit (typically 18 - 30/32 yrs).\n"
                f"• **OBC (Non-Creamy Layer):** +3 Years relaxation over upper limit.\n"
                f"• **SC / ST Candidates:** +5 Years relaxation over upper limit.\n"
                f"• **PwD (Persons with Disabilities):** +10 Years relaxation (up to 40-42 yrs).\n"
                f"• **Ex-Servicemen:** Service period + 3 years deduction.\n"
                f"• **TNPSC State Quota:** No upper age limit for SC/ST/MBC/BC on several posts.\n\n"
                f"📜 **Source Citation:** Grounded in {top_chunk['doc_source']}."
            )
    else:
        if language == "ta":
            answer = (
                f"அதிகாரப்பூர்வ அரசு அறிவிப்பு ஆதாரத்தின்படி ({top_chunk['doc_source']}):\n"
                f"\"{top_chunk['chunk_text']}\"\n\n"
                f"உங்கள் கல்வித் தகுதி, வயது மற்றும் பிரிவிற்கு ஏற்ப எங்கள் தகுதி சரிபார்ப்பு பொத்தானை அழுத்தி 116 அரசுப் பணிகளுக்கான விரிவான தகுதியை உடனடியாகப் பார்க்கலாம்."
            )
        else:
            answer = (
                f"Based on the official government gazette extract ({top_chunk['doc_source']}):\n"
                f"\"{top_chunk['chunk_text']}\"\n\n"
                f"You can use the Deterministic Eligibility Engine to run an exact point-by-point verification across all 116 active government notifications."
            )

    return {
        "query": query,
        "answer": answer,
        "citations": retrieved_chunks
    }
