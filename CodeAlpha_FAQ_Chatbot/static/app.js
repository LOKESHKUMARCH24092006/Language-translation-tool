/* ═══════════════════════════════════════════════════════════════
   FAQ Chatbot — Frontend JavaScript
   Handles: chat UI, API calls, sidebar, FAQ browser, animations
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── DOM References ───────────────────────────────────────────────
const messagesContainer = document.getElementById('messagesContainer');
const userInput         = document.getElementById('userInput');
const sendBtn           = document.getElementById('sendBtn');
const clearBtn          = document.getElementById('clearChat');
const faqBrowser        = document.getElementById('faqBrowser');
const quickPrompts      = document.getElementById('quickPrompts');
const hamburger         = document.getElementById('hamburger');
const sidebar           = document.getElementById('sidebar');
const sidebarClose      = document.getElementById('sidebarClose');

// ─── State ────────────────────────────────────────────────────────
let isTyping    = false;
let chatHistory = [];

// ─── Initialisation ───────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  renderWelcome();
  loadStats();
  loadFAQBrowser();
  autoResizeTextarea();
});


// ═══════════════════════════════════════════════════════════════
//  SIDEBAR
// ═══════════════════════════════════════════════════════════════

hamburger.addEventListener('click', () => sidebar.classList.add('open'));
sidebarClose.addEventListener('click', () => sidebar.classList.remove('open'));

// Close sidebar when user clicks outside (mobile)
document.addEventListener('click', e => {
  if (
    window.innerWidth <= 700 &&
    sidebar.classList.contains('open') &&
    !sidebar.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    sidebar.classList.remove('open');
  }
});


// ═══════════════════════════════════════════════════════════════
//  INPUT — Auto-resize & Enable/Disable Send
// ═══════════════════════════════════════════════════════════════

function autoResizeTextarea() {
  userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = Math.min(userInput.scrollHeight, 140) + 'px';
    sendBtn.disabled = userInput.value.trim().length === 0;
  });
}

// Send on Enter (Shift+Enter inserts a newline)
userInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!sendBtn.disabled && !isTyping) handleSend();
  }
});

sendBtn.addEventListener('click', () => {
  if (!isTyping) handleSend();
});


// ═══════════════════════════════════════════════════════════════
//  QUICK PROMPTS
// ═══════════════════════════════════════════════════════════════

quickPrompts.querySelectorAll('.qp-chip').forEach(btn => {
  btn.addEventListener('click', () => {
    userInput.value  = btn.dataset.q;
    sendBtn.disabled = false;
    handleSend();
  });
});


// ═══════════════════════════════════════════════════════════════
//  CLEAR CHAT
// ═══════════════════════════════════════════════════════════════

clearBtn.addEventListener('click', () => {
  chatHistory                = [];
  messagesContainer.innerHTML = '';
  renderWelcome();
});


// ═══════════════════════════════════════════════════════════════
//  MAIN SEND HANDLER
// ═══════════════════════════════════════════════════════════════

async function handleSend() {
  const text = userInput.value.trim();
  if (!text || isTyping) return;

  // Hide quick prompts after first interaction
  quickPrompts.style.display = 'none';

  // Render user bubble
  appendUserMessage(text);
  chatHistory.push({ role: 'user', text });

  // Reset input
  userInput.value      = '';
  userInput.style.height = 'auto';
  sendBtn.disabled     = true;

  // Show typing indicator while waiting for response
  const typingEl = showTypingIndicator();
  isTyping = true;

  try {
    const res = await fetch('/api/chat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message: text }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    typingEl.remove();
    appendBotMessage(data);
    chatHistory.push({ role: 'bot', data });

  } catch (err) {
    typingEl.remove();
    appendErrorMessage('Connection error. Please make sure the server is running.');
    console.error(err);

  } finally {
    isTyping = false;
  }
}


// ═══════════════════════════════════════════════════════════════
//  RENDER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function renderWelcome() {
  const card = document.createElement('div');
  card.className = 'welcome-card';
  card.innerHTML = `
    <div class="welcome-bot-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="10" rx="2"/>
        <path d="M12 2v5M8 7h8M9 15h.01M15 15h.01"/>
      </svg>
    </div>
    <h2>Hi, I'm your FAQ Assistant! 👋</h2>
    <p>I can help you find answers instantly. Just type your question below or choose
       a topic from the sidebar. I use <strong>NLP</strong> and
       <strong>cosine similarity</strong> to match your question to the best answer.</p>
    <div class="welcome-tags">
      <span class="welcome-tag">💳 Billing</span>
      <span class="welcome-tag">🔑 Account</span>
      <span class="welcome-tag">⚙️ Technical</span>
      <span class="welcome-tag">✨ Features</span>
      <span class="welcome-tag">🛟 Support</span>
    </div>`;
  messagesContainer.appendChild(card);
  scrollToBottom();
}


function appendUserMessage(text) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message user';
  wrapper.innerHTML = `
    <div class="msg-avatar user-av">${getUserInitial()}</div>
    <div class="bubble">${escapeHtml(text)}</div>`;
  messagesContainer.appendChild(wrapper);
  scrollToBottom();
}


function appendBotMessage(data) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message bot';

  if (data.status === 'not_found') {
    wrapper.innerHTML = `
      <div class="msg-avatar bot-av">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="10" rx="2"/>
          <path d="M12 2v5M8 7h8"/>
        </svg>
      </div>
      <div class="bubble">
        <p style="color:var(--text-secondary)">${escapeHtml(data.message)}</p>
      </div>`;

  } else {
    const scorePercent   = Math.round(data.score * 100);
    const suggestionsHtml = data.suggestions && data.suggestions.length
      ? `<div class="suggestions-row">
           <span class="sugg-label">💡 Related questions:</span>
           ${data.suggestions
               .map(q => `<button class="sugg-btn" data-question="${escapeAttr(q)}">${escapeHtml(q)}</button>`)
               .join('')}
         </div>`
      : '';

    wrapper.innerHTML = `
      <div class="msg-avatar bot-av">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="10" rx="2"/>
          <path d="M12 2v5M8 7h8M9 15h.01M15 15h.01"/>
        </svg>
      </div>
      <div class="bubble">
        <div class="matched-q">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          ${escapeHtml(data.matched_question)}
        </div>
        <div class="answer-text">${escapeHtml(data.answer)}</div>
        <span class="category-chip">📁 ${escapeHtml(data.category)}</span>
        <div class="confidence-bar">
          <div class="conf-label">
            <span>Match confidence</span>
            <span>${scorePercent}%</span>
          </div>
          <div class="conf-track">
            <div class="conf-fill ${data.confidence}" style="width:${scorePercent}%"></div>
          </div>
        </div>
        ${suggestionsHtml}
      </div>`;
  }

  messagesContainer.appendChild(wrapper);

  // Safe event delegation — avoids inline onclick issues with special characters
  wrapper.querySelectorAll('.sugg-btn[data-question]').forEach(btn => {
    btn.addEventListener('click', () => askQuestion(btn.dataset.question));
  });

  scrollToBottom();
}


function appendErrorMessage(msg) {
  const wrapper = document.createElement('div');
  wrapper.className = 'message bot';
  wrapper.innerHTML = `
    <div class="msg-avatar bot-av">⚠️</div>
    <div class="error-bubble">${escapeHtml(msg)}</div>`;
  messagesContainer.appendChild(wrapper);
  scrollToBottom();
}


function showTypingIndicator() {
  const wrapper = document.createElement('div');
  wrapper.className = 'typing-indicator';
  wrapper.innerHTML = `
    <div class="msg-avatar bot-av">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <rect x="3" y="11" width="18" height="10" rx="2"/><path d="M12 2v5M8 7h8"/>
      </svg>
    </div>
    <div class="typing-dots">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>`;
  messagesContainer.appendChild(wrapper);
  scrollToBottom();
  return wrapper;
}


// ═══════════════════════════════════════════════════════════════
//  ASK FROM SUGGESTION / FAQ BROWSER
// ═══════════════════════════════════════════════════════════════

function askQuestion(q) {
  userInput.value  = q;
  sendBtn.disabled = false;
  handleSend();
}


// ═══════════════════════════════════════════════════════════════
//  API — Load Stats
// ═══════════════════════════════════════════════════════════════

async function loadStats() {
  try {
    const res  = await fetch('/api/stats');
    const data = await res.json();
    document.getElementById('statFaqs').textContent = data.total_faqs;
    document.getElementById('statCats').textContent = data.categories;
  } catch {
    /* silent fail — stats are non-critical */
  }
}


// ═══════════════════════════════════════════════════════════════
//  API — Load FAQ Browser (sidebar accordion)
// ═══════════════════════════════════════════════════════════════

async function loadFAQBrowser() {
  try {
    const res  = await fetch('/api/faqs');
    const data = await res.json();

    faqBrowser.innerHTML = '';

    const categoryIcons = {
      Account:   '👤',
      Billing:   '💳',
      Technical: '⚙️',
      Features:  '✨',
      Support:   '🛟',
    };

    for (const [cat, items] of Object.entries(data)) {
      const icon     = categoryIcons[cat] || '📋';
      const catDiv   = document.createElement('div');
      catDiv.className = 'faq-category';

      const catBtn = document.createElement('button');
      catBtn.className = 'faq-cat-btn';
      catBtn.innerHTML = `<span>${icon} ${cat}</span><span class="cat-arrow">›</span>`;

      const itemsDiv = document.createElement('div');
      itemsDiv.className = 'faq-items';

      items.forEach(item => {
        const btn = document.createElement('button');
        btn.className   = 'faq-item-btn';
        btn.textContent = item.question;
        btn.addEventListener('click', () => {
          askQuestion(item.question);
          if (window.innerWidth <= 700) sidebar.classList.remove('open');
        });
        itemsDiv.appendChild(btn);
      });

      catBtn.addEventListener('click', () => {
        const isOpen = catBtn.classList.contains('open');

        // Collapse all open categories first
        faqBrowser.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('open'));
        faqBrowser.querySelectorAll('.faq-items').forEach(d => d.classList.remove('visible'));

        // Open the clicked one if it was closed
        if (!isOpen) {
          catBtn.classList.add('open');
          itemsDiv.classList.add('visible');
        }
      });

      catDiv.appendChild(catBtn);
      catDiv.appendChild(itemsDiv);
      faqBrowser.appendChild(catDiv);
    }

  } catch {
    faqBrowser.innerHTML =
      '<p style="color:var(--text-muted);font-size:.8rem;padding:16px">Could not load FAQ browser</p>';
  }
}


// ═══════════════════════════════════════════════════════════════
//  UTILITY HELPERS
// ═══════════════════════════════════════════════════════════════

function scrollToBottom() {
  requestAnimationFrame(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

function escapeAttr(str) {
  // Full HTML-encoding for use inside double-quoted HTML attributes
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;');
}

function getUserInitial() {
  return 'U';
}