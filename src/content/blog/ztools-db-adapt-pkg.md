---
title: '数据库与框架适配 包（分页/中间件适配）总结'
description: '性质：自有模块（非 hutool 移植）'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "数据"]
---

# 数据库与框架适配 包（分页/中间件适配）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-response/src/main/java/cc/hongz/ztools/response` 下的 `database` / `framework` / `mq` / `common` 子包
>
> 性质：自有模块（非 hutool 移植）

---

## 一、包概览

该层是 response 模块的**中间件适配目录**：封装数据库/缓存、框架特定、消息队列的响应结构，并提供四套分页数据模型，共 15 个类：

| 类别 | 类 | 职责 |
|---|---|---|
| **Redis 响应** | `RedisResponse` | key/value/ttl/success/message + `get`/`set`/`withTtl`/`error`/`exists`/`hasTtl` |
| **Elasticsearch 响应** | `ElasticsearchResponse` | totalHits/maxScore/hits/aggregations/took + 内部 `Hit`（index/id/score/source/highlight） |
| **MongoDB 响应** | `MongoDbResponse` | acknowledged/matched/modified/deleted/insertedId/results/totalCount + `insert`/`update`/`delete`/`find` |
| **MyBatis-Plus 分页** | `MyBatisPlusPageResponse` | 适配 `IPage` → 统一分页 + `toDataListInfo()` |
| **PageHelper 分页** | `PageHelperPageResponse` | 适配 `PageInfo` → 统一分页 + `toDataListInfo()` |
| **Actuator 健康** | `ActuatorHealthResponse` | `/health` 响应（status/components）+ `up`/`down`/`isHealthy` |
| **OAuth2 Token** | `OAuth2TokenResponse` | RFC 6749 令牌响应（accessToken/tokenType/expiresIn/refreshToken/scope） |
| **Data REST** | `SpringDataRestResponse` | HAL 链接（embedded/links/page） |
| **RabbitMQ RPC** | `RabbitMqRpcResponse` | correlationId/replyTo/data/properties |
| **Kafka 记录** | `KafkaConsumerRecordResponse` | topic/partition/offset/timestamp/key/value/headers |
| **RocketMQ** | `RocketMqResponse` | msgId/topic/tag/body/sendStatus（`from` 适配 SendResult/MessageExt） |
| **通用分页** | `PageData` | Offset/Limit 分页（records/total/current/size/pages + `hasNext`/`isFirst`/`isLast`） |
| **数据列表** | `DataListInfo` | 简化分页（total/totalPage/list），`empty()`/`of()` |
| **游标分页** | `CursorPageData` | 游标分页（records/nextCursor/hasMore/size），适合 Feed 流/无限滚动 |
| **键集分页** | `KeysetPageData` | 键集分页（records/nextKey/hasMore/size），避免深分页 |

---

## 二、核心设计

### 1. 分页四件套：三种分页策略

- `PageData<T>`：传统 Offset/Limit（`current`/`size`/`pages`），提供 `hasNext`/`hasPrevious`/`isFirst`/`isLast` 便捷判断，并能从 `IPage`/`PageInfo` 转换。
- `CursorPageData<T>`：游标分页（`nextCursor`），基于「上一页最后一条的游标」取下一页，性能优于 offset 深翻页，适合时间线/Feed。
- `KeysetPageData<T>`：键集分页（`nextKey`，如 `WHERE id > lastKey`），性能最优，完全避免深分页。
- `DataListInfo`：最简分页（`total`/`totalPage`/`list`），是框架分页适配器的统一收敛目标。

### 2. 框架分页适配器：统一到 DataListInfo

`MyBatisPlusPageResponse.from(IPage)` 与 `PageHelperPageResponse.from(PageInfo)` 都提供 `toDataListInfo()`，把两大分页框架的差异字段（`records` vs `list`、`current` vs `pageNum`）收敛到统一的 `DataListInfo`，再交给 `ResponseConverter.toDataListInfo(...)` 或 `AjaxResult.success(...)` 输出。

### 3. 数据库/缓存响应：Builder 静态工厂

`RedisResponse`（`get`/`set`/`withTtl`）、`ElasticsearchResponse`（`search`/`withAggregations`，内部 `Hit` 含高亮）、`MongoDbResponse`（`insert`/`update`/`delete`/`find`/`unacknowledged`）都用 Builder 构造，并配套 `exists`/`hasHits`/`hasAggregations`/`isAcknowledged` 等便捷判断。

### 4. 消息队列响应：from 工厂适配

`RabbitMqRpcResponse.of(correlationId, replyTo, data)` 对齐 RPC 模式；`KafkaConsumerRecordResponse.from(ConsumerRecord)` 与 `RocketMqResponse.from(SendResult|MessageExt)` 用 `from` 静态工厂把各 MQ 的原生对象适配成统一 JSON，屏蔽客户端差异。

---

## 三、面试高频问题

**Q1：Offset/Limit、游标（Cursor）、键集（Keyset）三种分页的区别与适用场景？**

- Offset/Limit：`LIMIT offset, size` 简单直观，但 offset 越大数据库要跳过的行越多，深分页性能急剧下降（还有数据变动导致的重复/漏读）。
- 游标（Cursor）：返回「下一页游标」而非页码，服务端按游标定位，适合 Feed 流/无限滚动，需游标可编码/校验。
- 键集（Keyset）：用上一页最后一条的唯一键做 `WHERE id > lastKey ORDER BY id LIMIT size`，走索引、无深分页问题，最适合大数据量列表，但不支持任意跳页。

**Q2：MyBatis-Plus 的 IPage 和 PageHelper 的 PageInfo 如何统一？**

- 二者字段命名不同（`records` vs `list`、`current` vs `pageNum`、`size` vs `pageSize`），模块用两个适配器 `from(...)` 分别抽取，再经 `toDataListInfo()` 收敛到统一的 `DataListInfo`（`total`/`totalPage`/`list`），上层只依赖一种分页结构。

**Q3：Elasticsearch 深分页（from + size）有什么坑？如何规避？**

- `from + size` 上限约 10000（`index.max_result_window`），且深翻页时每个分片都要取 from+size 条再合并，开销大、易 OOM。
- 规避方式：`search_after`（配合唯一排序键，类似键集分页）、`scroll`（快照遍历全量，适合导出）、限制深翻页转导出任务。模块的 `ElasticsearchResponse` 只承载结果结构，不绑定具体查询策略。

---

## 相关

- [response模块总结](/blog/ztools-response-module/) — 上级 MOC
- [核心与工厂包总结](/blog/ztools-response-core-pkg/) — `DataListInfo` 也经 `ResponseConverter`/`ResponseFactory` 复用
- [http与标准协议包总结](/blog/ztools-http-protocol-pkg/) — 同为「适配第三方对象 → 统一结构」的思路
