---
title: 'io 包（IO 与文件）总结'
description: 'io 包封装 IO 流读写、文件操作、资源加载、文件监听、数据单位等，是 hutool 的 IO 层。21 个顶层类 + 6 个子包：'
pubDate: 'Aug 27, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# io 包（IO 与文件）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/io`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.io`）

---

## 一、包概览

io 包封装 **IO 流读写、文件操作、资源加载、文件监听、数据单位**等，是 hutool 的 IO 层。**21 个顶层类 + 6 个子包**：

| 类别 | 类 / 子包 | 职责 |
|---|---|---|
| **核心工具** | `IoUtil` / `FileUtil` / `BufferUtil` / `NioUtil` | IO 流读写；文件读写复制；Buffer 操作；NIO |
| **流封装** | `FastByteArrayOutputStream` / `FastByteBuffer` / `FastStringWriter` / `AppendableWriter` / `NullOutputStream` / `LimitedInputStream` | 快速字节流、字符流、追加写、空输出、限制长度输入 |
| **编码/字符集** | `BOMInputStream` / `BomReader` / `CharsetDetector` | BOM 处理、字符集自动检测 |
| **文件类型** | `FileTypeUtil` / `FileMagicNumber` / `MimeTypeUtils` | 文件类型识别（魔数）、MIME 类型 |
| **校验和** | checksum 子包 | CRC8/CRC16 各种变体 |
| **拷贝** | copy 子包 | 流/通道/ReaderWriter 拷贝器抽象 |
| **文件操作** | file 子包 | FileReader/FileWriter/FileCopier/FileNameUtil/PathUtil/Tailer 等 |
| **资源** | resource 子包 | Resource/ResourceUtil/ClassPathResource/UrlResource/FileResource 等 |
| **数据单位** | unit 子包 | DataSize/DataSizeUtil/DataUnit（B/KB/MB 换算） |
| **文件监听** | watch 子包 | WatchMonitor/WatchUtil 监听文件变化 |
| **其他** | `IORuntimeException` / `StreamProgress` / `ValidateObjectInputStream` / `LineHandler` / `ManifestUtil` | IO 异常、进度回调、反序列化校验 |

---

## 二、核心设计

### 1. IoUtil：流的读写入口

`IoUtil` 提供 `read/write/copy` 系列，把 InputStream/OutputStream/Reader/Writer 的繁琐样板（缓冲、关闭）封装起来，支持「流 → 字节数组/字符串」的便捷转换。

### 2. FileUtil：文件一站式

`FileUtil` 覆盖文件读写（`readString/writeString`）、复制、移动、删除、重命名、遍历、压缩等，配合 `Resource` 抽象统一处理「文件/Classpath/URL」等不同来源。

### 3. Resource 抽象

`Resource` 把「文件、ClassPath、URL、InputStream、字符串」统一成可读资源，`ResourceUtil` 负责定位与加载，屏蔽来源差异。

### 4. FastByteArrayOutputStream：避免字节数组拷贝

JDK 的 `ByteArrayOutputStream` 在 `toByteArray()` 时会复制一份。`FastByteArrayOutputStream` 直接返回内部缓冲，省一次拷贝，高频场景更快。

### 5. WatchMonitor：文件监听

基于 JDK `WatchService` 的 `WatchMonitor`/`WatchUtil` 监听文件/目录的创建、修改、删除事件，`Tailer` 实现类 `tail -f` 的实时读文件尾。

### 6. 文件类型识别（魔数）

`FileTypeUtil` 读取文件头几个字节（魔数），与已知类型比对判断真实类型（如图片、压缩包），不依赖扩展名。

---

## 三、面试高频问题

**Q1：为什么要自己封装 IoUtil？**

- JDK IO 操作样板多（try-with-resources、缓冲、关闭），IoUtil 把常见操作一行完成，且统一异常为 `IORuntimeException`（RuntimeException）。

**Q2：什么是魔数（magic number）？**

- 文件头固定字节标识文件真实类型（如 PNG 是 `89 50 4E 47`）。用魔数判断比扩展名可靠（扩展名可伪造）。

**Q3：ByteArrayOutputStream 的 toByteArray 为什么要拷贝？**

- 它内部 buffer 可能比实际数据大，`toByteArray` 需复制精确长度。Fast 版本直接返回内部数组（需保证不被外部修改），省拷贝。

**Q4：文件监听（WatchService）原理？**

- 操作系统级文件系统事件通知，注册目录后，文件创建/修改/删除会触发事件，WatchMonitor 包装这些事件回调。

**Q5：字符集自动检测怎么实现？**

- 读取 BOM（字节顺序标记）判断 UTF-8/UTF-16 等；无 BOM 时用编码探测。`CharsetDetector` 封装这些。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 流与字节数组/字符串互转 | `IoUtil` |
| 文件读写/复制/遍历 | `FileUtil` / file 子包 |
| 读取 Classpath 资源 | `ResourceUtil` / `ClassPathResource` |
| 文件类型判断 | `FileTypeUtil` |
| CRC 校验 | checksum 子包 |
| 文件大小单位换算 | `DataSizeUtil` |
| 实时监控文件变化 | watch 子包 / `Tailer` |
| 上传文件大小限制 | `LimitedInputStream` |

---

## 五、当前状态

- **文件**：21 个顶层类 + 6 个子包，与 hutool 5.8.47 对齐。
- **单元测试**：41 个测试类，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。

---

## 相关

- [img包总结](/blog/ztools-img-pkg/)
- [util包总结](/blog/ztools-util-pkg/)
