/* Stale-while-revalidate: serve from cache instantly, refresh in background.
   Everything fetched (shell + data) gets cached, so the app works offline
   for anything visited at least once; the shell is precached on install. */
var CACHE = 'cissp-study-v9';
var SHELL = [
  './',
  'index.html',
  'css/style.css?v=9',
  'js/md.js?v=9',
  'js/app.js?v=9',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'data/index.json'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // The page itself is network-first so a fresh index.html (with versioned
  // asset URLs) is picked up in one visit; everything else stays
  // stale-while-revalidate. Versioned assets keep html/js in lockstep.
  var isPage = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(url.pathname);

  e.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(e.request).then(function (cached) {
        var fetched = fetch(e.request).then(function (resp) {
          if (resp && resp.ok) cache.put(e.request, resp.clone());
          return resp;
        }).catch(function () { return cached; });
        return isPage ? fetched.then(function (r) { return r || cached; }) : (cached || fetched);
      });
    })
  );
});
