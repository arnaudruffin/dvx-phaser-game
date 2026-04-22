# 🧪 Testing the Sound Effects

## Quick Start

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 in your browser

3. **Interact with the page** first (click or press a key) – Web Audio requires user interaction

## What to Listen For

### 📍 Menu Screen
- **Press ENTER** → Hear two sounds:
  - `menu-click` (quick beep, high pitch)
  - `game-start` (ascending 3-note chord)

### 🎮 Gameplay (Dungeon)
- **Collect a potion** → Hear `pickup-potion` (ascending notes)
- **Hit a wall** → Hear `wall-collision` (descending sound)

### ⚔️ Combat Screen (Most Sounds!)
When combat starts, you'll hear:
1. `combat-start` (deep bass note)

For each question you answer:
- **Answer in < 3 seconds (CRITICAL)** → `answer-critical` (3 high notes)
- **Answer in 3-6 seconds (GOOD)** → `answer-good` (2 medium notes)
- **Answer in 6-10 seconds (NORMAL)** → `answer-normal` (1 medium note)
- **Answer in > 10 seconds (WEAK)** → `answer-weak` (1 low note)
- **Wrong answer** → `answer-wrong` (2 descending low notes)

During attacks:
- Player attacks → `player-attack` (harsh high-pitch sound)
- Enemy ripostes → `enemy-attack` (harsh medium-pitch sound)

End of combat:
- **Won** → `victory` (ascending 4-note chord: C5→E5→G5→C6)
- **Lost** → `defeat` (descending 3-note chord: F4→D4→B3)

### 🏁 Game Over
- **Press ENTER** → Hear `menu-click` (back to menu)

## Troubleshooting

### No sound at all?
1. ✓ Did you interact with the page? (Web Audio requires interaction)
2. ✓ Check browser console for errors (F12)
3. ✓ Check system volume is not muted
4. ✓ Try a different browser (Chrome, Firefox, Safari all support Web Audio)

### Sound is too loud or too quiet?
- The default volume is set to 0.5 (50%)
- To adjust, modify these lines in `src/systems/SoundManager.js`:
  ```javascript
  this.soundVolume = 0.5;  // Change to 0.3 for quieter, 0.7 for louder
  ```

### One sound isn't playing?
1. Check the browser console for errors
2. Verify the sound name is correct in the scene
3. Ensure `this.game.soundManager` exists

## Sound Quality Notes

The sounds are **synthesized in real-time** using Web Audio API:
- They're simple sine/square wave tones
- Volume envelopes simulate attack/decay
- Frequency modulation creates the musical effect

For **higher quality audio**, future improvements could:
- Use pre-recorded MP3/OGG files
- Apply reverb, echo, or other effects
- Use FM synthesis or wavetable synthesis

## Code Examples

### Playing a Sound
```javascript
if (this.game.soundManager) {
    this.game.soundManager.playSound('pickup-potion');
}
```

### Controlling Volume
```javascript
// Set to 70%
this.game.soundManager.setVolume(0.7);

// Get current volume
const vol = this.game.soundManager.getVolume();

// Mute/unmute
this.game.soundManager.toggleMute();
```

### Adding a New Sound
1. Create a method in `SoundManager.js`:
   ```javascript
   playNewSound(volume) {
       const ctx = this.scene.sound.context;
       const now = ctx.currentTime;
       // ... synthesis code ...
   }
   ```

2. Add a case in `playSound()`:
   ```javascript
   case 'new-sound':
       this.playNewSound(volume);
       break;
   ```

3. Use it in a scene:
   ```javascript
   this.game.soundManager.playSound('new-sound');
   ```

## Browser Compatibility

| Browser | Web Audio | Tested |
|---------|-----------|--------|
| Chrome | ✓ | Yes |
| Firefox | ✓ | Yes |
| Safari | ✓ | Yes |
| Edge | ✓ | Yes |
| Mobile Chrome | ✓ | Yes |
| Mobile Safari | ✓ | Yes |

Web Audio API is supported in all modern browsers.
