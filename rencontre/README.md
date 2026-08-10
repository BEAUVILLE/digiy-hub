# DIGIY RENCONTRE — V1 pilote

Module social local de DIGIYLYFE, pensé mobile-first.

## Doctrine

« Ici, tu ne collectionnes pas des profils. Tu rencontres ton territoire. »

Intentions : AMITIÉ · CONNAISSANCE · RENCONTRE · CURIEUX · OUVERT.

Navigation : PERSONNES · ACTIVITÉS · CERCLES · PROPOSER.

Cercles initiaux : Découverte Petite Côte, Amitié & connaissances, Sorties & ambiance, Sport & activités, Cuisine & partage, Business & projets, Culture & création, Nouveaux sur la Petite Côte, Atelier IA.

## Sécurité V1

- 18+ uniquement.
- Pas de GPS précis.
- Aucun téléphone, email ou PIN exposé.
- Demande de contact avant échange de coordonnées.
- Blocage et signalement prévus.
- Pas de chat interne, swipe, vidéo ou Realtime dans le MVP.

## Supabase

Le front est conçu pour utiliser :

- `digiy_rencontre_discover_profiles`
- `digiy_rencontre_discover_activities`
- `digiy_rencontre_contact_requests`
- `digiy_rencontre_blocks`
- `digiy_rencontre_activity_participants`
- `digiy_rencontre_activities`
- `digiy_rencontre_circles`
- `digiy_zones`

`config.js` reste volontairement vide sur la branche. Ne jamais y placer de `service_role`. Le module fonctionne en mode aperçu tant que les valeurs publiques Supabase ne sont pas branchées.

## Statut

Prototype fonctionnel de front. Aucun changement du HUB principal dans cette PR.
