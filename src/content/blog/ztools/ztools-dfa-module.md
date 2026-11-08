---
title: 'dfa 模块总结'
description: '是 hutool-dfa 的移植镜像，包路径 。共 5 个类（+1 package-info），单包结构，实现基于 DFA 算法的敏感词过滤。'
pubDate: 'Aug 31, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# dfa 模块总结（MOC）

> `cc-hongz-ztools-dfa` 是 hutool-dfa 的移植镜像，包路径 `cc.hongz.ztools.dfa`。共 5 个类（+1 package-info），单包结构，实现基于 DFA 算法的敏感词过滤。

---

## 分层

- [dfa包总结](/blog/ztools-dfa-pkg/) — 根包（`WordTree` 词树 + `SensitiveUtil` 门面 + `StopChar`/`FoundWord`/`SensitiveProcessor`），共 5 类

---

## 依赖关系

- [dfa包总结](/blog/ztools-dfa-pkg/) 依赖 [core模块总结](/blog/ztools-core-module/) 的 [collection包总结](/blog/ztools-collection-pkg/)（`CollUtil`）、[lang包总结](/blog/ztools-lang-pkg/)（`Filter`/`DefaultSegment`）、[util包总结](/blog/ztools-util-pkg/)（`StrUtil`）、[thread包总结](/blog/ztools-thread-pkg/)（`ThreadUtil`）
- 依赖 **json** 模块（`JSONUtil`）实现 Bean 级敏感词过滤（对象转 JSON 字符串后匹配）
- 无第三方库，纯 JDK `HashMap`/`HashSet` 实现 DFA

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [json模块总结](/blog/ztools-json-module/) — 上游 json 模块（JSONUtil 实现 Bean 级敏感词过滤）
