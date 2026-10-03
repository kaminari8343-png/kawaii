#!/usr/bin/env python3
"""assets/src/*.png（生成した元画像）を、背景除去の残りをきれいにして assets/*.webp に変換する。
使い方: pip install pillow numpy scipy && python3 tools/prepare-assets.py
- 薄すぎるピクセル（alpha<=LOW）を消す
- ほぼ不透明（alpha>=HIGH）は完全不透明にそろえる（元画像は 253 前後で止まっていた）
- 本体から離れた小さなゴミ（面積 MIN_AREA 未満）を消す
"""
import glob, json, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

LOW, HIGH, MIN_AREA = 32, 245, 120
root = os.path.join(os.path.dirname(__file__), '..', 'assets')
report = {}
for f in sorted(glob.glob(os.path.join(root, 'src', '*.png'))):
    name = os.path.splitext(os.path.basename(f))[0]
    a = np.array(Image.open(f).convert('RGBA'))
    al = a[..., 3].astype(np.float32)
    al = np.where(al <= LOW, 0, np.where(al >= HIGH, 255, (al - LOW) * 255 / (HIGH - LOW)))
    lab, n = ndi.label(al > 0)
    if n:
        sizes = ndi.sum(al > 0, lab, range(1, n + 1))
        small = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s < MIN_AREA])
        al[small] = 0
    a[..., 3] = al.round().astype(np.uint8)
    a[a[..., 3] == 0, :3] = 0                      # 透明部分の色は捨てて軽くする
    out = os.path.join(root, name + '.webp')
    Image.fromarray(a, 'RGBA').save(out, 'WEBP', quality=88, method=6, alpha_quality=100)
    ys, xs = np.where(a[..., 3] > 0)
    report[name] = dict(bbox=[int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())], kb=os.path.getsize(out) // 1024, removed_components=int(n - len(np.unique(lab[a[..., 3] > 0])) ))
    print(name, report[name])
