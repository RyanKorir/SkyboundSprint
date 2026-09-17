// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — BootScene.js
// Generates all textures procedurally via canvas
// ═══════════════════════════════════════════════════

class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  create() {
    Audio.init();
    this._genAll();
    this.scene.start('Menu');
  }

  _genAll() {
    this._genPlayer();
    this._genEnemyWalker();
    this._genEnemyFlyer();
    this._genPlatforms();
    this._genCollectibles();
    this._genPortal();
    this._genCheckpoint();
    this._genBackground();
    this._genParticle();
    this._genHeart();
    this._genCloud();
    this._genSecretBlock();
    this._genMovingPlatform();
    this._genSpike();
  }

  _canvas(key, w, h, fn) {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    fn(ctx, w, h);
    this.textures.addCanvas(key, c);
  }

  _genPlayer() {
    this._canvas('player', 28, 32, (ctx) => {
      // Body
      ctx.fillStyle = '#ff7043';
      ctx.beginPath();
      ctx.ellipse(14, 20, 10, 12, 0, 0, Math.PI*2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#ffccbc';
      ctx.beginPath();
      ctx.ellipse(14, 9, 8, 9, 0, 0, Math.PI*2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#1a237e';
      ctx.beginPath();
      ctx.ellipse(11, 8, 2, 2.5, 0, 0, Math.PI*2);
      ctx.ellipse(17, 8, 2, 2.5, 0, 0, Math.PI*2);
      ctx.fill();
      // Eye shine
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(12, 7, 0.8, 0.8, 0, 0, Math.PI*2);
      ctx.ellipse(18, 7, 0.8, 0.8, 0, 0, Math.PI*2);
      ctx.fill();
      // Scarf
      ctx.fillStyle = '#26c6da';
      ctx.fillRect(6, 14, 16, 4);
      ctx.beginPath();
      ctx.moveTo(14,18); ctx.lineTo(10,26); ctx.lineTo(14,24); ctx.lineTo(18,26); ctx.closePath();
      ctx.fill();
      // Boots
      ctx.fillStyle = '#4a148c';
      ctx.fillRect(7, 28, 6, 4);
      ctx.fillRect(15, 28, 6, 4);
      // Outline
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(14, 20, 10, 12, 0, 0, Math.PI*2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(14, 9, 8, 9, 0, 0, Math.PI*2);
      ctx.stroke();
    });

    // Hurt frame (red flash)
    this._canvas('player_hurt', 28, 32, (ctx) => {
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.ellipse(14, 20, 10, 12, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(14, 9, 8, 9, 0, 0, Math.PI*2);
      ctx.fill();
    });
  }

  _genEnemyWalker() {
    this._canvas('enemy_walker', 26, 24, (ctx) => {
      // Body
      ctx.fillStyle = '#e53935';
      ctx.beginPath();
      ctx.ellipse(13, 14, 10, 10, 0, 0, Math.PI*2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.ellipse(9, 11, 3, 3.5, 0, 0, Math.PI*2);
      ctx.ellipse(17, 11, 3, 3.5, 0, 0, Math.PI*2);
      ctx.fill();
      // Pupils
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(10, 12, 1.5, 2, 0, 0, Math.PI*2);
      ctx.ellipse(18, 12, 1.5, 2, 0, 0, Math.PI*2);
      ctx.fill();
      // Angry brows
      ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(6,8); ctx.lineTo(12,10);
      ctx.moveTo(20,8); ctx.lineTo(14,10);
      ctx.stroke();
      // Feet
      ctx.fillStyle = '#b71c1c';
      ctx.beginPath();
      ctx.ellipse(8, 22, 5, 3, 0, 0, Math.PI*2);
      ctx.ellipse(18, 22, 5, 3, 0, 0, Math.PI*2);
      ctx.fill();
      // Horns
      ctx.fillStyle = '#ff6f00';
      ctx.beginPath();
      ctx.moveTo(9,4); ctx.lineTo(7,0); ctx.lineTo(11,5); ctx.closePath();
      ctx.moveTo(17,4); ctx.lineTo(19,0); ctx.lineTo(15,5); ctx.closePath();
      ctx.fill();
    });
  }

  _genEnemyFlyer() {
    this._canvas('enemy_flyer', 30, 24, (ctx) => {
      // Body
      ctx.fillStyle = '#8e24aa';
      ctx.beginPath();
      ctx.ellipse(15, 13, 9, 9, 0, 0, Math.PI*2);
      ctx.fill();
      // Wings
      ctx.fillStyle = 'rgba(186,104,200,0.8)';
      ctx.beginPath();
      ctx.ellipse(4, 10, 7, 5, -0.4, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(26, 10, 7, 5, 0.4, 0, Math.PI*2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#fff100';
      ctx.beginPath();
      ctx.ellipse(11, 11, 3, 3, 0, 0, Math.PI*2);
      ctx.ellipse(19, 11, 3, 3, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.ellipse(12, 11, 1.5, 1.5, 0, 0, Math.PI*2);
      ctx.ellipse(20, 11, 1.5, 1.5, 0, 0, Math.PI*2);
      ctx.fill();
      // Stinger
      ctx.fillStyle = '#f9a825';
      ctx.beginPath();
      ctx.moveTo(15,22); ctx.lineTo(12,24); ctx.lineTo(18,24); ctx.closePath();
      ctx.fill();
    });
  }

  _genPlatforms() {
    // Ground tile
    this._canvas('ground', 32, 32, (ctx) => {
      const grad = ctx.createLinearGradient(0,0,0,32);
      grad.addColorStop(0, '#6abf40');
      grad.addColorStop(0.18, '#5c8a32');
      grad.addColorStop(0.19, '#8B6914');
      grad.addColorStop(1, '#6b4e1a');
      ctx.fillStyle = grad;
      ctx.fillRect(0,0,32,32);
      // grass tufts
      ctx.fillStyle = '#82e04a';
      for(let x=2; x<30; x+=8) {
        ctx.fillRect(x, 0, 2, 3);
        ctx.fillRect(x+3, 1, 2, 2);
      }
      // dirt lines
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(0,8); ctx.lineTo(32,8); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,16); ctx.lineTo(32,16); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(16,8); ctx.lineTo(16,32); ctx.stroke();
    });

    // Stone platform
    this._canvas('platform', 32, 16, (ctx) => {
      ctx.fillStyle = '#78909c';
      ctx.fillRect(0,0,32,16);
      ctx.fillStyle = '#90a4ae';
      ctx.fillRect(0,0,32,4);
      ctx.fillStyle = '#546e7a';
      ctx.fillRect(0,12,32,4);
      // block lines
      ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth=1;
      ctx.strokeRect(0,0,32,16);
      ctx.beginPath(); ctx.moveTo(16,0); ctx.lineTo(16,16); ctx.stroke();
    });

    // Cloud platform (soft, fluffy)
    this._canvas('cloud_platform', 80, 24, (ctx) => {
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.beginPath();
      ctx.ellipse(20,16,20,12,0,0,Math.PI*2);
      ctx.ellipse(40,10,24,16,0,0,Math.PI*2);
      ctx.ellipse(62,16,20,12,0,0,Math.PI*2);
      ctx.fill();
      ctx.fillStyle = 'rgba(200,230,255,0.5)';
      ctx.beginPath();
      ctx.ellipse(40,20,36,8,0,0,Math.PI*2);
      ctx.fill();
    });
  }

  _genCollectibles() {
    // Star
    this._canvas('star', 16, 16, (ctx) => {
      ctx.fillStyle = '#FFD700';
      ctx.strokeStyle = '#ff8f00'; ctx.lineWidth=1;
      const pts = 5, outer=7, inner=3;
      ctx.beginPath();
      for(let i=0;i<pts*2;i++) {
        const r = i%2===0 ? outer : inner;
        const a = (i * Math.PI / pts) - Math.PI/2;
        const x = 8 + Math.cos(a)*r, y = 8 + Math.sin(a)*r;
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // shine
      ctx.fillStyle='rgba(255,255,255,0.6)';
      ctx.beginPath();
      ctx.ellipse(6,5,2,1.5,-0.5,0,Math.PI*2);
      ctx.fill();
    });

    // Crystal
    this._canvas('crystal', 14, 18, (ctx) => {
      ctx.fillStyle = '#00e5ff';
      ctx.strokeStyle = '#006064'; ctx.lineWidth=1;
      ctx.beginPath();
      ctx.moveTo(7,0); ctx.lineTo(13,5); ctx.lineTo(13,13); ctx.lineTo(7,18); ctx.lineTo(1,13); ctx.lineTo(1,5);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.moveTo(7,2); ctx.lineTo(10,5); ctx.lineTo(7,8); ctx.lineTo(4,5);
      ctx.closePath();
      ctx.fill();
    });

    // Relic (shining gem)
    this._canvas('relic', 18, 18, (ctx) => {
      ctx.fillStyle = '#ff6fff';
      ctx.strokeStyle = '#7b1fa2'; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(9,0); ctx.lineTo(18,7); ctx.lineTo(14,18); ctx.lineTo(4,18); ctx.lineTo(0,7);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // glow
      const g = ctx.createRadialGradient(9,9,0,9,9,9);
      g.addColorStop(0,'rgba(255,255,255,0.6)');
      g.addColorStop(1,'rgba(255,100,255,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.ellipse(9,9,9,9,0,0,Math.PI*2);
      ctx.fill();
    });
  }

  _genPortal() {
    this._canvas('portal', 40, 56, (ctx) => {
      // Outer ring
      for(let i=0;i<12;i++) {
        const a = (i/12)*Math.PI*2;
        const x = 20+Math.cos(a)*18, y = 28+Math.sin(a)*26;
        ctx.fillStyle = `hsl(${i*30},100%,60%)`;
        ctx.beginPath();
        ctx.ellipse(x,y,3,3,0,0,Math.PI*2);
        ctx.fill();
      }
      // Inner glow
      const g = ctx.createRadialGradient(20,28,2,20,28,15);
      g.addColorStop(0,'rgba(0,230,118,0.9)');
      g.addColorStop(0.5,'rgba(0,150,80,0.6)');
      g.addColorStop(1,'rgba(0,50,20,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.ellipse(20,28,15,22,0,0,Math.PI*2);
      ctx.fill();
      // Star in middle
      ctx.fillStyle='#fff';
      ctx.font='bold 18px Arial';
      ctx.textAlign='center';
      ctx.fillText('★',20,34);
    });
  }

  _genCheckpoint() {
    this._canvas('checkpoint', 20, 40, (ctx) => {
      // Pole
      ctx.fillStyle='#9e9e9e';
      ctx.fillRect(8,0,4,40);
      // Flag inactive
      ctx.fillStyle='#616161';
      ctx.beginPath();
      ctx.moveTo(12,2); ctx.lineTo(20,8); ctx.lineTo(12,14);
      ctx.closePath(); ctx.fill();
    });
    this._canvas('checkpoint_active', 20, 40, (ctx) => {
      ctx.fillStyle='#ffd54f';
      ctx.fillRect(8,0,4,40);
      ctx.fillStyle='#69f0ae';
      ctx.beginPath();
      ctx.moveTo(12,2); ctx.lineTo(20,8); ctx.lineTo(12,14);
      ctx.closePath(); ctx.fill();
      // glow
      const g = ctx.createRadialGradient(14,8,0,14,8,12);
      g.addColorStop(0,'rgba(105,240,174,0.5)');
      g.addColorStop(1,'rgba(105,240,174,0)');
      ctx.fillStyle=g;
      ctx.beginPath();
      ctx.ellipse(14,8,12,12,0,0,Math.PI*2);
      ctx.fill();
    });
  }

  _genBackground() {
    this._canvas('bg_sky', 480, 270, (ctx) => {
      const grad = ctx.createLinearGradient(0,0,0,270);
      grad.addColorStop(0,'#1a237e');
      grad.addColorStop(0.4,'#42a5f5');
      grad.addColorStop(1,'#b3e5fc');
      ctx.fillStyle=grad;
      ctx.fillRect(0,0,480,270);
      // stars
      ctx.fillStyle='rgba(255,255,255,0.8)';
      for(let i=0;i<30;i++) {
        const x=Math.random()*480, y=Math.random()*100;
        ctx.beginPath();
        ctx.arc(x,y,Math.random()*1.5,0,Math.PI*2);
        ctx.fill();
      }
    });

    this._canvas('bg_hills', 480, 120, (ctx) => {
      ctx.fillStyle='rgba(56,142,60,0.5)';
      const hills = [[50,80,100],[160,60,130],[320,75,110],[440,65,90]];
      hills.forEach(([x,y,r]) => {
        ctx.beginPath();
        ctx.ellipse(x,y,r,r*0.7,0,0,Math.PI*2);
        ctx.fill();
      });
    });
  }

  _genParticle() {
    this._canvas('particle', 6, 6, (ctx) => {
      const g = ctx.createRadialGradient(3,3,0,3,3,3);
      g.addColorStop(0,'rgba(255,255,255,1)');
      g.addColorStop(1,'rgba(255,255,255,0)');
      ctx.fillStyle=g;
      ctx.fillRect(0,0,6,6);
    });
  }

  _genHeart() {
    this._canvas('heart', 16, 14, (ctx) => {
      ctx.fillStyle='#ff1744';
      ctx.beginPath();
      ctx.moveTo(8,13);
      ctx.bezierCurveTo(8,13,1,8,1,5);
      ctx.bezierCurveTo(1,2,4,1,6,2);
      ctx.bezierCurveTo(7,3,8,4,8,4);
      ctx.bezierCurveTo(8,4,9,3,10,2);
      ctx.bezierCurveTo(12,1,15,2,15,5);
      ctx.bezierCurveTo(15,8,8,13,8,13);
      ctx.fill();
      ctx.fillStyle='rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.ellipse(6,5,2,1.5,-0.3,0,Math.PI*2);
      ctx.fill();
    });
    this._canvas('heart_empty', 16, 14, (ctx) => {
      ctx.strokeStyle='#555'; ctx.lineWidth=1.5;
      ctx.beginPath();
      ctx.moveTo(8,13);
      ctx.bezierCurveTo(8,13,1,8,1,5);
      ctx.bezierCurveTo(1,2,4,1,6,2);
      ctx.bezierCurveTo(7,3,8,4,8,4);
      ctx.bezierCurveTo(8,4,9,3,10,2);
      ctx.bezierCurveTo(12,1,15,2,15,5);
      ctx.bezierCurveTo(15,8,8,13,8,13);
      ctx.stroke();
    });
  }

  _genCloud() {
    this._canvas('cloud', 64, 32, (ctx) => {
      ctx.fillStyle='rgba(255,255,255,0.88)';
      ctx.beginPath();
      ctx.ellipse(16,22,16,12,0,0,Math.PI*2);
      ctx.ellipse(32,16,20,15,0,0,Math.PI*2);
      ctx.ellipse(50,22,14,11,0,0,Math.PI*2);
      ctx.fill();
    });
  }

  _genSecretBlock() {
    this._canvas('secret_block', 32, 32, (ctx) => {
      ctx.fillStyle='#1a237e';
      ctx.fillRect(0,0,32,32);
      ctx.fillStyle='rgba(255,255,255,0.05)';
      ctx.fillRect(0,0,32,32);
      ctx.strokeStyle='rgba(100,100,255,0.3)';
      ctx.lineWidth=1;
      ctx.strokeRect(1,1,30,30);
      // faint question mark
      ctx.fillStyle='rgba(150,150,255,0.15)';
      ctx.font='bold 20px Arial';
      ctx.textAlign='center';
      ctx.fillText('?',16,22);
    });
  }

  _genMovingPlatform() {
    this._canvas('moving_platform', 64, 14, (ctx) => {
      const grad = ctx.createLinearGradient(0,0,0,14);
      grad.addColorStop(0,'#ef9a9a');
      grad.addColorStop(0.3,'#e53935');
      grad.addColorStop(1,'#b71c1c');
      ctx.fillStyle=grad;
      ctx.fillRect(0,0,64,14);
      ctx.fillStyle='rgba(255,255,255,0.2)';
      ctx.fillRect(0,0,64,3);
      ctx.strokeStyle='rgba(0,0,0,0.2)';
      ctx.lineWidth=1;
      ctx.strokeRect(0,0,64,14);
    });
  }

  _genSpike() {
    this._canvas('spike', 16, 16, (ctx) => {
      ctx.fillStyle='#607d8b';
      ctx.beginPath();
      ctx.moveTo(0,16); ctx.lineTo(8,0); ctx.lineTo(16,16);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle='#90a4ae';
      ctx.beginPath();
      ctx.moveTo(2,16); ctx.lineTo(8,3); ctx.lineTo(14,16);
      ctx.closePath(); ctx.fill();
    });
  }
}
