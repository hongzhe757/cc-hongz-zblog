---
title: 'cron 模块总结'
description: '是 hutool-cron 的移植镜像，包路径 。共 34 主类，分 5 层：门面/调度、监听、Cron 表达式、任务、时间轮。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

# cron 模块总结（MOC）

> `cc-hongz-ztools-cron` 是 hutool-cron 的移植镜像，包路径 `cc.hongz.ztools.cron`。共 34 主类，分 5 层：门面/调度、监听、Cron 表达式、任务、时间轮。

---

## 分层

- [cron包总结](/blog/ztools-cron-pkg/) — 定时任务（Cron 表达式解析 + 调度器 + 时间轮）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/)、[log模块总结](/blog/ztools-log-module/)、[setting模块总结](/blog/ztools-setting-module/)
- 底层依赖 **Quartz** 2.4.0（`org.quartz-scheduler`，optional，仅兼容 Quartz 风格表达式）

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [cache模块总结](/blog/ztools-cache-module/) — 姊妹模块（TimedCache 过期清理常配合定时任务）
