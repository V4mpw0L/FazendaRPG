/**
 * FazendaRPG - Skill System
 * Manages all skills, XP progression, and skill-based actions
 * @version 0.0.6
 */

import { calculateLevelFromXP, calculateXPForLevel } from "../utils/helpers.js";
import i18n from "../utils/i18n.js";

export default class SkillSystem {
  constructor(player) {
    this.player = player;
    this.skillsData = null;
    this.xpTable = [];
    this.maxLevel = 99;
  }

  /**
   * Initialize skill system
   * @returns {Promise<boolean>}
   */
  async init() {
    try {
      const response = await fetch("./data/skills.json");
      if (!response.ok) {
        throw new Error("Failed to load skills data");
      }

      const data = await response.json();
      this.skillsData = data.skills;
      this.xpTable = data.xpTable;
      this.maxLevel = data.maxLevel || 99;

      console.log("✅ Skill system initialized");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize skill system:", error);
      return false;
    }
  }

  /**
   * Get skill data
   * @param {string} skillId - Skill ID
   * @returns {Object|null} Skill data
   */
  getSkillData(skillId) {
    return this.skillsData?.[skillId] || null;
  }

  /**
   * Get all skills
   * @returns {Object} All skills data
   */
  getAllSkills() {
    return this.skillsData || {};
  }

  /**
   * Get player's current level for a skill
   * @param {string} skillId - Skill ID
   * @returns {number} Current level
   */
  getLevel(skillId) {
    return this.player.getSkillLevel(skillId);
  }

  /**
   * Get player's current XP for a skill
   * @param {string} skillId - Skill ID
   * @returns {number} Current XP
   */
  getXP(skillId) {
    return this.player.getSkillXP(skillId);
  }

  /**
   * Get XP required for next level
   * @param {string} skillId - Skill ID
   * @returns {number} XP needed
   */
  getXPForNextLevel(skillId) {
    const currentLevel = this.getLevel(skillId);
    if (currentLevel >= this.maxLevel) return 0;

    return this.xpTable[currentLevel] || calculateXPForLevel(currentLevel + 1);
  }

  /**
   * Get XP progress to next level (0-100%)
   * @param {string} skillId - Skill ID
   * @returns {number} Progress percentage
   */
  getXPProgress(skillId) {
    const currentLevel = this.getLevel(skillId);
    if (currentLevel >= this.maxLevel) return 100;

    const currentXP = this.getXP(skillId);
    const currentLevelXP =
      this.xpTable[currentLevel - 1] || calculateXPForLevel(currentLevel);
    const nextLevelXP =
      this.xpTable[currentLevel] || calculateXPForLevel(currentLevel + 1);

    const xpInLevel = currentXP - currentLevelXP;
    const xpNeeded = nextLevelXP - currentLevelXP;

    return Math.min(100, (xpInLevel / xpNeeded) * 100);
  }

  /**
   * Add XP to a skill
   * @param {string} skillId - Skill ID
   * @param {number} amount - XP amount
   * @returns {Object} Result with levelUp flag and new level
   */
  addXP(skillId, amount) {
    if (!this.skillsData?.[skillId] || amount <= 0) {
      return { success: false, levelUp: false };
    }

    const oldLevel = this.getLevel(skillId);
    const leveledUp = this.player.addSkillXP(skillId, amount);
    const newLevel = this.getLevel(skillId);

    // Also add base XP to player level
    const baseXP = Math.floor(amount * 0.1); // 10% of skill XP goes to player level
    this.player.addXP(baseXP);

    return {
      success: true,
      levelUp: leveledUp,
      oldLevel,
      newLevel,
      xpGained: amount,
    };
  }

  /**
   * Check if player meets level requirement
   * @param {string} skillId - Skill ID
   * @param {number} requiredLevel - Required level
   * @returns {boolean} True if meets requirement
   */
  meetsLevelRequirement(skillId, requiredLevel) {
    return this.getLevel(skillId) >= requiredLevel;
  }

  /**
   * Get available actions for a skill
   * @param {string} skillId - Skill ID
   * @returns {Array} Available actions
   */
  getAvailableActions(skillId) {
    const skillData = this.getSkillData(skillId);
    if (!skillData?.actions) return [];

    const playerLevel = this.getLevel(skillId);

    return skillData.actions.filter((action) => {
      return (action.requiredLevel || 1) <= playerLevel;
    });
  }

  /**
   * Get action data
   * @param {string} skillId - Skill ID
   * @param {string} actionId - Action ID
   * @returns {Object|null} Action data
   */
  getActionData(skillId, actionId) {
    const skillData = this.getSkillData(skillId);
    if (!skillData?.actions) return null;

    return skillData.actions.find((a) => a.id === actionId) || null;
  }

  /**
   * Perform a skill action
   * @param {string} skillId - Skill ID
   * @param {string} actionId - Action ID
   * @returns {Object} Result
   */
  performAction(skillId, actionId) {
    const action = this.getActionData(skillId, actionId);
    if (!action) {
      return { success: false, error: "Action not found" };
    }

    // Check level requirement
    if (!this.meetsLevelRequirement(skillId, action.requiredLevel || 1)) {
      return { success: false, error: "Level requirement not met" };
    }

    // Check energy requirement
    if (action.energyCost && !this.player.hasEnergy(action.energyCost)) {
      return { success: false, error: i18n.t("errors.notEnoughEnergy") };
    }

    // Check item requirements
    if (action.requiredItems) {
      for (const [itemId, amount] of Object.entries(action.requiredItems)) {
        if (!this.player.hasItem(itemId, amount)) {
          return { success: false, error: `Need ${amount}x ${itemId}` };
        }
      }
    }

    // Consume energy
    if (action.energyCost) {
      this.player.removeEnergy(action.energyCost);
    }

    // Consume required items
    if (action.requiredItems) {
      for (const [itemId, amount] of Object.entries(action.requiredItems)) {
        this.player.removeItem(itemId, amount);
      }
    }

    // Add XP
    const xpResult = this.addXP(skillId, action.xp || 0);

    // Produce items
    const producedItems = {};
    if (action.produces) {
      for (const [itemId, amount] of Object.entries(action.produces)) {
        this.player.addItem(itemId, amount);
        producedItems[itemId] = amount;
      }
    }

    return {
      success: true,
      xpGained: action.xp || 0,
      levelUp: xpResult.levelUp,
      newLevel: xpResult.newLevel,
      producedItems,
      timeSeconds: action.timeSeconds || 0,
    };
  }

  /**
   * Get total level (sum of all skills)
   * @returns {number} Total level
   */
  getTotalLevel() {
    return this.player.getTotalLevel();
  }

  /**
   * Get skill statistics
   * @param {string} skillId - Skill ID
   * @returns {Object} Skill statistics
   */
  getSkillStats(skillId) {
    const level = this.getLevel(skillId);
    const xp = this.getXP(skillId);
    const xpForNext = this.getXPForNextLevel(skillId);
    const progress = this.getXPProgress(skillId);
    const skillData = this.getSkillData(skillId);

    return {
      id: skillId,
      name: i18n.t(`skills.${skillId}.name`) || skillData?.name || skillId,
      icon: skillData?.icon || "❓",
      level,
      xp,
      xpForNext,
      progress,
      maxLevel: level >= this.maxLevel,
      color: skillData?.color || "#5caa1f",
      colorLight: skillData?.colorLight || "#7ec850",
    };
  }

  /**
   * Get all skills statistics
   * @returns {Array} Array of skill stats
   */
  getAllSkillStats() {
    const skills = Object.keys(this.skillsData || {});
    return skills.map((skillId) => this.getSkillStats(skillId));
  }

  /**
   * Check if player has reached a milestone level
   * @param {number} level - Level to check
   * @returns {boolean} True if milestone
   */
  isMilestone(level) {
    const milestones = [10, 25, 50, 75, 99];
    return milestones.includes(level);
  }

  /**
   * Calculate total XP across all skills
   * @returns {number} Total XP
   */
  getTotalXP() {
    const skills = Object.keys(this.skillsData || {});
    return skills.reduce((total, skillId) => {
      return total + this.getXP(skillId);
    }, 0);
  }

  /**
   * Get highest skill level
   * @returns {Object} Skill with highest level
   */
  getHighestSkill() {
    const stats = this.getAllSkillStats();
    return stats.reduce(
      (highest, skill) => {
        return skill.level > highest.level ? skill : highest;
      },
      { level: 0 },
    );
  }

  /**
   * Get skill rank (how many skills player has at each level)
   * @returns {Object} Level distribution
   */
  getSkillDistribution() {
    const stats = this.getAllSkillStats();
    const distribution = {};

    stats.forEach((skill) => {
      const level = skill.level;
      distribution[level] = (distribution[level] || 0) + 1;
    });

    return distribution;
  }

  /**
   * Calculate success chance for an action based on level
   * @param {string} skillId - Skill ID
   * @param {number} baseChance - Base success chance (0-100)
   * @param {number} requiredLevel - Required level
   * @returns {number} Success chance (0-100)
   */
  calculateSuccessChance(skillId, baseChance, requiredLevel) {
    const level = this.getLevel(skillId);
    const levelDiff = level - requiredLevel;

    // Increase success by 1% per level above requirement
    const bonus = Math.min(25, levelDiff); // Max 25% bonus

    return Math.min(100, baseChance + bonus);
  }

  /**
   * Get recommended actions for current level
   * @param {string} skillId - Skill ID
   * @returns {Array} Recommended actions
   */
  getRecommendedActions(skillId) {
    const actions = this.getAvailableActions(skillId);
    const level = this.getLevel(skillId);

    // Filter actions that are close to player's level
    return actions
      .filter((action) => {
        const reqLevel = action.requiredLevel || 1;
        return reqLevel <= level && reqLevel >= level - 10;
      })
      .sort((a, b) => {
        // Sort by XP reward
        return (b.xp || 0) - (a.xp || 0);
      });
  }

  /**
   * Reset a skill
   * @param {string} skillId - Skill ID
   */
  resetSkill(skillId) {
    if (this.player.data.skills[skillId]) {
      this.player.data.skills[skillId] = { level: 1, xp: 0 };
      console.log(`🔄 Reset skill: ${skillId}`);
    }
  }

  /**
   * Reset all skills
   */
  resetAllSkills() {
    Object.keys(this.player.data.skills).forEach((skillId) => {
      this.resetSkill(skillId);
    });
    console.log("🔄 All skills reset");
  }
}
