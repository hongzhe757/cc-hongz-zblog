---
title: 'jenkins备份'
description: 'appname=’ivics-java-web’'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["笔记", "技术总结", "jenkins"]
category: 'engineering'
---

```tex

app_name='ivics-java-web'

docker stop ${app_name}

echo '----stop container----'

docker rm ${app_name}

echo '----rm container----'

docker rmi ${app_name}

echo '----rmi images----'

\cp -v /var/lib/jenkins/workspace/IVICS_JAVA_WEB/target/ivics-java-web-latest-SNAPSHOT.jar /opt/back-project/ivics-java-web/

\cp -v /var/lib/jenkins/workspace/IVICS_JAVA_WEB/src/main/resources/Dockerfile /opt/back-project/ivics-java-web/

\cp -v /var/lib/jenkins/workspace/IVICS_JAVA_WEB/sql/basefile/ivics-java-web.sql /opt/back-project/ivics-java-web/sql/basefile/ivics-java-web.sql

  

cd /opt/back-project/ivics-java-web/

docker build -t ${app_name}:latest .

docker run -e TZ='Asia/Shanghai' -v /opt/back-project/ivics-java-web:/opt/back-project/ivics-java-web -v /run/docker.sock:/run/docker.sock -v /usr/bin/docker:/usr/bin/docker -d -p 6667:8081 --name ivics-java-web ivics-java-web

  

docker run -p 13307:3306 --restart always --name mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7.25 --character-set-server=utf8mb4 --collation-server=utf8mb4_bin

  

sudo docker run --name=mysql -it -p 13307:3306 --restart always -e MYSQL_ROOT_PASSWORD=root--privileged=true -d mysql:5.7.25 --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci

  

docker run -e TZ='Asia/Shanghai' -v /opt/back-project/ivics-java-web:/opt/back-project/ivics-java-web -d -p 6667:8081 --name ivics-java-web ivics-java-web

```

![](http://img.hongzhe.work/i/2022/12/19/s8egut-0.png)


![](http://img.hongzhe.work/i/2022/12/19/s8jo0n-0.png)

![](http://img.hongzhe.work/i/2022/12/19/s8zzvv-0.png)

![](http://img.hongzhe.work/i/2022/12/19/s91zz0-0.png)

![](http://img.hongzhe.work/i/2022/12/19/s94xat-0.png)


![](http://img.hongzhe.work/i/2022/12/19/s96x2j-0.png)
