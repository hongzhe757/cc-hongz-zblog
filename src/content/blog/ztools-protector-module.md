---
title: 'protector 模块总结'
description: '是 ztools **自有模块**（非 hutool 移植），包路径 。共 8 主类（+1 package-info），分根包 + runtime 两个层次，实现 jar 代码保护：AES 加密 class + 运行时自定义类加载器解密。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

# protector 模块总结（MOC）

> `cc-hongz-ztools-protector` 是 ztools **自有模块**（非 hutool 移植），包路径 `cc.hongz.ztools.protector`。共 8 主类（+1 package-info），分根包 + runtime 两个层次，实现 jar 代码保护：AES 加密 class + 运行时自定义类加载器解密。

---

## 分层

- [protector包总结](/blog/ztools-protector-pkg/) — 根包（`JarEncryptor`/`JarPackager`/`ProtectCli`/`ProtectConfig`/`ProtectException` 5 类）+ runtime 运行时壳类（`AesUtil`/`Bootstrap`/`DecryptClassLoader` 3 类）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/)（`IoUtil`/`FileUtil` 等文件与流工具）
- 运行时壳类（runtime 子包）**仅依赖 JDK**，不依赖任何外部库，便于注入目标 jar 后独立运行
- 打包用 `maven-shade-plugin`（构建期，非运行时依赖）
- 无 hutool 对照基准（自有模块）

## 相关

- [protector使用指南](/blog/ztools-protector-guide/) — 如何使用（加密 jar、运行、demo 演示、调试日志）
- [protector加密总结](/blog/ztools-protector-encrypt/) — 实现总结（机制/demo/验收/提交状态）
- [protector加密规划](/blog/ztools-protector-encrypt-plan/) — 能力规划（lib jar/资源/设备绑定）
- [protector能力边界与扩展](/blog/ztools-protector-scope/) — 设备绑定/资源加密/lib jar 分离加密
- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
