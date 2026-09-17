// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — main.js
// Phaser 3 game config and entry point
// ═══════════════════════════════════════════════════

const SCALE_W = 480;
const SCALE_H = 270;

const config = {
  type: Phaser.AUTO,
  width: SCALE_W,
  height: SCALE_H,
  backgroundColor: '#0a0a1a',
  parent: 'game-container',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: SCALE_W,
    height: SCALE_H,
  },

  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 680 },
      debug: false,
    },
  },

  scene: [
    BootScene,
    MenuScene,
    GameScene,
    UIScene,
    GameOverScene,
    WinScene,
  ],

  render: {
    pixelArt: false,
    antialias: true,
    roundPixels: false,
  },
};

const game = new Phaser.Game(config);

// Unlock AudioContext on first user interaction (browser autoplay policy)
document.addEventListener('pointerdown', () => {
  if (Audio.ctx && Audio.ctx.state === 'suspended') {
    Audio.ctx.resume();
  }
}, { once: true });

window.addEventListener('resize', () => {
  game.scale.refresh();
});
