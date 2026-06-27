# Gestions Commande Matiere

## Liens vers l'application
- Lien public: non detecte
- GitHub: https://github.com/RYJITS/gestions_commande_mati-re

## A quoi sert le projet
Gestions Commande Matiere est une application web locale reconstruite depuis l'analyse du classeur COMMANDE_MATIERE.xlsm. Elle sert a piloter des commandes matiere fictives, les archives, les referentiels et le suivi galva sans reutiliser les donnees metier sensibles du fichier original.

## Fonctionnement de l'application ou du projet
L'application demarre sur un module de commande matiere avec trois champs manuels: machine, nombre d'OF/laufnotes et type PROD ou MET. A partir de ces entrees, elle auto-remplit les champs gris comme item matiere, type matiere, quantites, couverture, statut planif et responsable fictif. L'utilisateur peut sauvegarder la commande, simuler la creation d'OF, lancer une disponibilite, generer un email fictif et archiver la ligne. Le tableau Archives est filtrable, triable, pagine et editable; le Suivi galva permet d'ajouter ou modifier des lignes; les Referentiels exposent SPC, options, MET, CW724R, seuils manco et articles de verification. Les donnees sont generees localement et conservees dans localStorage.

## Comment le projet a ete construit
Le projet a ete concu comme une reproduction securisee du flux de commande matiere: conserver le parcours utilisateur, les champs et les volumes du classeur, mais remplacer les valeurs reelles par des donnees fictives. Le code met en avant les modules utiles au quotidien: saisie rapide, auto-remplissage, archive exploitable, referentiels modifiables et audit de la structure Excel.

## Fonctions disponibles dans l'application
- Creer une commande matiere fictive PROD ou MET
- Auto-remplir les champs calcules depuis machine, OF et type
- Simuler un email de commande puis ajouter la ligne aux archives
- Sauvegarder une commande et creer un OF fictif
- Lancer une verification de disponibilite fictive
- Filtrer, trier, paginer, selectionner et editer les archives
- Modifier le suivi galva et ajouter des lignes
- Consulter et enrichir les referentiels SPC, options, MET, CW724R, manco et articles de verification
- Exporter l'etat local en JSON

## Outils, IA et moteurs en arriere-plan
- Classeur source COMMANDE_MATIERE.xlsm analyse en structure seulement
- Interface HTML/CSS/JavaScript autonome
- Module Commande matiere
- Table Archives
- Suivi galva editable
- Referentiels locaux
- Preview email fictif
- Export JSON
- localStorage

## Automatisations integrees
- Generation initiale de 1 525 lignes d'archives fictives
- Calcul automatique du statut planif selon couverture
- Auto-preview des champs gris pendant la saisie
- Creation automatique d'un identifiant de commande et d'OF fictif
- Archivage depuis le bouton email fictif
- Planification en masse des lignes selectionnees
- Sauvegarde automatique des changements localStorage
- Regeneration volontaire du jeu fictif
- Export JSON de l'etat courant

## Captures d'ecran
![Capture 1 - Gestions Commande Matière](docs/captures/05-gestions-commande-matiere-2026-06-20_1858-commande.png)

![Capture 2 - Gestions Commande Matière](docs/captures/05-gestions-commande-matiere-2026-06-20_1858-archives.png)

## Mises a jour
- Fiche actualisee depuis le registre orchestrateur et le catalogue projet.

> Fichier genere par l'orchestrateur pour le hub Site Ma Methode.
