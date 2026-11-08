---
title: '缓存与分布式锁方案横向对比'
description: '场景：缓存（读多写少、热点数据、加速访问）+ 分布式锁（并发互斥、防重复、幂等）在分布式系统的技术选型。'
pubDate: 'Sep 05, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "缓存任务"]
category: 'ztools'
---

# 缓存与分布式锁方案横向对比

> 场景：缓存（读多写少、热点数据、加速访问）+ 分布式锁（并发互斥、防重复、幂等）在分布式系统的技术选型。
> 当前项目基线：`spring-boot-starter-data-redis` + `jedis`（见 `cc-hongz-springboot-redis-cache-test` / `redis-lock-test`）。

---

## 一、缓存方案（除 Redis）

### 1.1 本地缓存（进程内，单机）

| 方案 | 淘汰算法 | 优点 | 缺点 | 适用 |
|---|---|---|---|---|
| **Caffeine** | W-TinyLFU | 近乎最优命中率；Spring Boot 默认缓存实现；功能全（过期/刷新/容量/统计/异步） | 仅单机，不跨实例共享 | 单机热点、Spring `@Cacheable` 首选 |
| **Guava Cache** | LRU | Google 出品、API 简单、历史项目多见 | 已进入维护模式，被 Caffeine 取代 | 老项目兼容 |
| **Ehcache** | LRU/LFU | 支持堆内+堆外+磁盘三级；兼容 JCache(JSR-107) | 性能一般，配置偏重 | 需要落盘/堆外的大对象缓存 |
| **ConcurrentHashMap** | 无（手动） | 零依赖、最快 | 无过期/淘汰，需自己实现 TTL | 极简、生命周期随 JVM 的场景 |

### 1.2 分布式缓存（跨实例共享）

| 方案 | 数据结构 | 优点 | 缺点 | 适用 |
|---|---|---|---|---|
| **Redis** | String/Hash/List/Set/ZSet/Stream… | 生态最全（Redisson/Lettuce/Jedis）；支持持久化 RDB/AOF；单线程模型简单且吞吐高；可做缓存/锁/队列/计数 | 内存成本高；跨网络有开销；纯内存大 key 有风险 | **主流默认选择** |
| **Memcached** | 仅 KV(String) | 极简、多线程、稳定 | 数据结构单一；无持久化；key 不能过 250B | 只需要纯 KV 缓存 |
| **Hazelcast** | 分布式 Map/Queue/Topic | Java 原生、可嵌入 JVM、无外部依赖 | 内存占用大；与 Redis 比生态弱 | 纯 Java 微服务内嵌数据网格 |
| **Apache Ignite** | 内存数据网格 + SQL | 支持 SQL/事务/持久化 | 重、学习成本高 | 需要内存计算 + 缓存的场景 |

### 1.3 多级缓存

- **本地（Caffeine）+ 分布式（Redis）** 组合：一级本地扛热点、二级 Redis 共享，减少网络往返，解决缓存击穿/雪崩常用手段。
- 代价：两级一致性难保证，需要失效策略（主动删 + TTL 兜底）。

---

## 二、分布式锁方案（除 Redis）

| 方案 | 实现 | 优点 | 缺点 | 适用 |
|---|---|---|---|---|
| **Redis + SETNX** | `SET key val NX PX` 原子加锁 | 极简、性能最高、生态广 | 锁过期时间难定（业务 > 锁 TTL 会失效）；非阻塞等待要自旋 | 短临界区、对强一致要求不高的锁 |
| **Redis + Redisson** | 看门狗自动续期、可重入、公平锁/读写锁/红锁 | 成熟、续期解决过期问题、API 丰富 | 依赖 Redis 可用性；RedLock 有争议（时钟漂移） | 主流 Redis 分布式锁首选 |
| **ZooKeeper（Curator）** | 临时顺序节点 + Watch | 强一致、可靠（节点随会话自动释放） | 性能较低（每次加锁创建节点 + 心跳）；依赖 ZK 集群 | 对一致性要求高、锁竞争不激烈的场景 |
| **etcd** | Lease 租约 + Txn 事务 | 强一致（Raft）、租约自动续期 | 性能一般、吞吐低 | 云原生、需要强一致锁 |
| **数据库（MySQL）** | 唯一索引 / `SELECT … FOR UPDATE` / 版本号乐观锁 | 无额外组件、简单 | 性能低；异常时锁残留；DB 成为瓶颈 | 已有 DB、锁频率极低、兜底场景 |

---

## 三、横向对比总结

### 3.1 缓存选型速查

| 维度 | Caffeine | Redis | Memcached | Ehcache |
|---|---|---|---|---|
| 性能 | ★★★★★（内存） | ★★★★（跨网络） | ★★★★ | ★★★ |
| 跨实例共享 | ✗ | ✓ | ✓ | ✗ |
| 数据结构 | Map | 丰富 | 仅 KV | Map |
| 持久化 | ✗ | ✓ | ✗ | 可选磁盘 |
| 生态/维护 | 活跃 | 最全 | 稳定但保守 | 一般 |
| 推荐度 | 单机首选 | 分布式首选 | 纯 KV 备选 | 特殊场景 |

### 3.2 分布式锁选型速查

| 维度 | Redis(SETNX) | Redisson | ZooKeeper | etcd | MySQL |
|---|---|---|---|---|---|
| 性能 | ★★★★★ | ★★★★ | ★★ | ★★ | ★ |
| 一致性/可靠性 | ★★★ | ★★★★ | ★★★★★ | ★★★★★ | ★★★ |
| 自动续期 | ✗ | ✓ | ✓(会话) | ✓(租约) | ✗ |
| 复杂度 | 低 | 低 | 中 | 中 | 低 |
| 额外组件 | Redis | Redis | ZK 集群 | etcd 集群 | 无 |
| 推荐度 | 简单场景 | **主流首选** | 强一致场景 | 云原生 | 兜底 |

---

## 四、选型建议

1. **缓存**：
   - 单机/单服务热点 → **Caffeine**（配合 Spring `@Cacheable`）。
   - 分布式共享 → **Redis**（主流，生态全）。
   - 高频热点 + 分布式 → **Caffeine + Redis 两级**。

2. **分布式锁**：
   - 默认 → **Redisson**（续期 + 可重入 + API 全，覆盖绝大多数场景）。
   - 简单短锁 → **Redis SETNX PX**（够用）。
   - 强一致、金融/任务互斥 → **ZooKeeper**（或 etcd）。
   - 无额外组件、锁频率极低 → **MySQL** 兜底。

3. **原则**：能本地不分布式（性能）；能 Redis 不引入新组件（成本）；锁尽量短、务必有过期兜底。

---

## 相关

- [cache模块总结](/blog/ztools-cache-module/) — ztools 本地缓存（FIFO/LFU/LRU/Timed/Weak）实现
- [cache包总结](/blog/ztools-cache-pkg/) — hutool-cache 移植的包级总结
