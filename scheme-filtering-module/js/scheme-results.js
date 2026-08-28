/**
 * Scheme Results Module
 * Handles cards grid rendering, status badges, pagination, sort-dropdown binding, and details modal rendering.
 */

(function(window) {
  'use strict';

  class SchemeResults {
    constructor(moduleInstance) {
      this.module = moduleInstance;
      this.modalOverlay = null;
      this.init();
    }

    init() {
      // 1. Set up the details modal container dynamically inside the module wrapper
      this.createDetailsModal();

      // 2. Bind the results sort dropdown change event
      const sortSelect = this.module.elements.sortSelect;
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.module.state.sortBy = e.target.value;
          this.module.state.currentPage = 1;
          this.module.applyFilters();
        });
      }
    }

    createDetailsModal() {
      // Create modal elements and append them directly inside the module container for scoping
      const modalWrapper = document.createElement('div');
      modalWrapper.className = 'scheme-modal-overlay';
      modalWrapper.id = 'sfDetailsModalOverlay';
      
      modalWrapper.innerHTML = `
        <div class="scheme-modal-card">
          <div class="scheme-modal-header">
            <div class="scheme-modal-header-title-area">
              <div class="scheme-modal-header-meta">
                <span class="scheme-result-badge scheme-result-badge-category" id="sfModalCategory">Category</span>
                <span class="scheme-result-badge scheme-result-badge-status" id="sfModalStatusBadge">Status</span>
              </div>
              <h3 id="sfModalTitle" style="margin-top: 6px;">Scheme Title</h3>
            </div>
            <button type="button" class="scheme-modal-close-btn" id="sfModalCloseBtn" aria-label="Close modal">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="scheme-modal-body">
            <div class="scheme-modal-section">
              <h4>Description & Details</h4>
              <p id="sfModalDetails">Details content...</p>
            </div>
            <div class="scheme-modal-section">
              <h4>Benefits Provided</h4>
              <p id="sfModalBenefits">Benefits content...</p>
            </div>
            <div class="scheme-modal-section">
              <h4>Eligibility Criteria</h4>
              <p id="sfModalEligibility">Eligibility content...</p>
            </div>
            <div class="scheme-modal-section">
              <h4>Application Process</h4>
              <p id="sfModalApplication">Application content...</p>
            </div>
            <div class="scheme-modal-section">
              <h4>Required Documents</h4>
              <p id="sfModalDocuments">Documents content...</p>
            </div>
          </div>
          <div class="scheme-modal-footer">
            <button type="button" class="scheme-filter-btn scheme-filter-btn-secondary" id="sfModalFooterCloseBtn">Close</button>
            <button type="button" class="scheme-filter-btn scheme-filter-btn-primary" id="sfModalApplyBtn">Apply Now</button>
          </div>
        </div>
      `;

      this.module.container.querySelector('.scheme-filter-module').appendChild(modalWrapper);
      this.modalOverlay = modalWrapper;

      // Bind modal close buttons
      const closeBtn = modalWrapper.querySelector('#sfModalCloseBtn');
      const footerCloseBtn = modalWrapper.querySelector('#sfModalFooterCloseBtn');
      const applyBtn = modalWrapper.querySelector('#sfModalApplyBtn');

      const hideModal = () => {
        this.modalOverlay.classList.remove('open');
      };

      if (closeBtn) closeBtn.addEventListener('click', hideModal);
      if (footerCloseBtn) footerCloseBtn.addEventListener('click', hideModal);
      
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          alert('Application process initialized! Connecting to external official portal.');
        });
      }

      // Close modal on clicking outside the card
      modalWrapper.addEventListener('click', (e) => {
        if (e.target === modalWrapper) {
          hideModal();
        }
      });
    }

    openDetailsModal(scheme) {
      const evalResult = this.module.evaluateEligibility(scheme);
      
      const modal = this.modalOverlay;
      if (!modal) return;

      modal.querySelector('#sfModalTitle').textContent = scheme.name;
      modal.querySelector('#sfModalCategory').textContent = (scheme.category || 'General Welfare').split(',')[0].trim();
      
      const statusBadge = modal.querySelector('#sfModalStatusBadge');
      if (statusBadge) {
        statusBadge.className = `scheme-result-badge scheme-result-badge-status ${evalResult.badgeClass}`;
        statusBadge.textContent = evalResult.label;
      }

      modal.querySelector('#sfModalDetails').textContent = scheme.details || 'No details specified.';
      modal.querySelector('#sfModalBenefits').textContent = scheme.benefits || 'No specific benefits specified.';
      modal.querySelector('#sfModalEligibility').textContent = scheme.eligibility || 'No specific eligibility details specified.';
      modal.querySelector('#sfModalApplication').textContent = scheme.application || 'Official portal application process.';
      modal.querySelector('#sfModalDocuments').textContent = scheme.documents || 'Standard identification documents required.';

      modal.classList.add('open');

      if (typeof this.module.onSchemeSelect === 'function') {
        this.module.onSchemeSelect(scheme);
      }
    }

    render() {
      this.renderCount();
      this.renderGrid();
      this.renderPagination();
    }

    renderCount() {
      const el = this.module.elements.resultsCount;
      if (!el) return;
      const count = this.module.filteredSchemes.length;
      el.textContent = `${count.toLocaleString()} ${count === 1 ? 'scheme' : 'schemes'} found`;
    }

    renderGrid() {
      const grid = this.module.elements.grid;
      const emptyState = this.module.elements.emptyState;
      if (!grid) return;

      grid.innerHTML = '';

      if (!this.module.filteredSchemes || this.module.filteredSchemes.length === 0) {
        if (emptyState) emptyState.style.display = 'flex';
        grid.style.display = 'none';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';
      grid.style.display = 'grid';

      // Slice dataset for pagination
      const s = this.module.state;
      const startIndex = (s.currentPage - 1) * s.pageSize;
      const endIndex = Math.min(startIndex + s.pageSize, this.module.filteredSchemes.length);
      const pageSchemes = this.module.filteredSchemes.slice(startIndex, endIndex);

      pageSchemes.forEach(scheme => {
        const evalResult = this.module.evaluateEligibility(scheme);
        const card = document.createElement('div');
        card.className = 'scheme-result-card';

        const mainCategory = (scheme.category || 'General Welfare').split(',')[0].trim();

        card.innerHTML = `
          <div class="scheme-result-card-header">
            <span class="scheme-result-badge scheme-result-badge-category">${mainCategory}</span>
            <span class="scheme-result-badge scheme-result-badge-status ${evalResult.badgeClass}">
              ${evalResult.label}
            </span>
          </div>

          <h3 class="scheme-result-card-title" title="${scheme.name}">${scheme.name}</h3>

          <div class="scheme-result-card-meta">
            <span class="scheme-result-card-meta-item">
              <svg viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              ${scheme.level === 'Central' ? 'Central Government' : scheme.level + ' Scheme'}
            </span>
          </div>

          <p class="scheme-result-card-description">${scheme.details ? (scheme.details.substring(0, 140) + '...') : 'No description available.'}</p>

          ${scheme.benefits ? `
            <div class="scheme-result-benefit-box">
              <strong>Key Benefit:</strong>
              <span>${scheme.benefits.substring(0, 90)}...</span>
            </div>
          ` : ''}

          <div class="scheme-result-card-footer">
            <span class="scheme-result-card-reason" title="${evalResult.reason}">${evalResult.reason}</span>
            <button type="button" class="scheme-result-card-button view-details-trigger-btn">
              View Details
            </button>
          </div>
        `;

        card.querySelector('.view-details-trigger-btn').addEventListener('click', () => {
          this.openDetailsModal(scheme);
        });

        grid.appendChild(card);
      });
    }

    renderPagination() {
      const container = this.module.elements.pagination;
      if (!container) return;

      container.innerHTML = '';
      const totalRecords = this.module.filteredSchemes.length;
      const totalPages = Math.ceil(totalRecords / this.module.state.pageSize) || 1;

      if (totalPages <= 1) {
        container.style.display = 'none';
        return;
      }

      container.style.display = 'flex';

      const s = this.module.state;
      const start = (s.currentPage - 1) * s.pageSize + 1;
      const end = Math.min(start + s.pageSize - 1, totalRecords);

      const infoText = document.createElement('span');
      infoText.className = 'scheme-filter-page-status';
      infoText.textContent = `Showing ${start}-${end} of ${totalRecords}`;
      container.appendChild(infoText);

      const linksContainer = document.createElement('div');
      linksContainer.className = 'scheme-filter-page-links';

      // Prev Page Button
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = `scheme-filter-page-link ${s.currentPage === 1 ? 'disabled' : ''}`;
      prevBtn.innerHTML = '&laquo; Prev';
      if (s.currentPage > 1) {
        prevBtn.addEventListener('click', () => {
          s.currentPage--;
          this.renderGrid();
          this.renderPagination();
        });
      }
      linksContainer.appendChild(prevBtn);

      // Surrounding pages list (current +/- 2)
      const startPage = Math.max(1, s.currentPage - 2);
      const endPage = Math.min(totalPages, s.currentPage + 2);

      for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.type = 'button';
        pageBtn.className = `scheme-filter-page-link ${s.currentPage === i ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
          s.currentPage = i;
          this.renderGrid();
          this.renderPagination();
        });
        linksContainer.appendChild(pageBtn);
      }

      // Next Page Button
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = `scheme-filter-page-link ${s.currentPage === totalPages ? 'disabled' : ''}`;
      nextBtn.innerHTML = 'Next &raquo;';
      if (s.currentPage < totalPages) {
        nextBtn.addEventListener('click', () => {
          s.currentPage++;
          this.renderGrid();
          this.renderPagination();
        });
      }
      linksContainer.appendChild(nextBtn);
      container.appendChild(linksContainer);
    }
  }

  // Export results initializer to window context
  window.initSchemeResults = function(moduleInstance) {
    return new SchemeResults(moduleInstance);
  };
})(window);
