// Mahjong Solitaire Game Engine (Simplified Demo)
// Full version: integrate mahjong-tiles npm package or use Three.js

const TILES = {
  // Bamboos (1-9)
  bamboo: ['1','2','3','4','5','6','7','8','9'],
  // Characters (1-9)
  character: ['1','2','3','4','5','6','7','8','9'],
  // Circles (1-9)
  circle: ['1','2','3','4','5','6','7','8','9'],
  // Winds
  winds: ['east','south','west','north'],
  // Dragons
  dragons: ['red','green','white'],
  // Flowers
  flowers: ['plum','orchid','chrysanthemum','bamboo'],
  // Seasons
  seasons: ['spring','summer','autumn','winter']
};

const TILE_SYMBOLS = {
  'bamboo-1':'🎋','bamboo-2':'🎋','bamboo-3':'🎋','bamboo-4':'🎋','bamboo-5':'🎋',
  'bamboo-6':'🎋','bamboo-7':'🎋','bamboo-8':'🎋','bamboo-9':'🎋',
  'character-1':'🀇','character-2':'🀈','character-3':'🀉','character-4':'🀊',
  'character-5':'🀋','character-6':'🀌','character-7':'🀍','character-8':'🀎','character-9':'🀏',
  'circle-1':'🀙','circle-2':'🀚','circle-3':'🀛','circle-4':'🀜',
  'circle-5':'🀝','circle-6':'🀞','circle-7','🀟','circle-8':'🀠','circle-9':'🀡',
  'wind-east':'🀀','wind-south':'🀁','wind-west':'🀂','wind-north':'🀃',
  'dragon-red':'🀄','dragon-green':'🀅','dragon-white':'🀆',
  'flower-plum':'🌸','flower-orchid':'🪻','flower-chrysanthemum':'🌼','flower-bamboo':'🎋',
  'season-spring':'🌸','season-summer':'☀️','season-autumn':'🍂','season-winter':'❄️'
};

// Initialize game state
class MahjongGame {
  constructor() {
    this.board = [];
    this.selected = null;
    this.moves = 0;
    this.score = 0;
    this.startTime = null;
  }

  // Shuffle and create initial deck
  initDeck() {
    const deck = [];
    // 4 copies of each suit tile (1-9 × 4 suits = 108)
    ['bamboo','character','circle'].forEach(suit => {
      for (let i = 1; i <= 9; i++) {
        for (let c = 0; c < 4; c++) deck.push(`${suit}-${i}`);
      }
    });
    // 4 copies of each wind (16)
    TILES.winds.forEach(w => { for(let c=0;c<4;c++) deck.push(`wind-${w}`); });
    // 4 copies of each dragon (12)
    TILES.dragons.forEach(d => { for(let c=0;c<4;c++) deck.push(`dragon-${d}`); });
    // 1 copy each of flowers and seasons (8)
    TILES.flowers.forEach(f => deck.push(`flower-${f}`));
    TILES.seasons.forEach(s => deck.push(`season-${s}`));
    return this.shuffle(deck);
  }

  shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Layout: Turtle (classic 144 tiles in pyramid)
  buildTurtleLayout() {
    const layers = [
      // Each layer: positions of tiles
      // Layer 0 (bottom): 12x8 grid minus borders
      [],
    ];
    return layers;
  }

  // Check if two tiles match
  isMatch(tile1, tile2) {
    if (!tile1 || !tile2) return false;
    if (tile1 === tile2) return true;
    // Flowers and Seasons match within their own group
    if (tile1.startsWith('flower') && tile2.startsWith('flower')) return true;
    if (tile1.startsWith('season') && tile2.startsWith('season')) return true;
    return false;
  }

  start() {
    this.startTime = Date.now();
    this.moves = 0;
    this.score = 0;
    return this.initDeck();
  }
}

// Export for use in main.js
window.MahjongGame = MahjongGame;
