class DecryptedText extends HTMLElement {
  constructor() {
    super();
    
    // Default values
    this.text = '';
    this.speed = 50;
    this.maxIterations = 10;
    this.sequential = false;
    this.revealDirection = 'start';
    this.useOriginalCharsOnly = false;
    this.characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';
    this.customClassName = '';
    this.parentClassName = '';
    this.encryptedClassName = '';
    this.animateOn = 'hover';
    
    // State variables
    this.displayText = '';
    this.isHovering = false;
    this.isScrambling = false;
    this.revealedIndices = new Set();
    this.hasAnimated = false;
    
    // Instance variables
    this.interval = null;
    this.observer = null;
    this.currentIteration = 0;
  }

  connectedCallback() {
    // Parse attributes
    this.parseAttributes();
    
    // Initialize display text
    this.displayText = this.text;
    
    // Render component
    this.render();
    
    // Setup intersection observer if needed
    this.setupIntersectionObserver();
    
    // Setup hover events if needed
    this.setupHoverEvents();
  }

  disconnectedCallback() {
    // Cleanup
    if (this.interval) {
      clearInterval(this.interval);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  parseAttributes() {
    // Parse text content
    this.text = this.getAttribute('text') || this.textContent || '';
    
    // Parse numeric attributes
    const speed = this.getAttribute('speed');
    if (speed) this.speed = parseInt(speed, 10) || 50;
    
    const maxIterations = this.getAttribute('max-iterations');
    if (maxIterations) this.maxIterations = parseInt(maxIterations, 10) || 10;
    
    // Parse boolean attributes
    const sequential = this.getAttribute('sequential');
    if (sequential !== null) this.sequential = sequential === 'true';
    
    const useOriginalCharsOnly = this.getAttribute('use-original-chars-only');
    if (useOriginalCharsOnly !== null) this.useOriginalCharsOnly = useOriginalCharsOnly === 'true';
    
    // Parse string attributes
    const revealDirection = this.getAttribute('reveal-direction');
    if (revealDirection) this.revealDirection = revealDirection;
    
    const characters = this.getAttribute('characters');
    if (characters) this.characters = characters;
    
    const customClassName = this.getAttribute('class-name');
    if (customClassName) this.customClassName = customClassName;
    
    const parentClassName = this.getAttribute('parent-class-name');
    if (parentClassName) this.parentClassName = parentClassName;
    
    const encryptedClassName = this.getAttribute('encrypted-class-name');
    if (encryptedClassName) this.encryptedClassName = encryptedClassName;
    
    const animateOn = this.getAttribute('animate-on');
    if (animateOn) this.animateOn = animateOn;
  }

  render() {
    this.className = `inline-block ${this.parentClassName}`;
    this.innerHTML = `
      <span class="sr-only">${this.displayText}</span>
      <span aria-hidden="true" class="decrypt-text-content">
        ${this.renderCharacters()}
      </span>
    `;
  }

  renderCharacters() {
    return this.displayText.split('').map((char, index) => {
      const isRevealedOrDone = this.revealedIndices.has(index) || !this.isScrambling || !this.isHovering;
      const className = isRevealedOrDone ? this.customClassName : this.encryptedClassName;
      return `<span class="${className}">${char}</span>`;
    }).join('');
  }

  updateDisplay() {
    const contentSpan = this.querySelector('.decrypt-text-content');
    const srSpan = this.querySelector('.sr-only');
    if (contentSpan && srSpan) {
      contentSpan.innerHTML = this.renderCharacters();
      srSpan.textContent = this.displayText;
    }
  }

  setupHoverEvents() {
    if (this.animateOn === 'hover' || this.animateOn === 'both') {
      this.addEventListener('mouseenter', () => this.setIsHovering(true));
      this.addEventListener('mouseleave', () => this.setIsHovering(false));
    }
  }

  setupIntersectionObserver() {
    if (this.animateOn !== 'view' && this.animateOn !== 'both') return;

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.setIsHovering(true);
          this.hasAnimated = true;
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver(observerCallback, observerOptions);
    this.observer.observe(this);
  }

  setIsHovering(hovering) {
    this.isHovering = hovering;
    this.startAnimation();
  }

  startAnimation() {
    // Clear any existing interval
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    this.currentIteration = 0;

    if (this.isHovering) {
      this.isScrambling = true;
      this.interval = setInterval(() => {
        if (this.sequential) {
          if (this.revealedIndices.size < this.text.length) {
            const nextIndex = this.getNextIndex(this.revealedIndices);
            this.revealedIndices.add(nextIndex);
            this.displayText = this.shuffleText(this.text, this.revealedIndices);
            this.updateDisplay();
          } else {
            clearInterval(this.interval);
            this.isScrambling = false;
          }
        } else {
          this.displayText = this.shuffleText(this.text, this.revealedIndices);
          this.updateDisplay();
          this.currentIteration++;
          if (this.currentIteration >= this.maxIterations) {
            clearInterval(this.interval);
            this.isScrambling = false;
            this.displayText = this.text;
            this.updateDisplay();
          }
        }
      }, this.speed);
    } else {
      this.displayText = this.text;
      this.revealedIndices = new Set();
      this.isScrambling = false;
      this.updateDisplay();
    }
  }

  getNextIndex(revealedSet) {
    const textLength = this.text.length;
    switch (this.revealDirection) {
      case 'start':
        return revealedSet.size;
      case 'end':
        return textLength - 1 - revealedSet.size;
      case 'center': {
        const middle = Math.floor(textLength / 2);
        const offset = Math.floor(revealedSet.size / 2);
        const nextIndex = revealedSet.size % 2 === 0 ? middle + offset : middle - offset - 1;

        if (nextIndex >= 0 && nextIndex < textLength && !revealedSet.has(nextIndex)) {
          return nextIndex;
        }
        for (let i = 0; i < textLength; i++) {
          if (!revealedSet.has(i)) return i;
        }
        return 0;
      }
      default:
        return revealedSet.size;
    }
  }

  shuffleText(originalText, currentRevealed) {
    const availableChars = this.useOriginalCharsOnly
      ? Array.from(new Set(originalText.split(''))).filter(char => char !== ' ')
      : this.characters.split('');

    if (this.useOriginalCharsOnly) {
      const positions = originalText.split('').map((char, i) => ({
        char,
        isSpace: char === ' ',
        index: i,
        isRevealed: currentRevealed.has(i)
      }));

      const nonSpaceChars = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);

      for (let i = nonSpaceChars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nonSpaceChars[i], nonSpaceChars[j]] = [nonSpaceChars[j], nonSpaceChars[i]];
      }

      let charIndex = 0;
      return positions
        .map(p => {
          if (p.isSpace) return ' ';
          if (p.isRevealed) return originalText[p.index];
          return nonSpaceChars[charIndex++];
        })
        .join('');
    } else {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    }
  }
}

// Register the custom element
customElements.define('decrypted-text', DecryptedText);

export default DecryptedText;
