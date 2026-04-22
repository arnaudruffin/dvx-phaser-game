# AGENTS.md - Donjon des Maths

## Description du Projet

**Donjon des Maths** est un jeu éducatif de type dungeon crawler développé avec Phaser 3, conçu pour aider les enfants à réviser leurs tables de multiplication (1 à 10).

### Concept
- Le joueur explore un donjon généré procéduralement (vue top-down)
- Chaque salle contient des monstres de 3 types (Gobelin, Squelette, Ogre)
- Toucher un monstre déclenche un **combat RPG tour par tour**
- Chaque round : une multiplication → le joueur attaque → l'ennemi riposte
- Plus la réponse est rapide, plus le coup est puissant (CRITIQUE! → FAIBLE)
- Mauvaise réponse = 0 dégâts + l'ennemi fait double dégâts
- HP joueur persistant entre combats, potions de soin dans le donjon
- Difficulté progressive : ennemis plus forts loin du spawn
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
│   ├── HudScene.js         # Score, barre de vie, indicateur de salle
│   └── GameOverScene.js    # Score final + restart
├── gameobjects/
│   ├── Player.js           # Héros contrôlable (4 directions, HP persistant)
│   └── Enemy.js            # Monstres avec 3 types (Gobelin/Squelette/Ogre)
└── systems/
    ├── DungeonGenerator.js # Génération procédurale (salles, ennemis, potions)
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
- Type d'ennemi selon la distance au spawn (`pickEnemyType`) :
  - Distance 1-2 : Gobelins uniquement
  - Distance 3-4 : Gobelins (40%) + Squelettes (60%)
  - Distance 5-6 : Squelettes (40%) + Ogres (60%)
  - Distance 7+ : Ogres (70%) + Squelettes (30%)
- 0-1 potion de soin par salle (~30% de chance)
- Les salles sont mises en cache (Map par coordonnées)

---

## Système de Combat

### Types d'ennemis (`Enemy.ENEMY_TYPES`)

| Type | Texture | HP | Dégâts | Rounds | Tables | Score |
|------|---------|-----|--------|--------|--------|-------|
| Gobelin | `enemy-gobelin` (vert) | 30 | 8 | 2 | 1-5 | 100 |
| Squelette | `enemy-squelette` (blanc) | 50 | 12 | 3 | 3-7 | 200 |
| Ogre | `enemy-ogre` (rouge) | 80 | 20 | 4 | 5-10 | 350 |

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

1. **Nouveaux types d'ennemis** : Ajouter dans `Enemy.ENEMY_TYPES`, créer sprite dans `Preloader`, ajouter au `pickEnemyType` dans `DungeonGenerator`
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

## État Actuel (22/04/2026)

### Complété ✅
- Menu principal avec titre
- Génération procédurale du donjon
- Player top-down 4 directions avec HP persistant
- Système de combat RPG tour par tour (multi-rounds)
- 3 types d'ennemis (Gobelin, Squelette, Ogre) avec sprites distincts
- Dégâts liés à la rapidité (critique/bon coup/normal/faible/raté)
- Animations de combat (attaque, riposte, flash, shake, texte flottant)
- Barre de vie joueur dans le HUD (vert → jaune → rouge)
- Potions de soin dans le donjon (+25 PV)
- Difficulté progressive selon la distance au spawn
- Score avec bonus rapidité
- HUD (score + barre de vie + salle actuelle)
- Game Over avec stats détaillées (score + monstres vaincus)
- Transitions entre salles

### À Tester 🧪
- Équilibrage des dégâts/HP entre types d'ennemis
- Playtest complet du flow de combat
- Edge cases (rounds épuisés sans vaincre l'ennemi, potions à HP max)

### Améliorations Futures 💡
- Effets sonores (combat, pickup potion, victoire)
- Animations de marche du player
- Boss tous les X salles
- Sauvegarde du meilleur score (localStorage)
- Mode "révision" avec tables spécifiques
- Nouveaux types d'opérations (addition, soustraction, division)
