const CACHE_NAME = 'my-cache-v1';
const urlsToCache = ['/', '/offline.html', '/list'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http')) return; //只缓存http请求

  //tip: 如果需要，可以进一步区分api和静态资源，分别处理
  // 目前统一逻辑，缓存优先+网络更新
  // 只缓存GET，因为其他请求时修改服务器数据的请求，比较危险，可能会导致逻辑错误或重复提交

  event.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, responseClone))
        console.log('SW: Fetched & updated cache', req.url);
        return response;
      }).catch(() => {
        console.log('SW: Network failed for', req.url);
      })
      if (cached) {
        console.log('SW: Serving from cache', req.url);
        return cached; //先返回缓存，同时后台更新
      }else{
        console.log('SW: Fetching & caching', req.url);
        return fetchPromise || caches.match('/offline.html'); //如果fetch失败，则返回offline.html
      }
    })
  )

  //方式2，优先网络更新，缓存作为备选
  // event.respondWith(
  //   fetch(event.request).catch(() =>
  //     caches.match(event.request).then((resp) => resp || caches.match('/offline.html'))
  //   )
  // );
});
