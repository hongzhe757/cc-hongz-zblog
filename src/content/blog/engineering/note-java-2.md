---
title: 'java代码混淆'
description: 'java代码可以反编译，因此有时候要保护自己的知识产权还真得费点心思，一般来说有三个思路：'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["笔记", "技术总结", "java"]
category: 'engineering'
---

# step1: 介绍

```tex
仅做记录之用。　　

　　java代码可以反编译，因此有时候要保护自己的知识产权还真得费点心思，一般来说有三个思路：

　　- 将class文件加密，这个是最安全的，但也费事儿，因为要重写classloader来解密class文件

　　- 使用花指令，使得class文件不能反编译（利用反编译工具漏洞)；安全性一般，还是有花指令破解器

　- 代码混淆，提高代码阅读成本；简单易操作，一般采用这种或者与其它方式结合

　　我们项目中用到的即为代码混淆工具ProGuard，相关文章参考：
　　http://blog.csdn.net/earbao/article/details/51000108

　　ProGuard是一个纯java编写的混淆工具，有客户端跟jar包两种使用方式。可以将程序打包为jar，然后用工具进行混淆，也可以在maven中导入ProGuard的插件，对代码进行混淆。本例中为对普通javaweb项目进行代码混淆。maven配置插件如下：
```

```java
<!-- ProGuard混淆插件-->
<plugin>
   <groupId>com.github.wvengen</groupId>
   <artifactId>proguard-maven-plugin</artifactId>
   <version>2.0.11</version>
   <executions>
      <execution>
         <!-- 混淆时刻，这里是打包的时候混淆-->
         <phase>package</phase>
         <goals>
            <!-- 使用插件的什么功能，当然是混淆-->
            <goal>proguard</goal>
         </goals>
      </execution>
   </executions>
   <configuration>
      <!-- 是否将生成的PG文件安装部署-->
      <attach>true</attach>
      <!-- 是否混淆-->
      <obfuscate>true</obfuscate>
      <!-- 指定生成文件分类 -->
      <attachArtifactClassifier>pg</attachArtifactClassifier>
      <options>
         <!-- JDK目标版本1.8-->
         <option>-target 1.8</option>
         <!-- 不做收缩（删除注释、未被引用代码）-->
         <option>-dontshrink</option>
         <!-- 不做优化（变更代码实现逻辑）-->
         <option>-dontoptimize</option>
         <!-- 不路过非公用类文件及成员-->
         <option>-dontskipnonpubliclibraryclasses</option>
         <option>-dontskipnonpubliclibraryclassmembers</option>
         <!--不用大小写混合类名机制-->
         <option>-dontusemixedcaseclassnames</option>
 
         <!-- 优化时允许访问并修改有修饰符的类和类的成员 -->
         <option>-allowaccessmodification</option>
         <!-- 确定统一的混淆类的成员名称来增加混淆-->
         <option>-useuniqueclassmembernames</option>
         <!-- 不混淆所有包名-->
         <!--<option>-keeppackagenames</option>-->
 
         <!-- 需要保持的属性：异常，注解等-->
         <option>-keepattributes Exceptions,InnerClasses,Signature,Deprecated,SourceFile,LocalVariable*Table,*Annotation*,Synthetic,EnclosingMethod</option>
         <!-- 不混淆所有的set/get方法->
         <!--<option>-keepclassmembers public class * {void set*(***);*** get*();}</option>-->
 
         <!-- 不混淆包下的所有类名，且类中的方法也不混淆-->
         <option>-keep class com.xxx.xxx.bboss.SystemConfig { <methods>; }</option>
         <option>-keep class com.xxx.xxx.framework.** { *; }</option>
         <option>-keep class com.xxx.xxx.xxx.controller.** { <methods>; }</option>
         <option>-keep class com.xxx.xxx.xxx.dao.** { <methods>; }</option>
         <option>-keep class com.xxx.xxx.xxx.exception { <methods>; }</option>
         <option>-keep class com.xxx.xxx.xxx.model.** { <methods>; }</option>
 
      </options>
      <!--class 混淆后输出的jar包-->
      <outjar>classes-autotest.jar</outjar>
      <!-- 添加依赖，这里你可以按你的需要修改，这里测试只需要一个JRE的Runtime包就行了 -->
      <libs>
         <lib>${java.home}/lib/rt.jar</lib>
      </libs>
      <!-- 对什么东西进行加载，这里仅有classes成功，毕竟你也不可能对配置文件及JSP混淆吧-->
      <injar>classes</injar>
      <!-- 输出目录-->
      <outputDirectory>${project.build.directory}</outputDirectory>
   </configuration>
</plugin>

```

# step2: 其他步骤

``` txt

运行 mvn clean package -DskipTests

classes-pg.jar为混淆后的classes文件，里边包含完整的项目结构

proguard_map.txt混淆内容映射

proguard_seed.txt参与混淆的类

可以看到，部分包名跟类名已经被改为了简单字母，不再具有业务含义，而且变量名也进行了修改，增加了阅读代码难度。

　　运行服务，项目正常运行。

　　需要注意的问题：

　　- 因为有时候会配置不保持包名或类名，因此一些相关配置文件的内容需要改变，好在ProGuard不是随机生成类名，而是先按照原名称对相同包下类进行排序，混淆后的类名称依次为a.class，b.class，c.class.....

那么问题来了，当包中超过26个类时，默认命名为A.class，B.class，C.class，在某些操作系统下，会不区分class文件名称的大小写，会导致错误(水平所限，未深入探究跟类加载相关);因此

　　-dontusemixedcaseclassnames

　　配置极为关键，该配置会在超过26个类文件时，命名为aa.class，ab.class，ac.class，而不是原来的大写类名，从而避免错误。

　　- 打包部署问题。该配置文件打包出来的war中classes文件仍然为正常代码，需要手动解压，将classes-pg.jar中classes替换进去，在工程化管理的情况下，可以在jenkins中配置脚本，自动将混淆后的classes替换进war包：

#更改war包classes为混淆包的内容
cd /root/.jenkins/workspace/mytest_master/target
jar -xvf classes-pg.jar
rm -rf mytest
mkdir mytest
mv mytest.war mytest
cd mytest/
jar -xvf mytest.war
rm -rf WEB-INF/classes/com/
cd ../
 
cp -rf com mytest/WEB-INF/classes/
cd mytest
jar -cvfM0 mytest.war ./
mv mytest.war ../

```
