import { getPlayer } from './player.js';

// Atualiza a HUD com nome, ouro, energia, inventário, XP e nível
export function updateHUD() {
  const p = getPlayer();

  // XP total para o próximo nível (padrão: 100 por nível)
  const xpTotal = p.level * 100;
  const xpPercent = Math.min(100, (p.xp / xpTotal) * 100);

  document.getElementById("hud").innerHTML = `
    <span>👤 <strong>${p.name}</strong></span>
    <span>💰 <strong>${p.gold}</strong></span>
    <span>⚡ <strong>${p.energy}</strong></span>
    <span>🌰 <strong>${p.inventory.seed}</strong></span>
    <span>🧪 <strong>${p.inventory.fertilizer}</strong></span>
    <span>⭐ Nível: <strong>${p.level}</strong></span>
  `;
}

// Exibe uma notificação animada na tela
export function showNotification(msg) {
  const el = document.getElementById("notification");
  el.innerText = msg;
  el.classList.add("show");
  el.classList.remove("hidden");

  setTimeout(() => {
    el.classList.remove("show");
    el.classList.add("hidden");
  }, 2500);
}

// Abre modal de perfil com informações + barra de XP + conquistas
window.abrirPerfil = () => {
  const p = getPlayer();
  const modal = document.getElementById("perfil-modal");
  const xpTotal = p.level * 100;
  const xpPercent = Math.min(100, (p.xp / xpTotal) * 100);

  // Conquistas renderizadas dinamicamente
  const conquistas = p.conquistas?.includes("primeira_colheita")
    ? "<li>🌾 Primeira Colheita!</li>"
    : "<li>❌ Nenhuma conquista ainda</li>";

  document.getElementById("perfil-content").innerHTML = `
    <p><strong>Nome:</strong> ${p.name}</p>
    <p><strong>Nível:</strong> ${p.level}</p>
    <p><strong>XP:</strong> ${p.xp} / ${xpTotal}</p>
    <div class="xp-bar">
      <div class="xp-fill" style="width: ${xpPercent}%;"></div>
    </div>
    <p><strong>Conquistas:</strong></p>
    <ul>${conquistas}</ul>
  `;

  modal.classList.remove("hidden");
};

// Fecha modal do perfil
window.fecharPerfil = () => {
  document.getElementById("perfil-modal").classList.add("hidden");
};

// Alterna entre tema claro e escuro e salva no localStorage
window.trocarTema = () => {
  const body = document.body;
  const novoTema = body.classList.contains("dark") ? "white" : "dark";

  body.classList.remove("dark", "white");
  body.classList.add(novoTema);

  // Salva no localStorage para persistir entre páginas
  localStorage.setItem("tema", novoTema);
};
