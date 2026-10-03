// アプリアイコンと起動画面（スプラッシュ）の画像を作るスクリプト。
// 使い方: node tools/make-assets.js   （playwright が必要。画像はリポジトリに入っているので、変えたいときだけ実行）
const fs = require('fs'), path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const root = path.join(__dirname, '..'), icons = path.join(root, 'icons');

const sparkle = (x, y, r, fill = '#fff', op = 1) =>
  `<path transform="translate(${x} ${y}) scale(${r / 8})" d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="${fill}" opacity="${op}"/>`;

// キャラクターの顔（index.html と同じ座標系。頭の中心が (200,235)）
const girl =
  `<path d="M200 112 C108 112 86 190 90 270 C92 340 76 420 96 478 Q200 500 304 478 C324 420 308 340 310 270 C314 190 292 112 200 112 Z" fill="url(#hg)" stroke="#e0558f" stroke-width="3.5" stroke-linejoin="round"/>` +
  `<path d="M104 500 Q108 372 200 352 Q292 372 296 500 Z" fill="#fff" stroke="#f0c8da" stroke-width="3.5"/>` +
  `<path d="M168 352 Q200 384 232 352" fill="none" stroke="#ffb3d4" stroke-width="7" stroke-linecap="round"/>` +
  `<rect x="183" y="305" width="34" height="56" rx="14" fill="#ffe1cf"/>` +
  `<circle cx="111" cy="252" r="15" fill="#ffe1cf" stroke="#f0b9a3" stroke-width="2"/><circle cx="289" cy="252" r="15" fill="#ffe1cf" stroke="#f0b9a3" stroke-width="2"/>` +
  `<ellipse cx="200" cy="235" rx="91" ry="86" fill="#ffe1cf" stroke="#f0b9a3" stroke-width="2.5"/>` +
  `<path d="M143 218 Q160 209 177 218 M223 218 Q240 209 257 218" stroke="#8a5a52" stroke-width="4" fill="none" stroke-linecap="round"/>` +
  `<ellipse cx="160" cy="247" rx="14" ry="19" fill="#3d2a30"/><ellipse cx="240" cy="247" rx="14" ry="19" fill="#3d2a30"/>` +
  `<circle cx="155" cy="239" r="6.5" fill="#fff"/><circle cx="166" cy="255" r="3.2" fill="#fff"/><circle cx="235" cy="239" r="6.5" fill="#fff"/><circle cx="246" cy="255" r="3.2" fill="#fff"/>` +
  `<ellipse cx="133" cy="280" rx="16" ry="10" fill="#ff8fa6" opacity=".55"/><ellipse cx="267" cy="280" rx="16" ry="10" fill="#ff8fa6" opacity=".55"/>` +
  `<path d="M184 284 Q200 308 216 284 Z" fill="#b63a5c" stroke="#b63a5c" stroke-width="3" stroke-linejoin="round"/><ellipse cx="200" cy="296" rx="8" ry="4.5" fill="#ff8fa3"/>` +
  `<path d="M104 238 C92 138 148 114 200 114 C252 114 308 138 296 238 C282 202 258 180 220 172 C196 196 150 210 104 238 Z" fill="url(#hg)" stroke="#e0558f" stroke-width="3.5" stroke-linejoin="round"/>` +
  `<path d="M140 146 Q168 130 204 132" stroke="#fff" stroke-opacity=".55" stroke-width="9" fill="none" stroke-linecap="round"/>` +
  `<path d="M118 192 Q200 128 282 192" stroke="#d9a41e" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M118 192 Q200 128 282 192" stroke="#ffd84d" stroke-width="9" fill="none" stroke-linecap="round"/>` +
  `<path d="M160 164 L166 128 L182 148 L200 118 L218 148 L234 128 L240 164 Z" fill="#ffd84d" stroke="#d9a41e" stroke-width="3" stroke-linejoin="round"/>` +
  `<circle cx="200" cy="146" r="7" fill="#ff6fa8" stroke="#d63b6c" stroke-width="2"/><circle cx="166" cy="128" r="4.5" fill="#8fe8ff"/><circle cx="200" cy="118" r="4.5" fill="#8fe8ff"/><circle cx="234" cy="128" r="4.5" fill="#8fe8ff"/>`;

const iconSvg = scale => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe0ef"/><stop offset="1" stop-color="#ffa9d1"/></linearGradient>
<linearGradient id="hg" x1="0" y1="100" x2="0" y2="480" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#ffb3d4"/><stop offset="1" stop-color="#ff7eb6"/></linearGradient></defs>
<rect width="512" height="512" fill="url(#bg)"/>
${sparkle(70, 80, 26, '#fff')}${sparkle(444, 64, 20, '#ffd84d')}${sparkle(452, 250, 14, '#fff')}${sparkle(52, 300, 16, '#ffd84d')}${sparkle(420, 150, 12, '#fff', .8)}
<g transform="translate(256 292) scale(${scale}) translate(-200 -235)">${girl}</g></svg>`;

const splashHtml = (w, h, svg) => `<!doctype html><meta charset="utf-8"><style>
html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden;background:linear-gradient(160deg,#ffe3f1 0%,#ffc6e0 55%,#e6d6ff 100%)}
.i{position:absolute;left:50%;top:46%;width:${Math.round(Math.min(w, h) * .4)}px;height:${Math.round(Math.min(w, h) * .4)}px;transform:translate(-50%,-50%);border-radius:22%;overflow:hidden;box-shadow:0 18px 50px rgba(200,60,130,.35)}
.i svg{width:100%;height:100%;display:block}.s{position:absolute;inset:0}</style>
<svg class="s" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${[[.12, .14, 40], [.86, .1, 30], [.9, .42, 22], [.08, .5, 26], [.2, .82, 34], [.8, .8, 44], [.5, .1, 20], [.62, .9, 22], [.35, .92, 16], [.7, .26, 18]].map(([x, y, r], i) => sparkle(x * w, y * h, r * Math.min(w, h) / 600 * 1.3, i % 2 ? '#ffd84d' : '#fff')).join('')}</svg>
<div class="i">${svg}</div>`;

(async () => {
  fs.writeFileSync(path.join(icons, 'icon.svg'), iconSvg(1.5));
  fs.writeFileSync(path.join(icons, 'icon-maskable.svg'), iconSvg(1.2));   // 端が丸く切られても顔が欠けない余白つき
  const b = await chromium.launch(), pg = await b.newPage();
  const render = async (svg, n, file) => {
    await pg.setViewportSize({ width: n, height: n });
    await pg.setContent(`<body style="margin:0"><div style="width:${n}px;height:${n}px">${svg.replace('<svg ', `<svg width="${n}" height="${n}" `)}</div>`);
    await pg.screenshot({ path: path.join(icons, file) });
  };
  for (const n of [180, 192, 512]) await render(iconSvg(1.5), n, `icon-${n}.png`);
  await render(iconSvg(1.2), 512, 'icon-maskable-512.png');
  // iPad 起動画面（縦・横）
  const ipads = [[1024, 1366], [834, 1194], [834, 1112], [820, 1180], [810, 1080], [744, 1133], [768, 1024]];
  for (const [w, h] of ipads) for (const [pw, ph, tag] of [[w, h, 'p'], [h, w, 'l']]) {
    const ctx = await b.newContext({ viewport: { width: pw, height: ph }, deviceScaleFactor: 2 }), p = await ctx.newPage();
    await p.setContent(splashHtml(pw, ph, iconSvg(1.5)));
    await p.screenshot({ path: path.join(icons, 'splash', `${w}x${h}-${tag}.jpg`), type: 'jpeg', quality: 88 });
    await ctx.close();
  }
  await b.close();
})();
