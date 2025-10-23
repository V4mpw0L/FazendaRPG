/**
 * FazendaRPG - Quest System
 * Manages quests, objectives, progression, and rewards
 * @version 0.0.14
 */

export default class QuestSystem {
  constructor(player, skillSystem, inventorySystem) {
    this.player = player;
    this.skillSystem = skillSystem;
    this.inventorySystem = inventorySystem;
    this.questsData = null;
  }

  /**
   * Initialize quest system
   * @returns {Promise<boolean>}
   */
  async init() {
    try {
      const response = await fetch("./data/quests.json");
      if (!response.ok) {
        throw new Error("Failed to load quests data");
      }

      const data = await response.json();
      this.questsData = data.quests;

      console.log("✅ Quest system initialized");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize quest system:", error);
      return false;
    }
  }

  /**
   * Get quest data
   * @param {string} questId - Quest ID
   * @returns {Object|null} Quest data
   */
  getQuestData(questId) {
    return this.questsData?.[questId] || null;
  }

  /**
   * Get all quests data
   * @returns {Object} All quests
   */
  getAllQuests() {
    return this.questsData || {};
  }

  /**
   * Check if quest is available
   * @param {string} questId - Quest ID
   * @returns {boolean} True if available
   */
  isQuestAvailable(questId) {
    const questData = this.getQuestData(questId);
    if (!questData) return false;

    // Check if already completed and not repeatable
    if (this.isQuestCompleted(questId) && !questData.repeatable) {
      return false;
    }

    // Check if already active
    if (this.isQuestActive(questId)) {
      return false;
    }

    // Check level requirement
    if (
      questData.requiredLevel &&
      this.player.data.level < questData.requiredLevel
    ) {
      return false;
    }

    // Check prerequisites
    if (questData.prerequisites) {
      for (const prereqId of questData.prerequisites) {
        if (!this.isQuestCompleted(prereqId)) {
          return false;
        }
      }
    }

    // Check cooldown for repeatable quests
    if (questData.repeatable && questData.cooldown) {
      const lastCompleted = this.getQuestLastCompleted(questId);
      if (lastCompleted) {
        const timeSince = Date.now() - lastCompleted;
        if (timeSince < questData.cooldown * 1000) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Check if quest is active
   * @param {string} questId - Quest ID
   * @returns {boolean} True if active
   */
  isQuestActive(questId) {
    return this.player.data.quests.active.includes(questId);
  }

  /**
   * Check if quest is completed
   * @param {string} questId - Quest ID
   * @returns {boolean} True if completed
   */
  isQuestCompleted(questId) {
    return this.player.data.quests.completed.some((q) =>
      typeof q === "string" ? q === questId : q.id === questId,
    );
  }

  /**
   * Get quest last completed timestamp
   * @param {string} questId - Quest ID
   * @returns {number|null} Timestamp or null
   */
  getQuestLastCompleted(questId) {
    const completed = this.player.data.quests.completed.find(
      (q) => typeof q === "object" && q.id === questId,
    );
    return completed?.completedAt || null;
  }

  /**
   * Accept a quest
   * @param {string} questId - Quest ID
   * @returns {Object} Result
   */
  acceptQuest(questId) {
    if (!this.isQuestAvailable(questId)) {
      return { success: false, error: "Quest not available" };
    }

    const questData = this.getQuestData(questId);
    if (!questData) {
      return { success: false, error: "Quest not found" };
    }

    // Add to active quests
    this.player.data.quests.active.push(questId);

    // Initialize progress
    if (!this.player.data.quests.progress[questId]) {
      this.player.data.quests.progress[questId] = {
        objectives: questData.objectives.map((obj) => ({
          ...obj,
          current: obj.current || 0,
        })),
        startedAt: Date.now(),
      };
    }

    console.log(`📜 Quest accepted: ${questData.name}`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("quest:accepted", {
        detail: { questId },
      }),
    );

    return { success: true, questId };
  }

  /**
   * Abandon a quest
   * @param {string} questId - Quest ID
   * @returns {Object} Result
   */
  abandonQuest(questId) {
    if (!this.isQuestActive(questId)) {
      return { success: false, error: "Quest not active" };
    }

    // Remove from active quests
    const index = this.player.data.quests.active.indexOf(questId);
    if (index > -1) {
      this.player.data.quests.active.splice(index, 1);
    }

    // Clear progress
    delete this.player.data.quests.progress[questId];

    console.log(`📜 Quest abandoned: ${questId}`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("quest:abandoned", {
        detail: { questId },
      }),
    );

    return { success: true };
  }

  /**
   * Update quest progress
   * @param {string} questId - Quest ID
   * @param {string} objectiveType - Objective type
   * @param {Object} data - Progress data
   * @returns {Object} Result
   */
  updateProgress(questId, objectiveType, data = {}) {
    if (!this.isQuestActive(questId)) {
      return { success: false, error: "Quest not active" };
    }

    const progress = this.player.data.quests.progress[questId];
    if (!progress) {
      return { success: false, error: "Quest progress not found" };
    }

    let updated = false;

    progress.objectives.forEach((objective) => {
      if (objective.type === objectiveType) {
        switch (objectiveType) {
          case "plant":
          case "harvest":
          case "fish":
          case "mine":
          case "cook":
          case "woodcut":
          case "forage":
            if (
              !objective.cropId ||
              objective.cropId === data.itemId ||
              !data.itemId
            ) {
              objective.current = Math.min(
                objective.amount,
                objective.current + (data.amount || 1),
              );
              updated = true;
            }
            break;

          case "skill_level":
            if (objective.skill === data.skill) {
              objective.current = data.level;
              updated = true;
            }
            break;

          case "earn_gold":
            objective.current = Math.min(
              objective.amount,
              objective.current + (data.amount || 0),
            );
            updated = true;
            break;

          case "plant_different":
            if (!objective.types) {
              objective.types = [];
            }
            if (data.cropId && !objective.types.includes(data.cropId)) {
              objective.types.push(data.cropId);
              objective.current = objective.types.length;
              updated = true;
            }
            break;
        }
      }
    });

    if (updated) {
      // Check if quest is complete
      if (this.isQuestObjectivesComplete(questId)) {
        this.completeQuest(questId);
      }

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent("quest:progress", {
          detail: { questId, objectiveType, data },
        }),
      );
    }

    return { success: updated };
  }

  /**
   * Check if all objectives are complete
   * @param {string} questId - Quest ID
   * @returns {boolean} True if complete
   */
  isQuestObjectivesComplete(questId) {
    const progress = this.player.data.quests.progress[questId];
    if (!progress) return false;

    return progress.objectives.every((objective) => {
      return objective.current >= objective.amount;
    });
  }

  /**
   * Complete a quest and grant rewards
   * @param {string} questId - Quest ID
   * @returns {Object} Result
   */
  completeQuest(questId) {
    if (!this.isQuestActive(questId)) {
      return { success: false, error: "Quest not active" };
    }

    const questData = this.getQuestData(questId);
    if (!questData) {
      return { success: false, error: "Quest not found" };
    }

    // Grant rewards
    const rewards = questData.rewards || {};
    const grantedRewards = {};

    if (rewards.gold) {
      this.player.addGold(rewards.gold);
      grantedRewards.gold = rewards.gold;
    }

    if (rewards.xp) {
      this.player.addXP(rewards.xp);
      grantedRewards.xp = rewards.xp;
    }

    if (rewards.skillXP) {
      grantedRewards.skillXP = {};
      for (const [skill, xp] of Object.entries(rewards.skillXP)) {
        this.skillSystem.addXP(skill, xp);
        grantedRewards.skillXP[skill] = xp;
      }
    }

    if (rewards.items) {
      grantedRewards.items = {};
      for (const [itemId, amount] of Object.entries(rewards.items)) {
        this.inventorySystem.addItem(itemId, amount);
        grantedRewards.items[itemId] = amount;
      }
    }

    // Remove from active quests
    const index = this.player.data.quests.active.indexOf(questId);
    if (index > -1) {
      this.player.data.quests.active.splice(index, 1);
    }

    // Add to completed quests
    if (questData.repeatable) {
      // For repeatable quests, store completion with timestamp
      this.player.data.quests.completed =
        this.player.data.quests.completed.filter(
          (q) => typeof q === "string" || q.id !== questId,
        );
      this.player.data.quests.completed.push({
        id: questId,
        completedAt: Date.now(),
      });
    } else {
      // For one-time quests, just store the ID
      if (!this.isQuestCompleted(questId)) {
        this.player.data.quests.completed.push(questId);
      }
    }

    // Clear progress
    delete this.player.data.quests.progress[questId];

    // Update stats
    this.player.data.stats.totalQuestsCompleted++;

    console.log(`✅ Quest completed: ${questData.name}`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("quest:completed", {
        detail: { questId, rewards: grantedRewards },
      }),
    );

    return {
      success: true,
      questId,
      rewards: grantedRewards,
    };
  }

  /**
   * Get active quests
   * @returns {Array} Active quests
   */
  getActiveQuests() {
    return this.player.data.quests.active.map((questId) => {
      const questData = this.getQuestData(questId);
      const progress = this.player.data.quests.progress[questId];

      return {
        id: questId,
        ...questData,
        progress: progress?.objectives || [],
      };
    });
  }

  /**
   * Get completed quests
   * @returns {Array} Completed quests
   */
  getCompletedQuests() {
    return this.player.data.quests.completed.map((q) => {
      const questId = typeof q === "string" ? q : q.id;
      const questData = this.getQuestData(questId);
      const completedAt = typeof q === "object" ? q.completedAt : null;

      return {
        id: questId,
        ...questData,
        completedAt,
      };
    });
  }

  /**
   * Get available quests
   * @returns {Array} Available quests
   */
  getAvailableQuests() {
    const allQuests = Object.keys(this.questsData || {});

    return allQuests
      .filter((questId) => this.isQuestAvailable(questId))
      .map((questId) => ({
        id: questId,
        ...this.getQuestData(questId),
      }));
  }

  /**
   * Get quests by NPC
   * @param {string} npcId - NPC ID
   * @returns {Array} NPC quests
   */
  getQuestsByNPC(npcId) {
    const allQuests = Object.values(this.questsData || {});

    return allQuests
      .filter((quest) => quest.npc === npcId)
      .map((quest) => ({
        ...quest,
        available: this.isQuestAvailable(quest.id),
        active: this.isQuestActive(quest.id),
        completed: this.isQuestCompleted(quest.id),
      }));
  }

  /**
   * Get quest progress percentage
   * @param {string} questId - Quest ID
   * @returns {number} Progress percentage (0-100)
   */
  getQuestProgress(questId) {
    const progress = this.player.data.quests.progress[questId];
    if (!progress) return 0;

    const objectives = progress.objectives;
    if (!objectives || objectives.length === 0) return 0;

    const totalProgress = objectives.reduce((sum, obj) => {
      const objProgress = Math.min(100, (obj.current / obj.amount) * 100);
      return sum + objProgress;
    }, 0);

    return totalProgress / objectives.length;
  }

  /**
   * Get quest statistics
   * @returns {Object} Quest stats
   */
  getStats() {
    return {
      active: this.player.data.quests.active.length,
      completed: this.player.data.quests.completed.length,
      available: this.getAvailableQuests().length,
      total: Object.keys(this.questsData || {}).length,
    };
  }

  /**
   * Reset all quests
   */
  resetQuests() {
    this.player.data.quests = {
      active: [],
      completed: [],
      progress: {},
    };
    console.log("🔄 Quests reset");
  }

  /**
   * Get quest cooldown remaining
   * @param {string} questId - Quest ID
   * @returns {number} Seconds remaining
   */
  getQuestCooldown(questId) {
    const questData = this.getQuestData(questId);
    if (!questData || !questData.repeatable || !questData.cooldown) {
      return 0;
    }

    const lastCompleted = this.getQuestLastCompleted(questId);
    if (!lastCompleted) return 0;

    const timeSince = Date.now() - lastCompleted;
    const remaining = questData.cooldown * 1000 - timeSince;

    return Math.max(0, Math.floor(remaining / 1000));
  }

  /**
   * Handle game events for quest progress
   * @param {string} eventType - Event type
   * @param {Object} data - Event data
   */
  handleGameEvent(eventType, data) {
    const activeQuests = this.player.data.quests.active;

    activeQuests.forEach((questId) => {
      switch (eventType) {
        case "plant":
          this.updateProgress(questId, "plant", data);
          this.updateProgress(questId, "plant_different", data);
          break;
        case "harvest":
          this.updateProgress(questId, "harvest", data);
          break;
        case "fish":
          this.updateProgress(questId, "fish", data);
          break;
        case "mine":
          this.updateProgress(questId, "mine", data);
          break;
        case "cook":
          this.updateProgress(questId, "cook", data);
          break;
        case "woodcut":
          this.updateProgress(questId, "woodcut", data);
          break;
        case "forage":
          this.updateProgress(questId, "forage", data);
          break;
        case "skillLevel":
          this.updateProgress(questId, "skill_level", data);
          break;
        case "earnGold":
          this.updateProgress(questId, "earn_gold", data);
          break;
      }
    });
  }
}
