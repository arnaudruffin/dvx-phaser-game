# AGENTS.md - Donjon des Maths

## Description du Projet

**Donjon des Maths** est un jeu éducatif de type dungeon crawler développé avec Phaser 3, conçu pour aider les enfants à réviser leurs tables de multiplication (1 à 10).

### Concept
- Le joueur explore un donjon généré procéduralement (vue top-down)
- Chaque salle contient des monstres de 17 types (Gobelin → Dieu de la Mort)
- Toucher un monstre déclenche un **combat RPG tour par tour**
- Chaque round : une multiplication → le joueur attaque → l'ennemi riposte
- Plus la réponse est rapide, plus le coup est puissant (CRITIQUE! → FAIBLE)
- Mauvaise réponse = 0 dégâts + l'ennemi fait double dégâts
- HP joueur persistant entre combats, potions de soin dans le donjon
- Difficulté progressive : battre des monstres rapporte de l'XP → level up → monstres plus forts
- Exploration infinie avec score croissant

### Stack Technique
- **Framework** : Phaser 3.80.1
- **Build** : Vite 5.1.6
- **Langage** : JavaScript ES6 modules
- **Assets** : Sprites générés procéduralement (pas de fichiers externes)

---

## Architecture

```
src/
├── main.js                 # Config Phaser, définition des scènes
├── preloader.js            # Chargement assets + génération sprites
├── scenes/
│   ├── MenuScene.js        # Écran titre
│   ├── GameScene.js        # Gameplay principal (donjon + player + potions)
│   ├── QuizScene.js        # Scène de combat RPG tour par tour
│   ├── HudScene.js         # Score, barre de vie, niveau joueur
│   └── GameOverScene.js    # Score final + restart
├── gameobjects/
│   ├── Player.js           # Héros contrôlable (4 directions, HP persistant)
│   └── Enemy.js            # Monstres avec 20 types (17 normaux + 3 boss)
└── systems/
    ├── DungeonGenerator.js # Génération procédurale (salles, ennemis, potions)
    ├── LevelManager.js     # Système XP → niveau joueur
    ├── QuizManager.js      # Logique multiplications + calcul dégâts
    └── ScoreManager.js     # Gestion du score
```

### Flux de Scènes
```
Preloader → MenuScene → GameScene (+ HudScene parallèle)
                              ↓
                         QuizScene (combat RPG, pause GameScene)
                         ↓                    ↓
                    Victoire → resume    Défaite (HP ≤ 0)
                                              ↓
                                        GameOverScene → MenuScene
```

---

## Contrôles

| Input | Action |
|-------|--------|
| ↑ ↓ ← → | Déplacer le personnage |
| Entrée | Valider (menu, quiz) |
| 0-9 | Saisir réponse au quiz |
| Backspace | Effacer chiffre |

---

## Génération Procédurale

Le `DungeonGenerator` crée des salles connectées à la demande :
- Chaque salle a 4 portes (N/S/E/O) pour exploration infinie
- Obstacles intérieurs aléatoires (blocs 1x1 ou 2x2)
- 1-3 ennemis par salle (sauf salle de départ)
- Type d'ennemi selon le **niveau du joueur** (`pickEnemyType(level)`) — voir tableau ci-dessous
- Salles boss toutes les 5 salles (distance de Manhattan % 5 == 0), 1 boss par salle
- Type de boss selon le niveau joueur (`pickBossType(level)`)
- 0-1 potion de soin par salle (~30% de chance, pas dans les salles boss)
- Les salles sont mises en cache (Map par coordonnées)

---

## Système de Niveau (LevelManager)

L'XP est gagnée en battant des monstres. Quand le seuil est atteint, le niveau monte et les nouvelles salles génèrent des ennemis plus forts.

### Seuils XP cumulatifs

| Niveau | XP total requis |
|--------|-----------------|
| 1      | 0               |
| 2      | 200             |
| 3      | 500             |
| 4      | 900             |
| 5      | 1 400           |
| 6      | 2 000           |
| 7      | 2 700           |
| 8+     | +800 / niveau   |

Le niveau est affiché dans le HUD (`NIV:X`, en bas à gauche). Un level up déclenche une animation "NIVEAU X!" au centre de l'écran.

---

## Système de Combat

### Types d'ennemis normaux (`Enemy.ENEMY_TYPES`)

| Type | Texture | HP | Dégâts | Rounds | Tables | Score | XP | Niveau requis |
|------|---------|-----|--------|--------|--------|-------|----|---------------|
| Gobelin | `enemy-gobelin` (vert) | 30 | 8 | 2 | 1–4 | 100 | 80 | 1 |
| Loup-Garou | `enemy-loup-garou` (marron) | 40 | 10 | 2 | 2–5 | 150 | 130 | 2 |
| Squelette | `enemy-squelette` (blanc) | 50 | 12 | 3 | 3–6 | 200 | 180 | 3 |
| Chevalier Noir | `enemy-chevalier-noir` (sombre) | 65 | 16 | 3 | 4–8 | 280 | 280 | 4 |
| Ogre | `enemy-ogre` (rouge) | 80 | 20 | 4 | 5–9 | 350 | 380 | 5 |
| Liche | `enemy-liche` (violet) | 100 | 25 | 4 | 6–10 | 500 | 520 | 6 |
| Démon | `enemy-demon` (rouge sombre) | 130 | 35 | 5 | 8–10 | 700 | 720 | 7 |
| Vampire | `enemy-vampire` (violet/noir) | 150 | 42 | 5 | 8–10 | 900 | 950 | 8 |
| Golem de Pierre | `enemy-golem` (gris ardoise) | 170 | 50 | 5 | 9–10 | 1100 | 1200 | 9 |
| Nécromancien | `enemy-necromancien` (noir/vert) | 195 | 58 | 6 | 9–10 | 1350 | 1500 | 10 |
| Hydre | `enemy-hydre` (vert/teal) | 220 | 66 | 6 | 10 | 1600 | 1800 | 11 |
| Chimère | `enemy-chimere` (orange) | 245 | 74 | 6 | 10 | 1900 | 2200 | 12 |
| Sorcière Noire | `enemy-sorciere-noire` (noir/vert) | 275 | 85 | 6 | 10 | 2200 | 2700 | 13 |
| Ange Déchu | `enemy-ange-dechu` (blanc corrompu) | 310 | 98 | 7 | 10 | 2600 | 3300 | 14 |
| Titan de Feu | `enemy-titan-feu` (orange/rouge) | 360 | 115 | 7 | 10 | 3100 | 4000 | 15 |
| Archidémon | `enemy-archidemon` (rouge sang) | 420 | 140 | 7 | 10 | 3700 | 4900 | 16 |
| Dieu de la Mort | `enemy-dieu-mort` (noir/or) | 500 | 170 | 8 | 10 | 4500 | 6000 | 17 |

### Types de boss

| Type | Texture | HP | Dégâts | Rounds | Tables | Score | XP | Niveau requis |
|------|---------|-----|--------|--------|--------|-------|----|---------------|
| Chef Gobelin | `boss-gobelin` | 50 | 15 | 3 | 2–7 | 400 | 500 | 1–2 |
| Troll des Cavernes | `boss-troll` | 120 | 30 | 5 | 5–10 | 800 | 1000 | 3–5 |
| Dragon Ancien | `boss-dragon` | 180 | 45 | 6 | 7–10 | 1500 | 2000 | 6+ |

### Pool d'ennemis par niveau joueur

| Niveau | Composition des salles normales |
|--------|--------------------------------|
| 1 | 100% Gobelin |
| 2 | 50% Gobelin · 50% Loup-Garou |
| 3 | 40% Loup-Garou · 60% Squelette |
| 4 | 40% Squelette · 60% Chevalier Noir |
| 5 | 30% Chevalier Noir · 70% Ogre |
| 6 | 40% Ogre · 60% Liche |
| 7 | 40% Liche · 60% Démon |
| 8 | 40% Démon · 60% Vampire |
| 9 | 40% Vampire · 60% Golem de Pierre |
| 10 | 40% Golem · 60% Nécromancien |
| 11 | 40% Nécromancien · 60% Hydre |
| 12 | 40% Hydre · 60% Chimère |
| 13 | 40% Chimère · 60% Sorcière Noire |
| 14 | 40% Sorcière Noire · 60% Ange Déchu |
| 15 | 40% Ange Déchu · 60% Titan de Feu |
| 16 | 40% Titan de Feu · 60% Archidémon |
| 17+ | 40% Archidémon · 60% Dieu de la Mort |

### Déroulement d'un combat (QuizScene)

Machine à états : `intro` → `question` → `player_attack` → `enemy_attack` → boucle → `victory` / `defeat`

1. **Intro** : Sprites glissent depuis les côtés, texte "COMBAT!" animé
2. **Question** : Multiplication générée selon les tables du type d'ennemi
3. **Attaque joueur** : Dégâts calculés selon rapidité + justesse
4. **Riposte ennemi** : Dégâts fixes (x2 si le joueur s'est trompé au round précédent)
5. Retour à l'étape 2 jusqu'à fin des rounds ou HP ≤ 0

### Dégâts liés à la rapidité (`QuizManager.calculateDamage`)

| Réponse | Temps | Dégâts | Tier | Feedback visuel |
|---------|-------|--------|------|-----------------|
| Correcte | < 3s | 35 | `critical` | "CRITIQUE!" doré + shake écran |
| Correcte | 3-6s | 25 | `strong` | "BON COUP!" blanc |
| Correcte | 6-10s | 15 | `normal` | "-15" gris |
| Correcte | > 10s | 8 | `weak` | "FAIBLE..." petit gris |
| Incorrecte | — | 0 | `miss` | "RATE!" rouge |

### Système de HP

- **Joueur** : 100 HP max, persistant entre combats (`Player.currentHp`)
- **Barres de vie** : Vert (>60%) → Jaune (30-60%) → Rouge (<30%), animées par tweens
- **Potions** : +25 HP au ramassage, sprite coeur flottant dans le donjon
- **Game Over** : Quand HP joueur ≤ 0, affichage score + monstres vaincus

### Communication GameScene ↔ QuizScene

```javascript
// Lancement du combat
this.scene.launch("QuizScene", {
    playerHp, playerMaxHp, enemyType, enemyConfig, enemyCurrentHp
});

// Résultat du combat (event "quiz-answer")
{ correct, playerHpRemaining, score, enemyDefeated }
```

---

## Préconisations pour les Agents

### Ajout de Fonctionnalités

1. **Nouveaux types d'ennemis** : Ajouter dans `Enemy.ENEMY_TYPES` (avec `xpValue`), créer sprite dans `Preloader.generateSprites()`, mettre à jour `pickEnemyType(level)` dans `DungeonGenerator`
2. **Nouvelles opérations** (division, addition) : Étendre `QuizManager.generateQuestion()`
3. **Niveaux de difficulté** : Paramétrer `minTable`/`maxTable` dans `Enemy.ENEMY_TYPES`
4. **Sons** : Utiliser le skill `audio-and-sound`, charger dans Preloader
5. **Nouveaux objets ramassables** : Suivre le pattern des potions (sprite dans Preloader, spawn dans DungeonGenerator, overlap dans GameScene)

### Points d'Attention

- **Depth ordering** : Player = 10, Enemies = 5, Potions = 3, Walls = 1, Floor = 0
- **Collisions** : Recréées à chaque changement de salle dans `setupCollisions()`
- **Sprites** : Générés dans `Preloader.generateSprites()`, pas de fichiers PNG
- **Combat** : QuizScene utilise une machine à états — respecter le flux `intro` → `question` → `player_attack` → `enemy_attack`
- **Événements** : Communication entre scènes via `this.game.events` (event `"quiz-answer"`)
- **Niveau joueur** : `LevelManager` tenu à jour dans `GameScene`, `dungeonGenerator.currentLevel` synchronisé à chaque level up. Les salles déjà générées gardent leurs ennemis d'origine (le niveau n'affecte que les nouvelles salles)

### Skills Phaser Disponibles

Les skills dans `.agents/skills/` couvrent :
- `physics-arcade` : Collisions, groupes, overlap
- `scenes` : Lifecycle, transitions, scènes parallèles
- `input-keyboard-mouse-touch` : Gestion clavier
- `tweens` : Animations (combat, mort ennemi, pickup potion)
- `text-and-bitmaptext` : Affichage texte (HUD, combat, dégâts flottants)
- `groups-and-containers` : Gestion groupes d'objets (ennemis, potions)

---

## Commandes

```bash
npm run dev      # Serveur de développement (Vite)
npm run build    # Build production
npm run preview  # Preview build
```

---

## État Actuel (25/04/2026)

### Complété ✅
- Menu principal avec titre
- Génération procédurale du donjon
- Player top-down 4 directions avec HP persistant
- Système de combat RPG tour par tour (multi-rounds)
- 17 types d'ennemis normaux + 3 boss avec sprites procéduraux distincts
- Système de niveau XP : battre des monstres rapporte de l'XP, level up débloque de nouveaux ennemis
- Dégâts liés à la rapidité (critique/bon coup/normal/faible/raté)
- Animations de combat (attaque, riposte, flash, shake, texte flottant)
- Barre de vie joueur dans le HUD (vert → jaune → rouge)
- Potions de soin dans le donjon (+25 PV)
- Difficulté progressive selon le niveau joueur
- Score avec bonus rapidité
- HUD (score + barre de vie + niveau joueur NIV:X)
- Animation "NIVEAU X!" au level up
- Boss toutes les 5 salles (distance Manhattan), type selon le niveau
- Game Over avec stats détaillées (score + monstres vaincus)
- Transitions entre salles

### À Tester 🧪
- Équilibrage des seuils XP et de la progression de niveau
- Playtest complet du flow de combat avec les 17 types d'ennemis
- Edge cases (rounds épuisés sans vaincre l'ennemi, potions à HP max)

### Améliorations Futures 💡
- Effets sonores (combat, pickup potion, victoire, level up)
- Animations de marche du player
- Sauvegarde du meilleur score (localStorage)
- Mode "révision" avec tables spécifiques
- Nouveaux types d'opérations (addition, soustraction, division)
