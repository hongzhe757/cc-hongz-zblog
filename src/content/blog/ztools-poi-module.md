---
title: 'poi 模块总结'
description: '是 hutool-poi 的移植镜像，包路径 。共 66 个主类（+7 package-info），分 3 层：Excel 读写、Word 文档、OFD 文档。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "数据"]
---

# poi 模块总结（MOC）

> `cc-hongz-ztools-poi` 是 hutool-poi 的移植镜像，包路径 `cc.hongz.ztools.poi`。共 66 个主类（+7 package-info），分 3 层：Excel 读写、Word 文档、OFD 文档。

---

## 分层

- [excel包总结](/blog/ztools-excel-pkg/) — Excel 读写（读取/写出/SAX 流式/单元格/样式，57 类）
- [word包总结](/blog/ztools-word-pkg/) — Word 文档（07 格式写出/表格/图片，5 类）
- [ofd包总结](/blog/ztools-ofd-pkg/) — OFD 文档（国产版式文档写出，1 类）

> 根包 `GlobalPoiConfig` / `PoiChecker` 与 `exceptions` 包的 `POIException` 体量小，归入 [excel包总结](/blog/ztools-excel-pkg/) 一并说明。

---

## 依赖关系

- [excel包总结](/blog/ztools-excel-pkg/) 依赖 [core模块总结](/blog/ztools-core-module/)（FileUtil/IoUtil/StrUtil/ObjectUtil/BeanUtil/CollectionUtil）
- 底层依赖 **Apache POI**（poi-ooxml 4.1.2，Excel/Word）+ **OFDRW**（ofdrw-full 2.3.1，OFD）
- 三层的写入门面都通过 `PoiChecker` 校验依赖是否存在（缺依赖时抛 `DependencyException` 提示）

## 相关

- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [ztools项目约定与工作流](/blog/ztools-workflow/) — checkstyle 约定、提交推送流程
