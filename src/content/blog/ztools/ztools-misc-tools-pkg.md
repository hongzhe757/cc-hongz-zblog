---
title: '其他工具包（qrcode/compress/emoji/cglib/servlet/spring/validation）总结'
description: 'extra 模块中除模板/邮件/远程/表达式/拼音分词之外的 7 个小工具子包，共 22 类：'
pubDate: 'Aug 31, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# 其他工具包（qrcode/compress/emoji/cglib/servlet/spring/validation）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-extra/src/main/java/cc/hongz/ztools/extra`（`qrcode`/`compress`/`emoji`/`cglib`/`servlet`/`spring`/`validation` 子包）
>
> 对照基准：hutool 5.8.48（`cn.hutool.extra` 对应子包）

---

## 一、包概览

extra 模块中除模板/邮件/远程/表达式/拼音分词之外的 7 个小工具子包，共 22 类：

| 子包 | 类 | 职责 |
|---|---|---|
| **qrcode** | `QrCodeUtil`/`QrConfig`/`BufferedImageLuminanceSource`/`QrCodeException` | 基于 ZXing 的二维码/条形码生成与识别（4 类） |
| **compress** | `CompressUtil`/`CompressException` + `archiver`（`Archiver`/`SevenZArchiver`/`StreamArchiver`）+ `extractor`（`Extractor`/`SevenZExtractor`/`StreamExtractor`/`Seven7EntryInputStream`） | 基于 commons-compress 的压缩/归档/解压（9 类） |
| **emoji** | `EmojiUtil` | 基于 emoji-java 的 Emoji 识别与转换（1 类） |
| **cglib** | `CglibUtil`/`BeanCopierCache` | 基于 cglib 的高性能 Bean 拷贝（2 类） |
| **servlet** | `ServletUtil`/`JakartaServletUtil` | Servlet 请求参数/头/Cookie/文件上传下载工具（2 类） |
| **spring** | `SpringUtil`/`EnableSpringUtil` | Spring 容器 Bean 获取/动态注册（2 类） |
| **validation** | `ValidationUtil`/`BeanValidationResult` | 基于 jakarta.validation 的 Bean 校验（2 类） |

---

## 二、核心设计

### 1. QrCodeUtil：一个入口多种输出

`QrCodeUtil.generate` 根据目标扩展名分发：普通图片（BufferedImage）、SVG 矢量图、ASCII Art 字符画（终端展示）；`generateAsBase64` 直接产出 data URI；`decode` 用 `HybridBinarizer`/`GlobalHistogramBinarizer` 两种二值化尝试识别。`QrConfig` 支持前景/背景色、边距、纠错级别（L/M/Q/H）、Logo 及圆角。

### 2. CompressUtil：压缩流 + 归档两条线

- 压缩流：`getOut`/`getIn` 用 `CompressorStreamFactory` 处理 gzip/bzip2/xz/snappy/zstd 等单文件压缩。
- 归档：`createArchiver`/`createExtractor` 用 `ArchiveStreamFactory` 处理 zip/tar/jar/7z 等多文件打包；7z 特殊（非流式），单独走 `SevenZArchiver`/`SevenZExtractor`。

`Archiver` 接口 `add(file, path, filter)` + `finish()` 支持流式添加与过滤器；`Extractor.extract(targetDir, stripComponents, filter)` 支持剥离层级与选择性解压。

### 3. CglibUtil + BeanCopierCache：高性能 Bean 拷贝

`CglibUtil.copy` 用 cglib `BeanCopier` 做字节码级别的属性拷贝（比反射快）。`BeanCopierCache` 用 `WeakKeyValueConcurrentMap` 缓存 `(srcClass#targetClass#useConverter)` 对应的 `BeanCopier`，避免重复 `BeanCopier.create`（创建开销大）。

### 4. ServletUtil：请求参数转 Bean 的 ValueProvider

`ServletUtil.fillBean(request, bean, copyOptions)` 借助 core 的 `BeanUtil.fillBean` + `ValueProvider`，把 `request.getParameterValues` 逐字段喂给 Bean 注入（支持单值/多值、`beanName.field` 前缀），实现「表单参数直接映射对象」。

### 5. SpringUtil：静态上下文持有者

`SpringUtil` 实现 `BeanFactoryPostProcessor` + `ApplicationContextAware`，把 `ApplicationContext`/`ConfigurableListableBeanFactory` 存为静态字段，让非 Spring 管理的工具类也能 `SpringUtil.getBean()`/`getProperty()`/`registerBean()`。`@EnableSpringUtil` 用 `@Import` 一键把 `SpringUtil` 注册进容器。

### 6. ValidationUtil：Jakarta Validation 包装

`ValidationUtil` 静态初始化 `ValidatorFactory`，`validate` 返回原始 `ConstraintViolation` 集，`warpValidate` 把结果包装成 `BeanValidationResult`（success 标志 + `ErrorMessage` 列表，含属性名/消息/错误值），更适合接口直接序列化返回。

---

## 三、面试高频问题

**Q1：cglib BeanCopier 为什么比反射快？**

- 反射每次都要查 Field/Method 元数据并动态调用；BeanCopier 在字节码层面直接生成 getter/setter 调用代码，接近手写拷贝性能。代价是首次创建要生成并加载类，所以用 `BeanCopierCache` 缓存。

**Q2：二维码纠错级别（ErrorCorrectionLevel）的作用？**

- L/M/Q/H 表示可恢复受损码块的比例（约 7%/15%/25%/30%）。级别越高容错越强（Logo 遮挡、污损也能扫），但码点越密、容量越小。`QrConfig.setErrorCorrection` 默认 M。带 Logo 通常要提高纠错级别。

**Q3：SpringUtil 为什么能拿到 ApplicationContext？**

- `SpringUtil` 本身被注册为 Spring Bean（`@Component` + `@EnableSpringUtil` 的 `@Import`），Spring 在初始化时回调它的 `setApplicationContext`/`postProcessBeanFactory`，它把上下文存为 static 字段。之后任意静态方法都能通过静态字段访问容器。

**Q4：ValidationUtil 为什么要在静态块里初始化 Validator？**

- `ValidatorFactory` 创建较昂贵（要扫描约束元数据），`buildDefaultValidatorFactory` 后缓存为 static final，避免每次校验重建。`try-with-resources` 确保 factory 释放（Validator 仍可用）。

---

## 相关

- [extra模块总结](/blog/ztools-extra-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — qrcode 依赖 Img/ImgUtil，servlet 依赖 BeanUtil，cglib 依赖 ReflectUtil
