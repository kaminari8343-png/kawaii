// オフラインでも遊べるようにするService Worker。
// ファイルを変えたら CACHE のバージョンを上げると、次の起動で新しい版に入れ替わる。
const CACHE = 'kawaii-v1';
const ASSETS = [
  './', './index.html', './manifest.webmanifest',
  './icons/icon.svg', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// キャッシュがあればすぐ返し、ネットワークがあれば裏で更新する（なければキャッシュのまま）
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const hit = await cache.match(req, { ignoreSearch: true });
      const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
      if (hit) return hit;
      return (await net) || (req.mode === 'navigate' ? cache.match('./index.html') : Response.error());
    })
  );
});
