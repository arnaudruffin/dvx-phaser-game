import { Physics } from "phaser";

export class Enemy extends Physics.Arcade.Image {
    isDefeated = false;

    constructor(scene, x, y) {
        super(scene, x, y, "enemy");
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body.setSize(28, 28);
        this.body.setOffset(2, 2);
        this.setImmovable(true);
        
        // Idle animation - slight bobbing
        scene.tweens.add({
            targets: this,
            y: y - 4,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    defeat() {
        this.isDefeated = true;
        
        // Death animation
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 1.5,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                this.destroy();
            }
        });
    }
}
