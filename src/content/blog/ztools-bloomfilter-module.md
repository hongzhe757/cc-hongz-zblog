---
title: 'bloomFilter 模块总结'
description: '是 hutool-bloomFilter 的移植镜像，包路径 。共 19 主类，分 3 层：过滤器、位图、哈希函数。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

# bloomFilter 模块总结（MOC）

> `cc-hongz-ztools-bloomFilter` 是 hutool-bloomFilter 的移植镜像，包路径 `cc.hongz.ztools.bloomfilter`。共 19 主类，分 3 层：过滤器、位图、哈希函数。

---

## 分层

- [bloomFilter包总结](/blog/ztools-bloomfilter-pkg/) — 布隆过滤器（位图 + 多哈希函数）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/)（`HashUtil` 提供 elf/fnv/hf/js/pjw/rs/sdbm/tianl 等哈希函数）
- 无第三方依赖

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
