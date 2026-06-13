const CACHE_NAME = 'eportfolio-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './assets/img/ppg-logo-clean.png',
  './assets/img/profile.jpeg',
  './assets/img/ust-logo.png',
  './assets/img/uny-logo.png',
  './assets/img/smk2klaten-logo.png'
];

// Install Event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline shell');
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[Service Worker] Pre-cache failed for some assets, continuing...:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Stale-While-Revalidate for app assets, Network-Only for Google Drive
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass caching for Google Drive, docs, or other external document URLs
  if (
    url.hostname.includes('drive.google.com') ||
    url.hostname.includes('docs.google.com') ||
    url.pathname.includes('/preview') ||
    event.request.method !== 'GET'
  ) {
    return; // Let browser handle it directly via network
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Update cache if network response is valid and from our origin or CDNs
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || url.hostname.includes('cdnjs.cloudflare.com') || url.hostname.includes('fonts.googleapis.com'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Network fail - return cached response if exists
      });

      return cachedResponse || fetchPromise;
    })
  );
});
