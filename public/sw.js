const CACHE_NAME = 'karol-cache-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json', '/favicon.ico', '/logo.svg'];

const isDev = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');

  if (isDev) {
    console.log('[ServiceWorker] Development mode - skipping cache');
    return;
  }

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }

          return Promise.resolve(); // Add return for the else case
        }),
      );
    }),
  );

  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (isDev) {
    // Skip caching in development mode
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('[ServiceWorker] Return cached:', event.request.url);
        return response;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          console.log('[ServiceWorker] Caching new resource:', event.request.url);
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});
