const landing = document.getElementById('landing');
const enterButton = document.getElementById('enter-hunt');
const game = document.getElementById('game');

function enterGame() {
  landing.classList.add('landing--hidden');
  game.removeAttribute('hidden');
  document.body.classList.remove('landing-active');
  window.scrollTo({ top: 0, behavior: 'instant' });
}

enterButton?.addEventListener('click', enterGame);
