---
title: 'idea 远程调试 命令'
description: 'java -jar -Xdebug -Xrunjdwp:transport=dtsocket,server=y,suspend=n,address=0.0.0.0:8082 v2i-java-web-latest-SNAPSHOT.jar'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["笔记", "技术总结", "idea"]
category: 'engineering'
---

java -jar -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=0.0.0.0:8082 v2i-java-web-latest-SNAPSHOT.jar

adress 前面的ip必须写，否则监听的是127.0.0.1
