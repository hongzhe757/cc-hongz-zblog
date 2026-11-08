---
title: 'util 包重构分析'
description: '依据：ztools重构规划'
pubDate: 'Sep 02, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["工程", "ztools", "基础核心"]
category: 'engineering'
---

# util 包重构分析

> 依据：[ztools重构规划](/blog/ztools-refactor-plan/)
>
> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/util`
>
> 分析日期：2026-09-02

---

## 一、扫描范围

util 目录共 **44 个 `.java` 文件（27711 行）**，均为 hutool 迁移来的**静态工具类**。

> 受 [ztools重构规划](/blog/ztools-refactor-plan/) §九.4「API 兼容红线」约束：public 方法签名不能动，只改方法内部结构。因此可调整点集中在**早返回 / 平级化**与**健壮性**两类，结构层面的重复代码需谨慎。

---

## 二、可调整项

### 1. 早返回改造（最大机会，规划 §1）

**典型违规模式**：`PrimitiveArrayUtil` / `ArrayUtil` 的 `indexOf` / `lastIndexOf` / `contains` 系列，主逻辑被 `if (isNotEmpty)` 包裹：

```java
// 现状（规划 §1.2 空集合优先返回的反例）
public static int indexOf(final long[] array, final long value) {
    if (isNotEmpty(array)) {
        for (int i = 0; i < array.length; i++) {
            if (value == array[i]) {
                return i;
            }
        }
    }
    return INDEX_NOT_FOUND;
}
```

应改为早返回（与规划 §六 `getValue` 示例同构）：

```java
public static int indexOf(final long[] array, final long value) {
    if (isEmpty(array)) {
        return INDEX_NOT_FOUND;
    }
    for (int i = 0; i < array.length; i++) {
        if (value == array[i]) {
            return i;
        }
    }
    return INDEX_NOT_FOUND;
}
```

**涉及面**（深层 if 缩进 ≥12 空格计数）：

| 文件 | 深层 if 数 | 备注 |
|---|---|---|
| `PrimitiveArrayUtil` | 69 | 8 种基本类型 × indexOf/lastIndexOf，重复度最高 |
| `ArrayUtil` | 34 | 对象数组版同款 |
| `XmlUtil` | 27 | 含大量 XML 解析嵌套 |
| `NumberUtil` | 25 | |
| `ReflectUtil` | 21 | |
| `HashUtil` | 13 | |
| `URLUtil` / `TypeUtil` | 9 | |
| `ZipUtil` / `EscapeUtil` | 8 | |

### 2. 异常处理规范化（规划 §九.2）

**宽泛 `catch (Exception)`**：`ReflectUtil`(7)、`ClassUtil`(3)、`ObjectUtil`(2)、`JAXBUtil`(2)。

- **可保留**：`ReflectUtil.java:873/895/907/932/943` 的 `newInstance` 系列，`catch (Exception e)` 后立即重包装成 `UtilException` 抛出（翻译异常，收窄收益低）。
- **应处理的空 catch / 吞异常**（规划要求「补日志或重新抛出」）：

| 位置 | 现状 |
|---|---|
| `ReflectUtil.java:990-991` | `// ignore`（默认构造不存在） |
| `ReflectUtil.java:1015-1016` | `catch (Exception ignore)` |
| `CharsetUtil.java:57` | `// ignore` |
| `ClassUtil.java:406` | `// ignore` |
| `IdUtil.java:161/187` | `// ignore` |
| `URLUtil.java:435` | `// ignore` |
| `XmlUtil.java:299/1373` | `// ignore` |
| `NumberUtil.java:2846` | `// 忽略解析错误` |

### 3. 魔法数字提取常量（规划 §九.1）

仅 **2 处** `@SuppressWarnings("checkstyle:MagicNumber")`：

- `HashUtil.java:14`（整类级，哈希算法魔数，多为算法规范常数）
- `IdcardUtil.java:26`（整类级，身份证加权因子、模数 11/10/2 等）

建议把有业务含义的提成命名常量（如 `ID_CARD_WEIGHTS`、`MOD_11`），无含义的算法常数才保留 SuppressWarnings。其余 32 处 `@SuppressWarnings("unchecked")` 与重构无关，忽略。

### 4. 作者/版本信息（规划 §七，必做项）

当前 javadoc 均为 `@author looly` + hutool 原 `@since 5.x`。**任何动过的类/方法**需补 `@author hongz` 并追加 `@since 0.0.2`，原作者信息保留。不单独跑，伴随每处重构一起落。

---

## 三、推进顺序（优先级）

- [ ] **P1** `PrimitiveArrayUtil` 的 `indexOf/lastIndexOf/contains` 早返回改造（最机械、贴合 §1.2，作「一方法一提交」示范，验证 `@since 0.0.2` 约定）
- [ ] **P1** 补空 catch 日志（上表 `// ignore` 处补 debug/warn 或注明吞异常理由）
- [ ] **P2** `ArrayUtil` → `NumberUtil` → `ReflectUtil` 早返回，逐个推进
- [ ] **P3** 魔法数字常量提取（`HashUtil` / `IdcardUtil`）

## 四、不建议动

- `PrimitiveArrayUtil` 里 8 种基本类型各写一遍 `indexOf` 是 hutool 为**避免装箱开销**的有意重复（规划 §九.4「不盲目展开 / 现代化谨慎」），泛型化会破坏性能语义，保留原样。

---

## 五、重构结果（2026-09-02 已完成）

44 个文件全部检查完，**13 个文件已重构**，其余确认无需改动（对称处理/状态机/equals/循环内）。

**已重构**：

| 文件 | 方法 | 类型 |
|---|---|---|
| `PrimitiveArrayUtil` | `indexOf`/`lastIndexOf` × 16 | 早返回 |
| `ArrayUtil` | `isEmpty`/`setOrAppend`/`indexOfIgnoreCase`/`lastIndexOf` | 早返回/平级化 |
| `NumberUtil` | `range`/`appendRange` | 边界早返回 |
| `ReflectUtil` | `getFieldsValue` | null 早返回 |
| `HashUtil` | `universal` | 位掩码提取常量 |
| `ObjectUtil` | `clone` | null 早返回 |
| `BooleanUtil` | `toBooleanObject` | blank 早返回 |
| `ReUtil` | `getAllGroupNames`/`delLast` | 早返回 |
| `EnumUtil` | `getEnums2` | 缓存命中早返回 |
| `ClassLoaderUtil` | `getClassLoader` | fallback 早返回 |
| `DateUtil` | `age` | 嵌套平级化 |
| `IdcardUtil` | `convert15To18`/`isValidCard15` | else 平级化 |
| `ModifierUtil` | `removeFinalModify` | 嵌套早返回 |

**处理决策**：
- 异常规范化（空 catch/宽泛 catch）经核对是 hutool 有意 fallback 或翻译异常，保持原样。
- 魔法数字仅 HashUtil 的 `universal` 位掩码提取常量（补齐 `ZOBRIST_BIT_0/1/2/6/7`），IdcardUtil 的身份证加权因子/模数保留类级 SuppressWarnings。
- main 源码 checkstyle **0 违规**，每处重构单测全绿，已三层推送（core → ztools → parent）。

---

## 相关

- [util包总结](/blog/ztools-util-pkg/)
- [ztools重构规划](/blog/ztools-refactor-plan/)
- [ztools项目约定与工作流](/blog/ztools-workflow/)
