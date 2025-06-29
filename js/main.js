import { initPlayer, savePlayer, resetPlayer, hasPlayer } from './player.js';
import { renderFarmGrid } from './farm.js';
import { updateHUD } from './ui.js';

function startGameFlow() {
  updateHUD();
  renderFarmGrid();

  // Atualiza HUD e Plantação automaticamente
  setInterval(() => {
    updateHUD();
    renderFarmGrid();
  }, 1000);

  // Regeneração de energia: +1 a cada 60 segundos
  setInterval(() => {
    const p = getPlayer();
    const now = Date.now();
    const last = parseInt(localStorage.getItem("last_energia") || "0");

    if (p.energy < 100 && now - last >= 60000) {
      p.energy += 1;
      savePlayer();
      localStorage.setItem("last_energia", now.toString());
    }
  }, 1000); // verifica a cada segundo
}

// Início do jogo
document.addEventListener("DOMContentLoaded", () => {
  if (!hasPlayer()) {
    document.getElementById("start-screen").classList.remove("hidden");
    document.getElementById("game-container").classList.add("hidden");
  } else {
    initPlayer();
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
    startGameFlow();
  }
});

// Começar novo jogador
window.startGame = () => {
  const input = document.getElementById("player-name");
  const name = input.value.trim();
  if (!name) return alert("Digite um nome válido!");
  resetPlayer(name);
  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");
  startGameFlow();
};

// Resetar completamente
window.resetGame = () => {
  if (confirm("Deseja realmente resetar sua fazenda?")) {
    localStorage.clear(); // limpa tudo
    location.reload();
  }
};
