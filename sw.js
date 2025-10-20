// FazendaRPG Service Worker v0.0.6
const CACHE_NAME = 'fazendarpg-v0.0.6';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './style/main.css',
  './style/topbar.css',
  './style/skills.css',
  './style/themes.css',
  './style/mobile.css',
  './js/app.js',
  './js/core/GameEngine.js',
  './js/core/Player.js',
  './js/core/SaveManager.js',
  './js/systems/SkillSystem.js',
  './js/systems/FarmSystem.js',
  './js/systems/InventorySystem.js',
  './js/systems/QuestSystem.js',
  './js/utils/i18n.js',
  './js/utils/notifications.js',
  './js/utils/helpers.js',
  './js/ui/TopBar.js',
  './js/ui/SideMenu.js',
  './js/ui/ScreenManager.js',
  './data/skills.json',
  './data/items.json',
  './data/crops.json',
  './data/quests.json',
  './data/npcs.json',
  './data/translations/pt-BR.json',
  './data/translations/en-US.json'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE.map(url => new Request(url, { cache: 'reload' })))
          .catch((error) => {
            console.warn('⚠️ Failed to cache some assets:', error);
            // Continue anyway - non-critical assets can be cached on demand
            return Promise.resolve();
          });
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
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
        console.error('❌ Fetch failed:', error);

        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }

        throw error;
      })
  );
});

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request)
    .then((response) => {
      // Don't cache non-successful responses
      if (!response || response.status !== 200 || response.type === 'error') {
        return response;
      }

      // Clone the response
      const responseToCache = response.clone();

      caches.open(CACHE_NAME)
        .then((cache) => {
          cache.put(request, responseToCache);
        })
        .catch((error) => {
          console.warn('⚠️ Failed to cache:', request.url, error);
        });

      return response;
    });
}

// Message event - handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => Promise.all(cacheNames.map((name) => caches.delete(name))))
        .then(() => {
          event.ports[0].postMessage({ success: true });
        })
    );
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Background sync (when available)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-game-data') {
    event.waitUntil(syncGameData());
  }
});

async function syncGameData() {
  try {
    // Future: sync player data with server
    console.log('🔄 Syncing game data...');
    return Promise.resolve();
  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  }
}

// Push notifications (when available)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível!',
    icon: './assets/icon-192.png',
    badge: './assets/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('🌾 FazendaRPG', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow('./')
  );
});

console.log('🌾 FazendaRPG Service Worker loaded');
