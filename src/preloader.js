import * as Phaser from 'phaser';

export class Preloader extends Phaser.Scene {
    constructor() {
        super({ key: "Preloader" });
    }

    preload() {
        this.load.setPath("assets");
        
        // Fonts
        this.load.bitmapFont("pixelfont", "fonts/pixelfont.png", "fonts/pixelfont.xml");
        this.load.image("knighthawks", "fonts/knight3.png");

        this.load.on("progress", (progress) => {
            console.log("Loading: " + Math.round(progress * 100) + "%");
        });
    }

    create() {
        // Create bitmap font
        const config = {
            image: 'knighthawks',
            width: 31,
            height: 25,
            chars: Phaser.GameObjects.RetroFont.TEXT_SET6,
            charsPerRow: 10,
            spacing: { x: 1, y: 1 }
        };
        this.cache.bitmapFont.add('knighthawks', Phaser.GameObjects.RetroFont.Parse(this, config));

        // Generate dungeon sprites procedurally
        this.generateSprites();

        this.scene.start("MenuScene");
    }

    generateSprites() {
        const tileSize = 32;

        // Floor tile - stone pattern
        const floorGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        floorGraphics.fillStyle(0x3d3d5c);
        floorGraphics.fillRect(0, 0, tileSize, tileSize);
        floorGraphics.fillStyle(0x4a4a6a);
        floorGraphics.fillRect(2, 2, tileSize - 4, tileSize - 4);
        floorGraphics.fillStyle(0x525278);
        floorGraphics.fillRect(4, 4, 8, 8);
        floorGraphics.fillRect(18, 18, 8, 8);
        floorGraphics.generateTexture('floor-tile', tileSize, tileSize);

        // Wall tile - darker brick
        const wallGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        wallGraphics.fillStyle(0x1a1a2e);
        wallGraphics.fillRect(0, 0, tileSize, tileSize);
        wallGraphics.fillStyle(0x2d2d44);
        wallGraphics.fillRect(1, 1, 14, 14);
        wallGraphics.fillRect(17, 17, 14, 14);
        wallGraphics.fillStyle(0x16162b);
        wallGraphics.fillRect(16, 0, 1, tileSize);
        wallGraphics.fillRect(0, 16, tileSize, 1);
        wallGraphics.generateTexture('wall-tile', tileSize, tileSize);

        // Player - knight sprite
        const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        playerGraphics.fillStyle(0x4488ff);
        playerGraphics.fillRect(8, 4, 16, 24); // body
        playerGraphics.fillStyle(0xffcc88);
        playerGraphics.fillRect(10, 6, 12, 10); // face
        playerGraphics.fillStyle(0x6699ff);
        playerGraphics.fillRect(6, 14, 6, 14); // left arm
        playerGraphics.fillRect(20, 14, 6, 14); // right arm
        playerGraphics.fillStyle(0x3366cc);
        playerGraphics.fillRect(10, 24, 5, 8); // left leg
        playerGraphics.fillRect(17, 24, 5, 8); // right leg
        playerGraphics.fillStyle(0xcccccc);
        playerGraphics.fillRect(24, 10, 4, 18); // sword
        playerGraphics.generateTexture('player', tileSize, tileSize);

        // Enemy - monster sprite
        const enemyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        enemyGraphics.fillStyle(0x884422);
        enemyGraphics.fillCircle(16, 16, 14); // body
        enemyGraphics.fillStyle(0xff4444);
        enemyGraphics.fillCircle(10, 12, 4); // left eye
        enemyGraphics.fillCircle(22, 12, 4); // right eye
        enemyGraphics.fillStyle(0x000000);
        enemyGraphics.fillCircle(10, 12, 2); // pupil
        enemyGraphics.fillCircle(22, 12, 2); // pupil
        enemyGraphics.fillStyle(0xffffff);
        enemyGraphics.fillRect(8, 22, 16, 4); // teeth
        enemyGraphics.fillStyle(0x884422);
        enemyGraphics.fillRect(12, 22, 2, 4);
        enemyGraphics.fillRect(18, 22, 2, 4);
        enemyGraphics.generateTexture('enemy', tileSize, tileSize);

        // Door tile
        const doorGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        doorGraphics.fillStyle(0x8b4513);
        doorGraphics.fillRect(0, 0, tileSize, tileSize);
        doorGraphics.fillStyle(0xa0522d);
        doorGraphics.fillRect(2, 2, 12, 28);
        doorGraphics.fillRect(18, 2, 12, 28);
        doorGraphics.fillStyle(0xffd700);
        doorGraphics.fillCircle(24, 16, 3); // handle
        doorGraphics.generateTexture('door-tile', tileSize, tileSize);
    }
}