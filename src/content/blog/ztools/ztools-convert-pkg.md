---
title: 'convert 包（类型转换）总结'
description: 'convert 包是 ztools 的类型转换中枢，把任意类型（String / Number / Date / 数组 / 集合 / 枚举 / Optional / UUID…）互相转换，共 49 个文件：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# convert 包（类型转换）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/convert`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.convert`）

---

## 一、包概览

convert 包是 ztools 的**类型转换中枢**，把任意类型（String / Number / Date / 数组 / 集合 / 枚举 / Optional / UUID…）互相转换，共 49 个文件：

| 层次 | 类 | 职责 |
|---|---|---|
| 核心接口 | `Converter<T>` | 转换器接口，`T convert(Object value, T defaultValue)` |
| 抽象基类 | `AbstractConverter<T>` | 转换骨架：null 处理、默认值、类型检查 |
| 注册中心 | `ConverterRegistry` | 转换器注册表，按类型查找/注册转换器（策略 + 工厂） |
| 工具门面 | `Convert` | 静态入口，`Convert.toInt(x)`、`Convert.toStr(x)` 等 |
| 类型匹配 | `TypeConverter` | 处理泛型/类型擦除的转换匹配 |
| 数字格式化 | `NumberChineseFormatter` / `NumberWordFormatter` / `NumberWithFormat` | 数字转中文（大写金额）/ 英文 / 带格式数字 |
| 辅助 | `CastUtil` / `BasicType` / `ConvertException` | 类型强转 / 基本类型枚举 / 转换异常 |
| impl 子包 | 37 个 `XxxConverter` | 具体转换器（Number/Date/Enum/Collection/Array/Map/Optional/UUID/URL…） |

---

## 二、核心设计

### 1. 策略模式 + 注册表

`Converter<T>` 是策略接口，`ConverterRegistry` 维护「类型 → 转换器」的映射：

```java
ConverterRegistry registry = ConverterRegistry.getInstance();
registry.putCustom(MyType.class, MyTypeConverter.class);  // 注册自定义转换器
Convert.convert(MyType.class, "xxx");                      // 走注册表查找转换器
```

转换时先查自定义转换器，再查默认转换器，最后 fallback 到 `toString`/类型强转。

### 2. 转换骨架（模板方法）

`AbstractConverter` 统一处理：

1. value 为 null → 返回 `defaultValue`
2. value 已是目标类型 → 直接返回
3. 否则调用子类 `convertInternal`

子类只需实现核心转换逻辑，null/默认值/类型短路由父类兜底。

### 3. 数字中文格式化（金额大写）

`NumberChineseFormatter.format(1234, true, true)` →「壹仟贰佰叁拾肆元」，支持分/角/元、负号、小数，是财务报销场景的常用能力。

---

## 三、面试高频问题

**Q1：Java 里 String 转 int 有哪几种方式？各自坑在哪？**

- `Integer.parseInt`（严格，抛 `NumberFormatException`）、`Integer.valueOf`（走缓存）、`Convert.toInt`（null 安全，返回默认值）。
- 坑：null、空串、带小数点、前导空格都会抛异常；`Convert.toInt` 内部做了 null/默认值兜底。

**Q2：泛型擦除对类型转换有什么影响？怎么解决？**

- `List<String>` 和 `List<Integer>` 编译后都是 `List`，运行时拿不到元素类型。
- 解决：用 `TypeReference` / 带 `Type` 参数的转换 API（hutool 的 `TypeConverter` 处理 `Type` 匹配），或借助字段/返回值的泛型签名。

**Q3：枚举转换通常怎么实现？**

- 按 `name()`、`ordinal()`、自定义字段（如 code）匹配；hutool 的 `EnumConverter` 支持按名称（忽略大小写）和下标转换。

---

## 四、应用场景

| 场景 | 对应能力 |
|---|---|
| 请求参数转类型 | `Convert.toInt/toLong/toDate`（null 安全） |
| 结果集/Map 转 POJO | `BeanConverter` |
| 数组 ↔ 集合 | `ArrayConverter` / `CollectionConverter` |
| 数字格式化展示 | `NumberWithFormat` |
| 金额转中文大写 | `NumberChineseFormatter` |
| 任意对象转字符串 | `StringConverter` |

---

## 五、当前状态

- **文件/方法**：49 文件（根 12 + impl 37），与 hutool 5.8.47 完全对齐，无缺漏。
- **单元测试**：26 个测试类、198 个用例，中文 `@DisplayName`，全绿（1 个 JDK17 不兼容用例 `@Disabled`）。
- **checkstyle**：**0 违规**。处理要点：tab→4空格、star import 展开、final 参数（重赋值参数改局部变量）、javadoc 句号、whitespace 正则批量修复。

---

## 相关

- [util包总结](/blog/ztools-util-pkg/)
- [lang包总结](/blog/ztools-lang-pkg/)
