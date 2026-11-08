---
title: 'captcha 模块总结'
description: '是 hutool-captcha 的移植镜像，包路径 。共 15 个类（+2 package-info），分 2 层：验证码图像生成、验证码内容生成策略。'
pubDate: 'Aug 31, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# captcha 模块总结（MOC）

> `cc-hongz-ztools-captcha` 是 hutool-captcha 的移植镜像，包路径 `cc.hongz.ztools.captcha`。共 15 个类（+2 package-info），分 2 层：验证码图像生成、验证码内容生成策略。

---

## 分层

- [captcha包总结](/blog/ztools-captcha-pkg/) — 根包 + generator 子包（合并说明）：`ICaptcha`/`AbstractCaptcha` 基座 + Line/Circle/Shear/Gif 干扰样式 + 5 种内容生成器（随机/中文/单词/算术/问答），共 15 类

---

## 依赖关系

- [captcha包总结](/blog/ztools-captcha-pkg/) 依赖 [core模块总结](/blog/ztools-core-module/) 的 [img包总结](/blog/ztools-img-pkg/)（`ImgUtil`/`GraphicsUtil`/`AnimatedGifEncoder`）、[codec包总结](/blog/ztools-codec-pkg/)（`Base64`）、[util包总结](/blog/ztools-util-pkg/)（`RandomUtil`/`StrUtil`/`URLUtil`）、[io包总结](/blog/ztools-io-pkg/)（`IoUtil`/`FileUtil`）、[math包总结](/blog/ztools-math-pkg/)（`Calculator`）
- 底层依赖 JDK `java.awt`（`BufferedImage`/`Graphics2D`/`Font`），无第三方图像库

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
