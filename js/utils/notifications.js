/**
 * FazendaRPG - Notification System
 * Handles toast notifications with different types
 * @version 0.0.1
 */

class NotificationManager {
    constructor() {
        this.container = null;
        this.queue = [];
        this.isShowing = false;
        this.defaultDuration = 3000;
        this.init();
    }

    /**
     * Initialize notification container
     */
    init() {
        this.container = document.getElementById('notification-toast');
        if (!this.container) {
            console.warn('⚠️ Notification container not found');
        }
    }

    /**
     * Show a notification
     * @param {string} message - Message to display
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {number} duration - Duration in milliseconds
     */
    show(message, type = 'info', duration = this.defaultDuration) {
        if (!this.container) {
            console.error('❌ Cannot show notification: container not found');
            return;
        }

        // If a notification is showing, queue this one
        if (this.isShowing) {
            this.queue.push({ message, type, duration });
            return;
        }

        this.isShowing = true;

        // Set message and type
        this.container.textContent = message;
        this.container.className = 'notification-toast show ' + type;

        // Play notification sound (if enabled)
        this.playSound(type);

        // Auto-hide after duration
        setTimeout(() => {
            this.hide();
        }, duration);
    }

    /**
     * Hide the current notification
     */
    hide() {
        if (!this.container) return;

        this.container.classList.remove('show');
        this.isShowing = false;

        // Show next notification in queue
        setTimeout(() => {
            if (this.queue.length > 0) {
                const next = this.queue.shift();
                this.show(next.message, next.type, next.duration);
            }
        }, 300); // Wait for hide animation
    }

    /**
     * Show success notification
     * @param {string} message
     * @param {number} duration
     */
    success(message, duration) {
        this.show(message, 'success', duration);
    }

    /**
     * Show error notification
     * @param {string} message
     * @param {number} duration
     */
    error(message, duration) {
        this.show(message, 'error', duration);
    }

    /**
     * Show warning notification
     * @param {string} message
     * @param {number} duration
     */
    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    /**
     * Show info notification
     * @param {string} message
     * @param {number} duration
     */
    info(message, duration) {
        this.show(message, 'info', duration);
    }

    /**
     * Play notification sound based on type
     * @param {string} type
     */
    playSound(type) {
        // Check if sound is enabled in settings
        const soundEnabled = localStorage.getItem('fazenda_sound_enabled') !== 'false';
        if (!soundEnabled) return;

        // Future: Add sound effects
        // For now, use browser beep for important notifications
        if (type === 'error') {
            // Only beep on errors to avoid annoyance
            try {
                const context = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = context.createOscillator();
                const gainNode = context.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(context.destination);

                oscillator.frequency.value = 400;
                oscillator.type = 'sine';

                gainNode.gain.setValueAtTime(0.1, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.1);
            } catch (e) {
                // Audio API not supported or blocked
            }
        }
    }

    /**
     * Clear all notifications
     */
    clear() {
        this.queue = [];
        this.hide();
    }

    /**
     * Show level up notification with special styling
     * @param {number} level
     * @param {string} skill - Optional skill name
     */
    levelUp(level, skill = null) {
        let message = skill
            ? `🎉 ${skill} reached level ${level}!`
            : `🎉 Congratulations! You reached level ${level}!`;

        this.show(message, 'success', 4000);
    }

    /**
     * Show quest completed notification
     * @param {string} questName
     * @param {Object} rewards
     */
    questCompleted(questName, rewards = {}) {
        let message = `✅ Quest "${questName}" completed!`;

        if (rewards.gold) {
            message += ` +${rewards.gold} 💰`;
        }
        if (rewards.xp) {
            message += ` +${rewards.xp} XP`;
        }

        this.show(message, 'success', 4000);
    }

    /**
     * Show achievement unlocked notification
     * @param {string} achievementName
     */
    achievement(achievementName) {
        this.show(`🏆 Achievement unlocked: ${achievementName}!`, 'success', 5000);
    }

    /**
     * Show item received notification
     * @param {string} itemName
     * @param {number} amount
     */
    itemReceived(itemName, amount = 1) {
        const message = amount > 1
            ? `Received: ${itemName} x${amount}`
            : `Received: ${itemName}`;

        this.show(message, 'info', 2500);
    }

    /**
     * Show energy low warning
     * @param {number} currentEnergy
     */
    energyLow(currentEnergy) {
        this.show(`⚡ Low energy! (${currentEnergy}/100)`, 'warning', 3000);
    }

    /**
     * Show saved notification
     */
    saved() {
        this.show('💾 Progress saved!', 'success', 2000);
    }
}

// Create singleton instance
const notifications = new NotificationManager();

export default notifications;
