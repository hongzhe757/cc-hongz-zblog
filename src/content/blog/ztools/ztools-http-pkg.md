---
title: 'http 包（HTTP 客户端与简易服务器）总结'
description: 'http 包是 hutool 的 HTTP 客户端 + 简易 HTTP 服务器封装，62 个类分 7 组（根包 + 6 子包）：'
pubDate: 'Sep 01, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["ztools", "网络"]
category: 'ztools'
---

# http 包（HTTP 客户端与简易服务器）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-http/src/main/java/cc/hongz/ztools/http`
>
> 对照基准：hutool 5.8.48（`cn.hutool.http`）

---

## 一、包概览

http 包是 hutool 的 **HTTP 客户端 + 简易 HTTP 服务器**封装，62 个类分 7 组（根包 + 6 子包）：

| 类别 | 类 | 职责 |
|---|---|---|
| **门面** | `HttpUtil` | 静态方法发请求：`get/post/upload/download`，一行代码拿结果 |
| **请求/响应** | `HttpRequest` / `HttpResponse` / `HttpBase` | 链式构建请求并同步执行；响应读状态码/头/体；公共基类 |
| **连接与配置** | `HttpConnection` / `HttpConfig` / `HttpGlobalConfig` | 包装 `HttpURLConnection`；请求级/全局超时等配置 |
| **下载** | `HttpDownloader` | GET 下载（支持 30x 跳转、进度条），`downloadString/downloadBytes/downloadFile` |
| **拦截器** | `HttpInterceptor`（含内部 `Chain`）/ `GlobalInterceptor` | 请求前/响应后编辑；全局拦截器单例 |
| **协议元数据** | `Header` / `GlobalHeaders` / `ContentType` / `Method` / `HttpStatus` / `Status` | 头域/全局头/Content-Type/HTTP 方法/状态码常量 |
| **流与资源** | `HttpInputStream` / `MultipartOutputStream` / `HttpResource` | 解析 gzip/chunked 响应流；multipart 输出；自定义 Content-Type 资源 |
| **HTML 处理** | `HtmlUtil` / `HTMLFilter` | HTML 转义/去标签/过滤；XSS 防护 |
| **异常** | `HttpException` | HTTP 运行时异常 |
| **body 子包** | `RequestBody`（接口）/ `BytesBody` / `FormUrlEncodedBody` / `MultipartBody` / `ResourceBody` | 请求体抽象与四种实现 |
| **cookie 子包** | `GlobalCookieManager` / `ThreadLocalCookieStore` | 全局 Cookie 管理器；线程隔离 Cookie 存储 |
| **server 子包** | `SimpleServer` / `HttpServerBase` / `HttpServerRequest` / `HttpServerResponse` / `HttpExchangeWrapper` | 基于 `com.sun.net.httpserver` 的简易服务器 |
| **server.action** | `Action`（接口）/ `RootAction` | 请求处理接口；静态文件/首页默认处理器 |
| **server.filter** | `HttpFilter` / `SimpleFilter` / `ExceptionFilter` / `DefaultExceptionFilter` | 过滤器链；异常处理过滤器 |
| **server.handler** | `ActionHandler` | 把 `Action` 适配为 `HttpHandler` |
| **ssl 子包** | `DefaultSSLInfo` / `DefaultSSLFactory` / `CustomProtocolsSSLFactory` / `AndroidSupportSSLFactory` / `TrustAnyHostnameVerifier` / `SSLSocketFactoryBuilder` | HTTPS 默认信任全部证书、自定义协议、安卓兼容 |
| **useragent 子包** | `UserAgent` / `UserAgentInfo` / `Browser` / `Engine` / `OS` / `Platform` / `UserAgentParser` / `UserAgentUtil` | User-Agent 字符串解析 |
| **webservice 子包** | `SoapClient` / `SoapUtil` / `SoapProtocol` / `SoapRuntimeException` + Jakarta 版三件套 | SOAP WebService 客户端 |

---

## 二、核心设计

### 1. HttpRequest / HttpResponse：链式 Builder + 门面

`HttpRequest` 继承 `HttpBase<T>`（泛型自引用实现链式编程），`HttpUtil.get(url)` 返回 `HttpRequest`，再 `.header().cookie().form().timeout().execute()` 链式配置后同步拿 `HttpResponse`。`HttpRequest` 内部通过 `CookieManager` 持有域名对应 Cookie，再次请求自动附带。`HttpResponse` 提供 `body()/bodyBytes()/status()/header()` 等方法，`contentEncoding()` 识别 gzip/deflate 交给 `HttpInputStream` 解压。

### 2. HttpConnection：HttpURLConnection 的封装

`HttpConnection` 包装 JDK 的 `HttpURLConnection`，统一处理 `openConnection`、代理、HTTPS 的 `SSLSocketFactory`、超时、请求方法设置等。底层仍是 `java.net`，不引入 OkHttp/Apache HttpClient，保持零第三方 HTTP 依赖。

### 3. RequestBody 抽象：四种请求体

`RequestBody` 接口只定义 `write(out)`，四种实现覆盖常见场景：`BytesBody`（编码后的 JSON/XML 字节）、`FormUrlEncodedBody`（`application/x-www-form-urlencoded`，继承 BytesBody）、`MultipartBody`（文件上传，RFC2388，自动生成 boundary）、`ResourceBody`（`Resource` 文件资源）。配合 `MultipartOutputStream` 写出 multipart 流。

### 4. SimpleServer：基于 com.sun.net.httpserver 的简易服务器

`SimpleServer` 包装 JDK 内置 `HttpServer`，`setRoot()` 指定根路径、`addAction()` 注册路径处理、`addFilter()` 注册过滤器、`start()` 启动。请求处理走 `Action` 接口（`RootAction` 解析 path 找静态文件），过滤走 `HttpFilter` → JDK `Filter.Chain`，异常统一由 `ExceptionFilter`/`DefaultExceptionFilter` 兜底。`HttpServerRequest`/`HttpServerResponse` 是对 `HttpExchange` 的封装，`ActionHandler` 把 `Action` 适配成 `HttpHandler`。

### 5. SSL：默认信任全部证书

`DefaultSSLInfo` 单例持有 `TrustAnyHostnameVerifier`（校验返回 true，信任任意主机）与 `DEFAULT_SSF`（默认 `SSLSocketFactory`，区分安卓）。`CustomProtocolsSSLFactory` 支持自定义 TLS 协议列表，`AndroidSupportSSLFactory` 开启安卓低版本缺失的 SSL 协议，`SSLSocketFactoryBuilder` 已弃用指向 core 的 `SSLContextBuilder`。这套设计让 `HttpUtil` 访问自签名 HTTPS 站点时无需额外配置。

### 6. UserAgentParser：正则匹配多维度识别

`UserAgent` 聚合 `Browser`（浏览器）、`Engine`（内核，如 WebKit/Gecko）、`OS`（操作系统）、`Platform`（设备平台，如 iPhone/Android），四者都继承 `UserAgentInfo`（持有 name + 匹配正则，内置 `Unknown` 单例和一组静态实例）。`UserAgentParser.parse()` 按四类正则逐项匹配，返回聚合的 `UserAgent` 对象。

---

## 三、面试高频问题

**Q1：HttpRequest 的链式调用是怎么实现的？**

- `HttpBase<T>` 声明泛型 `<T extends HttpBase<T>>`，`HttpRequest extends HttpBase<HttpRequest>`，所有 setter 方法返回 `T`（即 `this` 的具体类型）。这样 `.header(...).form(...).execute()` 每一步返回的都是 `HttpRequest`，实现类型安全的链式 Builder，避免了子类调用父类方法返回父类类型导致链断的问题。

**Q2：hutool-http 底层用什么发请求？为什么不用 OkHttp？**

- 底层是 JDK 的 `HttpURLConnection`（经 `HttpConnection` 封装），零第三方 HTTP 依赖。好处是体积小、无额外依赖、跨平台；代价是性能与功能不如 OkHttp/Apache HttpClient（如连接复用、HTTP/2 支持弱）。适合轻量、工具类场景，重并发场景建议换专业客户端。

**Q3：gzip 响应是怎么自动解压的？**

- `HttpResponse.contentEncoding()` 读响应头 `Content-Encoding`，若是 gzip/deflate，则返回的流包装为 `GZIPInputStream`/`InflaterInputStream`；`HttpInputStream` 还处理 chunked 分段传输。因此 `body()` 拿到的是已经解压后的原文，调用方无需关心传输编码。

**Q4：访问自签名 HTTPS 站点为什么会信任所有证书？**

- `DefaultSSLInfo` 默认使用 `TrustAnyHostnameVerifier`（`verify()` 恒返回 true）和信任所有证书的 `SSLSocketFactory`，把 `HttpsURLConnection` 的 `hostnameVerifier` 和 `sslSocketFactory` 覆盖掉。这方便工具类/测试场景直接访问自签名站点，但生产环境有中间人攻击风险，应自行替换为真实证书校验。

**Q5：SimpleServer 和 HttpUtil 的关系是什么？**

- 两者互补：`HttpUtil` 是**客户端**（发请求），`SimpleServer` 是**服务端**（收请求）。服务端基于 JDK 内置 `com.sun.net.httpserver.HttpServer`，通过 `Action` + `Filter` 组织处理逻辑，适合嵌入式、Mock、静态文件服务等轻量场景，不是生产级 Web 容器。

---

## 相关

- [http模块总结](/blog/ztools-http-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [net包总结](/blog/ztools-net-pkg/) — `SSLContextBuilder`/`URLUtil` 来源
- [io包总结](/blog/ztools-io-pkg/) — `IoUtil`/`Resource`/`StreamProgress` 来源
- [socket模块总结](/blog/ztools-socket-module/) — 姊妹网络通信模块
