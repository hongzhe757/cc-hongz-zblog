---
title: 'math 包（数学工具）总结'
description: 'math 包提供数学计算相关工具，覆盖排列组合、表达式求值、货币运算、位状态标记等：'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-4.jpg'
---

# math 包（数学工具）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-core/src/main/java/cc/hongz/ztools/core/math`
>
> 对照基准：hutool 5.8.47（`cn.hutool.core.math`）

---

## 一、包概览

math 包提供**数学计算**相关工具，覆盖排列组合、表达式求值、货币运算、位状态标记等：

| 类 | 职责 |
|---|---|
| `MathUtil` | 数学工具：加减乘除（保留精度）、幂、阶乘、最大公约数、随机数、整除取余等 |
| `Calculator` | 算术表达式求值（`7+3`、`5+12*(3+5)/7`），中缀转后缀再计算 |
| `Money` | 单币种货币类，以「分」为单位存 `long`，处理元/分换算与四舍五入 |
| `Arrangement` | 排列 A(n,m)，有顺序的选取 |
| `Combination` | 组合 C(n,m)，无顺序的选取 |
| `BitStatusUtil` | 位状态：用 `int/long` 的每个 bit 表示一个开关状态，高效存储多个布尔状态 |

---

## 二、核心设计

### 1. Calculator：中缀 → 后缀（逆波兰）

表达式求值经典做法：把人类写的中缀表达式 `5+12*(3+5)/7` 转成后缀（逆波兰）再压栈计算。利用运算符优先级表和两个栈（操作数栈 + 运算符栈）实现，避免递归解析括号的复杂度。

### 2. Money：用整数代替浮点存钱

`Money` 内部用 `long cent`（分）存金额，币种默认 CNY。**避免 `double/float` 存钱产生的精度丢失**（如 `0.1+0.2 != 0.3`）。默认取整模式 `RoundingMode.HALF_EVEN`（银行家舍入）。

### 3. 排列组合：回溯枚举

`Arrangement` / `Combination` 通过递归回溯枚举所有选择结果，用于抽奖、组合测试、穷举等场景。

### 4. BitStatusUtil：位图标记状态

用 `int`/`long` 每个 bit 的 0/1 表示一个开关状态，`check/add/remove` 用位运算完成。相比多个 boolean 字段，一个 `int` 可表示 32 个状态，内存占用极小。

---

## 三、面试高频问题

**Q1：为什么金额不能用 double/float 表示？**

- 二进制浮点无法精确表示十进制小数（0.1 是无限循环小数），累加会产生误差。金额用最小单位（分）的整数 `long` 存储，运算后用整数或 `BigDecimal` 保证精度。

**Q2：HALF_EVEN（银行家舍入）和 HALF_UP 的区别？**

- HALF_UP 逢 5 进 1（1.5→2，2.5→3），大量舍入会累积正偏差。HALF_EVEN 向最接近的偶数舍入（1.5→2，2.5→2），整体偏差更小，是金融默认。

**Q3：逆波兰表达式求值的原理？**

- 中缀表达式有括号和优先级，机器难直接算。转成后缀后无括号，从左到右扫描：遇数入栈，遇运算符弹两个操作数计算再入栈，最后栈顶即结果。

**Q4：排列和组合的区别？**

- 排列 A(n,m) 讲究顺序（AB 和 BA 不同），组合 C(n,m) 不讲究顺序（AB 和 BA 相同）。密码、排队用排列；选人、抽签用组合。

---

## 四、应用场景

| 场景 | 对应类 |
|---|---|
| 算术验证码解析 | `Calculator` |
| 金额计算（下单/结算） | `Money` |
| 抽奖 / 组合测试用例生成 | `Arrangement` / `Combination` |
| 权限开关、多状态标记 | `BitStatusUtil` |
| 数值运算（精度保留） | `MathUtil` |

---

## 五、当前状态

- **文件**：6 个类 + `package-info`，与 hutool 5.8.47 对齐。
- **单元测试**：6 个测试类，中文 `@DisplayName`，逐类覆盖。
- **checkstyle**：**0 违规**。处理要点：`Calculator` 运算符优先级表、`Money` 元分换算比例等算法常量用 `@SuppressWarnings("checkstyle:MagicNumber")`。

---

## 相关

- [util包总结](/blog/ztools-util-pkg/)
