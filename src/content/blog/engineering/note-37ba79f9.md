---
title: '配置文件2'
description: 'upstream hongzhe{'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["笔记", "技术总结", "ningx"]
category: 'engineering'
---

```nginx
upstream hongzhe{
	server 103.101.205.119:8080;
	server 69.165.73.17:8080 backup;
}
server {
	listen 80;
	server_name *.hongzhe.work;
	#access_log /var/log/nginx/host.access.log main;
	location / {
		proxy_pass http://hongzhe;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_hide_header X-Powered-By;
	}
	#error_page 404 /404.html;
	# redirect server error pages to the static page /50x.html
	#
	error_page 500 502 503 504 /50x.html;
	location = /50x.html {
	root /usr/share/nginx/html;
	}
	# proxy the PHP scripts to Apache listening on 127.0.0.1:80
	#
	#location ~ \.php$ {
	# proxy_pass http://127.0.0.1;
	#}
	# pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
	#
	#location ~ \.php$ {
	# root html;
	# fastcgi_pass 127.0.0.1:9000;
	# fastcgi_index index.php;
	# fastcgi_param SCRIPT_FILENAME /scripts$fastcgi_script_name;
	# include fastcgi_params;
	#}
	# deny access to .htaccess files, if Apache's document root
	# concurs with nginx's one
	#
	#location ~ /\.ht {
	# deny all;
	#}
}
```
