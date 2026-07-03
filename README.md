# MahjongMaster - 麻将出海项目

## 当前状态: MVP 本地完成

```
K:/hermes/.hermes/projects/mahjong-site/
├── index.html              # 首页
├── play.html               # 游戏页 (可玩 demo)
├── rules.html              # 规则+FAQ (SEO 长尾)
├── css/style.css           # 样式
├── js/game.js              # 麻将引擎
├── js/main.js              # UI 交互
├── wrangler.toml           # Cloudflare Pages 配置
├── .github/workflows/      # GitHub Actions 自动部署
└── test_server.py          # 本地测试脚本
```

## 下一步

### 方案 A: 立即上线 (推荐)
```bash
# 1. 推到 GitHub
git init
git add .
git commit -m "MVP"
git remote add origin https://github.com/YOUR_USERNAME/mahjong-master.git
git push -u origin main

# 2. Cloudflare Pages 连接 GitHub
# 3. 自动部署到 mahjongmaster.pages.dev
```

### 方案 B: 申请 eu.org 永久免费域名
1. 访问 https://nic.eu.org/ 注册账号
2. 申请 `mahjongmaster.eu.org` (3-7 天审批)
3. Cloudflare DNS 配置

### 方案 C: 买 $1 首年 .com
Porkbun $1 优惠（THEFIGCO24 码）

## 变现路径

1. **0-3 个月**: Google AdSense (需 1 万 PV/月)
2. **3-6 个月**: Mediavine 申请 (5 万 PV)
3. **6-12 个月**: 内容扩充 + 多布局 + 多语言

## 参考对标
- freemahjong.org (Free Video Games Project)
- 247mahjong.com (多布局 SEO 标杆)
- classic-mahjong.com (30+ 语言 + 3D)
