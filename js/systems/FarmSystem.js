/**
 * FazendaRPG - Farm System
 * Manages farming mechanics, crop planting, growth, and harvesting
 * @version 0.0.19
 */

import { getTimeRemaining, isPast, clamp } from "../utils/helpers.js";
import i18n from "../utils/i18n.js";

export default class FarmSystem {
  constructor(player, skillSystem, inventorySystem) {
    this.player = player;
    this.skillSystem = skillSystem;
    this.inventorySystem = inventorySystem;
    this.cropsData = null;
    this.plotCount = 9;
    this.updateInterval = null;
    this.weedGrowthTime = 60000; // 60 seconds for weeds to appear
  }

  /**
   * Initialize farm system
   * @returns {Promise<boolean>}
   */
  async init() {
    try {
      const response = await fetch("./data/crops.json");
      if (!response.ok) {
        throw new Error("Failed to load crops data");
      }

      const data = await response.json();
      this.cropsData = data.crops;

      console.log("✅ Farm system initialized");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize farm system:", error);
      return false;
    }
  }

  /**
   * Start farm update loop
   */
  startUpdateLoop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }

    this.updateInterval = setInterval(() => {
      this.checkCrops();
      this.checkWeeds();

      // Dispatch update event for UI to refresh
      window.dispatchEvent(new CustomEvent("farm:update"));
    }, 1000); // Update every second

    console.log("🌾 Farm update loop started");
  }

  /**
   * Stop farm update loop
   */
  stopUpdateLoop() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      console.log("🌾 Farm update loop stopped");
    }
  }

  /**
   * Get crop data
   * @param {string} cropId - Crop ID
   * @returns {Object|null} Crop data
   */
  getCropData(cropId) {
    return this.cropsData?.[cropId] || null;
  }

  /**
   * Get all crops data
   * @returns {Object} All crops
   */
  getAllCrops() {
    return this.cropsData || {};
  }

  /**
   * Get crops data (alias for getAllCrops)
   * @returns {Object} Crops data
   */
  getCropsData() {
    return this.cropsData || {};
  }

  /**
   * Get farm plots
   * @returns {Array} Farm plots
   */
  getPlots() {
    return this.player.data.farm.plots;
  }

  /**
   * Get plot by index
   * @param {number} index - Plot index
   * @returns {Object|null} Plot data
   */
  getPlot(index) {
    if (index < 0 || index >= this.plotCount) return null;
    return this.player.data.farm.plots[index];
  }

  /**
   * Check if plot is empty
   * @param {number} index - Plot index
   * @returns {boolean} True if empty
   */
  isPlotEmpty(index) {
    const plot = this.getPlot(index);
    return plot && !plot.crop;
  }

  /**
   * Check if plot has weeds
   * @param {number} index - Plot index
   * @returns {boolean} True if has weeds
   */
  hasWeeds(index) {
    const plot = this.getPlot(index);
    return plot && plot.hasWeeds === true;
  }

  /**
   * Check weeds growth on empty plots
   */
  checkWeeds() {
    const plots = this.getPlots();
    const now = Date.now();

    plots.forEach((plot, index) => {
      // Only check empty plots
      if (!plot.crop) {
        // Initialize lastHarvestedAt if not exists
        if (!plot.lastHarvestedAt) {
          plot.lastHarvestedAt = now;
        }

        // Check if weeds should appear
        const timeSinceLastAction = now - plot.lastHarvestedAt;
        if (timeSinceLastAction >= this.weedGrowthTime && !plot.hasWeeds) {
          plot.hasWeeds = true;
          console.log(`🌿 Weeds grew on plot ${index}`);

          // Dispatch event for UI update
          window.dispatchEvent(
            new CustomEvent("farm:weeds-grown", {
              detail: { index },
            }),
          );
        }
      }
    });
  }

  /**
   * Clear weeds from plot
   * @param {number} index - Plot index
   * @returns {Object} Result
   */
  clearWeeds(index) {
    const plot = this.getPlot(index);

    if (!plot) {
      return { success: false, error: "Invalid plot" };
    }

    if (!plot.hasWeeds) {
      return { success: false, error: "Plot has no weeds" };
    }

    // Check if player has enough energy
    if (this.player.data.energy < 1) {
      return { success: false, error: "Not enough energy" };
    }

    // Consume energy
    this.player.data.energy -= 1;

    // Dispatch energy loss event for UI notification
    window.dispatchEvent(
      new CustomEvent("player:energyLoss", {
        detail: { amount: 1 },
      }),
    );

    // Clear weeds
    plot.hasWeeds = false;
    plot.lastHarvestedAt = Date.now();

    // Add herbs item to inventory
    this.inventorySystem.addItem("herbs", 1);

    console.log(`✅ Cleared weeds from plot ${index} and gained 1x Herbs`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("farm:weeds-cleared", {
        detail: { index },
      }),
    );

    return { success: true };
  }

  /**
   * Check if plot is growing (has crop but not ready)
   * @param {number} index - Plot index
   * @returns {boolean} True if growing
   */
  isPlotGrowing(index) {
    const plot = this.getPlot(index);
    if (!plot || !plot.crop || !plot.plantedAt) return false;
    return !this.isPlotReady(index);
  }

  /**
   * Check if plot is ready to harvest
   * @param {number} index - Plot index
   * @returns {boolean} True if ready
   */
  isPlotReady(index) {
    const plot = this.getPlot(index);
    if (!plot || !plot.crop || !plot.plantedAt) return false;

    const cropData = this.getCropData(plot.crop);
    if (!cropData) return false;

    const growthTime = plot.fertilized
      ? cropData.growthTime * 0.5
      : cropData.growthTime;

    const readyAt = plot.plantedAt + growthTime * 1000;
    return isPast(readyAt);
  }

  /**
   * Get time remaining for crop
   * @param {number} index - Plot index
   * @returns {number} Seconds remaining (0 if ready or empty)
   */
  getTimeRemaining(index) {
    const plot = this.getPlot(index);
    if (!plot || !plot.crop || !plot.plantedAt) return 0;

    const cropData = this.getCropData(plot.crop);
    if (!cropData) return 0;

    const growthTime = plot.fertilized
      ? cropData.growthTime * 0.5
      : cropData.growthTime;

    const readyAt = plot.plantedAt + growthTime * 1000;
    return getTimeRemaining(readyAt);
  }

  /**
   * Get growth progress percentage
   * @param {number} index - Plot index
   * @returns {number} Progress (0-100)
   */
  getGrowthProgress(index) {
    const plot = this.getPlot(index);
    if (!plot || !plot.crop || !plot.plantedAt) return 0;

    const cropData = this.getCropData(plot.crop);
    if (!cropData) return 0;

    const growthTime = plot.fertilized
      ? cropData.growthTime * 0.5
      : cropData.growthTime;

    const elapsed = Date.now() - plot.plantedAt;
    const progress = (elapsed / (growthTime * 1000)) * 100;

    return clamp(progress, 0, 100);
  }

  /**
   * Get crop stage icon
   * @param {number} index - Plot index
   * @returns {string} Stage icon
   */
  getCropStageIcon(index) {
    const plot = this.getPlot(index);
    if (!plot || !plot.crop) return "🟫";

    const cropData = this.getCropData(plot.crop);
    if (!cropData) return "🟫";

    if (this.isPlotReady(index)) {
      return cropData.icon;
    }

    const progress = this.getGrowthProgress(index);
    const stages = cropData.stages || ["🌱", "🌿", cropData.icon];

    if (progress < 33) {
      return stages[0];
    } else if (progress < 66) {
      return stages[1];
    } else if (progress < 100) {
      return stages[2] || stages[1];
    }

    return cropData.icon;
  }

  /**
   * Plant a crop
   * @param {number} index - Plot index
   * @param {string} cropId - Crop ID to plant
   * @returns {Object} Result
   */
  plant(index, cropId) {
    // Validate plot
    if (!this.isPlotEmpty(index)) {
      return { success: false, error: "Plot is not empty" };
    }

    // Get crop data
    const cropData = this.getCropData(cropId);
    if (!cropData) {
      return { success: false, error: "Invalid crop" };
    }

    // Check level requirement
    if (
      !this.skillSystem.meetsLevelRequirement(
        "farming",
        cropData.requiredLevel || 1,
      )
    ) {
      return {
        success: false,
        error: `Farming level ${cropData.requiredLevel} required`,
      };
    }

    // Check if player has seeds
    const seedId = cropData.seedId;
    if (!this.player.hasItem(seedId, 1)) {
      return { success: false, error: i18n.t("farm.noSeeds") };
    }

    // Check energy
    if (!this.player.hasEnergy(cropData.energyCost)) {
      return { success: false, error: i18n.t("errors.notEnoughEnergy") };
    }

    // Consume seed and energy
    this.inventorySystem.removeItem(seedId, 1);
    this.player.removeEnergy(cropData.energyCost);

    // Plant crop
    const plot = this.getPlot(index);
    plot.crop = cropId;
    plot.plantedAt = Date.now();
    plot.fertilized = false;

    // Update stats
    this.player.data.stats.totalCropsPlanted++;

    console.log(`🌱 Planted ${cropId} in plot ${index}`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("farm:planted", {
        detail: { index, cropId },
      }),
    );

    return { success: true, crop: cropId };
  }

  /**
   * Harvest a crop
   * @param {number} index - Plot index
   * @returns {Object} Result
   */
  harvest(index) {
    const plot = this.getPlot(index);

    // Validate plot
    if (!plot || !plot.crop) {
      return { success: false, error: "Plot is empty" };
    }

    // Check if ready
    if (!this.isPlotReady(index)) {
      return { success: false, error: "Crop is not ready" };
    }

    const cropData = this.getCropData(plot.crop);
    if (!cropData) {
      return { success: false, error: "Invalid crop data" };
    }

    // Calculate harvest amount (with potential bonus)
    const baseAmount = cropData.harvestAmount || 1;
    const farmingLevel = this.skillSystem.getLevel("farming");

    // Small chance for bonus harvest based on farming level
    const bonusChance = Math.min(25, farmingLevel); // Max 25% chance
    const bonus = Math.random() * 100 < bonusChance ? 1 : 0;

    const amount = baseAmount + bonus;

    // Add harvested item to inventory
    this.inventorySystem.addItem(plot.crop, amount);

    // Add XP
    const xpResult = this.skillSystem.addXP("farming", cropData.xpGain || 10);

    // Update stats
    this.player.data.stats.totalCropsHarvested++;

    // Clear plot
    plot.crop = null;
    plot.plantedAt = null;
    plot.fertilized = false;
    plot.lastHarvestedAt = Date.now(); // Track when plot became empty

    console.log(`🧺 Harvested ${amount}x ${cropData.name} from plot ${index}`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("farm:harvested", {
        detail: {
          index,
          cropId: cropData.id,
          amount,
          xpGained: cropData.xpGain,
          levelUp: xpResult.levelUp,
          newLevel: xpResult.newLevel,
        },
      }),
    );

    return {
      success: true,
      crop: cropData.id,
      amount,
      xpGained: cropData.xpGain,
      levelUp: xpResult.levelUp,
      newLevel: xpResult.newLevel,
      bonus: bonus > 0,
    };
  }

  /**
   * Fertilize a plot
   * @param {number} index - Plot index
   * @returns {Object} Result
   */
  fertilize(index) {
    const plot = this.getPlot(index);

    // Validate plot
    if (!plot || !plot.crop) {
      return { success: false, error: "Plot is empty" };
    }

    if (plot.fertilized) {
      return { success: false, error: "Already fertilized" };
    }

    // Check if player has fertilizer
    if (!this.player.hasItem("fertilizer", 1)) {
      return { success: false, error: "No fertilizer available" };
    }

    // Consume fertilizer
    this.inventorySystem.removeItem("fertilizer", 1);

    // Apply fertilizer
    plot.fertilized = true;

    console.log(`💩 Fertilized plot ${index}`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("farm:fertilized", {
        detail: { index },
      }),
    );

    return { success: true };
  }

  /**
   * Clear a plot (remove crop without harvesting)
   * @param {number} index - Plot index
   * @returns {Object} Result
   */
  clearPlot(index) {
    const plot = this.getPlot(index);

    if (!plot || !plot.crop) {
      return { success: false, error: "Plot is already empty" };
    }

    plot.crop = null;
    plot.plantedAt = null;
    plot.fertilized = false;

    console.log(`🗑️ Cleared plot ${index}`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("farm:cleared", {
        detail: { index },
      }),
    );

    return { success: true };
  }

  /**
   * Plant all empty plots with a crop
   * @param {string} cropId - Crop ID to plant
   * @returns {Object} Result with count
   */
  plantAll(cropId) {
    let planted = 0;
    const errors = [];
    const plantedIndices = [];
    let emptyPlots = 0;

    for (let i = 0; i < this.plotCount; i++) {
      // Only plant if plot is empty AND has no weeds
      if (this.isPlotEmpty(i) && !this.hasWeeds(i)) {
        emptyPlots++;
        const result = this.plant(i, cropId);
        if (result.success) {
          planted++;
          plantedIndices.push(i);
        } else {
          errors.push(result.error);
          break; // Stop if we run out of resources
        }
      }
    }

    // If no empty plots were found
    if (emptyPlots === 0) {
      return {
        success: false,
        planted: 0,
        plantedIndices: [],
        errors: "Não há espaços vazios para plantar",
      };
    }

    return {
      success: planted > 0,
      planted,
      plantedIndices,
      errors: errors.length > 0 ? errors[0] : null,
    };
  }

  /**
   * Harvest all ready crops
   * @returns {Object} Result with counts
   */
  harvestAll() {
    let harvested = 0;
    const items = {};

    for (let i = 0; i < this.plotCount; i++) {
      if (this.isPlotReady(i)) {
        const result = this.harvest(i);
        if (result.success) {
          harvested++;
          items[result.crop] = (items[result.crop] || 0) + result.amount;
        }
      }
    }

    return {
      success: harvested > 0,
      harvested,
      items,
    };
  }

  /**
   * Check all crops and trigger events
   */
  checkCrops() {
    let readyCount = 0;

    for (let i = 0; i < this.plotCount; i++) {
      const plot = this.getPlot(i);
      if (plot && plot.crop && !plot.wasReady && this.isPlotReady(i)) {
        plot.wasReady = true;
        readyCount++;

        // Dispatch ready event
        window.dispatchEvent(
          new CustomEvent("farm:cropReady", {
            detail: { index: i, cropId: plot.crop },
          }),
        );
      }
    }

    if (readyCount > 0) {
      // Dispatch bulk ready event
      window.dispatchEvent(
        new CustomEvent("farm:cropsReady", {
          detail: { count: readyCount },
        }),
      );
    }
  }

  /**
   * Get farm statistics
   * @returns {Object} Farm stats
   */
  getStats() {
    let planted = 0;
    let growing = 0;
    let ready = 0;
    let empty = 0;
    let fertilized = 0;

    for (let i = 0; i < this.plotCount; i++) {
      const plot = this.getPlot(i);
      if (!plot.crop) {
        empty++;
      } else {
        planted++;
        if (plot.fertilized) fertilized++;
        if (this.isPlotReady(i)) {
          ready++;
        } else {
          growing++;
        }
      }
    }

    return {
      total: this.plotCount,
      planted,
      growing,
      ready,
      empty,
      fertilized,
    };
  }

  /**
   * Get available crops for current farming level
   * @returns {Array} Available crops
   */
  getAvailableCrops() {
    const farmingLevel = this.skillSystem.getLevel("farming");
    const crops = Object.values(this.cropsData || {});

    return crops
      .filter((crop) => {
        return (crop.requiredLevel || 1) <= farmingLevel;
      })
      .sort((a, b) => {
        return (a.requiredLevel || 1) - (b.requiredLevel || 1);
      });
  }

  /**
   * Get crop recommendations based on level and profit
   * @returns {Array} Recommended crops
   */
  getRecommendedCrops() {
    const available = this.getAvailableCrops();
    const farmingLevel = this.skillSystem.getLevel("farming");

    // Calculate profit per second for each crop
    return available
      .map((crop) => {
        const profitPerHarvest = crop.sellPrice * crop.harvestAmount;
        const profitPerSecond = profitPerHarvest / crop.growthTime;
        const xpPerSecond = crop.xpGain / crop.growthTime;

        return {
          ...crop,
          profitPerSecond,
          xpPerSecond,
          score: profitPerSecond + xpPerSecond * 0.1,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  /**
   * Reset farm (clear all plots)
   */
  resetFarm() {
    for (let i = 0; i < this.plotCount; i++) {
      this.clearPlot(i);
    }
    console.log("🔄 Farm reset");
  }
}
