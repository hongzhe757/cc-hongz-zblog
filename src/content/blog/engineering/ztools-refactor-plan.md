---
title: 'ztools 重构规划'
description: '提取自持久记忆（memory/ztools-refactor-plan.md）。hutool 22 个模块已全部迁移完成，进入重构阶段。完整规范见仓库内 。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["工程", "ztools"]
category: 'engineering'
---

# ztools 重构规划

> 提取自持久记忆（memory/ztools-refactor-plan.md）。hutool 22 个模块已全部迁移完成，进入重构阶段。完整规范见仓库内 `cc-hongz-ztools/重构规划.md`。

---

## 分支 / tag 策略

- 重构统一在 **dev 分支**（ztools 主仓库 + 24 子模块已从 master 切出 dev 并推送）。
- **master 打 tag `0.0.1`**（重构前稳定基线，已推送）。
- 重构版本从 `0.0.2` 起递增。

## 作者 / 版本约定

- 重构过的方法只保留一个 `@author hongz`（重构作者），括号内备注「原作者：looly 原版本：X.X.X」。
- `@since` 只写一个：重构版本 `0.0.2`（替换原 hutool 版本）。
- 未重构的方法保持原样，不补 `@author`。

## 重构规范

**核心**：早返回（Guard Clause）/ if-else 平级化 / 循环早 continue-break / 三元取舍。

**补充**：
- 长方法拆分（圈复杂度 ≤ 15）
- 魔法数字提常量（去掉 checkstyle 的 `@SuppressWarnings("MagicNumber")`）
- try-with-resources、异常规范化、线程安全审查
- 测试先行、API 兼容红线（public 签名不变）

## 模块规模与重构排序

| 批次 | 模块 |
|---|---|
| P0 | core（675 类 / 4.5 万行）|
| P1 | extra(128) / db(87) / crypto(64) / http(62) / response(64) / poi(66) / ai(48) / json(30) |
| P2 | cron(34) / setting(12) / log(34) / jwt(15) / cache(19) / captcha(15) / system(14) / socket(20) |
| P3 | bloomFilter(19) / protector(8) / script(4) / dfa(5) / aop(11) / all(1) |

估算：1 人 + AI 约 4-7 个月，3 人并行约 1.5-2.5 个月。

## 相关

- [ztools项目约定与工作流](/blog/ztools-workflow/)
- [仓库盘点报告](/blog/repo-inventory/)
