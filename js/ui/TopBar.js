/**
 * FazendaRPG - Top Bar UI Component
 * Manages the fixed top bar with player stats, XP bar, and menu
 * @version 0.0.15
 */

export default class TopBar {
  constructor(player, skillSystem) {
    this.player = player;
    this.skillSystem = skillSystem;
    this.elements = {};
    this.updateInterval = null;
  }

  /**
   * Initialize top bar
   */
  init() {
    this.cacheElements();
    this.attachEventListeners();
    this.startAutoUpdate();
    this.update();
    console.log("✅ Top bar initialized");
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      playerName: document.getElementById("topbar-player-name"),
      level: document.getElementById("topbar-level"),
      farmingFill: document.getElementById("topbar-farming-fill"),
      farmingCurrent: document.getElementById("topbar-farming-current"),
      farmingNeeded: document.getElementById("topbar-farming-needed"),
      gold: document.getElementById("topbar-gold"),
      energy: document.getElementById("topbar-energy"),
      energyFill: document.getElementById("topbar-energy-fill"),
      menuToggle: document.getElementById("menu-toggle"),
    };
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Listen to player stat changes
    window.addEventListener("player:levelup", () => this.update());
    window.addEventListener("player:skillLevelup", () => this.update());
    window.addEventListener("inventory:itemAdded", () => this.update());
    window.addEventListener("inventory:itemRemoved", () => this.update());
    window.addEventListener("inventory:itemSold", () => this.update());

    // Energy changes
    window.addEventListener("farm:planted", () => this.update());
    window.addEventListener("farm:harvested", () => this.update());
  }

  /**
   * Update all status displays
   */
  update() {
    this.updatePlayerName();
    this.updateLevel();
    this.updateFarmingXP();
    this.updateGold();
    this.updateEnergy();
  }

  /**
   * Update player name display
   */
  updatePlayerName() {
    if (!this.elements.playerName) return;

    const name = this.player.data.name || "Fazendeiro";

    if (this.elements.playerName.textContent !== name) {
      this.elements.playerName.textContent = name;
    }
  }

  /**
   * Update level display (from farming skill)
   */
  updateLevel() {
    if (!this.elements.level) return;

    // Get farming skill level
    const farmingLevel = this.skillSystem?.getLevel("farming") || 1;

    if (this.elements.level.textContent !== farmingLevel.toString()) {
      this.elements.level.textContent = farmingLevel;
    }
  }

  /**
   * Update Farming XP bar
   */
  updateFarmingXP() {
    if (
      !this.elements.farmingFill ||
      !this.elements.farmingCurrent ||
      !this.elements.farmingNeeded
    )
      return;

    // Get farming skill data
    const farmingSkill = this.player.data.skills.farming;
    const level = farmingSkill.level;
    const currentXP = farmingSkill.xp;
    const nextLevelXP = this.skillSystem?.xpTable[level] || 0;
    const currentLevelXP = this.skillSystem?.xpTable[level - 1] || 0;

    const xpInLevel = currentXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    const percentage =
      xpNeededForLevel > 0
        ? Math.min((xpInLevel / xpNeededForLevel) * 100, 100)
        : 0;

    // Update bar fill
    this.elements.farmingFill.style.width = `${percentage}%`;

    // Update text
    this.elements.farmingCurrent.textContent = xpInLevel;
    this.elements.farmingNeeded.textContent = xpNeededForLevel;
  }

  /**
   * Update gold display
   */
  updateGold() {
    if (!this.elements.gold) return;

    const gold = this.player.data.gold;
    const formattedGold = this.formatNumber(gold);

    if (this.elements.gold.textContent !== formattedGold) {
      this.elements.gold.textContent = formattedGold;
      this.animateUpdate(this.elements.gold.parentElement);
    }
  }

  /**
   * Update energy display
   */
  updateEnergy() {
    if (!this.elements.energy || !this.elements.energyFill) return;

    const energy = this.player.data.energy;
    const maxEnergy = this.player.data.maxEnergy;
    const energyText = `${energy}/${maxEnergy}`;

    // Update text
    if (this.elements.energy.textContent !== energyText) {
      this.elements.energy.textContent = energyText;
      this.animateUpdate(this.elements.energy.parentElement.parentElement);
    }

    // Update energy bar fill
    const percentage = maxEnergy > 0 ? (energy / maxEnergy) * 100 : 0;
    this.elements.energyFill.style.width = `${percentage}%`;

    // Update energy bar color based on percentage
    this.elements.energyFill.classList.remove("low", "medium");
    if (percentage <= 25) {
      this.elements.energyFill.classList.add("low");
    } else if (percentage <= 50) {
      this.elements.energyFill.classList.add("medium");
    }
  }

  /**
   * Show energy gain animation
   * @param {number} amount - Amount of energy gained
   */
  showEnergyGain(amount) {
    if (!this.elements.energy) return;

    // Get the energy display container
    const energyContainer = this.elements.energy.parentElement.parentElement;
    if (!energyContainer) return;

    // Create floating notification element
    const notification = document.createElement("div");
    notification.className = "energy-gain-notification";
    notification.textContent = `+${amount} ⚡`;
    notification.style.cssText = `
      position: absolute;
      bottom: -25px;
      left: 50%;
      transform: translateX(-50%);
      color: #FFD700;
      font-weight: 700;
      font-size: 1rem;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.8), 0 2px 4px rgba(0, 0, 0, 0.5);
      pointer-events: none;
      z-index: 1000;
      animation: floatUpEnergy 2s ease-out forwards;
      white-space: nowrap;
    `;

    // Add animation keyframes if not already added
    if (!document.getElementById("energy-gain-animation")) {
      const style = document.createElement("style");
      style.id = "energy-gain-animation";
      style.textContent = `
        @keyframes floatUpEnergy {
          0% {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) translateY(-25px);
          }
          100% {
            opacity: 0;
            transform: translateX(-50%) translateY(-50px);
          }
        }
      `;
      document.head.appendChild(style);
    }

    // Add notification to container
    energyContainer.style.position = "relative";
    energyContainer.appendChild(notification);

    // Remove notification after animation
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 2000);

    // Add pulse animation to energy bar
    this.animateUpdate(energyContainer);
  }

  /**
   * Animate status update
   * @param {HTMLElement} element - Element to animate
   */
  animateUpdate(element) {
    if (!element) return;

    element.classList.remove("updated");
    // Trigger reflow
    void element.offsetWidth;
    element.classList.add("updated");

    setTimeout(() => {
      element.classList.remove("updated");
    }, 300);
  }

  /**
   * Format number with separators
   * @param {number} num - Number to format
   * @returns {string} Formatted number
   */
  formatNumber(num) {
    // Quadrillion
    if (num >= 1000000000000000) {
      return (num / 1000000000000000).toFixed(3) + "Q";
    }
    // Trillion
    if (num >= 1000000000000) {
      return (num / 1000000000000).toFixed(3) + "T";
    }
    // Billion
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(3) + "B";
    }
    // Million
    if (num >= 1000000) {
      return (num / 1000000).toFixed(3) + "M";
    }
    // Thousand
    if (num >= 1000) {
      return (num / 1000).toFixed(3) + "K";
    }
    return num.toString();
  }

  /**
   * Start auto-update interval
   */
  startAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    // Update every 2 seconds
    this.updateInterval = setInterval(() => {
      this.update();
    }, 2000);
  }

  /**
   * Stop auto-update interval
   */
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Show notification on top bar (optional enhancement)
   * @param {string} message - Message to show
   * @param {string} type - Notification type
   */
  showNotification(message, type = "info") {
    // Future: Show temporary notifications in top bar
    console.log(`[TopBar] ${type}: ${message}`);
  }

  /**
   * Clean up
   */
  destroy() {
    this.stopAutoUpdate();
    this.elements = {};
  }
}
