export class ScoreManager {
    constructor() {
        this.score = 0;
        this.enemiesDefeated = 0;
    }

    addPoints(points) {
        this.score += points;
        this.enemiesDefeated++;
    }

    getScore() {
        return this.score;
    }

    getEnemiesDefeated() {
        return this.enemiesDefeated;
    }

    reset() {
        this.score = 0;
        this.enemiesDefeated = 0;
    }
}
