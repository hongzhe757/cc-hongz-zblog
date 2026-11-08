---
title: 'maven配置生成java doc文档中文乱码'
description: '变量名：JAVATOOLOPTIONS'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["笔记", "技术总结", "maven"]
category: 'engineering'
---

# step1: 更改环境变量解决

变量名：JAVA_TOOL_OPTIONS

变量值：-Dfile.encoding=UTF-8

![](http://img.hongzhe.work/i/2022/12/21/nac8du-0.png)

# step2: 更改Maven环境变量

环境变量名=变量值 ：MAVEN_OPTS=-Xms128m -Xmx512m -Dfile.encoding=UTF-8

# step3: IDEA解决方案

![](http://img.hongzhe.work/i/2022/12/21/nam0lw-0.png)

![](http://img.hongzhe.work/i/2022/12/21/nax2m0-0.png)

# step4: pom.xml文件中配置

```
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-javadoc-plugin</artifactId>
<version>2.9.1</version>
<configuration>
<aggregate>true</aggregate>
<encoding>${maven.doc.encoding}</encoding>
<charset>${maven.doc.encoding}</charset>
<docencoding>${maven.doc.encoding}</docencoding>
<destDir>doc</destDir>
<tags>
<!--MAVEN_OPTS=-Dfile.encoding=UTF-8;JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8-->
<tag>
<head>描述</head>
<name>Description</name>
<placement>a</placement>
</tag>
<tag>
<head>return</head>
<name>return</name>
<placement>a</placement>
</tag>
<tag>
<head>参数</head>
<name>param...</name>
<placement>a</placement>
</tag>
<tag>
<head>时间</head>
<name>date</name>
<placement>a</placement>
</tag>
<tag>
<head>时间</head>
<name>Date</name>
<placement>a</placement>
</tag>
</tags>
</configuration>
<executions>
<execution>
<id>attach-javadoc</id>
<phase>package</phase>
<goals>
<goal>jar</goal>
</goals>
<configuration>
<!--取消对源码中的doc参数注释等检查-->
<additionalparam>-Xdoclint:none</additionalparam>
</configuration>
</execution>
</executions>
```   

NOTE：更改系统环境变量可能需要重启后生效.

此方法已经实验过,好用.

但是记得还可能有其他操作.如下:

1. cmd,控制台 mvn -version,查看是否为utf-8编码.

2.idea中的控制台 mvn -vesion 是否utf-8编码. 有可能不一致.

3. 然后做在mavn run的地方配置上述操作.即可
