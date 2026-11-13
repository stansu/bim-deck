# 最高機密｜BIM 導入決策（5 頁互動版）

**已上線：<https://stansu.github.io/bim-deck/>**

給管理層看的 5 頁決策簡報，做成靜態網站。手機、平板、桌機都能看；
沒有建置流程、沒有外部字型或追蹤碼，離線也能開。

- 原始碼：<https://github.com/stansu/bim-deck>（公開；已加 `noindex` 與 `robots.txt`）
- 發布來源：`main` 分支的 `/docs` 資料夾

## 深連結

| 用途 | 網址 |
|---|---|
| 第 2 頁（問題與目標） | `/?p=2` |
| 第 3 頁，工具分工 | `/?p=3&t=tool` |
| 第 3 頁，時程 | `/?p=3&t=plan` |
| 第 4 頁（成本與試算） | `/?p=4` |
| 第 5 頁（裁決） | `/?p=5` |

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

## 之後怎麼更新

```bash
# 改 docs/ 裡的檔案
git add docs && git commit -m "update deck" && git push
```

推上去後 GitHub Pages 會在 1 分鐘內自動重建（`main` / `/docs`）。

## 改成別的網址或私有

- **換 repo 或帳號**：`git remote set-url origin <新網址>`，再到 Settings → Pages 重設來源。
- **要改回私有**：免費方案的私人 repo 不支援 Pages，站台會下線；內容仍留在 repo 裡。
- **自訂網域**：在 `docs/` 放 `CNAME`（例如 `bim.example.com`），再到 DNS 設 CNAME 指向 `stansu.github.io`。

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
