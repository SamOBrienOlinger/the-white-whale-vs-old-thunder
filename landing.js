const landing = document.getElementById('landing');
const enterButtons = [...document.querySelectorAll('[data-enter-hunt]')];
const game = document.getElementById('game');
const sideChoices = [...document.querySelectorAll('.side-choice')];
const landingStatuses = [...document.querySelectorAll('.mobile-landing-status')];
const howButton = document.getElementById('how-to-play');
const aboutButton = document.getElementById('about-tale');
const howDialog = document.getElementById('how-dialog');
const aboutDialog = document.getElementById('about-dialog');
const landingStage = document.querySelector('.landing-stage');
const landingArtwork = landingStage?.querySelector('img');
const landingFooter = document.querySelector('.landing-footer');
const landingArtworkRatio = 450 / 741;

function syncLandingArtwork() {
  if (!landingStage || !landingArtwork) return;

  landingArtwork.src = 'assets/images/landing-moby-pequod.avif?v=20260913-1';
  landingArtwork.width = 450;
  landingArtwork.height = 741;
  landingStage.style.aspectRatio = '450 / 741';

  const compact = window.matchMedia('(max-width: 520px)').matches;
  const gutter = compact ? 12 : 20;
  const reservedHeight = compact ? 58 : 82;
  const availableWidth = Math.max(0, window.innerWidth - gutter);
  const availableHeight = Math.max(0, window.innerHeight - reservedHeight);
  const stageWidth = Math.min(availableWidth, availableHeight * landingArtworkRatio, 820);

  landingStage.style.width = `${stageWidth}px`;
  if (landingFooter) landingFooter.style.width = `${stageWidth}px`;
}

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
  announce(role === 'moby' ? 'Moby Dick selected — begin the hunt.' : 'Captain Ahab selected — begin the hunt.', true);
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
  syncLandingArtwork();
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
window.addEventListener('resize', syncLandingArtwork, { passive: true });

syncLandingArtwork();
setBeginState();
