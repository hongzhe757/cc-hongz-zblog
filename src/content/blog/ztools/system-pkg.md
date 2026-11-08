---
title: 'system 包（系统信息采集）总结'
description: 'system 包是 system 模块的全部内容（14 类），分根包（11 类）+ oshi 子包（3 类）：'
pubDate: 'Nov 08 2026'
heroImage: '../../../assets/blog-placeholder-4.jpg'
tags: ["ztools", "系统"]
category: 'ztools'
---

# system 包（系统信息采集）总结

> 源码位置：`cc-hongz-ztools/cc-hongz-ztools-system/src/main/java/cc/hongz/ztools/system`
>
> 对照基准：hutool 5.8.48（`cn.hutool.system`）

---

## 一、包概览

system 包是 system 模块的**全部内容**（14 类），分根包（11 类）+ oshi 子包（3 类）：

| 类别 | 类 | 职责 |
|---|---|---|
| **统一入口** | `SystemUtil` | 系统信息统一静态入口（Facade），继承 `SystemPropsUtil`，聚合各 XxxInfo |
| **常量池** | `SystemPropsKeys` | 系统属性名常量接口（`java.version`/`os.name` 等 31 个 key） |
| **Java 信息** | `JavaInfo` / `JavaSpecInfo` / `JavaRuntimeInfo` | Java 实现、规范、JRE 运行时信息（版本/厂商/classpath 等） |
| **JVM 信息** | `JvmInfo` / `JvmSpecInfo` | JVM 实现、规范信息（名称/版本/厂商） |
| **OS 信息** | `OsInfo` | 操作系统信息 + `isWindows`/`isLinux`/`isMac` 等平台判断 |
| **主机/用户/运行时** | `HostInfo` / `UserInfo` / `RuntimeInfo` | 主机名/IP、用户目录、JVM 内存 |
| **CPU 硬件（oshi）** | `OshiUtil` / `CpuInfo` / `CpuTicks` | OSHI 库封装，读取 CPU 核心数/负载/型号等实时信息 |

---

## 二、核心设计

### 1. SystemUtil：门面模式统一入口

`SystemUtil` 继承 core 的 `SystemPropsUtil`，并把所有信息对象的获取收敛到一组 `getXxxInfo()` 静态方法上：`getJvmInfo()`/`getOsInfo()`/`getUserInfo()`/`getHostInfo()`/`getRuntimeInfo()` 等。调用方无需知道底层读的是 `System.getProperty` 还是 `ManagementFactory`，一个类搞定所有系统信息采集。此外还提供 `dumpSystemInfo()` 一次性打印全部信息（各 XxxInfo 的 `toString()` 通过 `SystemUtil.append` 统一格式化）。

### 2. XxxInfo：懒加载单例 POJO

每个 `XxxInfo`（`JavaInfo`/`OsInfo`/`JvmInfo` 等）都是 `Serializable` 的**不可变 POJO**，字段在构造期一次性从 `SystemUtil.get(key)` 读取并 `final` 化。`SystemUtil` 通过 core 的 `Singleton.get(XxxInfo.class)` 缓存单例，避免重复读取系统属性。字段名保留 hutool 原版大写下划线风格（`JAVA_VERSION`），用 `@SuppressWarnings("checkstyle:MemberName")` 压制命名检查。

### 3. SystemPropsKeys：常量池 + 常量转发

`SystemPropsKeys` 是纯接口，集中定义 31 个 `System.getProperty` 的 key 字符串（`java.version`/`os.name`/`user.home`/`file.separator` 等）。`SystemUtil` 用 `public static final String VERSION = SystemPropsKeys.VERSION;` 的形式逐条转发，保证调用方既可用 `SystemPropsKeys.VERSION` 也可用 `SystemUtil.VERSION`，且 key 只有一份定义源。

### 4. OsInfo：平台判断

`OsInfo` 除提供 `getName()`/`getArch()`/`getVersion()` 外，还内置 20+ 个 `isWindows()`/`isLinux()`/`isMac()`/`isWindows10()` 等判断方法，内部用 `getOSMatches(namePrefix, versionPrefix)` 匹配 `os.name` + `os.version` 前缀，是跨平台分支判断的常用工具。`isWindows10` 还额外排除 `isWindows11`（两者 `os.name` 相同、按版本区分）。

### 5. oshi 子包：两次采样计算 CPU 负载

`OshiUtil` 用静态块初始化 OSHI 的 `SystemInfo`/`HardwareAbstractionLayer`/`OperatingSystem`，提供 `getProcessor()`/`getMemory()`/`getDiskStores()`/`getNetworkIFs()` 等硬件访问。`CpuTicks` 的构造先取一次 `getSystemCpuLoadTicks()`，`Util.sleep(waitingTime)` 等待后再取一次，用两次 tick 的差值计算一段时间内的 CPU 负载（user/sys/idle/iowait 等），避免瞬时值抖动。`CpuInfo` 再把各 tick 换算成百分比（`100 * tick / totalCpu`，保留两位小数）。

---

## 三、面试高频问题

**Q1：怎么拿到 JVM 的内存信息？`Runtime` 和 `ManagementFactory` 有什么区别？**

- `Runtime.getRuntime()`：只提供 `totalMemory`/`freeMemory`/`maxMemory` 三个粗粒度堆内存指标（`RuntimeInfo` 封装的就是它）。
- `ManagementFactory`：JMX 入口，可拿 `MemoryMXBean`（堆/非堆）、`MemoryPoolMXBean`（各内存池）、`GarbageCollectorMXBean`（GC 次数/耗时）、`ThreadMXBean`（线程）等更细的运行时指标（`SystemUtil` 的 `getMemoryMXBean()` 系列封装的就是它）。
- 粗看内存用 Runtime 即可，做监控/诊断要上 ManagementFactory。

**Q2：`JavaInfo` 里的 `getVersionFloat()` 和 `getVersionInt()` 是怎么算版本号的？**

- `java.version` 是字符串（如 `1.8.0_301`、`17.0.1`），不能直接比较大小。
- `getVersionFloat()` 用正则 `^[0-9]{1,2}(\.[0-9]{1,2})?` 取前两位（`17.0.1` → `17.0`），转 float。
- `getVersionInt()` 取 `^[0-9]{1,2}(\.[0-9]{1,2}){0,2}` 后去掉小数点拼接，且主版本超过 1 位（Java 10+）时补零到 4 位（`17.0.1` → `170001`），保证跨版本可比。
- 判断版本时用 `isJavaVersionAtLeast()` 而不是字符串比较，就是这个原因。

**Q3：OSHI 读 CPU 使用率为什么要 sleep 一段等待时间？**

- CPU 使用率是「一段时间内忙的占比」，OSHI 只能拿到累计 tick 计数（`getSystemCpuLoadTicks()`），不是瞬时百分比。
- 所以要「采样两次、相减」：先取一次 tick 快照，`sleep(waitingTime)`（如 1000ms），再取一次，差值就是这段时间内各状态（user/sys/idle/iowait）的增量。
- `CpuTicks` 构造里的 `Util.sleep` 和 `tick(prev, cur, type)` 做的就是这件事。

**Q4：`SystemUtil` 和 `SystemPropsUtil` 是什么关系？**

- `SystemPropsUtil` 在 core 模块，提供最基础的 `get(key)`/`set(key, value)`（包装 `System.getProperty`/`setProperty`）。
- `SystemUtil` 继承它，在「读取系统属性」基础上再叠加「语义化封装」：常量转发（`SystemPropsKeys`）、`getXxxInfo()` 单例 POJO、`ManagementFactory` MXBean 访问、`dumpSystemInfo()`。
- 这符合 hutool 的分层思路：core 只放通用工具，system 模块做领域化扩展。

---

## 相关

- [system模块总结](/blog/system-module/) — 上级 MOC
- [core模块总结](/blog/ztools-core-module/) — 上游 core 模块
- [util包总结](/blog/ztools-util-pkg/) — `SystemPropsUtil` 来源
- [net包总结](/blog/ztools-net-pkg/) — `HostInfo` 用到的 `NetUtil`
