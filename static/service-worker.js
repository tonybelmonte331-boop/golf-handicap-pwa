const CACHE_NAME = 'golf-handicap-cache-v1';
const urlsToCache = [
  '/golf-handicap-pwa/',
  '/golf-handicap-pwa/index.html',
  '/golf-handicap-pwa/static/style.css',
  '/golf-handicap-pwa/static/app.js',
  '/golf-handicap-pwa/static/icon.png',
  '/golf-handicap-pwa/static/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
