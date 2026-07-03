/* Mahjong Master - Sheep-a-Sheep style
 * Algorithm ported from chenxch/xlegex (MIT)
 */

const TILES = ['\uD83C\uDC00','\uD83C\uDC01','\uD83C\uDC02','\uD83C\uDC03','\uD83C\uDC04','\uD83C\uDC05','\uD83C\uDC06','\uD83C\uDC07','\uD83C\uDC08','\uD83C\uDC09','\uD83C\uDC0A','\uD83C\uDC0B','\uD83C\uDC0C','\uD83C\uDC0D','\uD83C\uDC0E','\uD83C\uDC0F','\uD83C\uDC10','\uD83C\uDC11','\uD83C\uDC12','\uD83C\uDC13','\uD83C\uDC14','\uD83C\uDC15','\uD83C\uDC16','\uD83C\uDC17','\uD83C\uDC18','\uD83C\uDC19','\uD83C\uDC1A','\uD83C\uDC1B','\uD83C\uDC1C','\uD83C\uDC1D','\uD83C\uDC1E','\uD83C\uDC1F','\uD83C\uDC20','\uD83C\uDC21'];

// Sheep-a-sheep level design:
//   Level 1 = warm-up: small grid, mostly flat, few types
//   Level 2 = insane: huge dense grid, multiple layers, lots of types + traps
const LEVELS = [
  { cardNum: 6,  cols: 7, rows: 5, layers: 2, topClusters: 1, topSize: 6,  trap: false, name: 'Warm-up' },
  { cardNum: 16, cols: 9, rows: 7, layers: 4, topClusters: 3, topSize: 30, trap: true,  name: 'Insane' }
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

  // Compute tile size so cols x rows + layer shift fits within W,H
  const maxShift = (cfg.layers - 1) * 0.5;
  const tileSize = Math.max(26, Math.min(
    Math.floor((W - 8) / (cfg.cols + maxShift)),
    Math.floor((H - 8) / (cfg.rows + maxShift)),
    52
  ));

  // Build pool: 3 copies of each tile type
  const types = [];
  for (let i = 0; i < cfg.cardNum; i++) { types.push(i); types.push(i); types.push(i); }
  // Optional trap: drop pairs to leave some types unmatchable
  if (cfg.trap && rand(0, 100) !== 50) {
    const dropCount = Math.min(4, Math.floor(cfg.cardNum / 4));
    const dropTypes = [];
    while (dropTypes.length < dropCount) {
      const t = rand(0, cfg.cardNum);
      if (dropTypes.indexOf(t) === -1) dropTypes.push(t);
    }
    dropTypes.forEach(function(t) {
      // remove 2 copies of t so it has only 1 left (unmatchable)
      let removed = 0;
      for (let i = types.length - 1; i >= 0 && removed < 2; i--) {
        if (types[i] === t) { types.splice(i, 1); removed++; }
      }
    });
  }
  const pool = shuffle(types);

  // Place each layer bottom-up: layer 0 = full base grid, layers 1+ = smaller clusters shifted up-left
  function placeLayer(layerIdx) {
    const shiftX = (tileSize / 2) * layerIdx;
    const shiftY = (tileSize / 2) * layerIdx;
    const layerNodes = [];
    const isBase = layerIdx === 0;
    const cellCols = isBase ? cfg.cols : Math.max(3, Math.floor(cfg.cols * 0.6));
    const cellRows = isBase ? cfg.rows : Math.max(3, Math.floor(cfg.rows * 0.7));
    const capacity = cellCols * cellRows;
    const wantCount = isBase
      ? Math.min(capacity, pool.length)
      : Math.min(cfg.topSize, pool.length, capacity);
    if (wantCount <= 0) return [];
    // All grid cells, shuffled
    const allCells = [];
    for (let r = 0; r < cellRows; r++) for (let c = 0; c < cellCols; c++) allCells.push(r * cellCols + c);
    shuffle(allCells);
    const baseGridW = cfg.cols * tileSize;
    const baseStartX = (W - baseGridW) / 2 + tileSize / 2;
    const baseStartY = 8 + tileSize / 2;
    for (let i = 0; i < allCells.length && layerNodes.length < wantCount && pool.length > 0; i++) {
      const cell = allCells[i];
      const row = Math.floor(cell / cellCols);
      const col = cell % cellCols;
      const top = baseStartY + tileSize * row - shiftY;
      const left = baseStartX + tileSize * col - shiftX;
      const tileType = pool.shift();
      const node = {
        id: layerIdx + '-' + cell + '-' + rand(0, 9999),
        type: tileType,
        zIndex: 10 + layerIdx,
        layer: layerIdx,
        top: top,
        left: left,
        parents: [],
        state: 0
      };
      layerNodes.push(node);
    }
    return layerNodes;
  }

  const allLayers = [];
  for (let L = 0; L < cfg.layers; L++) {
    const ln = placeLayer(L);
    allLayers.push(ln);
  }

  // Build parent relationships: node N (upper layer) sits ON TOP of node M (lower layer)
  // if their positions are within tileSize*0.6 of each other.
  // -> M.parents.push(N) (M has N pressing on it; when N.state >= 2 M becomes clickable)
  for (let L = 1; L < allLayers.length; L++) {
    const upper = allLayers[L];
    const lower = allLayers[L - 1];
    for (let i = 0; i < upper.length; i++) {
      const node = upper[i];
      for (let j = 0; j < lower.length; j++) {
        const below = lower[j];
        if (Math.abs(below.top - node.top) < tileSize * 0.6 &&
            Math.abs(below.left - node.left) < tileSize * 0.6) {
          below.parents.push(node);
        }
      }
    }
    // Also chain non-adjacent layers (L-2, L-3...) so removing multiple upper tiles
    // can uncover deep ones
    for (let lowerL = 0; lowerL < L - 1; lowerL++) {
      const deeper = allLayers[lowerL];
      for (let i = 0; i < upper.length; i++) {
        const node = upper[i];
        for (let j = 0; j < deeper.length; j++) {
          const below = deeper[j];
          if (Math.abs(below.top - node.top) < tileSize * 0.8 &&
              Math.abs(below.left - node.left) < tileSize * 0.8) {
            // only add if not already there
            if (below.parents.indexOf(node) === -1) below.parents.push(node);
          }
        }
      }
    }
  }

  allLayers.forEach(function(ln) { state.nodes = state.nodes.concat(ln); });
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
