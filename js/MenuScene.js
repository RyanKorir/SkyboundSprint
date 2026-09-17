// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — MenuScene.js
// ═══════════════════════════════════════════════════

class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create() {
    const W = this.scale.width, H = this.scale.height;

    // Sky background
    this.add.image(W/2, H/2, 'bg_sky').setDisplaySize(W, H);
    this.add.image(W/2, H - 60, 'bg_hills').setDisplaySize(W, 120).setAlpha(0.7);

    // Floating clouds
    this._clouds = [];
    for (let i = 0; i < 4; i++) {
      const c = this.add.image(
        Phaser.Math.Between(20, W-20),
        Phaser.Math.Between(30, H/2),
        'cloud'
      ).setAlpha(0.8).setScale(Phaser.Math.FloatBetween(0.7, 1.3));
      this._clouds.push({ img: c, speed: Phaser.Math.FloatBetween(0.1, 0.3) });
    }

    // Ground
    for (let x = 0; x < W; x += 32) {
      this.add.image(x + 16, H - 16, 'ground').setDisplaySize(32, 32);
    }

    // Title panel
    const panelX = W/2, panelY = H/2 - 20;
    const panel = this.add.graphics();
    panel.fillStyle(0x0a0a2e, 0.85);
    panel.fillRoundedRect(panelX - 160, panelY - 80, 320, 200, 16);
    panel.lineStyle(2, 0x5c6bc0, 1);
    panel.strokeRoundedRect(panelX - 160, panelY - 80, 320, 200, 16);

    // Title text with glow effect
    const titleShadow = this.add.text(panelX+2, panelY - 58, 'SKYBOUND SPRINT', {
      fontSize: '22px', fontFamily: 'Arial Black, Arial', color: '#1a237e',
    }).setOrigin(0.5);

    this.add.text(panelX, panelY - 60, 'SKYBOUND SPRINT', {
      fontSize: '22px', fontFamily: 'Arial Black, Arial',
      color: '#ffffff',
      stroke: '#3949ab', strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(panelX, panelY - 36, '✦ Sky Adventure ✦', {
      fontSize: '9px', fontFamily: 'Arial', color: '#90caf9',
    }).setOrigin(0.5);

    // Hi score
    const hi = getHiScore();
    const bt = getBestTime();
    this.add.text(panelX, panelY - 16, `Best: ${hi} pts${bt ? '  |  ' + fmtTime(bt) : ''}`, {
      fontSize: '8px', fontFamily: 'Arial', color: '#ffd54f',
    }).setOrigin(0.5);

    // Menu buttons
    this._makeBtn(panelX, panelY + 14, '  ▶  PLAY  ', 0x1b5e20, 0x43a047, () => {
      Audio.init();
      this.scene.start('Game');
    });
    this._makeBtn(panelX, panelY + 46, '  ?  HOW TO PLAY  ', 0x1a237e, 0x3949ab, () => {
      this._showHelp();
    });
    this._makeBtn(panelX, panelY + 78, '  ♪  SOUND: ON  ', 0x4a148c, 0x7b1fa2, () => {
      Audio.enabled = !Audio.enabled;
    }, 'soundBtn');

    // Decorative collectibles bouncing
    this._star = this.add.image(panelX - 130, panelY - 20, 'star').setScale(1.5);
    this._crystal = this.add.image(panelX + 130, panelY - 20, 'crystal').setScale(1.5);
    this._relic = this.add.image(panelX, panelY - 90, 'relic').setScale(1.5);

    this.tweens.add({ targets: this._star, y: '+=8', duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: this._crystal, y: '+=8', duration: 1100, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 200 });
    this.tweens.add({ targets: this._relic, y: '+=6', duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 400 });

    // Version
    this.add.text(W - 4, H - 4, 'v1.0 MVP', {
      fontSize: '7px', color: '#546e7a',
    }).setOrigin(1, 1);

    // Controls reminder
    this.add.text(4, H - 4, 'WASD / Arrows / Touch', {
      fontSize: '7px', color: '#546e7a',
    }).setOrigin(0, 1);

    this._helpVisible = false;
    this._helpPanel = null;
  }

  _makeBtn(x, y, label, bgColor, hoverColor, cb, id) {
    const btn = this.add.graphics();
    const textObj = this.add.text(x, y, label, {
      fontSize: '10px', fontFamily: 'Arial Black, Arial', color: '#ffffff',
      padding: { x: 14, y: 8 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const w = textObj.width + 4, h = textObj.height + 4;
    const draw = (col) => {
      btn.clear();
      btn.fillStyle(col, 1);
      btn.fillRoundedRect(x - w/2 - 2, y - h/2 - 2, w + 4, h + 4, 8);
      btn.lineStyle(1.5, 0xffffff, 0.4);
      btn.strokeRoundedRect(x - w/2 - 2, y - h/2 - 2, w + 4, h + 4, 8);
    };
    draw(bgColor);

    textObj.on('pointerover', () => { draw(hoverColor); this.input.setDefaultCursor('pointer'); });
    textObj.on('pointerout', () => { draw(bgColor); this.input.setDefaultCursor('default'); });
    textObj.on('pointerdown', () => {
      this.tweens.add({ targets: textObj, scaleX: 0.95, scaleY: 0.95, duration: 80, yoyo: true });
      cb();
    });

    if (id) this[id + '_text'] = textObj;
    return { btn, textObj };
  }

  _showHelp() {
    if (this._helpVisible) {
      if (this._helpPanel) this._helpPanel.destroy();
      this._helpVisible = false;
      return;
    }
    this._helpVisible = true;
    const W = this.scale.width, H = this.scale.height;
    const g = this.add.graphics();
    g.fillStyle(0x000020, 0.95);
    g.fillRoundedRect(20, 20, W-40, H-40, 12);
    g.lineStyle(2, 0x5c6bc0);
    g.strokeRoundedRect(20, 20, W-40, H-40, 12);

    const lines = [
      '— HOW TO PLAY —',
      '',
      '♦ Move: A/D  or  ← →  or touch buttons',
      '♦ Jump: W / Up / Space / touch ▲',
      '♦ Stomp: Land on enemies to defeat them',
      '',
      '⭐ Stars = 10 pts   ◆ Crystals = 50 pts',
      '✦ Relics = 100 pts (hidden!)',
      '',
      '🔥 Combo: Collect without stopping',
      '   for a score multiplier!',
      '',
      '💀 3 hearts — land on enemies to stomp',
      '   them. Touching their side = damage.',
      '',
      '🏁 Find the green portal to finish!',
      '   Look for secret areas...',
      '',
      '[ TAP / CLICK TO CLOSE ]',
    ];

    const textGroup = this.add.text(W/2, 35, lines.join('\n'), {
      fontSize: '9px', fontFamily: 'Arial', color: '#e3f2fd',
      lineSpacing: 4, align: 'center',
    }).setOrigin(0.5, 0);

    this._helpPanel = this.add.container(0,0,[g, textGroup]);
    this._helpPanel.setInteractive(new Phaser.Geom.Rectangle(20,20,W-40,H-40), Phaser.Geom.Rectangle.Contains);
    this._helpPanel.on('pointerdown', () => {
      this._helpPanel.destroy();
      this._helpPanel = null;
      this._helpVisible = false;
    });
  }

  update() {
    this._clouds.forEach(c => {
      c.img.x += c.speed;
      if (c.img.x > this.scale.width + 64) c.img.x = -64;
    });
  }
}
