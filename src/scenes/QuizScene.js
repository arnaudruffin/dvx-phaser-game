import { Scene } from "phaser";
import { QuizManager } from "../systems/QuizManager";

export class QuizScene extends Scene {
    constructor() {
        super("QuizScene");
    }

    init(data) {
        this.playerHp = data.playerHp;
        this.playerMaxHp = data.playerMaxHp;
        this.enemyType = data.enemyType;
        this.enemyConfig = data.enemyConfig;
        this.enemyHp = data.enemyCurrentHp;
        this.enemyMaxHp = data.enemyConfig.maxHp;

        this.quizManager = new QuizManager(data.enemyConfig.minTable, data.enemyConfig.maxTable);

        this.currentRound = 0;
        this.maxRounds = data.enemyConfig.rounds;
        this.totalScore = 0;
        this.currentAnswer = "";
        this.inputEnabled = false;
        this.lastAnswerCorrect = true;
        this.state = 'intro';
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // Store dimensions for use in other methods
        this.screenW = W;
        this.screenH = H;

        // Dark background
        this.add.rectangle(0, 0, W, H, 0x0a0a1a).setOrigin(0, 0).setDepth(0);

        // --- Player sprite (left side) ---
        this.playerSprite = this.add.image(-80, H * 0.3, 'player').setScale(3).setDepth(2);
        this.playerBaseX = W * 0.2;

        // --- Enemy sprite (right side) ---
        this.enemySprite = this.add.image(W + 80, H * 0.3, this.enemyConfig.texture).setScale(3).setDepth(2);
        this.enemyBaseX = W * 0.8;

        // --- Player HP bar ---
        this.createHpBar(W * 0.15, H * 0.45, 180, 'player');
        // --- Enemy HP bar ---
        this.createHpBar(W * 0.65, H * 0.45, 180, 'enemy');

        // Names
        this.playerNameText = this.add.bitmapText(W * 0.2, H * 0.52, "pixelfont", "CHEVALIER", 16).setOrigin(0.5, 0).setDepth(5);
        this.enemyNameText = this.add.bitmapText(W * 0.8, H * 0.52, "pixelfont", this.enemyConfig.name.toUpperCase(), 16).setOrigin(0.5, 0).setDepth(5);

        // --- Question panel (hidden initially) ---
        this.questionPanel = this.add.rectangle(W / 2, H * 0.55, W * 0.6, H * 0.3, 0x2d2d44)
            .setStrokeStyle(3, 0x6666aa).setDepth(5).setAlpha(0);

        this.questionText = this.add.bitmapText(W / 2, H * 0.48, "pixelfont", "", 32)
            .setOrigin(0.5, 0.5).setDepth(6).setAlpha(0);

        // Answer input box
        this.answerBox = this.add.rectangle(W / 2, H * 0.57, W * 0.25, H * 0.08, 0x1a1a2e)
            .setStrokeStyle(2, 0xffffff).setDepth(6).setAlpha(0);
        this.answerText = this.add.bitmapText(W / 2, H * 0.57, "pixelfont", "_", 36)
            .setOrigin(0.5, 0.5).setDepth(7).setAlpha(0);

        this.instructionText = this.add.bitmapText(W / 2, H * 0.67, "pixelfont", "TAPE TA REPONSE", 16)
            .setOrigin(0.5, 0.5).setDepth(6).setAlpha(0);

        // --- Round counter (bottom-left) ---
        this.roundText = this.add.bitmapText(20, H - 30, "pixelfont", "", 18)
            .setDepth(5).setAlpha(0);

        // --- Feedback text (reusable, hidden) ---
        this.feedbackText = this.add.bitmapText(W / 2, H - 30, "pixelfont", "", 20)
            .setOrigin(0.5, 0.5).setDepth(10).setAlpha(0);

        // Keyboard
        this.input.keyboard.on('keydown', this.handleKeyInput, this);

        // Listen for window resize
        this.scale.on('resize', (gameSize) => this.handleResize(gameSize));

        // Start intro
        this.playIntro();
    }

    handleResize(gameSize) {
        this.screenW = gameSize.width;
        this.screenH = gameSize.height;
        
        // Update sprite positions
        this.playerBaseX = gameSize.width * 0.2;
        this.enemyBaseX = gameSize.width * 0.8;
        this.playerSprite.setPosition(this.playerBaseX, gameSize.height * 0.3);
        this.enemySprite.setPosition(this.enemyBaseX, gameSize.height * 0.3);
        
        // Update UI elements positions
        if (this.playerNameText) this.playerNameText.setPosition(gameSize.width * 0.2, gameSize.height * 0.52);
        if (this.enemyNameText) this.enemyNameText.setPosition(gameSize.width * 0.8, gameSize.height * 0.52);
        if (this.questionPanel) {
            this.questionPanel.setPosition(gameSize.width / 2, gameSize.height * 0.55);
            this.questionPanel.setDisplaySize(gameSize.width * 0.6, gameSize.height * 0.3);
        }
        if (this.questionText) this.questionText.setPosition(gameSize.width / 2, gameSize.height * 0.48);
        if (this.answerBox) {
            this.answerBox.setPosition(gameSize.width / 2, gameSize.height * 0.57);
            this.answerBox.setDisplaySize(gameSize.width * 0.25, gameSize.height * 0.08);
        }
        if (this.answerText) this.answerText.setPosition(gameSize.width / 2, gameSize.height * 0.57);
        if (this.instructionText) this.instructionText.setPosition(gameSize.width / 2, gameSize.height * 0.67);
        if (this.feedbackText) this.feedbackText.setPosition(gameSize.width / 2, gameSize.height - 30);
    }

    // ---- HP BAR SYSTEM ----
    createHpBar(x, y, width, who) {
        const barHeight = 16;
        const bg = this.add.rectangle(x, y, width, barHeight, 0x333333).setOrigin(0, 0.5).setDepth(4);
        const fg = this.add.rectangle(x, y, width, barHeight, 0x44cc44).setOrigin(0, 0.5).setDepth(5);

        const hp = who === 'player' ? this.playerHp : this.enemyHp;
        const maxHp = who === 'player' ? this.playerMaxHp : this.enemyMaxHp;
        const txt = this.add.bitmapText(x + width / 2, y, "pixelfont", `PV:${hp}/${maxHp}`, 14)
            .setOrigin(0.5, 0.5).setDepth(6);

        if (who === 'player') {
            this.playerHpBg = bg;
            this.playerHpFg = fg;
            this.playerHpText = txt;
            this.playerHpBarWidth = width;
        } else {
            this.enemyHpBg = bg;
            this.enemyHpFg = fg;
            this.enemyHpText = txt;
            this.enemyHpBarWidth = width;
        }
        this.updateHpBarColor(fg, hp / maxHp);
    }

    updateHpBar(who, currentHp, maxHp) {
        const ratio = Math.max(0, currentHp / maxHp);
        const fg = who === 'player' ? this.playerHpFg : this.enemyHpFg;
        const txt = who === 'player' ? this.playerHpText : this.enemyHpText;
        const barWidth = who === 'player' ? this.playerHpBarWidth : this.enemyHpBarWidth;

        this.tweens.add({
            targets: fg,
            displayWidth: barWidth * ratio,
            duration: 400,
            ease: 'Power2'
        });
        this.updateHpBarColor(fg, ratio);
        txt.setText(`PV:${currentHp}/${maxHp}`);
    }

    updateHpBarColor(bar, ratio) {
        if (ratio > 0.6) bar.setFillStyle(0x44cc44);
        else if (ratio > 0.3) bar.setFillStyle(0xcccc44);
        else bar.setFillStyle(0xcc4444);
    }

    // ---- STATE MACHINE ----

    playIntro() {
        this.state = 'intro';

        // Play combat start sound
        if (this.game.soundManager) {
            this.game.soundManager.playSound('combat-start');
        }

        // Slide sprites in
        this.tweens.add({
            targets: this.playerSprite,
            x: this.playerBaseX,
            duration: 500,
            ease: 'Back.easeOut'
        });
        this.tweens.add({
            targets: this.enemySprite,
            x: this.enemyBaseX,
            duration: 500,
            ease: 'Back.easeOut'
        });

        // Big "COMBAT!" text
        const combatText = this.add.bitmapText(this.scale.width / 2, this.scale.height * 0.25, "pixelfont", "COMBAT!", 48)
            .setOrigin(0.5, 0.5).setDepth(20).setScale(2).setAlpha(0);

        this.tweens.add({
            targets: combatText,
            scale: 1,
            alpha: 1,
            duration: 400,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(400, () => {
                    this.tweens.add({
                        targets: combatText,
                        alpha: 0,
                        duration: 300,
                        onComplete: () => {
                            combatText.destroy();
                            this.startNextRound();
                        }
                    });
                });
            }
        });
    }

    startNextRound() {
        this.currentRound++;

        if (this.enemyHp <= 0) {
            this.playVictory();
            return;
        }
        if (this.playerHp <= 0) {
            this.playDefeat();
            return;
        }
        if (this.currentRound > this.maxRounds) {
            // Rounds exhausted — enemy survives
            this.endCombat(false);
            return;
        }

        this.roundText.setText(`ROUND ${this.currentRound}/${this.maxRounds}`).setAlpha(1);
        this.showQuestion();
    }

    showQuestion() {
        this.state = 'question';
        this.currentQuestion = this.quizManager.generateQuestion();
        this.currentAnswer = "";
        this.questionStartTime = this.time.now;

        // Show panel elements
        this.questionPanel.setAlpha(1);
        this.questionText.setText(this.currentQuestion.text).setAlpha(1);
        this.answerBox.setAlpha(1);
        this.answerText.setText("_").setAlpha(1);
        this.instructionText.setAlpha(1);
        this.feedbackText.setAlpha(0);

        this.inputEnabled = true;
    }

    hideQuestion() {
        this.inputEnabled = false;
        this.questionPanel.setAlpha(0);
        this.questionText.setAlpha(0);
        this.answerBox.setAlpha(0);
        this.answerText.setAlpha(0);
        this.instructionText.setAlpha(0);
    }

    submitAnswer() {
        if (this.state !== 'question' || !this.inputEnabled) return;
        this.inputEnabled = false;

        const elapsed = (this.time.now - this.questionStartTime) / 1000;
        const isCorrect = this.quizManager.checkAnswer(this.currentQuestion, this.currentAnswer);
        const result = this.quizManager.calculateDamage(elapsed, isCorrect);
        this.lastAnswerCorrect = isCorrect;

        // Play answer sound
        if (this.game.soundManager) {
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
        }

        if (isCorrect) {
            this.totalScore += this.quizManager.calculateTimeBonus(elapsed);
        }

        this.hideQuestion();
        this.playPlayerAttack(result);
    }

    // ---- ATTACK ANIMATIONS ----

    playPlayerAttack(result) {
        this.state = 'player_attack';
        const targetX = this.playerBaseX + 60;

        // Play attack sound
        if (this.game.soundManager) {
            this.game.soundManager.playSound('player-attack');
        }

        // Lunge toward enemy
        this.tweens.add({
            targets: this.playerSprite,
            x: targetX,
            duration: 200,
            ease: 'Power2',
            yoyo: true,
            onYoyo: () => {
                // Apply damage to enemy
                this.enemyHp = Math.max(0, this.enemyHp - result.damage);
                this.updateHpBar('enemy', this.enemyHp, this.enemyMaxHp);

                // Flash enemy red
                this.flashSprite(this.enemySprite);

                // Show damage tier feedback
                this.showDamageTier(result, this.enemyBaseX, 130);

                // Screen shake on critical
                if (result.tier === 'critical') {
                    this.cameras.main.shake(200, 0.01);
                }
            },
            onComplete: () => {
                // After player attack, enemy attacks
                this.time.delayedCall(800, () => {
                    if (this.enemyHp <= 0) {
                        this.playVictory();
                    } else {
                        this.playEnemyAttack();
                    }
                });
            }
        });
    }

    playEnemyAttack() {
        this.state = 'enemy_attack';
        const targetX = this.enemyBaseX - 60;
        let dmg = this.enemyConfig.damage;

        // Double damage if player got last answer wrong
        if (!this.lastAnswerCorrect) {
            dmg *= 2;
        }

        // Play enemy attack sound
        if (this.game.soundManager) {
            this.game.soundManager.playSound('enemy-attack');
        }

        this.tweens.add({
            targets: this.enemySprite,
            x: targetX,
            duration: 200,
            ease: 'Power2',
            yoyo: true,
            onYoyo: () => {
                this.playerHp = Math.max(0, this.playerHp - dmg);
                this.updateHpBar('player', this.playerHp, this.playerMaxHp);

                this.flashSprite(this.playerSprite);
                this.showFloatingDamage(`-${dmg}`, this.playerBaseX, 130, 0xff4444);
            },
            onComplete: () => {
                this.time.delayedCall(500, () => {
                    if (this.playerHp <= 0) {
                        this.playDefeat();
                    } else {
                        this.startNextRound();
                    }
                });
            }
        });
    }

    // ---- VISUAL EFFECTS ----

    flashSprite(sprite) {
        sprite.setTint(0xff0000);
        this.time.delayedCall(150, () => {
            sprite.clearTint();
        });
    }

    showDamageTier(result, x, y) {
        let text, color, fontSize;

        switch (result.tier) {
            case 'critical':
                text = `CRITIQUE! -${result.damage}`;
                color = 0xffd700;
                fontSize = 28;
                break;
            case 'strong':
                text = `BON COUP! -${result.damage}`;
                color = 0xffffff;
                fontSize = 24;
                break;
            case 'normal':
                text = `-${result.damage}`;
                color = 0xaaaaaa;
                fontSize = 22;
                break;
            case 'weak':
                text = `FAIBLE... -${result.damage}`;
                color = 0x888888;
                fontSize = 18;
                break;
            case 'miss':
                text = "RATE!";
                color = 0xff4444;
                fontSize = 24;
                break;
        }

        const dmgText = this.add.bitmapText(x, y, "pixelfont", text, fontSize)
            .setOrigin(0.5, 0.5).setTint(color).setDepth(15);

        // Scale bounce for critical
        if (result.tier === 'critical') {
            dmgText.setScale(2);
            this.tweens.add({
                targets: dmgText,
                scale: 1,
                duration: 300,
                ease: 'Bounce.easeOut'
            });
        }

        // Float up and fade
        this.tweens.add({
            targets: dmgText,
            y: y - 40,
            alpha: 0,
            duration: 800,
            delay: result.tier === 'critical' ? 300 : 0,
            onComplete: () => dmgText.destroy()
        });
    }

    showFloatingDamage(text, x, y, color) {
        const dmgText = this.add.bitmapText(x, y, "pixelfont", text, 22)
            .setOrigin(0.5, 0.5).setTint(color).setDepth(15);

        this.tweens.add({
            targets: dmgText,
            y: y - 40,
            alpha: 0,
            duration: 800,
            onComplete: () => dmgText.destroy()
        });
    }

    // ---- END STATES ----

    playVictory() {
        this.state = 'victory';
        this.totalScore += this.enemyConfig.scoreValue;

        // Play victory sound
        if (this.game.soundManager) {
            this.game.soundManager.playSound('victory');
        }

        // Enemy explodes
        this.tweens.add({
            targets: this.enemySprite,
            scale: 6,
            alpha: 0,
            duration: 600,
            ease: 'Power2'
        });

        const vicText = this.add.bitmapText(this.scale.width / 2, this.scale.height * 0.25, "pixelfont", "VICTOIRE!", 40)
            .setOrigin(0.5, 0.5).setTint(0xffd700).setDepth(20).setAlpha(0);

        const scoreText = this.add.bitmapText(this.scale.width / 2, this.scale.height * 0.35, "pixelfont", `+${this.totalScore} PTS`, 24)
            .setOrigin(0.5, 0.5).setTint(0xffd700).setDepth(20).setAlpha(0);

        this.tweens.add({
            targets: vicText,
            alpha: 1,
            scale: { from: 2, to: 1 },
            duration: 400,
            ease: 'Back.easeOut'
        });
        this.tweens.add({
            targets: scoreText,
            alpha: 1,
            duration: 400,
            delay: 300
        });

        this.time.delayedCall(1500, () => this.endCombat(true));
    }

    playDefeat() {
        this.state = 'defeat';

        // Play defeat sound
        if (this.game.soundManager) {
            this.game.soundManager.playSound('defeat');
        }

        this.tweens.add({
            targets: this.playerSprite,
            alpha: 0,
            duration: 600
        });

        const defText = this.add.bitmapText(this.scale.width / 2, this.scale.height * 0.25, "pixelfont", "DEFAITE...", 40)
            .setOrigin(0.5, 0.5).setTint(0xff4444).setDepth(20).setAlpha(0);

        this.tweens.add({
            targets: defText,
            alpha: 1,
            duration: 400
        });

        this.time.delayedCall(1500, () => this.endCombat(false));
    }

    endCombat(enemyDefeated) {
        this.game.events.emit("quiz-answer", {
            correct: enemyDefeated,
            playerHpRemaining: this.playerHp,
            score: this.totalScore,
            enemyDefeated: enemyDefeated
        });
        this.scene.stop();
    }

    // ---- INPUT ----

    handleKeyInput(event) {
        if (!this.inputEnabled) return;
        const key = event.key;

        if (/^[0-9]$/.test(key) && this.currentAnswer.length < 3) {
            this.currentAnswer += key;
            this.answerText.setText(this.currentAnswer);
        }

        if (key === 'Backspace' && this.currentAnswer.length > 0) {
            this.currentAnswer = this.currentAnswer.slice(0, -1);
            this.answerText.setText(this.currentAnswer || "_");
        }

        if (key === 'Enter' && this.currentAnswer.length > 0) {
            this.submitAnswer();
        }
    }

    shutdown() {
        this.input.keyboard.off('keydown', this.handleKeyInput, this);
    }
}
