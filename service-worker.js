/* DIGIY HUB — Service Worker de transition 2026-08-05
   Mission unique :
   - supprimer les anciens caches du HUB ;
   - arrêter toute réécriture historique des routes PRO ;
   - se désinscrire après nettoyage.

   Le routage officiel reste écrit directement dans les fichiers du HUB.
*/

const CLEANUP_VERSION = 'digiy-hub-cleanup-20260805';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
    await self.clients.claim();
    await self.registration.unregister();

    const clients = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    clients.forEach((client) => {
      client.postMessage({
        type: CLEANUP_VERSION,
        cleaned: true
      });
    });
  })());
});

/* Aucune interception réseau : les routes du dépôt restent la source de vérité. */
self.addEventListener('fetch', () => {});
