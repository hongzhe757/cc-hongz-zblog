---
title: 'ai 模块总结'
description: '是 hutool-ai 的移植镜像，包路径 。共 48 主类，分 3 层：核心抽象、配置、7 个 LLM 模型。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "框架"]
category: 'ztools'
---

# ai 模块总结（MOC）

> `cc-hongz-ztools-ai` 是 hutool-ai 的移植镜像，包路径 `cc.hongz.ztools.ai`。共 48 主类，分 3 层：核心抽象、配置、7 个 LLM 模型。

---

## 分层

- [ai包总结](/blog/ztools-ai-pkg/) — AI 调用（统一门面 + 7 个 LLM 模型：OpenAI/DeepSeek/Gemini/Grok/Ollama/豆包/Hutool）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/)、[http模块总结](/blog/ztools-http-module/)（HTTP 调用 LLM API）、[log模块总结](/blog/ztools-log-module/)、[json模块总结](/blog/ztools-json-module/)（解析响应）
- 无重型第三方依赖（HTTP 客户端复用 hutool-http）

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [json模块总结](/blog/ztools-json-module/) — 响应 JSON 解析
