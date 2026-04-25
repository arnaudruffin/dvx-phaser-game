export class DungeonGenerator {
    constructor(scene, roomWidth, roomHeight, tileSize) {
        this.scene = scene;
        this.roomWidth = roomWidth;
        this.roomHeight = roomHeight;
        this.tileSize = tileSize;
        this.rooms = new Map();
        this.currentLevel = 1;
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
            
            // Don't block center or near doors (must be far from BOTH axes)
            if (Math.abs(ox - midX) > 2 && Math.abs(oy - midY) > 2) {
                tiles[oy][ox] = 1;
                // Sometimes add 2x2 blocks
                if (Math.random() > 0.5 && ox + 1 < this.roomWidth - 1 && oy + 1 < this.roomHeight - 1) {
                    tiles[oy][ox + 1] = 1;
                    tiles[oy + 1][ox] = 1;
                    tiles[oy + 1][ox + 1] = 1;
                }
            }
        }

        // Guarantee door corridors are always clear (safety net against 2x2 overflow)
        for (let i = 1; i <= 2; i++) {
            tiles[i][midX] = 0;
            tiles[this.roomHeight - 1 - i][midX] = 0;
            tiles[midY][i] = 0;
            tiles[midY][this.roomWidth - 1 - i] = 0;
        }

        // Check if this is a boss room
        const isBossRoom = this.isBossRoom(x, y);
        
        // Generate enemy positions (1-3 enemies per room, 1 boss per boss room, not in start room)
        const enemyPositions = [];
        const isStartRoom = x === 0 && y === 0;
        
        if (!isStartRoom) {
            if (isBossRoom) {
                // Boss room: spawn exactly 1 boss
                let attempts = 0;
                while (attempts < 20) {
                    const ex = Math.floor(Math.random() * (this.roomWidth - 4)) + 2;
                    const ey = Math.floor(Math.random() * (this.roomHeight - 4)) + 2;
                    
                    // Check if floor and near center (bosses should be prominent)
                    if (tiles[ey][ex] === 0) {
                        const posX = ex * this.tileSize + this.tileSize / 2;
                        const posY = ey * this.tileSize + this.tileSize / 2;
                        enemyPositions.push({ x: posX, y: posY, type: this.pickBossType(this.currentLevel) });
                        break;
                    }
                    attempts++;
                }
            } else {
                // Normal room: 1-3 regular enemies
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
                                enemyPositions.push({ x: posX, y: posY, type: this.pickEnemyType(this.currentLevel) });
                                break;
                            }
                        }
                        attempts++;
                    }
                }
            }
        }

        // Generate potion positions (0-1 per room, ~30% chance, not in start room, not in boss rooms)
        const potionPositions = [];
        if (!isStartRoom && !isBossRoom && Math.random() < 0.3) {
            let attempts = 0;
            while (attempts < 20) {
                const px = Math.floor(Math.random() * (this.roomWidth - 4)) + 2;
                const py = Math.floor(Math.random() * (this.roomHeight - 4)) + 2;

                if (tiles[py][px] === 0 && (Math.abs(px - midX) > 2 || Math.abs(py - midY) > 2)) {
                    const posX = px * this.tileSize + this.tileSize / 2;
                    const posY = py * this.tileSize + this.tileSize / 2;

                    const tooCloseToEnemy = enemyPositions.some(pos =>
                        Math.abs(pos.x - posX) < this.tileSize && Math.abs(pos.y - posY) < this.tileSize
                    );

                    if (!tooCloseToEnemy) {
                        potionPositions.push({ x: posX, y: posY });
                        break;
                    }
                }
                attempts++;
            }
        }

        const room = {
            x: x,
            y: y,
            key: key,
            tiles: tiles,
            enemyPositions: enemyPositions,
            potionPositions: potionPositions,
            isBossRoom: isBossRoom
        };

        this.rooms.set(key, room);
        return room;
    }

    isBossRoom(x, y) {
        // Boss rooms appear every 5 rooms (Manhattan distance)
        const distance = Math.abs(x) + Math.abs(y);
        return distance > 0 && distance % 5 === 0;
    }

    pickBossType(level) {
        if (level <= 2) return 'boss-gobelin';
        if (level <= 5) return 'boss-troll';
        return 'boss-dragon';
    }

    pickEnemyType(level) {
        const roll = Math.random();
        if (level <= 1) return 'gobelin';
        if (level === 2) return roll < 0.5 ? 'gobelin' : 'loup-garou';
        if (level === 3) return roll < 0.4 ? 'loup-garou' : 'squelette';
        if (level === 4) return roll < 0.4 ? 'squelette' : 'chevalier-noir';
        if (level === 5) return roll < 0.3 ? 'chevalier-noir' : 'ogre';
        if (level === 6) return roll < 0.4 ? 'ogre' : 'liche';
        if (level === 7) return roll < 0.4 ? 'liche' : 'demon';
        if (level === 8) return roll < 0.4 ? 'demon' : 'vampire';
        if (level === 9) return roll < 0.4 ? 'vampire' : 'golem';
        if (level === 10) return roll < 0.4 ? 'golem' : 'necromancien';
        if (level === 11) return roll < 0.4 ? 'necromancien' : 'hydre';
        if (level === 12) return roll < 0.4 ? 'hydre' : 'chimere';
        if (level === 13) return roll < 0.4 ? 'chimere' : 'sorciere-noire';
        if (level === 14) return roll < 0.4 ? 'sorciere-noire' : 'ange-dechu';
        if (level === 15) return roll < 0.4 ? 'ange-dechu' : 'titan-feu';
        if (level === 16) return roll < 0.4 ? 'titan-feu' : 'archidemon';
        return roll < 0.4 ? 'archidemon' : 'dieu-mort';
    }
}
