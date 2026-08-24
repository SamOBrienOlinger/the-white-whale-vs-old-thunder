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

const interactionStyle = document.createElement('style');
interactionStyle.textContent = `
  .landing-art {
    display: grid !important;
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(12, 1fr);
  }
  .landing-art > img {
    grid-area: 1 / 1 / -1 / -1;
    z-index: 1;
  }
  .landing-action {
    position: relative !important;
    inset: auto !important;
    width: auto !important;
    height: auto !important;
    z-index: 2;
    background: rgba(255,255,255,.055) !important;
    box-shadow: inset 0 0 0 1px rgba(75,52,40,.28);
  }
  .choose-moby { grid-area: 4 / 2 / 6 / 5; }
  .choose-ahab { grid-area: 4 / 9 / 6 / 12; }
  .enter-hunt { grid-area: 10 / 5 / 11 / 9; background: rgba(123,40,31,.06) !important; }
  .how-to-play { grid-area: 12 / 3 / 13 / 6; }
  .about-tale { grid-area: 12 / 8 / 13 / 11; }
  .landing-status {
    position: relative !important;
    inset: auto !important;
    transform: none !important;
    grid-area: 9 / 3 / 10 / 11;
    align-self: center;
    justify-self: stretch;
    width: auto !important;
    z-index: 3;
  }
  .side-choice, .enter-hunt { animation: landingHint 1.5s ease-in-out 2; }
  .side-choice[aria-pressed="true"] {
    animation: none;
    background: rgba(92,133,143,.18) !important;
    box-shadow: inset 0 0 0 3px rgba(40,76,86,.82), 0 0 0 2px rgba(232,223,199,.8) !important;
  }
  @keyframes landingHint {
    50% { box-shadow: inset 0 0 0 3px rgba(123,40,31,.55), 0 0 0 1px rgba(255,255,255,.5); background: rgba(255,255,255,.11); }
  }
  @media (hover: none) {
    .landing-action { box-shadow: inset 0 0 0 2px rgba(75,52,40,.30); }
  }
  @media (prefers-reduced-motion: reduce) {
    .side-choice, .enter-hunt { animation: none; }
  }
`;
document.head.appendChild(interactionStyle);

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
  enterButton?.classList.add('attention');
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
  if (!selectedRole) announce('Choose Moby Dick or Captain Ahab, then tap Prepare for the Hunt.');
});
