import { Game } from "phaser";
import { Preloader } from "./preloader";
import { GameOverScene } from "./scenes/GameOverScene";
import { HudScene } from "./scenes/HudScene";
import { GameScene } from "./scenes/GameScene";
import { MenuScene } from "./scenes/MenuScene";
import { ConfigScene } from "./scenes/ConfigScene";
import { QuizScene } from "./scenes/QuizScene";
import { DebugScene } from "./scenes/DebugScene";
import { GlobalScene } from "./scenes/GlobalScene";
import * as Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: "#1a1a2e",
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true,
        fullscreenTarget: 'phaser-container'
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [
        Preloader,
        GlobalScene,
        MenuScene,
        ConfigScene,
        GameScene,
        QuizScene,
        HudScene,
        GameOverScene,
        DebugScene
    ]
};

const game = new Game(config);