---
title: 'pring Boot Maven 插件 - 没有 BOOT-INF 目录'
description: '在 spring-boot-maven-plugin 的 1.3.8.RELEASE 版本和 1.4.0.RELEASE 版本之间 - 生成的包结构发生了变化（如果您提取 uber jar 文件） 1.3.8.RELEASE com， lib， META-INF 和 org 目录'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["笔记", "技术总结", "java"]
category: 'engineering'
---

# step1: 问题
```tex

在 spring-boot-maven-plugin 的 1.3.8.RELEASE 版本和 1.4.0.RELEASE 版本之间 - 生成的包结构发生了变化（如果您提取 uber jar 文件） 1.3.8.RELEASE com， lib， META-INF 和 org 目录 1.4.0.Release 有一个 BOOT-INF、META-INF 和 ORG 目录 基本上从 1.4.0.RELEASE 开始 - 所有的类和库都在 BOOT-INF 目录中。 因此，当您尝试在Amazon Lambda上运行Spring Boot项目时，它说找不到一个jar，因为它无法读取新的Spring Boot Uber jar结构

我的问题是 - 在较新版本的 Spring Boot Maven 插件中是否有可能让它生成与版本 1.3.9.RELEASE 中相同的结构的 uber jar？

我尝试了 maven-shade-plugin - 但这会导致其他问题

```

```java

<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
    <configuration>
        <layout>MODULE</layout>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>repackage</goal>
            </goals>
        </execution>
    </executions>
</plugin>

```

# step2: 参考链接

[java - Spring Boot Maven Plugin - No BOOT-INF directory - Stack Overflow](https://stackoverflow.com/questions/43124852/spring-boot-maven-plugin-no-boot-inf-directory/43127732)
