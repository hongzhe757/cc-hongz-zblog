---
title: '为什么HashMap中String、Integer这样的包装类适合作为K？'
description: 'String、Integer等包装类的特性能够保证Hash值的不可更改性和计算准确性，能够有效的减少Hash碰撞的几率~'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["笔记", "技术总结", "interview"]
category: 'engineering'
---

String、Integer等包装类的特性能够保证Hash值的不可更改性和计算准确性，能够有效的减少Hash碰撞的几率~

因为

-   它们都是final修饰的类，不可变性，保证key的不可更改性，不会存在获取hash值不同的情况~
-   它们内部已重写了equals()、hashCode()等方法，遵守了HashMap内部的规范
