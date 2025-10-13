import './style.css'

import Typed from 'typed.js';


new Typed('.typed-code', {
  strings: [
    `console.log('Benvenuto in Salento.dev!');`,
    'const salento = "passione + condivisione";\n\tfunction condividi(idea) {\n \t\treturn idea + " ❤️";\n \t}\n condividi("conoscenza");',
    `// Unisciti a noi e scrivi il futuro!`,
  ],
  typeSpeed: 50,
  backSpeed: 25,
  loop: true,
});