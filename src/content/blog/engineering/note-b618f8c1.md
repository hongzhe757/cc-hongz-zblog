---
title: '单元测试忽略启动项'
description: 'springboot框架在单元测试时可能需要忽略某些带有@component的实例'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["笔记", "技术总结", "java"]
category: 'engineering'
---

springboot框架在单元测试时可能需要忽略某些带有@component的实例

```java
@Component public class MyCommandLineRunner implements CommandLineRunner { @Override public void run(String... var1) throws Exception { } }
```

服务启动会执行commandLineRanner实例。那如何忽略commandLineRanner实例这个@component呢？  
其实很简单，在commandLineRanner实例上加注解@TestConfiguration或者@TestComponent就可以忽略。

官方文档链接：[http://docs.spring.io/spring-boot/docs/1.5.1.RELEASE/reference/htmlsingle/#boot-features-testing](http://docs.spring.io/spring-boot/docs/1.5.1.RELEASE/reference/htmlsingle/#boot-features-testing)
