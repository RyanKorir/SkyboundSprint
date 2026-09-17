// ═══════════════════════════════════════════════════
// SKYBOUND SPRINT — utils.js
// Shared constants and helpers
// ═══════════════════════════════════════════════════

const GAME_W = 480;
const GAME_H = 270;

// Colours
const C = {
  sky1:    0x87CEEB,
  sky2:    0x4a9fd4,
  ground:  0x5c8a32,
  dirt:    0x8B6914,
  stone:   0x7a7a8c,
  star:    0xFFD700,
  crystal: 0x00e5ff,
  relic:   0xff6fff,
  player:  0xff7043,
  enemy1:  0xe53935,
  enemy2:  0x8e24aa,
  portal:  0x00e676,
  ui_bg:   0x000000,
  white:   0xffffff,
  black:   0x000000,
  heart:   0xff1744,
  combo:   0xffeb3b,
  check:   0x69f0ae,
};

// Score values
const SCORES = {
  star:    10,
  crystal: 50,
  relic:   100,
  stomp:   25,
};

// Save keys
const SAVE = {
  hiScore: 'ss_hiscore',
  bestTime: 'ss_besttime',
  settings: 'ss_settings',
};

function saveHiScore(score) {
  const cur = parseInt(localStorage.getItem(SAVE.hiScore) || '0', 10);
  if (score > cur) localStorage.setItem(SAVE.hiScore, score);
}
function getHiScore() {
  return parseInt(localStorage.getItem(SAVE.hiScore) || '0', 10);
}
function saveBestTime(ms) {
  const cur = parseInt(localStorage.getItem(SAVE.bestTime) || '999999999', 10);
  if (ms < cur) localStorage.setItem(SAVE.bestTime, ms);
}
function getBestTime() {
  return parseInt(localStorage.getItem(SAVE.bestTime) || '0', 10);
}
function fmtTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2,'0');
  const mm = String(Math.floor(ms % 1000 / 10)).padStart(2,'0');
  return `${m}:${ss}.${mm}`;
}
