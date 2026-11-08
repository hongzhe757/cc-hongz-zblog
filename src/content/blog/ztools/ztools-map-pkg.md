---
title: 'map 包（Map 增强）总结'
description: 'map 包围绕 java.util.Map 做创建、装饰、增强，可分成几类：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# map 包（Map 增强）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/map`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.map`）

---

## 一、包概览

map 包围绕 `java.util.Map` 做**创建、装饰、增强**，可分成几类：

| 类别 | 类 | 职责 |
|---|---|---|
| **创建** | `MapBuilder` / `MapUtil` | 链式创建 Map；Map 工具类（创建/转换/过滤/排序/`getXXX` 类型取值） |
| **装饰基类** | `MapWrapper` | Map 包装器基类，包装已有 Map 增加行为 |
| **key 增强** | `FuncKeyMap` / `CustomKeyMap` / `CaseInsensitiveMap` 系列 / `CamelCaseMap` 系列 | 自定义 key 生成、忽略大小写、驼峰命名 |
| **value 转换** | `TransMap` / `FuncMap` | 存入/取出时转换 value |
| **树形结构** | `ForestMap` / `LinkedForestMap` / `TreeEntry` | 森林（多棵树的集合）、树节点 |
| **二维表** | `TableMap` / `Table` / `RowKeyTable` / `AbsTable` | 二维映射（行 + 列 → 值） |
| **双向/容忍** | `BiMap` / `TolerantMap` | 双向查找；容忍空值/异常 |
| **代理** | `MapProxy` | Map 代理，实现 `Bean` 接口，支持 `map.getXXX` 类型取值 |
| **并发/引用** | `SafeConcurrentHashMap` / `ReferenceConcurrentMap` / `WeakConcurrentMap` / `SoftConcurrentMap` / `WeakKeyConcurrentMap` | 并发安全、软/弱引用 key/value |
| **固定容量** | `FixedLinkedHashMap` | 固定大小，超出淘汰最旧（LRU） |
| **多值（multi 子包）** | `ListValueMap` / `SetValueMap` / `CollectionValueMap` | 一个 key 对应多个 value |

---

## 二、核心设计

### 1. 装饰器模式：MapWrapper

`MapWrapper` 包装一个已有 `Map`，实现全部 Map 接口方法并委托给被包装 Map，子类只需覆盖关心的方法。`FuncKeyMap`（转换 key）、`TransMap`（转换 value）都基于它。

### 2. ForestMap 树/森林

`ForestMap` 是 `Map<K, TreeEntry<K, V>>`，value 是树节点 `TreeEntry`（含父节点、子节点列表）。多棵互不相连的树构成「森林」，支持 `getRoot`、`getChildren`、`putNode` 等树操作。

### 3. TableMap 二维映射

`Table<K, R, V>` 用「行 key + 列 key」定位一个值，内部是 Map 套 Map（`RowKeyTable` 用链表优化）。适合矩阵、交叉统计等二维数据。

### 4. BiMap 双向查找

`BiMap` 维护 key→value 和 value→key 两个方向，`getKey(value)` 反向查找。要求 value 唯一。

### 5. 引用类型 Map（内存敏感）

`WeakConcurrentMap`/`SoftConcurrentMap` 用弱/软引用持有 key 或 value，GC 时可回收，适合做缓存避免内存泄漏。

### 6. MapProxy：Map → Bean

`MapProxy` 实现 `Bean` 接口（从而实现全部 getter 接口），让 `Map` 支持 `map.getInt("age")` 这类类型化取值。

---

## 三、面试高频问题

**Q1：MapWrapper 装饰器模式有什么好处？**

- 不修改原 Map 的前提下叠加功能（key 转换、value 转换、大小写、驼峰），可层层包装，符合开闭原则。

**Q2：CaseInsensitiveMap 怎么实现忽略大小写？**

- 存入时把 key 统一转小写（或 TreeMap 用大小写不敏感比较器），查询时同样转换，从而 `get("Name")` 和 `get("NAME")` 等价。

**Q3：弱引用 Map 有什么用？什么时候用？**

- key/value 用 `WeakReference`/`SoftReference` 持有，GC 时可回收。适合做「key 生命周期不受控」的缓存，避免强引用导致对象无法回收（内存泄漏）。

**Q4：Table（二维 Map）和 Map 套 Map 的区别？**

- 本质相同，但 Table 封装了行列操作（put/getRow/getColumn/values），语义更清晰，且 `RowKeyTable` 用链表优化了行遍历。

**Q5：LRU 怎么用 FixedLinkedHashMap 实现？**

- 继承 `LinkedHashMap` 且 `removeEldestEntry` 返回 true（超容量时），最早访问的条目自动淘汰。`FixedLinkedHashMap` 固定容量实现此逻辑。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 链式构建 Map | `MapBuilder` |
| 忽略大小写的配置 key | `CaseInsensitiveMap` |
| key 加前缀/后缀/编码 | `FuncKeyMap` / `CustomKeyMap` |
| 树形菜单/组织架构 | `ForestMap` / `LinkedForestMap` |
| 交叉统计/矩阵 | `TableMap` / `Table` |
| key 与 value 双向查找 | `BiMap` |
| 缓存（可回收） | `WeakConcurrentMap` / `SoftConcurrentMap` |
| Map 转 Bean 风格取值 | `MapProxy` |
| 固定容量缓存淘汰 | `FixedLinkedHashMap` |

---

## 五、当前状态

- **文件**：24 个顶层类 + multi/reference 子包，与 hutool 5.8.47 对齐。
- **单元测试**：23 个测试类，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。

---

## 相关

- [collection包总结](/blog/ztools-collection-pkg/)
- [getter包总结](/blog/ztools-getter-pkg/)
