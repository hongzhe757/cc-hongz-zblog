---
title: 'mail 包（邮件发送）总结'
description: 'mail 包封装 SMTP 邮件发送（11 类），基于 JavaMail，兼容 javax.mail 与 jakarta.mail 两套命名空间：'
pubDate: 'Aug 31, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "网络", "框架"]
category: 'ztools'
---

# mail 包（邮件发送）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-extra/src/main/java/cc/hongz/ztools/extra/mail`
>
> 对照基准：hutool 5.8.48（`cn.hutool.extra.mail`）

---

## 一、包概览

mail 包封装 **SMTP 邮件发送**（11 类），基于 JavaMail，兼容 javax.mail 与 jakarta.mail 两套命名空间：

| 类别 | 类 | 职责 |
|---|---|---|
| **统一入口** | `MailUtil` | 门面：`sendText`/`sendHtml`/`send` 静态方法，支持附件、内嵌图片 |
| **邮件客户端** | `Mail` | Builder 模式的 MimeMessage 构建器：`setTos`/`setCcs`/`setBccs`/`setFiles`/`addImage`/`send` |
| **账户配置** | `MailAccount` | SMTP 账户：host/port/user/pass/SSL/STARTTLS/超时等，`getSmtpProps()` 生成 Properties |
| **全局账户** | `GlobalMailAccount` | 单例，从 `config/mail.setting` 读默认账户 |
| **地址工具** | `InternalMailUtil` | 解析/编码邮件地址（中文字段名编码） |
| **认证器** | `UserPassAuthenticator` | javax.mail 的用户名密码 Authenticator |
| **异常** | `MailException` | 邮件发送异常 |
| **Jakarta 系列** | `JakartaMail`/`JakartaMailUtil`/`JakartaInternalMailUtil`/`JakartaUserPassAuthenticator` | jakarta.mail 命名空间镜像（Servlet 6 / Spring Boot 3 环境） |

---

## 二、核心设计

### 1. Mail：Builder 模式构建 MimeMessage

`Mail` 实现 `Builder<MimeMessage>`，用链式 setter 设置收件人/抄送/密送/标题/正文/附件，`buildMsg()` 内部用 `MimeMessage` + `MimeMultipart` 拼出完整邮件（正文为第一个 BodyPart，附件随后）。`send()` 通过 `Transport.send()` 发出并返回 message-id。

### 2. MailAccount 的默认值推断

`defaultIfEmpty()` 在 host 为空时自动推断为 `smtp.邮箱后缀`，user 为空时取发件人，auth 为空时按「是否配置密码」决定，port 为空时按 SSL 与否取 465/25，charset 默认 UTF-8。极大简化了常见邮箱（QQ/163）的配置。

### 3. javax / jakarta 双实现

Java 生态邮件 API 从 `javax.mail` 迁移到 `jakarta.mail`（EE 9+）。hutool 保留两套类：默认 `Mail`/`MailUtil` 走 javax.mail（兼容老 Servlet 容器），`Jakarta*` 系列走 jakarta.mail（适配 Spring Boot 3 / Tomcat 10+）。两者逻辑一致，仅 import 命名空间不同。

### 4. 全局账户 + 配置驱动

`GlobalMailAccount.INSTANCE` 依次尝试 `config/mail.setting`、`config/mailAccount.setting`、`mail.setting` 三个路径，用 `Setting.toBean()` 把配置文件反射成 `MailAccount`，实现「改配置不改代码」的账户管理。

---

## 三、面试高频问题

**Q1：邮件附件和内嵌图片怎么区分？**

- 都在 `MimeMultipart` 里，区别在 `MimeBodyPart` 的 `Content-Disposition` 与 `ContentID`：附件设 `setFileName`，内嵌图片设 `setContentID` + `Disposition.INLINE`，正文里用 `cid:xxx` 引用。`Mail.addImage(cid, stream)` 即封装了内嵌图片。

**Q2：STARTTLS 和 SSL 有什么区别？**

- SSL（SMTPS）用独立加密端口（465），全程加密；STARTTLS 用普通端口（25/587）先明文握手，再升级为 TLS 加密。`MailAccount` 的 `starttlsEnable`/`sslEnable` 分别控制，`getSmtpProps()` 转成 `mail.smtp.starttls.enable`/`mail.smtp.ssl.enable`。

**Q3：为什么要同时提供 javax 和 jakarta 两套邮件类？**

- javax.mail 归属 Java EE，EE 9 之后迁移到 jakarta.mail（包名 `jakarta.mail.*`）。老项目（Tomcat 8/9、Spring Boot 2）用 javax，新项目（Tomcat 10+、Spring Boot 3）用 jakarta。双实现让同一套工具在两类环境都能编译运行。

---

## 相关

- [extra模块总结](/blog/ztools-extra-module/) — 上级 MOC
- [ssh与ftp包总结](/blog/ztools-ssh-ftp-pkg/) — 同为「远程通信」工具
- [core模块总结](/blog/ztools-core-module/) — 依赖 StrUtil/CollUtil/IoUtil
