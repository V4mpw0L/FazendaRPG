/**
 * FazendaRPG - NPCs UI
 * Manages NPC display and interactions
 * @version 0.0.13
 */

import i18n from "../utils/i18n.js";
import { renderItemIcon } from "../utils/iconRenderer.js";

export default class NPCSUI {
  constructor(player, modal, notifications, inventorySystem) {
    this.player = player;
    this.modal = modal;
    this.notifications = notifications;
    this.inventorySystem = inventorySystem;
    this.container = null;
    this.npcsData = null;
    this.initialized = false;
    this.stockRestoreInterval = null;
    this.friendshipDecayInterval = null;
  }

  /**
   * Set systems after construction
   */
  setSystems(farmSystem, skillSystem) {
    this.farmSystem = farmSystem;
    this.skillSystem = skillSystem;
  }

  /**
   * Start stock restoration timer (calculates based on time passed)
   */
  startStockRestoration() {
    // Check and restore stock every 10 seconds based on time passed
    this.stockRestoreInterval = setInterval(() => {
      this.restoreStock();
    }, 10000); // 10 seconds
  }

  /**
   * Start friendship decay timer (decreases over time)
   * Decay: -1% every 5 minutes of real time
   */
  startFriendshipDecay() {
    // Check friendship decay every 60 seconds
    this.friendshipDecayInterval = setInterval(() => {
      this.decayFriendship();
    }, 60000); // 60 seconds
  }

  /**
   * Decay friendship for all NPCs based on time since last interaction
   * -1% every 5 minutes (300 seconds) of real time
   */
  decayFriendship() {
    if (!this.npcsData) return;

    const now = Date.now();

    Object.keys(this.npcsData).forEach((npcId) => {
      const npc = this.npcsData[npcId];

      // Initialize last interaction if not exists
      if (!this.player.data.npcLastInteraction) {
        this.player.data.npcLastInteraction = {};
      }

      if (!this.player.data.npcLastInteraction[npcId]) {
        this.player.data.npcLastInteraction[npcId] = now;
        return;
      }

      const lastInteraction = this.player.data.npcLastInteraction[npcId];
      const minutesPassed = (now - lastInteraction) / (1000 * 60);

      // Decay 1% every 5 minutes
      if (minutesPassed >= 5) {
        const fiveMinutesPassed = Math.floor(minutesPassed / 5);
        const decayAmount = fiveMinutesPassed;

        if (decayAmount > 0 && npc.friendship > 0) {
          npc.friendship = Math.max(0, npc.friendship - decayAmount);
          this.player.data.npcs[npcId] = npc.friendship;
          this.player.data.npcLastInteraction[npcId] = now;

          console.log(
            `💔 ${npcId} friendship decayed by ${decayAmount}% (${Math.floor(minutesPassed)} minutes passed)`,
          );
        }
      }
    });

    this.saveNPCFriendship();
  }

  /**
   * Restore 1 stock for all items in all NPC shops
   */
  restoreStock() {
    if (!this.npcsData) return;

    const now = Date.now();

    // Initialize stock timestamps if not exists
    if (!this.player.data.npcStockTimestamp) {
      this.player.data.npcStockTimestamp = {};
    }

    let totalRestored = 0;

    Object.keys(this.npcsData).forEach((npcId) => {
      const npc = this.npcsData[npcId];

      if (npc.shop && npc.shop.items) {
        if (!this.player.data.npcStockTimestamp[npcId]) {
          this.player.data.npcStockTimestamp[npcId] = {};
        }

        npc.shop.items.forEach((item) => {
          // Initialize timestamp for this item
          if (!this.player.data.npcStockTimestamp[npcId][item.id]) {
            this.player.data.npcStockTimestamp[npcId][item.id] = now;
          }

          const lastUpdate = this.player.data.npcStockTimestamp[npcId][item.id];
          const minutesPassed = (now - lastUpdate) / (1000 * 60);

          // Restore 1 stock per minute
          if (minutesPassed >= 1 && item.stock < (item.maxStock || 100)) {
            const itemsToRestore = Math.min(
              Math.floor(minutesPassed),
              (item.maxStock || 100) - item.stock,
            );

            if (itemsToRestore > 0) {
              item.stock += itemsToRestore;
              totalRestored += itemsToRestore;
              this.player.data.npcStockTimestamp[npcId][item.id] = now;
            }
          }
        });
      }
    });

    if (totalRestored > 0) {
      this.saveNPCStock();
      console.log(`🔄 NPCs stock restored: +${totalRestored} items`);
    }
  }

  /**
   * Get friendship discount (0% to 50% based on friendship)
   */
  getFriendshipDiscount(npcId) {
    if (!this.npcsData[npcId]) return 0;

    const friendship = this.npcsData[npcId].friendship || 0;
    const maxFriendship = this.npcsData[npcId].maxFriendship || 100;

    // 50% discount at max friendship (linear scaling)
    const discountPercent = (friendship / maxFriendship) * 0.5;

    return discountPercent;
  }

  /**
   * Initialize NPCs UI
   */
  async init() {
    this.container = document.getElementById("npcs-grid");
    if (!this.container) {
      console.error("❌ NPCs container not found");
      return false;
    }

    // Load NPCs data
    try {
      const response = await fetch("./data/npcs.json");
      if (!response.ok) {
        throw new Error("Failed to load NPCs data");
      }

      const data = await response.json();

      // Load JSON structure but DON'T trust stock values
      this.npcsData = data.npcs;

      console.log(
        "⚠️ Loaded JSON data - stock values will be REPLACED by saved data",
      );

      // IMMEDIATELY load saved data to override JSON values
      this.loadNPCFriendship();
      this.loadNPCStock();

      console.log("✅ Player data loaded - JSON stock values IGNORED");

      // Start stock restoration
      this.startStockRestoration();

      // Start friendship decay
      this.startFriendshipDecay();

      this.initialized = true;
      console.log("✅ NPCs UI initialized");
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize NPCs UI:", error);
      return false;
    }
  }

  /**
   * Load NPC friendship from player data
   */
  loadNPCFriendship() {
    if (!this.player.data.npcs) {
      this.player.data.npcs = {};
    }

    // Initialize last interaction tracking
    if (!this.player.data.npcLastInteraction) {
      this.player.data.npcLastInteraction = {};
    }

    const now = Date.now();

    // Sync NPC friendship from player data
    Object.keys(this.npcsData).forEach((npcId) => {
      if (this.player.data.npcs[npcId] !== undefined) {
        this.npcsData[npcId].friendship = this.player.data.npcs[npcId];
      } else {
        // Initialize if not exists
        this.player.data.npcs[npcId] = this.npcsData[npcId].friendship || 0;
      }

      // Initialize last interaction timestamp
      if (!this.player.data.npcLastInteraction[npcId]) {
        this.player.data.npcLastInteraction[npcId] = now;
      }
    });
  }

  /**
   * Load NPC stock from player data with time-based restoration
   * CRITICAL: IGNORES JSON stock values completely after first initialization!
   */
  loadNPCStock() {
    if (!this.player.data.npcStock) {
      this.player.data.npcStock = {};
    }

    if (!this.player.data.npcStockTimestamp) {
      this.player.data.npcStockTimestamp = {};
    }

    const now = Date.now();
    let restoredItems = 0;
    let initializedItems = 0;

    // DEBUG: Check if we have saved data
    console.log("🔍 Checking player.data.npcStock:", this.player.data.npcStock);
    console.log(
      "🔍 Has saved stock data?",
      Object.keys(this.player.data.npcStock).length > 0,
    );

    Object.keys(this.npcsData).forEach((npcId) => {
      const npc = this.npcsData[npcId];
      if (npc.shop && npc.shop.items) {
        if (!this.player.data.npcStock[npcId]) {
          this.player.data.npcStock[npcId] = {};
        }

        if (!this.player.data.npcStockTimestamp[npcId]) {
          this.player.data.npcStockTimestamp[npcId] = {};
        }

        npc.shop.items.forEach((item) => {
          const maxStock = item.maxStock || 100;
          const itemId = item.id;

          // CRITICAL: Check if this item was already initialized before
          const hasSavedData =
            this.player.data.npcStock[npcId] &&
            this.player.data.npcStock[npcId][itemId] !== undefined;

          console.log(
            `🔍 ${itemId} for ${npcId}: hasSavedData=${hasSavedData}, value=${this.player.data.npcStock[npcId]?.[itemId]}`,
          );

          if (hasSavedData) {
            // ALWAYS use saved data, NEVER the JSON value!
            let currentStock = this.player.data.npcStock[npcId][itemId];

            // Ensure stock doesn't exceed max (safety check)
            currentStock = Math.min(currentStock, maxStock);

            // Calculate time-based restoration
            const lastUpdate =
              this.player.data.npcStockTimestamp[npcId][itemId] || now;
            const minutesPassed = (now - lastUpdate) / (1000 * 60);

            // Restore 1 stock per minute since last update
            if (minutesPassed >= 1 && currentStock < maxStock) {
              const itemsToRestore = Math.min(
                Math.floor(minutesPassed),
                maxStock - currentStock,
              );

              if (itemsToRestore > 0) {
                currentStock += itemsToRestore;
                restoredItems += itemsToRestore;
                console.log(
                  `🔄 Restored ${itemsToRestore}x ${itemId} for ${npcId} (${currentStock}/${maxStock})`,
                );
              }

              // Update timestamp
              this.player.data.npcStockTimestamp[npcId][itemId] = now;
            }

            // Apply the calculated stock (OVERRIDE JSON VALUE!)
            item.stock = currentStock;
            this.player.data.npcStock[npcId][itemId] = currentStock;
          } else {
            // First time seeing this item - initialize with max stock
            const initialStock = maxStock;

            item.stock = initialStock;
            this.player.data.npcStock[npcId][itemId] = initialStock;
            this.player.data.npcStockTimestamp[npcId][itemId] = now;
            initializedItems++;

            console.log(
              `🆕 First time init: ${itemId} for ${npcId} = ${initialStock}/${maxStock}`,
            );
            console.log(
              `⚠️ WARNING: This should only appear on FIRST game load!`,
            );
          }
        });
      }
    });

    if (restoredItems > 0) {
      console.log(`✅ Total restored: ${restoredItems} items`);
    }

    if (initializedItems > 0) {
      console.log(`✅ Total initialized: ${initializedItems} new items`);
    }

    // Force save to ensure data is persisted
    this.saveNPCStock();
  }

  /**
   * Save NPC stock to player data with timestamps
   */
  saveNPCStock() {
    if (!this.player.data.npcStock) {
      this.player.data.npcStock = {};
    }

    if (!this.player.data.npcStockTimestamp) {
      this.player.data.npcStockTimestamp = {};
    }

    const now = Date.now();
    let savedCount = 0;

    Object.keys(this.npcsData).forEach((npcId) => {
      const npc = this.npcsData[npcId];
      if (npc.shop && npc.shop.items) {
        if (!this.player.data.npcStock[npcId]) {
          this.player.data.npcStock[npcId] = {};
        }

        if (!this.player.data.npcStockTimestamp[npcId]) {
          this.player.data.npcStockTimestamp[npcId] = {};
        }

        npc.shop.items.forEach((item) => {
          // Save current stock from the item object
          this.player.data.npcStock[npcId][item.id] = item.stock;
          savedCount++;

          // Update timestamp only if stock is not at max
          if (item.stock < (item.maxStock || 100)) {
            this.player.data.npcStockTimestamp[npcId][item.id] = now;
          }
        });
      }
    });

    console.log(`💾 Saved stock for ${savedCount} items to player data`);
    console.log(
      "📦 Current stock data:",
      JSON.stringify(this.player.data.npcStock, null, 2),
    );

    // Dispatch event to trigger save
    window.dispatchEvent(new CustomEvent("player:dataChanged"));

    // Force immediate save to localStorage
    if (this.player && this.player.save) {
      this.player.save();
      console.log("✅ Forced player.save() called");
    }
  }

  /**
   * Save NPC friendship to player data
   */
  saveNPCFriendship() {
    if (!this.player.data.npcs) {
      this.player.data.npcs = {};
    }

    // Save all NPC friendship values to player data
    Object.keys(this.npcsData).forEach((npcId) => {
      this.player.data.npcs[npcId] = this.npcsData[npcId].friendship;
    });

    // Dispatch event to trigger save
    window.dispatchEvent(new CustomEvent("player:dataChanged"));
  }

  /**
   * Render NPCs
   */
  render() {
    if (!this.container || !this.npcsData) return;

    // CRITICAL: Reload ALL data from player before rendering
    this.loadNPCFriendship();
    this.loadNPCStock();

    this.container.innerHTML = "";

    const npcs = Object.values(this.npcsData);

    if (npcs.length === 0) {
      this.container.innerHTML = `
                <div class="npcs-empty">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">👥</div>
                    <p>Nenhum NPC disponível</p>
                </div>
            `;
      return;
    }

    npcs.forEach((npc) => {
      const npcCard = this.createNPCCard(npc);
      this.container.appendChild(npcCard);
    });
  }

  /**
   * Create NPC card element
   * @param {Object} npc - NPC data
   * @returns {HTMLElement}
   */
  createNPCCard(npc) {
    const card = document.createElement("div");
    card.className = "city-card";

    const friendshipPercent = (npc.friendship / npc.maxFriendship) * 100;
    const name = npc.namePtBR || npc.name;
    const role = npc.rolePtBR || npc.role;
    const description = npc.descriptionPtBR || npc.description;

    card.innerHTML = `
            <div class="npc-avatar" style="text-align: center;">${npc.avatar}</div>
            <div class="npc-info">
                <h3 class="npc-name">${name}</h3>
                <p class="npc-role">${role}</p>
                <p class="npc-description">${description}</p>
            </div>
            <div class="npc-friendship">
                <div class="friendship-label" style="color: #f1c40f; font-weight: 700; font-size: 0.875rem;">Amizade: ${Math.floor(friendshipPercent)}%</div>
                <div class="friendship-bar">
                    <div class="friendship-fill" style="width: ${friendshipPercent}%"></div>
                </div>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-top: 0.5rem; padding: 0.5rem; font-size: 0.875rem; font-weight: 600;">💬 Conversar</button>
        `;

    const conversarBtn = card.querySelector(".btn");
    conversarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.showNPCDialog(npc);
    });

    return card;
  }

  /**
   * Show NPC dialog
   * @param {Object} npc - NPC data
   */
  showNPCDialog(npc) {
    const name = npc.namePtBR || npc.name;
    const greetings = npc.dialogue?.greetingPtBR ||
      npc.dialogue?.greeting || ["Olá!"];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];

    const buttons = [];

    // Talk button - ALWAYS FIRST
    buttons.push({
      text: "💬 Conversar",
      class: "btn-primary",
      onClick: () => {
        const gained = this.increaseFriendship(npc.id);
        this.notifications.success(
          `Você conversou com ${name} (+${gained}% amizade)`,
        );
        this.render();
        return true;
      },
    });

    // Shop button
    if (npc.shop && npc.shop.items) {
      buttons.push({
        text: "🛒 Loja",
        class: "btn-success",
        onClick: () => {
          this.showNPCShop(npc);
          return false; // Don't close modal
        },
      });
    }

    // Quests button
    if (npc.quests && npc.quests.length > 0) {
      buttons.push({
        text: "📜 Missões",
        class: "btn-secondary",
        onClick: () => {
          this.notifications.info("Sistema de missões em breve!");
          return false;
        },
      });
    }

    buttons.push({
      text: "Sair",
      class: "btn-secondary",
      onClick: () => true,
    });

    const content = `
            <div style="text-align: center; padding: 1rem 0;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">${npc.avatar}</div>
                <h2 style="margin: 0.5rem 0;">${name}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${npc.rolePtBR || npc.role}</p>
                <div style="background: var(--bg-accent); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--brand-primary); margin-bottom: 1rem;">
                    <p style="font-style: italic; margin: 0;">"${greeting}"</p>
                </div>
                <div style="margin-top: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
                        <span style="font-weight: 600;">Amizade:</span>
                        <div style="flex: 1; max-width: 200px; background: var(--bg-accent); height: 20px; border-radius: 10px; overflow: hidden; border: 2px solid var(--border-color);">
                            <div style="height: 100%; background: linear-gradient(90deg, #e74c3c, #f39c12, #5caa1f); width: ${(npc.friendship / npc.maxFriendship) * 100}%; transition: width 0.3s;"></div>
                        </div>
                        <span style="font-weight: 700;">${npc.friendship}/${npc.maxFriendship}</span>
                    </div>
                </div>
            </div>
        `;

    this.modal.show({
      title: `👥 ${name}`,
      content,
      buttons,
      closable: true,
      size: "medium",
    });
  }

  /**
   * Show NPC shop
   * @param {Object} npc - NPC data
   */
  showNPCShop(npc) {
    if (!npc.shop || !npc.shop.items) {
      this.notifications.error("Este NPC não tem loja disponível!");
      return;
    }

    // CRITICAL: Reload stock data to ensure we have latest saved values
    // This prevents JSON default values from being shown
    this.loadNPCStock();

    const name = npc.namePtBR || npc.name;
    const shopItems = npc.shop.items;
    const friendship = npc.friendship || 0;
    const maxFriendship = npc.maxFriendship || 100;
    const friendshipPercent = Math.floor((friendship / maxFriendship) * 100);
    const discount = this.getFriendshipDiscount(npc.id);
    const discountPercent = Math.floor(discount * 100);

    let friendshipBadge = "";
    if (discountPercent > 0) {
      friendshipBadge = `<div style="display: inline-block; background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 700; margin-top: 0.5rem;">💝 Amizade ${friendshipPercent}% • Desconto ${discountPercent}%!</div>`;
    } else if (friendshipPercent > 0) {
      friendshipBadge = `<div style="display: inline-block; background: var(--bg-accent); border: 2px solid var(--border-color); color: var(--text-primary); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; margin-top: 0.5rem;">💚 Amizade ${friendshipPercent}%</div>`;
    }

    let content = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="font-size: 3rem;">${npc.avatar}</div>
        <h3 style="margin: 0.5rem 0;">Loja de ${name}</h3>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">Seu ouro: <span style="color: #FFD700; text-shadow: 0 0 3px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.5); font-weight: 700;">${this.player.data.gold}g</span></p>
        ${friendshipBadge}
      </div>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; max-height: 400px; overflow-y: auto; padding: 0.5rem;">
    `;

    shopItems.forEach((shopItem) => {
      const itemData = this.inventorySystem.getItemData(shopItem.id);
      if (!itemData) return;

      const itemName = itemData.namePtBR || itemData.name;
      const itemDesc = itemData.descriptionPtBR || itemData.description || "";
      const basePrice = Math.floor(
        itemData.buyPrice * (shopItem.priceMultiplier || 1.0),
      );

      // Apply friendship discount
      const discount = this.getFriendshipDiscount(npc.id);
      const price = Math.floor(basePrice * (1 - discount));
      const discountAmount = basePrice - price;

      const stock = shopItem.stock;
      const canAfford = this.player.data.gold >= price;
      const outOfStock = stock <= 0;

      // Check if it's a seed and get required level
      let requiredLevelInfo = "";
      let canUse = true;
      if (itemData.category === "seeds") {
        const cropId = itemData.id.replace("_seed", "");
        const cropData = this.farmSystem?.getCropData(cropId);
        if (cropData && cropData.requiredLevel) {
          const playerLevel = this.skillSystem?.getLevel("farming") || 1;
          canUse = playerLevel >= cropData.requiredLevel;
          requiredLevelInfo = `<div style="font-size: 0.65rem; color: ${canUse ? "#4caf50" : "#ff6b6b"}; font-weight: 600; margin: 0.25rem 0;">${canUse ? "✓" : "🔒"} Nível ${cropData.requiredLevel}</div>`;
        }
      }

      const isLocked = !canUse;
      const buttonDisabled = !canAfford || isLocked || outOfStock;
      const buttonClass =
        isLocked || outOfStock
          ? "btn-secondary"
          : canAfford
            ? "btn-success"
            : "btn-secondary";

      // Stock display with banner
      const stockDisplay = `<div style="background: ${outOfStock ? "linear-gradient(135deg, #e74c3c, #c0392b)" : "linear-gradient(135deg, #5caa1f, #4a8c19)"}; color: white; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.75rem; margin-bottom: 0.5rem; font-weight: 600; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
        📦 Estoque: <span style="font-weight: 700; font-size: 0.875rem;">${stock}</span>
      </div>`;

      let priceDisplay = `<div style="color: #FFD700; text-shadow: 0 0 3px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.5); font-weight: 700; font-size: 1rem; margin-bottom: 0.25rem;">
        <img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${price}g
      </div>`;

      if (discountAmount > 0) {
        priceDisplay = `
          <div style="color: var(--text-secondary); font-size: 0.75rem; text-decoration: line-through; margin-bottom: 0.125rem;">${basePrice}g</div>
          <div style="color: #e74c3c; font-weight: 700; font-size: 1rem; margin-bottom: 0.25rem;">
            <img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${price}g 💝
          </div>
        `;
      }

      let buttonText =
        '<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> Comprar';
      if (isLocked) {
        buttonText = "🔒 Bloqueado";
      } else if (outOfStock) {
        buttonText = "❌ Sem Estoque";
      }

      content += `
        <div class="shop-item" style="background: var(--bg-accent); padding: 0.75rem; border-radius: 8px; border: 2px solid var(--border-color); display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; min-height: 200px; ${isLocked || outOfStock ? "opacity: 0.6;" : ""}">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${renderItemIcon(itemData, { size: "2.5rem" })}</div>
          <div style="font-weight: 600; font-size: 0.875rem; color: var(--text-primary); margin-bottom: 0.25rem; line-height: 1.2;">${itemName}</div>
          ${requiredLevelInfo}
          ${stockDisplay}
          ${priceDisplay}
          <button class="btn ${buttonClass}"
                  data-item-id="${shopItem.id}"
                  data-price="${price}"
                  data-npc-id="${npc.id}"
                  ${buttonDisabled ? "disabled" : ""}
                  style="width: 100%; padding: 0.5rem; font-size: 0.75rem; margin-top: auto;">
            ${buttonText}
          </button>
        </div>
      `;
    });

    content += `</div>`;

    this.modal.show({
      title: `🛒 Loja de ${name}`,
      content,
      buttons: [
        {
          text: "Fechar",
          class: "btn-secondary",
          onClick: () => true,
        },
      ],
      closable: true,
      size: "large",
    });

    // Add event listeners to buy buttons
    setTimeout(() => {
      const buyButtons = document.querySelectorAll(".shop-item button");
      buyButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const itemId = button.getAttribute("data-item-id");
          const price = parseInt(button.getAttribute("data-price"));
          const npcId = button.getAttribute("data-npc-id");
          this.buyItem(this.npcsData[npcId], itemId, price);
        });
      });
    }, 50);
  }

  /**
   * Buy item from shop
   * @param {Object} npc - NPC data
   * @param {string} itemId - Item ID to buy
   * @param {number} price - Item price
   */
  buyItem(npc, itemId, price) {
    const itemData = this.inventorySystem.getItemData(itemId);
    if (!itemData) {
      this.notifications.error("Item não encontrado!");
      return;
    }

    // Check level requirement for seeds
    if (itemData.category === "seeds") {
      const cropId = itemId.replace("_seed", "");
      const cropData = this.farmSystem?.getCropData(cropId);
      if (cropData && cropData.requiredLevel) {
        const playerLevel = this.skillSystem?.getLevel("farming") || 1;
        if (playerLevel < cropData.requiredLevel) {
          this.notifications.error(
            `Você precisa do nível ${cropData.requiredLevel} de Farming!`,
          );
          return;
        }
      }
    }

    // Find shop item for stock checking
    const shopItem = npc.shop.items.find((item) => item.id === itemId);
    if (!shopItem) {
      this.notifications.error("Item não encontrado na loja!");
      return;
    }

    if (shopItem.stock <= 0) {
      this.notifications.error("Este item está fora de estoque!");
      return;
    }

    const itemName = itemData.namePtBR || itemData.name;
    const maxBuyable = Math.min(
      shopItem.stock,
      Math.floor(this.player.data.gold / price),
    );

    // Show quantity dialog
    const content = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">${renderItemIcon(itemData, { size: "4rem" })}</div>
        <h3 style="margin: 0.5rem 0; color: var(--text-primary);">${itemName}</h3>
        <p style="color: #FFD700; text-shadow: 0 0 3px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.5); font-weight: 700; font-size: 1.125rem;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${price}g por unidade</p>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">Você tem: <img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${this.player.data.gold}g</p>
      </div>

      <div style="margin: 1rem 0;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">
          Quantidade: <span style="color: var(--text-secondary); font-weight: 400; font-size: 0.875rem;">(Máx: ${maxBuyable})</span>
        </label>
        <input
          type="number"
          id="buy-amount"
          min="1"
          max="${maxBuyable}"
          value="1"
          style="width: 100%; padding: 0.75rem; font-size: 1rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--bg-accent); color: var(--text-primary);"
        >
      </div>

      <div style="margin-top: 1rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
        <button class="quick-buy-btn" id="quick-1">1</button>
        <button class="quick-buy-btn" id="quick-5">5</button>
        <button class="quick-buy-btn" id="quick-10">10</button>
        <button class="quick-buy-btn" id="quick-max">Máx</button>
      </div>

      <div style="background: var(--bg-accent); padding: var(--spacing-md); border-radius: 8px; margin-top: var(--spacing-md); border: 2px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
          <span>Total:</span>
          <span id="preview-cost" style="font-weight: 700; color: #8B0000;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${price}g</span>
        </div>
      </div>
    `;

    this.modal.show({
      title: `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> Comprar ${itemName}`,
      content,
      buttons: [
        {
          text: "Cancelar",
          class: "btn-secondary",
          onClick: () => {
            setTimeout(() => {
              this.showNPCShop(npc);
            }, 350);
            return true;
          },
        },
        {
          text: `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> Comprar`,
          class: "btn-success",
          onClick: () => {
            const amount = parseInt(
              document.getElementById("buy-amount")?.value || "1",
            );
            const totalCost = amount * price;

            if (amount <= 0) {
              this.notifications.error("Quantidade inválida!");
              return false;
            }

            if (this.player.data.gold < totalCost) {
              this.notifications.error("Ouro insuficiente!");
              return false;
            }

            // Check stock again
            if (shopItem.stock < amount) {
              this.notifications.error("Estoque insuficiente!");
              return false;
            }

            // Execute purchase
            this.player.removeGold(totalCost);
            this.inventorySystem.addItem(itemId, amount);

            // Decrease stock and save immediately
            const oldStock = shopItem.stock;
            shopItem.stock -= amount;
            const newStock = shopItem.stock;

            console.log(`🛒 BUYING: ${amount}x ${itemId}`);
            console.log(`📊 Stock change: ${oldStock} → ${newStock}`);

            // Update player data directly to ensure it's saved
            if (!this.player.data.npcStock[npc.id]) {
              this.player.data.npcStock[npc.id] = {};
            }
            this.player.data.npcStock[npc.id][itemId] = newStock;

            // Update timestamp
            if (!this.player.data.npcStockTimestamp[npc.id]) {
              this.player.data.npcStockTimestamp[npc.id] = {};
            }
            this.player.data.npcStockTimestamp[npc.id][itemId] = Date.now();

            console.log(
              `💾 Saved to player.data.npcStock[${npc.id}][${itemId}] = ${newStock}`,
            );

            // Save all stock data
            this.saveNPCStock();

            // Double-check it was saved
            setTimeout(() => {
              const savedValue = this.player.data.npcStock[npc.id]?.[itemId];
              console.log(`✅ Verification: Stock saved as ${savedValue}`);
              if (savedValue !== newStock) {
                console.error(
                  `❌ ERROR: Stock mismatch! Expected ${newStock}, got ${savedValue}`,
                );
              }
            }, 100);

            this.notifications.success(
              `Comprou ${amount}x ${itemName} por ${totalCost}g!`,
            );

            // Increase friendship based on amount bought (progressive)
            const friendshipGain = Math.min(amount, 5); // Max 5% per purchase
            for (let i = 0; i < friendshipGain; i++) {
              this.increaseFriendship(npc.id);
            }

            // Reopen shop after purchase with delay
            setTimeout(() => {
              this.showNPCShop(npc);
            }, 350);
            return true;
          },
        },
      ],
      closable: true,
    });

    // Setup quick buttons
    setTimeout(() => {
      const amountInput = document.getElementById("buy-amount");

      const updatePreview = () => {
        const amount = parseInt(amountInput?.value || "1");
        const totalCost = amount * price;
        const costEl = document.getElementById("preview-cost");
        if (costEl) {
          costEl.innerHTML = `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${totalCost}g`;
          costEl.style.color = "#8B0000";
        }
      };

      amountInput?.addEventListener("input", updatePreview);

      document.getElementById("quick-1")?.addEventListener("click", () => {
        if (amountInput) {
          amountInput.value = "1";
          updatePreview();
        }
      });

      document.getElementById("quick-5")?.addEventListener("click", () => {
        if (amountInput) {
          amountInput.value = Math.min(5, maxBuyable).toString();
          updatePreview();
        }
      });

      document.getElementById("quick-10")?.addEventListener("click", () => {
        if (amountInput) {
          amountInput.value = Math.min(10, maxBuyable).toString();
          updatePreview();
        }
      });

      document.getElementById("quick-max")?.addEventListener("click", () => {
        if (amountInput) {
          amountInput.value = maxBuyable.toString();
          updatePreview();
        }
      });
    }, 50);
  }

  /**
   * Increase friendship with NPC (progressive gain based on current friendship)
   * @param {string} npcId - NPC ID
   * @returns {number} - Amount of friendship gained
   */
  increaseFriendship(npcId) {
    if (!this.npcsData[npcId]) return 0;

    const oldFriendship = this.npcsData[npcId].friendship;
    const maxFriendship = this.npcsData[npcId].maxFriendship || 100;
    const currentPercent = (oldFriendship / maxFriendship) * 100;

    // Progressive gain based on current friendship level
    // 0-25%: +1% per interaction
    // 25-50%: +2% per interaction
    // 50-75%: +3% per interaction
    // 75-100%: +5% per interaction
    let gainAmount = 1;
    if (currentPercent >= 75) {
      gainAmount = 5;
    } else if (currentPercent >= 50) {
      gainAmount = 3;
    } else if (currentPercent >= 25) {
      gainAmount = 2;
    }

    this.npcsData[npcId].friendship = Math.min(
      maxFriendship,
      this.npcsData[npcId].friendship + gainAmount,
    );

    // Save to player data
    if (!this.player.data.npcs) {
      this.player.data.npcs = {};
    }
    this.player.data.npcs[npcId] = this.npcsData[npcId].friendship;

    // Update last interaction timestamp
    if (!this.player.data.npcLastInteraction) {
      this.player.data.npcLastInteraction = {};
    }
    this.player.data.npcLastInteraction[npcId] = Date.now();

    // Trigger save
    this.saveNPCFriendship();

    console.log(
      `💚 ${npcId} friendship: ${oldFriendship} → ${this.npcsData[npcId].friendship} (+${gainAmount})`,
    );

    // Check if reached max friendship
    if (
      this.npcsData[npcId].friendship >= maxFriendship &&
      oldFriendship < maxFriendship
    ) {
      const npcName =
        this.npcsData[npcId].namePtBR || this.npcsData[npcId].name;
      this.notifications.success(
        `🎉 Amizade máxima com ${npcName}! Você ganhou 50% de desconto!`,
      );
    }

    return gainAmount;
  }

  /**
   * Refresh NPCs
   */
  refresh() {
    this.render();
  }

  /**
   * Cleanup when UI is destroyed
   */
  destroy() {
    if (this.stockRestoreInterval) {
      clearInterval(this.stockRestoreInterval);
      this.stockRestoreInterval = null;
    }
    if (this.friendshipDecayInterval) {
      clearInterval(this.friendshipDecayInterval);
      this.friendshipDecayInterval = null;
    }
  }
}
