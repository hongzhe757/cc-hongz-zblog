---
title: 'comparator 包（比较器）总结'
description: 'comparator 包是 java.util.Comparator 的各种实现与封装，围绕「怎么比较两个对象」展开：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

# comparator 包（比较器）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/comparator`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.comparator`）

---

## 一、包概览

comparator 包是 `java.util.Comparator` 的**各种实现与封装**，围绕「怎么比较两个对象」展开：

| 类别 | 类 | 职责 |
|---|---|---|
| **基础/默认** | `ComparableComparator<E>` | 调用 `Comparable.compareTo` 的默认比较器（单例） |
| **null 安全** | `NullComparator<T>` | 包装比较器，处理 null（null 最大/最小可配） |
| **反转** | `ReverseComparator<E>` | 反转排序方向 |
| **链式组合** | `ComparatorChain<E>` | 多个比较器按顺序依次比较，相等则转向下一个 |
| **函数/字段** | `FuncComparator<T>` / `FieldComparator<T>` / `FieldsComparator<T>` / `PropertyComparator<T>` | 按函数结果 / 单个字段 / 多个字段 / Bean 属性比较 |
| **特定排序** | `IndexedComparator` / `InstanceComparator` / `LengthComparator` / `VersionComparator` / `PinyinComparator` / `WindowsExplorerStringComparator` | 按数组顺序 / 类型顺序 / 字符串长度 / 版本号 / 拼音 / Windows 资源管理器规则 |
| **工具/异常** | `CompareUtil` / `ComparatorException` | null 安全比较、异常包装 |

---

## 二、核心设计

### 1. 策略模式（Strategy）

`Comparator` 接口本身就是策略模式的体现：排序算法固定（`sort`），比较策略可变（传入不同 `Comparator`）。

```java
list.sort(new PinyinComparator());          // 按拼音
list.sort(new VersionComparator());         // 按版本号
list.sort(new NullComparator<>(true, cmp)); // null 最大
```

同一个 `List.sort`，传入不同策略得到不同结果——这就是「算法与策略分离」。

### 2. 装饰器模式（增强已有比较器）

- **`NullComparator`**：包装一个 `Comparator`，在其前后插入 null 判断。原比较器不用关心 null，职责清晰。
- **`ReverseComparator`**：包装后交换 `o1`/`o2` 顺序，实现反转，不改动原比较器。

```java
new ReverseComparator<>(new PinyinComparator())  // 拼音反序
```

### 3. 组合模式（ComparatorChain）

`ComparatorChain` 持有多个比较器，`compare` 时按顺序逐个比较，**相等则继续下一个，不相等立即返回**。实现「先按 A 排，A 相同再按 B 排」的多级排序。

```java
new ComparatorChain<>(cmp1, cmp2, cmp3)
```

`FieldsComparator` 是它的简化版：按多个字段依次比较。

### 4. null 安全的比较逻辑

`CompareUtil.compare(a, b)` 的核心规则：

1. `a == b`（同引用或同为 null）→ 0
2. `a == null` → -1（或 isNullGreater 时 +1）
3. `b == null` → +1
4. 都非 null → `a.compareTo(b)`，或退化为 `equals`/`hashCode`/`toString` 比较

---

## 三、面试高频问题

**Q1：`Comparable` 和 `Comparator` 的区别？**

- `Comparable`：对象**自身**实现 `compareTo`，定义「自然顺序」，排序逻辑耦合在类内部（如 `String`）。
- `Comparator`：**外部**比较器，定义「外部策略」，不改动被比较类，可随意组合、反转（如按姓名、按年龄多种排序）。

**Q2：`Comparator` 怎么实现多级排序？**

- 链式：`cmp1.thenComparing(cmp2)`，或 hutool 的 `ComparatorChain`。
- 逻辑：先比 `cmp1`，结果非 0 直接返回；为 0 再比 `cmp2`。

**Q3：比较时怎么处理 null？**

- `Comparator.nullsFirst/nullsLast`（JDK）或 hutool 的 `NullComparator`。
- 直接 `o1.compareTo(o2)` 遇到 null 会 NPE，需要包装处理。

**Q4：为什么 `compare` 的返回值约定是 -1/0/1？**

- 负值表示 o1 < o2，0 相等，正值 o1 > o2。排序算法据此决定交换，`compareTo` 与 `equals` 语义应尽量一致。

**Q5：`Comparator` 与 `equals` 不一致会有什么问题？**

- `TreeSet`/`TreeMap` 用 `compareTo`/`compare` 判重，若 `compare == 0` 但 `equals == false`，会被当作同一个元素覆盖。`FuncComparator.compareSelf` 参数就是为了「字段值相同但对象不同」时避免误去重。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 列表多字段排序 | `FieldsComparator` / `ComparatorChain` |
| Bean 属性排序（含嵌套/Map） | `PropertyComparator` |
| 中文拼音排序 | `PinyinComparator` |
| 版本号排序 | `VersionComparator` |
| 按枚举/白名单顺序排序 | `IndexedComparator` |
| null 元素安全排序 | `NullComparator` |
| 字符串按「文件名数字」排序 | `WindowsExplorerStringComparator` |

---

## 五、当前状态

- **文件/方法**：18 个主类，**已补齐 hutool 缺失的 9 个文件**（`BaseFieldComparator` / `FieldComparator` / `FieldsComparator` / `ComparatorChain` / `InstanceComparator` / `LengthComparator` / `ReverseComparator` / `WindowsExplorerStringComparator` / `package-info`），另补 `IndexedComparator` 私有构造器与 `ArrayIndexedComparator`（benchmark 辅助类）。
- **单元测试**：11 个测试类 + 补齐 `WindowsExplorerStringComparatorTest` / `Issue3259Test`，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。`CompareUtil` 等 hutool 无私有构造的工具类用 `@SuppressWarnings("checkstyle:HideUtilityClassConstructor")`。

---

## 相关

- [collection包总结](/blog/ztools-collection-pkg/)
- [util包总结](/blog/ztools-util-pkg/)
