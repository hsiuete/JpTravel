# 🚀 Deployment Guide - JpTravel

## Quick Deploy Options

### Option 1: GitHub Pages (Recommended)

#### Step 1: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `jptravel`
4. Make it Public
5. Don't initialize with README (we already have files)

#### Step 2: Upload Files
```bash
# In your JpTravel folder
git init
git add .
git commit -m "Initial commit - Tokyo travel itinerary"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jptravel.git
git push -u origin main
```

#### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Source: "Deploy from a branch"
5. Branch: "main"
6. Folder: "/ (root)"
7. Click "Save"

#### Step 4: Access Your Site
```
https://YOUR_USERNAME.github.io/jptravel/
```

### Option 2: Netlify (Drag & Drop)

#### Step 1: Prepare Files
1. Make sure all files are in one folder:
   - `index.html`
   - `map.js`
   - `itinerary.json`
   - `test.html`
   - `README.md`

#### Step 2: Deploy
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag your entire JpTravel folder to the deploy area
4. Your site will be live instantly!

#### Step 3: Custom Domain (Optional)
1. Go to "Domain settings"
2. Add custom domain
3. Follow DNS instructions

### Option 3: Vercel

#### Step 1: Connect GitHub
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your jptravel repository

#### Step 2: Deploy
1. Vercel will auto-detect it's a static site
2. Click "Deploy"
3. Your site will be live in seconds!

## File Structure for Deployment

```
jptravel/
├── index.html          # Main page
├── map.js             # Map functionality
├── itinerary.json     # Travel data
├── test.html          # Test page
├── README.md          # Documentation
├── package.json       # Project metadata
├── .gitignore         # Git ignore rules
└── deploy.md          # This file
```

## Features After Deployment

✅ **Interactive Map** - All Tokyo locations marked
✅ **Responsive Design** - Works on mobile & desktop
✅ **Google Maps Integration** - Direct links to locations
✅ **7-Day Itinerary** - Complete Tokyo shopping & food tour
✅ **Modern UI** - Clean, professional design

## Customization

### Change Colors
Edit CSS in `index.html`:
```css
:root {
  --primary-color: #1976d2;
  --background-color: #fbfbfb;
}
```

### Add More Locations
Edit `itinerary.json`:
```json
{
  "name": "New Location",
  "address": "Address here",
  "lat": 35.6895,
  "lng": 139.7004,
  "notes": "Description",
  "gmaps": "Google Maps URL"
}
```

### Change Map Style
In `map.js`, change the tile layer:
```javascript
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  // Different map styles available
});
```

## Troubleshooting

### Common Issues:

1. **Map not loading**
   - Check internet connection
   - Verify Leaflet CDN is accessible

2. **JSON not loading**
   - Ensure all files are uploaded
   - Check browser console for errors

3. **Styling issues**
   - Clear browser cache
   - Check CSS file paths

### Support:
- Check browser console (F12) for errors
- Verify all files are in the correct location
- Test locally with XAMPP first

## Performance Tips

1. **Optimize Images** (if adding any)
2. **Minify CSS/JS** (optional)
3. **Use CDN** (already using for Leaflet)
4. **Enable Caching** (handled by hosting providers)

## Analytics (Optional)

Add Google Analytics:
```html
<!-- Add to <head> section of index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Success! 🎉

Your Tokyo travel itinerary is now live and accessible to anyone with an internet connection!
