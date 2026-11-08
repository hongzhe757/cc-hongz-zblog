---
title: 'db 包（数据库 ORM）总结'
description: 'db 包是 JDBC 的轻量 ORM 封装，87 个类分 8 组：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "数据"]
---

# db 包（数据库 ORM）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-db/src/main/java/cc/hongz/ztools/db`
>
> 对照基准：hutool 5.8.48（`cn.hutool.db`）

---

## 一、包概览

db 包是 **JDBC 的轻量 ORM 封装**，87 个类分 8 组：

| 类别 | 类 | 职责 |
|---|---|---|
| **ORM 门面** | `Db`（门面）/ `DbUtil` / `Entity`（实体）/ `Session`（事务会话）/ `Page` / `PageResult` / `AbstractDb` / `DaoTemplate` / `ActiveEntity` / `SqlConnRunner` / `DialectRunner` / `StatementUtil` / `ThreadLocalConnection` / `DbRuntimeException` / `GlobalDbConfig` | 统一入口 + 实体/分页/事务 + SQL 执行 |
| **方言** | `Dialect` / `DialectFactory` / `DialectName` / `DriverNamePool` / `DriverUtil` + `impl` 10 种（Mysql/Oracle/Postgresql/SqlServer2012/H2/Hsqldb/Sqlite3/Dm/Hana/Phoenix/Ansi） | 各数据库 SQL 方言适配（分页/upsert/类型映射） |
| **数据源** | `DSFactory` / `GlobalDSFactory` / `AbstractDSFactory` / `DataSourceWrapper` + 8 种连接池工厂（bee/c3p0/dbcp/druid/hikari/jndi/pooled/simple/tomcat） | 连接池工厂 + SPI 自动发现 |
| **结果集处理** | `RsHandler`（接口）+ `BeanHandler` / `EntityHandler` / `NumberHandler` / `StringHandler` / `ValueListHandler` / `PageResultHandler` 等 11 个 | 结果集 → Bean/Entity/标量 |
| **元数据** | `MetaUtil` / `Table` / `Column` / `IndexInfo` / `JdbcType` / `TableType` | 表/列/索引元数据读取 |
| **NoSQL** | `MongoDS` / `MongoFactory` / `RedisDS` | MongoDB / Redis 数据源 |
| **SQL 构建** | `SqlBuilder` / `Condition` / `ConditionGroup` / `ConditionBuilder` / `Query` / `Order` / `NamedSql` / `SqlExecutor` / `SqlFormatter` / `SqlUtil` / `SqlLog` | 链式构建 SQL + 条件 + 命名参数 |
| **事务** | `TransactionLevel` | 事务隔离级别 |

---

## 二、核心设计

### 1. Entity + Db 门面

`Entity` 是「一行数据」的抽象（继承 LinkedHashMap + 表名），`Db.use()` 获取数据源后 `find/query/insert/update/delete/page` 直接操作，屏蔽 JDBC 样板。`Db.find(Entity, Bean.class)` 自动结果集 → Bean 映射。

### 2. 方言（Dialect）

`DialectFactory` 按 JDBC URL/驱动名识别数据库（`DriverNamePool` 维护驱动→方言映射），各 `Dialect` 实现差异化的分页 SQL（MySQL `LIMIT`、Oracle `ROWNUM`）、upsert、类型映射。

### 3. 连接池 SPI

`DSFactory` 通过 SPI 发现 8 种连接池工厂（Druid/HikariCP/C3P0/DBCP2/Tomcat-JDBC/BeeCP/内置 Pooled/Simple），按 `config/db.setting` 配置自动选型。

### 4. SQL 链式构建

`SqlBuilder` + `Condition` 链式拼 SQL（`select().from().where()`），`Condition` 支持 `= / != / between / like / in / is null` 等操作符，`NamedSql` 支持 `:name` 命名参数。

---

## 三、面试高频问题

**Q1：Statement 和 PreparedStatement 的区别？**

- Statement 每次拼接 SQL（易注入）；PreparedStatement 预编译 + 占位符 `?`，防 SQL 注入，性能更好（缓存执行计划）。

**Q2：ORM 和手写 JDBC 的取舍？**

- ORM（MyBatis/Hibernate）省样板、类型安全；手写 JDBC 灵活、性能极致。hutool-db 介于两者之间：轻量封装，保留 SQL 控制力。

**Q3：连接池的作用？**

- 复用连接（避免频繁 TCP 握手 + 认证开销），管理连接生命周期（最大/空闲/超时），如 HikariCP/Druid。

**Q4：分页方言怎么统一？**

- 各 `Dialect` 实现 `buildPagedQuery`，MySQL 用 `LIMIT offset,size`，Oracle 用 `ROWNUM` 嵌套，SQLServer 用 `OFFSET FETCH`，上层无感。

---

## 相关

- [db模块总结](/blog/ztools-db-module/) — 上级 MOC
- [setting模块总结](/blog/ztools-setting-module/) — db.setting 配置读取
