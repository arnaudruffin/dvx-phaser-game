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

        // Enemy - monster sprite (legacy, kept for backward compatibility)
        const enemyGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        enemyGraphics.fillStyle(0x884422);
        enemyGraphics.fillCircle(16, 16, 14);
        enemyGraphics.fillStyle(0xff4444);
        enemyGraphics.fillCircle(10, 12, 4);
        enemyGraphics.fillCircle(22, 12, 4);
        enemyGraphics.fillStyle(0x000000);
        enemyGraphics.fillCircle(10, 12, 2);
        enemyGraphics.fillCircle(22, 12, 2);
        enemyGraphics.fillStyle(0xffffff);
        enemyGraphics.fillRect(8, 22, 16, 4);
        enemyGraphics.fillStyle(0x884422);
        enemyGraphics.fillRect(12, 22, 2, 4);
        enemyGraphics.fillRect(18, 22, 2, 4);
        enemyGraphics.generateTexture('enemy', tileSize, tileSize);

        // Gobelin - small green creature with pointy ears
        const gobelinGfx = this.make.graphics({ x: 0, y: 0, add: false });
        gobelinGfx.fillStyle(0x44aa44);
        gobelinGfx.fillCircle(16, 18, 11); // small body
        gobelinGfx.fillStyle(0x33882e);
        gobelinGfx.fillTriangle(4, 14, 8, 6, 10, 14); // left pointy ear
        gobelinGfx.fillTriangle(22, 14, 24, 6, 28, 14); // right pointy ear
        gobelinGfx.fillStyle(0xffff00);
        gobelinGfx.fillCircle(12, 16, 3); // left eye
        gobelinGfx.fillCircle(20, 16, 3); // right eye
        gobelinGfx.fillStyle(0x000000);
        gobelinGfx.fillCircle(13, 16, 1.5); // left pupil (shifted = mischievous)
        gobelinGfx.fillCircle(21, 16, 1.5); // right pupil
        gobelinGfx.fillStyle(0x226611);
        gobelinGfx.fillTriangle(15, 18, 17, 18, 16, 21); // small nose
        gobelinGfx.fillStyle(0xcc2222);
        gobelinGfx.fillRect(11, 24, 10, 2); // grin
        gobelinGfx.generateTexture('enemy-gobelin', tileSize, tileSize);

        // Squelette - white skull with hollow eyes
        const squeletteGfx = this.make.graphics({ x: 0, y: 0, add: false });
        squeletteGfx.fillStyle(0xddddcc);
        squeletteGfx.fillCircle(16, 14, 12); // skull top
        squeletteGfx.fillRect(10, 14, 12, 10); // jaw area
        squeletteGfx.fillStyle(0x111111);
        squeletteGfx.fillCircle(11, 13, 4); // left hollow eye
        squeletteGfx.fillCircle(21, 13, 4); // right hollow eye
        squeletteGfx.fillStyle(0x222222);
        squeletteGfx.fillTriangle(15, 18, 17, 18, 16, 21); // nose hole
        squeletteGfx.fillStyle(0xccccbb);
        squeletteGfx.fillRect(9, 23, 14, 3); // teeth row
        squeletteGfx.fillStyle(0x111111);
        squeletteGfx.fillRect(11, 23, 1, 3); // tooth gap
        squeletteGfx.fillRect(14, 23, 1, 3);
        squeletteGfx.fillRect(17, 23, 1, 3);
        squeletteGfx.fillRect(20, 23, 1, 3);
        squeletteGfx.fillStyle(0xbbbbaa);
        squeletteGfx.fillRect(12, 27, 3, 4); // spine segment
        squeletteGfx.fillRect(17, 27, 3, 4);
        squeletteGfx.generateTexture('enemy-squelette', tileSize, tileSize);

        // Ogre - large red-brown brute with horns
        const ogreGfx = this.make.graphics({ x: 0, y: 0, add: false });
        ogreGfx.fillStyle(0xcc4422);
        ogreGfx.fillCircle(16, 18, 14); // big body
        ogreGfx.fillStyle(0x993311);
        ogreGfx.fillTriangle(3, 12, 7, 2, 9, 12); // left horn
        ogreGfx.fillTriangle(23, 12, 25, 2, 29, 12); // right horn
        ogreGfx.fillStyle(0xffcc00);
        ogreGfx.fillCircle(11, 15, 4); // left eye
        ogreGfx.fillCircle(21, 15, 4); // right eye
        ogreGfx.fillStyle(0x000000);
        ogreGfx.fillCircle(11, 15, 2); // left pupil
        ogreGfx.fillCircle(21, 15, 2); // right pupil
        ogreGfx.fillStyle(0x882211);
        ogreGfx.fillRect(7, 10, 5, 2); // left angry brow
        ogreGfx.fillRect(20, 10, 5, 2); // right angry brow
        ogreGfx.fillStyle(0x331100);
        ogreGfx.fillRect(8, 24, 16, 4); // mouth
        ogreGfx.fillStyle(0xffffff);
        ogreGfx.fillTriangle(10, 24, 12, 24, 11, 27); // left fang
        ogreGfx.fillTriangle(20, 24, 22, 24, 21, 27); // right fang
        ogreGfx.generateTexture('enemy-ogre', tileSize, tileSize);

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