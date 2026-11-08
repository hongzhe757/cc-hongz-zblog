---
title: '设置mysql的登录用户名和密码(根据实际情况填写)'
description: 'mysqluser="root"'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["笔记", "技术总结", "mysql"]
category: 'engineering'
---

```shell

#!/bin/bash
# 设置mysql的登录用户名和密码(根据实际情况填写)
mysql_user="root"
mysql_password="1qaz"
mysql_host="localhost"
mysql_port="3306"
mysql_charset="utf8"
# 备份文件存放地址(根据实际情况填写)
backup_location=/volume1/i-zxcvb/mysql_back
# 是否删除过期数据
expire_backup_delete="ON"
expire_days=1
backup_time=`date +%Y%m%d%H%M`
backup_dir=$backup_location
welcome_msg="Welcome to use MySQL backup tools!"
# 备份指定数据库中数据(此处假设数据库是mysql_backup_test)
docker exec -i 0785920955d0 mysqldump -h$mysql_host -P$mysql_port -u$mysql_user -p$mysql_password -B wts-jlsc > $backup_dir/wts-jlsc-$backup_time.txt
# 删除过期数据
if [ "$expire_backup_delete" == "ON" -a "$backup_location" != "" ];then
        `find $backup_location/ -type f -mtime +$expire_days | xargs rm -rf`
        echo "Expired backup data delete complete!"
fi

```
