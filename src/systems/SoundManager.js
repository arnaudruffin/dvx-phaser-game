/**
 * Sound Manager for Donjon des Maths
 * Generates and plays sound effects using Phaser's Web Audio API
 */

export class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.soundVolume = 0.5;
        this.muted = false;
        this.scene.sound.volume = this.soundVolume;
    }

    /**
     * Play a sound effect by generating it dynamically
     * This avoids external audio file dependencies
     */
    playSound(type, options = {}) {
        if (this.muted) return;

        const volume = options.volume !== undefined ? options.volume : this.soundVolume;
        
        try {
            switch (type) {
                // Menu sounds
                case 'menu-click':
                    this.playMenuClick(volume);
                    break;
                case 'game-start':
                    this.playGameStart(volume);
                    break;

                // Gameplay sounds
                case 'pickup-potion':
                    this.playPickupPotion(volume);
                    break;
                case 'player-step':
                    this.playPlayerStep(volume);
                    break;
                case 'wall-collision':
                    this.playWallCollision(volume);
                    break;

                // Combat sounds
                case 'combat-start':
                    this.playCombatStart(volume);
                    break;
                case 'answer-critical':
                    this.playAnswerCritical(volume);
                    break;
                case 'answer-good':
                    this.playAnswerGood(volume);
                    break;
                case 'answer-normal':
                    this.playAnswerNormal(volume);
                    break;
                case 'answer-weak':
                    this.playAnswerWeak(volume);
                    break;
                case 'answer-wrong':
                    this.playAnswerWrong(volume);
                    break;
                case 'player-attack':
                    this.playPlayerAttack(volume);
                    break;
                case 'enemy-attack':
                    this.playEnemyAttack(volume);
                    break;
                case 'victory':
                    this.playVictory(volume);
                    break;
                case 'defeat':
                    this.playDefeat(volume);
                    break;
                default:
                    console.warn(`Unknown sound type: ${type}`);
            }
        } catch (e) {
            console.warn(`Failed to play sound ${type}:`, e.message);
        }
    }

    // === Menu Sounds ===
    playMenuClick(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const duration = 0.15;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + duration);

        gain.gain.setValueAtTime(volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    playGameStart(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            const start = now + (i * 0.1);
            const duration = 0.2;
            
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(volume * 0.3, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + duration);
            
            osc.start(start);
            osc.stop(start + duration);
        });
    }

    // === Gameplay Sounds ===
    playPickupPotion(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const notes = [659.25, 783.99, 987.77]; // E5, G5, B5

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const start = now + (i * 0.08);
            const duration = 0.15;

            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(volume * 0.3, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

            osc.start(start);
            osc.stop(start + duration);
        });
    }

    playPlayerStep(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const duration = 0.08;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + duration);

        gain.gain.setValueAtTime(volume * 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    playWallCollision(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const duration = 0.1;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + duration);

        gain.gain.setValueAtTime(volume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    // === Combat Sounds ===
    playCombatStart(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        
        // Deep bass note
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

        gain.gain.setValueAtTime(volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    playAnswerCritical(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const notes = [1047.0, 1319.46, 1568.0]; // C6, E6, G6
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const start = now + (i * 0.05);
            const duration = 0.15;

            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(volume * 0.4, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

            osc.start(start);
            osc.stop(start + duration);
        });
    }

    playAnswerGood(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const notes = [783.99, 987.77]; // G5, B5
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const start = now + (i * 0.08);
            const duration = 0.12;

            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(volume * 0.35, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

            osc.start(start);
            osc.stop(start + duration);
        });
    }

    playAnswerNormal(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const duration = 0.2;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(659.25, now); // E5
        gain.gain.setValueAtTime(volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    playAnswerWeak(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const duration = 0.25;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(349.23, now); // F4
        gain.gain.setValueAtTime(volume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    playAnswerWrong(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const duration = 0.3;

        // Two low notes descending
        [200, 150].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const start = now + (i * 0.1);

            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(volume * 0.35, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

            osc.start(start);
            osc.stop(start + duration);
        });
    }

    playPlayerAttack(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const duration = 0.15;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + duration);

        gain.gain.setValueAtTime(volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    playEnemyAttack(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const duration = 0.2;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + duration);

        gain.gain.setValueAtTime(volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

        osc.start(now);
        osc.stop(now + duration);
    }

    playVictory(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1047.0]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const start = now + (i * 0.1);
            const duration = 0.2;

            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(volume * 0.35, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

            osc.start(start);
            osc.stop(start + duration);
        });
    }

    playDefeat(volume) {
        const ctx = this.scene.sound.context;
        const now = ctx.currentTime;
        const notes = [349.23, 293.66, 246.94]; // F4, D4, B3

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            const start = now + (i * 0.15);
            const duration = 0.3;

            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.setValueAtTime(freq, start);
            gain.gain.setValueAtTime(volume * 0.35, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + duration);

            osc.start(start);
            osc.stop(start + duration);
        });
    }

    // === Utilities ===
    setVolume(volume) {
        this.soundVolume = Math.max(0, Math.min(1, volume));
        this.scene.sound.volume = this.soundVolume;
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    getMuted() {
        return this.muted;
    }

    getVolume() {
        return this.soundVolume;
    }
}
