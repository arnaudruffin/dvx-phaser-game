# AGENTS.md - Donjon des Maths

## Description du Projet

**Donjon des Maths** est un jeu éducatif de type dungeon crawler développé avec Phaser 3, conçu pour aider les enfants à réviser leurs tables de multiplication (1 à 10).

### Concept
- Le joueur explore un donjon généré procéduralement (vue top-down)
- Chaque salle contient des monstres
- Toucher un monstre déclenche une question de multiplication
- Bonne réponse = monstre vaincu + points (bonus si réponse rapide)
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
│   ├── GameScene.js        # Gameplay principal (donjon + player)
│   ├── QuizScene.js        # Overlay question multiplication
│   ├── HudScene.js         # Score et indicateur de salle
│   └── GameOverScene.js    # Score final + restart
├── gameobjects/
│   ├── Player.js           # Héros contrôlable (4 directions)
│   └── Enemy.js            # Monstre avec trigger quiz
└── systems/
    ├── DungeonGenerator.js # Génération procédurale des salles
    ├── QuizManager.js      # Logique multiplications
    └── ScoreManager.js     # Gestion du score
```

### Flux de Scènes
```
Preloader → MenuScene → GameScene (+ HudScene parallèle)
                              ↓
                         QuizScene (overlay pause)
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
- Les salles sont mises en cache (Map par coordonnées)

---

## Système de Quiz

1. Collision joueur/ennemi → pause GameScene
2. QuizScene génère une multiplication aléatoire (tables 1-10)
3. Joueur tape sa réponse au clavier
4. Validation :
   - **Correct** : +100 points + bonus temps (10-50 pts selon rapidité)
   - **Incorrect** : Affichage réponse correcte, pas de points

### Calcul Bonus Temps
```javascript
// < 2 sec = 50 pts, > 10 sec = 10 pts
bonus = Math.max(10, Math.floor(50 - (elapsed - 2) * 5));
```

---

## Préconisations pour les Agents

### Ajout de Fonctionnalités

1. **Nouveaux types d'ennemis** : Créer dans `gameobjects/`, ajouter au spawn dans `DungeonGenerator`
2. **Nouvelles opérations** (division, addition) : Étendre `QuizManager.generateQuestion()`
3. **Niveaux de difficulté** : Paramétrer `minTable`/`maxTable` dans QuizManager
4. **Sons** : Utiliser le skill `audio-and-sound`, charger dans Preloader

### Points d'Attention

- **Depth ordering** : Player = 10, Enemies = 5, Walls = 1, Floor = 0
- **Collisions** : Recréées à chaque changement de salle dans `onDoorCollision`
- **Sprites** : Générés dans `Preloader.generateSprites()`, pas de fichiers PNG

### Skills Phaser Disponibles

Les skills dans `.agents/skills/` couvrent :
- `physics-arcade` : Collisions, groupes, overlap
- `scenes` : Lifecycle, transitions, scènes parallèles
- `input-keyboard-mouse-touch` : Gestion clavier
- `tweens` : Animations (utilisé pour mort ennemi)
- `text-and-bitmaptext` : Affichage texte (HUD, quiz)
- `groups-and-containers` : Gestion groupes d'objets

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
- Player top-down 4 directions
- Système de combat par quiz
- Score avec bonus rapidité
- HUD (score + salle actuelle)
- Transitions entre salles

### À Tester 🧪
- Playtest complet du flow
- Edge cases (réponses limites, salles extrêmes)

### Améliorations Futures 💡
- Effets sonores
- Animations de marche du player
- Boss tous les X salles
- Sauvegarde du meilleur score (localStorage)
- Mode "révision" avec tables spécifiques
