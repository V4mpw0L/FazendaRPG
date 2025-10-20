/**
 * FazendaRPG - Player Class
 * Manages player data, stats, skills, inventory, and progression
 * @version 0.0.5
 */

import {
  clamp,
  calculateLevelFromXP,
  calculateXPForLevel,
} from "../utils/helpers.js";

export default class Player {
  constructor() {
    this.data = this.getDefaultData();
  }

  /**
   * Get default player data structure
   * @returns {Object} Default player data
   */
  getDefaultData() {
    return {
      // Basic Info
      name: "",
      createdAt: Date.now(),
      lastSaved: Date.now(),
      playTime: 0, // in seconds

      // Stats
      level: 1,
      xp: 0,
      gold: 100,
      energy: 100,
      maxEnergy: 100,

      // Skills (RuneScape style)
      skills: {
        farming: { level: 1, xp: 0 },
        mining: { level: 1, xp: 0 },
        fishing: { level: 1, xp: 0 },
        cooking: { level: 1, xp: 0 },
        woodcutting: { level: 1, xp: 0 },
        crafting: { level: 1, xp: 0 },
        smithing: { level: 1, xp: 0 },
        foraging: { level: 1, xp: 0 },
      },

      // Inventory
      inventory: {},

      // Farm
      farm: {
        plots: Array(9)
          .fill(null)
          .map(() => ({
            crop: null,
            plantedAt: null,
            fertilized: false,
          })),
      },

      // Quests
      quests: {
        active: [],
        completed: [],
        progress: {},
      },

      // NPCs
      npcs: {},

      // City Systems
      bank: {
        balance: 0,
        transactions: [],
      },

      tavern: {
        reputation: 0,
        mealsEaten: 0,
        storiesHeard: 0,
        lastVisit: null,
      },

      // Achievements
      achievements: [],

      // Settings
      settings: {
        theme: "light",
        language: "pt-BR",
        soundEnabled: true,
        musicEnabled: true,
        notificationsEnabled: true,
      },

      // Statistics
      stats: {
        totalCropsPlanted: 0,
        totalCropsHarvested: 0,
        totalFishCaught: 0,
        totalTreesChopped: 0,
        totalOresMined: 0,
        totalMealCooked: 0,
        totalItemsCrafted: 0,
        totalGoldEarned: 0,
        totalGoldSpent: 0,
        totalQuestsCompleted: 0,
      },
    };
  }

  /**
   * Initialize player with name
   * @param {string} name - Player name
   */
  initialize(name) {
    this.data.name = name;
    this.data.createdAt = Date.now();
    this.data.lastSaved = Date.now();

    // Give starting items
    this.addItem("wheat_seed", 10);
    this.addItem("fertilizer", 3);
  }

  /**
   * Load player data
   * @param {Object} data - Saved player data
   * @returns {boolean} Success
   */
  load(data) {
    if (!data || typeof data !== "object") {
      console.error("❌ Invalid player data");
      return false;
    }

    try {
      // Merge with defaults to ensure all properties exist
      this.data = this.mergeWithDefaults(data);

      // Validate player name exists
      if (!this.data.name || this.data.name.trim() === "") {
        console.error("❌ Save has no valid player name");
        return false;
      }

      console.log("✅ Player data loaded:", this.data.name);
      return true;
    } catch (error) {
      console.error("❌ Failed to load player data:", error);
      return false;
    }
  }

  /**
   * Merge loaded data with defaults
   * @param {Object} loadedData - Loaded data
   * @returns {Object} Merged data
   */
  mergeWithDefaults(loadedData) {
    const defaults = this.getDefaultData();
    const merged = { ...defaults };

    // First copy all defaults
    Object.keys(defaults).forEach((key) => {
      if (
        typeof defaults[key] === "object" &&
        !Array.isArray(defaults[key]) &&
        defaults[key] !== null
      ) {
        merged[key] = { ...defaults[key] };
      } else {
        merged[key] = defaults[key];
      }
    });

    // Then override with loaded data
    Object.keys(loadedData).forEach((key) => {
      if (key in defaults) {
        if (
          typeof defaults[key] === "object" &&
          !Array.isArray(defaults[key]) &&
          defaults[key] !== null
        ) {
          merged[key] = { ...defaults[key], ...loadedData[key] };
        } else {
          merged[key] = loadedData[key];
        }
      }
    });

    // Ensure all skills exist
    Object.keys(defaults.skills).forEach((skill) => {
      if (!merged.skills[skill]) {
        merged.skills[skill] = { level: 1, xp: 0 };
      }
    });

    // Migrate old saves: Calculate correct maxEnergy based on levels
    merged.maxEnergy = this.calculateMaxEnergy(merged.level, merged.skills);

    return merged;
  }

  /**
   * Calculate max energy based on player level and skill levels
   * Base: 100 + (playerLevel - 1) * 5 + sum of (skillLevel - 1) * 5 for all skills
   * @param {number} playerLevel - Player's main level
   * @param {Object} skills - Player's skills object
   * @returns {number} Calculated max energy
   */
  calculateMaxEnergy(playerLevel, skills) {
    // Start with base energy
    let maxEnergy = 100;

    // Add 5 for each player level beyond 1
    maxEnergy += (playerLevel - 1) * 5;

    // Add 5 for each skill level beyond 1
    Object.values(skills).forEach((skill) => {
      maxEnergy += (skill.level - 1) * 5;
    });

    return maxEnergy;
  }

  /**
   * Get player data for saving
   * @returns {Object} Player data
   */
  getData() {
    this.data.lastSaved = Date.now();
    return this.data;
  }

  /**
   * Add XP to player level
   * @param {number} amount - XP amount
   * @returns {boolean} True if leveled up
   */
  addXP(amount) {
    if (amount <= 0) return false;

    const oldLevel = this.data.level;
    this.data.xp += amount;

    // Dispatch XP changed event
    window.dispatchEvent(
      new CustomEvent("player:xpChanged", {
        detail: { xp: this.data.xp, level: this.data.level },
      }),
    );

    // Calculate new level
    const newLevel = calculateLevelFromXP(this.data.xp);

    if (newLevel > oldLevel) {
      this.data.level = newLevel;
      this.onLevelUp(newLevel);
      return true;
    }

    return false;
  }

  /**
   * Get XP required for next level
   * @returns {number} XP needed
   */
  getXPForNextLevel() {
    const nextLevel = this.data.level + 1;
    return calculateXPForLevel(nextLevel);
  }

  /**
   * Add XP to a skill
   * @param {string} skill - Skill name
   * @param {number} amount - XP amount
   * @returns {boolean} True if leveled up
   */
  addSkillXP(skill, amount) {
    if (!this.data.skills[skill] || amount <= 0) return false;

    const skillData = this.data.skills[skill];
    const oldLevel = skillData.level;

    skillData.xp += amount;

    // Dispatch skill XP changed event
    window.dispatchEvent(
      new CustomEvent("player:skillXpChanged", {
        detail: { skill, xp: skillData.xp, level: skillData.level },
      }),
    );

    // Calculate new level
    const newLevel = Math.min(99, calculateLevelFromXP(skillData.xp));

    if (newLevel > oldLevel) {
      skillData.level = newLevel;
      this.onSkillLevelUp(skill, newLevel);
      return true;
    }

    return false;
  }

  /**
   * Get skill level
   * @param {string} skill - Skill name
   * @returns {number} Skill level
   */
  getSkillLevel(skill) {
    return this.data.skills[skill]?.level || 1;
  }

  /**
   * Get skill XP
   * @param {string} skill - Skill name
   * @returns {number} Skill XP
   */
  getSkillXP(skill) {
    return this.data.skills[skill]?.xp || 0;
  }

  /**
   * Get total level (sum of all skills)
   * @returns {number} Total level
   */
  getTotalLevel() {
    return Object.values(this.data.skills).reduce(
      (sum, skill) => sum + skill.level,
      0,
    );
  }

  /**
   * Add gold
   * @param {number} amount - Gold amount
   */
  addGold(amount) {
    if (amount > 0) {
      this.data.gold += amount;
      this.data.stats.totalGoldEarned += amount;
    }
  }

  /**
   * Remove gold
   * @param {number} amount - Gold amount
   * @returns {boolean} True if successful
   */
  removeGold(amount) {
    if (amount <= 0) return false;
    if (this.data.gold < amount) return false;

    this.data.gold -= amount;
    this.data.stats.totalGoldSpent += amount;
    return true;
  }

  /**
   * Has enough gold
   * @param {number} amount - Gold amount
   * @returns {boolean} True if has enough
   */
  hasGold(amount) {
    return this.data.gold >= amount;
  }

  /**
   * Add energy
   * @param {number} amount - Energy amount
   */
  addEnergy(amount) {
    this.data.energy = clamp(this.data.energy + amount, 0, this.data.maxEnergy);
  }

  /**
   * Remove energy
   * @param {number} amount - Energy amount
   * @returns {boolean} True if successful
   */
  removeEnergy(amount) {
    if (amount <= 0) return false;
    if (this.data.energy < amount) return false;

    this.data.energy -= amount;
    return true;
  }

  /**
   * Has enough energy
   * @param {number} amount - Energy amount
   * @returns {boolean} True if has enough
   */
  hasEnergy(amount) {
    return this.data.energy >= amount;
  }

  /**
   * Add item to inventory
   * @param {string} itemId - Item ID
   * @param {number} amount - Amount to add
   */
  addItem(itemId, amount = 1) {
    if (!this.data.inventory[itemId]) {
      this.data.inventory[itemId] = 0;
    }
    this.data.inventory[itemId] += amount;
  }

  /**
   * Remove item from inventory
   * @param {string} itemId - Item ID
   * @param {number} amount - Amount to remove
   * @returns {boolean} True if successful
   */
  removeItem(itemId, amount = 1) {
    if (!this.hasItem(itemId, amount)) return false;

    this.data.inventory[itemId] -= amount;

    if (this.data.inventory[itemId] <= 0) {
      delete this.data.inventory[itemId];
    }

    return true;
  }

  /**
   * Has item in inventory
   * @param {string} itemId - Item ID
   * @param {number} amount - Amount to check
   * @returns {boolean} True if has enough
   */
  hasItem(itemId, amount = 1) {
    return (this.data.inventory[itemId] || 0) >= amount;
  }

  /**
   * Get item count
   * @param {string} itemId - Item ID
   * @returns {number} Item count
   */
  getItemCount(itemId) {
    return this.data.inventory[itemId] || 0;
  }

  /**
   * Get all inventory items
   * @returns {Object} Inventory object
   */
  getInventory() {
    return { ...this.data.inventory };
  }

  /**
   * Clear inventory
   */
  clearInventory() {
    this.data.inventory = {};
  }

  /**
   * Update play time
   * @param {number} deltaSeconds - Time elapsed in seconds
   */
  updatePlayTime(deltaSeconds) {
    this.data.playTime += deltaSeconds;
  }

  /**
   * Get formatted play time
   * @returns {string} Formatted play time
   */
  getFormattedPlayTime() {
    const hours = Math.floor(this.data.playTime / 3600);
    const minutes = Math.floor((this.data.playTime % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }

  /**
   * Handle level up event
   * @param {number} newLevel - New level
   */
  onLevelUp(newLevel) {
    console.log(`🎉 Level up! New level: ${newLevel}`);

    // Increase max energy by 5 on every level up
    this.data.maxEnergy += 5;

    // Restore energy to max on level up
    this.data.energy = this.data.maxEnergy;

    // Dispatch event for UI
    window.dispatchEvent(
      new CustomEvent("player:levelup", {
        detail: { level: newLevel },
      }),
    );
  }

  /**
   * Handle skill level up event
   * @param {string} skill - Skill name
   * @param {number} newLevel - New level
   */
  onSkillLevelUp(skill, newLevel) {
    console.log(`🎉 ${skill} level up! New level: ${newLevel}`);

    // Increase max energy by 5 on every skill level up
    this.data.maxEnergy += 5;

    // Restore energy to max on skill level up
    this.data.energy = this.data.maxEnergy;

    // Dispatch event for UI
    window.dispatchEvent(
      new CustomEvent("player:skillLevelup", {
        detail: { skill, level: newLevel },
      }),
    );
  }

  /**
   * Reset player data
   */
  reset() {
    this.data = this.getDefaultData();
    console.log("🔄 Player data reset");
  }

  /**
   * Get player summary
   * @returns {Object} Player summary
   */
  getSummary() {
    return {
      name: this.data.name,
      level: this.data.level,
      totalLevel: this.getTotalLevel(),
      gold: this.data.gold,
      energy: this.data.energy,
      playTime: this.getFormattedPlayTime(),
      questsCompleted: this.data.quests.completed.length,
    };
  }
}
