let player = null;

// Verifica se há dados salvos no localStorage
export function hasPlayer() {
  return !!localStorage.getItem("fazenda_player");
}

// Inicializa o jogador carregando dados salvos ou corrigindo dados antigos
export function initPlayer() {
  const saved = localStorage.getItem("fazenda_player");

  if (saved) {
    player = JSON.parse(saved);

    // Correções de compatibilidade com versões anteriores
    if (!player.inventory) player.inventory = { seed: 5, fertilizer: 0 };
    if (!player.crops || player.crops.length !== 9) player.crops = Array(9).fill(null);
    if (!player.plantedAt || player.plantedAt.length !== 9) player.plantedAt = Array(9).fill(null);
    if (player.energy === undefined) player.energy = 50;
    if (!player.level) player.level = 1;
    if (!player.xp) player.xp = 0;
    if (!player.conquistas) player.conquistas = [];
  }
}

// Retorna o objeto do jogador atual
export function getPlayer() {
  return player;
}

// Salva os dados do jogador no localStorage
export function savePlayer() {
  localStorage.setItem("fazenda_player", JSON.stringify(player));
}

// Cria um novo jogador com estado inicial
export function resetPlayer(name) {
  player = {
    name: name,
    gold: 100,
    energy: 50,
    level: 1,
    xp: 0,
    conquistas: [],
    crops: Array(9).fill(null),
    plantedAt: Array(9).fill(null),
    inventory: {
      seed: 5,
      fertilizer: 0
    },
    missionCompleted: false
  };
  savePlayer();
}
