---
title: '搭建v2ray'
description: '将以下命令复制到你已连接的服务器命令行中，然后就是一步一步下一步'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["笔记", "技术总结", "proxy"]
category: 'engineering'
---

# step 1: 系统要求

> CentOS 6+ 或者 Debian 6+ 或者 Ubuntu 14.04+（包含最新的ubuntu18、ubuntu19） 注: 我们通常使用ubuntu16或者18，下文将以ubuntu18为例

# step 2: 购买非中国大陆服务器


## 一键安装

将以下命令复制到你已连接的服务器命令行中，然后就是一步一步下一步

``` shell

bash <(curl -s -L https://git.io/v2ray.sh)

bash <(curl -sL https://raw.githubusercontent.com/daveleung/hijkpw-scripts-mod/main/xray_mod1.sh)

```

选择1，按回车

```
 1. 安装
 2. 卸载
请选择 [1-2]:1
```

用默认的tcp就行，直接回车

```
请选择 V2Ray 传输协议 [1-32]
  1. TCP
  2. TCP_HTTP
  3. WebSocket
  4. WebSocket + TLS
  5. HTTP/2
  6. mKCP
  7. mKCP_utp
  8. mKCP_srtp
  9. mKCP_wechat-video
 10. mKCP_dtls
 11. mKCP_wireguard
 12. QUIC
 13. QUIC_utp
 14. QUIC_srtp
 15. QUIC_wechat-video
 16. QUIC_dtls
 17. QUIC_wireguard
 18. TCP_dynamicPort
 19. TCP_HTTP_dynamicPort
 20. WebSocket_dynamicPort
 21. mKCP_dynamicPort
 22. mKCP_utp_dynamicPort
 23. mKCP_srtp_dynamicPort
 24. mKCP_wechat-video_dynamicPort
 25. mKCP_dtls_dynamicPort
 26. mKCP_wireguard_dynamicPort
 27. QUIC_dynamicPort
 28. QUIC_utp_dynamicPort
 29. QUIC_srtp_dynamicPort
 30. QUIC_wechat-video_dynamicPort
 31. QUIC_dtls_dynamicPort
 32. QUIC_wireguard_dynamicPort
备注1: 含有 [dynamicPort] 的即启用动态端口..
备注2: [utp | srtp | wechat-video | dtls | wireguard] 分别伪装成 [BT下载 | 视频通话 | 微信视频通话 | DTLS 1.2 数据包 | WireGuard 数据包]
(默认协议: TCP):
```

端口随便写一个，范围1025到65535，也可以选择默认，直接回车

```
请输入 V2Ray 端口 [1-65535]
(默认端口: 47283):
```

这个也不知道真影响假影响，姑且相信他，使用默认，直接回车

```
是否开启广告拦截(会影响性能) [Y/N]
(默认 [N]):
```

是不是顺便把ss服务也装了，这个就随便你了，我感觉用了v2ray也没必要再搭ss，毕竟s's很容易被封，所以保持默认，回车

```
是否配置 Shadowsocks [Y/N]
(默认 [N]):
```

会让你确认一下信息，确认无误，按回车

```
---------- 安装信息 -------------
 V2Ray 传输协议 = TCP
 V2Ray 端口 = 47283
 是否配置 Shadowsocks = 未配置
---------- END -------------
按 Enter 回车键 继续....或按 Ctrl + C 取消.
```

然后，就是等...

如果中间出现这些图片，就回车就好了。

![](http://img.hongzhe.work/i/2022/12/05/zlkl0c-0.png)

```
---------- V2Ray 配置信息 -------------
 地址 (Address) = 152.89.208.146
 端口 (Port) = 47283
 用户ID (User ID / UUID) = ed0b4117-0f5a-41e9-a732-96bdaf343d23
 额外ID (Alter Id) = 233
 传输协议 (Network) = tcp
 伪装类型 (header type) = none
---------- END -------------
```

也可以通过命令`v2ray url` 和 `v2ray qr` 获取v2ray url和v2ray QRCode

```
root@ONEVPS190911085532:~# v2ray url
---------- V2Ray vmess URL / V2RayNG v0.4.1+ / V2RayN v2.1+ / 仅适合部分客户端 -------------
vmess://ewoidiI6ICIyIiwKInBzIjogIjIzM3YyLmNvbV8xNTIuODkuMjA4LjE0NiIsCiJhZGQiOiAiMTUyLjg5LjIwOC4xNDYiLAoicG9ydCI6ICI0NzI4MyIsCiJpZCI6ICJlZDBiNDExNy0wZjVhLTQxZTktYTczMi05NmJkYWYzNDNkMjMiLAoiYWlkIjogIjIzMyIsCiJuZXQiOiAidGNwIiwKInR5cGUiOiAibm9uZSIsCiJob3N0IjogIiIsCiJwYXRoIjogIiIsCiJ0bHMiOiAiIgp9Cg==
root@ONEVPS190911085532:~# v2ray qr
---------- V2Ray 二维码链接 适用于 V2RayNG v0.4.1+ / Kitsunebi -------------
https://233boy.github.io/tools/qr.html#vmess://ewoidiI6ICIyIiwKInBzIjogIjIzM3YyLmNvbV8xNTIuODkuMjA4LjE0NiIsCiJhZGQiOiAiMTUyLjg5LjIwOC4xNDYiLAoicG9ydCI6ICI0NzI4MyIsCiJpZCI6ICJlZDBiNDExNy0wZjVhLTQxZTktYTczMi05NmJkYWYzNDNkMjMiLAoiYWlkIjogIjIzMyIsCiJuZXQiOiAidGNwIiwKInR5cGUiOiAibm9uZSIsCiJob3N0IjogIiIsCiJwYXRoIjogIiIsCiJ0bHMiOiAiIgp9Cg==
 友情提醒: 请务必核对扫码结果 (V2RayNG 除外)
```

## 客户端配置

-   windows: `https://github.com/v2ray/v2ray-core/releases` 然后选择 v2ray-windows-64.zip 下载，如果你的系统是 32 位的那就选择 v2ray-windows-32.zip。 下载完成，解压。 打开解压出来的文件夹 (例如 v2ray-xxxx-windows-64，xxxx为版本号)
-   mac os: `https://github.com/Cenmrev/V2RayX/releases`
-   ios: `https://free.shadowrocket.online`
-   Android: `https://www.geekersq.cc/v2ray/v2rayNG_v0.6.19.apk`

下载一个v2ray的软件，我以Mac上的软件为例：

![](http://img.hongzhe.work/i/2022/12/05/zm1300-0.png)

复制粘贴到对应位置，点击OK

![](http://img.hongzhe.work/i/2022/12/05/zm51t6-0.png)

选择刚刚配置的服务

![](http://img.hongzhe.work/i/2022/12/05/zn19xv-0.png)
