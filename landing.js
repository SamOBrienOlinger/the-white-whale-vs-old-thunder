const landing = document.getElementById('landing');
const enterButtons = [...document.querySelectorAll('[data-enter-hunt]')];
const game = document.getElementById('game');
const sideChoices = [...document.querySelectorAll('.side-choice')];
const landingStatuses = [...document.querySelectorAll('.mobile-landing-status')];

const canonicalPath = '/the-white-whale-vs-old-thunder/';
if (window.location.hostname.endsWith('github.io') && window.location.pathname.endsWith('/index.html')) {
  window.history.replaceState(null, '', `${canonicalPath}${window.location.search}${window.location.hash}`);
}

let selectedRole = null;

function announce(message, temporary = false) {
  landingStatuses.forEach((status) => {
    status.textContent = message;
    status.classList.add('show');
  });
  if (temporary) {
    window.clearTimeout(announce.timer);
    announce.timer = window.setTimeout(() => announce('Choose your side, then begin the hunt.'), 2200);
  }
}

function selectRole(role) {
  selectedRole = role;
  sideChoices.forEach((button) => {
    const active = button.dataset.role === role;
    button.setAttribute('aria-pressed', String(active));
    button.classList.remove('attention');
  });
  announce(role === 'moby' ? 'Moby Dick selected — tap Begin the Hunt.' : 'Captain Ahab selected — tap Begin the Hunt.');
}

function requestGameStart(role) {
  window.__whiteWhalePendingRole = role;
  document.dispatchEvent(new CustomEvent('whitewhale:start', { detail: { role } }));
}

function enterGame() {
  if (!selectedRole) {
    announce('Choose Moby Dick or Captain Ahab first.', true);
    sideChoices.forEach((button) => button.classList.add('attention'));
    const firstVisibleChoice = sideChoices.find((button) => button.getClientRects().length > 0);
    firstVisibleChoice?.focus({ preventScroll: true });
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
  announce('Choose your side, then begin the hunt.');
  window.setTimeout(() => {
    const firstVisibleChoice = sideChoices.find((button) => button.getClientRects().length > 0);
    firstVisibleChoice?.focus({ preventScroll: true });
  }, 50);
}

sideChoices.forEach((button) => button.addEventListener('click', () => selectRole(button.dataset.role)));
enterButtons.forEach((button) => button.addEventListener('click', enterGame));

document.addEventListener('whitewhale:return', returnToLanding);

window.addEventListener('pageshow', () => {
  if (!selectedRole) announce('Choose your side, then begin the hunt.');
});
