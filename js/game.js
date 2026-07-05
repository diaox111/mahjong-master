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
  { name: 'Warm-up', widthNum: 8, heightNum: 10,
    blockTypeData: {'8':2,'9':2,'10':2,'11':2,'15':2,'16':2,'17':2,'18':2,'19':3,'20':2,'21':2},
    tiles: [
      [1,0,24],
      [1,8,24],
      [1,8,32],
      [1,16,8],
      [1,16,16],
      [1,16,40],
      [1,24,8],
      [1,24,16],
      [1,24,32],
      [1,24,40],
      [1,32,16],
      [1,32,24],
      [1,32,32],
      [1,40,8],
      [1,40,24],
      [1,40,32],
      [2,4,28],
      [2,12,20],
      [2,20,12],
      [2,28,20],
      [2,36,28],
      [2,52,8],
      [2,52,16],
      [2,52,32],
      [2,52,40],
      [2,52,48],
      [2,55,8],
      [2,55,48],
      [3,8,24],
      [3,8,32],
      [3,16,16],
      [3,16,24],
      [3,16,32],
      [3,16,40],
      [3,24,16],
      [3,24,32],
      [3,29,12],
      [3,29,28],
      [3,29,36],
      [3,29,52],
      [4,12,20],
      [4,12,28],
      [4,12,36],
      [4,20,20],
      [4,20,36],
      [4,51,20],
      [4,51,44],
      [4,54,12],
      [4,54,28],
      [4,54,36],
      [4,54,52],
      [4,57,16],
      [5,16,24],
      [5,16,32],
      [5,24,24],
      [5,24,32],
      [5,56,8],
      [5,56,16],
      [5,56,40],
      [5,56,48],
      [6,20,28],
      [6,57,8],
      [6,57,16],
      [6,57,40],
      [6,57,48],
      [7,58,8],
      [7,58,16],
      [7,58,40],
      [7,58,48],
    ]
  },
  { name: 'Insane', widthNum: 8, heightNum: 10,
    blockTypeData: {'8':2,'9':2,'15':3,'16':3,'17':3,'18':3,'19':2,'20':3,'21':3},
    tiles: [
      [1,16,8],
      [1,16,16],
      [1,16,24],
      [1,16,32],
      [1,16,40],
      [1,24,8],
      [1,24,16],
      [1,24,32],
      [1,24,40],
      [1,32,8],
      [1,32,16],
      [1,32,24],
      [1,32,32],
      [1,32,40],
      [1,40,8],
      [1,40,16],
      [1,40,24],
      [1,40,32],
      [2,20,4],
      [2,20,12],
      [2,20,44],
      [2,20,52],
      [2,28,4],
      [2,28,12],
      [2,28,36],
      [2,28,44],
      [2,28,52],
      [2,36,4],
      [2,36,12],
      [2,36,44],
      [2,36,52],
      [2,44,4],
      [2,44,52],
      [3,28,4],
      [3,28,12],
      [3,28,44],
      [3,28,52],
      [3,36,4],
      [3,36,52],
      [4,28,4],
      [4,28,12],
      [4,28,44],
      [4,28,52],
      [5,56,8],
      [5,56,48],
      [6,56,9],
      [6,56,47],
      [7,56,10],
      [7,56,46],
      [8,56,11],
      [8,56,45],
      [9,56,12],
      [9,56,44],
      [10,56,13],
      [10,56,43],
      [11,56,14],
      [11,56,42],
      [12,56,15],
      [12,56,41],
      [13,56,16],
      [13,56,40],
      [14,56,17],
      [14,56,39],
      [15,56,18],
      [15,56,38],
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
    if (t[2] > maxColPx) maxColPx = t[2];
    if (t[1] > maxRowPx) maxRowPx = t[1];
  });

  const cellPx = 16;
  const layoutW = maxColPx + cellPx;
  const layoutH = maxRowPx + cellPx;
  const scale = Math.min(1, (W - 16) / layoutW, (H - 32) / layoutH);
  const tileSize = Math.max(20, Math.floor(cellPx * scale));

  function rawPos(layer, rowPx, colPx) {
    return {
      left: colPx * tileSize / MIN_BLOCK_NUM,
      top:  rowPx * tileSize / MIN_BLOCK_NUM
    };
  }

  cfg.tiles.forEach(function(t) {
    const pos = rawPos(t[0], t[1], t[2]);
    state.nodes.push({
      id: t[0] + '-' + t[1] + '-' + t[2] + '-' + rand(0, 99999),
      type: 0,
      zIndex: 10 + t[0],
      layer: t[0],
      rowPx: t[1], colPx: t[2],
      top: pos.top, left: pos.left,
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
