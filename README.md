# 🌤️ Skybound Sprint

> *A fast-paced 2D browser platformer — MVP v1.0*

A Mario-inspired 2D platformer built with Phaser 3. No build step, no backend — open `index.html` and play.

---

## 🎮 Play

Just open `index.html` in any modern browser.

**Or via a local server (recommended):**
```bash
npx serve .
# then open http://localhost:3000
```

---

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move Left | A / ← | ◀ button |
| Move Right | D / → | ▶ button |
| Jump | W / ↑ / Space | ▲ button |
| Fast Fall | S / ↓ | — |
| Pause | ESC / P | — |

---

## Features (MVP)

- ✅ Smooth player movement with squash & stretch
- ✅ Full 3200px side-scrolling level
- ✅ 2 enemy types — Walker (patrol + stomp) and Flyer (sine wave)
- ✅ 3 collectible tiers — Stars (10pt), Crystals (50pt), Relics (100pt)
- ✅ Combo multiplier system
- ✅ 2 checkpoints
- ✅ 1 secret area (find the hidden dark block!)
- ✅ Moving platforms section
- ✅ Spike hazards
- ✅ Optional high cloud route (risky/reward)
- ✅ 3 hearts / lives system
- ✅ Grade system (S / A / B / C)
- ✅ Timer + high score saved to localStorage
- ✅ Procedural audio via Web Audio API (no files needed)
- ✅ All textures generated procedurally (no asset files needed)
- ✅ Mobile touch controls
- ✅ Responsive scaling (FIT mode)
- ✅ Parallax scrolling background
- ✅ Particle effects on every action
- ✅ Full pause menu
- ✅ Game Over + Win screen with stats

---

## Level Map

```
[START] Tutorial → Gap + cloud route (high risk crystals)
      → Basic platforms → Enemy section
      → SECRET BLOCK (find the dark tile)
      → Moving platforms → Precision + spikes
      → Final challenge (moving plats + enemies)
      → [PORTAL] 🟢
```

### Finding Secrets
- Look for a **dark blue tile** on the platform section around x=1820
- Walk into it to reveal a hidden relic
- There are **3 relics** total hidden across the level
- The **cloud route** (high up at the first gap) holds the rarest rewards

---

## Scoring

| Action | Points |
|---|---|
| Star | 10 |
| Crystal | 50 |
| Relic | 100 |
| Stomp enemy | 25 |
| Combo x5 | ×2 multiplier |
| Combo x10 | ×3 multiplier |

---

## Grade System

| Grade | Requirement |
|---|---|
| S | 90%+ stars, 0 deaths, all secrets |
| A | 80%+ stars, 0 deaths |
| B | 60%+ stars |
| C | Finish the level |

---

## Architecture

```
js/
├── utils.js          Constants, save/load helpers
├── AudioManager.js   Web Audio API procedural sounds
├── BootScene.js      Generates all textures via canvas API
├── MenuScene.js      Title screen
├── GameScene.js      Main gameplay — player, enemies, level, physics
├── UIScene.js        HUD overlay (score, hearts, timer, combo)
├── GameOverScene.js  Game over screen
├── WinScene.js       Victory screen with grade + confetti
└── main.js           Phaser config + entry point
```

---

## Roadmap

- [ ] V2: 3–5 levels, unlockable abilities, world map
- [ ] V3: Double jump, wall jump, dash abilities
- [ ] V4: Boss fight
- [ ] V5: Local co-op
- [ ] V6: Online leaderboards (Supabase)

---

## Built With

- [Phaser 3](https://phaser.io/) — HTML5 game framework
- Web Audio API — all sounds generated procedurally
- Canvas API — all textures generated procedurally (zero asset files)

**Built by Ryan Kiprotich Korir**
