---
title: 'protector 加密实现总结'
description: '本轮完成：protector 代码保护工具 + 端到端演示模块 + 验收清单 + 提交推送。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# protector 加密实现总结

> 本轮完成：protector 代码保护工具 + 端到端演示模块 + 验收清单 + 提交推送。

---

## 一、加密机制（现状）

| 项 | 实现 |
|---|---|
| 算法 | AES/ECB/PKCS5Padding |
| 密钥 | 密码 SHA-256 归一化取前 16 字节（AES-128），**无硬编码** |
| class | `.class` → `.class.enc` 密文 |
| 资源 | 非 class 原样保留 |
| 支持范围 | 只可执行 jar（要求 `Main-Class`） |

三个明文壳类：`Bootstrap`（启动器 + 密钥解析）/ `DecryptClassLoader`（解密加载）/ `AesUtil`（零依赖 AES）。

## 二、完整流程

```
加密(JarEncryptor) → 打包(JarPackager 注入壳 + 改 Manifest)
  → 运行时(Bootstrap 解析密钥 → DecryptClassLoader 解密 → 反射调 main)
```

## 三、demo 演示模块

`cc-hongz-ztools-protector-demo`：`DemoMain` 引用 aop 动态代理（JDK 接口代理 + `TimeIntervalAspect`），shade 打 fat jar → protector 加密 → 运行验证通过。

## 四、关键修复与增强

- **TCCL 修复**：Bootstrap 设置线程上下文类加载器，修复加密 jar 内 SPI（ServiceLoader）加载不到解密类的问题
- **调试日志**：`-Dprotector.debug=true` 开关，打印密钥解析与类解密加载过程

## 五、验收清单

启动**同时满足**三条算正确：`exit code=0` + 打印业务输出 + 无异常栈。

| 报错 | 原因 |
|---|---|
| `未找到保护密钥...` | 密钥没传 |
| `AES 解密失败` / `BadPaddingException` | 密钥传错 |
| `ClassNotFoundException` | 主类名/依赖没对上 |

## 六、提交状态

protector / demo / 父仓库三个仓库已提交推送 dev（`9b394ef` / `39915b2` / `004a729`）。

## 相关

- [protector使用指南](/blog/ztools-protector-guide/) — 如何使用
- [protector能力边界与扩展](/blog/ztools-protector-scope/) — 扩展思路
- [protector模块总结](/blog/ztools-protector-module/) — 模块 MOC
