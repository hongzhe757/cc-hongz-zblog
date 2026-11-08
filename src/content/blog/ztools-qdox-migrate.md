---
title: 'qdox 迁移总结（cc-hongz-zdox）'
description: '对象：（qdox 迁移版，parent 直接子模块）'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-4.jpg'
tags: ["工程", "ztools"]
---

# qdox 迁移总结（cc-hongz-zdox）

> 对象：`cc-hongz-zdox`（qdox 迁移版，parent 直接子模块）
> 结论先行：qdox 已迁移为 `cc-hongz-zdox`，**包名 + 坐标 + 编译**三步已到位（`com.thoughtworks.qdox → cc.hongz.zdox`，`cc.hongz:cc-hongz-zdox`），但目前是**半成品**——checkstyle 清理、测试 `@DisplayName`、版本对齐 ztools 约定、分支切 dev 都还没做。

---

## 一、迁移产物

| 项 | 值 |
|----|----|
| 仓库 | `cc-hongz-zdox`（parent 直接子模块，gitee `deligense/cc-hongz-zdox.git`） |
| 基于上游 | `deligense/qdox` 的 `c2faed78`（smart-doc fork 版，含 record/sealed/常量解析增强） |
| 坐标 | `cc.hongz:cc-hongz-zdox:2.0.3.2` |
| 包名 | `cc.hongz.zdox`（原 `com.thoughtworks.qdox`） |
| 规模 | 198 源码文件 + 93 测试文件（与原 qdox 完全一致） |

## 二、子模块结构

qdox 迁移走了「thrid 放 fork 上游 + 镜像移植」模式（同 [ztools项目约定与工作流](/blog/ztools-workflow/)）：

```
cc-hongz-parent
├─ cc-hongz-thrid/cc-hongz-qdox    ← fork 上游（保留原 com.thoughtworks.qdox 包名，HEAD c2faed78）
└─ cc-hongz-zdox                   ← 迁移版（parent 直接子模块，包名 cc.hongz.zdox）
```

- `cc-hongz-thrid/cc-hongz-qdox`：deligense/qdox 的 fork，作为上游留存（只改 Maven 坐标，内部包名仍是 `com.thoughtworks.qdox`）。
- `cc-hongz-zdox`：迁移版，包名彻底改成 `cc.hongz.zdox`，与 thrid 上游解耦。

## 三、迁移步骤（3 个提交）

| 提交 | 内容 |
|------|------|
| `c776f18` | Initial commit |
| `ba161f2` | 初始化 cc-hongz-zdox（基于 deligense/qdox 上游原版 c2faed78） |
| `03d4e15` | 迁移包名 `com.thoughtworks.qdox → cc.hongz.zdox` |

包名迁移是**彻底**的：`src/main/java` 与 `src/test/java` 下只剩 `cc/hongz/zdox`，grep `com.thoughtworks` 无残留；`target/classes` 已生成，**编译通过**。

## 四、当前状态（半成品）

| 维度 | 状态 |
|------|------|
| 包名迁移 | ✅ 完成（无残留） |
| 坐标改造 | ✅ `cc.hongz:cc-hongz-zdox` |
| 编译 | ✅ 通过 |
| **checkstyle 清理** | ❌ 未做（pom 无 checkstyle 插件，区别于 ztools 各模块 0 违规） |
| **测试 @DisplayName** | ❌ 未做（93 测试类原样，无中文 `@DisplayName`） |
| **版本约定** | ❌ `2.0.3.2` 未对齐 ztools `0.0.x` / `@since` 约定 |
| **分支** | ⚠️ 有 master + dev（内容相同），当前 HEAD 在 master |

## 五、遗留决策点

1. **smart-doc 坐标切换**：smart-doc 依赖 `com.ly.smart-doc:qdox:2.0.3.5`（包名 `com.thoughtworks.qdox`，源码 179 处 import），迁移后需改为 `cc.hongz:cc-hongz-zdox` 并把 179 处 import 改成 `cc.hongz.zdox.*`。
2. **版本号**：是否把 `2.0.3.2` 对齐 ztools 的 `0.0.x` + `@since` 约定（与 [ztools重构规划](/blog/ztools-refactor-plan/) 的作者/版本约定一致）。
3. **checkstyle + 测试中文化**：是否按 ztools 模式补齐（tab→4 空格、final 参数、javadoc 句号、测试 `@DisplayName`）。
4. **分支**：master vs dev 二选一。ztools 重构统一在 dev，但 zdox 是独立三方库迁移，需定：dev 是否为重构分支、master 是否打基线 tag。

> 参考：**qdox源码解析库分析** 第七节「迁移要点」已列出包名改/不改的决策与成本；本总结即该决策的**落地结果**（选择「改包名 + 彻底迁移」）。

---

## 相关

- **qdox源码解析库分析** — qdox 定位、包结构、smart-doc fork 定制点
- **qdox词法分析与语法分析** — JFlex + BYacc/J 解析机制
- **smart-doc设计借鉴与迁移分析** — qdox 作为 smart-doc 前置依赖的迁移方案
- [ztools项目约定与工作流](/blog/ztools-workflow/) — 镜像移植模式
- [ztools重构规划](/blog/ztools-refactor-plan/) — 作者/版本约定
