// PropertyMatch AI — integração n8n
const WEBHOOK_URL = 'https://pedromendes-formacao.app.n8n.cloud/webhook/property_match';
const form = document.querySelector('#chat-form');
const input = document.querySelector('#chat-input');
const messages = document.querySelector('#chat-messages');
const prompts = document.querySelector('#quick-prompts');
const button = form.querySelector('button');
const sessionId = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
let busy = false;

function addMessage(text, role = 'assistant') {
  const wrap = document.createElement('div');
  wrap.className = `message ${role}`;
  if (role === 'assistant') {
    const avatar = document.createElement('div');
    avatar.className = 'avatar'; avatar.textContent = '✦'; wrap.append(avatar);
  }
  const bubble = document.createElement('div');
  bubble.className = 'bubble'; bubble.textContent = text;
  wrap.append(bubble); messages.append(wrap);
  messages.scrollTop = messages.scrollHeight;
  return wrap;
}

function extractReply(data) {
  if (typeof data === 'string') return data.trim();
  if (Array.isArray(data)) return data.map(extractReply).filter(Boolean).join('\n\n');
  if (data && typeof data === 'object') {
    for (const key of ['output', 'reply', 'response', 'answer', 'text', 'message', 'content', 'data']) {
      const reply = extractReply(data[key]);
      if (reply) return reply;
    }
  }
  return '';
}

async function send(text) {
  const trimmed = text.trim();
  if (!trimmed || busy) return;
  busy = true; button.disabled = true;
  addMessage(trimmed, 'user');
  prompts.hidden = true;
  input.value = ''; input.style.height = 'auto';
  const pending = addMessage('A pensar…');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatInput: trimmed, message: trimmed, sessionId, action: 'sendMessage' }),
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const raw = await response.text();
    let data = raw;
    try { data = JSON.parse(raw); } catch {}
    const reply = extractReply(data);
    if (!reply) throw new Error('Resposta vazia ou formato não reconhecido');
    pending.remove();
    addMessage(reply);
  } catch (error) {
    pending.remove();
    console.error('PropertyMatch webhook:', error);
    addMessage('Não consegui obter uma resposta do assistente. Tenta novamente daqui a pouco.');
    if (!input.value.trim()) input.value = trimmed;
  } finally {
    clearTimeout(timeout);
    busy = false; button.disabled = false; input.focus();
  }
}
form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 120)}px`; });
input.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(input.value); }
});
prompts.addEventListener('click', e => { if (e.target.matches('button')) send(e.target.textContent); });
