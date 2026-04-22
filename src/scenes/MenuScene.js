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
            .setOrigin(0, 0);

        // Title background
        this.add.rectangle(0, centerY - 60, this.scale.width, 140, 0x2d2d44)
            .setOrigin(0, 0.5)
            .setAlpha(0.9);

        // Game title
        const title = this.add.bitmapText(centerX, centerY - 60, "knighthawks", "DONJON\nDES MATHS", 48, 1)
            .setOrigin(0.5, 0.5);
        title.postFX.addShine(1, 0.2, 5);

        // Instructions background
        this.add.rectangle(0, centerY + 80, this.scale.width, 100, 0x000000)
            .setOrigin(0, 0.5)
            .setAlpha(0.7);

        // Instructions
        this.add.bitmapText(centerX, centerY + 50, "pixelfont", "EXPLORE LE DONJON", 20)
            .setOrigin(0.5, 0.5);
        this.add.bitmapText(centerX, centerY + 80, "pixelfont", "RESOUS LES MULTIPLICATIONS", 20)
            .setOrigin(0.5, 0.5);
        this.add.bitmapText(centerX, centerY + 110, "pixelfont", "VAINCS LES MONSTRES", 20)
            .setOrigin(0.5, 0.5);

        // Start prompt
        const startText = this.add.bitmapText(centerX, centerY + 180, "pixelfont", "APPUIE SUR ENTREE", 24)
            .setOrigin(0.5, 0.5);

        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Start on Enter or click
        this.input.keyboard.on('keydown-ENTER', () => this.startGame());
        this.input.keyboard.on('keydown-SPACE', () => this.startGame());
        this.input.on("pointerdown", () => this.startGame());
    }

    startGame() {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("GameScene");
        });
    }
}