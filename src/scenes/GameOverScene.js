import { Scene } from "phaser";

export class GameOverScene extends Scene {
    finalScore = 0;
    
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.finalScore = data.score || 0;
    }

    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        // Background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x1a1a2e)
            .setOrigin(0, 0);
        
        // Title panel
        this.add.rectangle(0, centerY - 40, this.scale.width, 120, 0x2d2d44)
            .setOrigin(0, 0.5)
            .setAlpha(0.9);
        
        // Game Over text
        const gameOverText = this.add.bitmapText(centerX, centerY - 40, "knighthawks", "PARTIE\nTERMINEE", 48, 1)
            .setOrigin(0.5, 0.5);
        gameOverText.postFX.addShine(1, 0.2, 5);
        
        // Score panel
        this.add.rectangle(0, centerY + 80, this.scale.width, 80, 0x000000)
            .setOrigin(0, 0.5)
            .setAlpha(0.7);
        
        // Final score
        this.add.bitmapText(centerX, centerY + 60, "pixelfont", "TON SCORE", 20)
            .setOrigin(0.5, 0.5);
        this.add.bitmapText(centerX, centerY + 90, "pixelfont", this.finalScore.toString().padStart(6, "0"), 36)
            .setOrigin(0.5, 0.5);
        
        // Restart prompt
        const restartText = this.add.bitmapText(centerX, centerY + 180, "pixelfont", "ENTREE POUR REJOUER", 24)
            .setOrigin(0.5, 0.5);
        
        this.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Input after delay
        this.time.delayedCall(500, () => {
            this.input.keyboard.on('keydown-ENTER', () => this.restartGame());
            this.input.keyboard.on('keydown-SPACE', () => this.restartGame());
            this.input.on("pointerdown", () => this.restartGame());
        });
    }

    restartGame() {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("MenuScene");
        });
    }
}