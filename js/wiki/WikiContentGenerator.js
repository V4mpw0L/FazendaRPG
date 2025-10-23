/**
 * FazendaRPG - Wiki Content Generator
 * Dynamically generates wiki page content from game data
 * @version 0.0.13
 */

export default class WikiContentGenerator {
  constructor(gameData) {
    this.crops = gameData?.crops || {};
    this.items = gameData?.items || {};
    this.npcs = gameData?.npcs || {};
    this.quests = gameData?.quests || {};
    this.skills = gameData?.skills || {};
  }

  /**
   * Generate Getting Started page
   * @returns {string} HTML content
   */
  generateGettingStarted() {
    return `
      <h1 class="wiki-page-title">🌱 Primeiros Passos</h1>

      <div class="wiki-card">
        <h2>Bem-vindo ao FazendaRPG! 🎉</h2>
        <p>FazendaRPG é um jogo de simulação de fazenda inspirado em RuneScape e FarmRPG. Construa sua fazenda, cultive plantas, suba de nível e torne-se o melhor fazendeiro!</p>
      </div>

      <div class="wiki-card">
        <h2>🎮 Controles Básicos</h2>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <span class="wiki-icon">☰</span>
            <div>
              <strong>Menu de Navegação</strong>
              <p>Clique no botão de 3 linhas (☰) no canto superior direito para abrir o menu</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🖱️</span>
            <div>
              <strong>Interação com Cliques</strong>
              <p>Clique nos plots da fazenda, itens do inventário, NPCs e outros elementos para interagir</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">📱</span>
            <div>
              <strong>Mobile Friendly</strong>
              <p>O jogo funciona perfeitamente em celulares! Toque na tela para interagir</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">📲</span>
            <div>
              <strong>Instale como App</strong>
              <p>No navegador, use "Adicionar à tela inicial" para instalar como PWA</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>🌾 Sua Primeira Fazenda</h2>
        <p>Você começa com uma pequena fazenda de <strong>9 plots</strong> onde pode plantar cultivos. Veja como começar:</p>

        <div class="wiki-steps">
          <div class="wiki-step">
            <span class="wiki-step-number">1</span>
            <div class="wiki-step-content">
              <h3>Abra o Inventário</h3>
              <p>Use o menu lateral (☰) e clique em <strong>Inventário</strong>. Você começa com:</p>
              <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                <li><strong>10x Sementes de Trigo</strong> 🌾</li>
                <li><strong>3x Fertilizantes</strong> 🌿</li>
                <li><strong>3 Ferramentas</strong> (Pá, Enxada, Ancinho)</li>
                <li><strong>100 Gold</strong> 💰</li>
              </ul>
            </div>
          </div>

          <div class="wiki-step">
            <span class="wiki-step-number">2</span>
            <div class="wiki-step-content">
              <h3>Plante sua Primeira Semente</h3>
              <p>Volte para a <strong>Fazenda</strong> (menu lateral) e clique em um plot vazio (quadrado marrom)</p>
              <p>Selecione <strong>Trigo</strong> e confirme. Você gastará 2 de energia ⚡</p>
            </div>
          </div>

          <div class="wiki-step">
            <span class="wiki-step-number">3</span>
            <div class="wiki-step-content">
              <h3>Aguarde o Crescimento</h3>
              <p>O trigo leva <strong>30 segundos</strong> para crescer. Você verá os estágios:</p>
              <p style="font-size: 1.5rem; margin: 0.5rem 0;">🌱 → 🌿 → 🌾</p>
              <p><strong>Dica:</strong> Use fertilizante para reduzir o tempo em 50% (15 segundos)!</p>
            </div>
          </div>

          <div class="wiki-step">
            <span class="wiki-step-number">4</span>
            <div class="wiki-step-content">
              <h3>Colha sua Plantação</h3>
              <p>Quando o trigo estiver maduro 🌾, clique no plot e escolha <strong>Colher</strong></p>
              <p>Você ganhará: <strong>1x Trigo</strong> e <strong>8 XP</strong> de Farming!</p>
            </div>
          </div>

          <div class="wiki-step">
            <span class="wiki-step-number">5</span>
            <div class="wiki-step-content">
              <h3>Venda no Mercado</h3>
              <p>Vá para <strong>Cidade</strong> → <strong>Mercado</strong> no menu</p>
              <p>Venda seu trigo por <strong>8 gold</strong> cada. Use o gold para comprar mais sementes!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>⚡ Sistema de Energia</h2>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <img src="assets/sprites/energia.png" alt="Energia" class="wiki-icon" style="width: 24px; height: 24px;">
            <div>
              <strong>Energia Máxima: 100</strong>
              <p>Cada ação consome energia. Plantar trigo = 2 energia</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🔋</span>
            <div>
              <strong>Regeneração Automática</strong>
              <p>A energia regenera +5 a cada 5 minutos automaticamente</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🧪</span>
            <div>
              <strong>Poções de Energia</strong>
              <p>Compre no mercado para restaurar 50 de energia instantaneamente</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">⬆️</span>
            <div>
              <strong>Aumente o Máximo</strong>
              <p>Subir de nível (player e skills) aumenta sua energia máxima!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>💰 Economia do Jogo</h2>
        <p>Você começa com <strong>100 gold</strong> 💰. Ganhe mais vendendo itens no mercado!</p>

        <h3 style="margin-top: 1rem;">Formas de Ganhar Gold:</h3>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li><strong>Vender Cultivos:</strong> Trigo (8g), Milho (15g), Tomate (25g), etc.</li>
          <li><strong>Completar Missões:</strong> Recompensas de 50-500+ gold</li>
          <li><strong>Vender Itens Processados:</strong> Pão vale mais que trigo cru!</li>
          <li><strong>Pescar e Vender:</strong> Peixes cozidos têm bom valor</li>
        </ul>
      </div>

      <div class="wiki-card">
        <h2>📜 Sistema de Missões</h2>
        <p>Fale com NPCs na cidade para receber missões! Há dois tipos:</p>

        <div class="wiki-quest-types">
          <div class="wiki-quest-type">
            <span class="wiki-quest-icon">⭐</span>
            <div>
              <strong>Missões Únicas</strong>
              <p>Completadas uma vez. Dão recompensas grandes e desbloqueiam conteúdo.</p>
            </div>
          </div>
          <div class="wiki-quest-type">
            <span class="wiki-quest-icon">🔄</span>
            <div>
              <strong>Missões Diárias</strong>
              <p>Podem ser repetidas a cada 24h. Ótimas para farm de recursos!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>🎯 Sistema de Skills</h2>
        <p>Existem <strong>8 skills diferentes</strong> no jogo, cada uma com nível máximo 99:</p>

        <div class="wiki-skills-grid">
          <div class="wiki-skill-mini">🌾 Farming</div>
          <div class="wiki-skill-mini">⛏️ Mining</div>
          <div class="wiki-skill-mini">🎣 Fishing</div>
          <div class="wiki-skill-mini">🍳 Cooking</div>
          <div class="wiki-skill-mini">🪓 Woodcutting</div>
          <div class="wiki-skill-mini">🔨 Crafting</div>
          <div class="wiki-skill-mini">⚒️ Smithing</div>
          <div class="wiki-skill-mini">🌿 Foraging</div>
        </div>

        <p style="margin-top: 1rem;">Cada skill é treinada fazendo ações relacionadas. Níveis mais altos desbloqueiam novas ações!</p>
      </div>

      <div class="wiki-card wiki-card-warning">
        <h2>⚠️ Dicas Importantes</h2>
        <ul style="margin-left: 1.5rem;">
          <li>Sempre mantenha suas <strong>3 ferramentas básicas</strong> no inventário (Pá, Enxada, Ancinho)</li>
          <li>Use <strong>fertilizantes</strong> em cultivos demorados para economizar tempo</li>
          <li>Limpe <strong>ervas daninhas</strong> dos plots para conseguir ervas grátis 🌿</li>
          <li>Complete <strong>missões diárias</strong> para recursos constantes</li>
          <li>Gerencie sua <strong>energia</strong> - não deixe chegar a zero!</li>
          <li><strong>Salve seu progresso</strong> regularmente nas Configurações</li>
        </ul>
      </div>

      <div class="wiki-card wiki-card-success">
        <h2>🎉 Próximos Passos</h2>
        <p>Agora que você sabe o básico, explore:</p>
        <ul style="margin-left: 1.5rem;">
          <li>📖 <strong>Guia de Cultivos</strong> - Veja todos os crops disponíveis</li>
          <li>⭐ <strong>Sistema de Skills</strong> - Entenda como funcionam as 8 skills</li>
          <li>🏘️ <strong>Cidade</strong> - Conheça os NPCs e o mercado</li>
          <li>💎 <strong>Dicas e Truques</strong> - Aprenda estratégias avançadas</li>
        </ul>
      </div>
    `;
  }

  /**
   * Generate Game Mechanics page
   * @returns {string} HTML content
   */
  generateGameMechanics() {
    return `
      <h1 class="wiki-page-title">⚙️ Como Jogar</h1>

      <div class="wiki-card">
        <h2>🎮 Mecânicas Principais</h2>
        <p>FazendaRPG combina elementos de farming, RPG e progressão de skills. Aqui está tudo que você precisa saber:</p>
      </div>

      <div class="wiki-card">
        <h2>🌾 Farming</h2>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <span class="wiki-icon">🟫</span>
            <div>
              <strong>Plots da Fazenda</strong>
              <p>Você tem 9 plots onde pode plantar cultivos. Clique em um plot vazio para plantar.</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🌱</span>
            <div>
              <strong>Plantio</strong>
              <p>Escolha uma semente do seu inventário e plante. Cada cultivo tem nível mínimo, tempo de crescimento e custo de energia.</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🌿</span>
            <div>
              <strong>Fertilizantes</strong>
              <p>Use fertilizante ANTES de plantar para reduzir o tempo de crescimento em 50%!</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🌾</span>
            <div>
              <strong>Colheita</strong>
              <p>Quando o crop estiver maduro, clique no plot e escolha "Colher". Você ganhará o item e XP de Farming!</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🌿</span>
            <div>
              <strong>Ervas Daninhas</strong>
              <p>Após colher, ervas daninhas crescem após 60 segundos. Limpe-as para ganhar 1x Ervas grátis!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>⚡ Sistema de Energia</h2>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <img src="assets/sprites/energia.png" alt="Energia" class="wiki-icon" style="width: 24px; height: 24px;">
            <div>
              <strong>Energia Máxima</strong>
              <p>Começa em 100 e aumenta conforme você sobe de nível (player e skills)</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">⚡</span>
            <div>
              <strong>Uso de Energia</strong>
              <p>Cada ação consome energia: plantar, pescar, minerar, cortar árvores, etc.</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🔋</span>
            <div>
              <strong>Regeneração</strong>
              <p>+5 de energia a cada 5 minutos automaticamente</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🧪</span>
            <div>
              <strong>Poções</strong>
              <p>Compre Poções de Energia no mercado para restaurar 50 de energia instantaneamente</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>💰 Sistema Econômico</h2>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <img src="assets/sprites/ouro.png" alt="Gold" class="wiki-icon" style="width: 24px; height: 24px;">
            <div>
              <strong>Gold</strong>
              <p>Moeda principal do jogo. Use para comprar sementes, itens e ferramentas.</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🏪</span>
            <div>
              <strong>Mercado</strong>
              <p>Compre e venda itens. Preços variam por item.</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">💸</span>
            <div>
              <strong>Venda Esperta</strong>
              <p>Itens processados (pão, peixe cozido) valem mais que itens crus!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>🎯 Sistema de Progressão</h2>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <span class="wiki-icon">⭐</span>
            <div>
              <strong>Nível do Jogador</strong>
              <p>Seu nível principal. Sobe com XP total de todas as skills.</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <img src="assets/sprites/skills.png" alt="Skills" class="wiki-icon" style="width: 24px; height: 24px;">
            <div>
              <strong>Níveis de Skills</strong>
              <p>Cada uma das 8 skills tem seu próprio nível (máx. 99). Desbloqueie novas ações ao subir!</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🔓</span>
            <div>
              <strong>Desbloqueios</strong>
              <p>Níveis mais altos = ações melhores, mais XP, mais gold!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>🔧 Ferramentas Essenciais</h2>
        <p>Você PRECISA ter estas 3 ferramentas no inventário para fazer ações de farming:</p>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <span class="wiki-icon">🥄</span>
            <div>
              <strong>Pá de Mão (Trowel)</strong>
              <p>Necessária para plantar sementes</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🔨</span>
            <div>
              <strong>Enxada (Hoe)</strong>
              <p>Necessária para preparar o solo</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🧹</span>
            <div>
              <strong>Ancinho (Rake)</strong>
              <p>Necessário para limpar ervas daninhas</p>
            </div>
          </div>
        </div>
        <p style="margin-top: 1rem;"><strong>⚠️ IMPORTANTE:</strong> Se você vender ou perder essas ferramentas, compre de volta no mercado!</p>
      </div>

      <div class="wiki-card wiki-card-tip">
        <h2>💡 Dica Pro</h2>
        <p>Foque em aumentar Farming nos primeiros níveis. É a skill principal e desbloqueia melhores cultivos que dão mais XP e gold!</p>
      </div>
    `;
  }

  /**
   * Generate Crops Guide page
   * @returns {string} HTML content
   */
  generateCropsGuide() {
    const cropsData = this.crops.crops || {};

    let cropsHTML = "";
    for (const [key, crop] of Object.entries(cropsData)) {
      const emoji = this.getCropSprite(crop.id);
      cropsHTML += `
        <div class="wiki-crop-card">
          <div class="wiki-crop-header">
            <span class="wiki-crop-icon">${emoji}</span>
            <h3>${crop.namePtBR || crop.name}</h3>
          </div>
          <div class="wiki-crop-stats">
            <div class="wiki-stat">
              <span>🌟 Nível</span>
              <strong>${crop.requiredLevel}</strong>
            </div>
            <div class="wiki-stat">
              <span>⏱️ Tempo</span>
              <strong>${crop.growthTime}s</strong>
            </div>
            <div class="wiki-stat">
              <span>📈 XP</span>
              <strong>${crop.xpGain}</strong>
            </div>
            <div class="wiki-stat">
              <span>⚡ Energia</span>
              <strong>${crop.energyCost}</strong>
            </div>
          </div>
          <div class="wiki-crop-info">
            <div class="wiki-crop-detail">
              <span>💰 Venda:</span>
              <strong>${crop.sellPrice}g</strong>
            </div>
            <div class="wiki-crop-detail">
              <span>🌾 Colheita:</span>
              <strong>${crop.harvestAmount}x</strong>
            </div>
          </div>
          <div class="wiki-crop-stages">
            <span>Estágios: ${crop.stages.join(" → ")}</span>
          </div>
        </div>
      `;
    }

    // Calculate efficiency
    const efficiencyData = [];
    for (const [key, crop] of Object.entries(cropsData)) {
      const xpPerSecond = (crop.xpGain / crop.growthTime).toFixed(3);
      const goldPerSecond = (
        (crop.sellPrice * crop.harvestAmount) /
        crop.growthTime
      ).toFixed(3);
      efficiencyData.push({
        name: crop.namePtBR || crop.name,
        icon: crop.icon,
        xpPerSecond,
        goldPerSecond,
        xpNum: parseFloat(xpPerSecond),
        goldNum: parseFloat(goldPerSecond),
      });
    }

    // Sort by XP efficiency
    const byXP = [...efficiencyData].sort((a, b) => b.xpNum - a.xpNum);
    const byGold = [...efficiencyData].sort((a, b) => b.goldNum - a.goldNum);

    return `
      <h1 class="wiki-page-title">🌾 Guia de Cultivos</h1>

      <div class="wiki-card">
        <h2>📋 Todos os Cultivos</h2>
        <p>Cultivos disponíveis organizados por nível e tempo de crescimento. Use fertilizante para reduzir o tempo em 50%!</p>
      </div>

      <div class="wiki-card">
        <div class="wiki-crop-grid">
          ${cropsHTML}
        </div>
      </div>

      <div class="wiki-card wiki-card-tip">
        <h2>💡 Dica de Farming</h2>
        <p><strong>Fertilizantes são seu melhor amigo!</strong> Eles reduzem o tempo de crescimento pela metade. Use em cultivos de 90s ou mais para máxima eficiência!</p>
      </div>

      <div class="wiki-card">
        <h2>📊 Comparação de Eficiência</h2>
        <p>Veja quais cultivos dão mais XP e Gold por segundo:</p>

        <h3 style="margin-top: 1.5rem;">🏆 Melhor XP/segundo</h3>
        <table class="wiki-table" style="margin-top: 0.5rem;">
          <thead>
            <tr>
              <th>Cultivo</th>
              <th>XP/s</th>
              <th>Tempo</th>
            </tr>
          </thead>
          <tbody>
            ${this.generateCropEfficiencyRows(byXP.slice(0, 5))}
          </tbody>
        </table>

        <h3 style="margin-top: 1.5rem;">💰 Melhor Gold/segundo</h3>
        <table class="wiki-table" style="margin-top: 0.5rem;">
          <thead>
            <tr>
              <th>Cultivo</th>
              <th>Gold/s</th>
              <th>Nível Req.</th>
            </tr>
          </thead>
          <tbody>
            ${this.generateCropGoldRows(byGold.slice(0, 5), cropsData)}
          </tbody>
        </table>
      </div>

      <div class="wiki-card">
        <h2>🌱 Estágios de Crescimento</h2>
        <p>Todos os cultivos passam por 3 estágios visuais:</p>
        <div style="text-align: center; font-size: 2rem; margin: 1rem 0;">
          🌱 → 🌿 → [Cultivo Maduro]
        </div>
        <p>Você só pode colher quando o cultivo estiver no estágio final (maduro)!</p>
      </div>

      <div class="wiki-card wiki-card-warning">
        <h2>⚠️ Dicas Importantes</h2>
        <ul style="margin-left: 1.5rem;">
          <li>Você precisa da <strong>Pá de Mão (Trowel)</strong> no inventário para plantar</li>
          <li><strong>Fertilizante reduz 50% do tempo</strong> - use em cultivos lentos!</li>
          <li>Ervas daninhas aparecem após colher - limpe para ganhar 1x Ervas 🌿</li>
          <li>Plante vários plots ao mesmo tempo para maximizar eficiência</li>
          <li>Crops de nível mais alto dão mais XP e gold, mas levam mais tempo</li>
        </ul>
      </div>
    `;
  }

  /**
   * Generate crop efficiency rows for XP
   */
  generateCropEfficiencyRows(crops) {
    return crops
      .map((crop) => {
        const cropsData = this.crops.crops || {};
        const cropInfo = Object.values(cropsData).find(
          (c) => (c.namePtBR || c.name) === crop.name,
        );
        return `
        <tr>
          <td>${crop.icon} ${crop.name}</td>
          <td><strong>${crop.xpPerSecond}</strong></td>
          <td>${cropInfo?.growthTime}s</td>
        </tr>
      `;
      })
      .join("");
  }

  /**
   * Generate crop efficiency rows for Gold
   */
  generateCropGoldRows(crops, cropsData) {
    return crops
      .map((crop) => {
        const cropInfo = Object.values(cropsData).find(
          (c) => (c.namePtBR || c.name) === crop.name,
        );
        return `
        <tr>
          <td>${crop.icon} ${crop.name}</td>
          <td><strong>${crop.goldPerSecond}g</strong></td>
          <td>Lvl ${cropInfo?.requiredLevel}</td>
        </tr>
      `;
      })
      .join("");
  }

  /**
   * Get crop sprite path
   * @param {string} cropId - Crop ID
   * @returns {string|null} Sprite path or null
   */
  getCropSprite(cropId) {
    // Use emojis from items.json instead of PNG sprites
    const emojiMap = {
      wheat: "🌾",
      corn: "🌽",
      tomato: "🍅",
      potato: "🥔",
      carrot: "🥕",
      pumpkin: "🎃",
      strawberry: "🍓",
      eggplant: "🍆",
      watermelon: "🍉",
      pepper: "🌶️",
    };

    return emojiMap[cropId] || "🌱";
  }

  /**
   * Generate Tools Guide page
   * @returns {string} HTML content
   */
  generateToolsGuide() {
    return `
      <h1 class="wiki-page-title">🔧 Ferramentas</h1>

      <div class="wiki-card">
        <h2>🛠️ Ferramentas Essenciais</h2>
        <p>Você precisa manter estas ferramentas no seu inventário para realizar ações de farming:</p>
      </div>

      <div class="wiki-tools-grid">
        <div class="wiki-tool-card">
          <div class="wiki-tool-header">
            <img src="assets/sprites/mercado/ferramentas/pademao.png" alt="Pá de Mão" class="wiki-tool-icon">
            <h3>Pá de Mão (Trowel)</h3>
          </div>
          <div class="wiki-tool-required">
            ⚠️ OBRIGATÓRIA
          </div>
          <div class="wiki-tool-info">
            <p>Ferramenta básica essencial para plantar qualquer semente na sua fazenda.</p>
            <div class="wiki-tool-stats">
              <span>💰 Preço: 10g (Mercado)</span>
              <span>📦 Não empilha</span>
            </div>
          </div>
        </div>

        <div class="wiki-tool-card">
          <div class="wiki-tool-header">
            <img src="assets/sprites/mercado/ferramentas/enxada.png" alt="Enxada" class="wiki-tool-icon">
            <h3>Enxada (Hoe)</h3>
          </div>
          <div class="wiki-tool-required">
            ⚠️ OBRIGATÓRIA
          </div>
          <div class="wiki-tool-info">
            <p>Usada para preparar o solo antes do plantio. Necessária para farming.</p>
            <div class="wiki-tool-stats">
              <span>💰 Preço: 10g (Mercado)</span>
              <span>📦 Não empilha</span>
            </div>
          </div>
        </div>

        <div class="wiki-tool-card">
          <div class="wiki-tool-header">
            <img src="assets/sprites/mercado/ferramentas/rastelo.png" alt="Ancinho" class="wiki-tool-icon">
            <h3>Ancinho (Rake)</h3>
          </div>
          <div class="wiki-tool-required">
            ⚠️ OBRIGATÓRIA
          </div>
          <div class="wiki-tool-info">
            <p>Essencial para limpar ervas daninhas dos plots e manter a fazenda organizada.</p>
            <div class="wiki-tool-stats">
              <span>💰 Preço: 10g (Mercado)</span>
              <span>📦 Não empilha</span>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card wiki-card-warning">
        <h2>⚠️ MUITO IMPORTANTE</h2>
        <ul style="margin-left: 1.5rem;">
          <li><strong>NUNCA venda essas 3 ferramentas!</strong> Você não conseguirá fazer nada sem elas.</li>
          <li>Você começa o jogo com 1 de cada ferramenta automaticamente</li>
          <li>Se perder ou vender por acidente, compre de volta no Mercado (10g cada)</li>
          <li>Elas <strong>não se desgastam</strong> - duram para sempre!</li>
          <li>Precisam estar no <strong>inventário</strong>, não precisa equipar</li>
        </ul>
      </div>

      <div class="wiki-card">
        <h2>🌿 Fertilizante</h2>
        <div class="wiki-fertilizer-showcase">
          <img src="assets/sprites/mercado/materiais/fertilizante.png" alt="Fertilizante" class="wiki-fertilizer-icon">
          <div class="wiki-fertilizer-info">
            <h3>Fertilizante Premium</h3>
            <div class="wiki-fertilizer-effect">
              ✨ Reduz tempo de crescimento em <strong>50%</strong>!
            </div>
            <div class="wiki-fertilizer-stats">
              <span>💰 Preço: 25g</span>
              <span>📦 Max: 999</span>
            </div>
          </div>
        </div>

        <h3 style="margin-top: 1.5rem;">Como Usar:</h3>
        <div class="wiki-steps">
          <div class="wiki-step">
            <span class="wiki-step-number">1</span>
            <div class="wiki-step-content">
              <h3>Clique no Plot</h3>
              <p>Escolha um plot vazio na fazenda</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">2</span>
            <div class="wiki-step-content">
              <h3>Aplique Fertilizante</h3>
              <p>Selecione a opção "Fertilizar" ANTES de plantar</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">3</span>
            <div class="wiki-step-content">
              <h3>Plante a Semente</h3>
              <p>Agora plante normalmente. O tempo será reduzido!</p>
            </div>
          </div>
        </div>

        <div class="wiki-card wiki-card-tip" style="margin-top: 1rem;">
          <h2>💡 Quando Vale a Pena?</h2>
          <div class="wiki-strategy-list">
            <div class="wiki-strategy-item wiki-strategy-good">
              <span class="wiki-strategy-icon">✅</span>
              <div>
                <strong>Use em:</strong>
                <p>Cultivos de 90s ou mais (Tomate, Batata, Cenoura, etc.)</p>
              </div>
            </div>
            <div class="wiki-strategy-item wiki-strategy-bad">
              <span class="wiki-strategy-icon">❌</span>
              <div>
                <strong>Não vale em:</strong>
                <p>Trigo e Milho (muito rápidos, desperdício de fertilizante)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>📦 Onde Comprar</h2>
        <p>Todas as ferramentas e fertilizantes estão disponíveis no <strong>Mercado</strong> na Cidade.</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>Pá de Mão: 10g</li>
          <li>Enxada: 10g</li>
          <li>Ancinho: 10g</li>
          <li>Fertilizante: 25g</li>
        </ul>
      </div>
    `;
  }

  /**
   * Generate Fertilizer Guide page
   * @returns {string} HTML content
   */
  generateFertilizerGuide() {
    return `
      <h1 class="wiki-page-title">🌿 Fertilizantes</h1>

      <div class="wiki-card">
        <h2>✨ O Poder do Fertilizante</h2>
        <p>Fertilizantes são itens premium que <strong>reduzem o tempo de crescimento dos cultivos em 50%</strong>!</p>
      </div>

      <div class="wiki-fertilizer-showcase">
        <img src="assets/sprites/1299.png" alt="Fertilizante" class="wiki-fertilizer-icon">
        <div class="wiki-fertilizer-info">
          <h3>Fertilizante Premium</h3>
          <div class="wiki-fertilizer-effect">
            ⏱️ Tempo de Crescimento <strong>-50%</strong>
          </div>
          <div class="wiki-fertilizer-stats">
            <span>💰 Compra: 25g</span>
            <span>📦 Max: 999</span>
            <span>🏪 Local: Mercado</span>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>📊 Exemplos de Economia</h2>
        <table class="wiki-table">
          <thead>
            <tr>
              <th>Cultivo</th>
              <th>Tempo Normal</th>
              <th>Com Fertilizante</th>
              <th>Economia</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>🌾 Trigo</td>
              <td>30s</td>
              <td class="wiki-text-success">15s</td>
              <td>15s</td>
            </tr>
            <tr>
              <td>🌽 Milho</td>
              <td>60s</td>
              <td class="wiki-text-success">30s</td>
              <td>30s</td>
            </tr>
            <tr>
              <td>🍅 Tomate</td>
              <td>90s</td>
              <td class="wiki-text-success">45s</td>
              <td>45s</td>
            </tr>
            <tr>
              <td>🥔 Batata</td>
              <td>120s</td>
              <td class="wiki-text-success">60s</td>
              <td>60s</td>
            </tr>
            <tr>
              <td>🥕 Cenoura</td>
              <td>150s</td>
              <td class="wiki-text-success">75s</td>
              <td>75s</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="wiki-card">
        <h2>💡 Estratégia de Uso</h2>

        <div class="wiki-strategy-list">
          <div class="wiki-strategy-item wiki-strategy-good">
            <span class="wiki-strategy-icon">✅</span>
            <div>
              <strong>RECOMENDADO</strong>
              <p>Use em cultivos de 90s ou mais (Tomate, Batata, Cenoura, Abóbora, etc.)</p>
            </div>
          </div>

          <div class="wiki-strategy-item wiki-strategy-good">
            <span class="wiki-strategy-icon">✅</span>
            <div>
              <strong>Farming Noturno</strong>
              <p>Se for dormir, use fertilizante para acelerar e colher antes de deitar</p>
            </div>
          </div>

          <div class="wiki-strategy-item wiki-strategy-good">
            <span class="wiki-strategy-icon">✅</span>
            <div>
              <strong>Maximizar XP</strong>
              <p>Use em crops que dão muito XP para subir de nível mais rápido</p>
            </div>
          </div>

          <div class="wiki-strategy-item wiki-strategy-bad">
            <span class="wiki-strategy-icon">❌</span>
            <div>
              <strong>NÃO RECOMENDADO</strong>
              <p>Trigo (30s) e Milho (60s) são muito rápidos. Economize fertilizante!</p>
            </div>
          </div>

          <div class="wiki-strategy-item wiki-strategy-bad">
            <span class="wiki-strategy-icon">❌</span>
            <div>
              <strong>Desperdício</strong>
              <p>Não use se não for colher logo. O plot ficará maduro e você perderá tempo.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>🎯 Como Aplicar</h2>
        <div class="wiki-steps">
          <div class="wiki-step">
            <span class="wiki-step-number">1</span>
            <div class="wiki-step-content">
              <h3>Tenha Fertilizante no Inventário</h3>
              <p>Compre no Mercado (25g cada) e mantenha alguns no inventário</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">2</span>
            <div class="wiki-step-content">
              <h3>Clique no Plot Vazio</h3>
              <p>Escolha um plot da fazenda que esteja vazio (marrom)</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">3</span>
            <div class="wiki-step-content">
              <h3>Selecione "Fertilizar"</h3>
              <p>NO MENU, clique na opção "🌿 Fertilizar" ANTES de plantar</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">4</span>
            <div class="wiki-step-content">
              <h3>Plante a Semente</h3>
              <p>Agora plante normalmente. O plot ficará com indicador verde 🟢</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">5</span>
            <div class="wiki-step-content">
              <h3>Aproveite o Boost!</h3>
              <p>O cultivo crescerá em metade do tempo normal ⚡</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card wiki-card-warning">
        <h2>⚠️ Observações Importantes</h2>
        <ul style="margin-left: 1.5rem;">
          <li>Fertilizante deve ser aplicado <strong>ANTES</strong> de plantar a semente</li>
          <li>Uma vez aplicado, o efeito não pode ser removido daquele plot</li>
          <li>Fertilizante é consumido no uso - não é permanente</li>
          <li>O efeito dura apenas para aquela plantação - após colher, precisa aplicar novamente</li>
          <li>Você pode ver plots fertilizados pelo indicador verde 🟢</li>
        </ul>
      </div>

      <div class="wiki-card">
        <h2>💰 Vale a Pena?</h2>
        <p><strong>SIM!</strong> Especialmente em cultivos lentos. Veja a matemática:</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>Cenoura (150s) com fertilizante = 75s economizados</li>
          <li>Você pode plantar e colher DUAS vezes no mesmo tempo!</li>
          <li>Isso dobra seu XP e gold no mesmo período</li>
          <li>Custo de 25g é facilmente recuperado com a venda extra</li>
        </ul>
      </div>
    `;
  }

  /**
   * Generate page content by ID
   * @param {string} pageId - Page ID
   * @returns {string} HTML content
   */
  generatePage(pageId) {
    const generators = {
      "getting-started": () => this.generateGettingStarted(),
      "game-mechanics": () => this.generateGameMechanics(),
      crops: () => this.generateCropsGuide(),
      tools: () => this.generateToolsGuide(),
      fertilizer: () => this.generateFertilizerGuide(),
    };

    const generator = generators[pageId];
    return generator ? generator() : "<p>Conteúdo não encontrado</p>";
  }
}
