// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — GameScene.js
// Full gameplay: player, enemies, collectibles, level
// ═══════════════════════════════════════════════════

class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }

  init() {
    this.score = 0;
    this.lives = 3;
    this.deaths = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.comboMax = 0;
    this.starsTotal = 0;
    this.starsCollected = 0;
    this.secretsTotal = 0;
    this.secretsFound = 0;
    this.checkpointX = null;
    this.checkpointY = null;
    this.startTime = 0;
    this.isHurt = false;
    this.hurtTimer = 0;
    this.isDead = false;
    this.isWon = false;
    this.onGround = false;
    this.wasOnGround = false;
    this.secretAreaOpen = false;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    Audio.startMusic();
    this.startTime = this.time.now;

    // World bounds
    const WORLD_W = 3200;
    this.physics.world.setBounds(0, 0, WORLD_W, H + 200);
    this.cameras.main.setBounds(0, 0, WORLD_W, H);

    // Background layers (parallax)
    this._buildBackground(WORLD_W, H);

    // Level geometry
    this._buildLevel(H, WORLD_W);

    // Player
    this._createPlayer(H);

    // Camera follow
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(80, 60);

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this._jumpKey = false;
    this._jumpPressed = false;

    // Pause
    this.input.keyboard.on('keydown-ESC', () => this._togglePause());
    this.input.keyboard.on('keydown-P', () => this._togglePause());

    // Mobile touch controls
    this._buildTouchControls();

    // Start UI scene
    this.scene.launch('UI', { gameScene: this });

    // Pause overlay
    this._paused = false;
    this._pauseOverlay = null;

    // Score popup pool
    this._popups = [];
  }

  // ── Level Construction ────────────────────────────────────────

  _buildBackground(W, H) {
    // Sky tiled
    this.add.tileSprite(W/2, H/2, W, H, 'bg_sky').setScrollFactor(0.0);

    // Hills layer
    for (let x = 0; x < W; x += 480) {
      this.add.image(x + 240, H - 60, 'bg_hills').setDisplaySize(480, 120).setScrollFactor(0.2).setAlpha(0.5);
    }

    // Floating clouds (decorative)
    for (let i = 0; i < 18; i++) {
      this.add.image(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(20, H - 120),
        'cloud'
      ).setScrollFactor(Phaser.Math.FloatBetween(0.1, 0.5))
       .setAlpha(Phaser.Math.FloatBetween(0.5, 0.9))
       .setScale(Phaser.Math.FloatBetween(0.6, 1.4));
    }
  }

  _buildLevel(H, WORLD_W) {
    const GH = H; // ground height reference

    // Static platforms group
    this.platforms = this.physics.add.staticGroup();
    this.movingPlatforms = this.physics.add.group({ immovable: true, allowGravity: false });
    this.spikes = this.physics.add.staticGroup();
    this.secretBlocks = this.physics.add.staticGroup();

    const addGround = (x, y, w, tile='ground') => {
      for (let i = 0; i < w; i++) {
        const t = this.platforms.create(x + i*32 + 16, y + 16, tile);
        t.setDisplaySize(32, 32).refreshBody();
      }
    };

    const addPlat = (x, y, w, tile='platform') => {
      for (let i = 0; i < w; i++) {
        const t = this.platforms.create(x + i*32 + 16, y + 8, tile);
        t.setDisplaySize(32, 16).refreshBody();
      }
    };

    const addCloud = (x, y) => {
      const t = this.platforms.create(x + 40, y + 12, 'cloud_platform');
      t.setDisplaySize(80, 24).refreshBody();
    };

    const addMoving = (x, y, rangeX, rangeY, speed=60) => {
      const mp = this.movingPlatforms.create(x, y, 'moving_platform');
      mp.setDisplaySize(64, 14);
      mp.body.setSize(64, 14);
      mp._startX = x; mp._startY = y;
      mp._rangeX = rangeX; mp._rangeY = rangeY;
      mp._speed = speed; mp._t = 0;
    };

    const addSpike = (x, y) => {
      const s = this.spikes.create(x + 8, y + 8, 'spike');
      s.setDisplaySize(16,16).refreshBody();
    };

    const addSecretBlock = (x, y) => {
      const b = this.secretBlocks.create(x + 16, y + 16, 'secret_block');
      b.setDisplaySize(32, 32).refreshBody();
      b._revealed = false;
    };

    // ════ GROUND SECTIONS ════

    // 1. Tutorial area (x=0 to 640)
    addGround(0, GH-32, 20);   // solid start ground

    // 2. First gap, then platforms
    addGround(700, GH-32, 6);
    addPlat(820, GH-80, 3);
    addPlat(920, GH-60, 3);
    addGround(1000, GH-32, 8);

    // 3. Enemy section with platforms
    addGround(1280, GH-32, 10);
    addPlat(1450, GH-90, 2);
    addPlat(1520, GH-120, 2);
    addPlat(1600, GH-90, 2);
    addGround(1680, GH-32, 6);

    // 4. Moving platforms section
    addGround(1900, GH-32, 4);
    addMoving(2000, GH-90, 80, 0, 55);
    addMoving(2120, GH-120, 0, 60, 45);
    addMoving(2240, GH-80, 90, 0, 65);
    addGround(2380, GH-32, 4);

    // 5. Precision section with spikes
    addGround(2560, GH-32, 3);
    addSpike(2660, GH-48);
    addSpike(2676, GH-48);
    addPlat(2720, GH-100, 2);
    addSpike(2810, GH-48);
    addSpike(2826, GH-48);
    addSpike(2842, GH-48);
    addPlat(2890, GH-110, 2);
    addGround(2960, GH-32, 4);

    // 6. Optional risky route (high up)
    addCloud(680, GH-140);
    addCloud(780, GH-160);
    addCloud(880, GH-150);
    addCloud(980, GH-170);

    // 7. Secret area hint wall
    addPlat(1820, GH-80, 4);
    addSecretBlock(1820, GH-112);  // reveals secret passage

    // 8. Final challenge area
    addGround(3050, GH-32, 4);
    addMoving(3160, GH-80, 0, 70, 50);
    addMoving(3220, GH-130, 60, 0, 70);
    addGround(3060, GH-32, 3);   // landing after last moving plat

    // 9. Finish ground
    addGround(3100, GH-32, 12);

    // ════ COLLECTIBLES ════
    this.collectibles = this.physics.add.staticGroup();

    const addStar = (x, y) => {
      const s = this.collectibles.create(x, y, 'star');
      s.setDisplaySize(16,16).refreshBody();
      s._type = 'star'; s._val = SCORES.star;
      this.starsTotal++;
    };
    const addCrystal = (x, y) => {
      const s = this.collectibles.create(x, y, 'crystal');
      s.setDisplaySize(14,18).refreshBody();
      s._type = 'crystal'; s._val = SCORES.crystal;
      this.starsTotal++;
    };
    const addRelic = (x, y) => {
      const s = this.collectibles.create(x, y, 'relic');
      s.setDisplaySize(18,18).refreshBody();
      s._type = 'relic'; s._val = SCORES.relic;
      s._isSecret = true;
      this.starsTotal++;
      this.secretsTotal++;
    };

    // Tutorial stars (easy grab)
    for (let x = 80; x <= 560; x += 48) addStar(x, GH-56);

    // Gap jump reward
    addCrystal(740, GH-110);
    for (let x = 760; x <= 960; x += 40) addStar(x, GH-100);

    // Platform stars
    addStar(820+16, GH-110);
    addStar(920+16, GH-90);
    addCrystal(1040, GH-56);

    // Enemy section
    for (let x = 1300; x <= 1650; x += 50) addStar(x, GH-56);
    addCrystal(1460, GH-120);
    addCrystal(1540, GH-150);

    // Moving platform crystals (risky)
    addCrystal(2010, GH-115);
    addCrystal(2130, GH-150);
    addCrystal(2250, GH-110);

    // Precision section (risky placement)
    addStar(2730, GH-130);
    addCrystal(2900, GH-140);

    // High cloud route (risk/reward)
    addCrystal(700+40, GH-168);
    addCrystal(800+40, GH-188);
    addCrystal(900+40, GH-178);
    addRelic(990+40, GH-205);   // SECRET RELIC on cloud route

    // Secret area relic (behind secret block)
    addRelic(1870, GH-56);    // appears behind secret block

    // Final challenge
    addCrystal(3165, GH-110);
    addCrystal(3225, GH-165);

    // Finish line stars
    for (let x = 3110; x <= 3330; x += 44) addStar(x, GH-56);
    addRelic(3380, GH-56);    // third relic at the very end

    // ════ ENEMIES ════
    this.enemies = this.physics.add.group({ allowGravity: true, collideWorldBounds: true });

    const addWalker = (x, patrolDist=80) => {
      const e = this.enemies.create(x, GH-60, 'enemy_walker');
      e.setDisplaySize(26,24);
      e.body.setSize(22, 20);
      e._type = 'walker';
      e._patrolStart = x - patrolDist/2;
      e._patrolEnd = x + patrolDist/2;
      e._dir = 1;
      e.setVelocityX(50);
    };

    const addFlyer = (x, y, range=60) => {
      const e = this.enemies.create(x, y, 'enemy_flyer');
      e.setDisplaySize(30,24);
      e.body.setSize(24, 18);
      e.body.allowGravity = false;
      e._type = 'flyer';
      e._startY = y;
      e._range = range;
      e._t = Math.random() * Math.PI * 2;
    };

    // Tutorial: 1 slow walker (easy stomp practice)
    addWalker(360, 60);

    // Enemy section
    addWalker(1310, 80);
    addWalker(1480, 70);
    addWalker(1620, 90);
    addFlyer(1540, GH-120, 50);

    // Moving platform section — flyers make it harder
    addFlyer(2050, GH-145, 55);
    addFlyer(2200, GH-110, 45);

    // Precision section — walkers on platforms
    addWalker(2570, 40);

    // Final challenge
    addFlyer(3070, GH-120, 70);
    addWalker(3140, 70);

    // ════ CHECKPOINT ════
    this.checkpoints = this.physics.add.staticGroup();
    const cp1 = this.checkpoints.create(1260, GH-60, 'checkpoint');
    cp1.setDisplaySize(20,40).refreshBody();
    cp1._active = false;
    const cp2 = this.checkpoints.create(2540, GH-60, 'checkpoint');
    cp2.setDisplaySize(20,40).refreshBody();
    cp2._active = false;

    // ════ PORTAL ════
    this.portal = this.physics.add.staticSprite(3360, GH-60, 'portal');
    this.portal.setDisplaySize(40,56).refreshBody();
    this.tweens.add({ targets: this.portal, angle: 360, duration: 3000, repeat: -1 });

    // ════ PHYSICS COLLIDERS ════
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.movingPlatforms);
  }

  _createPlayer(H) {
    const startX = 50, startY = H - 80;
    this.player = this.physics.add.sprite(startX, startY, 'player');
    this.player.setDisplaySize(28, 32);
    this.player.body.setSize(20, 28);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(600);
    this.player.setDragX(800);
    this.player.setMaxVelocityX(180);

    // Collide with world
    this.physics.add.collider(this.player, this.platforms, (p, t) => {
      if (this.player.body.velocity.y > 50 && !this.wasOnGround) {
        Audio.land();
      }
    });
    this.physics.add.collider(this.player, this.movingPlatforms, (p, plat) => {
      // Carry player on moving platform
      if (this.player.body.touching.down) {
        this.player.x += plat.body.velocity.x * (1/60);
      }
    });

    // Collectible overlap
    this.physics.add.overlap(this.player, this.collectibles, (p, c) => {
      this._collect(c);
    });

    // Checkpoint overlap
    this.physics.add.overlap(this.player, this.checkpoints, (p, cp) => {
      if (!cp._active) {
        cp._active = true;
        cp.setTexture('checkpoint_active');
        this.checkpointX = cp.x;
        this.checkpointY = cp.y - 30;
        this._spawnParticles(cp.x, cp.y, C.check, 12);
        Audio.checkpoint();
        this._showPopup(cp.x, cp.y - 40, 'CHECKPOINT!', '#69f0ae');
      }
    });

    // Portal overlap
    this.physics.add.overlap(this.player, this.portal, () => {
      if (!this.isWon) this._win();
    });

    // Spike overlap
    this.physics.add.overlap(this.player, this.spikes, () => {
      this._hurt(true);
    });

    // Secret block overlap
    this.physics.add.overlap(this.player, this.secretBlocks, (p, b) => {
      if (!b._revealed) {
        b._revealed = true;
        this.secretAreaOpen = true;
        this._spawnParticles(b.x, b.y, 0x9c27b0, 20);
        this._showPopup(b.x, b.y - 30, '✦ SECRET! ✦', '#e040fb');
        this.secretsFound++;
        Audio.collectRelic();
        // Make block flash and disappear
        this.tweens.add({ targets: b, alpha: 0, duration: 500, onComplete: () => b.destroy() });
      }
    });

    // Enemy collision / stomp
    this.physics.add.collider(this.player, this.enemies, (p, e) => {
      if (e._dead) return;
      // Stomp detection: player falling + above enemy
      if (this.player.body.velocity.y > 30 && this.player.body.touching.down && !e.body.touching.up) {
        // stomp on top
        if (this.player.y < e.y - 5) {
          this._stomp(e);
        } else {
          this._hurt();
        }
      } else {
        this._hurt();
      }
    });
  }

  // ── Touch Controls ────────────────────────────────────────────

  _buildTouchControls() {
    const W = this.scale.width, H = this.scale.height;
    this._touch = { left: false, right: false, jump: false };

    const makeBtn = (x, y, label, size, cb, cbEnd) => {
      const g = this.add.graphics().setScrollFactor(0).setDepth(100);
      g.fillStyle(0x000000, 0.35);
      g.fillCircle(x, y, size/2);
      g.lineStyle(2, 0xffffff, 0.5);
      g.strokeCircle(x, y, size/2);

      const t = this.add.text(x, y, label, {
        fontSize: size > 40 ? '18px' : '14px', color: '#ffffff', fontFamily: 'Arial',
      }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

      const zone = this.add.zone(x, y, size, size).setScrollFactor(0).setDepth(102).setInteractive();
      zone.on('pointerdown', () => { g.fillStyle(0xffffff,0.2); g.fillCircle(x,y,size/2); cb(); });
      zone.on('pointerout', () => { g.clear(); g.fillStyle(0,0.35); g.fillCircle(x,y,size/2); g.lineStyle(2,0xffffff,0.5); g.strokeCircle(x,y,size/2); if(cbEnd) cbEnd(); });
      zone.on('pointerup', () => { g.clear(); g.fillStyle(0,0.35); g.fillCircle(x,y,size/2); g.lineStyle(2,0xffffff,0.5); g.strokeCircle(x,y,size/2); if(cbEnd) cbEnd(); });
    };

    const bY = H - 36;
    makeBtn(36, bY, '◀', 52, () => this._touch.left = true, () => this._touch.left = false);
    makeBtn(96, bY, '▶', 52, () => this._touch.right = true, () => this._touch.right = false);
    makeBtn(W - 50, bY, '▲', 58, () => this._touch.jump = true, () => this._touch.jump = false);
  }

  // ── Update ────────────────────────────────────────────────────

  update(time, delta) {
    if (this._paused || this.isWon || this.isDead) return;

    this._updatePlayer(delta);
    this._updateEnemies(delta);
    this._updateCombo(delta);
    this._updateMovingPlatforms(delta);
    this._updateCollectibles(time);
    this._cleanupPopups();

    // Fall death
    if (this.player.y > this.physics.world.bounds.height - 10) {
      this._hurt(true);
    }
  }

  _updatePlayer(delta) {
    const p = this.player;
    const body = p.body;
    const onGround = body.blocked.down;

    // Input
    const left  = this.cursors.left.isDown  || this.wasd.left.isDown  || this._touch.left;
    const right = this.cursors.right.isDown || this.wasd.right.isDown || this._touch.right;
    const jumpPressed = this.cursors.up.isDown || this.wasd.up.isDown || this.wasd.space.isDown ||
                        this.cursors.space?.isDown || this._touch.jump;

    // Horizontal movement
    const speed = onGround ? 200 : 160;
    if (left)  { p.setVelocityX(Math.max(body.velocity.x - speed * (delta/1000) * 18, -180)); p.setFlipX(true); }
    if (right) { p.setVelocityX(Math.min(body.velocity.x + speed * (delta/1000) * 18, 180)); p.setFlipX(false); }
    if (!left && !right) { /* drag handles deceleration */ }

    // Jump
    if (jumpPressed && !this._jumpPressed && onGround) {
      p.setVelocityY(-380);
      Audio.jump();
      this._spawnParticles(p.x, p.y + 14, 0xffffff, 4, 0.6);
    }
    this._jumpPressed = jumpPressed;

    // Fast fall
    if ((this.cursors.down?.isDown || this.wasd.down.isDown) && !onGround) {
      p.setVelocityY(body.velocity.y + 20);
    }

    // Squash & stretch
    if (!onGround && body.velocity.y < -50) {
      p.setScale(0.88, 1.12);
    } else if (!onGround && body.velocity.y > 50) {
      p.setScale(1.06, 0.94);
    } else if (onGround) {
      const targetSX = (left||right) ? 1.08 : 1;
      p.scaleX = Phaser.Math.Linear(p.scaleX, targetSX, 0.2);
      p.scaleY = Phaser.Math.Linear(p.scaleY, 1/targetSX, 0.2);
    }

    // Hurt flash
    if (this.isHurt) {
      this.hurtTimer -= delta;
      p.setAlpha(Math.sin(this.hurtTimer * 0.03) > 0 ? 1 : 0.3);
      if (this.hurtTimer <= 0) {
        this.isHurt = false;
        p.setAlpha(1);
      }
    }

    this.wasOnGround = onGround;
  }

  _updateEnemies(delta) {
    this.enemies.getChildren().forEach(e => {
      if (e._dead) return;

      if (e._type === 'walker') {
        // Patrol
        if (e.x > e._patrolEnd) e._dir = -1;
        if (e.x < e._patrolStart) e._dir = 1;
        e.setVelocityX(55 * e._dir);
        e.setFlipX(e._dir < 0);
      } else if (e._type === 'flyer') {
        // Sine wave flight
        e._t += delta * 0.002;
        e.y = e._startY + Math.sin(e._t) * e._range;
        e.body.reset(e.x, e.y);
        // Slow horizontal drift toward player
        const dx = this.player.x - e.x;
        e.x += Math.sign(dx) * 0.3;
      }
    });
  }

  _updateCombo(delta) {
    if (this.combo > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.combo = 0;
        // Notify UI
        this.events.emit('comboReset');
      }
    }
  }

  _updateMovingPlatforms(delta) {
    this.movingPlatforms.getChildren().forEach(mp => {
      mp._t = (mp._t || 0) + delta * 0.001;
      if (mp._rangeX > 0) {
        mp.x = mp._startX + Math.sin(mp._t * mp._speed * 0.05) * mp._rangeX;
      }
      if (mp._rangeY > 0) {
        mp.y = mp._startY + Math.sin(mp._t * mp._speed * 0.05) * mp._rangeY;
      }
      mp.body.reset(mp.x, mp.y);
    });
  }

  _updateCollectibles(time) {
    // Bobbing animation
    this.collectibles.getChildren().forEach(c => {
      c.y = c._baseY || c.y;
      if (!c._baseY) c._baseY = c.y;
      c.y = c._baseY + Math.sin(time * 0.003 + c.x * 0.01) * 3;
      c.body.reset(c.x, c.y);
    });
  }

  // ── Game Events ───────────────────────────────────────────────

  _collect(c) {
    const type = c._type;
    const val  = c._val;

    this.combo++;
    if (this.combo > this.comboMax) this.comboMax = this.combo;
    this.comboTimer = 2500; // 2.5s to keep combo

    // Multiplier: every 5 = x2, every 10 = x3 etc.
    const mult = 1 + Math.floor(this.combo / 5);
    const pts = val * mult;
    this.score += pts;
    this.starsCollected++;

    // Effects
    this._spawnParticles(c.x, c.y, type === 'star' ? C.star : type === 'crystal' ? C.crystal : C.relic, 10);
    this._showPopup(c.x, c.y - 20, `+${pts}${mult > 1 ? ' x'+mult : ''}`,
      type === 'star' ? '#FFD700' : type === 'crystal' ? '#00e5ff' : '#ff6fff');

    // Sound
    if (type === 'star') Audio.collectStar();
    else if (type === 'crystal') Audio.collectCrystal();
    else { Audio.collectRelic(); this.secretsFound++; }

    if (mult > 1) Audio.combo(mult);

    // Notify UI
    this.events.emit('scoreUpdate', this.score);
    this.events.emit('comboUpdate', this.combo, mult);

    c.destroy();
  }

  _stomp(e) {
    e._dead = true;
    Audio.stomp();
    this._spawnParticles(e.x, e.y, e._type === 'walker' ? C.enemy1 : C.enemy2, 16);
    const pts = SCORES.stomp;
    this.score += pts;
    this._showPopup(e.x, e.y - 20, `+${pts} STOMP!`, '#ff8f00');
    this.events.emit('scoreUpdate', this.score);

    // Bounce player
    this.player.setVelocityY(-250);

    // Squish animation then destroy
    this.tweens.add({
      targets: e, scaleY: 0.1, scaleX: 2, alpha: 0, duration: 200,
      onComplete: () => e.destroy()
    });
  }

  _hurt(instant=false) {
    if (this.isHurt || this.isDead) return;
    if (instant) {
      this.lives = Math.max(0, this.lives - 1);
    } else {
      if (!this.isHurt) {
        this.isHurt = true;
        this.hurtTimer = 1800;
        this.lives = Math.max(0, this.lives - 1);
      }
    }

    Audio.damage();
    this.cameras.main.shake(200, 0.008);
    this.cameras.main.flash(120, 255, 0, 0, false);
    this.player.setTexture('player_hurt');
    this.time.delayedCall(180, () => { if (!this.isDead) this.player.setTexture('player'); });
    this._spawnParticles(this.player.x, this.player.y, C.heart, 8);
    this.events.emit('livesUpdate', this.lives);

    // Knockback
    const dir = this.player.flipX ? 1 : -1;
    this.player.setVelocity(dir * 150, -200);

    if (this.lives <= 0) {
      this.time.delayedCall(400, () => this._die());
    }
    // Reset combo
    this.combo = 0;
    this.comboTimer = 0;
    this.events.emit('comboReset');
  }

  _die() {
    this.isDead = true;
    this.deaths++;
    Audio.die();
    Audio.stopMusic();

    this.tweens.add({
      targets: this.player, y: this.player.y - 60, alpha: 0, angle: 180,
      duration: 600, ease: 'Cubic.easeIn',
      onComplete: () => {
        const elapsed = this.time.now - this.startTime;
        this.time.delayedCall(500, () => {
          if (this.lives <= 0) {
            // Game over
            this.scene.stop('UI');
            this.scene.start('GameOver', {
              score: this.score, time: elapsed, deaths: this.deaths,
              stars: this.starsCollected, total: this.starsTotal,
              secrets: this.secretsFound, secretsTotal: this.secretsTotal,
            });
          } else {
            // Respawn at checkpoint
            this._respawn();
          }
        });
      }
    });
  }

  _respawn() {
    this.isDead = false;
    this.isHurt = false;
    this.lives = 3;
    const rx = this.checkpointX || 50;
    const ry = this.checkpointY || (this.physics.world.bounds.height - 100);
    this.player.setPosition(rx, ry);
    this.player.setVelocity(0, 0);
    this.player.setAlpha(1);
    this.player.setAngle(0);
    Audio.startMusic();
    this.events.emit('livesUpdate', this.lives);
  }

  _win() {
    this.isWon = true;
    const elapsed = this.time.now - this.startTime;
    saveHiScore(this.score);
    saveBestTime(elapsed);
    Audio.win();
    Audio.stopMusic();

    // Celebration particles
    for (let i = 0; i < 5; i++) {
      this.time.delayedCall(i * 100, () => {
        this._spawnParticles(this.portal.x, this.portal.y, C.portal, 20);
      });
    }

    this.tweens.add({
      targets: this.player, y: '-=60', alpha: 0, duration: 800,
      onComplete: () => {
        this.scene.stop('UI');
        this.scene.start('Win', {
          score: this.score, time: elapsed, deaths: this.deaths,
          stars: this.starsCollected, total: this.starsTotal,
          secrets: this.secretsFound, secretsTotal: this.secretsTotal,
        });
      }
    });
  }

  // ── Effects ────────────────────────────────────────────────────

  _spawnParticles(x, y, color, count=12, scale=1) {
    for (let i = 0; i < count; i++) {
      const p = this.add.image(x, y, 'particle').setScale(scale);
      p.setTint(color);
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 40 + Math.random() * 80;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 30;
      this.tweens.add({
        targets: p, x: x + vx * 0.6, y: y + vy * 0.6,
        alpha: 0, scale: scale * 0.1,
        duration: 400 + Math.random() * 300,
        ease: 'Cubic.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  _showPopup(x, y, text, color='#ffffff') {
    const t = this.add.text(x, y, text, {
      fontSize: '9px', fontFamily: 'Arial Black, Arial',
      color: color, stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(50);
    this.tweens.add({
      targets: t, y: y - 30, alpha: 0, duration: 900, ease: 'Cubic.easeOut',
      onComplete: () => t.destroy()
    });
    this._popups.push(t);
  }

  _cleanupPopups() {
    this._popups = this._popups.filter(p => p.active);
  }

  // ── Pause ──────────────────────────────────────────────────────

  _togglePause() {
    this._paused = !this._paused;
    if (this._paused) {
      this.physics.pause();
      this._showPauseMenu();
    } else {
      this.physics.resume();
      if (this._pauseOverlay) { this._pauseOverlay.destroy(); this._pauseOverlay = null; }
    }
  }

  _showPauseMenu() {
    const W = this.scale.width, H = this.scale.height;
    const cam = this.cameras.main;

    const g = this.add.graphics().setScrollFactor(0).setDepth(200);
    g.fillStyle(0x000000, 0.7);
    g.fillRect(0,0,W,H);
    g.fillStyle(0x0a0a2e,0.95);
    g.fillRoundedRect(W/2-100, H/2-90, 200, 180, 12);
    g.lineStyle(2, 0x5c6bc0);
    g.strokeRoundedRect(W/2-100, H/2-90, 200, 180, 12);

    const title = this.add.text(W/2, H/2-65, 'PAUSED', {
      fontSize:'14px', fontFamily:'Arial Black', color:'#fff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    const makePBtn = (label, yOff, cb) => {
      const t = this.add.text(W/2, H/2+yOff, label, {
        fontSize:'10px', fontFamily:'Arial Black', color:'#e3f2fd',
        backgroundColor:'#1a237e', padding:{x:16,y:7},
      }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setInteractive({useHandCursor:true});
      t.on('pointerdown', cb);
      return t;
    };

    const r  = makePBtn('▶  RESUME',  -30, () => this._togglePause());
    const rs = makePBtn('↺  RESTART', 0,   () => { this._paused=false; this.scene.stop('UI'); Audio.stopMusic(); this.scene.restart(); });
    const q  = makePBtn('✕  QUIT',    30,  () => { this._paused=false; this.scene.stop('UI'); Audio.stopMusic(); this.scene.start('Menu'); });

    this._pauseOverlay = this.add.container(0, 0, [g, title, r, rs, q]).setDepth(200);
  }
}
