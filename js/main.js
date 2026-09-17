// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — main.js
// ═══════════════════════════════════════════════════
(function () {
  const config = {
    type: Phaser.AUTO,
    width:  480,
    height: 270,
    parent: 'game-container',
    backgroundColor: '#0a0a1a',
    antialias: true,
    physics: {
      default: 'arcade',
      arcade: { gravity: { y: 700 }, debug: false },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width:  480,
      height: 270,
      zoom: 2,
    },
    scene: [ BootScene, MenuScene, GameScene, UIScene, GameOverScene, WinScene ],
    input: { activePointers: 4 },
    fps: { target: 60 },
  };

  const game = new Phaser.Game(config);

  // Unlock audio on first touch (iOS requirement)
  const unlockAudio = () => {
    if (Audio.ctx && Audio.ctx.state === 'suspended') Audio.ctx.resume();
  };
  document.addEventListener('pointerdown', unlockAudio);
  document.addEventListener('keydown', unlockAudio);
})();
