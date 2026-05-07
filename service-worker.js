/* DIGIY HUB — Service Worker stable + safe cache */
const CACHE_NAME = "digiy-hub-v1.0.3";

const ASSETS = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./packs.html",
  "./paiement-manuel.html",
  "./temperature-business.html"
];

/* Installation : cache safe, un fichier manquant ne casse pas tout */
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      await Promise.all(
        ASSETS.map(async (asset) => {
          try {
            const res = await fetch(asset, { cache: "reload" });
            if (res && res.ok) {
              await cache.put(asset, res.clone());
            }
          } catch (e) {
            console.warn("[DIGIY SW] asset non caché:", asset, e);
          }
        })
      );

      await self.skipWaiting();
    })()
  );
});

/* Activation : supprime les anciens caches */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      );

      await self.clients.claim();
    })()
  );
});

/* Fetch */
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  const url = new URL(req.url);

  /* Ne jamais toucher aux domaines externes */
  if (url.origin !== self.location.origin) return;

  /* Ne jamais intercepter les routes API */
  if (url.pathname.startsWith("/api")) return;

  /* Ne pas cacher les fichiers neutralisés */
  if (
    url.pathname.endsWith(".backup") ||
    url.pathname.endsWith(".disabled") ||
    url.pathname.includes("pulse.backup")
  ) {
    return;
  }

  /* Pages HTML : réseau d'abord, cache ensuite, offline en dernier */
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          await cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          const cached = await caches.match(req);
          return cached || caches.match("./offline.html");
        }
      })()
    );
    return;
  }

  /* Assets : cache d'abord, réseau ensuite */
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);

        if (fresh && fresh.ok) {
          await cache.put(req, fresh.clone());
        }

        return fresh;
      } catch (e) {
        return caches.match("./offline.html");
      }
    })()
  );
});
