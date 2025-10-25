/**
 * FazendaRPG - Firebase Manager
 * Handles cloud saves with Firebase Firestore and Google Authentication
 * @version 0.0.20
 */

export default class FirebaseManager {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.user = null;
    this.initialized = false;
    this.syncEnabled = false;
    this.lastCloudSave = null;
    this.syncListeners = [];
    this.processingRedirect = false;

    // Firebase config - Credenciais do seu projeto
    this.firebaseConfig = {
      apiKey: "AIzaSyDpuwDoLoQWzgJ8owo3KFd6HeAxqvA7ulE",
      authDomain: "fazendarpg-14724.firebaseapp.com",
      projectId: "fazendarpg-14724",
      storageBucket: "fazendarpg-14724.firebasestorage.app",
      messagingSenderId: "454166613567",
      appId: "1:454166613567:web:c4d764245d5895caf1728a",
      measurementId: "G-2EQ2MEE8MK",
    };
  }

  /**
   * Initialize Firebase
   * @returns {Promise<boolean>}
   */
  async init() {
    if (this.initialized) {
      console.warn("⚠️ Firebase already initialized");
      return true;
    }

    try {
      // Check if Firebase SDK is loaded
      if (typeof firebase === "undefined") {
        console.warn("⚠️ Firebase SDK not loaded - cloud saves disabled");
        return false;
      }

      // Check if config is set
      if (this.firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
        console.warn("⚠️ Firebase not configured - cloud saves disabled");
        console.log(
          "💡 To enable cloud saves, configure Firebase in FirebaseManager.js",
        );
        return false;
      }

      console.log("🔥 Initializing Firebase...");

      // Initialize Firebase
      this.app = firebase.initializeApp(this.firebaseConfig);
      this.auth = firebase.auth();
      this.db = firebase.firestore();

      // Configure Firestore settings
      this.db.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
      });

      // Enable offline persistence
      await this.db
        .enablePersistence({ synchronizeTabs: true })
        .catch((err) => {
          if (err.code === "failed-precondition") {
            console.warn(
              "⚠️ Multiple tabs open, persistence only works in one tab",
            );
          } else if (err.code === "unimplemented") {
            console.warn("⚠️ Browser doesn't support persistence");
          }
        });

      // Listen for auth state changes
      this.auth.onAuthStateChanged((user) => {
        // Ignore initial null state if processing redirect
        if (!user && this.processingRedirect) {
          console.log("⏳ Waiting for redirect result...");
          return;
        }
        this.handleAuthStateChange(user);
      });

      this.initialized = true;
      console.log("✅ Firebase initialized successfully");

      return true;
    } catch (error) {
      console.error("❌ Failed to initialize Firebase:", error);
      return false;
    }
  }

  /**
   * Handle authentication state changes
   * @param {Object} user - Firebase user object
   */
  handleAuthStateChange(user) {
    if (user) {
      this.user = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      this.syncEnabled = true;
      console.log("✅ User logged in:", user.email);

      // Notify listeners
      this.notifyListeners("login", this.user);

      // Dispatch custom event
      window.dispatchEvent(
        new CustomEvent("firebase:login", {
          detail: { user: this.user },
        }),
      );
    } else {
      this.user = null;
      this.syncEnabled = false;
      console.log("👋 User logged out");

      // Notify listeners
      this.notifyListeners("logout");

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent("firebase:logout"));
    }
  }

  /**
   * Sign in with Google
   * @returns {Promise<Object|null>} User object or null
   */
  async signInWithGoogle() {
    if (!this.initialized) {
      console.error("❌ Firebase not initialized");
      return null;
    }

    try {
      console.log("🔐 Starting Google Sign-In...");

      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");

      // Always use popup to avoid redirect issues on localhost
      // Popup works on both desktop and mobile
      console.log("🔐 Using popup method for sign-in...");
      const result = await this.auth.signInWithPopup(provider);

      console.log("✅ Google Sign-In successful");
      return result.user;
    } catch (error) {
      console.error("❌ Google Sign-In failed:", error);

      // Handle specific errors
      if (error.code === "auth/popup-closed-by-user") {
        console.log("ℹ️ Sign-in popup closed by user");
      } else if (error.code === "auth/popup-blocked") {
        console.error("❌ Sign-in popup blocked by browser");
      }

      throw error;
    }
  }

  /**
   * Handle redirect result (for mobile)
   * @returns {Promise<Object|null>}
   */
  async getRedirectResult() {
    if (!this.initialized) return null;

    this.processingRedirect = true;

    try {
      console.log("🔍 Processing redirect result...");
      const result = await this.auth.getRedirectResult();

      if (result.user) {
        console.log("✅ Redirect Sign-In successful:", result.user.email);

        // Wait a bit to ensure auth state is fully updated
        await new Promise((resolve) => setTimeout(resolve, 1000));

        this.processingRedirect = false;
        return result.user;
      }

      console.log("ℹ️ No redirect result found");
      this.processingRedirect = false;
      return null;
    } catch (error) {
      console.error("❌ Redirect Sign-In failed:", error);
      this.processingRedirect = false;
      throw error;
    }
  }

  /**
   * Sign out
   * @returns {Promise<boolean>}
   */
  async signOut() {
    if (!this.initialized || !this.user) {
      console.warn("⚠️ No user to sign out");
      return false;
    }

    try {
      console.log("👋 Signing out...");
      await this.auth.signOut();
      console.log("✅ Sign out successful");
      return true;
    } catch (error) {
      console.error("❌ Sign out failed:", error);
      return false;
    }
  }

  /**
   * Save game data to cloud
   * @param {Object} saveData - Game save data
   * @returns {Promise<boolean>}
   */
  async saveToCloud(saveData) {
    if (!this.initialized || !this.syncEnabled) {
      console.warn("⚠️ Cloud sync not available");
      return false;
    }

    if (!this.user) {
      console.warn("⚠️ User not logged in");
      return false;
    }

    try {
      console.log("☁️ Saving to cloud...");

      // Add cloudSavedAt timestamp, but do NOT add extra fields (structure must match manual save/load)
      const cloudSaveData = {
        ...saveData,
        cloudSavedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      // Save to Firestore
      await this.db
        .collection("saves")
        .doc(this.user.uid)
        .set(cloudSaveData, { merge: true });

      this.lastCloudSave = Date.now();
      console.log("✅ Cloud save successful");

      // Notify listeners
      this.notifyListeners("cloudSave", { timestamp: this.lastCloudSave });

      // Dispatch custom event
      window.dispatchEvent(
        new CustomEvent("firebase:cloudSave", {
          detail: { timestamp: this.lastCloudSave },
        }),
      );

      return true;
    } catch (error) {
      console.error("❌ Cloud save failed:", error);

      // Handle specific errors
      if (error.code === "permission-denied") {
        console.error("❌ Permission denied - check Firestore rules");
      } else if (error.code === "unavailable") {
        console.warn("⚠️ Cloud save unavailable - offline mode");
      }

      return false;
    }
  }

  /**
   * Load game data from cloud
   * @returns {Promise<Object|null>}
   */
  async loadFromCloud() {
    if (!this.initialized || !this.syncEnabled) {
      console.warn("⚠️ Cloud sync not available");
      return null;
    }

    if (!this.user) {
      console.warn("⚠️ User not logged in");
      return null;
    }

    try {
      console.log("☁️ Loading from cloud...");

      const doc = await this.db.collection("saves").doc(this.user.uid).get();

      if (!doc.exists) {
        console.log("📭 No cloud save found");
        return null;
      }

      const cloudData = doc.data();
      console.log("✅ Cloud load successful");

      // Remove only Firestore timestamp object, but keep the rest of the save exactly as manual
      const saveData = { ...cloudData };

      // If cloudSavedAt exists and is a Firestore Timestamp, convert to savedAt
      if (saveData.cloudSavedAt && saveData.cloudSavedAt.toMillis) {
        saveData.savedAt = saveData.cloudSavedAt.toMillis();
        delete saveData.cloudSavedAt;
      }

      // Remove Firestore-only metadata (userId, userEmail, deviceInfo) if present
      delete saveData.userId;
      delete saveData.userEmail;
      delete saveData.deviceInfo;

      // Notify listeners
      this.notifyListeners("cloudLoad", {
        timestamp: saveData.savedAt || null,
      });

      // Dispatch custom event
      window.dispatchEvent(
        new CustomEvent("firebase:cloudLoad", {
          detail: { saveData },
        }),
      );

      return saveData;
    } catch (error) {
      console.error("❌ Cloud load failed:", error);

      // Handle specific errors
      if (error.code === "permission-denied") {
        console.error("❌ Permission denied - check Firestore rules");
      } else if (error.code === "unavailable") {
        console.warn("⚠️ Cloud load unavailable - offline mode");
      }

      return null;
    }
  }

  /**
   * Delete cloud save
   * @returns {Promise<boolean>}
   */
  async deleteCloudSave() {
    if (!this.initialized || !this.user) {
      console.warn("⚠️ Cannot delete cloud save");
      return false;
    }

    try {
      console.log("🗑️ Deleting cloud save...");

      await this.db.collection("saves").doc(this.user.uid).delete();

      console.log("✅ Cloud save deleted");

      // Notify listeners
      this.notifyListeners("cloudDelete");

      // Dispatch custom event
      window.dispatchEvent(new CustomEvent("firebase:cloudDelete"));

      return true;
    } catch (error) {
      console.error("❌ Cloud delete failed:", error);
      return false;
    }
  }

  /**
   * Check if cloud save exists
   * @returns {Promise<boolean>}
   */
  async hasCloudSave() {
    if (!this.initialized || !this.user) {
      return false;
    }

    try {
      const doc = await this.db.collection("saves").doc(this.user.uid).get();

      return doc.exists;
    } catch (error) {
      console.error("❌ Failed to check cloud save:", error);
      return false;
    }
  }

  /**
   * Get cloud save info
   * @returns {Promise<Object|null>}
   */
  async getCloudSaveInfo() {
    if (!this.initialized || !this.user) {
      return null;
    }

    try {
      const doc = await this.db.collection("saves").doc(this.user.uid).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data();

      return {
        savedAt: data.cloudSavedAt ? data.cloudSavedAt.toMillis() : null,
        playerName: data.player?.name || "Unknown",
        playerLevel: data.player?.level || 1,
        version: data.version,
        deviceInfo: data.deviceInfo,
      };
    } catch (error) {
      console.error("❌ Failed to get cloud save info:", error);
      return null;
    }
  }

  /**
   * Sync local save with cloud
   * @param {Object} localSave - Local save data
   * @returns {Promise<Object>} Sync result
   */
  async syncWithCloud(localSave) {
    if (!this.initialized || !this.syncEnabled) {
      return {
        synced: false,
        reason: "Cloud sync not available",
      };
    }

    try {
      const cloudSave = await this.loadFromCloud();

      // No cloud save - upload local
      if (!cloudSave) {
        console.log("☁️ No cloud save found - uploading local save");
        await this.saveToCloud(localSave);
        return {
          synced: true,
          action: "uploaded",
          data: localSave,
        };
      }

      // Compare timestamps
      const localTime = localSave.savedAt || 0;
      const cloudTime = cloudSave.savedAt || 0;

      console.log(
        `📊 Sync comparison - Local: ${new Date(localTime).toISOString()}, Cloud: ${new Date(cloudTime).toISOString()}`,
      );

      // Cloud is newer - use cloud
      if (cloudTime > localTime) {
        console.log("⬇️ Cloud save is newer - using cloud data");
        return {
          synced: true,
          action: "downloaded",
          data: cloudSave,
        };
      }

      // Local is newer - upload to cloud
      if (localTime > cloudTime) {
        console.log("⬆️ Local save is newer - uploading to cloud");
        await this.saveToCloud(localSave);
        return {
          synced: true,
          action: "uploaded",
          data: localSave,
        };
      }

      // Same timestamp - already synced
      console.log("✅ Already synced");
      return {
        synced: true,
        action: "none",
        data: localSave,
      };
    } catch (error) {
      console.error("❌ Sync failed:", error);
      return {
        synced: false,
        reason: error.message,
        data: localSave,
      };
    }
  }

  /**
   * Get device info for tracking
   * @returns {Object}
   */
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      online: navigator.onLine,
      timestamp: Date.now(),
    };
  }

  /**
   * Add sync listener
   * @param {Function} callback
   */
  addSyncListener(callback) {
    this.syncListeners.push(callback);
  }

  /**
   * Remove sync listener
   * @param {Function} callback
   */
  removeSyncListener(callback) {
    this.syncListeners = this.syncListeners.filter((cb) => cb !== callback);
  }

  /**
   * Notify all listeners
   * @param {string} event
   * @param {*} data
   */
  notifyListeners(event, data) {
    this.syncListeners.forEach((callback) => {
      try {
        callback(event, data);
      } catch (error) {
        console.error("❌ Listener error:", error);
      }
    });
  }

  /**
   * Check if user is logged in
   * @returns {boolean}
   */
  isLoggedIn() {
    return this.user !== null;
  }

  /**
   * Get current user
   * @returns {Object|null}
   */
  getUser() {
    return this.user;
  }

  /**
   * Check if sync is enabled
   * @returns {boolean}
   */
  isSyncEnabled() {
    return this.syncEnabled;
  }

  /**
   * Get last cloud save timestamp
   * @returns {number|null}
   */
  getLastCloudSave() {
    return this.lastCloudSave;
  }

  /**
   * Get Firebase status
   * @returns {Object}
   */
  getStatus() {
    return {
      initialized: this.initialized,
      syncEnabled: this.syncEnabled,
      loggedIn: this.isLoggedIn(),
      user: this.user,
      lastCloudSave: this.lastCloudSave,
    };
  }
}
