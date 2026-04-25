import { Scene } from "phaser";
import { Enemy } from "../gameobjects/Enemy";

const COL = {
    nom:    { x:  10, w: 130, label: 'NOM' },
    pv:     { x: 140, w:  40, label: 'PV' },
    dmg:    { x: 185, w:  40, label: 'DMG' },
    rnd:    { x: 230, w:  35, label: 'RND' },
    tables: { x: 268, w:  60, label: 'TABLES' },
    xp:     { x: 333, w:  55, label: 'XP' },
    scr:    { x: 393, w:  55, label: 'SCR' },
    boss:   { x: 453, w:  45, label: 'BOSS' },
    niv:    { x: 502, w:  40, label: 'NIV' },
};

const ROW_H = 20;
const FONT_SIZE = 14;
const HEADER_SIZE = 16;

export class DebugScene extends Scene {
    constructor() {
        super("DebugScene");
    }

    create() {
        this.state = 'menu';
        this.selectedOption = 0;

        const W = this.scale.width;
        const H = this.scale.height;

        // Semi-transparent overlay
        this.overlay = this.add.rectangle(0, 0, W, H, 0x000000, 0.85)
            .setOrigin(0, 0)
            .setDepth(0);

        // Camera fixed – no scroll, no zoom
        this.cameras.main.setZoom(1);
        this.cameras.main.setScroll(0, 0);

        this.menuContainer = this.add.container(0, 0).setDepth(1);
        this.tableContainer = this.add.container(0, 0).setDepth(1);

        this._buildMenu();
        this._buildTable();
        this._showState();

        this.input.keyboard.on('keydown', this._handleKey, this);

        // Resize support
        this.scale.on('resize', this._onResize, this);
    }

    _handleKey(event) {
        if (this.state === 'menu') {
            if (event.key === 'Escape') {
                this._close();
            } else if (event.key === 'Enter') {
                // Only one option for now: monsters table
                this.state = 'monsters';
                this._showState();
            }
        } else if (this.state === 'monsters') {
            if (event.key === 'Escape') {
                this.state = 'menu';
                this._showState();
            }
        }
    }

    _close() {
        this.scene.stop();
        if (this.game.scene.isPaused('GameScene')) {
            this.game.scene.resume('GameScene');
        }
    }

    _showState() {
        this.menuContainer.setVisible(this.state === 'menu');
        this.tableContainer.setVisible(this.state === 'monsters');
    }

    _buildMenu() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const c = this.menuContainer;

        c.add(this.add.bitmapText(cx, cy - 80, 'knighthawks', '[[ DEBUG MENU ]]', 32)
            .setOrigin(0.5, 0.5)
            .setTint(0xffdd00));

        // Separator line
        const sepY = cy - 44;
        c.add(this.add.rectangle(cx, sepY, 340, 2, 0x444466).setOrigin(0.5, 0.5));

        // Single option
        this.menuOptionText = this.add.bitmapText(cx, cy, 'pixelfont', '> TABLE DES MONSTRES', 22)
            .setOrigin(0.5, 0.5)
            .setTint(0x44ff44);
        c.add(this.menuOptionText);

        c.add(this.add.bitmapText(cx, cy + 60, 'pixelfont', 'D OU ECHAP: FERMER', 16)
            .setOrigin(0.5, 0.5)
            .setTint(0x888888));
    }

    _buildTable() {
        const c = this.tableContainer;
        const W = this.scale.width;
        const H = this.scale.height;

        // Title
        c.add(this.add.bitmapText(W / 2, 18, 'knighthawks', 'TABLE DES MONSTRES', 28)
            .setOrigin(0.5, 0.5)
            .setTint(0xffdd00));

        const tableX = Math.max(10, (W - 550) / 2);
        const startY = 58;

        // Column headers
        for (const col of Object.values(COL)) {
            c.add(this.add.bitmapText(tableX + col.x, startY, 'pixelfont', col.label, HEADER_SIZE)
                .setTint(0xffcc00));
        }

        // Header underline
        c.add(this.add.rectangle(tableX, startY + 14, 542, 2, 0x445566).setOrigin(0, 0.5));

        // Separate regular enemies and bosses
        const types = Object.entries(Enemy.ENEMY_TYPES);
        const regular = types.filter(([, cfg]) => !cfg.isBoss);
        const bosses  = types.filter(([, cfg]) => cfg.isBoss);

        let rowY = startY + 22;

        for (const [, cfg] of regular) {
            rowY = this._addRow(c, tableX, rowY, cfg, false);
        }

        // Boss separator
        c.add(this.add.rectangle(tableX, rowY + 2, 542, 2, 0xff4400, 0.6).setOrigin(0, 0.5));
        c.add(this.add.bitmapText(tableX + 180, rowY + 8, 'pixelfont', '--- BOSS ---', 14)
            .setTint(0xff6600));
        rowY += 20;

        for (const [, cfg] of bosses) {
            rowY = this._addRow(c, tableX, rowY, cfg, true);
        }

        // Footer
        c.add(this.add.bitmapText(W / 2, H - 24, 'pixelfont', 'ECHAP: RETOUR', 16)
            .setOrigin(0.5, 0.5)
            .setTint(0x888888));
    }

    _addRow(container, tableX, y, cfg, isBoss) {
        const tint = isBoss ? 0xff8844 : 0xdddddd;

        const cells = [
            { col: 'nom',    text: cfg.name },
            { col: 'pv',     text: String(cfg.maxHp) },
            { col: 'dmg',    text: String(cfg.damage) },
            { col: 'rnd',    text: String(cfg.rounds) },
            { col: 'tables', text: `${cfg.minTable}-${cfg.maxTable}` },
            { col: 'xp',     text: String(cfg.xpValue) },
            { col: 'scr',    text: String(cfg.scoreValue) },
            { col: 'boss',   text: isBoss ? 'OUI' : 'NON' },
            { col: 'niv',    text: String(cfg.minLevel ?? '?') },
        ];

        for (const { col, text } of cells) {
            container.add(
                this.add.bitmapText(tableX + COL[col].x, y, 'pixelfont', text, FONT_SIZE)
                    .setTint(col === 'boss' && isBoss ? 0xff4444 : tint)
            );
        }

        return y + ROW_H;
    }

    _onResize(gameSize) {
        if (this.overlay) {
            this.overlay.setSize(gameSize.width, gameSize.height);
        }
    }

    shutdown() {
        this.input.keyboard.off('keydown', this._handleKey, this);
        this.scale.off('resize', this._onResize, this);
    }
}
