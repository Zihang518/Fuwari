---
title: Reality协议的代理服务端搭建教程
published: 2025-05-01
description: 'Reality协议是目前最抗检测的一种代理协议'
image: https://r2.afo.im/myblog/img/709453e8-3a6a-4e2c-8618-fcf542ee0d37.webp
tags: [Reality]
category: '教程'
draft: false 
lang: ''
---

# 前置工作

- 确保拥有一台海外VPS（无需独立公网）

# 正式开始

> 为了确保您的操作能跟教程一致，并且便于后续复现BUG，请先将VPS重装系统为Debian12再继续操作

首先通过SSH登录你的VPS

安装3x-ui面板。执行：

```bash
bash <(curl -Ls https://raw.githubusercontent.com/mhsanaei/3x-ui/master/install.sh)
```

一路回车，直到面板安装完成，打印下述信息：

```bash
This is a fresh installation, generating random login info for security concerns:
###############################################
Username: XXXXXXXX
Password: XXXXXXXX
Port: XXXXX
WebBasePath: XXXXXXXXXXXXXXXXXX
Access URL: http://XX.XX.XX.XX:XXXXX/XXXXXXXXXXXXXXXXXX
###############################################
If you forgot your login info, you can type 'x-ui settings' to check
Start migrating database...
Migration done!
Created symlink /etc/systemd/system/multi-user.target.wants/x-ui.service → /etc/systemd/system/x-ui.service.
x-ui vX.X.X installation finished, it is running now...

┌───────────────────────────────────────────────────────┐
│  x-ui control menu usages (subcommands):              │
│                                                       │
│  x-ui              - Admin Management Script          │
│  x-ui start        - Start                            │
│  x-ui stop         - Stop                             │
│  x-ui restart      - Restart                          │
│  x-ui status       - Current Status                   │
│  x-ui settings     - Current Settings                 │
│  x-ui enable       - Enable Autostart on OS Startup   │
│  x-ui disable      - Disable Autostart on OS Startup  │
│  x-ui log          - Check logs                       │
│  x-ui banlog       - Check Fail2ban ban logs          │
│  x-ui update       - Update                           │
│  x-ui legacy       - legacy version                   │
│  x-ui install      - Install                          │
│  x-ui uninstall    - Uninstall                        │
└───────────────────────────────────────────────────────┘
```

接下来，如果你是NAT机，请先将面板端口改为可用公网的端口。输入 `x-ui` 找到 `Change Port` 相关操作执行

然后访问面板。其中 `WebBasePath` 在安装后会展示

```url
https://公网IP:面板端口/WebBasePath
```

接着点击左侧导航栏的 `入站列表` -> `添加入站` 

- 端口：任意

- 传输：TCP（RAW）

- 安全：Reality

- Dest（Target）：gateway.icloud.com:443

- SNI：gateway.icloud.com

- 公钥私钥处点一下 `Get New Cert`

示例配置如图

![](https://r2.afo.im/myblog/img/bea44337-b899-4b11-a314-4c67b6ec3f51.webp)

然后点击修改。保存这份入站配置

接着点击ID左边的+，点击二维码图标，扫码即可导入配置，点击二维码即可复制配置至剪贴板

![](https://r2.afo.im/myblog/img/ab538d71-351c-4e3d-aebf-d5b0c32fd4ac.webp)
