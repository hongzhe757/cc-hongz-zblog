---
title: 'ztools 项目约定与工作流'
description: '提取自持久记忆（memory 目录），涵盖项目结构、checkstyle 清理约定、脚本坑、提交工作流、用户工作方式。生成时间 2026-08-25，更新于 2026-09-01。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["工程", "ztools"]
category: 'engineering'
---

# ztools 项目约定与工作流

> 提取自持久记忆（memory 目录），涵盖项目结构、checkstyle 清理约定、脚本坑、提交工作流、用户工作方式。生成时间 2026-08-25，更新于 2026-09-01。

---

## 一、项目结构

`D:\workspace\hongz_workspace\cc-hongz-parent` 是**嵌套 git 子模块树**（非普通单仓库）：

```
cc-hongz-parent（主仓库，分支 develop）
├── cc-hongz-ztools（子模块，master）
│   └── cc-hongz-ztools-core（子模块，master）   ← 主要改代码的地方
└── cc-hongz-thrid（子模块，master）
    └── cc-hongz-hutool（子模块，v5-dev/v5-master/cc-hongz）
```

- 改代码落到**最内层子模块**，再自底向上逐层提交指针。
- 远端：gitee.com/deligense/ 系列。

## 二、ztools 定位

`cc-hongz-ztools-core`（包 `cc.hongz.ztools.core`）是从 hutool（`cn.hutool.core`）**移植镜像**，功能上「和 hutool 一样」。

ztools 自身目前主要解决两件事：

1. **代码规范 checkstyle**（清理到 0 违规）
2. **单元测试覆盖**（补测试 + 补 `@DisplayName` 中文化）

差异：ztools 用 **4 空格缩进** + 迁移版中文注释（句号结尾）；hutool 用 **tab 缩进** + 原版注释。

## 三、checkstyle 处理约定

每个文件流程：**修主类 checkstyle → 查/补测试类 → 补 @DisplayName**。

| 规则 | 处理 |
|---|---|
| `FileTabCharacter` | tab → 4 空格 |
| `FinalParameters` | 参数加 `final`；方法体内重新赋值的参数改用局部变量（如 `unit`→`resolvedUnit`、`text`→`parsedText`）。**批量插 final 后必须编译验证**（编译会暴露重赋值参数） |
| `JavadocStyle` | 首句补句号（`。`/`.` 均可，`endOfSentenceFormat=([.?!。])(\s\|\z\|$)`）；`<br>`/`<ul>`/`<pre>` 前要「句号+空格」或「句号+换行」；冒号 `：` 结尾的首句改句号 |
| `HiddenField` | 流式 setter（返回非 void）参数遮蔽字段改名 `newXxx`；静态方法参数遮蔽实例字段不 flag |
| `MagicNumber` | 算法字节用 `@SuppressWarnings("checkstyle:MagicNumber")`（类级或方法级） |
| `HideUtilityClassConstructor` | **原版无私有构造器就不补**，用 `@SuppressWarnings("checkstyle:HideUtilityClassConstructor")`；原版有私有构造器的保留 |
| `JavadocVariable` | 字段/枚举常量要有中文 javadoc；hutool 原版无注释的也要补 |
| `MissingJavadocMethod` | 缺 javadoc 的 public 方法补（getter/setter 豁免，`allowMissingPropertyJavadoc=true`） |
| `LineLength` | max=120，方法签名/常量/分隔线拆行或缩短 |

**其他约定（用户明确要求）**：

- **javadoc 注释统一多行形式**：`/** xxx */` 单行展开成 `/**\n * xxx\n */`。
- **单元测试要有 `@DisplayName`**（类级 + 方法级，中文）；测试类迁移 = 复制 + 改包名 `cn.hutool→cc.hongz.ztools` + tab→4空格。
- **去掉「迁移自 hutool / 自 Hutool 迁入 / 对齐 Hutool / migrated」等迁移来源表述**；`@author hongzhe.qin (migrated & enhanced)` → `(enhanced)`。
- **注释中残留 `cn.hutool` 类路径改成 `cc.hongz.ztools`**。
- **「阶段 1 / 最小子集」标注 = 功能不完整，需对比 hutool 补齐**。
- JDK17 不兼容测试加 `@Disabled`。
- `@SuppressWarnings` 多个值用**数组** `@SuppressWarnings({"a", "b"})`，不能用两个单独注解（Java 不允许重复）。

## 四、脚本坑（CRLF）

文件是 **CRLF** 换行，Node `readFileSync` 读出的字符串含 `\r`：

- 用正则 `(\r?\n)` 或 `split/join`，别用 `.replace("X\n", ...)`。
- 跨行锚点在 CRLF 文件匹配不到，只用单行锚点。
- LeftCurly 单行块展开会误伤 javadoc 行尾 `{@link Xxx}`/`{@code Xxx}`，展开后要合并回。
- 大批量加 final：解析 checkstyle 的 FinalParameters 行/列，从后往前插入 `final `（列指向参数类型起点）。**先展开单行块、加 @SuppressWarnings 后再跑 checkstyle 取坐标**，否则行号错位（加注解会改变行号）。

## 五、提交推送工作流

- **自底向上**：先最内层子模块提交，再逐层 `git add <子模块路径>` 更新指针并提交、推送。
- **只 `git add` 指定文件**，绝不用 `git add -A`（工作区有长期 WIP：25 个已删除目录、pom.xml 等）。
- 提交信息：中文 + 约定式前缀（feat/chore/style/test/revert）；指针更新用 `chore: 更新 <子模块> 子模块引用（<描述>）`。
- 可能落后远端：先 `git fetch` 再 `git log HEAD..origin/<branch>` 看分叉。

## 六、开发环境

- **无 Python**（Windows Store 占位符），**用 Node.js** 处理脚本。
- Edit 工具的 JSON 转义会破坏反斜杠，含 `\w` 等正则序列的文件改用 Node 脚本。

## 七、用户工作方式

- 上下文 1000k，到 90% 提醒、停止新问题、写进度进记忆、开新对话。
- 思考/推理过程用中文。
- 说「提取记忆」= 在 obsidian 写总结 + 更新提示词。

## 八、迁移进度（截至 2026-09-01，全部完成）

**hutool 22 个模块全部迁移完成**（20 功能 + all 聚合 + bom），另 ztools 自有 protector / response。全部拆独立 gitee 仓库 + checkstyle 0 违规 + 测试 @DisplayName + 测试全绿（外部依赖 @Disabled）。

- 本次会话迁移：poi / aop / bloomFilter / cache / cron / ai / db / all / bom；http / setting / script 三个遗留模块 checkstyle 收尾。
- obsidian 总结：22 个功能模块总结齐全（README 导航按字母序）。
- 重构规划见 [ztools重构规划](/blog/ztools-refactor-plan/)。

---

## 相关

- [ztools重构规划](/blog/ztools-refactor-plan/)
- **提示词库**
- [仓库盘点报告](/blog/repo-inventory/)
