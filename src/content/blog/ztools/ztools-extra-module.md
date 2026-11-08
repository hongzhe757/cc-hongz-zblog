---
title: 'extra 模块总结'
description: '是 hutool-extra 的移植镜像，包路径 。共 128 个主类，分 6 层：模板引擎、邮件、远程连接（SSH/FTP）、表达式引擎、拼音与分词、其他工具。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# extra 模块总结（MOC）

> `cc-hongz-ztools-extra` 是 hutool-extra 的移植镜像，包路径 `cc.hongz.ztools.extra`。共 128 个主类，分 6 层：模板引擎、邮件、远程连接（SSH/FTP）、表达式引擎、拼音与分词、其他工具。

---

## 分层

- [template包总结](/blog/ztools-template-pkg/) — 模板引擎（8 引擎 SPI 适配，26 类）
- [mail包总结](/blog/ztools-mail-pkg/) — 邮件发送（javax.mail / jakarta.mail 双实现，11 类）
- [ssh与ftp包总结](/blog/ztools-ssh-ftp-pkg/) — 远程连接（JSch SSH/SFTP + Commons-Net FTP，14 类）
- [expression包总结](/blog/ztools-expression-pkg/) — 表达式引擎（SpEL/Aviator/JEXL/MVEL 等 7 引擎，11 类）
- [pinyin与tokenizer包总结](/blog/ztools-pinyin-tokenizer-pkg/) — 拼音与分词（5 拼音库 + 9 分词库适配，44 类）
- [其他工具包总结](/blog/ztools-misc-tools-pkg/) — 其他工具（qrcode/compress/emoji/cglib/servlet/spring/validation，22 类）

---

## 依赖关系

- 所有包都依赖 [core模块总结](/blog/ztools-core-module/)（StrUtil/IoUtil/FileUtil/CollUtil/Singleton/ServiceLoaderUtil/BeanUtil/Assert/Filter 等）
- [mail包总结](/blog/ztools-mail-pkg/) 依赖 `setting` 模块的 `Setting`（从 `config/mail.setting` 读取账户）
- [template包总结](/blog/ztools-template-pkg/)、[expression包总结](/blog/ztools-expression-pkg/)、[pinyin与tokenizer包总结](/blog/ztools-pinyin-tokenizer-pkg/) 通过 `ServiceLoaderUtil` 做 SPI 自动发现，运行时只加载用户实际引入的引擎 jar（依赖均为 `optional`）
- 底层第三方库（全部 `optional`）：velocity/beetl/freemarker/thymeleaf/rythm/enjoy/wit/jetbrick 等模板引擎、javax.mail/jakarta.mail、jsch/sshj/ganymed、commons-net、zxing、commons-compress、emoji-java、hanlp/jieba/ansj/jcseg/mmseg/ikanalyzer/word/mynlp/lucene-smartcn 等分词库、TinyPinyin/JPinyin/pinyin4j/HoubbPinyin/Bopomofo4j 等拼音库、cglib

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
