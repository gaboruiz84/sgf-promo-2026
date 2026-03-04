// === CAMBIA ESTE NÚMERO CADA VEZ QUE HAGAS UNA ACTUALIZACIÓN (ej. v2, v3, v4...) ===
const CACHE_NAME = 'sgf-promo-v15'; 

const urlsToCache = [
  './',
  './login.html',
  './index.html',
  './manifest.json'
];

// 1. Instalar el Service Worker y guardar archivos
self.addEventListener('install', event => {
  self.skipWaiting(); // Obliga a la app a actualizarse sin tener que cerrarla
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activar y ELIMINAR CACHÉS ANTIGUOS (Esto es lo que te faltaba)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si el nombre de la caché no es el actual (ej. si es v1 y ahora estamos en v2)
          if (cacheName !== CACHE_NAME) {
            console.log('Borrando versión antigua de la App:', cacheName);
            return caches.delete(cacheName); // Borra lo viejo
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma control inmediato de la pantalla
  );
});

// 3. Interceptar peticiones (modo offline)
self.addEventListener('fetch', event => {
  // Ignorar las peticiones a Google Apps Script para que los datos financieros siempre estén frescos
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
