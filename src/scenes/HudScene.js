import { Scene } from "phaser";

export class HudScene extends Scene {
    scoreText = null;
    roomText = null;
    
    constructor() {
        super("HudScene");
    }

    init(data) {
        this.score = data.score || 0;
        this.roomKey = data.room || "0,0";
    }

    create() {
        // Score
        this.scoreText = this.add.bitmapText(10, 10, "pixelfont", `SCORE:${this.score.toString().padStart(6, "0")}`, 24);
        
        // Room indicator
        this.roomText = this.add.bitmapText(this.scale.width - 10, 10, "pixelfont", `SALLE:${this.roomKey}`, 24)
            .setOrigin(1, 0);
        
        // Instructions
        this.add.bitmapText(10, this.scale.height - 30, "pixelfont", "FLECHES:BOUGER  TOUCHE UN MONSTRE:COMBAT", 16)
            .setAlpha(0.7);
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