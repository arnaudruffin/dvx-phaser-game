export class QuizManager {
    constructor(minTable = 1, maxTable = 10, mode = 'multiplication') {
        this.minTable = minTable;
        this.maxTable = maxTable;
        this.mode = mode;
    }

    generateQuestion() {
        const a = Math.floor(Math.random() * (this.maxTable - this.minTable + 1)) + this.minTable;
        const b = Math.floor(Math.random() * (this.maxTable - this.minTable + 1)) + this.minTable;

        if (this.mode === 'addition') {
            return {
                text: `${a} + ${b} = ?`,
                answer: a + b,
                a,
                b
            };
        }

        return {
            text: `${a} x ${b} = ?`,
            answer: a * b,
            a,
            b
        };
    }

    checkAnswer(question, userAnswer) {
        return parseInt(userAnswer) === question.answer;
    }

    calculateDamage(elapsedSeconds, isCorrect) {
        if (!isCorrect) return { damage: 0, tier: 'miss' };
        if (elapsedSeconds < 3) return { damage: 35, tier: 'critical' };
        if (elapsedSeconds <= 6) return { damage: 25, tier: 'strong' };
        if (elapsedSeconds <= 10) return { damage: 15, tier: 'normal' };
        return { damage: 8, tier: 'weak' };
    }

    calculateTimeBonus(elapsedSeconds) {
        if (elapsedSeconds < 2) return 50;
        if (elapsedSeconds > 10) return 10;
        return Math.floor(50 - (elapsedSeconds - 2) * 5);
    }

    getDifficultyMultiplier(maxTable) {
        return maxTable / 10;
    }

    // Defense timing validation
    checkDefenseTiming(windowStartMs, windowEndMs, playerInputTimeMs) {
        return playerInputTimeMs >= windowStartMs && playerInputTimeMs <= windowEndMs;
    }

    calculateDefenseWindow(totalDefenseDurationMs = 600) {
        const perfectMoment = totalDefenseDurationMs / 2;
        const margin = 150;
        return {
            windowStart: perfectMoment - margin,
            windowEnd: perfectMoment + margin,
            perfectMoment
        };
    }
}
