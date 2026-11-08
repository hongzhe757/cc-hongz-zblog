---
title: 'script 包（脚本引擎封装）总结'
description: 'script 包基于 JSR-223（javax.script） 封装脚本引擎，4 个类单包结构：'
pubDate: 'Sep 01, 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "框架"]
category: 'ztools'
---

# script 包（脚本引擎封装）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-script/src/main/java/cc/hongz/ztools/script`
>
> 对照基准：hutool 5.8.48（`cn.hutool.script`）

---

## 一、包概览

script 包基于 **JSR-223（`javax.script`）** 封装脚本引擎，4 个类单包结构：

| 类别 | 类 | 职责 |
|---|---|---|
| **门面** | `ScriptUtil` | 静态方法获取/创建脚本引擎并执行，内置 JS/Python/Lua/Groovy/Ruby/Kotlin/BeanShell 便捷方法 |
| **全功能引擎** | `FullSupportScriptEngine` | 包装 `ScriptEngine`，同时实现 `Compilable` + `Invocable`，支持预编译与函数调用 |
| **JS 引擎** | `JavaScriptEngine` | 专用于 JavaScript 的引擎子类，提供 `invokeFunction/getInterface` |
| **异常** | `ScriptRuntimeException` | 脚本运行时异常 |

---

## 二、核心设计

### 1. ScriptUtil：门面 + 引擎缓存

`ScriptUtil` 通过 `ScriptEngineManager` 按「名称/扩展名/MIME」查找引擎，`getScript(nameOrExtOrMime)` 返回单例缓存，`createScript(...)` 每次新建。内置便捷方法：`getJsEngine()`（JDK 内置，JDK 15+ 需 GraalJS）、`getPythonEngine()`（需 jython）、`getLuaEngine()`（需 luaj-jse）、`getGroovyEngine()`、`getRubyEngine()`、`getKotlinEngine()`、`getBeanShellEngine()`。这些引擎依赖都是 `provided`，用到才引入。

### 2. FullSupportScriptEngine：补全 Compilable/Invocable

并非所有 `ScriptEngine` 都实现 `Compilable`（预编译脚本）和 `Invocable`（调用脚本内函数/获取接口代理）。`FullSupportScriptEngine` 实现这两个接口并委托给底层引擎——若底层支持则直接委托，不支持则提供降级实现。这统一了「引擎能力参差不齐」的差异，上层可无差别地 `compile()`、`invokeFunction()`。

### 3. JavaScriptEngine：JS 便捷封装

`JavaScriptEngine extends FullSupportScriptEngine`，构造时指定 JS 引擎，`instance()` 返回单例。补充 `invokeMethod(thiz, name, args)`（调用对象方法）、`invokeFunction(name, args)`（调用脚本内函数）、`getInterface(clasz)`（把脚本实现导出为 Java 接口代理，如让 JS 脚本实现某个 Java 接口）。

---

## 三、面试高频问题

**Q1：JSR-223 是什么？hutool-script 和它什么关系？**

- JSR-223 是「Java 平台脚本语言集成」规范，定义了 `ScriptEngineManager` 发现引擎、`ScriptEngine.eval()` 执行脚本、`Compilable` 预编译、`Invocable` 调用脚本函数等标准接口。hutool-script 只是对这套标准的**门面封装**：统一引擎获取（名称/扩展名/MIME）、缓存、异常包装，不重新发明引擎本身。

**Q2：为什么有些引擎支持 `invokeFunction` 有些不支持？**

- `ScriptEngine` 是基础接口，只保证 `eval()`；`Invocable`/`Compilable` 是可选能力，由具体引擎决定是否实现。`FullSupportScriptEngine` 把这两个接口「补全」，支持时委托、不支持时降级，抹平引擎能力差异，让上层统一用 `invokeFunction` 而不必类型判断。

**Q3：JDK 15 之后为什么 JavaScript 引擎没了？**

- 老 JDK 自带 Rhino 引擎，后来换成 Nashorn，但 Nashorn 在 JDK 15 被移除（JEP 372）。所以 JDK 15+ 默认 `getJsEngine()` 找不到内置 JS 引擎，需要额外引入 GraalJS 等 JSR-223 实现。这是文档里「JDK 15+ 需 GraalJS」的由来。

**Q4：`getInterface` 能做什么？**

- 它把 JS 脚本「导出」为 Java 接口的代理对象：脚本里定义一个符合 Java 接口的方法，`getInterface(MyService.class)` 就拿到一个可在 Java 侧直接调用的实现。常用于「用脚本写策略/回调，Java 主程序调用」，实现脚本热更新而无须重新编译 Java 代码。

---

## 相关

- [script模块总结](/blog/ztools-script-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
