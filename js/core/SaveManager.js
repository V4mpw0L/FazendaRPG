/**
 * FazendaRPG - Save Manager
 * Handles saving and loading game data with automatic backups and fallbacks
 * @version 0.0.15
 */

import {
  safeJSONParse,
  safeJSONStringify,
  downloadFile,
  loadFile,
} from "../utils/helpers.js";

export default class SaveManager {
  constructor() {
    this.saveKey = "fazendarpg_save";
    this.backupKey = "fazendarpg_save_backup";
    this.autoSaveInterval = 60000; // 60 seconds
    this.autoSaveTimer = null;
    this.lastSaveTime = 0;
    this.currentVersion = "0.0.15";
  }

  /**
   * Initialize auto-save system
   */
  startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }

    this.autoSaveTimer = setInterval(() => {
      this.autoSave();
    }, this.autoSaveInterval);

    console.log("💾 Auto-save enabled (every 60s)");
  }

  /**
   * Stop auto-save system
   */
  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
      console.log("💾 Auto-save disabled");
    }
  }

  /**
   * Auto-save (called by interval)
   */
  autoSave() {
    const event = new CustomEvent("save:auto");
    window.dispatchEvent(event);
  }

  /**
   * Save game data to localStorage
   * @param {Object} data - Game data to save
   * @returns {boolean} Success
   */
  save(data) {
    if (!data || typeof data !== "object") {
      console.error("❌ Invalid save data");
      return false;
    }

    try {
      // Add metadata
      const saveData = {
        ...data,
        savedAt: Date.now(),
        version: this.currentVersion,
      };

      const jsonData = safeJSONStringify(saveData);

      // Create backup of current save
      const currentSave = localStorage.getItem(this.saveKey);
      if (currentSave) {
        localStorage.setItem(this.backupKey, currentSave);
      }

      // Save new data
      localStorage.setItem(this.saveKey, jsonData);
      this.lastSaveTime = Date.now();

      console.log("✅ Game saved successfully");

      // Dispatch save event
      window.dispatchEvent(
        new CustomEvent("save:complete", {
          detail: { timestamp: this.lastSaveTime },
        }),
      );

      return true;
    } catch (error) {
      console.error("❌ Failed to save game:", error);

      // Check if quota exceeded
      if (error.name === "QuotaExceededError") {
        console.error("💾 Storage quota exceeded!");
        this.handleQuotaExceeded();
      }

      return false;
    }
  }

  /**
   * Load game data from localStorage
   * @returns {Object|null} Loaded data or null
   */
  load() {
    try {
      const jsonData = localStorage.getItem(this.saveKey);

      if (!jsonData) {
        console.log("📭 No save data found");
        return null;
      }

      const data = safeJSONParse(jsonData);

      if (!data) {
        console.warn("⚠️ Corrupted save data, trying backup...");
        return this.loadBackup();
      }

      // Validate save data
      if (!this.validateSaveData(data)) {
        console.warn("⚠️ Invalid save data, trying backup...");
        return this.loadBackup();
      }

      // Migrate old saves if needed
      const migratedData = this.migrateSaveData(data);

      console.log("✅ Game loaded successfully");
      return migratedData;
    } catch (error) {
      console.error("❌ Failed to load game:", error);
      return this.loadBackup();
    }
  }

  /**
   * Load backup save data
   * @returns {Object|null} Backup data or null
   */
  loadBackup() {
    try {
      const jsonData = localStorage.getItem(this.backupKey);

      if (!jsonData) {
        console.log("📭 No backup data found");
        return null;
      }

      const data = safeJSONParse(jsonData);

      if (!data || !this.validateSaveData(data)) {
        console.error("❌ Backup data is also invalid");
        return null;
      }

      console.log("✅ Backup loaded successfully");

      // Restore backup as main save
      localStorage.setItem(this.saveKey, jsonData);

      // Migrate old saves if needed
      return this.migrateSaveData(data);
    } catch (error) {
      console.error("❌ Failed to load backup:", error);
      return null;
    }
  }

  /**
   * Validate save data structure
   * @param {Object} data - Data to validate
   * @returns {boolean} True if valid
   */
  validateSaveData(data) {
    if (!data || typeof data !== "object") {
      console.warn("⚠️ Save data is not an object");
      return false;
    }

    // Check required properties
    const requiredProps = ["player", "version"];

    for (const prop of requiredProps) {
      if (!(prop in data)) {
        console.warn(`⚠️ Missing required property: ${prop}`);
        return false;
      }
    }

    // Validate player data
    if (!data.player || typeof data.player !== "object") {
      console.warn("⚠️ Invalid player data");
      return false;
    }

    // Check if player has required properties
    const requiredPlayerProps = [
      "name",
      "level",
      "xp",
      "gold",
      "energy",
      "skills",
      "inventory",
      "farm",
    ];

    for (const prop of requiredPlayerProps) {
      if (!(prop in data.player)) {
        console.warn(`⚠️ Missing required player property: ${prop}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Migrate old save data to current version
   * @param {Object} data - Data to migrate
   * @returns {Object} Migrated data
   */
  migrateSaveData(data) {
    const migratedData = { ...data };

    // Add savedAt if it doesn't exist (for old exports with exportedAt)
    if (!migratedData.savedAt && migratedData.exportedAt) {
      migratedData.savedAt = migratedData.exportedAt;
      console.log("🔄 Migrated: exportedAt -> savedAt");
    }

    // Ensure savedAt exists
    if (!migratedData.savedAt) {
      migratedData.savedAt = Date.now();
    }

    // Update version
    if (migratedData.version !== this.currentVersion) {
      console.log(
        `🔄 Migrating save from v${migratedData.version} to v${this.currentVersion}`,
      );
      migratedData.version = this.currentVersion;
    }

    return migratedData;
  }

  /**
   * Check if save data exists
   * @returns {boolean} True if save exists
   */
  hasSave() {
    return localStorage.getItem(this.saveKey) !== null;
  }

  /**
   * Delete save data
   * @param {boolean} includeBackup - Also delete backup
   * @returns {boolean} Success
   */
  deleteSave(includeBackup = false) {
    try {
      localStorage.removeItem(this.saveKey);

      if (includeBackup) {
        localStorage.removeItem(this.backupKey);
      }

      console.log("🗑️ Save data deleted");

      // Dispatch delete event
      window.dispatchEvent(new CustomEvent("save:deleted"));

      return true;
    } catch (error) {
      console.error("❌ Failed to delete save:", error);
      return false;
    }
  }

  /**
   * Save game to file (download)
   * @param {Object} data - Data to save
   * @returns {boolean} Success
   */
  saveToFile(data) {
    try {
      // Create complete save data
      const saveData = {
        ...data,
        savedAt: Date.now(),
        version: this.currentVersion,
        exportType: "file",
      };

      // Validate before saving
      if (!this.validateSaveData(saveData)) {
        console.error("❌ Cannot save invalid data to file");
        return false;
      }

      const jsonData = JSON.stringify(saveData, null, 2);
      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, -5);
      const playerName = saveData.player?.name || "player";
      const filename = `FazendaRPG_${playerName}_${timestamp}.json`;

      downloadFile(jsonData, filename, "application/json");

      console.log("📦 Save file created successfully");
      return true;
    } catch (error) {
      console.error("❌ Failed to save to file:", error);
      return false;
    }
  }

  /**
   * Load game from file
   * @returns {Promise<Object|null>} Loaded data or null
   */
  async loadFromFile() {
    try {
      const fileContent = await loadFile(".json");

      if (!fileContent) {
        throw new Error("Empty file");
      }

      const data = safeJSONParse(fileContent);

      if (!data) {
        throw new Error("Invalid JSON file");
      }

      // Validate save data
      if (!this.validateSaveData(data)) {
        throw new Error("Invalid save file format - missing required data");
      }

      // Migrate if needed
      const migratedData = this.migrateSaveData(data);

      console.log("📥 Save file loaded successfully");
      return migratedData;
    } catch (error) {
      console.error("❌ Failed to load from file:", error);

      // Provide more specific error message
      if (error.message.includes("JSON")) {
        console.error("   File is not valid JSON format");
      } else if (error.message.includes("format")) {
        console.error("   File is missing required game data");
      }

      return null;
    }
  }

  /**
   * Handle storage quota exceeded
   */
  handleQuotaExceeded() {
    console.warn("⚠️ Attempting to free up storage space...");

    try {
      // Remove old backups
      localStorage.removeItem(this.backupKey);

      // Try to save again
      console.log("🔄 Retrying save after cleanup...");
    } catch (error) {
      console.error("❌ Failed to free up space:", error);

      // Notify user
      window.dispatchEvent(new CustomEvent("save:quotaExceeded"));
    }
  }

  /**
   * Get save data size in bytes
   * @returns {number} Size in bytes
   */
  getSaveSize() {
    const save = localStorage.getItem(this.saveKey);
    return save ? new Blob([save]).size : 0;
  }

  /**
   * Get save data info
   * @returns {Object|null} Save info or null
   */
  getSaveInfo() {
    const jsonData = localStorage.getItem(this.saveKey);
    if (!jsonData) return null;

    const data = safeJSONParse(jsonData);
    if (!data) return null;

    return {
      savedAt: data.savedAt,
      version: data.version,
      playerName: data.player?.name || "Unknown",
      playerLevel: data.player?.level || 1,
      size: this.getSaveSize(),
    };
  }

  /**
   * Get time since last save
   * @returns {number} Seconds since last save
   */
  getTimeSinceLastSave() {
    if (!this.lastSaveTime) {
      const info = this.getSaveInfo();
      if (info) {
        this.lastSaveTime = info.savedAt;
      }
    }

    if (!this.lastSaveTime) return 0;

    return Math.floor((Date.now() - this.lastSaveTime) / 1000);
  }

  /**
   * Clear all save data (including backups and settings)
   */
  clearAll() {
    try {
      // Get all keys
      const keys = Object.keys(localStorage);

      // Remove all FazendaRPG related keys
      keys.forEach((key) => {
        if (key.startsWith("fazenda")) {
          localStorage.removeItem(key);
        }
      });

      console.log("🗑️ All save data cleared");

      // Dispatch event
      window.dispatchEvent(new CustomEvent("save:cleared"));

      return true;
    } catch (error) {
      console.error("❌ Failed to clear data:", error);
      return false;
    }
  }

  /**
   * Get storage usage info
   * @returns {Object} Storage info
   */
  getStorageInfo() {
    let totalSize = 0;
    const items = {};

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = new Blob([localStorage.getItem(key)]).size;
        totalSize += size;
        if (key.startsWith("fazenda")) {
          items[key] = size;
        }
      }
    }

    return {
      totalSize,
      items,
      available: 5 * 1024 * 1024 - totalSize, // Assume 5MB limit
    };
  }

  /**
   * Create a save snapshot
   * @param {Object} data - Data to snapshot
   * @param {string} name - Snapshot name
   * @returns {boolean} Success
   */
  createSnapshot(data, name = "manual") {
    try {
      const snapshotKey = `${this.saveKey}_snapshot_${name}_${Date.now()}`;
      const jsonData = safeJSONStringify(data);

      localStorage.setItem(snapshotKey, jsonData);

      console.log(`📸 Snapshot created: ${name}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to create snapshot:", error);
      return false;
    }
  }

  /**
   * List all snapshots
   * @returns {Array} List of snapshots
   */
  listSnapshots() {
    const snapshots = [];
    const prefix = `${this.saveKey}_snapshot_`;

    for (let key in localStorage) {
      if (key.startsWith(prefix)) {
        const data = safeJSONParse(localStorage.getItem(key));
        if (data) {
          snapshots.push({
            key,
            name: key.replace(prefix, "").split("_")[0],
            timestamp: parseInt(key.split("_").pop()),
            playerName: data.player?.name || "Unknown",
            playerLevel: data.player?.level || 1,
          });
        }
      }
    }

    return snapshots.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Delete a snapshot
   * @param {string} key - Snapshot key
   * @returns {boolean} Success
   */
  deleteSnapshot(key) {
    try {
      localStorage.removeItem(key);
      console.log("🗑️ Snapshot deleted");
      return true;
    } catch (error) {
      console.error("❌ Failed to delete snapshot:", error);
      return false;
    }
  }

  /**
   * Export complete game state for debugging
   * @returns {Object} Complete state
   */
  exportCompleteState() {
    return {
      save: this.load(),
      backup: safeJSONParse(localStorage.getItem(this.backupKey)),
      info: this.getSaveInfo(),
      storage: this.getStorageInfo(),
      snapshots: this.listSnapshots(),
    };
  }

  /**
   * Verify save integrity
   * @param {Object} data - Data to verify
   * @returns {Object} Verification result
   */
  verifySaveIntegrity(data) {
    const result = {
      valid: true,
      errors: [],
      warnings: [],
    };

    // Basic validation
    if (!this.validateSaveData(data)) {
      result.valid = false;
      result.errors.push("Basic validation failed");
      return result;
    }

    // Check player data completeness
    const player = data.player;

    if (!player.name || player.name.trim() === "") {
      result.errors.push("Player has no name");
      result.valid = false;
    }

    if (typeof player.level !== "number" || player.level < 1) {
      result.errors.push("Invalid player level");
      result.valid = false;
    }

    if (typeof player.xp !== "number" || player.xp < 0) {
      result.errors.push("Invalid player XP");
      result.valid = false;
    }

    if (!player.skills || typeof player.skills !== "object") {
      result.errors.push("Missing or invalid skills data");
      result.valid = false;
    }

    if (!player.inventory || typeof player.inventory !== "object") {
      result.errors.push("Missing or invalid inventory data");
      result.valid = false;
    }

    if (!player.farm || !Array.isArray(player.farm.plots)) {
      result.errors.push("Missing or invalid farm data");
      result.valid = false;
    }

    // Warnings
    if (!data.savedAt) {
      result.warnings.push("Save has no timestamp");
    }

    if (data.version !== this.currentVersion) {
      result.warnings.push(
        `Save version mismatch: ${data.version} vs ${this.currentVersion}`,
      );
    }

    return result;
  }
}
