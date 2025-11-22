# Copilot Instructions for salento.dev Landing Page

## Architecture Overview

This is a **single-page community landing site** for salento.dev, built with Vite + Tailwind CSS v4. The project uses a **non-standard src-root architecture** where `src/` serves as the project root (`vite.config.ts` sets `root: "src"`).

### Key Architectural Decisions
- **Tailwind v4**: Uses `@theme {}` blocks in CSS instead of config files for theming
- **Custom Web Components**: No shadow DOM by design - components render directly to light DOM
- **Asset Pipeline**: Public assets live in `src/public/` and copy to `dist/` root during build
- **Italian-first**: All content, meta tags, and SEO optimized for Italian language/region

## Critical File Structure
```
src/                    # Project root (not typical!)
├── index.html         # Main HTML (moved from project root)
├── main.js           # Web components + Typed.js setup
├── style.css         # Tailwind v4 with @theme customization
└── public/           # Static assets (favicon, manifest, etc.)
```

## Development Patterns

### Custom Web Components
Components avoid shadow DOM and render to light DOM for Tailwind integration:
```javascript
// Pattern: Use attributes for data, innerHTML for rendering
class FeatureCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title');
    this.innerHTML = `<div class="card">...</div>`;
  }
}
```

### Tailwind v4 Theming
Colors defined in CSS using CSS custom properties:
```css
@theme {
  --color-primary-300: var(--color-emerald-300);
  --color-surface-950: oklch(8.236% 0.012 248.179);
}
```

### Asset Generation
Use provided scripts for generating PWA assets:
- `generate-assets.mjs` - Sharp-based generation
- `generate-pwa-assets.sh` - Complete PWA asset pipeline
- See `ASSET-GENERATION.md` for detailed workflow

## Essential Commands
```bash
npm run dev          # Development server (port 5173/5174)
npm run build        # Production build to ../dist
npm run preview      # Preview production build

# Asset generation (when needed)
node generate-assets.mjs
./generate-pwa-assets.sh
```

## SEO & Meta Configuration
- **Comprehensive meta tags**: OG, Twitter, structured data in `index.html`
- **PWA ready**: Complete manifest, icons, service worker compatible
- **Italian localization**: `lang="it"`, locale-specific meta tags
- **Performance optimized**: Preconnects, optimized loading

## GitHub Pages Deployment
- Deploys from `feature/vite` branch (not main!)
- Build artifacts go to `dist/` which gets deployed
- Workflow in `.github/workflows/deploy.yml`

## When Making Changes
1. **Style changes**: Edit `src/style.css` @theme blocks, not config files
2. **Components**: Avoid shadow DOM, use light DOM + Tailwind classes
3. **Assets**: Add to `src/public/`, they'll copy to root during build
4. **SEO**: Update structured data in `index.html` head section
5. **Icons/PWA**: Use asset generation scripts rather than manual creation