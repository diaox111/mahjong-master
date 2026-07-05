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

// === REAL Sheep-a-Sheep level data from qierkang/yang-game ===
// Source: github.com/qierkang/yang-game + yang-server
const MIN_BLOCK_NUM = 8;

const LEVELS = [
  { name: 'Level 1', widthNum: 8, heightNum: 5,
    blockTypeData: {1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 3},
    tiles: [
      [1,1,8,8],
      [1,2,16,8],
      [1,3,24,8],
      [1,4,32,8],
      [1,5,40,8],
      [1,6,48,8],
      [1,1,0,24],
      [1,2,8,24],
      [1,3,16,24],
      [1,7,24,24],
      [1,4,32,24],
      [1,5,40,24],
      [1,6,48,24],
      [1,1,0,40],
      [1,2,8,40],
      [1,3,16,40],
      [1,4,24,40],
      [1,5,32,40],
      [1,6,40,40],
      [2,7,0,8],
      [2,7,48,40]
    ]
  },
  { name: 'Level 2', widthNum: 12, heightNum: 10,
    blockTypeData: {1: 21, 2: 21, 3: 21, 4: 21, 5: 21, 6: 21, 7: 21, 8: 21, 9: 21, 10: 21},
    tiles: [
      [1,1,0,0],
      [1,2,8,0],
      [1,3,16,0],
      [1,4,24,0],
      [1,5,32,0],
      [1,6,40,0],
      [1,7,48,0],
      [1,8,56,0],
      [1,9,64,0],
      [1,10,72,0],
      [1,1,80,0],
      [1,2,88,0],
      [1,3,0,8],
      [1,4,88,8],
      [1,5,0,16],
      [1,6,88,16],
      [1,7,0,24],
      [1,8,88,24],
      [1,9,0,32],
      [1,10,88,32],
      [1,1,0,40],
      [1,2,88,40],
      [1,3,0,48],
      [1,4,88,48],
      [1,5,0,56],
      [1,6,88,56],
      [1,7,0,64],
      [1,8,88,64],
      [1,9,0,72],
      [1,10,8,72],
      [1,1,16,72],
      [1,2,24,72],
      [1,3,32,72],
      [1,4,40,72],
      [1,5,48,72],
      [1,6,56,72],
      [1,7,64,72],
      [1,8,72,72],
      [1,9,80,72],
      [1,10,88,72],
      [2,3,32,0],
      [2,7,48,0],
      [2,8,0,8],
      [2,1,8,8],
      [2,2,16,8],
      [2,3,24,8],
      [2,4,32,8],
      [2,5,40,8],
      [2,6,48,8],
      [2,7,56,8],
      [2,8,64,8],
      [2,9,72,8],
      [2,10,80,8],
      [2,1,8,16],
      [2,2,80,16],
      [2,3,8,24],
      [2,5,24,24],
      [2,1,48,24],
      [2,4,80,24],
      [2,4,0,32],
      [2,5,8,32],
      [2,6,80,32],
      [2,7,8,40],
      [2,8,80,40],
      [2,9,8,48],
      [2,10,80,48],
      [2,1,8,56],
      [2,2,80,56],
      [2,10,0,64],
      [2,3,8,64],
      [2,4,16,64],
      [2,5,24,64],
      [2,6,32,64],
      [2,7,40,64],
      [2,8,48,64],
      [2,9,56,64],
      [2,10,64,64],
      [2,1,72,64],
      [2,2,80,64],
      [2,6,8,72],
      [2,2,56,72],
      [2,9,64,72],
      [3,9,32,0],
      [3,5,24,8],
      [3,5,40,8],
      [3,2,48,8],
      [3,1,64,8],
      [3,3,16,16],
      [3,4,24,16],
      [3,5,32,16],
      [3,6,40,16],
      [3,7,48,16],
      [3,8,56,16],
      [3,9,64,16],
      [3,10,72,16],
      [3,1,16,24],
      [3,2,72,24],
      [3,3,16,32],
      [3,4,40,32],
      [3,3,64,32],
      [3,4,72,32],
      [3,7,8,40],
      [3,5,16,40],
      [3,6,72,40],
      [3,6,8,48],
      [3,7,16,48],
      [3,8,72,48],
      [3,9,16,56],
      [3,10,24,56],
      [3,1,32,56],
      [3,2,40,56],
      [3,3,48,56],
      [3,4,56,56],
      [3,5,64,56],
      [3,6,72,56],
      [3,10,88,56],
      [3,8,40,72],
      [3,4,80,72],
      [4,8,24,8],
      [4,7,32,8],
      [4,1,88,8],
      [4,2,72,16],
      [4,6,0,24],
      [4,7,24,24],
      [4,8,32,24],
      [4,9,40,24],
      [4,10,48,24],
      [4,1,56,24],
      [4,2,64,24],
      [4,3,24,32],
      [4,4,32,32],
      [4,5,40,32],
      [4,6,48,32],
      [4,7,56,32],
      [4,8,64,32],
      [4,10,80,32],
      [4,9,16,40],
      [4,9,24,40],
      [4,10,32,40],
      [4,1,40,40],
      [4,2,48,40],
      [4,3,56,40],
      [4,4,64,40],
      [4,5,24,48],
      [4,6,32,48],
      [4,7,40,48],
      [4,8,48,48],
      [4,9,56,48],
      [4,10,64,48],
      [4,3,16,56],
      [4,4,80,64],
      [5,7,24,16],
      [5,5,0,24],
      [5,7,8,24],
      [5,2,16,24],
      [5,1,16,32],
      [5,1,32,32],
      [5,2,40,32],
      [5,3,48,32],
      [5,4,56,32],
      [5,4,64,32],
      [5,6,0,40],
      [5,5,32,40],
      [5,6,40,40],
      [5,7,48,40],
      [5,8,56,40],
      [5,8,72,40],
      [5,9,24,56],
      [5,10,48,56],
      [5,3,88,64],
      [5,6,48,72],
      [5,5,88,72],
      [6,9,8,0],
      [6,7,64,0],
      [6,3,72,8],
      [6,8,80,8],
      [6,10,8,16],
      [6,2,48,16],
      [6,1,80,16],
      [6,1,8,32],
      [6,9,40,32],
      [6,10,48,32],
      [6,6,64,32],
      [6,10,32,40],
      [6,1,40,40],
      [6,2,48,40],
      [6,4,48,48],
      [6,2,80,48],
      [6,8,64,56],
      [6,5,72,56],
      [6,9,80,64],
      [7,3,56,0],
      [7,2,64,0],
      [7,6,64,8],
      [7,5,64,16],
      [7,6,0,24],
      [7,5,32,24],
      [7,9,72,24],
      [7,3,40,32],
      [7,7,80,32],
      [7,4,88,32],
      [7,4,8,40],
      [7,10,16,40],
      [7,3,72,40],
      [7,1,16,64],
      [7,8,80,64]
    ]
  }
];


const SLOT_MAX = 7;

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
    if (node.state >= 2) return;
    node.state = node.parents.every(function(p) { return p.state >= 2; }) ? 1 : 0;
  });
}


function handleSelect(node) {
  if (state.removeFlag) return;
  if (state.selectedNodes.length >= SLOT_MAX) return;
  if (node.state !== 1) return;
  node.state = 2;
  state.preNode = node;
  let insertPos = state.selectedNodes.length;
  for (let i = state.selectedNodes.length - 1; i >= 0; i--) {
    if (state.selectedNodes[i].type === node.type) { insertPos = i + 1; break; }
  }
  state.selectedNodes.splice(insertPos, 0, node);
  setTimeout(function() {
    eliminateTriples();
    updateStates();
    render();
    if (state.selectedNodes.length >= SLOT_MAX) setTimeout(onLose, 200);
    if (state.nodes.every(function(n) { return n.state >= 2; }) && state.selectedNodes.length === 0) {
      setTimeout(onWin, 400);
    }
  }, 80);
}

function eliminateTriples() {
  state.removeFlag = true;
  let removed = true;
  while (removed) {
    removed = false;
    let i = 0;
    while (i < state.selectedNodes.length) {
      let j = i + 1;
      while (j < state.selectedNodes.length && state.selectedNodes[j].type === state.selectedNodes[i].type) j++;
      const runLen = j - i;
      if (runLen >= 3) {
        for (let k = i; k < j; k++) {
          const r = state.selectedNodes[k];
          r.state = 3;
          if (state.removedNodes.indexOf(r) === -1) state.removedNodes.push(r);
        }
        state.selectedNodes.splice(i, runLen);
        removed = true;
      } else { i++; }
    }
  }
  state.removeFlag = false;
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
  if (state.removeFlag) return;
  state.removeFlag = false;
}


function initLevel(levelIdx) {
  state.level = levelIdx;
  state.nodes = []; state.selectedNodes = []; state.removedNodes = [];
  state.preNode = null; state.removeFlag = false; state.backFlag = false;
  const cfg = LEVELS[levelIdx];
  const container = document.getElementById('game-area');
  const W = container.clientWidth;
  const H = container.clientHeight;

  let maxColPx = 0, maxRowPx = 0;
  cfg.tiles.forEach(function(t) {
    const col = t.length >= 4 ? t[2] : t[1];   // 4-tuple [L,T,C,R] or 3-tuple [L,C,R]
    const row = t.length >= 4 ? t[3] : t[2];
    if (col > maxColPx) maxColPx = col;
    if (row > maxRowPx) maxRowPx = row;
  });

  const cellPx = 8;
  const layoutW = maxColPx + cellPx;
  const layoutH = maxRowPx + cellPx;
  // BIG tiles: target 64-72px per tile
  const idealTile = 68;
  const maxTilesW = Math.floor((W - 16) / idealTile);
  const maxTilesH = Math.floor((H - 80) / idealTile);
  let tileSize = idealTile;
  if (maxColPx / cellPx > maxTilesW || maxRowPx / cellPx > maxTilesH) {
    const scale = Math.min((W - 16) / layoutW, (H - 80) / layoutH);
    tileSize = Math.max(40, Math.floor(cellPx * scale));
  }

  cfg.tiles.forEach(function(t) {
    const isQuad = t.length >= 4;
    const layer = t[0];
    const explicitType = isQuad ? t[1] : 0;
    const colPx = isQuad ? t[2] : t[1];
    const rowPx = isQuad ? t[3] : t[2];
    state.nodes.push({
      id: layer + '-' + colPx + '-' + rowPx + '-' + rand(0, 99999),
      type: explicitType,
      zIndex: 10 + layer,
      layer: layer,
      rowPx: rowPx, colPx: colPx,
      top:  rowPx * tileSize / cellPx,
      left: colPx * tileSize / cellPx,
      tileSize: tileSize,
      parents: [], state: 0
    });
  });

  const pool = [];
  Object.keys(cfg.blockTypeData).forEach(function(t) {
    const tid = parseInt(t);
    for (let k = 0; k < cfg.blockTypeData[t]; k++) pool.push(tid);
  });
  shuffle(pool);
  let poolIdx = 0;
  state.nodes.forEach(function(n) {
    if (n.type > 0) return;  // explicit type, skip pool
    n.type = pool[poolIdx < pool.length ? poolIdx++ : (poolIdx++ % pool.length)];
  });

  let minL = Infinity, minT = Infinity, maxR = -Infinity, maxB = -Infinity;
  state.nodes.forEach(function(n) {
    if (n.left < minL) minL = n.left;
    if (n.top  < minT) minT = n.top;
    if (n.left + tileSize > maxR) maxR = n.left + tileSize;
    if (n.top  + tileSize > maxB) maxB = n.top  + tileSize;
  });
  const bboxW = maxR - minL;
  const bboxH = maxB - minT;
  const offsetX = (W - bboxW) / 2 - minL;
  const offsetY = (H - bboxH) / 2 - minT;
  state.nodes.forEach(function(n) {
    n.left += offsetX;
    n.top  += offsetY;
  });

  const coverDist = tileSize * 0.7;
  for (let i = 0; i < state.nodes.length; i++) {
    const self = state.nodes[i];
    for (let j = 0; j < state.nodes.length; j++) {
      if (i === j) continue;
      const upper = state.nodes[j];
      if (upper.layer <= self.layer) continue;
      if (Math.abs(upper.top - self.top) <= coverDist &&
          Math.abs(upper.left - self.left) <= coverDist) {
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
    div.style.fontSize = Math.floor((node.tileSize || tileSize) * 0.85) + 'px';
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
