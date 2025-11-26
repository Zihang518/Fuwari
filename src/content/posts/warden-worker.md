---
title: 你可曾想过，直接将BitWarden部署到Cloudflare Worker？
published: 2025-11-21T17:07:52
description: warden-worker就是这样一个项目，它将Rust编译为WASM，然后部署到Cloudflare Worker，无需VPS，无需家里云，只需点点鼠标就可免费用上自己的密码托管！
image: ../assets/images/warden-worker.png
tags:
  - Cloudflare
  - Bitwarden
draft: false
lang: ""
---
# 原理
项目参考开源的 [dani-garcia/vaultwarden: Unofficial Bitwarden compatible server written in Rust, formerly known as bitwarden_rs](https://github.com/dani-garcia/vaultwarden) 将Rust源码编译为WASM以支持在Cloudflare Worker上运行。其中Worker负责REST API，D1负责存储加密后的数据

# 实战

打开Cloudflare https://dash.cloudflare.com/ 

登录后复制这里的 **账户ID** （CLOUDFLARE_ACCOUNT_ID）
![](../assets/images/warden-worker-2.png)

右上角进入配置文件
![](../assets/images/warden-worker-1.png)

左上角选择API令牌
![](../assets/images/warden-worker-3.png)

点击创建令牌
![](../assets/images/warden-worker-4.png)

选择 编辑Cloudflare Workers
![](../assets/images/warden-worker-5.png)

创建后 **复制API 令牌** （只会展示一次）（CLOUDFLARE_API_TOKEN）
![](../assets/images/warden-worker-6.png)

回到主页，进入D1数据库
![](../assets/images/warden-worker-7.png)

选择 创建数据库
![](../assets/images/warden-worker-8.png)

创建完成后，进入，复制 **D1 数据库 ID**（D1_DATABASE_ID）

> 由于原项目坑点太多（如：依赖不固定版本导致编译报错，必须设置的环境变量不写白，SQL初始化遇到问题直接跳过）

这里我Fork并二改了一个我的版本，跟着我的步骤走，包你成功！

Fork我的仓库（别忘了点个 **Star** ） [afoim/warden-worker: A Bitwarden-compatible server for Cloudflare Workers](https://github.com/afoim/warden-worker/)

在仓库设置中添加上述三个机密环境变量
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `D1_DATABASE_ID`
![](../assets/images/warden-worker-9.png)

点击 Action，运行Build工作流
![](../assets/images/warden-worker-10.png)

Build结束，全绿
![](../assets/images/warden-worker-11.png)

打开Cloudflare D1，查看数据库表
![](../assets/images/warden-worker-12.png)

如果这里是空的，我们就手动建表
![](../assets/images/warden-worker-13.png)

查看这个文件 [warden-worker/sql/schema.sql at main · afoim/warden-worker](https://github.com/afoim/warden-worker/blob/main/sql/schema.sql)

依次将这3个SQL块进行执行（一定要依次，不能一把梭）。每执行一次你应该都能看到新表的出现
![](../assets/images/warden-worker-14.png)
![](../assets/images/warden-worker-15.png)![](../assets/images/warden-worker-16.png)

进入Workers
![](../assets/images/warden-worker-17.png)

进入 warden-worker
![](../assets/images/warden-worker-18.png)

先添加 **自定义域** ，填你的域名，因为 Worker 默认给的域名国内无法访问
![](../assets/images/warden-worker-19.png)

再添加**变量与机密** （注意不要有空格）
- `ALLOWED_EMAILS` your-email@example.com 
- `JWT_SECRET` 随机的长字符串 
- `JWT_REFRESH_SECRET` 随机的长字符串
![](../assets/images/warden-worker-20.png)

此时打开手机上的 **BitWarden** 软件，在你的自托管上创建账号即可（注意：密码一经设置将无法更改）
![](../assets/images/Screenshot_2025-11-21-17-53-07-65_edf9c6c5202cf0a.jpg)![](../assets/images/Screenshot_2025-11-21-17-53-04-92_edf9c6c5202cf0a.jpg)![](../assets/images/Screenshot_2025-11-21-17-53-34-66_edf9c6c5202cf0a.jpg)![](../assets/images/Screenshot_2025-11-21-18-32-58-31_edf9c6c5202cf0a.jpg)