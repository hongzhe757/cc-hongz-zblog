---
title: 'unbutu环境下docker部署jar和mysql'
description: 'FROM openjdk:11-jre'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["笔记", "技术总结", "docker"]
category: 'engineering'
---

# step1: dockerfile

```shell
FROM openjdk:11-jre
VOLUME /opt/back-project/ivics-java-web
ADD ivics-java-web-latest-SNAPSHOT.jar ivics-java-web-latest-SNAPSHOT.jar
ADD sources.list /etc/apt/sources.list
ADD libmysqlclient20_5.7.25-1ubuntu18.10_amd64.deb libmysqlclient20_5.7.25-1ubuntu18.10_amd64.deb
ADD libmysqlclient-dev_5.7.25-1ubuntu18.10_amd64.deb libmysqlclient-dev_5.7.25-1ubuntu18.10_amd64.deb
ADD libmysqld-dev_5.7.25-1ubuntu18.10_amd64.deb libmysqld-dev_5.7.25-1ubuntu18.10_amd64.deb
ADD mysql-client_5.7.25-1ubuntu18.10_amd64.deb mysql-client_5.7.25-1ubuntu18.10_amd64.deb
ADD mysql-common_5.7.25-1ubuntu18.10_amd64.deb mysql-common_5.7.25-1ubuntu18.10_amd64.deb
ADD mysql-community-client_5.7.25-1ubuntu18.10_amd64.deb mysql-community-client_5.7.25-1ubuntu18.10_amd64.deb
RUN apt-get clean
RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get -y install libnuma1
RUN dpkg -i mysql-common_5.7.25-1ubuntu18.10_amd64.deb
RUN dpkg -i libmysqlclient20_5.7.25-1ubuntu18.10_amd64.deb
RUN dpkg -i libmysqlclient-dev_5.7.25-1ubuntu18.10_amd64.deb
RUN dpkg -i libmysqld-dev_5.7.25-1ubuntu18.10_amd64.deb
RUN apt-get install -y libaio1
RUN dpkg -i mysql-community-client_5.7.25-1ubuntu18.10_amd64.deb
RUN dpkg -i mysql-client_5.7.25-1ubuntu18.10_amd64.deb
RUN dpkg -i mysql-common_5.7.25-1ubuntu18.10_amd64.deb
RUN apt-get -f install
RUN apt-get -f install libmecab2
CMD java -jar ivics-java-web-latest-SNAPSHOT.jar
```

# step2: 注意

```txt
此处dockfile当时写的很多的原因是因为没有找到ubuntu环境下的mysql包,或者是mysql的包不全.后面找到一个带有configAll字样的包,是可以安装的.
```

# step3: 下载链接

```html
https://dev.mysql.com/downloads/repo/apt/
```

![](http://img.hongzhe.work/i/2022/12/03/vlwvgl-0.png)
