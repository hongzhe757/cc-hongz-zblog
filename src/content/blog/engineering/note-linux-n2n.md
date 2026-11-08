---
title: 'linux-n2n内网穿透'
description: '我已经打包好，直接下载即可：'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["笔记", "技术总结", "proxy"]
category: 'engineering'
---

# step1: 下载

```txt
我已经打包好，直接下载即可：

[https://files.cnblogs.com/files/HD/n2n.7z](https://files.cnblogs.com/files/HD/n2n.7z)

此包包括了linux、windows、android的n2n所有，就不用大家一个个去下载找了。
```



# step2: 准备

需要准备一台服务器(有固定IP的vps之类的)，可以是windows也可以是linux，比如我这里的是：111.111.111.111

# step3: 服务器安装

## linux

解压n2n.7z，里头有一个n2n_linux.tar.gz文件，上传到服务器中，解压

```tex
tar -zvxf n2n_linux.tar.gz
```

进入n2n_linux目录，再进去n2n_v2目录（这里我使用的是v2新版本）

```tex
make && make install
```

将会看到如下安装完的信息：

```tex
echo MANDIR=/usr/share/man

MANDIR=/usr/share/man

mkdir -p /usr/sbin /usr/share/man/man1 /usr/share/man/man7 /usr/share/man/man8

install `-m755 supernode /usr/sbin/

install -m755 edge /usr/sbin/

install -m644 edge.8.gz /usr/share/man/man8/

install -m644 supernode.1.gz /usr/share/man/man1/

install -m644 n2n_v2.7.gz /usr/share/man/man7/
```

可以看到supernode安装在/usr/sbin/目录下。现在可以直接启动supernode了：

```tex
/usr/sbin/supernode -l 6666
```

-l 6666，意思是使用6666端口开启supernode

## windows

windows最简单，解压n2n.7z，里头目录n2n_win下有一个supernode.exe文件，打开cmd，输入：

```tex
/usr/sbin/supernode -l 6666
```

-l 6666，意思是使用6666端口开启supernode

# step4: 客户端安装

## windows

在n2n_win文件夹下有一个tapinstall.exe文件，这个文件需要以管理员权限运行（怎么设置就不说了），设置完后，双击运行install.bat，安装tap adapter驱动。其实bat就是一句命令安装：

```txt
tapinstall.exe  install OemWin2k.inf tap0901
```

安装完驱动后，使用管理员权限打开cmd，cd到n2n_win目录，运行命令：

```tex
edge2 -a 10.0.1.2 -c mynetwork -k password -l 111.111.111.111:6666
```

将看到如我类似的信息表似已经开启了这台客户端机子：

![](http://img.hongzhe.work/i/2022/12/05/zeu5ob-0.png)

## linux

与服务器安装一模一样，安装完后，只是启动命令不是supernode，而是edge：

```
/usr/sbin/edge` `-a 10.0.1.1 -c mynetwork -k password -l 111.111.111.111:6666
```



## Android

安装n2n.apk文件然后设置就可以了，怎么设置太简单了，这里就不说了。不过android要运行n2n，手机设置必需要root权限。

# step5: 测试

已经安装好了，我们测试下连通性如何。

在linux上ping下windows客户端：

![](http://img.hongzhe.work/i/2022/12/05/zf0e20-0.png)

明显看到第一次ping返回时间需要比较久，后而就很快。原因就是上页说的，第一次需要先连上supernode服务器打洞，然后服务器再把两台机子对联起来成p2p。

在windows上ping linux客户端

![](http://img.hongzhe.work/i/2022/12/05/zfdbmf-0.png)

# step6: 最后说明

- n2n使用的是UDP协议，如果两台机子在几分钟内没有数据交互，udp会自动断开连接，所以下一次连接时又会花费打洞时间。

- 本程序在win10中每次重启都需要先运行install.bat安装驱动，好像win10不会加到自动加载启动中。win7正常。目前程序只支持64位windows系统。
