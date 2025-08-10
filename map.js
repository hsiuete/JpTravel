// map.js - external map loader with tabbed interface (expects itinerary.json present)
// Safari iOS compatibility fixes included
(async function(){
  try {
    console.log('Loading itinerary.json...');
    console.log('User Agent:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    
    // Safari-specific fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const resp = await fetch('itinerary.json', {
      signal: controller.signal,
      cache: 'no-cache', // Force fresh request
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    
    const data = await resp.json();
    console.log('JSON loaded successfully:', data);
    
    // Create tabbed interface
    createTabs(data.days);
    
    // Initialize map
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }
    
    const map = L.map('map').setView([35.68, 139.75], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, 
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each place
    data.days.forEach(day=>{
      day.places.forEach(pl=>{
        if(pl.lat && pl.lng){
          const marker = L.marker([pl.lat, pl.lng]).addTo(map);
          const popupHtml = `<strong>${pl.name}</strong><br>${pl.address || ''}<br><div class="small">${pl.notes || ''}</div>
            <a class="btn" href="${pl.gmaps || '#'}" target="_blank" rel="noopener">Google Maps</a>`;
          marker.bindPopup(popupHtml);
        }
      });
    });
    
    console.log('Map and itinerary loaded successfully');
    
  } catch(err){
    console.error('Error loading itinerary:', err);
    
    // Safari-specific error handling
    if (err.name === 'AbortError') {
      showError('Request timeout - Safari may be blocking the request. Try refreshing the page.');
    } else if (err.message.includes('Failed to fetch')) {
      showError('Safari blocked the request. This is a common Safari security feature. Try: 1) Refresh the page 2) Clear Safari cache 3) Use Chrome instead');
    } else {
      showError(err.message);
    }
  }
})();

// Function to create tabs
function createTabs(days) {
  const tabNav = document.getElementById('tab-nav');
  const tabContents = document.getElementById('tab-contents');
  
  if (!tabNav || !tabContents) {
    console.error('Tab elements not found');
    return;
  }
  
  // Clear existing content
  tabNav.innerHTML = '';
  tabContents.innerHTML = '';
  
  // Create tabs for each day
  days.forEach((day, index) => {
    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.textContent = `${day.date} — ${day.title}`;
    tabButton.onclick = () => switchTab(index);
    
    // Safari-specific button fixes
    tabButton.setAttribute('type', 'button');
    tabButton.style.webkitAppearance = 'none';
    
    // Create tab content
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.id = `tab-${index}`;
    
    // Add day header
    const dayHeader = document.createElement('div');
    dayHeader.className = 'day';
    dayHeader.innerHTML = `<h4>${day.date} — ${day.title}</h4><div class="small">${day.summary}</div>`;
    tabContent.appendChild(dayHeader);
    
    // Add places for this day
    day.places.forEach(pl => {
      const place = document.createElement('div');
      place.className = 'place';
      place.innerHTML = `<strong>${pl.name}</strong><div class="small">${pl.address || ''}</div>
                         <div class="small">${pl.notes || ''}</div>
                         <a class="btn" href="${pl.gmaps || '#'}" target="_blank" rel="noopener">打開 Google Maps</a>`;
      tabContent.appendChild(place);
    });
    
    // Add to DOM
    tabNav.appendChild(tabButton);
    tabContents.appendChild(tabContent);
  });
  
  // Show first tab by default
  if (days.length > 0) {
    switchTab(0);
  }
}

// Function to switch tabs
function switchTab(tabIndex) {
  // Remove active class from all tabs and contents
  const allTabs = document.querySelectorAll('.tab-nav button');
  const allContents = document.querySelectorAll('.tab-content');
  
  allTabs.forEach(tab => tab.classList.remove('active'));
  allContents.forEach(content => content.classList.remove('active'));
  
  // Add active class to selected tab and content
  if (allTabs[tabIndex]) {
    allTabs[tabIndex].classList.add('active');
  }
  if (allContents[tabIndex]) {
    allContents[tabIndex].classList.add('active');
  }
}

// Function to show error message
function showError(errorMessage) {
  const tabContents = document.getElementById('tab-contents');
  if (tabContents) {
    tabContents.innerHTML = `<div style="color:red; padding: 20px; border: 1px solid #ff0000; background: #fff5f5;">
      <h3>載入失敗</h3>
      <p>無法載入 itinerary.json 檔案</p>
      <p>錯誤訊息: ${errorMessage}</p>
      <p>請確認：</p>
      <ul>
        <li>itinerary.json 檔案存在於同一資料夾</li>
        <li>檔案格式正確（有效的 JSON）</li>
        <li>透過 HTTP 伺服器存取（如 XAMPP）</li>
      </ul>
      <p><strong>Safari 使用者解決方案：</strong></p>
      <ol>
        <li>重新整理頁面 (⌘+R)</li>
        <li>清除 Safari 快取 (設定 → Safari → 清除歷史記錄與網站資料)</li>
        <li>使用 Chrome 瀏覽器</li>
        <li>檢查網路連線</li>
      </ol>
      <p><strong>一般解決方案：</strong></p>
      <ol>
        <li>啟動 XAMPP Control Panel</li>
        <li>啟動 Apache 服務</li>
        <li>透過 <code>http://localhost/JpTravel/index.html</code> 存取</li>
      </ol>
    </div>`;
  }
}
