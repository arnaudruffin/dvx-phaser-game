import { Scene } from "phaser";

export class MenuScene extends Scene {
    constructor() {
        super("MenuScene");
    }

    init() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;

        // Dark dungeon background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x1a1a2e)
            .setOrigin(0, 0)
            .setDepth(0);

        // Add animated background enemy sprites (ghosts/specters)
        this.createBackgroundEnemies(centerX, centerY);

        // Add magical particle effects
        this.createParticleEffects();

        // Title background with enhanced effect
        this.add.rectangle(0, centerY - 60, this.scale.width, 140, 0x2d2d44)
            .setOrigin(0, 0.5)
            .setAlpha(0.85)
            .setDepth(2);

        // Game title with dramatic entrance animation
        const title = this.add.bitmapText(centerX, centerY - 60, "knighthawks", "DONJON\nDES MATHS", 64, 1)
            .setOrigin(0.5, 0.5)
            .setDepth(5);
        title.postFX.addShine(1, 0.3, 5);
        title.postFX.addGlow(0xff4444, 2);

        // Animate title entrance
        this.tweens.add({
            targets: title,
            scaleX: { from: 0.5, to: 1 },
            scaleY: { from: 0.5, to: 1 },
            alpha: { from: 0, to: 1 },
            duration: 800,
            ease: 'back.out'
        });

        // Pulsing glow effect on title
        this.tweens.add({
            targets: title,
            glowAlpha: { from: 0.3, to: 0.6 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inout'
        });

        // Epic subtitle
        // const subtitle = this.add.bitmapText(centerX, centerY - 10, "pixelfont", "L'EPREUVE DES MONSTRES", 16)
        //     .setOrigin(0.5, 0.5)
        //     .setAlpha(0)
        //     .setDepth(5);
        // subtitle.setTint(0xff6633);

        // this.tweens.add({
        //     targets: subtitle,
        //     alpha: { from: 0, to: 0.9 },
        //     duration: 1000,
        //     delay: 400,
        //     ease: 'power2.inout'
        // });

        // Instructions background
        this.add.rectangle(0, centerY + 80, this.scale.width, 100, 0x000000)
            .setOrigin(0, 0.5)
            .setAlpha(0.6)
            .setDepth(2);

        // Staggered instruction animations
        const instructions = [
            { text: "EXPLORE LE DONJON", y: centerY + 50 },
            { text: "RESOUS LES CALCULS", y: centerY + 80 },
            { text: "VAINCS LES MONSTRES", y: centerY + 110 }
        ];

        instructions.forEach((inst, index) => {
            const instrText = this.add.bitmapText(centerX, inst.y, "pixelfont", inst.text, 20)
                .setOrigin(0.5, 0.5)
                .setAlpha(0)
                .setDepth(5);
            instrText.postFX.addGlow(0x44ff44, 1);

            this.tweens.add({
                targets: instrText,
                alpha: { from: 0, to: 1 },
                x: { from: centerX - 50, to: centerX },
                duration: 600,
                delay: 600 + (index * 200),
                ease: 'power2.out'
            });
        });

        // Start prompt with dramatic pulsing effect
        const startText = this.add.bitmapText(centerX, centerY + 180, "pixelfont", "APPUIE SUR ENTREE", 24)
            .setOrigin(0.5, 0.5)
            .setDepth(5);
        startText.setTint(0xff4444);
        startText.postFX.addGlow(0xff0000, 1.5);

        this.tweens.add({
            targets: startText,
            alpha: { from: 0.4, to: 0.9 },
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inout'
        });

        this.tweens.add({
            targets: startText,
            scaleX: { from: 1, to: 1.15 },
            scaleY: { from: 1, to: 1.15 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inout'
        });

        // Start on Enter or click
        this.input.keyboard.on('keydown-ENTER', () => this.startGame());
        this.input.keyboard.on('keydown-SPACE', () => this.startGame());
        this.input.on("pointerdown", () => this.startGame());    }

    createBackgroundEnemies(centerX, centerY) {
        const enemyTypes = ['enemy-gobelin', 'enemy-squelette', 'enemy-ogre'];
        const positions = [
            { x: 150, y: 150 },
            { x: centerX * 2 - 150, y: 150 },
            { x: centerX, y: 450 }
        ];

        positions.forEach((pos, index) => {
            if (this.textures.exists(enemyTypes[index])) {
                const enemy = this.add.sprite(pos.x, pos.y, enemyTypes[index])
                    .setAlpha(0.25)
                    .setScale(1.2)
                    .setDepth(1);

                // Floating animation
                this.tweens.add({
                    targets: enemy,
                    y: { from: pos.y - 20, to: pos.y + 20 },
                    duration: 3000 + (index * 500),
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inout'
                });

                // Gentle rotation
                this.tweens.add({
                    targets: enemy,
                    rotation: { from: -0.1, to: 0.1 },
                    duration: 4000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'sine.inout'
                });
            }
        });
    }

    createParticleEffects() {
        // Create a simple particle texture if it doesn't exist
        if (!this.textures.exists('particle')) {
            const graphics = this.make.graphics({ x: 0, y: 0, add: false });
            graphics.fillStyle(0x6666ff);
            graphics.fillCircle(4, 4, 4);
            graphics.generateTexture('particle', 8, 8);
            graphics.destroy();
        }

        // Magical particle emitter - direct config (no createEmitter in v3.60+)
        const particles = this.add.particles(this.scale.width / 2, 50, 'particle', {
            speed: { min: -30, max: 30 },
            angle: { min: 240, max: 300 },
            scale: { start: 0.8, end: 0 },
            lifespan: 2000,
            gravityY: -80,
            emitting: false
        });
        particles.setDepth(2);

        // Continuous emission loop
        this.time.addEvent({
            delay: 300,
            callback: () => {
                particles.emitParticleAt(
                    Phaser.Math.Between(100, this.scale.width - 100),
                    Phaser.Math.Between(20, 100),
                    1
                );
            },
            loop: true
        });
    }

    startGame() {
        // Play menu click sound
        if (this.game.soundManager) {
            this.game.soundManager.playSound('menu-click');
            this.time.delayedCall(200, () => {
                this.game.soundManager.playSound('game-start');
            });
        }

        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("ConfigScene");
        });
    }
}