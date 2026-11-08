---
title: '代码检查 pre-commit'
description: 'echo "begin to execute hook"gst'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["笔记", "技术总结", "checkstyle"]
category: 'engineering'
---

```
#!/bin/sh  
#set -x  
  
echo "begin to execute hook"gst  
mvn checkstyle:check  
  
RESULT=$?  
  
exit $RESULT
```
