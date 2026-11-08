---
title: 'git迁移旧仓库到新仓库（保留分支和历史提交记录）'
description: 'git clone --mirror old.git'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["笔记", "技术总结", "git"]
category: 'engineering'
---

# step1: 先克隆老项目的镜像

```shell
git clone --mirror old.git
```

# step2: 进入老项目的目录

```shell
cd old.git
```

# step3: 移除老项目的地址替换成新项目

```shell

git remote set-url --push origin new.git

```

# step4: 将镜像推到远程

```shell
git push --mirror
```
