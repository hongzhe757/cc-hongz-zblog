---
title: 'crypto.asymmetric 包（非对称加密）总结'
description: 'asymmetric 包提供非对称加密与数字签名，13 个类：'
pubDate: 'Aug 27, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# crypto.asymmetric 包（非对称加密）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-crypto/src/main/java/cc/hongz/ztools/crypto/asymmetric`
>
> 对照基准：hutool 5.8.47（`cn.hutool.crypto.asymmetric`）

---

## 一、包概览

asymmetric 包提供**非对称加密与数字签名**，13 个类：

| 类别 | 类 | 职责 |
|---|---|---|
| **抽象基类** | `BaseAsymmetric` / `AbstractAsymmetricCrypto` | 非对称算法公共骨架（密钥、加解密流程） |
| **通用实现** | `AsymmetricCrypto` | 通用非对称加解密（支持 RSA/EC 等） |
| **RSA** | `RSA` | RSA 加解密 |
| **国密** | `SM2` | 国密 SM2 加解密/签名（基于 BouncyCastle） |
| **椭圆曲线** | `ECIES` | 椭圆曲线集成加密方案 |
| **签名** | `Sign` / `SignAlgorithm` | 数字签名/验签 |
| **接口/枚举** | `AsymmetricEncryptor` / `AsymmetricDecryptor` / `AsymmetricAlgorithm` / `KeyType` | 加解密接口、算法枚举、密钥类型（公钥/私钥） |

---

## 二、核心设计

### 1. 非对称加密：公钥加密、私钥解密

非对称加密的核心是**密钥对**：公钥公开用于加密，私钥保密用于解密。数据用公钥加密后，只有持有私钥的一方能解密，天然解决「对称密钥如何安全分发」的问题。

### 2. SM2 国密算法

`SM2` 是国密标准（GB/T 32918），基于椭圆曲线，用于替代 RSA。加解密结果由 C1（椭圆曲线点）+ C3（SM3 摘要）+ C2（密文）三部分组成。`SmUtil.sm2()` 提供便捷入口。

### 3. 数字签名：私钥签名、公钥验签

`Sign` 封装 `java.security.Signature`。签名流程：发送方用**私钥**对数据摘要签名，接收方用**公钥**验签。签名保证数据的**完整性**和**不可抵赖性**（而非机密性）。

### 4. KeyType：区分公钥/私钥

`KeyType.PublicKey` / `KeyType.PrivateKey` 枚举标记密钥类型，加密用公钥、解密用私钥，避免调用方混淆。

---

## 三、面试高频问题

**Q1：RSA 的原理？**

- 基于大整数分解难题：选两个大素数 p、q，公钥 (n, e)，私钥 (n, d)，其中 n=pq。加密 `c = m^e mod n`，解密 `m = c^d mod n`。破解等价于分解 n，计算上不可行。

**Q2：SM2 和 RSA 的区别？**

- SM2 基于椭圆曲线离散对数难题（国密标准），256 位密钥强度相当于 RSA 3072 位；RSA 基于大整数分解。SM2 密钥更短、速度更快，且是国家标准。

**Q3：数字签名的流程？**

- 签名：原文 → 摘要（SHA256）→ 私钥签名 → 签名值；验签：公钥验签 → 对比摘要。签名保证「内容没被篡改」和「确实是私钥持有者发的」。

**Q4：私钥签名、公钥验签为什么不是反过来？**

- 签名用于证明身份：私钥只有自己持有，用私钥签名 = 声明「这是我发的」；公钥公开，任何人可验签。反过来（公钥加密）是保密场景，两者用途不同。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| RSA 加解密 | `RSA` |
| 国密加解密/签名 | `SM2` |
| 数字签名/验签 | `Sign` |
| 通用非对称加解密 | `AsymmetricCrypto` |
| 椭圆曲线加密 | `ECIES` |

---

## 五、当前状态

- **文件**：13 个类，与 hutool 5.8.47 对齐。
- **单元测试**：`RSATest`/`SM2Test`/`SignTest`/`ECIESTest` 等，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。处理要点：`SM2.decrypt` 的 data 参数重赋值改局部变量 `resolvedData`；算法常量（`0x04` 等）用类级 `@SuppressWarnings("checkstyle:MagicNumber")`。

---

## 相关

- [crypto包总结](/blog/ztools-crypto-pkg/)
- [crypto-digest包总结](/blog/ztools-crypto-digest-pkg/)
