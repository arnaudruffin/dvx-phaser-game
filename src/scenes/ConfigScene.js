import { Scene } from "phaser";

export class ConfigScene extends Scene {
    constructor() {
        super("ConfigScene");
    }

    init() {
        this.cameras.main.fadeIn(400, 0, 0, 0);
        this.selectedOption = 0; // 0 = mode, 1 = maxTable
        this.maxTable = 10;
        this.mode = 'multiplication'; // 'multiplication' | 'addition'
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;
        const cx = W / 2;

        // Dark background
        this.add.rectangle(0, 0, W, H, 0x1a1a2e).setOrigin(0, 0).setDepth(0);

        // Title banner
        this.add.rectangle(0, 80, W, 80, 0x2d2d44)
            .setOrigin(0, 0.5)
            .setAlpha(0.9)
            .setDepth(1);

        this.add.bitmapText(cx, 80, "knighthawks", "CONFIGURATION", 36)
            .setOrigin(0.5, 0.5)
            .setDepth(2);

        // Options background
        this.add.rectangle(cx, H / 2, 500, 220, 0x2d2d44)
            .setOrigin(0.5, 0.5)
            .setAlpha(0.7)
            .setDepth(1);

        // Option 1 (en haut) : Mode
        this.modeLabel = this.add.bitmapText(cx, 220, "pixelfont", "MODE", 22)
            .setOrigin(0.5, 0.5)
            .setDepth(3);

        this.leftArrow1 = this.add.bitmapText(cx - 160, 270, "pixelfont", "<", 28)
            .setOrigin(0.5, 0.5)
            .setDepth(3);

        this.modeValue = this.add.bitmapText(cx, 270, "pixelfont", "MULTIPLICATIONS", 20)
            .setOrigin(0.5, 0.5)
            .setDepth(3)
            .setTint(0x44ff44);

        this.rightArrow1 = this.add.bitmapText(cx + 160, 270, "pixelfont", ">", 28)
            .setOrigin(0.5, 0.5)
            .setDepth(3);

        // Option 2 (en bas) : Table max / Nombre max — label adaptatif
        this.rangeLabel = this.add.bitmapText(cx, 340, "pixelfont", "TABLE MAX", 22)
            .setOrigin(0.5, 0.5)
            .setDepth(3);

        this.leftArrow2 = this.add.bitmapText(cx - 120, 390, "pixelfont", "<", 28)
            .setOrigin(0.5, 0.5)
            .setDepth(3);

        this.rangeValue = this.add.bitmapText(cx, 390, "pixelfont", `${this.maxTable}`, 36)
            .setOrigin(0.5, 0.5)
            .setDepth(3)
            .setTint(0xffd700);

        this.rightArrow2 = this.add.bitmapText(cx + 120, 390, "pixelfont", ">", 28)
            .setOrigin(0.5, 0.5)
            .setDepth(3);

        // Difficulty indicator
        this.diffText = this.add.bitmapText(cx, 450, "pixelfont", "", 16)
            .setOrigin(0.5, 0.5)
            .setDepth(3)
            .setTint(0xaaaaaa);

        // Start prompt
        this.startPrompt = this.add.bitmapText(cx, 530, "pixelfont", "ENTREE POUR JOUER", 22)
            .setOrigin(0.5, 0.5)
            .setDepth(3)
            .setTint(0xff4444);

        this.tweens.add({
            targets: this.startPrompt,
            alpha: { from: 0.4, to: 1 },
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inout'
        });

        // Navigation help
        this.add.bitmapText(cx, 570, "pixelfont", "HAUT/BAS POUR NAVIGUER", 14)
            .setOrigin(0.5, 0.5)
            .setDepth(3)
            .setTint(0x666688)
            .setAlpha(0.8);

        this.updateDisplay();

        this.input.keyboard.on('keydown', this.handleKey, this);
    }

    handleKey(event) {
        switch (event.key) {
            case 'ArrowUp':
                this.selectedOption = 0;
                this.updateDisplay();
                break;
            case 'ArrowDown':
                this.selectedOption = 1;
                this.updateDisplay();
                break;
            case 'ArrowLeft':
                if (this.selectedOption === 0) {
                    this.toggleMode();
                } else {
                    this.maxTable = Math.max(2, this.maxTable - 1);
                }
                this.updateDisplay();
                break;
            case 'ArrowRight':
                if (this.selectedOption === 0) {
                    this.toggleMode();
                } else {
                    this.maxTable = Math.min(12, this.maxTable + 1);
                }
                this.updateDisplay();
                break;
            case 'Enter':
            case ' ':
                this.startGame();
                break;
        }
    }

    toggleMode() {
        this.mode = this.mode === 'multiplication' ? 'addition' : 'multiplication';
    }

    updateDisplay() {
        // Mode value
        const modeLabel = this.mode === 'multiplication' ? 'MULTIPLICATIONS' : 'ADDITIONS';
        this.modeValue.setText(modeLabel);
        this.modeValue.setTint(this.mode === 'multiplication' ? 0x44ff44 : 0x44aaff);

        // Range label adapts to mode
        const rangeLabel = this.mode === 'multiplication' ? 'TABLE MAX' : 'NOMBRE MAX';
        this.rangeLabel.setText(rangeLabel);
        this.rangeValue.setText(`${this.maxTable}`);

        // Difficulty indicator
        const multiplier = this.maxTable / 10;
        const diffLabel = multiplier < 0.7
            ? 'DIFFICULTE: FACILE'
            : multiplier < 1.0
                ? 'DIFFICULTE: NORMALE'
                : multiplier < 1.15
                    ? 'DIFFICULTE: DIFFICILE'
                    : 'DIFFICULTE: EXTREME!';
        this.diffText.setText(`${diffLabel}  (score x${multiplier.toFixed(1)})`);

        // Highlight selected option
        const selectedColor = 0xffd700;
        const unselectedColor = 0xffffff;

        if (this.selectedOption === 0) {
            this.modeLabel.setTint(selectedColor);
            this.leftArrow1.setTint(selectedColor);
            this.rightArrow1.setTint(selectedColor);
            this.rangeLabel.setTint(unselectedColor);
            this.leftArrow2.setTint(unselectedColor);
            this.rightArrow2.setTint(unselectedColor);
        } else {
            this.modeLabel.setTint(unselectedColor);
            this.leftArrow1.setTint(unselectedColor);
            this.rightArrow1.setTint(unselectedColor);
            this.rangeLabel.setTint(selectedColor);
            this.leftArrow2.setTint(selectedColor);
            this.rightArrow2.setTint(selectedColor);
        }
    }

    startGame() {
        this.game.registry.set('gameConfig', {
            maxTable: this.maxTable,
            mode: this.mode
        });

        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }

    shutdown() {
        this.input.keyboard.off('keydown', this.handleKey, this);
    }
}

