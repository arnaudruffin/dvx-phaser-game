import { Scene } from "phaser";

export class GameOverScene extends Scene {
    finalScore = 0;
    enemiesDefeated = 0;
    
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.finalScore = data.score || 0;
        this.enemiesDefeated = data.enemiesDefeated || 0;
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
        
        // Stats panel
        this.add.rectangle(0, centerY + 90, this.scale.width, 140, 0x000000)
            .setOrigin(0, 0.5)
            .setAlpha(0.7);
        
        // Final score
        this.add.bitmapText(centerX, centerY + 50, "pixelfont", "TON SCORE", 20)
            .setOrigin(0.5, 0.5);
        this.add.bitmapText(centerX, centerY + 80, "pixelfont", this.finalScore.toString().padStart(6, "0"), 36)
            .setOrigin(0.5, 0.5);
        
        // Enemies defeated
        this.add.bitmapText(centerX, centerY + 125, "pixelfont", `MONSTRES VAINCUS: ${this.enemiesDefeated}`, 20)
            .setOrigin(0.5, 0.5);
        
        // Restart prompt
        const restartText = this.add.bitmapText(centerX, centerY + 200, "pixelfont", "ENTREE POUR REJOUER", 24)
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
        // Play menu click sound
        if (this.game.soundManager) {
            this.game.soundManager.playSound('menu-click');
        }

        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("MenuScene");
        });
    }
}