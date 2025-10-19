/**
 * FazendaRPG - Inventory UI
 * Manages inventory display, item interactions, and selling
 * @version 0.0.2
 */

import i18n from "../utils/i18n.js";

export default class InventoryUI {
  constructor(inventorySystem, modal, notifications) {
    this.inventorySystem = inventorySystem;
    this.modal = modal;
    this.notifications = notifications;
    this.container = null;
    this.sortBy = "name";
    this.filterCategory = "all";
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

    console.log("✅ Inventory UI initialized");
    return true;
  }

  /**
   * Setup inventory controls (sort, filter, etc.)
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
                    <span id="inv-items-count" class="stat-badge">0 itens</span>
                    <span id="inv-total-value" class="stat-badge">💰 0g</span>
                </div>
                <div class="inventory-actions">
                    <select id="inv-sort" class="control-select">
                        <option value="name">Ordenar: Nome</option>
                        <option value="count">Ordenar: Quantidade</option>
                        <option value="value">Ordenar: Valor</option>
                        <option value="category">Ordenar: Categoria</option>
                    </select>
                    <select id="inv-filter" class="control-select">
                        <option value="all">Todos</option>
                        <option value="seed">Sementes</option>
                        <option value="crop">Colheitas</option>
                        <option value="food">Comida</option>
                        <option value="tool">Ferramentas</option>
                        <option value="resource">Recursos</option>
                    </select>
                    <button id="inv-sell-all" class="btn btn-sm btn-primary">
                        💰 Vender Tudo
                    </button>
                </div>
            </div>
        `;

    screenHeader.insertAdjacentHTML("beforeend", controlsHTML);

    // Add event listeners
    document.getElementById("inv-sort")?.addEventListener("change", (e) => {
      this.sortBy = e.target.value;
      this.render();
    });

    document.getElementById("inv-filter")?.addEventListener("change", (e) => {
      this.filterCategory = e.target.value;
      this.render();
    });

    document.getElementById("inv-sell-all")?.addEventListener("click", () => {
      this.sellAllItems();
    });

    // Add styles
    this.addControlStyles();
  }

  /**
   * Add control styles
   */
  addControlStyles() {
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
                flex-wrap: wrap;
            }

            .stat-badge {
                padding: 6px 12px;
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
                padding: 8px 12px;
                background: var(--bg-secondary);
                border: 2px solid var(--border-color);
                border-radius: 8px;
                color: var(--text-primary);
                font-size: 0.875rem;
                font-weight: 600;
                cursor: pointer;
                transition: all var(--transition-fast);
                flex: 1;
                min-width: 150px;
            }

            .control-select:hover {
                border-color: var(--brand-primary);
            }

            .control-select:focus {
                outline: none;
                border-color: var(--brand-primary);
                box-shadow: 0 0 0 3px rgba(92, 170, 31, 0.2);
            }

            .btn-sm {
                padding: 8px 16px;
                font-size: 0.875rem;
            }

            .inventory-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
                gap: var(--spacing-md);
                padding: var(--spacing-md) 0;
            }

            .inventory-item {
                background: var(--bg-secondary);
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-md);
                cursor: pointer;
                transition: all var(--transition-fast);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--spacing-sm);
                position: relative;
                overflow: hidden;
            }

            .inventory-item:hover {
                transform: translateY(-4px);
                box-shadow: 0 6px 16px var(--shadow-color);
                border-color: var(--brand-primary);
            }

            .inventory-item:active {
                transform: translateY(-2px);
            }

            .inventory-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: var(--brand-primary);
                opacity: 0;
                transition: opacity var(--transition-fast);
            }

            .inventory-item:hover::before {
                opacity: 1;
            }

            .inventory-item-icon {
                font-size: 3rem;
                line-height: 1;
                text-align: center;
            }

            .inventory-item-name {
                font-weight: 600;
                font-size: 0.875rem;
                color: var(--text-primary);
                text-align: center;
                word-break: break-word;
            }

            .inventory-item-count {
                position: absolute;
                top: 8px;
                right: 8px;
                background: var(--brand-primary);
                color: white;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.75rem;
                font-weight: 700;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .inventory-item-value {
                font-size: 0.75rem;
                color: var(--text-secondary);
                font-weight: 600;
            }

            .inventory-item-category {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 4px;
                font-size: 0.65rem;
                font-weight: 700;
                text-align: center;
                letter-spacing: 0.5px;
                text-transform: uppercase;
                opacity: 0.8;
            }

            .inventory-empty {
                grid-column: 1 / -1;
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--text-secondary);
            }

            .inventory-empty-icon {
                font-size: 4rem;
                margin-bottom: var(--spacing-md);
            }

            .inventory-empty-text {
                font-size: 1.125rem;
                font-weight: 600;
            }

            @media (max-width: 480px) {
                .inventory-grid {
                    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
                    gap: var(--spacing-sm);
                }

                .inventory-item-icon {
                    font-size: 2.5rem;
                }

                .inventory-item-name {
                    font-size: 0.75rem;
                }

                .inventory-controls {
                    gap: var(--spacing-sm);
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

    if (items.length === 0) {
      this.container.innerHTML = `
                <div class="inventory-empty">
                    <div class="inventory-empty-icon">📦</div>
                    <div class="inventory-empty-text">
                        ${this.filterCategory === "all" ? "Inventário vazio" : "Nenhum item nesta categoria"}
                    </div>
                    <p style="margin-top: 0.5rem; font-size: 0.875rem;">
                        ${this.filterCategory === "all" ? "Comece plantando e colhendo!" : "Tente outra categoria."}
                    </p>
                </div>
            `;
      return;
    }

    // Category colors
    const categoryColors = {
      seed: "#5caa1f",
      crop: "#f39c12",
      food: "#e74c3c",
      tool: "#95a5a6",
      resource: "#8b4513",
      other: "#7f8c8d",
    };

    // Render items
    items.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.className = "inventory-item";

      const categoryColor =
        categoryColors[item.category] || categoryColors.other;
      const sellValue = (item.sellPrice || 0) * item.count;

      itemEl.innerHTML = `
                <div class="inventory-item-count">${item.count}</div>
                <div class="inventory-item-icon">${item.icon || "📦"}</div>
                <div class="inventory-item-name">${item.name}</div>
                ${sellValue > 0 ? `<div class="inventory-item-value">💰 ${sellValue}g</div>` : ""}
                <div class="inventory-item-category" style="background: ${categoryColor}; color: white;">
                    ${item.category || "other"}
                </div>
            `;

      itemEl.addEventListener("click", () => {
        this.showItemDetails(item);
      });

      this.container.appendChild(itemEl);
    });
  }

  /**
   * Update inventory statistics
   */
  updateStats() {
    const stats = this.inventorySystem.getStats();

    const itemsCountEl = document.getElementById("inv-items-count");
    const totalValueEl = document.getElementById("inv-total-value");

    if (itemsCountEl) {
      itemsCountEl.textContent = `${stats.totalItems} ${stats.totalItems === 1 ? "item" : "itens"}`;
    }

    if (totalValueEl) {
      totalValueEl.textContent = `💰 ${stats.totalValue}g`;
    }
  }

  /**
   * Show item details in modal
   * @param {Object} item - Item data
   */
  showItemDetails(item) {
    this.modal.showItemDetails(item, {
      showActions: true,
      onUse: (item) => {
        const result = this.inventorySystem.useItem(item.id);
        if (result.success) {
          this.notifications.show(
            i18n.t("inventory.usedItem", { item: item.name }),
            "success",
          );
          this.render();
        } else {
          this.notifications.show(
            result.error || i18n.t("inventory.cannotUse"),
            "error",
          );
        }
      },
      onSell: (item) => {
        // Fecha o modal atual antes de abrir o de venda
        this.modal.close();
        // Aguarda o modal fechar antes de abrir o próximo
        setTimeout(() => {
          this.showSellDialog(item);
        }, 350);
      },
    });
  }

  /**
   * Show sell dialog
   * @param {Object} item - Item to sell
   */
  showSellDialog(item) {
    const maxAmount = item.count;
    const unitPrice = item.sellPrice || 0;

    if (unitPrice === 0) {
      this.notifications.show("Este item não pode ser vendido", "warning");
      return;
    }

    let amount = 1;
    const updatePreview = () => {
      const total = amount * unitPrice;
      const previewEl = document.getElementById("sell-preview");
      if (previewEl) {
        previewEl.textContent = `Total: ${total} ouro`;
      }
    };

    const content = `
            <div style="padding: 1rem 0;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${item.icon || "📦"}</div>
                    <h3 style="margin: 0;">${item.name}</h3>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0;">
                        Valor unitário: ${unitPrice} ouro
                    </p>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                        Quantidade (máx: ${maxAmount})
                    </label>
                    <input
                        type="number"
                        id="sell-amount"
                        min="1"
                        max="${maxAmount}"
                        value="1"
                        style="width: 100%; padding: 0.75rem; font-size: 1rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--bg-accent); color: var(--text-primary);"
                    />
                    <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-secondary" onclick="document.getElementById('sell-amount').value = 1; document.getElementById('sell-amount').dispatchEvent(new Event('input'));">1</button>
                        <button class="btn btn-sm btn-secondary" onclick="document.getElementById('sell-amount').value = Math.floor(${maxAmount} / 2); document.getElementById('sell-amount').dispatchEvent(new Event('input'));">50%</button>
                        <button class="btn btn-sm btn-secondary" onclick="document.getElementById('sell-amount').value = ${maxAmount}; document.getElementById('sell-amount').dispatchEvent(new Event('input'));">Tudo</button>
                    </div>
                </div>

                <div id="sell-preview" style="padding: 1rem; background: var(--brand-primary); color: white; border-radius: 8px; text-align: center; font-size: 1.25rem; font-weight: 700;">
                    Total: ${unitPrice} ouro
                </div>
            </div>
        `;

    this.modal
      .show({
        title: "💰 Vender Item",
        content,
        buttons: [
          {
            text: "Cancelar",
            class: "btn-secondary",
            onClick: () => true,
          },
          {
            text: "Vender",
            class: "btn-success",
            onClick: () => {
              const input = document.getElementById("sell-amount");
              amount = parseInt(input?.value || "1");

              if (amount < 1 || amount > maxAmount) {
                this.notifications.show(
                  i18n.t("market.invalidAmount"),
                  "error",
                );
                return false;
              }

              const result = this.inventorySystem.sellItem(item.id, amount);
              if (result.success) {
                this.notifications.show(
                  i18n.t("market.soldItem", {
                    amount: amount,
                    item: item.name,
                    gold: result.gold,
                  }),
                  "success",
                );
                this.render();
                return true;
              } else {
                this.notifications.show(
                  result.error || i18n.t("market.sellError"),
                  "error",
                );
                return false;
              }
            },
          },
        ],
        closable: true,
      })
      .then(() => {
        // Setup amount input listener after modal is shown
        setTimeout(() => {
          const input = document.getElementById("sell-amount");
          if (input) {
            input.addEventListener("input", (e) => {
              amount = parseInt(e.target.value) || 1;
              amount = Math.max(1, Math.min(maxAmount, amount));
              e.target.value = amount;
              updatePreview();
            });
          }
        }, 100);
      });
  }

  /**
   * Sell all items
   */
  sellAllItems() {
    const sellable = this.inventorySystem.getSellables();

    if (sellable.length === 0) {
      this.notifications.show("Nenhum item pode ser vendido", "warning");
      return;
    }

    const totalValue = sellable.reduce((sum, item) => {
      return sum + item.sellPrice * item.count;
    }, 0);

    this.modal.showConfirm({
      title: `💰 ${i18n.t("market.sellAll")}`,
      message: i18n.t("market.sellAllConfirm", {
        gold: totalValue,
        count: sellable.length,
        itemText:
          sellable.length === 1
            ? i18n.t("market.itemType")
            : i18n.t("market.itemTypes"),
      }),
      confirmText: i18n.t("market.sellAll"),
      cancelText: i18n.t("cancel"),
      confirmClass: "btn-success",
      onConfirm: () => {
        let totalGold = 0;
        let itemsSold = 0;

        sellable.forEach((item) => {
          const result = this.inventorySystem.sellItem(item.id, item.count);
          if (result.success) {
            totalGold += result.gold;
            itemsSold += result.amount;
          }
        });

        this.notifications.show(
          i18n.t("market.soldMultiple", {
            items: itemsSold,
            gold: totalGold,
          }),
          "success",
        );

        this.render();
      },
    });
  }

  /**
   * Clear and re-render
   */
  refresh() {
    this.render();
  }
}
