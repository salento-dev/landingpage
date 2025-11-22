class LetterGlitch extends HTMLElement {
  constructor() {
    super();
    
    // Default values
    this.glitchColors = ['#2b4539', '#61dca3', '#61b3dc'];
    this.glitchSpeed = 50;
    this.centerVignette = false;
    this.outerVignette = true;
    this.smooth = true;
    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789';
    
    // Instance variables
    this.canvas = null;
    this.animationRef = null;
    this.letters = [];
    this.grid = { columns: 0, rows: 0 };
    this.context = null;
    this.lastGlitchTime = Date.now();
    
    this.fontSize = 16;
    this.charWidth = 10;
    this.charHeight = 20;
  }

  connectedCallback() {
    // Read attributes and override defaults
    this.parseAttributes();
    
    // Setup lettersAndSymbols array
    this.lettersAndSymbols = Array.from(this.characters);
    
    // Create the component HTML
    this.render();
    
    // Initialize canvas
    this.initializeCanvas();
  }

  disconnectedCallback() {
    if (this.animationRef) {
      cancelAnimationFrame(this.animationRef);
    }
    window.removeEventListener('resize', this.handleResize);
  }

  parseAttributes() {
    // Parse glitch colors
    const colorsAttr = this.getAttribute('glitch-colors');
    if (colorsAttr) {
      try {
        this.glitchColors = JSON.parse(colorsAttr);
      } catch (e) {
        console.warn('Invalid glitch-colors format, using defaults');
      }
    }
    
    // Parse other attributes
    const speed = this.getAttribute('glitch-speed');
    if (speed) this.glitchSpeed = parseInt(speed, 10) || 50;
    
    const centerVignette = this.getAttribute('center-vignette');
    if (centerVignette !== null) this.centerVignette = centerVignette === 'true';
    
    const outerVignette = this.getAttribute('outer-vignette');
    if (outerVignette !== null) this.outerVignette = outerVignette === 'true';
    
    const smooth = this.getAttribute('smooth');
    if (smooth !== null) this.smooth = smooth === 'true';
    
    const characters = this.getAttribute('characters');
    if (characters) this.characters = characters;
  }

  render() {
    this.className = 'w-full h-full';
    this.innerHTML = `
      <canvas class="block w-full h-full"></canvas>
      ${this.outerVignette ? '<div class="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(255,255,255,0)_60%,_rgba(255,255,255,1)_100%)] dark:bg-[radial-gradient(circle,_rgba(0,0,0,0)_60%,_rgba(0,0,0,1)_100%)]"></div>' : ''}
      ${this.centerVignette ? '<div class="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(255,255,255,0.8)_0%,_rgba(255,255,255,0)_60%)] dark:bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]"></div>' : ''}
    `;
  }

  initializeCanvas() {
    this.canvas = this.querySelector('canvas');
    if (!this.canvas) return;
    
    this.context = this.canvas.getContext('2d');
    this.resizeCanvas();
    this.animate();
    
    // Bind resize handler
    this.handleResize = this.debounce(() => {
      cancelAnimationFrame(this.animationRef);
      this.resizeCanvas();
      this.animate();
    }, 100);
    
    window.addEventListener('resize', this.handleResize);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  getRandomChar() {
    return this.lettersAndSymbols[Math.floor(Math.random() * this.lettersAndSymbols.length)];
  }

  getRandomColor() {
    return this.glitchColors[Math.floor(Math.random() * this.glitchColors.length)];
  }

  hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  interpolateColor(start, end, factor) {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  }

  calculateGrid(width, height) {
    const columns = Math.ceil(width / this.charWidth);
    const rows = Math.ceil(height / this.charHeight);
    return { columns, rows };
  }

  initializeLetters(columns, rows) {
    this.grid = { columns, rows };
    const totalLetters = columns * rows;
    this.letters = Array.from({ length: totalLetters }, () => ({
      char: this.getRandomChar(),
      color: this.getRandomColor(),
      targetColor: this.getRandomColor(),
      colorProgress: 1
    }));
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    if (this.context) {
      this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = this.calculateGrid(rect.width, rect.height);
    this.initializeLetters(columns, rows);

    this.drawLetters();
  }

  drawLetters() {
    if (!this.context || this.letters.length === 0) return;
    const ctx = this.context;
    const { width, height } = this.canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${this.fontSize}px monospace`;
    ctx.textBaseline = 'top';

    this.letters.forEach((letter, index) => {
      const x = (index % this.grid.columns) * this.charWidth;
      const y = Math.floor(index / this.grid.columns) * this.charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  }

  updateLetters() {
    if (!this.letters || this.letters.length === 0) return;

    const updateCount = Math.max(1, Math.floor(this.letters.length * 0.05));

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * this.letters.length);
      if (!this.letters[index]) continue;

      this.letters[index].char = this.getRandomChar();
      this.letters[index].targetColor = this.getRandomColor();

      if (!this.smooth) {
        this.letters[index].color = this.letters[index].targetColor;
        this.letters[index].colorProgress = 1;
      } else {
        this.letters[index].colorProgress = 0;
      }
    }
  }

  handleSmoothTransitions() {
    let needsRedraw = false;
    this.letters.forEach(letter => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;

        const startRgb = this.hexToRgb(letter.color);
        const endRgb = this.hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = this.interpolateColor(startRgb, endRgb, letter.colorProgress);
          needsRedraw = true;
        }
      }
    });

    if (needsRedraw) {
      this.drawLetters();
    }
  }

  animate() {
    const now = Date.now();
    if (now - this.lastGlitchTime >= this.glitchSpeed) {
      this.updateLetters();
      this.drawLetters();
      this.lastGlitchTime = now;
    }

    if (this.smooth) {
      this.handleSmoothTransitions();
    }

    this.animationRef = requestAnimationFrame(() => this.animate());
  }

}

// Register the custom element
customElements.define('letter-glitch', LetterGlitch);

export default LetterGlitch;
