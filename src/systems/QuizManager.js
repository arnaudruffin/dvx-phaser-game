export class QuizManager {
    constructor(minTable = 1, maxTable = 10, mode = 'multiplication') {
        this.minTable = minTable;
        this.maxTable = maxTable;
        this.mode = mode;
    }

    generateQuestion() {
        // Filter out 10 randomly (50% of the time) when maxTable >= 10
        // This increases variety and avoids trivial "10×X" questions
        let effectiveMax = this.maxTable;
        let effectiveMin = this.minTable;
        
        if (this.maxTable >= 10 && Math.random() < 0.5) {
            effectiveMax = Math.min(9, this.maxTable);
        }

        // Randomly decide which operand is constrained to [minTable, maxTable]
        // The other operand is free [1..10]
        const isARestricted = Math.random() < 0.5;
        
        let a, b;
        if (isARestricted) {
            a = Math.floor(Math.random() * (effectiveMax - effectiveMin + 1)) + effectiveMin;
            b = Math.floor(Math.random() * 10) + 1;
        } else {
            a = Math.floor(Math.random() * 10) + 1;
            b = Math.floor(Math.random() * (effectiveMax - effectiveMin + 1)) + effectiveMin;
        }

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
}
