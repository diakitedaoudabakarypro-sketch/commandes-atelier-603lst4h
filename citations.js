/* AUT-15 V1 · citations.js — citations du jour sur la détermination, la discipline et la persévérance (D-100)
   Utilisé par l'onglet Objectifs de l'application (index.html), par l'écran cuisine (cuisine/index.html, « Nos congés »)
   et par la fiche à imprimer (13_AUTOMATISATION/generer_fiche_objectifs.py) : une seule liste pour les trois.
   Règle : seulement des citations dont l'auteur est établi (œuvre ou source connue) ; les attributions douteuses qui circulent
   (Churchill « d'échec en échec », Mandela « tout semble impossible », Twain « ils ne savaient pas que c'était impossible »,
   Saint-Exupéry « un objectif sans plan »…) sont volontairement écartées. Traductions françaises courantes.
   « r » = rattrapage : citations montrées les soirs difficiles ou quand on pense ne pas vendre. */
window.CITATIONS = [
  { t: "Un voyage de mille lieues commence toujours par un premier pas.", a: "Lao-tseu, Tao-tö-king" },
  { t: "Ce n’est pas parce que les choses sont difficiles que nous n’osons pas, c’est parce que nous n’osons pas qu’elles sont difficiles.", a: "Sénèque, Lettres à Lucilius" },
  { t: "La discipline est le pont entre les objectifs et leur accomplissement.", a: "Jim Rohn" },
  { t: "Les petits ruisseaux font les grandes rivières.", a: "Proverbe" },
  { t: "Patience et longueur de temps font plus que force ni que rage.", a: "Jean de La Fontaine, Le Lion et le Rat" },
  { t: "Nous devons tous souffrir de l’une de ces deux douleurs : la douleur de la discipline ou la douleur du regret.", a: "Jim Rohn", r: 1 },
  { t: "Il n’y a pas de vent favorable pour celui qui ne sait pas où il va.", a: "Sénèque, Lettres à Lucilius" },
  { t: "Rien ne sert de courir ; il faut partir à point.", a: "Jean de La Fontaine, Le Lièvre et la Tortue" },
  { t: "La motivation vous fait démarrer. L’habitude vous fait continuer.", a: "Jim Rohn" },
  { t: "Nous sommes ce que nous faisons chaque jour. L’excellence n’est donc pas un acte, mais une habitude.", a: "Will Durant, d’après Aristote" },
  { t: "Vingt fois sur le métier remettez votre ouvrage.", a: "Nicolas Boileau, L’Art poétique", r: 1 },
  { t: "Si tu veux aller vite, marche seul ; si tu veux aller loin, marchons ensemble.", a: "Proverbe africain" },
  { t: "Le génie est fait d’un pour cent d’inspiration et de quatre-vingt-dix-neuf pour cent de transpiration.", a: "Thomas Edison" },
  { t: "Celui qui a un « pourquoi » qui lui tient lieu de but peut vivre avec n’importe quel « comment ».", a: "Friedrich Nietzsche, Crépuscule des idoles" },
  { t: "J’ai échoué encore et encore et encore dans ma vie. Et c’est pour cela que je réussis.", a: "Michael Jordan", r: 1 },
  { t: "Petit à petit, l’oiseau fait son nid.", a: "Proverbe" },
  { t: "À vaincre sans péril, on triomphe sans gloire.", a: "Pierre Corneille, Le Cid" },
  { t: "Le talent fait gagner des matchs, mais le travail d’équipe et l’intelligence font gagner des championnats.", a: "Michael Jordan" },
  { t: "La victoire appartient au plus persévérant.", a: "Napoléon Bonaparte", r: 1 },
  { t: "Le travail éloigne de nous trois grands maux : l’ennui, le vice et le besoin.", a: "Voltaire, Candide" },
  { t: "Gagner n’est pas tout, mais vouloir gagner, si.", a: "Vince Lombardi", r: 1 },
  { t: "Aide-toi, le ciel t’aidera.", a: "Jean de La Fontaine, Le Chartier embourbé", r: 1 },
  { t: "Le génie n’est qu’une plus grande aptitude à la patience.", a: "Buffon" },
  { t: "Le temps, c’est de l’argent.", a: "Benjamin Franklin", r: 1 },
  { t: "Ce n’est pas la montagne que nous conquérons, mais nous-mêmes.", a: "Edmund Hillary" },
  { t: "J’ai détesté chaque minute d’entraînement, mais je me disais : n’abandonne pas, souffre maintenant et vis le reste de ta vie en champion.", a: "Muhammad Ali", r: 1 },
  { t: "C’est en forgeant qu’on devient forgeron.", a: "Proverbe" },
  { t: "Ce qui ne me tue pas me rend plus fort.", a: "Friedrich Nietzsche, Crépuscule des idoles", r: 1 },
  { t: "Le plus grand plaisir dans la vie est de réaliser ce que les autres vous croient incapable de réaliser.", a: "Walter Bagehot" },
  { t: "Rome ne s’est pas faite en un jour.", a: "Proverbe" },
  { t: "Le prix du succès, c’est le travail acharné et le dévouement à la tâche, que l’on gagne ou que l’on perde.", a: "Vince Lombardi", r: 1 },
  { t: "Rien de grand ne s’est accompli dans le monde sans passion.", a: "Hegel, La Raison dans l’histoire" },
  { t: "Il faut cultiver notre jardin.", a: "Voltaire, Candide" },
  { t: "Impossible n’est pas français.", a: "Napoléon Bonaparte", r: 1 },
  { t: "Qui veut aller loin ménage sa monture.", a: "Jean Racine, Les Plaideurs" },
  { t: "La persévérance rend l’impossible possible, le possible probable et le probable certain.", a: "Robert Half", r: 1 },
  { t: "Hâtez-vous lentement, et sans perdre courage.", a: "Nicolas Boileau, L’Art poétique", r: 1 },
  { t: "Bien commencer, c’est déjà la moitié du travail.", a: "Proverbe grec cité par Aristote" },
  { t: "Le succès est la somme de petits efforts, répétés jour après jour.", a: "Robert Collier", r: 1 }
];
