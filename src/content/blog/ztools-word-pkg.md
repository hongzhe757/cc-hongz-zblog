---
title: 'word 包（Word 文档）总结'
description: 'word 包负责 docx（OOXML） 文档的生成，5 个类：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "数据"]
---

# word 包（Word 文档）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-poi/src/main/java/cc/hongz/ztools/poi/word`
>
> 对照基准：hutool 5.8.48（`cn.hutool.poi.word`）

---

## 一、包概览

word 包负责 **docx（OOXML）** 文档的生成，5 个类：

| 类别 | 类 | 职责 |
|---|---|---|
| **统一入口** | `WordUtil` | Word 写入门面：`getWriter()` 获取 Writer |
| **写出器** | `Word07Writer` | docx 写出核心：`addText`（文本/段落）、`addPicture`（图片）、`flush`（落盘） |
| **文档工具** | `DocUtil` | docx 转 pdf / 提取图片等文档操作 |
| **表格** | `TableUtil` | 往 Word 写表格（行列数据、合并） |
| **图片类型** | `PicType` | 支持的图片格式枚举（EMF/WMF/PICT/JPEG/PNG/DIB/GIF/TIFF/EPS/WPG） |

---

## 二、核心设计

### 1. Word07Writer：基于 XWPF 的流式写出

底层是 Apache POI 的 `XWPFDocument`（docx），封装了 `addText`/`addPicture`/`addTable` 等高频操作。文本颜色处理会剥离 Alpha 通道，输出 RGB 十六进制（`addText` 里的 `0xFFFFFF` 掩码）。

### 2. 图片写出

`addPicture` 通过 `PicType` 判断图片格式，转成对应的 `XWPFPictureData` 写入文档，支持内联图片。

---

## 三、面试高频问题

**Q1：doc 和 docx 的区别？为什么只支持 docx？**

- doc 是二进制 OLE 复合文档（97-2003），docx 是 OOXML 压缩包（2007+）。POI 写 doc 用 HWPF（功能弱、不推荐），写 docx 用 XWPF（成熟）。hutool 只封装了 docx 写出。

---

## 相关

- [poi模块总结](/blog/ztools-poi-module/) — 上级 MOC
- [excel包总结](/blog/ztools-excel-pkg/) / [ofd包总结](/blog/ztools-ofd-pkg/) — 姊妹包
