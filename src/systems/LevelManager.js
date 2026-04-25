export class LevelManager {
    static XP_THRESHOLDS = [0, 200, 500, 900, 1400, 2000, 2700];
    static XP_PER_LEVEL_AFTER_MAX = 800;

    constructor() {
        this.currentXp = 0;
        this.currentLevel = 1;
    }

    addXp(amount) {
        this.currentXp += amount;
        const newLevel = this._computeLevel(this.currentXp);
        if (newLevel > this.currentLevel) {
            this.currentLevel = newLevel;
            return { leveledUp: true, newLevel };
        }
        return { leveledUp: false, newLevel: this.currentLevel };
    }

    getLevel() {
        return this.currentLevel;
    }

    getXp() {
        return this.currentXp;
    }

    getXpToNext() {
        const threshold = this._thresholdForLevel(this.currentLevel + 1);
        return Math.max(0, threshold - this.currentXp);
    }

    getXpPercent() {
        const current = this._thresholdForLevel(this.currentLevel);
        const next = this._thresholdForLevel(this.currentLevel + 1);
        if (next === current) return 1;
        return Math.min(1, (this.currentXp - current) / (next - current));
    }

    _thresholdForLevel(level) {
        if (level <= 1) return 0;
        const idx = level - 1;
        if (idx < LevelManager.XP_THRESHOLDS.length) {
            return LevelManager.XP_THRESHOLDS[idx];
        }
        const extra = idx - (LevelManager.XP_THRESHOLDS.length - 1);
        return LevelManager.XP_THRESHOLDS[LevelManager.XP_THRESHOLDS.length - 1]
            + extra * LevelManager.XP_PER_LEVEL_AFTER_MAX;
    }

    _computeLevel(xp) {
        let level = 1;
        while (xp >= this._thresholdForLevel(level + 1)) {
            level++;
        }
        return level;
    }
}
