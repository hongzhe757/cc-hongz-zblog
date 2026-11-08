---
title: 'json 包（JSON 解析与序列化）总结'
description: 'json 包是 JSON 模块的主体（30 类），分 3 层：根包（数据结构 + 门面 + 解析器）、serialize 子包、xml 子包：'
pubDate: 'Aug 31, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "数据"]
category: 'ztools'
---

# json 包（JSON 解析与序列化）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-json/src/main/java/cc/hongz/ztools/json`
>
> 对照基准：hutool 5.8.48（`cn.hutool.json`）

---

## 一、包概览

json 包是 JSON 模块的**主体**（30 类），分 3 层：根包（数据结构 + 门面 + 解析器）、`serialize` 子包、`xml` 子包：

| 类别 | 类 | 职责 |
|---|---|---|
| **统一入口** | `JSONUtil` | JSON 门面（Facade）：`parse`/`toJsonStr`/`quote`/`toBean`/`createObj`/`createArray` |
| **JSON 对象** | `JSONObject` | 键值对集合，`MapWrapper<String,Object>` 实现 + `JSON`/`JSONGetter<String>` 接口 |
| **JSON 数组** | `JSONArray` | 中括号集合，`List<Object>` 实现 + `JSON`/`JSONGetter<Integer>` 接口 |
| **抽象接口** | `JSON` | JSON 公共接口：`getByPath`/`toBean`/`toJSONString`/`write` |
| **类型化读取** | `JSONGetter<K>` | 类型化 Getter 接口（`getStr`/`getInt`/`getBean`/`getDate` 等） |
| **公共基类** | `JSONSupport` | JSON 基类（实现 `JSONString`/`JSONBeanParser`，Bean↔JSON 转换） |
| **配置项** | `JSONConfig` | 键排序/忽略 null/日期格式/transient 支持/去尾零等开关 |
| **类型转换** | `JSONConverter` | JSON 值 → Bean/Map/数组/List 的类型转换器（注册到 core 转换中心） |
| **解析器** | `JSONParser` / `JSONTokener` | 手写 JSON 解析器 + 字符流读取器 |
| **格式化** | `JSONStrFormatter` | JSON 字符串美化（pretty print 缩进） |
| **序列化接口** | `JSONString` | 自定义序列化接口（`toJSONString()`） |
| **null 表示** | `JSONNull` | JSON 的 `null` 单例（区分 Java `null`） |
| **异常** | `JSONException` | JSON 相关运行时异常 |
| **Bean 回调** | `JSONBeanParser<T>` | Bean 自定义反序列化回调（`parse(value)`） |
| **对象映射** | `ObjectMapper` | Bean/Map/Reader/InputStream ↔ JSON 的映射器 |
| **迭代器** | `JSONObjectIter` | JSONObject 迭代器 |
| **内部工具** | `InternalJSONUtil` | 内部工具（quote 转义等） |
| **XML 转换** | `XML` / `XMLTokener` | JSON↔XML 转换门面 + XML 字符读取器 |
| **序列化接口** | `JSONSerializer<T,V>` / `JSONObjectSerializer<V>` / `JSONArraySerializer<V>` | 序列化扩展接口（自定义对象 → `JSONObject`/`JSONArray`） |
| **反序列化接口** | `JSONDeserializer<T>` | 反序列化扩展接口（自定义 JSON → 对象） |
| **序列化写出器** | `JSONWriter` | JSON 数据写出器（继承 `Writer`，缩进/转义写出） |
| **序列化实现** | `TemporalAccessorSerializer` | `TemporalAccessor`（`LocalDate`/`LocalDateTime` 等）时间类型自定义序列化 |
| **序列化映射** | `GlobalSerializeMapping` | 全局序列化/反序列化器映射注册表（`Type` → 自定义序列化器） |
| **XML 解析** | `JSONXMLParser` / `JSONXMLSerializer` / `ParseConfig` | XML→JSON 解析、JSON→XML 序列化、解析配置 |

---

## 二、核心设计

### 1. JSONObject = Map + JSONString

`JSONObject` 继承 `MapWrapper<String, Object>`（本质是 `Map`），同时实现 `JSON` 与 `JSONGetter<String>` 接口。好处：既可直接当 `Map` 用（`put`/`get`/`entrySet`），又有 JSON 语义（`getByPath` 点号路径取值、`toBean` 转实体、`toString` 输出 JSON 字符串）。同理 `JSONArray` 继承 `List<Object>` 并实现 `JSON`/`JSONGetter<Integer>`。

### 2. JSONUtil：门面模式统一入口

`JSONUtil` 聚合解析、序列化、类型转换等全部操作：`parse`（字符串→JSON）、`parseObj`/`parseArray`、`toJsonStr`（对象→JSON 字符串，先转 JSONObject/JSONArray 再 `JSONWriter` 写出）、`quote`（字符串 JSON 转义）、`toBean`（JSON→Bean）。调用方无需关心底层解析器与写出器细节。

### 3. JSONParser / JSONTokener：手写递归下降解析器

hutool-json 不依赖第三方库，自研解析器：`JSONTokener` 负责字符流（`nextClean`/`nextValue`/`syntaxError` 等），`JSONParser` 做递归下降解析（`{` 开头解析对象、`[` 开头解析数组，`parseTo` 支持 `Filter` 对键值对做解析期过滤/改写）。`JSONStrFormatter` 则反方向做缩进格式化。

### 4. JSONConverter：类型转换链

`JSONConverter` 实现 core 的 `Converter<JSON>` 接口，并在静态块注册到 `ConverterRegistry`（`JSON`/`JSONObject`/`JSONArray` 三个类型）。转换逻辑递归：先尝试 JDK 类型转换，失败转 JSON→Bean（`JSONBeanParser` 则回调自定义解析），`JSONArray` 通过 `ArrayConverter`/`Convert.toList` 转数组或泛型 List。`JSON.toBean(Type)` 默认就落到 `JSONConverter.jsonConvert`。

### 5. GlobalSerializeMapping + JSONWriter：可扩展序列化

`serialize` 子包把「对象→JSON」抽象成 `JSONSerializer<T,V>` 函数式接口（`JSONObjectSerializer`/`JSONArraySerializer` 基类）。`GlobalSerializeMapping` 维护 `Type → JSONSerializer/JSONDeserializer` 的全局映射（默认注册 `LocalDate/LocalDateTime/LocalTime` 的 `TemporalAccessorSerializer`），用户可 `put` 自定义序列化器。最终由 `JSONWriter`（继承 `Writer`）按 `indentFactor` 缩进写出 JSON 文本，处理转义与 `JSONConfig` 的开关。

---

## 三、面试高频问题

**Q1：JSONObject 为什么既实现 Map 又实现 JSON 接口？**

为了「既是容器、又是 JSON」。作为 `Map` 子类可以直接参与 `Map` 相关 API 与工具（如 `MapUtil`、遍历），作为 `JSON` 又有 JSON 专属能力：`getByPath`（`a.b[0].c` 点号路径取值）、`toBean`（转实体）、`toJSONString`（序列化）。这是 hutool 相对 Jackson/Gson 的差异点——让 JSON 对象「原生」融入 Java 集合体系，减少 API 割裂。

**Q2：hutool 为什么手写 JSON 解析器，而不是用 Jackson/Gson？**

三个原因：一是零依赖，hutool 核心宗旨是轻量、不强制引入三方库；二是可控性，`JSONConfig` 的诸多开关（忽略 null、去尾零、日期格式、transient）在手写解析/序列化里能精细控制；三是定制点，`Filter`（解析期过滤）、`JSONBeanParser`（自定义反序列化）需要深入解析内部。代价是性能与极端边界 case 不如 Jackson 成熟。

**Q3：JSONConfig 的 `ignoreNullValue` / `stripTrailingZeros` / `transientSupport` 分别解决什么？**

- `ignoreNullValue`：序列化时跳过值为 null 的字段（默认 true），减小体积、接口只传有值字段；
- `stripTrailingZeros`：`5.0` 输出为 `5`，去除无意义的尾零（默认 true）；
- `transientSupport`：是否尊重 `transient` 关键字与 `@Transient` 注解，被标记的字段不参与序列化（默认 true）。

**Q4：JSONNull 为什么用单例而不是直接用 Java 的 null？**

区分「JSON 里的 null 值」和「Java 里的 null 引用」。JSON 中 key 存在但值为 null 是一个有意义的状态，若用 Java `null` 表示，则无法与「key 不存在」区分。`JSONNull.NULL` 单例的 `equals(null)` 返回 true、`toString()` 返回 `"null"`，序列化时能正确输出 `"null"`，同时让「值为 JSON null」成为可判定的对象。

---

## 相关

- [json模块总结](/blog/ztools-json-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — 依赖的 core 能力（convert 转换中心 / bean 反射 / map 容器）
- [jwt模块总结](/blog/ztools-jwt-module/) — 下游模块（jwt 用 JSONObject 解析 token 三段）
