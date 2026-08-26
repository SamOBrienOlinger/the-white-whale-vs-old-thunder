const blueprintStylesheet = document.createElement('link');
blueprintStylesheet.rel = 'stylesheet';
blueprintStylesheet.href = 'blueprint.css?v=20260827-1';
document.head.appendChild(blueprintStylesheet);

const landing = document.getElementById('landing');
const enterButtons = [...document.querySelectorAll('[data-enter-hunt]')];
const game = document.getElementById('game');
const sideChoices = [...document.querySelectorAll('.side-choice')];
const landingStatuses = [...document.querySelectorAll('.mobile-landing-status')];
const howButton = document.getElementById('how-to-play');
const aboutButton = document.getElementById('about-tale');
const howDialog = document.getElementById('how-dialog');
const aboutDialog = document.getElementById('about-dialog');

const canonicalPath = '/the-white-whale-vs-old-thunder/';
if (window.location.hostname.endsWith('github.io') && window.location.pathname.endsWith('/index.html')) {
  window.history.replaceState(null, '', `${canonicalPath}${window.location.search}${window.location.hash}`);
}

let selectedRole = null;

function setBeginState() {
  enterButtons.forEach((button) => {
    button.disabled = !selectedRole;
    button.setAttribute('aria-disabled', String(!selectedRole));
  });
}

function announce(message, temporary = false) {
  landingStatuses.forEach((status) => {
    status.textContent = message;
    status.classList.add('show');
  });

  window.clearTimeout(announce.timer);
  if (temporary) {
    announce.timer = window.setTimeout(() => {
      landingStatuses.forEach((status) => status.classList.remove('show'));
    }, 2200);
  }
}

function selectRole(role) {
  selectedRole = role;
  sideChoices.forEach((button) => {
    const active = button.dataset.role === role;
    button.setAttribute('aria-pressed', String(active));
    button.classList.remove('attention');
  });
  setBeginState();
  announce(role === 'moby' ? 'Moby Dick selected — prepare for the hunt.' : 'Captain Ahab selected — prepare for the hunt.', true);
}

function requestGameStart(role) {
  window.__whiteWhalePendingRole = role;
  document.dispatchEvent(new CustomEvent('whitewhale:start', { detail: { role } }));
}

function enterGame() {
  if (!selectedRole) {
    announce('Choose Moby Dick or Captain Ahab first.', true);
    sideChoices.forEach((button) => button.classList.add('attention'));
    sideChoices[0]?.focus({ preventScroll: true });
    return;
  }

  landing.classList.add('landing--hidden');
  landing.setAttribute('aria-hidden', 'true');
  landing.setAttribute('hidden', '');
  game.removeAttribute('hidden');
  document.body.classList.remove('landing-active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  requestGameStart(selectedRole);
  window.requestAnimationFrame(() => game.focus({ preventScroll: true }));
}

function returnToLanding() {
  selectedRole = null;
  sideChoices.forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.classList.remove('attention');
  });
  setBeginState();
  game.setAttribute('hidden', '');
  landing.removeAttribute('hidden');
  landing.removeAttribute('aria-hidden');
  landing.classList.remove('landing--hidden');
  document.body.classList.add('landing-active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  landingStatuses.forEach((status) => status.classList.remove('show'));
  window.setTimeout(() => sideChoices[0]?.focus({ preventScroll: true }), 50);
}

function openDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.showModal === 'function') dialog.showModal();
  else dialog.setAttribute('open', '');
}

function closeDialog(dialog) {
  if (!dialog) return;
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

sideChoices.forEach((button) => button.addEventListener('click', () => selectRole(button.dataset.role)));
enterButtons.forEach((button) => button.addEventListener('click', enterGame));
howButton?.addEventListener('click', () => openDialog(howDialog));
aboutButton?.addEventListener('click', () => openDialog(aboutDialog));
document.querySelectorAll('[data-close-landing-dialog]').forEach((button) => button.addEventListener('click', () => closeDialog(button.closest('dialog'))));
[howDialog, aboutDialog].forEach((dialog) => dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog(dialog);
}));
document.addEventListener('whitewhale:return', returnToLanding);

setBeginState();
