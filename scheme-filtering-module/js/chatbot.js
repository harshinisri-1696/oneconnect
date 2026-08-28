/**
 * Scheme Assistant Floating Chatbot Component
 * Implements the floating action button, chatbot panel, conversation interface,
 * and integration hook APIs for connecting real backend AI models.
 */

(function(window) {
  'use strict';

  class SchemeChatbot {
    constructor(moduleInstance) {
      this.module = moduleInstance;
      this.container = null;
      this.panel = null;
      this.trigger = null;
      this.messagesContainer = null;
      this.inputField = null;
      
      // External message handler callback (initially null, falls back to local heuristic)
      this.externalMessageSender = null;
      
      this.init();
    }

    init() {
      // 1. Create floating chatbot wrapper and append inside module container (retaining boundary)
      const wrapper = document.createElement('div');
      wrapper.className = 'scheme-chatbot-container';
      wrapper.innerHTML = `
        <!-- Floating Trigger Button -->
        <button type="button" class="scheme-chatbot-trigger" id="sfChatbotTrigger" aria-label="Open Scheme Assistant">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>

        <!-- Chat Panel -->
        <div class="scheme-chatbot-panel" id="sfChatbotPanel">
          <div class="scheme-chatbot-header">
            <div class="scheme-chatbot-header-title-area">
              <span class="scheme-chatbot-header-dot"></span>
              <h3>Scheme Assistant</h3>
            </div>
            <button type="button" class="scheme-chatbot-close" id="sfChatbotCloseBtn" aria-label="Close assistant">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Messages Area -->
          <div class="scheme-chatbot-messages" id="sfChatbotMessages">
            <div class="scheme-chat-bubble scheme-chat-bubble-assistant">
              Hello! I am your AI Scheme Assistant. I can help you search for schemes, check your eligibility, and understand application requirements.
            </div>
          </div>

          <!-- Suggested Quick Queries -->
          <div class="scheme-chatbot-suggested-queries" id="sfChatbotSuggestions">
            <button type="button" class="scheme-chatbot-query-tag" data-query="Am I eligible for any schemes?">Eligible Schemes?</button>
            <button type="button" class="scheme-chatbot-query-tag" data-query="Find education scholarships">Scholarships</button>
            <button type="button" class="scheme-chatbot-query-tag" data-query="Show schemes for farmers">Farmer Schemes</button>
          </div>

          <!-- Input Area -->
          <div class="scheme-chatbot-input-area">
            <input type="text" class="scheme-chatbot-input" id="sfChatbotInput" placeholder="Ask about a scheme...">
            <button type="button" class="scheme-chatbot-send-btn" id="sfChatbotSendBtn">Send</button>
          </div>
        </div>
      `;

      const targetModuleDiv = this.module.container.querySelector('.scheme-filter-module');
      if (targetModuleDiv) {
        targetModuleDiv.appendChild(wrapper);
      } else {
        this.module.container.appendChild(wrapper);
      }

      this.container = wrapper;
      this.panel = wrapper.querySelector('#sfChatbotPanel');
      this.trigger = wrapper.querySelector('#sfChatbotTrigger');
      this.messagesContainer = wrapper.querySelector('#sfChatbotMessages');
      this.inputField = wrapper.querySelector('#sfChatbotInput');

      this.bindEvents();
    }

    bindEvents() {
      // Toggle panel visibility
      this.trigger.addEventListener('click', () => {
        const isOpen = this.panel.classList.contains('open');
        if (isOpen) {
          this.closePanel();
        } else {
          this.openPanel();
        }
      });

      // Close panel button
      const closeBtn = this.container.querySelector('#sfChatbotCloseBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closePanel());
      }

      // Send message button
      const sendBtn = this.container.querySelector('#sfChatbotSendBtn');
      if (sendBtn) {
        sendBtn.addEventListener('click', () => this.handleSendMessage());
      }

      // Input field enter key press
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleSendMessage();
        }
      });

      // Click tags / suggested query buttons
      const suggestions = this.container.querySelector('#sfChatbotSuggestions');
      if (suggestions) {
        suggestions.addEventListener('click', (e) => {
          const btn = e.target.closest('.scheme-chatbot-query-tag');
          if (btn) {
            const query = btn.getAttribute('data-query');
            this.inputField.value = query;
            this.handleSendMessage();
          }
        });
      }
    }

    openPanel() {
      this.panel.classList.add('open');
      this.trigger.classList.add('active');
      this.inputField.focus();
    }

    closePanel() {
      this.panel.classList.remove('open');
      this.trigger.classList.remove('active');
    }

    appendMessage(text, isUser = false) {
      const bubble = document.createElement('div');
      bubble.className = `scheme-chat-bubble scheme-chat-bubble-${isUser ? 'user' : 'assistant'}`;
      bubble.textContent = text;
      this.messagesContainer.appendChild(bubble);
      this.scrollToBottom();
    }

    appendTypingIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'scheme-chat-typing-indicator';
      indicator.id = 'sfChatbotTypingIndicator';
      indicator.innerHTML = `
        <span class="scheme-chat-typing-dot"></span>
        <span class="scheme-chat-typing-dot"></span>
        <span class="scheme-chat-typing-dot"></span>
      `;
      this.messagesContainer.appendChild(indicator);
      this.scrollToBottom();
      return indicator;
    }

    removeTypingIndicator() {
      const indicator = this.messagesContainer.querySelector('#sfChatbotTypingIndicator');
      if (indicator) {
        indicator.remove();
      }
    }

    scrollToBottom() {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    async handleSendMessage() {
      const query = this.inputField.value.trim();
      if (!query) return;

      // Clear input
      this.inputField.value = '';

      // Append user query to UI
      this.appendMessage(query, true);

      // Append typing indicator
      this.appendTypingIndicator();

      // Retrieve dynamic search and filter context to pass to the message handler
      const context = {
        profile: { ...this.module.profile },
        activeFilters: { ...this.module.state },
        visibleSchemes: this.module.getFilteredResults()
      };

      try {
        let responseText = '';
        if (typeof this.externalMessageSender === 'function') {
          // Call real registered API hook
          responseText = await this.externalMessageSender(query, context);
        } else {
          // Fall back to localized heuristic matching
          responseText = await this.getMockResponse(query, context);
        }
        
        this.removeTypingIndicator();
        this.appendMessage(responseText, false);
      } catch (err) {
        console.error('SchemeChatbot message processing error:', err);
        this.removeTypingIndicator();
        this.appendMessage('Sorry, I encountered an error processing your query. Please try again.');
      }
    }

    // ==========================================
    // BACKEND INTEGRATION API HOOKS
    // ==========================================
    registerMessageSender(senderCallback) {
      if (typeof senderCallback === 'function') {
        this.externalMessageSender = senderCallback;
      }
    }

    // ==========================================
    // SMART MOCK ASSISTANT COGNITION
    // ==========================================
    getMockResponse(query, context) {
      return new Promise((resolve) => {
        // Simulate networking latency (500ms - 1000ms)
        setTimeout(() => {
          const q = query.toLowerCase();
          const p = context.profile;
          const schemes = context.visibleSchemes;

          // 1. Check for eligibility-based queries
          if (q.includes('eligible') || q.includes('qualify') || q.includes('suit') || q.includes('any schemes')) {
            const eligibleSchemes = schemes.filter(s => this.module.evaluateEligibility(s).status === 'ELIGIBLE');
            
            if (eligibleSchemes.length > 0) {
              const listText = eligibleSchemes.slice(0, 3).map(s => `• ${s.name} (${s.category})`).join('\n');
              resolve(`Based on your profile (Age: ${p.age || 'N/A'}, State: ${p.state || 'N/A'}, Occupation: ${p.occupation || 'N/A'}), I found ${eligibleSchemes.length} schemes you qualify for. Here are the top recommendations:\n\n${listText}\n\nAdjust your filters or profile settings to see details!`);
            } else {
              resolve(`I evaluated the current schemes against your profile but couldn't find any direct match. Ensure your Profile (Age, State, Income, Occupation) is filled out to find matching services.`);
            }
            return;
          }

          // 2. Check for educational scholarships
          if (q.includes('scholarship') || q.includes('education') || q.includes('student') || q.includes('school') || q.includes('study')) {
            const eduSchemes = this.module.dataset.filter(s => (s.category || '').toLowerCase().includes('education'));
            if (eduSchemes.length > 0) {
              const listText = eduSchemes.slice(0, 3).map(s => `• ${s.name}`).join('\n');
              resolve(`Here are some of the popular educational and scholarship schemes in our database:\n\n${listText}\n\nYou can click on Category -> "Education & Learning" to inspect all of them.`);
            } else {
              resolve(`I couldn't locate any educational schemes in our dataset at this time.`);
            }
            return;
          }

          // 3. Check for agriculture/farmers
          if (q.includes('farmer') || q.includes('agriculture') || q.includes('rural') || q.includes('crop') || q.includes('fertilizer')) {
            const farmSchemes = this.module.dataset.filter(s => (s.category || '').toLowerCase().includes('agriculture'));
            if (farmSchemes.length > 0) {
              const listText = farmSchemes.slice(0, 3).map(s => `• ${s.name}`).join('\n');
              resolve(`Here are some agricultural support programs we manage:\n\n${listText}\n\nFilter by Category -> "Agriculture & Rural" to examine requirements.`);
            } else {
              resolve(`No agriculture schemes found in the active catalog.`);
            }
            return;
          }

          // 4. Check for application guide
          if (q.includes('how to apply') || q.includes('apply') || q.includes('procedure') || q.includes('process')) {
            resolve(`To apply for a scheme:\n1. Click "View Details" on the scheme card.\n2. Scroll down to review the "Application Process" and "Required Documents".\n3. Click "Apply Now" to visit the official government site and register.`);
            return;
          }

          // 5. Keyword search in database
          const matched = this.module.dataset.filter(s => 
            (s.name || '').toLowerCase().includes(q) || 
            (s.details || '').toLowerCase().includes(q)
          );

          if (matched.length > 0) {
            const listText = matched.slice(0, 2).map(s => `* ${s.name}: ${s.details.substring(0, 110)}...`).join('\n\n');
            resolve(`I found ${matched.length} schemes matching your query:\n\n${listText}\n\nType in the main search bar to see them on the grid!`);
          } else {
            // General Help
            resolve(`I couldn't find a specific scheme for "${query}". You can ask me:\n• "What schemes am I eligible for?"\n• "Show me student scholarships"\n• "Tell me about agricultural support"`);
          }
        }, 800);
      });
    }
  }

  // Bind chatbot initializer to window context
  window.initSchemeChatbot = function(moduleInstance) {
    return new SchemeChatbot(moduleInstance);
  };
})(window);
