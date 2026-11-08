---
title: 'aop 包（动态代理）总结'
description: 'aop 包是动态代理的统一封装，11 个类按职责分 4 组：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "框架"]
category: 'ztools'
---

# aop 包（动态代理）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-aop/src/main/java/cc/hongz/ztools/aop`
>
> 对照基准：hutool 5.8.48（`cn.hutool.aop`）

---

## 一、包概览

aop 包是**动态代理**的统一封装，11 个类按职责分 4 组：

| 类别 | 类 | 职责 |
|---|---|---|
| **门面** | `ProxyUtil` | 创建代理的统一静态入口：`proxy()`/`newProxyInstance()` |
| **代理工厂** | `ProxyFactory` / `JdkProxyFactory` / `CglibProxyFactory` / `SpringCglibProxyFactory` | 工厂接口 + 三种实现（JDK 动态代理 / Cglib / Spring-Cglib） |
| **拦截器** | `JdkInterceptor` / `CglibInterceptor` / `SpringCglibInterceptor` | 三种代理对应的 `InvocationHandler`/`MethodInterceptor`，拦截方法调用并触发切面 |
| **切面** | `Aspect` / `SimpleAspect` / `TimeIntervalAspect` | 切面接口 + 简单切面（方法前后钩子）+ 耗时统计切面 |

---

## 二、核心设计

### 1. 三种代理方式

- **JDK 动态代理**（`JdkProxyFactory`）：基于 `java.lang.reflect.Proxy`，**只能代理实现了接口的类**，运行时生成代理类。
- **Cglib**（`CglibProxyFactory`）：基于字节码生成子类，**能代理无接口的普通类**（final 类/方法除外）。
- **SpringCglib**（`SpringCglibProxyFactory`）：用 Spring 重打包的 cglib（`org.springframework.cglib`），避免和第三方 cglib 冲突。

`ProxyUtil.proxy()` 通过 SPI 自动选择可用的代理工厂，无接口类自动走 Cglib，有接口类走 JDK。

### 2. Aspect 切面：方法前后钩子

`Aspect` 接口定义 `before`/`after`/`afterException` 三个钩子；`SimpleAspect` 空实现，方便按需覆盖；`TimeIntervalAspect` 记录方法耗时。拦截器在 `intercept` 里依次调用切面的钩子。

### 3. SPI 装配

`META-INF/services/cc.hongz.ztools.aop.proxy.ProxyFactory` 注册三个工厂（Cglib → SpringCglib → Jdk），`ServiceLoader` 按顺序取第一个可用实现。

---

## 三、面试高频问题

**Q1：JDK 动态代理和 Cglib 的区别？**

- JDK 动态代理：基于接口，`Proxy.newProxyInstance` 生成 `$Proxy` 类，性能较高（反射），但目标类必须实现接口。
- Cglib：基于字节码（ASM）生成子类，能代理无接口类，但 `final`/`private` 方法无法代理，且 JDK17 下需 `--add-opens java.base/java.lang`。

**Q2：Spring AOP 什么时候用 JDK 代理、什么时候用 Cglib？**

- 默认：目标实现了接口 → JDK 动态代理；无接口 → Cglib。可通过 `proxyTargetClass=true` 强制 Cglib。

**Q3：AOP 的核心思想？**

- 面向切面编程，把横切关注点（日志/事务/权限/耗时统计）从业务代码中剥离，通过代理在方法调用前后织入增强，实现「无侵入」。

---

## 相关

- [aop模块总结](/blog/ztools-aop-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — 依赖的 core 能力（LangUtil/Assert 等）
