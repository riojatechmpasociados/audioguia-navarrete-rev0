// Nombre del cache
const CACHE_NAME = 'audioguia-cache-v1';

// Archivos que se deben cachear
const urlsToCache = [
    '/',
    '/index.html', // Página principal
    '/success.html', // Página de éxito
    '/assets/audio/audio1.mp3', // Ejemplo de archivo de audio
    '/assets/audio/audio2.mp3', // Ejemplo de archivo de audio
    '/assets/images/image1.jpg', // Ejemplo de imagen
    '/assets/images/image2.jpg'  // Ejemplo de imagen
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos en caché con éxito');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar las solicitudes para devolver los archivos desde la caché
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Si hay una respuesta en caché, devolverla
                    return cachedResponse;
                }
                // Si no, hacer la solicitud normalmente
                return fetch(event.request);
            })
    );
});
