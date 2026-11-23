// PropertyMatch AI — interações do formulário (demo front-end)
const form = document.querySelector('#property-form');
const resultBox = document.querySelector('#results');


// Seleção Comprar / Arrendar
const modeButtons = document.querySelectorAll('[data-mode]');
modeButtons.forEach(button => button.addEventListener('click', () => {
  modeButtons.forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  document.querySelector('#mode').value = button.dataset.mode;
}));

// Grupos de opções: localização e tipologia são single-choice; extras são multi-choice.
document.querySelectorAll('.pill-group').forEach(group => {
  const multi = group.classList.contains('multi');
  group.querySelectorAll('.pill').forEach(button => button.addEventListener('click', () => {
    if (multi) {
      button.classList.toggle('selected');
      return;
    }
    group.querySelectorAll('.pill').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
  }));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const mode = data.get('mode') || 'Comprar';
  const location = document.querySelector('[data-group="location"] .selected')?.textContent || 'Indiferente';
  const type = document.querySelector('[data-group="type"] .selected')?.textContent || 'Qualquer';
  const extras = [...document.querySelectorAll('[data-group="features"] .selected')].map(el => el.textContent.trim());
  const min = data.get('budgetMin') ? Number(data.get('budgetMin')).toLocaleString('pt-PT') + ' €' : 'sem mínimo';
  const max = data.get('budgetMax') ? Number(data.get('budgetMax')).toLocaleString('pt-PT') + ' €' : 'sem máximo';
  const area = data.get('area') || 'não especificada';
  const description = data.get('description')?.trim();
  resultBox.hidden = false;
  resultBox.innerHTML = `<h3>Perfil de pesquisa criado ✨</h3><p><strong>${mode}</strong> · ${type} · ${location}<br>Orçamento: ${min} – ${max} · Área mínima: ${area} m²<br>Preferências: ${extras.length ? extras.join(', ') : 'sem extras selecionados'}${description ? `<br>Ideal: ${escapeHTML(description)}` : ''}<br><br>Esta versão é uma demonstração front-end: ainda não está ligada a uma base de imóveis nem a uma API de inteligência artificial.</p>`;
  resultBox.scrollIntoView({behavior: 'smooth', block: 'nearest'});
});
function escapeHTML(value) {
  return value.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}
