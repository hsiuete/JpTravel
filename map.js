// map.js - external map loader with tabbed interface (expects itinerary.json present)
// Advanced Safari iOS compatibility fixes included
(async function(){
  try {
    console.log('Loading itinerary.json...');
    console.log('User Agent:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    
    // Hide Safari loading indicator
    const safariLoading = document.getElementById('safari-loading');
    if (safariLoading) {
      safariLoading.style.display = 'none';
    }
    
    // Try multiple methods for Safari
    let data = null;
    let resp = null;
    
    // Method 1: Standard fetch with cache busting
    try {
      const timestamp = new Date().getTime();
      const url1 = `itinerary.json?_t=${timestamp}`;
      console.log('Trying Method 1:', url1);
      
      const controller1 = new AbortController();
      const timeoutId1 = setTimeout(() => controller1.abort(), 15000); // 15 second timeout
      
      resp = await fetch(url1, {
        signal: controller1.signal,
        cache: 'no-cache',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId1);
      
      if (resp.ok) {
        data = await resp.json();
        console.log('Method 1 successful');
      } else {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
    } catch (err1) {
      console.log('Method 1 failed:', err1.message);
      
      // Method 2: Try with absolute path
      try {
        const url2 = `./itinerary.json?_t=${Date.now()}`;
        console.log('Trying Method 2:', url2);
        
        const controller2 = new AbortController();
        const timeoutId2 = setTimeout(() => controller2.abort(), 15000);
        
        resp = await fetch(url2, {
          signal: controller2.signal,
          cache: 'no-cache',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId2);
        
        if (resp.ok) {
          data = await resp.json();
          console.log('Method 2 successful');
        } else {
          throw new Error(`HTTP error! status: ${resp.status}`);
        }
      } catch (err2) {
        console.log('Method 2 failed:', err2.message);
        
        // Method 3: Try with full GitHub Pages URL
        try {
          const url3 = `https://hsiuete.github.io/jptravel/itinerary.json?_t=${Date.now()}`;
          console.log('Trying Method 3:', url3);
          
          const controller3 = new AbortController();
          const timeoutId3 = setTimeout(() => controller3.abort(), 15000);
          
          resp = await fetch(url3, {
            signal: controller3.signal,
            cache: 'no-cache',
            mode: 'cors',
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache'
            }
          });
          
          clearTimeout(timeoutId3);
          
          if (resp.ok) {
            data = await resp.json();
            console.log('Method 3 successful');
          } else {
            throw new Error(`HTTP error! status: ${resp.status}`);
          }
        } catch (err3) {
          console.log('Method 3 failed:', err3.message);
          throw new Error(`All fetch methods failed. Safari may be blocking requests. Last error: ${err3.message}`);
        }
      }
    }
    
    if (!data) {
      throw new Error('No data loaded from any method');
    }
    
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
    
    // Show Safari-specific loading indicator again
    const safariLoading = document.getElementById('safari-loading');
    if (safariLoading) {
      safariLoading.style.display = 'block';
    }
    
    // Safari-specific error handling
    if (err.name === 'AbortError') {
      showError('Request timeout - Safari may be blocking the request. Try refreshing the page or using Chrome.');
    } else if (err.message.includes('Failed to fetch')) {
      showError('Safari blocked the request. This is a common Safari security feature. Try: 1) Refresh the page 2) Clear Safari cache 3) Use Chrome instead 4) Wait a few minutes and try again');
    } else if (err.message.includes('All fetch methods failed')) {
      showError('Safari is blocking all requests. This is a known Safari issue. Solutions: 1) Use Chrome browser 2) Add to Home Screen 3) Wait 5-10 minutes and refresh 4) Clear Safari cache completely');
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
      
      <p><strong>Safari iOS 專用解決方案：</strong></p>
      <ol>
        <li><strong>強制重新整理：</strong> 長按重新整理按鈕 → 選擇「重新整理並清除快取」</li>
        <li><strong>清除 Safari 快取：</strong> 設定 → Safari → 清除歷史記錄與網站資料</li>
        <strong>使用 Chrome 瀏覽器：</strong> 從 App Store 下載 Chrome</li>
        <li><strong>加入主畫面：</strong> 分享按鈕 → 加入主畫面</li>
        <li><strong>等待 5-10 分鐘：</strong> Safari 有時會自動解除封鎖</li>
      </ol>
      
      <p><strong>為什麼 Line 可以但 Safari 不行？</strong></p>
      <ul>
        <li>Line 使用不同的瀏覽器引擎</li>
        <li>Safari 有更嚴格的內容封鎖政策</li>
        <li>Safari 會快取和封鎖某些請求</li>
      </ul>
      
      <p><strong>一般解決方案：</strong></p>
      <ol>
        <li>啟動 XAMPP Control Panel</li>
        <li>啟動 Apache 服務</li>
        <li>透過 <code>http://localhost/JpTravel/index.html</code> 存取</li>
      </ol>
    </div>`;
  }
}
