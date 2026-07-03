/* Mahjong Master - Sheep-a-Sheep style
 * Algorithm ported from chenxch/xlegex (MIT)
 */

const TILES = ['\uD83C\uDC00','\uD83C\uDC01','\uD83C\uDC02','\uD83C\uDC03','\uD83C\uDC04','\uD83C\uDC05','\uD83C\uDC06','\uD83C\uDC07','\uD83C\uDC08','\uD83C\uDC09','\uD83C\uDC0A','\uD83C\uDC0B','\uD83C\uDC0C','\uD83C\uDC0D','\uD83C\uDC0E','\uD83C\uDC0F','\uD83C\uDC10','\uD83C\uDC11','\uD83C\uDC12','\uD83C\uDC13','\uD83C\uDC14','\uD83C\uDC15','\uD83C\uDC16','\uD83C\uDC17','\uD83C\uDC18','\uD83C\uDC19','\uD83C\uDC1A','\uD83C\uDC1B','\uD83C\uDC1C','\uD83C\uDC1D','\uD83C\uDC1E','\uD83C\uDC1F','\uD83C\uDC20','\uD83C\uDC21'];

const LEVELS = [
  { cardNum: 8,  layerNum: 3, trap: false, name: 'Easy' },
  { cardNum: 18, layerNum: 4, trap: true,  name: 'Insane' }
];

const SLOT_MAX = 7;
const TILE_SIZE = 44;

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
  const centerX = W / 2;
  const centerY = H / 2 - 30;
  const types = [];
  for (let i = 0; i < cfg.cardNum; i++) types.push(i);
  let pool = [];
  for (let j = 0; j < 3 * cfg.layerNum; j++) pool = pool.concat(types);
  if (cfg.trap && rand(0, 100) !== 50) pool.splice(pool.length - cfg.cardNum, cfg.cardNum);
  pool = shuffle(pool);
  const floors = [];
  let remaining = pool.slice();
  let floorIdx = 1;
  while (remaining.length > 0) {
    const maxInFloor = floorIdx * floorIdx;
    const numInFloor = Math.min(remaining.length, rand(Math.ceil(maxInFloor / 2), maxInFloor + 1));
    floors.push(remaining.splice(0, numInFloor));
    floorIdx++;
  }
  let prevFloorNodes = [];
  floors.forEach(function(floorTiles, fIdx) {
    const usedPos = {};
    const floorNodes = [];
    floorTiles.forEach(function(tileType) {
      const gridSize = fIdx + 1;
      const totalCells = gridSize * gridSize;
      let pos = rand(0, totalCells);
      let safety = 0;
      while (usedPos[pos] && safety < 100) { pos = rand(0, totalCells); safety++; }
      usedPos[pos] = true;
      const row = Math.floor(pos / gridSize);
      const col = pos % gridSize;
      const node = {
        id: fIdx + '-' + pos, type: tileType, zIndex: fIdx, index: pos,
        row: row, col: col,
        top: centerY + (TILE_SIZE * row - (TILE_SIZE / 2) * fIdx),
        left: centerX + (TILE_SIZE * col - (TILE_SIZE / 2) * fIdx),
        parents: [], state: 0
      };
      prevFloorNodes.forEach(function(prev) {
        if (Math.abs(prev.top - node.top) < TILE_SIZE && Math.abs(prev.left - node.left) < TILE_SIZE) {
          prev.parents.push(node);
        }
      });
      floorNodes.push(node);
    });
    state.nodes = state.nodes.concat(floorNodes);
    prevFloorNodes = floorNodes;
  });
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
