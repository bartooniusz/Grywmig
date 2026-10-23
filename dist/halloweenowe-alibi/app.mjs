import { CASES, solutions, truthTable, verdict, formatTime } from './model.mjs';
const $ = id => document.getElementById(id);
const KEY = 'gwm-halloween-alibi-v1';
const defaults = () => ({ index: 0, phase: 'cover', culprit: '', liar: '', elapsed: 0, hints: 0, attempts: 0, solved: [], completedEvent: false });
let state = defaults();
try {
  const saved = JSON.parse(localStorage.getItem(KEY));
  if (saved && Number.isInteger(saved.index) && saved.index >= 0 && saved.index < CASES.length && ['cover','play','won','revealed'].includes(saved.phase)) {
    const ids = CASES[saved.index].people.map(p => p.id);
    state = { ...defaults(), index: saved.index, phase: saved.phase, culprit: ids.includes(saved.culprit) ? saved.culprit : '', liar: ids.includes(saved.liar) ? saved.liar : '', elapsed: Number.isFinite(saved.elapsed) ? Math.max(0, saved.elapsed) : 0, hints: Math.min(3, Math.max(0, Number(saved.hints) || 0)), attempts: Math.max(0, Number(saved.attempts) || 0), solved: Array.isArray(saved.solved) ? saved.solved.filter(id => CASES.some(c => c.id === id)) : [], completedEvent: !!saved.completedEvent };
  }
} catch {}
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { $('local-progress').textContent = 'Zapis w tej przeglądarce jest niedostępny.'; } };
const emit = action => {
  const detail = { type: 'grywmig:halloween:event', action, game_id: 'halloween_alibi', case_id: CASES[state.index].id, hints: state.hints, attempts: state.attempts, elapsed_seconds: Math.floor(state.elapsed / 1000) };
  window.dispatchEvent(new CustomEvent('gwm:game_event', { detail }));
  if (parent !== window) parent.postMessage(detail, location.origin);
};
const icon = name => {
  const shapes = { hat: '<path d="m8 28 8-23 11 23Z" fill="#087e79"/><path d="m5 29 25-2 3 5H3Z" fill="#172b3a"/><path d="m12 20 10-1" stroke="#d8f36a" stroke-width="3"/>', bat: '<path d="M3 10c8 0 9 7 15 7s7-7 15-7l-1 15-8-3-6 8-6-8-8 3Z" fill="#36554e"/><path d="m14 13 1-7 3 4 3-4 1 7" fill="#36554e"/><circle cx="16" cy="17" r="1" fill="#d8f36a"/><circle cx="20" cy="17" r="1" fill="#d8f36a"/>', ghost: '<path d="M7 31V16a11 11 0 0 1 22 0v15l-5-3-6 4-6-4Z" fill="#dbe9e8" stroke="#719891"/><ellipse cx="14" cy="17" rx="2" ry="3" fill="#172b3a"/><ellipse cx="22" cy="17" rx="2" ry="3" fill="#172b3a"/><path d="M15 24q3 3 6 0" fill="none" stroke="#172b3a" stroke-width="1.5"/>', cat: '<path d="m7 18 1-12 9 7h3l9-7 1 12c4 16-26 16-23 0Z" fill="#36554e"/><path d="m11 20 4-1m7 0 4 1" stroke="#d8f36a" stroke-width="2"/><path d="m16 25 2 2 2-2" fill="#ff8066"/>' };
  return `<svg viewBox="0 0 36 36" aria-hidden="true">${shapes[name] || shapes.ghost}</svg>`;
};
function renderChoices(container, key, puzzle) {
  container.replaceChildren();
  for (const person of puzzle.people) {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'choice'; button.textContent = person.name; button.dataset.person = person.id;
    button.setAttribute('aria-pressed', String(state[key] === person.id)); button.disabled = ['won','revealed'].includes(state.phase);
    button.addEventListener('click', () => { state[key] = person.id; renderSelection(); persist(); }); container.append(button);
  }
}
function renderSelection() {
  for (const [id, key] of [['culprit-choices','culprit'], ['liar-choices','liar']]) {
    $(id).querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.person === state[key])));
  }
  $('check').disabled = !state.culprit || !state.liar || state.phase !== 'play';
  if (state.phase === 'play') { $('status').className = 'status'; $('status').textContent = state.culprit && state.liar ? 'Gotowe? Sprawdź swoją dedukcję.' : 'Wybierz sprawcę i kłamcę.'; }
}
function render() {
  const puzzle = CASES[state.index];
  $('cover').hidden = state.phase !== 'cover'; $('play').hidden = state.phase === 'cover';
  $('start').innerHTML = `Zbadaj ${state.index === 0 ? 'pierwszą' : 'kolejną'} sprawę <span aria-hidden="true">→</span>`;
  $('case-title').textContent = puzzle.title; $('case-location').textContent = puzzle.location; $('case-number').textContent = `Sprawa ${state.index + 1} z ${CASES.length}`; $('story').textContent = puzzle.story; $('culprit-question').textContent = puzzle.question;
  $('case-progress').innerHTML = CASES.map((c,i) => `<span class="${i === state.index ? 'active' : state.solved.includes(c.id) ? 'solved' : ''}" aria-label="Sprawa ${i + 1}${state.solved.includes(c.id) ? ', rozwiązana' : ''}"></span>`).join('');
  $('witnesses').className = `witnesses${puzzle.people.length === 4 ? ' four' : ''}`;
  $('witnesses').innerHTML = puzzle.people.map(p => `<article class="witness"><div class="witness-identity"><span class="avatar">${icon(p.icon)}</span><div><strong>${p.name}</strong><small>${p.costume}</small></div></div><blockquote>„${p.quote}”</blockquote></article>`).join('');
  renderChoices($('culprit-choices'), 'culprit', puzzle); renderChoices($('liar-choices'), 'liar', puzzle); renderSelection();
  $('timer').textContent = formatTime(state.elapsed); $('hint-count').textContent = `${state.hints}/3`; $('hint-text').hidden = !state.hints; $('hint-text').textContent = puzzle.hints[state.hints - 1] || '';
  $('hint').disabled = state.hints >= 3 || state.phase !== 'play'; $('reveal').disabled = state.phase !== 'play'; $('reveal-confirm').hidden = true;
  $('result').hidden = !['won','revealed'].includes(state.phase); $('share').hidden = state.phase !== 'won'; $('share-copy').hidden = true; $('share-status').textContent = ''; $('explanation').open = state.phase === 'revealed';
  if (!$( 'result').hidden) {
    const solution = solutions(puzzle)[0], culprit = puzzle.people.find(p => p.id === solution.culprit), liar = puzzle.people.find(p => p.id === solution.liar);
    $('result-kicker').textContent = state.phase === 'won' ? 'Dobra dedukcja!' : 'Rozwiązanie odsłonięte'; $('result-title').textContent = state.phase === 'won' ? 'Sprawa rozwiązana.' : 'Oto co się wydarzyło.';
    $('result-summary').textContent = `${culprit.name} to sprawca. ${liar.name} to jedyna osoba, która skłamała.`;
    $('result-facts').innerHTML = `<span>Czas: ${formatTime(state.elapsed)}</span><span>Podpowiedzi: ${state.hints}/3</span><span>Sprawdzenia: ${state.attempts}</span>`;
    $('explanation-text').textContent = puzzle.explanation;
    $('truths').innerHTML = truthTable(puzzle, solution.culprit).map(p => `<li><span class="truth-badge${p.truth ? '' : ' lie'}">${p.truth ? 'PRAWDA' : 'KŁAMSTWO'}</span> ${p.name}: „${p.quote}”</li>`).join('');
    $('next').textContent = state.index === CASES.length - 1 ? 'Zagraj ponownie →' : 'Następna sprawa →';
  }
}
function begin(index = state.index) {
  const solved = state.solved;
  state = { ...defaults(), index, phase: 'play', solved };
  render(); persist(); emit('game_start'); $('case-title').focus({ preventScroll: true }); $('play').scrollIntoView({ behavior: 'instant', block: 'start' });
}
$('start').addEventListener('click', () => begin());
$('back').addEventListener('click', event => { event.preventDefault(); state.phase = 'cover'; render(); persist(); $('cover').scrollIntoView({ behavior: 'instant' }); $('start').focus({ preventScroll: true }); });
$('check').addEventListener('click', () => {
  if (state.phase !== 'play' || !state.culprit || !state.liar) return;
  state.attempts++;
  if (!verdict(CASES[state.index], state.culprit, state.liar)) { $('status').className = 'status error'; $('status').textContent = 'Te wskazania nie pasują do wszystkich zeznań i zasady jednego kłamcy. Sprawdź jeszcze raz.'; persist(); return; }
  state.phase = 'won'; if (!state.solved.includes(CASES[state.index].id)) state.solved.push(CASES[state.index].id);
  if (!state.completedEvent) { emit('game_complete'); state.completedEvent = true; } render(); persist(); $('result').focus({ preventScroll: true }); $('result').scrollIntoView({ behavior: 'instant', block: 'center' });
});
$('hint').addEventListener('click', () => { if (state.phase !== 'play' || state.hints >= 3) return; state.hints++; emit('hint_used'); render(); persist(); $('hint-text').scrollIntoView({ behavior: 'instant', block: 'nearest' }); });
$('reveal').addEventListener('click', () => { if (state.phase === 'play') { $('reveal-confirm').hidden = false; $('confirm-reveal').focus(); } });
$('cancel-reveal').addEventListener('click', () => { $('reveal-confirm').hidden = true; $('reveal').focus(); });
$('confirm-reveal').addEventListener('click', () => { if (state.phase !== 'play') return; state.phase = 'revealed'; emit('solution_revealed'); render(); persist(); $('result').focus({ preventScroll: true }); $('result').scrollIntoView({ behavior: 'instant', block: 'center' }); });
$('next').addEventListener('click', () => begin((state.index + 1) % CASES.length));
$('restart').addEventListener('click', () => begin());
$('next-game').addEventListener('click', () => emit('next_game_click'));
$('share').addEventListener('click', async () => {
  if (state.phase !== 'won') return;
  const text = `🎃 Halloweenowe Alibi\nSprawa ${state.index + 1}/3 rozwiązana w ${formatTime(state.elapsed)}.\n${state.hints ? `Podpowiedzi: ${state.hints}/3.` : 'Bez podpowiedzi!'} Twoja kolej.\nhttps://grywmig.pl/halloweenowe-alibi/`;
  emit('share_click');
  try { if (navigator.share) { await navigator.share({ title: 'Halloweenowe Alibi', text }); $('share-status').textContent = 'Wynik przekazany do udostępnienia.'; } else { await navigator.clipboard.writeText(text); $('share-status').textContent = 'Wynik skopiowany. Wklej go znajomym!'; } }
  catch (error) { if (error?.name === 'AbortError') return; $('share-copy').value = text; $('share-copy').hidden = false; $('share-copy').focus(); $('share-copy').select(); $('share-status').textContent = 'Skopiuj zaznaczony wynik.'; }
});
let lastTick = performance.now(), ticks = 0;
setInterval(() => { const now = performance.now(); if (state.phase === 'play' && !document.hidden) { state.elapsed += Math.min(2000, now - lastTick); $('timer').textContent = formatTime(state.elapsed); if (++ticks % 20 === 0) persist(); } lastTick = now; }, 250);
addEventListener('pagehide', persist); document.addEventListener('visibilitychange', () => { lastTick = performance.now(); persist(); });
render();
if (parent !== window) {
  const shell = document.querySelector('.game-shell');
  new ResizeObserver(() => parent.postMessage({ type: 'grywmig:halloween:resize', height: Math.ceil(shell.getBoundingClientRect().height) }, location.origin)).observe(shell);
}
