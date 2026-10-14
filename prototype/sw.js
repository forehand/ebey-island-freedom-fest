// Caches the prototype so it opens without signal once loaded.
const CACHE = 'pitchin-v5';
const FILES = ['./', 'index.html', 'app.css', 'app.js', 'manifest.webmanifest', 'assets/logo.svg', 'assets/host.webp', 'assets/band.webp',
  'assets/lilita-one.woff2', 'assets/atkinson-400.woff2', 'assets/atkinson-400i.woff2', 'assets/atkinson-700.woff2', 'assets/icon-192.png', 'assets/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', (e) => { e.respondWith(fetch(e.request).then((r) => { const c = r.clone(); caches.open(CACHE).then((x) => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request))); });
