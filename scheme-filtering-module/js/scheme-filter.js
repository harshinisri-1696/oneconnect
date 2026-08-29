/**
 * Scheme Filtering Module - Core Logic and Filter Interface
 * Handles state management, search, drop-down filters, dynamic chips, and eligibility assessment.
 */

(function(window) {
  'use strict';

  class SchemeModule {
    constructor(options = {}) {
      // Root container selector or DOM element
      this.container = typeof options.container === 'string'
        ? document.querySelector(options.container)
        : options.container;

      if (!this.container) {
        console.error('SchemeModule: target container element not found.');
        return;
      }

      // Dataset and Profile input configuration
      this.dataset = options.dataset || [];
      this.profile = options.profile || {};
      this.onFilterChange = options.onFilterChange || null;
      this.onSchemeSelect = options.onSchemeSelect || null;

      // Filter and Pagination state
      this.state = {
        searchQuery: '',
        categories: [],
        locations: [],
        ageGroup: 'ALL',
        beneficiaryTypes: [],
        incomeRange: 'ALL',
        benefitTypes: [],
        eligibilityStatus: 'ALL',
        sortBy: 'relevance',
        currentPage: 1,
        pageSize: 12
      };

      this.debounceTimer = null;
      this.elements = {};
      this.filteredSchemes = [];
      
      this.init();
    }

    init() {
      // 1. Render Skeleton Layout inside target container
      this.renderSkeleton();
      
      // 2. Cache elements
      this.cacheElements();
      
      // 3. Bind event listeners for filter controls
      this.bindEvents();
      
      // 4. Initialize results listing component (attached to window)
      if (typeof window.initSchemeResults === 'function') {
        this.resultsComponent = window.initSchemeResults(this);
      } else {
        console.warn('SchemeModule: window.initSchemeResults function not found.');
      }

      // 5. Initialize chatbot component (if chatbot.js is loaded before scheme-filter.js)
      if (typeof window.initSchemeChatbot === 'function') {
        this.chatbot = window.initSchemeChatbot(this);
      } else {
        this.chatbot = null;
      }

      // 6. Execute initial filtering pipeline
      this.applyFilters();
    }

    renderSkeleton() {
      this.container.innerHTML = `
        <div class="scheme-filter-module">
          <!-- Filtering Card -->
          <div class="scheme-filter-card">
            <!-- Search Input Row -->
            <div class="scheme-filter-search-row">
              <div class="scheme-filter-search-wrapper">
                <svg class="scheme-filter-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input type="text" class="scheme-filter-search-input" id="sfSearchInput" placeholder="Search schemes by name, keyword, category, or description...">
              </div>
              <button type="button" class="scheme-filter-btn scheme-filter-btn-secondary scheme-filter-mobile-toggle" id="sfMobileToggleBtn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                Filters
              </button>
            </div>

            <!-- Dropdown Filters Grid -->
            <div class="scheme-filter-controls-grid" id="sfControlsGrid">
              <!-- Category -->
              <div class="scheme-filter-group">
                <label class="scheme-filter-label" for="sfCategorySelect">Category</label>
                <select class="scheme-filter-select" id="sfCategorySelect">
                  <option value="">All Categories</option>
                  <option value="Education">Education & Learning</option>
                  <option value="Health">Health & Wellness</option>
                  <option value="Employment">Employment & Skills</option>
                  <option value="Agriculture">Agriculture & Rural</option>
                  <option value="Women">Women & Children</option>
                  <option value="Social welfare">Social Welfare & Empowerment</option>
                  <option value="Business">Business & Entrepreneurship</option>
                  <option value="Banking">Banking & Financial Services</option>
                  <option value="Housing">Housing & Shelter</option>
                </select>
              </div>

              <!-- Location / State -->
              <div class="scheme-filter-group">
                <label class="scheme-filter-label" for="sfLocationSelect">Location / State</label>
                <select class="scheme-filter-select" id="sfLocationSelect">
                  <option value="">All Locations</option>
                  <option value="Central">Central Government</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Puducherry">Puducherry</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Gujarat">Gujarat</option>
                </select>
              </div>

              <!-- Age Group -->
              <div class="scheme-filter-group">
                <label class="scheme-filter-label" for="sfAgeSelect">Age Group</label>
                <select class="scheme-filter-select" id="sfAgeSelect">
                  <option value="ALL">All Ages</option>
                  <option value="CHILDREN">Children (<18 yrs)</option>
                  <option value="YOUTH">Youth (18–35 yrs)</option>
                  <option value="ADULT">Adults (36–59 yrs)</option>
                  <option value="SENIOR">Senior Citizens (60+ yrs)</option>
                </select>
              </div>

              <!-- Beneficiary Type -->
              <div class="scheme-filter-group">
                <label class="scheme-filter-label" for="sfBeneficiarySelect">Beneficiary Type</label>
                <select class="scheme-filter-select" id="sfBeneficiarySelect">
                  <option value="">All Beneficiaries</option>
                  <option value="student">Student</option>
                  <option value="farmer">Farmer</option>
                  <option value="women">Women</option>
                  <option value="senior">Senior Citizen</option>
                  <option value="disability">Person with Disability</option>
                  <option value="job seeker">Job Seeker</option>
                  <option value="entrepreneur">Small Business / MSME</option>
                </select>
              </div>

              <!-- Income Range -->
              <div class="scheme-filter-group">
                <label class="scheme-filter-label" for="sfIncomeSelect">Income Range</label>
                <select class="scheme-filter-select" id="sfIncomeSelect">
                  <option value="ALL">Any Income</option>
                  <option value="BELOW_1L">Below ₹1 Lakh</option>
                  <option value="BELOW_3L">Below ₹3 Lakhs</option>
                </select>
              </div>

              <!-- Benefit Type -->
              <div class="scheme-filter-group">
                <label class="scheme-filter-label" for="sfBenefitSelect">Benefit Type</label>
                <select class="scheme-filter-select" id="sfBenefitSelect">
                  <option value="">All Benefit Types</option>
                  <option value="financial">Financial Assistance</option>
                  <option value="scholarship">Scholarship & Stipend</option>
                  <option value="health">Healthcare & Insurance</option>
                  <option value="training">Training & Skill Support</option>
                  <option value="subsidy">Subsidies & Credit</option>
                </select>
              </div>

              <!-- Eligibility Status -->
              <div class="scheme-filter-group">
                <label class="scheme-filter-label" for="sfEligibilitySelect">Eligibility Status</label>
                <select class="scheme-filter-select" id="sfEligibilitySelect">
                  <option value="ALL">All Statuses</option>
                  <option value="ELIGIBLE">🟢 Eligible Only</option>
                  <option value="NOT_ELIGIBLE">🔴 Not Eligible</option>
                  <option value="INFO_REQUIRED">🟠 Information Required</option>
                </select>
              </div>

              <!-- Reset Actions -->
              <div class="scheme-filter-group scheme-filter-actions-group">
                <button type="button" class="scheme-filter-btn scheme-filter-btn-secondary" id="sfClearFiltersBtn">
                  Clear All
                </button>
              </div>
            </div>
          </div>

          <!-- Active Filter Chips Area -->
          <div class="scheme-filter-chips-wrapper" id="sfChipsContainer" style="display: none;"></div>

          <!-- Results Summary Panel -->
          <div class="scheme-results-bar">
            <span class="scheme-results-count" id="sfResultsCount">0 schemes found</span>
            <div class="scheme-results-sort-wrapper">
              <label for="sfSortSelect">Sort By:</label>
              <select class="scheme-filter-select scheme-results-sort-select" id="sfSortSelect">
                <option value="relevance">Relevance & Match</option>
                <option value="personalized">Personalized (Eligible First)</option>
                <option value="name_asc">Scheme Name (A-Z)</option>
                <option value="name_desc">Scheme Name (Z-A)</option>
              </select>
            </div>
          </div>

          <!-- Results Card Grid -->
          <div class="scheme-filter-grid" id="sfGrid"></div>

          <!-- Empty State Panel -->
          <div class="scheme-filter-empty-state" id="sfEmptyState" style="display: none;">
            <div class="scheme-filter-empty-graphic">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="scheme-filter-empty-title">No schemes match your filters</h3>
            <p class="scheme-filter-empty-desc">Try clearing your filters or changing your search terms to view other public welfare schemes.</p>
            <button type="button" class="scheme-filter-btn scheme-filter-btn-primary" id="sfResetEmptyStateBtn">
              Clear All Filters
            </button>
          </div>

          <!-- Pagination Bar -->
          <div class="scheme-filter-pagination" id="sfPagination" style="display: none;"></div>
        </div>
      `;
    }

    cacheElements() {
      const root = this.container;
      this.elements = {
        searchInput: root.querySelector('#sfSearchInput'),
        categorySelect: root.querySelector('#sfCategorySelect'),
        locationSelect: root.querySelector('#sfLocationSelect'),
        ageSelect: root.querySelector('#sfAgeSelect'),
        beneficiarySelect: root.querySelector('#sfBeneficiarySelect'),
        incomeSelect: root.querySelector('#sfIncomeSelect'),
        benefitSelect: root.querySelector('#sfBenefitSelect'),
        eligibilitySelect: root.querySelector('#sfEligibilitySelect'),
        sortSelect: root.querySelector('#sfSortSelect'),

        clearAllBtn: root.querySelector('#sfClearFiltersBtn'),
        mobileToggleBtn: root.querySelector('#sfMobileToggleBtn'),
        controlsGrid: root.querySelector('#sfControlsGrid'),
        chipsContainer: root.querySelector('#sfChipsContainer'),
        resultsCount: root.querySelector('#sfResultsCount'),
        grid: root.querySelector('#sfGrid'),
        emptyState: root.querySelector('#sfEmptyState'),
        resetEmptyBtn: root.querySelector('#sfResetEmptyStateBtn'),
        pagination: root.querySelector('#sfPagination')
      };
    }

    bindEvents() {
      const el = this.elements;

      // Search field input change (debounced)
      if (el.searchInput) {
        el.searchInput.addEventListener('input', (e) => {
          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => {
            this.state.searchQuery = e.target.value.trim();
            this.state.currentPage = 1;
            this.applyFilters();
          }, 250);
        });
      }

      // Individual dropdown changes
      const dropdowns = [
        { elem: el.categorySelect, stateKey: 'categories', isArray: true },
        { elem: el.locationSelect, stateKey: 'locations', isArray: true },
        { elem: el.ageSelect, stateKey: 'ageGroup', isArray: false },
        { elem: el.beneficiarySelect, stateKey: 'beneficiaryTypes', isArray: true },
        { elem: el.incomeSelect, stateKey: 'incomeRange', isArray: false },
        { elem: el.benefitSelect, stateKey: 'benefitTypes', isArray: true },
        { elem: el.eligibilitySelect, stateKey: 'eligibilityStatus', isArray: false },
        { elem: el.sortSelect, stateKey: 'sortBy', isArray: false }
      ];

      dropdowns.forEach(dd => {
        if (dd.elem) {
          dd.elem.addEventListener('change', (e) => {
            const value = e.target.value;
            if (dd.isArray) {
              this.state[dd.stateKey] = value ? [value] : [];
            } else {
              this.state[dd.stateKey] = value;
            }
            this.state.currentPage = 1;
            this.applyFilters();
          });
        }
      });

      // Clear all buttons
      if (el.clearAllBtn) {
        el.clearAllBtn.addEventListener('click', () => this.resetFilters());
      }
      if (el.resetEmptyBtn) {
        el.resetEmptyBtn.addEventListener('click', () => this.resetFilters());
      }

      // Mobile toggling of filter panel
      if (el.mobileToggleBtn && el.controlsGrid) {
        el.mobileToggleBtn.addEventListener('click', () => {
          el.controlsGrid.classList.toggle('scheme-filter-mobile-open');
          el.mobileToggleBtn.classList.toggle('active');
        });
      }
    }

    // ==========================================
    // ELIGIBILITY EVALUATOR ENGINE
    // ==========================================
    evaluateEligibility(scheme) {
      const p = this.profile || {};
      const text = ((scheme.eligibility || '') + ' ' + (scheme.details || '') + ' ' + (scheme.name || '')).toLowerCase();
      const tags = (scheme.tags || []).map(t => t.toLowerCase());

      // 1. Location / State Check
      if (scheme.level === 'State') {
        if (!p.state) {
          return {
            status: 'INFO_REQUIRED',
            badgeClass: 'status-info-required',
            label: '🟠 INFO REQUIRED',
            reason: 'Missing profile location (State required).'
          };
        }
        
        const knownStates = ['puducherry', 'kerala', 'karnataka', 'maharashtra', 'delhi', 'uttar pradesh', 'gujarat', 'rajasthan', 'west bengal', 'bihar', 'punjab', 'haryana', 'tamil nadu', 'madhya pradesh', 'andhra pradesh'];
        const lowerState = p.state.toLowerCase();
        
        // If text mentions some other state but doesn't mention user state, mark as Not Eligible
        const mentionsOtherState = knownStates.some(st => st !== lowerState && text.includes(st));
        const mentionsMyState = text.includes(lowerState);
        
        if (mentionsOtherState && !mentionsMyState) {
          return {
            status: 'NOT_ELIGIBLE',
            badgeClass: 'status-not-eligible',
            label: '🔴 NOT ELIGIBLE',
            reason: `Restricted to another state's beneficiaries.`
          };
        }
      }

      // 2. Gender Restriction
      const isFemaleOnly = text.includes('female only') || text.includes('women only') || text.includes('girl child only') || text.includes('maternity benefit') || text.includes('widow');
      const isMaleOnly = text.includes('male only') || text.includes('men only') || text.includes('boy child only');
      
      if (isFemaleOnly) {
        if (!p.gender) {
          return {
            status: 'INFO_REQUIRED',
            badgeClass: 'status-info-required',
            label: '🟠 INFO REQUIRED',
            reason: 'Gender details needed in profile.'
          };
        }
        if (p.gender.toLowerCase() === 'male') {
          return {
            status: 'NOT_ELIGIBLE',
            badgeClass: 'status-not-eligible',
            label: '🔴 NOT ELIGIBLE',
            reason: 'Female beneficiaries only.'
          };
        }
      }
      
      if (isMaleOnly) {
        if (!p.gender) {
          return {
            status: 'INFO_REQUIRED',
            badgeClass: 'status-info-required',
            label: '🟠 INFO REQUIRED',
            reason: 'Gender details needed in profile.'
          };
        }
        if (p.gender.toLowerCase() === 'female') {
          return {
            status: 'NOT_ELIGIBLE',
            badgeClass: 'status-not-eligible',
            label: '🔴 NOT ELIGIBLE',
            reason: 'Male beneficiaries only.'
          };
        }
      }

      // 3. Age Restrictions
      if (p.age === undefined || p.age === null || p.age === '') {
        const containsAgeKeywords = text.includes('age') || text.includes('years') || text.includes('senior citizen') || text.includes('child') || text.includes('student');
        if (containsAgeKeywords) {
          return {
            status: 'INFO_REQUIRED',
            badgeClass: 'status-info-required',
            label: '🟠 INFO REQUIRED',
            reason: 'Age details needed in profile.'
          };
        }
      } else {
        const ageVal = parseInt(p.age, 10);
        if (text.includes('senior citizen') || text.includes('old age') || text.includes('above 60 years') || text.includes('60 years and above')) {
          if (ageVal < 60) {
            return {
              status: 'NOT_ELIGIBLE',
              badgeClass: 'status-not-eligible',
              label: '🔴 NOT ELIGIBLE',
              reason: `Age 60+ required (Profile age: ${ageVal}).`
            };
          }
        }
        if (text.includes('children') || text.includes('below 18 years') || text.includes('under 18')) {
          if (ageVal >= 18) {
            return {
              status: 'NOT_ELIGIBLE',
              badgeClass: 'status-not-eligible',
              label: '🔴 NOT ELIGIBLE',
              reason: `Under 18 required (Profile age: ${ageVal}).`
            };
          }
        }
        
        // Parse custom age ranges from criteria
        const ageRangeRegex = /(?:age group of|age between|aged|between)\s*(\d+)\s*(?:-|to)\s*(\d+)\s*years/i;
        const match = text.match(ageRangeRegex);
        if (match) {
          const minAge = parseInt(match[1], 10);
          const maxAge = parseInt(match[2], 10);
          if (ageVal < minAge || ageVal > maxAge) {
            return {
              status: 'NOT_ELIGIBLE',
              badgeClass: 'status-not-eligible',
              label: '🔴 NOT ELIGIBLE',
              reason: `Age ${minAge}-${maxAge} required (Profile age: ${ageVal}).`
            };
          }
        }
      }

      // 4. Income Thresholds
      const hasIncomeLimit = text.includes('income') || text.includes('below 1 lakh') || text.includes('below 2.5 lakh') || text.includes('below 3 lakh') || text.includes('bpl');
      if (hasIncomeLimit) {
        if (p.income === undefined || p.income === null || p.income === '') {
          return {
            status: 'INFO_REQUIRED',
            badgeClass: 'status-info-required',
            label: '🟠 INFO REQUIRED',
            reason: 'Income details needed in profile.'
          };
        }
        const incomeVal = parseInt(p.income, 10);

        if (text.includes('below 1 lakh') || text.includes('under 1,00,000') || text.includes('income limit of 1,00,000')) {
          if (incomeVal > 100000) {
            return {
              status: 'NOT_ELIGIBLE',
              badgeClass: 'status-not-eligible',
              label: '🔴 NOT ELIGIBLE',
              reason: `Income exceeds ₹1,00,000 threshold.`
            };
          }
        }
        if (text.includes('below 2.5 lakh') || text.includes('under 2,50,000') || text.includes('income limit of 2,50,000')) {
          if (incomeVal > 250000) {
            return {
              status: 'NOT_ELIGIBLE',
              badgeClass: 'status-not-eligible',
              label: '🔴 NOT ELIGIBLE',
              reason: `Income exceeds ₹2,50,000 threshold.`
            };
          }
        }
        if (text.includes('below 3 lakh') || text.includes('under 3,00,000')) {
          if (incomeVal > 300000) {
            return {
              status: 'NOT_ELIGIBLE',
              badgeClass: 'status-not-eligible',
              label: '🔴 NOT ELIGIBLE',
              reason: `Income exceeds ₹3,00,000 threshold.`
            };
          }
        }
        if (text.includes('bpl') || text.includes('below poverty line')) {
          if (incomeVal > 150000) {
            return {
              status: 'NOT_ELIGIBLE',
              badgeClass: 'status-not-eligible',
              label: '🔴 NOT ELIGIBLE',
              reason: `Income exceeds BPL threshold (₹1.5L).`
            };
          }
        }
      }

      // 5. Disability Status
      const requiresDisability = text.includes('disability') || text.includes('disabled') || text.includes('handicapped');
      if (requiresDisability) {
        if (p.disability === undefined || p.disability === null || p.disability === '') {
          return {
            status: 'INFO_REQUIRED',
            badgeClass: 'status-info-required',
            label: '🟠 INFO REQUIRED',
            reason: 'Disability details needed in profile.'
          };
        }
        if (!p.disability) {
          return {
            status: 'NOT_ELIGIBLE',
            badgeClass: 'status-not-eligible',
            label: '🔴 NOT ELIGIBLE',
            reason: 'Restricted to disabled individuals.'
          };
        }
      }

      // 6. Context check based on occupation
      let matchesOccupation = false;
      if (p.occupation) {
        const occ = p.occupation.toLowerCase();
        if (occ === 'student' && (scheme.category.includes('Education') || tags.includes('student') || text.includes('scholarship') || text.includes('student'))) {
          matchesOccupation = true;
        } else if (occ === 'farmer' && (scheme.category.includes('Agriculture') || tags.includes('farmer') || text.includes('farmer'))) {
          matchesOccupation = true;
        } else if (occ === 'senior citizen' && (tags.includes('senior') || text.includes('senior') || text.includes('old age'))) {
          matchesOccupation = true;
        } else if (occ === 'job seeker' && (tags.includes('training') || text.includes('employment') || text.includes('skill') || text.includes('job seeker'))) {
          matchesOccupation = true;
        }
      }

      // If document verification requires special certificates and occupation doesn't match
      if (scheme.documents && (scheme.documents.toLowerCase().includes('certificate') || scheme.documents.toLowerCase().includes('affidavit'))) {
        if (p.occupation && !matchesOccupation) {
          return {
            status: 'INFO_REQUIRED',
            badgeClass: 'status-info-required',
            label: '🟠 INFO REQUIRED',
            reason: 'Special verification certificates required.'
          };
        }
      }

      return {
        status: 'ELIGIBLE',
        badgeClass: 'status-eligible',
        label: '🟢 ELIGIBLE',
        reason: 'Satisfies core criteria.'
      };
    }

    // ==========================================
    // FILTER PIPELINE
    // ==========================================
    applyFilters() {
      const s = this.state;

      const result = this.dataset.filter(scheme => {
        // 1. Text Search Query
        if (s.searchQuery) {
          const q = s.searchQuery.toLowerCase();
          const matchName = (scheme.name || '').toLowerCase().includes(q);
          const matchDetails = (scheme.details || '').toLowerCase().includes(q);
          const matchBenefits = (scheme.benefits || '').toLowerCase().includes(q);
          const matchEligibility = (scheme.eligibility || '').toLowerCase().includes(q);
          const matchCategory = (scheme.category || '').toLowerCase().includes(q);
          const matchTags = (scheme.tags || []).some(t => t.toLowerCase().includes(q));

          if (!matchName && !matchDetails && !matchBenefits && !matchEligibility && !matchCategory && !matchTags) {
            return false;
          }
        }

        // 2. Category Filter
        if (s.categories.length > 0) {
          const matchCategory = s.categories.some(cat => {
            return (scheme.category || '').toLowerCase().includes(cat.toLowerCase());
          });
          if (!matchCategory) return false;
        }

        // 3. Location / State Filter
        if (s.locations.length > 0) {
          const matchLocation = s.locations.some(loc => {
            if (loc === 'Central') return scheme.level === 'Central';
            const text = ((scheme.details || '') + ' ' + (scheme.eligibility || '') + ' ' + (scheme.name || '')).toLowerCase();
            return text.includes(loc.toLowerCase());
          });
          if (!matchLocation) return false;
        }

        // 4. Age Group Filter
        if (s.ageGroup !== 'ALL') {
          const text = ((scheme.eligibility || '') + ' ' + (scheme.details || '') + ' ' + (scheme.name || '')).toLowerCase();
          if (s.ageGroup === 'CHILDREN' && !text.includes('child') && !text.includes('student') && !text.includes('18')) return false;
          if (s.ageGroup === 'YOUTH' && !text.includes('youth') && !text.includes('student') && !text.includes('18-35') && !text.includes('skill')) return false;
          if (s.ageGroup === 'SENIOR' && !text.includes('senior') && !text.includes('old age') && !text.includes('60')) return false;
          if (s.ageGroup === 'ADULT' && text.includes('senior') && !text.includes('adult') && !text.includes('18-60')) return false;
        }

        // 5. Beneficiary Type Filter
        if (s.beneficiaryTypes.length > 0) {
          const matchBeneficiary = s.beneficiaryTypes.some(ben => {
            const text = ((scheme.eligibility || '') + ' ' + (scheme.details || '') + ' ' + (scheme.category || '') + ' ' + (scheme.tags || []).join(' ')).toLowerCase();
            return text.includes(ben.toLowerCase());
          });
          if (!matchBeneficiary) return false;
        }

        // 6. Income Range Filter
        if (s.incomeRange !== 'ALL') {
          const text = (scheme.eligibility || '').toLowerCase();
          if (s.incomeRange === 'BELOW_1L' && !text.includes('1 lakh') && !text.includes('1,00,000') && !text.includes('bpl')) return false;
          if (s.incomeRange === 'BELOW_3L' && !text.includes('2.5') && !text.includes('3 lakh') && !text.includes('3,00,000') && !text.includes('bpl')) return false;
        }

        // 7. Benefit Type Filter
        if (s.benefitTypes.length > 0) {
          const matchBenefit = s.benefitTypes.some(bt => {
            const text = ((scheme.benefits || '') + ' ' + (scheme.category || '') + ' ' + (scheme.tags || []).join(' ')).toLowerCase();
            return text.includes(bt.toLowerCase());
          });
          if (!matchBenefit) return false;
        }

        // 8. Eligibility Status Filter (Dynamic check against profile)
        if (s.eligibilityStatus !== 'ALL') {
          const evalResult = this.evaluateEligibility(scheme);
          if (evalResult.status !== s.eligibilityStatus) {
            return false;
          }
        }

        return true;
      });

      // 9. Sorting
      if (s.sortBy === 'personalized') {
        result.sort((a, b) => {
          const statusA = this.evaluateEligibility(a).status;
          const statusB = this.evaluateEligibility(b).status;

          const score = { 'ELIGIBLE': 3, 'INFO_REQUIRED': 2, 'NOT_ELIGIBLE': 1 };
          return (score[statusB] || 0) - (score[statusA] || 0);
        });
      } else if (s.sortBy === 'name_asc') {
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      } else if (s.sortBy === 'name_desc') {
        result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      }

      this.filteredSchemes = result;

      // Render filter chips
      this.renderChips();

      // Trigger results grid rendering
      if (this.resultsComponent && typeof this.resultsComponent.render === 'function') {
        this.resultsComponent.render();
      }

      // Notify host application callbacks
      if (typeof this.onFilterChange === 'function') {
        this.onFilterChange({
          filters: { ...this.state },
          count: this.filteredSchemes.length
        });
      }
    }

    renderChips() {
      const container = this.elements.chipsContainer;
      if (!container) return;

      container.innerHTML = '';
      const chips = [];
      const s = this.state;

      // Build active lists
      if (s.searchQuery) {
        chips.push({ key: 'searchQuery', label: `Search: "${s.searchQuery}"` });
      }
      if (s.categories.length > 0) {
        chips.push({ key: 'categories', label: `Category: ${s.categories.join(', ')}` });
      }
      if (s.locations.length > 0) {
        chips.push({ key: 'locations', label: `Location: ${s.locations.join(', ')}` });
      }
      if (s.ageGroup !== 'ALL') {
        chips.push({ key: 'ageGroup', label: `Age: ${s.ageGroup}` });
      }
      if (s.beneficiaryTypes.length > 0) {
        chips.push({ key: 'beneficiaryTypes', label: `Beneficiary: ${s.beneficiaryTypes.join(', ')}` });
      }
      if (s.incomeRange !== 'ALL') {
        chips.push({ key: 'incomeRange', label: `Income: ${s.incomeRange}` });
      }
      if (s.benefitTypes.length > 0) {
        chips.push({ key: 'benefitTypes', label: `Benefit: ${s.benefitTypes.join(', ')}` });
      }
      if (s.eligibilityStatus !== 'ALL') {
        chips.push({ key: 'eligibilityStatus', label: `Status: ${s.eligibilityStatus}` });
      }

      if (chips.length === 0) {
        container.style.display = 'none';
        return;
      }

      container.style.display = 'flex';

      chips.forEach(chip => {
        const chipEl = document.createElement('div');
        chipEl.className = 'scheme-filter-chip';
        chipEl.innerHTML = `
          <span>${chip.label}</span>
          <button type="button" class="scheme-filter-chip-remove" aria-label="Remove filter">
            <svg viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        `;

        chipEl.querySelector('.scheme-filter-chip-remove').addEventListener('click', () => {
          this.removeSingleFilter(chip.key);
        });

        container.appendChild(chipEl);
      });

      // Clear all option in chips wrapper
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'scheme-filter-chips-clear-all';
      clearBtn.textContent = 'Clear all';
      clearBtn.addEventListener('click', () => this.resetFilters());
      container.appendChild(clearBtn);
    }

    removeSingleFilter(key) {
      const el = this.elements;
      if (key === 'searchQuery') {
        this.state.searchQuery = '';
        if (el.searchInput) el.searchInput.value = '';
      } else if (key === 'categories') {
        this.state.categories = [];
        if (el.categorySelect) el.categorySelect.value = '';
      } else if (key === 'locations') {
        this.state.locations = [];
        if (el.locationSelect) el.locationSelect.value = '';
      } else if (key === 'ageGroup') {
        this.state.ageGroup = 'ALL';
        if (el.ageSelect) el.ageSelect.value = 'ALL';
      } else if (key === 'beneficiaryTypes') {
        this.state.beneficiaryTypes = [];
        if (el.beneficiarySelect) el.beneficiarySelect.value = '';
      } else if (key === 'incomeRange') {
        this.state.incomeRange = 'ALL';
        if (el.incomeSelect) el.incomeSelect.value = 'ALL';
      } else if (key === 'benefitTypes') {
        this.state.benefitTypes = [];
        if (el.benefitSelect) el.benefitSelect.value = '';
      } else if (key === 'eligibilityStatus') {
        this.state.eligibilityStatus = 'ALL';
        if (el.eligibilitySelect) el.eligibilitySelect.value = 'ALL';
      }

      this.state.currentPage = 1;
      this.applyFilters();
    }

    resetFilters() {
      this.state = {
        searchQuery: '',
        categories: [],
        locations: [],
        ageGroup: 'ALL',
        beneficiaryTypes: [],
        incomeRange: 'ALL',
        benefitTypes: [],
        eligibilityStatus: 'ALL',
        sortBy: 'relevance',
        currentPage: 1,
        pageSize: 12
      };

      const el = this.elements;
      if (el.searchInput) el.searchInput.value = '';
      if (el.categorySelect) el.categorySelect.value = '';
      if (el.locationSelect) el.locationSelect.value = '';
      if (el.ageSelect) el.ageSelect.value = 'ALL';
      if (el.beneficiarySelect) el.beneficiarySelect.value = '';
      if (el.incomeSelect) el.incomeSelect.value = 'ALL';
      if (el.benefitSelect) el.benefitSelect.value = '';
      if (el.eligibilitySelect) el.eligibilitySelect.value = 'ALL';
      if (el.sortSelect) el.sortSelect.value = 'relevance';

      this.applyFilters();
    }

    // ==========================================
    // PUBLIC MODULE INTEGRATION API
    // ==========================================
    updateProfile(newProfile) {
      this.profile = { ...this.profile, ...newProfile };
      this.state.currentPage = 1;
      this.applyFilters();
    }

    updateDataset(newDataset) {
      this.dataset = newDataset;
      this.state.currentPage = 1;
      this.applyFilters();
    }

    setFilters(filters = {}) {
      this.state = { ...this.state, ...filters };
      this.state.currentPage = 1;
      
      const el = this.elements;
      if (filters.searchQuery !== undefined && el.searchInput) el.searchInput.value = filters.searchQuery;
      if (filters.categories !== undefined && el.categorySelect) el.categorySelect.value = filters.categories[0] || '';
      if (filters.locations !== undefined && el.locationSelect) el.locationSelect.value = filters.locations[0] || '';
      if (filters.ageGroup !== undefined && el.ageSelect) el.ageSelect.value = filters.ageGroup;
      if (filters.beneficiaryTypes !== undefined && el.beneficiarySelect) el.beneficiarySelect.value = filters.beneficiaryTypes[0] || '';
      if (filters.incomeRange !== undefined && el.incomeSelect) el.incomeSelect.value = filters.incomeRange;
      if (filters.benefitTypes !== undefined && el.benefitSelect) el.benefitSelect.value = filters.benefitTypes[0] || '';
      if (filters.eligibilityStatus !== undefined && el.eligibilitySelect) el.eligibilitySelect.value = filters.eligibilityStatus;
      if (filters.sortBy !== undefined && el.sortSelect) el.sortSelect.value = filters.sortBy;

      this.applyFilters();
    }

    getFilteredResults() {
      return this.filteredSchemes;
    }
  }

  // Bind initialisation handle to global window
  window.initializeSchemeModule = function(options) {
    return new SchemeModule(options);
  };
})(window);
