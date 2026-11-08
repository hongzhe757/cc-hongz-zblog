---
title: 'protector 包（代码保护）总结'
description: '说明：ztools **自有模块**，非 hutool 移植，无对照基准'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# protector 包（代码保护）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-protector/src/main/java/cc/hongz/ztools/protector`
>
> 说明：ztools **自有模块**，非 hutool 移植，无对照基准

---

## 一、包概览

protector 包实现对 **jar 字节码的加密保护**，8 个类分 2 组：

| 类别 | 类 | 职责 |
|---|---|---|
| **加密器** | `JarEncryptor` | 遍历 jar 内 class，用 AES 加密并改名为 `.class.enc`，非 class 资源原样保留 |
| **打包器** | `JarPackager` | 把加密后的 jar 注入运行时壳类并改写 Manifest，产出可运行的保护 jar |
| **命令行** | `ProtectCli` | 代码保护命令行入口（`main`），编排「加密 + 打包」流程 |
| **配置/异常** | `ProtectConfig` / `ProtectException` | 输入/输出 jar 路径 + 保护密钥；保护过程异常 |
| **runtime 运行时** | `AesUtil` / `Bootstrap` / `DecryptClassLoader` | AES 加解密工具；启动器（反射调原始 main）；解密类加载器 |

---

## 二、核心设计

### 1. 保护流程：加密 → 打包 → 运行时解密

三步协同：

1. **加密**（`JarEncryptor`）：读原始 jar，把每个 `.class` 文件用 AES（`AES/ECB/PKCS5Padding`，密钥取密码归一化 16 字节）加密，输出改名为 `.class.enc`；`.properties`/图片等非 class 资源原样保留。
2. **打包**（`JarPackager`）：往加密 jar 注入运行时壳类（`Bootstrap`/`DecryptClassLoader`/`AesUtil` 等，**保持明文**作为启动入口），并把 Manifest 的 `Main-Class` 改写为 `Bootstrap`，原主类记录到自定义属性。
3. **运行**：JVM 启动 `Bootstrap.main()`，它从系统属性/环境变量/启动参数解析保护密钥，用 `DecryptClassLoader` 加载被加密的主类并反射调用其 `main`。

### 2. DecryptClassLoader：解密类加载器

`DecryptClassLoader extends SecureClassLoader`，`findClass()` 中读取 `.class.enc` 密文 → AES 解密 → `defineClass`。未加密资源（JDK 类、第三方依赖）仍走父加载器，双亲委派不被破坏。类加载器只在运行时解密内存字节，磁盘上始终是密文，反编译工具拿到 jar 也读不到原始字节码。

### 3. AesUtil：零依赖 AES

`AesUtil` 是 runtime 壳类之一，`of(password)` 用密码生成密钥，`encrypt/decrypt` 做 AES/ECB/PKCS5Padding 加解密。它**只依赖 JDK**（`javax.crypto`），不引任何外部库，保证注入目标 jar 后能独立运行、不污染受保护应用的依赖。

### 4. Bootstrap：密钥传递 + 反射启动

`Bootstrap.main(args)` 按优先级解析密钥：系统属性 → 环境变量 → 启动参数前缀，拿到密钥后构造 `DecryptClassLoader`，再读 Manifest 中记录的原主类全名，`Class.forName` 反射加载并调用其 `main`。启动器本身不加密，是整个受保护应用的唯一明文入口。

---

## 三、面试高频问题

**Q1：这种「加密 class + 自定义类加载器」保护的原理和局限？**

- 原理：把 `.class` 字节码在磁盘上 AES 加密，运行时用自定义 `ClassLoader` 解密到内存再 `defineClass`，让静态反编译（javap/CFR/jd-gui）读不到原文。
- 局限：密钥必须随应用下发（或经系统属性/环境变量传入），攻击者拿到密钥即可还原；运行时内存中仍会有解密后的类，动态调试仍可 dump。它提高逆向门槛，但不是绝对安全，强度依赖密钥管理。

**Q2：为什么 `DecryptClassLoader` 继承 `SecureClassLoader` 而不是普通 `ClassLoader`？**

- `SecureClassLoader` 增加了「代码来源（CodeSource）与权限」的关联能力，可对加载的类做更细粒度的安全控制；同时它也遵守双亲委派，未加密的类照常交给父加载器，只对 `.class.enc` 做解密加载，是「部分拦截」而非全部接管。

**Q3：双亲委派机制在这里怎么体现？**

- `DecryptClassLoader.findClass()` 只负责加载 `.class.enc` 加密类；JDK 核心类、第三方依赖仍由父加载器（App/Ext/Bootstrap ClassLoader）按双亲委派加载。这样既保护了自有 class，又不影响整个 JVM 的类加载秩序，避免重复定义核心类导致的问题。

**Q4：为什么运行时壳类（Bootstrap/AesUtil）要保持明文？**

- 因为它们是**启动入口**和**解密工具**：`Bootstrap.main` 是 JVM 最先执行的代码，若它自己也加密，就没有加载器能先解密它（鸡生蛋问题）。所以壳类必须明文，由它驱动 `DecryptClassLoader` 去解密其余 class。

---

## 相关

- [protector模块总结](/blog/ztools-protector-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块（文件与流工具）
