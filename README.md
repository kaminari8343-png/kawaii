# きせかえ

4歳の女の子向けの着せ替えアプリ。HTML/CSS/JavaScript の単一ページで、ブラウザで開くだけで遊べます（外部通信なし・広告なし）。

## 公開（GitHub Pages）
1. リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** にする（最初の1回だけ）。
2. 既定ブランチに push（またはマージ）すると、`.github/workflows/pages.yml` が自動で公開します。
3. 公開URL: `https://<ユーザー名>.github.io/kawaii/`

## iPadのホーム画面に追加
Safariで公開URLを開く → 共有ボタン → **ホーム画面に追加**。アイコンから全画面で起動し、オフラインでも遊べます。

## 更新したとき
`sw.js` の `CACHE`（`kawaii-v1`）の数字を上げると、次の起動で新しい版に入れ替わります。
アイコンや起動画面を作り直すには `node tools/make-assets.js`（playwright が必要）。
