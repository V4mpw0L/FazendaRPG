/**
 * FazendaRPG - Advanced Notification System
 * Modern toast notifications with icons, animations and rich styling
 * @version 0.0.5
 */

import i18n from "./i18n.js";

class NotificationManager {
  constructor() {
    this.container = null;
    this.queue = [];
    this.activeNotifications = [];
    this.maxVisible = 3;
    this.defaultDuration = 3500;
    this.init();
  }

  /**
   * Initialize notification system
   */
  init() {
    // Create notifications container if it doesn't exist
    let container = document.getElementById("notifications-container");

    if (!container) {
      container = document.createElement("div");
      container.id = "notifications-container";
      container.className = "notifications-container";
      document.body.appendChild(container);
    }

    this.container = container;
    this.injectStyles();
    console.log("✅ Notification system initialized");
  }

  /**
   * Inject notification styles
   */
  injectStyles() {
    if (document.getElementById("notification-styles")) return;

    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
            /* Notifications Container */
            .notifications-container {
                position: fixed;
                top: calc(var(--topbar-height, 60px) + 16px);
                right: 16px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 12px;
                pointer-events: none;
                max-width: 400px;
            }

            /* Individual Notification */
            .notification {
                pointer-events: auto;
                background: var(--bg-secondary);
                border-radius: 16px;
                padding: 16px 20px;
                box-shadow:
                    0 10px 40px rgba(0, 0, 0, 0.2),
                    0 0 0 1px rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: flex-start;
                gap: 14px;
                min-width: 300px;
                max-width: 400px;
                transform: translateX(450px);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                position: relative;
                overflow: hidden;
                border: 2px solid transparent;
                backdrop-filter: blur(10px);
            }

            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification.hide {
                transform: translateX(450px);
                opacity: 0;
            }

            /* Icon */
            .notification-icon {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                flex-shrink: 0;
                position: relative;
                z-index: 1;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
            }

            /* Content */
            .notification-content {
                flex: 1;
                min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .notification-title {
                font-weight: 700;
                font-size: 14px;
                color: var(--text-primary);
                line-height: 1.4;
            }

            .notification-message {
                font-size: 13px;
                color: var(--text-secondary);
                line-height: 1.5;
                word-wrap: break-word;
            }

            /* Numbers/Values Highlight */
            .notification-value {
                font-weight: 800;
                font-size: 115%;
                padding: 0 4px;
                border-radius: 4px;
                display: inline-block;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
            }

            /* Close Button */
            .notification-close {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: #8b0000;
                font-size: 18px;
                font-weight: 700;
                line-height: 1;
                flex-shrink: 0;
                transition: all 0.2s ease;
                opacity: 0.8;
                background: transparent;
                border: 2px solid #8b0000;
            }

            .notification-close:hover {
                opacity: 1;
                background: #8b0000;
                color: white;
                border-color: #6b0000;
                transform: scale(1.1) rotate(90deg);
            }

            .notification-close:active {
                transform: scale(0.95);
            }

            /* Progress Bar */
            .notification-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: currentColor;
                opacity: 0.3;
                transition: width linear;
                border-radius: 0 0 0 16px;
            }

            /* Type Styles */

            /* Success */
            .notification.success {
                border-color: rgba(39, 174, 96, 0.3);
                background: linear-gradient(135deg,
                    rgba(39, 174, 96, 0.05) 0%,
                    var(--bg-secondary) 100%);
            }

            .notification.success .notification-icon {
                background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
                color: white;
            }

            .notification.success .notification-value {
                color: #27ae60;
                background: rgba(39, 174, 96, 0.1);
            }

            .notification.success .notification-progress {
                color: #27ae60;
            }

            /* Error */
            .notification.error {
                border-color: rgba(231, 76, 60, 0.3);
                background: linear-gradient(135deg,
                    rgba(231, 76, 60, 0.05) 0%,
                    var(--bg-secondary) 100%);
            }

            .notification.error .notification-icon {
                background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
                color: white;
                animation: shake 0.5s ease;
            }

            .notification.error .notification-value {
                color: #e74c3c;
                background: rgba(231, 76, 60, 0.1);
            }

            .notification.error .notification-progress {
                color: #e74c3c;
            }

            /* Warning */
            .notification.warning {
                border-color: rgba(243, 156, 18, 0.3);
                background: linear-gradient(135deg,
                    rgba(243, 156, 18, 0.05) 0%,
                    var(--bg-secondary) 100%);
            }

            .notification.warning .notification-icon {
                background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
                color: white;
                animation: pulse 1s ease infinite;
            }

            .notification.warning .notification-value {
                color: #f39c12;
                background: rgba(243, 156, 18, 0.1);
            }

            .notification.warning .notification-progress {
                color: #f39c12;
            }

            /* Info */
            .notification.info {
                border-color: rgba(52, 152, 219, 0.3);
                background: linear-gradient(135deg,
                    rgba(52, 152, 219, 0.05) 0%,
                    var(--bg-secondary) 100%);
            }

            .notification.info .notification-icon {
                background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                color: white;
            }

            .notification.info .notification-value {
                color: #3498db;
                background: rgba(52, 152, 219, 0.1);
            }

            .notification.info .notification-progress {
                color: #3498db;
            }

            /* Level Up */
            .notification.levelup {
                border-color: rgba(155, 89, 182, 0.3);
                background: linear-gradient(135deg,
                    rgba(155, 89, 182, 0.08) 0%,
                    var(--bg-secondary) 100%);
            }

            .notification.levelup .notification-icon {
                background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
                color: white;
                animation: bounce 0.6s ease;
            }

            .notification.levelup .notification-value {
                color: #9b59b6;
                background: rgba(155, 89, 182, 0.15);
                font-size: 130%;
            }

            .notification.levelup .notification-progress {
                color: #9b59b6;
            }

            /* Gold/Money */
            .notification.gold {
                border-color: rgba(241, 196, 15, 0.3);
                background: linear-gradient(135deg,
                    rgba(241, 196, 15, 0.05) 0%,
                    var(--bg-secondary) 100%);
            }

            .notification.gold .notification-icon {
                background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
                color: white;
            }

            .notification.gold .notification-value {
                color: #b8860b;
                background: rgba(184, 134, 11, 0.15);
            }

            .notification.gold .notification-progress {
                color: #b8860b;
            }

            /* Animations */
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                25% { transform: translateY(-10px); }
                50% { transform: translateY(-5px); }
                75% { transform: translateY(-7px); }
            }

            /* Dark Theme */
            .dark-theme .notification {
                box-shadow:
                    0 10px 50px rgba(0, 0, 0, 0.6),
                    0 0 0 1px rgba(255, 255, 255, 0.05);
            }

            .dark-theme .notification-close {
                border-color: #8b0000;
                color: #8b0000;
                background: transparent;
            }

            .dark-theme .notification-close:hover {
                background: #8b0000;
                color: white;
                border-color: #6b0000;
            }

            /* Mobile Responsive */
            @media (max-width: 480px) {
                .notifications-container {
                    right: 8px;
                    left: 8px;
                    max-width: calc(100% - 16px);
                }

                .notification {
                    min-width: 0;
                    max-width: 100%;
                    padding: 14px 16px;
                }

                .notification-icon {
                    width: 28px;
                    height: 28px;
                    font-size: 16px;
                }

                .notification-title {
                    font-size: 13px;
                }

                .notification-message {
                    font-size: 12px;
                }
            }
        `;

    document.head.appendChild(style);
  }

  /**
   * Show notification
   */
  show(message, type = "info", options = {}) {
    const {
      title = null,
      duration = this.defaultDuration,
      icon = null,
      closable = true,
    } = options;

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    // Icon
    const iconEl = document.createElement("div");
    iconEl.className = "notification-icon";
    iconEl.innerHTML = icon || this.getIcon(type);

    // Content
    const content = document.createElement("div");
    content.className = "notification-content";

    if (title) {
      const titleEl = document.createElement("div");
      titleEl.className = "notification-title";
      titleEl.innerHTML = this.highlightNumbers(title);
      content.appendChild(titleEl);
    }

    const messageEl = document.createElement("div");
    messageEl.className = title ? "notification-message" : "notification-title";
    messageEl.innerHTML = this.highlightNumbers(message);
    content.appendChild(messageEl);

    // Close button
    let closeBtn = null;
    if (closable) {
      closeBtn = document.createElement("div");
      closeBtn.className = "notification-close";
      closeBtn.innerHTML = "×";
      closeBtn.onclick = () => this.hide(notification);
    }

    // Progress bar
    const progress = document.createElement("div");
    progress.className = "notification-progress";
    progress.style.width = "100%";

    // Assemble
    notification.appendChild(iconEl);
    notification.appendChild(content);
    if (closeBtn) notification.appendChild(closeBtn);
    notification.appendChild(progress);

    // Add to container
    this.container.appendChild(notification);

    // Trigger show animation
    requestAnimationFrame(() => {
      notification.classList.add("show");
    });

    // Progress animation
    if (duration > 0) {
      requestAnimationFrame(() => {
        progress.style.transition = `width ${duration}ms linear`;
        progress.style.width = "0%";
      });
    }

    // Auto hide
    if (duration > 0) {
      setTimeout(() => {
        this.hide(notification);
      }, duration);
    }

    // Track active notifications
    this.activeNotifications.push(notification);

    // Limit max visible
    if (this.activeNotifications.length > this.maxVisible) {
      const oldest = this.activeNotifications.shift();
      this.hide(oldest);
    }

    return notification;
  }

  /**
   * Hide notification
   */
  hide(notification) {
    if (!notification || !notification.parentNode) return;

    notification.classList.remove("show");
    notification.classList.add("hide");

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }

      const index = this.activeNotifications.indexOf(notification);
      if (index > -1) {
        this.activeNotifications.splice(index, 1);
      }
    }, 400);
  }

  /**
   * Get icon for notification type
   */
  getIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
      levelup: "⭐",
      gold: '<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;">',
      xp: "⚡",
      item: "📦",
      quest: "📜",
      achievement: "🏆",
    };

    return icons[type] || icons.info;
  }

  /**
   * Highlight numbers in text
   */
  highlightNumbers(text) {
    if (!text) return "";

    // Highlight numbers with + or - prefix
    text = text.replace(
      /([+-]?\d+(?:,\d{3})*(?:\.\d+)?)/g,
      '<span class="notification-value">$1</span>',
    );

    return text;
  }

  /**
   * Success notification
   */
  success(message, options = {}) {
    return this.show(message, "success", options);
  }

  /**
   * Error notification
   */
  error(message, options = {}) {
    return this.show(message, "error", { duration: 4000, ...options });
  }

  /**
   * Warning notification
   */
  warning(message, options = {}) {
    return this.show(message, "warning", options);
  }

  /**
   * Info notification
   */
  info(message, options = {}) {
    return this.show(message, "info", options);
  }

  /**
   * Level up notification
   */
  levelUp(level, skill = null) {
    let message;
    if (skill) {
      message = i18n.t("notifications.skillLevelUp", { skill, level });
    } else {
      message = i18n.t("notifications.levelUp", { level });
    }

    return this.show(message, "levelup", {
      icon: "🎉",
      duration: 5000,
    });
  }

  /**
   * Gold received/spent
   */
  gold(amount, gained = true) {
    const prefix = gained ? "+" : "-";
    const message = `${prefix}${Math.abs(amount)} Gold`;

    return this.show(message, "gold", {
      icon: '<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;">',
      duration: 2500,
    });
  }

  /**
   * XP gained
   */
  xp(amount, skill = null) {
    const message = skill ? `+${amount} ${skill} XP` : `+${amount} XP`;

    return this.show(message, "success", {
      icon: "⚡",
      duration: 2500,
    });
  }

  /**
   * Item received
   */
  item(itemName, amount = 1) {
    const message =
      amount > 1 ? `Received ${itemName} x${amount}` : `Received ${itemName}`;

    return this.show(message, "info", {
      icon: "📦",
      duration: 3000,
    });
  }

  /**
   * Quest completed
   */
  quest(questName, rewards = {}) {
    let message = `Quest completed!`;

    if (rewards.gold)
      message += ` +${rewards.gold}<img src="./assets/sprites/ouro.png" alt="Ouro" style="width: 1em; height: 1em; vertical-align: middle;">`;
    if (rewards.xp) message += ` +${rewards.xp}⚡`;

    return this.show(message, "success", {
      title: questName,
      icon: "📜",
      duration: 5000,
    });
  }

  /**
   * Achievement unlocked
   */
  achievement(name, description = "") {
    return this.show(description || "Achievement unlocked!", "success", {
      title: `🏆 ${name}`,
      duration: 6000,
    });
  }

  /**
   * Clear all notifications
   */
  clearAll() {
    this.activeNotifications.forEach((notif) => this.hide(notif));
    this.activeNotifications = [];
    this.queue = [];
  }
}

// Create singleton instance
const notifications = new NotificationManager();

// Make it globally available
if (typeof window !== "undefined") {
  window.notifications = notifications;
}

export default notifications;
