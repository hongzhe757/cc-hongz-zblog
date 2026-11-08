---
title: 'sep1: git拒绝连接原因分析'
description: '使用git从远程仓库下载代码出现上述的错误是因为使用了proxy代理，所以要解决该问题，核心操作就是要取消代理'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["笔记", "技术总结", "git"]
category: 'engineering'
---

# sep1: git拒绝连接原因分析

使用git从远程仓库下载代码出现上述的错误是因为使用了proxy代理，所以要解决该问题，核心操作就是要取消代理

# step2: 错误解决方式

## 1. 查看Linux当前有没有使用代理

```
- 方式一：通过git的配置文件查看有无使用代理（没有成功）
	- 查询是否使用代理：git config --global http.proxy
- 方式二：通过查询系统环境有没有使用代理（成功）
	- env|grep -I proxy
```

## 2. 查看端口有没有被占用

## 3. 取消代理设置

```
- 方式一：通过git取消代理设置
	- git config --global --unset http.proxy`
	- git config --global --unset https.proxy`
- 方式二：环境变量
	- export http_proxy=""
	- export https_proxy=""
	- export HTTP_PROXY=""
	- export HTTPS_PROXY=""
- 方式三：通过系统命令取消代理
	- unset http_proxy
	- unset ftp_proxy
	- unset all_proxy
	- unset https_proxy
	- unset no_proxy
```
