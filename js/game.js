/* Mahjong Master - Sheep-a-Sheep style
 * Algorithm ported from chenxch/xlegex (MIT)
 */

const TILES = ['\uD83C\uDC00','\uD83C\uDC01','\uD83C\uDC02','\uD83C\uDC03','\uD83C\uDC04','\uD83C\uDC05','\uD83C\uDC06','\uD83C\uDC07','\uD83C\uDC08','\uD83C\uDC09','\uD83C\uDC0A','\uD83C\uDC0B','\uD83C\uDC0C','\uD83C\uDC0D','\uD83C\uDC0E','\uD83C\uDC0F','\uD83C\uDC10','\uD83C\uDC11','\uD83C\uDC12','\uD83C\uDC13','\uD83C\uDC14','\uD83C\uDC15','\uD83C\uDC16','\uD83C\uDC17','\uD83C\uDC18','\uD83C\uDC19','\uD83C\uDC1A','\uD83C\uDC1B','\uD83C\uDC1C','\uD83C\uDC1D','\uD83C\uDC1E','\uD83C\uDC1F','\uD83C\uDC20','\uD83C\uDC21'];

// Sheep-a-sheep style: hand-designed level data (inspired by qierkang/yang-game)
// Each entry is [layer, row, col, tileType].
// tileType references TILES[]. poolSize = number of copies of each tileType.
//
//   Level 1 (Warm-up): 39 tiles, single 9x5 layer, 13 unique types, every type has 3 copies
//   Level 2 (Insane):  ~150 tiles, 3 stacked layers, dense grid, max 20 unique types
const LEVELS = [
  {
    name: 'Warm-up',
    widthNum: 9,
    heightNum: 5,
    poolSize: 3,
    // 13 types x 3 copies = 39 total. Filled in a flat 9x5 grid (45 cells) with 6 cells left empty
    tiles: [
      // layer 0, flat base, types 0..12 fill almost everything
      // row 0
      [0,0,0],[0,0,1],[0,0,2],[0,0,3],[0,0,4],[0,0,5],[0,0,6],[0,0,7],[0,0,8],
      // row 1
      [0,1,0],[0,1,1],[0,1,2],[0,1,3],[0,1,4],[0,1,5],[0,1,6],[0,1,7],[0,1,8],
      // row 2
      [0,2,0],[0,2,1],[0,2,2],[0,2,3],[0,2,4],[0,2,5],[0,2,6],[0,2,7],[0,2,8],
      // row 3
      [0,3,0],[0,3,1],[0,3,2],[0,3,3],[0,3,4],[0,3,5],[0,3,6],[0,3,7],[0,3,8],
      // row 4 (incomplete on purpose)
      [0,4,0],[0,4,1],[0,4,2],[0,4,3],[0,4,4],[0,4,5],[0,4,6],[0,4,7],[0,4,8],
      // layer 1: a few tiles stacked on top in spots (so a few are "locked" until you remove what's beneath)
      [1,1,3],[1,1,4],[1,2,4],[1,2,5],[1,3,2],[1,3,5]
    ]
  },
  {
    name: 'Insane',
    widthNum: 9,
    heightNum: 7,
    // Each type has 9 copies = 3 triples = 27 tiles per type * 15 types = 405 → too many
    // We have 126 tiles total (63 base + 33 layer1 + 20 layer2 + 10 layer3)
    // 15 types * ~8.4 copies each → use 9 copies per type for 15 types = 135. Plenty.
    poolSize: 9,
    cardNum: 15,
    tiles: [
      // === Layer 0: dense base grid 9x7 = 63 tiles, all filled ===
      [0,0,0],[0,0,1],[0,0,2],[0,0,3],[0,0,4],[0,0,5],[0,0,6],[0,0,7],[0,0,8],
      [0,1,0],[0,1,1],[0,1,2],[0,1,3],[0,1,4],[0,1,5],[0,1,6],[0,1,7],[0,1,8],
      [0,2,0],[0,2,1],[0,2,2],[0,2,3],[0,2,4],[0,2,5],[0,2,6],[0,2,7],[0,2,8],
      [0,3,0],[0,3,1],[0,3,2],[0,3,3],[0,3,4],[0,3,5],[0,3,6],[0,3,7],[0,3,8],
      [0,4,0],[0,4,1],[0,4,2],[0,4,3],[0,4,4],[0,4,5],[0,4,6],[0,4,7],[0,4,8],
      [0,5,0],[0,5,1],[0,5,2],[0,5,3],[0,5,4],[0,5,5],[0,5,6],[0,5,7],[0,5,8],
      [0,6,0],[0,6,1],[0,6,2],[0,6,3],[0,6,4],[0,6,5],[0,6,6],[0,6,7],[0,6,8],

      // === Layer 1: 30 tiles stacked on top, scattered ===
      [1,0,1],[1,0,4],[1,0,7],
      [1,1,0],[1,1,2],[1,1,5],[1,1,8],
      [1,2,1],[1,2,4],[1,2,7],
      [1,3,0],[1,3,2],[1,3,5],[1,3,8],
      [1,4,1],[1,4,4],[1,4,7],
      [1,5,0],[1,5,2],[1,5,5],[1,5,8],
      [1,6,1],[1,6,4],[1,6,7],

      // === Layer 2: 21 tiles - sparse mid-stack ===
      [2,1,1],[2,1,4],[2,1,7],
      [2,2,2],[2,2,5],
      [2,3,1],[2,3,4],[2,3,7],
      [2,4,2],[2,4,5],
      [2,5,1],[2,5,4],[2,5,7],

      // top of stack (layer 2 in row 3)
      [2,0,4],[2,3,3],[2,3,5],[2,6,4],
      [2,2,7],[2,4,7],

      // === Layer 3: 12 tiles - dense top cluster ===
      [3,2,3],[3,2,4],[3,2,5],
      [3,3,3],[3,3,4],[3,3,5],
      [3,4,3],[3,4,4],[3,4,5],
      [4,3,4]
    ]
  }
];

const SLOT_MAX = 7;
const TILE_SIZE = 40;

let state = { level: 0, nodes: [], selectedNodes: [], removedNodes: [], preNode: null, removeFlag: false, backFlag: false };

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function rand(min, max) { return Math.floor(Math.random() * (max - min)) + min; }

function updateStates() {
  state.nodes.forEach(function(node) {
    // Skip already-removed (state=3) or selected (state=2) nodes
    if (node.state >= 2) return;
    node.state = node.parents.every(function(p) { return p.state >= 2; }) ? 1 : 0;
  });
}

function handleSelect(node) {
  if (state.selectedNodes.length >= SLOT_MAX) return;
  if (node.state !== 1) return;
  node.state = 2;
  state.preNode = node;
  const sameType = state.selectedNodes.filter(function(s) { return s.type === node.type; });
  if (sameType.length === 2) {
    const secondIdx = state.selectedNodes.findIndex(function(s) { return s.id === sameType[1].id; });
    state.selectedNodes.splice(secondIdx + 1, 0, node);
    setTimeout(function() {
      for (let i = 0; i < 3; i++) {
        const idx = state.selectedNodes.findIndex(function(s) { return s.type === node.type; });
        if (idx > -1) { const r = state.selectedNodes.splice(idx, 1)[0]; r.state = 3; }
      }
      state.preNode = null;
      updateStates();
      render();
      if (state.nodes.every(function(n) { return n.state >= 2; })) setTimeout(onWin, 500);
    }, 150);
  } else {
    const idx = state.selectedNodes.findIndex(function(s) { return s.type === node.type; });
    if (idx > -1) state.selectedNodes.splice(idx + 1, 0, node);
    else state.selectedNodes.push(node);
    updateStates();
    render();
    if (state.selectedNodes.length >= SLOT_MAX) setTimeout(onLose, 300);
  }
}

function handleBack() {
  if (state.removeFlag || !state.preNode) return;
  const node = state.preNode;
  state.preNode = null;
  state.backFlag = true;
  node.state = 0;
  const idx = state.selectedNodes.findIndex(function(s) { return s.id === node.id; });
  if (idx > -1) state.selectedNodes.splice(idx, 1);
  updateStates();
  render();
  setTimeout(function() { state.backFlag = false; }, 300);
}

function handleRemove() {
  if (state.removeFlag || state.selectedNodes.length < 3) return;
  state.removeFlag = true;
  state.preNode = null;
  for (let i = 0; i < 3; i++) {
    const node = state.selectedNodes.shift();
    if (node) { node.state = 3; state.removedNodes.push(node); }
  }
  render();
  setTimeout(function() { state.removeFlag = false; }, 500);
}

function initLevel(levelIdx) {
  state.level = levelIdx;
  state.nodes = []; state.selectedNodes = []; state.removedNodes = [];
  state.preNode = null; state.removeFlag = false; state.backFlag = false;
  const cfg = LEVELS[levelIdx];
  const container = document.getElementById('game-area');
  const W = container.clientWidth;
  const H = container.clientHeight;

  // Each cell uses ~ (W / widthNum) pixels horizontally.
  // We size tiles so the entire grid + a small margin fits the play area.
  const usableW = W - 8;
  const usableH = H - 8;
  // Reserve room so the upper-most stacked tiles don't get clipped at the top.
  // Each layer above base shifts by (~halfTile) up. Use layers as upper estimate.
  const upperLayers = cfg.tiles.reduce(function(m, t) { return Math.max(m, t[0]); }, 0);
  const tileW = Math.max(22, Math.floor(usableW / cfg.widthNum));
  const tileH = Math.max(24, Math.floor(usableH / (cfg.heightNum + upperLayers * 0.5)));

  // Build the tile pool: cfg.cardNum types × cfg.poolSize copies of each.
  //   poolSize = 3  → standard match-3
  //   poolSize > 3 → "each type forms multiple triples" → tougher pool
  const pool = [];
  for (let i = 0; i < (cfg.cardNum || 0); i++) {
    for (let k = 0; k < (cfg.poolSize || 3); k++) pool.push(i);
  }

  // Truncate pool to actual tile count if too many.
  // Random distribution: each tile type gets assigned from the pool (round-robin on types)
  // We don't need shuffle-the-pool correctness — just enough to fill the design.
  let poolIdx = 0;
  function nextType() {
    if (poolIdx >= pool.length) {
      // wrap and extend pool if exhausted (shouldn't normally happen)
      const i = poolIdx % pool.length;
      poolIdx++;
      return pool[i];
    }
    return pool[poolIdx++];
  }

  // Convert cfg.tiles (level data) into node objects with screen positions.
  // tile = [layer, row, col] — we pick type from pool in order (deterministic).
  // Shuffle the pool once so the assignment is random but reproducible.
  const shuffled = shuffle(pool.slice());
  let shuffledIdx = 0;
  function drawType() {
    if (shuffledIdx >= shuffled.length) shuffledIdx = 0;
    return shuffled[shuffledIdx++];
  }

  // Layout: per-layer. Layer 0 is the base grid filling widthNum × heightNum.
  // Upper layers shift tileW/2 to the left and tileH/2 up per layer step,
  // mimicking real mahjong stacking (each tile rests on the seam between two tiles below).
  function tilePos(layer, row, col) {
    const shiftX = (tileW / 2) * layer;
    const shiftY = (tileH / 2) * layer;
    // Center the base grid horizontally; align its top slightly below header.
    const baseGridW = cfg.widthNum * tileW;
    const baseStartX = (W - baseGridW) / 2 + tileW / 2;
    const baseStartY = tileH / 2 + 8;
    return {
      left: baseStartX + tileW * col - shiftX,
      top:  baseStartY + tileH * row - shiftY
    };
  }

  cfg.tiles.forEach(function(t) {
    const layer = t[0], row = t[1], col = t[2];
    const pos = tilePos(layer, row, col);
    state.nodes.push({
      id: layer + '-' + row + '-' + col,
      type: drawType(),
      zIndex: 10 + layer,
      layer: layer,
      row: row,
      col: col,
      top: pos.top,
      left: pos.left,
      parents: [],
      state: 0
    });
  });

  // Build "is covered by upper-layer tile at same position" check.
  // We use a half-tile radius (~0.6 of tileW) for "same column/row alignment".
  const coverDist = 0.6;
  for (let i = 0; i < state.nodes.length; i++) {
    const self = state.nodes[i];
    for (let j = 0; j < state.nodes.length; j++) {
      if (i === j) continue;
      const upper = state.nodes[j];
      if (upper.layer <= self.layer) continue;
      // Is upper within coverDist of self's grid cell (row, col)?
      // (We don't compare screen positions because layers are shifted by exactly tileW/2 each layer.)
      const dRow = Math.abs(upper.row - self.row);
      const dCol = Math.abs(upper.col - self.col);
      // For layer difference > 1, expand the tolerance accordingly.
      const layerDiff = upper.layer - self.layer;
      const tol = coverDist + 0.4 * (layerDiff - 1);
      if (dRow <= tol && dCol <= tol) {
        self.parents.push(upper);
      }
    }
  }

  updateStates();
  document.getElementById('level-name').textContent = cfg.name;
  document.getElementById('level-num').textContent = 'Level ' + (levelIdx + 1) + ' / ' + LEVELS.length;
  render();
}
function render() {
  const area = document.getElementById('game-area');
  Array.from(area.querySelectorAll('.tile')).forEach(function(c) { c.remove(); });
  state.nodes.forEach(function(node) {
    if (node.state >= 2) return;
    const div = document.createElement('div');
    div.className = 'tile' + (node.state === 0 ? ' locked' : '');
    div.style.top = node.top + 'px';
    div.style.left = node.left + 'px';
    div.style.zIndex = node.zIndex;
    div.textContent = TILES[node.type];
    div.onclick = function() { handleSelect(node); };
    area.appendChild(div);
  });
  const slot = document.getElementById('slot');
  Array.from(slot.children).forEach(function(c) { c.remove(); });
  state.selectedNodes.forEach(function(node) {
    const div = document.createElement('div');
    div.className = 'tile slot-tile';
    div.textContent = TILES[node.type];
    slot.appendChild(div);
  });
  const removed = document.getElementById('removed');
  Array.from(removed.children).forEach(function(c) { c.remove(); });
  state.removedNodes.slice(-3).forEach(function(node) {
    const div = document.createElement('div');
    div.className = 'tile removed-tile';
    div.textContent = TILES[node.type];
    removed.appendChild(div);
  });
  const remaining = state.nodes.filter(function(n) { return n.state < 2; }).length;
  document.getElementById('count-remaining').textContent = remaining;
  document.getElementById('count-slot').textContent = state.selectedNodes.length + ' / ' + SLOT_MAX;
}

function onWin() {
  if (state.level + 1 < LEVELS.length) {
    showToast('Level ' + (state.level + 1) + ' cleared! Loading Level ' + (state.level + 2) + '...');
    setTimeout(function() { initLevel(state.level + 1); }, 2000);
  } else {
    showToast('You conquered Mahjong Master! Reload to play again.', true);
    document.getElementById('restart-btn').style.display = 'inline-block';
  }
}

function onLose() {
  showToast('Slot full. Try again?', true);
  document.getElementById('restart-btn').style.display = 'inline-block';
}

function showToast(msg, persist) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  if (!persist) setTimeout(function() { toast.classList.remove('show'); }, 1800);
}

function restart() {
  document.getElementById('restart-btn').style.display = 'none';
  document.getElementById('toast').classList.remove('show');
  initLevel(0);
}

window.addEventListener('load', function() {
  document.getElementById('btn-back').onclick = handleBack;
  document.getElementById('btn-remove').onclick = handleRemove;
  document.getElementById('restart-btn').onclick = restart;
  requestAnimationFrame(function() { initLevel(0); });
});

let resizeTimer;
window.addEventListener('resize', function() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    if (state.nodes.length > 0) initLevel(state.level);
  }, 300);
});
