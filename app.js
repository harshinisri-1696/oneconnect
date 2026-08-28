/**
 * GOVSETU AI — SINGLE MODULE APPLICATION
 * No navigation, no multi-page routing.
 * One scrollable page: Jobs → Eligibility → Chat
 */

// ============================================================
// DATA
// ============================================================
const jobsDatabase = [
  {
    id: 'TNPSC-G4',
    title: 'TNPSC Group 4 (VAO, Junior Assistant, Typist)',
    titleTa: 'டிஎன்பிஎஸ்சி குரூப் 4 (கிராம நிர்வாக அலுவலர் & உதவியாளர்)',
    org: 'Tamil Nadu Public Service Commission',
    cat: 'state',
    vacancies: 6244,
    qualification: '10th / SSLC Pass',
    accepted_degrees: ['10th','12th','B.Com','B.Sc','B.A','B.E/B.Tech','Any Graduate'],
    min_age: 18, max_age: 32,
    min_pct: 35, min_exp: 0,
    salary: '₹19,500 – ₹62,000 (Level 8)',
    location: 'Tamil Nadu',
    end: '2026-09-02',
    url: 'https://www.tnpsc.gov.in',
    selection: 'Single Written Exam + Document Verification'
  },
  {
    id: 'SSC-CGL',
    title: 'SSC CGL 2026 (ASO, Inspector, Auditor)',
    titleTa: 'எஸ்எஸ்சி பட்டதாரி நிலைத் தேர்வு 2026',
    org: 'Staff Selection Commission (Central Govt)',
    cat: 'central',
    vacancies: 17727,
    qualification: "Any Bachelor's Degree",
    accepted_degrees: ['B.Com','B.Sc','B.A','B.E/B.Tech','MBBS','LLB','Any Graduate'],
    min_age: 18, max_age: 30,
    min_pct: 40, min_exp: 0,
    salary: '₹44,900 – ₹1,42,400 (Level 7)',
    location: 'All India',
    end: '2026-09-18',
    url: 'https://ssc.gov.in',
    selection: 'CBT Tier 1 & Tier 2 + Skill/Physical Test'
  },
  {
    id: 'SBI-PO',
    title: 'SBI Probationary Officer (PO) 2026',
    titleTa: 'எஸ்பிஐ புரொபேஷனரி ஆபிசர் 2026',
    org: 'State Bank of India',
    cat: 'banking',
    vacancies: 2000,
    qualification: "Any Bachelor's Degree",
    accepted_degrees: ['B.Com','B.Sc','B.A','B.E/B.Tech','BBA','Any Graduate'],
    min_age: 21, max_age: 30,
    min_pct: 50, min_exp: 0,
    salary: '₹65,780/month',
    location: 'All India',
    end: '2026-09-08',
    url: 'https://sbi.co.in/careers',
    selection: 'Prelims + Mains + GD & Interview'
  },
  {
    id: 'RRB-NTPC',
    title: 'RRB NTPC (Station Master, Goods Manager, Clerk)',
    titleTa: 'இந்திய ரயில்வே என்டிபிசி பணிகள்',
    org: 'Railway Recruitment Boards (Ministry of Railways)',
    cat: 'railway',
    vacancies: 11558,
    qualification: "Any Bachelor's Degree / 12th for Junior Posts",
    accepted_degrees: ['12th','B.Com','B.Sc','B.A','B.E/B.Tech','Any Graduate'],
    min_age: 18, max_age: 33,
    min_pct: 45, min_exp: 0,
    salary: '₹35,400 – ₹1,12,400 (Level 5/6)',
    location: 'All India',
    end: '2026-09-25',
    url: 'https://rrbapply.gov.in',
    selection: 'CBT 1 + CBT 2 + CBAT / Typing Test + Medical'
  },
  {
    id: 'TNPSC-ENGG',
    title: 'TNPSC Combined Engineering Services (Asst. Engineer)',
    titleTa: 'டிஎன்பிஎஸ்சி உதவிப் பொறியாளர் நேரடி தேர்வு',
    org: 'Tamil Nadu Public Service Commission',
    cat: 'state',
    vacancies: 1083,
    qualification: 'B.E / B.Tech in Engineering',
    accepted_degrees: ['B.E/B.Tech'],
    min_age: 21, max_age: 32,
    min_pct: 55, min_exp: 0,
    salary: '₹37,700 – ₹1,19,500 (Level 20)',
    location: 'Tamil Nadu',
    end: '2026-09-20',
    url: 'https://www.tnpsc.gov.in',
    selection: 'Written Exam (2 Papers) + Interview'
  }
];

let currentLanguage  = 'en';
let activeCat        = 'all';

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  populateJobSelect();
  renderJobCards(jobsDatabase);
  initCategoryBar();
  initGlobalSearch();
  initEligibilityForm();
});

// ============================================================
// JOB CARDS
// ============================================================
function renderJobCards(jobs) {
  const grid = document.getElementById('jobCardsGrid');
  const countEl = document.getElementById('jobCount');
  if (countEl) countEl.textContent = jobs.length;

  if (!jobs.length) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-2)">No matching jobs found.</div>`;
    return;
  }

  grid.innerHTML = jobs.map(j => {
    const title = currentLanguage === 'ta' ? j.titleTa : j.title;
    return `
      <div class="job-card">
        <div>
          <span class="job-cat-badge">${j.cat.toUpperCase()} • ${j.location}</span>
          <div class="job-title">${title}</div>
          <div class="job-org">${j.org}</div>
        </div>

        <div class="job-specs">
          <div class="spec">
            <span class="spec-lbl">Vacancies</span>
            <span class="spec-val accent">${j.vacancies.toLocaleString()} Posts</span>
          </div>
          <div class="spec">
            <span class="spec-lbl">Salary</span>
            <span class="spec-val">${j.salary}</span>
          </div>
          <div class="spec">
            <span class="spec-lbl">Qualification</span>
            <span class="spec-val">${j.qualification}</span>
          </div>
          <div class="spec">
            <span class="spec-lbl">Last Date</span>
            <span class="spec-val deadline">${j.end}</span>
          </div>
        </div>

        <div class="job-actions">
          <button class="btn btn-secondary btn-sm" onclick="prefillEligibility('${j.id}')">Check Eligibility</button>
          <a href="${j.url}" target="_blank" class="btn btn-primary btn-sm">Apply →</a>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================================
// CATEGORY FILTER
// ============================================================
function initCategoryBar() {
  document.querySelectorAll('.cat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeCat = chip.dataset.cat;
      applyFilters();
    });
  });
}

function applyFilters() {
  const q = (document.getElementById('globalSearchInput').value || '').toLowerCase();
  let results = activeCat === 'all'
    ? jobsDatabase
    : jobsDatabase.filter(j => j.cat === activeCat);

  if (q) {
    results = results.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.titleTa.toLowerCase().includes(q) ||
      j.org.toLowerCase().includes(q) ||
      j.qualification.toLowerCase().includes(q)
    );
  }
  renderJobCards(results);
}

// ============================================================
// GLOBAL SEARCH
// ============================================================
function initGlobalSearch() {
  const input = document.getElementById('globalSearchInput');
  if (!input) return;
  input.addEventListener('input', applyFilters);
}

// ============================================================
// ELIGIBILITY ENGINE
// ============================================================
function populateJobSelect() {
  const sel = document.getElementById('jobSelect');
  if (!sel) return;
  sel.innerHTML = jobsDatabase.map(j =>
    `<option value="${j.id}">${j.title} (${j.org})</option>`
  ).join('');
}

window.prefillEligibility = function(jobId) {
  const sel = document.getElementById('jobSelect');
  if (sel) sel.value = jobId;
  document.getElementById('eligibilitySection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  runEligibility();
};

function initEligibilityForm() {
  const form = document.getElementById('eligibilityForm');
  if (!form) return;
  form.addEventListener('submit', e => { e.preventDefault(); runEligibility(); });
}

function runEligibility() {
  const jobId      = document.getElementById('jobSelect').value;
  const userAge    = parseFloat(document.getElementById('userAge').value) || 0;
  const userDegree = document.getElementById('userDegree').value;
  const userPct    = parseFloat(document.getElementById('userPercentage').value) || 0;
  const userCat    = document.getElementById('userCategory').value;
  const userExp    = parseInt(document.getElementById('userExp').value, 10) || 0;
  const userState  = document.getElementById('userState').value;

  const job = jobsDatabase.find(j => j.id === jobId);
  if (!job) return;

  const relaxations = { General: 0, OBC: 3, SC: 5, ST: 5, PwD: 10 };
  const relax       = relaxations[userCat] || 0;
  const maxAge      = job.max_age + relax;

  const agePass  = userAge >= job.min_age && userAge <= maxAge;
  const degPass  = job.accepted_degrees.includes(userDegree) || userDegree === 'Any Graduate';
  const pctPass  = userPct >= job.min_pct;
  const expPass  = userExp >= job.min_exp;
  const locPass  = job.location === 'All India' || job.location.includes(userState);

  const diffs = [
    {
      criterion: 'Age Limit',
      required:  `${job.min_age} – ${job.max_age} yrs (+${relax} yrs ${userCat} = max ${maxAge})`,
      yours:     `${userAge} yrs`,
      pass:      agePass,
      note:      agePass
        ? `Your age (${userAge}) is within the allowable limit of ${maxAge} yrs.`
        : `Your age (${userAge}) exceeds the allowed maximum of ${maxAge} yrs.`
    },
    {
      criterion: 'Educational Qualification',
      required:  job.qualification,
      yours:     userDegree,
      pass:      degPass,
      note:      degPass
        ? `"${userDegree}" satisfies the minimum qualification.`
        : `"${userDegree}" does not match required qualification (${job.qualification}).`
    },
    {
      criterion: 'Minimum Percentage',
      required:  `${job.min_pct}%`,
      yours:     `${userPct}%`,
      pass:      pctPass,
      note:      pctPass
        ? `Your score (${userPct}%) clears the cutoff (${job.min_pct}%).`
        : `Score (${userPct}%) is below required cutoff (${job.min_pct}%).`
    },
    {
      criterion: 'Experience',
      required:  `${job.min_exp} Years (Fresher OK)`,
      yours:     `${userExp} Years`,
      pass:      expPass,
      note:      expPass ? 'Experience requirement satisfied.' : `Requires ${job.min_exp} yrs; you have ${userExp} yrs.`
    },
    {
      criterion: 'Location / Domicile',
      required:  job.location,
      yours:     userState,
      pass:      locPass,
      note:      locPass
        ? `Eligible under ${job.location} recruitment.`
        : 'State domicile requirement may restrict eligibility.'
    }
  ];

  const allPass    = diffs.every(d => d.pass);
  const failCount  = diffs.filter(d => !d.pass).length;
  const isNear     = failCount === 1;
  const statusCls  = allPass ? 'eligible' : (isNear ? 'near' : 'ineligible');
  const statusIcon = allPass
    ? '<polyline points="20 6 9 17 4 12"/>'
    : '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>';
  const failedNames = diffs.filter(d => !d.pass).map(d => d.criterion).join(', ');

  const container = document.getElementById('scorecardResult');
  container.className = `scorecard-result show ${statusCls}`;
  container.innerHTML = `
    <div class="sc-header">
      <div class="sc-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">${statusIcon}</svg>
      </div>
      <div>
        <div class="sc-title">
          ${allPass ? '✅ 100% Eligible' : (isNear ? '🟡 Near Match — Almost Eligible' : '❌ Not Eligible')}
          &nbsp;— ${job.title}
        </div>
        <div class="sc-sub">
          ${allPass
            ? 'You satisfy all official gazette conditions. Proceed to apply!'
            : isNear
              ? `Almost there! Failed on: ${failedNames}.`
              : `Failed on: ${failedNames}.`}
        </div>
      </div>
    </div>
    <table class="diff-table">
      <thead>
        <tr>
          <th>Criterion</th>
          <th>Required</th>
          <th>Your Profile</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        ${diffs.map(d => `
          <tr>
            <td><strong>${d.criterion}</strong></td>
            <td>${d.required}</td>
            <td><strong>${d.yours}</strong></td>
            <td>
              <span class="${d.pass ? 'pass' : 'fail'}">${d.pass ? '✓ PASS' : '✗ FAIL'}</span>
              <div class="diff-note">${d.note}</div>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  showToast(
    allPass ? 'You\'re Eligible! 🎉' : isNear ? 'Almost There!' : 'Not Eligible',
    allPass ? `You qualify for ${job.title}` : `Check the criteria breakdown below`,
    allPass ? 'success' : isNear ? 'warning' : 'error'
  );
}


// ============================================================
// TOAST
// ============================================================
function showToast(title, message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const colors = {
    success: '#16A34A',
    error:   '#DC2626',
    warning: '#F59E0B',
    info:    '#4169E1'
  };

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <div>
      <div class="toast-title">${title}</div>
      <div class="toast-body">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(30px)';
    setTimeout(() => toast.remove(), 260);
  }, 3500);
}
