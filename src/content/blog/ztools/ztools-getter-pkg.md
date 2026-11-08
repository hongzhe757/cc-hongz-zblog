---
title: 'getter 包（取值器接口）总结'
description: 'getter 包把「从一个 key 对应的容器里取出不同类型的值」抽象成一组接口。它本身不含任何实现类（只有接口 + package-info），是 Bean、Dict、Opt、JSONObject 等数据容器的统一取值基座。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# getter 包（取值器接口）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/getter`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.getter`）

---

## 一、包概览

getter 包把「**从一个 key 对应的容器里取出不同类型的值**」抽象成一组**接口**。它本身**不含任何实现类**（只有接口 + `package-info`），是 `Bean`、`Dict`、`Opt`、`JSONObject` 等数据容器的统一取值基座。

| 类别 | 接口 | 职责 |
|---|---|---|
| **基本类型取值** | `BasicTypeGetter<K>` | `getObj/getStr/getInt/getLong/getBool/getChar/getByte/getShort/getFloat/getDouble/getBigDecimal/getBigInteger/getEnum/getDate` 等 |
| **带默认值取值** | `OptBasicTypeGetter<K>` | 同名方法追加 `defaultValue` 参数，取不到时返回默认值 |
| **null 安全取值** | `OptNullBasicTypeGetter<K>` / `OptNullBasicTypeFromStringGetter` / `OptNullBasicTypeFromObjectGetter` | key 缺失或转换失败返回 `null` 而非抛异常；后两者限定数据来源（字符串 / 对象） |
| **数组取值** | `ArrayTypeGetter` / `OptArrayTypeGetter` | `getObjs/getStrs/getInts...` 批量取数组，后者带默认值 |
| **列表 / 分组取值** | `ListTypeGetter` / `GroupedTypeGetter` | 取 `List`；按「组名」分组后再取值 |

---

## 二、核心设计

### 1. 接口分层：基础 → 默认值 → null 安全

```
BasicTypeGetter<K>                      // 基础取值（无默认值）
OptBasicTypeGetter<K>                   // + defaultValue
OptNullBasicTypeGetter<K>               // 继承上两者，缺 key 返回 null
 ├── OptNullBasicTypeFromStringGetter   // 值来源限定为字符串
 └── OptNullBasicTypeFromObjectGetter   // 值来源限定为对象
```

核心思想：**同一套 key→value 语义，用不同接口表达「取不到值时怎么办」**——是抛异常、返回默认值、还是返回 `null`，由实现方按需组合。

### 2. 组合实现（接口继承 vs 多接口实现）

- `Bean` 接口同时继承这一系列 getter 接口，一个类即拥有全部取值能力。
- 数组 / 列表 / 分组（`ArrayTypeGetter`、`ListTypeGetter`、`GroupedTypeGetter`）是独立接口，供需要批量取值的数据结构按需实现。

### 3. 为什么要默认值 / null 安全

配置、HTTP 参数、JSON 对象取值时 key 常缺失或类型不符。默认值版本省去到处写 `obj == null ? 0 : obj`；null 安全版本让「缺 key」与「值就是 null」统一返回 `null`，减少 NPE 与重复判空。

---

## 三、面试高频问题

**Q1：getter 接口解决什么问题？直接用 `Map.get` 不好吗？**

- `Map.get` 返回 `Object`，调用方要强转、判空、处理类型不符。getter 把类型转换和默认值封装起来，`getInt/getStr` 直接返回目标类型，更安全简洁。

**Q2：`OptBasicTypeGetter` 和 `OptNullBasicTypeGetter` 的区别？**

- `Opt` 系列方法都带 `defaultValue` 参数；`Null` 系列额外保证「key 缺失或转换失败返回 `null` 而不是抛异常」。`OptNull` 继承两者，兼具默认值与 null 安全。

**Q3：为什么要区分 `FromString` 和 `FromObject`？**

- 数据来源不同、转换策略不同：字符串可能要 trim、判空、parse；对象可能要 `toString` 或类型判断。分开接口让实现类明确自己处理哪种来源。

**Q4：这么多 `getInt/getLong/...` 是过度设计吗？**

- 不是。这是「接口隔离 + 统一抽象」：不同数据容器（Bean/Dict/Opt/JSON）共享同一取值契约，调用方无需关心底层是反射、Map 还是 JSON。

---

## 四、应用场景

| 场景 | 对应接口 |
|---|---|
| 配置文件读取（缺 key 给默认值） | `OptBasicTypeGetter` |
| HTTP 参数 / 表单解析 | `OptNullBasicTypeFromStringGetter` |
| JSON 对象取值 | `OptNullBasicTypeFromObjectGetter` |
| Bean 属性反射取值 | `BasicTypeGetter`（`Bean` 实现） |
| 批量取数组 / 列表字段 | `ArrayTypeGetter` / `ListTypeGetter` |
| 分组配置读取 | `GroupedTypeGetter` |

---

## 五、当前状态

- **文件**：9 个接口 + `package-info.java`，与 hutool 5.8.47 对齐（纯接口，无实现类）。
- **单元测试**：3 个测试类（`OptNullBasicTypeGetter` / `FromString` / `FromObject`），中文 `@DisplayName`；基础接口由 `Bean`、`Dict` 的实现类间接覆盖。
- **checkstyle**：**0 违规**（接口方法天然满足 javadoc 要求）。

---

## 相关

- [bean与annotation包移植总结](/blog/ztools-bean-annotation-port/)
- [lang包总结](/blog/ztools-lang-pkg/)
