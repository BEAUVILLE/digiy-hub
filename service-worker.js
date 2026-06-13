/* DIGIY HUB — Service Worker anti-vieille-route
   Objectif :
   - Ne jamais bloquer DIGIY HUB sur un ancien index.html
   - Corriger les modules PRO V2 vers leur nouvelle racine mono-fichier
   - Garder seulement les fichiers sûrs en cache offline
*/

const CACHE_NAME = "digiy-hub-v1.1.3-pro-loc-v2-mono-fichier-root-20260613";

const PRO_EXPLORE_OLD = "https://pro-explore.digiylyfe.com/pin.html";
const PRO_EXPLORE_NEW = "https://pro-explore.digiylyfe.com/";

const PRO_DRIVER_OLD = "https://pro-driver.digiylyfe.com/pin.html";
const PRO_DRIVER_NEW = "https://pro-driver.digiylyfe.com/";

const PRO_MARKET_OLD = "https://pro-market.digiylyfe.com/pin.html";
const PRO_MARKET_NEW = "https://pro-market.digiylyfe.com/";

const PRO_BUILD_OLD = "https://pro-build.digiylyfe.com/pin.html";
const PRO_BUILD_NEW = "https://pro-build.digiylyfe.com/";

const PRO_LOC_OLD = "https://pro-loc.digiylyfe.com/pin.html";
const PRO_LOC_NEW = "https://pro-loc.digiylyfe.com/";

const ASSETS = [
  "./offline.html",
  "./icon-192.png",
  "./icon-512.png"
];

function patchHubHtml(html) {
  return html
    .replaceAll(PRO_EXPLORE_OLD + "?v=hub-pro-explore-20260613", PRO_EXPLORE_NEW)
    .replaceAll(PRO_EXPLORE_OLD + "?v=explore-pin-boost-20260613", PRO_EXPLORE_NEW)
    .replaceAll(PRO_EXPLORE_OLD, PRO_EXPLORE_NEW)
    .replaceAll(PRO_DRIVER_OLD + "?v=hub-pro-driver-20260613", PRO_DRIVER_NEW)
    .replaceAll(PRO_DRIVER_OLD + "?v=driver-pin-boost-20260613", PRO_DRIVER_NEW)
    .replaceAll(PRO_DRIVER_OLD, PRO_DRIVER_NEW)
    .replaceAll(PRO_MARKET_OLD + "?v=hub-pro-market-20260613", PRO_MARKET_NEW)
    .replaceAll(PRO_MARKET_OLD + "?v=market-pin-boost-20260613", PRO_MARKET_NEW)
    .replaceAll(PRO_MARKET_OLD, PRO_MARKET_NEW)
    .replaceAll(PRO_BUILD_OLD + "?v=hub-pro-build-20260613", PRO_BUILD_NEW)
    .replaceAll(PRO_BUILD_OLD + "?v=build-pin-boost-20260613", PRO_BUILD_NEW)
    .replaceAll(PRO_BUILD_OLD, PRO_BUILD_NEW)
    .replaceAll(PRO_LOC_OLD + "?v=hub-pro-loc-20260613", PRO_LOC_NEW)
    .replaceAll(PRO_LOC_OLD + "?v=loc-pin-boost-20260613", PRO_LOC_NEW)
    .replaceAll(PRO_LOC_OLD, PRO_LOC_NEW);
}

function htmlResponse(body, originalResponse) {
  const headers = new Headers(originalResponse.headers);
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("x-digiy-pro-routes", "v2-mono-fichier-root-loc-20260613");
  return new Response(body, {
    status: originalResponse.status,
    statusText: originalResponse.statusText,
    headers
  });
}

/* Installation : cache léger, sans index.html */
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
            console.warn("[DIGIY HUB SW] asset non caché:", asset, e);
          }
        })
      );

      await self.skipWaiting();
    })()
  );
});

/* Activation : supprime toutes les anciennes versions cache */
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

  /* Pages HTML : réseau frais + correction routes PRO V2 mono-fichier */
  if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/") {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);

        try {
          const fresh = await fetch(req, { cache: "reload" });
          const contentType = fresh.headers.get("content-type") || "";

          if (contentType.includes("text/html")) {
            const patchedHtml = patchHubHtml(await fresh.clone().text());
            const patched = htmlResponse(patchedHtml, fresh);
            await cache.put(req, patched.clone());
            return patched;
          }

          await cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          const cached = await caches.match(req);
          if (cached) {
            const contentType = cached.headers.get("content-type") || "";
            if (contentType.includes("text/html")) {
              const patchedHtml = patchHubHtml(await cached.clone().text());
              return htmlResponse(patchedHtml, cached);
            }
            return cached;
          }
          return caches.match("./offline.html");
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
