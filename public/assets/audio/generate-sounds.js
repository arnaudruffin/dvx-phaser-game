/**
 * Sound Generator for Donjon des Maths
 * Generates audio files using Web Audio API
 * Run with: node generate-sounds.js (requires ffmpeg and wav export)
 * 
 * Simplified version: Generate sounds inline in Phaser using Web Audio API
 */

const fs = require('fs');

// Helper to create audio data
function createAudioContext() {
    return new (window.AudioContext || window.webkitAudioContext)();
}

// Generate different sound types
function generateClickSound(ctx) {
    const now = ctx.currentTime;
    const duration = 0.15;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + duration);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.start(now);
    osc.stop(now + duration);
}

function generateCorrectSound(ctx, isCritical = false) {
    const now = ctx.currentTime;
    const duration = 0.3;
    const freq = isCritical ? 1000 : 600;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration * 0.5);
    osc.frequency.exponentialRampToValueAtTime(freq, now + duration);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.start(now);
    osc.stop(now + duration);
}

function generateWrongSound(ctx) {
    const now = ctx.currentTime;
    const duration = 0.4;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + duration);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    osc.start(now);
    osc.stop(now + duration);
}

// NOTE: In practice, these would be actual audio files.
// For development, we'll use Phaser's Web Audio API to generate sounds dynamically.

console.log('Audio files would be generated here.');
console.log('For now, sounds will be generated dynamically in the game using Web Audio API.');
