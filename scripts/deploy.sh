#!/bin/bash
echo "==================================="
echo "  MahjongMaster 一键部署脚本"
echo "==================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
  echo "[X] 未找到 Node.js, 请先安装 https://nodejs.org"
  exit 1
fi

echo "[1/4] 检查 wrangler CLI..."
if ! command -v wrangler &> /dev/null; then
  echo "    正在安装 wrangler..."
  npm install -g wrangler
fi

echo "[2/4] 登录 Cloudflare..."
echo "    浏览器会打开, 老板请登录 diaox111@gmail.com"
echo ""
wrangler login

echo "[3/4] 创建/更新 Pages 项目..."
wrangler pages deploy . --project-name=mahjongmaster-9g9

echo "[4/4] 完成!"
echo ""
echo "网站地址: https://mahjongmaster-9g9.pages.dev"
