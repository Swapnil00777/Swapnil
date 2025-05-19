let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Helper to get coordinates from mouse or touch event
    function getEventCoords(e) {
      if (e.touches && e.touches.length > 0) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else {
        return { x: e.clientX, y: e.clientY };
      }
    }

    // Move handler (works for both mouse and touch)
    const moveHandler = (e) => {
      const { x, y } = getEventCoords(e);

      if(!this.rotating) {
        this.mouseX = x;
        this.mouseY = y;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = x - this.mouseTouchX;
      const dirY = y - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirLength === 0 ? 0 : dirX / dirLength;
      const dirNormalizedY = dirLength === 0 ? 0 : dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if(this.rotating) {
        this.rotation = degrees;
      }

      if(this.holdingPaper) {
        if(!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    // Mouse and touch move event listeners
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('touchmove', moveHandler);

    // Mouse/Touch down (start)
    const startHandler = (e) => {
      if(this.holdingPaper) return; 
      this.holdingPaper = true;

      // Prevent scrolling on touch
      if (e.type === "touchstart") e.preventDefault();

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const { x, y } = getEventCoords(e);
      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.mouseX = x;
      this.mouseY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;

      if (e.button === 2) {
        this.rotating = true;
      }
    };
    paper.addEventListener('mousedown', startHandler);
    paper.addEventListener('touchstart', startHandler, { passive: false });

    // Mouse/Touch up (end)
    const endHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };
    window.addEventListener('mouseup', endHandler);
    window.addEventListener('touchend', endHandler);
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
