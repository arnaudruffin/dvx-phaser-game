# Système d'Effets Sonores - Donjon des Maths

## Vue d'ensemble

Le jeu utilise un **SoundManager** qui génère les effets sonores dynamiquement via l'API Web Audio du navigateur. Aucun fichier audio externe n'est nécessaire.

## Architecture

### SoundManager (`src/systems/SoundManager.js`)

Le `SoundManager` est responsable de :
- **Générer** les sons dynamiquement en temps réel
- **Jouer** les sons au moment approprié
- **Gérer** le volume global et la sourdine

**Initialisation :**
```javascript
// Dans Preloader.js
const soundManager = new SoundManager(this);
this.game.soundManager = soundManager; // Stocké globalement
```

**Utilisation :**
```javascript
// Dans n'importe quelle scène
if (this.game.soundManager) {
    this.game.soundManager.playSound('menu-click');
}
```

### Types d'Effets Sonores (15 total)

#### Menu et Démarrage
- `menu-click` : Clic sur bouton menu (fréquence décroissante)
- `game-start` : Début du jeu (3 notes montantes : C5, E5, G5)

#### Gameplay (Donjon)
- `pickup-potion` : Ramassage potion de soin (3 notes montantes)
- `player-step` : Pas du joueur (note basse courte, peu de volume)
- `wall-collision` : Collision avec mur (note décroissante)

#### Combat RPG
- `combat-start` : Début du combat (note basse profonde)
- `answer-critical` : Bonne réponse CRITIQUE/TRÈS RAPIDE (3 notes hautes)
- `answer-good` : Bonne réponse BON COUP (2 notes élevées)
- `answer-normal` : Bonne réponse NORMALE (1 note moyenne)
- `answer-weak` : Bonne réponse FAIBLE/LENT (1 note basse)
- `answer-wrong` : Mauvaise réponse (2 notes décroissantes basses)
- `player-attack` : Attaque du joueur (son carré, haute fréquence)
- `enemy-attack` : Riposte de l'ennemi (son carré, fréquence moyenne)
- `victory` : Victoire du combat (4 notes montantes : C5→E5→G5→C6)
- `defeat` : Défaite du joueur (3 notes descendantes : F4→D4→B3)

## Intégration dans les Scènes

### MenuScene
```javascript
// Au clic sur "Démarrage"
this.game.soundManager.playSound('menu-click');
this.time.delayedCall(200, () => {
    this.game.soundManager.playSound('game-start');
});
```

### GameScene
```javascript
// Au ramassage d'une potion
this.game.soundManager.playSound('pickup-potion');
```

### QuizScene (Combat)
```javascript
// Début du combat
this.game.soundManager.playSound('combat-start');

// Soumission de réponse (selon le tier de dégâts)
if (isCorrect) {
    if (result.tier === 'critical') {
        this.game.soundManager.playSound('answer-critical');
    } else if (result.tier === 'strong') {
        this.game.soundManager.playSound('answer-good');
    } else if (result.tier === 'normal') {
        this.game.soundManager.playSound('answer-normal');
    } else if (result.tier === 'weak') {
        this.game.soundManager.playSound('answer-weak');
    }
} else {
    this.game.soundManager.playSound('answer-wrong');
}

// Attaques
this.game.soundManager.playSound('player-attack');
this.game.soundManager.playSound('enemy-attack');

// Fin du combat
this.game.soundManager.playSound('victory');  // ou 'defeat'
```

### GameOverScene
```javascript
// Au clic "Rejouer"
this.game.soundManager.playSound('menu-click');
```

## Implémentation Technique

### Synthèse Sonore

Les sons sont générés avec l'API Web Audio :

```javascript
playMenuClick(volume) {
    const ctx = this.scene.sound.context; // AudioContext Phaser
    const now = ctx.currentTime;
    const duration = 0.15;

    const osc = ctx.createOscillator();    // Oscillateur
    const gain = ctx.createGain();         // Contrôle du volume

    osc.type = 'sine';                     // Forme d'onde
    osc.connect(gain);
    gain.connect(ctx.destination);         // Vers haut-parleur

    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + duration);

    gain.gain.setValueAtTime(volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.start(now);
    osc.stop(now + duration);
}
```

### Contrôle du Volume

```javascript
// Définir le volume global (0.0 à 1.0)
this.game.soundManager.setVolume(0.7);

// Basculer la sourdine
const isMuted = this.game.soundManager.toggleMute();

// Lire le volume actuel
const vol = this.game.soundManager.getVolume(); // 0.7
```

## Avantages de cette Approche

✅ **Pas de fichiers externes** – Aucune dépendance audio à charger  
✅ **Léger** – Zéro surcharge mémoire pour les sons  
✅ **Responsive** – Les sons se déclenchent instantanément  
✅ **Compatible** – Fonctionne sur tous les navigateurs avec Web Audio API  
✅ **Flexible** – Les sons peuvent être ajustés facilement (fréquences, durées, volumes)

## Améliorations Futures

- **Sons polyphoniques** : Ajouter plusieurs oscillateurs simultanés pour plus de richesse
- **Fichiers audio** : Remplacer par de vrais fichiers MP3/OGG pour une meilleure qualité
- **Effets audio** : Ajouter réverbération, écho, filtres
- **Réglages audio** : Interface utilisateur pour ajuster le volume/son
- **Mute localStorage** : Sauvegarder les préférences de l'utilisateur

## Dépannage

### Les sons ne se jouent pas
1. Vérifier que la page a été intéractée (clic/toucher) – Web Audio nécessite une action utilisateur
2. Vérifier la console pour les erreurs
3. Vérifier que `this.game.soundManager` existe

### Sons trop forts ou trop faibles
1. Ajuster le `volume` dans chaque méthode `play*(volume)`
2. Ajuster le `gain.gain.setValueAtTime()` dans les méthodes de synthèse

### Pas de son même après interaction utilisateur
1. Vérifier que le navigateur supporte Web Audio API
2. Vérifier que l'audio n'est pas mute au niveau du système/navigateur
