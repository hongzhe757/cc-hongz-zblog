---
title: 'cache 包（缓存）总结'
description: 'cache 包是本地缓存的实现，19 个类分 3 组：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "缓存任务"]
category: 'ztools'
---

# cache 包（缓存）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-cache/src/main/java/cc/hongz/ztools/cache`
>
> 对照基准：hutool 5.8.48（`cn.hutool.cache`）

---

## 一、包概览

cache 包是**本地缓存**的实现，19 个类分 3 组：

| 类别 | 类 | 职责 |
|---|---|---|
| **接口/门面** | `Cache`（接口）/ `CacheUtil`（门面）/ `CacheListener`（监听器）/ `GlobalPruneTimer`（全局清理定时器） | 缓存抽象 + 统一入口 + 过期监听 + 定时清理 |
| **文件缓存** | `AbstractFileCache` / `LFUFileCache` / `LRUFileCache` | 按文件缓存对象，LFU/LRU 两种淘汰 |
| **缓存实现** | `AbstractCache`（基类）/ `CacheObj` / `CacheObjIterator` / `CacheValuesIterator` + `FIFOCache` / `LFUCache` / `LRUCache` / `NoCache` / `ReentrantCache` / `StampedCache` / `TimedCache` / `WeakCache` | 多种缓存策略 |

---

## 二、核心设计

### 1. 多种淘汰策略

- **FIFO**（`FIFOCache`）：先进先出，队列头淘汰。
- **LFU**（`LFUCache`）：最少使用淘汰，按访问次数。
- **LRU**（`LRUCache`）：最近最久未使用，链表 + 访问移动到头。
- **TimedCache**：定时过期，超时未访问即失效。
- **WeakCache**：弱引用，GC 可回收。
- **ReentrantCache** / **StampedCache**：并发优化（ReentrantLock / StampedLock）。

### 2. AbstractCache + CacheObj

`AbstractCache` 抽象了缓存的核心逻辑（容量、超时、清理），内部用 `CacheObj` 包装键值 + 访问时间/次数，实现 `get/put/remove/clear`。子类只重写「淘汰算法」部分（`pruneCache`）。

### 3. 定时清理（GlobalPruneTimer）

`GlobalPruneTimer` 是一个全局守护线程，定时触发所有 `TimedCache` 的过期清理，避免每个缓存各自起线程。

---

## 三、面试高频问题

**Q1：FIFO / LRU / LFU 的区别？**

- FIFO：按**进入时间**淘汰，最简单。
- LRU：按**最近访问时间**淘汰，适合「最近用过的还可能再用」。
- LFU：按**访问频率**淘汰，适合「高频数据长期保留」，但要防历史高频旧数据占位。

**Q2：LRU 怎么用 LinkedHashMap 实现？**

- `accessOrder=true` 的 LinkedHashMap 按访问排序，`removeEldestEntry` 返回 true 时淘汰最老条目。

**Q3：本地缓存和 Redis 的区别？**

- 本地缓存（进程内，快但单机、易不一致）；Redis（分布式，跨进程共享，慢一些但有网络开销）。多级缓存常「本地 + Redis」组合。

---

## 相关

- [cache模块总结](/blog/ztools-cache-module/) — 上级 MOC
- [map包总结](/blog/ztools-map-pkg/) — 底层 Map 容器
