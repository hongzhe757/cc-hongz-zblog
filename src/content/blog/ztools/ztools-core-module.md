---
title: 'core 模块总结'
description: '是 hutool 的移植镜像，包路径 。共 24 个顶层包。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# core 模块总结（MOC）

> `cc-hongz-ztools-core` 是 hutool 的移植镜像，包路径 `cc.hongz.ztools.core`。共 24 个顶层包。

---

## 数据容器 / 基础抽象

- [bean与annotation包移植总结](/blog/ztools-bean-annotation-port/) / [bean包补齐总结](/blog/ztools-bean-fill/) — Bean 反射、注解扫描
- [lang包总结](/blog/ztools-lang-pkg/) — Dict/Opt/Tuple/Console/一致性哈希/tree
- [collection包总结](/blog/ztools-collection-pkg/) — 迭代器增强、分区
- [map包总结](/blog/ztools-map-pkg/) — Map 装饰/增强（ForestMap/TableMap/BiMap）
- [getter包总结](/blog/ztools-getter-pkg/) — 取值器接口（Bean/Dict 的基座）

## 字符串 / 文本 / 工具

- [text包总结](/blog/ztools-text-pkg/) — CharSequenceUtil/StrBuilder/StrFormatter/Simhash
- [util包总结](/blog/ztools-util-pkg/) — StrUtil/ObjectUtil/ArrayUtil/ReflectUtil 等 43 个工具类
- [util包重构分析](/blog/ztools-util-refactor/) — util 包早返回/异常处理/魔法数字/作者版本可调整点
- [convert包总结](/blog/ztools-convert-pkg/) — 类型转换
- [codec包总结](/blog/ztools-codec-pkg/) — 编解码（Base64/BCD/转义）

## IO / 文件 / 流

- [io包总结](/blog/ztools-io-pkg/) — IoUtil/FileUtil/Resource/WatchMonitor
- [stream包总结](/blog/ztools-stream-pkg/) — Stream 工具

## 算法 / 数学 / 压缩

- [math包总结](/blog/ztools-math-pkg/) — Calculator/Money/排列组合
- [compress包总结](/blog/ztools-compress-pkg/) — Deflate/Gzip/ZipReader
- [clone包总结](/blog/ztools-clone-pkg/) — 克隆

## 比较 / 编译 / 异常

- [comparator包总结](/blog/ztools-comparator-pkg/) — 比较器
- [compiler包总结](/blog/ztools-compiler-pkg/) — 编译
- [exceptions包总结](/blog/ztools-exceptions-pkg/) — 异常

## 图像 / 桌面 / 网络 / 线程

- [img包总结](/blog/ztools-img-pkg/) — 图像处理
- [swing包总结](/blog/ztools-swing-pkg/) — 桌面 GUI
- [net包总结](/blog/ztools-net-pkg/) — 网络工具
- [thread包总结](/blog/ztools-thread-pkg/) — 线程与线程池

## 其他

- [builder包设计模式总结](/blog/ztools-builder-patterns/) — Builder 设计模式
- [date包总结](/blog/ztools-date-pkg/) — 日期时间
