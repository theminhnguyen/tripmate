// TripMate Service Worker — Offline-Caching + Update-Toast (v0.6.14)
const CACHE = 'tripmate-v0.7.9';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => {})));
  // v0.6.14: KEIN skipWaiting() im install — wir warten auf User-Bestätigung
  // via postMessage. Der Main-Thread erkennt waiting-SW und zeigt Update-Toast.
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

// v0.6.14: User klickt im Update-Toast → Main-Thread sendet SKIP_WAITING → wir aktivieren.
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Don't cache API requests (Nominatim, Overpass, Supabase) — always live
  if (url.hostname.includes('nominatim') || url.hostname.includes('overpass') ||
      url.hostname.includes('tile.openstreetmap.org') ||
      url.hostname.includes('supabase.co') || url.hostname.includes('supabase.in')) {
    return; // network-only
  }
  // Never cache non-GET requests
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
    })
  );
});
