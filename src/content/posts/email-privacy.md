---
title: "通过邮件混淆技术增强博客隐私"
published: 2025-08-01
description: "利用 rehype-email-protection 插件自动混淆电子邮件地址，保护免受垃圾邮件爬虫侵害的技术实现"
author: "hxsyzl"
image: "https://fastr2.497995.xyz/fuwari/image/5fd0835b-93da-4edc-bde5-f0c8aaa24b93.webp"
tags: ["fuwari优化"]
---

> 本文非站长原创，由 https://github.com/afoim/fuwari/pull/31 提供

## 背景

在网页上直接暴露电子邮件地址，会使其极易受到垃圾邮件机器人的自动抓取。为了解决这一隐私和安全问题，可以采用邮件地址混淆技术。

在提交 `0cc6194f35b3ff4ab53718fd98022b17ac522303` 中，项目引入了 `rehype-email-protection` 插件来应对此问题。

## 技术方案：`rehype-email-protection`

`rehype-email-protection` 是一个 Rehype 插件，它能在网站内容处理流程中自动识别并混淆电子邮件地址。

### 配置实现

该功能通过在 `astro.config.mjs` 文件中进行配置来启用。

首先，导入插件模块：

```javascript
import rehypeEmailProtection from "./src/plugins/rehype-email-protection.mjs";
```

然后，在 Astro 配置的 `rehypePlugins` 数组中添加该插件，并指定 `base64` 作为混淆方法。

```javascript
markdown: {
  rehypePlugins: [
    // ... 其他插件
    [rehypeEmailProtection, { method: "base64" }],
    // ... 其他插件
  ],
},
```

### 工作机制

配置生效后，内容中所有标准的电子邮件地址（如 `user@example.com`）在网站构建过程中，都会被转换为 Base64 编码的字符串，并通过客户端 JavaScript 进行解码。

对于普通用户，浏览器会执行脚本将编码还原为可交互的 `mailto:` 链接，功能体验不变。而对于无法执行 JavaScript 的网络爬虫，它们只能获取到编码后的无意义字符串，从而达到了保护电子邮件地址不被轻易收集的目的。

## 结论

集成 `rehype-email-protection` 插件是一种简单而有效的隐私增强手段。它以极低的配置成本，显著降低了因在公开网页上暴露电子邮件地址而导致的安全风险，是静态网站开发中值得推荐的一个实践。


引流：www.497995.xyz 树树放过我😭😭
