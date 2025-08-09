// map.js - external map loader (expects itinerary.json present)
(async function(){
  try {
    console.log('Loading itinerary.json...');
    const resp = await fetch('itinerary.json');
    
    if (!resp.ok) {
      throw new Error(`HTTP error! status: ${resp.status}`);
    }
    
    const data = await resp.json();
    console.log('JSON loaded successfully:', data);
    
    // render left list
    const container = document.getElementById('itinerary-container');
    if (!container) {
      console.error('Container element not found');
      return;
    }
    
    container.innerHTML = '';
    data.days.forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.className = 'day';
      dayEl.innerHTML = `<h4>${day.date} — ${day.title}</h4><div class="small">${day.summary}</div>`;
      day.places.forEach(pl=>{
        const p = document.createElement('div');
        p.className = 'place';
        p.innerHTML = `<strong>${pl.name}</strong><div class="small">${pl.address || ''}</div>
                       <div class="small">${pl.notes || ''}</div>
                       <a class="btn" href="${pl.gmaps || '#'}" target="_blank" rel="noopener">打開 Google Maps</a>`;
        dayEl.appendChild(p);
      });
      container.appendChild(dayEl);
    });

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
    const container = document.getElementById('itinerary-container');
    if (container) {
      container.innerHTML = `<div style="color:red; padding: 20px; border: 1px solid #ff0000; background: #fff5f5;">
        <h3>載入失敗</h3>
        <p>無法載入 itinerary.json 檔案</p>
        <p>錯誤訊息: ${err.message}</p>
        <p>請確認：</p>
        <ul>
          <li>itinerary.json 檔案存在於同一資料夾</li>
          <li>檔案格式正確（有效的 JSON）</li>
          <li>透過 HTTP 伺服器存取（如 XAMPP）</li>
        </ul>
        <p><strong>解決方案：</strong></p>
        <ol>
          <li>啟動 XAMPP Control Panel</li>
          <li>啟動 Apache 服務</li>
          <li>透過 <code>http://localhost/JpTravel/index.html</code> 存取</li>
        </ol>
      </div>`;
    }
  }
})();
