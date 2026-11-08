---
title: 'img 包（图像处理）总结'
description: 'img 包基于 Java AWT 做图片读取、编辑、生成，子包 gif 提供 GIF 编解码：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-5.jpg'
---

# img 包（图像处理）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/img`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.img`）

---

## 一、包概览

img 包基于 Java AWT 做**图片读取、编辑、生成**，子包 gif 提供 GIF 编解码：

| 类别 | 类 | 职责 |
|---|---|---|
| **图像编辑器** | `Img` | 基于 `BufferedImage` 的链式图像编辑：缩放、旋转、裁剪、加水印、圆角、灰度等 |
| **静态工具** | `ImgUtil` | 图片读写、转换、缩放、toBase64/fromBase64、压缩、截图等 |
| **颜色** | `ColorUtil` / `LabColor` | RGB/HEX 互转、颜色生成；Lab 颜色空间（用于背景去除的色差计算） |
| **字体** | `FontUtil` | 创建 `Font` 字体对象 |
| **绘图** | `GraphicsUtil` | `Graphics2D` 绘制辅助（抗锯齿、画线/矩形/圆等） |
| **背景去除** | `BackgroundRemoval` | 基于 Lab 色差的图片背景去除 |
| **缩放策略** | `ScaleType` | 缩放模式枚举（默认/比例/固定宽高/覆盖等） |
| **GIF（gif 子包）** | `GifDecoder` / `AnimatedGifEncoder` / `LZWEncoder` / `NeuQuant` | GIF 动图解码与编码、LZW 压缩、颜色量化 |

---

## 二、核心设计

### 1. Img：链式流式编辑

`Img` 持有 `BufferedImage`，每个编辑方法返回 `this`，支持 `Img.from(file).scale(0.5).round(0.3).write(out)` 式链式调用，最后 `write`/`flush` 输出。

### 2. ScaleType 缩放策略

缩放时如何处理宽高比：默认、按比例缩放、拉伸到固定宽高、居中裁剪覆盖等，通过枚举统一。

### 3. 背景去除的 Lab 色差

`BackgroundRemoval` 把像素从 RGB 转到 Lab 颜色空间（更接近人眼感知），计算与背景色的色差，超过阈值判定为前景。`LabColor` 负责这一颜色空间转换。

### 4. GIF 的 LZW + 颜色量化

GIF 编码核心：`NeuQuant`（颜色量化，把真彩色减到 256 色）、`LZWEncoder`（LZW 无损压缩）、`AnimatedGifEncoder`（组装成动画帧）。

---

## 三、面试高频问题

**Q1：BufferedImage 和 Image 的区别？**

- `BufferedImage` 是可访问像素缓冲区的图像（能读写像素），`Image` 是抽象基类（可能未加载/远程）。图像编辑要用 `BufferedImage`。

**Q2：缩略图怎么避免失真？**

- 保持宽高比缩放；若要固定尺寸，用「先等比缩放再居中裁剪」覆盖策略，而非直接拉伸。

**Q3：RGB 和 Lab 颜色空间区别？背景去除为什么用 Lab？**

- RGB 是设备相关、非均匀感知；Lab 更接近人眼对色差的感知。用 Lab 计算色差能更准确区分前景/背景。

**Q4：GIF 为什么最多 256 色？**

- GIF 用调色板索引存储颜色，最多 256 色。真彩色图片要经颜色量化（NeuQuant）减色后才能编码。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 头像裁剪、加水印、圆角 | `Img` / `ImgUtil` |
| 图片缩放生成缩略图 | `ImgUtil.scale` |
| 图片转 Base64 存库 | `ImgUtil.toBase64` |
| 证件照背景替换 | `BackgroundRemoval` |
| 颜色值转换/生成 | `ColorUtil` |
| GIF 动图解析/生成 | `GifDecoder` / `AnimatedGifEncoder` |

---

## 五、当前状态

- **文件**：8 个顶层类 + gif 子包 4 个类 + `package-info`，与 hutool 5.8.47 对齐。
- **单元测试**：12 个测试类，中文 `@DisplayName`（含 gif 子包 `AnimatedGifEncoder`/`GifDecoder`/`LZWEncoder`/`NeuQuant`）。
- **checkstyle**：**0 违规**。处理要点：`Img` 等含大量 AWT 坐标/像素魔数，用 `@SuppressWarnings("checkstyle:MagicNumber")`（`Img` 为类级）。

---

## 相关

- [io包总结](/blog/ztools-io-pkg/)
- [swing包总结](/blog/ztools-swing-pkg/)
