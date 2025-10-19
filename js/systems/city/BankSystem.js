/**
 * FazendaRPG - Bank System
 * Manages player banking, deposits, withdrawals, and interest
 * @version 0.0.1
 */

export default class BankSystem {
    constructor(player) {
        this.player = player;
        this.interestRate = 0.01; // 1% interest per deposit
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
                transactionHistory: []
            };
        }

        console.log('🏦 Bank system initialized');
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
     * Deposit gold into bank
     * @param {number} amount - Amount to deposit
     * @returns {Object} Result
     */
    deposit(amount) {
        // Validate amount
        if (amount < this.minDeposit) {
            return {
                success: false,
                error: `Depósito mínimo: ${this.minDeposit} ouro`
            };
        }

        if (amount > this.player.data.gold) {
            return {
                success: false,
                error: 'Você não tem ouro suficiente!'
            };
        }

        // Calculate with interest
        const interest = Math.floor(amount * this.interestRate);
        const totalToAdd = amount + interest;

        // Check max balance
        const newBalance = this.getBalance() + totalToAdd;
        if (newBalance > this.maxBalance) {
            return {
                success: false,
                error: `Saldo máximo do banco: ${this.maxBalance} ouro`
            };
        }

        // Remove gold from player
        this.player.removeGold(amount);

        // Add to bank with interest
        this.player.data.bank.balance += totalToAdd;
        this.player.data.bank.totalDeposited += amount;

        // Add transaction
        this.addTransaction({
            type: 'deposit',
            amount: amount,
            interest: interest,
            total: totalToAdd,
            timestamp: Date.now()
        });

        console.log(`🏦 Deposited ${amount} gold + ${interest} interest (${this.interestRate * 100}%)`);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('bank:deposit', {
            detail: { amount, interest, total: totalToAdd }
        }));

        return {
            success: true,
            amount,
            interest,
            total: totalToAdd,
            newBalance: this.getBalance()
        };
    }

    /**
     * Withdraw gold from bank
     * @param {number} amount - Amount to withdraw
     * @returns {Object} Result
     */
    withdraw(amount) {
        // Validate amount
        if (amount <= 0) {
            return {
                success: false,
                error: 'Valor inválido!'
            };
        }

        if (amount > this.getBalance()) {
            return {
                success: false,
                error: 'Saldo insuficiente no banco!'
            };
        }

        // Remove from bank
        this.player.data.bank.balance -= amount;
        this.player.data.bank.totalWithdrawn += amount;

        // Add to player
        this.player.addGold(amount);

        // Add transaction
        this.addTransaction({
            type: 'withdraw',
            amount: amount,
            timestamp: Date.now()
        });

        console.log(`🏦 Withdrew ${amount} gold`);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('bank:withdraw', {
            detail: { amount }
        }));

        return {
            success: true,
            amount,
            newBalance: this.getBalance()
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
                error: `Você precisa de pelo menos ${this.minDeposit} ouro para depositar`
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
                error: 'Banco vazio!'
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
        return {
            balance: this.getBalance(),
            totalDeposited: this.player.data.bank?.totalDeposited || 0,
            totalWithdrawn: this.player.data.bank?.totalWithdrawn || 0,
            transactionCount: this.player.data.bank?.transactionHistory?.length || 0,
            interestRate: this.interestRate * 100,
            minDeposit: this.minDeposit,
            maxBalance: this.maxBalance
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
        const timeStr = date.toLocaleString('pt-BR');

        if (transaction.type === 'deposit') {
            return `${timeStr} - Depósito: ${transaction.amount}g + ${transaction.interest}g juros = ${transaction.total}g`;
        } else {
            return `${timeStr} - Saque: ${transaction.amount}g`;
        }
    }

    /**
     * Clear transaction history
     */
    clearHistory() {
        this.player.data.bank.transactionHistory = [];
        console.log('🏦 Transaction history cleared');
    }

    /**
     * Reset bank (for testing/debugging)
     */
    reset() {
        this.player.data.bank = {
            balance: 0,
            totalDeposited: 0,
            totalWithdrawn: 0,
            transactionHistory: []
        };
        console.log('🏦 Bank reset');
    }
}
