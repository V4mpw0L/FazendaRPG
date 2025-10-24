/**
 * FazendaRPG - Professional Notification System
 * Lightweight, elegant notifications with farm/RPG aesthetics
 * @version 0.0.17
 */

import i18n from "./i18n.js";

class NotificationManager {
  constructor() {
    this.container = null;
    this.queue = [];
    this.activeNotifications = [];
    this.maxVisible = 4;
    this.defaultDuration = 3000;
    this.itemIconCache = {};
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
    console.log("✅ Notification system initialized (v0.0.13)");
  }

  /**
   * Inject notification styles
   */
  injectStyles() {
    if (document.getElementById("notification-styles")) return;

    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      /* ===================================
         FazendaRPG Notifications System
         Professional & Lightweight
         =================================== */

      /* Container */
      .notifications-container {
        position: fixed;
        top: calc(var(--topbar-height, 60px) + 12px);
        right: 12px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
        max-width: 320px;
      }

      /* Notification Card */
      .notification {
        pointer-events: auto;
        background: linear-gradient(135deg, #8b6914 0%, #a0522d 40%, #654321 100%);
        border: 2px solid rgba(139, 105, 20, 0.8);
        border-radius: 12px;
        padding: 10px 14px;
        box-shadow:
          0 4px 12px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 215, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        min-width: auto;
        max-width: 320px;
        width: fit-content;
        transform: translateX(360px);
        opacity: 0;
        transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        overflow: hidden;
      }

      /* Top green accent line */
      .notification::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg,
          var(--brand-primary, #5caa1f) 0%,
          var(--brand-secondary, #7ec850) 50%,
          var(--brand-primary, #5caa1f) 100%);
        opacity: 0.9;
      }

      .notification.show {
        transform: translateX(0);
        opacity: 1;
      }

      .notification.hide {
        transform: translateX(360px) scale(0.95);
        opacity: 0;
      }

      /* Icon Container */
      .notification-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
        background: rgba(0, 0, 0, 0.25);
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }

      .notification-icon img {
        width: 24px;
        height: 24px;
        object-fit: contain;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
      }

      .notification-icon-emoji {
        font-size: 20px;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
      }

      /* Content */
      .notification-content {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .notification-title {
        font-weight: 800;
        font-size: 13px;
        color: #ffffff;
        line-height: 1.3;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
        letter-spacing: 0.3px;
      }

      .notification-message {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.95);
        line-height: 1.4;
        word-wrap: break-word;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
      }

      /* Item Display */
      .notification-item-display {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(0, 0, 0, 0.3);
        padding: 3px 8px;
        border-radius: 6px;
        border: 1px solid rgba(255, 215, 0, 0.3);
      }

      .notification-item-display img {
        width: 18px;
        height: 18px;
        object-fit: contain;
      }

      .notification-item-name {
        font-weight: 700;
        color: #FFD700;
        text-shadow: 0 0 4px rgba(0, 0, 0, 0.8);
      }

      /* Numbers/Values Highlight */
      .notification-value {
        font-weight: 800;
        font-size: 110%;
        padding: 2px 5px;
        border-radius: 4px;
        display: inline-block;
        background: rgba(255, 215, 0, 0.15);
        color: #FFD700;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        border: 1px solid rgba(255, 215, 0, 0.3);
      }

      /* Gold Value - Special styling */
      .notification-value.gold-value {
        background: rgba(255, 215, 0, 0.2);
        color: #FFD700;
        border-color: rgba(255, 215, 0, 0.4);
        font-size: 115%;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
      }

      /* XP Value */
      .notification-value.xp-value {
        background: rgba(92, 170, 31, 0.2);
        color: #7ec850;
        border-color: rgba(92, 170, 31, 0.4);
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      }

      /* Positive Value */
      .notification-value.positive {
        background: rgba(39, 174, 96, 0.15);
        color: #2ecc71;
        border-color: rgba(39, 174, 96, 0.3);
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      }

      /* Negative Value */
      .notification-value.negative {
        background: rgba(231, 76, 60, 0.15);
        color: #ff6b6b;
        border-color: rgba(231, 76, 60, 0.3);
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      }

      /* Close Button */
      .notification-close {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        font-size: 18px;
        font-weight: 700;
        line-height: 1;
        flex-shrink: 0;
        transition: all 0.2s ease;
        background: rgba(231, 76, 60, 0.8);
        border: 1px solid rgba(231, 76, 60, 1);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      }

      .notification-close:hover {
        background: rgba(231, 76, 60, 1);
        transform: scale(1.1);
        box-shadow: 0 3px 8px rgba(231, 76, 60, 0.5);
      }

      .notification-close:active {
        transform: scale(0.95);
      }

      /* Progress Bar */
      .notification-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg,
          var(--brand-primary, #5caa1f),
          var(--brand-secondary, #7ec850));
        opacity: 0.6;
        transition: width linear;
        border-radius: 0 0 0 12px;
      }

      /* Type Variations */

      /* Success */
      .notification.success::before {
        background: linear-gradient(90deg, #27ae60 0%, #2ecc71 50%, #27ae60 100%);
      }

      .notification.success .notification-icon {
        background: rgba(39, 174, 96, 0.3);
        border-color: rgba(39, 174, 96, 0.5);
      }

      /* Error */
      .notification.error::before {
        background: linear-gradient(90deg, #e74c3c 0%, #c0392b 50%, #e74c3c 100%);
      }

      .notification.error .notification-icon {
        background: rgba(231, 76, 60, 0.3);
        border-color: rgba(231, 76, 60, 0.5);
        animation: shake 0.4s ease;
      }

      /* Warning */
      .notification.warning::before {
        background: linear-gradient(90deg, #f39c12 0%, #e67e22 50%, #f39c12 100%);
      }

      .notification.warning .notification-icon {
        background: rgba(243, 156, 18, 0.3);
        border-color: rgba(243, 156, 18, 0.5);
      }

      /* Info */
      .notification.info::before {
        background: linear-gradient(90deg, #3498db 0%, #2980b9 50%, #3498db 100%);
      }

      .notification.info .notification-icon {
        background: rgba(52, 152, 219, 0.3);
        border-color: rgba(52, 152, 219, 0.5);
      }

      /* Level Up */
      .notification.levelup::before {
        background: linear-gradient(90deg, #9b59b6 0%, #8e44ad 50%, #9b59b6 100%);
        height: 4px;
        box-shadow: 0 0 8px rgba(155, 89, 182, 0.6);
      }

      .notification.levelup {
        border-color: rgba(155, 89, 182, 0.8);
        box-shadow:
          0 4px 16px rgba(155, 89, 182, 0.4),
          0 0 0 1px rgba(155, 89, 182, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .notification.levelup .notification-icon {
        background: rgba(155, 89, 182, 0.4);
        border-color: rgba(155, 89, 182, 0.6);
        animation: pulse 0.8s ease;
      }

      /* Gold/Money */
      .notification.gold::before {
        background: linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
        height: 3px;
        box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
      }

      .notification.gold {
        border-color: rgba(255, 215, 0, 0.8);
        box-shadow:
          0 4px 16px rgba(255, 215, 0, 0.3),
          0 0 0 1px rgba(255, 215, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      .notification.gold .notification-icon {
        background: rgba(255, 215, 0, 0.3);
        border-color: rgba(255, 215, 0, 0.6);
      }

      /* Item/Harvest */
      .notification.item::before {
        background: linear-gradient(90deg,
          var(--brand-primary, #5caa1f) 0%,
          var(--brand-secondary, #7ec850) 50%,
          var(--brand-primary, #5caa1f) 100%);
      }

      .notification.item {
        border-color: rgba(92, 170, 31, 0.8);
      }

      .notification.item .notification-icon {
        background: rgba(92, 170, 31, 0.3);
        border-color: rgba(92, 170, 31, 0.5);
      }

      /* Animations */
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px); }
        75% { transform: translateX(3px); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }

      /* Dark Theme Adjustments */
      .dark-theme .notification {
        box-shadow:
          0 4px 16px rgba(0, 0, 0, 0.6),
          0 0 0 1px rgba(255, 215, 0, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      .dark-theme .notification-icon {
        border-color: rgba(255, 255, 255, 0.15);
      }

      /* Light Theme Adjustments */
      .light-theme .notification {
        background: linear-gradient(135deg, #a0793d 0%, #b8653f 40%, #7a5628 100%);
        border-color: rgba(139, 105, 20, 0.9);
        box-shadow:
          0 4px 12px rgba(0, 0, 0, 0.3),
          0 0 0 1px rgba(255, 215, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.25);
      }

      .light-theme .notification-title {
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
      }

      .light-theme .notification-message {
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .notifications-container {
          right: 8px;
          left: 8px;
          max-width: calc(100% - 16px);
          top: calc(var(--topbar-height, 60px) + 8px);
        }

        .notification {
          min-width: 0;
          max-width: 100%;
          padding: 10px 12px;
          gap: 10px;
        }

        .notification-icon {
          width: 36px;
          height: 36px;
        }

        .notification-icon img {
          width: 24px;
          height: 24px;
        }

        .notification-title {
          font-size: 13px;
        }

        .notification-message {
          font-size: 12px;
        }
      }

      @media (max-width: 480px) {
        .notification {
          padding: 8px 10px;
          gap: 8px;
        }

        .notification-icon {
          width: 32px;
          height: 32px;
          font-size: 16px;
        }

        .notification-icon img {
          width: 20px;
          height: 20px;
        }

        .notification-title {
          font-size: 12px;
        }

        .notification-message {
          font-size: 11px;
        }

        .notification-value {
          font-size: 105%;
          padding: 1px 4px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Get item icon path from item ID
   */
  getItemIcon(itemId) {
    // Cache for performance
    if (this.itemIconCache[itemId]) {
      return this.itemIconCache[itemId];
    }

    // Map common items to their sprite IDs
    const itemSpriteMap = {
      // Seeds
      wheat_seed: "1053",
      corn_seed: "1058",
      tomato_seed: "1068",
      carrot_seed: "1069",
      potato_seed: "1070",
      pumpkin_seed: "1090",
      strawberry_seed: "1096",

      // Crops
      wheat: "1247",
      corn: "1248",
      tomato: "1249",
      carrot: "1250",
      potato: "1299",
      pumpkin: "1302",
      strawberry: "1303",
      lettuce: "1304",

      // Tools
      hoe: "1358",
      trowel: "1359",
      watering_can: "1360",
      axe: "1361",
      pickaxe: "1414",
      fishing_rod: "1415",
      scythe: "1416",
      rake: "1417",
      shovel: "1418",

      // Fish
      sardine: "1579",
      salmon: "1630",
      tuna: "1631",
      bass: "1632",
      carp: "1633",
      trout: "1640",
      pike: "1641",
      catfish: "1642",
      eel: "1643",
      sturgeon: "1644",

      // Wood
      wood: "1752",
      oak_wood: "1753",
      pine_wood: "1754",
      birch_wood: "1755",
      maple_wood: "1756",
      cedar_wood: "1757",
      willow_wood: "1758",
      ash_wood: "1759",
      cherry_wood: "1760",
      walnut_wood: "1761",

      // Minerals
      stone: "1765",
      copper_ore: "1766",
      iron_ore: "1767",
      silver_ore: "1768",
      gold_ore: "1769",
      coal: "1770",
      ruby: "1771",
      emerald: "1773",
      sapphire: "1774",
      diamond: "1775",

      // Materials
      clay: "1781",
      sand: "1790",
      glass: "1791",
      brick: "1793",
      plank: "1794",
      rope: "1795",
      cloth: "1796",
      leather: "1800",
      thread: "1802",

      // Food
      bread: "1972",
      cheese: "2967",
      milk: "2971",
      butter: "2972",
      egg: "2973",
      flour: "2975",
      sugar: "2977",

      // Special Items
      fertilizer: "362",
      compost: "363",
      manure: "364",
      bone_meal: "365",
      weed: "424",
      hay: "441",

      // Icons
      ouro: "ouro",
      energia: "energia",
      xp: "xp-potion",
    };

    const spriteId = itemSpriteMap[itemId];
    if (spriteId) {
      const path = `./assets/sprites/${spriteId}.png`;
      this.itemIconCache[itemId] = path;
      return path;
    }

    return null;
  }

  /**
   * Show notification
   */
  show(message, type = "info", options = {}) {
    const {
      title = null,
      duration = this.defaultDuration,
      icon = null,
      closable = false,
    } = options;

    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;

    // Icon
    const iconEl = document.createElement("div");
    iconEl.className = "notification-icon";

    if (icon) {
      if (icon.includes("<img")) {
        iconEl.innerHTML = icon;
      } else {
        iconEl.innerHTML = `<span class="notification-icon-emoji">${icon}</span>`;
      }
    } else {
      iconEl.innerHTML = this.getIcon(type);
    }

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
    }, 350);
  }

  /**
   * Get icon for notification type
   */
  getIcon(type) {
    const icons = {
      success: '<span class="notification-icon-emoji">✓</span>',
      error: '<span class="notification-icon-emoji">✕</span>',
      warning: '<span class="notification-icon-emoji">⚠</span>',
      info: '<span class="notification-icon-emoji">ℹ</span>',
      levelup: '<span class="notification-icon-emoji">⭐</span>',
      gold: '<img src="./assets/sprites/ouro.png" alt="Ouro">',
      xp: '<img src="./assets/sprites/xp-potion.png" alt="XP">',
      item: '<span class="notification-icon-emoji">📦</span>',
      quest: '<span class="notification-icon-emoji">📜</span>',
      achievement: '<span class="notification-icon-emoji">🏆</span>',
    };

    return icons[type] || icons.info;
  }

  /**
   * Highlight numbers in text
   */
  highlightNumbers(text) {
    if (!text) return "";

    // Highlight friendship percentage (+X% amizade 💖)
    text = text.replace(
      /(\+\d+%)\s+amizade\s+💖/gi,
      '<span class="notification-value positive">$1 amizade 💖</span>',
    );

    // Highlight gold amounts with special class
    text = text.replace(
      /([+-]?\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:g|gold|ouro)/gi,
      '<span class="notification-value gold-value">$1g</span>',
    );

    // Highlight XP amounts
    text = text.replace(
      /([+-]?\d+(?:,\d{3})*(?:\.\d+)?)\s*(?:xp|exp)/gi,
      '<span class="notification-value xp-value">$1 XP</span>',
    );

    // Highlight quantities with x (e.g., 5x, 10x) - keep space after x
    text = text.replace(
      /(\d+x)\s+/gi,
      '<span class="notification-value">$1</span> ',
    );

    // Highlight positive numbers with +
    text = text.replace(
      /(\+\d+(?:,\d{3})*(?:\.\d+)?)/g,
      '<span class="notification-value positive">$1</span>',
    );

    // Highlight negative numbers with -
    text = text.replace(
      /(-\d+(?:,\d{3})*(?:\.\d+)?)/g,
      '<span class="notification-value negative">$1</span>',
    );

    // Highlight remaining standalone numbers
    text = text.replace(
      /\b(\d+(?:,\d{3})*(?:\.\d+)?)\b/g,
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
    const message = `${prefix}${Math.abs(amount)}g`;

    return this.show(message, "gold", {
      icon: '<img src="./assets/sprites/ouro.png" alt="Ouro">',
      duration: 2500,
    });
  }

  /**
   * XP gained
   */
  xp(amount, skill = null) {
    const message = skill ? `+${amount} ${skill} XP` : `+${amount} XP`;

    return this.show(message, "success", {
      icon: '<img src="./assets/sprites/xp-potion.png" alt="XP">',
      duration: 2500,
    });
  }

  /**
   * Quest completed
   */
  quest(questName, rewards = {}) {
    let message = i18n.t("notifications.questCompleted") || "Missão completa!";

    const rewardParts = [];
    if (rewards.gold) {
      rewardParts.push(`+${rewards.gold}g`);
    }
    if (rewards.xp) {
      rewardParts.push(`+${rewards.xp} XP`);
    }

    if (rewardParts.length > 0) {
      message += " " + rewardParts.join(" • ");
    }

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
    return this.show(
      description ||
        i18n.t("notifications.achievementUnlocked") ||
        "Conquista desbloqueada!",
      "success",
      {
        title: `🏆 ${name}`,
        duration: 6000,
      },
    );
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

// Export singleton instance
const notifications = new NotificationManager();
export default notifications;
