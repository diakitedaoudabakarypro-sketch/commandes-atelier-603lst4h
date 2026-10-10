/* AUT-05 V4 · service worker de l'application « Commandes du soir »
   Rôle : garder la page et les icônes dans le téléphone pour que l'application s'ouvre SANS internet.
   Il ne touche jamais aux commandes : elles sont dans le stockage de l'application (localStorage + IndexedDB), pas dans ce cache.
   Les liens WhatsApp (wa.me) et tout ce qui vient d'un autre site ne sont jamais interceptés.
   Mise à jour : à chaque ouverture, la page est affichée tout de suite depuis le cache puis rafraîchie en arrière-plan ;
   la nouvelle version s'affiche à l'ouverture suivante. Pour forcer une mise à jour, changer VERSION ci-dessous. */
var VERSION = "atelier-commandes-v4-1";
var FICHIERS = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FICHIERS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (cles) {
    return Promise.all(cles.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (cache) {
    var reseau = fetch(e.request).then(function (rep) {
      if (rep && rep.ok) { var copie = rep.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copie); }); }
      return rep;
    }).catch(function () { return cache; });
    return cache || reseau;
  }));
});
