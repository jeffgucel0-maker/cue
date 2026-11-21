// CUE: opens instantly and works with no signal. Network first for its own files, the saved copy when offline.
// Never touches api.github.com (sync) — those calls always go straight to the network.
const CACHE='cue-20261121144446';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png','data.enc.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url), own=u.origin===location.origin, font=/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if(!own&&!font)return;
  e.respondWith((own?fetch(e.request.url,{cache:'no-cache'}):fetch(e.request)).then(r=>{
    if(r&&(r.ok||r.type==='opaque')){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return r;
  }).catch(()=>caches.match(e.request,{ignoreSearch:true})));
});
