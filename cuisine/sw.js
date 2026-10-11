/* AUT-11 V1.1 · service worker de l'écran cuisine
   Rôle : rendre l'écran installable (Android) et l'ouvrir vite. La page est toujours demandée au serveur d'abord
   (réseau d'abord, copie gardée en secours). Les appels à GitHub (api.github.com, autre site) ne sont jamais interceptés :
   les commandes affichées viennent toujours de GitHub, jamais de ce cache.
   Pour publier une mise à jour : changer VERSION ci-dessous. */
var VERSION = "atelier-cuisine-v1-2";
var FICHIERS = ["./", "index.html", "manifest.webmanifest", "../relais-github.js", "../icons/icon-192.png", "../icons/icon-512.png", "../icons/icon-maskable-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(FICHIERS.map(function (u) { return new Request(u, { cache: "reload" }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.filter(function (k) { return k.indexOf("atelier-cuisine-") === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(function (rep) {
    if (rep && rep.ok) { var copie = rep.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copie); }); }
    return rep;
  }).catch(function () { return caches.match(e.request, { ignoreSearch: true }); }));
});
