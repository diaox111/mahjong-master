/* Mahjong Master - Sheep-a-Sheep style
 * Algorithm ported from chenxch/xlegex (MIT)
 */

const TILES = ['\uD83C\uDC00','\uD83C\uDC01','\uD83C\uDC02','\uD83C\uDC03','\uD83C\uDC04','\uD83C\uDC05','\uD83C\uDC06','\uD83C\uDC07','\uD83C\uDC08','\uD83C\uDC09','\uD83C\uDC0A','\uD83C\uDC0B','\uD83C\uDC0C','\uD83C\uDC0D','\uD83C\uDC0E','\uD83C\uDC0F','\uD83C\uDC10','\uD83C\uDC11','\uD83C\uDC12','\uD83C\uDC13','\uD83C\uDC14','\uD83C\uDC15','\uD83C\uDC16','\uD83C\uDC17','\uD83C\uDC18','\uD83C\uDC19','\uD83C\uDC1A','\uD83C\uDC1B','\uD83C\uDC1C','\uD83C\uDC1D','\uD83C\uDC1E','\uD83C\uDC1F','\uD83C\uDC20','\uD83C\uDC21'];

// Sheep-a-sheep style levels — data structure inspired by qierkang/yang-game
//   widthNum/heightNum = base grid
//   layers = max stack depth
//   cardsEach = copies of each tile type (3 = match-3 clean; higher = tougher)
//   cardNum = distinct tile types
// cardsEach = copies per tile type (total tiles in pool)
// Sheep-a-sheep style levels — data structure inspired by qierkang/yang-game
//   widthNum/heightNum = base grid
//   layers = max stack depth
//   cardsEach = copies of each tile type (3 = match-3 clean; higher = tougher)
//   cardNum = distinct tile types
const LEVELS = [
  {
    name: 'Warm-up',
    widthNum: 6,
    heightNum: 3,
    cardNum: 7,
    cardsEach: 3,   // 7 types * 3 copies = 21 tiles exactly
    layers: 2,
    tiles: [
      // Layer 0: 6x3 = 18 base tiles (all of them, flat)
      [0,0,0],[0,0,1],[0,0,2],[0,0,3],[0,0,4],[0,0,5],
      [0,1,0],[0,1,1],[0,1,2],[0,1,3],[0,1,4],[0,1,5],
      [0,2,0],[0,2,1],[0,2,2],[0,2,3],[0,2,4],[0,2,5],
      // Layer 1: 3 stacked tiles on top center
      [1,1,2],[1,1,3],[1,1,4]
    ]
  },
  {name: 'Insane',
    widthNum: 13,
    heightNum: 10,
    cardNum: 20,
    cardsEach: 18,  // 20 * 18 = 360; we use ~220 tiles so plenty of triples per type
    layers: 6,
    tiles: [
      // Layer 0: 130 tiles
      [0,0,0],[0,0,1],[0,0,2],[0,0,3],[0,0,4],[0,0,5],[0,0,6],[0,0,7],[0,0,8],
      [0,0,9],[0,0,10],[0,0,11],[0,0,12],[0,1,0],[0,1,1],[0,1,2],[0,1,3],[0,1,4],
      [0,1,5],[0,1,6],[0,1,7],[0,1,8],[0,1,9],[0,1,10],[0,1,11],[0,1,12],[0,2,0],
      [0,2,1],[0,2,2],[0,2,3],[0,2,4],[0,2,5],[0,2,6],[0,2,7],[0,2,8],[0,2,9],
      [0,2,10],[0,2,11],[0,2,12],[0,3,0],[0,3,1],[0,3,2],[0,3,3],[0,3,4],[0,3,5],
      [0,3,6],[0,3,7],[0,3,8],[0,3,9],[0,3,10],[0,3,11],[0,3,12],[0,4,0],[0,4,1],
      [0,4,2],[0,4,3],[0,4,4],[0,4,5],[0,4,6],[0,4,7],[0,4,8],[0,4,9],[0,4,10],
      [0,4,11],[0,4,12],[0,5,0],[0,5,1],[0,5,2],[0,5,3],[0,5,4],[0,5,5],[0,5,6],
      [0,5,7],[0,5,8],[0,5,9],[0,5,10],[0,5,11],[0,5,12],[0,6,0],[0,6,1],[0,6,2],
      [0,6,3],[0,6,4],[0,6,5],[0,6,6],[0,6,7],[0,6,8],[0,6,9],[0,6,10],[0,6,11],
      [0,6,12],[0,7,0],[0,7,1],[0,7,2],[0,7,3],[0,7,4],[0,7,5],[0,7,6],[0,7,7],
      [0,7,8],[0,7,9],[0,7,10],[0,7,11],[0,7,12],[0,8,0],[0,8,1],[0,8,2],[0,8,3],
      [0,8,4],[0,8,5],[0,8,6],[0,8,7],[0,8,8],[0,8,9],[0,8,10],[0,8,11],[0,8,12],
      [0,9,0],[0,9,1],[0,9,2],[0,9,3],[0,9,4],[0,9,5],[0,9,6],[0,9,7],[0,9,8],
      [0,9,9],[0,9,10],[0,9,11],[0,9,12],
      // Layer 1: 70 tiles
      [1,0,0],[1,0,2],[1,0,4],[1,0,6],[1,0,8],[1,0,10],[1,0,12],[1,1,0],[1,1,2],
      [1,1,4],[1,1,6],[1,1,8],[1,1,10],[1,1,12],[1,2,0],[1,2,2],[1,2,4],[1,2,6],
      [1,2,8],[1,2,10],[1,2,12],[1,3,0],[1,3,2],[1,3,4],[1,3,6],[1,3,8],[1,3,10],
      [1,3,12],[1,4,0],[1,4,2],[1,4,4],[1,4,6],[1,4,8],[1,4,10],[1,4,12],[1,5,0],
      [1,5,2],[1,5,4],[1,5,6],[1,5,8],[1,5,10],[1,5,12],[1,6,0],[1,6,2],[1,6,4],
      [1,6,6],[1,6,8],[1,6,10],[1,6,12],[1,7,0],[1,7,2],[1,7,4],[1,7,6],[1,7,8],
      [1,7,10],[1,7,12],[1,8,0],[1,8,2],[1,8,4],[1,8,6],[1,8,8],[1,8,10],[1,8,12],
      [1,9,0],[1,9,2],[1,9,4],[1,9,6],[1,9,8],[1,9,10],[1,9,12],
      // Layer 2: 54 tiles
      [2,0,1],[2,0,3],[2,0,5],[2,0,7],[2,0,9],[2,0,11],[2,1,1],[2,1,3],[2,1,5],
      [2,1,7],[2,1,9],[2,1,11],[2,2,1],[2,2,3],[2,2,5],[2,2,7],[2,2,9],[2,2,11],
      [2,3,1],[2,3,3],[2,3,5],[2,3,7],[2,3,9],[2,3,11],[2,4,1],[2,4,3],[2,4,5],
      [2,4,7],[2,4,9],[2,4,11],[2,5,1],[2,5,3],[2,5,5],[2,5,7],[2,5,9],[2,5,11],
      [2,6,1],[2,6,3],[2,6,5],[2,6,7],[2,6,9],[2,6,11],[2,7,1],[2,7,3],[2,7,5],
      [2,7,7],[2,7,9],[2,7,11],[2,8,1],[2,8,3],[2,8,5],[2,8,7],[2,8,9],[2,8,11],
      // Layer 3: 28 tiles
      [3,3,3],[3,3,4],[3,3,5],[3,3,6],[3,3,7],[3,3,8],[3,3,9],[3,4,3],[3,4,4],
      [3,4,5],[3,4,6],[3,4,7],[3,4,8],[3,4,9],[3,5,3],[3,5,4],[3,5,5],[3,5,6],
      [3,5,7],[3,5,8],[3,5,9],[3,6,3],[3,6,4],[3,6,5],[3,6,6],[3,6,7],[3,6,8],
      [3,6,9],
      // Layer 4: 15 tiles
      [4,4,4],[4,4,5],[4,4,6],[4,4,7],[4,4,8],[4,5,4],[4,5,5],[4,5,6],[4,5,7],
      [4,5,8],[4,6,4],[4,6,5],[4,6,6],[4,6,7],[4,6,8],
      // Layer 5: 3 tiles
      [5,5,5],[5,5,6],[5,5,7],
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

  // Determine tile size: pick the side that yields a tall enough tile to fit the grid,
  // and then a separate side to fit horizontally. We use the smaller of the two so the
  // entire grid (including upper-layer shifts) fits inside the play area.
  // Reserve vertical room so the topmost stacked layer doesn't get clipped.
  const upperLayers = cfg.tiles.reduce(function(m, t) { return Math.max(m, t[0]); }, 0);
  // Upper layers shift left AND up by half-tile per layer. So the total visible grid
  // extends ~upperLayers/2 cells beyond the base grid on the LEFT and TOP.
  // Account for that in both dimensions so the layout doesn't overflow the play area.
  const halfLayers = upperLayers * 0.5;
  const maxW = Math.floor((W - 16) / (cfg.widthNum + halfLayers));
  const maxH = Math.floor((H - 32) / (cfg.heightNum + halfLayers));
  const tileSize = Math.max(22, Math.min(maxW, maxH, 44));
  const tileW = tileSize;
  const tileH = tileSize;

  // Build the tile pool: cfg.cardNum types × cfg.cardsEach copies of each.
  //   cardsEach = 3  → standard match-3
  //   cardsEach > 3 → "each type forms multiple triples" → tougher pool
  const pool = [];
  for (let i = 0; i < (cfg.cardNum || 0); i++) {
    for (let k = 0; k < (cfg.cardsEach || 3); k++) pool.push(i);
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

  // Centering strategy (handles upper-layer shifts correctly):
  //   1. Compute each tile's raw top-left assuming the base grid origin is (0, 0).
  //   2. Compute the bounding box (min/max left/top) of all raw positions.
  //   3. Compute offsets to center that bounding box inside the play area (W x H).
  //   4. tilePos() returns the final top-left, applying those offsets.
  function rawPos(layer, row, col) {
    const shiftX = (tileW / 2) * layer;
    const shiftY = (tileH / 2) * layer;
    return {
      left: tileW * col - shiftX,
      top:  tileH * row - shiftY
    };
  }

  let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
  cfg.tiles.forEach(function(t) {
    const p = rawPos(t[0], t[1], t[2]);
    if (p.left < minL) minL = p.left;
    if (p.top  < minT) minT = p.top;
    if (p.left + tileW > maxR) maxR = p.left + tileW;
    if (p.top  + tileH > maxB) maxB = p.top  + tileH;
  });
  const layoutW = maxR - minL;
  const layoutH = maxB - minT;
  const offsetX = (W - layoutW) / 2 - minL;
  const offsetY = (H - layoutH) / 2 - minT;

  function tilePos(layer, row, col) {
    const p = rawPos(layer, row, col);
    return { left: p.left + offsetX, top: p.top + offsetY };
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
      tileSize: tileSize,
      parents: [],
      state: 0
    });
  });

  // Build "is covered by upper-layer tile at same position" check.
  // We use a half-tile radius (~0.6 of tileW) for "same column/row alignment".
  // Compute each node's visual (row, col) — accounting for the half-tile shift per layer.
  // Layer L sits at visual position (row - L/2, col - L/2) in cell units.
  // An upper tile covers self when upper's visual cell CONTAINS self's CENTER.
  // Equivalently: upper.vis in [self.vis - 0.5, self.vis + 0.5].
  for (let i = 0; i < state.nodes.length; i++) {
    const self = state.nodes[i];
    self.visRow = self.row - 0.5 * self.layer;
    self.visCol = self.col - 0.5 * self.layer;
  }
  for (let i = 0; i < state.nodes.length; i++) {
    const self = state.nodes[i];
    for (let j = 0; j < state.nodes.length; j++) {
      if (i === j) continue;
      const upper = state.nodes[j];
      if (upper.layer <= self.layer) continue;
      // upper's visual cell range: [vis - 0.5, vis + 0.5]
      // If self's visual center is inside that, upper covers self.
      const uR = upper.visRow;
      const uC = upper.visCol;
      const sR = self.visRow;
      const sC = self.visCol;
      if (Math.abs(sR - uR) <= 0.5 && Math.abs(sC - uC) <= 0.5) {
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
  // Read current tile size from the most-recently-placed node, or default 40
  const sampleNode = state.nodes.find(function(n) { return true; });
  const tileSize = (sampleNode && sampleNode.tileSize) || 40;
  state.nodes.forEach(function(node) {
    if (node.state >= 2) return;
    const div = document.createElement('div');
    div.className = 'tile' + (node.state === 0 ? ' locked' : '');
    div.style.top = node.top + 'px';
    div.style.left = node.left + 'px';
    div.style.width = (node.tileSize || tileSize) + 'px';
    div.style.height = (node.tileSize || tileSize) + 'px';
    div.style.zIndex = node.zIndex;
    div.style.fontSize = Math.floor((node.tileSize || tileSize) * 0.72) + 'px';
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
