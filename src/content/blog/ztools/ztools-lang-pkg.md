---
title: 'lang 包（语言增强）总结'
description: 'lang 包是 hutool 的「语言层增强」，弥补 Java 标准库的不足：基础数据类型抽象、函数式接口、控制台、树、哈希、引用等。34 个顶层类 + 13 个子包：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# lang 包（语言增强）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/lang`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.lang`）

---

## 一、包概览

lang 包是 hutool 的「**语言层增强**」，弥补 Java 标准库的不足：基础数据类型抽象、函数式接口、控制台、树、哈希、引用等。**34 个顶层类 + 13 个子包**：

| 类别 | 类 / 子包 | 职责 |
|---|---|---|
| **数据容器** | `Dict` / `Tuple` / `Pair` | 字典（LinkedHashMap + 类型取值）；不可变元组；二元组 |
| **空值处理** | `Opt` | Optional 增强 |
| **控制台** | `Console` / `ConsoleTable` | 控制台输入输出；控制台表格 |
| **断言/校验** | `Assert` / `Validator` | 参数断言；数据校验 |
| **匹配/替换** | `Matcher` / `Replacer` / `PatternPool` / `RegexPool` | 匹配器/替换器抽象；正则预编译池 |
| **随机/权重** | `WeightRandom` / `WeightListRandom` | 按权重随机 |
| **ID** | `ObjectId` / `Snowflake` / `UUID` / `Pid` | MongoDB 风格 ID、雪花、UUID、进程 ID |
| **范围/版本** | `Range` / `Version` | 范围；版本号比较 |
| **缓存/哈希** | `SimpleCache` / `ConsistentHash` | 简单缓存；一致性哈希 |
| **链/单例** | `Chain` / `Singleton` | 责任链；单例 |
| **泛型** | `TypeReference` / `ParameterizedTypeImpl` | 解决泛型擦除 |
| **类加载** | `ClassScanner` / `JarClassLoader` / `ResourceClassLoader` | 类扫描、Jar/资源加载 |
| **ANSI** | ansi 子包 | 控制台颜色/光标转义 |
| **函数式** | func 子包 | 多参数 Supplier/Consumer/VoidFunc |
| **哈希** | hash 子包 | MurmurHash/CityHash/MetroHash/KetamaHash |
| **生成器** | generator 子包 | Snowflake/UUID/ObjectId 生成器抽象 |
| **可变类型** | mutable 子包 | MutableInt/MutableLong 等可变包装 |
| **引用** | ref 子包 | Ref/WeakObj/SoftObj 引用语义统一 |
| **树** | tree 子包 | Tree/Node/TreeNode/TreeBuilder/TreeUtil |
| **延迟加载** | loader 子包 | LazyLoader/AtomicLoader |
| **字符串驻留** | intern 子包 | 字符串驻留（Jdk/Weak） |
| **反射** | reflect 子包 | MethodHandle/Lookup 辅助 |
| **其他** | caller / copier / id 子包 | 调用者查找、拷贝器、NanoId |

---

## 二、核心设计

### 1. Dict：LinkedHashMap + 类型化取值

`Dict extends LinkedHashMap<String, Object> implements BasicTypeGetter<String>`，既保留 Map 的有序键值对，又通过 getter 接口支持 `dict.getInt("age")` 类型化取值，避免强转。

### 2. Opt：Optional 的增强

`Opt` 复制 JDK16 的 Optional 并增强（`ofNullable`、`orElseGet`、`peek`、`ifPresent`、`or` 等），弥补 JDK8 Optional 方法少的缺陷。

### 3. Tuple：多值返回

`Tuple` 是不可变元组（继承 `CloneSupport`），一次方法返回多个不同类型的值。`Pair<K,V>` 是二元的特例。

### 4. mutable 子包：突破基本类型不可变

Java 基本类型作为参数传递是值拷贝，无法「带回」修改结果。`MutableInt/MutableLong/MutableObj` 用包装对象实现引用语义，在 lambda/匿名类里可修改外部「变量」。

### 5. ConsistentHash：一致性哈希

`ConsistentHash` 用哈希环把 key 均匀分布到节点，节点增减时只有少量 key 重新映射，避免普通取模哈希在扩容/缩容时的大面积失效。

### 6. tree 子包：通用树结构

`Tree`/`Node`/`TreeNode` 提供通用树节点（id + parentId + 子节点），`TreeBuilder` 从扁平列表构建树，`TreeUtil` 提供遍历/查找，用于菜单、组织架构。

---

## 三、面试高频问题

**Q1：Dict 和普通 Map 的区别？**

- Dict 继承 LinkedHashMap 并实现 getter 接口，支持 `getInt/getStr` 类型化取值 + 链式 set，更适合配置、JSON 等弱类型数据。

**Q2：Opt 和 JDK Optional 区别？**

- Opt 复制 JDK16 的 Optional 并增强，比 JDK8 的 Optional 多了 `peek`、`or`、`ifPresentOrElse` 等实用方法，且 `of` 传 null 直接 NPE（严格）。

**Q3：为什么需要 MutableInt 这类可变包装？**

- 基本类型参数是值传递，方法内修改不影响外部；lambda 又要求外部变量 final/effectively final。用 MutableInt 包装后可「间接修改」外部值，突破这两点限制。

**Q4：一致性哈希解决什么问题？**

- 分布式缓存/分片中，普通 `hash % n` 在节点数变化时几乎全部 key 重映射。一致性哈希（哈希环）只重映射受影响的一小段，降低缓存雪崩。

**Q5：TypeReference 解决什么？**

- Java 泛型擦除导致运行时拿不到具体泛型类型。TypeReference 通过匿名子类 `new TypeReference<List<String>>(){}` 保留泛型信息，反序列化/转换时精确还原类型。

**Q6：雪花算法（Snowflake）的组成？**

- 64 位：1 位符号 + 41 位时间戳 + 10 位机器 ID + 12 位序列号，毫秒内有序、可排序，适合分布式主键。

---

## 四、应用场景

| 场景 | 对应类 / 子包 |
|---|---|
| 弱类型数据（JSON/配置） | `Dict` |
| 方法多值返回 | `Tuple` / `Pair` |
| 空值链式处理 | `Opt` |
| 参数非空断言 | `Assert` |
| 控制台彩色输出 | `Console` / ansi 子包 |
| 分布式主键 | `Snowflake` / `ObjectId` / `UUID` |
| 权重抽奖 | `WeightRandom` |
| 树形菜单 | tree 子包 |
| 一致性哈希分片 | `ConsistentHash` |
| 泛型反序列化 | `TypeReference` |

---

## 五、当前状态

- **文件**：34 个顶层类 + 13 个子包，与 hutool 5.8.47 对齐。
- **单元测试**：68 个测试类，中文 `@DisplayName`。
- **checkstyle**：**0 违规**。

---

## 相关

- [util包总结](/blog/ztools-util-pkg/)
- [bean与annotation包移植总结](/blog/ztools-bean-annotation-port/)
- [getter包总结](/blog/ztools-getter-pkg/)
- [collection包总结](/blog/ztools-collection-pkg/)
