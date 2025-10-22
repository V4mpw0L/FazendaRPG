// FazendaRPG Service Worker v0.0.10
const CACHE_NAME = "fazendarpg-v0.0.10";
const ASSETS_TO_CACHE = [
  "./index.html",
  "./manifest.json",
  "./style/main.css",
  "./style/topbar.css",
  "./style/skills.css",
  "./style/themes.css",
  "./style/mobile.css",
  "./js/app.js",
  "./js/core/GameEngine.js",
  "./js/core/Player.js",
  "./js/core/SaveManager.js",
  "./js/systems/SkillSystem.js",
  "./js/systems/FarmSystem.js",
  "./js/systems/InventorySystem.js",
  "./js/systems/QuestSystem.js",
  "./js/utils/i18n.js",
  "./js/utils/notifications.js",
  "./js/utils/helpers.js",
  "./js/ui/TopBar.js",
  "./js/ui/SideMenu.js",
  "./js/ui/ScreenManager.js",
  "./data/skills.json",
  "./data/items.json",
  "./data/crops.json",
  "./data/quests.json",
  "./data/npcs.json",
  "./data/translations/pt-BR.json",
  "./data/translations/en-US.json",
];

// Install event - cache assets
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Service Worker: Caching app shell");
        return cache
          .addAll(
            ASSETS_TO_CACHE.map((url) => new Request(url, { cache: "reload" })),
          )
          .catch((error) => {
            console.warn("⚠️ Failed to cache some assets:", error);
            // Continue anyway - non-critical assets can be cached on demand
            return Promise.resolve();
          });
      })
      .then(() => {
        console.log("✅ Service Worker: Installation complete");
        return self.skipWaiting();
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log("🗑️ Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("✅ Service Worker: Activation complete");
        return self.clients.claim();
      }),
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip chrome extensions and external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version and update cache in background
          fetchAndCache(event.request);
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetchAndCache(event.request);
      })
      .catch((error) => {
        console.error("❌ Fetch failed:", error);

        // Return offline page for navigation requests
        if (event.request.mode === "navigate") {
          return caches.match("./index.html");
        }

        throw error;
      }),
  );
});

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request).then((response) => {
    // Don't cache non-successful responses
    if (!response || response.status !== 200 || response.type === "error") {
      return response;
    }

    // Clone the response
    const responseToCache = response.clone();

    caches
      .open(CACHE_NAME)
      .then((cache) => {
        cache.put(request, responseToCache);
      })
      .catch((error) => {
        console.warn("⚠️ Failed to cache:", request.url, error);
      });

    return response;
  });
}

// Message event - handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "CACHE_URLS") {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => cache.addAll(event.data.urls)),
    );
  }

  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches
        .keys()
        .then((cacheNames) =>
          Promise.all(cacheNames.map((name) => caches.delete(name))),
        )
        .then(() => {
          event.ports[0].postMessage({ success: true });
        }),
    );
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Background sync (when available)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-game-data") {
    event.waitUntil(syncGameData());
  }
});

async function syncGameData() {
  try {
    // Future: sync player data with server
    console.log("🔄 Syncing game data...");
    return Promise.resolve();
  } catch (error) {
    console.error("❌ Sync failed:", error);
    throw error;
  }
}

// ============================================
// INDEXEDDB STORAGE FOR NOTIFICATIONS
// ============================================

const DB_NAME = "fazendarpg-notifications";
const DB_VERSION = 1;
const STORE_NAME = "scheduled";

// Open IndexedDB
function openNotificationsDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

// Save notification to IndexedDB
async function saveNotificationToDB(id, title, body, timestamp, data) {
  try {
    const db = await openNotificationsDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    store.put({
      id,
      title,
      body,
      timestamp,
      data,
      createdAt: Date.now(),
    });

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch (error) {
    console.error("❌ Erro ao salvar notificação no DB:", error);
    throw error;
  }
}

// Remove notification from IndexedDB
async function removeNotificationFromDB(id) {
  try {
    const db = await openNotificationsDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    store.delete(id);

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch (error) {
    console.error("❌ Erro ao remover notificação do DB:", error);
  }
}

// Get all notifications from IndexedDB
async function getAllNotificationsFromDB() {
  try {
    const db = await openNotificationsDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        db.close();
        resolve(request.result || []);
      };
      request.onerror = () => {
        db.close();
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("❌ Erro ao buscar notificações do DB:", error);
    return [];
  }
}

// Clear all notifications from IndexedDB
async function clearAllNotificationsFromDB() {
  try {
    const db = await openNotificationsDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    store.clear();

    return new Promise((resolve, reject) => {
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch (error) {
    console.error("❌ Erro ao limpar notificações do DB:", error);
  }
}

// ============================================
// CHECK AND FIRE PENDING NOTIFICATIONS
// ============================================

async function checkPendingNotifications() {
  try {
    const notifications = await getAllNotificationsFromDB();
    const now = Date.now();
    let firedCount = 0;

    for (const notification of notifications) {
      // If notification time has passed, fire it
      if (notification.timestamp <= now) {
        await showNotification(
          notification.title,
          notification.body,
          notification.data,
        );
        await removeNotificationFromDB(notification.id);
        firedCount++;
      }
    }

    if (firedCount > 0) {
      console.log(`🔔 ${firedCount} notificação(ões) pendente(s) disparada(s)`);
    }
  } catch (error) {
    console.error("❌ Erro ao verificar notificações pendentes:", error);
  }
}

// Check notifications when Service Worker wakes up
self.addEventListener("activate", (event) => {
  event.waitUntil(
    checkPendingNotifications().catch((error) =>
      console.error("❌ Erro ao verificar notificações na ativação:", error),
    ),
  );
});

// Store for scheduled notifications (in-memory for immediate checks)
let scheduledNotifications = new Map();
let checkInterval = null;

// Start periodic check (every 30 seconds)
function startPeriodicCheck() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }

  // Check immediately
  checkPendingNotifications();

  // Then check every 30 seconds
  checkInterval = setInterval(() => {
    checkPendingNotifications();
  }, 30000); // 30 seconds

  console.log("⏰ Verificação periódica de notificações iniciada");
}

// Stop periodic check
function stopPeriodicCheck() {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
    console.log("⏰ Verificação periódica de notificações parada");
  }
}

// Push notifications (when available)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Nova atualização disponível!",
    icon: "./assets/icon-192.png",
    badge: "./assets/icon-72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification("🌾 FazendaRPG", options),
      checkPendingNotifications(),
    ]),
  );
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Handle different notification actions
  const notificationData = event.notification.data || {};

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if app is already open
        for (let client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            return client.focus();
          }
        }
        // If not open, open new window
        if (clients.openWindow) {
          return clients.openWindow("./");
        }
      }),
  );
});

// Handle messages from the app to schedule notifications
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SCHEDULE_NOTIFICATION") {
    const { id, title, body, timestamp, data } = event.data;
    scheduleNotification(id, title, body, timestamp, data)
      .then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
      .catch((error) => {
        event.ports[0]?.postMessage({ success: false, error: error.message });
      });
  }

  if (event.data && event.data.type === "CANCEL_NOTIFICATION") {
    const { id } = event.data;
    cancelNotification(id)
      .then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
      .catch((error) => {
        event.ports[0]?.postMessage({ success: false, error: error.message });
      });
  }

  if (event.data && event.data.type === "CANCEL_ALL_NOTIFICATIONS") {
    cancelAllNotifications()
      .then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
      .catch((error) => {
        event.ports[0]?.postMessage({ success: false, error: error.message });
      });
  }

  if (event.data && event.data.type === "GET_SCHEDULED_NOTIFICATIONS") {
    getAllNotificationsFromDB()
      .then((notifications) => {
        event.ports[0]?.postMessage({ notifications });
      })
      .catch((error) => {
        event.ports[0]?.postMessage({
          notifications: [],
          error: error.message,
        });
      });
  }

  if (event.data && event.data.type === "START_PERIODIC_CHECK") {
    startPeriodicCheck();
    event.ports[0]?.postMessage({ success: true });
  }

  if (event.data && event.data.type === "CHECK_NOTIFICATIONS_NOW") {
    checkPendingNotifications()
      .then(() => {
        event.ports[0]?.postMessage({ success: true });
      })
      .catch((error) => {
        event.ports[0]?.postMessage({ success: false, error: error.message });
      });
  }
});

// Schedule a notification
async function scheduleNotification(id, title, body, timestamp, data = {}) {
  try {
    // Cancel existing notification with same ID
    await cancelNotification(id);

    const now = Date.now();
    const delay = timestamp - now;

    // Save to IndexedDB for persistence
    await saveNotificationToDB(id, title, body, timestamp, data);

    if (delay <= 0) {
      // Should fire immediately
      await showNotification(title, body, data);
      await removeNotificationFromDB(id);
      return;
    }

    // Also schedule in memory for immediate firing (if SW stays alive)
    const timeoutId = setTimeout(async () => {
      await showNotification(title, body, data);
      await removeNotificationFromDB(id);
      scheduledNotifications.delete(id);
    }, delay);

    scheduledNotifications.set(id, {
      timeoutId,
      title,
      body,
      timestamp,
      data,
    });

    console.log(
      `📅 Notificação agendada: ${title} para ${new Date(timestamp).toLocaleString()} (em ${Math.round(delay / 1000)}s)`,
    );

    // Start periodic check if not running
    if (!checkInterval) {
      startPeriodicCheck();
    }
  } catch (error) {
    console.error("❌ Erro ao agendar notificação:", error);
    throw error;
  }
}

// Cancel a scheduled notification
async function cancelNotification(id) {
  try {
    // Remove from memory
    const notification = scheduledNotifications.get(id);
    if (notification) {
      clearTimeout(notification.timeoutId);
      scheduledNotifications.delete(id);
    }

    // Remove from IndexedDB
    await removeNotificationFromDB(id);

    console.log(`❌ Notificação cancelada: ${id}`);
  } catch (error) {
    console.error("❌ Erro ao cancelar notificação:", error);
  }
}

// Cancel all scheduled notifications
async function cancelAllNotifications() {
  try {
    // Clear memory
    scheduledNotifications.forEach((notification) => {
      clearTimeout(notification.timeoutId);
    });
    scheduledNotifications.clear();

    // Clear IndexedDB
    await clearAllNotificationsFromDB();

    console.log(`❌ Todas as notificações canceladas`);
  } catch (error) {
    console.error("❌ Erro ao cancelar todas as notificações:", error);
  }
}

// Show notification
async function showNotification(title, body, data = {}) {
  try {
    const options = {
      body,
      icon: "./assets/icon-192.png",
      badge: "./assets/icon-72.png",
      vibrate: [200, 100, 200],
      tag: data.tag || "fazendarpg-notification",
      requireInteraction: false,
      silent: false,
      renotify: true,
      data: {
        ...data,
        timestamp: Date.now(),
      },
    };

    await self.registration.showNotification(title, options);
    console.log(`🔔 Notificação mostrada: ${title} - ${body}`);

    // Notify all clients that notification was shown
    const allClients = await self.clients.matchAll();
    allClients.forEach((client) => {
      client.postMessage({
        type: "NOTIFICATION_SHOWN",
        data: { title, body, ...data },
      });
    });
  } catch (error) {
    console.error("❌ Erro ao mostrar notificação:", error);
  }
}

// Start periodic check when SW loads
startPeriodicCheck();

console.log("🌾 FazendaRPG Service Worker loaded");
