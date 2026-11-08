---
title: 'http 与标准协议 包（HTTP 包装与行业规范）总结'
description: '性质：自有模块（非 hutool 移植）'
pubDate: 'Aug 31, 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "网络"]
category: 'ztools'
---

# http 与标准协议 包（HTTP 包装与行业规范）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-response/src/main/java/cc/hongz/ztools/response` 下的 `http` / `standard` / `protocol` / `reactive` 子包
>
> 性质：自有模块（非 hutool 移植）

---

## 一、包概览

该层是 response 模块的**协议目录**：把不同 HTTP 客户端的响应统一包装成 JSON，并对齐各大厂商与行业标准协议，另附响应式（Reactor）变体，共 20 个类：

| 类别 | 类 | 职责 |
|---|---|---|
| **HTTP 状态码** | `HttpStatusCode` | 完整 RFC 状态码枚举（1xx-5xx 共 60+），`isSuccess`/`isError`/`valueOf`/`isValid` |
| **JDK HttpClient 包装** | `JdkHttpResponseWrapper` | 包装 `java.net.http.HttpResponse`（statusCode/body/headers/uri/version） |
| **OkHttp 包装** | `OkHttpResponseWrapper` | 包装 OkHttp `Response`（code/message/body/headers/url） |
| **Apache HttpClient 包装** | `ApacheHttpResponseWrapper` | 包装 Apache `HttpResponse`（statusCode/reasonPhrase/protocolVersion） |
| **Feign 包装** | `FeignResponseWrapper` | 包装 Feign `Response`（headers 由 Collection→List 转换） |
| **Spring 包装** | `SpringResponseEntityWrapper` | 包装 `ResponseEntity`（statusCodeValue/statusCodeName） |
| **WebClient 包装** | `WebClientResponseWrapper` | 包装 WebFlux `ClientResponse` |
| **阿里风格** | `AliResponse` | `success`/`errorCode`/`errorMsg`/`content`（内含 `ContentWrapper`） |
| **腾讯风格** | `TencentResponse` | `ret`/`msg`/`data`（ret==0 成功） |
| **百度风格** | `BaiduResponse` | `errno`/`errmsg`/`data`（errno==0 成功） |
| **RFC 7807** | `ProblemDetail` | `application/problem+json` 错误标准（type/title/status/detail/instance/extensions） |
| **GraphQL** | `GraphQLResponse` | `data`/`errors`/`extensions`（含 `GraphQLError`/`Location`） |
| **gRPC** | `GrpcResponse` | google.rpc.Status 格式 + 17 个 gRPC 状态码常量 + `ErrorDetail` |
| **JSON:API** | `JsonApiResponse` | JSON:API 规范（`ResourceObject`/`Relationship`/`ErrorObject`/`Links`） |
| **SSE** | `SseEvent` | Server-Sent Events 事件（id/event/retry/data + `toSseString()`） |
| **WebSocket** | `WebSocketMessage` | WS 消息（text/binary/ping/pong/close，`isText`/`isClose`） |
| **XML 转 JSON** | `XmlToJsonResponse` | XML 响应转 JSON 包装（rootElement/attributes/namespaces/originalXml） |
| **响应式 AJAX** | `ReactiveAjaxResult` | AjaxResult 的 `Mono` 版（WebFlux），`toMono()`/`toAjaxResult()` |
| **响应式集合** | `ReactiveCollectionResult` | 集合的 `Flux` 版，`fromIterable`/`fromArray` |
| **响应式分页** | `ReactivePageResult` | 分页的 `Flux`+`Mono` 版（records/total/pages，`hasNext()` 返回 `Mono<Boolean>`） |

---

## 二、核心设计

### 1. 七个 HTTP 客户端响应包装器：适配器模式统一 JSON

`JdkHttpResponseWrapper` / `OkHttpResponseWrapper` / `ApacheHttpResponseWrapper` / `FeignResponseWrapper` / `SpringResponseEntityWrapper` / `WebClientResponseWrapper` 六个包装器结构高度一致：`statusCode` + `body` + `headers` + `successful` + `isSuccess()/isClientError()/isServerError()`，各自用 `from(...)` 适配对应客户端的响应对象，把异构响应收敛成统一 JSON。

### 2. 厂商风格：三种成功判定的差异

- `AliResponse`：`boolean success` 字段显式标成功，`errorCode`/`errorMsg` 仅失败时非空。
- `TencentResponse`：`int ret`，`ret == 0` 成功。
- `BaiduResponse`：`int errno`，`errno == 0` 成功。

三种「成功标志」语义不同，转换时（`ResponseConverter`）需分别取 `isSuccess()` / `ret` / `errno`，这正是归一化到 `AjaxResult` 的适配点。

### 3. 行业标准协议：Builder + 静态工厂

`ProblemDetail`（RFC 7807）、`GraphQLResponse`（GraphQL Spec）、`GrpcResponse`（google.rpc.Status）、`JsonApiResponse`（JSON:API）都用 Lombok `@Builder` + 静态工厂（`of`/`success`/`error`/`partial`），把复杂嵌套结构（如 GraphQL 的 `errors[].locations[]`、JSON:API 的 `relationships`）建模成内部静态类。

### 4. 响应式变体：Mono/Flux 包装 + 阻塞兼容

`reactive` 包三个类把 `AjaxResult`/集合/分页包装成 `Mono`/`Flux`，供 Spring WebFlux 使用；同时提供 `toAjaxResult()`/`block()` 等阻塞桥接，方便非响应式环境取结果（javadoc 明确提示仅在必要时使用）。

---

## 三、面试高频问题

**Q1：为什么要把不同 HTTP 客户端的响应都包装成统一结构？**

- JDK HttpClient、OkHttp、Apache HttpClient、Feign、WebClient 各自的响应对象 API 完全不同（字段名、类型、header 结构各异）。
- 统一包装后，业务代码只依赖一套 `isSuccess()/getBody()/getHeaders()`，换客户端零改动；也为后续 `ResponseConverter.toAjaxResult(wrapper)` 归一化到 `AjaxResult` 铺路。

**Q2：RFC 7807 ProblemDetail 相比普通 error JSON 好在哪？**

- 标准字段（`type`/`title`/`status`/`detail`/`instance`）机器可读，配合媒体类型 `application/problem+json` 让客户端能自动识别错误语义，而非解析各家的私有字段。
- `type` 是错误类型 URI（全局唯一标识），`instance` 指向出错的具体资源，便于监控聚合与文档化；`extensions`/`errors` 支持扩展校验错误列表。

**Q3：阿里/腾讯/百度三种厂商响应成功判定有何不同？转换时注意什么？**

- 阿里用 `success` 布尔位，腾讯用 `ret == 0`，百度用 `errno == 0`；数据字段分别是 `content.data`、`data`、`data`。
- 转换时（如 `ResponseConverter.aliToTencent`）要正确提取 `content.data`，失败时把阿里的 `errorCode`（String）转成腾讯的 `ret`（int），做 `NumberFormatException` 兜底为 `-1`，避免非数字码导致转换崩溃。

---

## 相关

- [response模块总结](/blog/ztools-response-module/) — 上级 MOC
- [核心与工厂包总结](/blog/ztools-response-core-pkg/) — `ResponseConverter` 提供这些结构到 `AjaxResult` 的互转
- [ajax与拦截包总结](/blog/ztools-ajax-intercept-pkg/) — `AjaxStatusEnum` 引用 `HttpStatusCode`
