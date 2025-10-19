/**
 * FazendaRPG - Top Bar UI Component
 * Manages the fixed top bar with real-time player stats and menu toggle
 * @version 0.0.1
 */

export default class TopBar {
    constructor(player, skillSystem) {
        this.player = player;
        this.skillSystem = skillSystem;
        this.elements = {};
        this.updateInterval = null;
    }

    /**
     * Initialize top bar
     */
    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.startAutoUpdate();
        this.update();
        console.log('✅ Top bar initialized');
    }

    /**
     * Cache DOM elements
     */
    cacheElements() {
        this.elements = {
            gold: document.getElementById('topbar-gold'),
            energy: document.getElementById('topbar-energy'),
            level: document.getElementById('topbar-level'),
            farming: document.getElementById('topbar-farming'),
            menuToggle: document.getElementById('menu-toggle')
        };
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Listen to player stat changes
        window.addEventListener('player:levelup', () => this.update());
        window.addEventListener('player:skillLevelup', () => this.update());
        window.addEventListener('inventory:itemAdded', () => this.update());
        window.addEventListener('inventory:itemRemoved', () => this.update());
        window.addEventListener('inventory:itemSold', () => this.update());

        // Energy changes
        window.addEventListener('farm:planted', () => this.update());
        window.addEventListener('farm:harvested', () => this.update());
    }

    /**
     * Update all status displays
     */
    update() {
        this.updateGold();
        this.updateEnergy();
        this.updateLevel();
        this.updateFarmingSkill();
    }

    /**
     * Update gold display
     */
    updateGold() {
        if (!this.elements.gold) return;

        const gold = this.player.data.gold;
        const formattedGold = this.formatNumber(gold);

        if (this.elements.gold.textContent !== formattedGold) {
            this.elements.gold.textContent = formattedGold;
            this.animateUpdate(this.elements.gold.parentElement);
        }
    }

    /**
     * Update energy display
     */
    updateEnergy() {
        if (!this.elements.energy) return;

        const energy = this.player.data.energy;
        const maxEnergy = this.player.data.maxEnergy;
        const energyText = `${energy}/${maxEnergy}`;

        if (this.elements.energy.textContent !== energyText) {
            this.elements.energy.textContent = energyText;
            this.animateUpdate(this.elements.energy.parentElement);

            // Add warning class if energy is low
            const statusItem = this.elements.energy.parentElement;
            if (energy < 20) {
                statusItem.classList.add('energy-low');
            } else {
                statusItem.classList.remove('energy-low');
            }
        }
    }

    /**
     * Update level display
     */
    updateLevel() {
        if (!this.elements.level) return;

        const level = this.player.data.level;

        if (this.elements.level.textContent !== level.toString()) {
            this.elements.level.textContent = level;
            this.animateUpdate(this.elements.level.parentElement);
        }
    }

    /**
     * Update farming skill display
     */
    updateFarmingSkill() {
        if (!this.elements.farming) return;

        const farmingLevel = this.skillSystem.getLevel('farming');

        if (this.elements.farming.textContent !== farmingLevel.toString()) {
            this.elements.farming.textContent = farmingLevel;
            this.animateUpdate(this.elements.farming.parentElement);
        }
    }

    /**
     * Animate status update
     * @param {HTMLElement} element - Element to animate
     */
    animateUpdate(element) {
        if (!element) return;

        element.classList.remove('updated');
        // Trigger reflow
        void element.offsetWidth;
        element.classList.add('updated');

        setTimeout(() => {
            element.classList.remove('updated');
        }, 300);
    }

    /**
     * Format number with separators
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    /**
     * Start auto-update interval
     */
    startAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        // Update every 2 seconds
        this.updateInterval = setInterval(() => {
            this.update();
        }, 2000);
    }

    /**
     * Stop auto-update interval
     */
    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Show notification on top bar (optional enhancement)
     * @param {string} message - Message to show
     * @param {string} type - Notification type
     */
    showNotification(message, type = 'info') {
        // Future: Show temporary notifications in top bar
        console.log(`[TopBar] ${type}: ${message}`);
    }

    /**
     * Clean up
     */
    destroy() {
        this.stopAutoUpdate();
        this.elements = {};
    }
}
