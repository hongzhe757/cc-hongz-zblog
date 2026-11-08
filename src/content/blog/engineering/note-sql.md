---
title: '1. 删除数据库'
description: 'DROP DATABASE IF EXISTS testdbdel;'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["笔记", "技术总结", "mysql"]
category: 'engineering'
---

# 1. 删除数据库

```sql

DROP DATABASE IF EXISTS test_db_del;

````

# 2. 添加用户
`
```sql

alter user 'v2i'@'localhost' identified by 'my@JyNP^4i7K*f&7';

```

# 3. 授权用户

```sql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;
````

# 4. 刷新权限

```sql

flush privileges
```


# 5. 差集


```SQL
SELECT DISTINCT
a.role_id,
a.role_name,
CASE
WHEN b.role_id IS NULL THEN
FALSE ELSE TRUE
END assignStatus
FROM
( SELECT role_id,role_name FROM sys_role ) a
LEFT JOIN ( SELECT role_id,user_id FROM sys_user_role WHERE user_id = 1) b ON a.role_id = b.role_i
```

# 6. 重复数据

```SQL
SELECT
city_id,
light_number
FROM
sys_light l1
WHERE
EXISTS( SELECT
city_id,
light_number
FROM
sys_light l2
WHERE
l1.light_number = l2.light_number and l1.city_id = l2.city_id and l1.light_id <> l2.light_id
)
```
