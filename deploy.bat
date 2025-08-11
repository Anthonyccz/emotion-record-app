@echo off
chcp 65001 >nul

echo 🚀 开始部署到 GitHub Pages...

REM 检查是否有未提交的更改
git status --porcelain > temp_status.txt
for /f %%i in (temp_status.txt) do (
    echo ⚠️  检测到未提交的更改，请先提交所有更改
    git status
    del temp_status.txt
    pause
    exit /b 1
)
del temp_status.txt

REM 构建项目
echo 📦 构建项目...
npm run build

if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)

REM 提交并推送到 main 分支
echo 📤 推送到 main 分支...
git add .
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
git commit -m "Deploy: %mydate% %mytime%"
git push origin main

if %errorlevel% neq 0 (
    echo ❌ 推送失败
    pause
    exit /b 1
)

echo ✅ 部署完成！
echo 🌐 GitHub Actions 正在自动构建和部署...
echo 📱 部署完成后可在 GitHub Pages 地址访问
echo ⏰ 通常需要 2-5 分钟完成部署

pause