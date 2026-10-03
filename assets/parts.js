// 画像版キャラクターのパーツ設定。
// 全パーツは同じキャンバス（1086×1448）の透過画像で、素体の上に重ねる。
// 変形のルール: キャンバスの中心(543,724)を基準に scale 倍し、そのあと x,y（キャンバス上のpx、右・下が＋）だけずらす。
window.KAWAII_PARTS = {
  canvas: { w: 1086, h: 1448 },
  body: { src: 'assets/body.webp', scale: 1, x: 0, y: 0 },
  // 重ね順: 素体 → 洋服 → 髪
  outfits: {
    pink:   { src: 'assets/dress-pink.webp',   scale: 0.9,  x: 0, y: 67  },
    yellow: { src: 'assets/dress-yellow.webp', scale: 1.04, x: 0, y: -34 },
    blue:   { src: 'assets/dress-blue.webp',   scale: 1.04, x: 0, y: -34 },
  },
  hairs: {
    bob:      { src: 'assets/hair-bob.webp',          scale: 0.62, x: -20, y: -300 },
    lowTwin:  { src: 'assets/hair-low-twin.webp',     scale: 0.62, x: -20, y: -300 },
    twintail: { src: 'assets/hair-twintail.webp',     scale: 0.62, x: -20, y: -300 },
  },
};
