---
title: '数据库连接异常HikariPool-1 Connection is not available,request timed out after 30000ms'
description: '记一次生产环境数据库连接数导致的报错问题:Failed to obtain JDBC Connection; nested exception is java.sql.SQLTransientConnectionException: HikariPool-1 - Connecti'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["笔记", "技术总结", "mysql"]
category: 'engineering'
---

记一次生产环境数据库连接数导致的报错问题:Failed to obtain JDBC Connection; nested exception is java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.
1. 复现，定时任务失败会有错误邮件提醒，每天的七点左右就会有大量定时任务失败，报错为数据库连接超时，此时页面也无法访问，提示异常。大概持续时间为20min，过后又一切正常


```java

Caused by: org.apache.ibatis.exceptions.PersistenceException: 
### Error updating database.  Cause: org.springframework.jdbc.CannotGetJdbcConnectionException: Failed to obtain JDBC Connection; nested exception is java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.
### The error may exist in com/ss/mapper/QuteListMapper.java (best guess)
### The error may involve com.ss.mapper.QuteListMapper.insert
### The error occurred while executing an update
### Cause: org.springframework.jdbc.CannotGetJdbcConnectionException: Failed to obtain JDBC Connection; nested exception is java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.
	at org.apache.ibatis.exceptions.ExceptionFactory.wrapException(ExceptionFactory.java:30)
	at org.apache.ibatis.session.defaults.DefaultSqlSession.update(DefaultSqlSession.java:200)
	at org.apache.ibatis.session.defaults.DefaultSqlSession.insert(DefaultSqlSession.java:185)
	at sun.reflect.GeneratedMethodAccessor985.invoke(Unknown Source)
	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
	at java.lang.reflect.Method.invoke(Method.java:498)
	at org.mybatis.spring.SqlSessionTemplate$SqlSessionInterceptor.invoke(SqlSessionTemplate.java:433)
	... 121 common frames omitted
Caused by: org.springframework.jdbc.CannotGetJdbcConnectionException: Failed to obtain JDBC Connection; nested exception is java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.
	at org.springframework.jdbc.datasource.DataSourceUtils.getConnection(DataSourceUtils.java:81)
	at org.mybatis.spring.transaction.SpringManagedTransaction.openConnection(SpringManagedTransaction.java:82)
	at org.mybatis.spring.transaction.SpringManagedTransaction.getConnection(SpringManagedTransaction.java:68)
	at org.apache.ibatis.executor.BaseExecutor.getConnection(BaseExecutor.java:336)
	at org.apache.ibatis.executor.SimpleExecutor.prepareStatement(SimpleExecutor.java:85)
	at org.apache.ibatis.executor.SimpleExecutor.doUpdate(SimpleExecutor.java:49)
	at org.apache.ibatis.executor.BaseExecutor.update(BaseExecutor.java:117)
	at org.apache.ibatis.executor.CachingExecutor.update(CachingExecutor.java:76)
	at org.apache.ibatis.session.defaults.DefaultSqlSession.update(DefaultSqlSession.java:198)
	... 126 common frames omitted
Caused by: java.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms.
	at com.zaxxer.hikari.pool.HikariPool.createTimeoutException(HikariPool.java:669)
	at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:183)
	at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:148)
	at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:128)
	at com.zaxxer.hikari.HikariDataSource$$FastClassBySpringCGLIB$$eeb1ae86.invoke(<generated>)
	at org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:204)
	at org.springframework.aop.framework.CglibAopProxy$CglibMethodInvocation.invokeJoinpoint(CglibAopProxy.java:746)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:163)
	at org.springframework.aop.support.DelegatingIntroductionInterceptor.doProceed(DelegatingIntroductionInterceptor.java:136)
	at org.springframework.aop.support.DelegatingIntroductionInterceptor.invoke(DelegatingIntroductionInterceptor.java:124)
	at org.springframework.aop.framework.ReflectiveMethodInvocation.proceed(ReflectiveMethodInvocation.java:185)
	at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:688)
	at com.zaxxer.hikari.HikariDataSource$$EnhancerBySpringCGLIB$$b64982c2.getConnection(<generated>)
	at org.springframework.jdbc.datasource.DataSourceUtils.fetchConnection(DataSourceUtils.java:157)
	at org.springframework.jdbc.datasource.DataSourceUtils.doGetConnection(DataSourceUtils.java:115)
	at org.springframework.jdbc.datasourc


```

2.原因：联系运维同事，发现数据库并无异常。所以大概是请求量太高导致数据库连接数不够，因为七点是会有一些定时任务，还有其他系统通过接口调用我们系统，虽然此时使用页面的人数不多。

1. 解决 : yml配置文件增加了hikari连接配置, 默认最大连接数（maximum-pool-size）为10，这里改成了60，这里按自己需求配置数量即可

```java

  datasource:
    type: com.zaxxer.hikari.HikariDataSource
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: root
    password: root
    url: jdbc:mysql://xxx.xxx.x.xxx:3306/db
   # 连接池
    hikari:
      #连接池名
      pool-name: DateHikariCP
      #最小空闲连接数
      minimum-idle: 10
      # 空闲连接存活最大时间，默认600000（10分钟）
      idle-timeout: 180000
      # 连接池最大连接数，默认是10
      maximum-pool-size: 60
      # 此属性控制从池返回的连接的默认自动提交行为,默认值：true
      auto-commit: true
      # 此属性控制池中连接的最长生命周期，值0表示无限生命周期，默认1800000即30分钟
      max-lifetime: 1800000
      # 数据库连接超时时间,默认30秒，即30000
      connection-timeout: 30000
      connection-test-query: SELECT 1



```

![](http://img.hongzhe.work/i/2022/12/08/otuwxc-0.png)

![](http://img.hongzhe.work/i/2022/12/08/ozxy6j-0.png)
