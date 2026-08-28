"""
Deterministic Explainable Eligibility Engine
Evaluates candidate profile strictly against all 116 Government Job eligibility rules
and generates point-by-point explainable diffs, match scores, and bilingual AI reasoning.
"""

from typing import Dict, List, Any, Optional
import re
from jobs_dataset import GOVERNMENT_JOBS_RAW

QUALIFICATION_LEVELS = {
    "10th": 1,
    "10th pass": 1,
    "sslc": 1,
    "10th / sslc": 1,
    "10th/iti": 1.5,
    "10th + iti": 1.5,
    "iti": 1.5,
    "12th": 2,
    "12th pass": 2,
    "hsc": 2,
    "12th + d.t.ed": 2.5,
    "diploma": 3,
    "diploma/certificate": 3,
    "diploma/degree": 3,
    "bachelor's": 4,
    "bachelor's degree": 4,
    "engineering degree": 4,
    "b.e": 4,
    "b.tech": 4,
    "b.e/b.tech": 4,
    "b.com": 4,
    "b.sc": 4,
    "b.a": 4,
    "bba": 4,
    "bca": 4,
    "mbbs": 4.5,
    "law degree": 4,
    "llb": 4,
    "master's": 5,
    "master's degree": 5,
    "m.com": 5,
    "m.sc": 5,
    "m.a": 5,
    "m.tech": 5,
    "mba": 5,
    "mca": 5,
    "llm": 5,
    "phd": 6
}

SPECIALIZATION_MAP = {
    "commerce": ["b.com", "commerce", "finance", "accounting", "corporate finance", "m.com", "mba finance", "banking"],
    "computer": ["computer science", "cs", "it", "information technology", "bca", "mca", "b.tech cs", "b.tech it", "software"],
    "civil": ["civil", "civil engineering", "b.e civil", "b.tech civil", "diploma civil"],
    "mechanical": ["mechanical", "mechanical engineering", "b.e mechanical", "b.tech mechanical", "automobile", "production"],
    "electrical": ["electrical", "electrical engineering", "eee", "b.e electrical", "b.tech electrical"],
    "electronics": ["electronics", "ece", "telecommunication", "b.e electronics", "b.tech electronics", "instrumentation"],
    "law": ["law", "llb", "llm", "legal"],
    "medicine": ["mbbs", "medicine", "medical"],
    "nursing": ["nursing", "b.sc nursing", "gnm"],
    "pharmacy": ["pharmacy", "b.pharm", "d.pharm", "m.pharm"],
    "agriculture": ["agriculture", "agri", "b.sc agriculture", "horticulture", "forestry"],
    "science": ["b.sc", "m.sc", "physics", "chemistry", "mathematics", "biology", "science"],
    "economics": ["economics", "applied economics", "business economics", "econometrics", "m.a economics"],
    "statistics": ["statistics", "mathematical statistics", "applied statistics", "data science"]
}

def parse_user_qual_level(degree_str: str) -> float:
    d = (degree_str or "").strip().lower()
    for key, lvl in QUALIFICATION_LEVELS.items():
        if key == d or key in d:
            return lvl
    if "bachelor" in d or "degree" in d or "graduate" in d or "b." in d:
        return 4.0
    if "master" in d or "pg" in d or "post graduate" in d or "m." in d:
        return 5.0
    return 4.0

def parse_job_qual_level(job_qual_str: str) -> float:
    q = (job_qual_str or "").strip().lower()
    if "10th" in q and "iti" in q:
        return 1.5
    if "10th" in q:
        return 1.0
    if "12th" in q:
        return 2.0
    if "diploma/degree" in q:
        return 3.0
    if "diploma" in q:
        return 3.0
    if "mbbs" in q:
        return 4.5
    if "engineering" in q or "bachelor" in q or "law degree" in q or "b.sc" in q:
        return 4.0
    if "master" in q:
        return 5.0
    return 4.0

def check_specialization_match(user_degree: str, user_spec: str, job_spec: str, job_title: str) -> tuple[bool, str]:
    js = (job_spec or "").strip().lower()
    ud = (user_degree or "").strip().lower()
    us = (user_spec or "").strip().lower()
    combined_user = f"{ud} {us}".lower()

    if js in ["any", "any discipline", "post-specific", "academy-specific", "category-specific", "usually no", ""]:
        return True, "Job is open to all academic disciplines."

    # Specific checks
    for category, aliases in SPECIALIZATION_MAP.items():
        category_in_job = category in js or any(a in js for a in aliases)
        if category_in_job:
            user_has_category = category in combined_user or any(a in combined_user for a in aliases)
            if user_has_category:
                return True, f"Specialization '{user_spec or user_degree}' matches required field ({job_spec})."
            else:
                return False, f"Requires specialization in {job_spec}; candidate background is '{user_spec or user_degree}'."

    # General fallback
    if "science" in js and ("b.sc" in ud or "physics" in combined_user or "chemistry" in combined_user or "math" in combined_user):
        return True, f"Science qualification matches required {job_spec}."
    
    if "commerce" in js and ("b.com" in ud or "commerce" in combined_user):
        return True, f"Commerce degree matches required {job_spec}."

    return False, f"Candidate specialization '{user_spec or user_degree}' does not match required discipline ({job_spec})."

def evaluate_eligibility(user_profile: Dict[str, Any], job_rule: Dict[str, Any]) -> Dict[str, Any]:
    """
    Deterministically compares user profile against a specific Government Job's eligibility rules.
    """
    user_age = float(user_profile.get("age", 22))
    user_degree = str(user_profile.get("degree", "Bachelor's Degree")).strip()
    user_spec = str(user_profile.get("specialization", "Corporate Finance & Accounts")).strip()
    user_percentage = float(user_profile.get("percentage", 65.0))
    user_exp = int(user_profile.get("experience", 0))
    user_category = str(user_profile.get("category", "General")).strip()
    user_state = str(user_profile.get("state", "Tamil Nadu")).strip()

    # 1. Category Age Relaxation
    relaxations = {"General": 0, "UR": 0, "EWS": 0, "OBC": 3, "SC": 5, "ST": 5, "PwD": 10, "Ex-Serviceman": 5}
    relaxation_yrs = relaxations.get(user_category, 0)
    
    min_age = float(job_rule.get("min_age", 18.0))
    raw_max_age = float(job_rule.get("max_age", 30.0)) if job_rule.get("max_age") else 35.0
    max_allowed_age = raw_max_age + relaxation_yrs

    age_pass = min_age <= user_age <= max_allowed_age
    age_reason = (
        f"Candidate age {user_age:g} yrs is within permissible range of {min_age:g}–{max_allowed_age:g} yrs "
        f"(Base max {raw_max_age:g} + {relaxation_yrs} yrs {user_category} relaxation)."
        if age_pass else
        f"Candidate age {user_age:g} yrs is {'below minimum' if user_age < min_age else 'above maximum'} allowable limit of {max_allowed_age:g} yrs "
        f"(Base max {raw_max_age:g} + {relaxation_yrs} yrs {user_category} relaxation)."
    )

    # 2. Qualification Level
    user_lvl = parse_user_qual_level(user_degree)
    job_lvl = parse_job_qual_level(job_rule.get("minimum_qualification", "Bachelor's Degree"))
    qual_pass = user_lvl >= job_lvl
    qual_reason = (
        f"Candidate educational credential '{user_degree}' (Level {user_lvl:g}) satisfies required minimum level ({job_rule.get('minimum_qualification')})."
        if qual_pass else
        f"Requires minimum qualification '{job_rule.get('minimum_qualification')}' (Level {job_lvl:g}); candidate holds '{user_degree}' (Level {user_lvl:g})."
    )

    # 3. Specialization
    spec_pass, spec_reason = check_specialization_match(
        user_degree, user_spec, job_rule.get("specialization", "Any"), job_rule.get("job_title", "")
    )

    # 4. Minimum Percentage
    job_min_pct = job_rule.get("minimum_percentage")
    pct_required_str = f"{job_min_pct}%" if job_min_pct is not None else "No minimum percentage / Passing marks"
    if job_min_pct is None:
        pct_pass = True
        pct_reason = f"No minimum percentage restriction; candidate score of {user_percentage:g}% is fully valid."
    else:
        pct_pass = user_percentage >= float(job_min_pct)
        pct_reason = (
            f"Candidate score {user_percentage:g}% satisfies official cutoff requirement of {job_min_pct}%."
            if pct_pass else
            f"Candidate score {user_percentage:g}% is below mandatory cutoff of {job_min_pct}% (Deficit: {float(job_min_pct)-user_percentage:.1f}%)."
        )

    # 5. Experience
    exp_req = str(job_rule.get("experience_required", "No")).strip()
    if exp_req.lower() in ["no", "usually no"]:
        exp_pass = True
        exp_reason = "Freshers eligible. No prior work experience is mandatory."
    elif exp_req.lower() == "post-specific":
        exp_pass = True
        exp_reason = f"Candidate has {user_exp} yrs experience; certain specialized sub-posts may specify experience at application time."
    else:
        exp_pass = user_exp >= 1
        exp_reason = (
            f"Candidate satisfies experience requirement ({user_exp} yrs experience)."
            if exp_pass else
            f"Role requires professional experience; candidate has {user_exp} yrs recorded."
        )

    # 6. Location / Domicile
    job_loc = str(job_rule.get("location", "India")).strip()
    if job_loc.lower() in ["india", "all india", "india/delhi police & capfs"]:
        loc_pass = True
        loc_reason = "Central All-India recruitment open to citizens from all states & UTs."
    elif "tamil nadu" in job_loc.lower():
        if "tamil nadu" in user_state.lower():
            loc_pass = True
            loc_reason = "Candidate holds Tamil Nadu domicile and qualifies for state reservation benefits."
        else:
            loc_pass = True
            loc_reason = "Open Competition (OC) quota accessible; state reservation rules require TN domicile."
    else:
        loc_pass = True
        loc_reason = f"Recruitment location: {job_loc}."

    criteria = [
        {
            "criterion": "Age Limit & Category Relaxation",
            "required": f"{min_age:g}–{raw_max_age:g} yrs (+{relaxation_yrs}y for {user_category} = max {max_allowed_age:g} yrs)",
            "user_value": f"{user_age:g} yrs ({user_category})",
            "passed": age_pass,
            "reason": age_reason
        },
        {
            "criterion": "Educational Qualification Level",
            "required": job_rule.get("minimum_qualification", "Bachelor's Degree"),
            "user_value": user_degree,
            "passed": qual_pass,
            "reason": qual_reason
        },
        {
            "criterion": "Academic Specialization / Stream",
            "required": job_rule.get("specialization", "Any"),
            "user_value": f"{user_degree} ({user_spec})",
            "passed": spec_pass,
            "reason": spec_reason
        },
        {
            "criterion": "Minimum Percentage Cutoff",
            "required": pct_required_str,
            "user_value": f"{user_percentage:g}%",
            "passed": pct_pass,
            "reason": pct_reason
        },
        {
            "criterion": "Experience Requirement",
            "required": exp_req,
            "user_value": f"{user_exp} Years",
            "passed": exp_pass,
            "reason": exp_reason
        },
        {
            "criterion": "Domicile / Location Quota",
            "required": job_loc,
            "user_value": user_state,
            "passed": loc_pass,
            "reason": loc_reason
        }
    ]

    failed_criteria = [c for c in criteria if not c["passed"]]
    is_eligible = len(failed_criteria) == 0
    is_near_match = (len(failed_criteria) == 1 and (not pct_pass or not exp_pass or (not age_pass and abs(user_age - max_allowed_age) <= 2)))

    # Calculate match score (0 - 100)
    score = 40
    if age_pass: score += 20
    if qual_pass: score += 20
    if spec_pass: score += 10
    if pct_pass: score += 5
    if exp_pass: score += 5

    # Status label
    if is_eligible:
        status_label = "Eligible"
    elif is_near_match:
        status_label = "Near Match"
    else:
        status_label = "Not Eligible"

    # AI Bilingual Explanations
    failed_names = [c["criterion"] for c in failed_criteria]
    
    if is_eligible:
        ai_en = (
            f"✅ **100% Eligible for {job_rule['job_title']} ({job_rule['organization']})**.\n\n"
            f"• **Age Assessment**: Your age ({user_age:g} yrs) is fully compliant under {user_category} quota (allowable up to {max_allowed_age:g} yrs).\n"
            f"• **Qualification**: Your degree '{user_degree}' in '{user_spec}' satisfies the mandatory requirement of '{job_rule['minimum_qualification']}'.\n"
            f"• **Academic Score**: Your percentage ({user_percentage:g}%) meets the prescribed cutoff.\n"
            f"• **Next Recommended Action**: Prepare for the selection stage: **{job_rule['selection_process']}**. Register on official portal ({job_rule.get('official_url', 'Gov Portal')})."
        )
        ai_ta = (
            f"✅ **{job_rule['job_title']} ({job_rule['organization']}) பதவிக்கு நீங்கள் 100% தகுதியுடையவர்!**\n\n"
            f"• **வயது வரம்பு**: உங்கள் வயது ({user_age:g}), {user_category} பிரிவு தளர்வின்படி அனுமதிக்கப்பட்ட {max_allowed_age:g} வயதுக்குள் உள்ளது.\n"
            f"• **கல்வித் தகுதி**: உங்கள் படிப்பு '{user_degree}' ({user_spec}), அதிகாரப்பூர்வ அறிவிப்பின் குறைந்தபட்சத் தகுதியை ({job_rule['minimum_qualification']}) பூர்த்தி செய்கிறது.\n"
            f"• **மதிப்பெண்**: உங்கள் மதிப்பெண் ({user_percentage:g}%) போதுமானது.\n"
            f"• **அடுத்த கட்ட நடவடிக்கை**: தேர்வு முறைக்கு (**{job_rule['selection_process']}**) தயாராகுங்கள்."
        )
    else:
        ai_en = (
            f"❌ **Currently Ineligible for {job_rule['job_title']} ({job_rule['organization']})**.\n\n"
            f"• **Unmet Criteria**: [{', '.join(failed_names)}].\n"
            f"• **Specific Breakdown**: " + " ".join([c["reason"] for c in failed_criteria]) + "\n"
            f"• **Guidance**: Look for related notifications in {job_rule['government_level']} or enhance relevant qualification/experience to qualify."
        )
        ai_ta = (
            f"❌ **{job_rule['job_title']} ({job_rule['organization']}) பதவிக்கு நீங்கள் தற்போது தகுதி பெறவில்லை.**\n\n"
            f"• **பூர்த்தியாகாத விதிமுறைகள்**: [{', '.join(failed_names)}].\n"
            f"• **காரணம்**: " + " ".join([c["reason"] for c in failed_criteria]) + "\n"
            f"• **வழிகாட்டுதல்**: உங்கள் தகுதிக்கு ஏற்ற மாற்று அரசு வேலைப் பரிந்துரைகளைப் பார்க்கவும்."
        )

    return {
        "job_id": job_rule["job_id"],
        "job_title": job_rule["job_title"],
        "organization": job_rule["organization"],
        "government_level": job_rule["government_level"],
        "is_eligible": is_eligible,
        "is_near_match": is_near_match,
        "status": status_label,
        "match_score": min(score, 99) if is_eligible else (min(score, 75) if is_near_match else min(score, 45)),
        "summary": "Candidate satisfies all mandatory legal conditions." if is_eligible else f"Did not meet requirement on: {', '.join(failed_names)}.",
        "criteria": criteria,
        "selection_process": job_rule.get("selection_process", "Written Exam"),
        "salary": job_rule.get("salary", "Government Pay Scale"),
        "official_url": job_rule.get("official_url", "https://india.gov.in"),
        "ai_explanation_en": ai_en,
        "ai_explanation_ta": ai_ta
    }

def evaluate_all_jobs(user_profile: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates candidate profile across all 116 Government Job records simultaneously.
    """
    eligible_list = []
    near_match_list = []
    ineligible_list = []

    for job in GOVERNMENT_JOBS_RAW:
        res = evaluate_eligibility(user_profile, job)
        if res["is_eligible"]:
            eligible_list.append(res)
        elif res["is_near_match"]:
            near_match_list.append(res)
        else:
            ineligible_list.append(res)

    # Sort each group by match score
    eligible_list.sort(key=lambda x: x["match_score"], reverse=True)
    near_match_list.sort(key=lambda x: x["match_score"], reverse=True)
    ineligible_list.sort(key=lambda x: x["match_score"], reverse=True)

    total_jobs = len(GOVERNMENT_JOBS_RAW)
    return {
        "total_jobs": total_jobs,
        "eligible_count": len(eligible_list),
        "near_match_count": len(near_match_list),
        "ineligible_count": len(ineligible_list),
        "eligible_jobs": eligible_list,
        "near_match_jobs": near_match_list,
        "ineligible_jobs": ineligible_list
    }
