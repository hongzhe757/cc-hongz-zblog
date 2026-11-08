---
title: 'Centos8.2轻松安装docker'
description: 'sudo yum install -y yum-utils device-mapper-persistent-data lvm2'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["笔记", "技术总结", "linux"]
category: 'engineering'
---

# step 1: 安装一些必要的工具

```shell
sudo yum install -y yum-utils device-mapper-persistent-data lvm2	
```

# step 2: 添加软件源信息

```shell
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

# step 3: 更新 Docker-CE

```shell
sudo yum makecache fast
```


-   错误: `yum makecache: error: argument timer: invalid choice: ‘fast’ (choose from ‘timer’)`
-   问题: ‘索引的时候出错，即centos8没有该参数，解决办法为：去掉fast参数’
-   命令改成: `sudo yum makecache`
-   再次执行: `sudo yum makecache`

# step 4: 安装 Docker-CE

```shell
sudo yum -y install docker-ce
```


-   报错: `Problem: package docker-ce-3:19.03.12-3.el7.x86_64 requires containerd.io >= 1.2.2-3, but none of the providers can be installed`;
-   根据提示，需要containerd.io的版本 >= 1.2.2-3，操作如下：
-   安装wget指令 `yum install wget`;
-   获取rpm包 `wget https://download.docker.com/linux/centos/7/x86_64/edge/Packages/containerd.io-1.2.6-3.3.el7.x86_64.rpm`;
-   升级containerd.io（安装rpm包） `yum -y install containerd.io-1.2.6-3.3.el7.x86_64.rpm`;
-   再次执行 `sudo yum -y install docker-ce`;

# step 5: 开启Docker服务

```shell
sudo service docker start

sudo systemctl start docker
```

# step 6: 安装效验

```shell
docker version

sudo docker ps
```

# step 7: 设置开机自启动

```shell
sudo systemctl enable docker
```

# step 8: 重启生效

```shell
systemctl restart docker.service
```
