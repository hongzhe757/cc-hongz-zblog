---
title: 'compiler 包（动态编译）总结'
description: 'compiler 包封装了 JDK 的 javax.tools.JavaCompiler API，实现运行时动态编译 Java 源码——把字符串源码编译成 Class 并加载到内存，不落盘 .class 文件：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# compiler 包（动态编译）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/compiler`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.compiler`）

---

## 一、包概览

compiler 包封装了 JDK 的 `javax.tools.JavaCompiler` API，实现**运行时动态编译 Java 源码**——把字符串源码编译成 `Class` 并加载到内存，不落盘 `.class` 文件：

| 类 | 职责 |
|---|---|
| `JavaSourceCompiler` | **核心**，流式 API：`addSource(...)` 加源码 → `compile()` 编译 → 返回 `ClassLoader` |
| `CompilerUtil` | 静态工具：获取 `JavaCompiler` 实例、`JavaFileManager`、编译任务 `CompilationTask` |
| `JavaClassFileManager` | 自定义文件管理器，把编译产物（字节码）存**内存** |
| `JavaClassFileObject` | 封装内存中的字节码（`byte[]`），实现 `JavaFileObject` |
| `JavaSourceFileObject` | 封装源码（字符串或流），实现 `JavaFileObject` |
| `JavaFileObjectUtil` | 工具：判断 `.java`/`.jar`/`.zip`，构建 `JavaFileObject` |
| `DiagnosticUtil` | 收集编译错误/警告的诊断消息 |
| `CompilerException` | 编译异常 |

---

## 二、核心设计

### 1. 动态编译的完整链路

```java
ClassLoader cl = CompilerUtil.getCompiler(null)   // 1. 创建编译器
        .addSource("test.Hello", "package test; public class Hello {}")  // 2. 加源码
        .compile();                                // 3. 编译 → 返回 ClassLoader
Class<?> c = cl.loadClass("test.Hello");           // 4. 加载类
```

底层依赖 JDK 的 `javax.tools.JavaCompiler`（`ToolProvider.getSystemJavaCompiler()`），即 `javac` 的编程接口。

### 2. 内存化编译（不落盘）

`JavaClassFileManager` 重写 `getJavaFileForOutput(...)`，把编译产物导向 `JavaClassFileObject`（内存 `byte[]`），而非写 `.class` 文件。`JavaSourceFileObject.getCharContent()` 提供源码内容，让编译器从内存读取源码。

### 3. 类加载器

编译产物由 `URLClassLoader`（或自定义）加载。`JavaSourceCompiler` 支持传入 `parentClassLoader` 设置父加载器，以及 `addLibrary(...)` 加入编译时依赖的 jar。

### 4. 诊断收集

`DiagnosticCollector` 收集编译过程中的错误/警告，编译失败时通过 `DiagnosticUtil.getMessages()` 拼成可读的错误信息，抛 `CompilerException`。

---

## 三、面试高频问题

**Q1：Java 怎么在运行时动态编译代码？**

- 用 `javax.tools.JavaCompiler`（`ToolProvider.getSystemJavaCompiler()`）拿到编译 API。
- 构造 `CompilationTask`，传入源码（`JavaFileObject`）和文件管理器，调用 `task.call()` 编译。

**Q2：类加载机制？双亲委派模型？**

- 类加载器按「双亲委派」向上委托：先让父加载器尝试，父无法加载才自己加载，保证核心类安全、避免重复加载。
- 动态编译的类由自定义 `ClassLoader` 加载到内存。

**Q3：动态编译有什么用？**

- JSP/模板引擎（把模板转成 Java 再编译执行）、规则引擎、表达式求值、热更新、测试代码生成等。

**Q4：为什么要把编译产物放内存而不是写 `.class` 文件？**

- 临时类无需持久化，避免磁盘 IO 和文件清理，适合「一次性生成即用」的场景。

---

## 四、应用场景

| 场景 | 说明 |
|---|---|
| 模板引擎 | 模板 → Java 源码 → 动态编译 → 执行 |
| 规则/表达式引擎 | 把规则编译成类提高执行性能 |
| 测试代码生成 | 运行时生成并编译测试类 |
| 脚本化执行 | 以字符串形式执行 Java 片段 |

---

## 五、当前状态

- **文件/方法**：9 个主类，与 hutool 5.8.47 完全对齐，无缺漏。
- **单元测试**：`JavaSourceCompilerTest` 32 个用例（含真实编译、错误编译、内存编译、`addSource` Map 等），中文 `@DisplayName`。
- **checkstyle**：**0 违规**。处理要点：`CompilerException` 5 个构造器补 javadoc；`JavaSourceCompiler.compile(List<String>)` 参数加 `final`（方法内重赋 `options`，改用局部变量 `optionList`）；删未用 `CharsetUtil` import。

---

## 相关

- [util包总结](/blog/ztools-util-pkg/)
