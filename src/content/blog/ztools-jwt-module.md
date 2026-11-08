---
title: 'jwt 模块总结'
description: '是 hutool-jwt 的移植镜像，包路径 。共 15 类，分 2 层：根包（JWT 结构 + 门面 + 校验）、signers 子包（7 类签名策略）。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# jwt 模块总结（MOC）

> `cc-hongz-ztools-jwt` 是 hutool-jwt 的移植镜像，包路径 `cc.hongz.ztools.jwt`。共 15 类，分 2 层：根包（JWT 结构 + 门面 + 校验）、signers 子包（7 类签名策略）。

---

## 分层

- [jwt包总结](/blog/ztools-jwt-pkg/) — 根包（JWT/Claims/JWTUtil/JWTValidator 等 8 类）+ signers 子包（7 类签名策略）

> signers 子包体量小，归入 [jwt包总结](/blog/ztools-jwt-pkg/) 一并说明。

---

## 依赖关系

- [jwt包总结](/blog/ztools-jwt-pkg/) 依赖 [json模块总结](/blog/ztools-json-module/)（`JSONObject`/`JSONUtil`/`JSONConfig` 解析 token 三段）
- [jwt包总结](/blog/ztools-jwt-pkg/) 依赖 [crypto模块总结](/blog/ztools-crypto-module/)（`HmacAlgorithm`/`SignAlgorithm` 算法常量、`HMac` 签名实现）
- 依赖 [core模块总结](/blog/ztools-core-module/)（`Base64`/`DateUtil`/`StrUtil`/`CollUtil`/`Assert`）

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [json模块总结](/blog/ztools-json-module/) — 上游 json 模块
- [crypto模块总结](/blog/ztools-crypto-module/) — 上游 crypto 模块
