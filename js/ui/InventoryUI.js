/**
 * FazendaRPG - Inventory UI
 * Professional slot-based inventory with 5x5 grid and pagination
 * @version 0.0.4
 */

import i18n from "../utils/i18n.js";
import notifications from "../utils/notifications.js";

export default class InventoryUI {
  constructor(inventorySystem, modal, notifications, farmSystem = null) {
    this.inventorySystem = inventorySystem;
    this.modal = modal;
    this.notifications = notifications;
    this.farmSystem = farmSystem;
    this.container = null;
    this.sortBy = "name";
    this.filterCategory = "all";
    this.currentPage = 0;
    this.slotsPerPage = 25; // 5x5 grid
  }

  /**
   * Initialize inventory UI
   */
  init() {
    this.container = document.getElementById("inventory-grid");
    if (!this.container) {
      console.error("❌ Inventory container not found");
      return false;
    }

    // Listen to inventory events
    window.addEventListener("inventory:itemAdded", () => this.render());
    window.addEventListener("inventory:itemRemoved", () => this.render());
    window.addEventListener("inventory:itemUsed", () => this.render());
    window.addEventListener("inventory:itemSold", () => this.render());
    window.addEventListener("inventory:cleared", () => this.render());

    this.setupControls();
    this.addStyles();

    console.log("✅ Inventory UI initialized");
    return true;
  }

  /**
   * Setup inventory controls
   */
  setupControls() {
    const screenHeader = document.querySelector(
      "#inventory-screen .screen-header",
    );
    if (!screenHeader) return;

    // Check if controls already exist
    if (screenHeader.querySelector(".inventory-controls")) return;

    const controlsHTML = `
      <div class="inventory-controls">
        <div class="inventory-stats">
          <span id="inv-items-count" class="stat-badge">0 ${i18n.t("inventory.items")}</span>
          <span id="inv-total-value" class="stat-badge" style="color: #b8860b; font-weight: 700;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> 0g</span>
        </div>
        <div class="inventory-actions">
          <select id="inv-sort" class="control-select">
            <option value="name">${i18n.t("inventory.sortName")}</option>
            <option value="count">${i18n.t("inventory.sortCount")}</option>
            <option value="value">${i18n.t("inventory.sortValue")}</option>
            <option value="category">${i18n.t("inventory.sortCategory")}</option>
          </select>
          <select id="inv-filter" class="control-select">
            <option value="all">${i18n.t("market.categories.all")}</option>
            <option value="seeds">${i18n.t("market.categories.seeds")}</option>
            <option value="crops">${i18n.t("market.categories.crops")}</option>
            <option value="fish">${i18n.t("market.categories.fish")}</option>
            <option value="minerals">${i18n.t("market.categories.minerals")}</option>
            <option value="wood">${i18n.t("market.categories.wood")}</option>
            <option value="food">${i18n.t("market.categories.food")}</option>
            <option value="tools">${i18n.t("market.categories.tools")}</option>
            <option value="materials">${i18n.t("market.categories.materials")}</option>
          </select>
          <button id="inv-sell-all" class="btn btn-sm btn-success">
            <img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${i18n.t("market.sellAll")}
          </button>
        </div>
      </div>
    `;

    screenHeader.insertAdjacentHTML("beforeend", controlsHTML);

    // Add event listeners
    document.getElementById("inv-sort")?.addEventListener("change", (e) => {
      this.sortBy = e.target.value;
      this.currentPage = 0;
      this.render();
    });

    document.getElementById("inv-filter")?.addEventListener("change", (e) => {
      this.filterCategory = e.target.value;
      this.currentPage = 0;
      this.render();
    });

    document.getElementById("inv-sell-all")?.addEventListener("click", () => {
      this.sellAllItems();
    });
  }

  /**
   * Add styles
   */
  addStyles() {
    if (document.getElementById("inventory-ui-styles")) return;

    const style = document.createElement("style");
    style.id = "inventory-ui-styles";
    style.textContent = `
      .inventory-controls {
        margin-top: var(--spacing-md);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .inventory-stats {
        display: flex;
        gap: var(--spacing-sm);
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
      }

      .stat-badge {
        padding: 0.5rem 0.875rem;
        background: var(--bg-accent);
        border: 2px solid var(--border-color);
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary);
        box-shadow: 0 2px 4px var(--shadow-color);
      }

      .inventory-actions {
        display: flex;
        gap: var(--spacing-sm);
        flex-wrap: wrap;
        align-items: center;
      }

      .control-select {
        padding: 0.5rem 0.75rem;
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        color: var(--text-primary);
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
        flex: 1;
        min-width: 140px;
      }

      .control-select:hover {
        border-color: var(--brand-primary);
      }

      .control-select:focus {
        outline: none;
        border-color: var(--brand-primary);
        box-shadow: 0 0 0 3px rgba(92, 170, 31, 0.2);
      }

      #inventory-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 1fr);
        gap: 0.5rem;
        padding: var(--spacing-md);
        height: auto;
        max-width: 100%;
        grid-auto-flow: row;
        overflow: hidden;
      }

      .inventory-slot {
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        padding: 0.5rem;
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        position: relative;
        transition: all var(--transition-fast);
        cursor: pointer;
      }

      .inventory-slot.empty {
        background: rgba(92, 170, 31, 0.05);
        border: 3px dashed var(--brand-primary);
        opacity: 0.6;
        cursor: default;
      }

      .inventory-slot.empty:hover {
        transform: none;
        box-shadow: none;
        border-color: var(--brand-primary);
        opacity: 0.7;
      }

      .inventory-slot:not(.empty):hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px var(--shadow-color);
        border-color: var(--brand-primary);
      }

      .inventory-slot-icon {
        font-size: 2rem;
        line-height: 1;
      }

      .inventory-slot-name {
        font-weight: 600;
        font-size: 0.625rem;
        text-align: center;
        color: var(--text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }

      .inventory-slot-value {
        font-size: 0.625rem;
        font-weight: 700;
        color: #b8860b;
      }

      .inventory-slot-count {
        position: absolute;
        top: 0.25rem;
        right: 0.25rem;
        background: var(--brand-primary);
        color: white;
        padding: 0.125rem 0.375rem;
        border-radius: 10px;
        font-size: 0.625rem;
        font-weight: 700;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        min-width: 1.25rem;
        text-align: center;
      }

      .inventory-slot-category {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0.125rem;
        font-size: 0.5rem;
        font-weight: 700;
        text-align: center;
        letter-spacing: 0.3px;
        text-transform: uppercase;
        color: white;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
      }

      .inventory-pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background: var(--bg-secondary);
        border-top: 2px solid var(--border-color);
      }

      .pagination-btn {
        padding: 0.5rem 1rem;
        background: var(--bg-accent);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all var(--transition-fast);
        color: var(--text-primary);
      }

      .pagination-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .pagination-btn:not(:disabled):hover {
        background: var(--brand-primary);
        border-color: var(--brand-tertiary);
        color: white;
        transform: translateY(-2px);
      }

      .pagination-info {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .inventory-empty {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem 1rem;
        color: var(--text-secondary);
      }

      .inventory-empty-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }

      .inventory-empty-text {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
      }

      .quick-buy-btn {
        padding: 0.625rem 0.5rem;
        font-size: 0.8125rem;
        font-weight: 700;
        background: var(--brand-primary);
        color: white;
        border: 2px solid var(--brand-tertiary);
        border-radius: 8px;
        cursor: pointer;
        transition: all var(--transition-fast);
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      .quick-buy-btn:hover {
        background: var(--brand-tertiary);
        color: white;
        border-color: var(--brand-primary);
        transform: scale(1.08);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
      }

      .quick-buy-btn:active {
        transform: scale(0.98);
      }

      @media (max-width: 768px) {
        #inventory-grid {
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(7, 1fr);
          gap: 0.375rem;
        }

        .inventory-slot-icon {
          font-size: 1.75rem;
        }
      }

      @media (max-width: 480px) {
        #inventory-grid {
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(9, 1fr);
          gap: 0.375rem;
          padding: var(--spacing-sm);
        }

        .inventory-slot {
          padding: 0.375rem;
        }

        .inventory-slot-icon {
          font-size: 1.5rem;
        }

        .inventory-slot-name {
          font-size: 0.5625rem;
        }

        .inventory-slot-value {
          font-size: 0.5625rem;
        }

        .control-select {
          min-width: 120px;
          font-size: 0.75rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Get category color
   */
  getCategoryColor(category) {
    const colors = {
      seeds: "#5caa1f",
      crops: "#f39c12",
      fish: "#3498db",
      minerals: "#9b59b6",
      wood: "#8b4513",
      food: "#e74c3c",
      tools: "#34495e",
      materials: "#95a5a6",
    };
    return colors[category] || "#95a5a6";
  }

  /**
   * Get translated category name
   */
  getCategoryName(category) {
    const key = `market.categories.${category}`;
    const translated = i18n.t(key);
    return translated !== key ? translated : category.toUpperCase();
  }

  /**
   * Render inventory
   */
  render() {
    if (!this.container) return;

    // Get items
    let items = this.inventorySystem.sortInventory(this.sortBy);

    // Apply filter
    if (this.filterCategory !== "all") {
      items = items.filter((item) => item.category === this.filterCategory);
    }

    // Update stats
    this.updateStats();

    // Clear container
    this.container.innerHTML = "";

    // Calculate pagination
    const totalPages = Math.ceil(Math.max(items.length, 1) / this.slotsPerPage);

    // Ensure currentPage is valid
    if (this.currentPage >= totalPages) {
      this.currentPage = Math.max(0, totalPages - 1);
    }

    // Get items for current page
    const startIdx = this.currentPage * this.slotsPerPage;
    const endIdx = startIdx + this.slotsPerPage;
    const paginatedItems = items.slice(startIdx, endIdx);

    // ALWAYS create EXACTLY 5x5 grid (25 slots), filling empty slots
    console.log(
      `📦 Creating ${this.slotsPerPage} slots for page ${this.currentPage + 1} (${paginatedItems.length} items on this page)`,
    );

    for (let i = 0; i < this.slotsPerPage; i++) {
      const item = paginatedItems[i]; // Will be undefined for empty slots
      const slot = this.createSlot(item, i);
      this.container.appendChild(slot);
    }

    console.log(`✅ Created ${this.container.children.length} slots total`);

    // Render pagination only if more than 25 items
    this.renderPagination(items.length);
  }

  /**
   * Create inventory slot
   */
  createSlot(item, index) {
    const slot = document.createElement("div");

    if (!item) {
      // Empty slot
      slot.className = "inventory-slot empty";
      slot.innerHTML = "";
      return slot;
    }

    // Filled slot
    slot.className = "inventory-slot";
    const itemName = item.namePtBR || item.name;
    const categoryColor = this.getCategoryColor(item.category);
    const categoryName = this.getCategoryName(item.category);

    slot.innerHTML = `
      ${item.count > 1 ? `<div class="inventory-slot-count">${item.count}</div>` : ""}
      <div class="inventory-slot-icon">${item.icon || "📦"}</div>
      <div class="inventory-slot-name" title="${itemName}">${itemName}</div>
      <div class="inventory-slot-value" style="color: #b8860b;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 0.75em; height: 0.75em; vertical-align: middle;"> ${item.sellPrice || 0}g</div>
      <div class="inventory-slot-category" style="background: ${categoryColor};">
        ${categoryName}
      </div>
    `;

    slot.addEventListener("click", () => {
      this.showItemDialog(item);
    });

    return slot;
  }

  /**
   * Render pagination
   */
  renderPagination(totalItems) {
    const inventoryScreen = document.getElementById("inventory-screen");
    if (!inventoryScreen) return;

    let paginationDiv = inventoryScreen.querySelector(".inventory-pagination");
    if (!paginationDiv) {
      paginationDiv = document.createElement("div");
      paginationDiv.className = "inventory-pagination";
      inventoryScreen.appendChild(paginationDiv);
    }

    // Only show pagination if MORE than 25 items
    if (totalItems <= this.slotsPerPage) {
      paginationDiv.style.display = "none";
      return;
    }

    const totalPages = Math.ceil(totalItems / this.slotsPerPage);
    const currentPage = this.currentPage + 1;

    paginationDiv.style.display = "flex";
    paginationDiv.innerHTML = `
      <button class="pagination-btn" id="inv-prev-page" ${this.currentPage === 0 ? "disabled" : ""}>
        ◀ ${i18n.t("market.previous")}
      </button>
      <span class="pagination-info">
        ${i18n.t("market.page")} ${currentPage} ${i18n.t("market.of")} ${totalPages}
      </span>
      <button class="pagination-btn" id="inv-next-page" ${this.currentPage >= totalPages - 1 ? "disabled" : ""}>
        ${i18n.t("market.next")} ▶
      </button>
    `;

    // Add event listeners
    document.getElementById("inv-prev-page")?.addEventListener("click", () => {
      if (this.currentPage > 0) {
        this.currentPage--;
        this.render();
        this.container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    document.getElementById("inv-next-page")?.addEventListener("click", () => {
      if (this.currentPage < totalPages - 1) {
        this.currentPage++;
        this.render();
        this.container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  /**
   * Show item dialog
   */
  showItemDialog(item) {
    const itemName = item.namePtBR || item.name;
    const itemDesc = item.descriptionPtBR || item.description || "";
    const sellPrice = item.sellPrice || 0;
    const maxSellable = item.count || 0;
    const isConsumable = item.consumable || false;

    const content = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">${item.icon || "📦"}</div>
        <h3 style="margin: 0.5rem 0; color: var(--text-primary);">${itemName}</h3>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0.5rem 0;">${itemDesc}</p>
        ${isConsumable && item.energyRestore ? `<p style="color: #5caa1f; font-weight: 600; font-size: 0.875rem;">⚡ Restaura ${item.energyRestore} de energia</p>` : ""}
        <p style="color: #b8860b; font-weight: 700; font-size: 1.125rem;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${sellPrice}g ${i18n.t("market.perUnit")}</p>
        <p style="color: var(--text-secondary); font-size: 0.875rem;">${i18n.t("market.youHave")}: ${maxSellable}</p>
      </div>

      <div style="margin: 1rem 0;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">
          ${i18n.t("market.quantity")}:
        </label>
        <input
          type="number"
          id="sell-amount"
          min="1"
          max="${maxSellable}"
          value="1"
          style="width: 100%; padding: 0.75rem; font-size: 1rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--bg-accent); color: var(--text-primary);"
        >
      </div>

      <div style="margin-top: 1rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
        <button class="quick-buy-btn" id="quick-1">1</button>
        <button class="quick-buy-btn" id="quick-25">25%</button>
        <button class="quick-buy-btn" id="quick-50">50%</button>
        <button class="quick-buy-btn" id="quick-max">${i18n.t("market.all")}</button>
      </div>

      <div style="background: var(--bg-accent); padding: var(--spacing-md); border-radius: 8px; margin-top: var(--spacing-md); border: 2px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem;">
          <span>${i18n.t("market.willReceive")}:</span>
          <span id="preview-receive" style="font-weight: 700; color: #b8860b;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${sellPrice}g</span>
        </div>
      </div>
    `;

    const buttons = [
      {
        text: i18n.t("common.cancel"),
        class: "btn-secondary",
        onClick: () => true,
      },
    ];

    // Add use button if consumable
    if (isConsumable) {
      buttons.push({
        text: `🍽️ Usar`,
        class: "btn-primary",
        onClick: () => {
          const result = this.inventorySystem.useItem(item.id);
          if (result.success) {
            this.notifications.success(`Você usou ${itemName}!`);
            if (result.effects.energy) {
              this.notifications.show(
                `+${result.effects.energy} energia`,
                "success",
              );
            }
            this.render();
            return true;
          } else {
            this.notifications.error(
              result.error || "Não foi possível usar o item",
            );
            return false;
          }
        },
      });
    }

    // Add use button if fertilizer
    if (item.id === "fertilizer") {
      buttons.push({
        text: `💩 Usar na Fazenda`,
        class: "btn-primary",
        onClick: () => {
          this.showFertilizerPlotSelector();
          return false;
        },
      });
    }

    // Add sell button
    buttons.push({
      text: `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${i18n.t("market.sell")}`,
      class: "btn-success",
      onClick: () => {
        const amount = parseInt(
          document.getElementById("sell-amount")?.value || "1",
        );
        if (amount > 0 && amount <= maxSellable) {
          this.sellItem(item, amount);
          return true;
        } else {
          this.notifications.error(i18n.t("market.invalidAmount"));
          return false;
        }
      },
    });

    this.modal.show({
      title: `📦 ${itemName}`,
      content,
      buttons,
      closable: true,
    });

    // Setup quick buttons
    setTimeout(() => {
      const amountInput = document.getElementById("sell-amount");
      const updatePreview = () => {
        const amount = parseInt(amountInput?.value || "1");
        const willReceive = amount * sellPrice;
        const receiveEl = document.getElementById("preview-receive");
        if (receiveEl)
          receiveEl.innerHTML = `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${willReceive}g`;
      };

      amountInput?.addEventListener("input", updatePreview);

      document.getElementById("quick-1")?.addEventListener("click", () => {
        if (amountInput) {
          amountInput.value = "1";
          updatePreview();
        }
      });

      document.getElementById("quick-25")?.addEventListener("click", () => {
        if (amountInput) {
          amountInput.value = Math.max(
            1,
            Math.floor(maxSellable * 0.25),
          ).toString();
          updatePreview();
        }
      });

      document.getElementById("quick-50")?.addEventListener("click", () => {
        if (amountInput) {
          amountInput.value = Math.max(
            1,
            Math.floor(maxSellable * 0.5),
          ).toString();
          updatePreview();
        }
      });

      document.getElementById("quick-max")?.addEventListener("click", () => {
        if (amountInput) {
          amountInput.value = maxSellable.toString();
          updatePreview();
        }
      });
    }, 50);
  }

  /**
   * Sell item
   */
  sellItem(item, amount) {
    const result = this.inventorySystem.sellItem(item.id, amount);
    if (result.success) {
      this.notifications.success(
        i18n.t("market.sellSuccess", {
          amount,
          item: item.namePtBR || item.name,
          value: result.gold,
        }),
      );
      window.dispatchEvent(new CustomEvent("player:dataChanged"));
      this.render();
      return true;
    } else {
      this.notifications.error(result.error || i18n.t("market.sellError"));
      return false;
    }
  }

  /**
   * Sell all items
   */
  sellAllItems() {
    const sellables = this.inventorySystem.getSellables();

    if (sellables.length === 0) {
      this.notifications.error(
        i18n.t("market.noSellItems") || "Nenhum item para vender",
      );
      return;
    }

    let totalGold = 0;
    sellables.forEach((item) => {
      totalGold += (item.sellPrice || 0) * item.count;
    });

    const itemTypes = new Set(sellables.map((i) => i.category)).size;
    const itemText =
      itemTypes === 1 ? i18n.t("market.itemType") : i18n.t("market.itemTypes");

    this.modal.show({
      title: `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${i18n.t("market.sellAll")}`,
      content: `<p style="font-size: 1.125rem; text-align: center; padding: 1rem 0;">${i18n.t(
        "market.sellAllConfirm",
        {
          gold: totalGold,
          count: sellables.length,
          itemText: itemText,
        },
      )}</p>`,
      buttons: [
        {
          text: i18n.t("common.cancel"),
          class: "btn-secondary",
          onClick: () => true,
        },
        {
          text: `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${i18n.t("market.sell")}`,
          class: "btn-success",
          onClick: () => {
            const result = this.inventorySystem.sellAllItems();
            if (result.success) {
              this.notifications.success(
                i18n.t("market.soldMultiple", {
                  items: result.itemCount,
                  gold: result.gold,
                }),
              );
              window.dispatchEvent(new CustomEvent("player:dataChanged"));
              this.render();
              return true;
            } else {
              this.notifications.error(
                result.error || i18n.t("market.sellError"),
              );
              return false;
            }
          },
        },
      ],
      closable: true,
    });
  }

  /**
   * Update stats
   */
  updateStats() {
    const items = this.inventorySystem.getInventoryArray();
    const totalValue = items.reduce(
      (sum, item) => sum + (item.sellPrice || 0) * item.count,
      0,
    );

    const countEl = document.getElementById("inv-items-count");
    const valueEl = document.getElementById("inv-total-value");

    if (countEl) {
      const itemWord = items.length === 1 ? "item" : "itens";
      countEl.textContent = `${items.length} ${itemWord}`;
    }

    if (valueEl) {
      valueEl.innerHTML = `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${totalValue}g`;
      valueEl.style.color = "#b8860b";
      valueEl.style.fontWeight = "700";
    }
  }

  /**
   * Show fertilizer plot selector
   */
  showFertilizerPlotSelector() {
    if (!this.farmSystem) {
      this.notifications.error("Sistema de fazenda não disponível!");
      return;
    }

    // Get farm stats
    const stats = this.farmSystem.getStats();

    if (stats.empty === stats.total) {
      this.notifications.error(
        "Você não tem nenhuma plantação para fertilizar!",
      );
      return;
    }

    // Create plot selection grid
    let plotsHTML =
      '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin: 1rem 0;">';

    for (let i = 0; i < this.farmSystem.plotCount; i++) {
      const plot = this.farmSystem.getPlot(i);
      const isReady = this.farmSystem.isPlotReady(i);
      const isFertilized = plot.fertilized;

      if (!plot.crop) {
        // Empty plot - disabled
        plotsHTML += `
          <button class="plot-select-btn" disabled style="padding: 1rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--bg-accent); opacity: 0.5; cursor: not-allowed;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">🟫</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">Vazio</div>
          </button>
        `;
      } else if (isFertilized) {
        // Already fertilized - disabled
        plotsHTML += `
          <button class="plot-select-btn" disabled style="padding: 1rem; border: 2px solid #5caa1f; border-radius: 8px; background: var(--bg-accent); opacity: 0.7; cursor: not-allowed;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">✨</div>
            <div style="font-size: 0.75rem; color: #5caa1f;">Fertilizado</div>
          </button>
        `;
      } else {
        // Can be fertilized
        const cropData = this.farmSystem.getCropData(plot.crop);
        const cropIcon = cropData?.icon || "🌱";
        plotsHTML += `
          <button class="plot-select-btn" data-plot-index="${i}" style="padding: 1rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--bg-secondary); cursor: pointer; transition: all 0.2s;">
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${cropIcon}</div>
            <div style="font-size: 0.75rem; color: var(--text-primary);">Plot ${i + 1}</div>
            <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 0.25rem;">${isReady ? "Pronto" : "Crescendo"}</div>
          </button>
        `;
      }
    }

    plotsHTML += "</div>";

    const content = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">💩</div>
        <h3 style="margin: 0.5rem 0; color: var(--text-primary);">Usar Fertilizante</h3>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0.5rem 0;">
          Selecione um plot para fertilizar<br>
          <span style="color: #5caa1f; font-weight: 600;">Reduz o tempo de crescimento em 50%!</span>
        </p>
      </div>
      ${plotsHTML}
    `;

    this.modal.show({
      title: "💩 Fertilizar Plot",
      content,
      buttons: [
        {
          text: "Cancelar",
          class: "btn-secondary",
          onClick: () => true,
        },
      ],
      closable: true,
    });

    // Add click handlers to plot buttons
    setTimeout(() => {
      const plotButtons = document.querySelectorAll(
        ".plot-select-btn[data-plot-index]",
      );
      plotButtons.forEach((button) => {
        button.addEventListener("mouseenter", () => {
          button.style.borderColor = "#5caa1f";
          button.style.transform = "scale(1.05)";
        });
        button.addEventListener("mouseleave", () => {
          button.style.borderColor = "var(--border-color)";
          button.style.transform = "scale(1)";
        });
        button.addEventListener("click", () => {
          const plotIndex = parseInt(button.getAttribute("data-plot-index"));
          this.useFertilizerOnPlot(plotIndex);
        });
      });
    }, 50);
  }

  /**
   * Use fertilizer on a specific plot
   * @param {number} plotIndex - Plot index
   */
  useFertilizerOnPlot(plotIndex) {
    const result = this.farmSystem.fertilize(plotIndex);

    if (result.success) {
      this.notifications.success(
        `Plot ${plotIndex + 1} fertilizado! Crescimento 50% mais rápido! 💩✨`,
      );
      this.modal.close();
      this.render();

      // Dispatch event to update farm UI
      window.dispatchEvent(
        new CustomEvent("farm:fertilized", {
          detail: { index: plotIndex },
        }),
      );
    } else {
      this.notifications.error(
        result.error || "Não foi possível fertilizar o plot",
      );
    }
  }

  /**
   * Refresh inventory
   */
  refresh() {
    this.render();
  }
}
