/**
 * FazendaRPG - Bank System
 * Manages player banking, deposits, withdrawals, and interest
 * @version 0.0.17
 */

export default class BankSystem {
  constructor(player) {
    this.player = player;
    this.interestRate = 0.03; // 3% interest every 4 hours
    this.interestInterval = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    this.minDeposit = 10;
    this.maxBalance = 1000000;
  }

  /**
   * Initialize bank system
   */
  init() {
    // Initialize bank data if not exists
    if (!this.player.data.bank) {
      this.player.data.bank = {
        balance: 0,
        totalDeposited: 0,
        totalWithdrawn: 0,
        transactionHistory: [],
        lastInterestTime: Date.now(),
        totalInterestEarned: 0,
      };
    }

    // Ensure lastInterestTime exists for old saves
    // IMPORTANTE: Só define se for realmente inválido, NUNCA reseta!
    if (
      !this.player.data.bank.lastInterestTime ||
      typeof this.player.data.bank.lastInterestTime !== "number" ||
      isNaN(this.player.data.bank.lastInterestTime) ||
      this.player.data.bank.lastInterestTime === 0
    ) {
      this.player.data.bank.lastInterestTime = Date.now();
      console.log("🏦 Initialized lastInterestTime for old save");
      // Salvar imediatamente após inicializar
      window.dispatchEvent(new CustomEvent("save:auto"));
    } else {
      console.log(
        "🏦 Using existing lastInterestTime:",
        new Date(this.player.data.bank.lastInterestTime).toLocaleString(),
      );
    }

    // Ensure totalInterestEarned exists
    if (
      !this.player.data.bank.totalInterestEarned ||
      typeof this.player.data.bank.totalInterestEarned !== "number"
    ) {
      this.player.data.bank.totalInterestEarned = 0;
    }

    // Calculate pending interest
    this.calculatePendingInterest();

    console.log("🏦 Bank system initialized");
    return true;
  }

  /**
   * Get bank balance
   * @returns {number}
   */
  getBalance() {
    return this.player.data.bank?.balance || 0;
  }

  /**
   * Calculate and apply pending interest
   * @returns {Object} Interest info
   */
  calculatePendingInterest() {
    const balance = this.getBalance();
    if (balance === 0) {
      return { interestEarned: 0, cycles: 0 };
    }

    const now = Date.now();
    const lastTime = this.player.data.bank?.lastInterestTime || now;
    const timePassed = now - lastTime;

    // Calculate how many 4-hour cycles have passed
    const cycles = Math.floor(timePassed / this.interestInterval);

    if (cycles === 0) {
      return { interestEarned: 0, cycles: 0 };
    }

    // Calculate compound interest for each cycle
    let currentBalance = balance;
    let totalInterest = 0;

    for (let i = 0; i < cycles; i++) {
      const interest = Math.floor(currentBalance * this.interestRate);
      totalInterest += interest;
      currentBalance += interest;
    }

    // Apply interest
    if (totalInterest > 0) {
      this.player.data.bank.balance = currentBalance;
      this.player.data.bank.totalInterestEarned += totalInterest;
      this.player.data.bank.lastInterestTime =
        lastTime + cycles * this.interestInterval;

      // Add transaction
      this.addTransaction({
        type: "interest",
        amount: totalInterest,
        cycles: cycles,
        timestamp: Date.now(),
      });

      console.log(
        `🏦 Applied ${cycles} cycles of interest: +${totalInterest}g`,
      );

      // Dispatch event
      window.dispatchEvent(
        new CustomEvent("bank:interest", {
          detail: { interest: totalInterest, cycles },
        }),
      );

      // Trigger save IMMEDIATELY to persist interest and lastInterestTime
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("save:auto"));
      }, 100);
    }

    return { interestEarned: totalInterest, cycles };
  }

  /**
   * Get time until next interest payment
   * @returns {Object} Time info
   */
  getNextInterestTime() {
    const now = Date.now();
    const lastTime = this.player.data.bank?.lastInterestTime || now;
    const nextTime = lastTime + this.interestInterval;
    const timeRemaining = Math.max(0, nextTime - now);

    // Convert to seconds first for accuracy
    const totalSeconds = Math.floor(timeRemaining / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      nextTime,
      timeRemaining,
      hoursRemaining: hours,
      minutesRemaining: minutes,
      secondsRemaining: seconds,
    };
  }

  /**
   * Deposit gold into bank
   * @param {number} amount - Amount to deposit
   * @returns {Object} Result
   */
  deposit(amount) {
    // Calculate pending interest first (this may update lastInterestTime if cycles completed)
    const pendingInterest = this.calculatePendingInterest();

    // Validate amount
    if (amount < this.minDeposit) {
      return {
        success: false,
        error: `Depósito mínimo: ${this.minDeposit} ouro`,
      };
    }

    if (amount > this.player.data.gold) {
      return {
        success: false,
        error: "Você não tem ouro suficiente!",
      };
    }

    // Check max balance
    const newBalance = this.getBalance() + amount;
    if (newBalance > this.maxBalance) {
      return {
        success: false,
        error: `Saldo máximo do banco: ${this.maxBalance} ouro`,
      };
    }

    // Remove gold from player
    this.player.removeGold(amount);

    // Add to bank (no instant interest)
    this.player.data.bank.balance += amount;
    this.player.data.bank.totalDeposited += amount;

    // Se não tem lastInterestTime válido (primeiro depósito), define agora
    if (
      !this.player.data.bank.lastInterestTime ||
      this.player.data.bank.lastInterestTime === 0
    ) {
      this.player.data.bank.lastInterestTime = Date.now();
      console.log("🏦 Started interest timer on first deposit");
      // Salvar imediatamente após iniciar timer
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("save:auto"));
      }, 100);
    }

    // Add transaction
    this.addTransaction({
      type: "deposit",
      amount: amount,
      timestamp: Date.now(),
    });

    console.log(`🏦 Deposited ${amount} gold`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("bank:deposit", {
        detail: { amount, newBalance: this.getBalance(), pendingInterest },
      }),
    );

    // Trigger save to persist deposit and lastInterestTime
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("save:auto"));
    }, 100);

    return {
      success: true,
      amount,
      newBalance: this.getBalance(),
      pendingInterest,
    };
  }

  /**
   * Withdraw gold from bank
   * @param {number} amount - Amount to withdraw
   * @returns {Object} Result
   */
  withdraw(amount) {
    // Calculate pending interest first
    const pendingInterest = this.calculatePendingInterest();

    // Validate amount
    if (amount <= 0) {
      return {
        success: false,
        error: "Valor inválido!",
      };
    }

    if (amount > this.getBalance()) {
      return {
        success: false,
        error: "Saldo insuficiente no banco!",
      };
    }

    // Remove from bank
    this.player.data.bank.balance -= amount;
    this.player.data.bank.totalWithdrawn += amount;

    // Add to player
    this.player.addGold(amount);

    // Add transaction
    this.addTransaction({
      type: "withdraw",
      amount: amount,
      timestamp: Date.now(),
    });

    console.log(`🏦 Withdrew ${amount} gold`);

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent("bank:withdraw", {
        detail: { amount, pendingInterest },
      }),
    );

    // Trigger save to persist withdrawal
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("save:auto"));
    }, 100);

    return {
      success: true,
      amount,
      newBalance: this.getBalance(),
      pendingInterest,
    };
  }

  /**
   * Deposit all gold
   * @returns {Object} Result
   */
  depositAll() {
    const amount = this.player.data.gold;
    if (amount < this.minDeposit) {
      return {
        success: false,
        error: `Você precisa de pelo menos ${this.minDeposit} ouro para depositar`,
      };
    }

    return this.deposit(amount);
  }

  /**
   * Withdraw all gold
   * @returns {Object} Result
   */
  withdrawAll() {
    const amount = this.getBalance();
    if (amount === 0) {
      return {
        success: false,
        error: "Banco vazio!",
      };
    }

    return this.withdraw(amount);
  }

  /**
   * Add transaction to history
   * @param {Object} transaction - Transaction data
   */
  addTransaction(transaction) {
    if (!this.player.data.bank.transactionHistory) {
      this.player.data.bank.transactionHistory = [];
    }

    this.player.data.bank.transactionHistory.unshift(transaction);

    // Keep only last 50 transactions
    if (this.player.data.bank.transactionHistory.length > 50) {
      this.player.data.bank.transactionHistory =
        this.player.data.bank.transactionHistory.slice(0, 50);
    }
  }

  /**
   * Get transaction history
   * @param {number} limit - Number of transactions to return
   * @returns {Array}
   */
  getTransactionHistory(limit = 10) {
    return (this.player.data.bank.transactionHistory || []).slice(0, limit);
  }

  /**
   * Get bank statistics
   * @returns {Object}
   */
  getStats() {
    const nextInterest = this.getNextInterestTime();

    return {
      balance: this.getBalance(),
      totalDeposited: this.player.data.bank?.totalDeposited || 0,
      totalWithdrawn: this.player.data.bank?.totalWithdrawn || 0,
      totalInterestEarned: this.player.data.bank?.totalInterestEarned || 0,
      transactionCount: this.player.data.bank?.transactionHistory?.length || 0,
      interestRate: this.interestRate * 100,
      interestInterval: this.interestInterval,
      minDeposit: this.minDeposit,
      maxBalance: this.maxBalance,
      nextInterestTime: nextInterest?.nextTime,
      timeUntilNextInterest: nextInterest?.timeRemaining,
      hoursUntilNextInterest: nextInterest?.hoursRemaining || 0,
      minutesUntilNextInterest: nextInterest?.minutesRemaining || 0,
      secondsRemaining: nextInterest?.secondsRemaining || 0,
    };
  }

  /**
   * Calculate interest on amount
   * @param {number} amount - Amount to calculate interest on
   * @returns {number}
   */
  calculateInterest(amount) {
    return Math.floor(amount * this.interestRate);
  }

  /**
   * Check if player can deposit
   * @param {number} amount - Amount to check
   * @returns {boolean}
   */
  canDeposit(amount) {
    if (amount < this.minDeposit) return false;
    if (amount > this.player.data.gold) return false;

    const interest = this.calculateInterest(amount);
    const newBalance = this.getBalance() + amount + interest;

    return newBalance <= this.maxBalance;
  }

  /**
   * Check if player can withdraw
   * @param {number} amount - Amount to check
   * @returns {boolean}
   */
  canWithdraw(amount) {
    return amount > 0 && amount <= this.getBalance();
  }

  /**
   * Get formatted transaction
   * @param {Object} transaction - Transaction data
   * @returns {string}
   */
  formatTransaction(transaction) {
    const date = new Date(transaction.timestamp);
    const timeStr = date.toLocaleString("pt-BR");

    if (transaction.type === "deposit") {
      return `${timeStr} - Depósito: ${transaction.amount}g`;
    } else if (transaction.type === "interest") {
      return `${timeStr} - Juros (${transaction.cycles}x): +${transaction.amount}g`;
    } else {
      return `${timeStr} - Saque: ${transaction.amount}g`;
    }
  }

  /**
   * Clear transaction history
   */
  clearHistory() {
    this.player.data.bank.transactionHistory = [];
    console.log("🏦 Transaction history cleared");
  }

  /**
   * Reset bank (for testing/debugging)
   */
  reset() {
    this.player.data.bank = {
      balance: 0,
      totalDeposited: 0,
      totalWithdrawn: 0,
      transactionHistory: [],
      lastInterestTime: Date.now(),
      totalInterestEarned: 0,
    };
    console.log("🏦 Bank reset");
  }
}
