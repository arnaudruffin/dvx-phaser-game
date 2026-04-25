import * as Phaser from 'phaser';
import { SoundManager } from './systems/SoundManager';
import { HighScoreManager } from './systems/HighScoreManager';

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

        // Initialize Sound Manager and store globally
        const soundManager = new SoundManager(this);
        this.game.soundManager = soundManager;

        // Initialize High Score Manager and store globally
        this.game.highScoreManager = new HighScoreManager();

        // Generate dungeon sprites procedurally
        this.generateSprites();

        this.scene.launch('GlobalScene');
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

        // Loup-garou - brown wolf head with pointy ears and fangs
        const loupGarouGfx = this.make.graphics({ x: 0, y: 0, add: false });
        loupGarouGfx.fillStyle(0x8b5e3c);
        loupGarouGfx.fillCircle(16, 18, 12); // head
        loupGarouGfx.fillStyle(0x6b3e1e);
        loupGarouGfx.fillTriangle(6, 12, 10, 2, 14, 12); // left ear
        loupGarouGfx.fillTriangle(18, 12, 22, 2, 26, 12); // right ear
        loupGarouGfx.fillStyle(0xcc9966);
        loupGarouGfx.fillRect(10, 20, 12, 6); // muzzle
        loupGarouGfx.fillStyle(0xff4400);
        loupGarouGfx.fillCircle(11, 16, 3); // left eye
        loupGarouGfx.fillCircle(21, 16, 3); // right eye
        loupGarouGfx.fillStyle(0x000000);
        loupGarouGfx.fillCircle(11, 16, 1.5); // left pupil (slit)
        loupGarouGfx.fillCircle(21, 16, 1.5); // right pupil
        loupGarouGfx.fillStyle(0x222222);
        loupGarouGfx.fillRect(12, 25, 8, 2); // mouth line
        loupGarouGfx.fillStyle(0xffffff);
        loupGarouGfx.fillTriangle(12, 25, 14, 25, 13, 28); // left fang
        loupGarouGfx.fillTriangle(18, 25, 20, 25, 19, 28); // right fang
        loupGarouGfx.generateTexture('enemy-loup-garou', tileSize, tileSize);

        // Chevalier Noir - dark armored knight with visor and glowing eyes
        const chevalierNoirGfx = this.make.graphics({ x: 0, y: 0, add: false });
        chevalierNoirGfx.fillStyle(0x1a1a2e);
        chevalierNoirGfx.fillRect(8, 6, 16, 22); // dark armor body
        chevalierNoirGfx.fillStyle(0x111122);
        chevalierNoirGfx.fillRect(6, 4, 20, 14); // helmet
        chevalierNoirGfx.fillStyle(0x0d0d1a);
        chevalierNoirGfx.fillRect(8, 8, 16, 6); // visor slit
        chevalierNoirGfx.fillStyle(0xff2222);
        chevalierNoirGfx.fillRect(10, 10, 5, 3); // left glowing eye
        chevalierNoirGfx.fillRect(17, 10, 5, 3); // right glowing eye
        chevalierNoirGfx.fillStyle(0x333355);
        chevalierNoirGfx.fillRect(4, 14, 6, 14); // left pauldron + arm
        chevalierNoirGfx.fillRect(22, 14, 6, 14); // right pauldron + arm
        chevalierNoirGfx.fillStyle(0xaaaacc);
        chevalierNoirGfx.fillRect(26, 8, 3, 20); // dark sword
        chevalierNoirGfx.fillRect(23, 14, 9, 2); // crossguard
        chevalierNoirGfx.fillStyle(0x222233);
        chevalierNoirGfx.fillRect(11, 28, 5, 4); // left leg
        chevalierNoirGfx.fillRect(16, 28, 5, 4); // right leg
        chevalierNoirGfx.generateTexture('enemy-chevalier-noir', tileSize, tileSize);

        // Liche - skeletal undead mage with glowing purple eyes and robes
        const licheGfx = this.make.graphics({ x: 0, y: 0, add: false });
        licheGfx.fillStyle(0x2d1b4e);
        licheGfx.fillRect(8, 14, 16, 18); // dark robe body
        licheGfx.fillStyle(0xd4c9aa);
        licheGfx.fillCircle(16, 12, 10); // skull head
        licheGfx.fillStyle(0x6600cc);
        licheGfx.fillCircle(11, 11, 4); // left glowing eye socket
        licheGfx.fillCircle(21, 11, 4); // right glowing eye socket
        licheGfx.fillStyle(0xdd00ff);
        licheGfx.fillCircle(11, 11, 2); // left eye glow
        licheGfx.fillCircle(21, 11, 2); // right eye glow
        licheGfx.fillStyle(0x111111);
        licheGfx.fillTriangle(14, 16, 16, 16, 15, 18); // nose cavity
        licheGfx.fillStyle(0xbbaa99);
        licheGfx.fillRect(10, 20, 12, 2); // teeth row
        licheGfx.fillStyle(0x111111);
        licheGfx.fillRect(12, 20, 1, 2);
        licheGfx.fillRect(15, 20, 1, 2);
        licheGfx.fillRect(18, 20, 1, 2);
        licheGfx.fillStyle(0x4400aa);
        licheGfx.fillRect(4, 16, 6, 2); // left arm bone
        licheGfx.fillRect(22, 16, 6, 2); // right arm bone
        licheGfx.fillStyle(0xdd00ff);
        licheGfx.fillCircle(4, 15, 3); // left orb
        licheGfx.fillCircle(28, 15, 3); // right orb
        licheGfx.generateTexture('enemy-liche', tileSize, tileSize);

        // Démon - dark red demon with horns and wings
        const demonGfx = this.make.graphics({ x: 0, y: 0, add: false });
        demonGfx.fillStyle(0x8b0000);
        demonGfx.fillCircle(16, 16, 13); // body/head
        demonGfx.fillStyle(0x5c0000);
        demonGfx.fillTriangle(5, 10, 10, 0, 13, 10); // left horn
        demonGfx.fillTriangle(19, 10, 22, 0, 27, 10); // right horn
        demonGfx.fillStyle(0x3a0000);
        demonGfx.fillTriangle(0, 8, 6, 16, 0, 22); // left wing
        demonGfx.fillTriangle(32, 8, 26, 16, 32, 22); // right wing
        demonGfx.fillStyle(0xff6600);
        demonGfx.fillCircle(11, 14, 4); // left eye
        demonGfx.fillCircle(21, 14, 4); // right eye
        demonGfx.fillStyle(0xffcc00);
        demonGfx.fillCircle(11, 14, 2); // left pupil
        demonGfx.fillCircle(21, 14, 2); // right pupil
        demonGfx.fillStyle(0x440000);
        demonGfx.fillRect(8, 10, 5, 2); // left brow
        demonGfx.fillRect(19, 10, 5, 2); // right brow
        demonGfx.fillStyle(0x220000);
        demonGfx.fillRect(8, 22, 16, 4); // wide mouth
        demonGfx.fillStyle(0xffffff);
        demonGfx.fillTriangle(9, 22, 12, 22, 10, 26); // left fang
        demonGfx.fillTriangle(20, 22, 23, 22, 22, 26); // right fang
        demonGfx.generateTexture('enemy-demon', tileSize, tileSize);

        // Vampire - dark purple with cape, pale face, red eyes, fangs
        const vampireGfx = this.make.graphics({ x: 0, y: 0, add: false });
        vampireGfx.fillStyle(0x1a0033);
        vampireGfx.fillTriangle(0, 6, 10, 18, 0, 26); // left cape wing
        vampireGfx.fillTriangle(32, 6, 22, 18, 32, 26); // right cape wing
        vampireGfx.fillStyle(0x3b0066);
        vampireGfx.fillCircle(16, 17, 11); // body/head
        vampireGfx.fillStyle(0xf0e0d0);
        vampireGfx.fillCircle(16, 14, 8); // pale face
        vampireGfx.fillStyle(0xcc0000);
        vampireGfx.fillCircle(11, 13, 3); // left eye
        vampireGfx.fillCircle(21, 13, 3); // right eye
        vampireGfx.fillStyle(0xff4444);
        vampireGfx.fillCircle(11, 13, 1.5); // left eye glow
        vampireGfx.fillCircle(21, 13, 1.5); // right eye glow
        vampireGfx.fillStyle(0x111111);
        vampireGfx.fillTriangle(14, 17, 16, 17, 15, 19); // nose shadow
        vampireGfx.fillStyle(0xffffff);
        vampireGfx.fillTriangle(13, 21, 15, 21, 14, 24); // left fang
        vampireGfx.fillTriangle(17, 21, 19, 21, 18, 24); // right fang
        vampireGfx.fillStyle(0x220044);
        vampireGfx.fillRect(8, 5, 6, 3); // left widow peak
        vampireGfx.fillRect(18, 5, 6, 3); // right widow peak
        vampireGfx.generateTexture('enemy-vampire', tileSize, tileSize);

        // Golem de Pierre - blocky gray stone creature with glowing cracks
        const golemGfx = this.make.graphics({ x: 0, y: 0, add: false });
        golemGfx.fillStyle(0x555566);
        golemGfx.fillRect(4, 4, 24, 26); // stone body block
        golemGfx.fillStyle(0x444455);
        golemGfx.fillRect(4, 4, 24, 3); // top face
        golemGfx.fillRect(4, 27, 24, 3); // bottom face
        golemGfx.fillStyle(0x6e7088);
        golemGfx.fillRect(6, 7, 20, 18); // lighter inner face
        golemGfx.fillStyle(0xff8800);
        golemGfx.fillCircle(11, 14, 4); // left glowing eye
        golemGfx.fillCircle(21, 14, 4); // right glowing eye
        golemGfx.fillStyle(0xffcc00);
        golemGfx.fillCircle(11, 14, 2); // left eye core
        golemGfx.fillCircle(21, 14, 2); // right eye core
        golemGfx.fillStyle(0xff6600);
        golemGfx.fillRect(7, 22, 18, 2); // crack mouth
        golemGfx.fillRect(8, 9, 2, 6); // crack left
        golemGfx.fillRect(22, 11, 2, 5); // crack right
        golemGfx.fillRect(14, 19, 4, 2); // chin crack
        golemGfx.generateTexture('enemy-golem', tileSize, tileSize);

        // Nécromancien - black robes, skull face, green magic orbs
        const necroGfx = this.make.graphics({ x: 0, y: 0, add: false });
        necroGfx.fillStyle(0x0a0a0a);
        necroGfx.fillRect(7, 14, 18, 18); // dark robe
        necroGfx.fillStyle(0x1a1a1a);
        necroGfx.fillTriangle(7, 14, 25, 14, 16, 4); // hood point
        necroGfx.fillStyle(0xddcfaa);
        necroGfx.fillCircle(16, 13, 9); // skull head
        necroGfx.fillStyle(0x000000);
        necroGfx.fillCircle(11, 12, 3); // left hollow eye
        necroGfx.fillCircle(21, 12, 3); // right hollow eye
        necroGfx.fillStyle(0x00ff44);
        necroGfx.fillCircle(11, 12, 1.5); // left green glow
        necroGfx.fillCircle(21, 12, 1.5); // right green glow
        necroGfx.fillStyle(0x111111);
        necroGfx.fillRect(11, 19, 10, 2); // teeth
        necroGfx.fillStyle(0x222222);
        necroGfx.fillRect(13, 19, 1, 2);
        necroGfx.fillRect(16, 19, 1, 2);
        necroGfx.fillRect(19, 19, 1, 2);
        necroGfx.fillStyle(0x005522);
        necroGfx.fillRect(2, 18, 6, 2); // left arm bone
        necroGfx.fillRect(24, 18, 6, 2); // right arm bone
        necroGfx.fillStyle(0x00ff44);
        necroGfx.fillCircle(3, 17, 3); // left orb
        necroGfx.fillCircle(29, 17, 3); // right orb
        necroGfx.generateTexture('enemy-necromancien', tileSize, tileSize);

        // Hydre - dark green serpent with 3 heads
        const hydreGfx = this.make.graphics({ x: 0, y: 0, add: false });
        hydreGfx.fillStyle(0x1a4a1a);
        hydreGfx.fillCircle(16, 22, 10); // main body
        hydreGfx.fillStyle(0x226622);
        hydreGfx.fillCircle(8, 10, 7); // left head
        hydreGfx.fillCircle(16, 8, 7); // center head
        hydreGfx.fillCircle(24, 10, 7); // right head
        hydreGfx.fillStyle(0x114411);
        hydreGfx.fillRect(5, 15, 6, 5); // left neck
        hydreGfx.fillRect(13, 13, 6, 6); // center neck
        hydreGfx.fillRect(21, 15, 6, 5); // right neck
        hydreGfx.fillStyle(0xffcc00);
        hydreGfx.fillCircle(6, 9, 2); // left eye
        hydreGfx.fillCircle(10, 9, 2); // left eye 2
        hydreGfx.fillCircle(14, 7, 2); // center eye
        hydreGfx.fillCircle(18, 7, 2); // center eye 2
        hydreGfx.fillCircle(22, 9, 2); // right eye
        hydreGfx.fillCircle(26, 9, 2); // right eye 2
        hydreGfx.fillStyle(0x000000);
        hydreGfx.fillCircle(6, 9, 1);
        hydreGfx.fillCircle(10, 9, 1);
        hydreGfx.fillCircle(14, 7, 1);
        hydreGfx.fillCircle(18, 7, 1);
        hydreGfx.fillCircle(22, 9, 1);
        hydreGfx.fillCircle(26, 9, 1);
        hydreGfx.generateTexture('enemy-hydre', tileSize, tileSize);

        // Chimère - lion body with dragon wings and eagle features
        const chimereGfx = this.make.graphics({ x: 0, y: 0, add: false });
        chimereGfx.fillStyle(0x993300);
        chimereGfx.fillTriangle(0, 6, 8, 18, 0, 24); // left wing
        chimereGfx.fillTriangle(32, 6, 24, 18, 32, 24); // right wing
        chimereGfx.fillStyle(0xcc6600);
        chimereGfx.fillCircle(16, 17, 12); // lion body/head
        chimereGfx.fillStyle(0xff9900);
        chimereGfx.fillCircle(16, 15, 8); // mane center
        chimereGfx.fillStyle(0xffcc00);
        chimereGfx.fillCircle(16, 14, 6); // face
        chimereGfx.fillStyle(0xff3300);
        chimereGfx.fillCircle(11, 13, 3); // left eye
        chimereGfx.fillCircle(21, 13, 3); // right eye
        chimereGfx.fillStyle(0xffffff);
        chimereGfx.fillCircle(11, 13, 1.5);
        chimereGfx.fillCircle(21, 13, 1.5);
        chimereGfx.fillStyle(0x884400);
        chimereGfx.fillRect(8, 10, 5, 2); // left brow
        chimereGfx.fillRect(19, 10, 5, 2); // right brow
        chimereGfx.fillStyle(0x331100);
        chimereGfx.fillRect(10, 21, 12, 3); // fanged mouth
        chimereGfx.fillStyle(0xffffff);
        chimereGfx.fillTriangle(11, 21, 13, 21, 12, 24); // fang
        chimereGfx.fillTriangle(19, 21, 21, 21, 20, 24); // fang
        chimereGfx.generateTexture('enemy-chimere', tileSize, tileSize);

        // Sorcière Noire - black hat, green skin, purple robes
        const sorciereGfx = this.make.graphics({ x: 0, y: 0, add: false });
        sorciereGfx.fillStyle(0x3d0066);
        sorciereGfx.fillRect(8, 16, 16, 16); // purple robe
        sorciereGfx.fillStyle(0x2a0044);
        sorciereGfx.fillRect(4, 18, 6, 12); // left sleeve
        sorciereGfx.fillRect(22, 18, 6, 12); // right sleeve
        sorciereGfx.fillStyle(0x228822);
        sorciereGfx.fillCircle(16, 14, 9); // green face
        sorciereGfx.fillStyle(0x111111);
        sorciereGfx.fillTriangle(8, 12, 24, 12, 16, 0); // black witch hat
        sorciereGfx.fillRect(6, 11, 20, 3); // hat brim
        sorciereGfx.fillStyle(0xccff00);
        sorciereGfx.fillCircle(11, 13, 3); // left yellow eye
        sorciereGfx.fillCircle(21, 13, 3); // right yellow eye
        sorciereGfx.fillStyle(0x000000);
        sorciereGfx.fillCircle(11, 13, 1.5);
        sorciereGfx.fillCircle(21, 13, 1.5);
        sorciereGfx.fillStyle(0x116611);
        sorciereGfx.fillRect(12, 20, 8, 2); // thin cruel mouth
        sorciereGfx.fillStyle(0x33aa33);
        sorciereGfx.fillCircle(5, 19, 3); // left hand orb (magic)
        sorciereGfx.fillCircle(27, 19, 3); // right hand orb
        sorciereGfx.generateTexture('enemy-sorciere-noire', tileSize, tileSize);

        // Ange Déchu - white/gray corrupted angel with dark wings
        const angeGfx = this.make.graphics({ x: 0, y: 0, add: false });
        angeGfx.fillStyle(0x222222);
        angeGfx.fillTriangle(0, 4, 12, 18, 0, 28); // left dark wing
        angeGfx.fillTriangle(32, 4, 20, 18, 32, 28); // right dark wing
        angeGfx.fillStyle(0xddddcc);
        angeGfx.fillRect(10, 12, 12, 20); // white robe body
        angeGfx.fillCircle(16, 11, 9); // head
        angeGfx.fillStyle(0x888877);
        angeGfx.fillRect(8, 3, 3, 2); // broken halo left
        angeGfx.fillRect(13, 2, 6, 2); // broken halo center
        angeGfx.fillRect(21, 3, 3, 2); // broken halo right
        angeGfx.fillStyle(0x440000);
        angeGfx.fillCircle(12, 10, 3); // left corrupted eye
        angeGfx.fillCircle(20, 10, 3); // right corrupted eye
        angeGfx.fillStyle(0xff0000);
        angeGfx.fillCircle(12, 10, 1.5);
        angeGfx.fillCircle(20, 10, 1.5);
        angeGfx.fillStyle(0x999988);
        angeGfx.fillRect(11, 17, 10, 2); // mouth line
        angeGfx.generateTexture('enemy-ange-dechu', tileSize, tileSize);

        // Titan de Feu - massive molten giant with flames
        const titanGfx = this.make.graphics({ x: 0, y: 0, add: false });
        titanGfx.fillStyle(0x8b1a00);
        titanGfx.fillCircle(16, 18, 14); // dark body
        titanGfx.fillStyle(0xff4400);
        titanGfx.fillTriangle(6, 8, 10, 0, 14, 8); // left flame
        titanGfx.fillTriangle(18, 8, 22, 0, 26, 8); // right flame
        titanGfx.fillTriangle(12, 4, 16, 0, 20, 4); // center flame
        titanGfx.fillStyle(0xff7700);
        titanGfx.fillCircle(16, 16, 10); // molten core body
        titanGfx.fillStyle(0xffdd00);
        titanGfx.fillCircle(10, 14, 5); // left eye (lava)
        titanGfx.fillCircle(22, 14, 5); // right eye
        titanGfx.fillStyle(0xffffff);
        titanGfx.fillCircle(10, 14, 2.5); // white hot core
        titanGfx.fillCircle(22, 14, 2.5);
        titanGfx.fillStyle(0x6b1000);
        titanGfx.fillRect(8, 10, 5, 2); // left brow crack
        titanGfx.fillRect(19, 10, 5, 2); // right brow crack
        titanGfx.fillStyle(0x330000);
        titanGfx.fillRect(7, 22, 18, 5); // gaping magma mouth
        titanGfx.fillStyle(0xff6600);
        titanGfx.fillTriangle(8, 22, 11, 22, 9, 26);
        titanGfx.fillTriangle(14, 22, 17, 22, 15, 26);
        titanGfx.fillTriangle(21, 22, 24, 22, 22, 26);
        titanGfx.generateTexture('enemy-titan-feu', tileSize, tileSize);

        // Archidémon - deep crimson with multiple horns and golden eyes
        const archidemonGfx = this.make.graphics({ x: 0, y: 0, add: false });
        archidemonGfx.fillStyle(0x5c0000);
        archidemonGfx.fillCircle(16, 17, 14); // massive body
        archidemonGfx.fillStyle(0x3a0000);
        archidemonGfx.fillTriangle(4, 10, 8, 0, 11, 10); // outer left horn
        archidemonGfx.fillTriangle(21, 10, 24, 0, 28, 10); // outer right horn
        archidemonGfx.fillTriangle(9, 8, 12, 1, 15, 8); // inner left horn
        archidemonGfx.fillTriangle(17, 8, 20, 1, 23, 8); // inner right horn
        archidemonGfx.fillStyle(0x1a0000);
        archidemonGfx.fillTriangle(0, 8, 7, 18, 0, 24); // left wing
        archidemonGfx.fillTriangle(32, 8, 25, 18, 32, 24); // right wing
        archidemonGfx.fillStyle(0xffaa00);
        archidemonGfx.fillCircle(10, 15, 5); // left eye
        archidemonGfx.fillCircle(22, 15, 5); // right eye
        archidemonGfx.fillStyle(0xffff00);
        archidemonGfx.fillCircle(10, 15, 2.5); // left pupil
        archidemonGfx.fillCircle(22, 15, 2.5);
        archidemonGfx.fillStyle(0x3a0000);
        archidemonGfx.fillRect(6, 11, 6, 2); // left brow
        archidemonGfx.fillRect(20, 11, 6, 2); // right brow
        archidemonGfx.fillStyle(0x1a0000);
        archidemonGfx.fillRect(6, 23, 20, 5); // gaping mouth
        archidemonGfx.fillStyle(0xffffff);
        archidemonGfx.fillTriangle(8, 23, 11, 23, 9, 27); // fang
        archidemonGfx.fillTriangle(13, 23, 16, 23, 14, 27);
        archidemonGfx.fillTriangle(19, 23, 22, 23, 20, 27);
        archidemonGfx.fillTriangle(24, 23, 27, 23, 25, 27);
        archidemonGfx.generateTexture('enemy-archidemon', tileSize, tileSize);

        // Dieu de la Mort - black and gold, skull face, dark aura crown
        const dieuMortGfx = this.make.graphics({ x: 0, y: 0, add: false });
        dieuMortGfx.fillStyle(0x050505);
        dieuMortGfx.fillCircle(16, 17, 15); // black body
        dieuMortGfx.fillStyle(0xccaa00);
        dieuMortGfx.fillRect(4, 3, 24, 4); // gold crown base
        dieuMortGfx.fillTriangle(5, 3, 8, -2, 11, 3); // crown spike L1
        dieuMortGfx.fillTriangle(11, 3, 14, -4, 17, 3); // crown spike center
        dieuMortGfx.fillTriangle(18, 3, 21, -2, 24, 3); // crown spike R1
        dieuMortGfx.fillStyle(0xf0e8c0);
        dieuMortGfx.fillCircle(16, 15, 10); // white skull face
        dieuMortGfx.fillStyle(0x050505);
        dieuMortGfx.fillCircle(11, 13, 4); // left hollow eye
        dieuMortGfx.fillCircle(21, 13, 4); // right hollow eye
        dieuMortGfx.fillStyle(0x8800ff);
        dieuMortGfx.fillCircle(11, 13, 2); // left purple glow
        dieuMortGfx.fillCircle(21, 13, 2); // right purple glow
        dieuMortGfx.fillStyle(0x050505);
        dieuMortGfx.fillTriangle(14, 18, 16, 18, 15, 20); // nose cavity
        dieuMortGfx.fillRect(9, 22, 14, 3); // teeth row
        dieuMortGfx.fillStyle(0xf0e8c0);
        dieuMortGfx.fillRect(11, 22, 1, 3);
        dieuMortGfx.fillRect(14, 22, 1, 3);
        dieuMortGfx.fillRect(17, 22, 1, 3);
        dieuMortGfx.fillRect(20, 22, 1, 3);
        dieuMortGfx.fillStyle(0xccaa00);
        dieuMortGfx.fillRect(2, 19, 5, 2); // left arm gold trim
        dieuMortGfx.fillRect(25, 19, 5, 2); // right arm gold trim
        dieuMortGfx.generateTexture('enemy-dieu-mort', tileSize, tileSize);

        // Boss Gobelin - large, golden, menacing version with crown
        const bossGobelinGfx = this.make.graphics({ x: 0, y: 0, add: false });
        bossGobelinGfx.fillStyle(0x88dd44);
        bossGobelinGfx.fillCircle(16, 16, 13); // larger body
        bossGobelinGfx.fillStyle(0x66bb22);
        bossGobelinGfx.fillTriangle(2, 10, 6, 0, 8, 10); // left pointy ear
        bossGobelinGfx.fillTriangle(24, 10, 26, 0, 30, 10); // right pointy ear
        bossGobelinGfx.fillStyle(0xffdd00);
        bossGobelinGfx.fillRect(2, 2, 28, 3); // golden crown
        bossGobelinGfx.fillRect(4, 0, 24, 2);
        bossGobelinGfx.fillStyle(0xffff00);
        bossGobelinGfx.fillCircle(11, 14, 4); // left eye
        bossGobelinGfx.fillCircle(21, 14, 4); // right eye
        bossGobelinGfx.fillStyle(0x000000);
        bossGobelinGfx.fillCircle(12, 14, 2); // left pupil
        bossGobelinGfx.fillCircle(22, 14, 2); // right pupil
        bossGobelinGfx.fillStyle(0xcc0000);
        bossGobelinGfx.fillRect(8, 24, 16, 3); // wider grin in red
        bossGobelinGfx.generateTexture('boss-gobelin', tileSize, tileSize);

        // Boss Troll - massive gray creature with club-like features
        const bossTrollGfx = this.make.graphics({ x: 0, y: 0, add: false });
        bossTrollGfx.fillStyle(0x555577);
        bossTrollGfx.fillCircle(16, 16, 15); // very large body
        bossTrollGfx.fillStyle(0x333355);
        bossTrollGfx.fillRect(4, 2, 10, 8); // left rough horn
        bossTrollGfx.fillRect(18, 2, 10, 8); // right rough horn
        bossTrollGfx.fillStyle(0xff6600);
        bossTrollGfx.fillCircle(10, 14, 5); // left eye (larger, orange)
        bossTrollGfx.fillCircle(22, 14, 5); // right eye
        bossTrollGfx.fillStyle(0x000000);
        bossTrollGfx.fillCircle(10, 14, 2); // left pupil
        bossTrollGfx.fillCircle(22, 14, 2); // right pupil
        bossTrollGfx.fillStyle(0x887755);
        bossTrollGfx.fillRect(6, 20, 20, 4); // harsh mouth
        bossTrollGfx.fillStyle(0xffffff);
        bossTrollGfx.fillRect(8, 21, 2, 2); // teeth
        bossTrollGfx.fillRect(12, 21, 2, 2);
        bossTrollGfx.fillRect(18, 21, 2, 2);
        bossTrollGfx.fillRect(22, 21, 2, 2);
        bossTrollGfx.generateTexture('boss-troll', tileSize, tileSize);

        // Boss Dragon - red/gold scaled beast with spikes
        const bossDragonGfx = this.make.graphics({ x: 0, y: 0, add: false });
        bossDragonGfx.fillStyle(0xdd3333);
        bossDragonGfx.fillCircle(16, 18, 16); // massive body
        bossDragonGfx.fillStyle(0xffaa00);
        bossDragonGfx.fillRect(2, 0, 6, 6); // left spike
        bossDragonGfx.fillRect(24, 0, 6, 6); // right spike
        bossDragonGfx.fillRect(8, 2, 4, 5); // middle spike
        bossDragonGfx.fillRect(20, 2, 4, 5); // middle-right spike
        bossDragonGfx.fillStyle(0xffff00);
        bossDragonGfx.fillCircle(9, 15, 6); // left eye (large, yellow)
        bossDragonGfx.fillCircle(23, 15, 6); // right eye
        bossDragonGfx.fillStyle(0x000000);
        bossDragonGfx.fillCircle(9, 15, 3); // left pupil
        bossDragonGfx.fillCircle(23, 15, 3); // right pupil
        bossDragonGfx.fillStyle(0xff6600);
        bossDragonGfx.fillRect(4, 22, 24, 4); // mouth
        bossDragonGfx.fillStyle(0xffcc00);
        bossDragonGfx.fillTriangle(6, 26, 8, 26, 7, 28); // left fang
        bossDragonGfx.fillTriangle(10, 26, 12, 26, 11, 28);
        bossDragonGfx.fillTriangle(20, 26, 22, 26, 21, 28);
        bossDragonGfx.fillTriangle(24, 26, 26, 26, 25, 28); // right fang
        bossDragonGfx.generateTexture('boss-dragon', tileSize, tileSize);

        // Shield - heater shield shape (medieval) for successful block animation
        const shieldGfx = this.make.graphics({ x: 0, y: 0, add: false });
        // Silver border (full shape)
        shieldGfx.fillStyle(0xccccff);
        shieldGfx.fillRect(4, 2, 24, 20);           // top rectangle
        shieldGfx.fillTriangle(4, 20, 28, 20, 16, 30); // bottom triangle
        // Blue body (slightly inset)
        shieldGfx.fillStyle(0x2255cc);
        shieldGfx.fillRect(6, 4, 20, 17);           // inner top
        shieldGfx.fillTriangle(6, 19, 26, 19, 16, 28); // inner triangle
        // Gold cross
        shieldGfx.fillStyle(0xffd700);
        shieldGfx.fillRect(14, 5, 4, 19);           // vertical bar
        shieldGfx.fillRect(6, 10, 20, 4);           // horizontal bar
        shieldGfx.generateTexture('shield', tileSize, tileSize);

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

        // Potion - red heart with shine
        const potionGfx = this.make.graphics({ x: 0, y: 0, add: false });
        potionGfx.fillStyle(0xff4466);
        potionGfx.fillCircle(10, 12, 7); // left lobe
        potionGfx.fillCircle(22, 12, 7); // right lobe
        potionGfx.fillTriangle(4, 14, 28, 14, 16, 28); // bottom point
        potionGfx.fillRect(10, 10, 12, 8); // fill center gap
        potionGfx.fillStyle(0xff8899);
        potionGfx.fillCircle(9, 10, 3); // shine highlight
        potionGfx.generateTexture('potion', tileSize, tileSize);
    }
}