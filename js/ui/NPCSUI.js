/**
 * FazendaRPG - NPCs UI
 * Manages NPC display and interactions
 * @version 0.0.7
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
  }

  /**
   * Set systems after construction
   */
  setSystems(farmSystem, skillSystem) {
    this.farmSystem = farmSystem;
    this.skillSystem = skillSystem;
  }

  /**
   * Start stock restoration timer (1 item per minute for each NPC)
   */
  startStockRestoration() {
    // Restore 1 stock every 60 seconds
    this.stockRestoreInterval = setInterval(() => {
      this.restoreStock();
    }, 60000); // 60 seconds
  }

  /**
   * Restore 1 stock for all items in all NPC shops
   */
  restoreStock() {
    if (!this.npcsData) return;

    Object.values(this.npcsData).forEach((npc) => {
      if (npc.shop && npc.shop.items) {
        npc.shop.items.forEach((item) => {
          if (item.stock < (item.maxStock || 100)) {
            item.stock += 1;
          }
        });
      }
    });

    console.log("🔄 NPCs stock restored +1");
  }

  /**
   * Get friendship discount (0% to 20% based on friendship)
   */
  getFriendshipDiscount(npcId) {
    if (!this.npcsData[npcId]) return 0;

    const friendship = this.npcsData[npcId].friendship || 0;
    const maxFriendship = this.npcsData[npcId].maxFriendship || 100;

    // 20% discount at max friendship
    const discountPercent = (friendship / maxFriendship) * 0.2;

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
      this.npcsData = data.npcs;

      // Initialize NPC friendship from player data
      this.loadNPCFriendship();

      // Load stock from player data or initialize
      this.loadNPCStock();

      // Start stock restoration
      this.startStockRestoration();

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

    // Sync NPC friendship from player data
    Object.keys(this.npcsData).forEach((npcId) => {
      if (this.player.data.npcs[npcId] !== undefined) {
        this.npcsData[npcId].friendship = this.player.data.npcs[npcId];
      } else {
        // Initialize if not exists
        this.player.data.npcs[npcId] = this.npcsData[npcId].friendship || 0;
      }
    });
  }

  /**
   * Load NPC stock from player data
   */
  loadNPCStock() {
    if (!this.player.data.npcStock) {
      this.player.data.npcStock = {};
    }

    Object.keys(this.npcsData).forEach((npcId) => {
      const npc = this.npcsData[npcId];
      if (npc.shop && npc.shop.items) {
        if (!this.player.data.npcStock[npcId]) {
          this.player.data.npcStock[npcId] = {};
        }

        npc.shop.items.forEach((item) => {
          if (this.player.data.npcStock[npcId][item.id] !== undefined) {
            item.stock = this.player.data.npcStock[npcId][item.id];
          } else {
            // Initialize stock
            this.player.data.npcStock[npcId][item.id] = item.stock;
          }
        });
      }
    });
  }

  /**
   * Save NPC stock to player data
   */
  saveNPCStock() {
    if (!this.player.data.npcStock) {
      this.player.data.npcStock = {};
    }

    Object.keys(this.npcsData).forEach((npcId) => {
      const npc = this.npcsData[npcId];
      if (npc.shop && npc.shop.items) {
        if (!this.player.data.npcStock[npcId]) {
          this.player.data.npcStock[npcId] = {};
        }

        npc.shop.items.forEach((item) => {
          this.player.data.npcStock[npcId][item.id] = item.stock;
        });
      }
    });

    // Dispatch event to trigger save
    window.dispatchEvent(new CustomEvent("player:dataChanged"));
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

    // Reload friendship data to ensure sync
    this.loadNPCFriendship();

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
        this.increaseFriendship(npc.id, 1);
        this.notifications.show("Você conversou com " + name, "success");
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
          this.notifications.show("Sistema de missões em breve!", "info");
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
      this.notifications.show("Este NPC não tem loja disponível!", "error");
      return;
    }

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
        <p style="color: var(--text-secondary); font-size: 0.875rem;">Seu ouro: <span style="color: #b8860b; font-weight: 700;">${this.player.data.gold}g</span></p>
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

      let priceDisplay = `<div style="color: #b8860b; font-weight: 700; font-size: 1rem; margin-bottom: 0.25rem;">
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
        <div class="shop-item" style="background: var(--bg-accent); padding: 0.75rem; border-radius: 8px; border: 2px solid var(--border-color); display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; min-height: 180px; ${isLocked || outOfStock ? "opacity: 0.6;" : ""}">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${renderItemIcon(itemData, { size: "2.5rem" })}</div>
          <div style="font-weight: 600; font-size: 0.875rem; color: var(--text-primary); margin-bottom: 0.25rem; line-height: 1.2;">${itemName}</div>
          ${requiredLevelInfo}
          ${priceDisplay}
          <div style="color: ${outOfStock ? "#e74c3c" : "var(--text-secondary)"}; font-size: 0.75rem; margin-bottom: 0.5rem; font-weight: ${outOfStock ? "700" : "400"};">Estoque: ${stock}</div>
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
        <p style="color: #b8860b; font-weight: 700; font-size: 1.125rem;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${price}g por unidade</p>
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

            // Decrease stock
            shopItem.stock -= amount;
            this.saveNPCStock();

            this.notifications.success(
              `Comprou ${amount}x ${itemName} por ${totalCost}g!`,
            );

            // Increase friendship
            this.increaseFriendship(npc.id, amount);

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
   * Increase friendship with NPC
   * @param {string} npcId - NPC ID
   * @param {number} amount - Amount to increase
   */
  increaseFriendship(npcId, amount) {
    if (!this.npcsData[npcId]) return;

    const oldFriendship = this.npcsData[npcId].friendship;
    this.npcsData[npcId].friendship = Math.min(
      this.npcsData[npcId].maxFriendship,
      this.npcsData[npcId].friendship + amount,
    );

    // Save to player data
    if (!this.player.data.npcs) {
      this.player.data.npcs = {};
    }
    this.player.data.npcs[npcId] = this.npcsData[npcId].friendship;

    // Trigger save
    this.saveNPCFriendship();

    console.log(
      `💚 ${npcId} friendship: ${oldFriendship} → ${this.npcsData[npcId].friendship}`,
    );

    // Check if reached max friendship
    if (
      this.npcsData[npcId].friendship >= this.npcsData[npcId].maxFriendship &&
      oldFriendship < this.npcsData[npcId].maxFriendship
    ) {
      const npcName =
        this.npcsData[npcId].namePtBR || this.npcsData[npcId].name;
      this.notifications.success(
        `🎉 Amizade máxima com ${npcName}! Você ganhou 20% de desconto!`,
      );
    }
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
  }
}
