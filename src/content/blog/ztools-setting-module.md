---
title: 'setting 模块总结'
description: '是 hutool-setting 的移植镜像，包路径 。共 12 主类（+4 package-info），分根包 + dialect/properties + profile 多环境 + yaml 四个层次，实现配置文件的读取、分组、变量替换与多环境切换。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "基础核心"]
---

# setting 模块总结（MOC）

> `cc-hongz-ztools-setting` 是 hutool-setting 的移植镜像，包路径 `cc.hongz.ztools.setting`。共 12 主类（+4 package-info），分根包 + dialect/properties + profile 多环境 + yaml 四个层次，实现配置文件的读取、分组、变量替换与多环境切换。

---

## 分层

- [setting包总结](/blog/ztools-setting-pkg/) — 根包（`Setting`/`AbsSetting`/`SettingUtil`/`GroupedSet` 等 7 类）+ dialect（Props 属性文件）+ profile（多环境）+ yaml（SnakeYAML）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/) 的 [convert包总结](/blog/ztools-convert-pkg/)（`Convert`/`BeanUtil`）、[lang包总结](/blog/ztools-lang-pkg/)（`OptNullBasicTypeGetter`）、[io包总结](/blog/ztools-io-pkg/)（`ResourceUtil`）、[util包总结](/blog/ztools-util-pkg/)（`StrUtil`/`CharsetUtil`）、[exceptions包总结](/blog/ztools-exceptions-pkg/)
- 依赖 [log模块总结](/blog/ztools-log-module/)（`StaticLog` 输出配置加载信息）
- yaml 子包依赖 `org.yaml:snakeyaml`（`optional`，仅用 YAML 时引入）

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [db模块总结](/blog/ztools-db-module/) — db.setting / db.properties 的消费方
