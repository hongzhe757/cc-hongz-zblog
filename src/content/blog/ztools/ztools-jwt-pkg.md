---
title: 'jwt 包（JWT 令牌）总结'
description: 'jwt 包是 JWT（RFC 7519）令牌的实现，共 15 类，分 2 层：根包（结构 + 门面 + 校验）、signers 子包（签名策略）：'
pubDate: 'Aug 31, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# jwt 包（JWT 令牌）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-jwt/src/main/java/cc/hongz/ztools/jwt`
>
> 对照基准：hutool 5.8.48（`cn.hutool.jwt`）

---

## 一、包概览

jwt 包是 JWT（RFC 7519）令牌的**实现**，共 15 类，分 2 层：根包（结构 + 门面 + 校验）、`signers` 子包（签名策略）：

| 类别 | 类 | 职责 |
|---|---|---|
| **核心对象** | `JWT` | JWT 核心：Header + Payload + 签名三段，`parse`/`sign`/`verify`/`validate` |
| **统一入口** | `JWTUtil` | JWT 门面（Facade）：`createToken`/`parseToken`/`verify` |
| **头部** | `JWTHeader` | JWT 头部（`alg`/`typ`/`cty`/`kid` 声明） |
| **载荷** | `JWTPayload` | JWT 载荷（`Claims` 子类，承载声明） |
| **声明基类** | `Claims` | 声明基类：`JSONObject` 包装，时间用秒级时间戳 |
| **标准声明** | `RegisteredPayload<T>` | 标准注册声明接口（`iss`/`sub`/`aud`/`exp`/`nbf`/`iat`/`jti`） |
| **校验器** | `JWTValidator` | 校验算法一致性、签名、时间有效性（含 `leeway` 容忍空间） |
| **异常** | `JWTException` | JWT 相关运行时异常 |
| **签名策略接口** | `JWTSigner` | 签名策略接口（`sign`/`verify`/`getAlgorithm`） |
| **签名器工厂** | `JWTSignerUtil` | 签名器工厂（`hs256`/`rs256`/`es256`/`none`/`createSigner` 按算法 ID 分发） |
| **对称签名** | `HMacJWTSigner` | HMac 对称签名（HS256/384/512、HMD5、HSHA1、SM4CMAC） |
| **非对称签名** | `AsymmetricJWTSigner` | RSA 非对称签名（RS256/384/512、PS256/384/512 等） |
| **椭圆曲线签名** | `EllipticCurveJWTSigner` | ECDSA 签名（ES256/384/512） |
| **无签名** | `NoneJWTSigner` | 无签名（`alg=none`，JWS 三段第三段为空） |
| **算法映射** | `AlgorithmUtil` | 算法 ID ↔ 算法名双向映射（`BiMap`），如 `HS256 ↔ HmacSHA256` |

---

## 二、核心设计

### 1. JWT 三段式结构与 sign 流程

`JWT` 内部持有 `JWTHeader` + `JWTPayload` + `JWTSigner`。`sign()` 流程：`header`/`payload` 先 `toString()` 得到 JSON，再 `Base64.encodeUrlSafe` 编码，拼接 `headerBase64.payloadBase64` 交给签名器算出签名，最终返回 `header.payload.signature` 三段字符串。`parse(token)` 反方向：按 `.` 拆三段，前两段 Base64 解码后填充 header/payload。

### 2. JWTSigner 策略模式 + JWTSignerUtil 工厂

`JWTSigner` 接口抽象「签名/验签/算法」，四种实现：`HMacJWTSigner`（对称，用 crypto 的 `HMac`）、`AsymmetricJWTSigner`（RSA）、`EllipticCurveJWTSigner`（ECDSA）、`NoneJWTSigner`（不签名）。`JWTSignerUtil.createSigner(algorithmId, key/keyPair)` 是工厂：`none` 返回单例、`es\d{3}` 走椭圆曲线、`PrivateKey/PublicKey` 走 RSA、否则走 HMac。`AlgorithmUtil` 用 `BiMap` 维护 `HS256 ↔ HmacSHA256` 等 20 余组映射。

### 3. Claims / RegisteredPayload：标准声明

`Claims` 是 `JSONObject` 的轻量包装，时间统一用秒级时间戳（`JSONConfig` 设 `FORMAT_SECONDS`）。`RegisteredPayload<T>` 接口用默认方法声明 RFC 7519 七个标准声明：`iss`（签发者）、`sub`（主题）、`aud`（受众）、`exp`（过期）、`nbf`（生效）、`iat`（签发时间）、`jti`（唯一 ID，防重放）。`JWT`/`JWTPayload` 实现该接口，故可链式 `JWT.create().setIssuer(...).setExpiresAt(...)`。

### 4. JWTValidator：时间校验与容忍空间

`JWTValidator.validateDate(now, leeway)` 校验三个时间：`nbf` 生效时间不能晚于当前、`exp` 失效时间不能早于当前、`iat` 签发时间不能晚于当前；未设置的字段跳过（表示无限制）。`leeway`（秒）用于时钟漂移容忍——`exp` 向后容忍、`nbf` 向前容忍。`validateAlgorithm` 额外校验「header 声明算法 == 签名器算法」并验签。

### 5. 安全防护：none 算法混淆攻击

`JWT.verify()` 显式防御 `alg=none` 攻击：若 header 声明 `alg=none` 但签名器不是 `NoneJWTSigner`（或反之），直接抛 `JWTException`，防止攻击者把签名算法改为 none 绕过验签。`JWTSignerUtil.createSigner` 也限制：`none` 时必须 key 为 null，否则抛异常。

---

## 三、面试高频问题

**Q1：JWT 三段分别是什么？各自作用？**

`header.payload.signature`：

- **header**：声明签名算法（`alg`，如 HS256）与类型（`typ`，如 JWT），Base64Url 编码；
- **payload**：承载声明（claims），含标准声明（`exp`/`iat` 等）与自定义数据，Base64Url 编码（**不是加密**，仅编码，任何人可解码）；
- **signature**：对「header + payload」用密钥/算法签名，用于**防篡改**（改任何一段验签即失败）。

**Q2：HS256 和 RS256 的区别？什么场景怎么选？**

- HS256（HmacSHA256）：**对称**，签发与校验用同一把密钥，简单、性能好，适合服务端自签自验；
- RS256（SHA256withRSA）：**非对称**，私钥签名、公钥验签，适合「签发方与验签方分离」的场景（如 SSO/网关签发，下游多个服务只拿公钥验签，不必共享密钥，安全性更高）。代价是性能较差、签名串更长。

**Q3：JWT 是无状态的，如何让它「失效」（登出/踢人）？**

JWT 本身无法撤销，常见手段：

- **短有效期 + refresh token**：access token 短命（分钟级），过期用 refresh token 换新；登出即废弃 refresh token；
- **服务端黑名单/白名单**：把已登出的 `jti`（JWT ID）或 token 加入 Redis 黑名单，校验时查名单；
- **版本号/时间戳**：payload 带 `tokenVersion` 或 `iat`，用户改密后服务端比对「最小有效版本」，低于即失效。核心思想：无状态 token 无法自撤销，需引入有状态侧存储配合。

**Q4："alg=none" 攻击是什么？hutool 如何防御？**

攻击者把 header 的 `alg` 改为 `none`，期望服务端跳过验签直接信任 payload。hutool 在 `JWT.verify()` 中双向校验：`alg=none` 但签名器非 `NoneJWTSigner`、或签名器是 `NoneJWTSigner` 但 `alg` 非 none，都抛 `JWTException`；`JWTSignerUtil` 也限制「`none` 必须配 null 密钥」。防御要点是**签名算法必须以服务端预期为准，而非完全信任 header 声明**。

---

## 相关

- [jwt模块总结](/blog/ztools-jwt-module/) — 上级 MOC
- [json模块总结](/blog/ztools-json-module/) — 依赖的 json 能力（JSONObject 解析 token）
- [crypto模块总结](/blog/ztools-crypto-module/) — 依赖的 crypto 能力（HmacAlgorithm/SignAlgorithm/HMac）
- [core模块总结](/blog/ztools-core-module/) — 依赖的 core 能力（Base64/DateUtil）
