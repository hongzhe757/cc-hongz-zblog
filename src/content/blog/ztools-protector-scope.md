---
title: 'protector 能力边界与扩展'
description: 'protector 当前只做「可执行 jar 的 class AES 加密 + 运行时解密加载」。本文梳理它**没做**的能力（设备绑定、资源加密、分离式 lib jar 加密），以及要补时的集成思路。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-3.jpg'
---

# protector 能力边界与扩展

> protector 当前只做「可执行 jar 的 class AES 加密 + 运行时解密加载」。本文梳理它**没做**的能力（设备绑定、资源加密、分离式 lib jar 加密），以及要补时的集成思路。

---

## 一、能力现状

| 能力 | 现状 |
|---|---|
| class 加密 | ✅ `.class` → `.class.enc` 密文 |
| 资源文件加密 | ❌ 非 class 原样保留 |
| 设备绑定 | ❌ 密钥=纯密码，任何设备拿到 jar+密码都能跑 |
| 设备信息上报 | ❌ 无 |
| 分离式 lib jar 加密 | ⚠️ 半支持（需 `Class-Path` + 「只加密」模式） |

## 二、设备绑定 / 上报

protector 的 runtime 壳类（`Bootstrap`/`DecryptClassLoader`/`AesUtil`）只依赖 JDK，密钥就是密码的 SHA-256 归一化。要做设备绑定，两种模式：

- **模式 A（离线绑定）**：密钥 = `f(密码, 设备指纹)`。加密时和运行时都用同一套指纹（主板 UUID / MAC / CPU 标识）参与生成密钥，设备不对 → 密钥不对 → `AES 解密失败`。
- **模式 B（在线授权 + 上报）**：密钥保持纯密码，解密前采集本机指纹 → `HttpRequest.post` 到授权服务校验 → 通过才解密。「上报设备信息」就落在这里。

可复用积木：

| 模块 | 能力 | 用途 |
|---|---|---|
| `system` | `OshiUtil.getSystem()` 主板 UUID/序列号、`getNetworkIFs()` MAC、`getProcessor()` CPU | 采集指纹 |
| `http` | `HttpRequest` | 上报通道 |
| `crypto` | `DigesterFactory`（SHA-256 等） | 多路硬件信息 hash 成指纹串 |

**权衡**：引入 OSHI 会破坏 runtime 壳类的「零依赖」约定（要连带打 JNA 等进目标 jar）；只用 JDK 原生只能拿到主机名/IP 弱指纹。

## 三、资源文件加密

主流商用混淆「只加密 class、资源默认不加密」是常态（protector 也是）。要补资源加密两条路：

- **路线 1（重）**：整体加密资源 + 在 `DecryptClassLoader` override `getResource`/`getResourceAsStream` 解密。难点是框架内部读取路径难覆盖全。
- **路线 2（轻，推荐）**：只加密敏感配置（`application.yml`、数据库密码等），运行时在 `Bootstrap` 解密后写入临时位置喂给框架。

## 四、分离式 lib jar 加密

不 shade 合并，把依赖独立放 `lib/`，单独加密，主 jar 通过 `Class-Path` 识别：

```
app/
├── app.jar            # 主 jar：主类 + Bootstrap 壳（加密）
└── lib/
    ├── ztools-aop.jar # 依赖（加密：.class → .class.enc）
    └── ztools-core.jar
```

主 jar Manifest：`Class-Path: lib/ztools-aop.jar lib/ztools-core.jar`

- **加密时**：主 jar 走完整流程（`JarEncryptor` + `JarPackager` 注入壳）；lib jar 只需 `JarEncryptor` 加密、**不注入壳**。
- **运行时**：`DecryptClassLoader.getResourceAsStream` 通过父加载器（AppClassLoader，classpath 含 `Class-Path` 的 lib jar）跨 jar 找到 `.class.enc`，无需改代码。

**需补**：给 `ProtectCli` 加「只加密不注入壳」选项（lib jar 用），否则 lib jar 会被当成主 jar 注入 Bootstrap。

## 相关

- [protector使用指南](/blog/ztools-protector-guide/) — 如何使用
- [protector模块总结](/blog/ztools-protector-module/) — 模块 MOC
