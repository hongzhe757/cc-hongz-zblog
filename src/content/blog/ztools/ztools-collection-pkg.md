---
title: 'collection 包（集合工具）总结'
description: 'collection 包围绕迭代器（Iterator）的增强和列表（List）的分区/转换展开，可分成四类：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# collection 包（集合工具）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/collection`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.collection`）

---

## 一、包概览

collection 包围绕**迭代器（Iterator）的增强**和**列表（List）的分区/转换**展开，可分成四类：

| 类别 | 类 | 职责 |
|---|---|---|
| **迭代器接口/基类** | `IterableIter<E>` / `ResettableIter<E>` | 让迭代器可当 `Iterable` 用、可重置复用 |
| **迭代器装饰/转换** | `FilterIter` / `TransIter` / `CopiedIter` / `TransSpliterator` / `EnumerationIter` / `IteratorEnumeration` | 过滤、类型转换、复制、Enumeration 互转 |
| **迭代器组合/抽象** | `IterChain` / `ComputeIter` / `LineIter` / `NodeListIter` / `PartitionIter` / `ArrayIter` | 链式组合、懒计算、按行/节点/分批遍历 |
| **分区与集合** | `Partition` / `AvgPartition` / `RandomAccess*` / `BoundedPriorityQueue` / `ConcurrentHashSet` / `UniqueKeySet` | 列表分块、有界优先队列、并发 Set、唯一键 Set |
| **工具类** | `CollUtil` / `ListUtil` / `RingIndexUtil` / `SpliteratorUtil` / `TransCollection` | 集合/列表操作、环形索引、Spliterator 转换 |

---

## 二、核心设计

### 1. 装饰器模式（Iterator 增强）

核心思想：**包装一个已有 `Iterator`，在不改变其前提下增加行为**。

- `FilterIter`：包装 `Iterator`，用 `Filter` 过滤输出。
- `TransIter`：包装 `Iterator`，用 `Function` 转换元素类型。
- `CopiedIter`：构造时把原迭代器元素**复制**到新 `List`，之后遍历副本。

`CopiedIter` 的意义：解决并发下原 `Iterator` 被修改抛 `ConcurrentModificationException`（fail-fast）的问题——复制后遍历不受原集合改动影响。

### 2. 组合模式 + 模板方法

- **IterChain（组合）**：把多个 `Iterator` 串成一个，`hasNext()`/`next()` 顺序遍历每个子迭代器，用于「集中遍历多个数据源」。
- **ComputeIter（模板方法）**：抽象类，只要求子类实现 `computeNext()`，`hasNext()` 内部做**懒计算 + 缓存**——调用 `hasNext()` 时算出下一个节点并缓存，`next()` 时直接取缓存。

### 3. 分区（Partition）—— 惰性视图

`Partition<T>` 继承 `AbstractList<List<T>>`，把一个大 `List` 按固定长度切成若干子 `List` **视图**（非拷贝）：

- `get(i)` 用 `list.subList(start, end)` 返回原列表的视图。
- 好处：不复制数据，原列表变更分区也可见；适合 `in` 查询分批、接口入参分批等场景。
- `AvgPartition` 是「均分成 N 份」的变体；`RandomAccess*` 实现 `RandomAccess` 标记接口，表示支持下标随机访问。

### 4. 唯一键 Set（UniqueKeySet）

`HashSet` 依赖 `equals/hashCode` 判重；`UniqueKeySet` 改用外部 `Function<V, K>` 生成唯一键，以键判重。适合「对象本身无法修改 equals，但业务上有唯一 ID」的场景。

---

## 三、面试高频问题

**Q1：`Iterator` 和 `Iterable` 的区别？**

- `Iterable` 是「可迭代」，提供 `iterator()` 方法，能用 for-each 遍历；`Iterator` 是「迭代器」，提供 `hasNext()`/`next()`。
- 一个 `Iterable` 可以多次生成新的 `Iterator`；`Iterator` 是一次性游标。hutool 的 `IterableIter` 让迭代器同时实现 `Iterable`，返回 `this`。

**Q2：什么是 fail-fast？`CopiedIter` 怎么规避？**

- Java 集合迭代时若结构被并发修改，会抛 `ConcurrentModificationException`。
- `CopiedIter` 构造时把元素复制到独立 `List`，之后遍历副本，原集合再改也不影响。

**Q3：装饰器模式和代理模式的区别？**

- 装饰器**动态增强功能**（如给 Iterator 加过滤/转换），强调可层层叠加；代理侧重**控制访问**。`FilterIter`/`TransIter` 是典型装饰器。

**Q4：`RandomAccess` 标记接口有什么用？**

- 标记这个 `List` 支持 O(1) 随机访问（如 `ArrayList`）。
- 工具方法可据此选择遍历策略：`RandomAccess` 用 for-i 下标，否则用迭代器，性能更好。

**Q5：`ComputeIter` 为什么要「懒计算 + 缓存」？**

- 计算下一个节点可能昂贵（如读文件一行、网络拉取）。`hasNext()` 时算一次并缓存，`next()` 直接取，避免重复计算，也保证 `hasNext()` 幂等。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 数据库 `in` 查询分批（超过 1000） | `Partition` / `PartitionIter` |
| 接口入参分批调用 | `PartitionIter` |
| 大文件按行读取（懒加载） | `LineIter` |
| 多数据源集中遍历 | `IterChain` |
| 遍历时过滤/转换 | `FilterIter` / `TransIter` |
| 防止并发修改异常 | `CopiedIter` |
| 有界 Top-K / 淘汰末尾 | `BoundedPriorityQueue` |
| 对象无 equals 但按业务键去重 | `UniqueKeySet` |

---

## 五、当前状态

- **文件/方法**：25 个主类，与 hutool 5.8.47 对齐（`CollStreamUtil` 为本会话补齐）。
- **单元测试**：齐全，25 个测试类、中文 `@DisplayName`（`ListUtil` 39 用例、`IterUtil` 20 用例等）。
- **checkstyle**：**0 违规**。处理要点：`CollUtil`/`IterUtil` 等 hutool 无私有构造的工具类用 `@SuppressWarnings("checkstyle:HideUtilityClassConstructor")`；单行 `if/for` 块拆多行（LeftCurly）；方法内重赋值的参数（如 `ListUtil.sub` 的 start/end/step）改用局部变量。

---

## 相关

- [map包总结](/blog/ztools-map-pkg/)
- [lang包总结](/blog/ztools-lang-pkg/)
