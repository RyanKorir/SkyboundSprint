// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — AudioManager.js
// All audio generated procedurally via Web Audio API
// ═══════════════════════════════════════════════════

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this._musicNodes = [];
    this._musicPlaying = false;
    this.enabled = true;
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.7;
      this.sfxGain.connect(this.masterGain);
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.35;
      this.musicGain.connect(this.masterGain);
    } catch(e) { this.enabled = false; }
  }

  _tone(freq, type, duration, gain, dest, delay=0, ramp=true) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    g.gain.setValueAtTime(gain, now);
    if (ramp) g.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(g);
    g.connect(dest || this.sfxGain);
    osc.start(now);
    osc.stop(now + duration + 0.05);
    return { osc, g };
  }

  jump() {
    if (!this.enabled) return;
    this._tone(260, 'square', 0.05, 0.4, null);
    this._tone(420, 'square', 0.1, 0.3, null, 0.04);
  }

  land() {
    if (!this.enabled) return;
    this._tone(120, 'sawtooth', 0.08, 0.3, null);
  }

  collectStar() {
    if (!this.enabled) return;
    const freqs = [523, 659, 784, 1047];
    freqs.forEach((f, i) => this._tone(f, 'sine', 0.12, 0.25, null, i * 0.04));
  }

  collectCrystal() {
    if (!this.enabled) return;
    const freqs = [784, 988, 1175, 1568];
    freqs.forEach((f, i) => this._tone(f, 'sine', 0.15, 0.3, null, i * 0.04));
  }

  collectRelic() {
    if (!this.enabled) return;
    const freqs = [523, 659, 784, 1047, 1319, 1568];
    freqs.forEach((f, i) => this._tone(f, 'sine', 0.2, 0.35, null, i * 0.05));
  }

  combo(level) {
    if (!this.enabled) return;
    const base = 440 + level * 55;
    this._tone(base, 'square', 0.08, 0.3, null);
    this._tone(base * 1.5, 'square', 0.08, 0.2, null, 0.06);
  }

  stomp() {
    if (!this.enabled) return;
    this._tone(200, 'sawtooth', 0.05, 0.5, null);
    this._tone(80, 'sawtooth', 0.1, 0.4, null, 0.04);
  }

  damage() {
    if (!this.enabled) return;
    this._tone(180, 'sawtooth', 0.05, 0.5, null);
    this._tone(100, 'sawtooth', 0.1, 0.5, null, 0.05);
    this._tone(60,  'sawtooth', 0.15, 0.4, null, 0.1);
  }

  checkpoint() {
    if (!this.enabled) return;
    [523, 659, 784].forEach((f,i) => this._tone(f, 'sine', 0.15, 0.3, null, i*0.1));
  }

  win() {
    if (!this.enabled) return;
    const melody = [523,659,784,1047,784,1047,1319];
    melody.forEach((f,i) => this._tone(f,'sine',0.2,0.4,null,i*0.12));
  }

  die() {
    if (!this.enabled) return;
    [440,330,220,110].forEach((f,i) => this._tone(f,'sawtooth',0.12,0.4,null,i*0.1));
  }

  startMusic() {
    if (!this.enabled || this._musicPlaying) return;
    this._musicPlaying = true;
    this._playLoop();
  }

  stopMusic() {
    this._musicPlaying = false;
    this._musicNodes.forEach(n => { try { n.stop(); } catch(e){} });
    this._musicNodes = [];
  }

  _playLoop() {
    if (!this._musicPlaying || !this.ctx) return;
    // Simple chiptune arpeggio loop
    const bpm = 140;
    const beat = 60 / bpm;
    const pattern = [262,330,392,523,392,330,523,440,349,440,523,659,523,440,330,262];
    const bass =    [130,130,174,174,196,196,131,131,117,117,130,130,147,147,174,174];

    pattern.forEach((f,i) => {
      const n = this._tone(f,'square',beat*0.7,0.18,this.musicGain,i*beat);
      const b = this._tone(bass[i],'sawtooth',beat*0.5,0.12,this.musicGain,i*beat);
      if(n) this._musicNodes.push(n.osc);
      if(b) this._musicNodes.push(b.osc);
    });
    // Schedule next loop
    const loopTime = pattern.length * beat * 1000;
    setTimeout(() => {
      this._musicNodes = [];
      if (this._musicPlaying) this._playLoop();
    }, loopTime);
  }
}

const Audio = new AudioManager();
