export class DungeonGenerator {
    constructor(scene, roomWidth, roomHeight, tileSize) {
        this.scene = scene;
        this.roomWidth = roomWidth;
        this.roomHeight = roomHeight;
        this.tileSize = tileSize;
        this.rooms = new Map();
    }

    getRoomKey(x, y) {
        return `${x},${y}`;
    }

    getOrGenerateRoom(x, y) {
        const key = this.getRoomKey(x, y);
        if (this.rooms.has(key)) {
            return this.rooms.get(key);
        }
        return this.generateRoom(x, y);
    }

    generateRoom(x, y) {
        const key = this.getRoomKey(x, y);
        
        // Create tile grid (0 = floor, 1 = wall, 2 = door)
        const tiles = [];
        for (let row = 0; row < this.roomHeight; row++) {
            tiles[row] = [];
            for (let col = 0; col < this.roomWidth; col++) {
                // Walls on edges
                if (row === 0 || row === this.roomHeight - 1 || col === 0 || col === this.roomWidth - 1) {
                    tiles[row][col] = 1; // Wall
                } else {
                    tiles[row][col] = 0; // Floor
                }
            }
        }

        // Add doors (always 4 doors for infinite exploration)
        const midX = Math.floor(this.roomWidth / 2);
        const midY = Math.floor(this.roomHeight / 2);

        // North door
        tiles[0][midX] = 2;
        // South door
        tiles[this.roomHeight - 1][midX] = 2;
        // West door
        tiles[midY][0] = 2;
        // East door
        tiles[midY][this.roomWidth - 1] = 2;

        // Add some random obstacles (walls inside)
        const obstacleCount = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < obstacleCount; i++) {
            const ox = Math.floor(Math.random() * (this.roomWidth - 4)) + 2;
            const oy = Math.floor(Math.random() * (this.roomHeight - 4)) + 2;
            
            // Don't block center or near doors
            if (Math.abs(ox - midX) > 2 || Math.abs(oy - midY) > 2) {
                tiles[oy][ox] = 1;
                // Sometimes add 2x2 blocks
                if (Math.random() > 0.5 && ox + 1 < this.roomWidth - 1 && oy + 1 < this.roomHeight - 1) {
                    tiles[oy][ox + 1] = 1;
                    tiles[oy + 1][ox] = 1;
                    tiles[oy + 1][ox + 1] = 1;
                }
            }
        }

        // Generate enemy positions (1-3 enemies per room, not in start room)
        const enemyPositions = [];
        const isStartRoom = x === 0 && y === 0;
        
        if (!isStartRoom) {
            const enemyCount = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < enemyCount; i++) {
                let attempts = 0;
                while (attempts < 20) {
                    const ex = Math.floor(Math.random() * (this.roomWidth - 4)) + 2;
                    const ey = Math.floor(Math.random() * (this.roomHeight - 4)) + 2;
                    
                    // Check if floor and not too close to center
                    if (tiles[ey][ex] === 0 && (Math.abs(ex - midX) > 2 || Math.abs(ey - midY) > 2)) {
                        const posX = ex * this.tileSize + this.tileSize / 2;
                        const posY = ey * this.tileSize + this.tileSize / 2;
                        
                        // Check not overlapping other enemies
                        const tooClose = enemyPositions.some(pos => 
                            Math.abs(pos.x - posX) < this.tileSize && Math.abs(pos.y - posY) < this.tileSize
                        );
                        
                        if (!tooClose) {
                            enemyPositions.push({ x: posX, y: posY, type: this.pickEnemyType(x, y) });
                            break;
                        }
                    }
                    attempts++;
                }
            }
        }

        const room = {
            x: x,
            y: y,
            key: key,
            tiles: tiles,
            enemyPositions: enemyPositions
        };

        this.rooms.set(key, room);
        return room;
    }

    pickEnemyType(roomX, roomY) {
        const distance = Math.abs(roomX) + Math.abs(roomY);
        const roll = Math.random();

        if (distance <= 2) {
            return 'gobelin';
        } else if (distance <= 4) {
            return roll < 0.4 ? 'gobelin' : 'squelette';
        } else if (distance <= 6) {
            return roll < 0.4 ? 'squelette' : 'ogre';
        } else {
            return roll < 0.3 ? 'squelette' : 'ogre';
        }
    }
}
