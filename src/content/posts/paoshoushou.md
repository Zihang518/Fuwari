---
category: "Github"
description: "[开源]刨手手表情包下载站"
draft: false
image: "https://imgbed.112601.xyz/file/1755431008556.png"
lang: ""
published: 2025-08-21
tags:
  - "Github"
title: "Ciallo～(∠・ω< )⌒★"
---

> 本文由 https://github.com/afoim/fuwari/pull/40 提供，非站长原创

# 刨手手表情包下载站  
一个简单、美观、现代化的表情包预览和下载网站  [体验界面](https://paoshoushou.112601.xyz/)
![示例](https://imgbed.112601.xyz/file/1755431008556.png)  
[项目主页文章（博客）](#) | [体验界面](https://paoshoushou.112601.xyz/) | [GitHub仓库](https://github.com/yunsen2025/paoshoushouGIF-web)

> [!NOTE]
>
> **这是一个纯前端项目，无需后端支持，可直接部署到任何静态网站托管服务**

---
# 项目特性：
- 🎨 **现代化设计**：采用渐变背景、玻璃拟态、流畅动画等现代UI设计
- 📱 **完全响应式**：支持手机、平板、电脑等各种设备，自适应布局
- ⚡ **轻量高效**：纯HTML+CSS+JS，无框架依赖，加载速度快
- 🖱️ **交互友好**：点击图片直接下载，悬停显示下载提示，操作简单直观
- 🎭 **丰富表情**：内置多个精选表情包，涵盖各种场景
- 📦 **自动打包**：GitHub Actions自动打包表情包为zip文件，发布到Releases
- 🔧 **易于扩展**：简单的数组配置，可轻松添加新的表情包

---  
# 使用方式：  

## 1. 直接访问
访问在线体验地址：[https://paoshoushou.112601.xyz/](https://paoshoushou.112601.xyz/)

## 2. 本地部署
1. 克隆或下载项目文件
```bash
git clone https://github.com/yunsen2025/paoshoushouGIF-web.git
```

2. 直接用浏览器打开 `index.html` 文件

## 3. 服务器部署
将项目文件上传到任何支持静态文件的Web服务器即可

---
# 文件结构
```
paoshoushouGIF-web/
├── index.html          # 主页面文件
├── claude.html         # 备用页面
├── README.md           # 项目说明
├── pack-release.sh     # 手动打包脚本
├── .github/
│   └── workflows/
│       └── release.yml # GitHub Actions自动打包配置
└── gif/               # 表情包文件夹
    ├── 0.gif
    ├── 1.gif
    ├── ...
    └── 48.gif
```

---
# 功能说明

## 核心功能
| 功能         | 描述                |
| ---------- | ----------------- |
| 表情预览     | 网格布局展示所有表情包，支持懒加载 |
| 点击下载     | 点击任意表情包图片即可下载到本地 |
| 悬停提示     | 鼠标悬停显示下载图标提示 |
| 批量下载     | 点击右上角按钮可下载整个项目 |
| 响应式布局   | 根据屏幕大小自动调整列数 |
| 加载动画     | 表情包依次淡入，提升用户体验 |

## 技术特色
- **现代CSS**：使用CSS Grid、Flexbox、渐变、阴影等现代特性
- **流畅动画**：悬停效果、过渡动画、加载动画
- **玻璃拟态**：毛玻璃效果营造现代感
- **多媒体查询**：5个断点适配不同屏幕尺寸

---
# 自动打包说明

## 🤖 GitHub Actions 自动打包
项目配置了GitHub Actions，可以自动将gif文件夹打包为zip文件：

### 触发条件
- 当向 `gif/` 文件夹添加新文件时自动触发
- 手动在GitHub上触发 (Actions -> 自动打包表情包 -> Run workflow)

### 下载方式
1. 访问 [Releases页面](https://github.com/yunsen2025/paoshoushouGIF-web/releases)
2. 下载最新版本的zip文件
3. 或点击网站右上角"📦 一键下载图包"按钮

### 文件内容
打包的zip文件包含：
- 所有gif表情包文件
- README.txt说明文件（包含使用说明和版权信息）

---
# 自定义配置

## 添加新表情包
1. 将GIF文件放入 `gif/` 文件夹
2. 在 `index.html` 中的 `memeData` 数组添加新条目：
```javascript
const memeData = [
    // 现有表情包...
    { name: "新表情", url: "/gif/新文件名.gif" }
];
```
3. 推送到GitHub后，Actions会自动创建新的打包版本

## 修改样式主题
在CSS中修改以下变量来改变主题色彩：
- 背景渐变：`body` 的 `background`
- 头部颜色：`header` 的 `background`
- 卡片样式：`.meme-item` 相关样式

---
# 浏览器兼容性
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ 移动端浏览器

---
# 开源协议
本项目采用 MIT 协议开源，欢迎 Fork 和贡献代码。

---
# 特别说明
- 本网站仅提供表情包预览与下载，版权归原作者所有
- 如有侵权，请通过 GitHub Issues 联系我们
- 欢迎通过 Pull Request 贡献更多表情包内容
