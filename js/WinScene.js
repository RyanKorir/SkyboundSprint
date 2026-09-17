// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — WinScene.js
// Level Complete / Victory screen
// ═══════════════════════════════════════════════════

class WinScene extends Phaser.Scene {
  constructor() { super('Win'); }

  init(data) { this.data = data; }

  create() {
    const W = this.scale.width, H = this.scale.height;

    this.add.image(W/2, H/2, 'bg_sky').setDisplaySize(W, H);
    this.add.image(W/2, H - 50, 'bg_hills').setDisplaySize(W, 100).setAlpha(0.6);

    // Confetti
    this._confetti = [];
    for (let i = 0; i < 40; i++) {
      const colors = [C.star, C.crystal, C.relic, C.portal, 0xff1744, 0x00e5a0];
      const p = this.add.image(
        Phaser.Math.Between(0, W), Phaser.Math.Between(-20, H/2), 'particle'
      ).setScale(Phaser.Math.FloatBetween(0.8, 2.5))
       .setTint(colors[Phaser.Math.Between(0, colors.length - 1)])
       .setAlpha(Phaser.Math.FloatBetween(0.6, 1));
      this._confetti.push({ img: p, vx: Phaser.Math.FloatBetween(-0.5, 0.5), vy: Phaser.Math.FloatBetween(0.4, 1.2), rot: Phaser.Math.FloatBetween(-0.03, 0.03) });
    }

    // Panel
    const panel = this.add.graphics();
    panel.fillStyle(0x0a0a2e, 0.92);
    panel.fillRoundedRect(W/2 - 155, H/2 - 115, 310, 245, 16);
    panel.lineStyle(2.5, 0x00e676, 1);
    panel.strokeRoundedRect(W/2 - 155, H/2 - 115, 310, 245, 16);

    this.add.text(W/2, H/2 - 96, '🏆 LEVEL COMPLETE!', {
      fontSize: '16px', fontFamily: 'Arial Black, Arial',
      color: '#00e676', stroke: '#004d40', strokeThickness: 3,
    }).setOrigin(0.5);

    // Grade
    const d = this.data;
    const pct = d.total > 0 ? d.stars / d.total : 0;
    const noDeaths = d.deaths === 0;
    const allSecrets = d.secrets >= d.secretsTotal;
    let grade = 'C';
    if (pct >= 0.9 && noDeaths && allSecrets) grade = 'S';
    else if (pct >= 0.8 && noDeaths) grade = 'A';
    else if (pct >= 0.6) grade = 'B';
    const gradeColors = { S: '#ffd700', A: '#69f0ae', B: '#40c4ff', C: '#90a4ae' };

    this.add.text(W/2, H/2 - 75, 'Grade: ' + grade, {
      fontSize: '20px', fontFamily: 'Arial Black',
      color: gradeColors[grade], stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);

    const prevBest = getBestTime();
    const isNewPB = prevBest === 0 || d.time < prevBest;
    saveHiScore(d.score);
    saveBestTime(d.time);

    if (isNewPB) {
      const pbTxt = this.add.text(W/2, H/2 - 54, '★ NEW BEST TIME! ★', {
        fontSize: '9px', fontFamily: 'Arial Black', color: '#ffd700',
      }).setOrigin(0.5);
      this.tweens.add({ targets: pbTxt, scaleX: 1.1, scaleY: 1.1, duration: 400, yoyo: true, repeat: -1 });
    }

    // Stats
    const rows = [
      ['SCORE',   String(d.score),              '#e3f2fd'],
      ['TIME',    fmtTime(d.time),               isNewPB ? '#ffd700' : '#e3f2fd'],
      ['DEATHS',  String(d.deaths),              d.deaths === 0 ? '#69f0ae' : '#ff8a65'],
      ['STARS',   d.stars + '/' + d.total,       pct >= 0.9 ? '#ffd700' : '#e3f2fd'],
      ['SECRETS', d.secrets + '/' + d.secretsTotal, allSecrets ? '#ffd700' : '#e3f2fd'],
    ];

    const ry = H/2 - 30;
    rows.forEach((r, i) => {
      const y = ry + i * 22;
      if (i % 2 === 0) {
        const rb = this.add.graphics();
        rb.fillStyle(0xffffff, 0.04);
        rb.fillRect(W/2 - 140, y - 2, 280, 20);
      }
      this.add.text(W/2 - 130, y, r[0], { fontSize: '9px', fontFamily: 'Arial', color: '#78909c' });
      this.add.text(W/2 + 130, y, r[1], { fontSize: '9px', fontFamily: 'Arial Black', color: r[2] }).setOrigin(1, 0);
    });

    const msg = grade === 'S' ? 'PERFECT RUN! You are a legend!' :
                grade === 'A' ? 'Excellent! Can you get an S rank?' :
                grade === 'B' ? 'Good job! Try finding all secrets.' :
                                'Keep exploring to find hidden relics!';
    this.add.text(W/2, H/2 + 84, msg, { fontSize: '7px', color: '#80deea', fontFamily: 'Arial' }).setOrigin(0.5);

    this._makeBtn(W/2 - 65, H/2 + 108, 'PLAY AGAIN', 0x1b5e20, 0x43a047, () => this.scene.start('Game'));
    this._makeBtn(W/2 + 65, H/2 + 108, 'MENU', 0x1a237e, 0x3949ab, () => this.scene.start('Menu'));
  }

  update() {
    this._confetti.forEach(c => {
      c.img.x += c.vx; c.img.y += c.vy; c.img.angle += c.rot * 57;
      if (c.img.y > this.scale.height + 20) { c.img.y = -20; c.img.x = Phaser.Math.Between(0, this.scale.width); }
    });
  }

  _makeBtn(x, y, label, bg, hov, cb) {
    const g = this.add.graphics();
    const t = this.add.text(x, y, label, {
      fontSize: '9px', fontFamily: 'Arial Black', color: '#fff', padding: { x: 12, y: 7 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(1);
    const draw = (c) => { g.clear(); g.fillStyle(c,1); g.fillRoundedRect(x-t.width/2-14, y-t.height/2-9, t.width+28, t.height+18, 8); g.lineStyle(1.5,0xffffff,0.3); g.strokeRoundedRect(x-t.width/2-14,y-t.height/2-9,t.width+28,t.height+18,8); };
    draw(bg);
    t.on('pointerover', () => draw(hov));
    t.on('pointerout',  () => draw(bg));
    t.on('pointerdown', () => { this.tweens.add({ targets: t, scaleX: 0.93, scaleY: 0.93, duration: 80, yoyo: true }); cb(); });
  }
}
