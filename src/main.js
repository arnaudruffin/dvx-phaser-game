import { Game } from "phaser";
import { Preloader } from "./preloader";
import { GameOverScene } from "./scenes/GameOverScene";
import { HudScene } from "./scenes/HudScene";
import { GameScene } from "./scenes/GameScene";
import { MenuScene } from "./scenes/MenuScene";
import { QuizScene } from "./scenes/QuizScene";
import * as Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    parent: "phaser-container",
    width: 800,
    height: 600,
    backgroundColor: "#1a1a2e",
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
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
        MenuScene,
        GameScene,
        QuizScene,
        HudScene,
        GameOverScene
    ]
};

new Game(config);