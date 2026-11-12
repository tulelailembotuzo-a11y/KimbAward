const V = 'limbapp-v1';
const SHELL = ['./', 'index.html', 'resultats.html', 'css/style.css', 'js/config.js', 'js/app.js', 'js/results.js', 'manifest.json', 'icons/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  // Jamais de cache pour la base de données, l'administration ou les envois
  if (e.request.method !== 'GET' || u.origin !== location.origin || u.pathname.startsWith('/admin')) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
});
