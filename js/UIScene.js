// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — UIScene.js
// HUD overlay: score, lives, timer, combo
// ═══════════════════════════════════════════════════

class UIScene extends Phaser.Scene {
  constructor() { super({ key: 'UI', active: false }); }

  init(data) {
    this._gameScene = data.gameScene;
  }

  create() {
    const W = this.scale.width;
    this._score = 0;
    this._lives = 3;
    this._combo = 0;
    this._startTime = Date.now();

    // HUD panel - top left
    const g = this.add.graphics();
    g.fillStyle(0x000000, 0.45);
    g.fillRoundedRect(4, 4, 160, 36, 6);

    // Score
    this._scoreTxt = this.add.text(10, 8, '⭐ 0', {
      fontSize: '9px', fontFamily: 'Arial Black, Arial', color: '#FFD700',
    });

    // Lives (hearts)
    this._heartImgs = [];
    for (let i = 0; i < 3; i++) {
      this._heartImgs.push(this.add.image(10 + i * 18, 26, 'heart').setScale(0.85));
    }

    // Timer - top right
    const timerBg = this.add.graphics();
    timerBg.fillStyle(0x000000, 0.45);
    timerBg.fillRoundedRect(W - 68, 4, 64, 22, 6);
    this._timerTxt = this.add.text(W - 36, 15, '0:00.00', {
      fontSize: '8px', fontFamily: 'Courier New, monospace', color: '#b3e5fc',
    }).setOrigin(0.5);

    // Combo display - centre bottom
    this._comboBg = this.add.graphics();
    this._comboTxt = this.add.text(W/2, this.scale.height - 20, '', {
      fontSize: '10px', fontFamily: 'Arial Black, Arial', color: '#ffeb3b',
      stroke: '#e65100', strokeThickness: 3,
    }).setOrigin(0.5).setAlpha(0);

    // Hi score hint - top right below timer
    const hi = getHiScore();
    if (hi > 0) {
      const hiBg = this.add.graphics();
      hiBg.fillStyle(0x000000, 0.35);
      hiBg.fillRoundedRect(W - 68, 28, 64, 14, 4);
      this.add.text(W - 36, 35, `Best: ${hi}`, {
        fontSize: '7px', color: '#ffd54f',
      }).setOrigin(0.5);
    }

    // Listen to game events
    const gs = this._gameScene;
    gs.events.on('scoreUpdate', s => this._updateScore(s));
    gs.events.on('livesUpdate', l => this._updateLives(l));
    gs.events.on('comboUpdate', (c, m) => this._updateCombo(c, m));
    gs.events.on('comboReset', () => this._resetCombo());

    // Pause hint
    this.add.text(W/2, 8, 'ESC = Pause', {
      fontSize: '6px', color: 'rgba(255,255,255,0.4)',
    }).setOrigin(0.5, 0);
  }

  update() {
    // Timer
    if (this._gameScene && !this._gameScene.isWon && !this._gameScene.isDead) {
      const elapsed = this.time.now - (this._gameScene.startTime - 0);
      this._timerTxt.setText(fmtTime(elapsed));
    }
  }

  _updateScore(s) {
    this._score = s;
    this._scoreTxt.setText(`⭐ ${s}`);
    this.tweens.add({ targets: this._scoreTxt, scaleX: 1.2, scaleY: 1.2, duration: 80, yoyo: true });
  }

  _updateLives(l) {
    this._lives = l;
    this._heartImgs.forEach((h, i) => {
      if (i < l) {
        h.setTexture('heart').setAlpha(1);
      } else {
        h.setTexture('heart_empty').setAlpha(0.5);
      }
    });
    if (l < this._lives) {
      // Flash red
      this.cameras.main.flash(100, 255, 0, 0, false);
    }
  }

  _updateCombo(c, mult) {
    this._combo = c;
    this._comboTxt.setText(`🔥 COMBO x${c}  [x${mult}]`);
    this._comboTxt.setAlpha(1);
    this.tweens.add({ targets: this._comboTxt, scaleX: 1.15, scaleY: 1.15, duration: 100, yoyo: true });
  }

  _resetCombo() {
    this._combo = 0;
    this.tweens.add({ targets: this._comboTxt, alpha: 0, duration: 400 });
  }
}
