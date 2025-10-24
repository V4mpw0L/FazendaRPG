/**
 * FazendaRPG - Main Application Entry Point
 * Initializes and starts the game engine
 * @version 0.0.15
 */

import GameEngine from "./core/GameEngine.js";
import { VERSION, getVersionString, logVersion } from "../version.js";

// Create global game instance
window.FazendaRPG = {
  version: VERSION,
  engine: null,
  initialized: false,
};

/**
 * Initialize application
 */
async function init() {
  logVersion(); // Log version info from centralized system
  console.log("📅 Loading game...");

  // Detect iOS
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    console.log("📱 iOS device detected - using optimized loading");
  }

  try {
    // Create game engine
    window.FazendaRPG.engine = new GameEngine();

    // Initialize engine with timeout for iOS
    const initPromise = window.FazendaRPG.engine.init();
    const success = await Promise.race([
      initPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Initialization timeout")), 15000),
      ),
    ]);

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

    // Dispatch game loaded event
    window.dispatchEvent(new Event("gameLoaded"));
  } catch (error) {
    console.error("❌ Failed to initialize FazendaRPG:", error);

    // Show detailed error for iOS
    if (isIOS) {
      showErrorMessage(
        `Failed to load game on iOS.<br><br>` +
          `Error: ${error.message}<br><br>` +
          `Try clearing the cache using the button below.`,
      );
    } else {
      showErrorMessage("Failed to load game. Please refresh the page.");
    }
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
  // Hide loading overlay
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }

  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.innerHTML = `
            <div style="text-align: center; padding: 50px; max-width: 600px; margin: 0 auto;">
                <h1>❌ Error</h1>
                <p style="margin: 20px 0;">${message}</p>
                <button onclick="location.reload(true)" style="margin: 10px; padding: 10px 20px; font-size: 16px; cursor: pointer; background: #5caa1f; color: white; border: none; border-radius: 8px;">
                    🔄 Reload Page
                </button>
                <button onclick="window.clearCacheAndReload()" style="margin: 10px; padding: 10px 20px; font-size: 16px; cursor: pointer; background: #ff6b6b; color: white; border: none; border-radius: 8px;">
                    🗑️ Clear Cache & Reload
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
  // Event system commands
  startHalloween: () => window.FazendaRPG.engine?.startHalloween(),
  stopHalloween: () => window.FazendaRPG.engine?.stopHalloween(),
  listEvents: () => window.FazendaRPG.engine?.listEvents(),
  getEventManager: () => window.FazendaRPG.engine?.getEventManager(),
  // News system commands
  showNews: () => window.FazendaRPG.engine?.newsModal?.forceShow(),
  hideNews: () => window.FazendaRPG.engine?.newsModal?.hide(),
};

console.log("💡 Debug commands available at: window.FazendaRPG.debug");
