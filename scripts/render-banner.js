// One-off: rasterize assets/banner.svg -> assets/banner.png (vsce forbids SVG in README).
// Edit banner.svg, then regenerate the PNG with:
//   npm install --no-save @resvg/resvg-js && node scripts/render-banner.js
const fs = require('fs');
const path = require('path');
const { Resvg } = require('@resvg/resvg-js');

const assets = path.resolve(__dirname, '..', 'assets');
const svg = fs.readFileSync(path.join(assets, 'banner.svg'));
const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 2560 } });
const png = resvg.render().asPng();
fs.writeFileSync(path.join(assets, 'banner.png'), png);
console.log('Wrote assets/banner.png (' + png.length + ' bytes)');
