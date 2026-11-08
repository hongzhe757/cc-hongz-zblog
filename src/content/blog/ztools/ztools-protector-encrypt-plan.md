---
title: 'protector 加密能力规划'
description: '待扩展方向，按优先级排序。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# protector 加密能力规划

> 待扩展方向，按优先级排序。

---

## P0：授权文件（license）替代密码

**现状问题**：密码 = 静态共享密钥，只有「保密」没有「管控」——无设备绑定、无有效期、无吊销、无使用统计。

**方案**：把「随便填的密码」升级为「发行方签发的授权凭证」。

授权文件（`license.key`）结构：

```json
{
  "appId": "cc-hongz-ztools",
  "deviceFingerprint": "3f2a...",   // 目标设备指纹（绑设备）
  "expireAt": "2026-12-31",          // 有效期
  "key": "AES密钥或密钥材料",          // 真正的解密密钥
  "signature": "MEUCI..."            // 对上面字段的签名，防篡改
}
```

运行时流程（替代 `--pwd=`）：

```
读 license → 验签(非对称，防篡改) → 校验设备指纹 → 校验有效期 → 取 key → 解密
```

- **密钥藏进文件**：用户拿授权文件，不直接知道密钥；验签通过才取出解密
- **防篡改**：私钥留发行方，客户端内嵌公钥验签，改任何字段签名即失效
- **设备绑定**：文件里写目标设备指纹，运行时比对，不匹配拒绝

**离线 vs 在线管控**：

| 模式 | 机制 | 能力 |
|---|---|---|
| 离线授权文件 | 本地验签 + 校验指纹 + 有效期 | 绑设备、设时限；吊销需重发文件 |
| 在线授权 | + 上报服务端二次校验 | 实时吊销、使用统计、并发控制 |

**复用模块**：`crypto`（RSA/SM2 非对称签名）+ `system/OshiUtil`（设备指纹）+ `http`（上报）

## P1：lib jar 分离加密

- `ProtectCli` 加 `--encrypt-only` 只加密不注入壳模式（lib jar 用）
- 主 jar `Class-Path` 声明 lib jar，依赖独立放 `lib/` 单独加密
- 运行时 `DecryptClassLoader` 跨 jar 找 `.class.enc`（已支持，无需改代码）

## P2：资源文件加密

- **轻量路线（推荐）**：只加密敏感配置（`application.yml`、数据库密码），`Bootstrap` 解密后喂给框架
- 重量路线：`DecryptClassLoader` override `getResource` 解密（成本高、框架读取路径难覆盖全）

## 其他

- 密钥管理增强（密钥库 / 多密钥 / 密钥轮换）
- 纯库 jar 支持（当前只支持可执行 jar）

## 相关

- [protector加密总结](/blog/ztools-protector-encrypt/) — 现状总结
- [protector能力边界与扩展](/blog/ztools-protector-scope/) — 扩展思路详情
- [protector使用指南](/blog/ztools-protector-guide/) — 如何使用
