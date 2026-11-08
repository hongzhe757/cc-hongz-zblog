---
title: 'system 模块总结'
description: '是 hutool-system 的移植镜像，包路径 。共 14 个类（+2 package-info），分 2 层：JVM/OS 系统信息采集、oshi 硬件实时信息。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-5.jpg'
---

# system 模块总结（MOC）

> `cc-hongz-ztools-system` 是 hutool-system 的移植镜像，包路径 `cc.hongz.ztools.system`。共 14 个类（+2 package-info），分 2 层：JVM/OS 系统信息采集、oshi 硬件实时信息。

---

## 分层

- [system包总结](/blog/system-pkg/) — 根包 + oshi 子包（合并说明）：`SystemUtil` 统一入口 + 9 个 XxxInfo 信息 POJO + OSHI 硬件封装，共 14 类

---

## 依赖关系

- [system包总结](/blog/system-pkg/) 依赖 [core模块总结](/blog/ztools-core-module/) 的 [util包总结](/blog/ztools-util-pkg/)（`SystemPropsUtil`/`StrUtil`/`Convert`）、[lang包总结](/blog/ztools-lang-pkg/)（`Singleton`）、[net包总结](/blog/ztools-net-pkg/)（`NetUtil`）、[io包总结](/blog/ztools-io-pkg/)（`FileUtil`）
- oshi 子包底层依赖 **oshi-core** 6.6.2，读取 CPU/内存/磁盘/网卡等硬件实时信息

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
