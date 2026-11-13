# 以小團隊取代大團隊｜BIM 導入決策（5 頁互動版）

給管理層看的 5 頁決策簡報，做成可直接放 GitHub Pages 的靜態網站。
手機、平板、桌機都能看；沒有建置流程、沒有外部資源、離線也能開。

## 內容

| 頁 | 主題 | 互動 |
|---|---|---|
| 1 | 封面與三個關鍵數字 | — |
| 2 | 四個漏，正在吃掉毛利 | **現在／12 個月後** 切換，同一組卡片換內容 |
| 3 | 一套模型，三件事 | **產出／工具／時程** 三個分頁 |
| 4 | 第一年 49.8 萬，17 個月回本 | **試算器**：拉年案量與工時降幅，即時算效益與回本 |
| 5 | 今天可以決定的四件事 | **勾選＋複製決策摘要**，可直接貼到訊息或會議紀錄 |

其他：右側圓點導覽、頂端進度條、鍵盤 ← → ↑ ↓ PageUp/Down Home/End、
手機原生滑動、`prefers-reduced-motion` 支援、列印樣式（每頁一張 A4）。

## 本機預覽

```bash
cd docs
python3 -m http.server 8000
# 打開 http://localhost:8000
```

直接雙擊 `docs/index.html` 也可以，但用本機伺服器比較接近實際部署的樣子。

## 部署到 GitHub Pages

### 方式 A：從 `/docs` 發布（建議，最省事）

```bash
git init
git add docs
git commit -m "add BIM decision deck"
git branch -M main
git remote add origin https://github.com/<你的帳號>/<repo>.git
git push -u origin main
```

然後在 GitHub 倉庫 → **Settings → Pages**
- Source: `Deploy from a branch`
- Branch: `main`　資料夾: **`/docs`**
- 按 Save，等 1–2 分鐘

網址會是：`https://<帳號>.github.io/<repo>/`

### 方式 B：發布整個倉庫根目錄

把 `docs/` 裡的 `index.html`、`style.css`、`app.js`、`.nojekyll`
複製到倉庫根目錄，Pages 設定選 `main` / `/ (root)`。

> 注意：根目錄若放 `.docx`、`.xlsx`、`.pptx`，會一起被公開。
> 不想公開就把簡報網站獨立成一個 repo。

### 自訂網域

在 `docs/` 放一個 `CNAME` 檔，內容寫你的網域（例如 `bim.example.com`），
再到 DNS 設 CNAME 指向 `<帳號>.github.io`。

## 檔案結構

```
docs/
├── index.html      內容（5 個 <section class="page">）
├── style.css       視覺與響應式（CSS 變數在最上方）
├── app.js          導覽、分頁、試算器、複製摘要
└── .nojekyll       避免 GitHub Pages 走 Jekyll
```

## 要改數字的話

- **頁面上的文字**：直接改 `docs/index.html`。
- **封面三個數字**：`index.html` 裡的 `.stats`。
- **試算器公式**：`app.js` 最上方五個常數
  （`COST_Y1`、`OPEX_Y2`、`HOURS_PER_CASE`、`RATE`、`REWORK_PER_CASE`、`NEWBIZ_PER_CASE`）。
- **配色**：`style.css` 的 `:root`（`--navy`、`--teal`、`--clay`）。

數字與《BIM 導入計畫》v2.0 及 `BIM工具選型與成本試算.xlsx` 一致：
第一年 49.8 萬（現金 22–31 萬）、第二年效益 124 萬、17 個月回本。

## 已知限制

- 沒有使用任何追蹤碼或外部字型，字型依賴系統的 Noto Sans TC／PingFang TC／微軟正黑體。
- `:has()` 只用在「勾選後高亮」這個裝飾效果，舊瀏覽器會少一個視覺提示，不影響功能。
- 內容為估算與區間，不是報價。
