---
title: 'docker部署springboot后ClassNotFound'
description: '<dependency>'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["笔记", "技术总结", "java"]
category: 'engineering'
---

# step1: 除了配置下面的配置

```java
<dependency>  
    <groupId>com.gientech</groupId>  
    <artifactId>asnrt</artifactId>  
    <version>0.0.1</version>  
    <scope>system</scope>  
    <systemPath>${basedir}/src/main/resources/lib/asnrt.jar</systemPath>  
</dependency>

```

# step2: 还需要配置scope，否则也可能找不到

```java
<plugin>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-maven-plugin</artifactId>  
    <configuration>  
        <includeSystemScope>true</includeSystemScope>  
    </configuration>  
</plugin>
```
