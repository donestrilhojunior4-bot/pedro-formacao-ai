// PropertyMatch AI — chat demo (front-end only; no live AI API connected)
const form = document.querySelector('#chat-form');
const input = document.querySelector('#chat-input');
const messages = document.querySelector('#chat-messages');
const prompts = document.querySelector('#quick-prompts');
let conversationStep = 0;
let conversationProfile = { mode: '', location: '', budget: '', type: '', details: '' };

function addMessage(text, role = 'assistant') {
  const wrap = document.createElement('div');
  wrap.className = `message ${role}`;
  if (role === 'assistant') {
    const avatar = document.createElement('div'); avatar.className = 'avatar'; avatar.textContent = '✦'; wrap.append(avatar);
  }
  const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.textContent = text;
  wrap.append(bubble); messages.append(wrap); messages.scrollTop = messages.scrollHeight;
}
function answerFor(text) {
  const t = text.toLowerCase();
  if (conversationStep === 0) {
    conversationProfile.mode = /arrend|alugar|rent/.test(t) ? 'Arrendar' : /compr|buy/.test(t) ? 'Comprar' : 'A explorar';
    conversationStep++;
    return `Ótimo, ${conversationProfile.mode.toLowerCase()}! 😊 Em que cidade ou zona gostarias de viver? (Podes dizer uma zona ou até várias.)`;
  }
  if (conversationStep === 1) { conversationProfile.location = text; conversationStep++; return 'Percebido! E tens algum orçamento em mente? Podes indicar um valor máximo, uma faixa ou dizer “ainda não sei”.'; }
  if (conversationStep === 2) { conversationProfile.budget = text; conversationStep++; return 'Obrigado! Que tipo de imóvel imaginas — por exemplo, T1, T2, moradia, ou ainda não tens preferência?'; }
  if (conversationStep === 3) { conversationProfile.type = text; conversationStep++; return 'E o que é mesmo importante para ti na casa? Varanda, luz natural, garagem, transportes, espaço para animais… conta-me livremente.'; }
  conversationProfile.details += (conversationProfile.details ? ' | ' : '') + text;
  return `Já tenho algumas pistas para a tua pesquisa:\n• Negócio: ${conversationProfile.mode}\n• Zona: ${conversationProfile.location}\n• Orçamento: ${conversationProfile.budget}\n• Tipologia: ${conversationProfile.type}\n• Preferências: ${conversationProfile.details}\n\nNesta versão de demonstração consigo organizar o teu perfil, mas ainda não consulto anúncios reais nem uma IA ligada. Podes continuar a acrescentar detalhes!`;
}
function send(text) {
  const trimmed = text.trim(); if (!trimmed) return;
  addMessage(trimmed, 'user');
  const reply = answerFor(trimmed);
  window.setTimeout(() => addMessage(reply), 350);
  prompts.hidden = true;
  input.value = ''; input.style.height = 'auto'; input.focus();
}
form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
input.addEventListener('input', () => { input.style.height = 'auto'; input.style.height = `${Math.min(input.scrollHeight, 120)}px`; });
prompts.addEventListener('click', e => { if (e.target.matches('button')) send(e.target.textContent); });
