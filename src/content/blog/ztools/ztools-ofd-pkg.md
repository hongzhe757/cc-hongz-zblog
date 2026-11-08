---
title: 'ofd 包（OFD 文档）总结'
description: 'ofd 包负责 OFD（国产版式文档） 的生成，1 个类：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "数据"]
category: 'ztools'
---

# ofd 包（OFD 文档）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-poi/src/main/java/cc/hongz/ztools/poi/ofd`
>
> 对照基准：hutool 5.8.48（`cn.hutool.poi.ofd`）

---

## 一、包概览

ofd 包负责 **OFD（国产版式文档）** 的生成，1 个类：

| 类别 | 类 | 职责 |
|---|---|---|
| **写出器** | `OfdWriter` | OFD 写入门面：`getWriter`、`addText`（文本）、`flush`（落盘） |

底层依赖 **OFDRW**（ofdrw-full 2.3.1），不是 Apache POI。

---

## 二、核心设计

### 1. OfdWriter：封装 OFDRW 的版式文档写出

OFD 是 GB/T 33190 标准的国产版式文档格式（对标 PDF），常用于电子发票、公文。`OfdWriter` 封装了 OFDRW 的 `OFDDoc`，提供 `addText` 写文本、`flush` 落盘等高频操作，让调用方无需接触 OFDRW 的底层 API。

---

## 三、面试高频问题

**Q1：OFD 和 PDF 的区别？**

- OFD 是国产标准（GB/T 33190），基于 XML + 国密算法（SM2/SM3/SM4），PDF 是 Adobe 主导的国际标准。国内政务/票据场景 OFD 是强制要求，两者都是「版式文档」（固定布局，不可编辑）。

---

## 相关

- [poi模块总结](/blog/ztools-poi-module/) — 上级 MOC
- [excel包总结](/blog/ztools-excel-pkg/) / [word包总结](/blog/ztools-word-pkg/) — 姊妹包
- [crypto包总结](/blog/ztools-crypto-pkg/) — OFD 签名/国密相关（SM2/SM3）
