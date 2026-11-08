---
title: 'bloomFilter 包（布隆过滤器）总结'
description: 'bloomFilter 包是布隆过滤器的实现，19 个类分 3 组：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# bloomFilter 包（布隆过滤器）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-bloomFilter/src/main/java/cc/hongz/ztools/bloomfilter`
>
> 对照基准：hutool 5.8.48（`cn.hutool.bloomfilter`）

---

## 一、包概览

bloomFilter 包是**布隆过滤器**的实现，19 个类分 3 组：

| 类别 | 类 | 职责 |
|---|---|---|
| **过滤器** | `BloomFilter`（接口）/ `BloomFilterUtil`（门面）/ `BitMapBloomFilter` / `BitSetBloomFilter` | 过滤器抽象 + 工具入口 + 位图/BitSet 两种实现 |
| **位图** | `BitMap`（接口）/ `IntMap` / `LongMap` | 位图抽象 + int/long 两种底层存储（`MACHINE32`/`MACHINE64`） |
| **哈希函数** | `FuncFilter`（接口）/ `AbstractFilter` / `DefaultFilter` + 9 个子类 | 哈希函数抽象 + 9 种哈希算法实现 |

9 种哈希算法子类：`ELFFilter`（ELF）、`FNVFilter`（FNV）、`HfFilter`（HF）、`HfIpFilter`（HF-IP）、`JSFilter`（JS）、`PJWFilter`（PJW）、`RSFilter`（RS）、`SDBMFilter`（SDBM）、`TianlFilter`（Tianl）——均委托 `HashUtil` 的对应静态方法。

---

## 二、核心设计

### 1. 布隆过滤器原理

用一个**位数组** + **多个哈希函数**判断元素是否可能存在：元素被 k 个哈希函数映射到 k 个位并置 1；查询时若 k 个位都是 1 则「可能存在」，有 0 则「一定不存在」。**空间换时间**，且**有误判（假阳性）但无漏判**。

### 2. 位图抽象（BitMap）

`BitMap` 接口抽象了位操作，`IntMap`（32 位）和 `LongMap`（64 位）是两种底层实现。`BitMapBloomFilter` 用 `BitMap` 存位，`BitSetBloomFilter` 用 JDK 的 `BitSet`。

### 3. 多哈希函数（FuncFilter）

`FuncFilter` 抽象哈希函数，构造时传入 `HashUtil::xxxHash` 方法引用；`AbstractFilter` 负责位图 + 哈希的配合（add 时 k 个位置 1，contains 时检查 k 个位）。9 个哈希子类只是绑定不同的哈希算法。

---

## 三、面试高频问题

**Q1：布隆过滤器的误判率怎么控制？**

- 由**位数组大小 m** 和**哈希函数个数 k** 决定：k = (m/n)·ln2 时最优（n 为元素个数）。m 越大、k 越合理，误判率越低；k 太少/太多都会升高。

**Q2：布隆过滤器为什么不能删除元素？**

- 因为一个位可能被多个元素共享，删除会误删其他元素的标记。要支持删除需用「计数布隆过滤器」（每个位换成计数器）。

**Q3：典型应用场景？**

- 缓存穿透防护（先查布隆过滤器，不存在直接返回，不打 DB）、URL 去重、垃圾邮件过滤、爬虫 URL 判重、黑名单。

---

## 相关

- [bloomFilter模块总结](/blog/ztools-bloomfilter-module/) — 上级 MOC
- [util包总结](/blog/ztools-util-pkg/) — `HashUtil` 哈希函数来源
