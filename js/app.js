/**
 * FazendaRPG - Main Application Entry Point
 * Initializes and starts the game engine
 * @version 0.0.6
 */

import GameEngine from "./core/GameEngine.js";

// Create global game instance
window.FazendaRPG = {
  version: "0.0.6",
  engine: null,
  initialized: false,
};

/**
 * Initialize application
 */
async function init() {
  console.log("🌾 FazendaRPG v0.0.6");
  console.log("📅 Loading game...");

  try {
    // Create game engine
    window.FazendaRPG.engine = new GameEngine();

    // Initialize engine
    const success = await window.FazendaRPG.engine.init();

    if (!success) {
      throw new Error("Failed to initialize game engine");
    }

    // Start game
    window.FazendaRPG.engine.start();

    window.FazendaRPG.initialized = true;

    console.log("✅ FazendaRPG loaded successfully");
    console.log("🎮 Game is ready!");

    // Apply saved theme
    applySavedTheme();

    // Apply saved language
    applySavedLanguage();
  } catch (error) {
    console.error("❌ Failed to initialize FazendaRPG:", error);
    showErrorMessage("Failed to load game. Please refresh the page.");
  }
}

/**
 * Apply saved theme
 */
function applySavedTheme() {
  const savedTheme = localStorage.getItem("fazenda_theme") || "light";
  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(`${savedTheme}-theme`);

  // Update theme button active state
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === savedTheme);
  });
}

/**
 * Apply saved language
 */
function applySavedLanguage() {
  const savedLang = localStorage.getItem("fazenda_language") || "pt-BR";

  // Update language button active state
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === savedLang);
  });
}

/**
 * Show error message
 * @param {string} message - Error message
 */
function showErrorMessage(message) {
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h1>❌ Error</h1>
                <p>${message}</p>
                <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer;">
                    🔄 Reload Page
                </button>
            </div>
        `;
  }
}

/**
 * Handle page visibility change (save when hidden)
 */
document.addEventListener("visibilitychange", () => {
  if (document.hidden && window.FazendaRPG.engine) {
    console.log("📱 Page hidden, saving game...");
    window.FazendaRPG.engine.saveGame();
  }
});

/**
 * Handle page unload (save before closing)
 */
window.addEventListener("beforeunload", (e) => {
  if (window.FazendaRPG.engine && window.FazendaRPG.initialized) {
    window.FazendaRPG.engine.saveGame();
  }
});

/**
 * Handle errors
 */
window.addEventListener("error", (e) => {
  console.error("💥 Uncaught error:", e.error);
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("💥 Unhandled promise rejection:", e.reason);
});

/**
 * Start application when DOM is ready
 */
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Expose useful functions globally for debugging
window.FazendaRPG.debug = {
  saveGame: () => window.FazendaRPG.engine?.saveGame(),
  resetGame: () => window.FazendaRPG.engine?.resetGame(),
  addGold: (amount) => window.FazendaRPG.engine?.player.addGold(amount),
  addXP: (amount) => window.FazendaRPG.engine?.player.addXP(amount),
  addItem: (itemId, amount) =>
    window.FazendaRPG.engine?.inventorySystem.addItem(itemId, amount),
  setEnergy: (amount) => {
    if (window.FazendaRPG.engine) {
      window.FazendaRPG.engine.player.data.energy = amount;
      window.FazendaRPG.engine.topBar.update();
    }
  },
  getPlayer: () => window.FazendaRPG.engine?.player.data,
  levelUpSkill: (skill, levels) => {
    const engine = window.FazendaRPG.engine;
    if (engine && engine.skillSystem) {
      const xpNeeded =
        engine.skillSystem.xpTable[
          engine.skillSystem.getLevel(skill) + levels - 1
        ];
      engine.skillSystem.addXP(skill, xpNeeded);
    }
  },
};

console.log("💡 Debug commands available at: window.FazendaRPG.debug");
