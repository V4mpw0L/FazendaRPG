/**
 * FazendaRPG - Modal System
 * Reusable modal dialog system for game UI
 * @version 0.0.16
 */

export default class Modal {
  constructor() {
    this.container = null;
    this.currentModal = null;
    this.onCloseCallback = null;
  }

  /**
   * Initialize modal system
   */
  init() {
    this.container = document.getElementById("modal-container");
    if (!this.container) {
      console.error("❌ Modal container not found");
      return false;
    }

    // Click outside to close
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });

    console.log("✅ Modal system initialized");
    return true;
  }

  /**
   * Show a modal
   * @param {Object} options - Modal options
   * @returns {Promise} Resolves when modal is closed
   */
  show(options = {}) {
    return new Promise((resolve) => {
      const {
        title = "Modal",
        content = "",
        buttons = [],
        closable = true,
        theme = "default",
        size = "medium",
        onClose = null,
      } = options;

      this.onCloseCallback = onClose;

      // Create modal HTML
      const modalHTML = `
                <div class="modal modal-${size} modal-${theme}">
                    <div class="modal-header">
                        <h3 class="modal-title">${title}</h3>
                        ${closable ? '<button class="modal-close" data-action="close" style="position: absolute; top: 1rem; right: 1rem; background: linear-gradient(135deg, #ef5350 0%, #e53935 100%); color: white; border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 1.5rem; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(239, 83, 80, 0.4); transition: all 0.2s; font-weight: 700;">&times;</button>' : ""}
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    ${
                      buttons.length > 0
                        ? `
                        <div class="modal-footer">
                            ${buttons
                              .map(
                                (btn, index) => `
                                <button
                                    class="btn ${btn.class || "btn-secondary"}"
                                    data-action="button"
                                    data-index="${index}"
                                    ${btn.disabled ? "disabled" : ""}
                                >
                                    ${btn.text}
                                </button>
                            `,
                              )
                              .join("")}
                        </div>
                    `
                        : ""
                    }
                </div>
            `;

      this.container.innerHTML = modalHTML;
      this.currentModal = this.container.querySelector(".modal");

      // Add event listeners
      this.container
        .querySelectorAll('[data-action="close"]')
        .forEach((btn) => {
          btn.addEventListener("click", () => {
            this.close();
            resolve({ action: "close" });
          });
          // Add hover effect
          btn.addEventListener("mouseenter", () => {
            btn.style.transform = "scale(1.1)";
            btn.style.boxShadow = "0 4px 12px rgba(239, 83, 80, 0.6)";
          });
          btn.addEventListener("mouseleave", () => {
            btn.style.transform = "scale(1)";
            btn.style.boxShadow = "0 2px 8px rgba(239, 83, 80, 0.4)";
          });
        });

      this.container
        .querySelectorAll('[data-action="button"]')
        .forEach((btn) => {
          btn.addEventListener("click", () => {
            const index = parseInt(btn.dataset.index);
            const button = buttons[index];

            if (button.onClick) {
              const result = button.onClick();
              if (result === false) return; // Don't close if returns false
            }

            this.close();
            resolve({ action: "button", index, button });
          });
        });

      // Show modal
      requestAnimationFrame(() => {
        this.container.classList.add("active");
      });

      // ESC key to close
      if (closable) {
        const escHandler = (e) => {
          if (e.key === "Escape") {
            document.removeEventListener("keydown", escHandler);
            this.close();
            resolve({ action: "escape" });
          }
        };
        document.addEventListener("keydown", escHandler);
      }
    });
  }

  /**
   * Close current modal
   */
  close() {
    if (!this.container) return;

    this.container.classList.remove("active");

    if (this.onCloseCallback) {
      this.onCloseCallback();
    }

    setTimeout(() => {
      this.container.innerHTML = "";
      this.currentModal = null;
      this.onCloseCallback = null;
    }, 300);
  }

  /**
   * Show item details modal
   * @param {Object} item - Item data
   * @param {Object} options - Additional options
   */
  showItemDetails(item, options = {}) {
    const {
      onUse = null,
      onSell = null,
      showActions = true,
      planted = null,
      harvested = null,
      xpGained = 0,
    } = options;

    const buttons = [];

    if (showActions) {
      if (item.consumable && onUse) {
        buttons.push({
          text: `🍽️ Usar`,
          class: "btn-success",
          onClick: () => {
            onUse(item);
            return true;
          },
        });
      }

      if (item.sellPrice > 0 && onSell) {
        buttons.push({
          text: `<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> Vender (${item.sellPrice}g)`,
          class: "btn-primary",
          onClick: () => {
            onSell(item);
            return true;
          },
        });
      }
    }

    buttons.push({
      text: "Fechar",
      class: "btn-secondary",
      onClick: () => true,
    });

    const categoryColors = {
      seed: "#5caa1f",
      crop: "#f39c12",
      food: "#e74c3c",
      tool: "#95a5a6",
      resource: "#8b4513",
      other: "#7f8c8d",
    };

    const categoryColor = categoryColors[item.category] || categoryColors.other;

    const statsHTML = [];

    if (item.energyRestore) {
      statsHTML.push(
        `<div class="stat-item">⚡ Restaura: <strong>${item.energyRestore} energia</strong></div>`,
      );
    }

    if (item.healthRestore) {
      statsHTML.push(
        `<div class="stat-item">❤️ Restaura: <strong>${item.healthRestore} vida</strong></div>`,
      );
    }

    if (item.growTime) {
      const minutes = Math.floor(item.growTime / 60000);
      statsHTML.push(
        `<div class="stat-item">⏱️ Tempo de crescimento: <strong>${minutes}min</strong></div>`,
      );
    }

    if (item.sellPrice > 0) {
      statsHTML.push(
        `<div class="stat-item"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> Valor de venda: <strong>${item.sellPrice} ouro</strong></div>`,
      );
    }

    if (item.buyPrice > 0) {
      statsHTML.push(
        `<div class="stat-item">🛒 Valor de compra: <strong>${item.buyPrice} ouro</strong></div>`,
      );
    }

    if (xpGained > 0) {
      statsHTML.push(
        `<div class="stat-item">⭐ XP ganho: <strong>${xpGained}</strong></div>`,
      );
    }

    // Planting/harvesting info
    const activityHTML = [];
    if (planted !== null) {
      activityHTML.push(
        `<div class="activity-item">🌱 Plantado: <strong>${planted}x</strong></div>`,
      );
    }
    if (harvested !== null) {
      activityHTML.push(
        `<div class="activity-item">🧺 Colhido: <strong>${harvested}x</strong></div>`,
      );
    }

    const content = `
            <div class="item-modal-content">
                <div class="item-header">
                    <div class="item-icon-large" style="font-size: 4rem;">${item.icon || "📦"}</div>
                    <div class="item-info">
                        <h2 class="item-name">${item.name}</h2>
                        <div class="item-category" style="background: ${categoryColor}20; color: ${categoryColor}; border-color: ${categoryColor};">
                            ${item.category?.toUpperCase() || "ITEM"}
                        </div>
                    </div>
                </div>

                <div class="item-description">
                    <p>${item.description || "Sem descrição disponível."}</p>
                </div>

                ${
                  statsHTML.length > 0
                    ? `
                    <div class="item-stats">
                        <h4>📊 Estatísticas</h4>
                        ${statsHTML.join("")}
                    </div>
                `
                    : ""
                }

                ${
                  activityHTML.length > 0
                    ? `
                    <div class="item-activity">
                        <h4>📝 Atividade</h4>
                        ${activityHTML.join("")}
                    </div>
                `
                    : ""
                }

                ${
                  item.count > 0
                    ? `
                    <div class="item-quantity">
                        <span class="quantity-label">Quantidade no inventário:</span>
                        <span class="quantity-value">${item.count}</span>
                    </div>
                `
                    : ""
                }
            </div>

            <style>
                .item-modal-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .item-header {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid var(--border-color);
                }

                .item-icon-large {
                    text-align: center;
                }

                .item-info {
                    flex: 1;
                }

                .item-name {
                    margin: 0 0 0.5rem 0;
                    color: var(--text-primary);
                    font-size: 1.5rem;
                }

                .item-category {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border: 2px solid;
                    letter-spacing: 0.5px;
                }

                .item-description {
                    padding: 0.5rem 0;
                    color: var(--text-secondary);
                    line-height: 1.6;
                }

                .item-stats,
                .item-activity {
                    background: var(--bg-accent);
                    padding: 1rem;
                    border-radius: 8px;
                    border: 2px solid var(--border-color);
                }

                .item-stats h4,
                .item-activity h4 {
                    margin: 0 0 0.75rem 0;
                    color: var(--text-primary);
                    font-size: 1rem;
                }

                .stat-item,
                .activity-item {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--border-color);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    color: var(--text-secondary);
                }

                .stat-item:last-child,
                .activity-item:last-child {
                    border-bottom: none;
                }

                .stat-item strong,
                .activity-item strong {
                    color: var(--text-primary);
                }

                .item-quantity {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    background: var(--brand-primary);
                    color: white;
                    border-radius: 8px;
                    font-weight: 600;
                    box-shadow: 0 2px 8px rgba(92, 170, 31, 0.3);
                }

                .quantity-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                }
            </style>
        `;

    return this.show({
      title: "📦 Detalhes do Item",
      content,
      buttons,
      closable: true,
      size: "medium",
      theme: "default",
    });
  }

  /**
   * Show confirmation dialog
   * @param {Object} options - Confirmation options
   */
  showConfirm(options = {}) {
    const {
      title = "Confirmar",
      message = "Tem certeza?",
      confirmText = "Confirmar",
      cancelText = "Cancelar",
      confirmClass = "btn-danger",
      onConfirm = null,
      onCancel = null,
    } = options;

    return this.show({
      title,
      content: `<p style="font-size: 1.125rem; text-align: center; padding: 1rem 0;">${message}</p>`,
      buttons: [
        {
          text: cancelText,
          class: "btn-secondary",
          onClick: () => {
            if (onCancel) onCancel();
            return true;
          },
        },
        {
          text: confirmText,
          class: confirmClass,
          onClick: () => {
            if (onConfirm) onConfirm();
            return true;
          },
        },
      ],
      closable: true,
    });
  }

  /**
   * Show alert dialog
   * @param {Object} options - Alert options
   */
  showAlert(options = {}) {
    const {
      title = "Aviso",
      message = "",
      buttonText = "OK",
      type = "info",
    } = options;

    const icons = {
      info: "ℹ️",
      success: "✅",
      warning: "⚠️",
      error: "❌",
    };

    return this.show({
      title: `${icons[type] || icons.info} ${title}`,
      content: `<p style="font-size: 1.125rem; text-align: center; padding: 1rem 0;">${message}</p>`,
      buttons: [
        {
          text: buttonText,
          class: "btn-primary",
          onClick: () => true,
        },
      ],
      closable: true,
    });
  }

  /**
   * Check if modal is currently open
   */
  isOpen() {
    return this.container && this.container.classList.contains("active");
  }
}
