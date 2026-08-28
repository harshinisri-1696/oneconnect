// Master dataset for CitizenDoc - 12 Government Documents with questions, guides, and FAQs

const initialDocuments = [
  {
    id: 1,
    name: "Aadhaar Card",
    slug: "aadhaar-card",
    category: "Identity & Proof",
    description: "12-digit unique identity number issued by UIDAI to all Indian residents, serving as proof of identity and address across India.",
    processing_time: "15 to 30 Days",
    fee: "Free (New) / ₹50 (Update) / ₹100 (Biometric Update)",
    official_link: "https://myaadhaar.uidai.gov.in/",
    issuing_authority: "Unique Identification Authority of India (UIDAI)",
    icon: "Fingerprint",
    eligibility_overview: "All resident individuals living in India for at least 182 days in the preceding 12 months, including newborns and minors.",
    required_docs_summary: [
      "Proof of Identity (POI) - PAN Card, Voter ID, Passport, or Ration Card",
      "Proof of Address (POA) - Electricity Bill, Water Bill, Rent Agreement, or Bank Passbook",
      "Proof of Date of Birth (DOB) - Birth Certificate, 10th Marksheet, or Passport",
      "Proof of Relationship (POR) for minors - Birth Certificate with parent's name"
    ]
  },
  {
    id: 2,
    name: "PAN Card",
    slug: "pan-card",
    category: "Financial & Tax",
    description: "Permanent Account Number issued by Income Tax Department, mandatory for tax filing, opening bank accounts, and high-value financial transactions.",
    processing_time: "7 to 15 Days (Instant e-PAN in 10 mins)",
    fee: "₹107 (Physical in India) / ₹1017 (Abroad) / Free (Instant e-PAN)",
    official_link: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    issuing_authority: "Income Tax Department (NSDL / Protean / UTIITSL)",
    icon: "CreditCard",
    eligibility_overview: "Any Indian citizen, NRI, minor (via representative assessees), or legal entity earning taxable income in India.",
    required_docs_summary: [
      "Proof of Identity - Aadhaar Card, Voter ID, or Passport",
      "Proof of Address - Aadhaar Card, Bank Statement, or Utility Bill",
      "Proof of Date of Birth - Birth Certificate, Aadhaar, or Matriculation Certificate",
      "Two recent passport-size colored photographs (for physical form)"
    ]
  },
  {
    id: 3,
    name: "Voter ID",
    slug: "voter-id",
    category: "Civic & Electoral",
    description: "Electors Photo Identity Card (EPIC) issued by the Election Commission of India, enabling voting rights in national, state, and local elections.",
    processing_time: "15 to 30 Days",
    fee: "Free of cost",
    official_link: "https://voters.eci.gov.in/",
    issuing_authority: "Election Commission of India (ECI)",
    icon: "Vote",
    eligibility_overview: "Indian citizens aged 18 years or older on qualifying date (Jan 1, Apr 1, Jul 1, Oct 1), ordinarily resident in the constituency.",
    required_docs_summary: [
      "Proof of Age - Birth Certificate, Aadhaar Card, PAN, or 10th Certificate",
      "Proof of Ordinary Residence - Ration Card, Electricity/Water bill, or Bank Passbook",
      "Recent passport-size photograph",
      "Declaration form (if above 21 years and applying for the first time)"
    ]
  },
  {
    id: 4,
    name: "Passport",
    slug: "passport",
    category: "Travel & Identity",
    description: "Official travel document issued by the Ministry of External Affairs for international travel and authoritative proof of Indian citizenship.",
    processing_time: "10 to 30 Days (Normal) / 3 to 7 Days (Tatkaal)",
    fee: "₹1,500 (36 Pages Normal) / ₹2,000 (60 Pages) / +₹2,000 for Tatkaal",
    official_link: "https://www.passportindia.gov.in/",
    issuing_authority: "Consular, Passport & Visa Division, Ministry of External Affairs (MEA)",
    icon: "Plane",
    eligibility_overview: "Indian citizens by birth, descent, or naturalization with no disqualifying criminal record or pending warrants.",
    required_docs_summary: [
      "Proof of Date of Birth - Birth Certificate, Aadhaar, or School Leaving Certificate",
      "Proof of Present Address - Aadhaar Card, Water/Electricity Bill, Bank Passbook",
      "Proof of Non-ECR status (if applicable) - 10th standard passing certificate",
      "Old Passport (in case of renewal/re-issue)"
    ]
  },
  {
    id: 5,
    name: "Driving Licence",
    slug: "driving-licence",
    category: "Transport & Mobility",
    description: "Official authorization issued by Regional Transport Offices (RTO) permitting individuals to drive motor vehicles on public roads.",
    processing_time: "15 to 30 Days (After driving test clearance)",
    fee: "₹200 (Learner) + ₹300 (Permanent) + ₹200 (Driving Test)",
    official_link: "https://parivahan.gov.in/parivahan/",
    issuing_authority: "Ministry of Road Transport & Highways (MoRTH) & State RTOs",
    icon: "Car",
    eligibility_overview: "Age 16+ for Gearless 50cc two-wheelers; Age 18+ for Light Motor Vehicles (LMV); Age 20+ for Commercial/Transport vehicles with valid Learner's Licence.",
    required_docs_summary: [
      "Valid Learner's Licence (held for minimum 30 days)",
      "Proof of Age - Aadhaar Card, Birth Certificate, or PAN Card",
      "Proof of Address - Ration Card, Aadhaar, or Voter ID",
      "Medical Certificate (Form 1A for applicants >40 years or commercial licence)"
    ]
  },
  {
    id: 6,
    name: "Birth Certificate",
    slug: "birth-certificate",
    category: "Vital Records",
    description: "Official legal record verifying the birth date, location, parentage, and gender of a child, fundamental for all future identity registrations.",
    processing_time: "7 to 21 Days",
    fee: "Free (within 21 days) / ₹5 to ₹50 (delayed registration fee)",
    official_link: "https://crsorgi.gov.in/web/index.php/auth/login",
    issuing_authority: "Civil Registration System (CRS) & Local Municipal Corporation / Gram Panchayat",
    icon: "Baby",
    eligibility_overview: "Any child born within the municipal jurisdiction or state boundary, reported by parents, hospitals, or guardians.",
    required_docs_summary: [
      "Hospital Discharge Summary / Institutional Birth Report",
      "Parents' Identity Proof (Aadhaar Card, Voter ID, or Passport)",
      "Parents' Marriage Certificate (optional/recommended)",
      "Affidavit from Magistrate/SDM (if registered after 1 year)"
    ]
  },
  {
    id: 7,
    name: "Income Certificate",
    slug: "income-certificate",
    category: "Welfare & Subsidies",
    description: "Government-certified proof of total annual family earnings, required for scholarship applications, fee waivers, and welfare welfare schemes.",
    processing_time: "10 to 15 Days",
    fee: "₹20 to ₹60 (Varies by State e-District portal)",
    official_link: "https://edistrict.gov.in/",
    issuing_authority: "Revenue Department / Tahsildar / Sub-Divisional Magistrate (SDM)",
    icon: "TrendingUp",
    eligibility_overview: "Residents of the respective state with documented or self-declared annual household income sources.",
    required_docs_summary: [
      "Salary Slips (Form 16 / ITR copy) or Self-Declaration of Income",
      "Aadhaar Card / Voter ID of applicant and family head",
      "Ration Card or Family Register entry",
      "Recent Electricity Bill / Property Tax Receipt"
    ]
  },
  {
    id: 8,
    name: "Community Certificate",
    slug: "community-certificate",
    category: "Welfare & Subsidies",
    description: "Legal certificate validating caste status (SC/ST/OBC/EWS) to claim affirmative action reservations in education and government jobs.",
    processing_time: "15 to 30 Days",
    fee: "₹30 to ₹75",
    official_link: "https://services.india.gov.in/service/search?kw=caste+certificate",
    issuing_authority: "Revenue Department / District Magistrate / Tehsildar",
    icon: "Shield",
    eligibility_overview: "Indian citizens belonging to recognized Scheduled Castes, Scheduled Tribes, Other Backward Classes, or Economically Weaker Sections.",
    required_docs_summary: [
      "Father's or Paternal relative's Community Certificate",
      "School Leaving Certificate mentioning caste/community",
      "Applicant's Aadhaar Card and Residence Proof",
      "Affidavit affirming community background and non-creamy layer status (for OBC)"
    ]
  },
  {
    id: 9,
    name: "Domicile Certificate",
    slug: "domicile-certificate",
    category: "Certificates & Rights",
    description: "Official verification that a person has permanent residence or has resided in a specific state/UT for a continuous specified statutory period.",
    processing_time: "15 to 25 Days",
    fee: "₹30 to ₹50",
    official_link: "https://edistrict.gov.in/",
    issuing_authority: "District Magistrate / Sub-Divisional Officer / Tehsildar",
    icon: "Home",
    eligibility_overview: "Continuous residency in the state for 5 to 15 years (varies per state guidelines) or ownership of immovable property.",
    required_docs_summary: [
      "Proof of Continuous Stay (School records for 10+ years, old utility bills)",
      "Aadhaar Card, Voter ID, or Ration Card",
      "Land ownership document / Property tax receipts / Electricity bills",
      "Affidavit of permanent residence from Court/Notary"
    ]
  },
  {
    id: 10,
    name: "Ration Card",
    slug: "ration-card",
    category: "Welfare & Food Security",
    description: "Document issued to eligible households under the National Food Security Act (NFSA) for subsidized food grains and targeted welfare entitlements.",
    processing_time: "20 to 30 Days",
    fee: "₹15 to ₹45 (Varies per card type: AAY, PHH, NPHH)",
    official_link: "https://nfsa.gov.in/",
    issuing_authority: "Department of Food, Civil Supplies & Consumer Affairs",
    icon: "ShoppingBag",
    eligibility_overview: "Families residing within state jurisdiction who do not possess any other active ration card in any state.",
    required_docs_summary: [
      "Aadhaar Cards of all family members including minors",
      "Income Certificate / BPL Certificate (for priority category)",
      "Proof of Residence (Electricity bill / Rent agreement)",
      "Passport size photograph of the female head of the family"
    ]
  },
  {
    id: 11,
    name: "Marriage Certificate",
    slug: "marriage-certificate",
    category: "Vital Records",
    description: "Official legal declaration establishing the solemnization and valid union of two individuals under Hindu Marriage Act or Special Marriage Act.",
    processing_time: "7 to 30 Days (30 days notice for Special Marriage Act)",
    fee: "₹100 to ₹250",
    official_link: "https://services.india.gov.in/service/search?kw=marriage+certificate",
    issuing_authority: "Registrar of Marriages / Revenue Department / Municipal Corporation",
    icon: "HeartHandshake",
    eligibility_overview: "Groom age 21+, Bride age 18+, mutual consent, not within prohibited degrees of relationship unless custom allows.",
    required_docs_summary: [
      "Marriage Invitation Card / Temple or Church Marriage Certificate",
      "Age & Address Proof of Bride and Groom (Aadhaar, Passport, Birth Cert)",
      "Joint Marriage Photograph and individual passport photos",
      "Identity and address proofs of 2 to 3 adult witnesses"
    ]
  },
  {
    id: 12,
    name: "Death Certificate",
    slug: "death-certificate",
    category: "Vital Records",
    description: "Official document stating the date, location, and certified cause of an individual's demise, critical for inheritance, insurance, and legal closures.",
    processing_time: "7 to 15 Days",
    fee: "Free (within 21 days) / ₹10 to ₹50 (delayed registration fee)",
    official_link: "https://crsorgi.gov.in/",
    issuing_authority: "Civil Registration System / Municipal Health Department",
    icon: "FileText",
    eligibility_overview: "Next of kin, family member, doctor, or authorized hospital representative where death occurred.",
    required_docs_summary: [
      "Medical Certificate of Cause of Death (Form 4/4A) from doctor/hospital",
      "Deceased's Aadhaar Card / Voter ID / Identity proof",
      "Applicant's identity proof and relationship declaration",
      "Cremation/Burial ground receipt or Police NOC (in accidental cases)"
    ]
  }
];

const eligibilityQuestions = [
  // 1. Aadhaar Card
  {
    id: 101,
    document_id: 1,
    field_key: "age",
    question: "What is your age or the applicant's age?",
    input_type: "select",
    options_json: JSON.stringify(["Below 5 years (Baal Aadhaar)", "5 to 17 years (Minor)", "18 years and above (Adult)"]),
    help_text: "Biometrics are mandatory above age 5.",
    weight: 20
  },
  {
    id: 102,
    document_id: 1,
    field_key: "citizenship",
    question: "Are you currently residing in India for at least 182 days?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, Indian Resident (>182 days)", "No, Non-Resident (NRI with Indian Passport)", "Foreign National"]),
    help_text: "Aadhaar is available to all resident individuals in India.",
    weight: 30
  },
  {
    id: 103,
    document_id: 1,
    field_key: "existing_document",
    question: "Do you already possess an existing Aadhaar number?",
    input_type: "radio",
    options_json: JSON.stringify(["No, applying for Fresh Aadhaar", "Yes, want to update details", "Yes, lost and need reprint"]),
    help_text: "You cannot generate multiple Aadhaar numbers.",
    weight: 20
  },
  {
    id: 104,
    document_id: 1,
    field_key: "address_proof",
    question: "Do you have valid Proof of Address (Electricity bill, Rent agreement, Bank passbook)?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, document in my name", "Document in parent/spouse name (Head of Family HoF)", "No address proof currently"]),
    help_text: "HoF mode allows verification via family head's Aadhaar.",
    weight: 15
  },
  {
    id: 105,
    document_id: 1,
    field_key: "dob_proof",
    question: "Do you possess an official Proof of Date of Birth (Birth Certificate/10th Marksheet)?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, Birth Certificate / Marksheet available", "Declared/Approximate age only"]),
    help_text: "Verified DOB requires valid documentary proof.",
    weight: 15
  },

  // 2. PAN Card
  {
    id: 201,
    document_id: 2,
    field_key: "age",
    question: "What is the applicant's age group?",
    input_type: "select",
    options_json: JSON.stringify(["18 years or above (Major)", "Below 18 years (Minor - Rep Assessee required)"]),
    help_text: "Minors can obtain PAN via legal guardian.",
    weight: 20
  },
  {
    id: 202,
    document_id: 2,
    field_key: "citizenship",
    question: "What is the citizenship & applicant category?",
    input_type: "select",
    options_json: JSON.stringify(["Individual Indian Citizen", "Non-Resident Indian (NRI)", "Foreign Citizen / Overseas Entity", "Company / Partnership Firm"]),
    help_text: "Form 49A applies to Indian citizens, 49AA to foreigners.",
    weight: 25
  },
  {
    id: 203,
    document_id: 2,
    field_key: "existing_document",
    question: "Do you have an active Aadhaar card linked with mobile number?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, Aadhaar + linked mobile (Instant 10-min e-PAN eligible)", "Yes Aadhaar, but mobile not linked", "No Aadhaar available"]),
    help_text: "Aadhaar e-KYC enables paperless Instant e-PAN free of cost.",
    weight: 35
  },
  {
    id: 204,
    document_id: 2,
    field_key: "existing_pan",
    question: "Have you ever been allotted a PAN card before?",
    input_type: "radio",
    options_json: JSON.stringify(["No, first time application", "Yes, lost/damaged (Need reprint/correction)"]),
    help_text: "Holding dual PAN cards attracts ₹10,000 penalty under Section 272B.",
    weight: 20
  },

  // 3. Voter ID
  {
    id: 301,
    document_id: 3,
    field_key: "age",
    question: "Will you be 18 years of age or older on the nearest qualifying date?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, already 18+", "Turning 18 on upcoming qualifying date (Advance Form 6)", "Below 17 years"]),
    help_text: "You can apply 3 months in advance before turning 18.",
    weight: 35
  },
  {
    id: 302,
    document_id: 3,
    field_key: "citizenship",
    question: "Are you a citizen of India?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, Citizen of India", "No, Foreign National"]),
    help_text: "Only Indian citizens are eligible for voting rights.",
    weight: 35
  },
  {
    id: 303,
    document_id: 3,
    field_key: "residence_proof",
    question: "Are you an ordinary resident at the constituency address you wish to enroll?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, residing at this address for >6 months", "Recently shifted from another constituency (Form 8)", "Overseas Indian elector (Form 6A)"]),
    help_text: "A person can only be registered in one constituency at a time.",
    weight: 30
  },

  // 4. Passport
  {
    id: 401,
    document_id: 4,
    field_key: "citizenship",
    question: "What is your nationality status?",
    input_type: "radio",
    options_json: JSON.stringify(["Citizen of India by Birth", "Citizen by Registration/Naturalization", "Non-Indian Citizen"]),
    help_text: "Indian passports are exclusively issued to Indian citizens.",
    weight: 30
  },
  {
    id: 402,
    document_id: 4,
    field_key: "court_cases",
    question: "Are there any criminal proceedings or non-bailable warrants pending against you?",
    input_type: "radio",
    options_json: JSON.stringify(["No criminal cases or pending warrants", "Yes, court case pending with magistrate NOC", "Yes, pending warrant without NOC"]),
    help_text: "Pending criminal proceedings require court clearance under Passport Act.",
    weight: 30
  },
  {
    id: 403,
    document_id: 4,
    field_key: "ecr_status",
    question: "Have you passed matriculation (10th standard) or higher examination?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, 10th passed (Eligible for Non-ECR)", "No, below 10th standard (ECR category)"]),
    help_text: "Non-ECR allows hassle-free emigration clearance.",
    weight: 20
  },
  {
    id: 404,
    document_id: 4,
    field_key: "application_type",
    question: "Which application scheme do you prefer?",
    input_type: "select",
    options_json: JSON.stringify(["Normal Scheme (15-30 days, ₹1500)", "Tatkaal Scheme (3-7 days, ₹3500)"]),
    help_text: "Tatkaal requires mandatory 3 identity/address verifications.",
    weight: 20
  },

  // 5. Driving Licence
  {
    id: 501,
    document_id: 5,
    field_key: "age",
    question: "What is your current age and licence category required?",
    input_type: "select",
    options_json: JSON.stringify([
      "18+ years: Light Motor Vehicle (Car / Motorcycle with Gear)",
      "16-18 years: Motorcycle without gear (up to 50cc)",
      "20+ years: Commercial / Heavy Transport Vehicle"
    ]),
    help_text: "Minimum age varies by vehicle category.",
    weight: 30
  },
  {
    id: 502,
    document_id: 5,
    field_key: "learner_licence",
    question: "Do you possess a valid Learner's Licence (LL)?",
    input_type: "radio",
    options_json: JSON.stringify([
      "Yes, LL held for more than 30 days (Ready for DL Test)",
      "Yes, LL issued less than 30 days ago (Must wait 30 days)",
      "No, need to apply for Learner's Licence first"
    ]),
    help_text: "Permanent DL test can only be booked 30 days after LL issue date.",
    weight: 40
  },
  {
    id: 503,
    document_id: 5,
    field_key: "medical_fitness",
    question: "Do you meet the visual and medical fitness standards?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, fully fit (Self-declaration Form 1)", "Over 40 years (Form 1A signed by Registered Medical Practitioner)"]),
    help_text: "Medical certificate 1A is compulsory for applicants over 40.",
    weight: 30
  },

  // 6. Birth Certificate
  {
    id: 601,
    document_id: 6,
    field_key: "birth_place",
    question: "Where did the birth take place?",
    input_type: "select",
    options_json: JSON.stringify(["Hospital / Nursing Home (Institutional)", "At Home / Residence within city", "Vehicle / In-transit"]),
    help_text: "Hospitals report directly to the registrar.",
    weight: 30
  },
  {
    id: 602,
    document_id: 6,
    field_key: "time_elapsed",
    question: "How much time has elapsed since the date of birth?",
    input_type: "select",
    options_json: JSON.stringify(["Within 21 days (Standard - Free)", "21 to 30 days (Late fee applies)", "30 days to 1 year (Registrar approval)", "More than 1 year (Executive Magistrate order required)"]),
    help_text: "Registration after 1 year requires an SDM order and affidavit.",
    weight: 40
  },
  {
    id: 603,
    document_id: 6,
    field_key: "parents_id",
    question: "Do parents have valid government ID proofs (Aadhaar/Voter ID)?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, Aadhaar of both parents available", "Single parent / Guardian documents available"]),
    help_text: "Parent IDs must match hospital records.",
    weight: 30
  },

  // 7. Income Certificate
  {
    id: 701,
    document_id: 7,
    field_key: "state_residence",
    question: "Are you a permanent resident of the issuing state?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, resident of the state", "Temporary migrant / Non-resident"]),
    help_text: "Income certificate is issued by the local Tahsildar where you reside.",
    weight: 35
  },
  {
    id: 702,
    document_id: 7,
    field_key: "income_source",
    question: "What is your primary household source of income?",
    input_type: "select",
    options_json: JSON.stringify(["Salaried Employee (Form 16/Salary Slip)", "Self-Employed / Business (ITR / Self Declaration)", "Agriculture / Daily Wage (Patwari report / Affidavit)"]),
    help_text: "Documentary income evidence will be physically or digitally verified.",
    weight: 35
  },
  {
    id: 703,
    document_id: 7,
    field_key: "tax_filing",
    question: "Does any family member file Income Tax Returns?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, ITR acknowledgment available", "No, below taxable threshold"]),
    help_text: "ITR acknowledgment speeds up validation.",
    weight: 30
  },

  // 8. Community Certificate
  {
    id: 801,
    document_id: 8,
    field_key: "community_category",
    question: "Which caste / community category are you applying for?",
    input_type: "select",
    options_json: JSON.stringify(["Scheduled Caste (SC)", "Scheduled Tribe (ST)", "Other Backward Class (OBC)", "Economically Weaker Section (EWS)"]),
    help_text: "Category must be notified in the central/state Gazette.",
    weight: 30
  },
  {
    id: 802,
    document_id: 8,
    field_key: "paternal_proof",
    question: "Do you have community proof from your paternal lineage (Father, Grandfather, Paternal Uncle)?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, Father/Grandfather caste certificate available", "School Leaving Certificate with caste entry", "No paternal records available (Local Inquiry required)"]),
    help_text: "Caste is legally inherited from the father's bloodline in Indian law.",
    weight: 45
  },
  {
    id: 803,
    document_id: 8,
    field_key: "creamy_layer",
    question: "If applying for OBC, is your family's annual income below ₹8 Lakhs?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, below ₹8 Lakhs (Non-Creamy Layer - Eligible for reservation)", "Above ₹8 Lakhs (Creamy Layer)", "Not applicable (SC/ST/EWS)"]),
    help_text: "Non-creamy layer certificate requires income verification.",
    weight: 25
  },

  // 9. Domicile Certificate
  {
    id: 901,
    document_id: 9,
    field_key: "residency_period",
    question: "How long have you continuously resided in your current state?",
    input_type: "select",
    options_json: JSON.stringify(["More than 15 years", "10 to 15 years", "5 to 10 years", "Less than 5 years"]),
    help_text: "Most states mandate 5 to 15 years continuous domicile.",
    weight: 40
  },
  {
    id: 902,
    document_id: 9,
    field_key: "schooling_history",
    question: "Did you complete primary/secondary schooling in this state?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, studied 10+ years in state schools", "Studied partially in state", "Schooling outside state"]),
    help_text: "School study records provide solid proof of domicile.",
    weight: 30
  },
  {
    id: 903,
    document_id: 9,
    field_key: "property_records",
    question: "Does your family own residential property or land in the state?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, owned residential property / 7/12 extract", "Living in rented premises with registered agreement"]),
    help_text: "Property ownership strengthens your residence claim.",
    weight: 30
  },

  // 10. Ration Card
  {
    id: 1001,
    document_id: 10,
    field_key: "card_type",
    question: "Which category of Ration Card are you applying for?",
    input_type: "select",
    options_json: JSON.stringify([
      "Antyodaya Anna Yojana (AAY - Poorest households)",
      "Priority Household (PHH / BPL)",
      "Non-Priority Household (NPHH / APL - White card)"
    ]),
    help_text: "Category determines quota and subsidy pricing.",
    weight: 35
  },
  {
    id: 1002,
    document_id: 10,
    field_key: "existing_card",
    question: "Are your family members listed on any other active Ration Card anywhere in India?",
    input_type: "radio",
    options_json: JSON.stringify(["No, not registered on any card", "Yes, need surrender certificate from previous state/district"]),
    help_text: "One Nation One Ration Card requires surrender of previous card.",
    weight: 35
  },
  {
    id: 1003,
    document_id: 10,
    field_key: "gas_connection",
    question: "Do you have an active LPG cooking gas connection?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, PM Ujjwala Yojana connection", "Yes, Commercial/General connection", "No LPG connection"]),
    help_text: "LPG consumer number must be mapped to prevent dual subsidies.",
    weight: 30
  },

  // 11. Marriage Certificate
  {
    id: 1101,
    document_id: 11,
    field_key: "legal_age",
    question: "Were the Groom at least 21 years old and Bride at least 18 years old at the time of marriage?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, Groom ≥ 21 and Bride ≥ 18", "No, below statutory age"]),
    help_text: "Statutory marriage ages are strictly enforced under Indian law.",
    weight: 40
  },
  {
    id: 1102,
    document_id: 11,
    field_key: "marriage_ceremony",
    question: "Has the marriage ceremony already taken place?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, solemnized in Temple/Gurudwara/Church/Mosque (Registration under Section 8)", "No, intending to register court marriage under Special Marriage Act (30-day notice)"]),
    help_text: "Religious marriages can be registered post-ceremony immediately.",
    weight: 30
  },
  {
    id: 1103,
    document_id: 11,
    field_key: "witnesses",
    question: "Can two to three adult witnesses who attended the wedding be present with ID proofs?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, 3 adult witnesses with Aadhaar ready", "Witnesses available remotely/online"]),
    help_text: "Physical appearance of witnesses is required before Registrar.",
    weight: 30
  },

  // 12. Death Certificate
  {
    id: 1201,
    document_id: 12,
    field_key: "event_location",
    question: "Where did the demise occur?",
    input_type: "select",
    options_json: JSON.stringify(["At Hospital / Medical Institution", "At Home / Residence", "Public Place / Unnatural cause (Police Inquest)"]),
    help_text: "Hospital provides medical certification Form 4.",
    weight: 35
  },
  {
    id: 1202,
    document_id: 12,
    field_key: "time_since_death",
    question: "Within how many days is this being reported?",
    input_type: "select",
    options_json: JSON.stringify(["Within 21 days (Standard registration)", "21 to 30 days (Late fee ₹2)", "30 days to 1 year (Health Officer permission)", "After 1 year (Executive Magistrate Order)"]),
    help_text: "Registration within 21 days is free and fastest.",
    weight: 35
  },
  {
    id: 1203,
    document_id: 12,
    field_key: "doctor_certificate",
    question: "Do you have the Medical Cause of Death Certificate or Cremation/Burial ground slip?",
    input_type: "radio",
    options_json: JSON.stringify(["Yes, Doctor's certificate & Cremation receipt available", "Only Cremation slip available", "Police Panchnama copy available"]),
    help_text: "Cremation/burial receipt is required by Municipal Registrar.",
    weight: 30
  }
];

const applicationGuides = [
  // 1. Aadhaar Card
  {
    id: 1001,
    document_id: 1,
    step_number: 1,
    step_title: "Locate & Book Appointment at Aadhaar Seva Kendra",
    step_description: "Visit the official myAadhaar portal (myaadhaar.uidai.gov.in) and select 'Book an Appointment'. Choose your city and select a convenient time slot at the nearest UIDAI Aadhaar Seva Kendra (ASK) or partner bank/post office.",
    icon_name: "Calendar",
    tips: "Booking an online appointment avoids long waiting queues at the enrollment center."
  },
  {
    id: 1002,
    document_id: 1,
    step_number: 2,
    step_title: "Assemble Original Proof Documents",
    step_description: "Gather original physical documents for Proof of Identity (Passport/PAN), Proof of Address (Electricity bill/Voter ID), and Date of Birth (Birth certificate/10th Marksheet). UIDAI operators will scan the originals and return them on the spot.",
    icon_name: "Files",
    tips: "Photocopies are not accepted; only original documents are scanned."
  },
  {
    id: 1003,
    document_id: 1,
    step_number: 3,
    step_title: "Biometric & Demographic Capture",
    step_description: "Visit the ASK center at your scheduled time. The certified operator will capture your 10 fingerprints, iris scan, live facial photograph, and input demographic details onto the secure ECMP terminal.",
    icon_name: "Camera",
    tips: "Ensure clear visibility and clean fingers to avoid biometric score rejection."
  },
  {
    id: 1004,
    document_id: 1,
    step_number: 4,
    step_title: "Collect Enrolment Slip (EID) & Track Status",
    step_description: "Receive the printed Acknowledgement Slip containing your 28-digit Enrolment ID (EID) and timestamp. Use this EID to track generation status online at myaadhaar.uidai.gov.in.",
    icon_name: "Receipt",
    tips: "Keep your EID slip safe until your physical PVC Aadhaar arrives via India Post."
  },

  // 2. PAN Card
  {
    id: 2001,
    document_id: 2,
    step_number: 1,
    step_title: "Choose Mode: Instant e-PAN or NSDL Form 49A",
    step_description: "If you have Aadhaar linked to a mobile number, use Income Tax e-Filing portal for a 10-minute Free Instant e-PAN. For a physical plastic card, visit the NSDL / Protean portal and select Application Type 'Form 49A'.",
    icon_name: "MousePointer",
    tips: "Instant e-PAN is 100% digitally valid and issued in under 10 minutes."
  },
  {
    id: 2002,
    document_id: 2,
    step_number: 2,
    step_title: "Fill Applicant Details & Parent Information",
    step_description: "Provide your full legal name matching Aadhaar, date of birth, gender, and father's name (or mother's name if single parent). Select whether you desire a physical card delivered.",
    icon_name: "UserCheck",
    tips: "Ensure your name spelling matches exactly with your Aadhaar records."
  },
  {
    id: 2003,
    document_id: 2,
    step_number: 3,
    step_title: "Online Fee Payment & e-Sign via Aadhaar OTP",
    step_description: "Pay the nominal fee of ₹107 via Net Banking, UPI, or Debit Card. Authenticate your submission using Aadhaar OTP e-Sign. No physical courier needed if e-KYC mode is chosen!",
    icon_name: "CreditCard",
    tips: "If selecting physical document submission, mail Form 49A to Protean NSDL Pune office."
  },
  {
    id: 2004,
    document_id: 2,
    step_number: 4,
    step_title: "Receive 15-Digit Acknowledgement & Download PAN",
    step_description: "Download the 15-digit acknowledgement number. Your digital e-PAN PDF will be emailed within 48 to 72 hours, and the tamper-proof physical card will be couriered in 10-15 business days.",
    icon_name: "Download",
    tips: "You can check dispatch status using your 15-digit acknowledgement on Protean portal."
  },

  // 3. Voter ID
  {
    id: 3001,
    document_id: 3,
    step_number: 1,
    step_title: "Register on ECI Voters Portal (voters.eci.gov.in)",
    step_description: "Open the Election Commission of India portal (voters.eci.gov.in) or download the ECIVoter Helpline App. Create an account with your mobile number and OTP verification.",
    icon_name: "Globe",
    tips: "You can also submit advance applications if turning 18 in the next quarter."
  },
  {
    id: 3002,
    document_id: 3,
    step_number: 2,
    step_title: "Fill Form 6 for New Voter Registration",
    step_description: "Click on 'Fill Form 6 - Application for New Voters'. Enter your State, District, Parliamentary and Assembly Constituency, personal name, date of birth, and complete residence address.",
    icon_name: "FileEdit",
    tips: "If shifting from another town, use Form 8 instead of Form 6 to transfer enrollment."
  },
  {
    id: 3003,
    document_id: 3,
    step_number: 3,
    step_title: "Upload Photo, Age & Address Proofs",
    step_description: "Upload passport-sized color photograph (under 2MB), Proof of Age (Aadhaar/10th Marksheet), and Proof of Residence. Declare any existing family member's EPIC number in the same house.",
    icon_name: "UploadCloud",
    tips: "Providing a family member's EPIC places you in the same polling booth."
  },
  {
    id: 3004,
    document_id: 3,
    step_number: 4,
    step_title: "BLO Verification & e-EPIC Digital Download",
    step_description: "Your local Booth Level Officer (BLO) will conduct a field verification at your address. Once approved by Electoral Registration Officer (ERO), download your digital e-EPIC immediately and receive your physical color card via speed post.",
    icon_name: "CheckCircle",
    tips: "e-EPIC PDF is legally identical to the physical voter ID card for voting."
  },

  // 4. Passport
  {
    id: 4001,
    document_id: 4,
    step_number: 1,
    step_title: "Create User Profile on Passport Seva Portal",
    step_description: "Navigate to passportindia.gov.in and click 'New User Registration'. Select your residential Passport Office jurisdiction and complete login authentication.",
    icon_name: "ShieldCheck",
    tips: "Beware of fake passport websites; ensure the URL ends with .gov.in."
  },
  {
    id: 4002,
    document_id: 4,
    step_number: 2,
    step_title: "Fill Online Passport Application (Form R)",
    step_description: "Select 'Apply for Fresh Passport / Reissue'. Fill demographic details, parent/spouse names, residential history for past 1 year, emergency contact, and two local references.",
    icon_name: "FileText",
    tips: "Double check spelling of names; modifications post-submission require fees."
  },
  {
    id: 4003,
    document_id: 4,
    step_number: 3,
    step_title: "Pay Fee & Schedule PSK / POPSK Appointment",
    step_description: "Pay the application fee (₹1,500 for normal 36 pages) through SBI e-Pay. Select your nearest Passport Seva Kendra (PSK) or Post Office PSK (POPSK) and book an appointment slot.",
    icon_name: "CreditCard",
    tips: "Print the Application Receipt containing Application Reference Number (ARN) and barcode."
  },
  {
    id: 4004,
    document_id: 4,
    step_number: 4,
    step_title: "Visit PSK for Counter A, B & C Processing",
    step_description: "Arrive at PSK 15 minutes before your slot with original documents. Proceed through Counter A (Biometrics & photo), Counter B (Verification officer), and Counter C (Granting officer).",
    icon_name: "MapPin",
    tips: "No need to bring photographs; live high-res photos are captured inside Counter A."
  },
  {
    id: 4005,
    document_id: 4,
    step_number: 5,
    step_title: "Police Verification & Speed Post Delivery",
    step_description: "The local police station will contact you to verify your residence and conduct background checks. Upon clearance, your passport booklet is printed and dispatched via India Post Speed Post.",
    icon_name: "Send",
    tips: "Keep original electricity bills and reference witnesses handy for police verification."
  },

  // 5. Driving Licence
  {
    id: 5001,
    document_id: 5,
    step_number: 1,
    step_title: "Apply for Learner's Licence (LL) on Parivahan Sarathi",
    step_description: "Visit parivahan.gov.in -> Drivers/Learners License. Select your State. Choose 'Apply for Learner Licence'. Complete Aadhaar authentication to take the online LL road safety test from home.",
    icon_name: "Award",
    tips: "With Aadhaar e-KYC, you don't need to visit RTO for the Learner Licence test in most states."
  },
  {
    id: 5002,
    document_id: 5,
    step_number: 2,
    step_title: "Hold LL for Mandatory 30 Days & Practice Driving",
    step_description: "Once your Learner's Licence is generated, practice driving with an experienced licensed driver accompanied by a visible 'L' sign. You become eligible for permanent DL test after 30 days.",
    icon_name: "Clock",
    tips: "Learner's Licence is valid for 6 months across India."
  },
  {
    id: 5003,
    document_id: 5,
    step_number: 3,
    step_title: "Book RTO Driving Skill Test Slot",
    step_description: "On Sarathi portal, select 'Apply for Driving Licence', enter your LL number, upload documents, pay test fees (approx ₹500-₹700), and pick your RTO driving test date.",
    icon_name: "CalendarCheck",
    tips: "Ensure vehicle used for the test is roadworthy with valid RC, Insurance, and PUC."
  },
  {
    id: 5004,
    document_id: 5,
    step_number: 4,
    step_title: "Appear for Driving Test & Receive Smart Card DL",
    step_description: "Perform the automated driving test (e.g. Track 8, H-track, reverse parking, gradient stop). Upon passing, your permanent Smart Card DL is dispatched to your registered address within 15 days.",
    icon_name: "Truck",
    tips: "Download your digital Driving Licence instantly on DigiLocker / mParivahan app."
  },

  // 6. Birth Certificate
  {
    id: 6001,
    document_id: 6,
    step_number: 1,
    step_title: "Obtain Hospital Discharge Summary / Birth Slip",
    step_description: "Collect the official birth slip / Form 1 from the medical officer of the hospital where delivery took place.",
    icon_name: "FilePlus",
    tips: "Check child's gender and parent names on the hospital discharge summary carefully."
  },
  {
    id: 6002,
    document_id: 6,
    step_number: 2,
    step_title: "Submit Registration at Local Municipal / CRS Office",
    step_description: "Submit Form 1 to the Registrar of Births & Deaths in the municipal ward or Gram Panchayat office within 21 days.",
    icon_name: "Building",
    tips: "Online registration is available on the Civil Registration System (crsorgi.gov.in) portal."
  },
  {
    id: 6003,
    document_id: 6,
    step_number: 3,
    step_title: "Verification & Name Inclusion",
    step_description: "The registrar records the birth entry. You can include the child's formal name during registration or within 12 months without penalty.",
    icon_name: "UserPlus",
    tips: "Adding the child's name early simplifies school admission and passport applications."
  },
  {
    id: 6004,
    document_id: 6,
    step_number: 4,
    step_title: "Download Digitally Signed Birth Certificate",
    step_description: "Download the digitally signed and QR-coded Birth Certificate from the state e-district / CRS portal or collect certified copies from the municipal ward.",
    icon_name: "FileCheck2",
    tips: "Obtain at least 3-5 certified stamped copies for future school and passport needs."
  },

  // 7. Income Certificate
  {
    id: 7001,
    document_id: 7,
    step_number: 1,
    step_title: "Access State e-District Portal",
    step_description: "Log in to your state's citizen service portal (e.g. Aaple Sarkar in Maharashtra, e-District Delhi/UP, Seva Sindhu in Karnataka, edistrict.gov.in).",
    icon_name: "Laptop",
    tips: "Keep your Aadhaar linked mobile ready for Aadhaar OTP e-authentication."
  },
  {
    id: 7002,
    document_id: 7,
    step_number: 2,
    step_title: "Complete Application & Income Details",
    step_description: "Fill applicant information, family tree, agricultural landholdings, business turnover, or salary details for the past financial year.",
    icon_name: "FileSpreadsheet",
    tips: "Include income of all earning family members staying in the same household."
  },
  {
    id: 7003,
    document_id: 7,
    step_number: 3,
    step_title: "Upload Supporting Proofs & Self-Declaration",
    step_description: "Upload Salary Slip / Form 16 / ITR, electricity bill, ration card, and signed self-declaration income affidavit.",
    icon_name: "Paperclip",
    tips: "Affidavit in prescribed format can be notarized or self-attested as per state rule."
  },
  {
    id: 7004,
    document_id: 7,
    step_number: 4,
    step_title: "Field Inspection & Certificate Issuance by Tahsildar",
    step_description: "The Village Accountant / Talathi / Revenue Inspector reviews the file and submits an inquiry report. Tahsildar issues the digitally signed certificate within 10-15 days.",
    icon_name: "CheckSquare",
    tips: "Income certificates typically have a validity period of 1 to 3 financial years."
  },

  // 8. Community Certificate
  {
    id: 8001,
    document_id: 8,
    step_number: 1,
    step_title: "Gather Paternal Lineage Community Evidence",
    step_description: "Locate community/caste certificates of Father, Grandfather, or Paternal Blood Relatives along with land revenue records / school leaving certificates showing caste entry.",
    icon_name: "FolderOpen",
    tips: "Caste cannot be claimed through maternal lineage in majority of states."
  },
  {
    id: 8002,
    document_id: 8,
    step_number: 2,
    step_title: "Apply Online via State Revenue / e-District Portal",
    step_description: "Submit caste certificate application on state portal. Enter caste sub-category and upload lineage documentary proofs.",
    icon_name: "FormInput",
    tips: "For OBC applications, attach non-creamy layer income evidence."
  },
  {
    id: 8003,
    document_id: 8,
    step_number: 3,
    step_title: "Verification by Revenue Inspector / Talathi",
    step_description: "Local revenue officer conducts neighborhood inquiry and verifies lineage against historical state caste registers.",
    icon_name: "SearchCheck",
    tips: "Keep original old revenue/school records available for physical inspection."
  },
  {
    id: 8004,
    document_id: 8,
    step_number: 4,
    step_title: "Issue of Barcoded Caste Certificate",
    step_description: "Download the barcoded, digitally signed Community Certificate issued by the Sub-Divisional Magistrate (SDM) or Tehsildar.",
    icon_name: "FileBadge",
    tips: "SC/ST certificates have lifetime validity; OBC non-creamy layer requires annual renewal."
  },

  // 9. Domicile Certificate
  {
    id: 9001,
    document_id: 9,
    step_number: 1,
    step_title: "Prepare Continuous Stay Proofs (10-15 Years)",
    step_description: "Collect school leaving certificates, college passing marks, electricity bills across consecutive years, or property title deeds demonstrating continuous domicile.",
    icon_name: "FolderCheck",
    tips: "Ensure document trail covers the minimum years mandated by your state."
  },
  {
    id: 9002,
    document_id: 9,
    step_number: 2,
    step_title: "Submit Domicile Application on e-District",
    step_description: "Fill domicile application on state e-district portal, upload residential proofs, and pay fee (₹30-₹50).",
    icon_name: "Send",
    tips: "Make sure you do not hold an active domicile certificate in another state."
  },
  {
    id: 9003,
    document_id: 9,
    step_number: 3,
    step_title: "Tehsildar Scrutiny & Approval",
    step_description: "Application is scrutinized by Executive Magistrate / Tehsildar office. After police/revenue verification, certificate is approved.",
    icon_name: "ShieldCheck",
    tips: "Track application status using your e-District Application Reference Number."
  },
  {
    id: 9004,
    document_id: 9,
    step_number: 4,
    step_title: "Download Permanent Domicile Certificate",
    step_description: "Download your permanent domicile certificate for state quota seats in engineering/medical counselling and state government recruitments.",
    icon_name: "DownloadCloud",
    tips: "Domicile certificates have lifetime validity unless residence is permanently shifted."
  },

  // 10. Ration Card
  {
    id: 10001,
    document_id: 10,
    step_number: 1,
    step_title: "Verify Family Member Aadhaar Linkage",
    step_description: "Ensure all family members to be listed on the ration card have valid Aadhaar cards without spelling discrepancies.",
    icon_name: "Users",
    tips: "Head of family is designated as the senior-most adult female in the household."
  },
  {
    id: 10002,
    document_id: 10,
    step_number: 2,
    step_title: "Submit Application on Food & Civil Supplies Portal",
    step_description: "Visit state Food & Civil Supplies portal (or nfsa.gov.in). Select 'New Ration Card' form, input family member details, LPG connection number, and income bracket.",
    icon_name: "FilePlus2",
    tips: "Attach surrender certificate if previously enrolled in another district."
  },
  {
    id: 10003,
    document_id: 10,
    step_number: 3,
    step_title: "FSO Inspection & Biometric Verification",
    step_description: "Food Supply Officer (FSO) visits household or conducts digital verification to validate economic status and dwelling condition.",
    icon_name: "HomeCheck",
    tips: "Be available during the scheduled inspection visit."
  },
  {
    id: 10004,
    document_id: 10,
    step_number: 4,
    step_title: "Collect Smart Ration Card & Map to Fair Price Shop",
    step_description: "Download electronic e-Ration card or collect Smart Card. Your card is mapped to the nearest Fair Price Shop (FPS) for Monthly grain quota under NFSA.",
    icon_name: "ShoppingBag",
    tips: "Under 'One Nation One Ration Card', you can lift foodgrains at any FPS across India."
  },

  // 11. Marriage Certificate
  {
    id: 11001,
    document_id: 11,
    step_number: 1,
    step_title: "Submit Marriage Notice / Registration on Revenue Portal",
    step_description: "Access your state's Marriage Registration Portal. Enter bride and groom biodata, marriage date, wedding venue, and priest/qazi details if solemnized.",
    icon_name: "Heart",
    tips: "For court marriage under Special Marriage Act, submit 30-day advance public notice."
  },
  {
    id: 11002,
    document_id: 11,
    step_number: 2,
    step_title: "Upload Wedding Photos & Witness IDs",
    step_description: "Upload joint wedding photograph, marriage invitation card, age proofs, and ID/address proofs of three adult witnesses.",
    icon_name: "Image",
    tips: "Make sure the joint photograph shows the marriage ceremony rituals."
  },
  {
    id: 11003,
    document_id: 11,
    step_number: 3,
    step_title: "Schedule Appointment with Marriage Registrar (ADM/SDM)",
    step_description: "Book an appointment date at the Sub-Registrar / SDM office in the jurisdiction where marriage occurred or where either party resided for 6+ months.",
    icon_name: "Calendar",
    tips: "Both husband, wife, and all three witnesses must appear together in person."
  },
  {
    id: 11004,
    document_id: 11,
    step_number: 4,
    step_title: "Sign Marriage Register & Collect Certificate",
    step_description: "Sign the statutory marriage register before the Registrar. Collect the government Marriage Certificate immediately, useful for spouse visa and joint asset registration.",
    icon_name: "FileCheck",
    tips: "Marriage certificate is mandatory for adding spouse name in Indian Passport."
  },

  // 12. Death Certificate
  {
    id: 12001,
    document_id: 12,
    step_number: 1,
    step_title: "Obtain Form 4 (Medical Cause of Death)",
    step_description: "Collect Form 4 (Institutional) or Form 4A (Home death) signed by attending physician certifying cause of demise.",
    icon_name: "FileSignature",
    tips: "Ensure accurate date and exact time of death are filled."
  },
  {
    id: 12002,
    document_id: 12,
    step_number: 2,
    step_title: "Submit Registration to Municipal / CRS Registrar",
    step_description: "Within 21 days, report event to Municipal Health Office / Gram Panchayat or online via Civil Registration System (crsorgi.gov.in).",
    icon_name: "Building2",
    tips: "Attach original cremation / burial ground slip with the application."
  },
  {
    id: 12003,
    document_id: 12,
    step_number: 3,
    step_title: "Verification & Entry in CRS National Portal",
    step_description: "Registrar records details into the vital records repository after verifying deceased's Aadhaar and applicant's relation.",
    icon_name: "Database",
    tips: "No fee is charged if registered within the 21-day legal window."
  },
  {
    id: 12004,
    document_id: 12,
    step_number: 4,
    step_title: "Collect Digitally Signed Death Certificate",
    step_description: "Download QR-coded certified copy from the state/CRS portal or collect certified physical copies for insurance claims and bank account settlements.",
    icon_name: "FileCheck2",
    tips: "Apply for 5-10 certified copies for insurance, banking, property, and tax clearances."
  }
];

const initialFaqs = [
  {
    id: 1,
    document_id: 1,
    category: "Aadhaar Card",
    question: "Can I update my mobile number or address in Aadhaar online?",
    answer: "You can update your residential address online at myaadhaar.uidai.gov.in using a valid Proof of Address document or Head of Family (HoF) consent. However, for mobile number, biometric, email, or photo updates, you must physically visit an Aadhaar Seva Kendra for biometric verification."
  },
  {
    id: 2,
    document_id: 1,
    category: "Aadhaar Card",
    question: "What is Baal Aadhaar and when does it need mandatory biometric updates?",
    answer: "Baal Aadhaar is a blue-colored Aadhaar card issued to children under 5 years without biometric data. Mandatory biometric updates (MBU) must be completed free of cost when the child attains 5 years of age and again at 15 years of age."
  },
  {
    id: 3,
    document_id: 2,
    category: "PAN Card",
    question: "What is the difference between Instant e-PAN and regular PAN?",
    answer: "Instant e-PAN is a paperless, digitally signed PAN card generated in under 10 minutes free of charge using Aadhaar e-KYC. It holds the same 100% legal validity under IT Act as a physical laminated PAN card. You can also order a physical plastic reprint later for just ₹50."
  },
  {
    id: 4,
    document_id: 2,
    category: "PAN Card",
    question: "Can a minor obtain a PAN card?",
    answer: "Yes, minors can apply for a PAN card through their parents or legal guardians as representative assessees. No photo or signature is printed on minor PAN cards; it displays 'Minor' in place of the photograph until they turn 18."
  },
  {
    id: 5,
    document_id: 3,
    category: "Voter ID",
    question: "How do I download my digital voter ID (e-EPIC)?",
    answer: "Visit voters.eci.gov.in, log in with your mobile number, and click on 'e-EPIC Download'. Enter your EPIC number or Form 6 Reference Number. Enter the OTP received on your registered mobile number to download the high-security PDF version of your Voter ID."
  },
  {
    id: 6,
    document_id: 4,
    category: "Passport",
    question: "What is Non-ECR category and who is eligible for it?",
    answer: "Non-ECR (Emigration Check Not Required) exempts citizens from obtaining emigration clearance when travelling abroad for employment. Anyone who has passed 10th standard (Matriculation) or higher, income tax payees, and persons above 50 years are automatically eligible for Non-ECR status."
  },
  {
    id: 7,
    document_id: 4,
    category: "Passport",
    question: "What is the difference between Normal and Tatkaal passport schemes?",
    answer: "Normal passport processing takes 15 to 30 days and costs ₹1,500. Tatkaal passport is an expedited scheme where the passport is dispatched within 1 to 3 working days with post-police verification at an additional fee of ₹2,000 (total ₹3,500). Tatkaal requires 3 mandatory supporting identity proofs."
  },
  {
    id: 8,
    document_id: 5,
    category: "Driving Licence",
    question: "Is Learner's Licence test available from home?",
    answer: "Yes! Under MoRTH contactless faceless services, if you authenticate using your Aadhaar card on parivahan.gov.in, you can take the online Learner's Licence test from the comfort of your home using your computer's webcam without visiting the RTO."
  },
  {
    id: 9,
    document_id: 6,
    category: "Birth Certificate",
    question: "What is the procedure for registering a birth after 1 year has passed?",
    answer: "For delayed birth registrations beyond 1 year, an order from an Executive Magistrate (SDM/Tahsildar) is mandatory along with an affidavit of non-registration, hospital discharge summary, and identity proofs of parents. A late fee is charged upon approval."
  },
  {
    id: 10,
    document_id: 7,
    category: "Income Certificate",
    question: "What is the validity period of an Income Certificate?",
    answer: "In most Indian states, an Income Certificate is valid for either 1 financial year or 3 financial years from the date of issuance. It is required annually for scholarships, fee concessions, and government welfare schemes."
  },
  {
    id: 11,
    document_id: 8,
    category: "Community Certificate",
    question: "What is the Non-Creamy Layer (NCL) certificate for OBC?",
    answer: "OBC Non-Creamy Layer certificate verifies that an OBC candidate's gross annual parental income is below ₹8 Lakhs (excluding agricultural income). It is mandatory to claim 27% OBC reservation in Central Government employment and educational admissions."
  },
  {
    id: 12,
    document_id: 9,
    category: "Domicile Certificate",
    question: "Can I have domicile certificates in two different states simultaneously?",
    answer: "No. A person can hold domicile in only one state at a time under Indian Law. Applying for a new domicile requires surrendering or superseding any previous domicile claim."
  },
  {
    id: 13,
    document_id: 10,
    category: "Ration Card",
    question: "How does One Nation One Ration Card (ONORC) work?",
    answer: "ONORC enables migrant beneficiaries to collect their subsidized food grains from any Fair Price Shop (FPS) across India using biometric Aadhaar authentication, without needing to change or re-register their ration card."
  },
  {
    id: 14,
    document_id: 11,
    category: "Marriage Certificate",
    question: "Is marriage registration compulsory in India?",
    answer: "Yes, the Supreme Court of India and state governments have made marriage registration compulsory. A marriage certificate is critical legal evidence for joint passports, spouse visas, bank nominee claims, and succession rights."
  },
  {
    id: 15,
    document_id: 12,
    category: "Death Certificate",
    question: "Why is a Death Certificate required and how soon should it be obtained?",
    answer: "A death certificate is essential to settle bank accounts, claim life insurance policies, transfer property titles, close credit lines, and claim family pensions. It should be registered within 21 days for prompt, fee-free issuance."
  }
];

const initialDemoApplications = [
  {
    id: 1,
    user_id: 1,
    document_id: 2, // PAN Card
    application_id: "APP-PAN-2026-89412",
    applied_date: "2026-08-15",
    state: "Maharashtra",
    status: "Approved",
    last_updated: "2026-08-22 14:30:00",
    notes: "Applied via Protean NSDL Instant e-PAN with Aadhaar e-KYC. Digital e-PAN received via email.",
    tracking_number: "NSDL88941249A"
  },
  {
    id: 2,
    user_id: 1,
    document_id: 4, // Passport
    application_id: "APP-PAS-2026-44109",
    applied_date: "2026-08-18",
    state: "Maharashtra",
    status: "In Review",
    last_updated: "2026-08-25 11:15:00",
    notes: "PSK Pune visit completed successfully at Counter A, B & C. Police verification scheduled for next Monday.",
    tracking_number: "PN2078491275926"
  },
  {
    id: 3,
    user_id: 1,
    document_id: 5, // Driving Licence
    application_id: "APP-DL-2026-11823",
    applied_date: "2026-08-01",
    state: "Maharashtra",
    status: "Completed",
    last_updated: "2026-08-20 16:45:00",
    notes: "Smart card DL delivered via Speed Post. Digital copy verified on DigiLocker.",
    tracking_number: "MH12-20260011823"
  },
  {
    id: 4,
    user_id: 1,
    document_id: 3, // Voter ID
    application_id: "APP-VOT-2026-67319",
    applied_date: "2026-08-24",
    state: "Maharashtra",
    status: "Submitted",
    last_updated: "2026-08-24 09:20:00",
    notes: "Form 6 submitted online on ECI Voters Portal. Waiting for BLO field verification.",
    tracking_number: "ECI-F6-2026-67319"
  },
  {
    id: 5,
    user_id: 1,
    document_id: 7, // Income Certificate
    application_id: "APP-INC-2026-30214",
    applied_date: "2026-08-25",
    state: "Maharashtra",
    status: "Draft",
    last_updated: "2026-08-25 18:00:00",
    notes: "Draft application saved with salary slips. Need to attach latest Form 16 before final submission.",
    tracking_number: "EDIST-MH-30214"
  }
];

const initialActivityLogs = [
  {
    id: 1,
    user_id: 1,
    action_type: "APPLICATION_APPROVED",
    title: "PAN Card Application Approved",
    description: "Your PAN Card application #APP-PAN-2026-89412 has been successfully verified and approved.",
    created_at: "2026-08-22 14:30:00"
  },
  {
    id: 2,
    user_id: 1,
    action_type: "STATUS_UPDATE",
    title: "Passport Application In Review",
    description: "Application #APP-PAS-2026-44109 updated to In Review following PSK verification.",
    created_at: "2026-08-25 11:15:00"
  },
  {
    id: 3,
    user_id: 1,
    action_type: "ELIGIBILITY_CHECK",
    title: "Checked Eligibility for Passport",
    description: "Evaluated dynamic eligibility for Passport (Tatkaal Scheme) - Score: 100% Eligible.",
    created_at: "2026-08-26 10:30:00"
  },
  {
    id: 4,
    user_id: 1,
    action_type: "APPLICATION_CREATED",
    title: "New Voter ID Application Submitted",
    description: "Submitted new Form 6 for Voter ID registration in Pune constituency.",
    created_at: "2026-08-24 09:20:00"
  }
];

const initialNotifications = [
  {
    id: 1,
    user_id: 1,
    title: "Passport Police Verification Alert",
    message: "Your local police officer from Shivajinagar station has been assigned for Passport #APP-PAS-2026-44109 verification.",
    type: "info",
    is_read: false,
    created_at: "2026-08-26 08:00:00"
  },
  {
    id: 2,
    user_id: 1,
    title: "Instant e-PAN Generated",
    message: "Your e-PAN is ready for immediate digital download and has been emailed to your registered address.",
    type: "success",
    is_read: false,
    created_at: "2026-08-22 14:35:00"
  },
  {
    id: 3,
    user_id: 1,
    title: "New Service Added: Driving Licence Renewal",
    message: "Explore contactless renewal guides for Driving Licences directly on CitizenDoc.",
    type: "update",
    is_read: true,
    created_at: "2026-08-20 10:00:00"
  }
];

module.exports = {
  initialDocuments,
  eligibilityQuestions,
  applicationGuides,
  initialFaqs,
  initialDemoApplications,
  initialActivityLogs,
  initialNotifications
};
