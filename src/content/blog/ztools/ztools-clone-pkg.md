---
title: 'clone 包（克隆）总结'
description: '1. 序列化/反序列化：对象实现 Serializable，用 ObjectOutputStream/ObjectInputStream 写读（hutool 有 ObjectUtil.cloneByStream）。'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "基础核心"]
category: 'ztools'
---

# clone 包（克隆）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/clone`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.clone`）

---

## 一、包概览

| 类 | 职责 | 关键点 |
|---|---|---|
| `Cloneable<T>` | 标记接口，`extends java.lang.Cloneable`，定义泛型 `T clone()` | 返回类型安全的克隆方法 |
| `CloneSupport<T>` | 类，用 `super.clone()` 提供浅拷贝默认实现 | 依赖继承 `Object` 的 native 克隆 |
| `DefaultCloneable<T>` | 接口，用反射提供 `default T clone0()` | Java 8 默认方法，适合无法继承 `CloneSupport` 的场景 |
| `CloneRuntimeException` | 克隆异常（运行时异常，5 个构造器） | 把受检的 `CloneNotSupportedException` 转成运行时异常 |

---

## 二、涉及的设计模式 / 方法

| 模式/机制 | 说明 | 体现 |
|---|---|---|
| **标记接口（Marker Interface）** | 无方法的接口，仅标记「可克隆」 | `Cloneable` / `java.lang.Cloneable` |
| **泛型（Generics）** | 克隆返回具体类型，避免强转 | `Cloneable<T>.clone()` 返回 `T` |
| **模板方法（Template Method）** | 父类提供默认克隆实现 | `CloneSupport.clone()` 用 `super.clone()` |
| **默认方法（Default Method，Java 8）** | 接口里提供带实现的方法 | `DefaultCloneable.clone0()` |
| **反射（Reflection）** | 运行时调用 `clone()` 方法 | `DefaultCloneable` 用 `ReflectUtil.invoke(this, "clone")` |
| **异常包装（Exception Wrapping）** | 受检异常 → 运行时异常 | `CloneNotSupportedException` → `CloneRuntimeException` |

---

## 三、面试高频问题与回答

**Q1：Java 里怎么实现对象的克隆？浅拷贝和深拷贝的区别？**

- 实现 `java.lang.Cloneable` 接口，重写 `clone()` 方法（内部调用 `super.clone()`）。
- **浅拷贝**：只复制对象本身，引用类型字段仍指向同一个对象（`Object.clone()` 就是浅拷贝）。
- **深拷贝**：递归复制所有引用类型字段，得到完全独立的对象（需手动实现，或用序列化反序列化）。

**Q2：`Cloneable` 是标记接口，它有什么作用？不实现会怎样？**

- `Cloneable` 没有任何方法，作用是「标记」这个类可以被 `clone()`。
- 若类没有实现 `Cloneable` 却调用了 `clone()`，JVM 会抛 `CloneNotSupportedException`（受检异常）。
- 标记接口的本质是给运行时/框架一个「允许克隆」的信号。

**Q3：`Object.clone()` 是 `protected` 的，为什么？怎么用？**

- `protected` 表示只有子类（以及同包）能访问，防止外部任意克隆。
- 子类重写时先调用 `super.clone()`，再处理 `CloneNotSupportedException`，最后强转为自身类型。

**Q4：`super.clone()` 是浅拷贝还是深拷贝？**

- **浅拷贝**。`Object.clone()` 是 native 方法，逐字段复制，引用字段只复制引用，不复制引用指向的对象。

**Q5：为什么 hutool 要自定义 `Cloneable<T>`（泛型 `T clone()`），而不直接用 `Object.clone()`？**

- `Object.clone()` 返回 `Object`，调用方每次都要强转，且抛受检异常。
- 自定义 `T clone()` 返回具体类型，**类型安全、免强转**，并把异常包装成运行时异常，调用方不必强制 try-catch。

**Q6：`CloneSupport` 和 `DefaultCloneable` 有什么区别？怎么选？**

- `CloneSupport` 是**类**，靠继承 `Object` 的 `super.clone()` 实现（native 浅拷贝），适合新写的类直接继承。
- `DefaultCloneable` 是**接口**（`default clone0()` 用反射调用 `clone`），适合已有父类、无法再继承 `CloneSupport` 的场景——Java 单继承，但可以多实现接口。

**Q7：为什么把受检的 `CloneNotSupportedException` 转成运行时异常 `CloneRuntimeException`？**

- 受检异常会强制每个调用方 try-catch 或声明 throws，传播面大、代码啰嗦。
- 克隆失败通常是编程错误（忘记实现 `Cloneable`），转成运行时异常让调用方不必强制处理，代码更简洁。

**Q8：深拷贝怎么实现？**

1. **序列化/反序列化**：对象实现 `Serializable`，用 `ObjectOutputStream`/`ObjectInputStream` 写读（hutool 有 `ObjectUtil.cloneByStream`）。
2. **手动递归克隆**：逐字段调用 `clone()` 或复制。
3. **第三方库**：如 hutool 的 `ObjectUtil`。

---

## 四、应用场景

| 场景 | 对应能力 | 例子 |
|---|---|---|
| **原型模式（Prototype）** | `clone()` 快速复制对象 | 以已有对象为模板创建新对象 |
| **DTO/VO 快照** | 浅拷贝得到副本，避免修改原对象 | 返回对象副本而非内部引用，防止被外部篡改 |
| **避免暴露内部可变对象** | 返回克隆副本 | getter 返回集合/对象的副本，保护封装性 |
| **性能优化** | 克隆比重新 new + set 快 | 批量复制结构相同的对象 |

---

## 五、当前状态（待办）

- **文件/方法**：与 hutool 5.8.47 完全对齐，无缺漏。
- **单元测试**：齐全（4 个测试类、中文 `@DisplayName`），比 hutool 原版（2 个）覆盖更全。
- **checkstyle**：**65 处违规未清理**（`FileTabCharacter` 42 + `FinalParameters` 9 + `JavadocStyle` 6 + `MissingJavadocMethod` 5 + `WhitespaceAround` 3），主要是 tab 未转 4 空格、参数未加 `final`、javadoc 首句句号。

---

## 相关

- [lang包总结](/blog/ztools-lang-pkg/)
