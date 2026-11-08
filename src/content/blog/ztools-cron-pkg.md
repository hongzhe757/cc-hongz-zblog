---
title: 'cron 包（定时任务）总结'
description: 'cron 包是定时任务调度的实现，34 个类分 5 组：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "缓存任务"]
---

# cron 包（定时任务）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-cron/src/main/java/cc/hongz/ztools/cron`
>
> 对照基准：hutool 5.8.48（`cn.hutool.cron`）

---

## 一、包概览

cron 包是**定时任务调度**的实现，34 个类分 5 组：

| 类别 | 类 | 职责 |
|---|---|---|
| **门面/调度** | `CronUtil`（门面）/ `Scheduler`（调度器）/ `CronConfig`（配置）/ `CronTimer`（定时器）/ `CronException` / `TaskTable` / `TaskExecutor`+`TaskExecutorManager` / `TaskLauncher`+`TaskLauncherManager` | 统一入口 + 调度循环 + 任务执行/启动 |
| **监听** | `TaskListener` / `SimpleTaskListener` / `TaskListenerManager` | 任务执行前后回调 |
| **Cron 表达式** | `CronPattern` / `CronPatternBuilder` / `CronPatternUtil` / `Part` / `PatternUtil` + `matcher`（PartMatcher/AlwaysTrueMatcher/BoolArrayMatcher/DayOfMonthMatcher/YearValueMatcher/PatternMatcher）+ `parser`（PartParser/PatternParser） | 解析/匹配 Cron 表达式（秒分时日月周年） |
| **任务** | `Task`（接口）/ `CronTask` / `InvokeTask`（反射调用）/ `RunnableTask` | 任务抽象 |
| **时间轮** | `TimingWheel` / `SystemTimer` / `TimerTask` / `TimerTaskList` | 高性能延迟任务调度（时间轮算法） |

---

## 二、核心设计

### 1. Cron 表达式解析（pattern 子包）

`PatternParser` 把 Cron 表达式拆成 7 个 `Part`（秒/分/时/日/月/周/年），每个 `Part` 解析成 `PartMatcher`。支持 `*`、`?`、`-`（区间）、`/`（步进）、`,`（枚举）、`L`（最后）、`#`（第几个周几）等，兼容 Quartz 风格。

### 2. Scheduler 调度循环

`Scheduler` 主循环每秒检查任务是否命中当前时间（`CronPattern.match`），命中则交给 `TaskLauncher` 启动线程执行。`CronUtil.start()` 懒加载全局 Scheduler。

### 3. 时间轮（TimingWheel）

`TimingWheel` 是分层时间轮，把延迟任务按到期时间分桶，指针每 tick 移动一格，避免「每秒遍历所有任务」，适合大量延迟任务场景。

---

## 三、面试高频问题

**Q1：Cron 表达式的字段含义？**

- `秒 分 时 日 月 周 [年]`，7 段（或 6 段）。`0 0 12 * * ?` = 每天 12 点。

**Q2：`*` 和 `?` 的区别？**

- `*` = 所有值；`?` = 不指定（日和周只能有一个是 `?`，避免冲突）。

**Q3：时间轮和传统定时器（ScheduledThreadPool）的区别？**

- 时间轮按「桶」批量管理任务，指针 O(1) 推进，插入/删除 O(1)，适合海量延迟任务；传统定时器用堆 O(log n)。

---

## 相关

- [cron模块总结](/blog/ztools-cron-module/) — 上级 MOC
- [cache模块总结](/blog/ztools-cache-module/) — 姊妹模块
