/* AUT-05 V6.8 · service worker de l'application « Commandes du soir »
   Rôle : garder la page et les icônes dans le téléphone pour que l'application s'ouvre SANS internet.
   Il ne touche jamais aux commandes : elles sont dans le stockage de l'application (localStorage + IndexedDB), pas dans ce cache.
   Les liens WhatsApp (wa.me), GitHub (api.github.com) et tout ce qui vient d'un autre site ne sont jamais interceptés.
   Mise à jour : à chaque ouverture, le téléphone vérifie ce fichier ; s'il a changé (VERSION), la nouvelle version est téléchargée en
   arrière-plan, puis l'application affiche « Une nouvelle version est prête » avec un bouton « Actualiser ».
   Pour publier une mise à jour : changer VERSION ci-dessous. */
var VERSION = "atelier-commandes-v6-9";
var FICHIERS = ["./", "index.html", "relais-github.js", "messages-envois.js", "affiches.js", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "wave/carte-wave.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(FICHIERS.map(function (u) { return new Request(u, { cache: "reload" }); }));   // toujours la version du serveur, jamais une copie ancienne
  }).then(function () { return self.skipWaiting(); }));
});

/* Affiches (V6.6) : cache à part, « atelier-affiches-v1 », gardé d'une version à l'autre (les images ne sont pas retéléchargées à chaque mise à jour).
   Le nom de chaque image contient son empreinte : une affiche refaite a un nouveau nom. À l'activation, les images qui ne sont plus dans affiches.js sont retirées. */
var CACHE_AFFICHES = "atelier-affiches-v1";
try { importScripts("affiches.js"); } catch (e) {}

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.open(CACHE_AFFICHES).then(function (c) {
    var liste = self.AFFICHES || [], garder = {}; if (!liste.length) return;   // liste illisible : on ne retire rien
    liste.forEach(function (a) { garder[a.img] = garder[a.mini] = 1; });
    var rel = function (u) { var p = new URL(u).pathname; return p.slice(p.lastIndexOf("/affiches/") + 1); };   // « affiches/… » comme dans affiches.js
    return c.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return !garder[rel(k.url)]; }).map(function (k) { return c.delete(k); })); });
  }).catch(function () {}));
  e.waitUntil(caches.keys().then(function (cles) {   // seulement les anciens caches de cette application : ceux de l'écran cuisine ne sont pas touchés
    return Promise.all(cles.filter(function (k) { return k.indexOf("atelier-commandes-") === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.indexOf("/affiches/") >= 0) {   // affiche : copie du téléphone d'abord, sinon réseau (et on la garde)
    e.respondWith(caches.open(CACHE_AFFICHES).then(function (c) {
      return c.match(e.request, { ignoreSearch: true }).then(function (r) {
        return r || fetch(e.request).then(function (rep) { if (rep && rep.ok) c.put(e.request, rep.clone()); return rep; });
      });
    }));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (cache) {
    var reseau = fetch(e.request).then(function (rep) {
      if (rep && rep.ok) { var copie = rep.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copie); }); }
      return rep;
    }).catch(function () { return cache; });
    return cache || reseau;
  }));
});
