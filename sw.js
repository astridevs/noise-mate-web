const CACHE_NAME = 'noise-mate-image-cache-v1';
const IMAGE_TYPES = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isImage = IMAGE_TYPES.some(type => url.pathname.toLowerCase().endsWith(type)) || 
                  url.hostname.includes('supabase.co');

  if (event.request.method === 'GET' && isImage) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
  }
});
