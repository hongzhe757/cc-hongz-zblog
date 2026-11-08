---
title: 'crypto 模块总结'
description: '是 hutool-crypto 的移植镜像，包路径 。共 70 源码，分 4 层。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# crypto 模块总结（MOC）

> `cc-hongz-ztools-crypto` 是 hutool-crypto 的移植镜像，包路径 `cc.hongz.ztools.crypto`。共 70 源码，分 4 层。

---

## 分层

- [crypto包总结](/blog/ztools-crypto-pkg/) — 根包（SecureUtil/KeyUtil/SignUtil/PemUtil 等密钥工具）
- [crypto-asymmetric包总结](/blog/ztools-crypto-asymmetric-pkg/) — 非对称（RSA/SM2/数字签名）
- [crypto-digest包总结](/blog/ztools-crypto-digest-pkg/) — 摘要（MD5/SM3/BCrypt/Argon2/HMac）
- [crypto-symmetric包总结](/blog/ztools-crypto-symmetric-pkg/) — 对称（AES/DES/SM4/RC4/ChaCha20）

---

## 依赖关系

- 根包 [crypto包总结](/blog/ztools-crypto-pkg/) 依赖 [codec包总结](/blog/ztools-codec-pkg/)（Base64）与 [util包总结](/blog/ztools-util-pkg/)（HexUtil/StrUtil）
- [crypto-asymmetric包总结](/blog/ztools-crypto-asymmetric-pkg/)、[crypto-digest包总结](/blog/ztools-crypto-digest-pkg/)、[crypto-symmetric包总结](/blog/ztools-crypto-symmetric-pkg/) 都依赖根包的 `SecureUtil`/`KeyUtil`

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
