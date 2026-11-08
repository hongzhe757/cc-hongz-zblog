---
title: 'exceptions 包（异常封装）总结'
description: 'exceptions 包提供异常封装 + 异常工具，共 9 个文件：'
pubDate: 'Aug 25, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# exceptions 包（异常封装）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/exceptions`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.exceptions`）

---

## 一、包概览

exceptions 包提供**异常封装 + 异常工具**，共 9 个文件：

| 类 | 职责 |
|---|---|
| `ExceptionUtil` | 异常工具（26 方法）：包装、剥离、堆栈转字符串、根因、异常链 |
| `StatefulException` | **带状态码**的异常基类（`status` 字段 + `getStatus()`） |
| `UtilException` | 工具类通用运行时异常 |
| `ValidateException` | 校验异常（继承 `StatefulException`，支持状态码） |
| `DependencyException` | 可选依赖缺失/加载失败异常 |
| `InvocationTargetRuntimeException` | 反射 `InvocationTargetException` 的运行时包装 |
| `NotInitedException` | 组件/上下文未初始化异常 |
| `CheckedUtil` | 函数式受检异常 → 运行时异常转换 |
| `package-info` | 包说明 |

---

## 二、核心设计

### 1. 异常包装（受检 → 运行时）

Java 受检异常强制调用方 try-catch，传播面大。hutool 把它们统一包成运行时异常：

```java
ExceptionUtil.wrapRuntime(throwable);        // 已是 RuntimeException 则直接返回
ExceptionUtil.wrap(throwable, MyException.class);  // 包成指定异常类（反射）
ExceptionUtil.wrapAndThrow(throwable);       // RuntimeException/Error 直接抛，其它包 UndeclaredThrowableException
```

### 2. 异常链 / 根因

`Throwable` 通过 `getCause()` 形成异常链。工具方法沿链查找：

- `unwrap`：剥掉 `InvocationTargetException`/`UndeclaredThrowableException` 反射包装层。
- `getCausedBy`：判断异常链中是否含指定异常类。
- `getThrowableList` / `getRootCause`：取整条链 / 取最尾端根因。
- `getRootCauseMessage`：根因的「类名: 消息」。

### 3. 状态码异常

`StatefulException` 增加 `status` 字段，构造时可传入业务状态码，`getStatus()` 读取——适合「异常带业务错误码」的场景（如接口返回错误码 + 异常）。

### 4. CheckedUtil（函数式）

把「声明受检异常」的 Lambda 转成「抛运行时异常」的函数式对象：

```java
// 原本 new FileInputStream 抛 FileNotFoundException（受检），必须 try-catch
Func0<FileInputStream> f = CheckedUtil.uncheck(() -> new FileInputStream(file));
f.call();  // 抛的是 RuntimeException
```

内部用 `Func0/Func1/Func/VoidFunc*` 等函数式接口 + 对应的 `*Rt` 运行时版本，`try-catch` 在内部统一处理。

---

## 三、面试高频问题

**Q1：受检异常（Checked）和运行时异常（Unchecked）的区别？**

- 受检异常（`Exception` 子类，非 `RuntimeException`）：编译器强制 try-catch 或声明 `throws`。
- 运行时异常（`RuntimeException`）：不强制处理，可自由传播。
- 设计取向：受检异常适合「调用方可恢复」的场景；hutool 倾向把框架内部异常统一成运行时异常，简化调用。

**Q2：为什么框架常把受检异常包成运行时异常？**

- 避免异常声明在方法签名上「传染」，调用方不必层层 try-catch。
- 框架内部异常（如反射、IO）通常调用方无法恢复，运行时异常更合适。

**Q3：异常链（cause）有什么用？**

- 层层包装时保留原始异常，`getCause()` 逐层回溯，定位根因。
- 日志/排查时打印整条链（`stacktraceToString`）而非只看最外层。

---

## 四、应用场景

| 场景 | 对应能力 |
|---|---|
| 反射/IO 异常包装 | `ExceptionUtil.wrapRuntime` / `unwrap` |
| 日志打印完整堆栈 | `ExceptionUtil.stacktraceToString` |
| 异常根因排查 | `getRootCause` / `getThrowableList` |
| 接口返回业务错误码 | `StatefulException`（`status`） |
| 函数式代码去 try-catch | `CheckedUtil.uncheck` |

---

## 五、当前状态

- **文件/方法**：9 文件，与 hutool 5.8.47 完全对齐，无缺漏（补齐了 `CheckedUtil`、`ExceptionUtil` 补 21 方法、`ValidateException` 补 4 个 status 构造器）。
- **单元测试**：`ExceptionUtilTest`（9 用例）+ `CheckedUtilTest`（3 用例，从 hutool 迁移），中文 `@DisplayName`，全绿。
- **checkstyle**：**0 违规**。处理要点：tab→4空格、LineLength 拆行、去掉「阶段 1 最小子集」注释、`ExceptionUtil` 提取 `DEFAULT_LIMIT` 常量。

---

## 相关

- [lang包总结](/blog/ztools-lang-pkg/)
- [util包总结](/blog/ztools-util-pkg/)
