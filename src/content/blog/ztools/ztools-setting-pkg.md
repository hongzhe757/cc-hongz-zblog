---
title: 'setting 包（配置文件读取）总结'
description: 'setting 包是 Properties 的增强版配置文件读取，12 个类分 4 组：'
pubDate: 'Sep 01, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# setting 包（配置文件读取）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-setting/src/main/java/cc/hongz/ztools/setting`
>
> 对照基准：hutool 5.8.48（`cn.hutool.setting`）

---

## 一、包概览

setting 包是 **Properties 的增强版配置文件读取**，12 个类分 4 组：

| 类别 | 类 | 职责 |
|---|---|---|
| **核心** | `Setting` / `AbsSetting` | 配置文件实体（支持分组、变量、注释）；抽象父类提供类型化 getter |
| **加载** | `SettingLoader` / `SettingUtil` | 逐行解析 `.setting` 文件构建 `GroupedMap`；静态缓存获取 |
| **分组集合** | `GroupedMap` / `GroupedSet` | 分组 Map（线程安全）；分组 Set（`[group]` 段落） |
| **异常** | `SettingRuntimeException` | 设置异常 |
| **dialect 方言** | `Props` / `PropsUtil` | `.properties` 文件封装（继承 `Properties`）；静态缓存获取 |
| **profile 多环境** | `Profile` / `GlobalProfile` | 按 `profile` 目录切换配置；全局环境中心 |
| **yaml** | `YamlUtil` | 基于 SnakeYAML 的 YAML 读写（`loadByPath/load`） |

---

## 二、核心设计

### 1. Setting：增强版 Properties

`Setting` 继承 `AbsSetting` 并实现 `Map<String, String>`，向下兼容 `.properties`，但新增三类能力：

- **变量**：`${变量名}` 占位符，`SettingLoader` 用正则识别并替换，默认变量只能引用「读入行之前的变量」。
- **分组**：`[group]` 中括号分段，段内键归属该分组，无分组等同空字符分组；带分组键等价 `group.key`。
- **注释**：`#` 开头视为注释，空行、不带 `=` 的行跳过。

### 2. SettingLoader：逐行解析 + GroupedMap 存储

`SettingLoader` 持有一个 `GroupedMap`（`LinkedHashMap<String, LinkedHashMap<String, String>>`，线程安全），逐行读取文本，识别分组行、注释行、键值对，并把键值放进对应分组；`store()` 反向写出（**注释不保留**）。`GroupedSet` 则是分组化的 `Set`，`[group1]` 段落内每个词是一个成员，无分组和 `[]` 分组的成员会合并、重名分组也合并。

### 3. Profile：多环境配置切换

`Profile` 定义一套目录规范：默认读 `${classpath}/default/*.setting`，`setProfile("test")` 后读 `${classpath}/test/*.setting`。典型用法是 test/develop/production 三个目录各放一套 `db.setting`，运行时切换。`GlobalProfile` 是全局单例中心，`setProfile()` 设置全局环境，`getSetting()` 直接拿当前环境配置。`SettingUtil.get()` / `PropsUtil.get()` 内部都经过 Profile 环境解析。

### 4. Props：Properties 方言

`Props` 继承 JDK `Properties` 并实现 `BasicTypeGetter`，提供 `getStr/getInt/getBool/getBean` 等类型化取值，`.properties` 文件是它的本命格式；`Setting` 则是 hutool 自有 `.setting` 格式。两者互补，`PropsUtil` 与 `SettingUtil` 结构对称（都带缓存 + `getFirstFound` 兜底找第一个存在的文件）。

### 5. YamlUtil：SnakeYAML 适配

`YamlUtil` 用 SnakeYAML 的 `Yaml` 对象，`loadByPath()` 从 classpath/绝对路径加载并转 `Dict`（或指定 Bean 类型），`dump()` 反向序列化。SnakeYAML 是 `optional` 依赖，不引入时该子包不可用。

---

## 三、面试高频问题

**Q1：Setting 相比 JDK Properties 强在哪？**

- Properties 只有扁平的 `key=value`，不支持分组、变量、类型转换。`Setting` 增加 `[group]` 分组、`${var}` 变量引用、`#` 注释、以及 `getInt/getBool/getBean` 等类型化取值，还能按 `profile` 目录做多环境切换，更适合工程化配置管理。

**Q2：`${变量}` 为什么「只能引用前面的变量」？**

- `SettingLoader` 是**单遍逐行解析**，读到一行立即替换变量，此时只有「之前读入的变量」可用。所以第 3 行不能引用第 6 行定义的变量。这是流式解析的天然限制，也是性能与简单性的取舍。

**Q3：多环境配置怎么落地？**

- 用 `Profile`：classpath 下建 `test/develop/production` 三个目录各放同名 `db.setting`，运行时 `GlobalProfile.setProfile("production")` 切换。`SettingUtil.get("db")` 会解析到 `production/db.setting`，实现「一套代码、多套配置、运行时切换」，无需改代码或打包多份。

**Q4：`store()` 为什么可能丢注释？**

- 解析时注释行被跳过、不存进 `GroupedMap`，而 `store()` 是把内存里的键值重新写回，注释信息早已丢失。所以注释仅对「人读」有意义，程序改写的配置会掉注释，文档明确「store 方法不会保存注释内容，慎重使用」。

---

## 相关

- [setting模块总结](/blog/ztools-setting-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [db模块总结](/blog/ztools-db-module/) — 消费 `db.setting`/`db.properties`
- [log模块总结](/blog/ztools-log-module/) — 加载日志输出
