---
title: 'excel 包（Excel 读写）总结'
description: 'excel 包是 poi 模块的核心（57 类），按层级分 6 个子包 + 根包：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-5.jpg'
tags: ["ztools", "数据"]
---

# excel 包（Excel 读写）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-poi/src/main/java/cc/hongz/ztools/poi/excel`
>
> 对照基准：hutool 5.8.48（`cn.hutool.poi.excel`）

---

## 一、包概览

excel 包是 poi 模块的**核心**（57 类），按层级分 6 个子包 + 根包：

| 类别 | 类 | 职责 |
|---|---|---|
| **统一入口** | `ExcelUtil` | 读取/写出的统一静态入口（Facade）：`getReader`/`getWriter`/`getBigWriter`/`readBySax` |
| **读取** | `ExcelReader` | 读取 Excel：`read`/`readAll`/`readRow`，转 Bean/Map/List |
| **写出** | `ExcelWriter` | 写出 Excel：`write`/`writeRow`/`writeMap`/`merge`/`writeImg` |
| **大数据写出** | `BigExcelWriter` | 基于 SXSSF 的大数据写出，低内存 |
| **基类/工具** | `ExcelBase` / `WorkbookUtil` / `RowUtil` / `StyleSet` / `ExcelDateUtil` / `ExcelFileUtil` / `ExcelPicUtil` / `ExcelExtractorUtil` | Reader/Writer 基类、工作簿创建、行读写、样式、日期、文件类型、图片、文本提取 |
| **单元格** | `cell` 子包（21 类） | 单元格值抽象与设值策略 |
| **读取策略** | `reader` 子包（6 类） | 一行数据转 Bean/List/Map/Column 的策略 |
| **SAX 流式** | `sax` 子包（14 类） | 事件模式流式读取，低内存 |
| **样式** | `style` 子包（2 类） | 对齐、边框、颜色、字体 |
| **编辑器** | `editors` 子包（2 类） | 单元格编辑（Trim/数值转 int） |

---

## 二、核心设计

### 1. ExcelUtil：门面模式统一入口

`ExcelUtil.getReader()` / `getWriter()` / `getBigWriter()` 屏蔽了底层 Workbook 的创建细节，调用方一行代码拿到 Reader/Writer。`readBySax()` 则切入 SAX 流式路径。

### 2. Reader / Writer 分离

- `ExcelReader` 负责读：按 sheet 索引/名称定位，`readAll()` 读成 List<Map> 或 List<Bean>（反射 + `@Alias` 注解映射列名）。
- `ExcelWriter` 负责写：`writeRow`/`writeMap`/`writeBean` 逐行写出，`merge` 合并单元格，支持表头别名 `addHeaderAlias` 与 `setOnlyAlias`。

### 3. SAX 事件模式（低内存读大文件）

`Excel03SaxReader` / `Excel07SaxReader` 用 POI 的事件模式（XSSF SAX 解析），不把整个 Workbook 加载进内存，逐行回调 `RowHandler.handle(sheetIndex, rowIndex, rowCells)`，适合百万行级文件。`SheetDataSaxHandler` 解析 `sheetData` 标签，`SheetRidReader` 解析 sheet 名称到 rid 的映射。

### 4. CellSetter 策略模式

`cell` 子包把「给单元格设值」抽象成 `CellSetter` 接口，`CellSetterFactory` 按值类型分发：`NumberCellSetter`/`DateCellSetter`/`CalendarCellSetter`/`BooleanCellSetter`/`RichTextCellSetter`/`HyperlinkCellSetter`/`EscapeStrCellSetter` 等。`CellValue`/`FormulaCellValue`/`NumericCellValue` 则抽象「读出的单元格值」。

### 5. SheetReader 策略模式

`reader` 子包把「一行数据转成什么结构」抽象成 `SheetReader` 接口：`BeanSheetReader`（转 Bean）、`ListSheetReader`（转 List）、`MapSheetReader`（转 Map）、`ColumnSheetReader`（按列）。

---

## 三、面试高频问题

**Q1：POI 用户模式（UserModel）和事件模式（EventModel）的区别？**

- 用户模式：把整个 Workbook 加载进内存（`XSSFWorkbook`），API 友好但内存占用高，适合中小文件。
- 事件模式：SAX 流式解析，逐行回调，内存占用极低，适合大文件，但 API 复杂（要自己处理 sharedStrings/样式）。
- hutool 的 `ExcelSaxReader` 封装了事件模式，`readBySax` 兼顾了低内存和易用性。

**Q2：大数据量写出为什么用 SXSSF？**

- SXSSF 用滑动窗口（默认 100 行）只把窗口内的行留在内存，其余刷到临时文件，避免 OOM。`BigExcelWriter` 就是基于 SXSSF 的封装。

**Q3：合并单元格读取的坑？**

- 合并区域只有左上角单元格有值，其余为 null。`ExcelReader` 的 `isMergeRead` 配置可让其余单元格也读到左上角的值（如 `IssueI53OSTTest` 场景）。

**Q4：Excel 里的日期为什么读出来是数字？**

- POI 内部日期是「距离 1899-12-30 的天数」，需按单元格格式判断后转 `Date`。`ExcelDateUtil.isDateFormat` 负责识别日期格式，`NumericCellValue` 处理 1899 基准（HUTOOL 兼容的 bug）。

---

## 相关

- [poi模块总结](/blog/ztools-poi-module/) — 上级 MOC
- [word包总结](/blog/ztools-word-pkg/) / [ofd包总结](/blog/ztools-ofd-pkg/) — 姊妹包
- [bean与annotation包移植总结](/blog/ztools-bean-annotation-port/) — `@Alias` 注解来自 core 的 annotation 包
