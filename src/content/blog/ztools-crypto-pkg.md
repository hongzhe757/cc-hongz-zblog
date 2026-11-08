---
title: 'crypto 包（密钥与工具）总结'
description: 'crypto 根包是加密模块的统一入口与密钥/工具层，17 个类，可按用途分类：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "安全"]
---

# crypto 包（密钥与工具）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-crypto/src/main/java/cc/hongz/ztools/crypto`
>
> 对照基准：hutool 5.8.47（`cn.hutool.crypto`）

---

## 一、包概览

crypto 根包是加密模块的**统一入口与密钥/工具层**，17 个类，可按用途分类：

| 类别 | 类 | 职责 |
|---|---|---|
| **统一入口** | `SecureUtil` | 加解密、摘要、签名、密钥生成的统一静态入口（Facade） |
| **密钥工具** | `KeyUtil` / `ECKeyUtil` / `OpensslKeyUtil` | 密钥生成/读取/转换（JDK、BouncyCastle、OpenSSL 三种格式） |
| **签名/国密** | `SignUtil` / `SmUtil` | 签名工具；国密 SM2/SM3/SM4 工具 |
| **PEM 格式** | `PemUtil` | PEM 格式密钥读写 |
| **BC 工具** | `BCUtil` / `GlobalBouncyCastleProvider` / `ProviderFactory` | BouncyCastle 参数转换、Provider 注册 |
| **密码学组件** | `CipherWrapper` / `CipherMode` / `Mode` / `Padding` / `SpecUtil` | Cipher 包装、加解密模式、填充方式、KeySpec |
| **ASN.1** | `ASN1Util` | ASN.1 DER/BER/DL 编解码（证书/密钥结构） |
| **异常** | `CryptoException` | 密码学相关运行时异常 |

---

## 二、核心设计

### 1. SecureUtil：门面模式统一入口

`SecureUtil` 聚合了所有密码学操作：`md5()`、`sha256()`、`aes()`、`des()`、`rsa()`、`sm2()`、`sign()`、`generateKey()` 等，调用方无需关心底层实现，一个类搞定所有加解密需求。

### 2. 密钥的三种格式

- **JDK 标准**：PKCS#8（私钥）、X.509（公钥）。
- **BouncyCastle**：`ECPrivateKeyParameters` / `ECPublicKeyParameters` 等底层参数对象。
- **OpenSSL/PEM**：`-----BEGIN PRIVATE KEY-----` 文本格式，`PemUtil`/`OpensslKeyUtil` 负责读写。

`KeyUtil`/`BCUtil` 在三者之间做转换（如 `BCUtil.toParams` 把 JDK Key 转成 BC 参数）。

### 3. CipherWrapper：封装 Cipher 样板

`CipherWrapper` 包装 `javax.crypto.Cipher`，统一处理 mode/padding/IV/随机数，避免每次加解密都要手写 `Cipher.getInstance` + `init` + `doFinal` 样板。

### 4. BouncyCastle Provider 注册

`GlobalBouncyCastleProvider` 惰性注册 BouncyCastle 安全提供者，使 JDK 原生不支持的非对称/国密算法（SM2/SM3/SM4、BCrypt、Argon2 等）可用。

---

## 三、面试高频问题

**Q1：对称加密和非对称加密的区别？**

- 对称（AES/DES/SM4）：加解密用**同一把密钥**，快，适合大数据量；密钥分发是难点。
- 非对称（RSA/SM2）：公钥加密、私钥解密，慢，适合小数据/密钥交换；解决密钥分发。

**Q2：私钥 PKCS#8 和公钥 X.509 是什么？**

- PKCS#8 是私钥的通用编码格式；X.509 是公钥/证书的编码格式。两者是「密钥的序列化标准」，跨语言/跨库互通。

**Q3：PEM 格式是什么？**

- PEM 是 Base64 编码 + `-----BEGIN/END-----` 头尾包裹的文本格式，用于在文件/邮件里传输密钥和证书。

**Q4：为什么需要 BouncyCastle？**

- JDK 原生密码学算法有限（受出口管制、国密等不支持）。BouncyCastle 提供完整算法库（SM2/SM3/SM4、BCrypt、Argon2 等），作为安全 Provider 注册后即可使用。

**Q5：ECB 和 CBC 模式的区别？**

- ECB 每块独立加密，相同明文产生相同密文（不安全，可被模式分析）；CBC 每块与前一块密文异或，需 IV，安全性更好。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 统一加解密入口 | `SecureUtil` |
| 生成对称密钥 | `KeyUtil.generateKey` |
| 生成 RSA 密钥对 | `KeyUtil.generateKeyPair` |
| 读写 PEM 密钥文件 | `PemUtil` / `OpensslKeyUtil` |
| 国密算法 | `SmUtil`（SM2/SM3/SM4） |
| 证书/密钥 ASN.1 解析 | `ASN1Util` |
| 密码学异常统一处理 | `CryptoException` |

---

## 五、当前状态

- **文件**：17 个顶层类，与 hutool 5.8.47 对齐（含 3 个子包 asymmetric/digest/symmetric，共 70 源码）。
- **单元测试**：`SecureUtilTest`/`KeyUtilTest`/`PemUtilTest`/`SmTest`/`BCUtilTest`/`OpensslKeyUtilTest` 等，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。处理要点：工具类加 `private` 构造器 + `final`；HTTP 无关的算法常量用类级 `@SuppressWarnings("checkstyle:MagicNumber")`；star import（`java.security.*` 等）展开成具体类。

---

## 相关

- [crypto-asymmetric包总结](/blog/ztools-crypto-asymmetric-pkg/)
- [crypto-digest包总结](/blog/ztools-crypto-digest-pkg/)
- [crypto-symmetric包总结](/blog/ztools-crypto-symmetric-pkg/)
- [codec包总结](/blog/ztools-codec-pkg/)
- [util包总结](/blog/ztools-util-pkg/)
