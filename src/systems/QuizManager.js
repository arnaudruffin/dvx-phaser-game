export class QuizManager {
    constructor() {
        this.minTable = 1;
        this.maxTable = 10;
    }

    generateQuestion() {
        const a = Math.floor(Math.random() * this.maxTable) + this.minTable;
        const b = Math.floor(Math.random() * this.maxTable) + this.minTable;
        
        return {
            text: `${a} x ${b} = ?`,
            answer: a * b,
            a: a,
            b: b
        };
    }

    checkAnswer(question, userAnswer) {
        return parseInt(userAnswer) === question.answer;
    }

    calculateTimeBonus(elapsedSeconds) {
        // Max 50 points for < 2 sec, min 10 for > 10 sec
        if (elapsedSeconds < 2) return 50;
        if (elapsedSeconds > 10) return 10;
        return Math.floor(50 - (elapsedSeconds - 2) * 5);
    }
}
