function getPlayer() {
  return JSON.parse(localStorage.getItem("fazenda_player"));
}

function savePlayer(player) {
  localStorage.setItem("fazenda_player", JSON.stringify(player));
}

function updateHUD() {
  // cidade não precisa atualizar HUD na tela, só salvar estado
}

function showNotification(msg) {
  const el = document.getElementById("notification");
  el.innerText = msg;
  el.classList.add("show");
  el.classList.remove("hidden");
  setTimeout(() => {
    el.classList.remove("show");
    el.classList.add("hidden");
  }, 2500);
}

function abrirLoja() {
  const p = getPlayer();
  const area = document.getElementById("cidade-area");
  area.innerHTML = `
    <h3>🛒 Mercado</h3>
    <p><strong>Ouro disponível:</strong> ${p.gold} 🪙</p>
    <div class="loja-grid">
      <div class="loja-card">
        <p>🌰 <strong>Semente</strong></p>
        <p>💵 Preço: 2</p>
        <button onclick="comprar('seed', 2)">Comprar</button>
      </div>
      <div class="loja-card">
        <p>🧪 <strong>Adubo</strong></p>
        <p>💵 Preço: 4</p>
        <button onclick="comprar('fertilizer', 4)">Comprar</button>
      </div>
    </div>
  `;
}


function comprar(item, preco) {
  const p = getPlayer();
  if (p.gold < preco) {
    showNotification("💸 Ouro insuficiente!");
    return;
  }

  p.gold -= preco;
  p.inventory[item] += 1;
  savePlayer(p);
  showNotification(`✅ ${item === "seed" ? "Semente" : "Adubo"} comprado!`);
  abrirLoja();
}

function abrirInventario() {
  const p = getPlayer();
  const area = document.getElementById("cidade-area");
  area.innerHTML = `
    <h3>🎒 Inventário</h3>
    <p>🌰 Sementes: ${p.inventory.seed} 
       <button onclick="usarItem('seed')">Usar</button></p>
    <p>🧪 Adubo: ${p.inventory.fertilizer} 
       <button onclick="usarItem('fertilizer')">Usar</button></p>
  `;
}

function usarItem(item) {
  const p = getPlayer();
  if (p.inventory[item] <= 0) {
    showNotification("❌ Item indisponível!");
    return;
  }

  if (item === "fertilizer") {
    p.energy += 10;
    showNotification("🧪 Adubo usado! +10 energia.");
  } else if (item === "seed") {
    showNotification("🌱 Vá até a fazenda para plantar sementes.");
    return;
  }

  p.inventory[item] -= 1;
  savePlayer(p);
  abrirInventario();
}

function falarNpc() {
  const p = getPlayer();
  const area = document.getElementById("cidade-area");
  if (!p.missionCompleted) {
    area.innerHTML = `
      <h3>🧑‍🌾 Senhor Joaquim</h3>
      <p>Olá, ${p.name}! Sua missão: Colha 1 planta e volte aqui!</p>
      <button onclick="verificarMissao()">Entregar missão</button>
    `;
  } else {
    area.innerHTML = `
      <h3>🧑‍🌾 Senhor Joaquim</h3>
      <p>Você já completou minha missão. Obrigado, fazendeiro!</p>
    `;
  }
}

function verificarMissao() {
  const p = getPlayer();
  const colhidas = p.crops.filter(crop => crop === null).length;

  if (colhidas >= 1 && !p.missionCompleted) {
    p.gold += 20;
    p.missionCompleted = true;
    savePlayer(p);
    showNotification("🏆 Missão completa! +20 ouro");
    falarNpc();
  } else {
    showNotification("⚠️ Você ainda não colheu nada!");
  }
}
