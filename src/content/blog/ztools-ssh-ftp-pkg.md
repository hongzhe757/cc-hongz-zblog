---
title: 'ssh 与 ftp 包（远程连接）总结'
description: 'ssh 包（8 类）基于 JSch 实现 SSH/SFTP；ftp 包（6 类）基于 Apache Commons-Net 实现 FTP。共 14 类：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-5.jpg'
---

# ssh 与 ftp 包（远程连接）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-extra/src/main/java/cc/hongz/ztools/extra/ssh` 与 `.../ftp`
>
> 对照基准：hutool 5.8.48（`cn.hutool.extra.ssh` / `cn.hutool.extra.ftp`）

---

## 一、包概览

ssh 包（8 类）基于 JSch 实现 SSH/SFTP；ftp 包（6 类）基于 Apache Commons-Net 实现 FTP。共 14 类：

| 类别 | 类 | 职责 |
|---|---|---|
| **SSH 工具** | `JschUtil` | SSH 会话/通道门面：`getSession`/`openSession`/`openChannel`/`exec`/`bindPort` |
| **会话池** | `JschSessionPool` | 会话复用缓存（`user@host:port` 为 key），`SimpleCache` 实现 |
| **SFTP 客户端** | `Sftp` | 继承 `AbstractFtp`，`upload`/`download`/`ls`/`cd`/`delDir` 等 |
| **连接信息** | `Connector` | 主机/端口/用户/密码/组的简单 POJO |
| **通道类型** | `ChannelType` | SFTP/EXEC/SHELL 枚举 |
| **其他 SSH 实现** | `GanymedUtil` / `SshjSftp` | 基于 ganymed-ssh2 / sshj 的替代实现 |
| **异常** | `JschRuntimeException` | JSch 运行时异常 |
| **FTP 抽象** | `AbstractFtp` | 定义 FTP/SFTP 通用方法模板（cd/pwd/ls/upload/download/递归等） |
| **FTP 客户端** | `Ftp` | 继承 `AbstractFtp`，Commons-Net `FTPClient` 实现 |
| **FTP 配置** | `FtpConfig` | 主机/端口/用户/密码/编码/超时 |
| **模式/服务器** | `FtpMode` / `SimpleFtpServer` | 主动/被动模式枚举；内嵌 FTP 服务器（测试用） |
| **异常** | `FtpException` | FTP 异常 |

---

## 二、核心设计

### 1. AbstractFtp：模板方法统一 FTP 与 SFTP

`AbstractFtp` 定义 `cd`/`pwd`/`ls`/`upload`/`download`/`delFile`/`delDir`/`recursiveDownloadFolder` 等抽象方法，并实现通用逻辑：`toParent()`、`isDir()`（先 cd 再回退）、`exist()`（isDir + ls 判断）、`mkDirs()`（逐级创建）、`download(path, outFile, tempFileSuffix)`（临时文件 + 重命名防半截文件）。`Ftp` 与 `Sftp` 各自实现底层调用，暴露同一套 API。

### 2. JschSessionPool：会话复用

`JschSessionPool.INSTANCE` 用 `SimpleCache<key, Session>` 缓存会话，key 为 `user@host:port`。`getSession()` 先查缓存，若 `Session::isConnected` 为 false 则重新 `openSession`。避免每次操作都重新握手（SSH 握手开销大），也提供 `close`/`closeAll` 清理。

### 3. 端口转发（隧道）

`JschUtil.bindPort`（本地转发 `setPortForwardingL`）和 `bindRemotePort`（远程转发 `setPortForwardingR`）实现 SSH 隧道，`openAndBindPortToLocal` 一键「连 SSH + 绑随机本地端口」。常用于内网穿透、访问远端受限服务。

### 4. 断线重连

`Ftp.reconnectIfTimeout()` 通过 `pwd()` 探测连接是否还活（`client.isConnected()` 在超时后仍返回 true，不可靠），失败则 `init()` 重连。`Sftp` 同样 `cd("/")` 探测后重连。

---

## 三、面试高频问题

**Q1：FTP 主动模式（Active）和被动模式（Passive）的区别？**

- 主动模式：客户端开随机端口，服务器用 20 端口主动连客户端——客户端在 NAT/防火墙后常失败。被动模式：客户端主动连服务器开的数据端口——对 NAT 友好，是默认推荐。`FtpMode` 枚举 + `Ftp.setMode()` 切换，底层对应 `FTPClient.enterLocalActiveMode()/enterLocalPassiveMode()`。

**Q2：SFTP 和 FTP 的区别？**

- FTP 明文传输，SFTP（SSH File Transfer Protocol）走 SSH 加密通道，安全性高但速度慢（加解密开销）。`Sftp` 基于 JSch，`Ftp` 基于 Commons-Net，但都继承 `AbstractFtp` 暴露统一 API。

**Q3：JschSessionPool 为什么缓存 Session？**

- SSH 建立连接要经历 TCP + 密钥协商 + 认证，开销大。会话池按 `user@host:port` 复用已连接会话，把多次文件操作摊到一个连接上；`Session::isConnected` 作为有效性校验，断连时惰性重建。

---

## 相关

- [extra模块总结](/blog/ztools-extra-module/) — 上级 MOC
- [mail包总结](/blog/ztools-mail-pkg/) — 同为远程通信
- [core模块总结](/blog/ztools-core-module/) — 依赖 IoUtil/FileUtil/Assert/Filter/SimpleCache
