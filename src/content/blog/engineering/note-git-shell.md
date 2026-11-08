---
title: 'echo $PWD'
description: 'function gitshowdirs() {'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["笔记", "技术总结", "git"]
category: 'engineering'
---

```shell
#! /bin/bash
function git_show_dirs() {
	for dir_name in `ls $1`
	do
		cur_dir="$dir_name"
		echo $cur_dir
		if [ -d $cur_dir ]
			cd $cur_dir
			git push --mirror git@gitssh.hongzhe.work:hongzhe.qin/$cur_dir
			cd ..
		then
			echo $cur_dir
		fi
	done
}
# echo $PWD
git_show_dirs
```
