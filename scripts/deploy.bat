@echo off
echo ===================================
echo   MahjongMaster 一键部署脚本
echo ===================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
  echo [X] 未找到 Node.js, 请先安装 https://nodejs.org
  pause
  exit /b 1
)

echo [1/4] 检查 wrangler CLI...
where wrangler >nul 2>nul
if %errorlevel% neq 0 (
  echo     正在安装 wrangler...
  call npm install -g wrangler
)

echo [2/4] 登录 Cloudflare...
echo     浏览器会打开, 老板请登录 diaox111@gmail.com
echo.
call wrangler login

echo [3/4] 创建/更新 Pages 项目...
call wrangler pages deploy . --project-name=mahjongmaster-9g9

echo [4/4] 完成!
echo.
echo 网站地址: https://mahjongmaster-9g9.pages.dev
echo.
pause
