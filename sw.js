// Bryst — service worker til offline-brug (PWA).
// Cacher kun selve app-skallen (statiske filer). Ingen patientdata gemmes nogensinde —
// værktøjet er 100% stateless, og det ændrer denne service worker ikke ved.
const CACHE_VERSION = 'bryst-v7';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './assets/forside-kontur.jpg',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', function(event){
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache){ return cache.addAll(APP_SHELL); })
  );
});

self.addEventListener('activate', function(event){
  event.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.filter(function(k){ return k !== CACHE_VERSION; }).map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event){
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(function(cached){
      var network = fetch(event.request).then(function(response){
        if (response && response.ok){
          var copy = response.clone();
          caches.open(CACHE_VERSION).then(function(cache){ cache.put(event.request, copy); });
        }
        return response;
      }).catch(function(){ return cached; });
      return cached || network;
    })
  );
});
