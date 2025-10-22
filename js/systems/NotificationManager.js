/**
 * FazendaRPG - Notification Manager
 * Manages push notifications for crops and game events
 * @version 0.0.10
 */

export default class NotificationManager {
  constructor() {
    this.enabled = false;
    this.permission = "default";
    this.scheduledNotifications = new Map();
    this.serviceWorkerReady = false;
    this.storageKey = "fazendarpg_notifications_enabled";
  }

  /**
   * Initialize notification system
   */
  async initialize() {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.warn("⚠️ Notifications not supported in this browser");
      return false;
    }

    // Check if service worker is supported
    if (!("serviceWorker" in navigator)) {
      console.warn("⚠️ Service Worker not supported");
      return false;
    }

    // Check current permission
    this.permission = Notification.permission;

    // Load saved preference
    const savedPreference = localStorage.getItem(this.storageKey);
    this.enabled = savedPreference === "true";

    // Wait for service worker to be ready
    try {
      const registration = await navigator.serviceWorker.ready;
      this.serviceWorkerReady = true;
      console.log("✅ Service Worker ready for notifications");
    } catch (error) {
      console.error("❌ Service Worker not ready:", error);
      return false;
    }

    // Listen for messages from service worker
    this.listenToServiceWorker();

    console.log(
      `🔔 Notification Manager initialized (Permission: ${this.permission})`,
    );
    return true;
  }

  /**
   * Request notification permission
   */
  async requestPermission() {
    if (!("Notification" in window)) {
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;

      if (permission === "granted") {
        this.enabled = true;
        localStorage.setItem(this.storageKey, "true");
        console.log("✅ Notification permission granted");

        // Show welcome notification
        this.showWelcomeNotification();

        return true;
      } else if (permission === "denied") {
        this.enabled = false;
        localStorage.setItem(this.storageKey, "false");
        console.log("❌ Notification permission denied");
        return false;
      }
    } catch (error) {
      console.error("❌ Error requesting permission:", error);
      return false;
    }

    return false;
  }

  /**
   * Show welcome notification
   */
  async showWelcomeNotification() {
    await this.showNotification(
      "🌾 FazendaRPG",
      "Notificações ativadas! Você será avisado quando seus crops estiverem prontos.",
      { tag: "welcome" },
    );
  }

  /**
   * Enable notifications
   */
  async enable() {
    if (this.permission !== "granted") {
      return await this.requestPermission();
    }

    this.enabled = true;
    localStorage.setItem(this.storageKey, "true");
    console.log("✅ Notifications enabled");
    return true;
  }

  /**
   * Disable notifications
   */
  disable() {
    this.enabled = false;
    localStorage.setItem(this.storageKey, "false");
    this.cancelAllNotifications();
    console.log("❌ Notifications disabled");
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled() {
    return this.enabled && this.permission === "granted";
  }

  /**
   * Schedule notification for crop ready
   * @param {number} plotIndex - Farm plot index
   * @param {string} cropName - Crop name
   * @param {number} readyAt - Timestamp when crop is ready
   */
  scheduleCropNotification(plotIndex, cropName, readyAt) {
    if (!this.isEnabled()) {
      return;
    }

    const notificationId = `crop-${plotIndex}`;
    const now = Date.now();
    const delay = readyAt - now;

    if (delay <= 0) {
      // Already ready, don't schedule
      return;
    }

    const title = "🌾 Colheita Pronta!";
    const body = `Seu ${cropName} está pronto para ser colhido!`;

    this.scheduleNotification(notificationId, title, body, readyAt, {
      type: "crop_ready",
      plotIndex,
      cropName,
      tag: `crop-${plotIndex}`,
    });

    console.log(
      `📅 Notificação agendada para ${cropName} em ${Math.round(delay / 1000)}s`,
    );
  }

  /**
   * Cancel crop notification
   * @param {number} plotIndex - Farm plot index
   */
  cancelCropNotification(plotIndex) {
    const notificationId = `crop-${plotIndex}`;
    this.cancelNotification(notificationId);
  }

  /**
   * Schedule energy full notification
   * @param {number} fullAt - Timestamp when energy is full
   */
  scheduleEnergyFullNotification(fullAt) {
    if (!this.isEnabled()) {
      return;
    }

    const notificationId = "energy-full";
    const title = "⚡ Energia Cheia!";
    const body = "Sua energia está completamente recuperada!";

    this.scheduleNotification(notificationId, title, body, fullAt, {
      type: "energy_full",
      tag: "energy",
    });
  }

  /**
   * Cancel energy notification
   */
  cancelEnergyFullNotification() {
    this.cancelNotification("energy-full");
  }

  /**
   * Schedule generic notification
   * @param {string} id - Notification ID
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {number} timestamp - When to show (ms)
   * @param {Object} data - Additional data
   */
  scheduleNotification(id, title, body, timestamp, data = {}) {
    if (!this.isEnabled() || !this.serviceWorkerReady) {
      return;
    }

    // Send message to service worker
    this.sendMessageToServiceWorker({
      type: "SCHEDULE_NOTIFICATION",
      id,
      title,
      body,
      timestamp,
      data,
    })
      .then(() => {
        this.scheduledNotifications.set(id, {
          title,
          body,
          timestamp,
          data,
        });
        console.log(`📅 Notification scheduled: ${id}`);
      })
      .catch((error) => {
        console.error("❌ Failed to schedule notification:", error);
      });
  }

  /**
   * Cancel notification
   * @param {string} id - Notification ID
   */
  cancelNotification(id) {
    if (!this.serviceWorkerReady) {
      return;
    }

    this.sendMessageToServiceWorker({
      type: "CANCEL_NOTIFICATION",
      id,
    })
      .then(() => {
        this.scheduledNotifications.delete(id);
        console.log(`❌ Notification cancelled: ${id}`);
      })
      .catch((error) => {
        console.error("❌ Failed to cancel notification:", error);
      });
  }

  /**
   * Cancel all notifications
   */
  cancelAllNotifications() {
    if (!this.serviceWorkerReady) {
      return;
    }

    this.sendMessageToServiceWorker({
      type: "CANCEL_ALL_NOTIFICATIONS",
    })
      .then(() => {
        this.scheduledNotifications.clear();
        console.log("❌ All notifications cancelled");
      })
      .catch((error) => {
        console.error("❌ Failed to cancel all notifications:", error);
      });
  }

  /**
   * Show immediate notification (for testing)
   * @param {string} title - Title
   * @param {string} body - Body
   * @param {Object} data - Additional data
   */
  async showNotification(title, body, data = {}) {
    if (!this.isEnabled()) {
      console.warn("⚠️ Notifications are not enabled");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      const options = {
        body,
        icon: "./assets/icon-192.png",
        badge: "./assets/icon-72.png",
        vibrate: [200, 100, 200],
        tag: data.tag || "fazendarpg",
        requireInteraction: false,
        data,
      };

      await registration.showNotification(title, options);
      console.log(`🔔 Notification shown: ${title}`);
    } catch (error) {
      console.error("❌ Failed to show notification:", error);
    }
  }

  /**
   * Send message to service worker
   * @param {Object} message - Message object
   * @returns {Promise}
   */
  sendMessageToServiceWorker(message) {
    return new Promise((resolve, reject) => {
      if (!navigator.serviceWorker.controller) {
        reject(new Error("No service worker controller"));
        return;
      }

      const messageChannel = new MessageChannel();

      messageChannel.port1.onmessage = (event) => {
        if (event.data.error) {
          reject(event.data.error);
        } else {
          resolve(event.data);
        }
      };

      navigator.serviceWorker.controller.postMessage(message, [
        messageChannel.port2,
      ]);
    });
  }

  /**
   * Listen to messages from service worker
   */
  listenToServiceWorker() {
    if (!navigator.serviceWorker) {
      return;
    }

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data.type === "NOTIFICATION_SHOWN") {
        console.log("🔔 Notification was shown:", event.data.data);

        // Dispatch custom event
        window.dispatchEvent(
          new CustomEvent("notification:shown", {
            detail: event.data.data,
          }),
        );
      }
    });
  }

  /**
   * Update all crop notifications based on current farm state
   * @param {Array} plots - Farm plots
   * @param {Object} cropsData - Crops data
   */
  updateCropNotifications(plots, cropsData) {
    if (!this.isEnabled()) {
      return;
    }

    plots.forEach((plot, index) => {
      if (plot.crop && plot.plantedAt) {
        const cropData = cropsData[plot.crop];
        if (!cropData) return;

        // Calculate when crop will be ready (consider fertilizer effect)
        const growthTime = plot.fertilized
          ? cropData.growthTime * 0.5 * 1000
          : cropData.growthTime * 1000;
        const readyAt = plot.plantedAt + growthTime;
        const now = Date.now();

        if (readyAt > now) {
          // Crop is growing, schedule notification
          this.scheduleCropNotification(index, cropData.name, readyAt);
        } else {
          // Crop is already ready, cancel notification
          this.cancelCropNotification(index);
        }
      } else {
        // Plot is empty, cancel notification
        this.cancelCropNotification(index);
      }
    });
  }

  /**
   * Get scheduled notifications count
   */
  getScheduledCount() {
    return this.scheduledNotifications.size;
  }

  /**
   * Get scheduled notifications list
   */
  getScheduledNotifications() {
    return Array.from(this.scheduledNotifications.entries()).map(
      ([id, data]) => ({
        id,
        ...data,
      }),
    );
  }

  /**
   * Test notification (for debugging)
   */
  async testNotification() {
    if (!this.isEnabled()) {
      const granted = await this.requestPermission();
      if (!granted) {
        alert("Notificações bloqueadas! Ative nas configurações do navegador.");
        return;
      }
    }

    await this.showNotification(
      "🌾 Teste de Notificação",
      "Se você viu isso, as notificações estão funcionando!",
      { tag: "test" },
    );
  }
}
