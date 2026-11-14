// استودیوی مشاور — کارِ آفلاین. با هر نسخه‌ی تازه، عددِ V را عوض کن.
const V = 'studio-8.4';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('studio-') && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  if (new URL(r.url).pathname.includes('/var-e-del/')) return; // اپِ «ورِ دل» سرویس‌ورکر خودش رو داره
  const page = r.mode === 'navigate';
  // صفحه: اول شبکه (تا نسخه‌ی تازه بیاید)، اگر نت نبود از حافظه. بقیه: اول حافظه.
  e.respondWith(page
    ? fetch(r).then(x => { const c = x.clone(); caches.open(V).then(k => k.put('./', c)); return x; }).catch(() => caches.match('./').then(x => x || caches.match('index.html')))
    : caches.match(r).then(h => h || fetch(r).then(x => { if (x && (x.ok || x.type === 'opaque')) { const c = x.clone(); caches.open(V).then(k => k.put(r, c)); } return x; })));
});
