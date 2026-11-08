---
title: 'Proguard结合maven使用'
description: '<plugin>'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["笔记", "技术总结", "java"]
category: 'engineering'
---

# step1: 添加插件配置

```pom
<plugin>
    <groupId>com.github.wvengen</groupId>
    <artifactId>proguard-maven-plugin</artifactId>
    <version>2.3.1</version>
    <executions>
        <execution>
            <phase>package</phase>
            <goals>
                <goal>proguard</goal>
            </goals>
        </execution>
    </executions>
    <configuration>
        <attach>true</attach>
        <obfuscate>true</obfuscate>
        <attachArtifactClassifier>proguard</attachArtifactClassifier>
        <proguardInclude>${basedir}/proguard.pro</proguardInclude>
        <injar>classes</injar>
        <outputDirectory>${project.build.directory}</outputDirectory>
        <libs>
            <lib>${java.home}/lib/rt.jar</lib>
            <lib>${java.home}/lib/jce.jar</lib>
            <lib>${java.home}/lib/plugin.jar</lib>
        </libs>
    </configuration>
</plugin>

```

# step2: 配置文件

> 在pom同级下创建 proguard.pro 配置文件 ，配置文件内容和 gui 工具使用的一致，当然配置也可以完全写在pom的插件配置中，用标签包含

> 具体参考：https://blog.csdn.net/sinat_35100573/article/details/51833294

注意：
1. 由于部分内容在pom中设置，再在pro文件中设置会导致配置重复而混淆失败
2. 如果使用低版本的插件（2.0.x），会导致不支持 java 8

```java

#-skipnonpubliclibraryclasses
-dontskipnonpubliclibraryclasses
-keepdirectories
-target 1.8
-dontshrink
-dontoptimize
-allowaccessmodification
-printmapping yic_service_map.txt
-useuniqueclassmembernames
-dontusemixedcaseclassnames
-keeppackagenames
-keepattributes Exceptions,InnerClasses,Signature,Deprecated,SourceFile,LineNumberTable,LocalVariable*Table,*Annotation*,Synthetic,EnclosingMethod
-ignorewarnings
-keep class cn.com.ylz.**.controller.*
-keep class cn.com.ylz.**.hbm.* {
    <fields>;
}
-keep class org.springframework.transaction.annotation.* {
    <fields>;
    <methods>;
}
# Also keep - BeanInfo classes. Keep all implementations of java.beans.BeanInfo.
-keep class * extends java.beans.BeanInfo
# Also keep - Bean classes. Keep all specified classes, along with their getters
# and setters.
-keep class * {
    void set*(***);
    void set*(int,***);
    boolean is*();
    boolean is*(int);
    *** get*();
    *** get*(int);
}
# Keep - Native method names. Keep all native class/method names.
-keepclasseswithmembers,includedescriptorclasses,allowshrinking class * {
    native <methods>;
}　　
```
