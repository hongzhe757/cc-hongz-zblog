---
title: 'aop 模块总结'
description: '是 hutool-aop 的移植镜像，包路径 。共 11 主类，分 4 层：代理工厂、拦截器、切面、门面。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "框架"]
---

# aop 模块总结（MOC）

> `cc-hongz-ztools-aop` 是 hutool-aop 的移植镜像，包路径 `cc.hongz.ztools.aop`。共 11 主类，分 4 层：代理工厂、拦截器、切面、门面。

---

## 分层

- [aop包总结](/blog/ztools-aop-pkg/) — 动态代理（JDK/Cglib/SpringCglib 三种代理 + 切面 + 拦截器）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/)（LangUtil/Assert 等工具）
- 底层依赖 **cglib** 3.3.0（`net.sf.cglib`）与 **spring-core** 5.3.27（`org.springframework.cglib`），均 `optional=true`
- 三种代理通过 SPI（`META-INF/services/...ProxyFactory`）自动装配

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
