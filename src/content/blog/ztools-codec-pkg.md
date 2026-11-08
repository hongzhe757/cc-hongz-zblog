---
title: 'codec 包（编解码）总结'
description: 'codec 包集合了各类编码 / 解码（codec = coder + decoder）算法，按用途可分为五大类：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "基础核心"]
---

# codec 包（编解码）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/codec`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.codec`）

---

## 一、包概览

codec 包集合了各类**编码 / 解码（codec = coder + decoder）**算法，按用途可分为五大类：

| 类别 | 类 | 职责 |
|---|---|---|
| **编解码接口** | `Encoder<T, R>` / `Decoder<T, R>` | 顶层抽象，定义 `encode` / `decode` 两个方向 |
| **Base 系列（二进制↔文本）** | `Base16Codec` / `Base32` / `Base32Codec` / `Base58` / `Base58Codec` / `Base62` / `Base62Codec` / `Base64` / `Base64Encoder` / `Base64Decoder` | 把二进制数据映射成可打印字符（16/32/58/62/64 进制），常用于传输、存储、URL 短链 |
| **转义类（文本↔文本）** | `HtmlEscape` / `XmlEscape` / `PercentCodec` / `UnicodeCodec` | HTML/XML 实体转义、URL 百分号编码、`\uXXXX` Unicode 转义 |
| **密码/摘要类** | `Caesar`（凯撒） / `Rot`（RotN） / `DigestCodec`（摘要） / `Hashids` / `PunyCode` | 简易替换密码、摘要、短 ID 混淆、域名国际化 |
| **特殊编码类** | `BCD` / `Morse` / `QuotedPrintable` / `UuCodec` / `YEnc` / `GzipBase64` | BCD 码、摩斯电码、邮件可打印编码、Usenet 附件编码、Gzip+Base64 组合 |

---

## 二、核心设计

### 1. 编码器/解码器接口

```java
public interface Encoder<T, R> {
    R encode(T data);
}

public interface Decoder<T, R> {
    R decode(T data);
}
```

`Base64Encoder` / `Base64Decoder` 等分别实现这两个接口，职责单一、方向明确。

### 2. Base 编码的本质：进制转换

Base-N 编码的通用思路：把**字节流当作大整数**，反复除 N 取余，映射到字符表。以 Base64 为例：

- 每 3 字节（24 bit）拆成 4 组 6 bit，映射到 64 字符表 `A-Za-z0-9+/`。
- 不足 3 字节时补 `=`（padding）。
- 相比原数据，长度膨胀约 1/3，但全部是 ASCII 可打印字符。

Base58（比特币地址）去掉了易混淆字符 `0OIl`；Base62 用 `0-9A-Za-z` 全部 62 字符，适合 URL 短链；Base32/Base16 更可读但膨胀更大。

### 3. 转义编码：防止语义冲突

- **HtmlEscape / XmlEscape**：把 `<` `>` `&` `"` `'` 转成实体（`&lt;` `&gt;` `&amp;` 等），防止 HTML 注入和标签误解析。
- **PercentCodec**：URL 编码，非 ASCII 字节转成 `%XX`。
- **UnicodeCodec**：把非 ASCII 字符转成 `\uXXXX`，用于 Java 源码/属性文件。

### 4. Hashids：数字 ID 混淆

把数据库自增 ID（如 1、2、3）编码成不可预测的短字符串（如 `kV`、`a1b`），隐藏真实量级、防止遍历，解码可还原。

---

## 三、面试高频问题

**Q1：Base64 的原理？为什么要 padding（`=`）？**

- 3 字节 → 4 个 6bit 字符，索引 64 字符表。
- 不足 3 字节时补 `=` 使总字符数是 4 的倍数，解码端据此还原原始字节数。

**Q2：Base64 是加密吗？**

- **不是**。它是编码，无密钥、可逆，任何人都能解。目的只是「二进制 → 可打印文本」，不提供机密性。

**Q3：URL 为什么要百分号编码？**

- URL 里部分字符有特殊含义（`?` `&` `=` `/` 等），非 ASCII 字符也不安全，需要转成 `%XX` 形式避免歧义和注入。

**Q4：HTML 转义（escape）解决了什么问题？**

- 防止 **XSS**：用户输入 `<script>` 若不被转义成 `&lt;script&gt;`，浏览器会当作标签执行。

**Q5：Rot13 和凯撒密码的关系？**

- 凯撒密码是「字母表平移 N 位」，Rot13 是 N=13 的特例。因为字母表 26 个，Rot13 加密两次即还原，常用于论坛剧透遮挡。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 二进制数据嵌入 JSON/XML/URL | `Base64` / `Base32` / `Base16` |
| URL 短链 / 唯一短 ID | `Base62` / `Base58` |
| 用户输入防 XSS | `HtmlEscape` / `XmlEscape` |
| 表单/query 参数编码 | `PercentCodec` |
| 数据库 ID 防遍历 | `Hashids` |
| 邮件附件（历史遗留） | `UuCodec` / `YEnc` |
| 文件压缩后转文本传输 | `GzipBase64` |

---

## 五、当前状态

- **文件/方法**：与 hutool 5.8.47 对齐（`Rot`、`HtmlEscape`、`XmlEscape`、`UnicodeCodec`、`UuCodec`、`YEnc` 为 ztools 独有/已从 hutool 移出）。
- **单元测试**：齐全，26 个测试类、中文 `@DisplayName`。
- **checkstyle**：**0 违规**。处理要点：tab→4 空格、参数加 `final`、javadoc 首句补句号、算法字节用 `@SuppressWarnings("checkstyle:MagicNumber")`；`Rot` 等 hutool 无私有构造的工具类用 `@SuppressWarnings("checkstyle:HideUtilityClassConstructor")` 而非补构造。

---

## 相关

- [crypto包总结](/blog/ztools-crypto-pkg/)
- [util包总结](/blog/ztools-util-pkg/)
