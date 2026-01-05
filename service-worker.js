/* DIGIY HUB — Service Worker (stable + safe API) */
const CACHE_NAME = "digiy-hub-v1.0.1";

const ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/core.html",
  "/digiylyfe.html",
  "/digiy-jef.html",
  "/digiy-jef-lite.html",
  "/digiy-jobs.html",
  "/digiy-pay.html",
  "/pwa-install.html",
  "/generateur-icones-pwa.html",
  "/inscription-digiylyfe.html",
  "/jef-admin.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // ✅ On ne touche pas au cross-origin (QR, CDN, API externes…)
  if (url.origin !== self.location.origin) return;

  // ✅ IMPORTANT: ne jamais intercepter/cache les routes API
  if (url.pathname.startsWith("/api")) return;

  // Navigations: network-first, fallback cache, puis offline
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          const cached = await caches.match(req);
          return cached || caches.match("/offline.html");
        }
      })()
    );
    return;
  }

  // Assets: cache-first, fallback network
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (e) {
        return caches.match("/offline.html");
      }
    })()
  );
});
