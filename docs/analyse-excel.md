# Analyse Excel - COMMANDE_MATIERE.xlsm

Cette analyse est volontairement structurelle: elle conserve les volumes, les noms de
colonnes et les comportements, mais aucune ligne metier du classeur n'est integreee
dans l'application web.

## Structure detectee

| Feuille | Role observe | Volume equivalent repris |
| --- | --- | --- |
| CDE | Saisie de commande active | Formulaire web simple |
| Archives | Historique principal, filtres, indicateurs planif | 1525 lignes generees, 29 colonnes structurelles |
| SPC | Referentiel postes / decolletage | 53 entrees generees |
| O | Parametres et options de flux | 22 options generees |
| Liste | Listes MET, CW724R, seuils manco | Volumes equivalents par liste |
| Article_VERIF | Liste courte de controle articles | 5 articles generes |

## Colonnes principales reproduites

La feuille `Archives` porte le coeur applicatif. Les champs web reprennent les roles:

- statut, machine, nombre de laufnote, item, item matiere, type matiere;
- remarques, operateur, responsable, date;
- OF, nombre de barres, poids SAP, traitement;
- validation planif, statut planif, taux de couverture, nombre planif;
- WC, type, start production, production version, batch.

## Formules et indicateurs

Le classeur contient 17 formules dans la zone archivee. Elles suivent toutes le meme
principe:

- recherche du statut de planification via une cle article / machine;
- normalisation d'une cle quand le debut de valeur correspond a un prefixe particulier;
- recherche dans des fichiers de planning externes;
- fallback avec `IFERROR`;
- fonctions detectees: `IFERROR`, `XLOOKUP`, `IF`, `LEFT`.

Dans l'application web, cette logique est traduite par un calcul local:

- `tauxCouverture` pilote `statutPlanif`;
- seuil bas: `Bloquant`;
- seuil intermediaire: `A verifier`;
- seuil normal: `OK`;
- depassement fort: `Surplus`.

## Flux Commande simplifie

L'onglet `Commande` est maintenant le point de depart de l'application.

L'utilisateur remplit uniquement les champs blancs:

- numero machine;
- nombre OF selectionne;
- type commande: `MET` ou `PROD`.

Les champs gris se remplissent automatiquement avec des donnees generees:

- item, item matiere et type matiere;
- operateur;
- date et couverture;
- start prod et prod ver.

Le bouton `Envoyer` simule l'envoi d'un email vers l'atelier MET ou PROD,
puis ajoute automatiquement une ligne dans l'onglet `Archives`.

## Macros VBA analysees

Le classeur contient un projet VBA avec 7 modules utiles et 15 procedures detectees.

| Macro / module | Fonction observee | Equivalent web |
| --- | --- | --- |
| Evenement feuille CDE | Met a jour les formules et champs selon le type de commande | Changement direct dans le formulaire |
| Archivage commande | Copie la commande vers Archives, notifie, nettoie la saisie | Bouton `Envoyer`, notification, persistance locale |
| Creation OF | Pilote SAP GUI, cree un OF, renseigne statut et identifiants | Action `GO` globale depuis Archives avec simulation SAP |
| DISPO | Release, impression, confirmation OP05, picking, etiquette | Meme `GO` global avec champs PROD VERS, QUANTITEE et cases SURPLUS, REALASE, SUPP SETUP, FSTR, PLdOrd, CONFOP05, PRINT, PICKING, ETIQUETTE |
| ADO lecture fichier | Lit des fichiers externes pour enrichir les champs | Donnees locales generees et recalcul JS |
| Test / debug | Tests de liens et diagnostics | Non repris comme fonctionnalite utilisateur |
| UserForm commente | Ancien formulaire / declarations commentees | Remplace par interface web |

Les appels SAP, Outlook, chemins reseau et connexions ADO ne sont pas executes dans
l'application. Ils sont remplaces par des flux locaux simulant les changements d'etat,
avec fenetre de progression et journal des actions en cours.

## Decisions de migration

- Application autonome en HTML, CSS et JavaScript.
- Design Windows 11 clair: Mica, Segoe UI, navigation laterale, boutons compacts.
- Tables larges avec scroll horizontal mobile.
- Donnees modifiables et ajoutables dans toutes les zones utiles.
- Persistance locale via `localStorage`.

## Garanties donnees

- Aucune valeur metier du classeur source n'est injectee dans `app.js`.
- Les identifiants, articles, machines, responsables, lots et commentaires sont inventes.
- Les volumes initiaux correspondent au classeur pour garder la densite et les cas d'usage.
