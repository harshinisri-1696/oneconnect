/**
 * GovCenter Assistant — Floating Chatbot
 *
 * Dependencies (loaded before this script in index.html):
 *   - schemes_data.js        → window.SCHEMES_DATA
 *   - scheme-filter-bar.js   → window.initializeSchemeFilter / SchemeFilterBar instance
 *   - app.js                 → window._schemeFilterInstance (set by app.js bridge)
 *
 * Public API:
 *   window.initGovCenterChatbot(options)
 *   options = {
 *     getFilterInstance : () => SchemeFilterBar instance   (required)
 *     getProfile        : () => activeProfile object       (required)
 *     dataset           : Array of scheme objects          (required)
 *     onSchemeSelect    : (scheme) => void                 (optional, opens detail modal)
 *   }
 *
 * Namespace: govcenter-chatbot* (JS + CSS classes)
 */

(function (window) {
  'use strict';

  // ============================================================
  //  QUICK-SUGGESTION CHIP DEFINITIONS
  // ============================================================
  const SUGGESTIONS = [
    { label: 'Eligible schemes for me',      query: 'Which schemes am I eligible for?' },
    { label: 'Show scholarships',             query: 'Show scholarships for students' },
    { label: 'Schemes for women',             query: 'Find schemes for women' },
    { label: 'Tamil Nadu schemes',            query: 'Show schemes in Tamil Nadu' },
    { label: 'Financial assistance',          query: 'Which schemes provide financial assistance?' }
  ];

  // ============================================================
  //  GREETING / WELCOME MESSAGE
  // ============================================================
  const WELCOME_MSG =
    "Hi! I'm GovCenter Assistant 👋\n" +
    "I can help you find government schemes based on your profile, eligibility, " +
    "category, state, income, and other requirements.\n\n" +
    "Try one of the suggestions below, or type your question.";

  // ============================================================
  //  HEURISTIC RESPONSE ENGINE
  //  Uses window.SCHEMES_DATA + SchemeFilterBar.evaluateEligibility
  // ============================================================
  class GovCenterEngine {
    constructor (options) {
      this.getFilterInstance = options.getFilterInstance;
      this.getProfile        = options.getProfile;
      this.dataset           = options.dataset || [];
      this.onSchemeSelect    = options.onSchemeSelect || null;
    }

    /** Lazy-get the live filter instance (may be null early in page load) */
    get filterInstance () {
      return (typeof this.getFilterInstance === 'function')
        ? this.getFilterInstance()
        : null;
    }

    /** Live citizen profile */
    get profile () {
      return (typeof this.getProfile === 'function')
        ? this.getProfile()
        : {};
    }

    /** Check eligibility using the real SchemeFilterBar engine */
    checkEligibility (scheme) {
      const fi = this.filterInstance;
      if (fi && typeof fi.evaluateEligibility === 'function') {
        return fi.evaluateEligibility(scheme);
      }
      // Fallback — always ELIGIBLE if instance not available
      return { status: 'ELIGIBLE', label: '🟢 ELIGIBLE', badgeClass: 'status-eligible', reason: '' };
    }

    /** Fuzzy keyword search across all scheme text fields */
    keywordSearch (query) {
      const q = query.toLowerCase();
      return this.dataset.filter(s =>
        (s.name         || '').toLowerCase().includes(q) ||
        (s.details      || '').toLowerCase().includes(q) ||
        (s.benefits     || '').toLowerCase().includes(q) ||
        (s.eligibility  || '').toLowerCase().includes(q) ||
        (s.category     || '').toLowerCase().includes(q) ||
        (s.tags         || []).some(t => t.toLowerCase().includes(q))
      );
    }

    /** Applies a category filter action on the live filter bar */
    applyFilterAction (field, value) {
      const fi = this.filterInstance;
      if (!fi) return;
      if (field === 'categories') {
        fi.state.categories = value ? [value] : [];
        const sel = fi.elements && fi.elements.categorySelect;
        if (sel) sel.value = value || '';
      } else if (field === 'locations') {
        fi.state.locations = value ? [value] : [];
        const sel = fi.elements && fi.elements.locationSelect;
        if (sel) sel.value = value || '';
      } else if (field === 'eligibilityStatus') {
        fi.state.eligibilityStatus = value;
        const sel = fi.elements && fi.elements.eligibilitySelect;
        if (sel) sel.value = value;
      } else if (field === 'beneficiaryTypes') {
        fi.state.beneficiaryTypes = value ? [value] : [];
        const sel = fi.elements && fi.elements.beneficiarySelect;
        if (sel) sel.value = value || '';
      }
      fi.state.currentPage = 1;
      fi.applyFilters();
    }

    /** Core response resolver — returns a ChatResponse object */
    async resolve (query) {
      // Simulate slight thinking delay (300–600 ms)
      await new Promise(r => setTimeout(r, 350 + Math.random() * 250));

      const q   = query.toLowerCase().trim();
      const p   = this.profile;

      // ----------------------------------------------------------
      //  1. ELIGIBILITY QUERY
      // ----------------------------------------------------------
      if (q.includes('eligible') || q.includes('qualify') || q.includes('which schemes') || q.includes('my schemes')) {
        const eligible = this.dataset.filter(s => this.checkEligibility(s).status === 'ELIGIBLE');
        if (eligible.length === 0) {
          return {
            text: `I checked your current profile (Age: ${p.age || '—'}, State: ${p.state || '—'}, Occupation: ${p.occupation || '—'}) and didn't find any directly eligible schemes right now.\n\nTry updating your profile with complete details so I can give more accurate results.`,
            schemes: [],
            filterAction: null
          };
        }
        this.applyFilterAction('eligibilityStatus', 'ELIGIBLE');
        return {
          text: `Based on your profile (Age: ${p.age || '—'}, State: ${p.state || '—'}, Occupation: ${p.occupation || '—'}, Income: ₹${parseInt(p.income || 0).toLocaleString()}), I found **${eligible.length} eligible scheme(s)**. Here are the top matches — I've also applied the "Eligible Only" filter on the main page for you:`,
          schemes: eligible.slice(0, 4),
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  2. SCHOLARSHIP / STUDENT / EDUCATION
      // ----------------------------------------------------------
      if (q.includes('scholarship') || q.includes('student') || q.includes('education') || q.includes('study') || q.includes('school') || q.includes('college')) {
        const results = this.keywordSearch('education').concat(this.keywordSearch('scholarship')).concat(this.keywordSearch('student'));
        const unique  = [...new Map(results.map(s => [s.id, s])).values()];
        this.applyFilterAction('categories', 'Education');
        if (unique.length === 0) {
          return { text: "I couldn't find specific education or scholarship schemes in the current dataset. Try broadening your search.", schemes: [], filterAction: null };
        }
        return {
          text: `I found **${unique.length} education & scholarship scheme(s)** in the dataset. I've also filtered the main page to Education & Learning for you:`,
          schemes: unique.slice(0, 4),
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  3. WOMEN / GENDER-SPECIFIC
      // ----------------------------------------------------------
      if (q.includes('women') || q.includes('woman') || q.includes('female') || q.includes('girl') || q.includes('mahila')) {
        const results = this.keywordSearch('women').concat(this.keywordSearch('female')).concat(this.keywordSearch('girl'));
        const unique  = [...new Map(results.map(s => [s.id, s])).values()];
        this.applyFilterAction('beneficiaryTypes', 'women');
        if (unique.length === 0) {
          return { text: "No specific women-focused schemes were found in the current dataset.", schemes: [], filterAction: null };
        }
        return {
          text: `I found **${unique.length} scheme(s)** that target women beneficiaries. The Beneficiary filter has been updated on the main page:`,
          schemes: unique.slice(0, 4),
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  4. FARMER / AGRICULTURE
      // ----------------------------------------------------------
      if (q.includes('farmer') || q.includes('agriculture') || q.includes('rural') || q.includes('crop') || q.includes('kisan') || q.includes('fishing') || q.includes('fisherman')) {
        const results = this.keywordSearch('farmer').concat(this.keywordSearch('agriculture')).concat(this.keywordSearch('fisherman'));
        const unique  = [...new Map(results.map(s => [s.id, s])).values()];
        this.applyFilterAction('categories', 'Agriculture');
        if (unique.length === 0) {
          return { text: "No agriculture or farmer schemes found in the current dataset.", schemes: [], filterAction: null };
        }
        return {
          text: `I found **${unique.length} agriculture / rural scheme(s)**. Filtered to Agriculture & Rural on the main page:`,
          schemes: unique.slice(0, 4),
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  5. FINANCIAL ASSISTANCE / MONEY
      // ----------------------------------------------------------
      if (q.includes('financial') || q.includes('money') || q.includes('cash') || q.includes('assistance') || q.includes('relief') || q.includes('stipend') || q.includes('pension')) {
        const results = this.keywordSearch('financial assistance').concat(this.keywordSearch('relief'));
        const unique  = [...new Map(results.map(s => [s.id, s])).values()];
        if (unique.length === 0) {
          return { text: "I couldn't find financial assistance schemes matching that query right now.", schemes: [], filterAction: null };
        }
        return {
          text: `Here are **${unique.length} scheme(s)** related to financial assistance / relief payments:`,
          schemes: unique.slice(0, 4),
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  6. STATE / LOCATION FILTER
      // ----------------------------------------------------------
      const stateNames = [
        'tamil nadu','puducherry','karnataka','maharashtra','delhi',
        'uttar pradesh','kerala','gujarat','andhra pradesh','rajasthan',
        'west bengal','bihar','punjab','haryana','madhya pradesh','telangana',
        'odisha','jharkhand','assam'
      ];
      const matchedState = stateNames.find(st => q.includes(st));
      if (matchedState) {
        const titleCase = matchedState.replace(/\b\w/g, c => c.toUpperCase());
        const results   = this.keywordSearch(matchedState);
        const centralSchemes = this.dataset.filter(s => s.level === 'Central');
        const unique    = [...new Map([...results, ...centralSchemes].map(s => [s.id, s])).values()];
        this.applyFilterAction('locations', titleCase);
        if (unique.length === 0) {
          return { text: `I couldn't find schemes specifically for ${titleCase} in the current dataset.`, schemes: [], filterAction: null };
        }
        return {
          text: `Found **${unique.length} scheme(s)** relevant to ${titleCase} (including Central Government schemes available everywhere). Location filter updated:`,
          schemes: unique.slice(0, 4),
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  7. DISABILITY / PWD
      // ----------------------------------------------------------
      if (q.includes('disab') || q.includes('pwd') || q.includes('handicap') || q.includes('divyang')) {
        const results = this.keywordSearch('disability').concat(this.keywordSearch('disabled'));
        const unique  = [...new Map(results.map(s => [s.id, s])).values()];
        this.applyFilterAction('beneficiaryTypes', 'disability');
        if (unique.length === 0) {
          return { text: "No disability / PwD specific schemes found in the current dataset.", schemes: [], filterAction: null };
        }
        return {
          text: `I found **${unique.length} scheme(s)** for Persons with Disabilities (PwD). Beneficiary filter updated:`,
          schemes: unique.slice(0, 4),
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  8. SENIOR CITIZEN
      // ----------------------------------------------------------
      if (q.includes('senior') || q.includes('old age') || q.includes('elderly') || q.includes('pension') || q.includes('retired')) {
        const results = this.keywordSearch('senior citizen').concat(this.keywordSearch('old age'));
        const unique  = [...new Map(results.map(s => [s.id, s])).values()];
        this.applyFilterAction('beneficiaryTypes', 'senior');
        if (unique.length === 0) {
          return { text: "No senior citizen schemes found in the current dataset.", schemes: [], filterAction: null };
        }
        return {
          text: `Here are **${unique.length} scheme(s)** for senior citizens:`,
          schemes: unique.slice(0, 4),
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  9. BUSINESS / MSME / ENTREPRENEUR
      // ----------------------------------------------------------
      if (q.includes('business') || q.includes('msme') || q.includes('startup') || q.includes('entrepreneur') || q.includes('small industry')) {
        const results = this.keywordSearch('business').concat(this.keywordSearch('msme')).concat(this.keywordSearch('entrepreneur'));
        const unique  = [...new Map(results.map(s => [s.id, s])).values()];
        this.applyFilterAction('categories', 'Business');
        if (unique.length === 0) {
          return { text: "No business / MSME schemes found right now.", schemes: [], filterAction: null };
        }
        return {
          text: `Found **${unique.length} Business & Entrepreneurship scheme(s)**. Category filter updated:`,
          schemes: unique.slice(0, 4),
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  10. HOW TO APPLY
      // ----------------------------------------------------------
      if (q.includes('how to apply') || q.includes('apply for') || q.includes('application process') || q.includes('procedure')) {
        return {
          text: "To apply for any scheme:\n1. Find the scheme card in the main results.\n2. Click **View Details** on the card.\n3. Read the **Application Process** and **Required Documents** sections.\n4. Click **Apply Now** to proceed via the official government portal.\n\nYou can also ask me: \"Show me [scheme name]\" and I'll help you find it.",
          schemes: [],
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  11. SCHEME DETAIL LOOKUP BY NAME
      // ----------------------------------------------------------
      if (q.includes('tell me about') || q.includes('details of') || q.includes('more about') || q.includes('what is')) {
        const stripped = q
          .replace('tell me about', '')
          .replace('details of', '')
          .replace('more about', '')
          .replace('what is', '')
          .trim();
        if (stripped.length > 3) {
          const match = this.dataset.find(s => (s.name || '').toLowerCase().includes(stripped));
          if (match) {
            return {
              text: `Here are the details for **${match.name}**:`,
              schemes: [match],
              filterAction: null,
              showDetail: match
            };
          }
        }
      }

      // ----------------------------------------------------------
      //  12. GENERIC KEYWORD FALLBACK
      // ----------------------------------------------------------
      const fallbackResults = this.keywordSearch(q);
      if (fallbackResults.length > 0) {
        return {
          text: `I found **${fallbackResults.length} scheme(s)** matching "${query}":`,
          schemes: fallbackResults.slice(0, 4),
          filterAction: null
        };
      }

      // ----------------------------------------------------------
      //  13. NO MATCH — HELP MESSAGE
      // ----------------------------------------------------------
      return {
        text: `I couldn't find specific schemes for "${query}".\n\nYou can try:\n• "Which schemes am I eligible for?"\n• "Show scholarships for students"\n• "Find schemes for women"\n• "Show schemes in Tamil Nadu"\n• "Which schemes provide financial assistance?"`,
        schemes: [],
        filterAction: null
      };
    }
  }

  // ============================================================
  //  CHATBOT UI CONTROLLER
  // ============================================================
  class GovCenterChatbot {
    constructor (options = {}) {
      this.engine       = new GovCenterEngine(options);
      this.root         = null;   // .govcenter-chatbot-root  (inserted into <body>)
      this.panel        = null;
      this.triggerBtn   = null;
      this.messagesEl   = null;
      this.inputEl      = null;
      this.suggestionsEl = null;
      this.isOpen       = false;

      this._buildDOM();
      this._bindEvents();
      this._appendWelcome();
    }

    // ----------------------------------------------------------
    //  DOM CONSTRUCTION
    // ----------------------------------------------------------
    _buildDOM () {
      const root = document.createElement('div');
      root.className = 'govcenter-chatbot-root';
      root.setAttribute('role', 'complementary');
      root.setAttribute('aria-label', 'GovCenter Assistant');
      root.innerHTML = this._template();
      document.body.appendChild(root);
      this.root = root;

      this.triggerBtn    = root.querySelector('.govcenter-chatbot-button');
      this.panel         = root.querySelector('.govcenter-chatbot-panel');
      this.messagesEl    = root.querySelector('.govcenter-chatbot-messages');
      this.inputEl       = root.querySelector('.govcenter-chatbot-input');
      this.suggestionsEl = root.querySelector('.govcenter-chatbot-suggestions');
    }

    _template () {
      const suggestionsHTML = SUGGESTIONS.map(s =>
        `<button type="button" class="govcenter-chatbot-suggestion-btn" data-query="${s.query}" aria-label="${s.label}">${s.label}</button>`
      ).join('');

      return `
        <!-- Floating trigger button -->
        <button
          type="button"
          class="govcenter-chatbot-button"
          aria-label="Open GovCenter Assistant"
          aria-expanded="false"
          aria-controls="govcenterChatPanel"
        >
          <!-- Chat icon (default) -->
          <svg class="gc-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <!-- Close icon (shown when panel is open) -->
          <svg class="gc-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Chat panel -->
        <div
          class="govcenter-chatbot-panel"
          id="govcenterChatPanel"
          role="dialog"
          aria-modal="false"
          aria-label="GovCenter Assistant chat panel"
        >
          <!-- Header -->
          <div class="govcenter-chatbot-header">
            <div class="govcenter-chatbot-header-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div class="govcenter-chatbot-header-info">
              <div class="govcenter-chatbot-header-title">GovCenter Assistant</div>
              <div class="govcenter-chatbot-header-subtitle">Find government schemes and services</div>
              <div class="govcenter-chatbot-header-status">
                <span class="govcenter-chatbot-header-status-dot" aria-hidden="true"></span>
                Online • Real scheme data
              </div>
            </div>
            <button
              type="button"
              class="govcenter-chatbot-close-btn"
              aria-label="Close GovCenter Assistant"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Messages -->
          <div class="govcenter-chatbot-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>

          <!-- Quick suggestions -->
          <div class="govcenter-chatbot-suggestions" aria-label="Quick questions">
            ${suggestionsHTML}
          </div>

          <!-- Input area -->
          <div class="govcenter-chatbot-input-area">
            <input
              type="text"
              class="govcenter-chatbot-input"
              placeholder="Ask about government schemes..."
              aria-label="Type your question about government schemes"
              autocomplete="off"
              maxlength="300"
            />
            <button
              type="button"
              class="govcenter-chatbot-send-btn"
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      `;
    }

    // ----------------------------------------------------------
    //  EVENT BINDING
    // ----------------------------------------------------------
    _bindEvents () {
      // Toggle on floating button click
      this.triggerBtn.addEventListener('click', () => this.toggle());

      // Close button
      const closeBtn = this.panel.querySelector('.govcenter-chatbot-close-btn');
      closeBtn.addEventListener('click', () => this.close());

      // Send button
      const sendBtn = this.panel.querySelector('.govcenter-chatbot-send-btn');
      sendBtn.addEventListener('click', () => this._send());

      // Enter key
      this.inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this._send();
        }
      });

      // Suggestion chips
      this.suggestionsEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.govcenter-chatbot-suggestion-btn');
        if (btn) {
          const q = btn.getAttribute('data-query');
          this.inputEl.value = q;
          this._send();
        }
      });

      // Close on Escape key when panel is open
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });
    }

    // ----------------------------------------------------------
    //  OPEN / CLOSE
    // ----------------------------------------------------------
    open () {
      this.isOpen = true;
      this.panel.classList.add('gc-open');
      this.triggerBtn.classList.add('gc-open');
      this.triggerBtn.setAttribute('aria-expanded', 'true');
      this.triggerBtn.setAttribute('aria-label', 'Close GovCenter Assistant');
      // Focus input after transition
      setTimeout(() => this.inputEl.focus(), 230);
    }

    close () {
      this.isOpen = false;
      this.panel.classList.remove('gc-open');
      this.triggerBtn.classList.remove('gc-open');
      this.triggerBtn.setAttribute('aria-expanded', 'false');
      this.triggerBtn.setAttribute('aria-label', 'Open GovCenter Assistant');
      this.triggerBtn.focus();
    }

    toggle () {
      this.isOpen ? this.close() : this.open();
    }

    // ----------------------------------------------------------
    //  MESSAGING
    // ----------------------------------------------------------
    _appendWelcome () {
      this._addBotMessage(WELCOME_MSG, []);
      // Hide suggestions on first load (shown after first user message or suggestion click)
      // Keep them visible as they are the onboarding CTAs
    }

    async _send () {
      const query = this.inputEl.value.trim();
      if (!query) return;
      this.inputEl.value = '';

      // Hide suggestions after first interaction
      if (this.suggestionsEl) this.suggestionsEl.style.display = 'none';

      this._addUserMessage(query);
      const typingEl = this._addTyping();

      try {
        const response = await this.engine.resolve(query);
        typingEl.remove();

        // If the engine found a specific scheme to open in detail modal
        if (response.showDetail && typeof this.engine.onSchemeSelect === 'function') {
          this.engine.onSchemeSelect(response.showDetail);
        }

        this._addBotMessage(response.text, response.schemes || []);
      } catch (err) {
        console.error('[GovCenter Chatbot] Error:', err);
        typingEl.remove();
        this._addBotMessage("Sorry, something went wrong processing your request. Please try again.", []);
      }
    }

    // ----------------------------------------------------------
    //  RENDER HELPERS
    // ----------------------------------------------------------
    _addUserMessage (text) {
      const msg = document.createElement('div');
      msg.className = 'govcenter-chatbot-message gc-msg-user';
      msg.innerHTML = `<div class="govcenter-chatbot-bubble">${this._escapeHtml(text)}</div>`;
      this.messagesEl.appendChild(msg);
      this._scrollBottom();
    }

    _addBotMessage (text, schemes = []) {
      const wrapper = document.createElement('div');
      wrapper.className = 'govcenter-chatbot-message gc-msg-bot';

      // Text bubble — render **bold** markers
      const bubble = document.createElement('div');
      bubble.className = 'govcenter-chatbot-bubble';
      bubble.innerHTML = this._renderText(text);
      wrapper.appendChild(bubble);

      // Scheme result cards
      schemes.forEach(scheme => {
        const card = this._buildSchemeCard(scheme);
        wrapper.appendChild(card);
      });

      this.messagesEl.appendChild(wrapper);
      this._scrollBottom();
    }

    _addTyping () {
      const el = document.createElement('div');
      el.className = 'govcenter-chatbot-message gc-msg-bot';
      el.innerHTML = `
        <div class="govcenter-chatbot-typing" aria-label="Assistant is typing" role="status">
          <span class="govcenter-chatbot-typing-dot"></span>
          <span class="govcenter-chatbot-typing-dot"></span>
          <span class="govcenter-chatbot-typing-dot"></span>
        </div>
      `;
      this.messagesEl.appendChild(el);
      this._scrollBottom();
      return el;
    }

    _buildSchemeCard (scheme) {
      const evalResult  = this.engine.checkEligibility(scheme);
      const mainCat     = (scheme.category || 'General Welfare').split(',')[0].trim();
      const levelLabel  = scheme.level === 'Central' ? 'Central Govt' : (scheme.level || '') + ' Scheme';
      const benefitText = scheme.benefits
        ? scheme.benefits.substring(0, 100) + (scheme.benefits.length > 100 ? '…' : '')
        : null;

      const isEligible  = evalResult.status === 'ELIGIBLE';

      const card = document.createElement('div');
      card.className = 'gc-scheme-card';
      card.innerHTML = `
        <div class="gc-scheme-card-name">${this._escapeHtml(scheme.name)}</div>
        <div class="gc-scheme-card-meta">
          <span class="gc-scheme-tag">${this._escapeHtml(mainCat)}</span>
          <span class="gc-scheme-tag gc-tag-level">${this._escapeHtml(levelLabel)}</span>
          ${isEligible ? '<span class="gc-scheme-tag gc-tag-eligible">🟢 Eligible</span>' : ''}
        </div>
        ${benefitText ? `<div class="gc-scheme-card-benefit">${this._escapeHtml(benefitText)}</div>` : ''}
        <button type="button" class="gc-scheme-view-btn" aria-label="View details for ${this._escapeHtml(scheme.name)}">View Details →</button>
      `;

      card.querySelector('.gc-scheme-view-btn').addEventListener('click', () => {
        if (typeof this.engine.onSchemeSelect === 'function') {
          this.engine.onSchemeSelect(scheme);
        }
      });

      return card;
    }

    _scrollBottom () {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }

    _escapeHtml (str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    /** Render **bold** markers and newlines */
    _renderText (text) {
      return this._escapeHtml(text)
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    }
  }

  // ============================================================
  //  PUBLIC INITIALIZER
  // ============================================================

  /**
   * window.initGovCenterChatbot(options)
   *
   * options.getFilterInstance : () => SchemeFilterBar instance
   * options.getProfile        : () => activeProfile
   * options.dataset           : window.SCHEMES_DATA
   * options.onSchemeSelect    : (scheme) => void
   */
  window.initGovCenterChatbot = function (options) {
    return new GovCenterChatbot(options);
  };

})(window);
