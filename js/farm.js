import { getPlayer, savePlayer } from './player.js';
import { updateHUD, showNotification } from './ui.js';

const GROW_TIME_MS = 10000; // Tempo de crescimento (10 segundos)

export function renderFarmGrid() {
  const grid = document.getElementById("farm-grid");
  const p = getPlayer();
  grid.innerHTML = "";

  p.crops.forEach((crop, i) => {
    const tile = document.createElement("div");
    tile.className = "farm-tile";

    const currentCrop = p.crops[i];
    if (currentCrop === "grown") {
      tile.classList.add("ready"); // Adiciona destaque visual na colheita
    }

    const now = Date.now();
    const plantedTime = p.plantedAt[i];

    let isGrowing = false;
    let progress = 0;
    let secondsLeft = 0;

    // Verifica se a planta está crescendo
    if (crop === "seed" && plantedTime) {
      const elapsed = now - plantedTime;
      if (elapsed >= GROW_TIME_MS) {
        p.crops[i] = "grown";
      } else {
        isGrowing = true;
        progress = (elapsed / GROW_TIME_MS) * 100;
        secondsLeft = Math.ceil((GROW_TIME_MS - elapsed) / 1000);
      }
    }

    // Ícone visual
    tile.innerText = currentCrop === "grown" ? "🌾" :
                     currentCrop === "seed" ? "🌱" :
                     "🟫";

    // Renderiza barra de progresso se estiver crescendo
    if (isGrowing) {
      const bar = document.createElement("div");
      bar.className = "progress-bar";

      const fill = document.createElement("div");
      fill.className = "progress-bar-fill";
      fill.style.width = `${progress}%`;

      bar.appendChild(fill);
      tile.appendChild(bar);

      const timer = document.createElement("div");
      timer.className = "tile-timer";
      timer.innerText = `${secondsLeft}s`;
      tile.appendChild(timer);
    }

    tile.onclick = () => handleTileClick(i);
    grid.appendChild(tile);
  });

  savePlayer();
}

function handleTileClick(index) {
  const p = getPlayer();
  const now = Date.now();

  // PLANTAR
  if (p.crops[index] === null) {
    if (p.inventory.seed <= 0) {
      showNotification("🌰 Sem sementes!");
      return;
    }
    if (p.energy < 5) {
      showNotification("⚡ Energia insuficiente!");
      return;
    }

    p.crops[index] = "seed";
    p.plantedAt[index] = now;
    p.inventory.seed -= 1;
    p.energy -= 5;

    showNotification("🌱 Semente plantada!");
  }

  // COLHER
  else if (p.crops[index] === "grown") {
    p.gold += 30;
    p.xp += 20;

    // Primeira conquista
    if (!p.conquistas.includes("primeira_colheita")) {
      p.conquistas.push("primeira_colheita");
      showNotification("🏆 Conquista: Primeira Colheita!");
    }

    // Subir de nível se XP suficiente
    const xpTotal = p.level * 100;
    if (p.xp >= xpTotal) {
      p.level += 1;
      p.xp = p.xp - xpTotal;
      p.energy += 10;
      showNotification(`⭐ Subiu para o nível ${p.level}!`);
    }

    p.crops[index] = null;
    p.plantedAt[index] = null;
  }

  // Clicou em planta ainda crescendo
  else {
    showNotification("⏳ Ainda crescendo...");
  }

  updateHUD();
  renderFarmGrid();
  savePlayer();
}
