import './style.css'
import './js/letter-glitch';
import './js/decripted-text';

class PIcon extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const iconUrl = this.getAttribute('icon') || '/assets/icons/octo.svg';

    this.innerHTML = `<div class="h-16 w-16 bg-primary-gradient" style="--svg: url('${iconUrl}'); -webkit-mask: var(--svg); mask: var(--svg);"></div>`;
  }
}
customElements.define('primary-icon', PIcon);

class SIcon extends HTMLElement {
  constructor() {
    super();
  }

  async connectedCallback() {
    const iconUrl = this.getAttribute('icon') || '/assets/icons/octo.svg';

    try {
      const response = await fetch(iconUrl);
      const svgText = await response.text();
      this.innerHTML = svgText;
    } catch (error) {
      console.warn(`Failed to load icon: ${iconUrl}`, error);
      this.innerHTML = '<span style="width: 1em; height: 1em; background: currentColor;"></span>';
    }
  }
}
customElements.define('s-icon', SIcon);

class FeatureCard extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    // Ottieni i dati dagli attributi
    const iconSlot = this.querySelector('[slot="icon"]')?.outerHTML || '';
    const title = this.getAttribute('title') || this.querySelector('[slot="title"]')?.textContent || '';
    const description = this.getAttribute('description') || this.querySelector('[slot="description"]')?.textContent || '';
    const role = this.getAttribute('role') || '';

    this.className = 'card';
    if (role) {
      this.setAttribute('role', role);
    }

    // Renderizza il componente senza shadow DOM
    this.innerHTML = `
      ${iconSlot}
      <h3 class="card-title">
        ${title}
      </h3>
      <p class="card-description">
        ${description}
      </p>
    `;
  }
}
customElements.define('feature-card', FeatureCard);

class ColorCard extends HTMLElement {

  constructor() {
    super();
  }

  connectedCallback() {
    // Ottieni i dati dagli attributi
    const icon = this.getAttribute('icon') || this.querySelector('[slot="icon"]')?.outerHTML || '';
    const title = this.getAttribute('title') || this.querySelector('[slot="title"]')?.textContent || '';
    const description = this.getAttribute('description') || this.querySelector('[slot="description"]')?.textContent || '';

    const color = this.getAttribute('color') || 'blue';

    const colors = {
      blue: { gradient: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 hover:from-blue-500/15 hover:to-blue-600/10', icon: 'text-blue-400', iconBg: 'bg-blue-500/20', title: 'text-blue-500' },
      purple: { gradient: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 hover:from-purple-500/15 hover:to-purple-600/10', icon: 'text-purple-400', iconBg: 'bg-purple-500/20', title: 'text-purple-500' },
      emerald: { gradient: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 hover:from-emerald-500/15 hover:to-emerald-600/10', icon: 'text-emerald-400', iconBg: 'bg-emerald-500/20', title: 'text-emerald-500' },
      orange: { gradient: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 hover:from-orange-500/15 hover:to-orange-600/10', icon: 'text-orange-400', iconBg: 'bg-orange-500/20', title: 'text-orange-500' },
      cyan: { gradient: 'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 hover:from-cyan-500/15 hover:to-cyan-600/10', icon: 'text-cyan-400', iconBg: 'bg-cyan-500/20', title: 'text-cyan-500' },
      red: { gradient: 'from-red-500/10 to-red-600/5 border-red-500/20 hover:from-red-500/15 hover:to-red-600/10', icon: 'text-red-400', iconBg: 'bg-red-500/20', title: 'text-red-500' },
      yellow: { gradient: 'from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 hover:from-yellow-500/15 hover:to-yellow-600/10', icon: 'text-yellow-400', iconBg: 'bg-yellow-500/20', title: 'text-yellow-500' },
      indigo: { gradient: 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 hover:from-indigo-500/15 hover:to-indigo-600/10', icon: 'text-indigo-400', iconBg: 'bg-indigo-500/20', title: 'text-indigo-500' },
      pink: { gradient: 'from-pink-500/10 to-pink-600/5 border-pink-500/20 hover:from-pink-500/15 hover:to-pink-600/10', icon: 'text-pink-400', iconBg: 'bg-pink-500/20', title: 'text-pink-500' },
    }

    this.className = `group relative p-6 bg-gradient-to-br ${colors[color].gradient} backdrop-blur-sm border rounded-xl transition-all duration-300`;

    // Renderizza il componente senza shadow DOM
    this.innerHTML = `
      <div class="flex items-center gap-3 mb-3">
        <div class="w-8 h-8 rounded-lg ${colors[color].iconBg} flex items-center justify-center">
          <span class="${colors[color].icon} text-sm font-bold">
            ${icon}
          </span>
        </div>
        <h5 class="font-semibold ${colors[color].title}">
          ${title}
        </h5>
      </div>
      <p class="text-sm text-muted">
        ${description}
      </p>
    `;
  }
}
customElements.define('color-card', ColorCard);

class UserCard extends HTMLElement {
  connectedCallback() {
    const user_name = this.getAttribute('user-name') || '';
    const user_github = this.getAttribute('user-github') || '';
    const user_role = this.getAttribute('user-role') || '';

    this.innerHTML = `
      <div class="group relative card">
        <div class="flex flex-col items-center text-center">
          <div
            class="w-16 h-16 rounded-full overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300 ring-2 ring-primary/20 group-hover:ring-primary/40">
            <img src="https://github.com/${user_github}.png?size=128" alt="${user_name}"
              class="w-full h-full object-cover" loading="lazy"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
            <div class="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center"
              style="display: none;">
              <span class="text-white font-bold text-xl">AM</span>
            </div>
          </div>
          <h6 class="font-semibold mb-1">${user_name}</h6>
          <p class="text-xs text-muted/80">${user_role}</p>
          <a href="https://github.com/${user_github}" target="_blank" rel="noopener noreferrer" class="text-xs text-primary hover:text-primary transition-colors">
            @${user_github}
          </a>
        </div>
      </div>
    `;
  }
}
customElements.define('user-card', UserCard);

class RandomEditor extends HTMLElement {
  connectedCallback() {

    this.className = 'editor';
    this.setAttribute('role', 'application');
    this.setAttribute('aria-label', 'Simulatore editor di codice');

    this.innerHTML = `
        <!-- header -->
        <div class="editor-header">
          <div class="editor-controls">
            <span class="dot red" aria-hidden="true"></span>
            <span class="dot yellow" aria-hidden="true"></span>
            <span class="dot green" aria-hidden="true"></span>
          </div>
          <span class="filename" aria-hidden="true">Edit new file</span>
        </div>

        <!-- body -->
        <div class="editor-content">
          <!-- line numbers gutter -->
          <div class="editor-content-lines" aria-hidden="true">
            <div>1</div>
            <div>2</div>
            <div>3</div>
            <div>4</div>
            <div>5</div>
            <div>6</div>
            <div>7</div>
            <div>8</div>
          </div>

          <!-- code area -->
          <div class="editor-content-text">
            <span id="typed-code" style="white-space: pre;" 
                  aria-live="polite">
            </span>
          </div>
        </div>
    `;
  }
}
customElements.define('random-editor', RandomEditor);

// Verifica prefers-reduced-motion prima di inizializzare l'animazione
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


// Letter Glitch Scroll Fade Effect
function setupLetterGlitchScrollFade() {
  const letterGlitchElement = document.querySelector('letter-glitch');
  if (!letterGlitchElement) return;

  // Store the initial opacity from CSS once
  const computedStyle = window.getComputedStyle(letterGlitchElement);
  const initialOpacity = parseFloat(computedStyle.getPropertyValue('opacity')) || 1;

  function updateScrollFade() {
    // Get current scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    
    if (scrollTop === 0) {
      // At top of page, use CSS-defined opacity
      letterGlitchElement.style.opacity = '';
    } else if (scrollTop < viewportHeight) {
      // Fade during first 100vh: from initial opacity to 50% of initial opacity
      const fadeProgress = scrollTop / viewportHeight;
      const reductionAmount = initialOpacity * 0.5;
      const opacity = initialOpacity - (fadeProgress * reductionAmount);
      letterGlitchElement.style.opacity = opacity.toString();
    } else {
      // After 100vh, maintain the 50% reduced opacity (always based on initial value)
      const reducedOpacity = initialOpacity * 0.5;
      letterGlitchElement.style.opacity = reducedOpacity.toString();
    }
  }

  // Debounce function for performance
  function debounce(func, wait) {
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

  // Setup scroll listener with debouncing
  const debouncedUpdateScrollFade = debounce(updateScrollFade, 16); // ~60fps
  window.addEventListener('scroll', debouncedUpdateScrollFade);

  // Set initial opacity
  updateScrollFade();
}

// Initialize scroll fade effect when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLetterGlitchScrollFade);
} else {
  setupLetterGlitchScrollFade();
}