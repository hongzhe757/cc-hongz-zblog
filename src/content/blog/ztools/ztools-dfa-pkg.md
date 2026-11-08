---
title: 'dfa 包（敏感词过滤）总结'
description: 'dfa 包是 dfa 模块的全部内容（5 类），单包结构：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "安全"]
category: 'ztools'
---

# dfa 包（敏感词过滤）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-dfa/src/main/java/cc/hongz/ztools/dfa`
>
> 对照基准：hutool 5.8.48（`cn.hutool.dfa`）

---

## 一、包概览

dfa 包是 dfa 模块的**全部内容**（5 类），单包结构：

| 类别 | 类 | 职责 |
|---|---|---|
| **DFA 词树** | `WordTree` | DFA（确定有穷自动机）词树，`HashMap<Character, WordTree>` 结构，构建/匹配 |
| **门面** | `SensitiveUtil` | 敏感词统一入口：初始化词库 + 查找 + 过滤 |
| **停用字符** | `StopChar` | 标点/空格/全角符号等不参与匹配的字符集合 |
| **命中结果** | `FoundWord` | 命中词 + 匹配内容 + 起止下标（继承 `DefaultSegment`） |
| **过滤处理器** | `SensitiveProcessor` | 敏感词替换策略，默认按字符数替换 `*` |

---

## 二、核心设计

### 1. WordTree：Trie 字典树 + DFA

`WordTree` 直接继承 `HashMap<Character, WordTree>`，每个字符是一个节点，节点再指向下一层字符，构成一棵**字典树（Trie）**。例如「红领巾」「红河」建树后共用「红」节点，再分「领→巾」「河」两支。`addWord` 逐字符 `computeIfAbsent` 下钻，末尾字符存入 `endCharacterSet` 标记词尾；`matchAllWords` 从文本每个起点出发沿树遍历，遇到词尾标记即命中。因为匹配过程是「扫描一次文本 + 状态沿树转移」，复杂度 O(n)，与词库规模基本无关。

### 2. 停用字符过滤（charFilter + StopChar）

`StopChar.STOP_WORD` 集中了标点、空格、全角符号、希腊字母等大量「不参与匹配」的字符，`isStopChar(ch)` 用 `Character.isWhitespace` 或集合判断。`WordTree` 默认持有 `Filter<Character>` 规则（`StopChar::isNotStopChar`），建词和匹配时都跳过停用字符。这样「法*轮*功」中间夹着 `*` 也能命中「法轮功」，防绕过；但停用字符出现在词首会被跳过、出现在词中会作为关键词一部分拼进结果。`setCharFilter` 允许自定义规则。

### 3. 密集匹配 vs 贪婪匹配

`matchAllWords(text, limit, isDensityMatch, isGreedMatch)` 提供两种匹配原则：

- **密集匹配**（`isDensityMatch=true`）：命中一个词后不跳过，从下一个字符继续，`abab` 匹配 `[ab, b, ab]`——尽量多命中。
- **贪婪匹配**（`isGreedMatch=true`，最长匹配）：命中后继续往下走，尽量匹配更长的词，关键词 `a`/`ab` 时匹配 `[a, ab]`。
- 两者可叠加：敏感词过滤场景默认「密集 + 贪婪」，即 `sensitiveFilter` 里的 `getFoundAllSensitive(text, true, isGreedMatch)`。

### 4. SensitiveUtil：门面 + JSON 转 Bean

`SensitiveUtil` 是静态门面，内部持有一个单例 `WordTree sensitiveTree`：

- **初始化**：`init(sensitiveWords)` 或 `init(str, separator, isAsync)`，支持逗号分隔字符串和异步初始化（`ThreadUtil.execAsync`）。
- **查找**：`containsSensitive`（是否含）、`getFoundFirstSensitive`（第一个）、`getFoundAllSensitive`（全部）。
- **过滤**：`sensitiveFilter(text, isGreedMatch, processor)` 把命中的 `FoundWord` 按起止下标替换成 `*`；`sensitiveFilter(bean, ...)` 则先把对象 `JSONUtil.toJsonStr` 转 JSON、过滤后再 `JSONUtil.toBean` 还原，实现「对象级敏感词过滤」。

### 5. FoundWord + SensitiveProcessor：命中结果与替换策略

`FoundWord` 继承 `DefaultSegment<Integer>`，除携带 `word`（词树里的标准词）、`foundWord`（文本里实际命中的内容）外，还记录 `startIndex`/`endIndex`（区间下标），供过滤时定位替换。`SensitiveProcessor` 是函数式接口，`process(FoundWord)` 默认按 `foundWord` 长度输出等量 `*`，可自定义替换为 `***`、`[敏感词]` 等。`sensitiveFilter` 里 `foundWordMap.put(startIndex, foundWord)` + 顺序遍历文本，命中起点就 `append(processor.process(fw))` 并跳到 `endIndex`。

---

## 三、面试高频问题

**Q1：DFA（字典树）过滤敏感词为什么比暴力 `contains` 遍历快？**

- 暴力法：每个敏感词对文本做一次 `contains`，若有 m 个词、文本长 n，最坏 O(m × n)，词库越大越慢。
- DFA：把所有敏感词建成一棵 Trie 树，扫描文本一次（O(n)），每读一个字符沿树做状态转移，命中与否只取决于树的深度，与词库词条数无关，所以大词库下性能稳定，是敏感词过滤的标准做法。

**Q2：Trie（前缀树）和 DFA（确定有穷自动机）是什么关系？**

- Trie 是一种树形数据结构，节点按字符分层、共享公共前缀，用于存储字符串集合。
- DFA 是自动机模型：有限状态 + 状态转移函数 + 终态。hutool 的 `WordTree` 用 Trie 的结构表达 DFA——节点即状态、`HashMap<Character, WordTree>` 即转移函数、`endCharacterSet` 标记终态（词尾）。匹配过程就是从根状态出发沿输入字符转移、到达终态即命中。

**Q3：为什么要设置停用字符？它能防什么？**

- 用户可能输入「法*轮*功」「办 证」这类夹带标点/空格绕过检测的内容。`StopChar` 把标点、空格、全角符号、装饰符号等定义为「不参与匹配」，匹配时跳过，让「法*轮*功」依然命中「法轮功」。
- 代价是正常文本里的标点也被忽略，可能误报（如「A-B」命中「AB」），所以提供了 `setCharFilter` 让业务自定义过滤规则。

**Q4：`FoundWord` 为什么要继承 `DefaultSegment` 记录起止下标？**

- 单存命中词不够，过滤时要**定位替换**：`sensitiveFilter` 用 `startIndex`/`endIndex` 知道从文本哪个位置开始替换、替换多长，`i = fw.getEndIndex()` 跳过整段，避免逐字符处理。
- `DefaultSegment`（core 的区间抽象）正好提供 `getStartIndex()`/`getEndIndex()`，`FoundWord` 复用它并追加 `word`/`foundWord` 两个语义字段，`toString()` 只输出命中的实际内容。

---

## 相关

- [dfa模块总结](/blog/ztools-dfa-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [collection包总结](/blog/ztools-collection-pkg/) — `CollUtil` 来源
- [lang包总结](/blog/ztools-lang-pkg/) — `Filter`/`DefaultSegment` 来源
