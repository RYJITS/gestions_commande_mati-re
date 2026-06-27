# Gestions Commande Matiere

## Rapport complet

Ce depot public presente le concept, les fonctions, les choix de conception, les outils utilises, les commandes locales et les captures d'ecran de l'application. Il est genere par l'orchestrateur uniquement apres validation de publication publique.

## Concept

Outil de suivi des commandes matiere. Il organise les besoins, les quantites, les etats de stock et les flux de commande autour d'un classeur metier.

Rendre les commandes matiere plus lisibles, controlables et synchronisables avec le hub sans exposer les donnees sensibles du fichier source.

Public vise: Usage operationnel interne: suivi matiere, commandes, quantites, priorites et preparation d'une interface metier plus propre.


## Fonctionnement de l'application

L'application demarre sur un module de commande matiere avec trois champs manuels: machine, nombre d'OF/laufnotes et type PROD ou MET. A partir de ces entrees, elle auto-remplit les champs gris comme item matiere, type matiere, quantites, couverture, statut planif et responsable fictif. L'utilisateur peut sauvegarder la commande, simuler la creation d'OF, lancer une disponibilite, generer un email fictif et archiver la ligne. Le tableau Archives est filtrable, triable, pagine et editable; le Suivi galva permet d'ajouter ou modifier des lignes; les Referentiels exposent SPC, options, MET, CW724R, seuils manco et articles de verification. Les donnees sont generees localement et conservees dans localStorage.

## Fonctions de l'application

- Reference le classeur de commande matiere.
- Structure les besoins, stocks et commandes.
- Separe la presentation publique des donnees sensibles.
- Affiche une vignette abstraite au lieu d'une capture du classeur.
- Creer une commande matiere fictive PROD ou MET
- Auto-remplir les champs calcules depuis machine, OF et type
- Simuler un email de commande puis ajouter la ligne aux archives
- Sauvegarder une commande et creer un OF fictif
- Lancer une verification de disponibilite fictive
- Filtrer, trier, paginer, selectionner et editer les archives
- Modifier le suivi galva et ajouter des lignes
- Consulter et enrichir les referentiels SPC, options, MET, CW724R, manco et articles de verification
- Exporter l'etat local en JSON

## Actualisations et evolution

- Statut courant: SENSITIVE_BLOCKED.
- Securite: FAIL_SECRETS.
- Fonctionnement: NON_TESTABLE_MANQUE_INFO.

## Options et conception

Le projet a ete concu comme une reproduction securisee du flux de commande matiere: conserver le parcours utilisateur, les champs et les volumes du classeur, mais remplacer les valeurs reelles par des donnees fictives. Le code met en avant les modules utiles au quotidien: saisie rapide, auto-remplissage, archive exploitable, referentiels modifiables et audit de la structure Excel.

### Outils, IA et moteurs utilises

- Classeur source COMMANDE_MATIERE.xlsm analyse en structure seulement
- Interface HTML/CSS/JavaScript autonome
- Module Commande matiere
- Table Archives
- Suivi galva editable
- Referentiels locaux
- Preview email fictif
- Export JSON
- localStorage
- JavaScript vanilla
- Donnees fictives seedees
- Auto-remplissage par hash des entrees
- Filtrage et tri cote client
- Pagination table
- Edition inline et formulaire
- SVG charts pour flux mensuel
- Persistance localStorage
- Export Blob JSON

### Options techniques detectees

- Type de projet: static-html
- Statut securite: OK_PUBLIC

### Stack et dependances principales

- HTML statique
- JavaScript vanilla
- Donnees fictives seedees
- Auto-remplissage par hash des entrees
- Filtrage et tri cote client
- Pagination table
- Edition inline et formulaire
- SVG charts pour flux mensuel
- Persistance localStorage
- Export Blob JSON

### Scripts disponibles

- Aucun script detecte.

### Dependances applicatives

- Aucune dependance applicative detectee.

### Dependances de developpement

- Aucune dependance de developpement detectee.

## Automatisations et comportements internes

- Generation initiale de 1 525 lignes d'archives fictives
- Calcul automatique du statut planif selon couverture
- Auto-preview des champs gris pendant la saisie
- Creation automatique d'un identifiant de commande et d'OF fictif
- Archivage depuis le bouton email fictif
- Planification en masse des lignes selectionnees
- Sauvegarde automatique des changements localStorage
- Regeneration volontaire du jeu fictif
- Export JSON de l'etat courant

## Installation locale

```powershell
# Aucune installation requise
```

## Lancement

```powershell
Start-Process .\index.html
```

## Captures d'ecran

![Capture capture](docs/github-captures/05-gestions-commande-matiere-2026-06-20_1858-archives.png)

![Capture capture](docs/github-captures/05-gestions-commande-matiere-2026-06-20_1858-commande.png)

## Variables d'environnement

Aucune variable d'environnement n'a ete detectee par l'orchestrateur.

## Securite

Ne jamais publier `.env`, tokens, sessions, logs sensibles, cles privees ou donnees personnelles.
