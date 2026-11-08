---
title: '安装Jira心得'
description: 'docker pull cptactionhank/atlassian-jira-software:'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["笔记", "技术总结", "docker"]
category: 'engineering'
---

# step1: 准备镜像

```shell
docker pull cptactionhank/atlassian-jira-software:*

docker pull cptactionhank/atlassian-jira-software:7.12.1

docker pull mysql:5.7

```

# step2: 安装mysql


``` shell
docker run \ --name mysql-jira \ --restart always \ -p 8720:3306 \
```

> 此处为端口映射，若不需要外部访问可不选

```shell
-e MYSQL_ROOT_PASSWORD=123456 \ -e MYSQL_DATABASE=jira \ -e MYSQL_USER=jira \ -e MYSQL_PASSWORD=jira \ -d \ mysql:5.7
```

# step3: 启动jira容器

```shell
docker run --name <自定义容器名称> --detach --restart always --link mysql-jira:mysql --publish <本机访问接口>:8080 cptactionhank/atlassian-jira-software:7.12.1
```

# step4: 备份atlassian-extras-3.2.jar



docker exec --user root <自定义容器名称> mv /opt/atlassian/jira/atlassian-jira/WEB-INF/lib/atlassian-extras-3.2.jar /opt/atlassian/jira/atlassian-jira/WEB-INF/lib/atlassian-extras-3.2.jar_bak



# step5: 下载破解文件atlassian-extras-3.2.jar


```html

https://raw.githubusercontent.com/ly641921791/knowledge/master/jira/crack/atlassian-extras-3.2.jar

wget https://raw.githubusercontent.com/ly641921791/knowledge/master/jira/crack/atlassian-extras-3.2.jar
```



# step6: 复制破解文件atlassian-extras-3.2.jar到指定目录



``` shell

docker cp atlassian-extras-3.2.jar jira:/opt/atlassian/jira/atlassian-jira/WEB-INF/lib/

```

# step7: 重启jira

``` shell

docker restart <自定义容器名称>

```


# step8: 访问配置

```tex
打开http://xxx.xx.xx.xx:<本机访问接口>/，按照提示配置即可。
```



# step9: 其他问题

``` tex

添加服务时出错：com.atlassian.jira.exception.DataAccessException:
 org.ofbiz.core.entity.GenericDataSourceException: SQL Exception while
 executing the following:SELECT ID, delaytime, CLAZZ, servicename,
 CRON_EXPRESSION FROM serviceconfig WHERE servicename=? (Illegal mix of
 collations (latin1_swedish_ci,IMPLICIT) and
 (utf8_general_ci,COERCIBLE) for operation ‘=’)。
修改数据库和表编码为utf8或utf8mb4即可。
 修改数据库字符集
ALTER DATABASE db_name DEFAULT CHARACTER SET character_name [COLLATE ...];
把表默认的字符集和所有字符列（CHAR,VARCHAR,TEXT）改为新的字符集
ALTER TABLE tbl_name CONVERT TO CHARACTER SET character_name [COLLATE ...]
如：
ALTER TABLE logtest CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;

```
