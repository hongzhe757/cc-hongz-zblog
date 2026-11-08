---
title: 'ai 包（AI 调用）总结'
description: 'ai 包是 LLM（大语言模型）调用的统一封装，48 个类分 3 组：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "框架"]
category: 'ztools'
---

# ai 包（AI 调用）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-ai/src/main/java/cc/hongz/ztools/ai`
>
> 对照基准：hutool 5.8.48（`cn.hutool.ai`）

---

## 一、包概览

ai 包是 **LLM（大语言模型）调用的统一封装**，48 个类分 3 组：

| 类别 | 类 | 职责 |
|---|---|---|
| **门面/常量** | `AIServiceFactory`（门面）/ `AIUtil` / `AIException` / `ModelName` / `Models` | 统一入口 + 模型名/常量（`Models` 含 122 个模型枚举） |
| **核心抽象** | `AIService`（接口）/ `AIServiceProvider`（SPI）/ `BaseAIService`（基类）/ `AIConfig`+`AIConfigBuilder`+`AIConfigRegistry` / `BaseConfig` / `Message` | 服务抽象 + 配置（Builder 模式）+ 消息体 |
| **7 个模型** | `model.openai` / `deepseek` / `doubao` / `gemini` / `grok` / `ollama` / `hutool`（每个含 Common/Config/Provider/Service/ServiceImpl） | 各厂商 LLM 实现 |

---

## 二、核心设计

### 1. SPI + 统一门面

`AIServiceFactory` 通过 `META-INF/services` 的 `AIServiceProvider` SPI 发现 7 个模型实现，`AIUtil.chat(model, message)` 一键调用。`AIConfigRegistry` 按模型名缓存配置。

### 2. 每模型 5 件套

每个模型子包统一结构：`Common`（API URL/模型常量）、`Config`（apiKey/model/temperature 等）、`Provider`（SPI 实现）、`Service`（接口）、`ServiceImpl`（HTTP 调用实现）。新增厂商只需照此结构加一个子包。

### 3. Builder 配置

`AIConfigBuilder` 流式构建配置（`setApiKey/setModel/setTemperature/setMaxTokens`），`BaseConfig` 统一承载，屏蔽各厂商参数差异。

---

## 三、面试高频问题

**Q1：调用 LLM 的 HTTP 请求核心要素？**

- API URL、API Key（Bearer 认证）、model、messages（system/user/assistant）、temperature、maxTokens。响应通常 SSE 流式或 JSON。

**Q2：为什么模型测试要 `@Disabled`？**

- 调用真实 LLM 需要 API Key + 网络 + 付费，CI 无此环境，故测试只验证工厂/工具逻辑，真实调用测试跳过。

**Q3：多厂商适配怎么设计？**

- 抽象 `AIService` 接口 + 每厂商 `ServiceImpl` 实现，SPI 注册，`ModelName` 枚举路由，新增厂商不改核心代码。

---

## 相关

- [ai模块总结](/blog/ztools-ai-module/) — 上级 MOC
- [http模块总结](/blog/ztools-http-module/) — HTTP 调用能力
