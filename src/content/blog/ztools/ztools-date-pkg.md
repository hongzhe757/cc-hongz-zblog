---
title: 'date 包（日期时间）总结'
description: 'date 包是 ztools 最大的包（43 文件），覆盖公历、农历、格式化、计时四大块：'
pubDate: 'Aug 25, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# date 包（日期时间）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/date`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.date`）

---

## 一、包概览

date 包是 ztools **最大的包**（43 文件），覆盖公历、农历、格式化、计时四大块：

| 子包 | 核心类 | 职责 |
|---|---|---|
| 根（工具/对象） | `DateUtil` / `DateTime` / `LocalDateTimeUtil` | 日期解析/格式化/相差/偏移；可变日期对象；java.time 工具 |
| 根（区间/枚举） | `DateBetween` / `DateRange` / `DateField` / `DateUnit` / `Month` / `Week` / `Quarter` / `YearQuarter` / `Zodiac` | 日期区间、字段/单位/月/周/季枚举、星座生肖 |
| 根（计时） | `StopWatch` / `TimeInterval` / `GroupTimeInterval` / `SystemClock` | 秒表计时、时间间隔、分组计时、系统时钟 |
| format 子包 | `FastDateFormat` / `FastDateParser` / `FastDatePrinter` / `DateBasic` / `DateParser` / `DatePrinter` | 线程安全日期格式化（SimpleDateFormat 替代） |
| chinese 子包 | `ChineseDate` / `ChineseMonth` / `GanZhi` / `LunarFestival` / `LunarInfo` / `SolarTerms` | 农历日期、农历月、干支、农历节日、农历数据、24 节气 |

---

## 二、核心设计

### 1. FastDateFormat —— 线程安全的 SimpleDateFormat

`SimpleDateFormat` 非线程安全（内部持可变 `Calendar`），并发下会错乱。`FastDateFormat` 通过**不可变**设计解决：

- 解析时把格式串**编译成 Rule 列表**（`FastDatePrinter`），规则不可变。
- 每次格式化基于传入的 `Calendar` 计算，不共享可变状态。
- 用 `FormatCache`（享元模式）缓存「pattern+时区+地域 → 实例」，避免重复编译。

```java
FastDateFormat format = FastDateFormat.getInstance("yyyy-MM-dd HH:mm:ss");
format.format(new Date());   // 多线程安全
```

### 2. 农历（chinese 子包）—— 数据表驱动

农历没有公式，靠**硬编码数据表**：

- `LunarInfo.LUNAR_CODE`：1900~2099 每年一个 long，编码闰月 + 大小月。
- `SolarTerms.S_TERM_INFO`：1900~2100 每年 30 字符十六进制串，编码 24 节气日期（每 5 字符 = 4 个节气，节 1 位 + 气 2 位交替）。
- 数据来自 `calendar.js`，超出 2099 年返回 null。

### 3. 计时器

- `StopWatch`：仿 `commons-lang`，`start/stop` 记录多个任务耗时。
- `TimeInterval`：单任务耗时（纳秒精度）。
- `GroupTimeInterval`：分组计时（按 id 记录）。

---

## 三、面试高频问题

**Q1：SimpleDateFormat 为什么线程不安全？怎么解决？**

- 内部 `Calendar` 是共享可变状态，多线程 `format/parse` 会互相覆盖。
- 解决：① 每次 new；② `ThreadLocal`；③ 用线程安全的 `FastDateFormat`（hutool）/ `DateTimeFormatter`（JDK8，不可变）。

**Q2：`Date` 和 `LocalDateTime` 有什么区别？**

- `Date`：JDK1.0 遗留，可变、时区混乱、API 难用；表示时间戳 + 时区。
- `LocalDateTime`：JDK8 `java.time`，不可变、线程安全、API 清晰、无时区（纯本地日期时间）。

**Q3：时区转换怎么做？**

- `DateUtil.parse` 指定 `TimeZone`；`DateTime.setTimeZone`；`TimeZoneUtil` 工具。
- 核心：同一时刻在不同时区的表示不同，转换时只改「时区表示」不改「时间戳」。

**Q4：农历是怎么算的？为什么只支持到 2099？**

- 没有解析公式，靠硬编码数据表（`LUNAR_CODE`/`S_TERM_INFO`）查表；表只覆盖 1900~2099，超范围返回 null。

---

## 四、应用场景

| 场景 | 对应能力 |
|---|---|
| 日期解析/格式化 | `DateUtil.parse/format` |
| 时间戳运算（加天数/算年龄） | `DateUtil.offset/between/ageOfNow` |
| 农历/节气/干支 | `ChineseDate` / `SolarTerms` / `GanZhi` |
| 高并发日期格式化 | `FastDateFormat` |
| 接口耗时统计 | `StopWatch` / `TimeInterval` |
| 星座/生肖 | `Zodiac` |

---

## 五、当前状态

- **文件/方法**：43 文件，与 hutool 5.8.47 完全对齐，无缺漏。
- **单元测试**：40+ 测试类、约 290 用例，中文 `@DisplayName`，全绿（从 hutool 迁移 31 个 + 原有 9 个 + 补 6 个内部类测试）。
- **checkstyle**：**0 违规**（含 format、chinese 子包）。处理要点：tab→4空格、final 参数（重赋值参数改局部变量）、javadoc 句号、英文注释翻译、单行 javadoc 展开多行、MagicNumber 加 `@SuppressWarnings`、注释中 `cn.hutool` 类路径改 `cc.hongz.ztools`。

---

## 相关

- [util包总结](/blog/ztools-util-pkg/)
- [convert包总结](/blog/ztools-convert-pkg/)
