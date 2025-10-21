/**
 * FazendaRPG - Inventory System
 * Manages player inventory, items, stacking, and item operations
 * @version 0.0.7
 */

import i18n from "../utils/i18n.js";

export default class InventorySystem {
  constructor(player) {
    this.player = player;
    this.itemsData = null;
    this.maxSlots = 100;
  }

  /**
   * Initialize inventory system
   * @returns {Promise<boolean>}
   */
  async init() {
    try {
      const response = await fetch("./data/items.json");
      if (!response.ok) {
        throw new Error("Failed to load items data");
      }

      const data = await response.json();
      this.itemsData = data.items;

      console.log("✅ Inventory system initialized");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize inventory system:", error);
      return false;
    }
  }

  /**
   * Get item data
   * @param {string} itemId - Item ID
   * @returns {Object|null} Item data
   */
  getItemData(itemId) {
    return this.itemsData?.[itemId] || null;
  }

  /**
   * Get all items data
   * @returns {Object} All items
   */
  getAllItems() {
    return this.itemsData || {};
  }

  /**
   * Add item to inventory
   * @param {string} itemId - Item ID
   * @param {number} amount - Amount to add
   * @returns {Object} Result
   */
  addItem(itemId, amount = 1) {
    if (amount <= 0) {
      return { success: false, error: "Invalid amount" };
    }

    const itemData = this.getItemData(itemId);
    if (!itemData) {
      return { success: false, error: "Item not found" };
    }

    // Check if stackable
    if (!itemData.stackable) {
      // Check if we have space for non-stackable items
      const currentCount = this.getItemCount(itemId);
      const maxStack = itemData.maxStack || 1;

      if (currentCount + amount > maxStack) {
        return { success: false, error: i18n.t("errors.notEnoughSpace") };
      }
    }

    // Add item
    this.player.addItem(itemId, amount);

    console.log(`📦 Added ${amount}x ${itemData.name} to inventory`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("inventory:itemAdded", {
        detail: { itemId, amount },
      }),
    );

    return { success: true, itemId, amount };
  }

  /**
   * Remove item from inventory
   * @param {string} itemId - Item ID
   * @param {number} amount - Amount to remove
   * @returns {Object} Result
   */
  removeItem(itemId, amount = 1) {
    if (amount <= 0) {
      return { success: false, error: "Invalid amount" };
    }

    if (!this.hasItem(itemId, amount)) {
      return { success: false, error: i18n.t("errors.notEnoughItems") };
    }

    // Remove item
    this.player.removeItem(itemId, amount);

    console.log(`📦 Removed ${amount}x ${itemId} from inventory`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("inventory:itemRemoved", {
        detail: { itemId, amount },
      }),
    );

    return { success: true, itemId, amount };
  }

  /**
   * Check if player has item
   * @param {string} itemId - Item ID
   * @param {number} amount - Amount to check
   * @returns {boolean} True if has enough
   */
  hasItem(itemId, amount = 1) {
    return this.player.hasItem(itemId, amount);
  }

  /**
   * Get item count
   * @param {string} itemId - Item ID
   * @returns {number} Item count
   */
  getItemCount(itemId) {
    return this.player.getItemCount(itemId);
  }

  /**
   * Use a consumable item
   * @param {string} itemId - Item ID
   * @returns {Object} Result
   */
  useItem(itemId) {
    const itemData = this.getItemData(itemId);
    if (!itemData) {
      return { success: false, error: "Item not found" };
    }

    if (!itemData.consumable) {
      return { success: false, error: "Item is not consumable" };
    }

    if (!this.hasItem(itemId, 1)) {
      return { success: false, error: "Item not in inventory" };
    }

    // Check if energy is already full before using
    if (
      itemData.energyRestore &&
      this.player.data.energy >= this.player.data.maxEnergy
    ) {
      return { success: false, error: "Sua energia já está cheia!" };
    }

    // Apply effects
    const effects = {};

    if (itemData.energyRestore) {
      const restored = Math.min(
        itemData.energyRestore,
        this.player.data.maxEnergy - this.player.data.energy,
      );
      this.player.addEnergy(itemData.energyRestore);
      effects.energy = restored;
    }

    if (itemData.healthRestore) {
      this.player.data.health = Math.min(
        this.player.data.maxHealth || 100,
        (this.player.data.health || 100) + itemData.healthRestore,
      );
      effects.health = itemData.healthRestore;
    }

    // Consume item
    this.removeItem(itemId, 1);

    console.log(`🍽️ Used ${itemData.name}`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("inventory:itemUsed", {
        detail: { itemId, effects },
      }),
    );

    return { success: true, effects };
  }

  /**
   * Sell item
   * @param {string} itemId - Item ID
   * @param {number} amount - Amount to sell
   * @returns {Object} Result
   */
  sellItem(itemId, amount = 1) {
    const itemData = this.getItemData(itemId);
    if (!itemData) {
      return { success: false, error: "Item not found" };
    }

    if (!this.hasItem(itemId, amount)) {
      return { success: false, error: i18n.t("errors.notEnoughItems") };
    }

    if (!itemData.sellPrice) {
      return { success: false, error: i18n.t("errors.cannotSell") };
    }

    const totalValue = itemData.sellPrice * amount;

    // Remove item and add gold
    this.removeItem(itemId, amount);
    this.player.addGold(totalValue);

    console.log(`💰 Sold ${amount}x ${itemData.name} for ${totalValue} gold`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("inventory:itemSold", {
        detail: { itemId, amount, gold: totalValue },
      }),
    );

    return { success: true, itemId, amount, gold: totalValue };
  }

  /**
   * Sell all items in inventory
   * @returns {Object} Result
   */
  sellAllItems() {
    const items = this.getSellables();

    if (items.length === 0) {
      return { success: false, error: i18n.t("errors.noItemsToSell") };
    }

    let totalGold = 0;
    let itemCount = 0;

    items.forEach((item) => {
      const value = item.sellPrice * item.count;
      totalGold += value;
      itemCount += item.count;
      this.removeItem(item.id, item.count);
    });

    this.player.addGold(totalGold);

    console.log(`💰 Sold all items for ${totalGold} gold`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("inventory:itemSold", {
        detail: { itemCount, gold: totalGold },
      }),
    );

    return { success: true, itemCount, gold: totalGold };
  }

  /**
   * Get inventory as array of items with data
   * @returns {Array} Inventory items
   */
  getInventoryArray() {
    const inventory = this.player.getInventory();
    const items = [];

    for (const [itemId, count] of Object.entries(inventory)) {
      const itemData = this.getItemData(itemId);
      if (itemData) {
        items.push({
          id: itemId,
          count,
          ...itemData,
        });
      }
    }

    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get inventory grouped by category
   * @returns {Object} Categorized inventory
   */
  getInventoryByCategory() {
    const items = this.getInventoryArray();
    const categorized = {};

    items.forEach((item) => {
      const category = item.category || "other";
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(item);
    });

    return categorized;
  }

  /**
   * Get total inventory weight/size
   * @returns {number} Total items count
   */
  getInventorySize() {
    const inventory = this.player.getInventory();
    return Object.values(inventory).reduce((sum, count) => sum + count, 0);
  }

  /**
   * Get inventory value (total sell price)
   * @returns {number} Total value
   */
  getInventoryValue() {
    const items = this.getInventoryArray();
    return items.reduce((total, item) => {
      return total + (item.sellPrice || 0) * item.count;
    }, 0);
  }

  /**
   * Check if inventory has space
   * @param {number} slotsNeeded - Slots needed
   * @returns {boolean} True if has space
   */
  hasSpace(slotsNeeded = 1) {
    const currentSlots = Object.keys(this.player.getInventory()).length;
    return currentSlots + slotsNeeded <= this.maxSlots;
  }

  /**
   * Sort inventory
   * @param {string} sortBy - Sort criteria (name, count, value, category)
   * @returns {Array} Sorted inventory
   */
  sortInventory(sortBy = "name") {
    const items = this.getInventoryArray();

    switch (sortBy) {
      case "count":
        return items.sort((a, b) => b.count - a.count);
      case "value":
        return items.sort((a, b) => {
          const valueA = (a.sellPrice || 0) * a.count;
          const valueB = (b.sellPrice || 0) * b.count;
          return valueB - valueA;
        });
      case "category":
        return items.sort((a, b) => {
          const catCompare = (a.category || "").localeCompare(b.category || "");
          return catCompare !== 0 ? catCompare : a.name.localeCompare(b.name);
        });
      case "name":
      default:
        return items.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  /**
   * Search inventory
   * @param {string} query - Search query
   * @returns {Array} Matching items
   */
  searchInventory(query) {
    const items = this.getInventoryArray();
    const lowerQuery = query.toLowerCase();

    return items.filter((item) => {
      return (
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery) ||
        item.category?.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * Get items by category
   * @param {string} category - Category name
   * @returns {Array} Items in category
   */
  getItemsByCategory(category) {
    const items = this.getInventoryArray();
    return items.filter((item) => item.category === category);
  }

  /**
   * Get consumable items
   * @returns {Array} Consumable items
   */
  getConsumables() {
    const items = this.getInventoryArray();
    return items.filter((item) => item.consumable);
  }

  /**
   * Get sellable items
   * @returns {Array} Sellable items
   */
  getSellables() {
    const items = this.getInventoryArray();
    return items.filter((item) => item.sellPrice > 0);
  }

  /**
   * Check if item is owned
   * @param {string} itemId - Item ID
   * @returns {boolean} True if owned
   */
  hasItemInInventory(itemId) {
    return this.getItemCount(itemId) > 0;
  }

  /**
   * Get item stack info
   * @param {string} itemId - Item ID
   * @returns {Object} Stack info
   */
  getItemStackInfo(itemId) {
    const itemData = this.getItemData(itemId);
    const currentCount = this.getItemCount(itemId);

    if (!itemData) {
      return null;
    }

    return {
      current: currentCount,
      max: itemData.maxStack || 1,
      stackable: itemData.stackable || false,
      percentage: itemData.maxStack
        ? (currentCount / itemData.maxStack) * 100
        : 0,
    };
  }

  /**
   * Transfer items (for future multiplayer)
   * @param {string} itemId - Item ID
   * @param {number} amount - Amount to transfer
   * @param {Object} targetPlayer - Target player
   * @returns {Object} Result
   */
  transferItem(itemId, amount, targetPlayer) {
    if (!this.hasItem(itemId, amount)) {
      return { success: false, error: i18n.t("errors.notEnoughItems") };
    }

    // Remove from this player
    this.removeItem(itemId, amount);

    // Add to target player
    targetPlayer.addItem(itemId, amount);

    console.log(`📦 Transferred ${amount}x ${itemId}`);

    return { success: true, itemId, amount };
  }

  /**
   * Get equipped items (for future equipment system)
   * @returns {Object} Equipped items
   */
  getEquippedItems() {
    return this.player.data.equipped || {};
  }

  /**
   * Clear inventory
   * @returns {boolean} Success
   */
  clearInventory() {
    this.player.clearInventory();
    console.log("🗑️ Inventory cleared");

    // Dispatch event
    window.dispatchEvent(new CustomEvent("inventory:cleared"));

    return true;
  }

  /**
   * Get inventory statistics
   * @returns {Object} Inventory stats
   */
  getStats() {
    const items = this.getInventoryArray();
    const categories = {};

    items.forEach((item) => {
      const category = item.category || "other";
      if (!categories[category]) {
        categories[category] = { count: 0, value: 0 };
      }
      categories[category].count += item.count;
      categories[category].value += (item.sellPrice || 0) * item.count;
    });

    return {
      totalItems: this.getInventorySize(),
      uniqueItems: items.length,
      totalValue: this.getInventoryValue(),
      maxSlots: this.maxSlots,
      usedSlots: items.length,
      categories,
    };
  }

  /**
   * Get item localized name
   * @param {string} itemId - Item ID
   * @param {string} lang - Language code
   * @returns {string} Localized name
   */
  getItemName(itemId, lang = "pt-BR") {
    const itemData = this.getItemData(itemId);
    if (!itemData) return itemId;

    if (lang === "pt-BR" && itemData.namePtBR) {
      return itemData.namePtBR;
    }

    return itemData.name || itemId;
  }

  /**
   * Get item localized description
   * @param {string} itemId - Item ID
   * @param {string} lang - Language code
   * @returns {string} Localized description
   */
  getItemDescription(itemId, lang = "pt-BR") {
    const itemData = this.getItemData(itemId);
    if (!itemData) return "";

    if (lang === "pt-BR" && itemData.descriptionPtBR) {
      return itemData.descriptionPtBR;
    }

    return itemData.description || "";
  }
}
