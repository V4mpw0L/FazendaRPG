/**
 * FazendaRPG - City UI
 * Manages all city location interactions
 * @version 0.0.5
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

    // Format time until next interest
    const hoursLeft = stats.hoursUntilNextInterest || 0;
    const minutesLeft = stats.minutesUntilNextInterest || 0;
    const nextInterestIn =
      hoursLeft > 0 ? `${hoursLeft}h ${minutesLeft}m` : `${minutesLeft}m`;

    const content = `
            <div class="bank-ui">
                <div class="bank-header">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🏦</div>
                    <h2 style="margin: 0 0 0.5rem 0;">Banco da Cidade</h2>
                    <p style="color: var(--text-secondary); margin: 0;">Guarde seu ouro com segurança e ganhe juros a cada 4 horas!</p>
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

                ${
                  balance > 0
                    ? `
                <div class="interest-timer">
                    <div class="timer-icon">⏰</div>
                    <div class="timer-info">
                        <div class="timer-label">Próximos Juros em:</div>
                        <div class="timer-value">${nextInterestIn}</div>
                    </div>
                    <div class="interest-preview">
                        <div style="font-size: 0.625rem; color: var(--text-secondary); margin-bottom: 0.125rem;">Você receberá:</div>
                        <div style="font-size: 1rem; font-weight: 700; color: #5caa1f;">+${Math.floor((balance * (stats.interestRate || 1)) / 100)}g</div>
                    </div>
                </div>
                `
                    : ""
                }

                <div class="bank-info">
                    <div class="info-item">
                        <span>📈 Taxa de Juros:</span>
                        <strong>${stats.interestRate}% a cada 4 horas</strong>
                    </div>
                    <div class="info-item">
                        <span>💰 Juros Ganhos:</span>
                        <strong style="color: #5caa1f;">+${stats.totalInterestEarned}g</strong>
                    </div>
                    <div class="info-item">
                        <span>💵 Depósito Mínimo:</span>
                        <strong style="color: #b8860b;">${stats.minDeposit}g</strong>
                    </div>
                    <div class="info-item">
                        <span>💎 Total Depositado:</span>
                        <strong style="color: #b8860b;">${stats.totalDeposited}g</strong>
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
                            Juros: ${stats.interestRate}% a cada 4h
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
                        margin-bottom: 1rem;
                    }
                    .interest-timer {
                        background: linear-gradient(135deg, rgba(92, 170, 31, 0.1), rgba(126, 200, 80, 0.05));
                        border: 2px solid var(--brand-primary);
                        border-radius: 12px;
                        padding: 1rem;
                        margin-bottom: 1.5rem;
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }
                    .timer-icon {
                        font-size: 2rem;
                    }
                    .timer-info {
                        flex: 1;
                    }
                    .timer-label {
                        font-size: 0.75rem;
                        color: var(--text-secondary);
                        font-weight: 600;
                        margin-bottom: 0.25rem;
                    }
                    .timer-value {
                        font-size: 1.25rem;
                        font-weight: 700;
                        color: var(--brand-primary);
                    }
                    .interest-preview {
                        text-align: center;
                        padding: 0.5rem;
                        background: var(--bg-secondary);
                        border: 2px solid var(--border-color);
                        border-radius: 8px;
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
                    .info-item strong {
                        color: #b8860b;
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
                    @media (max-width: 768px) {
                        .bank-balances,
                        .bank-actions {
                            grid-template-columns: 1fr;
                        }
                        .interest-timer {
                            flex-direction: column;
                            text-align: center;
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
          onClick: () => {
            this.stopBankTimerUpdate();
            return true;
          },
        },
      ],
      closable: true,
      size: "medium",
    });

    // Start real-time timer update after modal renders
    setTimeout(() => {
      this.startBankTimerUpdate();
    }, 100);
  }

  /**
   * Start bank timer real-time update
   */
  startBankTimerUpdate() {
    // Clear any existing timer
    this.stopBankTimerUpdate();

    // Cache the target time ONCE
    const lastTime = this.player.data.bank?.lastInterestTime || Date.now();
    this.bankTargetTime = lastTime + 4 * 60 * 60 * 1000; // 4 hours in ms

    // Update immediately
    this.updateBankTimer();

    // Update every second
    this.bankTimerInterval = setInterval(() => {
      this.updateBankTimer();
    }, 1000);
  }

  /**
   * Stop bank timer update
   */
  stopBankTimerUpdate() {
    if (this.bankTimerInterval) {
      clearInterval(this.bankTimerInterval);
      this.bankTimerInterval = null;
    }
    this.bankTargetTime = null;
  }

  /**
   * Update bank timer display
   */
  updateBankTimer() {
    const timerValue = document.querySelector(".timer-value");
    const interestPreview = document.querySelector(
      ".interest-preview div:last-child",
    );

    if (!timerValue) {
      this.stopBankTimerUpdate();
      return;
    }

    // Calculate time remaining from cached target
    const now = Date.now();
    const timeRemaining = Math.max(0, this.bankTargetTime - now);

    // Convert to time units
    const totalSeconds = Math.floor(timeRemaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Format display
    const nextInterestIn =
      hours > 0
        ? `${hours}h ${minutes}m ${seconds}s`
        : minutes > 0
          ? `${minutes}m ${seconds}s`
          : `${seconds}s`;

    // Update timer
    timerValue.textContent = nextInterestIn;

    // Update interest preview
    const balance = this.bankSystem.getBalance();
    if (interestPreview && balance > 0) {
      const nextInterest = Math.floor(balance * 0.01);
      interestPreview.textContent = `+${nextInterest}g`;
    }
  }

  /**
   * Handle deposit
   * @param {number} amount - Amount to deposit
   */
  handleDeposit(amount) {
    const result = this.bankSystem.deposit(amount);

    if (result.success) {
      // Check if there was pending interest
      if (result.pendingInterest && result.pendingInterest.interestEarned > 0) {
        this.notifications.show(
          `Depositou ${result.amount}g! +${result.pendingInterest.interestEarned}g de juros recebidos! Total no banco: ${result.newBalance}g`,
          "success",
        );
      } else {
        this.notifications.show(
          `Depositou ${result.amount}g! Total no banco: ${result.newBalance}g`,
          "success",
        );
      }
      this.modal.close();
      this.stopBankTimerUpdate();

      // Dispatch event to update UI
      window.dispatchEvent(new CustomEvent("player:goldChanged"));

      // Trigger save to persist bank data
      window.dispatchEvent(new CustomEvent("save:auto"));
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
      // Check if there was pending interest
      if (result.pendingInterest && result.pendingInterest.interestEarned > 0) {
        this.notifications.show(
          `Sacou ${result.amount}g! +${result.pendingInterest.interestEarned}g de juros recebidos! Saldo no banco: ${result.newBalance}g`,
          "success",
        );
      } else {
        this.notifications.show(
          `Sacou ${result.amount}g! Saldo no banco: ${result.newBalance}g`,
          "success",
        );
      }
      this.modal.close();
      this.stopBankTimerUpdate();

      // Dispatch event to update UI
      window.dispatchEvent(new CustomEvent("player:goldChanged"));

      // Trigger save to persist bank data
      window.dispatchEvent(new CustomEvent("save:auto"));
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
    const playerEnergy = this.player.data.energy || 0;
    const maxEnergy = this.player.data.maxEnergy || 100;
    const playerGold = this.player.data.gold || 0;

    // Calculate reputation progress
    const reputation = stats.reputation;
    const nextMilestone =
      reputation < 10
        ? 10
        : reputation < 25
          ? 25
          : reputation < 50
            ? 50
            : reputation < 100
              ? 100
              : 100;
    const prevMilestone =
      reputation < 10
        ? 0
        : reputation < 25
          ? 10
          : reputation < 50
            ? 25
            : reputation < 100
              ? 50
              : 100;
    const repProgress =
      reputation >= 100
        ? 100
        : ((reputation - prevMilestone) / (nextMilestone - prevMilestone)) *
          100;

    const content = `
            <div class="tavern-ui">
                <div class="tavern-header">
                    <div style="font-size: 5rem; margin-bottom: 0.5rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">🍺</div>
                    <h2 style="margin: 0 0 0.5rem 0; font-size: 1.75rem; color: var(--brand-primary);">Taverna do Viajante</h2>
                    <p style="color: var(--text-secondary); margin: 0; font-size: 0.875rem;">Descanse, coma bem e ouça as melhores histórias da região!</p>
                </div>

                <div class="player-status">
                    <div class="status-item">
                        <span class="status-label">💰 Seu Ouro:</span>
                        <span class="status-value" style="color: #b8860b; font-weight: 700;">${playerGold}g</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">⚡ Energia:</span>
                        <span class="status-value" style="color: ${playerEnergy > maxEnergy * 0.5 ? "#5caa1f" : "#ff6b6b"}; font-weight: 700;">${playerEnergy}/${maxEnergy}</span>
                    </div>
                </div>

                <div class="reputation-section">
                    <div class="reputation-header">
                        <div class="reputation-icon">⭐</div>
                        <div class="reputation-details">
                            <div class="reputation-level">${stats.reputationLevel}</div>
                            <div class="reputation-points">${reputation} pontos de reputação</div>
                        </div>
                        <div class="reputation-discount">
                            <div style="font-size: 1.25rem; font-weight: 700; color: #5caa1f;">${stats.discount}</div>
                            <div style="font-size: 0.625rem; color: var(--text-secondary);">desconto</div>
                        </div>
                    </div>
                    <div class="reputation-bar">
                        <div class="reputation-fill" style="width: ${repProgress}%"></div>
                        <div class="reputation-text">${reputation >= 100 ? "MAX" : `${nextMilestone - reputation} pts para próximo nível`}</div>
                    </div>
                </div>

                <div class="tavern-achievements">
                    <h3 style="margin: 0 0 0.75rem 0; color: var(--text-primary); font-size: 0.875rem; font-weight: 700;">🏆 Conquistas da Taverna</h3>
                    <div class="achievements-grid">
                        <div class="achievement-badge ${stats.totalVisits >= 10 ? "unlocked" : "locked"}">
                            <div class="achievement-icon">${stats.totalVisits >= 10 ? "🎖️" : "🔒"}</div>
                            <div class="achievement-name">Frequentador</div>
                            <div class="achievement-desc">${stats.totalVisits}/10 visitas</div>
                        </div>
                        <div class="achievement-badge ${stats.totalMeals >= 20 ? "unlocked" : "locked"}">
                            <div class="achievement-icon">${stats.totalMeals >= 20 ? "🍽️" : "🔒"}</div>
                            <div class="achievement-name">Gastronomo</div>
                            <div class="achievement-desc">${stats.totalMeals}/20 refeições</div>
                        </div>
                        <div class="achievement-badge ${stats.totalStories >= 15 ? "unlocked" : "locked"}">
                            <div class="achievement-icon">${stats.totalStories >= 15 ? "📚" : "🔒"}</div>
                            <div class="achievement-name">Contador</div>
                            <div class="achievement-desc">${stats.totalStories}/15 histórias</div>
                        </div>
                        <div class="achievement-badge ${stats.reputation >= 100 ? "unlocked" : "locked"}">
                            <div class="achievement-icon">${stats.reputation >= 100 ? "👑" : "🔒"}</div>
                            <div class="achievement-name">Lenda</div>
                            <div class="achievement-desc">${stats.reputation}/100 rep</div>
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
                        <div class="service-price"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;"> 10g</div>
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
                        padding-bottom: 1.5rem;
                        border-bottom: 2px solid var(--border-color);
                    }
                    .player-status {
                        display: flex;
                        justify-content: space-around;
                        gap: 1rem;
                        padding: 1rem;
                        background: var(--bg-accent);
                        border: 2px solid var(--border-color);
                        border-radius: 12px;
                        margin-bottom: 1.5rem;
                    }
                    .status-item {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 0.25rem;
                    }
                    .status-label {
                        font-size: 0.75rem;
                        color: var(--text-secondary);
                        font-weight: 600;
                    }
                    .status-value {
                        font-size: 1.125rem;
                        font-weight: 700;
                    }
                    .reputation-section {
                        background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
                        border: 3px solid #ffd700;
                        border-radius: 16px;
                        padding: 1.25rem;
                        margin-bottom: 1.5rem;
                        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
                    }
                    .reputation-header {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        margin-bottom: 1rem;
                    }
                    .reputation-icon {
                        font-size: 2.5rem;
                        filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.5));
                    }
                    .reputation-details {
                        flex: 1;
                    }
                    .reputation-level {
                        font-size: 1.125rem;
                        font-weight: 700;
                        color: var(--brand-primary);
                        margin-bottom: 0.125rem;
                    }
                    .reputation-points {
                        font-size: 0.75rem;
                        color: var(--text-secondary);
                        font-weight: 600;
                    }
                    .reputation-discount {
                        text-align: center;
                        padding: 0.5rem;
                        background: var(--bg-secondary);
                        border: 2px solid var(--border-color);
                        border-radius: 8px;
                    }
                    .reputation-bar {
                        position: relative;
                        width: 100%;
                        height: 32px;
                        background: var(--bg-accent);
                        border: 2px solid var(--border-color);
                        border-radius: 16px;
                        overflow: hidden;
                        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .reputation-fill {
                        height: 100%;
                        background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
                        transition: width 0.5s ease;
                        box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
                    }
                    .reputation-text {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        font-size: 0.75rem;
                        font-weight: 700;
                        color: var(--text-primary);
                        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                        white-space: nowrap;
                    }
                    .tavern-achievements {
                        background: var(--bg-accent);
                        border: 2px solid var(--border-color);
                        border-radius: 12px;
                        padding: 1rem;
                        margin-bottom: 1.5rem;
                    }
                    .achievements-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 0.75rem;
                    }
                    .achievement-badge {
                        background: var(--bg-secondary);
                        border: 2px solid var(--border-color);
                        border-radius: 10px;
                        padding: 0.75rem 0.5rem;
                        text-align: center;
                        transition: all 0.2s;
                    }
                    .achievement-badge.unlocked {
                        border-color: #5caa1f;
                        background: linear-gradient(135deg, rgba(92, 170, 31, 0.1), var(--bg-secondary));
                    }
                    .achievement-badge.locked {
                        opacity: 0.5;
                        filter: grayscale(0.7);
                    }
                    .achievement-badge:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                    .achievement-icon {
                        font-size: 1.75rem;
                        margin-bottom: 0.25rem;
                    }
                    .achievement-name {
                        font-size: 0.625rem;
                        font-weight: 700;
                        color: var(--text-primary);
                        margin-bottom: 0.125rem;
                    }
                    .achievement-desc {
                        font-size: 0.5625rem;
                        color: var(--text-secondary);
                        font-weight: 600;
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
                    @media (max-width: 768px) {
                        .achievements-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }
                    }
                    @media (max-width: 480px) {
                        .player-status {
                            flex-direction: column;
                        }
                        .tavern-services {
                            grid-template-columns: repeat(2, 1fr);
                        }
                        .achievements-grid {
                            grid-template-columns: repeat(2, 1fr);
                        }
                        .reputation-header {
                            flex-direction: column;
                            text-align: center;
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
    const xp = this.player.data.xp || 0;
    const gold = this.player.data.gold || 0;
    const energy = this.player.data.energy || 0;
    const maxEnergy = this.player.data.maxEnergy || 100;

    const totalSkillLevel = Object.values(this.player.data.skills || {}).reduce(
      (sum, skill) => sum + (skill.level || 1),
      0,
    );

    const farmingLevel = this.player.data.skills?.farming?.level || 1;
    const farmingXP = this.player.data.skills?.farming?.xp || 0;

    const content = `
            <div class="plaza-ui">
                <div class="plaza-header">
                    <div style="font-size: 5rem; margin-bottom: 0.5rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">⛲</div>
                    <h2 style="margin: 0 0 0.5rem 0; font-size: 1.75rem; color: var(--brand-primary);">Praça da Cidade</h2>
                    <p style="color: var(--text-secondary); margin: 0; font-size: 0.875rem;">Centro de convivência e informações</p>
                </div>

                <div class="player-showcase">
                    <div style="text-align: center; margin-bottom: 1rem;">
                        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">👨‍🌾</div>
                        <h3 style="margin: 0 0 0.25rem 0; font-size: 1.5rem; color: var(--text-primary);">${playerName}</h3>
                        <div style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">
                            ⭐ Fazendeiro Nível ${level}
                        </div>
                    </div>

                    <div class="player-stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">⚡</div>
                            <div class="stat-info">
                                <div class="stat-label">Energia</div>
                                <div class="stat-value">${energy}/${maxEnergy}</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1.5rem; height: 1.5rem;"></div>
                            <div class="stat-info">
                                <div class="stat-label">Ouro</div>
                                <div class="stat-value" style="color: #b8860b;">${gold}g</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🌾</div>
                            <div class="stat-info">
                                <div class="stat-label">Agricultura</div>
                                <div class="stat-value" style="color: #5caa1f;">Nv ${farmingLevel}</div>
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">🏆</div>
                            <div class="stat-info">
                                <div class="stat-label">Total Skills</div>
                                <div class="stat-value">${totalSkillLevel}</div>
                            </div>
                        </div>
                    </div>
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
                            <div class="notice-icon">💡</div>
                            <div class="notice-content">
                                <strong>Dica do Dia</strong>
                                <p>Use fertilizante para acelerar o crescimento!</p>
                            </div>
                        </div>
                    </div>

                    <div class="board-section">
                        <h3>🏆 Ranking da Cidade</h3>
                        <div class="ranking-entry highlight">
                            <div class="ranking-position">
                                <div style="font-size: 1.5rem;">🥇</div>
                            </div>
                            <div class="ranking-info">
                                <div class="ranking-name">👑 ${playerName}</div>
                                <div class="ranking-detail">Nível ${level} • ${totalSkillLevel} Skills • ${gold}g</div>
                            </div>
                        </div>
                        <div class="ranking-entry">
                            <div class="ranking-position">
                                <div style="font-size: 1.5rem;">🥈</div>
                            </div>
                            <div class="ranking-info">
                                <div class="ranking-name">Old Farmer Joe</div>
                                <div class="ranking-detail">Nível 45 • Mestre Fazendeiro</div>
                            </div>
                        </div>
                        <div class="ranking-entry">
                            <div class="ranking-position">
                                <div style="font-size: 1.5rem;">🥉</div>
                            </div>
                            <div class="ranking-info">
                                <div class="ranking-name">Marcus the Merchant</div>
                                <div class="ranking-detail">Nível 38 • Comerciante Rico</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="plaza-info">
                    <p style="text-align: center; color: var(--text-secondary); font-style: italic; margin: 1rem 0; font-size: 0.875rem;">
                        💬 "A praça é o coração da nossa comunidade. Aqui você sempre encontrará informações e amigos!"
                    </p>
                </div>

                <style>
                    .plaza-ui {
                        padding: 0.5rem 0;
                    }
                    .plaza-header {
                        text-align: center;
                        margin-bottom: 1.5rem;
                        padding-bottom: 1.5rem;
                        border-bottom: 2px solid var(--border-color);
                    }
                    .player-showcase {
                        background: linear-gradient(135deg, rgba(92, 170, 31, 0.1), rgba(126, 200, 80, 0.05));
                        border: 3px solid var(--brand-primary);
                        border-radius: 16px;
                        padding: 1.5rem;
                        margin-bottom: 1.5rem;
                        box-shadow: 0 4px 12px rgba(92, 170, 31, 0.2);
                    }
                    .player-stats-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 0.75rem;
                    }
                    .stat-card {
                        background: var(--bg-secondary);
                        border: 2px solid var(--border-color);
                        border-radius: 12px;
                        padding: 0.875rem;
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        transition: all 0.2s;
                    }
                    .stat-card:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                        border-color: var(--brand-primary);
                    }
                    .stat-icon {
                        font-size: 1.75rem;
                        line-height: 1;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .stat-info {
                        flex: 1;
                    }
                    .stat-label {
                        font-size: 0.625rem;
                        color: var(--text-secondary);
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 0.125rem;
                        font-weight: 600;
                    }
                    .stat-value {
                        font-size: 1rem;
                        font-weight: 700;
                        color: var(--text-primary);
                    }
                    .plaza-board {
                        display: grid;
                        gap: 1rem;
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
                        font-size: 1rem;
                        font-weight: 700;
                    }
                    .notice {
                        display: flex;
                        gap: 0.875rem;
                        padding: 0.75rem;
                        background: var(--bg-secondary);
                        border: 2px solid var(--border-color);
                        border-radius: 8px;
                        margin-bottom: 0.625rem;
                        transition: all 0.2s;
                    }
                    .notice:hover {
                        border-color: var(--brand-primary);
                        transform: translateX(4px);
                    }
                    .notice:last-child {
                        margin-bottom: 0;
                    }
                    .notice-icon {
                        font-size: 1.75rem;
                        line-height: 1;
                    }
                    .notice-content {
                        flex: 1;
                    }
                    .notice-content strong {
                        display: block;
                        color: var(--text-primary);
                        margin-bottom: 0.25rem;
                        font-size: 0.8125rem;
                        font-weight: 700;
                    }
                    .notice-content p {
                        margin: 0;
                        color: var(--text-secondary);
                        font-size: 0.75rem;
                        line-height: 1.4;
                    }
                    .ranking-entry {
                        display: flex;
                        align-items: center;
                        gap: 0.875rem;
                        padding: 0.875rem;
                        background: var(--bg-secondary);
                        border: 2px solid var(--border-color);
                        border-radius: 8px;
                        margin-bottom: 0.625rem;
                        transition: all 0.2s;
                    }
                    .ranking-entry:hover {
                        transform: translateX(4px);
                        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    }
                    .ranking-entry:last-child {
                        margin-bottom: 0;
                    }
                    .ranking-entry.highlight {
                        background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(92, 170, 31, 0.1));
                        border-color: #ffd700;
                        box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
                    }
                    .ranking-entry.highlight:hover {
                        box-shadow: 0 6px 16px rgba(255, 215, 0, 0.4);
                    }
                    .ranking-position {
                        min-width: 45px;
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
                    .ranking-entry.highlight .ranking-name {
                        color: var(--brand-primary);
                    }
                    .ranking-detail {
                        font-size: 0.6875rem;
                        color: var(--text-secondary);
                    }
                    .plaza-info {
                        margin-top: 1.5rem;
                        padding-top: 1.5rem;
                        border-top: 2px solid var(--border-color);
                    }
                    @media (max-width: 480px) {
                        .player-stats-grid {
                            grid-template-columns: 1fr;
                        }
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
