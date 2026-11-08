---
title: '启动Tomcat容器访问端口显示404问'
description: 'docker cp a1a0305b62a7:/usr/local/tomcat/D:/wcp3server /volume1/i-zxcvb/tomcatresourceback/'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["笔记", "技术总结", "docker"]
category: 'engineering'
---

# step1: 命令

```shell
docker cp a1a0305b62a7:/usr/local/tomcat/D:/wcp3server /volume1/i-zxcvb/tomcat_resource_back/
tar czvf /volume1/i-zxcvb/tomcat_resource_back/wcp3server.tar.gz -C /volume1/i-zxcvb/tomcat_resource_back wcp3server
rm -rf /volume1/i-zxcvb/tomcat_resource_back/wcp3server
```
