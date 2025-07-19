---
category: 教程
description: 使用SaaS、Worker以及各种奇技淫巧来让你的网站解析的IP进行分流优选，提高网站可用性和速度
draft: false
image: https://r2.afo.im/myblog/img/QmePpCr1YsDEBjm5f4TWc5FiEJtQp9ppzHqAuMTvvzEmyz.webp
lang: ''
published: 2025-06-24
tags:
- Cloudflare SaaS
title: 试试Cloudflare IP优选！让Cloudflare在国内再也不是减速器！
---

#### 未优选

![QmZoinxZgAzu7Skh7BqsxmDQGU1sXtLLskJcyQuRAQNKww.webp](https://r2.afo.im/myblog/img/098f9ee71ae62603022e542878673e19bdcaf196.webp)

#### 已优选

![QmaNVwAwSRvqdL5SrvWVCGCQqmacP3d62yoLxofGscNoKq.webp](https://r2.afo.im/myblog/img/e98ce10d846475aaec5cf73546d9b5caffefc4c0.webp)

---

结论：可见，优选过的网站响应速度有很大提升，并且出口IP也变多了。这能让你的网站可用性大大提高，并且加载速度显著变快。

Cloudflare 优选域名：[记录 - AcoFork Blog](/posts/record/#cloudflare-%E4%BC%98%E9%80%89%E5%9F%9F%E5%90%8D)

---

# Worker路由反代全球并优选（新）

> 本方法的原理为通过Worker反代你的源站，然后将Worker的入口节点进行优选。此方法不是传统的优选，源站接收到的Hosts头仍然是直接指向源站的解析
> 
> 以下代码是原Github全站反代代码的二改以实现Worker路由接入优选，可能有多余逻辑或者不完全适配于优选需求

创建一个Cloudflare Worker，写入代码

```js
// 域名前缀映射配置
const domain_mappings = {
  '源站.com': '最终访问头.',
//例如：
//'gitea.072103.xyz': 'gitea.',
//则你设置Worker路由为gitea.*都将会反代到gitea.072103.xyz
};

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const current_host = url.host;

  // 强制使用 HTTPS
  if (url.protocol === 'http:') {
    url.protocol = 'https:';
    return Response.redirect(url.href, 301);
  }

  const host_prefix = getProxyPrefix(current_host);
  if (!host_prefix) {
    return new Response('Proxy prefix not matched', { status: 404 });
  }

  // 查找对应目标域名
  let target_host = null;
  for (const [origin_domain, prefix] of Object.entries(domain_mappings)) {
    if (host_prefix === prefix) {
      target_host = origin_domain;
      break;
    }
  }

  if (!target_host) {
    return new Response('No matching target host for prefix', { status: 404 });
  }

  // 构造目标 URL
  const new_url = new URL(request.url);
  new_url.protocol = 'https:';
  new_url.host = target_host;

  // 创建新请求
  const new_headers = new Headers(request.headers);
  new_headers.set('Host', target_host);
  new_headers.set('Referer', new_url.href);

  try {
    const response = await fetch(new_url.href, {
      method: request.method,
      headers: new_headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'manual'
    });

    // 复制响应头并添加CORS
    const response_headers = new Headers(response.headers);
    response_headers.set('access-control-allow-origin', '*');
    response_headers.set('access-control-allow-credentials', 'true');
    response_headers.set('cache-control', 'public, max-age=600');
    response_headers.delete('content-security-policy');
    response_headers.delete('content-security-policy-report-only');

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response_headers
    });
  } catch (err) {
    return new Response(`Proxy Error: ${err.message}`, { status: 502 });
  }
}

function getProxyPrefix(hostname) {
  for (const prefix of Object.values(domain_mappings)) {
    if (hostname.startsWith(prefix)) {
      return prefix;
    }
  }
  return null;
}
```

创建路由

![](https://r2.afo.im/myblog/img/56752d54-26a5-46f1-a7d9-a782ad9874cb.webp)

类似这样填写

![](https://r2.afo.im/myblog/img/d025398c-39e3-4bd7-8d8f-2ce06a45007d.webp)

最后写一条DNS解析 `CNAME gitea.afo.im --> 社区优选域名，如 cf.090227.xyz` 即可

# 针对于A、AAAA、CNAME（SaaS接入）

> 我们需要**两个域名**（比如：onani.cn和acofork.cn）。
> 
> **如果在同一CF账号下不可用，请尝试将俩域名放置在不同账号**

这里我们让onani.cn成为主力域名，让acofork.cn成为辅助域名

---

1. 首先新建一个DNS解析，指向你的**源站**，**开启cf代理**
   ![QmfBKgDe77SpkUpjGdmsxqwU2UabvrDAw4c3bgFiWkZCna.webp](https://r2.afo.im/myblog/img/c94c34ee262fb51fb5697226ae0df2d804bf76fe.webp)

2. 前往**辅助域名**的 SSL/TLS -> 自定义主机名。设置回退源为你刚才的DNS解析的域名（xlog.acofork.cn）

3. 点击添加自定义主机名。设置一个自定义主机名，比如 `onani.cn` ，然后选择**自定义源服务器**，填写第一步的域名，即 `xlog.acofork.cn` 。
   
   如果你想要创建多个优选也就这样添加，一个自定义主机名对应一个自定义源服务器。如果你将源服务器设为默认，则源服务器是回退源指定的服务器，即 `xlog.acofork.cn` 
   
   ![QmRYrwjeDMDQCj8G9RYkpjC3X4vpwE77wpNpbqKURwBber.webp](https://r2.afo.im/myblog/img/f6170f009c43f7c6bee4c2d29e2db7498fa1d0dc.webp)

4. 继续在你的辅助域名添加一条解析。CNAME到优选节点：cloudflare.182682.xyz，**不开启cf代理**
   ![QmNwkMqDEkCGMu5jsgE6fj6qpupiqMrqqQtWeAmAJNJbC4.webp](https://r2.afo.im/myblog/img/4f9f727b0490e0b33d360a2363c1026003060b29.webp)

5. 最后在你的主力域名添加解析。域名为之前在辅助域名的自定义主机名（onani.cn），目标为刚才的cdn.acofork.cn，**不开启cf代理**
   ![QmeK3AZghae4J4LcJdbPMxBcmoNEeF3hXNBmtJaDki8HYt.webp](https://r2.afo.im/myblog/img/6f51cb2a42140a9bf364f88a5715291be616a254.webp)

6. 优选完毕，尝试访问

7. （可选）你也可以将cdn子域的NS服务器更改为阿里云\华为云\腾讯云云解析做线路分流解析
   
   > 优选工作流：用户访问 -> 由于最终访问的域名设置了CNAME解析，所以实际上访问了cdn.acofork.cn，并且携带 **源主机名：onani.cn** -> 到达cloudflare.182682.xyz进行优选 -> 优选结束，cf边缘节点识别到了携带的 **源主机名：onani.cn** 查询发现了回退源 -> 回退到回退源内容（xlog.acofork.cn） -> 访问成功

# 针对于Cloudflare Page

1. 你可以直接将你绑定到Page的子域名直接更改NS服务器到阿里云\华为云\腾讯云云解析做线路分流解析

2. 将您的Page项目升级为Worker项目，使用下面的Worker优选方案（更简单）。详细方法见： 【CF Page一键迁移到Worker？好处都有啥？-哔哩哔哩】 https://b23.tv/t5Bfaq1

# 针对于Cloudflare Workers

1. 在Workers中添加路由，然后直接将你的路由域名从指向`xxx.worker.dev`改为`cloudflare.182682.xyz`等优选域名即可

---

### 疑难解答

1. Q：如果我的源站使用Cloudflare Tunnels
   A：需要在Tunnels添加两个规则，一个指向你的辅助域名，一个指向最终访问的域名。然后删除最终访问域名的DNS解析（**但是不要直接在Tunnels删，会掉白名单，导致用户访问404**）。然后跳过第一步
   
   > 原理：假设你已经配置完毕，但是Cloudflare Tunnels只设置了一个规则。
   > 分类讨论，假如你设置的规则仅指向辅助域名，那么在优选的工作流中：用户访问 -> 由于最终访问的域名设置了CNAME解析，所以实际上访问了cdn.acofork.cn，并且携带 **源主机名：onani.cn** -> 到达cloudflare.182682.xyz进行优选 -> 优选结束，cf边缘节点识别到了携带的 **源主机名：onani.cn** 查询发现了回退源 -> 回退源检测 **源主机名：onani.cn**不在白名单 -> 报错 404 Not Found。访问失败
   > 分类讨论，假如你设置的规则仅指向最终访问的域名，那么在优选的工作流中：用户访问 -> 由于最终访问的域名设置了CNAME解析，所以实际上访问了cdn.acofork.cn -> 由于cdn.acofork.cn不在Tunnels白名单，则访问失败

---

3. Q：如果我的源站使用了Cloudflare Origin Rule（端口回源）
   A：需要将规则的生效主机名改为最终访问的域名，否则不触发回源策略（会导致辅助域名无法访问，建议使用Cloudflare Tunnels）
   
   > 原理：假设你已经配置完毕，但是Cloudflare Origin Rule（端口回源）规则的生效主机名为辅助域名
   > 那么在优选的工作流中：用户访问 -> 由于最终访问的域名设置了CNAME解析，所以实际上访问了cdn.acofork.cn，并且携带 **源主机名：onani.cn** -> 到达cloudflare.182682.xyz进行优选 -> 优选结束，cf边缘节点识别到了携带的 **源主机名：onani.cn** 查询发现了回退源 -> 回退到回退源内容（xlog.acofork.cn）-> 但是由于**源主机名：onani.cn**不在Cloudflare Origin Rule（端口回源）的规则中 -> 无法触发回源策略，访问失败

4. Q：如果我的源站使用serv00
   A：需要在WWW Web Site界面添加两个规则，一个指向你的辅助域名，一个指向最终访问的域名。
   
   > 原理：假设你已经配置完毕，但是serv00仅配置其中一个域名
   > 那么在优选的工作流中：会导致访问错误，serv00将会拦截不在白名单的域名请求
