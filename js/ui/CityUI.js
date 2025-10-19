/**
 * FazendaRPG - City UI
 * Manages all city location interactions
 * @version 0.0.4
 */

import BankSystem from "../systems/city/BankSystem.js";
import TavernSystem from "../systems/city/TavernSystem.js";
import i18n from "../utils/i18n.js";
import MarketUI from "./MarketUI.js";

export default class CityUI {
  constructor(player, modal, notifications, inventorySystem, screenManager) {
    this.player = player;
    this.modal = modal;
    this.notifications = notifications;
    this.inventorySystem = inventorySystem;
    this.screenManager = screenManager;
    this.bankSystem = new BankSystem(player);
    this.tavernSystem = new TavernSystem(player);
    this.marketUI = null;
    this.container = null;
  }

  /**
   * Initialize City UI
   */
  init() {
    this.container = document.querySelector("#city-screen .city-grid");
    if (!this.container) {
      console.error("❌ City container not found");
      return false;
    }

    // Initialize systems
    this.bankSystem.init();
    this.tavernSystem.init();

    // Add event listeners to city cards
    this.setupEventListeners();

    console.log("✅ City UI initialized");
    return true;
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Wait for DOM to be ready
    setTimeout(() => {
      const cityCards = document.querySelectorAll(".city-card");
      cityCards.forEach((card) => {
        const location = card.dataset.location;
        card.addEventListener("click", () => {
          this.handleLocationClick(location);
        });
      });
    }, 100);
  }

  /**
   * Handle location click
   * @param {string} location - Location name
   */
  handleLocationClick(location) {
    switch (location) {
      case "market":
        this.showMarketScreen();
        break;
      case "bank":
        this.showBankUI();
        break;
      case "tavern":
        this.showTavernUI();
        break;
      case "plaza":
        this.showPlazaUI();
        break;
      default:
        this.notifications.show("Em breve!", "info");
    }
  }

  /**
   * Show Market Screen
   */
  showMarketScreen() {
    if (this.screenManager) {
      this.screenManager.showScreen("market-screen");
    }
  }

  /**
   * Set Market UI reference
   */
  setMarketUI(marketUI) {
    this.marketUI = marketUI;
  }

  /**
   * Show Bank UI
   */
  showBankUI() {
    const stats = this.bankSystem.getStats();
    const balance = this.bankSystem.getBalance();
    const playerGold = this.player.data.gold;

    const content = `
            <div class="bank-ui">
                <div class="bank-header">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🏦</div>
                    <h2 style="margin: 0 0 0.5rem 0;">Banco da Cidade</h2>
                    <p style="color: var(--text-secondary); margin: 0;">Guarde seu ouro com segurança e ganhe juros!</p>
                </div>

                <div class="bank-balances">
                    <div class="balance-card">
                        <div class="balance-label"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> Seu Ouro</div>
                        <div class="balance-value">${playerGold}g</div>
                    </div>
                    <div class="balance-card highlight">
                        <div class="balance-label">🏦 No Banco</div>
                        <div class="balance-value">${balance}g</div>
                    </div>
                </div>

                <div class="bank-info">
                    <div class="info-item">
                        <span>📈 Taxa de Juros:</span>
                        <strong>${stats.interestRate}% por depósito</strong>
                    </div>
                    <div class="info-item">
                        <span>💵 Depósito Mínimo:</span>
                        <strong>${stats.minDeposit}g</strong>
                    </div>
                    <div class="info-item">
                        <span>💎 Total Depositado:</span>
                        <strong>${stats.totalDeposited}g</strong>
                    </div>
                </div>

                <div class="bank-actions">
                    <div class="action-section">
                        <h3><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> Depositar</h3>
                        <input
                            type="number"
                            id="deposit-amount"
                            class="bank-input"
                            placeholder="Quantidade"
                            min="${stats.minDeposit}"
                            max="${playerGold}"
                            value="${Math.min(100, playerGold)}"
                        />
                        <div id="deposit-preview" class="preview-text">
                            Com ${stats.interestRate}% de juros
                        </div>
                        <div class="button-row">
                            <button class="btn btn-sm btn-secondary" onclick="document.getElementById('deposit-amount').value = Math.floor(${playerGold} * 0.25)">25%</button>
                            <button class="btn btn-sm btn-secondary" onclick="document.getElementById('deposit-amount').value = Math.floor(${playerGold} * 0.5)">50%</button>
                            <button class="btn btn-sm btn-secondary" onclick="document.getElementById('deposit-amount').value = Math.floor(${playerGold} * 0.75)">75%</button>
                            <button class="btn btn-sm btn-secondary" onclick="document.getElementById('deposit-amount').value = ${playerGold}">Tudo</button>
                        </div>
                    </div>

                    <div class="action-section">
                        <h3>🏦 Sacar</h3>
                        <input
                            type="number"
                            id="withdraw-amount"
                            class="bank-input"
                            placeholder="Quantidade"
                            min="1"
                            max="${balance}"
                            value="${Math.min(100, balance)}"
                        />
                        <div class="button-row">
                            <button class="btn btn-sm btn-secondary" onclick="document.getElementById('withdraw-amount').value = Math.floor(${balance} * 0.25)">25%</button>
                            <button class="btn btn-sm btn-secondary" onclick="document.getElementById('withdraw-amount').value = Math.floor(${balance} * 0.5)">50%</button>
                            <button class="btn btn-sm btn-secondary" onclick="document.getElementById('withdraw-amount').value = Math.floor(${balance} * 0.75)">75%</button>
                            <button class="btn btn-sm btn-secondary" onclick="document.getElementById('withdraw-amount').value = ${balance}">Tudo</button>
                        </div>
                    </div>
                </div>

                <style>
                    .bank-ui {
                        padding: 0.5rem 0;
                    }
                    .bank-header {
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }
                    .bank-balances {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                        margin-bottom: 1.5rem;
                    }
                    .balance-card {
                        background: var(--bg-accent);
                        border: 2px solid var(--border-color);
                        border-radius: 12px;
                        padding: 1rem;
                        text-align: center;
                    }
                    .balance-card.highlight {
                        background: linear-gradient(135deg, rgba(92, 170, 31, 0.1), var(--bg-accent));
                        border-color: var(--brand-primary);
                    }
                    .balance-label {
                        font-size: 0.875rem;
                        color: var(--text-secondary);
                        margin-bottom: 0.5rem;
                        font-weight: 600;
                    }
                    .balance-value {
                        font-size: 1.5rem;
                        font-weight: 700;
                        color: #b8860b;
                    }
                    .bank-info {
                        background: var(--bg-accent);
                        border: 2px solid var(--border-color);
                        border-radius: 8px;
                        padding: 1rem;
                        margin-bottom: 1.5rem;
                    }
                    .info-item {
                        display: flex;
                        justify-content: space-between;
                        padding: 0.5rem 0;
                        border-bottom: 1px solid var(--border-color);
                        font-size: 0.875rem;
                    }
                    .info-item:last-child {
                        border-bottom: none;
                    }
                    .bank-actions {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                    }
                    .action-section {
                        background: var(--bg-accent);
                        border: 2px solid var(--border-color);
                        border-radius: 8px;
                        padding: 1rem;
                    }
                    .action-section h3 {
                        margin: 0 0 0.75rem 0;
                        font-size: 1rem;
                        color: var(--text-primary);
                    }
                    .bank-input {
                        width: 100%;
                        padding: 0.75rem;
                        border: 2px solid var(--border-color);
                        border-radius: 8px;
                        background: var(--bg-secondary);
                        color: var(--text-primary);
                        font-size: 1rem;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                    }
                    .bank-input:focus {
                        outline: none;
                        border-color: var(--brand-primary);
                    }
                    .preview-text {
                        font-size: 0.75rem;
                        color: var(--text-secondary);
                        margin-bottom: 0.75rem;
                        text-align: center;
                    }
                    .button-row {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 0.25rem;
                        margin-bottom: 0.75rem;
                    }
                    @media (max-width: 480px) {
                        .bank-balances,
                        .bank-actions {
                            grid-template-columns: 1fr;
                        }
                    }
                </style>
            </div>
        `;

    this.modal.show({
      title: "🏦 Banco",
      content,
      buttons: [
        {
          text: '<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> Depositar',
          class: "btn-success",
          onClick: () => {
            const amount =
              parseInt(document.getElementById("deposit-amount").value) || 0;
            this.handleDeposit(amount);
            return false;
          },
        },
        {
          text: "🏦 Sacar",
          class: "btn-primary",
          onClick: () => {
            const amount =
              parseInt(document.getElementById("withdraw-amount").value) || 0;
            this.handleWithdraw(amount);
            return false;
          },
        },
        {
          text: "Fechar",
          class: "btn-secondary",
          onClick: () => true,
        },
      ],
      closable: true,
      size: "medium",
    });
  }

  /**
   * Handle deposit
   * @param {number} amount - Amount to deposit
   */
  handleDeposit(amount) {
    const result = this.bankSystem.deposit(amount);

    if (result.success) {
      this.notifications.show(
        i18n.t("bank.deposited", {
          amount: result.amount,
          interest: result.interest,
          newBalance: result.newBalance,
        }),
        "success",
      );
      this.modal.close();

      // Dispatch event to update UI
      window.dispatchEvent(new CustomEvent("player:goldChanged"));
    } else {
      this.notifications.show(result.error, "error");
    }
  }

  /**
   * Handle withdraw
   * @param {number} amount - Amount to withdraw
   */
  handleWithdraw(amount) {
    const result = this.bankSystem.withdraw(amount);

    if (result.success) {
      this.notifications.show(
        i18n.t("bank.withdrawn", {
          amount: result.amount,
          newBalance: result.newBalance,
        }),
        "success",
      );
      this.modal.close();

      // Dispatch event to update UI
      window.dispatchEvent(new CustomEvent("player:goldChanged"));
    } else {
      this.notifications.show(result.error, "error");
    }
  }

  /**
   * Show Tavern UI
   */
  showTavernUI() {
    const stats = this.tavernSystem.getStats();
    const meals = this.tavernSystem.getAvailableMeals();
    const restPrice = this.tavernSystem.getRestPrice();

    const content = `
            <div class="tavern-ui">
                <div class="tavern-header">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🍺</div>
                    <h2 style="margin: 0 0 0.5rem 0;">Taverna do Dragão Verde</h2>
                    <p style="color: var(--text-secondary); margin: 0;">Descanse, coma e ouça histórias!</p>
                </div>

                <div class="tavern-stats">
                    <div class="stat-box">
                        <div class="stat-icon">🎖️</div>
                        <div class="stat-info">
                            <div class="stat-label">Reputação</div>
                            <div class="stat-value">${stats.reputationLevel}</div>
                            <div class="stat-detail">${stats.discount} de desconto</div>
                        </div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-icon">📊</div>
                        <div class="stat-info">
                            <div class="stat-label">Visitas</div>
                            <div class="stat-value">${stats.totalVisits}</div>
                            <div class="stat-detail">${stats.totalMeals} refeições</div>
                        </div>
                    </div>
                </div>

                <div class="tavern-services">
                    <div class="service-card rest-card">
                        <div class="service-icon">😴</div>
                        <h3>Descansar</h3>
                        <p>Restaura 50 de energia</p>
                        <div class="service-price"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${restPrice}g</div>
                        <div class="service-energy">⚡ +50</div>
                    </div>

                    ${meals
                      .map(
                        (meal) => `
                        <div class="service-card meal-card" data-meal="${meal.type}">
                            <div class="service-icon">${meal.icon}</div>
                            <h3>${meal.name}</h3>
                            <p>${meal.description}</p>
                            <div class="service-price"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> ${meal.price}g ${meal.price < meal.basePrice ? `<span class="discount">-${meal.basePrice - meal.price}g</span>` : ""}</div>
                            <div class="service-benefits">
                                <span>⚡ +${meal.energy}</span>
                                <span>❤️ +${meal.health}</span>
                            </div>
                        </div>
                    `,
                      )
                      .join("")}

                    <div class="service-card story-card">
                        <div class="service-icon">📖</div>
                        <h3>Ouvir Histórias</h3>
                        <p>Ganhe XP e diversão</p>
                        <div class="service-price">10g</div>
                        <div class="service-xp">⭐ +5 XP</div>
                    </div>
                </div>

                <style>
                    .tavern-ui {
                        padding: 0.5rem 0;
                    }
                    .tavern-header {
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }
                    .tavern-stats {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 1rem;
                        margin-bottom: 1.5rem;
                    }
                    .stat-box {
                        background: var(--bg-accent);
                        border: 2px solid var(--border-color);
                        border-radius: 12px;
                        padding: 1rem;
                        display: flex;
                        gap: 1rem;
                        align-items: center;
                    }
                    .stat-icon {
                        font-size: 2.5rem;
                    }
                    .stat-info {
                        flex: 1;
                    }
                    .stat-label {
                        font-size: 0.75rem;
                        color: var(--text-secondary);
                        font-weight: 600;
                    }
                    .stat-value {
                        font-size: 1.125rem;
                        font-weight: 700;
                        color: var(--brand-primary);
                        margin: 0.25rem 0;
                    }
                    .stat-detail {
                        font-size: 0.75rem;
                        color: var(--text-secondary);
                    }
                    .tavern-services {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                        gap: 1rem;
                    }
                    .service-card {
                        background: var(--bg-secondary);
                        border: 2px solid var(--border-color);
                        border-radius: 12px;
                        padding: 1rem;
                        text-align: center;
                        cursor: pointer;
                        transition: all 0.2s;
                    }
                    .service-card:hover {
                        transform: translateY(-4px);
                        border-color: var(--brand-primary);
                        box-shadow: 0 6px 16px var(--shadow-color);
                    }
                    .service-icon {
                        font-size: 3rem;
                        margin-bottom: 0.5rem;
                    }
                    .service-card h3 {
                        margin: 0 0 0.25rem 0;
                        font-size: 0.875rem;
                        color: var(--text-primary);
                    }
                    .service-card p {
                        font-size: 0.75rem;
                        color: var(--text-secondary);
                        margin: 0 0 0.75rem 0;
                    }
                    .service-price {
                        background: #b8860b;
                        color: white;
                        padding: 0.5rem;
                        border-radius: 8px;
                        font-weight: 700;
                        margin-bottom: 0.5rem;
                        font-size: 0.875rem;
                    }
                    .discount {
                        background: rgba(255, 255, 255, 0.2);
                        padding: 2px 6px;
                        border-radius: 4px;
                        font-size: 0.75rem;
                        margin-left: 0.25rem;
                    }
                    .service-energy,
                    .service-xp {
                        font-size: 0.75rem;
                        color: var(--text-secondary);
                        font-weight: 600;
                    }
                    .service-benefits {
                        display: flex;
                        gap: 0.5rem;
                        justify-content: center;
                        font-size: 0.75rem;
                        font-weight: 600;
                    }
                    @media (max-width: 480px) {
                        .tavern-stats {
                            grid-template-columns: 1fr;
                        }
                        .tavern-services {
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }
                </style>
            </div>
        `;

    this.modal
      .show({
        title: "🍺 Taverna",
        content,
        buttons: [
          {
            text: "😴 Descansar",
            class: "btn-primary",
            onClick: () => {
              this.handleRest();
              return false;
            },
          },
          {
            text: "📖 Histórias",
            class: "btn-secondary",
            onClick: () => {
              this.handleStory();
              return false;
            },
          },
          {
            text: "Fechar",
            class: "btn-secondary",
            onClick: () => true,
          },
        ],
        closable: true,
        size: "medium",
      })
      .then(() => {
        // Add meal card click listeners
        setTimeout(() => {
          document.querySelectorAll(".meal-card").forEach((card) => {
            card.addEventListener("click", () => {
              const mealType = card.dataset.meal;
              this.handleMeal(mealType);
            });
          });
        }, 100);
      });
  }

  /**
   * Handle rest
   */
  handleRest() {
    const result = this.tavernSystem.rest();

    if (result.success) {
      this.notifications.show(
        i18n.t("tavern.rested", { restored: result.restored }),
        "success",
      );
      this.modal.close();

      // Dispatch event to update UI
      window.dispatchEvent(new CustomEvent("player:energyChanged"));
    } else {
      this.notifications.show(result.error, "error");
    }
  }

  /**
   * Handle meal purchase
   * @param {string} mealType - Type of meal
   */
  handleMeal(mealType) {
    const result = this.tavernSystem.buyMeal(mealType);

    if (result.success) {
      const messages = [];
      if (result.energyRestored > 0) {
        messages.push(
          i18n.t("tavern.energyRestored", { amount: result.energyRestored }),
        );
      }
      if (result.healthRestored > 0) {
        messages.push(
          i18n.t("tavern.healthRestored", { amount: result.healthRestored }),
        );
      }

      this.notifications.show(
        i18n.t("tavern.ateFood", { effects: messages.join(", ") }),
        "success",
      );
      this.modal.close();

      // Dispatch events
      window.dispatchEvent(new CustomEvent("player:energyChanged"));
      window.dispatchEvent(new CustomEvent("player:goldChanged"));
    } else {
      this.notifications.show(result.error, "error");
    }
  }

  /**
   * Handle story
   */
  handleStory() {
    const result = this.tavernSystem.listenToStory();

    if (result.success) {
      this.modal.close();

      // Show story modal
      setTimeout(() => {
        this.modal.show({
          title: `📖 ${result.story.title}`,
          content: `
                        <div style="text-align: center; padding: 1.5rem 0;">
                            <div style="font-size: 5rem; margin-bottom: 1rem;">${result.story.icon}</div>
                            <p style="font-size: 1.125rem; line-height: 1.6; color: var(--text-secondary); font-style: italic;">
                                "${result.story.text}"
                            </p>
                            <div style="margin-top: 1.5rem; padding: 1rem; background: var(--bg-accent); border-radius: 8px; border: 2px solid var(--border-color);">
                                <div style="color: var(--brand-primary); font-weight: 700;">
                                    ⭐ Você ganhou ${result.xp} XP!
                                </div>
                            </div>
                        </div>
                    `,
          buttons: [
            {
              text: "Que história incrível!",
              class: "btn-primary",
              onClick: () => true,
            },
          ],
          closable: true,
        });
      }, 300);

      // Dispatch event
      window.dispatchEvent(new CustomEvent("player:xpChanged"));
    } else {
      this.notifications.show(result.error, "error");
    }
  }

  /**
   * Show Plaza UI
   */
  showPlazaUI() {
    const playerName = this.player.data.name || "Fazendeiro";
    const level = this.player.data.level || 1;
    const totalSkillLevel = Object.values(this.player.data.skills || {}).reduce(
      (sum, skill) => sum + (skill.level || 1),
      0,
    );

    const content = `
            <div class="plaza-ui">
                <div class="plaza-header">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">⛲</div>
                    <h2 style="margin: 0 0 0.5rem 0;">Praça da Cidade</h2>
                    <p style="color: var(--text-secondary); margin: 0;">Centro de convivência e informações</p>
                </div>

                <div class="plaza-board">
                    <div class="board-section">
                        <h3>📢 Quadro de Avisos</h3>
                        <div class="notice">
                            <div class="notice-icon">🌾</div>
                            <div class="notice-content">
                                <strong>Temporada de Plantio</strong>
                                <p>Esta é a melhor época para plantar trigo e milho!</p>
                            </div>
                        </div>
                        <div class="notice">
                            <div class="notice-icon">🎉</div>
                            <div class="notice-content">
                                <strong>Festival em Breve</strong>
                                <p>Prepare-se para o festival da colheita!</p>
                            </div>
                        </div>
                        <div class="notice">
                            <div class="notice-icon">⚠️</div>
                            <div class="notice-content">
                                <strong>Cuidado nas Minas</strong>
                                <p>Mineiros reportaram movimentos estranhos...</p>
                            </div>
                        </div>
                    </div>

                    <div class="board-section">
                        <h3>🏆 Ranking Local</h3>
                        <div class="ranking-entry highlight">
                            <div class="ranking-position">1º</div>
                            <div class="ranking-info">
                                <div class="ranking-name">👑 ${playerName}</div>
                                <div class="ranking-detail">Nível ${level} • ${totalSkillLevel} skills totais</div>
                            </div>
                        </div>
                        <div class="ranking-entry">
                            <div class="ranking-position">2º</div>
                            <div class="ranking-info">
                                <div class="ranking-name">Old Farmer Joe</div>
                                <div class="ranking-detail">Nível 45 • Mestre Fazendeiro</div>
                            </div>
                        </div>
                        <div class="ranking-entry">
                            <div class="ranking-position">3º</div>
                            <div class="ranking-info">
                                <div class="ranking-name">Marcus the Merchant</div>
                                <div class="ranking-detail">Nível 38 • Comerciante</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="plaza-info">
                    <p style="text-align: center; color: var(--text-secondary); font-style: italic; margin: 1rem 0;">
                        "A praça é o coração da nossa comunidade. Aqui você sempre encontrará informações e amigos!"
                    </p>
                </div>

                <style>
                    .plaza-ui {
                        padding: 0.5rem 0;
                    }
                    .plaza-header {
                        text-align: center;
                        margin-bottom: 1.5rem;
                    }
                    .plaza-board {
                        display: grid;
                        gap: 1.5rem;
                    }
                    .board-section {
                        background: var(--bg-accent);
                        border: 2px solid var(--border-color);
                        border-radius: 12px;
                        padding: 1.25rem;
                    }
                    .board-section h3 {
                        margin: 0 0 1rem 0;
                        color: var(--brand-primary);
                        font-size: 1.125rem;
                    }
                    .notice {
                        display: flex;
                        gap: 1rem;
                        padding: 0.75rem;
                        background: var(--bg-secondary);
                        border: 2px solid var(--border-color);
                        border-radius: 8px;
                        margin-bottom: 0.75rem;
                    }
                    .notice:last-child {
                        margin-bottom: 0;
                    }
                    .notice-icon {
                        font-size: 2rem;
                        line-height: 1;
                    }
                    .notice-content {
                        flex: 1;
                    }
                    .notice-content strong {
                        display: block;
                        color: var(--text-primary);
                        margin-bottom: 0.25rem;
                        font-size: 0.875rem;
                    }
                    .notice-content p {
                        margin: 0;
                        color: var(--text-secondary);
                        font-size: 0.8125rem;
                    }
                    .ranking-entry {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        padding: 0.75rem;
                        background: var(--bg-secondary);
                        border: 2px solid var(--border-color);
                        border-radius: 8px;
                        margin-bottom: 0.75rem;
                    }
                    .ranking-entry:last-child {
                        margin-bottom: 0;
                    }
                    .ranking-entry.highlight {
                        background: linear-gradient(135deg, rgba(92, 170, 31, 0.15), var(--bg-secondary));
                        border-color: var(--brand-primary);
                    }
                    .ranking-position {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: var(--brand-primary);
                        min-width: 40px;
                        text-align: center;
                    }
                    .ranking-info {
                        flex: 1;
                    }
                    .ranking-name {
                        font-weight: 700;
                        color: var(--text-primary);
                        margin-bottom: 0.25rem;
                        font-size: 0.875rem;
                    }
                    .ranking-detail {
                        font-size: 0.75rem;
                        color: var(--text-secondary);
                    }
                    .plaza-info {
                        margin-top: 1.5rem;
                        padding-top: 1.5rem;
                        border-top: 2px solid var(--border-color);
                    }
                </style>
            </div>
        `;

    this.modal.show({
      title: "⛲ Praça da Cidade",
      content,
      buttons: [
        {
          text: "OK",
          class: "btn-primary",
          onClick: () => true,
        },
      ],
      closable: true,
      size: "medium",
    });
  }

  /**
   * Refresh city UI
   */
  refresh() {
    // Re-setup event listeners
    this.setupEventListeners();
  }
}
