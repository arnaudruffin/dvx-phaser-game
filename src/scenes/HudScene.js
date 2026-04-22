import { Scene } from "phaser";

export class HudScene extends Scene {
    scoreText = null;
    roomText = null;
    hpBarBg = null;
    hpBarFg = null;
    hpText = null;
    
    constructor() {
        super("HudScene");
    }

    init(data) {
        this.score = data.score || 0;
        this.roomKey = data.room || "0,0";
        this.playerHp = data.playerHp ?? 100;
        this.playerMaxHp = data.playerMaxHp ?? 100;
    }

    create() {
        // Configure camera for HUD overlay (fixed to viewport, no zoom/scroll)
        const camera = this.cameras.main;
        camera.setZoom(1);
        camera.setScroll(0, 0);

        const BAR_X = 10;
        const BAR_Y = 38;
        const BAR_WIDTH = 150;
        const BAR_HEIGHT = 14;

        // Score
        this.scoreText = this.add.bitmapText(10, 10, "pixelfont", `SCORE:${this.score.toString().padStart(6, "0")}`, 24);
        
        // Health bar
        this.hpBarBg = this.add.rectangle(BAR_X, BAR_Y, BAR_WIDTH, BAR_HEIGHT, 0x333333).setOrigin(0, 0);
        this.hpBarFg = this.add.rectangle(BAR_X, BAR_Y, BAR_WIDTH, BAR_HEIGHT, this._getHpColor()).setOrigin(0, 0);
        this.hpText = this.add.bitmapText(BAR_X + BAR_WIDTH + 8, BAR_Y - 1, "pixelfont", `PV:${this.playerHp}/${this.playerMaxHp}`, 16);

        // Room indicator
        this.roomText = this.add.bitmapText(this.scale.width - 10, 10, "pixelfont", `SALLE:${this.roomKey}`, 24)
            .setOrigin(1, 0);
        
        // Instructions
        this.add.bitmapText(10, this.scale.height - 30, "pixelfont", "FLECHES:BOUGER  TOUCHE UN MONSTRE:COMBAT", 16)
            .setAlpha(0.7);
        
        // Listen for window resize to update layout
        this.scale.on('resize', this.handleResize, this);
    }
    
    handleResize(gameSize) {
        // Update room text position on resize
        if (this.roomText) {
            this.roomText.setPosition(gameSize.width - 10, 10);
        }
    }

    _getHpColor(hp, maxHp) {
        const pct = (hp ?? this.playerHp) / (maxHp ?? this.playerMaxHp);
        if (pct > 0.6) return 0x44ff44;
        if (pct > 0.3) return 0xffcc00;
        return 0xff4444;
    }

    updateHealth(currentHp, maxHp) {
        this.playerHp = currentHp;
        this.playerMaxHp = maxHp;

        const pct = Math.max(0, Math.min(1, currentHp / maxHp));
        const color = this._getHpColor(currentHp, maxHp);

        // Smooth bar width animation
        this.tweens.add({
            targets: this.hpBarFg,
            scaleX: pct,
            duration: 300,
            ease: "Power2"
        });

        // Flash red on damage then set correct color
        this.hpBarFg.setFillStyle(0xff4444);
        this.time.delayedCall(150, () => {
            this.hpBarFg.setFillStyle(color);
        });

        this.hpText.setText(`PV:${currentHp}/${maxHp}`);
    }

    updateScore(score) {
        this.score = score;
        this.scoreText.setText(`SCORE:${score.toString().padStart(6, "0")}`);
    }

    updateRoom(roomKey) {
        this.roomKey = roomKey;
        this.roomText.setText(`SALLE:${roomKey}`);
    }
}