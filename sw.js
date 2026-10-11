/* AUT-05 V6.2 · service worker de l'application « Commandes du soir »
   Rôle : garder la page et les icônes dans le téléphone pour que l'application s'ouvre SANS internet.
   Il ne touche jamais aux commandes : elles sont dans le stockage de l'application (localStorage + IndexedDB), pas dans ce cache.
   Les liens WhatsApp (wa.me), GitHub (api.github.com) et tout ce qui vient d'un autre site ne sont jamais interceptés.
   Mise à jour : à chaque ouverture, le téléphone vérifie ce fichier ; s'il a changé (VERSION), la nouvelle version est téléchargée en
   arrière-plan, puis l'application affiche « Une nouvelle version est prête » avec un bouton « Actualiser ».
   Pour publier une mise à jour : changer VERSION ci-dessous. */
var VERSION = "atelier-commandes-v6-3";
var FICHIERS = ["./", "index.html", "relais-github.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "wave/carte-wave.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(FICHIERS.map(function (u) { return new Request(u, { cache: "reload" }); }));   // toujours la version du serveur, jamais une copie ancienne
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (cles) {   // seulement les anciens caches de cette application : ceux de l'écran cuisine ne sont pas touchés
    return Promise.all(cles.filter(function (k) { return k.indexOf("atelier-commandes-") === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
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
