---
title: "加群向导&其他网站&常见问题"
image: "https://php.afo.im/ri/?img=h"
published: 2025-05-24
pinned: true
category: '置顶'
tags: [联系]
description: 关于如何联系二叉树树~
---

# 加入QQ群

我直属管理的技术群：1051639698

> 请认准QQ号为2726730791，且ID为“B站二叉树树”的用户，谨防受骗上当

---

# 其他网站

[六子棋 - Python](https://sixqi.afo.im)

[二次元随机图 - 竖屏](https://php.afo.im/ri/?img=v)

[二次元随机图 - 横屏](https://php.afo.im/ri/?img=h)

---

# 常见问题

## EdgeOne CDN相关

> 内测时间截至到哪？

2025年7月15日23:59:59（UTC+8）。详见： https://edgeone.ai/zh/redemption 的 5.规则是什么

> 国内国外兑换码通用吗？

通用。但是如果你要同时用国内站和国外站需要两个兑换码

> 国内国外站有什么区别

国外站如果需要使用中国节点需要实名，但是无法使用中国大陆身份证实名。国内站可以

> 国际站绑卡的要求？是否必须要外币卡？授权费多少？

银联即可，CVC填卡号后三位。授权1美元，扣除后会还

> 回源CF站点后报错423 Locked怎么办？

将回源HOST改为源站

> 如何套上家里云？

家里云使用IPv6+DDNS，EO回源v6域名+端口即可

> 免费套餐限速吗？

单线程512KB/s，多线程我能跑到最高72MB/s

## 内网穿透相关

> 我怎么看我是不是NAT1

安装Lucky去STUN打个洞看成不成功

> 我怎么尽全力优化我的网络使其成为NAT1

光猫桥接，路由拨号，开启UPnP或者开启DMZ指向你想要成为NAT1的设备的IP

## 域名相关

> afo.im这个域名哪买的？

Spaceship

> 十年50的域名怎么搞？

6-9位纯数字xyz，Spaceship买

## Vercel相关

>  私有仓库无法同步Git进行CI/CD。手动创建部署提示 A commit author is required ？

之后的Git提交需要将用户名和邮箱皆设为Github的即可（让Vercel识别到你确实控制着这个仓库并且提交是由你提交的）