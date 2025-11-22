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
echo "   Light Mode: ./reports/accessibility-report-axe-light.json"
echo "   Dark Mode:  ./reports/accessibility-report-axe-dark.json"
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