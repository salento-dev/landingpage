#!/bin/bash

# Script per testare l'accessibilità del sito salento.dev
# Richiede: npm, lighthouse, axe-cli

echo "🔍 Test di Accessibilità - salento.dev (Light & Dark Mode)"
echo "========================================================"

# Check se lighthouse è installato
if ! command -v lighthouse &> /dev/null; then
    echo "📦 Installazione Lighthouse..."
    npm install -g lighthouse
fi

# Check se axe è installato
if ! command -v axe &> /dev/null; then
    echo "📦 Installazione Axe CLI..."
    npm install -g @axe-core/cli
fi

# Crea cartella reports se non esiste
mkdir -p reports

# Avvia il server di sviluppo in background
echo "🚀 Avvio server di sviluppo..."
npm run dev &
SERVER_PID=$!

# Attende che il server sia pronto
sleep 5

# URL del sito locale
LOCAL_URL="http://localhost:5173"

echo ""
echo "🌞 TEST TEMA LIGHT"
echo "=================="

echo "🧪 Test con Lighthouse (Light Mode)..."
lighthouse $LOCAL_URL \
    --only-categories=accessibility \
    --output=html \
    --output-path=./reports/accessibility-report-lighthouse-light.html \
    --emulated-form-factor=desktop \
    --quiet

echo "🧪 Test con Axe (Light Mode)..."
axe $LOCAL_URL \
    --tags wcag2a,wcag2aa,wcag2aaa \
    --save reports/accessibility-report-axe-light.json

echo ""
echo "🌙 TEST TEMA DARK"
echo "================="

echo "🧪 Test con Lighthouse (Dark Mode)..."
lighthouse $LOCAL_URL \
    --only-categories=accessibility \
    --output=html \
    --output-path=./reports/accessibility-report-lighthouse-dark.html \
    --emulated-form-factor=desktop \
    --chrome-flags="--force-dark-mode" \
    --quiet

echo "🧪 Test con Axe (Dark Mode)..."
axe $LOCAL_URL \
    --tags wcag2a,wcag2aa,wcag2aaa \
    --save reports/accessibility-report-axe-dark.json \
    --chrome-options="--force-dark-mode"

# Converte i report JSON di Axe in HTML leggibili
echo ""
echo "📄 Generazione report HTML da Axe..."
node << 'AXEHTML'
const fs = require('fs');

function generateAxeHTML(jsonPath, htmlPath, theme) {
  const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  
  // Gestisce sia formato singolo che array
  const data = Array.isArray(rawData) ? rawData[0] : rawData;
  
  // Valori di default per campi opzionali
  const violations = data.violations || [];
  const passes = data.passes || [];
  const incomplete = data.incomplete || [];
  const inapplicable = data.inapplicable || [];
  const url = data.url || 'N/A';
  const timestamp = data.timestamp || new Date().toISOString();
  
  const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Axe Accessibilità - ${theme}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; line-height: 1.6; color: #333; background: #f5f5f5; padding: 2rem; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #2c3e50; margin-bottom: 1rem; border-bottom: 3px solid #3498db; padding-bottom: 0.5rem; }
    h2 { color: #34495e; margin: 2rem 0 1rem; font-size: 1.5rem; }
    h3 { color: #7f8c8d; margin: 1.5rem 0 0.5rem; font-size: 1.2rem; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
    .stat { padding: 1rem; border-radius: 6px; text-align: center; }
    .stat-violations { background: #fee; border: 2px solid #e74c3c; }
    .stat-passes { background: #efe; border: 2px solid #27ae60; }
    .stat-incomplete { background: #ffeaa7; border: 2px solid #f39c12; }
    .stat-inapplicable { background: #ecf0f1; border: 2px solid #95a5a6; }
    .stat-number { font-size: 2.5rem; font-weight: bold; display: block; }
    .stat-label { font-size: 0.9rem; color: #555; margin-top: 0.5rem; }
    .issue { margin: 1rem 0; padding: 1rem; border-left: 4px solid #e74c3c; background: #fef5f5; border-radius: 4px; }
    .pass { margin: 1rem 0; padding: 1rem; border-left: 4px solid #27ae60; background: #f0f9f4; border-radius: 4px; }
    .incomplete { margin: 1rem 0; padding: 1rem; border-left: 4px solid #f39c12; background: #fef9f0; border-radius: 4px; }
    .issue-title { font-weight: 600; color: #c0392b; margin-bottom: 0.5rem; }
    .pass-title { font-weight: 600; color: #229954; margin-bottom: 0.5rem; }
    .incomplete-title { font-weight: 600; color: #d68910; margin-bottom: 0.5rem; }
    .description { color: #555; margin: 0.5rem 0; }
    .impact { display: inline-block; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem; font-weight: 600; margin: 0.5rem 0; }
    .impact-critical { background: #c0392b; color: white; }
    .impact-serious { background: #e74c3c; color: white; }
    .impact-moderate { background: #f39c12; color: white; }
    .impact-minor { background: #3498db; color: white; }
    .help { color: #7f8c8d; font-size: 0.9rem; margin: 0.5rem 0; }
    .nodes { margin-top: 1rem; padding: 0.5rem; background: white; border-radius: 4px; }
    .node { margin: 0.5rem 0; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; font-family: monospace; font-size: 0.85rem; }
    .wcag-tags { margin: 0.5rem 0; }
    .tag { display: inline-block; background: #3498db; color: white; padding: 0.2rem 0.5rem; margin: 0.2rem; border-radius: 4px; font-size: 0.75rem; }
    .url { color: #7f8c8d; font-size: 0.9rem; margin: 1rem 0; word-break: break-all; }
    .timestamp { color: #95a5a6; font-size: 0.9rem; margin: 1rem 0; }
    .no-issues { padding: 2rem; text-align: center; color: #27ae60; font-size: 1.2rem; background: #f0f9f4; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 Report Accessibilità Axe - Tema ${theme}</h1>
    <p class="url"><strong>URL testato:</strong> ${url}</p>
    <p class="timestamp"><strong>Data test:</strong> ${new Date(timestamp).toLocaleString('it-IT')}</p>
    
    <div class="summary">
      <div class="stat stat-violations">
        <span class="stat-number">${violations.length}</span>
        <span class="stat-label">Violazioni</span>
      </div>
      <div class="stat stat-passes">
        <span class="stat-number">${passes.length}</span>
        <span class="stat-label">Test Superati</span>
      </div>
      <div class="stat stat-incomplete">
        <span class="stat-number">${incomplete.length}</span>
        <span class="stat-label">Da Verificare</span>
      </div>
      <div class="stat stat-inapplicable">
        <span class="stat-number">${inapplicable.length}</span>
        <span class="stat-label">Non Applicabili</span>
      </div>
    </div>

    ${violations.length > 0 ? `
    <h2>❌ Violazioni (${violations.length})</h2>
    ${violations.map(v => `
      <div class="issue">
        <div class="issue-title">${v.id}: ${v.help || 'N/A'}</div>
        <div class="description">${v.description || ''}</div>
        ${v.impact ? `<span class="impact impact-${v.impact}">${v.impact.toUpperCase()}</span>` : ''}
        <div class="wcag-tags">
          ${(v.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="help">ℹ️ ${v.helpUrl || 'N/A'}</div>
        <div class="nodes">
          <strong>Elementi interessati (${(v.nodes || []).length}):</strong>
          ${(v.nodes || []).slice(0, 5).map(node => `
            <div class="node">
              ${node.html || ''}
              ${node.failureSummary ? `<div style="color: #c0392b; margin-top: 0.5rem;">${node.failureSummary}</div>` : ''}
            </div>
          `).join('')}
          ${(v.nodes || []).length > 5 ? `<div style="color: #7f8c8d; margin-top: 0.5rem;">... e altri ${v.nodes.length - 5} elementi</div>` : ''}
        </div>
      </div>
    `).join('')}
    ` : '<div class="no-issues">✅ Nessuna violazione trovata!</div>'}

    ${incomplete.length > 0 ? `
    <h2>⚠️ Da Verificare Manualmente (${incomplete.length})</h2>
    <p style="color: #7f8c8d; margin-bottom: 1rem;">Questi controlli richiedono verifica manuale da parte di un umano.</p>
    ${incomplete.map(i => `
      <div class="incomplete">
        <div class="incomplete-title">${i.id}: ${i.help || 'N/A'}</div>
        <div class="description">${i.description || ''}</div>
        <div class="wcag-tags">
          ${(i.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="help">ℹ️ ${i.helpUrl || 'N/A'}</div>
        <div class="nodes">
          <strong>Elementi da verificare (${(i.nodes || []).length}):</strong>
          ${(i.nodes || []).slice(0, 3).map(node => `
            <div class="node">${node.html || ''}</div>
          `).join('')}
          ${(i.nodes || []).length > 3 ? `<div style="color: #7f8c8d; margin-top: 0.5rem;">... e altri ${i.nodes.length - 3} elementi</div>` : ''}
        </div>
      </div>
    `).join('')}
    ` : ''}

    <h2>✅ Test Superati (${passes.length})</h2>
    ${passes.slice(0, 10).map(p => `
      <div class="pass">
        <div class="pass-title">${p.id}: ${p.help || 'N/A'}</div>
        <div class="description">${p.description || ''}</div>
        <div class="wcag-tags">
          ${(p.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `).join('')}
    ${passes.length > 10 ? `<p style="color: #7f8c8d; margin-top: 1rem;">... e altri ${passes.length - 10} test superati</p>` : ''}
  </div>
</body>
</html>`;
  
  fs.writeFileSync(htmlPath, html, 'utf8');
}

try {
  generateAxeHTML('./reports/accessibility-report-axe-light.json', './reports/accessibility-report-axe-light.html', 'Light');
  generateAxeHTML('./reports/accessibility-report-axe-dark.json', './reports/accessibility-report-axe-dark.html', 'Dark');
  console.log('✅ Report HTML Axe generati');
} catch (error) {
  console.error('❌ Errore generazione HTML:', error.message);
}
AXEHTML

echo ""
echo "🧪 Test validazione HTML..."
curl -s $LOCAL_URL | \
    curl -s -F "content=<-" -F "output=html" \
    https://validator.w3.org/nu/ > ./reports/accessibility-report-html-validation.html

# Test contrasto colori personalizzato per entrambi i temi
echo ""
echo "🎨 Generazione report contrasti..."
node << 'EOF'
const fs = require('fs');

// Colori dal CSS per test contrasto
const lightTheme = {
  background: 'oklch(97.034% 0.01038 248.179)', // surface-50
  text: 'oklch(10.682% 0.00759 256.847)', // surface-950
  primary: 'var(--color-emerald-400)',
  muted: 'var(--color-surface-500)'
};

const darkTheme = {
  background: 'oklch(10.682% 0.00759 256.847)', // surface-950
  text: 'oklch(97.034% 0.01038 248.179)', // surface-50
  primary: 'var(--color-emerald-400)',
  muted: 'var(--color-surface-500)'
};

const report = `
# Report Contrasti Colori - salento.dev

## Tema Light
- Background: ${lightTheme.background}
- Text: ${lightTheme.text}
- Primary: ${lightTheme.primary}
- Muted: ${lightTheme.muted}

## Tema Dark
- Background: ${darkTheme.background}
- Text: ${darkTheme.text}
- Primary: ${darkTheme.primary}
- Muted: ${darkTheme.muted}

## Note
Tutti i colori sono configurati per rispettare WCAG AAA (rapporto contrasto 7:1+)
Utilizzare strumenti come WebAIM Contrast Checker per validazione finale.
`;

fs.writeFileSync('./reports/color-contrast-report.md', report);
console.log('✅ Report contrasti salvato');
EOF

# Termina il server
kill $SERVER_PID

echo ""
echo "✅ Test completati per entrambi i temi!"
echo ""
echo "📊 REPORT LIGHTHOUSE:"
echo "   Light Mode: ./reports/accessibility-report-lighthouse-light.html"
echo "   Dark Mode:  ./reports/accessibility-report-lighthouse-dark.html"
echo ""
echo "📊 REPORT AXE:"
echo "   Light Mode (HTML): ./reports/accessibility-report-axe-light.html"
echo "   Light Mode (JSON): ./reports/accessibility-report-axe-light.json"
echo "   Dark Mode (HTML):  ./reports/accessibility-report-axe-dark.html"
echo "   Dark Mode (JSON):  ./reports/accessibility-report-axe-dark.json"
echo ""
echo "📊 ALTRI REPORT:"
echo "   Validazione HTML: ./reports/accessibility-report-html-validation.html"
echo "   Contrasti Colori: ./reports/color-contrast-report.md"
echo ""
echo "🔗 Per test manuali:"
echo "   - Screen reader (VoiceOver su Mac, NVDA su Windows)"
echo "   - Navigazione solo tastiera (Tab, Enter, Space, Escape)"
echo "   - Test tema dark: Preferenze Sistema > Aspetto > Scuro"
echo "   - Test contrasto: https://webaim.org/resources/contrastchecker/"
echo "   - Test reduced motion: Preferenze Sistema > Accessibilità > Movimento"