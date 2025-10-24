/**
 * FazendaRPG - Wiki Content Generator
 * Dynamically generates wiki page content from game data
 * @version 0.0.17
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
    const t = (key) => this.i18n.t(key);
    const cropsData = this.crops.crops || {};

    let cropsHTML = "";
    for (const [key, crop] of Object.entries(cropsData)) {
      const emoji = this.getCropSprite(crop.id);
      const cropName =
        this.i18n.getLanguage() === "pt-BR"
          ? crop.namePtBR || crop.name
          : crop.name;
      cropsHTML += `
        <div class="wiki-crop-card">
          <div class="wiki-crop-header">
            <span class="wiki-crop-icon">${emoji}</span>
            <h3>${cropName}</h3>
          </div>
          <div class="wiki-crop-stats">
            <div class="wiki-stat">
              <span>${t("wiki.cropsGuide.level")}</span>
              <strong>${crop.requiredLevel}</strong>
            </div>
            <div class="wiki-stat">
              <span>${t("wiki.cropsGuide.time")}</span>
              <strong>${crop.growthTime}s</strong>
            </div>
            <div class="wiki-stat">
              <span>${t("wiki.cropsGuide.xp")}</span>
              <strong>${crop.xpGain}</strong>
            </div>
            <div class="wiki-stat">
              <span>${t("wiki.cropsGuide.energy")}</span>
              <strong>${crop.energyCost}</strong>
            </div>
          </div>
          <div class="wiki-crop-info">
            <div class="wiki-crop-detail">
              <span>${t("wiki.cropsGuide.sellPrice")}</span>
              <strong>${crop.sellPrice}g</strong>
            </div>
            <div class="wiki-crop-detail">
              <span>${t("wiki.cropsGuide.harvest")}</span>
              <strong>${crop.harvestAmount}x</strong>
            </div>
          </div>
          <div class="wiki-crop-stages">
            <span>${t("wiki.cropsGuide.stages")} ${crop.stages.join(" → ")}</span>
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
      const cropName =
        this.i18n.getLanguage() === "pt-BR"
          ? crop.namePtBR || crop.name
          : crop.name;
      efficiencyData.push({
        name: cropName,
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
      <h1 class="wiki-page-title">${t("wiki.cropsGuide.title")}</h1>

      <div class="wiki-card">
        <h2>${t("wiki.cropsGuide.allCrops")}</h2>
        <p>${t("wiki.cropsGuide.allCropsDesc")}</p>
      </div>

      <div class="wiki-card">
        <div class="wiki-crop-grid">
          ${cropsHTML}
        </div>
      </div>

      <div class="wiki-card wiki-card-tip">
        <h2>${t("wiki.cropsGuide.farmingTip")}</h2>
        <p>${t("wiki.cropsGuide.farmingTipDesc")}</p>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.cropsGuide.efficiencyComparison")}</h2>
        <p>${t("wiki.cropsGuide.efficiencyDesc")}</p>

        <h3 style="margin-top: 1.5rem;">${t("wiki.cropsGuide.bestXP")}</h3>
        <table class="wiki-table" style="margin-top: 0.5rem;">
          <thead>
            <tr>
              <th>${t("wiki.cropsGuide.crop")}</th>
              <th>${t("wiki.cropsGuide.xpPerSecond")}</th>
              <th>${t("wiki.cropsGuide.timeColumn")}</th>
            </tr>
          </thead>
          <tbody>
            ${this.generateCropEfficiencyRows(byXP.slice(0, 5))}
          </tbody>
        </table>

        <h3 style="margin-top: 1.5rem;">${t("wiki.cropsGuide.bestGold")}</h3>
        <table class="wiki-table" style="margin-top: 0.5rem;">
          <thead>
            <tr>
              <th>${t("wiki.cropsGuide.crop")}</th>
              <th>${t("wiki.cropsGuide.goldPerSecond")}</th>
              <th>${t("wiki.cropsGuide.levelReq")}</th>
            </tr>
          </thead>
          <tbody>
            ${this.generateCropGoldRows(byGold.slice(0, 5), cropsData)}
          </tbody>
        </table>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.cropsGuide.growthStages")}</h2>
        <p>${t("wiki.cropsGuide.growthStagesDesc")}</p>
        <div style="text-align: center; font-size: 2rem; margin: 1rem 0;">
          ${t("wiki.cropsGuide.growthStagesVisual")}
        </div>
        <p>${t("wiki.cropsGuide.growthStagesNote")}</p>
      </div>

      <div class="wiki-card wiki-card-warning">
        <h2>${t("wiki.cropsGuide.importantTips")}</h2>
        <ul style="margin-left: 1.5rem;">
          <li>${t("wiki.cropsGuide.tip1")}</li>
          <li>${t("wiki.cropsGuide.tip2")}</li>
          <li>${t("wiki.cropsGuide.tip3")}</li>
          <li>${t("wiki.cropsGuide.tip4")}</li>
          <li>${t("wiki.cropsGuide.tip5")}</li>
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
    const t = (key) => this.i18n.t(key);

    return `
      <h1 class="wiki-page-title">${t("wiki.toolsGuide.title")}</h1>

      <div class="wiki-card">
        <h2>${t("wiki.toolsGuide.essential")}</h2>
        <p>${t("wiki.toolsGuide.essentialDesc")}</p>
      </div>

      <div class="wiki-tools-grid">
        <div class="wiki-tool-card">
          <div class="wiki-tool-header">
            <img src="assets/sprites/mercado/ferramentas/pademao.png" alt="Trowel" class="wiki-tool-icon">
            <h3>${t("wiki.toolsGuide.trowel")}</h3>
          </div>
          <div class="wiki-tool-info">
            <p>${t("wiki.toolsGuide.trowelUse")}</p>
            <p><strong>${t("wiki.toolsGuide.howToGet")}:</strong> ${t("wiki.toolsGuide.trowelGet")}</p>
          </div>
        </div>

        <div class="wiki-tool-card">
          <div class="wiki-tool-header">
            <img src="assets/sprites/mercado/ferramentas/enxada.png" alt="Hoe" class="wiki-tool-icon">
            <h3>${t("wiki.toolsGuide.hoe")}</h3>
          </div>
          <div class="wiki-tool-info">
            <p>${t("wiki.toolsGuide.hoeUse")}</p>
            <p><strong>${t("wiki.toolsGuide.howToGet")}:</strong> ${t("wiki.toolsGuide.hoeGet")}</p>
          </div>
        </div>

        <div class="wiki-tool-card">
          <div class="wiki-tool-header">
            <img src="assets/sprites/mercado/ferramentas/rastelo.png" alt="Rake" class="wiki-tool-icon">
            <h3>${t("wiki.toolsGuide.rake")}</h3>
          </div>
          <div class="wiki-tool-info">
            <p>${t("wiki.toolsGuide.rakeUse")}</p>
            <p><strong>${t("wiki.toolsGuide.howToGet")}:</strong> ${t("wiki.toolsGuide.rakeGet")}</p>
          </div>
        </div>
      </div>

      <div class="wiki-card wiki-card-warning">
        <h2>${t("wiki.toolsGuide.tips")}</h2>
        <ul style="margin-left: 1.5rem;">
          <li>${t("wiki.toolsGuide.tip1")}</li>
          <li>${t("wiki.toolsGuide.tip2")}</li>
          <li>${t("wiki.toolsGuide.tip3")}</li>
          <li>${t("wiki.toolsGuide.tip4")}</li>
        </ul>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.toolsGuide.durability")}</h2>
        <p>${t("wiki.toolsGuide.durabilityDesc")}</p>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.toolsGuide.futureTools")}</h2>
        <p>${t("wiki.toolsGuide.futureToolsDesc")}</p>
        <ul style="margin-left: 1.5rem;">
          <li>${t("wiki.toolsGuide.axe")}</li>
          <li>${t("wiki.toolsGuide.pickaxe")}</li>
          <li>${t("wiki.toolsGuide.fishingRod")}</li>
          <li>${t("wiki.toolsGuide.hammer")}</li>
        </ul>
      </div>


      </div>
    `;
  }

  /**
   * Generate Fertilizer Guide page
   * @returns {string} HTML content
   */
  generateFertilizerGuide() {
    const t = (key) => this.i18n.t(key);

    return `
      <h1 class="wiki-page-title">${t("wiki.fertilizerGuide.title")}</h1>

      <div class="wiki-card">
        <h2>${t("wiki.fertilizerGuide.whatIs")}</h2>
        <p>${t("wiki.fertilizerGuide.whatIsDesc")}</p>
      </div>

      <div class="wiki-fertilizer-showcase">
        <h2>${t("wiki.fertilizerGuide.howWorks")}</h2>
        <p>${t("wiki.fertilizerGuide.howWorksDesc")}</p>
        <div class="wiki-steps">
          <div class="wiki-step">
            <span class="wiki-step-number">1</span>
            <div class="wiki-step-content">
              <p>${t("wiki.fertilizerGuide.step1")}</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">2</span>
            <div class="wiki-step-content">
              <p>${t("wiki.fertilizerGuide.step2")}</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">3</span>
            <div class="wiki-step-content">
              <p>${t("wiki.fertilizerGuide.step3")}</p>
            </div>
          </div>
          <div class="wiki-step">
            <span class="wiki-step-number">4</span>
            <div class="wiki-step-content">
              <p>${t("wiki.fertilizerGuide.step4")}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.fertilizerGuide.example")}</h2>
        <p>${t("wiki.fertilizerGuide.exampleBefore")}</p>
        <p>${t("wiki.fertilizerGuide.exampleBeforeDesc")}</p>
        <p style="margin-top: 0.5rem;">${t("wiki.fertilizerGuide.exampleAfter")}</p>
        <p>${t("wiki.fertilizerGuide.exampleAfterDesc")}</p>
        <p style="margin-top: 0.5rem; color: var(--success);">${t("wiki.fertilizerGuide.exampleSaved")}</p>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.fertilizerGuide.whenUse")}</h2>
        <p>${t("wiki.fertilizerGuide.whenUseDesc")}</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.fertilizerGuide.use1")}</li>
          <li>${t("wiki.fertilizerGuide.use2")}</li>
          <li>${t("wiki.fertilizerGuide.use3")}</li>
        </ul>
        <p style="margin-top: 1rem;">${t("wiki.fertilizerGuide.dontUse")}</p>
        <ul style="margin-left: 1.5rem; margin-top: 0.5rem;">
          <li>${t("wiki.fertilizerGuide.dontUse1")}</li>
          <li>${t("wiki.fertilizerGuide.dontUse2")}</li>
        </ul>
      </div>

      <div class="wiki-card">
        <h2>${t("wiki.fertilizerGuide.howGet")}</h2>
        <ul style="margin-left: 1.5rem;">
          <li>${t("wiki.fertilizerGuide.start")}</li>
          <li>${t("wiki.fertilizerGuide.market")}</li>
          <li>${t("wiki.fertilizerGuide.quests")}</li>
          <li>${t("wiki.fertilizerGuide.events")}</li>
        </ul>
      </div>

      <div class="wiki-card wiki-card-tip">
        <h2>${t("wiki.fertilizerGuide.tips")}</h2>
        <ul style="margin-left: 1.5rem;">
          <li>${t("wiki.fertilizerGuide.tip1")}</li>
          <li>${t("wiki.fertilizerGuide.tip2")}</li>
          <li>${t("wiki.fertilizerGuide.tip3")}</li>
          <li>${t("wiki.fertilizerGuide.tip4")}</li>
          <li>${t("wiki.fertilizerGuide.tip5")}</li>
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
