import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Resvg } from '@resvg/resvg-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.resolve(__dirname, '../public');

const icons = [
  {
    svg: 'pwa-192x192.svg',
    png: 'pwa-192x192.png',
    width: 192,
    height: 192,
  },
  {
    svg: 'pwa-512x512.svg',
    png: 'pwa-512x512.png',
    width: 512,
    height: 512,
  },
  {
    svg: 'pwa-maskable-512x512.svg',
    png: 'pwa-maskable-512x512.png',
    width: 512,
    height: 512,
  },
  {
    svg: 'pwa-192x192.svg',
    png: 'apple-touch-icon.png',
    width: 180,
    height: 180,
  },
];

console.log('🎨 Generating PWA PNG icons from SVGs...');

for (const icon of icons) {
  const svgPath = path.join(publicDir, icon.svg);
  const pngPath = path.join(publicDir, icon.png);

  if (!fs.existsSync(svgPath)) {
    console.warn(`⚠️ Warning: SVG source not found: ${svgPath}`);
    continue;
  }

  const svgContent = fs.readFileSync(svgPath, 'utf8');

  const resvg = new Resvg(svgContent, {
    fitTo: {
      mode: 'width',
      value: icon.width,
    },
    shapeRendering: 2,
    textRendering: 1,
    imageRendering: 0,
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  fs.writeFileSync(pngPath, pngBuffer);
  console.log(`✅ Generated ${icon.png} (${icon.width}x${icon.height}, ${(pngBuffer.length / 1024).toFixed(1)} KB)`);
}

console.log('🎉 PWA icon generation complete!');
