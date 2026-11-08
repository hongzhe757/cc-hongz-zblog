---
title: 'crypto.symmetric 包（对称加密）总结'
description: 'symmetric 包提供对称加密（加解密用同一密钥），16 个类：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# crypto.symmetric 包（对称加密）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-crypto/src/main/java/cc/hongz/ztools/crypto/symmetric`
>
> 对照基准：hutool 5.8.47（`cn.hutool.crypto.symmetric`）

---

## 一、包概览

symmetric 包提供**对称加密**（加解密用同一密钥），16 个类：

| 类别 | 类 | 职责 |
|---|---|---|
| **通用实现** | `SymmetricCrypto` / `SymmetricEncryptor` / `SymmetricDecryptor` / `SymmetricAlgorithm` | 对称加解密骨架、接口、算法枚举 |
| **分组密码** | `AES` / `DES` / `DESede` / `SM4` | 常见分组加密算法 |
| **流密码** | `RC4` / `ChaCha20` / `ZUC` | 流式加密（逐字节/逐位） |
| **其他** | `PBKDF2` / `Vigenere` / `XXTEA` / fpe 子包（`FPE`） | 密钥派生、维吉尼亚、XTEA、格式保持加密 |

---

## 二、核心设计

### 1. SymmetricCrypto：统一骨架

`SymmetricCrypto` 实现 `SymmetricEncryptor`/`SymmetricDecryptor`，内部用 `CipherWrapper` 处理 mode/padding/IV，各算法类（AES/DES/SM4）只需指定算法名即可复用全套加解密逻辑。

### 2. 分组模式与填充

对称加密的算法名通常是三段式：`AES/CBC/PKCS5Padding`（算法/模式/填充）。`CipherMode` 枚举模式（ECB/CBC/CTR 等），`Padding` 枚举填充（PKCS5/ZeroPadding 等）。`SymmetricCrypto.init` 会自动把 ZeroPadding 替换为 NoPadding 并标记。

### 3. IV 初始化向量

CBC/CTR 模式需要 IV（随机向量）保证「相同明文加密结果不同」。`setIv`/`initParams` 处理 IV 和加盐参数；PBE 算法用 `PBEParameterSpec`，AES 用 `IvParameterSpec`。

### 4. 流密码 vs 分组密码

流密码（RC4/ChaCha20/ZUC）逐字节处理，无需填充；分组密码（AES/DES）按固定块（8/16 字节）处理，不足需填充。

---

## 三、面试高频问题

**Q1：AES 和 DES 的区别？**

- DES 密钥仅 56 位，已被暴力破解（不安全）；AES 密钥 128/192/256 位，是当前标准。DESede（3DES）是 DES 的补救（三次加密），已逐渐被 AES 取代。

**Q2：ECB 和 CBC 的区别？**

- ECB 每块独立加密，相同明文块产生相同密文块（能看到数据模式，如企鹅图）；CBC 每块与前一块密文异或，需 IV，相同明文加密结果不同，安全性更好。

**Q3：IV（初始化向量）有什么用？**

- 让「相同明文 + 相同密钥」每次加密产生不同密文，防止攻击者从重复密文推断明文。IV 需随机、不需保密（通常随密文一起传输）。

**Q4：为什么需要填充（Padding）？**

- 分组密码按固定块处理，明文长度不一定是块的整数倍。填充把明文补齐到块大小（如 PKCS5 用缺几个字节就补几个），解密后再去掉。

**Q5：流密码和分组密码的区别？**

- 流密码逐位/逐字节加密，速度快、无需填充（RC4/ChaCha20）；分组密码按块处理，需填充（AES/DES）。流密码适合流式传输，分组密码适合整块数据。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 通用对称加解密 | `SymmetricCrypto` |
| 数据加密（标准） | `AES` |
| 国密对称加密 | `SM4` |
| 流式加密 | `RC4` / `ChaCha20` |
| 密码派生密钥 | `PBKDF2` |
| 脱敏（格式保持加密） | fpe 子包 `FPE` |

---

## 五、当前状态

- **文件**：16 个类（含 fpe 子包），与 hutool 5.8.47 对齐。
- **单元测试**：`AESTest`/`DesTest`/`Sm4StreamTest`/`RC4Test`/`ChaCha20Test`/`PBKDF2Test`/`TEATest`/`ZucTest`/`FPETest` 等，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。处理要点：`SymmetricCrypto.init` 的 algorithm 参数重赋值改局部变量 `resolvedAlgorithm`；`FPE` 构造器的 mode/tweak 重赋值改 `resolvedMode`/`resolvedTweak`；算法常量（ZUC 的 16/25 字节等）用类级 `@SuppressWarnings("checkstyle:MagicNumber")`。

---

## 相关

- [crypto包总结](/blog/ztools-crypto-pkg/)
