---
title: 'response 模块总结'
description: '是 ztools 的**自有模块（非 hutool 移植）**，定位「响应结构归一化与搜集库」。包路径 。共 64 个主类（+16 package-info），分 4 层：核心与工厂、ajax 与拦截、HTTP 与标准协议、数据库与框架适配。'
pubDate: 'Aug 31, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "框架"]
category: 'ztools'
---

# response 模块总结（MOC）

> `cc-hongz-ztools-response` 是 ztools 的**自有模块（非 hutool 移植）**，定位「响应结构归一化与搜集库」。包路径 `cc.hongz.ztools.response`。共 64 个主类（+16 package-info），分 4 层：核心与工厂、ajax 与拦截、HTTP 与标准协议、数据库与框架适配。

---

## 分层

- [核心与工厂包总结](/blog/ztools-response-core-pkg/) — 响应结构定义（Result/Json/Map/Custom）+ 转换器/工厂/策略/链（10 类）
- [ajax与拦截包总结](/blog/ztools-ajax-intercept-pkg/) — AJAX 标准消息体 + 业务状态码体系 + 全局异常/国际化 + 响应自动包装拦截（19 类）
- [http与标准协议包总结](/blog/ztools-http-protocol-pkg/) — HTTP 客户端响应包装 + 行业标准协议（RFC 7807/GraphQL/gRPC 等）+ 响应式（20 类）
- [数据库与框架适配包总结](/blog/ztools-db-adapt-pkg/) — 数据库/缓存 + 框架特定（分页/OAuth2/Actuator）+ 消息队列 + 通用分页（15 类）

---

## 依赖关系

- 强制依赖 [core模块总结](/blog/ztools-core-module/)（`cc-hongz-ztools-core`，字符串/Map/反射等工具）；编译期依赖 Lombok
- [ajax与拦截包总结](/blog/ztools-ajax-intercept-pkg/) 依赖 **Spring WebMVC / Context**（`ResponseBodyAdvice`、`MessageSource`、`@RestControllerAdvice`）与 **Jakarta Servlet / Validation**
- [http与标准协议包总结](/blog/ztools-http-protocol-pkg/) 依赖 **OkHttp / Apache HttpClient / Feign / WebFlux（Reactor）** 等可选客户端
- [数据库与框架适配包总结](/blog/ztools-db-adapt-pkg/) 依赖 **MyBatis-Plus / PageHelper / Kafka / RocketMQ** 等可选框架
- 除 core 外，其余依赖均声明为 `<optional>true</optional>`，按需引入、不向下游传递

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块（唯一强制依赖）
- [ztools项目约定与工作流](/blog/ztools-workflow/) — checkstyle 约定、提交推送流程
