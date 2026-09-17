# Skybound Sprint 🌤️

> A fast-paced 2D browser platformer — run, jump, collect, explore, combo, repeat.

**Live:** https://skybound-sprint-ryankorir00-4850s-projects.vercel.app

---

## Play
Open `index.html` in any modern browser. No build step needed.

## Controls
| Action | Keyboard | Touch |
|---|---|---|
| Move | A/D or ← → | ◀ ▶ buttons |
| Jump | W / ↑ / Space | ▲ button |
| Fast Fall | S / ↓ | — |
| Stomp Enemy | Land on top | same |
| Pause | ESC / P | — |

## Features
- **3 collectible tiers** — Stars (10pts), Crystals (50pts), Relics (100pts)
- **Combo system** — collect without stopping for score multipliers
- **2 enemy types** — Walker (patrol) and Flyer (sine-wave)
- **Enemy stomping** with bounce and particles
- **Secret area** — hidden behind a breakable wall
- **Optional cloud route** — risky jumps, rare crystals, secret relic
- **Moving platforms** in mid-section
- **Spikes** in precision section
- **2 checkpoints** across the level
- **Grading system** — S / A / B / C / D rank on completion
- **Local high score + best time** saved via localStorage
- **Fully responsive** — desktop, tablet, mobile
- **Touch controls** built-in
- **Procedural audio** — all sounds and music via Web Audio API (no files)
- **Procedural art** — all sprites drawn via Canvas API (no files)

## Architecture
```
js/
  utils.js          — constants, save helpers, fmtTime
  AudioManager.js   — all sound via Web Audio API
  BootScene.js      — generates all textures on canvas
  MenuScene.js      — main menu with hi-score
  GameScene.js      — full game loop, level, player, enemies
  UIScene.js        — HUD overlay (score, lives, timer, combo)
  GameOverScene.js  — death screen with stats
  WinScene.js       — completion screen with grade + tips
  main.js           — Phaser config + game boot
```

## Built by Ryan Korir
