// Copia la web app (cartella principale del repository) in native/www per Capacitor.
// I dati (data/*.json) vengono copiati come riserva per la prima apertura senza rete:
// a regime l'app li scarica freschi da GitHub Pages (vedi assets/native.js).
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.resolve(__dirname, '..', 'www');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const copy = (rel) => {
  const src = path.join(ROOT, rel), dst = path.join(OUT, rel);
  if (!fs.existsSync(src)) return;
  if (fs.statSync(src).isDirectory()) fs.cpSync(src, dst, { recursive: true });
  else { fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst); }
};
['index.html', 'manifest.webmanifest', 'privacy.html', 'support.html', 'assets', 'data'].forEach(copy);
// nell'app nativa niente service worker (ci pensa il telefono) e il ponte nativo si carica per primo
let html = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
html = html.replace('<script src="assets/config.js', '<script src="assets/native.js"></script>\n<script src="assets/config.js');
fs.writeFileSync(path.join(OUT, 'index.html'), html);
console.log('www pronta:', OUT);
