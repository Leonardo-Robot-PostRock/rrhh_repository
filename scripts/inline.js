const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const examplesHtml = path.join(root, 'examples', 'index.html');
const distDir = path.join(root, 'dist');
const outHtml = path.join(distDir, 'bundle.html');
const cssFile = path.join(distDir, 'styles.css');
const jsFile = path.join(distDir, 'bundle.js');
const configFile = path.join(root, 'config', 'email.json');

if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

let html = fs.readFileSync(examplesHtml, 'utf8');
let css = '';
let js = '';

if (fs.existsSync(cssFile)) css = fs.readFileSync(cssFile, 'utf8');
if (fs.existsSync(jsFile)) js = fs.readFileSync(jsFile, 'utf8');

// Ensure Tailwind CDN script is present (so utility classes render at runtime)
if (!/https:\/\/cdn.tailwindcss.com/.test(html)) {
  html = html.replace(/<\/head>/i, '  <script src="https://cdn.tailwindcss.com"></script>\n</head>');
}

// Inject recipient meta if config present
try {
  if (fs.existsSync(configFile)) {
    const cfg = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    if (cfg && cfg.recipient) {
      const meta = `  <meta name="recipient-email" content="${cfg.recipient}">\n`;
      html = html.replace(/<head[^>]*>/i, (m) => `${m}\n${meta}`);
    }
  }
} catch (e) {
  // ignore config read errors
}

// Inline CSS: replace link to ../dist/styles.css or styles.css with inline <style>
html = html.replace(/<link[^>]*href="[^"]*styles\.css"[^>]*>\s*/i, () => {
  if (css) return `<style>\n${css}\n</style>`;
  return '';
});

// Inline JS: replace script src to ../dist/bundle.js with inline script
html = html.replace(/<script[^>]*src="[^"]*bundle\.js"[^>]*>\s*<\/script>/i, () => {
  if (js) return `<script>\n${js}\n</script>`;
  return '';
});

fs.writeFileSync(outHtml, html, 'utf8');
console.log('Wrote', outHtml);
