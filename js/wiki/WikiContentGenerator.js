/**
 * FazendaRPG - Wiki Content Generator
 * Dynamically generates wiki page content from game data
 * @version 0.0.8
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
            <span class="wiki-icon">🍔</span>
            <div>
              <strong>Menu Lateral</strong>
              <p>Clique no botão de menu (☰) no topo para abrir o menu de navegação</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🖱️</span>
            <div>
              <strong>Interação</strong>
              <p>Clique nos elementos para interagir - plots, itens, NPCs, etc</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">👆</span>
            <div>
              <strong>Mobile</strong>
              <p>O jogo é 100% otimizado para mobile - toque na tela funciona perfeitamente!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>🌾 Sua Primeira Fazenda</h2>
        <div class="wiki-steps">
          <div class="wiki-step">
            <span class="wiki-step-number">1</span>
            <div class="wiki-step-content">
              <h3>Abra seu Inventário</h3>
              <p>Você começa com <strong>10 sementes de trigo</strong>, <strong>3 fertilizantes</strong> e suas ferramentas básicas (Pá de Mão, Enxada e Rastelo)</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">2</span>
            <div class="wiki-step-content">
              <h3>Plante suas Sementes</h3>
              <p>Clique em um plot vazio na fazenda. Você precisa ter a <strong>Pá de Mão</strong> no inventário para plantar!</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">3</span>
            <div class="wiki-step-content">
              <h3>Aguarde o Crescimento</h3>
              <p>Cada cultivo tem seu tempo de crescimento. O trigo leva 30 segundos. Você pode acelerar com fertilizante!</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">4</span>
            <div class="wiki-step-content">
              <h3>Colha e Venda</h3>
              <p>Quando o cultivo estiver pronto (brilhando com raios dourados ✨), clique para colher e ganhe XP!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card wiki-card-tip">
        <h2>💡 Dica Importante</h2>
        <p><strong>Ervas Daninhas:</strong> Após 60 segundos, ervas daninhas crescem em plots vazios. Use a <strong>Enxada</strong> ou <strong>Rastelo</strong> para limpá-las e ganhar <strong>Ervas</strong> gratuitamente antes de plantar novamente!</p>
      </div>

      <div class="wiki-card">
        <h2>📊 Seus Recursos Iniciais</h2>
        <div class="wiki-resource-grid">
          <div class="wiki-resource-card">
            <img src="assets/sprites/ouro.png" alt="Gold" class="wiki-resource-icon">
            <div>
              <strong>100 Gold</strong>
              <p>Moeda do jogo</p>
            </div>
          </div>
          <div class="wiki-resource-card">
            <img src="assets/sprites/energia.png" alt="Energia" class="wiki-resource-icon">
            <div>
              <strong>100 Energia</strong>
              <p>Para realizar ações</p>
            </div>
          </div>
          <div class="wiki-resource-card">
            <span class="wiki-resource-icon">🌾</span>
            <div>
              <strong>10 Sementes de Trigo</strong>
              <p>Seus primeiros cultivos</p>
            </div>
          </div>
          <div class="wiki-resource-card">
            <span class="wiki-resource-icon">🌿</span>
            <div>
              <strong>3 Fertilizantes</strong>
              <p>Aceleram crescimento</p>
            </div>
          </div>
        </div>
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
        <h2>🌾 Sistema de Farming</h2>
        <p>O farming é a base do jogo. Você planta sementes, aguarda o crescimento e colhe para ganhar recursos e XP.</p>

        <h3 style="margin-top: 1.5rem;">📊 Ciclo de Cultivo</h3>
        <div class="wiki-timeline">
          <div class="wiki-timeline-item">
            <span class="wiki-timeline-icon">🌱</span>
            <div>
              <strong>Plantio</strong>
              <p>Requer Pá de Mão + Semente</p>
            </div>
          </div>
          <div class="wiki-timeline-item">
            <span class="wiki-timeline-icon">⏱️</span>
            <div>
              <strong>Crescimento</strong>
              <p>30s - 300s dependendo do cultivo</p>
            </div>
          </div>
          <div class="wiki-timeline-item">
            <span class="wiki-timeline-icon">✨</span>
            <div>
              <strong>Pronto</strong>
              <p>Brilha com raios dourados!</p>
            </div>
          </div>
          <div class="wiki-timeline-item">
            <span class="wiki-timeline-icon">🧺</span>
            <div>
              <strong>Colheita</strong>
              <p>Ganha item + XP de Farming</p>
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
              <p>Você começa com 100 de energia máxima que pode ser aumentada</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🔋</span>
            <div>
              <strong>Consumo de Energia</strong>
              <p>Ações como plantar (2-11), colher, pescar, minerar consomem energia</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🍗</span>
            <div>
              <strong>Recuperação</strong>
              <p>Use comidas (pão, peixe cozido) e poções para restaurar energia</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">⏰</span>
            <div>
              <strong>Regeneração Natural</strong>
              <p>A energia regenera lentamente ao longo do tempo</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>💰 Economia do Jogo</h2>
        <p>Você começa com <strong>100 gold</strong>. Ganhe mais vendendo itens no mercado!</p>

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
          <li>Sempre mantenha suas <strong>3 ferramentas básicas</strong> no inventário</li>
          <li>Use <strong>fertilizantes</strong> em cultivos demorados para economizar tempo</li>
          <li>Limpe <strong>ervas daninhas</strong> para conseguir ervas grátis</li>
          <li>Complete <strong>missões diárias</strong> para recursos constantes</li>
          <li>Gerencie sua <strong>energia</strong> - não deixe chegar a zero!</li>
        </ul>
      </div>
    `;
  }

  /**
   * Generate Crops Guide page
   * @returns {string} HTML content
   */
  generateCropsGuide() {
    const cropsData = this.crops.crops || {};

    let cropsHTML = '';
    for (const [key, crop] of Object.entries(cropsData)) {
      const sprite = this.getCropSprite(crop.id);
      cropsHTML += `
        <div class="wiki-crop-card">
          <div class="wiki-crop-header">
            ${sprite ? `<img src="${sprite}" alt="${crop.name}" class="wiki-crop-icon-img">` : `<span class="wiki-crop-icon">${crop.icon}</span>`}
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
            <span>Estágios: ${crop.stages.join(' → ')}</span>
          </div>
        </div>
      `;
    }

    return `
      <h1 class="wiki-page-title">🌽 Guia de Cultivos</h1>

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
        <table class="wiki-table">
          <thead>
            <tr>
              <th>Cultivo</th>
              <th>XP/Segundo</th>
              <th>Gold/Segundo</th>
              <th>Melhor para</th>
            </tr>
          </thead>
          <tbody>
            ${this.generateCropEfficiencyRows(cropsData)}
          </tbody>
        </table>
      </div>
    `;
  }

  /**
   * Generate crop efficiency comparison rows
   * @param {Object} crops - Crops data
   * @returns {string} HTML rows
   */
  generateCropEfficiencyRows(crops) {
    const efficiencyData = [];

    for (const [key, crop] of Object.entries(crops)) {
      const xpPerSecond = (crop.xpGain / crop.growthTime).toFixed(2);
      const goldPerSecond = (crop.sellPrice * crop.harvestAmount / crop.growthTime).toFixed(2);

      efficiencyData.push({
        name: crop.namePtBR || crop.name,
        icon: crop.icon,
        xpPerSecond,
        goldPerSecond,
        xpNum: parseFloat(xpPerSecond),
        goldNum: parseFloat(goldPerSecond)
      });
    }

    // Sort by XP efficiency
    efficiencyData.sort((a, b) => b.xpNum - a.xpNum);

    return efficiencyData.map(crop => {
      let bestFor = '';
      if (crop.xpNum > 0.3) bestFor = 'XP ⭐';
      else if (crop.goldNum > 0.5) bestFor = 'Gold 💰';
      else bestFor = 'Balanceado ⚖️';

      return `
        <tr>
          <td>${crop.icon} ${crop.name}</td>
          <td>${crop.xpPerSecond}</td>
          <td>${crop.goldPerSecond}</td>
          <td>${bestFor}</td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Get crop sprite path
   * @param {string} cropId - Crop ID
   * @returns {string|null} Sprite path or null
   */
  getCropSprite(cropId) {
    // Map crop IDs to sprite numbers (based on project structure)
    const spriteMap = {
      wheat: '1247',
      corn: '1249',
      tomato: '1579',
      potato: '1250',
      carrot: '1248',
      pumpkin: '1358',
      strawberry: '1773',
      eggplant: '1775',
      watermelon: '1774',
      pepper: '1302'
    };

    const spriteNum = spriteMap[cropId];
    return spriteNum ? `assets/sprites/${spriteNum}.png` : null;
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
            <img src="assets/sprites/1069.png" alt="Pá de Mão" class="wiki-tool-icon">
            <h3>Pá de Mão (Trowel)</h3>
          </div>
          <div class="wiki-tool-info">
            <p class="wiki-tool-required">✅ Necessária para plantar</p>
            <p>Ferramenta essencial para plantar qualquer semente nos plots da fazenda.</p>
            <div class="wiki-tool-stats">
              <span>💰 Preço: 10g</span>
              <span>♾️ Durabilidade: Infinita</span>
            </div>
          </div>
        </div>

        <div class="wiki-tool-card">
          <div class="wiki-tool-header">
            <img src="assets/sprites/1068.png" alt="Enxada" class="wiki-tool-icon">
            <h3>Enxada (Hoe)</h3>
          </div>
          <div class="wiki-tool-info">
            <p class="wiki-tool-required">✅ Necessária para limpar ervas</p>
            <p>Remove ervas daninhas dos plots. Você ganha 1 erva por plot limpo.</p>
            <div class="wiki-tool-stats">
              <span>💰 Preço: 10g</span>
              <span>♾️ Durabilidade: Infinita</span>
            </div>
          </div>
        </div>

        <div class="wiki-tool-card">
          <div class="wiki-tool-header">
            <img src="assets/sprites/1070.png" alt="Rastelo" class="wiki-tool-icon">
            <h3>Rastelo (Rake)</h3>
          </div>
          <div class="wiki-tool-info">
            <p class="wiki-tool-required">✅ Alternativa para limpar ervas</p>
            <p>Funciona igual à enxada. Use a que você preferir!</p>
            <div class="wiki-tool-stats">
              <span>💰 Preço: 10g</span>
              <span>♾️ Durabilidade: Infinita</span>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card wiki-card-warning">
        <h2>⚠️ Importante!</h2>
        <p><strong>Sempre mantenha suas ferramentas no inventário!</strong> Sem a Pá de Mão você não consegue plantar. Sem Enxada/Rastelo você não consegue limpar ervas daninhas.</p>
      </div>

      <div class="wiki-card">
        <h2>🔨 Ferramentas Avançadas</h2>
        <p>Conforme você progride, pode adquirir ferramentas melhores:</p>

        <div class="wiki-list">
          <div class="wiki-list-item">
            <span class="wiki-icon">⚒️</span>
            <div>
              <strong>Ferramentas de Ferro</strong>
              <p>Podem economizar energia ou aumentar yields. Craftáveis com Smithing lvl 25+</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🎣</span>
            <div>
              <strong>Vara de Pesca</strong>
              <p>Necessária para pescar. Disponível com NPCs ou crafting.</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">⛏️</span>
            <div>
              <strong>Picareta</strong>
              <p>Necessária para minerar. Melhores picaretas mineram mais rápido.</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🪓</span>
            <div>
              <strong>Machado</strong>
              <p>Necessário para cortar árvores. Machados melhores dão mais madeira.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>💡 Dicas de Ferramentas</h2>
        <ul style="margin-left: 1.5rem;">
          <li>Suas 3 ferramentas básicas <strong>nunca quebram</strong></li>
          <li>Você pode comprar ferramentas no <strong>Mercado</strong> ou com <strong>NPCs</strong></li>
          <li>Ferramentas avançadas requerem <strong>skills específicas</strong></li>
          <li>Invista em ferramentas melhores para <strong>economizar energia</strong></li>
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
        <h2>✨ O que são Fertilizantes?</h2>
        <p>Fertilizantes são itens especiais que <strong>reduzem o tempo de crescimento em 50%</strong>! São essenciais para farming eficiente.</p>
      </div>

      <div class="wiki-card">
        <div class="wiki-fertilizer-showcase">
          <img src="assets/sprites/1299.png" alt="Fertilizante" class="wiki-fertilizer-icon">
          <div class="wiki-fertilizer-info">
            <h3>Fertilizante Básico</h3>
            <p class="wiki-fertilizer-effect">🚀 Reduz tempo de crescimento em 50%</p>
            <div class="wiki-fertilizer-stats">
              <span>💰 Compra: 15g</span>
              <span>💸 Venda: 5g</span>
              <span>📦 Empilhável: 999</span>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>📊 Comparação Com/Sem Fertilizante</h2>
        <table class="wiki-table">
          <thead>
            <tr>
              <th>Cultivo</th>
              <th>Sem Fertilizante</th>
              <th>Com Fertilizante</th>
              <th>Tempo Economizado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>🌾 Trigo</td>
              <td>30s</td>
              <td><strong>15s</strong></td>
              <td class="wiki-text-success">-15s</td>
            </tr>
            <tr>
              <td>🌽 Milho</td>
              <td>60s</td>
              <td><strong>30s</strong></td>
              <td class="wiki-text-success">-30s</td>
            </tr>
            <tr>
              <td>🍅 Tomate</td>
              <td>90s</td>
              <td><strong>45s</strong></td>
              <td class="wiki-text-success">-45s</td>
            </tr>
            <tr>
              <td>🥔 Batata</td>
              <td>120s</td>
              <td><strong>60s</strong></td>
              <td class="wiki-text-success">-60s</td>
            </tr>
            <tr>
              <td>🥕 Cenoura</td>
              <td>150s</td>
              <td><strong>75s</strong></td>
              <td class="wiki-text-success">-75s</td>
            </tr>
            <tr>
              <td>🎃 Abóbora</td>
              <td>180s</td>
              <td><strong>90s</strong></td>
              <td class="wiki-text-success">-90s</td>
            </tr>
            <tr>
              <td>🍓 Morango</td>
              <td>210s</td>
              <td><strong>105s</strong></td>
              <td class="wiki-text-success">-105s</td>
            </tr>
            <tr>
              <td>🍉 Melancia</td>
              <td>270s</td>
              <td><strong>135s</strong></td>
              <td class="wiki-text-success">-135s</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="wiki-card">
        <h2>🎯 Quando Usar Fertilizantes?</h2>
        <div class="wiki-strategy-list">
          <div class="wiki-strategy-item wiki-strategy-good">
            <span class="wiki-strategy-icon">✅</span>
            <div>
              <strong>Use em cultivos DEMORADOS (90s+)</strong>
              <p>Máxima economia de tempo! Tomate, Batata, Abóbora, Morango, Melancia.</p>
            </div>
          </div>
          <div class="wiki-strategy-item wiki-strategy-good">
            <span class="wiki-strategy-icon">✅</span>
            <div>
              <strong>Use quando precisar de resultados RÁPIDOS</strong>
              <p>Precisa completar uma quest? Use fertilizante para acelerar!</p>
            </div>
          </div>
          <div class="wiki-strategy-item wiki-strategy-good">
            <span class="wiki-strategy-icon">✅</span>
            <div>
              <strong>Use em farming de ALTO NÍVEL</strong>
              <p>Quando você tem muito gold, use fertilizante em tudo para máxima eficiência.</p>
            </div>
          </div>
          <div class="wiki-strategy-item wiki-strategy-bad">
            <span class="wiki-strategy-icon">❌</span>
            <div>
              <strong>NÃO use em Trigo no início</strong>
              <p>Trigo já é super rápido (30s). Economize fertilizante!</p>
            </div>
          </div>
          <div class="wiki-strategy-item wiki-strategy-bad">
            <span class="wiki-strategy-icon">❌</span>
            <div>
              <strong>NÃO use se estiver com pouco gold</strong>
              <p>Fertilizantes custam 15g. Use apenas quando tiver gold sobrando.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>🏪 Onde Conseguir Fertilizantes?</h2>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <span class="wiki-icon">👨‍🌾</span>
            <div>
              <strong>Old Farmer Joe</strong>
              <p>Vende fertilizantes na fazenda por 15g cada</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🧔</span>
            <div>
              <strong>Marcus the Merchant</strong>
              <p>Vende com 10% de desconto (13.5g) na cidade!</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">📜</span>
            <div>
              <strong>Recompensas de Missões</strong>
              <p>Muitas missões dão fertilizantes como recompensa</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🔨</span>
            <div>
              <strong>Crafting (Futuro)</strong>
              <p>Em breve você poderá craftar fertilizantes!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card wiki-card-tip">
        <h2>💡 Dica Pro</h2>
        <p><strong>Economize fertilizantes no início!</strong> Use seus 3 fertilizantes iniciais apenas em cultivos de 90s ou mais. Quando tiver mais gold, você pode usar à vontade!</p>
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
      'getting-started': () => this.generateGettingStarted(),
      'game-mechanics': () => this.generateGameMechanics(),
      'crops': () => this.generateCropsGuide(),
      'tools': () => this.generateToolsGuide(),
      'fertilizer': () => this.generateFertilizerGuide(),
    };

    const generator = generators[pageId];
    return generator ? generator() : '<p>Conteúdo não encontrado</p>';
  }
}
