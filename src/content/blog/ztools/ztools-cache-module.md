---
title: 'cache 模块总结'
description: '是 hutool-cache 的移植镜像，包路径 。共 19 主类，分 3 层：缓存接口、文件缓存、缓存实现。'
pubDate: 'Sep 01, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "缓存任务"]
category: 'ztools'
---

# cache 模块总结（MOC）

> `cc-hongz-ztools-cache` 是 hutool-cache 的移植镜像，包路径 `cc.hongz.ztools.cache`。共 19 主类，分 3 层：缓存接口、文件缓存、缓存实现。

---

## 分层

- [cache包总结](/blog/ztools-cache-pkg/) — 缓存（FIFO/LFU/LRU/Timed/Weak/Reentrant 多种策略）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/)（ObjectUtil/MapUtil 等工具）
- 无第三方依赖

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [cron模块总结](/blog/ztools-cron-module/) — 姊妹模块（定时任务，缓存过期清理常用）
