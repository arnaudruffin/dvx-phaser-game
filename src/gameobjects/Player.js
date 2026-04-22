import { Physics } from "phaser";

export class Player extends Physics.Arcade.Image {
    speed = 160;
    maxHp = 100;
    currentHp = 100;

    constructor(scene, x, y) {
        super(scene, x, y, "player");
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.setCollideWorldBounds(false);
        this.body.setSize(24, 24);
        this.body.setOffset(4, 4);
        this.setDepth(10);
    }

    update(cursors) {
        this.body.setVelocity(0);

        if (cursors.left.isDown) {
            this.body.setVelocityX(-this.speed);
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.speed);
        }

        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.speed);
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.speed);
        }

        // Normalize diagonal movement
        this.body.velocity.normalize().scale(this.speed);
    }

    takeDamage(amount) {
        this.currentHp = Math.max(0, this.currentHp - amount);
    }

    heal(amount) {
        this.currentHp = Math.min(this.maxHp, this.currentHp + amount);
    }

    isAlive() {
        return this.currentHp > 0;
    }

    getHpPercent() {
        return this.currentHp / this.maxHp;
    }
}