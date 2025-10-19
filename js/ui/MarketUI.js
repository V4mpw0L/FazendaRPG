/**
 * FazendaRPG - Market UI
 * Professional market system with 5x5 grid, pagination, and complete categories
 * @version 0.0.4
 */

import i18n from "../utils/i18n.js";

export default class MarketUI {
  constructor(
    player,
    inventorySystem,
    modal,
    notifications,
    farmSystem,
    skillSystem,
  ) {
    this.player = player;
    this.inventorySystem = inventorySystem;
    this.modal = modal;
    this.notifications = notifications;
    this.farmSystem = farmSystem;
    this.skillSystem = skillSystem;
    this.container = null;
    this.currentTab = "buy";
    this.currentCategory = "all";
    this.currentPage = 0;
    this.itemsPerPage = 25; // 5x5 grid
    this.marketData = null;
  }

  /**
   * Initialize Market UI
   */
  async init() {
    this.container = document.getElementById("market-grid");
    if (!this.container) {
      console.error("❌ Market container not found");
      return false;
    }

    // Load market items from items.json
    try {
      const response = await fetch("./data/items.json");
      if (!response.ok) {
        throw new Error("Failed to load market data");
      }

      const data = await response.json();
      this.marketData = data.items;

      console.log(
        "✅ Market UI initialized with",
        Object.keys(this.marketData).length,
        "items",
      );
      this.addStyles();
      this.setupControls();
      return true;
    } catch (error) {
      console.error("❌ Failed to initialize Market UI:", error);
      return false;
    }
  }

  /**
   * Setup market controls (tabs and filters)
   */
  setupControls() {
    const marketScreen = document.getElementById("market-screen");
    if (!marketScreen) return;

    // Check if controls already exist
    let controlsDiv = marketScreen.querySelector(".market-controls");
    if (!controlsDiv) {
      controlsDiv = document.createElement("div");
      controlsDiv.className = "market-controls";
      marketScreen.insertBefore(controlsDiv, this.container);
    }

    controlsDiv.innerHTML = `
      <div class="market-tabs">
        <button class="market-tab active" data-tab="buy">🛒 ${i18n.t("market.buy")}</button>
        <button class="market-tab" data-tab="sell"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${i18n.t("market.sell")}</button>
      </div>
      <div class="market-categories">
        <button class="category-btn active" data-category="all">📦 ${i18n.t("market.categories.all")}</button>
        <button class="category-btn" data-category="seeds">🌱 ${i18n.t("market.categories.seeds")}</button>
        <button class="category-btn" data-category="crops">🌾 ${i18n.t("market.categories.crops")}</button>
        <button class="category-btn" data-category="fish">🐟 ${i18n.t("market.categories.fish")}</button>
        <button class="category-btn" data-category="minerals">💎 ${i18n.t("market.categories.minerals")}</button>
        <button class="category-btn" data-category="wood">🪵 ${i18n.t("market.categories.wood")}</button>
        <button class="category-btn" data-category="food">🍞 ${i18n.t("market.categories.food")}</button>
        <button class="category-btn" data-category="tools">🔧 ${i18n.t("market.categories.tools")}</button>
        <button class="category-btn" data-category="materials">📦 ${i18n.t("market.categories.materials")}</button>
      </div>
    `;

    // Tab listeners
    controlsDiv.querySelectorAll(".market-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        controlsDiv
          .querySelectorAll(".market-tab")
          .forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.switchTab(tab.dataset.tab);
      });
    });

    // Category listeners
    controlsDiv.querySelectorAll(".category-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        controlsDiv
          .querySelectorAll(".category-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentCategory = btn.dataset.category;
        this.currentPage = 0;
        this.render();
      });
    });
  }

  /**
   * Add custom styles for market
   */
  addStyles() {
    if (document.getElementById("market-styles")) return;

    const style = document.createElement("style");
    style.id = "market-styles";
    style.textContent = `
      .market-controls {
        padding: var(--spacing-md);
        background: var(--bg-secondary);
        border-bottom: 2px solid var(--border-color);
        margin-bottom: var(--spacing-md);
      }

      .market-tabs {
        display: flex;
        gap: var(--spacing-sm);
        margin-bottom: var(--spacing-md);
      }

      .market-tab {
        flex: 1;
        padding: 0.625rem 0.875rem;
        background: var(--bg-accent);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all var(--transition-fast);
        color: var(--text-primary);
      }

      .market-tab:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px var(--shadow-color);
      }

      .market-tab.active {
        background: var(--brand-primary);
        border-color: var(--brand-tertiary);
        color: white;
      }

      .market-categories {
        display: flex;
        gap: 0.375rem;
        flex-wrap: wrap;
      }

      .category-btn {
        padding: 0.375rem 0.75rem;
        background: var(--bg-accent);
        border: 2px solid var(--border-color);
        border-radius: 16px;
        font-weight: 600;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all var(--transition-fast);
        color: var(--text-secondary);
      }

      .category-btn:hover {
        background: var(--bg-primary);
        border-color: var(--brand-primary);
        color: var(--text-primary);
      }

      .category-btn.active {
        background: var(--brand-primary);
        border-color: var(--brand-tertiary);
        color: white;
      }

      #market-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 0.5rem;
        padding: var(--spacing-md);
        min-height: 400px;
        max-width: 100%;
        justify-items: start;
      }

      .market-item {
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        padding: 0.5rem;
        transition: all var(--transition-fast);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        gap: 0.25rem;
        aspect-ratio: 0.85;
        max-width: 140px;
        width: 100%;
      }

      .market-item:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px var(--shadow-color);
        border-color: var(--brand-primary);
      }

      .market-item-icon {
        font-size: 1.75rem;
        line-height: 1;
      }

      .market-item-name {
        font-weight: 600;
        font-size: 0.6875rem;
        text-align: center;
        color: var(--text-primary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }

      .market-item-price {
        text-align: center;
        font-weight: 700;
        font-size: 0.75rem;
        color: var(--brand-primary);
      }

      .market-item-stock {
        text-align: center;
        font-size: 0.625rem;
        color: var(--text-secondary);
      }

      .market-item-action {
        width: 100%;
        padding: 0.4rem 0.5rem;
        font-size: 0.6875rem;
        font-weight: 700;
        background: var(--brand-primary);
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all var(--transition-fast);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .market-item-action:hover {
        background: var(--brand-tertiary);
        transform: scale(1.05);
        box-shadow: 0 2px 8px var(--shadow-color);
      }

      .market-item-action:active {
        transform: scale(0.98);
      }

      .market-pagination {
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

      .market-quick-actions {
        margin-top: 1rem;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
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

      .market-preview {
        background: var(--bg-accent);
        padding: var(--spacing-md);
        border-radius: 8px;
        margin-top: var(--spacing-md);
        border: 2px solid var(--border-color);
      }

      .market-preview-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: var(--spacing-xs);
        font-size: 0.875rem;
      }

      .market-preview-row span:last-child {
        color: #b8860b;
        font-weight: 700;
      }

      .market-preview-total {
        font-weight: 700;
        font-size: 1.125rem;
        color: #b8860b;
      }

      @media (max-width: 768px) {
        #market-grid {
          grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
          gap: 0.375rem;
        }

        .market-item {
          max-width: 130px;
        }

        .category-btn {
          font-size: 0.6875rem;
          padding: 0.3125rem 0.625rem;
        }
      }

      @media (max-width: 480px) {
        #market-grid {
          grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
          gap: 0.375rem;
          padding: var(--spacing-sm);
        }

        .market-tab {
          font-size: 0.75rem;
          padding: 0.5rem 0.625rem;
        }

        .category-btn {
          font-size: 0.625rem;
          padding: 0.25rem 0.5rem;
        }

        .market-item {
          padding: 0.375rem;
          max-width: 120px;
          aspect-ratio: 0.85;
        }

        .market-item-icon {
          font-size: 1.5rem;
        }

        .market-item-name {
          font-size: 0.625rem;
        }

        .market-item-price {
          font-size: 0.6875rem;
        }

        .market-item-action {
          font-size: 0.625rem;
          padding: 0.375rem 0.5rem;
        }

        .market-quick-actions {
          grid-template-columns: repeat(2, 1fr);
          gap: 0.375rem;
        }

        .quick-buy-btn {
          font-size: 0.75rem;
          padding: 0.5rem 0.375rem;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Switch between buy and sell tabs
   */
  switchTab(tab) {
    this.currentTab = tab;
    this.currentCategory = "all";
    this.currentPage = 0;

    // Update category buttons
    const controlsDiv = document.querySelector(".market-controls");
    if (controlsDiv) {
      controlsDiv
        .querySelectorAll(".category-btn")
        .forEach((b) => b.classList.remove("active"));
      controlsDiv
        .querySelector('[data-category="all"]')
        ?.classList.add("active");
    }

    this.render();
  }

  /**
   * Render market
   */
  render() {
    if (!this.container) return;

    if (this.currentTab === "buy") {
      this.renderBuyTab();
    } else {
      this.renderSellTab();
    }

    this.renderPagination();
  }

  /**
   * Render buy tab
   */
  renderBuyTab() {
    this.container.innerHTML = "";

    const buyableItems = Object.values(this.marketData).filter(
      (item) => item.buyPrice > 0,
    );

    // Filter by category
    const filteredItems =
      this.currentCategory === "all"
        ? buyableItems
        : buyableItems.filter((item) => item.category === this.currentCategory);

    if (filteredItems.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
          <p style="color: var(--text-secondary);">${i18n.t("market.noItems")}</p>
        </div>
      `;
      return;
    }

    // Paginate items
    const startIdx = this.currentPage * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    const paginatedItems = filteredItems.slice(startIdx, endIdx);

    paginatedItems.forEach((item) => {
      const itemCard = this.createMarketItem(item, "buy");
      this.container.appendChild(itemCard);
    });

    // Store total for pagination
    this.totalItems = filteredItems.length;
  }

  /**
   * Render sell tab
   */
  renderSellTab() {
    this.container.innerHTML = "";

    const playerItems = this.inventorySystem.getSellables();

    // Filter by category
    const filteredItems =
      this.currentCategory === "all"
        ? playerItems
        : playerItems.filter((item) => item.category === this.currentCategory);

    if (filteredItems.length === 0) {
      this.container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📦</div>
          <p style="color: var(--text-secondary);">${i18n.t("market.noSellItems")}</p>
        </div>
      `;
      return;
    }

    // Paginate items
    const startIdx = this.currentPage * this.itemsPerPage;
    const endIdx = startIdx + this.itemsPerPage;
    const paginatedItems = filteredItems.slice(startIdx, endIdx);

    paginatedItems.forEach((item) => {
      const itemCard = this.createMarketItem(item, "sell");
      this.container.appendChild(itemCard);
    });

    // Store total for pagination
    this.totalItems = filteredItems.length;
  }

  /**
   * Render pagination controls
   */
  renderPagination() {
    const marketScreen = document.getElementById("market-screen");
    if (!marketScreen) return;

    let paginationDiv = marketScreen.querySelector(".market-pagination");
    if (!paginationDiv) {
      paginationDiv = document.createElement("div");
      paginationDiv.className = "market-pagination";
      marketScreen.appendChild(paginationDiv);
    }

    const totalPages = Math.ceil((this.totalItems || 0) / this.itemsPerPage);
    const currentPage = this.currentPage + 1;

    if (totalPages <= 1) {
      paginationDiv.style.display = "none";
      return;
    }

    paginationDiv.style.display = "flex";
    paginationDiv.innerHTML = `
      <button class="pagination-btn" id="market-prev-page" ${this.currentPage === 0 ? "disabled" : ""}>
        ◀ ${i18n.t("market.previous")}
      </button>
      <span class="pagination-info">
        ${i18n.t("market.page")} ${currentPage} ${i18n.t("market.of")} ${totalPages}
      </span>
      <button class="pagination-btn" id="market-next-page" ${this.currentPage >= totalPages - 1 ? "disabled" : ""}>
        ${i18n.t("market.next")} ▶
      </button>
    `;

    // Add event listeners
    document
      .getElementById("market-prev-page")
      ?.addEventListener("click", () => {
        if (this.currentPage > 0) {
          this.currentPage--;
          this.render();
          this.container.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });

    document
      .getElementById("market-next-page")
      ?.addEventListener("click", () => {
        if (this.currentPage < totalPages - 1) {
          this.currentPage++;
          this.render();
          this.container.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
  }

  /**
   * Create market item card
   */
  createMarketItem(item, type) {
    const card = document.createElement("div");
    card.className = "market-item";

    const price = type === "buy" ? item.buyPrice : item.sellPrice;
    const stock = type === "buy" ? "∞" : item.count;
    const itemName = item.namePtBR || item.name;
    const buttonText =
      type === "buy" ? i18n.t("market.buy") : i18n.t("market.sell");
    const buttonIcon =
      type === "buy"
        ? "🛒"
        : '<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;">';

    // Check if it's a seed and get required level
    let requiredLevelInfo = "";
    if (item.category === "seeds" && type === "buy") {
      const cropId = item.id.replace("_seed", "");
      const cropData = this.farmSystem?.getCropData(cropId);
      if (cropData && cropData.requiredLevel) {
        const playerLevel = this.skillSystem?.getLevel("farming") || 1;
        const canUse = playerLevel >= cropData.requiredLevel;
        requiredLevelInfo = `<div class="market-item-level" style="font-size: 0.7rem; color: ${canUse ? "#4caf50" : "#ff6b6b"}; font-weight: 600; margin-top: 0.25rem;">${canUse ? "✓" : "🔒"} Nível ${cropData.requiredLevel}</div>`;
      }
    }

    card.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; flex: 1;">
        <div class="market-item-icon">${item.icon || "📦"}</div>
        <div class="market-item-name" title="${itemName}">${itemName}</div>
        <div class="market-item-price" style="color: #b8860b;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${price}g</div>
        ${type === "sell" ? `<div class="market-item-stock">${i18n.t("market.youHave")}: ${stock}</div>` : ""}
        ${requiredLevelInfo}
      </div>
      <button class="market-item-action">${buttonIcon} ${buttonText}</button>
    `;

    const button = card.querySelector(".market-item-action");
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (type === "buy") {
        this.showBuyDialog(item);
      } else {
        this.showSellDialog(item);
      }
    });

    return card;
  }

  /**
   * Show buy dialog
   */
  showBuyDialog(item) {
    const unitPrice = item.buyPrice || 0;
    const playerGold = this.player.data.gold || 0;
    const maxAffordable = Math.floor(playerGold / unitPrice);

    if (maxAffordable === 0) {
      this.notifications.error(i18n.t("market.notEnoughGold"));
      return;
    }

    const itemName = item.namePtBR || item.name;
    const itemDesc = item.descriptionPtBR || item.description || "";

    const content = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">${item.icon || "📦"}</div>
        <h3 style="margin: 0.5rem 0; color: var(--text-primary);">${itemName}</h3>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0.5rem 0;">${itemDesc}</p>
        <p style="color: #b8860b; font-weight: 700; font-size: 1.125rem;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${unitPrice}g ${i18n.t("market.perUnit")}</p>
      </div>

      <div style="margin: 1rem 0;">
        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">
          ${i18n.t("market.quantity")}:
        </label>
        <input
          type="number"
          id="buy-amount"
          min="1"
          max="${maxAffordable}"
          value="1"
          style="width: 100%; padding: 0.75rem; font-size: 1rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--bg-accent); color: var(--text-primary);"
        >
      </div>

      <div class="market-quick-actions">
        <button class="quick-buy-btn" id="quick-1">1</button>
        <button class="quick-buy-btn" id="quick-5">5</button>
        <button class="quick-buy-btn" id="quick-10">10</button>
        <button class="quick-buy-btn" id="quick-max">${i18n.t("market.max")} (${maxAffordable})</button>
      </div>

      <div class="market-preview" id="buy-preview">
        <div class="market-preview-row">
          <span>${i18n.t("market.yourGold")}:</span>
          <span style="color: #b8860b; font-weight: 700;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${playerGold}g</span>
        </div>
        <div class="market-preview-row">
          <span>${i18n.t("market.cost")}:</span>
          <span id="preview-cost" style="color: #8B0000; font-weight: 700;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${unitPrice}g</span>
        </div>
        <div class="market-preview-row">
          <span>${i18n.t("market.remaining")}:</span>
          <span id="preview-remaining" class="market-preview-total"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${playerGold - unitPrice}g</span>
        </div>
      </div>
    `;

    this.modal.show({
      title: `🛒 ${i18n.t("market.buyTitle")}`,
      content,
      buttons: [
        {
          text: i18n.t("common.cancel"),
          class: "btn-secondary",
          onClick: () => true,
        },
        {
          text: `🛒 ${i18n.t("market.buy")}`,
          class: "btn-success",
          onClick: () => {
            const amount = parseInt(
              document.getElementById("buy-amount")?.value || "1",
            );
            const totalCost = amount * unitPrice;

            if (amount < 1 || amount > maxAffordable) {
              this.notifications.error(i18n.t("market.invalidAmount"));
              return false;
            }

            if (totalCost > playerGold) {
              this.notifications.error(i18n.t("market.notEnoughGold"));
              return false;
            }

            this.buyItem(item, amount);
            return true;
          },
        },
      ],
      closable: true,
    });

    // Setup quick buttons and preview update after modal renders
    setTimeout(() => {
      const amountInput = document.getElementById("buy-amount");
      const updatePreview = () => {
        const amount = parseInt(amountInput?.value || "1");
        const cost = amount * unitPrice;
        const remaining = playerGold - cost;

        const costEl = document.getElementById("preview-cost");
        const remainingEl = document.getElementById("preview-remaining");

        if (costEl) {
          costEl.innerHTML = `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${cost}g`;
          costEl.style.color = "#8B0000";
        }
        if (remainingEl) {
          remainingEl.innerHTML = `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${remaining}g`;
          remainingEl.style.color = remaining >= 0 ? "#b8860b" : "#e74c3c";
        }

        // Disable/enable buy button based on gold
        const buyBtn = document.querySelector(".modal-footer .btn-success");
        if (buyBtn) {
          if (remaining < 0 || amount > maxAffordable || amount < 1) {
            buyBtn.disabled = true;
            buyBtn.style.opacity = "0.5";
          } else {
            buyBtn.disabled = false;
            buyBtn.style.opacity = "1";
          }
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
          amountInput.value = Math.min(5, maxAffordable).toString();
          updatePreview();
        }
      });

      document.getElementById("quick-10")?.addEventListener("click", () => {
        if (amountInput) {
          amountInput.value = Math.min(10, maxAffordable).toString();
          updatePreview();
        }
      });

      document.getElementById("quick-max")?.addEventListener("click", () => {
        if (amountInput) {
          amountInput.value = maxAffordable.toString();
          updatePreview();
        }
      });
    }, 50);
  }

  /**
   * Buy item
   */
  buyItem(item, amount) {
    const totalCost = item.buyPrice * amount;

    if (this.player.data.gold < totalCost) {
      this.notifications.error(i18n.t("market.notEnoughGold"));
      return false;
    }

    this.player.data.gold -= totalCost;
    this.inventorySystem.addItem(item.id, amount);

    this.notifications.success(
      i18n.t("market.buySuccess", {
        amount,
        item: item.namePtBR || item.name,
        cost: totalCost,
      }),
    );

    window.dispatchEvent(new CustomEvent("player:dataChanged"));
    this.render();
    return true;
  }

  /**
   * Show sell dialog
   */
  showSellDialog(item) {
    const unitPrice = item.sellPrice || 0;
    const maxSellable = item.count || 0;

    if (maxSellable === 0) {
      this.notifications.error(i18n.t("market.noneToSell"));
      return;
    }

    const itemName = item.namePtBR || item.name;
    const itemDesc = item.descriptionPtBR || item.description || "";
    const playerGold = this.player.data.gold || 0;

    const content = `
      <div style="text-align: center; margin-bottom: 1rem;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">${item.icon || "📦"}</div>
        <h3 style="margin: 0.5rem 0; color: var(--text-primary);">${itemName}</h3>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin: 0.5rem 0;">${itemDesc}</p>
        <p style="color: #b8860b; font-weight: 700; font-size: 1.125rem;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${unitPrice}g ${i18n.t("market.perUnit")}</p>
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

      <div class="market-quick-actions">
        <button class="quick-buy-btn" id="quick-1">1</button>
        <button class="quick-buy-btn" id="quick-25">25%</button>
        <button class="quick-buy-btn" id="quick-50">50%</button>
        <button class="quick-buy-btn" id="quick-max">${i18n.t("market.all")}</button>
      </div>

      <div class="market-preview" id="sell-preview">
        <div class="market-preview-row">
          <span>${i18n.t("market.yourGold")}:</span>
          <span style="color: #b8860b; font-weight: 700;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${playerGold}g</span>
        </div>
        <div class="market-preview-row">
          <span>${i18n.t("market.willReceive")}:</span>
          <span id="preview-receive" style="color: #b8860b; font-weight: 700;"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${unitPrice}g</span>
        </div>
        <div class="market-preview-row">
          <span>${i18n.t("market.newTotal")}:</span>
          <span id="preview-total" class="market-preview-total"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${playerGold + unitPrice}g</span>
        </div>
      </div>
    `;

    this.modal.show({
      title: `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${i18n.t("market.sellTitle")}`,
      content,
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
        },
      ],
      closable: true,
    });

    // Setup quick buttons and preview update after modal renders
    setTimeout(() => {
      const amountInput = document.getElementById("sell-amount");
      const updatePreview = () => {
        const amount = parseInt(amountInput?.value || "1");
        const willReceive = amount * unitPrice;
        const newTotal = playerGold + willReceive;

        const receiveEl = document.getElementById("preview-receive");
        const totalEl = document.getElementById("preview-total");

        if (receiveEl)
          receiveEl.innerHTML = `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${willReceive}g`;
        if (totalEl)
          totalEl.innerHTML = `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${newTotal}g`;
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
    if (!this.inventorySystem.hasItem(item.id, amount)) {
      this.notifications.error(i18n.t("market.notEnoughItems"));
      return false;
    }

    const totalValue = item.sellPrice * amount;
    this.inventorySystem.removeItem(item.id, amount);
    this.player.data.gold += totalValue;

    this.notifications.success(
      i18n.t("market.sellSuccess", {
        amount,
        item: item.namePtBR || item.name,
        value: totalValue,
      }),
    );

    window.dispatchEvent(new CustomEvent("player:dataChanged"));
    this.render();
    return true;
  }

  /**
   * Refresh market display
   */
  refresh() {
    this.render();
  }
}
