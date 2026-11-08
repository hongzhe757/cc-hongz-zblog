---
title: 'IDT 表'
description: '21h 退出（中断）eg： int 21h'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["笔记", "技术总结", "asm"]
category: 'engineering'
---

# 指令


21h 退出（中断）eg： int 21h
3h 软件断点 eg: int 3 硬编码 cc（0xcc）
move ax,0x4c00h 数据传送指
move 指令不影响标记位 32位：eflag 64位：rflag

注意：第一个操作数不能是立即数
