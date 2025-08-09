@echo off
echo 🚀 JpTravel Deployment Script
echo ================================

echo.
echo 📁 Current directory: %CD%
echo.

echo 🔍 Checking for Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git first.
    echo Download from: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo ✅ Git found!

echo.
echo 📋 Files in current directory:
dir /b *.html *.js *.json *.md

echo.
echo 🤔 Do you want to deploy to GitHub? (Y/N)
set /p choice=

if /i "%choice%"=="Y" (
    echo.
    echo 📝 Initializing Git repository...
    git init
    
    echo 📦 Adding files...
    git add .
    
    echo 💾 Committing changes...
    git commit -m "Initial commit - Tokyo travel itinerary"
    
    echo 🌿 Setting main branch...
    git branch -M main
    
    echo.
    echo ⚠️  IMPORTANT: You need to create a GitHub repository first!
    echo.
    echo 📋 Next steps:
    echo 1. Go to https://github.com
    echo 2. Create a new repository named 'jptravel'
    echo 3. Copy the repository URL
    echo 4. Run: git remote add origin YOUR_REPOSITORY_URL
    echo 5. Run: git push -u origin main
    echo.
    echo 🔗 Then enable GitHub Pages in repository settings
    echo.
) else (
    echo.
    echo 💡 Alternative deployment options:
    echo.
    echo 🌐 Netlify: Drag and drop this folder to netlify.com
    echo ⚡ Vercel: Connect GitHub repository to vercel.com
    echo 🔥 Firebase: Use firebase-tools to deploy
    echo.
)

echo.
echo 📖 For detailed instructions, see deploy.md
echo.
pause
