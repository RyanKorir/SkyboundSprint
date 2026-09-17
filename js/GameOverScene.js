// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — GameOverScene.js
// ═══════════════════════════════════════════════════

class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }

  init(data) { this.data = data; }

  create() {
    const W = this.scale.width, H = this.scale.height;

    this.add.image(W/2, H/2, 'bg_sky').setDisplaySize(W, H).setAlpha(0.4);

    const panel = this.add.graphics();
    panel.fillStyle(0x0a0a1e, 0.92);
    panel.fillRoundedRect(W/2-140, H/2-100, 280, 210, 14);
    panel.lineStyle(2, 0xf44336);
    panel.strokeRoundedRect(W/2-140, H/2-100, 280, 210, 14);

    this.add.text(W/2, H/2 - 80, '💀 GAME OVER', {
      fontSize: '18px', fontFamily: 'Arial Black', color: '#f44336',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5);

    const d = this.data;
    const rows = [
      ['Score', d.score],
      ['Time', fmtTime(d.time)],
      ['Deaths', d.deaths],
      [`Stars`, `${d.stars}/${d.total}`],
      ['Secrets', `${d.secrets}/${d.secretsTotal}`],
    ];

    rows.forEach((r, i) => {
      this.add.text(W/2 - 90, H/2 - 46 + i * 22, r[0], {
        fontSize: '9px', color: '#90a4ae', fontFamily: 'Arial',
      });
      this.add.text(W/2 + 90, H/2 - 46 + i * 22, String(r[1]), {
        fontSize: '9px', color: '#e3f2fd', fontFamily: 'Arial Black',
      }).setOrigin(1, 0);
    });

    this._makeBtn(W/2 - 55, H/2 + 80, 'TRY AGAIN', 0x1b5e20, () => {
      this.scene.start('Game');
    });
    this._makeBtn(W/2 + 55, H/2 + 80, 'MENU', 0x1a237e, () => {
      this.scene.start('Menu');
    });
  }

  _makeBtn(x, y, label, color, cb) {
    const t = this.add.text(x, y, label, {
      fontSize: '9px', fontFamily: 'Arial Black',
      color: '#fff', backgroundColor: null,
      padding: { x: 12, y: 7 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const g = this.add.graphics();
    const draw = (c) => {
      g.clear();
      g.fillStyle(c, 1);
      g.fillRoundedRect(x - t.width/2 - 12, y - t.height/2 - 7, t.width + 24, t.height + 14, 8);
      g.lineStyle(1, 0xffffff, 0.3);
      g.strokeRoundedRect(x - t.width/2 - 12, y - t.height/2 - 7, t.width + 24, t.height + 14, 8);
    };
    draw(color);
    t.setDepth(1);

    t.on('pointerover', () => draw(Phaser.Display.Color.ValueToColor(color).brighten(30).color));
    t.on('pointerout', () => draw(color));
    t.on('pointerdown', cb);
  }
}
