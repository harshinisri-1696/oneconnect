/* ==========================================================================
   OneConnect - Core Interactive JavaScript Engine (Royal Blue & White Theme)
   ========================================================================== */

// 1. SCHEME DATASET
const SCHEMES_DATA = [
    {
        id: 'sch-1',
        title: 'Universal Citizen Health Shield',
        category: 'welfare',
        badgeText: 'Healthcare',
        benefit: '$5,000 / Year',
        eligibility: 'All Income Below $10k/yr',
        description: 'Comprehensive cash-less hospitalization coverage across 10,000+ impaneled hospitals nationwide for critical surgeries and treatments.',
        documents: ['Identity Proof (Aadhaar / ID Card)', 'Income Tax Certificate', 'Bank Account Passbook'],
        popular: true
    },
    {
        id: 'sch-2',
        title: 'Senior Golden Age Welfare Pension',
        category: 'welfare',
        badgeText: 'Welfare',
        benefit: '$250 / Month',
        eligibility: 'Citizens Aged 60+ Years',
        description: 'Direct cash transfer pension for elderly citizens ensuring financial dignity and monthly medical allowance.',
        documents: ['Age Verification Certificate', 'Bank Account Details', 'Residential Address Proof'],
        popular: false
    },
    {
        id: 'sch-3',
        title: 'PM Emergency Disaster Assistance Grant',
        category: 'welfare',
        badgeText: 'Welfare',
        benefit: 'Up to $2,000',
        eligibility: 'Disaster Affected Families',
        description: 'Immediate relief financial payout for families affected by floods, droughts, or severe climate calamities.',
        documents: ['Disaster Assessment Clearance', 'Local Revenue Officer Slip', 'Bank Details'],
        popular: true
    },
    {
        id: 'sch-4',
        title: 'National STEM Higher Education Fellowship',
        category: 'education',
        badgeText: 'Education',
        benefit: '100% Tuition + $800/mo',
        eligibility: 'Undergraduate STEM Students',
        description: 'Fully funded scholarship for meritorious students pursuing Bachelor & Masters degrees in Engineering, Science, & AI.',
        documents: ['12th Grade / College Marksheet', 'College Admission Offer Letter', 'Recommendation Letter'],
        popular: true
    },
    {
        id: 'sch-5',
        title: 'Free Student Digital Laptop Initiative',
        category: 'education',
        badgeText: 'Education',
        benefit: 'Free Laptop Device',
        eligibility: 'High School & College Students',
        description: 'Providing high-performance laptops and internet dongles to eligible students from rural and economically weaker sections.',
        documents: ['Student ID Card', 'Income Certificate Below $4,000/yr', 'School Bonafide Certificate'],
        popular: false
    },
    {
        id: 'sch-6',
        title: 'Tech Skills Bootcamp Certification Grant',
        category: 'education',
        badgeText: 'Skills',
        benefit: '$1,200 Course Voucher',
        eligibility: 'Unemployed Youth (18-30 yrs)',
        description: 'Subsidized coding, data analytics, and digital marketing bootcamps with guaranteed job placement assistance.',
        documents: ['Graduation Certificate / Resume', 'Identity Card'],
        popular: true
    },
    {
        id: 'sch-7',
        title: 'Farmer Green Solar Agriculture Pump Subsidy',
        category: 'business',
        badgeText: 'Agriculture',
        benefit: '80% Equipment Subsidy',
        eligibility: 'Small & Marginal Farmers',
        description: 'Financial subsidy to install off-grid solar water pumps for eco-friendly irrigation and zero electricity bill costs.',
        documents: ['Agricultural Land Records (7/12 extractor)', 'Electricity Connection NOC', 'Aadhaar Card'],
        popular: true
    },
    {
        id: 'sch-8',
        title: 'Zero-Collateral MSME Working Capital Loan',
        category: 'business',
        badgeText: 'Business',
        benefit: 'Loans up to $50,000',
        eligibility: 'Registered Small Businesses',
        description: 'Collateral-free business expansion loans with subsidized interest rates under sovereign credit guarantee scheme.',
        documents: ['Udyam/MSME Registration Certificate', '12 Months Bank Statement', 'GST Tax Filing Receipt'],
        popular: true
    },
    {
        id: 'sch-9',
        title: 'Women Entrepreneurship Seed Fund',
        category: 'business',
        badgeText: 'Business',
        benefit: '$15,000 Seed Grant',
        eligibility: 'Women-Led Early Startups',
        description: 'Seed capital grants and 6-month free incubator access for women founders launching innovative business ventures.',
        documents: ['Company Incorporation Proof', 'Pitch Deck / Business Proposal', 'Founders Identity Proof'],
        popular: false
    }
];

// MODULE BOX DATA FOR MODAL PREVIEWS
const MODULE_PREVIEW_DATA = {
    welfare: {
        title: 'Financial Welfare & Healthcare Subsidies Module',
        badgeClass: 'badge-welfare',
        badgeText: 'Welfare & Healthcare',
        icon: '🏦',
        documents: [
            'National Citizen Identity Card / Aadhaar',
            'Family Income Certificate issued by Revenue Authority',
            'Active Bank Account Passbook (Linked with Direct Benefit Transfer)',
            'Disability or Senior Citizen Certificate (where applicable)'
        ]
    },
    education: {
        title: 'Education, Scholarships & Youth Skills Module',
        badgeClass: 'badge-education',
        badgeText: 'Education & Youth',
        icon: '🎓',
        documents: [
            'Recent Academic Marksheets & Transcript',
            'Institutional Bonafide Student Certificate',
            'Family Income Certificate (Below $6,000/yr)',
            'Passport Size Photograph & Identity Proof'
        ]
    },
    business: {
        title: 'Business, Agriculture & MSME Subsidies Module',
        badgeClass: 'badge-business',
        badgeText: 'Business & Agriculture',
        icon: '🚜',
        documents: [
            'MSME Udyam / Business Registration License',
            'Agricultural Land Records (Khasra / Khatauni) for Farmer schemes',
            '12 Months Business Bank Account Statements',
            'Pan Card & GST Registration Certificate'
        ]
    }
};

// 2. STATE MANAGEMENT
let currentWizardStep = 1;
let currentModuleKey = 'welfare';
let bookmarkedSchemes = new Set(['sch-1', 'sch-4']);

// 3. INITIALIZATION ON DOM LOAD
document.addEventListener('DOMContentLoaded', () => {
    renderSchemeCatalog(SCHEMES_DATA);
    setupEventListeners();
    initTheme();
    animateCounters();
});

// RENDER SCHEME CARDS IN CATALOG
function renderSchemeCatalog(schemes) {
    const grid = document.getElementById('schemeGrid');
    if (!grid) return;

    if (schemes.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
                <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔍</div>
                <h3>No schemes match your filter</h3>
                <p style="color: var(--text-secondary); margin-top: 0.5rem;">Try searching for a different keyword or resetting your filter.</p>
                <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" onclick="filterCatalog('all', document.querySelector('.filter-btn'))">Reset Catalog Filters</button>
            </div>
        `;
        return;
    }

    grid.innerHTML = schemes.map(sch => {
        const isBookmarked = bookmarkedSchemes.has(sch.id);
        const badgeClass = sch.category === 'welfare' ? 'badge-welfare' : sch.category === 'education' ? 'badge-education' : 'badge-business';
        return `
            <div class="scheme-card" data-category="${sch.category}">
                <div class="scheme-card-top">
                    <span class="badge-tag ${badgeClass}">${sch.badgeText}</span>
                    <button class="bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="toggleBookmark('${sch.id}', this)" aria-label="Bookmark scheme">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    </button>
                </div>
                <h3 class="scheme-title">${sch.title}</h3>
                <p class="scheme-desc">${sch.description}</p>
                <div class="scheme-details-meta">
                    <div class="meta-item">
                        <span class="meta-label">Benefit Amount</span>
                        <span class="meta-value" style="color: var(--accent-emerald);">${sch.benefit}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Eligibility Criteria</span>
                        <span class="meta-value">${sch.eligibility}</span>
                    </div>
                </div>
                <button class="btn btn-secondary btn-sm" onclick="openModuleModal('${sch.category}', '${sch.id}')" style="width: 100%;">
                    Check Details & Apply &rarr;
                </button>
            </div>
        `;
    }).join('');
}

// FILTER CATALOG BY CATEGORY TAB
function filterCatalog(category, btnElement) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    if (category === 'all') {
        renderSchemeCatalog(SCHEMES_DATA);
    } else {
        const filtered = SCHEMES_DATA.filter(s => s.category === category);
        renderSchemeCatalog(filtered);
    }
}

// SEARCH & HERO CHIPS
function triggerSearch() {
    const query = document.getElementById('heroSearchInput').value.trim().toLowerCase();
    if (!query) {
        renderSchemeCatalog(SCHEMES_DATA);
        return;
    }

    const filtered = SCHEMES_DATA.filter(s => 
        s.title.toLowerCase().includes(query) || 
        s.description.toLowerCase().includes(query) ||
        s.badgeText.toLowerCase().includes(query) ||
        s.benefit.toLowerCase().includes(query)
    );

    renderSchemeCatalog(filtered);

    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
}

function filterChip(chipText) {
    document.getElementById('heroSearchInput').value = chipText;
    triggerSearch();
}

// SETUP EVENT LISTENERS
function setupEventListeners() {
    const searchInput = document.getElementById('heroSearchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') triggerSearch();
        });
    }

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
}

// 4. INTERACTIVE MODULE BOX MODAL (Box for next three pages)
function openModuleModal(categoryKey, preselectedSchemeId = null) {
    currentModuleKey = categoryKey;
    const data = MODULE_PREVIEW_DATA[categoryKey] || MODULE_PREVIEW_DATA.welfare;

    document.getElementById('modalModuleIcon').innerText = data.icon;
    document.getElementById('modalModuleTitle').innerText = data.title;
    
    const badge = document.getElementById('modalModuleBadge');
    badge.className = `badge-tag ${data.badgeClass}`;
    badge.innerText = data.badgeText;

    // Populate Tab 1: Schemes List
    const categorySchemes = SCHEMES_DATA.filter(s => s.category === categoryKey);
    const container = document.getElementById('modalSchemesContainer');
    container.innerHTML = categorySchemes.map(sch => `
        <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-glass);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <h4 style="font-size: 1.05rem;">${sch.title}</h4>
                <span style="color: var(--accent-emerald); font-weight: 700; font-size: 0.9rem;">${sch.benefit}</span>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 0.75rem;">${sch.description}</p>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
                <strong>Eligibility:</strong> ${sch.eligibility}
            </div>
        </div>
    `).join('');

    // Populate Tab 2: Document Checklist
    const docList = document.getElementById('modalDocumentList');
    docList.innerHTML = data.documents.map(doc => `
        <li style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg-surface-elevated); padding: 0.85rem 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span style="font-size: 0.9rem; color: var(--text-primary);">${doc}</span>
        </li>
    `).join('');

    // Populate Tab 3: Scheme Select Dropdown
    const select = document.getElementById('modalSchemeSelect');
    select.innerHTML = categorySchemes.map(s => `
        <option value="${s.title}" ${s.id === preselectedSchemeId ? 'selected' : ''}>${s.title} (${s.benefit})</option>
    `).join('');

    // Reset Tabs
    switchModalTab('schemes', document.querySelector('.modal-tab-btn'));

    // Open Modal
    document.getElementById('moduleModalBackdrop').classList.add('open');
}

function closeModuleModal() {
    document.getElementById('moduleModalBackdrop').classList.remove('open');
}

function switchModalTab(tabId, btnElement) {
    document.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    document.querySelectorAll('.modal-tab-content').forEach(content => content.classList.remove('active'));
    
    if (tabId === 'schemes') document.getElementById('modalTabSchemes').classList.add('active');
    if (tabId === 'checklist') document.getElementById('modalTabChecklist').classList.add('active');
    if (tabId === 'applyDemo') document.getElementById('modalTabApplyDemo').classList.add('active');
}

// DEMO APPLICATION SUBMISSION
function submitDemoApplication(event) {
    event.preventDefault();
    const schemeTitle = document.getElementById('modalSchemeSelect').value;
    const trackingId = 'ONE-2026-' + Math.floor(1000 + Math.random() * 9000);

    closeModuleModal();

    showToast(`Application submitted! Tracking ID: ${trackingId}`, 'success');

    // Populate Tracker Widget
    document.getElementById('trackerInput').value = trackingId;
    document.getElementById('appRefDisplay').innerText = trackingId;
    document.getElementById('appSchemeDisplay').innerText = schemeTitle;

    // Scroll to tracker
    document.getElementById('tracker').scrollIntoView({ behavior: 'smooth' });
}

// 5. INTERACTIVE ELIGIBILITY WIZARD
function openEligibilityWizard() {
    document.getElementById('eligibility').scrollIntoView({ behavior: 'smooth' });
}

function navigateWizard(direction) {
    const nextStep = currentWizardStep + direction;
    if (nextStep < 1 || nextStep > 4) return;

    document.getElementById(`wizardStep${currentWizardStep}`).classList.remove('active');
    document.getElementById(`stepIndicator${currentWizardStep}`).classList.remove('active');
    
    if (direction > 0) {
        document.getElementById(`stepIndicator${currentWizardStep}`).classList.add('completed');
    } else {
        document.getElementById(`stepIndicator${currentWizardStep}`).classList.remove('completed');
    }

    currentWizardStep = nextStep;

    document.getElementById(`wizardStep${currentWizardStep}`).classList.add('active');
    document.getElementById(`stepIndicator${currentWizardStep}`).classList.add('active');

    // Manage Buttons State
    const prevBtn = document.getElementById('wizardPrevBtn');
    const nextBtn = document.getElementById('wizardNextBtn');

    prevBtn.style.visibility = currentWizardStep === 1 ? 'hidden' : 'visible';
    
    if (currentWizardStep === 4) {
        nextBtn.style.display = 'none';
        calculateWizardMatches();
    } else {
        nextBtn.style.display = 'inline-flex';
        nextBtn.innerHTML = currentWizardStep === 3 ? 'Calculate Eligible Schemes 🎉' : 'Next Step &rarr;';
    }
}

function calculateWizardMatches() {
    const selectedNeed = document.querySelector('input[name="wizardNeed"]:checked')?.value || 'healthcare';
    
    let matched = SCHEMES_DATA;
    if (selectedNeed === 'healthcare') matched = SCHEMES_DATA.filter(s => s.category === 'welfare');
    else if (selectedNeed === 'education') matched = SCHEMES_DATA.filter(s => s.category === 'education');
    else matched = SCHEMES_DATA.filter(s => s.category === 'business');

    document.getElementById('wizardMatchCount').innerText = `${matched.length} Eligible Schemes`;

    const list = document.getElementById('wizardMatchedList');
    list.innerHTML = matched.map(sch => `
        <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-glass);">
            <div style="font-weight: 700; font-size: 0.95rem;">${sch.title}</div>
            <div style="color: var(--accent-emerald); font-weight: 700; font-size: 0.85rem; margin: 0.25rem 0;">${sch.benefit}</div>
            <button class="btn btn-primary btn-sm" style="margin-top: 0.5rem; width: 100%;" onclick="openModuleModal('${sch.category}', '${sch.id}')">Apply Now</button>
        </div>
    `).join('');
}

// 6. APPLICATION TRACKER LOGIC
function trackApplication(event) {
    event.preventDefault();
    const ref = document.getElementById('trackerInput').value.trim();
    if (!ref) return;

    document.getElementById('appRefDisplay').innerText = ref;
    showToast(`Status loaded for ${ref}`, 'success');
}

// 7. BOOKMARK TOGGLE
function toggleBookmark(schemeId, btnElement) {
    if (bookmarkedSchemes.has(schemeId)) {
        bookmarkedSchemes.delete(schemeId);
        btnElement.classList.remove('bookmarked');
        btnElement.querySelector('svg').setAttribute('fill', 'none');
        showToast('Scheme removed from saved bookmarks', 'error');
    } else {
        bookmarkedSchemes.add(schemeId);
        btnElement.classList.add('bookmarked');
        btnElement.querySelector('svg').setAttribute('fill', 'currentColor');
        showToast('Scheme saved to bookmarks!', 'success');
    }
}

// 8. TOAST SYSTEM
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// 9. THEME TOGGLE
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

function updateThemeIcons(theme) {
    const sunIcon = document.getElementById('sunIcon');
    const moonIcon = document.getElementById('moonIcon');
    if (sunIcon && moonIcon) {
        if (theme === 'light') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
}

// 10. COUNTER ANIMATION
function animateCounters() {
    const stats = [
        { id: 'statSchemes', end: 520, suffix: '+' },
        { id: 'statBeneficiaries', end: 14.8, suffix: 'M', isFloat: true },
        { id: 'statSubsidies', prefix: '$', end: 6.4, suffix: 'B', isFloat: true }
    ];

    stats.forEach(st => {
        const el = document.getElementById(st.id);
        if (!el) return;
        let start = 0;
        const duration = 1500;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = st.end / steps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= st.end) {
                start = st.end;
                clearInterval(timer);
            }
            const val = st.isFloat ? start.toFixed(1) : Math.floor(start);
            el.innerText = `${st.prefix || ''}${val}${st.suffix || ''}`;
        }, stepTime);
    });
}
