/* RSAT Reviewer - offline service worker (app shell cache) */
var CACHE='rsat-v25';
var ASSETS=['./','./index.html','./manifest.webmanifest','./mathjax/tex-svg.js','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS.map(function(u){return new Request(u,{cache:'reload'});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){
  // Delete only THIS app's own old caches. CacheStorage is shared by every app on
  // the origin, not scoped to this worker's path, so on mcenriquez1996.github.io a
  // bare k!==CACHE sweep also deleted the ARAL Math Practice cache (and its sweep
  // deleted this one). Neither app re-runs install afterwards, because install only
  // fires when sw.js itself changes, so the victim was left with no offline copy
  // until it was next opened online. Both apps target the same Grade 10 learners.
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE && k.indexOf('rsat-')===0)return caches.delete(k);}));}).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(function(r){
    // Only store successful replies. GitHub Pages serves 404s and 503s while a
    // deploy is in flight, and caching one pinned the error permanently: the next
    // request was served from cache and never retried.
    return r||fetch(e.request).then(function(resp){
      if(resp && resp.ok && resp.type!=='opaque'){var copy=resp.clone();caches.open(CACHE).then(function(c){try{c.put(e.request,copy);}catch(err){}});}
      return resp;
    }).catch(function(){return caches.match('./index.html');});
  }));
});
