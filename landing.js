const landing = document.getElementById('landing');
const enterButton = document.getElementById('enter-hunt');
const game = document.getElementById('game');
const sideChoices = [...document.querySelectorAll('.side-choice')];
const landingStatus = document.getElementById('landing-status');
const howButton = document.getElementById('how-to-play');
const aboutButton = document.getElementById('about-tale');
const howDialog = document.getElementById('how-dialog');
const aboutDialog = document.getElementById('about-dialog');

const canonicalPath = '/the-white-whale-vs-old-thunder/';
if (window.location.hostname.endsWith('github.io') && window.location.pathname.endsWith('/index.html')) {
  window.history.replaceState(null, '', `${canonicalPath}${window.location.search}${window.location.hash}`);
}

let selectedRole = null;

function announce(message, temporary = false) {
  if (!landingStatus) return;
  landingStatus.textContent = message;
  landingStatus.classList.add('show');
  if (temporary) {
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(() => landingStatus.classList.remove('show'), 2200);
  }
}

function selectRole(role) {
  selectedRole = role;
  sideChoices.forEach((button) => {
    const active = button.dataset.role === role;
    button.setAttribute('aria-pressed', String(active));
    button.classList.remove('attention');
  });
  announce(role === 'moby' ? 'Moby Dick selected — tap Prepare for the Hunt.' : 'Captain Ahab selected — tap Prepare for the Hunt.');
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
  game.removeAttribute('hidden');
  document.body.classList.remove('landing-active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  requestGameStart(selectedRole);
  window.setTimeout(() => landing.setAttribute('aria-hidden', 'true'), 300);
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
enterButton?.addEventListener('click', enterGame);
howButton?.addEventListener('click', () => openDialog(howDialog));
aboutButton?.addEventListener('click', () => openDialog(aboutDialog));

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => closeDialog(button.closest('dialog')));
});

[howDialog, aboutDialog].forEach((dialog) => {
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog(dialog);
  });
});

window.addEventListener('pageshow', () => {
  if (!selectedRole) announce('Choose your side, then tap Prepare for the Hunt.');
});
