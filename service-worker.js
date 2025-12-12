// 🦅 DIGIY HUB - Service Worker (GitHub Pages friendly)
// Version 1.0.1 - L'Afrique enracinée, connectée au monde 🇸🇳

const CACHE_NAME = 'digiy-hub-v1.0.1';
const RUNTIME_CACHE = 'digiy-runtime-v1';

// IMPORTANT GitHub Pages : on reste en relatif "./"
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// Installation
self.addEventListener('install', (event) => {
  console.log('🦅 DIGIY Service Worker: Installation...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('🦅 DIGIY Service Worker: Activation...');

  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((n) => n !== CACHE_NAME && n !== RUNTIME_CACHE)
          .map((n) => caches.delete(n))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: Network First, Cache fallback (même origine uniquement)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const reqUrl = new URL(event.request.url);

  // Ne gère que les requêtes same-origin (évite conflits avec modules externes)
  if (reqUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache seulement les réponses OK et "basic" (évite opaque)
        if (response && response.status === 200 && response.type === 'basic') {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;

        // fallback navigation → page d’accueil (offline)
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }

        return new Response('Offline - Ressource non disponible', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      })
  );
});

// Messages
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))))
    );
  }
});

// Push (plus tard) - chemins relatifs
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Nouvelle notification DIGIY',
    icon: './icons/icon-192x192.png',
    badge: './icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'digiy-notification',
    data: { url: data.url || './' }
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'DIGIY HUB', options)
  );
});

// Clic notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const target = event.notification?.data?.url || './';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url === target && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(target);
    })
  );
});
