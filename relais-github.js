/* AUT-10 V1 · relais-github.js — lecture et écriture d'un fichier JSON dans un dépôt GitHub PRIVÉ (D-082)
   Utilisé par l'application « Commandes du soir » (index.html) et par l'écran cuisine (cuisine/index.html).
   - La clé d'accès n'est JAMAIS écrite dans ce fichier : elle est saisie sur le téléphone et passée à client().
   - Écriture vérifiée : GitHub renvoie l'empreinte (sha) du fichier enregistré ; on la recalcule ici à partir du texte
     envoyé. Les deux doivent être identiques pour que l'écriture soit déclarée réussie (verifie: true).
   - Lecture sans cache du navigateur (GitHub demande 60 s de cache) ; « If-None-Match » permet une vérification gratuite
     (réponse 304, non décomptée de la limite de 5 000 requêtes par heure).
   Erreurs : objet { code, statut, message } avec code = reseau | cle | depot | conflit | limite | autre. */
var RelaisGitHub = (function () {
  "use strict";
  var API = "https://api.github.com", DELAI_MAX = 15000;

  function octets(texte) { return new TextEncoder().encode(texte); }
  function versBase64(texte) {
    var b = octets(texte), s = "";
    for (var i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function depuisBase64(b64) {
    var s = atob(String(b64).replace(/\s/g, "")), b = new Uint8Array(s.length);
    for (var i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return new TextDecoder().decode(b);
  }
  function shaBlob(texte) {   // empreinte git d'un fichier : SHA-1 de « blob <taille>\0<contenu> »
    var corps = octets(texte), tete = octets("blob " + corps.length + "\0"), tout = new Uint8Array(tete.length + corps.length);
    tout.set(tete); tout.set(corps, tete.length);
    return crypto.subtle.digest("SHA-1", tout).then(function (h) {
      return Array.prototype.map.call(new Uint8Array(h), function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    });
  }
  function erreur(code, statut, message) { return { code: code, statut: statut || 0, message: message }; }
  function erreurHttp(rep) {
    var s = rep.status;
    if (s === 401) return erreur("cle", s, "Clé refusée par GitHub (expirée, retirée ou mal copiée).");
    if (s === 403 || s === 429) {
      if (rep.headers.get("x-ratelimit-remaining") === "0") return erreur("limite", s, "Trop de demandes à GitHub : nouvel essai dans quelques minutes.");
      return erreur("cle", s, "Cette clé n’a pas le droit d’écrire dans le dépôt (permission « Contents : Read and write » à cocher).");
    }
    if (s === 404) return erreur("depot", s, "Dépôt introuvable avec cette clé (la clé doit donner accès au dépôt « atelier-cuisine »).");
    if (s === 409 || s === 422) return erreur("conflit", s, "Le fichier a changé entre-temps.");
    return erreur("autre", s, "GitHub a répondu une erreur " + s + ".");
  }

  function client(o) {   // o = { proprietaire, depot, cle }
    var base = API + "/repos/" + encodeURIComponent(o.proprietaire) + "/" + encodeURIComponent(o.depot);
    function appel(methode, chemin, corps, entetes) {
      var h = { "Authorization": "Bearer " + o.cle, "Accept": "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
      if (corps) h["Content-Type"] = "application/json";
      for (var k in (entetes || {})) h[k] = entetes[k];
      // délai maximal : sur un réseau mobile instable, une demande peut rester bloquée sans jamais répondre
      var arret = window.AbortController ? new AbortController() : null, minuterie = arret ? setTimeout(function () { arret.abort(); }, DELAI_MAX) : null;
      return fetch(base + chemin, { method: methode, headers: h, body: corps ? JSON.stringify(corps) : undefined, cache: "no-store", signal: arret ? arret.signal : undefined })
        .then(function (rep) { clearTimeout(minuterie); return rep; },
              function () { clearTimeout(minuterie); throw erreur("reseau", 0, "Pas de connexion internet (ou réseau trop lent)."); });
    }
    function cheminFichier(chemin) { return "/contents/" + chemin.split("/").map(encodeURIComponent).join("/"); }

    return {
      tester: function () {   // le dépôt est-il accessible avec cette clé ? (ne dit rien sur le droit d'écrire)
        return appel("GET", "").then(function (rep) { if (!rep.ok) throw erreurHttp(rep); return rep.json(); });
      },
      lire: function (chemin, etag) {   // -> { statut: 200 | 304 | 404, texte, sha, etag }
        return appel("GET", cheminFichier(chemin), null, etag ? { "If-None-Match": etag } : null).then(function (rep) {
          if (rep.status === 304) return { statut: 304, etag: etag };
          if (rep.status === 404) return { statut: 404, texte: null, sha: null, etag: null };
          if (!rep.ok) throw erreurHttp(rep);
          return rep.json().then(function (j) { return { statut: 200, texte: depuisBase64(j.content), sha: j.sha, etag: rep.headers.get("etag") }; });
        });
      },
      ecrire: function (chemin, texte, sha, message) {   // -> { sha, verifie, commit } ; sha = null pour créer le fichier
        var corps = { message: message, content: versBase64(texte) };
        if (sha) corps.sha = sha;
        return appel("PUT", cheminFichier(chemin), corps).then(function (rep) {
          if (!rep.ok) throw erreurHttp(rep);
          return Promise.all([rep.json(), shaBlob(texte)]).then(function (r) {
            var distant = r[0] && r[0].content && r[0].content.sha;
            return { sha: distant, verifie: distant === r[1], commit: r[0] && r[0].commit && r[0].commit.sha };
          });
        });
      }
    };
  }
  return { client: client, shaBlob: shaBlob };
})();
