---
title: 'util 包（通用工具集）总结'
description: 'util 包是 hutool 的「通用工具集」，汇集各类静态工具方法，是使用最频繁的包。43 个工具类按用途分类：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# util 包（通用工具集）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/util`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.util`）

---

## 一、包概览

util 包是 hutool 的「**通用工具集**」，汇集各类静态工具方法，是使用最频繁的包。43 个工具类按用途分类：

| 类别 | 类 | 职责 |
|---|---|---|
| **字符串** | `StrUtil` | 字符串判空、截取、拼接、格式化、驼峰/下划线等（继承 text 包的 `CharSequenceUtil`） |
| **对象** | `ObjectUtil` / `ObjUtil` | 判空、默认值、equals/hashCode、克隆、序列化 |
| **数组** | `ArrayUtil` / `PrimitiveArrayUtil` | 数组判空、拼接、反转、去重、排序、类型转换 |
| **数字/字符** | `NumberUtil` / `RandomUtil` / `CharUtil` / `BooleanUtil` / `ByteUtil` | 数字解析/格式化/运算；随机数；字符/布尔/字节 |
| **反射/类** | `ReflectUtil` / `ClassUtil` / `TypeUtil` / `ModifierUtil` / `EnumUtil` / `ClassLoaderUtil` | 反射调用、类扫描、泛型解析、枚举 |
| **编码/哈希** | `HexUtil` / `HashUtil` / `RadixUtil` / `EscapeUtil` / `CharsetUtil` / `SerializeUtil` | 进制转换、哈希、转义、字符集、序列化 |
| **ID/校验** | `IdUtil` / `CreditCodeUtil` / `IdcardUtil` / `PhoneUtil` / `DesensitizedUtil` | UUID/Snowflake、信用代码、身份证、手机号、脱敏 |
| **系统/运行时** | `RuntimeUtil` / `SystemPropsUtil` / `JdkUtil` / `JNDIUtil` / `ServiceLoaderUtil` / `ConsoleColorsUtil` | 执行命令、系统属性、SPI 加载 |
| **其他** | `ReUtil` / `PageUtil` / `CoordinateUtil` / `URLUtil` / `XmlUtil` / `JAXBUtil` / `ZipUtil` / `VersionUtil` / `DateUtil` / `ReferenceUtil` | 正则、分页、坐标、XML、压缩、版本等 |

---

## 二、核心设计

### 1. StrUtil 继承 CharSequenceUtil

`StrUtil extends CharSequenceUtil implements StrPool` —— 字符串工具继承 text 包的 `CharSequenceUtil`（操作 `CharSequence` 而非仅 String），同时实现 `StrPool` 拿到常用字符串常量（空串、逗号、换行等）。这是「工具类复用 + 常量集中」的典型。

### 2. ObjUtil 继承 ObjectUtil

`ObjUtil extends ObjectUtil` 提供 `obj()` 便捷别名，避免与 JDK 的 `Object` 混淆。大量方法（`isNull`、`defaultIfNull`、`clone`）集中处理 null 安全。

### 3. IdUtil：多种 ID 策略

`IdUtil` 聚合 UUID（`randomUUID`/`simpleUUID`）、Snowflake（雪花算法分布式 ID）、ObjectId（MongoDB 风格）等，用静态方法统一入口。

### 4. 校验/脱敏

`IdcardUtil`（身份证 18 位校验、生日/性别提取）、`CreditCodeUtil`（18 位统一社会信用代码校验）、`PhoneUtil`（手机号校验）、`DesensitizedUtil`（脱敏：手机号/身份证/银行卡打码）。

---

## 三、面试高频问题

**Q1：StrUtil 和 CharSequenceUtil 什么关系？**

- `CharSequenceUtil` 操作 `CharSequence`（String/StringBuilder 的父接口），`StrUtil` 继承它并实现 `StrPool` 拿常量。`isBlank` 区分空串和纯空白串。

**Q2：ObjectUtil.defaultIfNull 解决什么？**

- 减少 `x == null ? default : x` 样板，统一 null 处理，链式更清晰。

**Q3：UUID 和 Snowflake 的区别？**

- UUID 128 位随机，无中心、分布式安全但无序、较长；Snowflake 64 位 = 时间戳 + 机器号 + 序列号，有序、可排序，适合数据库主键。

**Q4：身份证号怎么校验？**

- 前 17 位加权求和，对 11 取模，映射到校验码（含 X）。`IdcardUtil` 用此校验并解析出生日期、性别、地区。

**Q5：什么是脱敏？**

- 数据展示时对敏感信息部分打码（如手机号 `138****5678`），防止泄露。`DesensitizedUtil` 提供多种脱敏策略。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 字符串处理 | `StrUtil` |
| null 安全处理 | `ObjectUtil` |
| 数组操作 | `ArrayUtil` |
| 随机 token/验证码 | `RandomUtil` |
| 分布式主键 | `IdUtil` |
| 反射调用私有方法 | `ReflectUtil` |
| 身份证/手机号/信用代码校验 | `IdcardUtil` / `PhoneUtil` / `CreditCodeUtil` |
| 日志脱敏 | `DesensitizedUtil` |
| 执行 shell 命令 | `RuntimeUtil` |
| 正则匹配 | `ReUtil` |

---

## 五、当前状态

- **文件**：43 个工具类 + `package-info`，与 hutool 5.8.47 对齐。
- **单元测试**：41 个测试类，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。
- **重构**：早返回/平级化改造已完成（13 个文件，见 [util包重构分析](/blog/ztools-util-refactor/)），其余确认无需重构（对称处理/状态机/equals）。

---

## 相关

- [util包重构分析](/blog/ztools-util-refactor/) — 基于 ztools 重构规划的 util 包可调整点
- [text包总结](/blog/ztools-text-pkg/)
- [convert包总结](/blog/ztools-convert-pkg/)
- [lang包总结](/blog/ztools-lang-pkg/)
