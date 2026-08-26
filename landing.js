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

function setEnterEnabled(enabled) {
  enterButtons.forEach((button) => {
    button.disabled = !enabled;
    button.setAttribute('aria-disabled', String(!enabled));
  });
}

function announce(message, temporary = true) {
  landingStatuses.forEach((status) => {
    status.textContent = message;
    status.classList.add('show');
  });
  window.clearTimeout(announce.timer);
  if (temporary) {
    announce.timer = window.setTimeout(() => {
      landingStatuses.forEach((status) => status.classList.remove('show'));
    }, 1800);
  }
}

function selectRole(role) {
  if (!['moby', 'ahab'].includes(role)) return;
  selectedRole = role;
  sideChoices.forEach((button) => {
    const active = button.dataset.role === role;
    button.setAttribute('aria-pressed', String(active));
    button.classList.remove('attention');
  });
  setEnterEnabled(true);
  announce(role === 'moby' ? 'Moby Dick selected. Prepare for the hunt.' : 'Captain Ahab selected. Prepare for the hunt.');
}

function requestGameStart(role) {
  window.__whiteWhalePendingRole = role;
  document.dispatchEvent(new CustomEvent('whitewhale:start', { detail: { role } }));
}

function enterGame() {
  if (!selectedRole) {
    announce('Choose Moby Dick or Captain Ahab first.');
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
}

function returnToLanding() {
  selectedRole = null;
  setEnterEnabled(false);
  sideChoices.forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.classList.remove('attention');
  });
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

setEnterEnabled(false);
