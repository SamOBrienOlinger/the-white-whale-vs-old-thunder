const landing = document.getElementById('landing');
const enterButton = document.getElementById('enter-hunt');
const game = document.getElementById('game');
const sideChoices = [...document.querySelectorAll('.side-choice')];
const landingStatus = document.getElementById('landing-status');
const howButton = document.getElementById('how-to-play');
const aboutButton = document.getElementById('about-tale');
const howDialog = document.getElementById('how-dialog');
const aboutDialog = document.getElementById('about-dialog');

const interactionStyle = document.createElement('style');
interactionStyle.textContent = `
  .landing-action { background: rgba(255,255,255,.055) !important; box-shadow: inset 0 0 0 1px rgba(75,52,40,.28); }
  .side-choice, .enter-hunt { animation: landingHint 1.5s ease-in-out 2; }
  .side-choice[aria-pressed="true"] { animation: none; background: rgba(92,133,143,.18) !important; box-shadow: inset 0 0 0 3px rgba(40,76,86,.82), 0 0 0 2px rgba(232,223,199,.8) !important; }
  .enter-hunt { background: rgba(123,40,31,.06) !important; }
  @keyframes landingHint { 50% { box-shadow: inset 0 0 0 3px rgba(123,40,31,.55), 0 0 0 1px rgba(255,255,255,.5); background: rgba(255,255,255,.11); } }
  @media (hover: none) {
    .landing-action { box-shadow: inset 0 0 0 2px rgba(75,52,40,.30); }
  }
  @media (prefers-reduced-motion: reduce) { .side-choice, .enter-hunt { animation: none; } }
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

  const matchingRoleButton = document.querySelector(`.role-choice[data-role="${selectedRole}"]`);
  matchingRoleButton?.click();

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
