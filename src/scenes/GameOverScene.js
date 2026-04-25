import { Scene } from "phaser";

const MAX_NAME_LENGTH = 10;

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

        // Decide flow: high score input vs straight replay
        const hsm = this.game.highScoreManager;
        if (hsm && hsm.isHighScore(this.finalScore)) {
            this.time.delayedCall(300, () => this._showNameInput(centerX, centerY));
        } else {
            this._showHighScores(centerX, centerY + 195, null);
            this._addRestartPrompt(centerX, centerY + 340);
        }
    }

    _showNameInput(centerX, centerY) {
        // "NOUVEAU RECORD !" banner
        const recordText = this.add.bitmapText(centerX, centerY + 175, "pixelfont", "NOUVEAU RECORD !", 22)
            .setOrigin(0.5, 0.5)
            .setTint(0xffd700);
        recordText.postFX.addGlow(0xffd700, 1);

        const labelText = this.add.bitmapText(centerX, centerY + 205, "pixelfont", "TON NOM :", 18)
            .setOrigin(0.5, 0.5);

        let playerName = '';
        const nameDisplay = this.add.bitmapText(centerX, centerY + 235, "pixelfont", "_", 28)
            .setOrigin(0.5, 0.5)
            .setTint(0xffd700);

        const updateDisplay = () => {
            nameDisplay.setText(playerName + '_');
        };

        const hintText = this.add.bitmapText(centerX, centerY + 268, "pixelfont", "ENTREE POUR VALIDER", 14)
            .setOrigin(0.5, 0.5)
            .setAlpha(0.6);

        const nameInputElements = [recordText, labelText, nameDisplay, hintText];

        const allowedChars = /^[A-Za-z0-9 ]$/;

        let keydownHandler;
        keydownHandler = (event) => {
            if (event.key === 'Enter') {
                if (playerName.trim().length === 0) return;
                this.input.keyboard.off('keydown', keydownHandler);
                nameInputElements.forEach(el => el.destroy());
                this._submitScore(playerName.trim(), centerX, centerY);
            } else if (event.key === 'Backspace') {
                playerName = playerName.slice(0, -1);
                updateDisplay();
            } else if (allowedChars.test(event.key) && playerName.length < MAX_NAME_LENGTH) {
                playerName += event.key.toUpperCase();
                updateDisplay();
            }
        };
        this.input.keyboard.on('keydown', keydownHandler);
    }

    _submitScore(name, centerX, centerY) {
        const hsm = this.game.highScoreManager;
        const rank = hsm.addScore(name, this.finalScore, this.enemiesDefeated);
        this._showHighScores(centerX, centerY + 175, rank);
        this._addRestartPrompt(centerX, centerY + 355);
    }

    /** Render the top-5 table. newEntryRank (1-based) is highlighted in gold if set. */
    _showHighScores(centerX, startY, newEntryRank) {
        const hsm = this.game.highScoreManager;
        const scores = hsm ? hsm.getScores() : [];

        this.add.bitmapText(centerX, startY, "pixelfont", "-- MEILLEURS SCORES --", 16)
            .setOrigin(0.5, 0.5)
            .setTint(0xffd700);

        if (scores.length === 0) {
            this.add.bitmapText(centerX, startY + 30, "pixelfont", "PAS ENCORE DE SCORE", 16)
                .setOrigin(0.5, 0.5)
                .setAlpha(0.5);
            return;
        }

        scores.forEach((entry, i) => {
            const y = startY + 30 + i * 28;
            const isNew = newEntryRank === i + 1;
            const color = isNew ? 0xffd700 : 0xffffff;
            const line = `#${i + 1}  ${entry.name.padEnd(10, ' ')}  ${entry.score.toString().padStart(6, '0')}`;
            const t = this.add.bitmapText(centerX, y, "pixelfont", line, 17)
                .setOrigin(0.5, 0.5)
                .setTint(color);
            if (isNew) t.postFX.addGlow(0xffd700, 1);
        });
    }

    _addRestartPrompt(centerX, y) {
        const restartText = this.add.bitmapText(centerX, y, "pixelfont", "ENTREE POUR REJOUER", 24)
            .setOrigin(0.5, 0.5);

        this.tweens.add({
            targets: restartText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.time.delayedCall(300, () => {
            this.input.keyboard.on('keydown-ENTER', () => this.restartGame());
            this.input.keyboard.on('keydown-SPACE', () => this.restartGame());
            this.input.on("pointerdown", () => this.restartGame());
        });
    }

    restartGame() {
        if (this.game.soundManager) {
            this.game.soundManager.playSound('menu-click');
        }
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("MenuScene");
        });
    }
}