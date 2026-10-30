// Service Worker for Samarth Watch (App Shell Cache Only)
// NOTE: Explicitly does NOT cache health vitals, voice notes, or senior observations.

const CACHE_NAME = 'samarth-shell-v1';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests for navigation and app shell assets
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  // Never cache API or dynamic data routes
  if (url.pathname.includes('/api/') || url.pathname.includes('/ingest/')) {
    return;
  }

  // Network-first for html/data, cache-fallback for shell assets
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
