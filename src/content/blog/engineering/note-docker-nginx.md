---
title: 'docker安装Nginx'
description: 'ginx 是一个高性能的 HTTP 和反向代理 web 服务器，同时也提供了 IMAP/POP3/SMTP 服务 。'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["笔记", "技术总结", "docker"]
category: 'engineering'
---

ginx 是一个高性能的 HTTP 和反向代理 web 服务器，同时也提供了 IMAP/POP3/SMTP 服务 。

- [ ] 如何搭建IMAP服务？
- [ ] 如何搭建POP3服务？
- [ ] 如何搭建SMTP服务？

# step1: 查看可用的 Nginx 版本

```html
https://hub.docker.com/_/nginx?tab=tags%E3%80%82
```

# step2: 拉取最新版的 Nginx 镜像

```shell
docker pull nginx:latest
```

# step3: 查看本地镜像

```shell
docker images
```

# step4: 运行容器

```shell
docker run --name nginx-test -p 8080:80 -d nginx
```

```txt
参数说明：

–name nginx-test：容器名称。

-p 8080:80： 端口进行映射，将本地 8080 端口映射到容器内部的 80 端口。

-d nginx： 设置容器在在后台一直运行
```
