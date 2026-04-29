/* ================================================
   LUXEESTATE AI — SCRIPT.JS
   Claude AI Powered · Real Estate Chatbot
================================================ */

// ── SYSTEM PROMPT ──────────────────────────────
const SYSTEM_PROMPT = `You are LuxeEstate AI, an elite and professional Real Estate AI Assistant for Pakistan's premium property market.

Your expertise covers:
- DHA (Defence Housing Authority): Lahore, Karachi, Islamabad — all phases
- Bahria Town: Lahore, Karachi, Islamabad, Rawalpindi
- Gulberg, Model Town, Garden Town, Johar Town Lahore
- Residential plots, houses, apartments, and commercial properties
- Property investment strategies and market trends (2025)
- Legal process, FBRLDA/LDA approvals, registry, transfer letters
- Booking procedures, installment plans, developer credibility

Current 2025 Market Rates (approximate):
DHA Lahore:
  - 5 Marla plot: PKR 1.2–2 Crore (phase-wise)
  - 10 Marla plot: PKR 2.5–4 Crore
  - 1 Kanal plot: PKR 5–9 Crore
  - 1 Kanal house: PKR 6–15 Crore

Bahria Town Lahore:
  - 5 Marla plot: PKR 70–90 Lakh
  - 10 Marla plot: PKR 1.4–2 Crore
  - 1 Kanal plot: PKR 2.8–4 Crore

Gulberg / Model Town:
  - Commercial shops: PKR 3–15 Crore
  - Residential plots: PKR 2–6 Crore per Kanal

Your personality:
- Sophisticated, warm, and deeply knowledgeable
- Speak in a professional yet conversational English tone
- Give DETAILED, informative answers — never short or generic
- Use bullet points and structured breakdowns when helpful
- Always end with an offer to help further or ask a follow-up
- If asked about contact: Phone 0300-1234567, Email: info@luxeestate.pk
- If you don't know exact current prices, give a realistic range with context

NEVER say "I don't know" — always provide your best knowledge and context.`;

// ── STATE ──────────────────────────────────────
let conversationHistory = [];
let isLoading = false;

// ── INIT ───────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Splash screen → show app
  setTimeout(() => {
    const splash = document.getElementById('splash');
    const app    = document.getElementById('app');
    splash.classList.add('gone');
    app.classList.remove('hidden');
    setTimeout(() => app.classList.add('visible'), 50);
  }, 2800);

  // Enter key listener
  document.getElementById('userInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});

// ── SEND MESSAGE ───────────────────────────────
async function sendMessage() {
  const input   = document.getElementById('userInput');
  const message = input.value.trim();
  if (!message || isLoading) return;

  // Hide welcome block
  const welcome = document.querySelector('.welcome-block');
  if (welcome) welcome.style.display = 'none';

  // Hide chips after first message
  document.getElementById('chipsRow').style.display = 'none';

  input.value = '';
  appendMessage('user', message);
  conversationHistory.push({ role: 'user', content: message });

  setLoading(true);
  showTyping();

  try {
    const reply = await callClaudeAPI();
    removeTyping();
    appendMessage('bot', reply);
    conversationHistory.push({ role: 'assistant', content: reply });
  } catch (err) {
    removeTyping();
    appendMessage('bot', '⚠️ I encountered a technical issue. Please check your API key in script.js or try again shortly. If this persists, contact our agent directly at 03214545753.');
    console.error('Claude API Error:', err);
  } finally {
    setLoading(false);
  }
}

// ── CHIP SHORTCUT ──────────────────────────────
function chipSend(el) {
  const input = document.getElementById('userInput');
  input.value = el.textContent;
  sendMessage();
}

// ── CLEAR CHAT ─────────────────────────────────
function clearChat() {
  conversationHistory = [];
  const chatbox = document.getElementById('chatbox');
  chatbox.innerHTML = `
    <div class="welcome-block">
      <div class="welcome-icon">🏛️</div>
      <h2 class="welcome-title">Welcome to LuxeEstate AI</h2>
      <p class="welcome-desc">Pakistan's most advanced real estate intelligence platform. Ask me anything about properties, prices, locations, investments, or the buying process — I'm here 24/7.</p>
    </div>`;
  document.getElementById('chipsRow').style.display = 'flex';
}

// ── CLAUDE API CALL ────────────────────────────
async function callClaudeAPI() {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // ⚠️ IMPORTANT: Replace YOUR_API_KEY_HERE with your actual Anthropic API key
      // Get your key from: https://console.anthropic.com/
      // NOTE: For production, use a backend proxy to keep your key secure!
      'x-api-key': 'YOUR_API_KEY_HERE',
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: conversationHistory
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// ── APPEND MESSAGE ─────────────────────────────
function appendMessage(sender, text) {
  const chatbox = document.getElementById('chatbox');

  const row = document.createElement('div');
  row.className = `msg-row ${sender}`;

  const avatar = document.createElement('div');
  avatar.className = `msg-avatar ${sender === 'bot' ? 'bot-av' : 'user-av'}`;
  avatar.textContent = sender === 'bot' ? 'AI' : '👤';

  const bubble = document.createElement('div');
  bubble.className = `msg-bubble ${sender === 'bot' ? 'bot-bubble' : 'user-bubble'}`;

  // Render line breaks properly
  bubble.innerHTML = formatText(text);

  row.appendChild(avatar);
  row.appendChild(bubble);
  chatbox.appendChild(row);
  chatbox.scrollTop = chatbox.scrollHeight;
}

// ── FORMAT TEXT ────────────────────────────────
function formatText(text) {
  // Convert **bold** to <strong>
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Convert bullet lines
  text = text.replace(/^[-•]\s+/gm, '• ');
  // Convert line breaks
  text = text.replace(/\n/g, '<br>');
  return text;
}

// ── TYPING INDICATOR ───────────────────────────
function showTyping() {
  const chatbox = document.getElementById('chatbox');
  const row = document.createElement('div');
  row.className = 'typing-row';
  row.id = 'typingIndicator';

  const avatar = document.createElement('div');
  avatar.className = 'msg-avatar bot-av';
  avatar.textContent = 'AI';

  const bubble = document.createElement('div');
  bubble.className = 'typing-bubble';
  bubble.innerHTML = '<span></span><span></span><span></span>';

  row.appendChild(avatar);
  row.appendChild(bubble);
  chatbox.appendChild(row);
  chatbox.scrollTop = chatbox.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

// ── LOADING STATE ──────────────────────────────
function setLoading(state) {
  isLoading = state;
  const btn   = document.getElementById('sendBtn');
  const input = document.getElementById('userInput');
  btn.disabled   = state;
  input.disabled = state;
}
