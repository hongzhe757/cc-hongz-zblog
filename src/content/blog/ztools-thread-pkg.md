---
title: 'thread 包（线程与线程池）总结'
description: 'thread 包封装线程、线程池、并发工具：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-4.jpg'
---

# thread 包（线程与线程池）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/thread`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.thread`）

---

## 一、包概览

thread 包封装**线程、线程池、并发工具**：

| 类别 | 类 | 职责 |
|---|---|---|
| **线程池工具** | `ThreadUtil` | 创建线程池、异步执行、sleep、定时任务、关闭线程池等 |
| **线程池构建** | `ExecutorBuilder` / `ThreadFactoryBuilder` | 链式构建 `ThreadPoolExecutor`；构建 `ThreadFactory` |
| **线程工厂** | `NamedThreadFactory` / `NamedThreadLocal` / `NamedInheritableThreadLocal` | 命名线程；命名 ThreadLocal |
| **全局池** | `GlobalThreadPool` | 全局单例线程池 |
| **拒绝策略** | `RejectPolicy` / `BlockPolicy` | 拒绝执行时的策略（异常、丢弃、阻塞等） |
| **线程池包装** | `DelegatedExecutorService` / `FinalizableDelegatedExecutorService` | 只暴露 `ExecutorService` 子集、GC 时自动 shutdown |
| **并发测试** | `ConcurrencyTester` | 并发压测，统计结果 |
| **同步分批** | `SyncFinisher` | 分批同步执行任务，统一等待 |
| **信号量** | `SemaphoreRunnable` | 用 `Semaphore` 限制并发数的 Runnable 包装 |
| **异步** | `AsyncUtil` | 异步执行、串行等待、allOf/anyOf |
| **锁（lock 子包）** | `LockUtil` / `NoLock` / `NoReadWriteLock` / `SegmentLock` | 锁工具、空锁、分段锁 |

---

## 二、核心设计

### 1. ExecutorBuilder：线程池的建造者

`ThreadPoolExecutor` 构造参数多达 7 个，`ExecutorBuilder` 用建造者模式链式设置核心/最大线程数、队列、拒绝策略、线程工厂，`build()` 产出池。

### 2. DelegatedExecutorService：只暴露部分方法

普通 `ThreadPoolExecutor` 的 `shutdown` 等管理方法可被业务误调。`DelegatedExecutorService` 只委托 `ExecutorService` 接口方法，隐藏线程池管理细节；`FinalizableDelegatedExecutorService` 在对象被 GC 时自动 `shutdown`，防止线程泄漏。

### 3. ConcurrencyTester：并发压测

给定任务和并发线程数，多线程同时执行并收集耗时/异常，用于验证并发安全性和性能。

### 4. SyncFinisher：分批同步

把一批任务分给多线程执行，`await` 统一等待全部完成，适合「并发调用 N 个接口后汇总」。

### 5. 分段锁 SegmentLock

按 key 的 hashCode 分到多个段，每段一把锁，降低锁粒度、提高并发（类似 `ConcurrentHashMap` 的分段思想）。

---

## 三、面试高频问题

**Q1：ThreadPoolExecutor 的核心参数？**

- corePoolSize（核心线程数）、maximumPoolSize（最大线程数）、keepAliveTime（空闲回收）、workQueue（任务队列）、threadFactory、handler（拒绝策略）。hutool 的 `ExecutorBuilder` 就是封装这 7 个参数。

**Q2：线程池拒绝策略有哪些？**

- AbortPolicy（抛异常，默认）、CallerRunsPolicy（调用者执行）、DiscardPolicy（丢弃）、DiscardOldestPolicy（丢弃最旧）。hutool 的 `BlockPolicy` 提供「阻塞等待」策略。

**Q3：为什么不直接用 `Executors.newFixedThreadPool`？**

- 它用无界队列（`LinkedBlockingQueue`），任务堆积时可能 OOM；且线程池管理方法裸露易误用。推荐显式构造或 `ExecutorBuilder`。

**Q4：分段锁解决什么问题？**

- 一把大锁时所有 key 竞争同一锁，并发差。分段锁按 key 分散到多把锁，不同段的 key 可并行，提高吞吐。

**Q5：ThreadLocal 内存泄漏怎么避免？**

- ThreadLocal 的 key 是弱引用，但 value 是强引用；线程存活时 value 不会被回收。用完 `remove()` 是关键。`NamedThreadLocal` 只是加了名字便于排查。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 快速创建线程池 | `ThreadUtil.newExecutor` / `ExecutorBuilder` |
| 异步提交任务 | `ThreadUtil.execute` |
| 定时任务 | `ThreadUtil.schedule` |
| 并发压测 | `ConcurrencyTester` |
| 分批并发调用后汇总 | `SyncFinisher` |
| 限制某段逻辑并发数 | `SemaphoreRunnable` |
| 隐藏线程池管理方法 | `DelegatedExecutorService` |
| 分段锁提升并发 | `SegmentLock` |

---

## 五、当前状态

- **文件**：15 个顶层类 + lock/threadlocal 子包，与 hutool 5.8.47 对齐。
- **单元测试**：21 个测试类，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。

---

## 相关

- [lang包总结](/blog/ztools-lang-pkg/)
