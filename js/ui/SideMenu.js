/**
 * FazendaRPG - Side Menu UI Component
 * Manages the navigation side menu with screen switching
 * @version 0.0.14
 */

export default class SideMenu {
  constructor(screenManager) {
    this.screenManager = screenManager;
    this.elements = {};
    this.isOpen = false;
  }

  /**
   * Initialize side menu
   */
  init() {
    this.cacheElements();
    this.attachEventListeners();
    console.log("✅ Side menu initialized");
  }

  /**
   * Cache DOM elements
   */
  cacheElements() {
    this.elements = {
      menu: document.getElementById("side-menu"),
      overlay: document.getElementById("menu-overlay"),
      toggle: document.getElementById("menu-toggle"),
      close: document.getElementById("menu-close"),
      menuItems: document.querySelectorAll(".menu-item"),
    };
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Toggle button
    if (this.elements.toggle) {
      this.elements.toggle.addEventListener("click", () => this.toggle());
    }

    // Close button
    if (this.elements.close) {
      this.elements.close.addEventListener("click", () => this.close());
    }

    // Overlay click
    if (this.elements.overlay) {
      this.elements.overlay.addEventListener("click", () => this.close());
    }

    // Menu items
    this.elements.menuItems.forEach((item) => {
      item.addEventListener("click", (e) => this.handleMenuItemClick(e));
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => this.handleKeyboard(e));

    // Screen change events
    window.addEventListener("screen:changed", (e) => {
      this.updateActiveItem(e.detail.screenId);
    });
  }

  /**
   * Handle menu item click
   * @param {Event} e - Click event
   */
  handleMenuItemClick(e) {
    const menuItem = e.currentTarget;
    const page = menuItem.getAttribute("data-page");

    if (page) {
      this.screenManager.showScreen(page + "-screen");
      this.close();
    }
  }

  /**
   * Handle keyboard shortcuts
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyboard(e) {
    // ESC to close menu
    if (e.key === "Escape" && this.isOpen) {
      this.close();
    }

    // M to toggle menu
    if (e.key === "m" || e.key === "M") {
      if (!this.isInputFocused()) {
        this.toggle();
      }
    }
  }

  /**
   * Check if an input is focused
   * @returns {boolean} True if input focused
   */
  isInputFocused() {
    const activeElement = document.activeElement;
    return (
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.isContentEditable)
    );
  }

  /**
   * Open menu
   */
  open() {
    if (this.isOpen) return;

    this.isOpen = true;

    if (this.elements.menu) {
      this.elements.menu.classList.add("active");
    }

    if (this.elements.overlay) {
      this.elements.overlay.classList.add("active");
    }

    if (this.elements.toggle) {
      this.elements.toggle.classList.add("active");
    }

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Dispatch event
    window.dispatchEvent(new CustomEvent("menu:opened"));

    console.log("📱 Menu opened");
  }

  /**
   * Close menu
   */
  close() {
    if (!this.isOpen) return;

    this.isOpen = false;

    if (this.elements.menu) {
      this.elements.menu.classList.remove("active");
    }

    if (this.elements.overlay) {
      this.elements.overlay.classList.remove("active");
    }

    if (this.elements.toggle) {
      this.elements.toggle.classList.remove("active");
    }

    // Restore body scroll
    document.body.style.overflow = "";

    // Dispatch event
    window.dispatchEvent(new CustomEvent("menu:closed"));

    console.log("📱 Menu closed");
  }

  /**
   * Toggle menu open/close
   */
  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Update active menu item
   * @param {string} screenId - Active screen ID
   */
  updateActiveItem(screenId) {
    // Remove active from all items
    this.elements.menuItems.forEach((item) => {
      item.classList.remove("active");
    });

    // Add active to current screen's menu item
    const page = screenId.replace("-screen", "");
    const activeItem = document.querySelector(
      `.menu-item[data-page="${page}"]`,
    );

    if (activeItem) {
      activeItem.classList.add("active");
    }
  }

  /**
   * Highlight menu item (e.g., for notifications)
   * @param {string} page - Page identifier
   * @param {boolean} highlight - Whether to highlight
   */
  highlightMenuItem(page, highlight = true) {
    const menuItem = document.querySelector(`.menu-item[data-page="${page}"]`);

    if (menuItem) {
      if (highlight) {
        menuItem.classList.add("highlighted");
      } else {
        menuItem.classList.remove("highlighted");
      }
    }
  }

  /**
   * Add notification badge to menu item
   * @param {string} page - Page identifier
   * @param {number} count - Notification count
   */
  addNotificationBadge(page, count) {
    const menuItem = document.querySelector(`.menu-item[data-page="${page}"]`);

    if (menuItem) {
      // Remove existing badge
      const existingBadge = menuItem.querySelector(".notification-badge");
      if (existingBadge) {
        existingBadge.remove();
      }

      // Add new badge if count > 0
      if (count > 0) {
        const badge = document.createElement("span");
        badge.className = "notification-badge";
        badge.textContent = count > 99 ? "99+" : count;
        menuItem.appendChild(badge);
      }
    }
  }

  /**
   * Remove notification badge from menu item
   * @param {string} page - Page identifier
   */
  removeNotificationBadge(page) {
    this.addNotificationBadge(page, 0);
  }

  /**
   * Get menu state
   * @returns {boolean} True if open
   */
  isMenuOpen() {
    return this.isOpen;
  }

  /**
   * Clean up
   */
  destroy() {
    this.close();
    this.elements = {};
  }
}
