const STATIC_CACHE = 'qazi-static-v2';
const MEDIA_CACHE = 'qazi-media-v2';
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/awards.html',
    '/styles.css',
    '/script.js',
    '/lib/service-worker-registration.js',
    '/mina.glb'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => cache.addAll(CORE_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys
                .filter((key) => key !== STATIC_CACHE && key !== MEDIA_CACHE)
                .map((key) => caches.delete(key))
        );
        await self.clients.claim();
    })());
});

async function networkFirst(request) {
    const cache = await caches.open(STATIC_CACHE);
    try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch {
        return cache.match(request);
    }
}

async function cacheFirst(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    if (cached) {
        return cached;
    }
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(MEDIA_CACHE);
    const cached = await cache.match(request);
    const networkPromise = fetch(request)
        .then((response) => {
            cache.put(request, response.clone());
            return response;
        })
        .catch(() => null);

    return cached || networkPromise;
}

self.addEventListener('fetch', (event) => {
    const { request } = event;
    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    const destination = request.destination;
    if (destination === 'image' || destination === 'video' || destination === 'audio') {
        event.respondWith(staleWhileRevalidate(request));
        return;
    }

    if (destination === 'script' || destination === 'style' || destination === 'font' || url.pathname.endsWith('.glb')) {
        event.respondWith(cacheFirst(request));
    }
});
