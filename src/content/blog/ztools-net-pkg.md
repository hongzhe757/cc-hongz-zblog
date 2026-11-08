---
title: 'net 包（网络工具）总结'
description: 'net 包封装网络相关操作：IP/端口、URL 编解码、SSL、表单/上传等：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "网络"]
---

# net 包（网络工具）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/net`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.net`）

---

## 一、包概览

net 包封装**网络相关**操作：IP/端口、URL 编解码、SSL、表单/上传等：

| 类别 | 类 | 职责 |
|---|---|---|
| **网络工具** | `NetUtil` | 本机 IP/MAC、端口探测、ping、socket 读写、DNS 等 |
| **IP** | `Ipv4Util` | IPv4 地址与 long 互转、掩码计算 |
| **URL 编解码** | `URLEncoder` / `URLDecoder` / `URLEncodeUtil` | URL 百分号编码/解码（区分表单/URI 编码） |
| **URL 构建** | `UrlBuilder` / `UrlPath` / `UrlQuery` | URL 拼接、路径、query 参数 |
| **SSL** | `SSLUtil` / `SSLContextBuilder` / `DefaultTrustManager` / `SSLProtocols` | SSL 上下文、信任所有证书（测试用）、协议 |
| **认证** | `PassAuth` / `UserPassAuthenticator` | 代理认证、Basic 认证 |
| **表单/上传** | `FormUrlencoded` / multipart 子包 | form-urlencoded 编解码；multipart 表单解析与文件上传 |
| **端口** | `LocalPortGenerator` / `LocalPortGenerater` | 本地可用端口生成 |
| **其他** | `RFC3986` / `MaskBit` / `ProxySocketFactory` | RFC 规范常量、掩码位、代理 socket |

---

## 二、核心设计

### 1. URL 编码的两类标准

`URLEncoder`/`URLDecoder` 按 `application/x-www-form-urlencoded`（表单）；`URLEncodeUtil` 按 RFC 3986 区分「路径段」与「query」编码（空格在路径里编码为 `%20`，query 里可为 `+`）。`RFC3986` 定义保留字符等常量。

### 2. Ipv4Util：IP 与整数互转

IPv4 是 32 位，天然可用一个 `int`/`long` 表示。`ipv4ToLong`/`longToIpv4` 互转，掩码、网段判断用位运算，方便存储与区间判断。

### 3. SSL 信任所有证书

`DefaultTrustManager` 信任所有证书（不校验），`SSLContextBuilder` 构建相应 SSLContext。**只用于测试/内网**，生产不可用（有中间人攻击风险）。

### 4. multipart 表单解析

multipart 子包解析 `multipart/form-data` 请求体：`MultipartRequestInputStream` 按 boundary 切分，`UploadFile`/`UploadFileHeader` 封装文件与头信息，支持文件上传。

---

## 三、面试高频问题

**Q1：URL 编码里空格为什么有的 `%20` 有的 `+`？**

- 两种标准：query 字符串（`application/x-www-form-urlencoded`）空格编码为 `+`；RFC 3986 路径段空格编码为 `%20`。混用会导致解析错误。

**Q2：IPv4 为什么能转成 long？**

- IPv4 是 32 位地址（4 段每段 8 位），正好一个 int。转整数后便于存储、排序、做网段范围判断（位运算）。

**Q3：为什么生产环境不能用信任所有证书的 TrustManager？**

- 它跳过证书校验，攻击者可伪造证书进行中间人攻击。仅限测试/内网联调。

**Q4：form-urlencoded 和 multipart/form-data 的区别？**

- form-urlencoded 把参数拼接成 `key=value&key=value` 字符串，适合文本小数据；multipart 用 boundary 分隔多个 part，适合文件上传（二进制、大体积）。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 获取本机 IP/MAC | `NetUtil` |
| 探测端口是否占用 | `NetUtil.isUsableLocalPort` |
| URL 参数编码 | `URLEncodeUtil` / `URLEncoder` |
| 拼接 URL（带参数） | `UrlBuilder` |
| 文件上传解析 | multipart 子包 |
| 内网测试跳过证书校验 | `DefaultTrustManager` / `SSLUtil` |
| 生成可用端口 | `LocalPortGenerator` |

---

## 五、当前状态

- **文件**：17 个顶层类 + multipart/url 子包，与 hutool 5.8.47 对齐。
- **单元测试**：18 个测试类，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。

---

## 相关

- [io包总结](/blog/ztools-io-pkg/)
- [util包总结](/blog/ztools-util-pkg/)
