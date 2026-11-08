---
title: 'json 模块总结'
description: '是 hutool-json 的移植镜像，包路径 。共 30 类，分 3 层：根包（JSON 数据结构 + 门面 + 手写解析器）、serialize 子包（序列化链）、xml 子包（JSON↔XML 转换）。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "数据"]
category: 'ztools'
---

# json 模块总结（MOC）

> `cc-hongz-ztools-json` 是 hutool-json 的移植镜像，包路径 `cc.hongz.ztools.json`。共 30 类，分 3 层：根包（JSON 数据结构 + 门面 + 手写解析器）、serialize 子包（序列化链）、xml 子包（JSON↔XML 转换）。

---

## 分层

- [json包总结](/blog/ztools-json-pkg/) — 根包（JSONObject/JSONArray/JSONUtil/JSONParser 等 20 类）+ serialize 子包（7 类）+ xml 子包（3 类）

> serialize 子包与 xml 子包体量小，归入 [json包总结](/blog/ztools-json-pkg/) 一并说明。

---

## 依赖关系

- [json包总结](/blog/ztools-json-pkg/) 依赖 [core模块总结](/blog/ztools-core-module/)（convert 转换中心、bean 反射、collection/map 容器、util 工具）
- **无第三方 JSON 库依赖**：解析/序列化全部手写实现，不引入 Jackson/Gson/fastjson

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [jwt模块总结](/blog/ztools-jwt-module/) — 下游模块（jwt 依赖 json 的 JSONObject 解析 token）
