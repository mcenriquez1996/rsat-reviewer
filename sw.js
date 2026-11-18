/* RSAT Reviewer - offline service worker (app shell cache) */
var CACHE='rsat-v30';
var ASSETS=['./','./index.html','./manifest.webmanifest','./mathjax/tex-svg.js','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS.map(function(u){return new Request(u,{cache:'reload'});}));}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.map(function(k){if(k!==CACHE && k.indexOf('rsat-')===0)return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(function(r){return r||fetch(e.request).then(function(resp){if(resp && resp.ok && resp.type!=='opaque'){var copy=resp.clone();caches.open(CACHE).then(function(c){try{c.put(e.request,copy);}catch(err){}});}return resp;}).catch(function(){return caches.match('./index.html');});}));});
