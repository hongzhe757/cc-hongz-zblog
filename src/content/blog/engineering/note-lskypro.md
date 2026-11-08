---
title: '搭建lskypro兰空图床'
description: 'server {'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["笔记", "技术总结", "docker"]
category: 'engineering'
---

# step1: 首先准备一个 nginx 的 default 文件

```nginx
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /var/www/html/public;
        index index.html index.php index.nginx-debian.html;
        server_name _;
        location / {
        if (!-e $request_filename) {
        rewrite ^(.*)$ /index.php?s=$1 last; break;
        }
        }
        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
                fastcgi_pass unix:/var/run/php/php7.2-fpm.sock;
        }
}
```

# step2:  docker 拉取 ubuntu18.04 镜像

```shell
docker pull ubuntu:18.04
```

# step3:  设计 docker 需要挂载的文件夹

```tex
###nginx的配置文件，对应的docker容器内的nginx配置文件
/lskypro/nginx/default >>/default

###对应docker里的网页文件夹
/lskypro/www >>>/var/www/html
###对应SSL证书文件
/lskpro/ssl >>>/ssl

设计好映射之后，创建文件夹

mkdir /lskypro/nginx -p
mkdir /lskypro/www
mkdir /lskypro/ssl
```

# step4: 准备需要的文件

## 进入网页目录

```shell
cd /lskypro/www 
```

## 下载安装文件

```shell
git clone -b master https://github.com/wisp-x/lsky-pro.git 
```

## 移动文件

```shell
mv lsky-pro/* ./ 
```

## 创建nginx配置文件

```shell
vi /lskypro/nginx/default 
```

## 粘贴本文第一段nginx配置文件，然后:wq保存
