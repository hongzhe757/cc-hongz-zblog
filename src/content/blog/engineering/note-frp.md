---
title: 'frp内网穿透一键脚本'
description: '记得给使用的端口开放防火墙，开放防火墙，开放防火墙'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["笔记", "技术总结", "proxy"]
category: 'engineering'
---

# step1: 注意事项

```txt
记得给使用的端口开放防火墙，开放防火墙，开放防火墙
```

# step2: 脚本地址

```txt
Frps服务端一键配置脚本地址：https://github.com/MvsCode/frps-onekey
```


# step3: 下载shell

```shell

wget --no-check-certificate https://raw.githubusercontent.com/clangcn/onekey-install-shell/master/frps/install-frps.sh -O ./install-frps.sh

```

# step4: 步骤

```tex
选择源，1是Aliyun，2是Github。我们选1


选择服务端口。默认是5443。这个端口的作用是在客户端连接服务端时是通过这个端口连接的。可以不用修改
设置http连接的端口。默认80，没有被占用就默认
设置https连接的端口。默认443，没有被占用就默认
设置面板的端口。直接用默认端口6443
设置登录面板的用户名和密码,根据个人喜好设置
设置token。客户端需要填写的
设置域名，如果有就填写，没有就默认IP
启动服务（frps start）
http://ip:6443
```
