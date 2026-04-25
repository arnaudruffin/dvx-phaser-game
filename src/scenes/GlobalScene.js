import { Scene } from "phaser";
import * as Phaser from "phaser";

/**
 * Persistent scene that runs throughout the entire game lifecycle.
 * Handles global keyboard shortcuts (e.g. debug menu toggle).
 */
export class GlobalScene extends Scene {
    constructor() {
        super({ key: "GlobalScene", active: false });
    }

    create() {
        const debugKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        debugKey.on('down', () => {
            if (this.scene.isActive('DebugScene')) {
                this.scene.stop('DebugScene');
                if (this.scene.isPaused('GameScene')) {
                    this.scene.resume('GameScene');
                }
            } else {
                if (this.scene.isActive('GameScene')) {
                    this.scene.pause('GameScene');
                }
                this.scene.launch('DebugScene');
            }
        });
    }
}
