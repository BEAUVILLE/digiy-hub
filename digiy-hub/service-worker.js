/* ==========================================
   DIGIY HUB — SERVICE WORKER (OFFICIEL)
   ✅ GitHub Pages SAFE
   ✅ Offline fallback
   ✅ Cache runtime intelligent
   ✅ Versionnable proprement
========================================== */

const VERSION = "v1.0.0";
const CACHE_NAME = `digiy-hub-cache-${VERSION}`;
const RUNTIME_CACHE = `digiy-hub-runtime-${VERSION}`;

/* ✅ Fichiers essentiels à garder offline */
const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./offline.html",
  "./icon-192.png",
  "./icon-512.png"
];

/* ===========================
   INSTALL — Precache
=========================== */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("✅ DIGIY SW installing...");
      await Promise.allSettled(
        PRECACHE_URLS.map((url) => cache.add(url))
      );
    })
  );

  self.skipWaiting();
});

/* ===========================
   ACTIVATE — Clean old caches
=========================== */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((n) => ![CACHE_NAME, RUNTIME_CACHE].includes(n))
          .map((n) => caches.delete(n))
      )
    )
  );

  self.clients.claim();
});

/* ===========================
   FETCH — Network First + Offline
=========================== */
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  /* ✅ Ignore external domains */
  if (url.origin !== self.location.origin) return;

  /* ✅ Navigation pages: Network → Offline fallback */
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match("./offline.html")
      )
    );
    return;
  }

  /* ✅ Assets: Cache First, then Network */
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((res) => {
          if (!res || res.status !== 200) return res;

          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((cache) =>
            cache.put(event.request, copy)
          );

          return res;
        })
        .catch(() => new Response("Offline", { status: 503 }));
    })
  );
});

console.log("✅ DIGIY HUB SW READY ♾️🦅🔥");
