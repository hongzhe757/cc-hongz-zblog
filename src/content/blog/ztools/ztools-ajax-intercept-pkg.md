---
title: 'ajax 与拦截 包（AJAX 标准与 Spring 集成）总结'
description: '性质：自有模块（非 hutool 移植）'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools"]
category: 'ztools'
---

# ajax 与拦截 包（AJAX 标准与 Spring 集成）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-response/src/main/java/cc/hongz/ztools/response` 下的 `ajax` / `exception` / `interceptor`（含 `strategy`）/ `config` / `handler` / `i18n` 子包
>
> 性质：自有模块（非 hutool 移植）

---

## 一、包概览

该层是 response 模块的 **Web 集成核心**：定义 `AjaxResult` 标准消息体与业务状态码体系，并借助 Spring 把「全局异常 → 国际化 → 响应自动包装」串成一条链路，共 19 个类：

| 类别 | 类 | 职责 |
|---|---|---|
| **标准消息体** | `AjaxResult` | AJAX 标准消息体：`code`/`msg`/`data`，`success`/`error` 大量重载静态工厂 + `isSuccess()` |
| **状态码契约** | `AjaxStatusInterface` | 业务状态码接口：`getCode`/`getDefaultMessage`/`getHttpStatus` + `getDomain`/`getPrefix`/`getCodeNumber` 默认方法 |
| **通用状态码枚举** | `AjaxStatusEnum` | 通用业务状态码枚举（SUCCESS/PARAM_INVALID/UNAUTHORIZED… 共 13 个），绑定 messageKey + `HttpStatusCode` |
| **状态码工具** | `AjaxStatuses` | 状态码构建/解析：`buildCode`/`extractPrefix`/`extractNumber`/`isValidFormat` |
| **状态码注册表** | `AjaxStatusRegistry` | 业务状态码集中注册/查询：`register`/`registerAll`/`getByPrefix`/`init` |
| **消息键映射** | `AjaxStatusMessageKeys` | 状态码 ↔ MessageSource 消息键映射，三级解析（显式 key → 注册表 → 回退 code） |
| **业务异常** | `BusinessException` | 携带 `AjaxStatusInterface` 的运行时异常，`{0}` 占位符消息模板 |
| **全局异常处理** | `GlobalExceptionHandler` | `@RestControllerAdvice` 统一把异常转 AjaxResult（业务/校验/类型不匹配/未知） |
| **国际化构建器** | `I18nResponseBuilder` | 结合 `MessageSource` 生成多语言响应 + 占位符替换 |
| **响应拦截器** | `ResponseInterceptor` | `ResponseBodyAdvice`，写出前把非标准返回值自动包装为 AjaxResult/CustomResponse |
| **拦截辅助** | `ResponseInterceptSupport` | 类型识别/排除规则/流式判断等静态方法 |
| **拦截策略接口** | `ResponseInterceptStrategy` | 拦截策略接口：`supports(Class)` / `handle(response, request)` |
| **实体包装策略** | `EntityToAjaxResultStrategy` | POJO/集合 → `AjaxResult.success(body)`（排除 Map/String/框架/流式类型） |
| **Map 包装策略** | `MapToAjaxResultStrategy` | Map 已含 `code`/`msg` 则按 AJAX 解析，否则整体作 data 包装 |
| **字符串包装策略** | `StringToAjaxResultStrategy` | 纯文本/JSON 字符串 → `AjaxResult.success(text)` |
| **拦截配置** | `InterceptorProperties` | 拦截器配置（enabled/responseStyle/defaultAction/strictMode/排除包与类） |
| **跳过注解** | `SkipResponseIntercept` | 标注方法/类跳过拦截（文件下载/流式/SSE） |
| **Spring 装配** | `ResponseAutoConfiguration` / `ResponseProperties` | 自动配置（`@Import` 引入）+ 全局配置前缀 `hongz.response` |

---

## 二、核心设计

### 1. 业务状态码体系：业务码与 HTTP 码解耦

- `AjaxStatusInterface` 定义契约：业务码 `{DOMAIN}_{CODE}`（如 `USER_404`）+ 默认消息 + 对应 `HttpStatusCode`，业务码与 HTTP 码分离但可映射。
- `AjaxStatusEnum` 是系统级通用实现（13 个），`AjaxStatuses.buildCode("COMMON", "400")` 声明式生成 `COMMON_400`。
- `AjaxStatusRegistry` 集中注册查询（支持按前缀 `getByPrefix("USER")`），`AjaxStatusMessageKeys` 维护「状态码 → 国际化消息键」映射，解析顺序：显式 `getMessageKey()` → 注册表 → 回退状态码本身。

### 2. 响应自动包装：ResponseBodyAdvice + 策略链

`ResponseInterceptor` 实现 `ResponseBodyAdvice`，在 `beforeBodyWrite` 中按序匹配三大策略（Map → String → 实体），把 Controller 的非标准返回值统一包成 `AjaxResult`（或按 `ResponseStyle.CUSTOM` 包成 `CustomResponse`）。`ResponseInterceptSupport.shouldInterceptReturnType` 负责排除：标准响应（AjaxResult/Result/ProblemDetail/ResponseEntity）、流式/二进制（`byte[]`/`InputStream`/`StreamingResponseBody`/`Flux`/`Mono`）、框架类型、配置的排除包/类。

### 3. 配置驱动的三档行为

`InterceptorProperties` 提供 `defaultAction`（WRAP/PASS/THROW）、`strictMode`（严格模式下遇到非目标格式直接抛异常）与 `ResponseStyle`（AJAX_RESULT/CUSTOM 互斥）三档开关，配合 `@SkipResponseIntercept` 注解做方法级豁免。

### 4. 全局异常 + 国际化闭环

`BusinessException`（携带状态码 + 参数）→ `GlobalExceptionHandler`（`@ExceptionHandler` 分发）→ `I18nResponseBuilder`（`MessageSource` 查多语言消息 + `{0}` 占位符替换）→ 输出 `AjaxResult`。`ResponseAutoConfiguration` 用 `@Import` 装配全部 Bean，无需独立 Starter。

---

## 三、面试高频问题

**Q1：ResponseBodyAdvice 是什么？ResponseInterceptor 如何实现「统一返回体」？**

- `ResponseBodyAdvice` 是 Spring MVC 提供的回调，在 `HttpMessageConverter` 写出 body 之前拦截，可改写返回值。
- `supports()` 先判断「是否启用 / 是否跳过 / 返回类型是否需拦截」，`beforeBodyWrite()` 再按策略把 POJO/Map/String 包成 `AjaxResult`。已标准化的类型（`AjaxResult`/`Result`/`ResponseEntity`）与流式/二进制直接放行，避免重复包装或破坏文件下载。

**Q2：为什么业务状态码要和 HTTP 状态码解耦？**

- HTTP 状态码是传输层语义（200/404/500），粒度有限；业务状态码（`USER_404`、`ORDER_PAID`）表达领域语义，可无限扩展且不依赖 HTTP 协议。
- 通过 `AjaxStatusInterface.getHttpStatus()` 建立映射，`GlobalExceptionHandler` 用 `HttpStatus.valueOf(status.getCode())` 把业务码还原成 HTTP 状态，兼顾语义与协议兼容。

**Q3：拦截器为什么要排除 `Flux`/`Mono`/`byte[]`/`StreamingResponseBody`？strictMode 有什么用？**

- 流式/响应式（`Flux`/`Mono`/`StreamingResponseBody`）是异步或持续输出，包进 `AjaxResult` 会把整个流物化、破坏背压和流式特性；`byte[]`/`InputStream`/`Resource` 是文件下载，包装会污染二进制内容。
- `strictMode=true` 时，凡不符合目标响应风格的返回值直接抛 `IllegalStateException`，强制团队统一规范（比如只允许 `AjaxResult`，不许混用 `CustomResponse`），关闭则自动包装。

---

## 相关

- [response模块总结](/blog/ztools-response-module/) — 上级 MOC
- [核心与工厂包总结](/blog/ztools-response-core-pkg/) — `AjaxResult` 是转换体系的中枢目标，`CustomResponse` 是拦截器可选风格
- [http与标准协议包总结](/blog/ztools-http-protocol-pkg/) — `HttpStatusCode` 被 `AjaxStatusEnum` 引用
