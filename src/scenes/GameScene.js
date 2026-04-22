import { Scene } from "phaser";
import { Player } from "../gameobjects/Player";
import { Enemy } from "../gameobjects/Enemy";
import { DungeonGenerator } from "../systems/DungeonGenerator";
import { ScoreManager } from "../systems/ScoreManager";

export class GameScene extends Scene {
    player = null;
    enemies = null;
    currentRoom = null;
    dungeonGenerator = null;
    scoreManager = null;
    
    tileSize = 32;
    roomWidth = 15;
    roomHeight = 11;

    constructor() {
        super("GameScene");
    }

    init() {
        this.cameras.main.fadeIn(500, 0, 0, 0);
        this.scoreManager = new ScoreManager();
    }

    create() {
        this.dungeonGenerator = new DungeonGenerator(this, this.roomWidth, this.roomHeight, this.tileSize);
        
        // Create enemy group
        this.enemies = this.physics.add.group();
        
        // Generate starting room
        this.currentRoom = this.dungeonGenerator.generateRoom(0, 0);
        this.renderRoom(this.currentRoom);
        
        // Create player at room center
        const startX = Math.floor(this.roomWidth / 2) * this.tileSize + this.tileSize / 2;
        const startY = Math.floor(this.roomHeight / 2) * this.tileSize + this.tileSize / 2;
        this.player = new Player(this, startX, startY);
        
        // Setup collisions
        this.setupCollisions();
        
        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // Launch HUD
        this.scene.launch("HudScene", { score: 0, room: "0,0" });
        
        // Listen for quiz results
        this.game.events.on("quiz-answer", this.onQuizAnswer, this);
    }

    renderRoom(room) {
        // Clear previous room
        if (this.wallsGroup) this.wallsGroup.destroy(true);
        if (this.doorsGroup) this.doorsGroup.destroy(true);
        if (this.floorGroup) this.floorGroup.destroy(true);
        this.enemies.clear(true, true);
        
        this.wallsGroup = this.physics.add.staticGroup();
        this.doorsGroup = this.physics.add.staticGroup();
        this.floorGroup = this.add.group();
        
        // Render tiles
        for (let y = 0; y < this.roomHeight; y++) {
            for (let x = 0; x < this.roomWidth; x++) {
                const tileX = x * this.tileSize + this.tileSize / 2;
                const tileY = y * this.tileSize + this.tileSize / 2;
                const tile = room.tiles[y][x];
                
                if (tile === 0) {
                    // Floor
                    const floor = this.add.image(tileX, tileY, 'floor-tile');
                    floor.setDepth(0);
                    this.floorGroup.add(floor);
                } else if (tile === 1) {
                    // Wall
                    const wall = this.wallsGroup.create(tileX, tileY, 'wall-tile');
                    wall.setImmovable(true);
                    wall.body.setSize(this.tileSize, this.tileSize);
                    wall.setDepth(1);
                } else if (tile === 2) {
                    // Door
                    const floor = this.add.image(tileX, tileY, 'floor-tile');
                    floor.setDepth(0);
                    this.floorGroup.add(floor);
                    const door = this.doorsGroup.create(tileX, tileY, 'door-tile');
                    door.direction = this.getDoorDirection(x, y);
                    door.setDepth(1);
                }
            }
        }
        
        // Spawn enemies
        room.enemyPositions.forEach(pos => {
            const enemy = new Enemy(this, pos.x, pos.y);
            enemy.setDepth(5);
            this.enemies.add(enemy);
        });
        
        // Ensure player stays on top
        if (this.player) {
            this.player.setDepth(10);
        }
    }

    getDoorDirection(x, y) {
        if (y === 0) return 'north';
        if (y === this.roomHeight - 1) return 'south';
        if (x === 0) return 'west';
        if (x === this.roomWidth - 1) return 'east';
        return null;
    }

    onEnemyCollision(player, enemy) {
        if (enemy.isDefeated || this.scene.isActive("QuizScene")) return;
        
        // Store current enemy for quiz result
        this.currentEnemy = enemy;
        this.quizStartTime = Date.now();
        
        // Pause game and launch quiz
        this.scene.pause();
        this.scene.launch("QuizScene");
    }

    onQuizAnswer(data) {
        this.scene.resume();
        
        if (data.correct && this.currentEnemy) {
            // Calculate time bonus (max 50 points for < 2 sec, min 10 points for > 10 sec)
            const elapsed = (Date.now() - this.quizStartTime) / 1000;
            let bonus = Math.max(10, Math.floor(50 - elapsed * 5));
            
            const points = 100 + bonus;
            this.scoreManager.addPoints(points);
            
            // Defeat enemy
            this.currentEnemy.defeat();
            
            // Update HUD
            this.scene.get("HudScene").updateScore(this.scoreManager.getScore());
        }
        
        this.currentEnemy = null;
    }

    onDoorCollision(player, door) {
        const dir = door.direction;
        let newRoomX = this.currentRoom.x;
        let newRoomY = this.currentRoom.y;
        
        if (dir === 'north') newRoomY--;
        if (dir === 'south') newRoomY++;
        if (dir === 'west') newRoomX--;
        if (dir === 'east') newRoomX++;
        
        // Generate or retrieve room
        const newRoom = this.dungeonGenerator.getOrGenerateRoom(newRoomX, newRoomY);
        this.currentRoom = newRoom;
        this.renderRoom(newRoom);
        
        // Position player at opposite door
        const newPlayerPos = this.getOppositePosition(dir);
        this.player.setPosition(newPlayerPos.x, newPlayerPos.y);
        
        // Update HUD
        this.scene.get("HudScene").updateRoom(`${newRoomX},${newRoomY}`);
        
        // Re-setup collisions
        this.setupCollisions();
    }

    setupCollisions() {
        // Remove old colliders to avoid stale references after room transitions
        if (this.wallCollider) this.wallCollider.destroy();
        if (this.enemyOverlap) this.enemyOverlap.destroy();
        if (this.doorOverlap) this.doorOverlap.destroy();

        this.wallCollider = this.physics.add.collider(this.player, this.wallsGroup);
        this.enemyOverlap = this.physics.add.overlap(this.player, this.enemies, this.onEnemyCollision, null, this);
        this.doorOverlap = this.physics.add.overlap(this.player, this.doorsGroup, this.onDoorCollision, null, this);
    }

    getOppositePosition(fromDirection) {
        const centerX = Math.floor(this.roomWidth / 2) * this.tileSize + this.tileSize / 2;
        const centerY = Math.floor(this.roomHeight / 2) * this.tileSize + this.tileSize / 2;
        
        switch (fromDirection) {
            case 'north':
                return { x: centerX, y: (this.roomHeight - 2) * this.tileSize + this.tileSize / 2 };
            case 'south':
                return { x: centerX, y: this.tileSize + this.tileSize / 2 };
            case 'west':
                return { x: (this.roomWidth - 2) * this.tileSize + this.tileSize / 2, y: centerY };
            case 'east':
                return { x: this.tileSize + this.tileSize / 2, y: centerY };
            default:
                return { x: centerX, y: centerY };
        }
    }

    update() {
        if (!this.player) return;
        
        this.player.update(this.cursors);
    }

    shutdown() {
        this.game.events.off("quiz-answer", this.onQuizAnswer, this);
    }
}
