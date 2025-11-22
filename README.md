# Landing Page Salento.dev

Landing page ufficiale della community [salento.dev](https://salento.dev) - il punto di ritrovo per developer, tech enthusiast e innovatori del Salento.

## Stack Tecnologico

- **[Vite](https://vitejs.dev/)** - Build tool e dev server ultra-veloce
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework CSS con theming CSS-first
- **[Typed.js](https://mattboldt.com/demos/typed-js/)** - Animazioni di digitazione
- **Custom Web Components** - Componenti riutilizzabili senza framework

## Architettura

Questo progetto utilizza un'architettura **src-root non standard** dove `src/` funge da root del progetto:

```text
src/                    # Root del progetto (vite root)
├── index.html         # Entry point HTML
├── main.js           # Web components + setup
├── style.css         # Tailwind v4 con @theme
├── js/               # Moduli JavaScript custom
└── public/           # Asset statici (favicon, manifest, etc.)
```

### Caratteristiche Principali

- ✅ **Tailwind v4** con theming via `@theme {}` invece di config file
- ✅ **PWA Ready** con manifest completo e asset ottimizzati
- ✅ **SEO Ottimizzato** per contenuti italiani con meta tag completi
- ✅ **Accessibilità** con report automatici (axe-core + Lighthouse)
- ✅ **Deploy automatico** su GitHub Pages dal branch `feature/vite`

## 🛠️ Sviluppo Locale

### Prerequisiti

- Node.js 18+ e npm

### Installazione

```bash
# Clona il repository
git clone https://github.com/salento-dev/landingpage.git
cd landingpage

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Il sito sarà disponibile su `http://localhost:5173`

### Comandi Disponibili

```bash
npm run dev          # Server di sviluppo (porta 5173)
npm run build        # Build di produzione in ../dist
npm run preview      # Anteprima build di produzione
./test-accessibility.sh  # Test di accessibilità (axe-core + Lighthouse)
```

### Test di Accessibilità

Il progetto include test automatici di accessibilità tramite lo script `test-accessibility.sh`:

```bash
# Esegui i test di accessibilità
./test-accessibility.sh
```

Lo script genera report dettagliati in `reports/`:

- **axe-core reports** (`accessibility-report-axe-*.html/json`) - Analisi WCAG con axe-core
- **Lighthouse reports** (`accessibility-report-lighthouse-*.html`) - Audit completi di performance e accessibilità
- **HTML Validation** (`accessibility-report-html-validation.html`) - Validazione W3C
- **Color Contrast** (`color-contrast-report.md`) - Verifica contrasti colore

> **Tip**: Esegui i test prima di ogni PR per garantire che il sito mantenga alti standard di accessibilità.

## Contribuire

Siamo felici di ricevere contributi dalla community!

### Come Contribuire

1. **Fork** il repository
2. Crea un **branch** per le tue modifiche:

   ```bash
   git checkout -b feature/nome-feature
   ```

3. Implementa le modifiche seguendo le convenzioni del progetto
4. Testa localmente con `npm run dev`
5. **Verifica l'accessibilità** con `./test-accessibility.sh` e controlla i report generati
6. Apri una **Pull Request** verso il branch `main`
   - Il template della PR ti guiderà nella compilazione delle informazioni necessarie

### Linee Guida

- **Stile**: Utilizza le utility class di Tailwind CSS v4
- **Componenti**: I custom web components usano light DOM (no shadow DOM)
- **Asset**: Aggiungi nuovi asset in `src/public/`
- **SEO**: Aggiorna i meta tag in `index.html` se necessario
- **PR Template**: Quando apri una PR, usa il template per fornire tutte le informazioni necessarie

> **Nota**: Solo il team **admins** può approvare e fare merge delle PR sul branch `main`.

## Deploy

Il deploy avviene automaticamente su GitHub Pages tramite GitHub Actions quando si effettua push sul branch `main`.

Il workflow di deploy:

1. Esegue il build con Vite
2. Copia gli asset da `dist/` alla root di GitHub Pages
3. Pubblica il sito su `https://salento.dev`

## Licenza

[MIT License](LICENSE)

---

Made with ❤️ by the salento.dev community
