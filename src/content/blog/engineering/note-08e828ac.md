---
title: '跨域请求'
description: 'var xhr = new XMLHttpRequest();'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["笔记", "技术总结", "js"]
category: 'engineering'
---

```html

var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://www.xxx.com/api/action');
xhr.send(null);
xhr.onload = function(e) {
    var xhr = e.target;
    console.log(xhr.responseText);
}

```
