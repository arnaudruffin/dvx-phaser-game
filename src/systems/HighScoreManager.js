const STORAGE_KEY = 'donjon-maths-highscores';
const MAX_SCORES = 5;

export class HighScoreManager {
    constructor() {
        this.scores = this._load();
    }

    _load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    _save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.scores));
        } catch {
            // localStorage unavailable — silently ignore
        }
    }

    /** Returns true if the score qualifies for the top 5. */
    isHighScore(score) {
        if (this.scores.length < MAX_SCORES) return true;
        return score > this.scores[this.scores.length - 1].score;
    }

    /**
     * Inserts a new entry, sorts descending, trims to MAX_SCORES and persists.
     * @returns {number} rank (1-based) of the new entry
     */
    addScore(name, score, enemies) {
        const entry = {
            name: (name || 'AAA').toUpperCase().slice(0, 10),
            score,
            enemies,
            date: new Date().toLocaleDateString('fr-FR')
        };
        this.scores.push(entry);
        this.scores.sort((a, b) => b.score - a.score);
        this.scores = this.scores.slice(0, MAX_SCORES);
        this._save();
        return this.scores.findIndex(e => e === entry) + 1;
    }

    /** Returns the sorted top-5 array (may be shorter if fewer entries). */
    getScores() {
        return this.scores;
    }
}
