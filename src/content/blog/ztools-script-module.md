---
title: 'script 模块总结'
description: '是 hutool-script 的移植镜像，包路径 。共 4 主类（+1 package-info），单包结构，基于 JSR-223 封装脚本引擎（JavaScript 为主）的获取与执行。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "框架"]
---

# script 模块总结（MOC）

> `cc-hongz-ztools-script` 是 hutool-script 的移植镜像，包路径 `cc.hongz.ztools.script`。共 4 主类（+1 package-info），单包结构，基于 JSR-223 封装脚本引擎（JavaScript 为主）的获取与执行。

---

## 分层

- [script包总结](/blog/ztools-script-pkg/) — 单包（`ScriptUtil` 门面 + `FullSupportScriptEngine` 全功能引擎 + `JavaScriptEngine` JS 引擎 + `ScriptRuntimeException` 异常）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/) 的 [lang包总结](/blog/ztools-lang-pkg/)（`Assert`/`StringBuilder`）、[util包总结](/blog/ztools-util-pkg/)（`StrUtil`）、[exceptions包总结](/blog/ztools-exceptions-pkg/)
- 各脚本引擎实现均为 `provided`（`jython`/`luaj-jse`/`groovy-all`/`jruby-core`/`kotlin-scripting-jsr223`/`bsh`），JS 引擎 JDK 内置（JDK 15+ 需 GraalJS）
- 纯 JSR-223（`javax.script`）无强三方依赖

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
