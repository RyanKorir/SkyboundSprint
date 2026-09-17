// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — WinScene.js
// ═══════════════════════════════════════════════════

class WinScene extends Phaser.Scene {
  constructor() { super('Win'); }
  init(data) { this.data = data; }

  create() {
    const W = this.scale.width, H = this.scale.height;
    const d = this.data;

    this.add.image(W/2, H/2, 'bg_sky').setDisplaySize(W, H);
    this.add.image(W/2, H-60, 'bg_hills').setDisplaySize(W, 120).setAlpha(0.5);

    // Celebration particles
    for (let i = 0; i < 40; i++) {
      const colors = [C.star, C.crystal, C.relic, C.portal, C.check];
      const col = colors[i % colors.length];
      const img = this.add.image(
        Phaser.Math.Between(40, W-40),
        Phaser.Math.Between(20, H-20),
        'particle'
      ).setScale(2).setTint(col).setAlpha(0);
      this.tweens.add({
        targets: img, alpha: 1, scaleX: 0.2, scaleY: 0.2,
        delay: Math.random() * 1200, duration: 800 + Math.random() * 600,
        ease: 'Cubic.easeOut',
      });
    }

    // Stars raining
    for (let i = 0; i < 8; i++) {
      const s = this.add.image(Phaser.Math.Between(20,W-20), -20, 'star').setScale(1.5);
      this.tweens.add({ targets: s, y: H+20, delay: i*200, duration: 1400+Math.random()*600, repeat:-1 });
    }

    // Panel
    const panel = this.add.graphics();
    panel.fillStyle(0x001a00, 0.9);
    panel.fillRoundedRect(W/2-155, H/2-115, 310, 240, 14);
    panel.lineStyle(2.5, 0x00e676);
    panel.strokeRoundedRect(W/2-155, H/2-115, 310, 240, 14);

    this.add.text(W/2, H/2-96, '🏆 LEVEL COMPLETE!', {
      fontSize:'15px', fontFamily:'Arial Black', color:'#00e676',
      stroke:'#004d1a', strokeThickness:3,
    }).setOrigin(0.5);

    const grade = this._calcGrade(d);
    this.add.text(W/2, H/2-74, grade.label, {
      fontSize:'11px', fontFamily:'Arial Black', color:grade.color,
    }).setOrigin(0.5);

    const hi = getHiScore(), bt = getBestTime();
    const isNewHi = d.score >= hi, isNewBt = bt > 0 && d.time <= bt;

    const rows = [
      ['⏱  Time',    fmtTime(d.time) + (isNewBt ? '  🏆 BEST!' : '')],
      ['⭐ Score',   d.score + (isNewHi ? '  🏆 BEST!' : '')],
      ['💀 Deaths',  d.deaths],
      ['✦  Stars',   d.stars+' / '+d.total],
      ['🔍 Secrets', d.secrets+' / '+d.secretsTotal],
    ];
    rows.forEach((r, i) => {
      const isGold = String(r[1]).includes('BEST!');
      this.add.text(W/2-110, H/2-48+i*22, r[0], { fontSize:'9px', color:'#a5d6a7', fontFamily:'Arial' });
      this.add.text(W/2+110, H/2-48+i*22, String(r[1]), {
        fontSize:'9px', color: isGold ? '#ffd54f' : '#e8f5e9',
        fontFamily: isGold ? 'Arial Black' : 'Arial',
      }).setOrigin(1,0);
    });

    const tip = this._getTip(d);
    this.add.text(W/2, H/2+66, tip, {
      fontSize:'7px', color:'#80cbc4', fontFamily:'Arial',
      wordWrap:{ width:280 }, align:'center',
    }).setOrigin(0.5);

    this._makeBtn(W/2-70, H/2+96, 'PLAY AGAIN', 0x1b5e20, 0x2e7d32, () => this.scene.start('Game'));
    this._makeBtn(W/2+70, H/2+96, 'MENU', 0x1a237e, 0x283593, () => this.scene.start('Menu'));
  }

  _calcGrade(d) {
    const pct = d.total > 0 ? d.stars/d.total : 0;
    if (pct>=0.9 && d.secrets>=d.secretsTotal && d.deaths===0 && d.time<120000) return { label:'★★★  S RANK — PERFECT!', color:'#ffd54f' };
    if (pct>=0.8 && d.secrets>=d.secretsTotal && d.deaths<=1)                   return { label:'★★★  A RANK — Excellent!', color:'#69f0ae' };
    if (pct>=0.6 && d.deaths<=3)                                                  return { label:'★★    B RANK — Well Done!', color:'#40c4ff' };
    if (pct>=0.4)                                                                  return { label:'★      C RANK — Good Run!', color:'#ef9a9a' };
    return                                                                                { label:'        D RANK — Try Again!', color:'#9e9e9e' };
  }

  _getTip(d) {
    if (d.secrets<d.secretsTotal) return '💡 Hidden areas exist — look for suspicious walls and unusual platforms!';
    if (d.deaths>3)               return '💡 Checkpoints save you — make sure to run through them!';
    if (d.stars<d.total*0.6)      return '💡 The cloud route above has rare crystals — worth the risky jump!';
    if (d.time>180000)            return '💡 Try a speedrun — skip enemies and use the shortcut for a faster time!';
    return '🌟 Amazing run! Can you beat your score next time?';
  }

  _makeBtn(x, y, label, bgColor, hoverColor, cb) {
    const t = this.add.text(x, y, label, {
      fontSize:'9px', fontFamily:'Arial Black', color:'#fff', padding:{x:12,y:7},
    }).setOrigin(0.5).setInteractive({useHandCursor:true}).setDepth(1);
    const g = this.add.graphics();
    const draw = (col) => {
      g.clear();
      g.fillStyle(col,1);
      g.fillRoundedRect(x-t.width/2-12, y-t.height/2-7, t.width+24, t.height+14, 8);
      g.lineStyle(1.5,0xffffff,0.3);
      g.strokeRoundedRect(x-t.width/2-12, y-t.height/2-7, t.width+24, t.height+14, 8);
    };
    draw(bgColor);
    t.on('pointerover', ()=>draw(hoverColor));
    t.on('pointerout',  ()=>draw(bgColor));
    t.on('pointerdown', ()=>{ this.tweens.add({targets:t,scaleX:0.95,scaleY:0.95,duration:80,yoyo:true}); cb(); });
  }
}
