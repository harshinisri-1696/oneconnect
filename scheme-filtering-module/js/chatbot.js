/**
 * Scheme Assistant Chatbot Component Bridge
 *
 * This file is a lightweight backward-compatibility wrapper.
 * The core chatbot implementation is now global and lives in `/chatbot/chatbot.js`.
 *
 * When SchemeModule initializes, it calls:
 *   window.initSchemeChatbot(moduleInstance)
 *
 * This bridge captures that call, links the scheme module to the global chatbot
 * instance, and returns the global chatbot instance.
 */

(function (window) {
  'use strict';

  window.initSchemeChatbot = function (moduleInstance) {
    // If the global chatbot has been initialized at the application level, link it
    if (window.oneConnectChatbot) {
      window.oneConnectChatbot.linkSchemeModule(moduleInstance);
      return window.oneConnectChatbot;
    }

    console.warn('OneConnect Chatbot Bridge: window.oneConnectChatbot instance not found. Make sure the global chatbot is initialized at the root level.');
    return null;
  };

})(window);
