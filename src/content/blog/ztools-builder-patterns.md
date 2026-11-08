---
title: 'builder 包设计模式总结'
description: '主体（ / / / ）迁移自 Apache Commons Lang3，用于辅助构建 / / 方法； 为 hutool 原创（5.7.21），基于函数式接口构建任意对象。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-3.jpg'
---

# builder 包设计模式总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/builder`
>
> 包路径：`cc.hongz.ztools.core.builder`
>
> 主体（`EqualsBuilder` / `HashCodeBuilder` / `CompareToBuilder` / `IDKey`）迁移自 Apache Commons Lang3，用于辅助构建 `equals()` / `hashCode()` / `compareTo()` 方法；`GenericBuilder` 为 hutool 原创（5.7.21），基于函数式接口构建任意对象。

---

## 一、包概览

| 类 | 职责 | 实现接口 |
|---|---|---|
| `Builder<T>` | 建造者模式核心接口，定义 `build()` | — |
| `EqualsBuilder` | 构建 `equals()` 方法 | `Builder<Boolean>` |
| `HashCodeBuilder` | 构建 `hashCode()` 方法 | `Builder<Integer>` |
| `CompareToBuilder` | 构建 `compareTo()` 方法 | `Builder<Integer>` |
| `IDKey` | 身份键，包装 `System.identityHashCode()` | — |
| `GenericBuilder<T>` | 通用 Builder，基于 `Supplier`/`Consumer` 构建任意对象（hutool 原创） | `Builder<T>` |

---

## 二、涉及的设计模式

### 1. 建造者模式（Builder Pattern）

**核心**：将复杂对象的构建过程与表示分离，通过逐步追加（append）再最终构建（build）。

`Builder<T>` 接口是建造者模式的标准抽象：

```java
public interface Builder<T> extends Serializable {
    T build();
}
```

三个具体 Builder 都实现该接口：

```java
public class EqualsBuilder implements Builder<Boolean> {
    public Boolean build() { return isEquals(); }
}

public class HashCodeBuilder implements Builder<Integer> {
    public Integer build() { return toHashCode(); }
}

public class CompareToBuilder implements Builder<Integer> {
    public Integer build() { return toComparison(); }
}
```

**特点**：
- 构建过程分步进行（`append` 方法逐个追加字段），最终一次性产出结果。
- 延迟求值：中间过程只记录状态（如 `comparison`、`isEquals`），调用 `build()` 时才返回最终值。

---

### 2. 流式接口（Fluent Interface）

**核心**：方法返回 `this`，支持链式调用，代码可读性高。

三个 Builder 的所有 `append` 方法都返回 `this`：

```java
public EqualsBuilder append(final Object lhs, final Object rhs) {
    if (isEquals == false) {
        return this;
    }
    // ... 比较逻辑
    return this;
}
```

典型用法（一个表达式完成全部字段比较）：

```java
return new EqualsBuilder()
        .appendSuper(super.equals(obj))
        .append(field1, rhs.field1)
        .append(field2, rhs.field2)
        .append(field3, rhs.field3)
        .isEquals();
```

**短路径优化**：每个 `append` 开头都判断是否已可确定结果（如 `comparison != 0` / `isEquals == false`），一旦确定后续追加全部跳过，避免无谓计算。

---

### 3. 反射（Reflection）

**核心**：通过反射遍历对象字段，自动完成 equals/hashCode/compareTo，无需手写每个字段。

三个 Builder 都提供 `reflectionXxx` 系列静态方法：

```java
// 反射比较 equals
EqualsBuilder.reflectionEquals(lhs, rhs, excludeFields);

// 反射计算 hashCode
HashCodeBuilder.reflectionHashCode(object, testTransients);

// 反射比较 compareTo
CompareToBuilder.reflectionCompare(lhs, rhs, compareTransients);
```

**实现要点**：
- `AccessibleObject.setAccessible(fields, true)` 绕过访问控制，可访问 private 字段。
- 字段过滤条件（三个 Builder 一致）：
  - 排除指定字段（`excludeFields`）
  - 排除内部类合成字段（字段名含 `$`）
  - 默认排除 `static` 字段
  - 默认排除 `transient` 字段（除非显式 `testTransients = true`）
- 向上遍历父类字段（直到 `reflectUpToClass` 或 `Object`）。

```java
private static void reflectionAppend(...) {
    final Field[] fields = clazz.getDeclaredFields();
    AccessibleObject.setAccessible(fields, true);
    for (final Field field : fields) {
        if (排除条件) {
            builder.append(field.get(lhs), field.get(rhs));
        }
    }
}
```

---

### 4. ThreadLocal 注册表（检测循环引用）

**核心**：用 `ThreadLocal` 持有"正在遍历的对象对"注册表，避免反射遍历时对象互相引用导致无限循环。

`EqualsBuilder` 与 `HashCodeBuilder` 都维护一个注册表：

```java
private static final ThreadLocal<Set<Pair<IDKey, IDKey>>> REGISTRY = new ThreadLocal<>();
```

**流程**：
1. `register(lhs, rhs)` —— 遍历前注册对象对。
2. `isRegistered(lhs, rhs)` —— 若已注册（说明正在遍历），直接返回，避免循环。
3. `unregister(lhs, rhs)` —— 遍历后注销。

```java
private static void reflectionAppend(...) {
    if (isRegistered(lhs, rhs)) {
        return; // 已注册，避免无限循环
    }
    try {
        register(lhs, rhs);
        // ... 遍历字段
    } finally {
        unregister(lhs, rhs);
    }
}
```

**为什么用 ThreadLocal**：注册表是遍历过程中的临时状态，线程隔离避免并发污染。

---

### 5. IDKey 身份键（Identity Key）

**核心**：用 `System.identityHashCode()` + 对象引用包装成唯一键，作为注册表的 key。

`System.identityHashCode()` 理论上可能碰撞（LANG-459 问题），因此额外用对象引用 `==` 判断：

```java
final class IDKey implements Serializable {
    private final Object value;
    private final int id;

    public IDKey(final Object obj) {
        id = System.identityHashCode(obj);
        value = obj; // 额外保留引用，消除 identityHashCode 碰撞歧义
    }

    public boolean equals(final Object other) {
        // id 相等还不够，还需 value 引用相同（==）
        return value == idKey.value;
    }
}
```

**设计意图**：注册表不能用原始对象作 key（否则调用 `hashCode()` 会与"正在计算的 hashCode"互相干扰），故用身份键替代。

---

## 三、类关系图（文字描述）

```
Builder<T>（接口，建造者核心）
   ▲
   ├── EqualsBuilder ──使用──▶ IDKey + ThreadLocal<Set<Pair<IDKey,IDKey>>>
   ├── HashCodeBuilder ──使用──▶ IDKey + ThreadLocal<Set<IDKey>>
   ├── CompareToBuilder
   └── GenericBuilder ──使用──▶ Supplier / Consumer / BiConsumer / Consumer3 + Supplier1~5
```

---

## 四、小结

| 设计模式 | 解决的问题 | 在 builder 包的体现 |
|---|---|---|
| 建造者模式 | 复杂对象分步构建 | `Builder<T>` + `build()` |
| 流式接口 | 链式调用可读性 | `append()` 返回 `this` |
| 反射 | 免手写字段遍历 | `reflectionXxx` 系列方法 |
| ThreadLocal 注册表 | 循环引用死循环 | `register/unregister` 对象对 |
| IDKey | 身份键碰撞 | `System.identityHashCode()` + 引用 |

builder 包是**建造者模式 + 流式接口 + 反射 + ThreadLocal + 身份键**组合的典型范例，主体源自 Apache Commons Lang3 的成熟实现，适合作为「如何用设计模式优雅实现 equals/hashCode/compareTo 工具」的学习参考；`GenericBuilder` 则额外展示了**函数式接口 + 泛型**实现通用 Builder 的写法。

---

## 相关

- [map包总结](/blog/ztools-map-pkg/)
