import { Scene } from "phaser";
import { QuizManager } from "../systems/QuizManager";

export class QuizScene extends Scene {
    quizManager = null;
    currentAnswer = "";
    answerText = null;
    questionText = null;
    feedbackText = null;
    
    constructor() {
        super("QuizScene");
    }

    create() {
        this.quizManager = new QuizManager();
        this.currentAnswer = "";
        
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        // Dark overlay
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0, 0);
        
        // Quiz panel
        this.add.rectangle(centerX, centerY, 400, 250, 0x2d2d44)
            .setStrokeStyle(4, 0x6666aa);
        
        // Monster icon
        this.add.image(centerX, centerY - 90, 'enemy').setScale(2);
        
        // Question
        const question = this.quizManager.generateQuestion();
        this.questionText = this.add.bitmapText(centerX, centerY - 30, "pixelfont", question.text, 32)
            .setOrigin(0.5, 0.5);
        
        // Store correct answer
        this.correctAnswer = question.answer;
        
        // Answer input display
        this.add.rectangle(centerX, centerY + 30, 150, 50, 0x1a1a2e)
            .setStrokeStyle(2, 0xffffff);
        
        this.answerText = this.add.bitmapText(centerX, centerY + 30, "pixelfont", "_", 36)
            .setOrigin(0.5, 0.5);
        
        // Instructions
        this.add.bitmapText(centerX, centerY + 80, "pixelfont", "TAPE TA REPONSE", 16)
            .setOrigin(0.5, 0.5);
        this.add.bitmapText(centerX, centerY + 100, "pixelfont", "ENTREE POUR VALIDER", 16)
            .setOrigin(0.5, 0.5);
        
        // Feedback text (hidden initially)
        this.feedbackText = this.add.bitmapText(centerX, centerY + 130, "pixelfont", "", 20)
            .setOrigin(0.5, 0.5);
        
        // Keyboard input
        this.input.keyboard.on('keydown', this.handleKeyInput, this);
    }

    handleKeyInput(event) {
        const key = event.key;
        
        // Numbers
        if (/^[0-9]$/.test(key) && this.currentAnswer.length < 3) {
            this.currentAnswer += key;
            this.updateAnswerDisplay();
        }
        
        // Backspace
        if (key === 'Backspace' && this.currentAnswer.length > 0) {
            this.currentAnswer = this.currentAnswer.slice(0, -1);
            this.updateAnswerDisplay();
        }
        
        // Enter to submit
        if (key === 'Enter' && this.currentAnswer.length > 0) {
            this.submitAnswer();
        }
    }

    updateAnswerDisplay() {
        this.answerText.setText(this.currentAnswer || "_");
    }

    submitAnswer() {
        const isCorrect = parseInt(this.currentAnswer) === this.correctAnswer;
        
        if (isCorrect) {
            this.feedbackText.setText("BRAVO!");
            this.feedbackText.setTint(0x44ff44);
        } else {
            this.feedbackText.setText(`NON! C'ETAIT ${this.correctAnswer}`);
            this.feedbackText.setTint(0xff4444);
        }
        
        // Disable further input
        this.input.keyboard.off('keydown', this.handleKeyInput, this);
        
        // Close after delay
        this.time.delayedCall(isCorrect ? 500 : 1500, () => {
            this.game.events.emit("quiz-answer", { correct: isCorrect });
            this.scene.stop();
        });
    }

    shutdown() {
        this.input.keyboard.off('keydown', this.handleKeyInput, this);
    }
}
