/**
 * FazendaRPG - Avatar Selector
 * Manages avatar selection UI and functionality
 * @version 0.0.12
 */

import notifications from "../utils/notifications.js";

export default class AvatarSelector {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.modal = null;
    this.avatarGrid = null;
    this.totalAvatars = 50; // Total number of avatar images (1.png to 50.png)
  }

  /**
   * Initialize avatar selector
   */
  init() {
    console.log("🎨 Initializing AvatarSelector...");

    this.modal = document.getElementById("avatar-modal");
    this.avatarGrid = document.getElementById("avatar-grid");

    if (!this.modal || !this.avatarGrid) {
      console.error("❌ Avatar modal or grid not found!");
      return;
    }

    // Setup click handler for topbar avatar
    const topbarAvatar = document.getElementById("topbar-avatar");
    if (topbarAvatar) {
      topbarAvatar.addEventListener("click", () => {
        console.log("🖱️ Avatar clicked, showing modal");
        this.show();
      });
      console.log("✅ Avatar click handler attached");
    } else {
      console.error("❌ Topbar avatar element not found!");
    }

    // Setup close button handler
    const closeBtn = document.getElementById("avatar-modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hide());
      console.log("✅ Close button handler attached");
    }

    // Load avatars into grid
    this.loadAvatars();

    // Close modal when clicking outside
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });

    console.log("✅ AvatarSelector initialized");
  }

  /**
   * Load all available avatars into the grid
   */
  loadAvatars() {
    this.avatarGrid.innerHTML = "";

    for (let i = 1; i <= this.totalAvatars; i++) {
      const avatarPath = `assets/sprites/avatars/${i}.png`;

      const avatarItem = document.createElement("div");
      avatarItem.className = "avatar-item";
      avatarItem.style.cssText = `
        cursor: pointer;
        border: 3px solid transparent;
        border-radius: 50%;
        overflow: hidden;
        transition: all 0.2s ease;
        aspect-ratio: 1/1;
      `;

      const avatarImg = document.createElement("img");
      avatarImg.src = avatarPath;
      avatarImg.alt = `Avatar ${i}`;
      avatarImg.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      `;

      // Check if this is the current avatar
      if (this.gameEngine.player.data.avatar === avatarPath) {
        avatarItem.style.borderColor = "var(--primary-color, #4CAF50)";
        avatarItem.style.boxShadow = "0 0 10px var(--primary-color, #4CAF50)";
      }

      // Hover effect
      avatarItem.addEventListener("mouseenter", () => {
        if (this.gameEngine.player.data.avatar !== avatarPath) {
          avatarItem.style.borderColor = "var(--border-color, #ccc)";
          avatarItem.style.transform = "scale(1.1)";
        }
      });

      avatarItem.addEventListener("mouseleave", () => {
        if (this.gameEngine.player.data.avatar !== avatarPath) {
          avatarItem.style.borderColor = "transparent";
          avatarItem.style.transform = "scale(1)";
        }
      });

      // Click handler to select avatar
      avatarItem.addEventListener("click", () => {
        this.selectAvatar(avatarPath);
      });

      avatarItem.appendChild(avatarImg);
      this.avatarGrid.appendChild(avatarItem);
    }
  }

  /**
   * Select an avatar
   * @param {string} avatarPath - Path to the avatar image
   */
  selectAvatar(avatarPath) {
    // Update player data
    this.gameEngine.player.data.avatar = avatarPath;

    // Update topbar avatar
    const topbarAvatarImg = document.getElementById("topbar-avatar-img");
    if (topbarAvatarImg) {
      topbarAvatarImg.src = avatarPath;
    }

    // Update farm screen avatar
    const farmAvatarImg = document.getElementById("farm-avatar-img");
    if (farmAvatarImg) {
      farmAvatarImg.src = avatarPath;
    }

    // Save game
    this.gameEngine.saveGame();

    // Update UI to show selected avatar
    this.loadAvatars();

    // Show notification
    notifications.success("Avatar atualizado!");

    // Close modal after a short delay
    setTimeout(() => {
      this.hide();
    }, 300);
  }

  /**
   * Show the avatar selection modal
   */
  show() {
    if (this.modal) {
      this.modal.style.display = "flex";
      this.modal.classList.add("active");
      this.loadAvatars(); // Refresh to show current selection
      console.log("✅ Modal shown with active class");
    }
  }

  /**
   * Hide the avatar selection modal
   */
  hide() {
    if (this.modal) {
      this.modal.classList.remove("active");
      setTimeout(() => {
        this.modal.style.display = "none";
      }, 300); // Wait for fade animation
      console.log("✅ Modal hidden");
    }
  }

  /**
   * Update topbar avatar from saved data
   */
  updateTopbarAvatar() {
    const avatarPath =
      this.gameEngine.player.data.avatar || "assets/sprites/avatars/11.png";
    console.log("🎨 Updating topbar avatar to:", avatarPath);

    // Update topbar avatar
    const topbarAvatarImg = document.getElementById("topbar-avatar-img");
    if (topbarAvatarImg) {
      topbarAvatarImg.src = avatarPath;
      console.log("✅ Topbar avatar updated successfully");
    } else {
      console.error("❌ Topbar avatar img element not found!");
    }

    // Update farm screen avatar
    const farmAvatarImg = document.getElementById("farm-avatar-img");
    if (farmAvatarImg) {
      farmAvatarImg.src = avatarPath;
      console.log("✅ Farm avatar updated successfully");
    }
  }
}
