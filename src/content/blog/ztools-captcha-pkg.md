---
title: 'captcha 包（图形验证码）总结'
description: 'captcha 包是 captcha 模块的全部内容（15 类），分根包（8 类）+ generator 子包（7 类）：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-2.jpg'
---

# captcha 包（图形验证码）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-captcha/src/main/java/cc/hongz/ztools/captcha`
>
> 对照基准：hutool 5.8.48（`cn.hutool.captcha`）

---

## 一、包概览

captcha 包是 captcha 模块的**全部内容**（15 类），分根包（8 类）+ generator 子包（7 类）：

| 类别 | 类 | 职责 |
|---|---|---|
| **接口** | `ICaptcha` | 验证码接口：`createCode`/`getCode`/`verify`/`write` |
| **抽象基类** | `AbstractCaptcha` | 模板方法：生成 code + 校验 + 写出图片，子类只实现 `createImage` |
| **统一入口** | `CaptchaUtil` | 验证码创建静态工厂（Facade）：`createLineCaptcha`/`createCircleCaptcha`/`createShearCaptcha`/`createGifCaptcha`/`createChineseCaptcha`... |
| **干扰样式** | `LineCaptcha` / `CircleCaptcha` / `ShearCaptcha` / `GifCaptcha` | 干扰线 / 干扰圆 / 扭曲 / GIF 动图验证码 |
| **尺寸策略** | `SizeMode` | 尺寸自适应枚举（宽度优先 / 字号优先） |
| **生成策略（generator）** | `CodeGenerator` / `AbstractGenerator` / `RandomGenerator` / `MathGenerator` / `ChineseGenerator` / `QuestionGenerator` / `WordGenerator` | 验证码内容生成策略（随机/算术/中文/问答/单词） |

---

## 二、核心设计

### 1. ICaptcha + AbstractCaptcha：模板方法模式

`ICaptcha` 定义验证码四件事：`createCode()`（生成 code + 图片）、`getCode()`、`verify()`（校验用户输入）、`write()`（写出图片）。`AbstractCaptcha` 实现这些通用逻辑：`createCode()` 里先 `generateCode()`（调用生成器）、再 `adjustSize()` 自适应、最后 `ImgUtil.writePng(createImage(code), out)` 得到 `imageBytes`。真正「画什么样的图」抽象成 `protected abstract Image createImage(String code)`，交给 `LineCaptcha`/`CircleCaptcha` 等子类实现——骨架在基类、变化点延迟到子类。

### 2. CodeGenerator：策略模式

验证码「内容」从「图像」中解耦。`CodeGenerator` 接口定义 `generate()` 和 `verify(code, userInputCode)`，注意 **verify 也放在生成器里**，因为「怎么验证」和「怎么生成」是同一套规则（比如算术题 `3+4=?` 的答案要通过 `Calculator` 算出来）。`AbstractGenerator` 提供 `baseStr` + `length` 基础字段，`RandomGenerator`（随机字符）、`ChineseGenerator`（常用汉字集）、`WordGenerator`（英文单词表）、`QuestionGenerator`（题库问答）、`MathGenerator`（算术式）都是策略实现，`AbstractCaptcha` 持有一个 `CodeGenerator` 引用即可任意切换。

### 3. CaptchaUtil：简单工厂门面

`CaptchaUtil` 屏蔽各种构造器的重载组合，提供语义化静态方法：`createLineCaptcha(w, h)` 默认 5 位 + 150 条干扰线，`createChineseCaptcha(w, h)` 内部 `new LineCaptcha(w, h, new ChineseGenerator(4), 150)`，`createWordCaptcha`/`createQuestionCaptcha` 同理。调用方一行代码拿到验证码对象，不用关心干扰线数、生成器类型等细节。

### 4. SizeMode：尺寸自适应

`SizeMode` 枚举解决「内容长度变化导致文字重叠」的问题：

- `WIDTH_PRIORITY`（默认）：图片宽高固定，字号按内容长度收缩到 `width/len`（下限 `MIN_FONT_SIZE=12`）。
- `FONT_PRIORITY`：字号固定，图片宽度扩展到 `len × 字号 + 边距`。

`AbstractCaptcha.adjustSize()` 根据 `sizeMode` 二选一，使中文/算术/问答等长短不一的验证码都不会重叠。

### 5. GifCaptcha：AnimatedGifEncoder 多帧动图

`GifCaptcha` 不走 `createImage` 单帧路径，而是重写 `createCode()`：用 core 的 `AnimatedGifEncoder` 逐字符生成多帧（每个字符透明度渐变 + 随机椭圆干扰），设置 `quality`（颜色量化）、`delay`（帧延迟）、`repeat`（循环次数），最终编码成 GIF 动图，比静态图更难被 OCR。

---

## 三、面试高频问题

**Q1：AbstractCaptcha 里模板方法模式是怎么落地的？**

- 基类 `AbstractCaptcha` 把验证码生成流程固化在 `createCode()` 里：生成字符串 → 自适应尺寸 → 画图 → 写 PNG → 存 `imageBytes`。
- 其中「画图」是变化点，声明为抽象方法 `createImage(String code)`，由 `LineCaptcha`（画干扰线+字符）、`CircleCaptcha`（画圆+字符）、`ShearCaptcha`（画字符后正弦扭曲）各自实现。
- 子类无需关心「生成 code」「校验」「写出」这些公共逻辑，只专注「画什么干扰、怎么画」，这就是模板方法「父类定骨架、子类填细节」的典型体现。

**Q2：为什么 verify 校验逻辑放在 CodeGenerator 里，而不是放在 AbstractCaptcha？**

- 因为「怎么验证」和「怎么生成」强耦合，是同一套规则的两种视图：
  - `RandomGenerator`：忽略大小写比较字符串（`equalsIgnoreCase`）。
  - `MathGenerator`：用户输入的是数字，要用 `Calculator.conversion(code)` 算出 `3+4=` 的结果再比，不能简单字符串比较。
  - `QuestionGenerator`：从题库反查问题对应的标准答案再比较。
- 把 verify 放进生成器，让「内容规则」内聚在一个类里；`AbstractCaptcha.verify` 只是转发 `generator.verify(getCode(), input)`，本身不关心具体规则——这是策略模式的收益。

**Q3：验证码为什么要有干扰线、扭曲、GIF 动图这些花样？**

- 目的是对抗机器识别：纯文本验证码可直接 OCR 识别，加随机干扰线/干扰圆能破坏字符连通性、干扰切割；`ShearCaptcha` 的正弦扭曲让字符形变；`GifCaptcha` 的透明度渐变动图更难被单帧截图还原。
- 本质是在「人可读」和「机器难读」之间做平衡：干扰太强人也不认识，太弱又拦不住 OCR。

**Q4：SizeMode 为什么存在？**

- 验证码内容长度不固定：随机 4 位数字很短，中文 4 字或算术式 `1000-999=` 很长。固定字号+固定宽度下，长内容会重叠。
- `SizeMode` 提供两种策略：固定宽度就收缩字号（宽度优先），固定字号就扩展宽度（字号优先），保证任意内容都能清晰显示。

---

## 相关

- [captcha模块总结](/blog/ztools-captcha-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [img包总结](/blog/ztools-img-pkg/) — `ImgUtil`/`GraphicsUtil`/`AnimatedGifEncoder` 来源
- [math包总结](/blog/ztools-math-pkg/) — `MathGenerator` 用到的 `Calculator`
- [codec包总结](/blog/ztools-codec-pkg/) — `getImageBase64` 用到的 `Base64`
