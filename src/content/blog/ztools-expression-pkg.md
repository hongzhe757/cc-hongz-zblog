---
title: 'expression 包（表达式引擎）总结'
description: 'expression 包统一封装 7 种表达式引擎（11 类），根包 + engine 子包：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
---

# expression 包（表达式引擎）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-extra/src/main/java/cc/hongz/ztools/extra/expression`
>
> 对照基准：hutool 5.8.48（`cn.hutool.extra.expression`）

---

## 一、包概览

expression 包统一封装 **7 种表达式引擎**（11 类），根包 + `engine` 子包：

| 类别 | 类 | 职责 |
|---|---|---|
| **统一入口** | `ExpressionUtil` | 门面：`eval(expression, context)` 执行表达式 |
| **引擎接口** | `ExpressionEngine` | SPI：`eval(expression, context, allowClassSet)` |
| **工厂** | `engine.ExpressionFactory` | SPI 自动发现引擎，`Singleton` 单例 |
| **异常** | `ExpressionException` | 引擎缺失/执行异常 |
| **7 个引擎适配** | `engine` 下 `spel`/`aviator`/`jexl`/`mvel`/`jfireel`/`qlexpress`/`rhino` 子包 | 每个一个 `XxxEngine implements ExpressionEngine` |

各引擎对应：`SpELEngine`（Spring EL）、`AviatorEngine`（Aviator）、`JexlEngine`（Apache JEXL）、`MvelEngine`（MVEL）、`JfireELEngine`（JFireEL）、`QLExpressEngine`（阿里 QLExpress）、`RhinoEngine`（Mozilla Rhino，JavaScript）。

---

## 二、核心设计

### 1. 统一 eval 契约 + 白名单

`ExpressionEngine.eval(expression, context, allowClassSet)` 是所有引擎的统一入口。`allowClassSet` 用于类白名单校验：`SpELEngine` 会遍历 context 的 value 类型，不在白名单则抛 `ExpressionException`，防止表达式注入调用到危险类。

### 2. SPI 自动发现

`ExpressionFactory.create()` 用 `ServiceLoaderUtil.loadFirstAvailable(ExpressionEngine.class)` 自动加载，`Singleton.get()` 缓存单例。无引擎时抛 `ExpressionException("No expression jar found ...")`。

### 3. SpEL 的受限上下文（安全）

`SpELEngine` 用 `SimpleEvaluationContext.forReadOnlyDataBinding().withInstanceMethods()` 替代默认的 `StandardEvaluationContext`，禁止类型引用、构造器、静态方法等危险操作，只允许读取变量和调用白名单类实例方法，是防注入的关键。

---

## 三、面试高频问题

**Q1：表达式引擎的注入风险怎么防？**

- 表达式执行本质是「执行用户可控的代码」，恶意表达式可触发反射/类加载/命令执行。hutool 通过 `allowClassSet` 白名单限制可调用类，`SpELEngine` 用 `SimpleEvaluationContext` 禁用类型引用与构造器，只允许读绑定变量和白名单实例方法。

**Q2：SpEL 的 StandardEvaluationContext 和 SimpleEvaluationContext 区别？**

- Standard 功能全（可 new 对象、调静态方法、类型引用），但可被注入利用；Simple 是受限上下文，默认只读绑定变量，按需开启实例方法/类型引用。生产环境处理外部表达式应优先 Simple。

**Q3：为什么用 SPI 而不是硬编码引擎？**

- 表达式引擎都挺重（Aviator/JEXL/MVEL/SpEL 各自是独立 jar），硬编码会让所有用户背上全部依赖。SPI + optional 依赖让「引入哪个引擎用哪个」，未引入的引擎不参与编译和运行。

---

## 相关

- [extra模块总结](/blog/ztools-extra-module/) — 上级 MOC
- [template包总结](/blog/ztools-template-pkg/) — 同属 SPI 引擎族
- [core模块总结](/blog/ztools-core-module/) — 依赖 Singleton/ServiceLoaderUtil
