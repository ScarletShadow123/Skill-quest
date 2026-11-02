// Skill Quest service worker (generated at build time by vite.config.js).
// Precaches the whole app — every subject — so it works offline after the first visit.
const VERSION = '3f8d20f24996';
const PRECACHE = ["./","./assets/index-DsM3zjMs.css","./assets/subject-english-BPB3_pTp.js","./assets/subject-history-DPoodqz4.js","./assets/subject-math-U5PK-vnR.js","./assets/subject-science-CaFlGQlr.js","./assets/index-CoS7Qfi9.js","./assets/questions-D0c6xez4.js","./manifest.webmanifest","./icon.svg","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./apple-touch-icon.png"];
const CACHE = `skill-quest-${VERSION}`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('skill-quest-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Pages: network first (to pick up new versions), cached copy when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./', copy));
          return res;
        })
        .catch(() => caches.match('./', { ignoreSearch: true })),
    );
    return;
  }
  // Everything else (hashed assets, icons, fonts): cache first, then network.
  const sameOrigin = url.origin === self.location.origin;
  const font = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
  if (!sameOrigin && !font) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: sameOrigin }).then(
      (hit) =>
        hit ??
        fetch(req).then((res) => {
          if (res.ok || res.type === 'opaque') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
