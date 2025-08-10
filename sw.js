// Service Worker for Chrome cache busting
const CACHE_NAME = 'jptravel-cache-v1';

self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  // For Chrome, always bypass cache for critical files
  if (event.request.url.includes('itinerary.json') || 
      event.request.url.includes('map.js') || 
      event.request.url.includes('index.html')) {
    
    console.log('Chrome: Bypassing cache for:', event.request.url);
    
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }).catch(function(error) {
        console.log('Chrome: Fetch failed, trying cache:', error);
        return caches.match(event.request);
      })
    );
  } else {
    // For other resources, use network first strategy
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request);
      })
    );
  }
});

// Clear all caches periodically
setInterval(function() {
  caches.keys().then(function(cacheNames) {
    cacheNames.forEach(function(cacheName) {
      caches.delete(cacheName);
    });
  });
}, 60000); // Clear every minute
