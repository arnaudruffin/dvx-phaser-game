import { Physics } from "phaser";

export class Enemy extends Physics.Arcade.Image {
    isDefeated = false;

    static ENEMY_TYPES = {
        gobelin: {
            texture: 'enemy-gobelin',
            name: 'Gobelin',
            maxHp: 30,
            damage: 8,
            rounds: 2,
            minTable: 1,
            maxTable: 5,
            scoreValue: 100
        },
        squelette: {
            texture: 'enemy-squelette',
            name: 'Squelette',
            maxHp: 50,
            damage: 12,
            rounds: 3,
            minTable: 3,
            maxTable: 7,
            scoreValue: 200
        },
        ogre: {
            texture: 'enemy-ogre',
            name: 'Ogre',
            maxHp: 80,
            damage: 20,
            rounds: 4,
            minTable: 5,
            maxTable: 10,
            scoreValue: 350
        },
        'boss-gobelin': {
            texture: 'boss-gobelin',
            name: 'Chef Gobelin',
            maxHp: 50,
            damage: 15,
            rounds: 3,
            minTable: 2,
            maxTable: 7,
            scoreValue: 400,
            isBoss: true
        },
        'boss-troll': {
            texture: 'boss-troll',
            name: 'Troll des Cavernes',
            maxHp: 120,
            damage: 30,
            rounds: 5,
            minTable: 5,
            maxTable: 10,
            scoreValue: 800,
            isBoss: true
        },
        'boss-dragon': {
            texture: 'boss-dragon',
            name: 'Dragon Ancien',
            maxHp: 180,
            damage: 45,
            rounds: 6,
            minTable: 7,
            maxTable: 10,
            scoreValue: 1500,
            isBoss: true
        }
    };

    constructor(scene, x, y, type = 'gobelin') {
        const config = Enemy.ENEMY_TYPES[type] || Enemy.ENEMY_TYPES.gobelin;
        super(scene, x, y, config.texture);

        this.enemyType = type;
        this.config = config;
        this.currentHp = config.maxHp;
        
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

    takeDamage(amount) {
        this.currentHp = Math.max(0, this.currentHp - amount);
        return this.currentHp;
    }

    isAlive() {
        return this.currentHp > 0;
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
