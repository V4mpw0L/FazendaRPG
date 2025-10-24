/**
 * FazendaRPG - Wiki Content Generator
 * Dynamically generates wiki page content from game data
 * @version 0.0.15
 */

import i18n from "../utils/i18n.js";

export default class WikiContentGenerator {
  constructor(gameData) {
    this.crops = gameData?.crops || {};
    this.items = gameData?.items || {};
    this.npcs = gameData?.npcs || {};
    this.quests = gameData?.quests || {};
    this.skills = gameData?.skills || {};
    this.i18n = i18n;
  }

  /**
   * Generate Getting Started page
   * @returns {string} HTML content
   */
  generateGettingStarted() {
    const t = (key) => this.i18n.t(key);

    return `
      <h1 class="wiki-page-title">${t("wiki.gettingStarted.title")}</h1>

      <div class="wiki-card">
        <h2>${t("wiki.gettingStarted.welcome")}</h2>
        <p>${t("wiki.gettingStarted.description")}</p>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.gettingStarted.basicControls")}</h2>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <span class="wiki-icon">☰</span>
            <div>
              <strong>${t("wiki.gettingStarted.menuNav")}</strong>
              <p>${t("wiki.gettingStarted.menuNavDesc")}</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🖱️</span>
            <div>
              <strong>${t("wiki.gettingStarted.clickInteraction")}</strong>
              <p>${t("wiki.gettingStarted.clickInteractionDesc")}</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">📱</span>
            <div>
              <strong>${t("wiki.gettingStarted.mobileFriendly")}</strong>
              <p>${t("wiki.gettingStarted.mobileFriendlyDesc")}</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">📲</span>
            <div>
              <strong>${t("wiki.gettingStarted.installApp")}</strong>
              <p>${t("wiki.gettingStarted.installAppDesc")}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.gettingStarted.firstFarm")}</h2>
        <p>${t("wiki.gettingStarted.firstFarmDesc")}</p>

        <div class="wiki-steps">
          <div class="wiki-step">
            <span class="wiki-step-number">1</span>
            <div class="wiki-step-content">
              <h3>${t("wiki.gettingStarted.step1")}</h3>
              <p>${t("wiki.gettingStarted.step1Desc")}</p>
              <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
                <li>${t("wiki.gettingStarted.step1Item1")}</li>
                <li>${t("wiki.gettingStarted.step1Item2")}</li>
                <li>${t("wiki.gettingStarted.step1Item3")}</li>
                <li>${t("wiki.gettingStarted.step1Item4")}</li>
              </ul>
            </div>
          </div>

          <div class="wiki-step">
            <span class="wiki-step-number">2</span>
            <div class="wiki-step-content">
              <h3>${t("wiki.gettingStarted.step2")}</h3>
              <p>${t("wiki.gettingStarted.step2Desc")}</p>
              <p>${t("wiki.gettingStarted.step2Desc2")}</p>
            </div>
          </div>

          <div class="wiki-step">
            <span class="wiki-step-number">3</span>
            <div class="wiki-step-content">
              <h3>${t("wiki.gettingStarted.step3")}</h3>
              <p>${t("wiki.gettingStarted.step3Desc")}</p>
              <p style="font-size: 1.5rem; margin: 0.5rem 0;">🌱 → 🌿 → 🌾</p>
              <p>${t("wiki.gettingStarted.step3Desc2")}</p>
            </div>
          </div>

          <div class="wiki-step">
            <span class="wiki-step-number">4</span>
            <div class="wiki-step-content">
              <h3>${t("wiki.gettingStarted.step4")}</h3>
              <p>${t("wiki.gettingStarted.step4Desc")}</p>
              <p>${t("wiki.gettingStarted.step4Desc2")}</p>
            </div>
          </div>

          <div class="wiki-step">
            <span class="wiki-step-number">5</span>
            <div class="wiki-step-content">
              <h3>${t("wiki.gettingStarted.step5")}</h3>
              <p>${t("wiki.gettingStarted.step5Desc")}</p>
              <p>${t("wiki.gettingStarted.step5Desc2")}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.gettingStarted.energySystem")}</h2>
        <p>${t("wiki.gettingStarted.energySystemDesc")}</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.gettingStarted.energyItem1")}</li>
          <li>${t("wiki.gettingStarted.energyItem2")}</li>
          <li>${t("wiki.gettingStarted.energyItem3")}</li>
        </ul>
        <p style="margin-top: 0.5rem;">${t("wiki.gettingStarted.energyRegenDesc")}</p>
        <p style="margin-top: 0.5rem;">${t("wiki.gettingStarted.energyTip")}</p>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.gettingStarted.progression")}</h2>
        <p>${t("wiki.gettingStarted.progressionDesc")}</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.gettingStarted.progressionItem1")}</li>
          <li>${t("wiki.gettingStarted.progressionItem2")}</li>
          <li>${t("wiki.gettingStarted.progressionItem3")}</li>
          <li>${t("wiki.gettingStarted.progressionItem4")}</li>
          <li>${t("wiki.gettingStarted.progressionItem5")}</li>
        </ul>
      </div>

      <div class="wiki-card wiki-card-success">
        <h2>${t("wiki.gettingStarted.nextSteps")}</h2>
        <p>${t("wiki.gettingStarted.nextStepsDesc")}</p>
        <ul style="margin-left: 1.5rem;">
          <li>${t("wiki.gettingStarted.nextStepsItem1")}</li>
          <li>${t("wiki.gettingStarted.nextStepsItem2")}</li>
          <li>${t("wiki.gettingStarted.nextStepsItem3")}</li>
          <li>${t("wiki.gettingStarted.nextStepsItem4")}</li>
        </ul>
      </div>
    `;
  }

  /**
   * Generate Game Mechanics page
   * @returns {string} HTML content
   */
  generateGameMechanics() {
    const t = (key) => this.i18n.t(key);

    return `
      <h1 class="wiki-page-title">${t("wiki.gameMechanics.title")}</h1>

      <div class="wiki-card">
        <h2>${t("wiki.gameMechanics.mainMechanics")}</h2>
        <p>${t("wiki.gameMechanics.mainMechanicsDesc")}</p>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.gameMechanics.farming")}</h2>
        <p>${t("wiki.gameMechanics.farmingDesc")}</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.gameMechanics.farmingItem1")}</li>
          <li>${t("wiki.gameMechanics.farmingItem2")}</li>
          <li>${t("wiki.gameMechanics.farmingItem3")}</li>
          <li>${t("wiki.gameMechanics.farmingItem4")}</li>
          <li>${t("wiki.gameMechanics.farmingItem5")}</li>
          <li>${t("wiki.gameMechanics.farmingItem6")}</li>
        </ul>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.gameMechanics.energySystem")}</h2>
        <p>${t("wiki.gameMechanics.energySystemDesc")}</p>

        <h3 style="margin-top: 1rem;">${t("wiki.gameMechanics.energyActions")}</h3>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.gameMechanics.energyAction1")}</li>
          <li>${t("wiki.gameMechanics.energyAction2")}</li>
          <li>${t("wiki.gameMechanics.energyAction3")}</li>
          <li>${t("wiki.gameMechanics.energyAction4")}</li>
          <li>${t("wiki.gameMechanics.energyAction5")}</li>
        </ul>

        <h3 style="margin-top: 1rem;">${t("wiki.gameMechanics.energyRegen")}</h3>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.gameMechanics.energyRegenItem1")}</li>
          <li>${t("wiki.gameMechanics.energyRegenItem2")}</li>
          <li>${t("wiki.gameMechanics.energyRegenItem3")}</li>
          <li>${t("wiki.gameMechanics.energyRegenItem4")}</li>
        </ul>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.gameMechanics.skillsProgression")}</h2>
        <p>${t("wiki.gameMechanics.skillsDesc")}</p>

        <h3 style="margin-top: 1rem;">${t("wiki.gameMechanics.availableSkills")}</h3>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.gameMechanics.skill1")}</li>
          <li>${t("wiki.gameMechanics.skill2")}</li>
          <li>${t("wiki.gameMechanics.skill3")}</li>
          <li>${t("wiki.gameMechanics.skill4")}</li>
          <li>${t("wiki.gameMechanics.skill5")}</li>
          <li>${t("wiki.gameMechanics.skill6")}</li>
          <li>${t("wiki.gameMechanics.skill7")}</li>
          <li>${t("wiki.gameMechanics.skill8")}</li>
        </ul>

        <h3 style="margin-top: 1rem;">${t("wiki.gameMechanics.xpSystem")}</h3>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.gameMechanics.xpItem1")}</li>
          <li>${t("wiki.gameMechanics.xpItem2")}</li>
          <li>${t("wiki.gameMechanics.xpItem3")}</li>
        </ul>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.gameMechanics.inventory")}</h2>
        <p>${t("wiki.gameMechanics.inventoryDesc")}</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.gameMechanics.inventoryItem1")}</li>
          <li>${t("wiki.gameMechanics.inventoryItem2")}</li>
          <li>${t("wiki.gameMechanics.inventoryItem3")}</li>
          <li>${t("wiki.gameMechanics.inventoryItem4")}</li>
        </ul>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.gameMechanics.market")}</h2>
        <p>${t("wiki.gameMechanics.marketDesc")}</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.gameMechanics.marketTab1")}</li>
          <li>${t("wiki.gameMechanics.marketTab2")}</li>
          <li>${t("wiki.gameMechanics.marketFeature1")}</li>
          <li>${t("wiki.gameMechanics.marketFeature2")}</li>
          <li>${t("wiki.gameMechanics.marketFeature3")}</li>
        </ul>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.gameMechanics.npcsAndQuests")}</h2>
        <p>${t("wiki.gameMechanics.npcsDesc")}</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.gameMechanics.npcFeature1")}</li>
          <li>${t("wiki.gameMechanics.npcFeature2")}</li>
          <li>${t("wiki.gameMechanics.npcFeature3")}</li>
          <li>${t("wiki.gameMechanics.npcFeature4")}</li>
        </ul>
      </div>

      <div class="wiki-card wiki-card-warning">
        <h2>${t("wiki.gameMechanics.tips")}</h2>
        <ul style="margin-left: 1.5rem;">
          <li>${t("wiki.gameMechanics.tip1")}</li>
          <li>${t("wiki.gameMechanics.tip2")}</li>
          <li>${t("wiki.gameMechanics.tip3")}</li>
          <li>${t("wiki.gameMechanics.tip4")}</li>
          <li>${t("wiki.gameMechanics.tip5")}</li>
          <li>${t("wiki.gameMechanics.tip6")}</li>
          <li>${t("wiki.gameMechanics.tip7")}</li>
          <li>${t("wiki.gameMechanics.tip8")}</li>
        </ul>
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
