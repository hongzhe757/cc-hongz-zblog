---
title: 'crypto.digest 包（摘要与密码哈希）总结'
description: 'digest 包提供摘要算法、消息认证码（HMAC）、密码哈希、一次性密码（OTP），23 个类：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "安全"]
---

# crypto.digest 包（摘要与密码哈希）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-crypto/src/main/java/cc/hongz/ztools/crypto/digest`
>
> 对照基准：hutool 5.8.47（`cn.hutool.crypto.digest`）

---

## 一、包概览

digest 包提供**摘要算法、消息认证码（HMAC）、密码哈希、一次性密码（OTP）**，23 个类：

| 类别 | 类 | 职责 |
|---|---|---|
| **摘要算法** | `MD5` / `SM3` / `DigestAlgorithm` / `DigestUtil` | 单向散列（MD5/SHA/SM3 等） |
| **可配置摘要器** | `Digester` / `DigesterFactory` | 支持加盐、重复散列的摘要器 |
| **消息认证码** | `HMac` / `HmacAlgorithm` / mac 子包 | 带密钥的摘要（防篡改） |
| **密码哈希** | `BCrypt` / `Argon2` | 慢哈希算法（防暴力破解） |
| **一次性密码** | `HOTP` / `TOTP`（otp 子包） | 基于计数器/时间的一次性密码 |

---

## 二、核心设计

### 1. Digester：加盐 + 重复散列

`Digester` 支持三种增强：**加盐**（salt 拼在数据前/中/后）、**重复散列**（digestCount 次，对抗彩虹表）、**指定 Provider**。`DigesterFactory` 用 `clone` 复用 MessageDigest 实例提高性能。

### 2. HMAC：带密钥的摘要

普通摘要（MD5/SHA）无密钥，任何人都能算；HMAC 用「密钥 + 数据」混合计算摘要，只有持有密钥的一方才能验证，用于防篡改的接口签名。

### 3. BCrypt / Argon2：慢哈希防暴力破解

普通哈希（MD5/SHA）计算极快，攻击者可每秒尝试数十亿次暴力破解。BCrypt/Argon2 **故意让计算变慢**（含 cost 参数，Argon2 还吃内存），大幅提高破解成本，是密码存储的标准选择。

### 4. TOTP：基于时间的一次性密码

`TOTP` 用「密钥 + 当前时间窗口」计算 6 位动态码（如 Google Authenticator），每 30 秒变化一次，用于两步验证。

---

## 三、面试高频问题

**Q1：MD5 为什么不安全？为什么还要「加盐」？**

- MD5 已被破解（可构造碰撞），且用户常用弱密码，攻击者用彩虹表（预计算常见密码的 MD5）秒查。加盐后每个用户的哈希都不同，彩虹表失效；现代做法是直接换 BCrypt/Argon2。

**Q2：HMAC 和普通摘要的区别？**

- 普通摘要无密钥（任何人可算/可伪造）；HMAC 带密钥，无法伪造，用于接口签名防篡改。

**Q3：BCrypt 比 MD5 好在哪？**

- BCrypt 是「慢哈希」：内置 cost 因子，每次计算耗时可控（如 100ms），暴力破解成本指数上升；MD5 极快，一秒可算数十亿次。

**Q4：TOTP 的原理？**

- 客户端和服务端共享密钥，用 `HMAC(密钥, 当前时间戳/30)` 计算 6 位码。时间窗口同步，离线也能验证，所以两步验证码「过期作废」。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 文件/字符串摘要 | `MD5` / `DigestUtil` |
| 国密摘要 | `SM3` |
| 加盐摘要 | `Digester` |
| 接口签名（防篡改） | `HMac` |
| 密码存储 | `BCrypt` / `Argon2` |
| 两步验证动态码 | `TOTP` |

---

## 五、当前状态

- **文件**：23 个类（含 mac/otp 子包），与 hutool 5.8.47 对齐。
- **单元测试**：`Md5Test`/`DigestTest`/`HmacTest`/`BCryptTest`/`Argon2Test`/`OTPTest` 等，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。处理要点：`BCrypt` 是第三方算法原样移植，其 S-box/P-box 常量数组、下划线命名（`encode_base64`/`log_rounds`）用类级 `@SuppressWarnings` 豁免（MagicNumber/MemberName/ParameterName/MethodName/LineLength 等）；`Digester` 的 bufferLength/digestData 重赋值参数改局部变量 `resolvedXxx`。

---

## 相关

- [crypto包总结](/blog/ztools-crypto-pkg/)
- [codec包总结](/blog/ztools-codec-pkg/)
