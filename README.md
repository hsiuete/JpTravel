# JpTravel - 東京旅遊行程

## 問題解決：Failed to fetch 錯誤

如果你看到 "Failed to fetch" 錯誤，這是因為瀏覽器的安全限制，不允許直接從檔案系統載入 JSON 檔案。

### 解決方案：

#### 1. 啟動 XAMPP
1. 開啟 XAMPP Control Panel
2. 點擊 Apache 旁邊的 "Start" 按鈕
3. 確認 Apache 狀態顯示為 "Running"

#### 2. 透過 HTTP 伺服器存取
**不要直接開啟 HTML 檔案！**

❌ 錯誤方式：
```
file:///C:/xampp/htdocs/JpTravel/index.html
```

✅ 正確方式：
```
http://localhost/JpTravel/index.html
```

#### 3. 測試檔案
你也可以使用測試頁面來檢查所有功能：
```
http://localhost/JpTravel/test.html
```

## 檔案說明

- `index.html` - 主要行程頁面
- `map.js` - 地圖和行程載入程式
- `itinerary.json` - 行程資料
- `test.html` - 測試頁面
- `chrome-test.html` - Chrome 瀏覽器診斷測試頁面
- `sw.js` - 服務工作者（快取管理）
- `README.md` - 說明檔案

## 功能特色

- 📍 互動式地圖顯示所有景點
- 📅 7天東京購物美食行程
- 🗺️ Google Maps 連結
- 📱 響應式設計
- 🎯 重點：血拚 & 美食

## 行程概要

- **日期**：2026-01-02 → 2026-01-08
- **出發地**：高雄 → 東京
- **重點**：Shopping & 美食
- **天數**：7天
- **景點數**：20+ 個地點

## 技術需求

- XAMPP (Apache 伺服器)
- 現代瀏覽器 (支援 ES6+)
- 網路連線 (載入 Leaflet 地圖)

## 故障排除

### 常見問題：

1. **"Failed to fetch" 錯誤**
   - 確保透過 `http://localhost/` 存取
   - 確認 Apache 服務已啟動

2. **地圖無法載入**
   - 檢查網路連線
   - 確認 Leaflet CDN 可存取

3. **JSON 載入失敗**
   - 確認 `itinerary.json` 檔案存在
   - 檢查檔案格式是否正確

### Chrome 瀏覽器 404 錯誤
如果 Chrome 瀏覽器顯示 404 錯誤但 Edge 瀏覽器正常：

**立即解決方案：**
1. 使用 Edge 瀏覽器（推薦）
2. 使用 `chrome-test.html` 進行診斷測試

**Chrome 專用解決方案：**
1. 清除 Chrome 快取：按 `Ctrl+Shift+Delete`，選擇「所有時間」
2. 使用無痕模式
3. 暫時停用所有 Chrome 擴充功能
4. 等待 5-10 分鐘後重新整理頁面
5. 點擊頁面中的「Chrome 強制重新載入」按鈕

**技術說明：**
Chrome 瀏覽器有時會因為安全政策或快取問題阻擋請求。本應用已實作多層快取清除和備用載入機制，包括：
- 服務工作者 (Service Worker) 快取管理
- 4 種不同的資料載入方法
- 強制快取清除
- Chrome 專用除錯面板

### 聯絡支援

如果仍有問題，請檢查：
1. XAMPP 是否正確安裝
2. Apache 服務是否啟動
3. 檔案路徑是否正確
4. 瀏覽器控制台錯誤訊息
5. 使用 `chrome-test.html` 進行 Chrome 專用診斷
