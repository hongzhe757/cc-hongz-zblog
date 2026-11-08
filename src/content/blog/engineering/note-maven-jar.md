---
title: 'maven项目依赖外部jar进行打包的两种方式'
description: '项目中除了pom.xml依赖之外，有时还依赖了其他jar包，如图：'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["笔记", "技术总结", "maven"]
category: 'engineering'
---

# step1: 背景

项目中除了pom.xml依赖之外，有时还依赖了其他jar包，如图：

![](http://img.hongzhe.work/i/2022/12/08/n8532m-0.png)

依赖的方式如下：

点击Project Structure进行项目设置，在Modules中Dependencies标签中点击+号 添加lib下的所有jar,如图：

![](http://img.hongzhe.work/i/2022/12/08/n8imio-0.png)

然后在Artifacts的Output Layout标签中将依赖放到/WEB-INF/lib目录下，如图：

![](http://img.hongzhe.work/i/2022/12/08/n8n5ur-0.png)

这样的话项目中就可以使用lib中依赖的jar了，但是如果要打包则会报错，须进行相关配置。

# step2: 第一种方式

```java

 <resources>
  <resource>
    <directory>lib</directory>
    <targetPath>BOOT-INF/lib/</targetPath>
    <includes>
      <include>**/*.jar</include>
    </includes>
  </resource>
</resources>

```

然后在plugin标签的configuration标签内加入compilerArguments标签，如下：

```java

 <compilerArguments>
      <!-- 打包本地jar包 -->
      <extdirs>${project.basedir}/lib</extdirs>
  </compilerArguments>

```

整体配置截图如下：

![](http://img.hongzhe.work/i/2022/12/08/n9d9p4-0.png)


然后使用maven命令进行打包即可：

```java
install -Dmaven.test.skip=true
```

# step3: 第二种方式

```java

<dependency>
  <groupId>com.xxx.www</groupId>
  <artifactId>out-jar-1</artifactId>
  <version>1.0.0</version>
  <scope>system</scope>
  <systemPath>${project.basedir}/lib/commons-cxxxx.jar</systemPath>
</dependency>
 
<dependency>
  <groupId>com.xxx.www</groupId>
  <artifactId>out-jar-2</artifactId>
  <version>1.0.0</version>
  <scope>system</scope>
  <systemPath>${project.basedir}/lib/commons-httxxxx.jar</systemPath>
</dependency>
 
....

```

如果是SpringBoot项目还要加如下配置：

```java

<plugin>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-maven-plugin</artifactId>
	<configuration>
		<includeSystemScope>true</includeSystemScope>
	</configuration>
</plugin>

```
