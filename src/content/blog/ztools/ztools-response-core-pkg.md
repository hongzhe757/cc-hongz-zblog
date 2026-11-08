---
title: '核心与工厂 包（响应结构定义与转换）总结'
description: '性质：自有模块（非 hutool 移植）'
pubDate: 'Aug 31, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "框架", "基础核心"]
category: 'ztools'
---

# 核心与工厂 包（响应结构定义与转换）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-response/src/main/java/cc/hongz/ztools/response`（根包）+ `core`/`generic`/`custom` 子包
>
> 性质：自有模块（非 hutool 移植）

---

## 一、包概览

该层是 response 模块的**地基**：定义核心响应结构，并提供「从零创建」与「结构互转」两套统一入口，共 10 个类：

| 类别 | 类 | 职责 |
|---|---|---|
| **统一门面** | `ResponseFactory` | 响应工厂（Facade）：几十个静态方法快速创建任意响应结构，无需记忆类位置 |
| **转换器** | `ResponseConverter` | 响应结构互转（Adapter/Facade）：大量 `toXxx`/`xxxToYyy` + `isSuccess`/`extractData` |
| **转换工厂** | `ResponseConverterFactory` | 转换策略注册表 + 工厂方法（Factory + Registry）：`register`/`getStrategy`/`convert` |
| **转换策略** | `ResponseConversionStrategy` | 策略接口（`@FunctionalInterface`），`convert` + `andThen` 组合 + `identity` 空操作 |
| **转换链** | `ConversionChainBuilder` | 链式转换构建器（Builder + 责任链）：`from().to().thenTo().execute()` |
| **原生结果** | `Result` | Java 原生风格泛型结果（core 包）：`success`/`failure` 静态工厂，int code + boolean success |
| **JSON 响应** | `JsonResponse` | JSON 字符串响应包装（generic 包）：`jsonData` 存已序列化字符串，避免重复序列化 |
| **Map 响应** | `MapResponse` | Map 形式响应包装（generic 包）：动态键值对 + `put`/`putAll` 链式 + Builder |
| **自定义响应** | `CustomResponse` | 自定义响应结构示例（custom 包）：`code` + `timestamp` + `traceId` + `metadata` + Builder |
| **自定义转换** | `CustomResponseConverter` | CustomResponse 与其他结构互转 + `registerAll()` 注册进工厂 |

---

## 二、核心设计

### 1. ResponseFactory：门面模式统一创建入口

`ResponseFactory.ajaxSuccess()` / `resultSuccess()` / `problemBadRequest()` / `jdkHttpWrapper()` 等方法把散落在各子包的静态工厂收拢到一个入口，调用方一行代码拿到任意响应对象。所有方法都委托给对应类的 `success`/`error`/`from` 静态方法。

### 2. 转换体系：多模式叠加，以 AjaxResult 为归一化中枢

- `ResponseConverter`（Adapter + Facade）提供硬编码的静态转换，覆盖 Result/Ali/Tencent/Baidu/ProblemDetail/GraphQL/gRPC/HttpWrapper/Redis/WebSocket/SSE/Reactive 等几乎所有结构到 `AjaxResult` 的转换，以及 `AjaxResult` 反向转出。
- `ResponseConverterFactory`（Factory + Registry）用 `Map<String, Strategy>` 存储默认策略，key 为 `源类型全名 -> 目标类型全名`，静态块预注册 20+ 组默认策略。
- `ResponseConversionStrategy`（Strategy，函数式接口）把转换算法抽象成可替换单元，`andThen` 支持函数式组合，`identity` 作空操作。
- `ConversionChainBuilder`（Builder + 责任链）用 `List<Function>` 串联多步转换，`transform`/`transformIf` 插入自定义步骤。

### 3. 三种核心响应结构的字段差异

| 结构 | 状态码 | 成功标志 | 附加字段 |
|---|---|---|---|
| `AjaxResult` | `String code` | `"200"/"0"/"success"` | 无 |
| `Result<T>` | `int code` | `boolean success` | 无 |
| `CustomResponse<T>` | `int code` | `code == 200` | `timestamp`/`traceId`/`metadata` |

`AjaxResult.isSuccess()` 兼容三种成功码（200 / 0 / success），`Result` 用独立 `success` 布尔位，`CustomResponse` 扩展了链路追踪与元数据能力，作为自定义格式的参考模板。

---

## 三、面试高频问题

**Q1：ResponseFactory 和 ResponseConverter 有什么区别？**

- `ResponseFactory` 是「从零创建」：`ajaxSuccess(data)` 新建一个响应对象。
- `ResponseConverter` 是「结构互转」：`toAjaxResult(aliResponse)` 在已有响应对象间搬运字段。
- 两者都用了门面模式，但一个是对象创建门面、一个是格式适配门面。

**Q2：ResponseConverterFactory 的策略 key 为什么用 `source.getName() + " -> " + target.getName()`？**

- 用「源类型全名 -> 目标类型全名」唯一标识一对类型间的默认转换，避免同一对类型出现多个策略互相覆盖。
- `register`/`getStrategy`/`convert` 三者共用同一 `generateKey`，`convert` 找不到策略时抛 `UnsupportedOperationException`，让「没有默认转换」变成显式失败。

**Q3：ConversionChainBuilder 的 `to()` 和 `transform()` 有何区别？责任链如何体现？**

- `to(TargetType.class)` 按目标类型自动选择转换（当前实现偏简，类型不匹配直接抛异常），`thenTo` 是它的可读性别名。
- `transform(Function)` 插入任意自定义转换逻辑，`transformIf(Predicate, Function)` 支持条件转换。
- 内部把所有步骤存进 `List<Function>`，`execute()` 依次 `apply`，是责任链（有序串联）与建造者（链式配置）的组合。

---

## 相关

- [response模块总结](/blog/ztools-response-module/) — 上级 MOC
- [ajax与拦截包总结](/blog/ztools-ajax-intercept-pkg/) — `AjaxResult` 是转换体系的中枢目标
- [http与标准协议包总结](/blog/ztools-http-protocol-pkg/) — `ResponseConverter` 也转换 HTTP 包装器与厂商标准结构
