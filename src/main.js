import './style.css'
import Typed from 'typed.js';

class OctoLogo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const iconUrl = this.getAttribute('icon') || '/assets/icons/octo.svg';

    this.innerHTML = `<div class="h-16 w-16 bg-primary-gradient" style="--svg: url('${iconUrl}'); -webkit-mask: var(--svg); mask: var(--svg);"></div>`;
  }
}
customElements.define('octo-logo', OctoLogo);

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

const typed = new Typed('#typed-code', {
  strings: [
    `console.log('Benvenuto in Salento.dev!');`,
    'const salento = "passione + condivisione";\n\tfunction condividi(idea) {\n \t\treturn idea + " ❤️";\n \t}\n condividi("conoscenza");',
    `// Unisciti a noi e scrivi il futuro!`,
  ],
  typeSpeed: prefersReducedMotion ? 0 : 50,
  backSpeed: prefersReducedMotion ? 0 : 25,
  loop: !prefersReducedMotion,
  showCursor: !prefersReducedMotion,
  onComplete: function(self) {
    if (prefersReducedMotion) {
      // Se l'utente preferisce ridurre le animazioni, mostra solo l'ultimo messaggio
      self.el.innerHTML = `// Unisciti a noi e scrivi il futuro!`;
    }
  }
});