---
title: 'stream 包（Stream 工具）总结'
description: 'stream 包对 JDK Stream/Collector 做增强，共 3 个类：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# stream 包（Stream 工具）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/stream`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.stream`）

---

## 一、包概览

stream 包对 JDK `Stream`/`Collector` 做增强，共 3 个类：

| 类 | 职责 |
|---|---|
| `StreamUtil` | 数组/集合/迭代器/文件 → `Stream` 的便捷转换，以及 `Stream` 的 join、分组等增强 |
| `SimpleCollector<T,A,R>` | `Collector` 接口的通用实现，把 supplier/accumulator/combiner/finisher 作为参数传入，免去为每种收集写一个匿名类 |
| `CollectorUtil` | 预置常用 `Collector`：join（带分隔符/前后缀）、映射、转 List/Map 等 |

---

## 二、核心设计

### 1. SimpleCollector：Collector 的通用化

`Collector` 接口要求实现 5 个方法（supplier/accumulator/combiner/finisher + characteristics），很啰嗦。`SimpleCollector` 把它们变成构造参数，用 lambda 一次性传入，实现「一个类适配所有收集逻辑」。

### 2. Characteristics 特征值

`SimpleCollector` 特别解释了三个特征值：`CONCURRENT`（结果容器线程安全、并行流共享一个容器）、`UNORDERED`（元素无序）、`IDENTITY_FINISH`（中间容器与最终结果同类型，跳过 finisher）。正确设置才能让并行流高效工作。

### 3. CollectorUtil.join

把 `Collectors.joining` 推广到任意对象（默认 `toString`），支持分隔符、前缀、后缀，是字符串拼接的流式写法。

---

## 三、面试高频问题

**Q1：Collector 的 supplier/accumulator/combiner/finisher 分别是什么？**

- supplier 创建结果容器；accumulator 把每个元素累加进容器；combiner 合并两个容器（并行流用）；finisher 把容器转成最终结果。

**Q2：并行流里 combiner 什么时候执行？**

- 只有在并行流且收集器**不**具备 CONCURRENT 特征时才会调用 combiner。设了 CONCURRENT 则多线程共享同一个容器，容器必须线程安全。

**Q3：IDENTITY_FINISH 有什么用？**

- 表示中间容器类型与结果类型一致，finisher 不会被调用。省去一步转换，`toList` 就属于这类。

**Q4：什么时候用 StreamUtil 而不是直接 Stream？**

- 当数据源不是现成集合时（数组、迭代器、文件、Iterable），StreamUtil 封装了 `StreamSupport.stream` 等样板代码。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 字符串 join（带分隔符/前后缀） | `CollectorUtil.joining` |
| 自定义收集逻辑 | `SimpleCollector` |
| 迭代器/文件转流 | `StreamUtil.of / ofIterator` |
| 数组转流 | `StreamUtil.of` |

---

## 五、当前状态

- **文件**：3 个类 + `package-info`，与 hutool 5.8.47 对齐。
- **单元测试**：3 个测试类，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。

---

## 相关

- [collection包总结](/blog/ztools-collection-pkg/)
- [io包总结](/blog/ztools-io-pkg/)
