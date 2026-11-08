---
title: 'protector 加密模块使用指南'
description: '是一个 jar 代码保护工具：把**可执行 jar** 内的 用 AES 加密成 密文，运行时由注入的 + 解密加载。本文讲「怎么用它加密自己的 jar」。'
pubDate: 'Sep 05, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# protector 加密模块使用指南

> `cc-hongz-ztools-protector` 是一个 jar 代码保护工具：把**可执行 jar** 内的 `.class` 用 AES 加密成 `.class.enc` 密文，运行时由注入的 `Bootstrap` + `DecryptClassLoader` 解密加载。本文讲「怎么用它加密自己的 jar」。

---

## 一、能做什么 / 不能做什么

| | 说明 |
|---|---|
| ✅ 支持 | 可执行 jar（`META-INF/MANIFEST.MF` 里有 `Main-Class`） |
| ❌ 不支持 | 纯库 jar（无 `Main-Class`）—— `ProtectCli` 第一步就强制读 `Main-Class`，会报「输入 jar 的 Manifest 缺少 Main-Class」 |

> 想加密纯库 jar，需自行绕过 `ProtectCli`、直接调用 `JarEncryptor`（只加密 class，不注入启动壳），本文不展开。

---

## 二、构建 protector 工具

在 `cc-hongz-ztools` 目录：

```bash
mvn -pl cc-hongz-ztools-protector -am install -DskipTests
```

产出 fat jar（`maven-shade-plugin` 打包，`Main-Class` 指向 `ProtectCli`）：

```
cc-hongz-ztools-protector/target/cc-hongz-ztools-protector-1.0.0-SNAPSHOT.jar
```

---

## 三、加密一个可执行 jar

```bash
java -jar cc-hongz-ztools-protector.jar \
  -jar <输入jar> -pwd <密钥> [-o <输出jar>]
```

| 参数 | 必填 | 说明 |
|---|---|---|
| `-jar` | 是 | 输入 jar 路径（必须有 `Main-Class`） |
| `-pwd` | 是 | 保护密钥（任意字符串，内部 SHA-256 归一化为 16 字节 AES-128 密钥） |
| `-o` | 否 | 输出 jar，默认 `<输入名>-protected.jar` |

**加密后 jar 内部变化**：

- 所有 `.class` → `.class.enc` 密文（AES/ECB/PKCS5Padding），字节从 `cafe babe` 魔数变随机密文，静态反编译读不到
- 非 class 资源（`META-INF/services/*`、`.properties`、图片等）**原样保留**
- 注入 3 个**明文**壳类：`Bootstrap` / `DecryptClassLoader` / `AesUtil`
- Manifest 改写：`Main-Class` → `cc.hongz.ztools.protector.runtime.Bootstrap`，原主类记到 `X-Original-Main-Class`

---

## 四、运行加密后的 jar

密钥三种传递方式，优先级从高到低：

| 方式 | 示例 |
|---|---|
| 系统属性 | `java -Dprotector.key=xxx -jar app-protected.jar` |
| 环境变量 | `PROTECTOR_KEY=xxx java -jar app-protected.jar` |
| 启动参数 | `java -jar app-protected.jar --pwd=xxx` |

> ⚠️ **坑**：`java -jar app.jar -Dprotector.key=xxx` 这种把 `-D` 放在 `-jar` **之后**的写法无效——它会被当成 main 参数传入，JVM 不识别为系统属性。要么用 `--pwd=xxx`，要么把 `-D` 放到 `-jar` 之前。

---

## 五、端到端演示（protector-demo 模块）

`cc-hongz-ztools-protector-demo` 是一个最小演示模块：主类 `DemoMain` 引用 aop 动态代理（`ProxyUtil.proxy(new Cat(), TimeIntervalAspect.class)`），打成可执行 fat jar 后加密、运行。

**1. 构建 demo fat jar**（含 aop + core，`Main-Class` 指向 `DemoMain`）：

```bash
mvn -pl cc-hongz-ztools-protector-demo -am package -DskipTests
```

**2. 加密**：

```bash
java -jar cc-hongz-ztools-protector/target/cc-hongz-ztools-protector-1.0.0-SNAPSHOT.jar \
  -jar cc-hongz-ztools-protector-demo/target/cc-hongz-ztools-protector-demo-1.0.0-SNAPSHOT.jar \
  -pwd test123 -o demo-protected.jar
```

**3. 运行**：

```bash
java -Dfile.encoding=UTF-8 -jar demo-protected.jar --pwd=test123
```

**输出**：

```
Method [cc.hongz.ztools.protector.demo.DemoMain$Cat.eat] execute spend [2]ms return value [猫吃鱼]
eat 返回值: 猫吃鱼
抓了条鱼
```

证明整条链通了：`Bootstrap → DecryptClassLoader 解密 → ServiceLoader(SPI) → ProxyFactory → JDK 动态代理 → TimeIntervalAspect 计时切面`。

---

## 六、调试日志

运行时加 `-Dprotector.debug=true` 可打印每个类的解密加载过程（默认关闭，避免泄露类结构）：

```bash
java -Dfile.encoding=UTF-8 -Dprotector.debug=true -jar demo-protected.jar --pwd=test123
```

典型片段：

```
[Bootstrap] 密钥已解析，原始主类: cc.hongz.ztools.protector.demo.DemoMain
[Bootstrap] 线程上下文类加载器已切换为 DecryptClassLoader
[DecryptClassLoader] 解密并定义类: DemoMain（密文 1168 字节 → 明文 1155 字节）
[DecryptClassLoader] 解密并定义类: ProxyUtil（密文 2192 字节 → 明文 2185 字节）
[DecryptClassLoader] 未找到密文，委托父加载器: net.sf.cglib.proxy.Callback
```

---

## 七、注意事项

- **只支持可执行 jar**：`ProtectCli` 强依赖 `Main-Class` 编排「读主类 → 加密 → 打包」流程。
- **密钥即安全边界**：密钥随应用下发（系统属性/环境变量/参数），拿到密钥即可还原；运行时内存仍有明文类可 dump。它提高逆向门槛，不是绝对安全，强度依赖密钥管理。
- **壳类必须明文**：`Bootstrap` 是 JVM 最先执行的启动入口，若也加密则无人能先解密它（鸡生蛋问题）。
- **TCCL 已修复**：`Bootstrap` 会把 `DecryptClassLoader` 设为线程上下文类加载器，保证 SPI（`ServiceLoader`）等能加载到解密后的类。

---

## 八、启动验收清单（怎么判断正确）

启动后**同时满足**以下三条才算正确：

1. **exit code = 0** —— 进程正常退出，不是崩溃
2. **打印了业务输出** —— 主类真实输出，不是壳类报错
3. **stderr 无异常栈** —— 没有 `Exception in thread "main"`

错误对照：

| 报错 | 原因 |
|---|---|
| `未找到保护密钥...` | 密钥没传（缺 `--pwd` / `-Dprotector.key` / 环境变量） |
| `AES 解密失败` + `BadPaddingException` | 密钥传错（与加密时密码不一致） |
| `ClassNotFoundException` / `NoClassDefFoundError` | 主类名或依赖没对上 |

---

## 相关

- [protector模块总结](/blog/ztools-protector-module/) — 模块 MOC
- [protector包总结](/blog/ztools-protector-pkg/) — 内部 8 类设计与原理
- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块（文件与流工具）
