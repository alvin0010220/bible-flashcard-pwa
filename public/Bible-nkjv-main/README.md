# Bible-nkjv-main (NKJV 英文聖經 JSON 目錄)

請將您取得的 NKJV 聖經 JSON 檔案放置於此目錄（`public/Bible-nkjv-main/`），支援以下兩種常見結構：

1. **與 `Bible-niv-main` 相同的分卷結構**：
   - 例如 `Ephesians.json`、`John.json`、`Genesis.json` 等 66 個書卷檔案。
   - 格式：`{ "book": "Ephesians", "chapters": [ { "chapter": "1", "verses": [ { "verse": "1", "text": "..." } ] } ] }`
2. **單一整合檔案 (`nkjv.json` 或 `NKJV.json`)，或透過網頁內建「匯入 NKJV JSON」按鈕直接上傳**：
   - 支援在 App 內點擊右上角「匯入 NKJV」直接載入單檔或多檔 JSON，並自動儲存於瀏覽器。
