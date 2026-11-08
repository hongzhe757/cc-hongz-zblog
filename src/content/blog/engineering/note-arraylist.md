---
title: 'ArrayList有什么优点'
description: 'ArrayList的优点如下'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["笔记", "技术总结", "interview"]
category: 'engineering'
---

ArrayList的优点如下

```txt
- ArrayList 底层以数组实现，是一种随机访问模式。ArrayList 实现了RandomAccess 接口，因此查找的时候非常快。

- ArrayList 在顺序添加一个元素的时候非常方便。 ArrayList 的缺点如下： (1)删除元素的时候，需要做一次元素复制操作。如果要复制的元素很多，那么就会比较耗费性能。 (2)插入元素的时候，也需要做一次元素复制操作，缺点同上。 ArrayList 比较适合顺序添加、随机访问的场景。
```

为什么要进一次复制？

为什么实现了RandomAccess接口就会很快？这与实现了数组结构，而数组结构本身是顺序表的一种。顺序表支持按位查找。所以快.

关于randomaccess接口描述，参照笔记该内容。

本质上讲，是为了将ArrayList中的元素进行有序化处理，当Array List通过接口实现处理后，有序了，二分查找，通过顺序表的相关内容，我们可以知道。顺序表在有序情况下，时间复杂度比无序情况下好。因此快。
