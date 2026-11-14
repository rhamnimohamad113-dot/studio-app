// ورِ دل — کار آفلاین. با هر نسخه‌ی تازه، عدد V رو عوض کن.
const V = 'vardel-4';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('vardel-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin === location.origin && !u.pathname.startsWith(new URL('./', self.registration.scope).pathname)) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(x => { const c = x.clone(); caches.open(V).then(k => k.put('./', c)); return x; }).catch(() => caches.match('./').then(x => x || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(r).then(h => h || fetch(r).then(x => { if (x && (x.ok || x.type === 'opaque')) { const c = x.clone(); caches.open(V).then(k => k.put(r, c)); } return x; })));
});
