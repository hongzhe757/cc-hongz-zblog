---
title: 'compress 包（压缩）总结'
description: 'compress 包封装了流式压缩/解压和 Zip 文件读写：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# compress 包（压缩）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/compress`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.compress`）

---

## 一、包概览

compress 包封装了流式压缩/解压和 Zip 文件读写：

| 类 | 职责 |
|---|---|
| `Deflate` | Deflate 算法压缩/解压（`Deflater`/`Inflater`），可配 `nowrap` 兼容 Gzip |
| `Gzip` | GZIP 压缩/解压（`GZIPInputStream`/`GZIPOutputStream`） |
| `ZipReader` | Zip 文件/流读取，含 **Zip bomb 防护**（`checkZipBomb`） |
| `ZipWriter` | Zip 文件写入 |
| `ZipCopyVisitor` | 复制目录到 Zip 的访问器（配合文件遍历） |
| `package-info` | 包说明 |

---

## 二、核心设计

### 1. 流式压缩（装饰 `OutputStream`/`InputStream`）

`Deflate` 和 `Gzip` 都是「把压缩/解压逻辑套在流上」：

```java
Deflate.of(source, target, false).deflater();  // 压缩
Deflate.of(source, target, false).inflater();  // 解压
Gzip.of(source, target).gzip();                // gzip 压缩
Gzip.of(source, target).unGzip();              // gzip 解压
```

内部用 `DeflaterOutputStream`/`InflaterOutputStream`（或 `GZIP*Stream`）包装原始流，`IoUtil.copy` 完成数据搬运，最后 `finish()` 冲刷。

### 2. DEFLATE 与 GZIP/ZIP 的关系

- **DEFLATE** 是压缩算法（LZ77 + 哈夫曼编码），是数据压缩的核心。
- **GZIP** 和 **ZIP** 都是「容器格式」，内部数据用 DEFLATE 压缩，外层加了文件头/校验/元数据。
- `Deflate(nowrap=true)` 表示「裸 DEFLATE」不加 Gzip 头，可与 Gzip 数据互通。

### 3. Zip bomb 防护（安全）

`ZipReader.checkZipBomb(entry)` 检查解压后的**膨胀比**：

```java
if (compressedSize * maxSizeDiff < uncompressedSize) {
    throw new UtilException("Zip bomb attack detected ...");
}
```

Zip bomb（如 42.zip）是「几 KB 的压缩文件解压后膨胀到几 GB」的 DoS 攻击。通过限制压缩比（`maxSizeDiff`，默认 100 倍）来拦截，`-1` 表示不检查。

---

## 三、面试高频问题

**Q1：GZIP、ZIP、DEFLATE 有什么区别？**

- DEFLATE 是**算法**（LZ77 + Huffman）。
- GZIP/ZIP 是**文件格式**，都用 DEFLATE 做数据压缩，区别在文件结构和适用场景（GZIP 通常单文件、用于 HTTP 传输；ZIP 多文件归档）。

**Q2：什么是 Zip bomb？怎么防？**

- 恶意构造的高压缩比压缩包，解压后体积暴涨，耗尽磁盘/内存导致 DoS。
- 防护：解压前检查压缩比/解压总大小上限，超限拒绝（`ZipReader` 的 `checkZipBomb`）。

**Q3：为什么 HTTP 常用 GZIP 压缩？**

- 文本类（HTML/JSON/CSS/JS）压缩率高，可显著减少传输体积；GZIP 单文件、流式、浏览器原生支持。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 网络传输压缩（HTTP body） | `Gzip` |
| 内存流压缩/解压 | `Deflate` / `Gzip` |
| Zip 文件解压（带安全防护） | `ZipReader` |
| Zip 文件打包 | `ZipWriter` |
| 目录归档到 Zip | `ZipCopyVisitor` |

---

## 五、当前状态

- **文件/方法**：6 个主类，与 hutool 5.8.47 完全对齐，无缺漏。
- **单元测试**：5 个测试类（含 ZipReader/ZipWriter 压缩解压、Issue 回归用例），中文 `@DisplayName`。
- **checkstyle**：**0 违规**。处理要点：`Deflate`/`Gzip` tab→4 空格 + 参数 `final` + javadoc 句号；`ZipReader` 2 处 `HiddenField`（`setMaxSizeDiff` 参数改 `newMaxSizeDiff`、局部变量 `zipFile` 改 `theZipFile`）。

---

## 相关

- [io包总结](/blog/ztools-io-pkg/)
