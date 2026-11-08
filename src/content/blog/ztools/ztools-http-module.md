---
title: 'http 模块总结'
description: '是 hutool-http 的移植镜像，包路径 。共 62 主类（+10 package-info），分根包 + body/cookie/server/ssl/useragent/webservice 六个子包，实现 HTTP 客户端与简易 HTTP 服务器。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "网络"]
category: 'ztools'
---

# http 模块总结（MOC）

> `cc-hongz-ztools-http` 是 hutool-http 的移植镜像，包路径 `cc.hongz.ztools.http`。共 62 主类（+10 package-info），分根包 + body/cookie/server/ssl/useragent/webservice 六个子包，实现 HTTP 客户端与简易 HTTP 服务器。

---

## 分层

- [http包总结](/blog/ztools-http-pkg/) — 根包（`HttpUtil`/`HttpRequest`/`HttpResponse`/`HttpDownloader` 等 22 类）+ 六个子包（body 请求体、cookie、server 简易服务器、ssl、useragent 解析、webservice SOAP）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/) 的 [net包总结](/blog/ztools-net-pkg/)（`SSLContextBuilder`/`URLUtil`）、[io包总结](/blog/ztools-io-pkg/)（`IoUtil`/`Resource`/`StreamProgress`）、[lang包总结](/blog/ztools-lang-pkg/)（`Chain`/`OptNullBasicTypeGetter`）、[util包总结](/blog/ztools-util-pkg/)（`StrUtil`/`CharsetUtil`/`ReUtil`）、[exceptions包总结](/blog/ztools-exceptions-pkg/)（`IORuntimeException`）
- webservice 子包依赖 `javax.xml.soap-api` 与 `jakarta.xml.soap-api`（均为 `provided`，用于构建 SOAP 消息）
- json 模块仅 `test` scope（测试中反序列化响应）

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [socket模块总结](/blog/ztools-socket-module/) — 姊妹网络通信模块
