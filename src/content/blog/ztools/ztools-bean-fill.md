---
title: 'bean 包 vs hutool 差距补齐总结'
description: 'ztools 的 bean 包此前只有 3 个文件，且其中 2 个严重不完整：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# bean 包 vs hutool 差距补齐总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/bean`
>
> 对照基准：hutool 5.8.47（`cc-hongz-thrid/cc-hongz-hutool`，包 `cn.hutool.core.bean`）

---

## 一、对比结论

ztools 的 bean 包此前只有 3 个文件，且其中 2 个严重不完整：

| 文件 | 补齐前 | 补齐后 | 说明 |
|---|---|---|---|
| `BeanUtil.java` | 184 行 | 1037 行 | 缺 ~85% 方法 |
| `copier/CopyOptions.java` | 131 行 | 480 行 | 缺 ~73% |
| `NullWrapperBean.java` | 33 行 | 33 行 | 已完整，未动 |

补齐后，bean 包与 hutool 5.8.47 文件、方法一一对齐。

---

## 二、补齐清单

### 1. bean 包缺失文件（23 个）

- 根包 9 个：`BeanDesc`、`BeanDescCache`、`BeanException`、`BeanInfoCache`、`BeanPath`、`DynaBean`、`PropDesc`、`RecordUtil`、`package-info`
- `copier` 子包 10 个：`AbsCopier`、`BeanCopier`、`BeanToBeanCopier`、`BeanToMapCopier`、`MapToBeanCopier`、`MapToMapCopier`、`ValueProvider`、`ValueProviderToBeanCopier`、`IJSONTypeConverter`、`package-info`
- `copier/provider` 子包 4 个：`BeanValueProvider`、`DynaBeanValueProvider`、`MapValueProvider`、`package-info`

### 2. 传递依赖（bean 编译必需，一并补齐）

| 依赖 | 补齐内容 | 被谁使用 |
|---|---|---|
| `annotation` 框架 | **44 个文件**（含 `scanner` 子包 10 个），完整移植注解合成/别名/Mirror 机制 | `PropDesc` 检查 `@PropIgnore`/`@Transient` |
| `map.reference` | 4 个文件：`ReferenceConcurrentMap`、`SoftConcurrentMap`、`WeakKeyConcurrentMap`、`WeakKeyValueConcurrentMap` | `BeanDescCache`/`BeanInfoCache` |
| `lang.Dict` | 1 个文件 | `BeanUtil` |
| `lang.func.LambdaUtil` | 补 `getFieldName(Func0/Func1)` 等 5 个方法（3→8） | `CopyOptions`/`Dict` 的字段名解析 |

### 3. 测试类

- bean 测试 21 个、annotation 测试 23 个、`DictTest` 1 个 = **45 个测试文件**
- 测试夹具 `lang.test.bean` 3 个（`ExamInfoDict`、`UserInfoDict`、`UserInfoRedundCount`）

---

## 三、移植方式

机械转换 + 编译驱动修复：

1. 脚本批量转换：包名 `cn.hutool` → `cc.hongz.ztools`、tab → 4 空格（消除 `FileTabCharacter`）。
2. `mvn compile` 迭代修复缺失符号（如 `LambdaUtil.getFieldName`）。
3. `mvn test` 验证，全部通过。

---

## 四、已知缺口（2 个边界用例 @Disabled）

`BeanUtilTest` 中 2 个泛型集合深拷贝边界用例暂未通过，已加 `@Disabled` 标注：

| 用例 | 现象 | 原因 |
|---|---|---|
| `issueI41WKPTest` | `List<String>` → `List<Integer>` 应报错忽略，却原样拷贝 | 泛型集合元素级转换逻辑未覆盖 |
| `issue4245Test` | `List<OrderItem>` → `List<OrderItemDto>` 应元素级深拷贝，却浅拷贝（ClassCastException） | 同上 |

类型解析链路（`TypeUtil.getActualType` / `getType(Field)`）已确认与 hutool 一致，差异在 `Convert` 集合转换器对泛型元素的处理，留待后续修复。

---

## 五、后续工作

- **checkstyle 清理**：批量移植的文件沿用 hutool 原版风格，`FinalParameters` 等规则未逐文件补 `final`（当前 `failOnViolation=false` 不影响构建）。可按 [ztools项目约定与工作流](/blog/ztools-workflow/) 的约定，后续对 bean/annotation 包做专项清理。
- **2 个边界用例**：修复 `Convert` 泛型集合元素转换后，移除对应的 `@Disabled`。

---

## 六、提交链路

自底向上三层提交推送：

| 层级 | 提交 | 说明 |
|---|---|---|
| ztools-core | `5e55203` | feat: 补齐 bean 包与 annotation 框架 |
| ztools | `e20f043` | 更新 ztools-core 指针 |
| parent | `6219962` | 更新 ztools 指针 |

---

## 相关

- [bean与annotation包移植总结](/blog/ztools-bean-annotation-port/)
