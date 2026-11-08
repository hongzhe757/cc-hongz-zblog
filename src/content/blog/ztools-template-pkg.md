---
title: 'template 包（模板引擎）总结'
description: 'template 包是 extra 模块的模板引擎抽象层（26 类），统一封装 8 种模板引擎，分根包 + engine 子包：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# template 包（模板引擎）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-extra/src/main/java/cc/hongz/ztools/extra/template`
>
> 对照基准：hutool 5.8.48（`cn.hutool.extra.template`）

---

## 一、包概览

template 包是 extra 模块的**模板引擎抽象层**（26 类），统一封装 8 种模板引擎，分根包 + `engine` 子包：

| 类别 | 类 | 职责 |
|---|---|---|
| **统一入口** | `TemplateUtil` | 门面：`createEngine()` 按 classpath 自动创建引擎 |
| **引擎接口** | `TemplateEngine` | 引擎 SPI：`init(config)` / `getTemplate(resource)` |
| **模板接口** | `Template` / `AbstractTemplate` | 渲染契约：`render(bindingMap, writer/out/file)` 及返回字符串 |
| **配置** | `TemplateConfig` | 编码、模板路径、资源加载方式（CLASSPATH/FILE/WEB_ROOT/STRING/COMPOSITE）、自定义引擎、是否缓存 |
| **工厂** | `engine.TemplateFactory` | SPI 自动发现引擎，`Singleton` 单例缓存 |
| **异常** | `TemplateException` | 引擎缺失/渲染失败异常 |
| **8 个引擎适配** | `engine` 下 `beetl`/`enjoy`/`freemarker`/`jetbrick`/`rythm`/`thymeleaf`/`velocity`/`wit` 子包 | 每个子包一个 `XxxEngine` + `XxxTemplate`，把第三方引擎的 `render` 适配到 `Template` 接口 |

---

## 二、核心设计

### 1. SPI 自动发现（ServiceLoaderUtil）

`TemplateFactory.create()` 通过 `ServiceLoaderUtil.loadFirstAvailable(TemplateEngine.class)` 自动加载 classpath 上存在的引擎实现；`config.getCustomEngine()` 可显式指定引擎，覆盖自动判断。找不到任何引擎时抛 `TemplateException("No template found ...")`。

### 2. 引擎 + 模板双接口适配

每个引擎由两个类构成：

- `XxxEngine implements TemplateEngine`：负责 `init(config)` 初始化底层引擎、`getTemplate(resource)` 返回模板对象。
- `XxxTemplate extends AbstractTemplate`：持有底层模板对象，实现 `render(Map, Writer)`，把 hutool 的绑定参数 Map 转成底层引擎的 context 后渲染。

`AbstractTemplate` 已实现 `render(Map)` 返回 String（StringWriter）和 `render(Map, File)`（写文件），子类只需实现 `render(Map, Writer)`。

### 3. TemplateConfig 的资源加载模式

`ResourceMode` 枚举定义 5 种模板来源：CLASSPATH、FILE、WEB_ROOT、STRING（直接传模板文本）、COMPOSITE（按序尝试）。默认 STRING 模式，适配「模板即字符串」的场景（如代码生成、消息模板）。

### 4. 模板渲染缓存

`TemplateConfig.useCache`（默认 true）开启后引擎会缓存模板，避免每次重复解析。Freemarker/Velocity 各自有 `SimpleStringTemplateLoader`/`SimpleStringResourceLoader` 支持从字符串加载模板。

---

## 三、面试高频问题

**Q1：为什么 hutool 能同时支持 8 种模板引擎？用了什么设计？**

- 用「接口 + SPI」解耦：`TemplateEngine`/`Template` 定义统一契约，各引擎 jar 通过 `META-INF/services` 注册实现，`ServiceLoaderUtil` 在运行时自动发现并加载。用户引入哪个引擎 jar 就用哪个，未引入的引擎不参与编译/加载。这是典型的**策略模式 + SPI 服务发现**。

**Q2：Template 接口为什么有 4 个 render 重载？**

- 输出目标不同：Writer（文本）、OutputStream（二进制/流）、File（落盘）、String（直接返回）。`AbstractTemplate` 用 `StringWriter` 把 String 版委托给 Writer 版，用 `BufferedOutputStream` 把 File 版委托给 Stream 版，子类只需实现最核心的一个。

**Q3：模板引擎怎么选型？**

- 常用：Freemarker（功能全、语法成熟）、Velocity（轻量、Apache 系）、Thymeleaf（Spring 集成好、模板即自然 HTML）。hutool 只做统一封装，选型取决于团队栈和场景（代码生成常用 Freemarker/Velocity，Web 页面常用 Thymeleaf）。

---

## 相关

- [extra模块总结](/blog/ztools-extra-module/) — 上级 MOC
- [expression包总结](/blog/ztools-expression-pkg/) — 同属「引擎 SPI 自动发现」一族
- [core模块总结](/blog/ztools-core-module/) — 依赖 Singleton/ServiceLoaderUtil/StrUtil
