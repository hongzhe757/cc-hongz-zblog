---
title: 'HashMap 和 Hashtable 有什么区别'
description: 'hashMap是线程不安全的，在多线程并发环境下，可能会产生死锁等问题，因此需要开发人员自己处理多线程的安全问题。'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["笔记", "技术总结", "interview"]
category: 'engineering'
---

# step1: 安全性不同

```txt

hashMap是线程不安全的，在多线程并发环境下，可能会产生死锁等问题，因此需要开发人员自己处理多线程的安全问题。

hashTable是线程安全的，它的每一个方法上都有synchonized关键字，因此可以直接用多线程中。

```

# step2: 两者的父类不同

```txt

hashMap是继承自AbstrctMap类，而hashtable是继承Dictionary类。不过他们都实现了，同时实现了map、Coleable、Serializable这三个接口。

```

# step3: 对Null的支持不同

```txt

hashTable:key和value都不能为null。如果key为Null只会抛出空气的异常，value为Null则需要手动抛出异常。

hashMap:key可以为Null，但是这样的key只能有一个，因为必须保证key的唯一性；可以有多的key值对应的value值为Null。

```

# step4: 初始容量大小和每次扩张容量大小不同

# step5: 计算hash值的方法不同
