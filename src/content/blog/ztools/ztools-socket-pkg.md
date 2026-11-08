---
title: 'socket 包（Socket 通信封装）总结'
description: 'socket 包是 JDK NIO/AIO Socket 通信的轻量封装，20 个类分 4 组：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "网络"]
category: 'ztools'
---

# socket 包（Socket 通信封装）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-socket/src/main/java/cc/hongz/ztools/socket`
>
> 对照基准：hutool 5.8.48（`cn.hutool.socket`）

---

## 一、包概览

socket 包是 JDK **NIO/AIO Socket 通信**的轻量封装，20 个类分 4 组：

| 类别 | 类 | 职责 |
|---|---|---|
| **根包工具** | `SocketUtil` / `ChannelUtil` | 远程地址/连接状态判断；`AsynchronousChannelGroup` 创建与连接 |
| **配置/异常** | `SocketConfig` / `SocketRuntimeException` | 线程池大小、读写超时、缓存大小；Socket 异常 |
| **aio 子包** | `AioServer` / `AioClient` / `AioSession` / `IoAction`（接口）/ `SimpleIoAction` / `AcceptHandler` / `ReadHandler` | 基于 AIO（`AsynchronousSocketChannel`）的服务端/客户端/会话 |
| **nio 子包** | `NioServer` / `NioClient` / `NioUtil` / `ChannelHandler`（接口）/ `AcceptHandler` / `Operation` | 基于 NIO（`Selector` + `SocketChannel`）的服务端/客户端 |
| **protocol 子包** | `Protocol`（接口）/ `MsgEncoder`（接口）/ `MsgDecoder`（接口） | 消息编解码协议抽象 |

---

## 二、核心设计

### 1. AIO：异步非阻塞 + 回调

AIO 基于 JDK `AsynchronousSocketChannel`，事件驱动：

- `AioServer` 构造后 `setIoAction()` 绑定处理逻辑，`accept()` 监听接入；`AcceptHandler`（单例）实现 `CompletionHandler`，接入完成时回调建立 `AioSession` 并继续 accept。
- `AioSession` 代表一个客户端连接，`read()` 触发异步读，`ReadHandler`（单例）读完成时回调 `IoAction.doAction(session, data)`；`write()` 异步写出。
- `IoAction<T>` 是业务处理接口（`accept`/`doAction`/`failed`），`SimpleIoAction` 提供空实现省去无关方法。
- `ChannelUtil.createFixedGroup(poolSize)` 创建共享 `AsynchronousChannelGroup`，复用线程池处理所有连接。

### 2. NIO：同步非阻塞 + Selector

NIO 基于 `Selector` 多路复用：`NioServer` 打开 `ServerSocketChannel` 并注册 `OP_ACCEPT` 到 `Selector`，单线程 `select()` 轮询就绪事件；`NioClient` 打开 `SocketChannel` 连接并读写。`NioUtil.registerChannel()` 把通道的指定操作注册到 Selector，`Operation` 枚举封装 `SelectionKey.OP_READ/OP_WRITE/OP_CONNECT/OP_ACCEPT`。业务侧实现 `ChannelHandler`（`handle(SocketChannel)`）完成收发。

### 3. Protocol：编解码协议抽象

`Protocol<T>` 同时继承 `MsgEncoder<T>`（编码写出）和 `MsgDecoder<T>`（解码读取），是「消息 ↔ 字节」的边界。`MsgDecoder.decode(session, readBuffer)` 返回 `null` 表示解码未完成（半包，继续累积），返回对象表示一个完整业务消息；`MsgEncoder.encode` 把业务对象写入写出缓冲。AIO 会话持有 `Protocol` 与 `IoAction` 组合：读字节 → 解码 → 交给 `IoAction`，编码后写出。

---

## 三、面试高频问题

**Q1：BIO、NIO、AIO 三者的区别？**

- **BIO**（阻塞 IO）：一个连接一个线程，`read/write` 阻塞，实现简单但线程开销大、并发受限。
- **NIO**（同步非阻塞）：`Selector` 单线程多路复用，就绪才读写，`Channel + Buffer` 面向缓冲，适合连接多但请求短小的场景。
- **AIO**（异步非阻塞）：操作系统完成后回调（`CompletionHandler`），代码无需轮询，适合高并发长连接。hutool 同时提供 `NioServer/NioClient` 和 `AioServer/AioClient` 两套。

**Q2：TCP 粘包/拆包怎么解决？**

- TCP 是字节流，没有消息边界，会出现粘包（多条消息粘一起）和拆包（一条消息分多次到达）。hutool 的 `MsgDecoder.decode()` 返回 `null` 表示「数据不够、未解码完成」，会话会继续累积缓冲，直到凑齐一个完整消息才返回对象——用「长度字段/分隔符」等协议约定做半包处理，业务只需实现 `decode` 判断是否完整。

**Q3：AIO 的回调是什么模式？怎么复用线程池？**

- AIO 用 `CompletionHandler.completed()/failed()` 回调，`AcceptHandler` 和 `ReadHandler` 都做成**单例**（无状态）。`ChannelUtil.createFixedGroup(poolSize)` 创建共享 `AsynchronousChannelGroup`，所有 `AsynchronousSocketChannel` 注册到同一线程池，`SocketConfig.threadPoolSize` 控制池大小，避免每个连接都新建线程。

**Q4：NIO 的 Selector 为什么比 BIO 能扛更多连接？**

- BIO 每连接一线程，连接数上万时线程栈内存（默认每线程约 1MB）和上下文切换开销爆炸。Selector 用一个线程同时监听成千上万个通道，只有「就绪」的通道才被处理，线程数不再与连接数成正比，故高并发下 NIO 更省资源。

---

## 相关

- [socket模块总结](/blog/ztools-socket-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [http模块总结](/blog/ztools-http-module/) — 姊妹网络通信模块
- [io包总结](/blog/ztools-io-pkg/) — `IoUtil`/`BufferUtil` 来源
