/**
 * FazendaRPG - Game Engine
 * Main game engine that integrates all systems and manages game flow
 * @version 0.0.13
 */

import Player from "./Player.js";
import SaveManager from "./SaveManager.js";
import SkillSystem from "../systems/SkillSystem.js";
import FarmSystem from "../systems/FarmSystem.js";
import InventorySystem from "../systems/InventorySystem.js";
import QuestSystem from "../systems/QuestSystem.js";
import NotificationManager from "../systems/NotificationManager.js";
import TopBar from "../ui/TopBar.js";
import SideMenu from "../ui/SideMenu.js";
import ScreenManager from "../ui/ScreenManager.js";
import Modal from "../ui/modals/Modal.js";
import InventoryUI from "../ui/InventoryUI.js";
import MarketUI from "../ui/MarketUI.js";
import NPCSUI from "../ui/NPCSUI.js";
import CityUI from "../ui/CityUI.js";
import WikiManager from "../wiki/WikiManager.js";
import AvatarSelector from "../ui/AvatarSelector.js";
import FertilizerAnimation from "../animations/FertilizerAnimation.js";
import HarvestAnimation from "../animations/HarvestAnimation.js";
import PlantAnimation from "../animations/PlantAnimation.js";
import WeedRemovalAnimation from "../animations/WeedRemovalAnimation.js";
import i18n from "../utils/i18n.js";
import notifications from "../utils/notifications.js";

export default class GameEngine {
  constructor() {
    this.player = null;
    this.saveManager = null;
    this.skillSystem = null;
    this.farmSystem = null;
    this.inventorySystem = null;
    this.questSystem = null;
    this.notificationManager = null;
    this.topBar = null;
    this.sideMenu = null;
    this.screenManager = null;
    this.modal = null;
    this.inventoryUI = null;
    this.marketUI = null;
    this.npcsUI = null;
    this.cityUI = null;
    this.avatarSelector = null;
    this.fertilizerAnimation = null;
    this.weedRemovalAnimation = null;
    this.initialized = false;
    this.running = false;
    this.lastUpdate = Date.now();
    this.updateInterval = null;
  }

  /**
   * Initialize game engine
   * @returns {Promise<boolean>}
   */
  async init() {
    if (this.initialized) {
      console.warn("⚠️ Game engine already initialized");
      return false;
    }

    try {
      console.log("🎮 Initializing FazendaRPG v0.0.13...");

      // Show loading overlay
      this.showLoading(true);

      // Initialize i18n
      await i18n.init();

      // Initialize core systems
      this.player = new Player();
      this.saveManager = new SaveManager();

      // Initialize game systems
      this.skillSystem = new SkillSystem(this.player);
      await this.skillSystem.init();

      // Initialize notification manager
      this.notificationManager = new NotificationManager();
      await this.notificationManager.initialize();

      this.inventorySystem = new InventorySystem(this.player);
      await this.inventorySystem.init();

      this.farmSystem = new FarmSystem(
        this.player,
        this.skillSystem,
        this.inventorySystem,
      );
      await this.farmSystem.init();

      this.questSystem = new QuestSystem(
        this.player,
        this.skillSystem,
        this.inventorySystem,
      );
      await this.questSystem.init();

      // Initialize UI components
      this.screenManager = new ScreenManager();
      this.screenManager.init();

      this.topBar = new TopBar(this.player, this.skillSystem);
      this.topBar.init();

      this.sideMenu = new SideMenu(this.screenManager);
      this.sideMenu.init();

      this.modal = new Modal();
      this.modal.init();

      this.inventoryUI = new InventoryUI(
        this.inventorySystem,
        this.modal,
        notifications,
        this.farmSystem,
      );
      this.inventoryUI.init();

      this.marketUI = new MarketUI(
        this.player,
        this.inventorySystem,
        this.modal,
        notifications,
        this.farmSystem,
        this.skillSystem,
      );
      await this.marketUI.init();

      this.npcsUI = new NPCSUI(
        this.player,
        this.modal,
        notifications,
        this.inventorySystem,
      );
      this.npcsUI.setSystems(this.farmSystem, this.skillSystem);
      await this.npcsUI.init();

      this.cityUI = new CityUI(
        this.player,
        this.modal,
        notifications,
        this.inventorySystem,
        this.screenManager,
      );
      this.cityUI.init();
      this.cityUI.setMarketUI(this.marketUI);

      // Initialize Wiki Manager
      this.wikiManager = new WikiManager(this);
      await this.wikiManager.init();

      // Initialize Avatar Selector
      this.avatarSelector = new AvatarSelector(this);
      this.avatarSelector.init();

      // Initialize Fertilizer Animation
      this.fertilizerAnimation = new FertilizerAnimation();

      // Initialize Harvest Animation
      this.harvestAnimation = new HarvestAnimation();

      // Initialize Plant Animation
      this.plantAnimation = new PlantAnimation();

      // Attach global event listeners
      this.attachEventListeners();

      this.initialized = true;
      console.log("✅ Game engine initialized successfully");

      // Hide loading overlay
      this.showLoading(false);

      return true;
    } catch (error) {
      console.error("❌ Failed to initialize game engine:", error);
      this.showLoading(false);
      notifications.error(
        "Failed to initialize game. Please refresh the page.",
      );
      return false;
    }
  }

  /**
   * Start the game
   * @returns {boolean}
   */
  start() {
    if (!this.initialized) {
      console.error("❌ Cannot start game: not initialized");
      return false;
    }

    if (this.running) {
      console.warn("⚠️ Game already running");
      return false;
    }

    console.log("🎮 Starting game...");

    // Check if save exists
    if (this.saveManager.hasSave()) {
      this.loadGame();
    } else {
      this.showWelcomeScreen();
    }

    // Start game loop
    this.startGameLoop();

    // Start auto-save
    this.saveManager.startAutoSave();

    // Start farm update loop
    this.farmSystem.startUpdateLoop();

    // Update crop notifications if enabled
    if (this.notificationManager.isEnabled()) {
      const plots = this.farmSystem.getPlots();
      const cropsData = this.farmSystem.getCropsData();
      this.notificationManager.updateCropNotifications(plots, cropsData);
    }

    this.running = true;
    console.log("✅ Game started");

    return true;
  }

  /**
   * Stop the game
   */
  stop() {
    if (!this.running) return;

    console.log("🛑 Stopping game...");

    // Stop game loop
    this.stopGameLoop();

    // Stop auto-save
    this.saveManager.stopAutoSave();

    // Stop farm update loop
    this.farmSystem.stopUpdateLoop();

    // Save game before stopping
    this.saveGame();

    this.running = false;
    console.log("✅ Game stopped");
  }

  /**
   * Start game loop
   */
  startGameLoop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.lastUpdate = Date.now();

    this.updateInterval = setInterval(() => {
      this.update();
    }, 1000); // Update every second

    console.log("🔄 Game loop started");
  }

  /**
   * Stop game loop
   */
  stopGameLoop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log("🔄 Game loop stopped");
    }
  }

  /**
   * Game update loop
   */
  update() {
    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000; // in seconds

    // Update play time
    this.player.updatePlayTime(deltaTime);

    // Update energy regeneration
    this.updateEnergyRegeneration();

    this.lastUpdate = now;
  }

  /**
   * Update energy regeneration
   */
  updateEnergyRegeneration() {
    const lastRegen = parseInt(
      localStorage.getItem("fazenda_last_energy_regen") || "0",
    );
    const now = Date.now();

    // Regenerate 5 energy every 60 seconds
    if (now - lastRegen >= 60000) {
      if (this.player.data.energy < this.player.data.maxEnergy) {
        const energyToAdd = 5;
        this.player.addEnergy(energyToAdd);
        localStorage.setItem("fazenda_last_energy_regen", now.toString());
        this.topBar.update();
        this.topBar.showEnergyGain(energyToAdd);
      }
    }
  }

  /**
   * Show welcome screen
   */
  showWelcomeScreen() {
    this.screenManager.showScreen("welcome-screen");
    this.hideTopBarAndMenu();
  }

  /**
   * Hide topbar and menu (for welcome screen)
   */
  hideTopBarAndMenu() {
    const topbar = document.getElementById("topbar");
    const sideMenu = document.getElementById("side-menu");
    const menuOverlay = document.getElementById("menu-overlay");

    if (topbar) topbar.style.display = "none";
    if (sideMenu) sideMenu.style.display = "none";
    if (menuOverlay) menuOverlay.style.display = "none";
  }

  /**
   * Show topbar and menu (after game starts)
   */
  showTopBarAndMenu() {
    const topbar = document.getElementById("topbar");
    const sideMenu = document.getElementById("side-menu");
    const menuOverlay = document.getElementById("menu-overlay");

    if (topbar) topbar.style.display = "flex";
    if (sideMenu) sideMenu.style.display = "";
    if (menuOverlay) menuOverlay.style.display = "";
  }

  /**
   * Start new game
   * @param {string} playerName - Player name
   */
  startNewGame(playerName) {
    if (!playerName || playerName.trim().length === 0) {
      notifications.error(i18n.t("welcome.name"));
      return;
    }

    console.log(`🎮 Starting new game for: ${playerName}`);

    // Initialize new player
    this.player.initialize(playerName);

    // Save initial state
    this.saveGame();

    // Show topbar and menu
    this.showTopBarAndMenu();

    // Show farm screen
    this.screenManager.showScreen("farm-screen");

    // Show welcome notification
    notifications.success(i18n.t("notifications.welcome"));

    // Render initial farm
    this.renderFarm();

    // Update avatar in topbar
    if (this.avatarSelector) {
      this.avatarSelector.updateTopbarAvatar();
    }
  }

  /**
   * Load game from save
   */
  loadGame() {
    console.log("📂 Loading game...");

    const saveData = this.saveManager.load();

    if (!saveData) {
      console.warn("⚠️ No valid save data found, starting new game");
      this.showWelcomeScreen();
      return;
    }

    // Load player data
    if (saveData.player) {
      this.player.load(saveData.player);
      console.log(`✅ Loaded player: ${this.player.data.name}`);
    }

    // Check if player has valid name
    if (
      !this.player.data.name ||
      this.player.data.name.trim() === "" ||
      this.player.data.name === "Fazendeiro"
    ) {
      console.warn("⚠️ Save has no valid player name, showing welcome screen");
      this.showWelcomeScreen();
      return;
    }

    // Check for pending bank interest
    this.checkBankInterest();

    // Show topbar and menu
    this.showTopBarAndMenu();

    // Show farm screen
    this.screenManager.showScreen("farm-screen");

    // Render farm
    this.renderFarm();

    // Update UI
    this.topBar.update();
    this.updateXPBar();

    // Update avatar in topbar
    if (this.avatarSelector) {
      this.avatarSelector.updateTopbarAvatar();
    }

    // Debug: Check player name
    console.log("🔍 Player name:", this.player.data.name);

    // Sync notifications with current game state
    this.syncNotificationsAfterLoad();
  }

  /**
   * Sync notifications after loading game
   */
  syncNotificationsAfterLoad() {
    if (!this.notificationManager || !this.notificationManager.isEnabled()) {
      return;
    }

    // Wait a bit for everything to load
    setTimeout(() => {
      const plots = this.farmSystem.getPlots();
      const cropsData = this.farmSystem.getCropsData();

      this.notificationManager
        .syncNotifications(plots, cropsData)
        .then(() => {
          console.log("✅ Notificações sincronizadas após carregar jogo");
        })
        .catch((error) => {
          console.error("❌ Erro ao sincronizar notificações:", error);
        });
    }, 1000);
  }

  /**
   * Check and notify about pending bank interest
   */
  checkBankInterest() {
    if (!this.bankSystem) return;

    const pendingInterest = this.bankSystem.calculatePendingInterest();

    if (pendingInterest.interestEarned > 0) {
      setTimeout(() => {
        notifications.show(
          `Banco: Você recebeu +${pendingInterest.interestEarned}g de juros! (${pendingInterest.cycles} ciclos de 4h)`,
          "gold",
          {
            icon: '<img src="./assets/sprites/ouro.png" alt="Ouro">',
            duration: 4000,
          },
        );
      }, 1500);
    }
  }

  /**
   * Save game
   * @returns {boolean}
   */
  saveGame() {
    const saveData = {
      player: this.player.getData(),
      savedAt: Date.now(),
      version: "0.0.13",
    };

    const success = this.saveManager.save(saveData);

    if (success) {
      console.log("💾 Game saved");
    }

    return success;
  }

  /**
   * Reset game
   */
  resetGame() {
    if (!confirm(i18n.t("settings.confirmReset"))) {
      return;
    }

    console.log("🔄 Resetting game...");

    // Stop game
    this.stop();

    // Delete save data
    this.saveManager.deleteSave(true);

    // Reset player
    this.player.reset();

    // Reset systems
    this.farmSystem.resetFarm();
    this.inventorySystem.clearInventory();
    this.questSystem.resetQuests();

    // Clear screen history
    this.screenManager.clearHistory();

    // Show welcome screen
    this.showWelcomeScreen();

    notifications.success(i18n.t("settings.resetSuccess"));

    // Restart game
    this.start();
  }

  /**
   * Save game to file (download save file)
   */
  saveToFile() {
    // Get complete game state
    const saveData = {
      player: this.player.getData(),
      savedAt: Date.now(),
      version: "0.0.13",
    };

    // Verify integrity before saving
    const verification = this.saveManager.verifySaveIntegrity(saveData);

    if (!verification.valid) {
      console.error("❌ Save verification failed:", verification.errors);
      notifications.error(
        i18n.t("settings.saveError") || "Erro ao salvar: dados inválidos",
      );
      return;
    }

    if (verification.warnings.length > 0) {
      console.warn("⚠️ Save warnings:", verification.warnings);
    }

    // Save to file
    const success = this.saveManager.saveToFile(saveData);

    if (success) {
      notifications.success(
        i18n.t("settings.saveSuccess") || "Save baixado com sucesso!",
      );
    } else {
      notifications.error(
        i18n.t("settings.saveError") || "Erro ao salvar arquivo",
      );
    }
  }

  /**
   * Load game from file (upload save file)
   */
  async loadFromFile() {
    try {
      // Show loading state
      notifications.info(
        i18n.t("settings.loadingFile") || "Carregando arquivo...",
      );

      // Load from file
      const saveData = await this.saveManager.loadFromFile();

      if (!saveData) {
        notifications.error(
          i18n.t("settings.loadError") || "Erro ao carregar: arquivo inválido",
        );
        return;
      }

      // Verify integrity
      const verification = this.saveManager.verifySaveIntegrity(saveData);

      if (!verification.valid) {
        console.error("❌ Load verification failed:", verification.errors);
        notifications.error(
          i18n.t("settings.loadErrorInvalid") ||
            "Erro ao carregar: save corrompido ou incompatível",
        );
        return;
      }

      if (verification.warnings.length > 0) {
        console.warn("⚠️ Load warnings:", verification.warnings);
      }

      // Confirm with user before overwriting current save
      const currentSave = this.saveManager.hasSave();
      if (currentSave) {
        const playerName = this.player.data.name;
        const confirm = window.confirm(
          i18n.t("settings.confirmLoadFile") ||
            `Tem certeza que deseja carregar este save? Seu progresso atual (${playerName}) será substituído!\n\nDica: Exporte seu save atual antes para não perder o progresso.`,
        );

        if (!confirm) {
          notifications.info(
            i18n.t("settings.loadCancelled") || "Carregamento cancelado",
          );
          return;
        }
      }

      // Stop game systems
      this.stop();

      // Load player data
      if (saveData.player) {
        const loadSuccess = this.player.load(saveData.player);

        if (!loadSuccess) {
          notifications.error(
            i18n.t("settings.loadError") || "Erro ao carregar dados do jogador",
          );
          // Restart with current data
          this.start();
          return;
        }
      }

      // Save to localStorage (now it becomes the active save)
      const saveSuccess = this.saveGame();

      if (!saveSuccess) {
        notifications.error(
          i18n.t("settings.loadError") || "Erro ao salvar dados carregados",
        );
        this.start();
        return;
      }

      // Restart game with loaded data
      this.start();

      // Update all UI
      this.renderFarm();
      this.renderInventory();
      this.topBar.update();
      this.updateXPBar();

      // Update avatar in topbar
      if (this.avatarSelector) {
        this.avatarSelector.updateTopbarAvatar();
      }

      // Update crop notifications if enabled
      if (this.notificationManager.isEnabled()) {
        const plots = this.farmSystem.getPlots();
        const cropsData = this.farmSystem.getCropsData();
        this.notificationManager.updateCropNotifications(plots, cropsData);
      }

      notifications.success(
        i18n.t("settings.loadSuccess") ||
          `Save carregado com sucesso! Bem-vindo(a) de volta, ${saveData.player.name}!`,
      );

      console.log("✅ Save file loaded and applied successfully");
    } catch (error) {
      console.error("❌ Failed to load from file:", error);
      notifications.error(
        i18n.t("settings.loadError") || "Erro ao carregar arquivo",
      );
    }
  }

  /**
   * Render farm grid
   */
  renderFarm() {
    const farmGrid = document.getElementById("farm-grid");
    if (!farmGrid) return;

    farmGrid.innerHTML = "";

    const plots = this.farmSystem.getPlots();

    plots.forEach((plot, index) => {
      const tile = this.createFarmTile(index);
      farmGrid.appendChild(tile);
    });

    // Update XP bar
    this.updateXPBar();
  }

  /**
   * Create farm tile element
   * @param {number} index - Plot index
   * @returns {HTMLElement}
   */
  createFarmTile(index) {
    const tile = document.createElement("div");
    tile.className = "farm-tile farm-plot";
    tile.dataset.index = index;

    // Update tile appearance
    this.updateFarmTile(tile, index);

    // Add click handler
    tile.addEventListener("click", () => this.handleFarmTileClick(index));

    return tile;
  }

  /**
   * Generate SVG for crop growth stages
   * @param {number} progress - Growth progress (0-100)
   * @returns {string} SVG HTML
   */
  generateCropGrowthSVG(progress) {
    if (progress < 33) {
      // Stage 1: Seed sprouting (0-33%)
      const sproutHeight = 20 + (progress / 33) * 15;
      return `
        <svg viewBox="0 0 100 100" style="width: 70%; height: 70%;">
          <defs>
            <linearGradient id="stem1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#7cb342;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#558b2f;stop-opacity:1" />
            </linearGradient>
            <radialGradient id="leaf1">
              <stop offset="0%" style="stop-color:#9ccc65;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#689f38;stop-opacity:1" />
            </radialGradient>
            <filter id="shadow">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" flood-opacity="0.3"/>
            </filter>
          </defs>
          <!-- Soil bump -->
          <ellipse cx="50" cy="75" rx="12" ry="4" fill="#8b6914" opacity="0.6"/>
          <!-- Main stem -->
          <g filter="url(#shadow)">
            <path d="M 50 75 Q 48 ${75 - sproutHeight * 0.7} 50 ${75 - sproutHeight}"
                  stroke="url(#stem1)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            <!-- Small leaf left -->
            <ellipse cx="${48 - (progress / 33) * 3}" cy="${70 - sproutHeight * 0.5}"
                     rx="${3 + (progress / 33) * 2}" ry="${5 + (progress / 33) * 3}"
                     fill="url(#leaf1)" transform="rotate(-30 ${48 - (progress / 33) * 3} ${70 - sproutHeight * 0.5})"/>
            <!-- Small leaf right -->
            <ellipse cx="${52 + (progress / 33) * 3}" cy="${68 - sproutHeight * 0.5}"
                     rx="${3 + (progress / 33) * 2}" ry="${5 + (progress / 33) * 3}"
                     fill="url(#leaf1)" transform="rotate(30 ${52 + (progress / 33) * 3} ${68 - sproutHeight * 0.5})"/>
          </g>
        </svg>
      `;
    } else if (progress < 66) {
      // Stage 2: Growing plant (33-66%)
      const growthFactor = (progress - 33) / 33;
      const plantHeight = 35 + growthFactor * 15;
      return `
        <svg viewBox="0 0 100 100" style="width: 75%; height: 75%;">
          <defs>
            <linearGradient id="stem2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#8bc34a;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#558b2f;stop-opacity:1" />
            </linearGradient>
            <radialGradient id="leaf2">
              <stop offset="0%" style="stop-color:#aed581;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7cb342;stop-opacity:1" />
            </radialGradient>
            <filter id="shadow2">
              <feDropShadow dx="1" dy="3" stdDeviation="2" flood-opacity="0.4"/>
            </filter>
          </defs>
          <!-- Main stem -->
          <g filter="url(#shadow2)">
            <path d="M 50 78 Q 48 ${78 - plantHeight * 0.6} 50 ${78 - plantHeight}"
                  stroke="url(#stem2)" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            <!-- Left branch -->
            <path d="M 50 ${58 - growthFactor * 5} Q ${45 - growthFactor * 8} ${53 - growthFactor * 3} ${40 - growthFactor * 10} ${50 - growthFactor * 2}"
                  stroke="url(#stem2)" stroke-width="2" fill="none" stroke-linecap="round"/>
            <!-- Right branch -->
            <path d="M 50 ${60 - growthFactor * 5} Q ${55 + growthFactor * 8} ${55 - growthFactor * 3} ${60 + growthFactor * 10} ${52 - growthFactor * 2}"
                  stroke="url(#stem2)" stroke-width="2" fill="none" stroke-linecap="round"/>
            <!-- Leaves -->
            <ellipse cx="${40 - growthFactor * 10}" cy="${50 - growthFactor * 2}"
                     rx="${6 + growthFactor * 3}" ry="${9 + growthFactor * 4}"
                     fill="url(#leaf2)" transform="rotate(-40 ${40 - growthFactor * 10} ${50 - growthFactor * 2})"/>
            <ellipse cx="${60 + growthFactor * 10}" cy="${52 - growthFactor * 2}"
                     rx="${6 + growthFactor * 3}" ry="${9 + growthFactor * 4}"
                     fill="url(#leaf2)" transform="rotate(40 ${60 + growthFactor * 10} ${52 - growthFactor * 2})"/>
            <!-- Top leaves -->
            <ellipse cx="${45 - growthFactor * 4}" cy="${40 - growthFactor * 8}"
                     rx="${5 + growthFactor * 2}" ry="${8 + growthFactor * 3}"
                     fill="url(#leaf2)" transform="rotate(-25 ${45 - growthFactor * 4} ${40 - growthFactor * 8})"/>
            <ellipse cx="${55 + growthFactor * 4}" cy="${38 - growthFactor * 8}"
                     rx="${5 + growthFactor * 2}" ry="${8 + growthFactor * 3}"
                     fill="url(#leaf2)" transform="rotate(25 ${55 + growthFactor * 4} ${38 - growthFactor * 8})"/>
            <!-- Center top leaf -->
            <ellipse cx="50" cy="${32 - growthFactor * 10}"
                     rx="${6 + growthFactor * 2}" ry="${10 + growthFactor * 4}"
                     fill="url(#leaf2)"/>
          </g>
        </svg>
      `;
    } else {
      // Stage 3: Almost ready (66-99%)
      const matureFactor = (progress - 66) / 34;
      return `
        <svg viewBox="0 0 100 100" style="width: 90%; height: 90%;">
          <defs>
            <linearGradient id="stem3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#9ccc65;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#689f38;stop-opacity:1" />
            </linearGradient>
            <radialGradient id="leaf3">
              <stop offset="0%" style="stop-color:#c5e1a5;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8bc34a;stop-opacity:1" />
            </radialGradient>

            <filter id="shadow3">
              <feDropShadow dx="1" dy="3" stdDeviation="2.5" flood-opacity="0.5"/>
            </filter>
          </defs>
          <!-- Full grown plant -->
          <g filter="url(#shadow3)">
            <path d="M 50 82 Q 48 50 50 20"
                  stroke="url(#stem3)" stroke-width="5" fill="none" stroke-linecap="round"/>
            <!-- Multiple branches -->
            <path d="M 50 55 Q 40 52 30 50"
                  stroke="url(#stem3)" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M 50 58 Q 60 55 70 53"
                  stroke="url(#stem3)" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M 50 42 Q 42 40 32 38"
                  stroke="url(#stem3)" stroke-width="3" fill="none" stroke-linecap="round"/>
            <path d="M 50 45 Q 58 43 68 41"
                  stroke="url(#stem3)" stroke-width="3" fill="none" stroke-linecap="round"/>
            <!-- Large leaves -->
            <ellipse cx="30" cy="50" rx="10" ry="15" fill="url(#leaf3)" transform="rotate(-45 30 50)"/>
            <ellipse cx="70" cy="53" rx="10" ry="15" fill="url(#leaf3)" transform="rotate(45 70 53)"/>
            <ellipse cx="32" cy="38" rx="9" ry="14" fill="url(#leaf3)" transform="rotate(-35 32 38)"/>
            <ellipse cx="68" cy="41" rx="9" ry="14" fill="url(#leaf3)" transform="rotate(35 68 41)"/>
            <ellipse cx="42" cy="30" rx="9" ry="13" fill="url(#leaf3)" transform="rotate(-20 42 30)"/>
            <ellipse cx="58" cy="28" rx="9" ry="13" fill="url(#leaf3)" transform="rotate(20 58 28)"/>
          </g>
        </svg>
      `;
    }
  }

  /**
   * Update farm tile appearance
   * @param {HTMLElement} tile - Tile element
   * @param {number} index - Plot index
   */
  updateFarmTile(tile, index) {
    const icon = this.farmSystem.getCropStageIcon(index);
    const isReady = this.farmSystem.isPlotReady(index);
    const timeRemaining = this.farmSystem.getTimeRemaining(index);
    const progress = this.farmSystem.getGrowthProgress(index);
    const plot = this.farmSystem.getPlot(index);
    const isFertilized = plot && plot.fertilized;
    const hasWeeds = this.farmSystem.hasWeeds(index);

    // Check if plot has weeds
    if (hasWeeds) {
      // Show weeds SVG with 3D effect
      tile.innerHTML = `
        <div class="farm-tile-icon" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
          <svg viewBox="0 0 100 100" style="width: 70%; height: 70%;">
            <defs>
              <linearGradient id="weed1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#6b8e23;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#556b2f;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="weed2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:#8fbc8f;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#6b8e23;stop-opacity:1" />
              </linearGradient>
              <filter id="shadow">
                <feDropShadow dx="1" dy="2" stdDeviation="1" flood-opacity="0.4"/>
              </filter>
            </defs>
            <!-- Weed 1 - Left -->
            <g filter="url(#shadow)">
              <path d="M 25 70 Q 20 60 22 50 Q 24 40 20 35" stroke="url(#weed1)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <ellipse cx="20" cy="35" rx="4" ry="6" fill="url(#weed2)"/>
              <ellipse cx="18" cy="42" rx="3" ry="5" fill="url(#weed2)"/>
              <ellipse cx="23" cy="48" rx="3.5" ry="5" fill="url(#weed2)"/>
            </g>
            <!-- Weed 2 - Center -->
            <g filter="url(#shadow)">
              <path d="M 50 75 Q 48 60 50 45 Q 52 35 50 28" stroke="url(#weed1)" stroke-width="3" fill="none" stroke-linecap="round"/>
              <ellipse cx="50" cy="28" rx="5" ry="7" fill="url(#weed2)"/>
              <ellipse cx="47" cy="38" rx="4" ry="6" fill="url(#weed2)"/>
              <ellipse cx="54" cy="45" rx="4" ry="6" fill="url(#weed2)"/>
              <ellipse cx="48" cy="52" rx="3.5" ry="5" fill="url(#weed2)"/>
            </g>
            <!-- Weed 3 - Right -->
            <g filter="url(#shadow)">
              <path d="M 75 72 Q 78 58 75 48 Q 72 38 76 32" stroke="url(#weed1)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
              <ellipse cx="76" cy="32" rx="4" ry="6" fill="url(#weed2)"/>
              <ellipse cx="78" cy="40" rx="3" ry="5" fill="url(#weed2)"/>
              <ellipse cx="73" cy="50" rx="3.5" ry="5" fill="url(#weed2)"/>
            </g>
            <!-- Small weeds -->
            <ellipse cx="35" cy="65" rx="2.5" ry="4" fill="url(#weed2)" opacity="0.8"/>
            <ellipse cx="65" cy="68" rx="2.5" ry="4" fill="url(#weed2)" opacity="0.8"/>
            <ellipse cx="40" cy="72" rx="2" ry="3" fill="url(#weed2)" opacity="0.7"/>
          </svg>
        </div>
        <div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); background: rgba(107, 142, 35, 0.9); color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
          Limpar
        </div>
      `;
      tile.classList.remove("ready");
      tile.classList.add("has-weeds");
      return;
    }

    // Remove weeds class if no weeds
    tile.classList.remove("has-weeds");

    // Check if plot is growing (show SVG animation)
    if (plot && plot.crop && progress > 0 && progress < 100) {
      const cropSVG = this.generateCropGrowthSVG(progress);
      tile.innerHTML = `
        <div class="farm-tile-icon" style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
          ${cropSVG}
        </div>
      `;
    } else {
      // Set icon (empty or ready)
      tile.innerHTML = `<div class="farm-tile-icon">${icon}</div>`;
    }

    // Add ready class
    if (isReady) {
      tile.classList.add("ready");
    } else {
      tile.classList.remove("ready");
    }

    // Add timer if growing
    if (timeRemaining > 0) {
      const timerEl = document.createElement("div");
      timerEl.className = isFertilized
        ? "farm-tile-timer fertilized"
        : "farm-tile-timer";
      timerEl.textContent = this.formatTime(timeRemaining);
      tile.appendChild(timerEl);
    }

    // Add progress bar if growing
    if (progress > 0 && progress < 100) {
      const progressBar = document.createElement("div");
      progressBar.className = "farm-tile-progress";
      progressBar.innerHTML = `<div class="farm-tile-progress-bar" style="width: ${progress}%"></div>`;
      tile.appendChild(progressBar);
    }
  }

  /**
   * Update all farm tiles (for real-time updates)
   */
  updateFarmTiles() {
    const farmGrid = document.getElementById("farm-grid");
    if (!farmGrid) return;

    const tiles = farmGrid.querySelectorAll(".farm-tile");
    tiles.forEach((tile, index) => {
      this.updateFarmTile(tile, index);
    });
  }

  /**
   * Handle farm tile click
   * @param {number} index - Plot index
   */
  handleFarmTileClick(index) {
    if (this.farmSystem.isPlotReady(index)) {
      this.harvestPlot(index);
    } else if (this.farmSystem.isPlotEmpty(index)) {
      // Check if plot has weeds
      if (this.farmSystem.hasWeeds(index)) {
        this.clearWeedsFromPlot(index);
      } else {
        this.plantPlot(index);
      }
    } else if (this.farmSystem.isPlotGrowing(index)) {
      this.showGrowingPlotOptions(index);
    }
  }

  /**
   * Show options for growing plot (fertilize, etc)
   * @param {number} index - Plot index
   */
  showGrowingPlotOptions(index) {
    const plot = this.farmSystem.getPlot(index);
    if (!plot || !plot.crop) return;

    const cropData = this.farmSystem.getCropData(plot.crop);
    const cropName = cropData?.namePtBR || cropData?.name || "Cultivo";
    const icon = this.farmSystem.getCropStageIcon(index);
    const timeRemaining = this.farmSystem.getTimeRemaining(index);
    const progress = this.farmSystem.getGrowthProgress(index);
    const isFertilized = plot.fertilized || false;

    // Check for fertilizer in inventory
    const fertilizers = this.inventorySystem
      .getInventoryArray()
      .filter((item) => item.id === "fertilizer");
    const hasFertilizer = fertilizers.length > 0 && fertilizers[0].count > 0;

    let optionsHTML = "";

    if (hasFertilizer && !isFertilized) {
      optionsHTML = `
        <div class="growing-option" data-action="fertilize" style="
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.5rem;
        ">
          <div style="font-size: 2rem;">🌿</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: var(--text-primary);">Usar Fertilizante</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">
              Reduz o tempo de crescimento | Você tem: ${fertilizers[0].count}
            </div>
          </div>
        </div>
      `;
    } else if (isFertilized) {
      optionsHTML = `
        <div style="
          padding: 1rem;
          border: 2px solid #5caa1f;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          background: rgba(92, 170, 31, 0.1);
        ">
          <div style="font-weight: 600; color: #5caa1f;">✓ Já fertilizado</div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">
            Este cultivo já está crescendo mais rápido!
          </div>
        </div>
      `;
    } else {
      optionsHTML = `
        <div style="
          padding: 1rem;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          margin-bottom: 0.5rem;
          opacity: 0.6;
        ">
          <div style="font-weight: 600; color: var(--text-secondary);">Sem fertilizante</div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">
            Compre fertilizante no mercado para acelerar o crescimento!
          </div>
        </div>
      `;
    }

    const content = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">${icon}</div>
        <h3 style="margin: 0.5rem 0; color: var(--text-primary);">${cropName}</h3>
        <div style="font-size: 0.875rem; color: var(--text-secondary);">
          ⏱️ ${this.formatTime(timeRemaining)} restante | 📊 ${Math.floor(progress)}% crescido
        </div>
      </div>
      ${optionsHTML}
      <div class="growing-option destroy-crop" data-action="destroy" style="
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border: 2px solid #dc3545;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 1rem;
        background: rgba(220, 53, 69, 0.05);
      ">
        <div style="font-size: 2rem;">🗑️</div>
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #dc3545;">Destruir Cultivo</div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">
            Remove este cultivo permanentemente
          </div>
        </div>
      </div>
      <style>
        .growing-option:hover {
          background: var(--bg-accent);
          border-color: var(--brand-primary);
          transform: translateX(4px);
        }
        .destroy-crop:hover {
          background: rgba(220, 53, 69, 0.15) !important;
          border-color: #c82333 !important;
          transform: translateX(4px) !important;
        }
      </style>
    `;

    this.modal.show({
      title: "🌱 Cultivo Crescendo",
      content: content,
      closable: true,
      size: "small",
    });

    // Add click handler for fertilize option
    setTimeout(() => {
      const fertilizeOption = document.querySelector(
        '.growing-option[data-action="fertilize"]',
      );
      if (fertilizeOption) {
        fertilizeOption.addEventListener("click", () => {
          this.modal.close();

          const result = this.farmSystem.fertilize(index);
          if (result.success) {
            const fertilizerData =
              this.inventorySystem.getItemData("fertilizer");
            let fertilizerIcon = fertilizerData?.icon || "🌿";
            // Convert PNG path to img tag if needed
            if (
              fertilizerIcon.includes(".png") ||
              fertilizerIcon.includes("assets/")
            ) {
              fertilizerIcon = `<img src="${fertilizerIcon}" alt="Fertilizante">`;
            }
            notifications.success(
              "Fertilizante aplicado! Crescimento acelerado.",
              { icon: fertilizerIcon },
            );
            this.renderFarm();
            this.topBar.update();

            // Reschedule notification with reduced growth time (50% reduction)
            const plot = this.farmSystem.getPlot(index);
            if (plot && plot.crop && plot.plantedAt) {
              const cropData = this.farmSystem.getCropData(plot.crop);
              if (cropData) {
                // Calculate new ready time with fertilizer (50% reduction)
                const growthTime = cropData.growthTime * 0.5 * 1000;
                const readyAt = plot.plantedAt + growthTime;

                // Cancel old notification and schedule new one with reduced time
                this.notificationManager.cancelCropNotification(index);
                this.notificationManager.scheduleCropNotification(
                  index,
                  cropData.name,
                  readyAt,
                );

                console.log(
                  `🔔 Notificação reagendada para ${cropData.name} com fertilizante`,
                );
              }
            }
          } else {
            notifications.error(result.error || "Não foi possível fertilizar");
          }
        });
      }

      // Add click handler for destroy option
      const destroyOption = document.querySelector(
        '.growing-option[data-action="destroy"]',
      );
      if (destroyOption) {
        destroyOption.addEventListener("click", () => {
          // Confirm destruction
          const confirmContent = `
            <div style="text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
              <p style="margin-bottom: 1rem; color: var(--text-primary); font-weight: 500;">
                Tem certeza que deseja <strong style="color: #dc3545;">destruir</strong> este cultivo?
              </p>
              <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
                Esta ação não pode ser desfeita e você não receberá nada de volta.
              </p>
              <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="confirm-destroy" class="btn" style="
                  padding: 0.75rem 1.5rem;
                  background: #dc3545;
                  color: white;
                  border: none;
                  border-radius: 8px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s;
                  font-size: 0.95rem;
                ">Sim, Destruir</button>
                <button id="cancel-destroy" class="btn" style="
                  padding: 0.75rem 1.5rem;
                  background: var(--bg-secondary);
                  color: var(--text-primary);
                  border: 2px solid var(--border-color);
                  border-radius: 8px;
                  font-weight: 600;
                  cursor: pointer;
                  transition: all 0.2s;
                  font-size: 0.95rem;
                ">Cancelar</button>
              </div>
            </div>
            <style>
              #confirm-destroy:hover {
                background: #c82333 !important;
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
              }
              #cancel-destroy:hover {
                background: var(--bg-accent) !important;
                border-color: var(--brand-primary) !important;
                transform: scale(1.02);
              }
            </style>
          `;

          // Close current modal and open confirmation after a small delay
          this.modal.close();

          setTimeout(() => {
            this.modal.show({
              title: "⚠️ Confirmar Destruição",
              content: confirmContent,
              closable: true,
              size: "small",
            });

            setTimeout(() => {
              const confirmBtn = document.getElementById("confirm-destroy");
              const cancelBtn = document.getElementById("cancel-destroy");

              if (confirmBtn) {
                confirmBtn.addEventListener("click", () => {
                  this.modal.close();

                  // Clear the plot
                  const plot = this.farmSystem.getPlot(index);
                  if (plot) {
                    // Cancel crop notification when destroying
                    this.notificationManager.cancelCropNotification(index);

                    plot.cropId = null;
                    plot.crop = null;
                    plot.plantedAt = null;
                    plot.fertilized = false;

                    notifications.success("Cultivo destruído!");
                    this.renderFarm();
                    this.topBar.update();
                  }
                });
              }

              if (cancelBtn) {
                cancelBtn.addEventListener("click", () => {
                  this.modal.close();
                });
              }
            }, 100);
          }, 350);
        });
      }
    }, 100);
  }

  /**
   * Clear weeds from plot
   * @param {number} index - Plot index
   */
  clearWeedsFromPlot(index) {
    // Check if player has hoe or rake
    const hasHoe = this.inventorySystem.hasItem("hoe");
    const hasRake = this.inventorySystem.hasItem("rake");

    if (!hasHoe && !hasRake) {
      notifications.error(i18n.t("farm.needWeedTool"));
      return;
    }

    // Get plot element for animation
    const plotElement = document.querySelector(
      `.farm-tile[data-index="${index}"]`,
    );

    // Clear the weeds
    const result = this.farmSystem.clearWeeds(index);

    if (result.success) {
      // Play weed removal animation
      if (!this.weedRemovalAnimation) {
        this.weedRemovalAnimation = new WeedRemovalAnimation();
      }
      if (plotElement) {
        this.weedRemovalAnimation.animate(plotElement);
      }

      // Show weed removal notification
      notifications.success("Ervas daninhas removidas! +1 Ervas 🌿");
      this.renderFarm();
    } else {
      notifications.error(result.error || "Não foi possível limpar as ervas");
    }
  }

  /**
   * Plant on a plot
   * @param {number} index - Plot index
   */
  plantPlot(index) {
    // Check if player has trowel
    if (!this.inventorySystem.hasItem("trowel")) {
      notifications.error(i18n.t("farm.needTrowel"));
      return;
    }

    // Get available seeds from inventory
    const seeds = this.inventorySystem.getItemsByCategory("seeds");

    if (seeds.length === 0) {
      notifications.error(i18n.t("farm.noSeeds"));
      return;
    }

    // Get player's farming level
    const farmingLevel = this.skillSystem.getLevel("farming");

    // Sort seeds by required level (lowest first)
    const sortedSeeds = seeds.sort((a, b) => {
      const cropIdA = a.id.replace("_seed", "");
      const cropIdB = b.id.replace("_seed", "");
      const cropDataA = this.farmSystem.getCropData(cropIdA);
      const cropDataB = this.farmSystem.getCropData(cropIdB);
      const levelA = cropDataA ? cropDataA.requiredLevel : 999;
      const levelB = cropDataB ? cropDataB.requiredLevel : 999;
      return levelA - levelB;
    });

    // Create seed selection content
    const seedsHTML = sortedSeeds
      .map((seed) => {
        const cropId = seed.id.replace("_seed", "");
        const cropData = this.farmSystem.getCropData(cropId);
        const growthTime = cropData ? cropData.growthTime : 0;
        const requiredLevel = cropData ? cropData.requiredLevel : 1;
        const canPlant = farmingLevel >= requiredLevel;

        return `
        <div class="seed-option ${!canPlant ? "seed-locked" : ""}" data-crop-id="${cropId}" data-seed-id="${seed.id}" data-can-plant="${canPlant}" style="
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          cursor: ${canPlant ? "pointer" : "not-allowed"};
          transition: all 0.2s;
          margin-bottom: 0.5rem;
          opacity: ${canPlant ? "1" : "0.5"};
          background: ${canPlant ? "transparent" : "rgba(128, 128, 128, 0.1)"};
        ">
          <div style="font-size: 2rem;">${seed.icon}</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: var(--text-primary);">${seed.namePtBR || seed.name}</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">
              ⏱️ ${growthTime}s | 📦 Quantidade: ${seed.count} | 🌟 Nível: ${requiredLevel}
            </div>
            ${!canPlant ? `<div style="font-size: 0.75rem; color: #ff6b6b; font-weight: 600; margin-top: 0.25rem;">🔒 Requer Farming Nível ${requiredLevel}</div>` : ""}
          </div>
        </div>
      `;
      })
      .join("");

    const content = `
      <div style="max-height: 400px; overflow-y: auto;">
        <p style="margin-bottom: 1rem; color: var(--text-secondary);">Escolha qual semente plantar:</p>
        ${seedsHTML}
      </div>
      <style>
        .seed-option:not(.seed-locked):hover {
          background: var(--accent-color);
          border-color: var(--primary-color);
          transform: translateX(4px);
        }
        .seed-locked {
          filter: grayscale(0.5);
        }
      </style>
    `;

    this.modal.show({
      title: "🌱 Escolher Semente",
      content: content,
      closable: true,
      size: "medium",
    });

    // Add click handlers to seed options
    setTimeout(() => {
      document.querySelectorAll(".seed-option").forEach((option) => {
        option.addEventListener("click", () => {
          const canPlant = option.dataset.canPlant === "true";

          // Ignore clicks on locked seeds
          if (!canPlant) {
            return;
          }

          const cropId = option.dataset.cropId;
          const seedId = option.dataset.seedId;

          // Close modal
          this.modal.close();

          // Plant the selected seed
          const result = this.farmSystem.plant(index, cropId);

          if (result.success) {
            // Play plant animation
            const plotElement = document.querySelector(
              `.farm-plot[data-index="${index}"]`,
            );
            if (plotElement && this.plantAnimation) {
              this.plantAnimation.animate(plotElement);
            }

            // Show planting notification with quantity, name and correct icon
            {
              const plantedCropData = this.farmSystem.getCropData(cropId);
              const cropName =
                i18n.getLanguage() === "pt-BR"
                  ? plantedCropData?.namePtBR || plantedCropData?.name || cropId
                  : plantedCropData?.name || cropId;
              const itemData = this.inventorySystem.getItemData(cropId);
              let iconHTML = itemData?.icon || plantedCropData?.icon || "";
              // Convert PNG path to img tag if needed
              if (iconHTML.includes(".png") || iconHTML.includes("assets/")) {
                iconHTML = `<img src="${iconHTML}" alt="${cropName}">`;
              }
              notifications.success(
                `${i18n.t("farm.planted")} +1x ${cropName}`,
                { icon: iconHTML },
              );
            }
            this.renderFarm();
            this.topBar.update();

            // Schedule notification for when crop is ready
            const plot = this.farmSystem.getPlot(index);
            if (plot && plot.crop && plot.plantedAt) {
              const cropData = this.farmSystem.getCropData(cropId);
              if (cropData) {
                // Consider fertilizer effect (50% reduction)
                const growthTime = plot.fertilized
                  ? cropData.growthTime * 0.5 * 1000
                  : cropData.growthTime * 1000;
                const readyAt = plot.plantedAt + growthTime;
                this.notificationManager.scheduleCropNotification(
                  index,
                  cropData.name,
                  readyAt,
                );
              }
            }

            // Update quest progress
            this.questSystem.handleGameEvent("plant", {
              cropId,
              amount: 1,
            });
          } else {
            notifications.error(result.error);
          }
        });
      });
    }, 100);
  }

  /**
   * Harvest a plot
   * @param {number} index - Plot index
   */
  harvestPlot(index) {
    const result = this.farmSystem.harvest(index);

    if (result.success) {
      // Cancel crop notification when harvesting
      this.notificationManager.cancelCropNotification(index);
      // Play harvest animation
      const plotElement = document.querySelector(
        `.farm-plot[data-index="${index}"]`,
      );
      if (plotElement && this.harvestAnimation) {
        this.harvestAnimation.animate(plotElement);
      }

      // Get crop display name
      const cropData = this.farmSystem.getCropData(result.crop);
      const cropName =
        i18n.getLanguage() === "pt-BR"
          ? cropData.namePtBR || cropData.name
          : cropData.name;

      const itemData = this.inventorySystem.getItemData(result.crop);
      let _iconHTML = itemData?.icon || cropData.icon || "";
      // Convert PNG path to img tag if needed
      if (_iconHTML.includes(".png") || _iconHTML.includes("assets/")) {
        _iconHTML = `<img src="${_iconHTML}" alt="${cropName}">`;
      }
      let message = `${i18n.t("farm.harvested")} +${result.amount}x ${cropName}`;

      if (result.levelUp) {
        notifications.levelUp(result.newLevel, i18n.t("skills.farming.name"));
      } else {
        notifications.success(message, { icon: _iconHTML });
      }

      this.renderFarm();
      this.topBar.update();

      // Update quest progress
      this.questSystem.handleGameEvent("harvest", {
        cropId: result.crop,
        amount: result.amount,
      });
    } else {
      notifications.error(result.error);
    }
  }

  /**
   * Update XP bar (FARMING XP na tela da fazenda)
   */
  updateXPBar() {
    const xpCurrent = document.getElementById("xp-current");
    const xpNeeded = document.getElementById("xp-needed");
    const xpBarFill = document.getElementById("xp-bar-fill");
    const playerNameText = document.getElementById("farm-player-name-text");
    const playerLevelText = document.getElementById("farm-player-level");

    if (!xpCurrent || !xpNeeded || !xpBarFill) return;

    // Update player name
    if (playerNameText) {
      playerNameText.textContent = this.player.data.name || "Fazendeiro";
    }

    // Update welcome message name
    const welcomePlayerName = document.getElementById("welcome-player-name");
    if (welcomePlayerName) {
      welcomePlayerName.textContent = this.player.data.name || "Fazendeiro";
    }

    // Pega XP de FARMING, não do player
    const farmingSkill = this.player.data.skills.farming;
    const level = farmingSkill.level;
    const currentXP = farmingSkill.xp;
    const nextLevelXP = this.skillSystem.xpTable[level] || 0;
    const currentLevelXP = this.skillSystem.xpTable[level - 1] || 0;

    const xpInLevel = currentXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    const percentage = Math.min(100, (xpInLevel / xpNeededForLevel) * 100);

    // Update player level
    if (playerLevelText) {
      playerLevelText.textContent = level;
    }

    xpCurrent.textContent = xpInLevel;
    xpNeeded.textContent = xpNeededForLevel;
    xpBarFill.style.width = `${percentage}%`;
  }

  /**
   * Format time in seconds to MM:SS
   * @param {number} seconds - Time in seconds
   * @returns {string}
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Attach global event listeners
   */
  attachEventListeners() {
    // Start game button
    const startGameBtn = document.getElementById("start-game-btn");
    if (startGameBtn) {
      startGameBtn.addEventListener("click", () => {
        const nameInput = document.getElementById("player-name");
        const playerName = nameInput?.value.trim();
        if (playerName) {
          this.startNewGame(playerName);
        }
      });
    }

    // Farm inventory button
    const farmInventoryBtn = document.getElementById("farm-inventory-btn");
    if (farmInventoryBtn) {
      farmInventoryBtn.addEventListener("click", () => {
        this.screenManager.showScreen("inventory-screen");
      });
    }

    // Auto-save event
    window.addEventListener("save:auto", () => {
      this.saveGame();
    });

    // Farm events
    window.addEventListener("farm:planted", () => {
      this.renderFarm();
    });

    window.addEventListener("farm:cropReady", () => {
      this.renderFarm();
    });

    window.addEventListener("farm:cropsReady", () => {
      this.renderFarm();
    });

    window.addEventListener("farm:harvested", () => {
      this.renderFarm();
    });

    window.addEventListener("farm:fertilized", (event) => {
      const plotIndex = event.detail?.index;

      // Trigger animation if on farm screen
      const farmScreen = document.getElementById("farm-screen");
      if (
        farmScreen &&
        farmScreen.classList.contains("active") &&
        plotIndex !== undefined
      ) {
        const plotElement = document.querySelector(
          `.farm-plot[data-index="${plotIndex}"]`,
        );
        if (plotElement && this.fertilizerAnimation) {
          this.fertilizerAnimation.animate(plotElement);
        }
      }

      this.renderFarm();
    });

    window.addEventListener("farm:cleared", () => {
      this.renderFarm();
    });

    // Farm update event (every second from FarmSystem)
    window.addEventListener("farm:update", () => {
      // Only update if we're on the farm screen
      const farmScreen = document.getElementById("farm-screen");
      if (farmScreen && farmScreen.classList.contains("active")) {
        this.updateFarmTiles();
      }
    });

    // Player events for city systems
    window.addEventListener("player:goldChanged", () => {
      this.topBar.update();
    });

    window.addEventListener("player:energyChanged", () => {
      this.topBar.update();
    });

    // Player data changed (NPCs, etc)
    window.addEventListener("player:dataChanged", () => {
      this.saveGame();
    });

    window.addEventListener("player:xpChanged", () => {
      this.topBar.update();
      this.updateXPBar();
    });

    window.addEventListener("player:skillXpChanged", (e) => {
      // Atualiza barra de XP se for farming
      if (e.detail.skill === "farming") {
        this.updateXPBar();
      }
    });

    // Settings events
    this.attachSettingsEvents();

    // Farm action buttons
    const plantAllBtn = document.getElementById("plant-all-btn");
    const harvestAllBtn = document.getElementById("harvest-all-btn");

    if (plantAllBtn) {
      plantAllBtn.addEventListener("click", () => this.plantAll());
    }

    if (harvestAllBtn) {
      harvestAllBtn.addEventListener("click", () => this.harvestAll());
    }

    // Screen refresh events
    window.addEventListener("screen:changed", (e) => {
      this.handleScreenChange(e.detail.screenId);
    });

    // Page visibility - sync notifications when app comes back to foreground
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.notificationManager?.isEnabled()) {
        console.log("📱 App voltou ao foco - sincronizando notificações...");

        // Check for pending notifications
        this.notificationManager.checkPendingNotifications().catch((error) => {
          console.error("❌ Erro ao verificar notificações:", error);
        });

        // Sync with current game state
        const plots = this.farmSystem.getPlots();
        const cropsData = this.farmSystem.getCropsData();
        this.notificationManager
          .syncNotifications(plots, cropsData)
          .catch((error) => {
            console.error("❌ Erro ao sincronizar notificações:", error);
          });
      }
    });

    // Focus event - additional check when window gets focus
    window.addEventListener("focus", () => {
      if (this.notificationManager?.isEnabled()) {
        console.log("🔍 Janela em foco - verificando notificações...");
        this.notificationManager.checkPendingNotifications().catch((error) => {
          console.error("❌ Erro ao verificar notificações:", error);
        });
      }
    });
  }

  /**
   * Attach settings events
   */
  attachSettingsEvents() {
    // Theme buttons
    const themeBtns = document.querySelectorAll(".theme-btn");
    themeBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.dataset.theme;
        this.changeTheme(theme);
      });
    });

    // Language buttons
    const langBtns = document.querySelectorAll(".lang-btn");
    langBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        this.changeLanguage(lang);
      });
    });

    // Reset button
    const resetBtn = document.getElementById("reset-game-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => this.resetGame());
    }

    // Save to file button
    const saveFileBtn = document.getElementById("save-file-btn");
    if (saveFileBtn) {
      saveFileBtn.addEventListener("click", () => this.saveToFile());
    }

    // Load from file button
    const loadFileBtn = document.getElementById("load-file-btn");
    if (loadFileBtn) {
      loadFileBtn.addEventListener("click", () => this.loadFromFile());
    }

    // Notification buttons
    const enableNotificationsBtn = document.getElementById(
      "enable-notifications-btn",
    );
    const testNotificationBtn = document.getElementById(
      "test-notification-btn",
    );

    if (enableNotificationsBtn) {
      enableNotificationsBtn.addEventListener("click", () =>
        this.toggleNotifications(),
      );
    }

    if (testNotificationBtn) {
      testNotificationBtn.addEventListener("click", () =>
        this.testNotification(),
      );
    }

    // Update notification UI
    this.updateNotificationUI();
  }

  /**
   * Toggle notifications on/off
   */
  async toggleNotifications() {
    if (this.notificationManager.isEnabled()) {
      // Disable
      this.notificationManager.disable();
      notifications.info(i18n.t("settings.notificationsDisabled"));
    } else {
      // Enable
      const granted = await this.notificationManager.enable();
      if (granted) {
        notifications.success(i18n.t("settings.notificationsEnabled"));

        // Update all crop notifications
        const plots = this.farmSystem.getPlots();
        const cropsData = await this.farmSystem.getCropsData();
        this.notificationManager.updateCropNotifications(plots, cropsData);
      } else {
        notifications.error(i18n.t("settings.notificationsBlocked"));
      }
    }

    this.updateNotificationUI();
  }

  /**
   * Test notification
   */
  async testNotification() {
    await this.notificationManager.testNotification();
  }

  /**
   * Update notification UI status
   */
  updateNotificationUI() {
    const enableBtn = document.getElementById("enable-notifications-btn");
    const testBtn = document.getElementById("test-notification-btn");
    const statusDiv = document.getElementById("notification-status");

    if (!enableBtn || !testBtn || !statusDiv) return;

    const isEnabled = this.notificationManager.isEnabled();
    const permission = this.notificationManager.permission;

    // Update button
    if (isEnabled) {
      enableBtn.textContent = i18n.t("settings.disableNotifications");
      enableBtn.classList.remove("btn-primary");
      enableBtn.classList.add("btn-secondary");
      // testBtn.style.display = "inline-block"; // Botão de teste oculto
    } else {
      enableBtn.textContent = i18n.t("settings.enableNotifications");
      enableBtn.classList.remove("btn-secondary");
      enableBtn.classList.add("btn-primary");
      testBtn.style.display = "none";
    }

    // Update status
    if (permission === "granted" && isEnabled) {
      // Get scheduled notifications count from Service Worker
      this.getScheduledNotificationsCount()
        .then((count) => {
          statusDiv.textContent = `✅ Notificações ativas (${count} agendadas)`;
          statusDiv.style.color = "var(--success)";
        })
        .catch(() => {
          statusDiv.textContent = `✅ Notificações ativas`;
          statusDiv.style.color = "var(--success)";
        });
    } else if (permission === "denied") {
      statusDiv.textContent = "❌ Bloqueadas pelo navegador";
      statusDiv.style.color = "var(--danger)";
    } else if (permission === "default") {
      statusDiv.textContent = "⚠️ Clique para permitir notificações";
      statusDiv.style.color = "var(--text-secondary)";
    } else {
      statusDiv.textContent = "";
      statusDiv.style.color = "var(--text-secondary)";
    }
  }

  /**
   * Get scheduled notifications count from Service Worker
   */
  async getScheduledNotificationsCount() {
    if (
      !this.notificationManager ||
      !this.notificationManager.serviceWorkerReady
    ) {
      return 0;
    }

    try {
      const result = await this.notificationManager.sendMessageToServiceWorker({
        type: "GET_SCHEDULED_NOTIFICATIONS",
      });
      return result.notifications ? result.notifications.length : 0;
    } catch (error) {
      console.error("❌ Erro ao obter contador de notificações:", error);
      return 0;
    }
  }

  /**
   * Change theme
   * @param {string} theme - Theme name
   */
  changeTheme(theme) {
    document.body.classList.remove("light-theme", "dark-theme");
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem("fazenda_theme", theme);

    // Update active button
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.theme === theme);
    });

    const themeName = theme === "dark" ? "Escuro" : "Claro";
    notifications.success(`Tema alterado para ${themeName}`);
  }

  /**
   * Change language
   * @param {string} lang - Language code
   */
  async changeLanguage(lang) {
    const success = await i18n.setLanguage(lang);

    if (success) {
      // Update active button
      document.querySelectorAll(".lang-btn").forEach((btn) => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
      });

      const langName = lang === "pt-BR" ? "Português" : "English";
      notifications.success(`Idioma alterado para ${langName}`);
    }
  }

  /**
   * Plant all empty plots
   */
  plantAll() {
    // Check if player has trowel
    if (!this.inventorySystem.hasItem("trowel")) {
      notifications.error(i18n.t("farm.needTrowel"));
      return;
    }

    // Get available seeds from inventory
    const seeds = this.inventorySystem.getItemsByCategory("seeds");

    if (seeds.length === 0) {
      notifications.error(i18n.t("farm.noSeeds"));
      return;
    }

    // Count empty plots without weeds
    const plots = this.farmSystem.getPlots();
    let emptyPlotsCount = 0;
    let plotsWithWeeds = 0;

    plots.forEach((plot, index) => {
      const hasWeeds = this.farmSystem.hasWeeds(index);

      if (!plot.crop) {
        if (hasWeeds) {
          plotsWithWeeds++;
        } else {
          emptyPlotsCount++;
        }
      }
    });

    // Check if there are plots with weeds
    if (plotsWithWeeds > 0 && emptyPlotsCount === 0) {
      notifications.error(i18n.t("farm.allPlotsHaveWeeds"));
      return;
    }

    if (plotsWithWeeds > 0) {
      notifications.warning(
        `${plotsWithWeeds} ${i18n.t("farm.someHaveWeeds")}`,
      );
    }

    if (emptyPlotsCount === 0) {
      notifications.info(i18n.t("farm.noEmptyPlotsAvailable"));
      return;
    }

    // Get player's farming level
    const farmingLevel = this.skillSystem.getLevel("farming");

    // Sort seeds by required level (lowest first)
    const sortedSeeds = seeds.sort((a, b) => {
      const cropIdA = a.id.replace("_seed", "");
      const cropIdB = b.id.replace("_seed", "");
      const cropDataA = this.farmSystem.getCropData(cropIdA);
      const cropDataB = this.farmSystem.getCropData(cropIdB);
      const levelA = cropDataA ? cropDataA.requiredLevel : 999;
      const levelB = cropDataB ? cropDataB.requiredLevel : 999;
      return levelA - levelB;
    });

    // Create seed selection content
    const seedsHTML = sortedSeeds
      .map((seed) => {
        const cropId = seed.id.replace("_seed", "");
        const cropData = this.farmSystem.getCropData(cropId);
        const growthTime = cropData ? cropData.growthTime : 0;
        const requiredLevel = cropData ? cropData.requiredLevel : 1;
        const canPlant = farmingLevel >= requiredLevel;

        return `
        <div class="seed-option ${!canPlant ? "seed-locked" : ""}" data-crop-id="${cropId}" data-seed-id="${seed.id}" data-can-plant="${canPlant}" style="
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          cursor: ${canPlant ? "pointer" : "not-allowed"};
          transition: all 0.2s;
          margin-bottom: 0.5rem;
          opacity: ${canPlant ? "1" : "0.5"};
          background: ${canPlant ? "transparent" : "rgba(128, 128, 128, 0.1)"};
        ">
          <div style="font-size: 2rem;">${seed.icon}</div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: var(--text-primary);">${seed.namePtBR || seed.name}</div>
            <div style="font-size: 0.875rem; color: var(--text-secondary);">
              ⏱️ ${growthTime}s | 📦 Quantidade: ${seed.count} | 🌟 Nível: ${requiredLevel}
            </div>
            ${!canPlant ? `<div style="font-size: 0.75rem; color: #ff6b6b; font-weight: 600; margin-top: 0.25rem;">🔒 Requer Farming Nível ${requiredLevel}</div>` : ""}
          </div>
        </div>
      `;
      })
      .join("");

    const content = `
      <div style="max-height: 400px; overflow-y: auto;">
        <div style="background: var(--bg-accent); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem; border-left: 4px solid var(--brand-primary);">
          <p style="margin: 0; color: var(--text-primary); font-weight: 600;">
            🌾 ${emptyPlotsCount} plot(s) vazio(s) será(ão) plantado(s)
          </p>
        </div>
        <p style="margin-bottom: 1rem; color: var(--text-secondary);">Escolha qual semente plantar:</p>
        ${seedsHTML}
      </div>
      <style>
        .seed-option:not(.seed-locked):hover {
          background: var(--accent-color);
          border-color: var(--primary-color);
          transform: translateX(4px);
        }
        .seed-locked {
          filter: grayscale(0.5);
        }
      </style>
    `;

    this.modal.show({
      title: "🌱 Plantar Tudo - Escolher Semente",
      content: content,
      closable: true,
      size: "medium",
    });

    // Add click handlers to seed options
    setTimeout(() => {
      document.querySelectorAll(".seed-option").forEach((option) => {
        option.addEventListener("click", () => {
          const canPlant = option.dataset.canPlant === "true";

          // Ignore clicks on locked seeds
          if (!canPlant) {
            return;
          }

          const cropId = option.dataset.cropId;

          // Close modal
          this.modal.close();

          // DO PLANT IMMEDIATELY (to prevent double-clicking)
          const result = this.farmSystem.plantAll(cropId);

          if (!result.success) {
            notifications.error(result.errors || "Não foi possível plantar");
            return;
          }

          // Show notification (include quantity, crop name and correct icon)
          {
            const cropData = this.farmSystem.getCropData(cropId);
            const cropName =
              i18n.getLanguage() === "pt-BR"
                ? cropData?.namePtBR || cropData?.name || cropId
                : cropData?.name || cropId;
            const itemData = this.inventorySystem.getItemData(cropId);
            let iconHTML = itemData?.icon || cropData?.icon || "";
            // Convert PNG path to img tag if needed
            if (iconHTML.includes(".png") || iconHTML.includes("assets/")) {
              iconHTML = `<img src="${iconHTML}" alt="${cropName}">`;
            }
            notifications.success(
              `${i18n.t("farm.planted")} +${result.planted}x ${cropName}`,
              { icon: iconHTML },
            );
          }

          // Play animations on the DOM elements (they still exist)
          if (this.plantAnimation && result.plantedIndices.length > 0) {
            result.plantedIndices.forEach((index, i) => {
              const plotElement = document.querySelector(
                `.farm-plot[data-index="${index}"]`,
              );
              if (plotElement) {
                // Stagger animations slightly for visual effect
                setTimeout(() => {
                  this.plantAnimation.animate(plotElement);
                }, i * 80);
              }
            });
          }

          // Calculate delay: last animation start time + animation duration
          const animationDelay = result.plantedIndices.length * 80 + 1000;

          // RENDER UI AFTER animations complete
          setTimeout(() => {
            this.renderFarm();
            this.topBar.update();
          }, animationDelay);

          // Update quest progress
          this.questSystem.handleGameEvent("plant", {
            cropId,
            amount: result.planted,
          });
        });
      });
    }, 100);
  }

  /**
   * Harvest all ready crops
   */
  harvestAll() {
    // Collect all ready plot indices before harvesting
    const readyPlots = [];
    const plots = this.farmSystem.getPlots();
    for (let i = 0; i < plots.length; i++) {
      if (this.farmSystem.isPlotReady(i)) {
        readyPlots.push(i);
      }
    }

    // Check if there are plots to harvest
    if (readyPlots.length === 0) {
      notifications.info(i18n.t("farm.noCropsReady"));
      return;
    }

    // DO HARVEST IMMEDIATELY (to prevent double-clicking)
    const result = this.farmSystem.harvestAll();

    if (!result.success) {
      return;
    }

    // Show notification with per-crop breakdown and icons (like PlantAll)
    {
      const itemsArray = Object.entries(result.items || {});
      if (itemsArray.length === 1) {
        // Single crop type - show simple message with icon
        const [cropId, amount] = itemsArray[0];
        const cropData = this.farmSystem.getCropData(cropId);
        const cropName =
          i18n.getLanguage() === "pt-BR"
            ? cropData?.namePtBR || cropData?.name || cropId
            : cropData?.name || cropId;
        const itemData = this.inventorySystem.getItemData(cropId);
        let iconHTML = itemData?.icon || cropData?.icon || "";
        // Convert PNG path to img tag if needed
        if (iconHTML.includes(".png") || iconHTML.includes("assets/")) {
          iconHTML = `<img src="${iconHTML}" alt="${cropName}">`;
        }
        notifications.success(
          `${i18n.t("farm.harvested")} +${amount}x ${cropName}`,
          { icon: iconHTML },
        );
      } else if (itemsArray.length > 1) {
        // Multiple crop types - show with count and first crop icon
        const [firstCropId] = itemsArray[0];
        const firstCropData = this.farmSystem.getCropData(firstCropId);
        const firstItemData = this.inventorySystem.getItemData(firstCropId);
        let firstIcon = firstItemData?.icon || firstCropData?.icon || "";
        if (firstIcon.includes(".png") || firstIcon.includes("assets/")) {
          firstIcon = `<img src="${firstIcon}" alt="Colheita">`;
        }
        notifications.success(
          i18n.t("notifications.harvestedMultiple", {
            count: result.harvested,
          }),
          { icon: firstIcon },
        );
      } else {
        // Fallback
        notifications.success(
          i18n.t("notifications.harvestedMultiple", {
            count: result.harvested,
          }),
        );
      }
    }

    // Play animations on the DOM elements (they still exist)
    if (this.harvestAnimation) {
      readyPlots.forEach((index, i) => {
        const plotElement = document.querySelector(
          `.farm-plot[data-index="${index}"]`,
        );
        if (plotElement) {
          // Stagger animations slightly for visual effect
          setTimeout(() => {
            this.harvestAnimation.animate(plotElement);
          }, i * 100);
        }
      });
    }

    // Calculate delay: last animation start time + animation duration
    const animationDelay = readyPlots.length * 100 + 1300;

    // RENDER UI AFTER animations complete
    setTimeout(() => {
      this.renderFarm();
      this.topBar.update();
    }, animationDelay);
  }

  /**
   * Handle screen change
   * @param {string} screenId - Screen ID
   */
  handleScreenChange(screenId) {
    switch (screenId) {
      case "farm-screen":
        this.renderFarm();
        break;
      case "skills-screen":
        this.renderSkills();
        break;
      case "inventory-screen":
        this.renderInventory();
        break;
      case "quests-screen":
        this.renderQuests();
        break;
      case "npcs-screen":
        this.renderNPCs();
        break;
      case "market-screen":
        this.renderMarket();
        break;
      case "city-screen":
        this.renderCity();
        break;
    }
  }

  /**
   * Render skills screen
   */
  renderSkills() {
    const skillsGrid = document.getElementById("skills-grid");
    if (!skillsGrid) return;

    skillsGrid.innerHTML = "";

    const skills = this.skillSystem.getAllSkillStats();

    skills.forEach((skill) => {
      const card = this.createSkillCard(skill);
      skillsGrid.appendChild(card);
    });
  }

  /**
   * Create skill card
   * @param {Object} skill - Skill data
   * @returns {HTMLElement}
   */
  createSkillCard(skill) {
    const card = document.createElement("div");
    card.className = "skill-card";

    // Add disabled class for skills other than farming
    if (skill.id !== "farming") {
      card.classList.add("disabled");
    }

    card.dataset.skill = skill.id;
    card.style.setProperty("--skill-color", skill.color);
    card.style.setProperty("--skill-color-light", skill.colorLight);

    const isMaxLevel = skill.level >= 99;

    card.innerHTML = `
            <div class="skill-header">
                <div class="skill-icon">${skill.icon}</div>
                <div class="skill-info">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-level">
                        <span class="skill-level-label">Level</span>
                        ${skill.level}
                    </div>
                </div>
            </div>
            <div class="skill-progress-container">
                <div class="skill-progress-bar" data-progress="${isMaxLevel ? "MAX" : Math.floor(skill.progress) + "%"}">
                    <div class="skill-progress-fill" style="width: ${skill.progress}%">
                    </div>
                </div>
                <div class="skill-progress-text">
                    <span>${skill.xp.toLocaleString()} ${i18n.t("skills.xp")}</span>
                    <span>${isMaxLevel ? "MAX" : skill.xpForNext.toLocaleString() + " " + i18n.t("skills.xp")}</span>
                </div>
            </div>
        `;

    return card;
  }

  /**
   * Render inventory screen
   */
  renderInventory() {
    if (this.inventoryUI) {
      this.inventoryUI.render();
    }
  }

  /**
   * Render quests screen
   */
  renderQuests() {
    const questsList = document.getElementById("quests-list");
    if (!questsList) return;

    questsList.innerHTML = "";

    const activeQuests = this.questSystem.getActiveQuests();
    const availableQuests = this.questSystem.getAvailableQuests();

    if (activeQuests.length === 0 && availableQuests.length === 0) {
      questsList.innerHTML = '<p class="text-center">No quests available</p>';
      return;
    }

    // Render active quests
    if (activeQuests.length > 0) {
      const heading = document.createElement("h3");
      heading.textContent = "Active Quests";
      questsList.appendChild(heading);

      activeQuests.forEach((quest) => {
        const questEl = this.createQuestElement(quest, true);
        questsList.appendChild(questEl);
      });
    }

    // Render available quests
    if (availableQuests.length > 0) {
      const heading = document.createElement("h3");
      heading.textContent = "Available Quests";
      heading.style.marginTop = "20px";
      questsList.appendChild(heading);

      availableQuests.forEach((quest) => {
        const questEl = this.createQuestElement(quest, false);
        questsList.appendChild(questEl);
      });
    }
  }

  /**
   * Create quest element
   * @param {Object} quest - Quest data
   * @param {boolean} isActive - Is quest active
   * @returns {HTMLElement}
   */
  createQuestElement(quest, isActive) {
    const questEl = document.createElement("div");
    questEl.className = "quest-item";

    const progress = isActive ? this.questSystem.getQuestProgress(quest.id) : 0;

    questEl.innerHTML = `
            <div class="quest-header">
                <div class="quest-title">${quest.name}</div>
                ${quest.rewards?.gold ? `<div class="quest-reward">${quest.rewards.gold} Gold</div>` : ""}
            </div>
            <div class="quest-description">${quest.description}</div>
            ${
              isActive
                ? `
                <div class="quest-progress">
                    <div class="quest-progress-bar" style="width: ${progress}%"></div>
                </div>
            `
                : ""
            }
        `;

    return questEl;
  }

  /**
   * Render NPCs screen
   */
  renderNPCs() {
    if (this.npcsUI) {
      this.npcsUI.render();
    }
  }

  /**
   * Render market screen
   */
  renderMarket() {
    if (this.marketUI) {
      this.marketUI.render();
    }
  }

  /**
   * Render city screen
   */
  renderCity() {
    if (this.cityUI) {
      this.cityUI.refresh();
    }
  }

  /**
   * Show loading overlay
   * @param {boolean} show - Show or hide
   */
  showLoading(show) {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) {
      if (show) {
        overlay.classList.add("active");
      } else {
        overlay.classList.remove("active");
      }
    }
  }

  /**
   * Clean up and destroy game engine
   */
  destroy() {
    this.stop();

    if (this.topBar) this.topBar.destroy();
    if (this.sideMenu) this.sideMenu.destroy();
    if (this.screenManager) this.screenManager.destroy();

    this.initialized = false;
    console.log("🗑️ Game engine destroyed");
  }
}
