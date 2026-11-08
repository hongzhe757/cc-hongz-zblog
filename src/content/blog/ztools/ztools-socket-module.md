---
title: 'socket 模块总结'
description: '是 hutool-socket 的移植镜像，包路径 。共 20 主类（+4 package-info），分根包 + aio/nio/protocol 三个子包，封装 NIO/AIO 的 Socket 通信与编解码协议。'
pubDate: 'Sep 01, 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "网络"]
category: 'ztools'
---

# socket 模块总结（MOC）

> `cc-hongz-ztools-socket` 是 hutool-socket 的移植镜像，包路径 `cc.hongz.ztools.socket`。共 20 主类（+4 package-info），分根包 + aio/nio/protocol 三个子包，封装 NIO/AIO 的 Socket 通信与编解码协议。

---

## 分层

- [socket包总结](/blog/ztools-socket-pkg/) — 根包（`SocketUtil`/`SocketConfig` 等 4 类）+ aio（异步非阻塞）+ nio（同步非阻塞）+ protocol（编解码协议）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/) 的 [io包总结](/blog/ztools-io-pkg/)（`IoUtil`/`BufferUtil`）、[lang包总结](/blog/ztools-lang-pkg/)（`Assert`/`StringBuilder`）、[util包总结](/blog/ztools-util-pkg/)（`StrUtil`）、[thread包总结](/blog/ztools-thread-pkg/)（`ThreadUtil`/`ExecutorBuilder`）、[exceptions包总结](/blog/ztools-exceptions-pkg/)（`IORuntimeException`）
- 依赖 [log模块总结](/blog/ztools-log-module/)（`StaticLog` 输出连接日志）
- 无第三方库，纯 JDK NIO/AIO（`java.nio.channels`）

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [http模块总结](/blog/ztools-http-module/) — 姊妹网络通信模块
