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
            maxTable: 4,
            scoreValue: 100,
            xpValue: 80,
            minLevel: 1
        },
        'loup-garou': {
            texture: 'enemy-loup-garou',
            name: 'Loup-Garou',
            maxHp: 40,
            damage: 10,
            rounds: 2,
            minTable: 2,
            maxTable: 5,
            scoreValue: 150,
            xpValue: 130,
            minLevel: 2
        },
        squelette: {
            texture: 'enemy-squelette',
            name: 'Squelette',
            maxHp: 50,
            damage: 12,
            rounds: 3,
            minTable: 3,
            maxTable: 6,
            scoreValue: 200,
            xpValue: 180,
            minLevel: 3
        },
        'chevalier-noir': {
            texture: 'enemy-chevalier-noir',
            name: 'Chevalier Noir',
            maxHp: 65,
            damage: 16,
            rounds: 3,
            minTable: 4,
            maxTable: 8,
            scoreValue: 280,
            xpValue: 280,
            minLevel: 4
        },
        ogre: {
            texture: 'enemy-ogre',
            name: 'Ogre',
            maxHp: 80,
            damage: 20,
            rounds: 4,
            minTable: 5,
            maxTable: 9,
            scoreValue: 350,
            xpValue: 380,
            minLevel: 5
        },
        liche: {
            texture: 'enemy-liche',
            name: 'Liche',
            maxHp: 100,
            damage: 25,
            rounds: 4,
            minTable: 6,
            maxTable: 10,
            scoreValue: 500,
            xpValue: 520,
            minLevel: 6
        },
        demon: {
            texture: 'enemy-demon',
            name: 'Démon',
            maxHp: 130,
            damage: 35,
            rounds: 5,
            minTable: 8,
            maxTable: 10,
            scoreValue: 700,
            xpValue: 720,
            minLevel: 7
        },
        vampire: {
            texture: 'enemy-vampire',
            name: 'Vampire',
            maxHp: 150,
            damage: 42,
            rounds: 5,
            minTable: 8,
            maxTable: 10,
            scoreValue: 900,
            xpValue: 950,
            minLevel: 8
        },
        golem: {
            texture: 'enemy-golem',
            name: 'Golem de Pierre',
            maxHp: 170,
            damage: 50,
            rounds: 5,
            minTable: 9,
            maxTable: 10,
            scoreValue: 1100,
            xpValue: 1200,
            minLevel: 9
        },
        necromancien: {
            texture: 'enemy-necromancien',
            name: 'Nécromancien',
            maxHp: 195,
            damage: 58,
            rounds: 6,
            minTable: 9,
            maxTable: 10,
            scoreValue: 1350,
            xpValue: 1500,
            minLevel: 10
        },
        hydre: {
            texture: 'enemy-hydre',
            name: 'Hydre',
            maxHp: 220,
            damage: 66,
            rounds: 6,
            minTable: 10,
            maxTable: 10,
            scoreValue: 1600,
            xpValue: 1800,
            minLevel: 11
        },
        chimere: {
            texture: 'enemy-chimere',
            name: 'Chimère',
            maxHp: 245,
            damage: 74,
            rounds: 6,
            minTable: 10,
            maxTable: 10,
            scoreValue: 1900,
            xpValue: 2200,
            minLevel: 12
        },
        'sorciere-noire': {
            texture: 'enemy-sorciere-noire',
            name: 'Sorcière Noire',
            maxHp: 275,
            damage: 85,
            rounds: 6,
            minTable: 10,
            maxTable: 10,
            scoreValue: 2200,
            xpValue: 2700,
            minLevel: 13
        },
        'ange-dechu': {
            texture: 'enemy-ange-dechu',
            name: 'Ange Déchu',
            maxHp: 310,
            damage: 98,
            rounds: 7,
            minTable: 10,
            maxTable: 10,
            scoreValue: 2600,
            xpValue: 3300,
            minLevel: 14
        },
        'titan-feu': {
            texture: 'enemy-titan-feu',
            name: 'Titan de Feu',
            maxHp: 360,
            damage: 115,
            rounds: 7,
            minTable: 10,
            maxTable: 10,
            scoreValue: 3100,
            xpValue: 4000,
            minLevel: 15
        },
        archidemon: {
            texture: 'enemy-archidemon',
            name: 'Archidémon',
            maxHp: 420,
            damage: 140,
            rounds: 7,
            minTable: 10,
            maxTable: 10,
            scoreValue: 3700,
            xpValue: 4900,
            minLevel: 16
        },
        'dieu-mort': {
            texture: 'enemy-dieu-mort',
            name: 'Dieu de la Mort',
            maxHp: 500,
            damage: 170,
            rounds: 8,
            minTable: 10,
            maxTable: 10,
            scoreValue: 4500,
            xpValue: 6000,
            minLevel: 17
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
            xpValue: 500,
            isBoss: true,
            minLevel: 1
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
            xpValue: 1000,
            isBoss: true,
            minLevel: 3
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
            xpValue: 2000,
            isBoss: true,
            minLevel: 6
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
