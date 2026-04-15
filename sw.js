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
  
  // Only cache static images and Supabase storage assets (user-uploaded photos)
  // We explicitly avoid caching Supabase REST API requests (/rest/v1/) to keep data fresh
  const isSupabaseStorage = url.hostname.includes('supabase.co') && url.pathname.includes('/storage/v1/object/');
  const isStaticImage = IMAGE_TYPES.some(type => url.pathname.toLowerCase().endsWith(type));

  if (event.request.method === 'GET' && (isSupabaseStorage || isStaticImage)) {
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
