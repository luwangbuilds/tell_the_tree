import { STORAGE_KEY, blankGarden, addWorry, releaseWorry, chooseAction, harvestFlowers, deleteHarvest, decodeGarden, breathingPhase } from './model.js';

const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const date = value => new Date(value).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' });
const countText = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;
const paths = {
  leaf: '<path d="M20 4C9 2 3 6 4 13s9 10 13 4 3-13 3-13Z"/><path d="M4 21 16 9"/>',
  tree: '<path d="M12 22v-8m-5 4 5-4 5 3"/><path d="M6 16a4 4 0 0 1-2-7 5 5 0 0 1 9-5 5 5 0 0 1 7 6 4 4 0 0 1-3 7"/>',
  wind: '<path d="M3 8h12a3 3 0 1 0-3-3M3 12h16a3 3 0 1 1-3 3M3 16h6a3 3 0 1 1-3 3"/>',
  box: '<path d="M3 10h18v10H3Zm0 0V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v3M8 3v17M16 3v17"/><path d="M11 10h2v4h-2z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  pause: '<path d="M8 5v14M16 5v14" stroke-width="3"/>',
  play: '<path d="m9 5 10 7-10 7Z"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  flower: '<path d="M12 9C4 0 0 11 9 12c-9 8 2 12 3 3 8 9 12-2 3-3 9-8-2-12-3-3Z"/><circle cx="12" cy="12" r="2"/>',
};
function icon(name, cls = '') { return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.leaf}</svg>`; }
const sprig = '<svg viewBox="0 0 50 38" aria-hidden="true" class="sprig"><path d="M25 31C6 29 7 11 7 11c15 0 20 9 18 20Zm0 0C23 12 34 5 43 5c0 17-8 24-18 26Zm0 0C13 15 21 2 24 0c9 11 7 21 1 31Z" fill="currentColor"/></svg>';
const lotus = '<svg viewBox="0 0 180 150" class="lotus" aria-hidden="true"><path d="M90 131C30 90 70 33 90 8c20 25 60 82 0 123Z"/><path d="M90 131C28 131 12 81 17 43c42 6 70 42 73 88Zm0 0c62 0 78-50 73-88-42 6-70 42-73 88Z"/><path d="M90 131C32 149 5 115 2 86c39-4 70 11 88 45Zm0 0c58 18 85-16 88-45-39-4-70 11-88 45Z"/></svg>';
function chestIllustration() { return '<img class="chest-image" src="/assets/treasure-chest.webp" alt="" width="1536" height="1024" draggable="false" />'; }
function diamondSVG() { return `<svg class="diamond" viewBox="0 0 100 90" aria-hidden="true"><path d="M22 12h56L96 36 50 82 4 36Z" fill="#e7d4a4" stroke="#af904f"/><path d="m22 12 8 24 20-24 20 24 8-24M4 36h92M30 36l20 46 20-46" fill="none" stroke="#fff9ef" stroke-width="1.5"/><path d="m50 12 20 24H30Z" fill="#fff6dc"/><path d="m70 36-20 46 46-46Z" fill="#ba9656" opacity=".55"/></svg>`; }
function leafSVG() { return `<svg viewBox="0 0 70 70" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="M35 64C33 57 33 50 36 43" stroke="#766a43" stroke-width="1.6"/>
  <path d="M34 49C16 40 21 20 49 9C49 27 52 43 34 49Z" fill="#b6c987" stroke="#fff1c6" stroke-width="1.3"/>
  <path d="M34 48C37 34 41 23 49 10C49 27 51 42 34 48Z" fill="#829e62" opacity=".7"/>
  <path d="M33 52C34 37 41 22 47 13M35 40L28 31M38 31L44 28M41 23L34 22" stroke="#f9e9b4" stroke-width="1"/>
  <path d="M25 30C26 23 33 18 39 15" stroke="#fff8dc" stroke-width="1.1" opacity=".7"/>
</svg>`; }
function flowerSVG() { return `<svg viewBox="0 0 70 70" aria-hidden="true" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path d="M35 64C37 53 34 45 34 34" stroke="#766a43" stroke-width="1.5"/>
  <path d="M36 54C40 44 47 44 49 43C48 50 43 55 36 54Z" fill="#9aaa72" stroke="#dce3af" stroke-width=".8"/>
  <path d="M34 33C23 24 25 11 31 12C34 9 40 12 40 18C40 23 38 28 34 33Z" fill="#f9e6db" stroke="#fff7db" stroke-width="1.1"/>
  <path d="M34 33C37 18 49 17 52 23C57 26 51 33 46 34C42 35 38 35 34 33Z" fill="#f4d2c9" stroke="#fff7db" stroke-width="1.1"/>
  <path d="M34 33C48 31 55 41 48 45C45 51 38 46 36 41Z" fill="#edc0ba" stroke="#fff3d7" stroke-width="1.1"/>
  <path d="M34 33C41 44 34 54 28 49C21 50 20 42 26 37Z" fill="#f6d9cf" stroke="#fff7db" stroke-width="1.1"/>
  <path d="M34 33C23 40 13 35 17 29C15 22 23 19 28 25Z" fill="#fbe8dd" stroke="#fff7db" stroke-width="1.1"/>
  <path d="M33 20L34 30M46 26L37 32M44 41L37 35M29 44L33 36M22 29L31 32" stroke="#d99f99" stroke-width=".8" opacity=".65"/>
  <circle cx="34" cy="33" r="3.8" fill="#b8944f" stroke="#fff0bb" stroke-width="1"/>
  <path d="M32 31L32 31M36 32L36 32M34 35L34 35" stroke="#fff8dc" stroke-width="1.6"/>
</svg>`; }

let garden = blankGarden();
let loadError = '';
try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) garden = decodeGarden(raw); }
catch (error) { loadError = error.message || 'Your browser could not open saved data.'; }
const routes = ['tree', 'garden', 'breathe', 'treasure', 'finish'];
let view = routes.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'tree';
let gardenTab = 'leaves';
const selectedFlowers = new Set();
let draft = '';
let breathInterval;
let breathElapsed = 0;
let breathStart = 0;
let breathPaused = false;
let lastPhase = '';
let toastTimer;
let focusBeforeDialog;

function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message; el.classList.add('visible');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 4000);
}
function commit(next) {
  if (loadError) { toast('Please open “Your privacy” to resolve the saved-data issue first.'); return false; }
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); garden = next; return true; }
  catch { toast('Your browser could not save this change. Your text is still here. Please free some storage or allow local storage, then retry.'); return false; }
}
function transact(fn) {
  try { return commit(fn()); } catch (error) { toast(error.message); return false; }
}
function header() {
  return `<header class="site-header"><a href="#tree" class="brand" aria-label="Tell the Tree home">${sprig}<span>Tell the Tree</span></a><nav aria-label="Main navigation">${[['tree', 'My tree', 'tree'], ['breathe', 'Breathe', 'wind'], ['treasure', 'Treasure', 'box']].map(([key, label, symbol]) => `<a href="#${key}" ${view === key || (key === 'tree' && view === 'garden') ? 'aria-current="page"' : ''}>${icon(symbol)}<span>${label}</span></a>`).join('')}</nav><button class="icon-button privacy-top" data-do="privacy" aria-label="Your privacy">${icon('lock')}</button></header>`;
}
function footer() {
  return `<footer class="site-footer"><span>A little space. A gentler pace.</span><button class="text-button" data-do="privacy">${icon('lock')} Just for you, on this device</button></footer>`;
}
function cleanup() { clearInterval(breathInterval); document.querySelectorAll('.leaf-flight').forEach(el => el.remove()); }
function navigate(next) { if (view === next) return; location.hash = next; }
addEventListener('hashchange', () => {
  view = routes.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'tree';
  closeDialog(); render(); window.scrollTo({ top: 0 }); document.querySelector('#main')?.focus({ preventScroll: true });
});
function render() {
  cleanup();
  for (const flowerId of selectedFlowers) if (!garden.flowers.some(f => f.id === flowerId)) selectedFlowers.delete(flowerId);
  document.body.dataset.view = view;
  app.innerHTML = header() + (loadError ? `<div class="storage-banner" role="alert">Your saved garden needs attention. Nothing has been overwritten. <button data-do="privacy">Review saved data</button></div>` : '') + `<main id="main" tabindex="-1">${view === 'tree' ? treePage() : view === 'garden' ? collectionPage() : view === 'breathe' ? breathingPage() : view === 'treasure' ? treasurePage() : finishPage()}</main>` + footer();
  if (view === 'breathe') startBreathing();
}

function treePage() {
  return `<section class="tree-page page-enter"><div class="tree-heading"><span class="eyebrow">YOUR QUIET LITTLE CORNER</span><h1>A little space to let go.</h1><p class="subtitle">A little space for what is on your mind.</p><span class="gold-line"></span></div>
    <div class="tree-scene"><div class="tree-art-button"><img src="/assets/spring-tree.webp" alt="A sunlit spring tree with green leaves and soft pink blossoms" class="tree-art" fetchpriority="high" /></div><button class="tree-heart" data-do="garden" aria-label="View your leaves and flowers"><svg class="tap-cue" viewBox="0 0 68 72" fill="none" aria-hidden="true"><circle class="tap-ripple" cx="28" cy="12" r="9" stroke="#fff6cd" stroke-width="1.5"/><g class="tap-hand" stroke="#8b7449" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M24 36V15C24 9 32 9 32 15V29C32 24 40 24 40 30V32C40 27 48 28 48 34V36C48 31 55 32 55 38V44C55 52 50 59 44 61H32C29 61 26 59 24 56L14 41C11 35 17 31 21 36L24 40Z" fill="#fff9e9"/><path d="M32 29V39M40 32V40M48 36V42"/><path d="M31 55H44" stroke="#d0bb8b"/></g></svg></button>${garden.harvests.length ? `<button class="chest" data-do="treasure" aria-label="Open your diamonds, ${countText(garden.harvests.length, 'diamond')}">${chestIllustration()}</button><div class="chest-illumination" aria-hidden="true"><i></i><i></i><i></i><span class="diamond-count">${garden.harvests.length}</span></div>` : ''}</div>
    <div class="tree-composer"><div class="section-label">${icon('leaf')} A PLACE TO LET IT OUT</div><form id="worry-form"><label for="worry">What is on your mind?</label><div class="worry-input"><textarea id="worry" name="worry" rows="3" maxlength="1000" placeholder="You don’t have to find the perfect words…" required>${esc(draft)}</textarea></div><div class="input-note"><span>One worry, one leaf.</span><span id="word-count">${draft.length} / 1000</span></div><button class="add-leaf" type="submit">Make a leaf ${icon('check')}</button></form><button class="primary full" data-do="breathe">Take a breathing break ${icon('arrow')}</button><div class="tree-summary"><button class="summary-item" data-do="leaves">${icon('leaf')} ${countText(garden.leaves.length, 'worry', 'worries')}</button><button class="summary-item" data-do="flowers">${icon('flower')} ${countText(garden.flowers.length, 'flower')}</button></div></div>
    </section>`;
}
function openCollection(tab = 'leaves') {
  gardenTab = tab;
  closeDialog();
  if (view !== 'garden') { navigate('garden'); return; }
  render();
  document.querySelector('.collection-switch [aria-pressed="true"]')?.focus({ preventScroll: true });
}
function collectionPage() {
  const flowers = gardenTab === 'flowers';
  return `<section class="collection-page page-enter"><a class="text-button collection-back" href="#tree">${icon('back')} Back to your tree</a><div class="collection-heading"><span class="eyebrow">HELD GENTLY, GROWING QUIETLY</span><h1>Your leaves &amp; flowers.</h1><p class="subtitle">A place for what you carry, and what comes next.</p></div><div class="collection-switch" role="group" aria-label="Choose leaves or flowers"><button data-do="leaves" aria-pressed="${!flowers}">${icon('leaf')} Worry leaves <span>${garden.leaves.length}</span></button><button data-do="flowers" aria-pressed="${flowers}">${icon('flower')} Intention flowers <span>${garden.flowers.length}</span></button></div>
    <div class="collection-intro"><h2>${flowers ? 'Little intentions, in bloom.' : 'One leaf at a time.'}</h2><p>${flowers ? 'Choose any flowers to gather into one diamond. The others can keep blooming.' : 'Choose a leaf to reflect, take a small step, or let it go.'}</p></div>
    ${flowers ? flowersCollection() : garden.leaves.length ? `<div class="collection-grid">${garden.leaves.map(l => `<button class="collection-card worry-card" data-leaf="${l.id}" aria-label="Reflect on worry: ${esc(l.text)}"><span class="collection-art">${leafSVG()}</span><span class="collection-text">${esc(l.text)}</span><small>Held since ${date(l.createdAt)}</small><span class="collection-card-link">Find a little clarity ${icon('arrow')}</span></button>`).join('')}</div>` : `<div class="collection-empty"><span class="collection-art">${leafSVG()}</span><h2>A little room to breathe.</h2><p>No worry leaves here right now. Your tree is ready whenever you need it.</p><a class="primary" href="#tree">Return to your tree ${icon('arrow')}</a></div>`}
  </section>`;
}
function flowersCollection() {
  if (!garden.flowers.length) return `<div class="collection-empty"><span class="collection-art">${flowerSVG()}</span><h2>Every small step can bloom.</h2><p>A flower grows when you choose an action for a worry leaf.</p><button class="primary" data-do="leaves">Visit your leaves ${icon('arrow')}</button><a class="text-button" href="#treasure">Visit your diamonds ${icon('box')}</a></div>`;
  return `<div class="collection-selection"><span id="selection-count" role="status">${countText(selectedFlowers.size, 'flower')} selected</span><div><button class="text-button" data-do="select-all-flowers">Select all</button><button class="text-button" data-do="clear-flowers">Clear selection</button></div></div><div class="collection-grid">${garden.flowers.map(f => `<label class="collection-card flower-card"><input type="checkbox" name="harvest-flower" value="${f.id}" ${selectedFlowers.has(f.id) ? 'checked' : ''} aria-label="Select intention: ${esc(f.action)}" /><span class="collection-art">${flowerSVG()}</span><span class="collection-text">${esc(f.action)}</span><small>Chosen ${date(f.createdAt)}</small><span class="collection-card-link">Select to harvest ${icon('check')}</span></label>`).join('')}</div><div class="collection-harvest"><div><strong>A little light to keep.</strong><p>Gather your selected intentions into one diamond.</p></div><button class="primary" id="harvest-selected" data-do="harvest" ${selectedFlowers.size ? '' : 'disabled'}>Harvest selected flowers ${icon('arrow')}</button></div>`;
}
function updateFlowerSelection() {
  document.querySelectorAll('input[name="harvest-flower"]').forEach(input => { input.checked = selectedFlowers.has(input.value); });
  const count = document.querySelector('#selection-count');
  if (count) count.textContent = `${countText(selectedFlowers.size, 'flower')} selected`;
  const harvest = document.querySelector('#harvest-selected');
  if (harvest) harvest.disabled = selectedFlowers.size === 0;
}
function breathingPage() {
  return `<section class="breathing-page page-enter"><div class="breathing-heading"><span class="eyebrow">A SOFTER RHYTHM</span><h1>Come back to your breath.</h1></div><div class="breath-orbit" id="breath-orbit"><div class="watercolor-rings"><i></i><i></i><i></i>${lotus}</div><div class="breath-copy"><p id="phase-label" aria-live="polite">Breathe in</p><span id="breath-number" aria-hidden="true">4</span><span id="breath-status">Slowly, through your nose</span></div></div><div class="breath-sequence"><span data-phase="inhale">Inhale <b>4</b></span><i>·</i><span data-phase="hold">Hold <b>7</b></span><i>·</i><span data-phase="exhale">Exhale <b>8</b></span></div><button class="pause-button" data-do="pause" aria-label="Pause breathing">${icon('pause')}</button><div class="breathing-actions"><button class="primary" data-do="tree">Return to the tree ${icon('arrow')}</button><button class="text-button" data-do="finish">Finish for now</button></div></section>`;
}
function startBreathing() {
  breathElapsed = 0; breathStart = performance.now(); breathPaused = document.hidden; lastPhase = '';
  tickBreath(); breathInterval = setInterval(tickBreath, 100);
  if (breathPaused) updatePauseButton();
}
function tickBreath() {
  const seconds = (breathElapsed + (breathPaused ? 0 : performance.now() - breathStart)) / 1000;
  const phase = breathingPhase(seconds);
  const label = document.querySelector('#phase-label'); if (!label) return;
  if (phase.key !== lastPhase) { label.textContent = phase.label; lastPhase = phase.key; }
  document.querySelector('#breath-number').textContent = phase.remaining;
  document.querySelector('#breath-status').textContent = breathPaused ? 'Paused. Take your time.' : ({ inhale: 'Slowly, through your nose', hold: 'A quiet moment', exhale: 'Softly, let it go' }[phase.key]);
  const scale = phase.key === 'inhale' ? .78 + phase.progress * .22 : phase.key === 'hold' ? 1 : 1 - phase.progress * .22;
  document.querySelector('#breath-orbit').style.setProperty('--breath-scale', reduceMotion.matches ? '1' : scale);
  document.querySelectorAll('[data-phase]').forEach(el => el.classList.toggle('active', el.dataset.phase === phase.key));
}
function updatePauseButton() {
  const button = document.querySelector('[data-do="pause"]'); if (!button) return;
  button.setAttribute('aria-label', breathPaused ? 'Resume breathing' : 'Pause breathing'); button.innerHTML = icon(breathPaused ? 'play' : 'pause'); tickBreath();
}
function togglePause() {
  if (breathPaused) { breathStart = performance.now(); breathPaused = false; }
  else { breathElapsed += performance.now() - breathStart; breathPaused = true; }
  updatePauseButton();
}
document.addEventListener('visibilitychange', () => { if (document.hidden && view === 'breathe' && !breathPaused) togglePause(); });

function treasurePage() {
  return `<section class="treasure-page page-enter"><span class="eyebrow">SMALL STEPS, HELD CLOSE</span><h1>Your small beginnings.</h1><p class="subtitle">Every intention is a seed of change.</p>${garden.harvests.length ? `<div class="treasure-hero-frame"><img class="treasure-hero" src="/assets/spring-treasure.webp" alt="" width="1536" height="1024" /></div><div class="treasure-count">${countText(garden.harvests.length, 'diamond')} <span>·</span> ${countText(garden.harvests.reduce((n, h) => n + h.actions.length, 0), 'intention')}</div><div class="diamond-grid">${garden.harvests.map((h, i) => `<button class="harvest-card" data-harvest="${h.id}"><div class="harvest-card-heading"><span class="memory-diamond">${diamondSVG()}</span><span><h2>${countText(h.actions.length, 'intention')}</h2><p>Saved ${date(h.createdAt)}</p></span></div><span class="intention-preview">${h.actions.slice(0, 3).map(a => `<span>${esc(a.action)}</span>`).join('')}</span><span class="card-link">View all intentions ${icon('arrow')}</span></button>`).join('')}</div>` : `<div class="treasure-empty"><h2>Good things take their time.</h2><p>Choose one or more intention flowers to gather into a diamond.<br>Your little intentions will be waiting here, whenever you need them.</p><button class="primary" data-do="flowers">Visit your flowers ${icon('arrow')}</button></div>`}<p class="treasure-footnote">An intention is already a beginning. Nothing to tick off. Nothing to prove.</p></section>`;
}
function finishPage() {
  return `<section class="finish-page page-enter">${lotus}<span class="eyebrow">ENOUGH FOR THIS MOMENT</span><h1>Leave a little lighter.</h1><p class="subtitle">You made a little room for yourself.<br>Your tree will be here when you need it.</p><button class="primary" data-do="tree">Return to your tree ${icon('arrow')}</button><button class="text-button" data-do="treasure">Visit your diamonds</button></section>`;
}

function showDialog(content, large = false) {
  if (!dialog.open) focusBeforeDialog = document.activeElement;
  dialog.classList.toggle('wide-dialog', large);
  dialog.innerHTML = `<button class="dialog-close icon-button" data-do="close" aria-label="Close dialog">${icon('close')}</button>${content}`;
  if (!dialog.open) dialog.showModal();
  requestAnimationFrame(() => (dialog.querySelector('[autofocus]') || dialog.querySelector('.dialog-close'))?.focus());
}
function closeDialog() { if (dialog.open) dialog.close(); }
dialog.addEventListener('close', () => { if (focusBeforeDialog?.isConnected) focusBeforeDialog.focus({ preventScroll: true }); });
dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(); } });
function showLeaves() { openCollection('leaves'); }
function reflect(leafId) {
  const leaf = garden.leaves.find(l => l.id === leafId); if (!leaf) { closeDialog(); return; }
  showDialog(`<div class="dialog-symbol">${icon('leaf')}</div><span class="eyebrow">A MOMENT OF CLARITY</span><blockquote>${esc(leaf.text)}</blockquote><h2 id="dialog-title">Can you do anything<br>about this worry?</h2><p class="dialog-description">It only needs to be one small thing.</p><div class="choice-stack"><button class="choice" data-action-for="${leaf.id}">${icon('flower')}<span><strong>Yes, a small step</strong><small>Let an intention take root.</small></span>${icon('arrow')}</button><button class="choice" data-release-for="${leaf.id}">${icon('wind')}<span><strong>Not right now</strong><small>Give yourself permission to let go.</small></span>${icon('arrow')}</button></div><button class="text-button later" data-do="close">I'll come back to this</button>`);
}
function actionForm(leafId) {
  const leaf = garden.leaves.find(l => l.id === leafId); if (!leaf) return;
  showDialog(`<div class="dialog-symbol">${icon('flower')}</div><span class="eyebrow">LET SOMETHING GROW</span><h2 id="dialog-title">One small step is enough.</h2><blockquote>${esc(leaf.text)}</blockquote><form id="action-form" data-id="${leafId}"><label for="action-text">What is one simple action you can take?</label><textarea id="action-text" name="action" rows="4" maxlength="1000" placeholder="I will…" required autofocus></textarea><p class="field-hint">Something gentle. Something within reach.</p><button class="primary full" type="submit">Let it bloom ${icon('flower')}</button></form><button class="text-button later" data-leaf="${leafId}">Go back</button>`);
}
function releasePrompt(leafId) {
  const leaf = garden.leaves.find(l => l.id === leafId); if (!leaf) return;
  showDialog(`<div class="dialog-symbol">${icon('wind')}</div><span class="eyebrow">YOU CAN SET THIS DOWN</span><h2 id="dialog-title">Let the earth hold it.</h2><blockquote>${esc(leaf.text)}</blockquote><p class="dialog-description">You don't have to carry what you cannot change right now.</p><button class="primary full" data-release="${leafId}">Let it go ${icon('leaf')}</button><p class="field-hint">This worry will leave your tree and your saved records.</p><button class="text-button later" data-leaf="${leafId}">Keep it for now</button>`);
}
function showFlowers() { openCollection('flowers'); }
function harvestPrompt() {
  const flowers = garden.flowers.filter(f => selectedFlowers.has(f.id));
  if (!flowers.length) { toast('Choose at least one flower to harvest.'); return; }
  showDialog(`<div class="dialog-symbol">${icon('flower')}</div><span class="eyebrow">GATHER A LITTLE GOODNESS</span><h2 id="dialog-title">A diamond from your intentions.</h2><p class="dialog-description">Your ${countText(flowers.length, 'selected flower')} will become one diamond. Unselected flowers will keep blooming.</p><div class="harvest-preview">${flowerSVG()}<span>→</span>${diamondSVG()}</div><ul class="harvest-selection-preview">${flowers.map(f => `<li>${esc(f.action)}</li>`).join('')}</ul><button class="primary full" data-do="confirm-harvest">Create my diamond ${icon('check')}</button><button class="text-button later" data-do="close">Keep choosing</button>`);
}
function showHarvest(harvestId) {
  const harvest = garden.harvests.find(h => h.id === harvestId); if (!harvest) return;
  showDialog(`<div class="small-diamond">${diamondSVG()}</div><span class="eyebrow">${date(harvest.createdAt)}</span><h2 id="dialog-title">Small steps. Lasting light.</h2><p class="dialog-description">${countText(harvest.actions.length, 'intention')} from this harvest.</p><ol class="action-history">${harvest.actions.map(a => `<li><span>${esc(a.action)}</span><small>${date(a.createdAt)}</small></li>`).join('')}</ol><button class="primary full" data-do="close">Keep it close</button><button class="text-button danger later" data-delete-harvest="${harvest.id}">Delete this diamond</button>`);
}
function deleteHarvestPrompt(harvestId) {
  const harvest = garden.harvests.find(h => h.id === harvestId); if (!harvest) { closeDialog(); return; }
  showDialog(`<div class="small-diamond">${diamondSVG()}</div><span class="eyebrow">REMOVE FROM TREASURE</span><h2 id="dialog-title">Delete this diamond?</h2><p class="dialog-description">This permanently removes the diamond and its ${countText(harvest.actions.length, 'saved intention')} from this device.</p><button class="primary full danger-fill" data-confirm-delete-harvest="${harvest.id}">Yes, delete this diamond</button><button class="text-button later" data-harvest="${harvest.id}">Keep this diamond</button>`);
}
function privacy() {
  showDialog(`<div class="dialog-symbol">${icon('lock')}</div><span class="eyebrow">A SPACE OF YOUR OWN</span><h2 id="dialog-title">Your privacy.</h2><div class="privacy-copy"><p>Your worries and actions stay in this browser on this device. No account, no tracking, and nothing sent to a server.</p><p>This is local storage, not encrypted storage. Anyone with access to this browser may be able to open your garden. Clearing browser data removes it; it does not sync between devices.</p><p>Letting a worry go removes its text. When a worry becomes a flower, only your chosen action is kept.</p>${loadError ? `<p class="inline-error">${esc(loadError)} Export a copy before resetting your garden.</p>` : ''}</div><button class="secondary full" data-do="export">Export my garden</button><button class="text-button danger later" data-do="reset-prompt">Clear this garden</button>`);
}
function exportGarden() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || JSON.stringify(garden, null, 2);
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `tell-the-tree-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 2000);
    toast('Your garden has been exported. Keep the file somewhere private.');
  } catch { toast('Your browser could not export your garden.'); }
}
function animateNewLeaf() {
  if (reduceMotion.matches) return;
  const button = document.querySelector('.add-leaf');
  const tree = document.querySelector('.tree-heart');
  if (!button || !tree) return;
  const start = button.getBoundingClientRect();
  const end = tree.getBoundingClientRect();
  const x = start.left + start.width / 2 + scrollX;
  const y = start.top + start.height / 2 + scrollY;
  const dx = end.left + end.width / 2 + scrollX - x;
  const dy = end.top + end.height / 2 + scrollY - y;
  const leaf = document.createElement('div');
  leaf.className = 'leaf-flight'; leaf.innerHTML = leafSVG();
  leaf.style.left = `${x}px`; leaf.style.top = `${y}px`;
  document.querySelector('#effects').append(leaf);
  const pose = (x, y, scale, rotation) => `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
  const animation = leaf.animate([
    { transform: pose(0, 0, .1, -25), opacity: 0, offset: 0 },
    { transform: pose(0, -28, 1.2, 5), opacity: 1, offset: .22 },
    { transform: pose(dx * .5, dy * .5 - 65, 1, -20), opacity: 1, offset: .58 },
    { transform: pose(dx, dy, .6, 15), opacity: 1, offset: .88 },
    { transform: pose(dx, dy, .15, 15), opacity: 0, offset: 1 },
  ], { duration: 1700, easing: 'ease-in-out', fill: 'forwards' });
  if (end.top < 80 || end.bottom > innerHeight - 100) tree.scrollIntoView({ behavior: 'smooth', block: 'center' });
  animation.finished.then(() => leaf.remove(), () => leaf.remove());
}
function effect(type, sourceRect) {
  if (reduceMotion.matches) return;
  const el = document.createElement('div'); el.className = `transformation ${type}`;
  el.innerHTML = type === 'release-effect' ? leafSVG() : type === 'harvest-effect' ? diamondSVG() : flowerSVG();
  el.style.left = `${sourceRect ? sourceRect.left + sourceRect.width / 2 : innerWidth / 2}px`;
  el.style.top = `${sourceRect ? sourceRect.top + sourceRect.height / 2 : innerHeight * .43}px`;
  document.querySelector('#effects').append(el); setTimeout(() => el.remove(), 2100);
}

document.addEventListener('input', event => {
  if (event.target.id === 'worry') { draft = event.target.value; document.querySelector('#word-count').textContent = `${draft.length} / 1000`; }
});
document.addEventListener('change', event => {
  if (event.target.name !== 'harvest-flower') return;
  if (event.target.checked) selectedFlowers.add(event.target.value);
  else selectedFlowers.delete(event.target.value);
  updateFlowerSelection();
});
document.addEventListener('submit', event => {
  if (event.target.id === 'worry-form') {
    event.preventDefault();
    if (!transact(() => addWorry(garden, draft))) return;
    draft = '';
    document.querySelector('#worry').value = '';
    document.querySelector('#word-count').textContent = '0 / 1000';
    document.querySelector('.tree-summary [data-do="leaves"]').innerHTML = icon('leaf') + ' ' + countText(garden.leaves.length, 'worry', 'worries');
    document.querySelector('.add-leaf').focus({ preventScroll: true });
    animateNewLeaf();
    toast('Your worry has a place to rest.');
  }
  if (event.target.id === 'action-form') {
    event.preventDefault(); const leafId = event.target.dataset.id;
    const text = new FormData(event.target).get('action');
    if (!transact(() => chooseAction(garden, leafId, text))) return;
    openCollection('leaves'); toast('A little intention, a new bloom.');
  }
});
document.addEventListener('click', event => {
  const el = event.target.closest('button'); if (!el) return;
  if (el.dataset.leaf) return reflect(el.dataset.leaf);
  if (el.dataset.harvest) return showHarvest(el.dataset.harvest);
  if (el.dataset.deleteHarvest) return deleteHarvestPrompt(el.dataset.deleteHarvest);
  if (el.dataset.confirmDeleteHarvest) {
    if (!transact(() => deleteHarvest(garden, el.dataset.confirmDeleteHarvest))) return;
    closeDialog(); render(); toast('The diamond has been removed from your treasure box.'); return;
  }
  if (el.dataset.actionFor) return actionForm(el.dataset.actionFor);
  if (el.dataset.releaseFor) return releasePrompt(el.dataset.releaseFor);
  if (el.dataset.release) {
    const rect = document.querySelector(`.worry-card[data-leaf="${el.dataset.release}"]`)?.getBoundingClientRect();
    if (!transact(() => releaseWorry(garden, el.dataset.release))) return;
    openCollection('leaves'); effect('release-effect', rect); toast('Gently let go. There is room to breathe.'); return;
  }
  const actions = {
    tree: () => navigate('tree'), breathe: () => navigate('breathe'), treasure: () => navigate('treasure'), finish: () => navigate('finish'), pause: togglePause,
    close: closeDialog, garden: () => openCollection(), leaves: showLeaves, flowers: showFlowers, harvest: harvestPrompt, privacy, export: exportGarden,
    'select-all-flowers': () => { garden.flowers.forEach(f => selectedFlowers.add(f.id)); updateFlowerSelection(); },
    'clear-flowers': () => { selectedFlowers.clear(); updateFlowerSelection(); },
    'confirm-harvest': () => {
      if (!transact(() => harvestFlowers(garden, [...selectedFlowers]))) return;
      selectedFlowers.clear(); openCollection('flowers'); effect('harvest-effect'); toast('A diamond for your treasure. Your selected intentions are kept.');
    },
    'reset-prompt': () => showDialog(`<div class="dialog-symbol">${icon('leaf')}</div><h2 id="dialog-title">Begin with a clear garden?</h2><p class="dialog-description">This permanently removes all worries, flowers, and diamonds saved in this browser. You can export a copy first.</p><button class="secondary full" data-do="export">Export a copy</button><button class="primary full danger-fill" data-do="confirm-reset">Yes, clear my garden</button><button class="text-button later" data-do="close">Keep my garden</button>`),
    'confirm-reset': () => {
      try { localStorage.removeItem(STORAGE_KEY); garden = blankGarden(); loadError = ''; draft = ''; closeDialog(); render(); toast('Your garden is clear, ready for a new beginning.'); }
      catch { toast('Your browser could not clear the saved garden.'); }
    },
  };
  actions[el.dataset.do]?.();
});
addEventListener('storage', event => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  try { garden = event.newValue ? decodeGarden(event.newValue) : blankGarden(); loadError = ''; closeDialog(); if (view !== 'breathe') render(); toast('Your garden was updated in another tab.'); }
  catch (error) { loadError = error.message; toast(loadError); }
});
render();
