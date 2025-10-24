// FazendaRPG Service Worker v0.0.15
// NOTA: Para atualizar versão, edite: version.js (será integrado em breve)
const VERSION = "0.0.15"; // TODO: Importar de version.js quando Service Worker suportar ES modules
const CACHE_NAME = `fazendarpg-v${VERSION}`;
const ASSETS_TO_CACHE = [
  "./index.html",
  "./manifest.json",
  "./style/main.css",
  "./style/topbar.css",
  "./style/topbar-fix.css",
  "./style/skills.css",
  "./style/wiki.css",
  "./style/themes.css",
  "./style/mobile.css",
  "./style/components/farm-improvements.css",
  "./js/app.js",
  "./js/core/GameEngine.js",
  "./js/core/Player.js",
  "./js/core/SaveManager.js",
  "./js/systems/SkillSystem.js",
  "./js/systems/FarmSystem.js",
  "./js/systems/InventorySystem.js",
  "./js/systems/QuestSystem.js",
  "./js/systems/NotificationManager.js",
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
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-72.png",
];

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

// Fetch event - iOS optimized strategy
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  // Skip chrome extensions and external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle SW heartbeat pings (keeps SW alive)
  if (event.request.url.includes('sw-ping')) {
    event.respondWith(new Response('pong', { status: 200 }));
    return;
  }

  const url = new URL(event.request.url);

  // Network-first for JS modules (critical for iOS)
  if (url.pathname.endsWith(".js")) {
    event.respondWith(
      Promise.race([
        fetch(event.request).then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            }).catch(err => console.warn("Cache put failed:", err));
          }
          return response;
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Network timeout")), 3000)
        )
      ]).catch(() => {
        // Fallback to cache on network failure
        return caches.match(event.request);
      })
    );
    return;
  }

  // Cache-first for other resources
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

// Helper function to fetch and cache (iOS optimized with timeout)
function fetchAndCache(request) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Fetch timeout")), 5000)
    )
  ]).then((response) => {
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
  }).catch((error) => {
    console.warn("⚠️ Fetch failed:", request.url, error);
    // Try to return from cache as fallback
    return caches.match(request);
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

    // Check notifications - fire any that are overdue
    for (const notification of notifications) {
      // Fire notification if time has passed (with 5 second buffer for reliability)
      if (notification.timestamp <= now + 5000) {
        console.log(`🔔 Disparando notificação: ${notification.title}`);
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
      console.log(`✅ ${firedCount} notificação(ões) disparada(s) com sucesso!`);
    }

    // Log remaining notifications
    const remainingNotifications = await getAllNotificationsFromDB();
    if (remainingNotifications.length > 0) {
      const nextNotification = remainingNotifications.sort((a, b) => a.timestamp - b.timestamp)[0];
      const delayUntilNext = Math.max(0, nextNotification.timestamp - Date.now());
      console.log(`⏰ ${remainingNotifications.length} notificação(ões) pendente(s) - próxima em ${Math.round(delayUntilNext / 1000)}s`);
    }
  } catch (error) {
    console.error("❌ Erro ao verificar notificações pendentes:", error);
  }
}

// Check notifications when Service Worker activates
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker ativado - verificando notificações...");
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      checkPendingNotifications().catch((error) =>
        console.error("❌ Erro ao verificar notificações na ativação:", error),
      ),
    ]).then(() => {
      // Start periodic check after activation
      startPeriodicCheck();
    })
  );
});

// Keep Service Worker alive with periodic self-ping
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker: Installing...");
  event.waitUntil(
    Promise.race([
      // Add timeout for iOS
      new Promise((resolve) => setTimeout(resolve, 5000)),
      caches
        .open(CACHE_NAME)
        .then((cache) => {
          console.log("📦 Service Worker: Caching app shell");
          // Cache assets one by one to avoid iOS timeout issues
          return Promise.allSettled(
            ASSETS_TO_CACHE.map((url) =>
              cache.add(new Request(url, { cache: "reload" }))
                .catch(err => console.warn("⚠️ Failed to cache:", url, err))
            )
          );
        })
        .catch((error) => {
          console.warn("⚠️ Failed to cache some assets:", error);
          // Continue anyway - non-critical assets can be cached on demand
          return Promise.resolve();
        })
    ])
    .then(() => {
      console.log("✅ Service Worker: Installation complete");
      return self.skipWaiting();
    })
    .catch((error) => {
      console.warn("⚠️ Service Worker installation error:", error);
      return self.skipWaiting(); // Skip waiting even on error
    })
  );
});

// Store for scheduled notifications (in-memory for immediate checks)
let scheduledNotifications = new Map();
let periodicCheckInterval = null;

// Wake up Service Worker to check notifications
// This is called from the app to ensure SW stays somewhat active
async function startPeriodicCheck() {
  console.log("⏰ Sistema de verificação de notificações ativado");

  // Check immediately
  await checkPendingNotifications();

  // Clear any existing interval
  if (periodicCheckInterval) {
    clearInterval(periodicCheckInterval);
  }

  // Set up periodic check every 15 seconds (more aggressive for better reliability)
  // This keeps the SW alive and checks for pending notifications
  periodicCheckInterval = setInterval(async () => {
    console.log("🔄 Verificação periódica de notificações (background)");

    // Self-ping to keep SW alive
    try {
      await fetch('/?sw-ping=' + Date.now(), { method: 'HEAD' });
    } catch (e) {
      // Ignore fetch errors - just to keep SW alive
    }

    await checkPendingNotifications();
  }, 15000); // 15 seconds for better notification reliability

  console.log("✅ Verificação periódica ativada (15s) + heartbeat");
}

// Legacy function kept for compatibility
function stopPeriodicCheck() {
  if (periodicCheckInterval) {
    clearInterval(periodicCheckInterval);
    periodicCheckInterval = null;
    console.log("⏰ Sistema de verificação periódica desativado");
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

    // Save to IndexedDB for persistence (critical for background notifications)
    await saveNotificationToDB(id, title, body, timestamp, data);

    if (delay <= 0) {
      // Should fire immediately
      await showNotification(title, body, data);
      await removeNotificationFromDB(id);
      return;
    }

    // Store in memory (will be lost if SW is terminated, but that's OK - we have IndexedDB)
    scheduledNotifications.set(id, {
      title,
      body,
      timestamp,
      data,
    });

    console.log(
      `📅 Notificação agendada: ${title} para ${new Date(timestamp).toLocaleString()} (em ${Math.round(delay / 1000)}s)`,
    );
    console.log(`💾 Notificação salva em IndexedDB para disparo em background`);
    console.log(`⚠️ IMPORTANTE: Notificação será disparada MESMO COM APP FECHADO`);

    // Ensure periodic check is running
    startPeriodicCheck();
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

// Show notification (always show, even if app is open - user wants to know!)
async function showNotification(title, body, data = {}) {
  try {
    const allClients = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    });

    // Check if app is open and visible
    let isAppVisible = false;
    for (const client of allClients) {
      if (client.visibilityState === "visible" || client.focused) {
        isAppVisible = true;
        break;
      }
    }

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

    // ALWAYS show notification - this is the key for background notifications!
    await self.registration.showNotification(title, options);

    if (isAppVisible) {
      console.log(
        `🔔 Notificação mostrada (app ABERTO): ${title}`,
      );
      // Also notify the app that notification was shown
      allClients.forEach((client) => {
        client.postMessage({
          type: "NOTIFICATION_SHOWN_WHILE_VISIBLE",
          data: { title, body, ...data },
        });
      });
    } else {
      console.log(
        `🔔 ✅ NOTIFICAÇÃO BACKGROUND FUNCIONANDO! App FECHADO: ${title}`,
      );
    }
  } catch (error) {
    console.error("❌ Erro ao mostrar notificação:", error);
  }
}

// Check notifications immediately when SW loads/wakes up
console.log("🌾 FazendaRPG Service Worker carregado - verificando notificações...");
checkPendingNotifications().catch((error) => {
  console.error("❌ Erro ao verificar notificações no carregamento:", error);
});
