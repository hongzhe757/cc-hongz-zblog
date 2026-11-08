---
title: 'log 模块总结'
description: '是 hutool-log 的移植镜像，包路径 。共 34 类，分 3 层：日志门面（根包）、9 个日志框架方言（dialect 子包，适配 10 种实现）、带级别前缀的包装（level 子包）。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "框架"]
---

# log 模块总结（MOC）

> `cc-hongz-ztools-log` 是 hutool-log 的移植镜像，包路径 `cc.hongz.ztools.log`。共 34 类，分 3 层：日志门面（根包）、9 个日志框架方言（dialect 子包，适配 10 种实现）、带级别前缀的包装（level 子包）。

---

## 分层

- [log包总结](/blog/ztools-log-pkg/) — 根包门面（`LogFactory`/`StaticLog`/`Log`/`AbstractLog`）+ dialect 9 个子包（日志框架适配）+ level 子包（级别前缀包装）

> dialect 子包按日志框架拆分：console、jdk、slf4j、log4j、log4j2、commons、logtube、tinylog、jboss。其中 tinylog 包同时含 TinyLog 1.x 与 TinyLog2 2.x 两套实现，故共适配 10 种日志实现。level 子包与根包体量小，均归入 [log包总结](/blog/ztools-log-pkg/) 一并说明。

---

## 依赖关系

- [log包总结](/blog/ztools-log-pkg/) 依赖 [core模块总结](/blog/ztools-core-module/)（`ResourceUtil`/`CallerUtil`/`StrUtil`/`ServiceLoaderUtil`/`SafeConcurrentHashMap`/`ExceptionUtil`）
- 底层日志框架全部声明为 `optional=true`（slf4j-api 2.0.13、log4j 1.2.17、log4j-api 2.25.3、commons-logging 1.3.3、tinylog 1.3.6、tinylog-api 2.7.0），编译期可见、运行期按 SPI 顺序自动探测

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
