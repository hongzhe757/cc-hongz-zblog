---
title: 'text 包（文本处理）总结'
description: 'text 包提供字符串/文本处理的进阶能力：字符串操作、拼接、分割、CSV、转义、密码强度、文本相似度等。16 个顶层类 + 6 个子包：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-3.jpg'
---

# text 包（文本处理）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/text`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.text`）

---

## 一、包概览

text 包提供**字符串/文本处理**的进阶能力：字符串操作、拼接、分割、CSV、转义、密码强度、文本相似度等。**16 个顶层类 + 6 个子包**：

| 类别 | 类 / 子包 | 职责 |
|---|---|---|
| **字符串工具** | `CharSequenceUtil` | CharSequence 工具核心（`StrUtil` 继承它） |
| **构建/拼接** | `StrBuilder` / `StrJoiner` | 字符串构建器；分隔符拼接 |
| **格式化** | `StrFormatter` | `{}` 占位符格式化 |
| **分割** | `StrSplitter` / split 子包 | 按长度/正则/字符分割 |
| **匹配** | `StrMatcher` | 字符串匹配器 |
| **常量池** | `StrPool` / `CharPool` | 字符串/字符常量 |
| **命名转换** | `NamingCase` | 驼峰/下划线/帕斯卡互转 |
| **转义** | escape 子包 / `UnicodeUtil` | HTML/XML 实体转义；Unicode |
| **CSV** | csv 子包 | CSV 解析/写出 |
| **查找** | finder 子包 | 字符/字符串查找器 |
| **密码强度** | `PasswdStrength` / `PasswordValidator` / password 子包 | 密码强度评估、密码策略校验 |
| **相似度** | `Simhash` / `TextSimilarity` | 文本去重/相似度 |
| **其他** | `AntPathMatcher` / `ASCIIStrCache` / replacer 子包 | Ant 路径匹配、ASCII 缓存、替换器 |

---

## 二、核心设计

### 1. CharSequenceUtil：操作 CharSequence 而非 String

`CharSequenceUtil` 所有方法接受 `CharSequence`，因此 String、StringBuilder、StringBuffer 都能用。`util.StrUtil` 继承它，是字符串工具的真正实现。

### 2. StrFormatter：占位符格式化

`StrFormatter.format("你好，我是{}，今年{}岁", "小明", 18)` 用 `{}` 占位符替换，比 `String.format` 的 `%s` 更直观，且支持转义 `\{}`。

### 3. StrJoiner：分隔符拼接

`StrJoiner` 把集合元素用分隔符、前缀、后缀拼接（类似 `StringJoiner`），支持 null 处理（跳过或替换）。

### 4. Simhash：文本去重/相似度

`Simhash` 把文本降维成固定长度的指纹（如 64 位），通过汉明距离判断相似度，用于海量文本去重（网页去重、查重）。

### 5. 密码策略（password 子包）

`PasswordPolicy`/`PasswordPolicyBuilder` 组合多个规则（长度、字符组、连续字符、键盘序列、常见密码等），`PasswdStrength` 评估密码强度等级。

---

## 三、面试高频问题

**Q1：为什么 CharSequenceUtil 操作 CharSequence 而不是 String？**

- CharSequence 是 String/StringBuilder 等的父接口，操作它可同时支持不可变和可变字符序列，避免 String 频繁拼接产生大量中间对象。

**Q2：`{}` 占位符和 `%s` 的区别？**

- `{}` 无需关心类型、顺序更直观，可重复/转义；`%s` 要按类型匹配格式符。StrFormatter 用 `{}`。

**Q3：什么是 Simhash？**

- 一种局部敏感哈希：相似文本生成相近的指纹，用汉明距离（不同 bit 数）衡量相似度。用于百万级文本去重，比两两比对快得多。

**Q4：Ant 路径匹配 `**` 和 `*` 的区别？**

- `*` 匹配单层目录内任意字符（不含 `/`），`**` 匹配任意层级目录。常用于文件过滤、Spring 拦截器路径。

**Q5：密码强度评估考虑什么？**

- 长度、字符多样性（大小写/数字/符号）、是否含连续/重复/键盘序列、是否常见密码（如 123456）。password 子包把这些拆成可组合的规则。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 字符串工具（判空/截取/驼峰） | `CharSequenceUtil` / `StrUtil` |
| 日志/模板占位符替换 | `StrFormatter` |
| 集合拼接成字符串 | `StrJoiner` |
| CSV 导入导出 | csv 子包 |
| HTML/XML 转义 | escape 子包 |
| 密码强度校验 | `PasswdStrength` / password 子包 |
| 文本去重/相似度 | `Simhash` |
| 路径模糊匹配 | `AntPathMatcher` |

---

## 五、当前状态

- **文件**：16 个顶层类 + 6 个子包，与 hutool 5.8.47 对齐。
- **单元测试**：28 个测试类，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。处理要点：`PasswdStrength` 的枚举名（`PASSWD_LEVEL`/`CHAR_TYPE`）与算法魔数通过 checkstyle suppressions 豁免（与算法库原名保持一致）。

---

## 相关

- [util包总结](/blog/ztools-util-pkg/)
- [codec包总结](/blog/ztools-codec-pkg/)
