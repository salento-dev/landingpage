import './style.css'
import Typed from 'typed.js';

class OctoLogo extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const color = this.getAttribute('color') || 'currentColor';
    const width = this.getAttribute('width') || '24';
    const height = this.getAttribute('height') || '24';

    this.innerHTML = `
      <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" 
        width="${width}" height="${height}" fill="${color}"
        display="inline-block" overflow="visible" style="vertical-align:text-bottom">
        <path d="M12.876.64V.639l8.25 4.763c.541.313.875.89.875 1.515v9.525a1.75 1.75 0 0 1-.875 1.516l-8.25 4.762a1.748 1.748 0 0 1-1.75 0l-8.25-4.763a1.75 1.75 0 0 1-.875-1.515V6.917c0-.625.334-1.202.875-1.515L11.126.64a1.748 1.748 0 0 1 1.75 0Zm-1 1.298L4.251 6.34l7.75 4.474 7.75-4.474-7.625-4.402a.248.248 0 0 0-.25 0Zm.875 19.123 7.625-4.402a.25.25 0 0 0 .125-.216V7.639l-7.75 4.474ZM3.501 7.64v8.803c0 .09.048.172.125.216l7.625 4.402v-8.947Z"></path>
      </svg>
    `;
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

    this.className = 'card';

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

    this.innerHTML = `
        <!-- header -->
        <div class="editor-header">
          <div class="editor-controls">
            <span class="dot red" aria-hidden="true"></span>
            <span class="dot yellow" aria-hidden="true"></span>
            <span class="dot green" aria-hidden="true"></span>
          </div>
          <span class="filename">Edit new file</span>
        </div>

        <!-- body -->
        <div class="editor-content">
          <!-- line numbers gutter -->
          <div class="editor-content-lines">
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
            <span class="typed-code" style="white-space: pre;" aria-label="Animazione di codice che si scrive">
            </span>
          </div>
        </div>
    `;
  }
}
customElements.define('random-editor', RandomEditor);

const typed = new Typed('.typed-code', {
  strings: [
    `console.log('Benvenuto in Salento.dev!');`,
    'const salento = "passione + condivisione";\n\tfunction condividi(idea) {\n \t\treturn idea + " ❤️";\n \t}\n condividi("conoscenza");',
    `// Unisciti a noi e scrivi il futuro!`,
  ],
  typeSpeed: 50,
  backSpeed: 25,
  loop: true,
});