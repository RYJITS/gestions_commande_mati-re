# Commande Matiere - application web

Application locale creee a partir de l'analyse structurelle de `COMMANDE_MATIERE.xlsm`.

## Ouvrir

Ouvrir directement `index.html` dans un navigateur moderne.

L'application est autonome:

- aucune dependance a installer;
- donnees generees au premier chargement;
- modifications conservees dans `localStorage`.

## Modules

- Tableau de bord: indicateurs, flux mensuel, repartition par statut, alertes planif.
- Commande matiere: formulaire simple avec 3 champs blancs, auto-remplissage, email et ajout archive.
- Archives: table filtree, triee, paginee, selection multiple, edition et actions SAP simulees.
- Referentiels: listes SPC, options, MET, CW724R, seuils manco et articles de verification.

## Donnees

Le classeur source a ete analyse pour reproduire la structure, les volumes et la logique.
Les valeurs metier du fichier Excel ne sont pas reutilisees. Le jeu de donnees est genere
par code avec les volumes equivalents, notamment 1525 lignes d'archives initiales.

## Verification

Tests effectues avec Playwright:

- chargement sans erreur console;
- ouverture directe sur l'onglet Commande;
- saisie machine, nombre OF et type MET/PROD;
- auto-remplissage des champs gris;
- envoi email avec ajout d'une ligne archive;
- actions Archives avec GO global, champs OF, cases DISPO et fenetre SAP;
- captures desktop et mobile.
