---
title: 'db 模块总结'
description: '是 hutool-db 的移植镜像，包路径 。共 87 主类，分 8 层：ORM 门面、方言、数据源、结果集处理、元数据、NoSQL、SQL 构建、事务。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "数据"]
---

# db 模块总结（MOC）

> `cc-hongz-ztools-db` 是 hutool-db 的移植镜像，包路径 `cc.hongz.ztools.db`。共 87 主类，分 8 层：ORM 门面、方言、数据源、结果集处理、元数据、NoSQL、SQL 构建、事务。

---

## 分层

- [db包总结](/blog/ztools-db-pkg/) — JDBC ORM 封装（Db/Entity + 多方言 + 多连接池 + SQL 构建）

---

## 依赖关系

- 依赖 [core模块总结](/blog/ztools-core-module/)、[setting模块总结](/blog/ztools-setting-module/)、[log模块总结](/blog/ztools-log-module/)
- 连接池（tomcat-jdbc/druid/HikariCP/c3p0/beecp/dbcp2）+ NoSQL（mongo/jedis）均 `optional`；数据库驱动（sqlite/h2/hsqldb/mysql/postgresql 等）test scope

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [ai模块总结](/blog/ztools-ai-module/) — 姊妹模块
