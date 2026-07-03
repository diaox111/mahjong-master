// Main UI logic
document.addEventListener('DOMContentLoaded', () => {
  const game = new MahjongGame();
  const gameBoard = document.getElementById('game-board');
  
  // For demo: show clickable tile preview
  if (gameBoard) {
    gameBoard.innerHTML = `
      <div style="text-align:center;color:#fff;">
        <p style="font-size:48px;margin-bottom:16px;">🀄 🀄 🀄</p>
        <p style="font-size:20px;margin-bottom:24px;">Mahjong Solitaire Game Engine Ready</p>
        <p style="font-size:14px;opacity:0.7;">MVP Demo - Full game logic to be implemented</p>
        <p style="font-size:12px;opacity:0.5;margin-top:24px;">Integrate: mahjong-tiles npm package OR mahjong-html5 library</p>
      </div>
    `;
  }

  // Analytics placeholder
  console.log('MahjongMaster loaded');
  
  // Track ad slot visibility
  const adSlot = document.querySelector('.ad-slot');
  if (adSlot) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('Ad slot visible - AdSense would load here');
        }
      });
    });
    observer.observe(adSlot);
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({behavior: 'smooth'});
    }
  });
});
