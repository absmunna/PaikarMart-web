// Paikar Mart Progressive Web App - Service Worker
const CACHE_VERSION = 'v2.1';
const STATIC_CACHE = `paikarmart-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `paikarmart-dynamic-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Core App Shell Assets for instant offline loading
const APP_SHELL = [
  '/',
  '/index.html',
  OFFLINE_URL,
  '/manifest.json',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/pwa-192x192.svg',
  '/pwa-512x512.svg',
  '/pwa-maskable-512x512.svg'
];

// Helper: Determine if request is authenticated or sensitive
function isSensitiveOrAuthenticatedRequest(request, url) {
  // Check for Authorization header (Bearer tokens, JWTs, etc.)
  if (request.headers.has('Authorization') || request.headers.has('x-auth-token')) {
    return true;
  }

  // Sensitive paths that should NEVER be cached in service worker storage
  const sensitivePathPatterns = [
    '/auth/',
    '/api/v1/auth',
    '/api/auth',
    '/api/v1/wallet',
    '/api/v1/cart',
    '/api/v1/payment',
    '/api/v1/escrow',
    '/api/v1/admin',
    '/api/v1/verifications',
    '/api/v1/storage/upload',
    '/api/v1/storage/file'
  ];

  return sensitivePathPatterns.some(pattern => url.pathname.includes(pattern));
}

// Helper: Check if request is for static assets
function isStaticAsset(url) {
  return (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot)$/i) ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  );
}

// 1. INSTALL: Precache the entire App Shell & Offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[PWA SW] Precaching app shell & offline fallback');
      return cache.addAll(APP_SHELL).catch((err) => {
        console.warn('[PWA SW] Non-fatal precache warning:', err);
      });
    })
  );
  // Safe update flow: do not force hijack if client is in critical state
  self.skipWaiting();
});

// 2. ACTIVATE: Purge stale caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== STATIC_CACHE && key !== DYNAMIC_CACHE) {
            console.log('[PWA SW] Deleting obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. LISTEN FOR UPDATE MESSAGES: Controlled update flow
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 4. FETCH: Intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Bypass non-GET, WebSocket, chrome-extension, or Vite internal queries
  if (
    request.method !== 'GET' ||
    url.protocol.startsWith('ws') ||
    url.protocol.startsWith('chrome-extension') ||
    url.search.includes('vite:ws') ||
    url.pathname.includes('/@vite/') ||
    url.pathname.includes('/@fs/')
  ) {
    return;
  }

  // -------------------------------------------------------------
  // STRATEGY A: API REQUESTS (/api/*)
  // Network-First. NEVER cache authenticated or sensitive data!
  // -------------------------------------------------------------
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/api/v1')) {
    const isSensitive = isSensitiveOrAuthenticatedRequest(request, url);

    if (isSensitive) {
      // Authenticated request: Network ONLY. Never put into cache!
      event.respondWith(
        fetch(request).catch(() => {
          return new Response(
            JSON.stringify({
              error: 'offline',
              message: 'ইন্টারনেট সংযোগ পাওয়া যায়নি। কানেকশন চেক করুন।'
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
      );
      return;
    }

    // Public API query (e.g., public products, general categories): Network-first with cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(
            JSON.stringify({
              error: 'offline',
              message: 'অফলাইন মোড: ক্যাশ করা ডেটা নেই।'
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // -------------------------------------------------------------
  // STRATEGY B: NAVIGATION REQUESTS (HTML Pages / SPA routing)
  // Network-First with /index.html and /offline.html fallbacks
  // -------------------------------------------------------------
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        // First try the cached index.html for SPA routes
        const cachedIndex = await caches.match('/index.html');
        if (cachedIndex) return cachedIndex;

        // Otherwise return the branded offline fallback page
        const cachedOffline = await caches.match(OFFLINE_URL);
        if (cachedOffline) return cachedOffline;

        return new Response('Offline', { status: 503 });
      })
    );
    return;
  }

  // -------------------------------------------------------------
  // STRATEGY C: STATIC ASSETS (JS, CSS, Images, Fonts)
  // Cache-First with Network fallback & cache population
  // -------------------------------------------------------------
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          // Found in cache: return immediately, and refresh in background (stale-while-revalidate)
          fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(STATIC_CACHE).then((cache) => cache.put(request, networkResponse));
              }
            })
            .catch(() => {/* Ignore background fetch failure when offline */});
          return cachedResponse;
        }

        // Not in cache: fetch from network and cache
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(async () => {
            // If image fails, return cached icon placeholder if available
            if (request.destination === 'image') {
              return caches.match('/pwa-192x192.png');
            }
            return new Response('Asset not found offline', { status: 503 });
          });
      })
    );
    return;
  }

  // -------------------------------------------------------------
  // DEFAULT STRATEGY: Stale-While-Revalidate
  // -------------------------------------------------------------
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
