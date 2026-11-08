---
title: 'java虚拟机参数列表详细介绍基于java8'
description: 'java虚拟机参数列表详细介绍基于java8 — 来自 cc-hongz-note'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["笔记", "技术总结", "java"]
category: 'engineering'
---

# step1: 状态选项说明

| 参数  | 描述                                                         |
| ----- | ------------------------------------------------------------ |
| -XX:+ | 打开选项                                                     |
| -XX:- | 关闭选项                                                     |
| -XX:= | 数字可以包括兆字节的“m”或“M”，千字节的“k”或“K”以及千兆字节的“g”或“G”（例如，32k与32768相同） |
| -XX:= | 通常用于指定文件，路径或命令列表                             |

------

# step2: 行为选项

| 参数                         | 默认值 | 描述                                                         |
| ---------------------------- | ------ | ------------------------------------------------------------ |
| -XX:-AllowUserSignalHandlers | 不启用 | 允许用户在应用中捕捉信号 (只和Solaris和Linux有关)            |
| -XX:AltStackSize=16384       | 不启用 | 备用信号堆栈大小(以字节为单位)(仅与Solaris相关，从5.0中删除) |
| -XX:-DisableExplicitGC       | 不启用 | 禁止调用System.gc(), JVM 依然在必要时执行垃圾回收。          |
| -XX:+FailOverToOldVerifier   | 启用   | 当新类型检查器失败时，请转到旧验证程序。(1.6引入)            |
| -XX:+HandlePromotionFailure  | 启用   | 关闭新生代收集担保。                                         |
| -XX:+MaxFDLimit              | 启用   | 设置java进程可用文件描述符为操作系统允许的最大值。(限于Solaris) |
| -XX:PreBlockSpin=10          | 启用   | 控制输入操作系统线程同步代码之前允许的最大自旋迭代           |
| -XX:-RelaxAccessControlCheck | 不启用 | 在Class校验器里，放松对访问控制的检查。                      |
| -XX:+ScavengeBeforeFullGC    | 启用   | 在Full GC前触发一次Minor GC                                  |
| -XX:+UseAltSigs              | 启用   | 为了防止与其他发送信号的应用程序冲突，允许使用候补信号替代 SIGUSR1和SIGUSR2(限于Solaris) |
| -XX:+UseBoundThreads         | 启用   | 绑定所有的用户线程到内核线程，减少线程进入饥饿状态（得不到任何cpu time）的次数(限于Solaris) |
| -XX:-UseConcMarkSweepGC      | 不启用 | 启用CMS低停顿垃圾收集器                                      |
| -XX:+UseGCOverheadLimit      | 启用   | 限制GC的运行时间。如果GC耗时过长，就抛OOM                    |
| -XX:+UseLWPSynchronization   | 启用   | 使用轻量级进程（内核线程）替换线程同步(限于Solaris)          |
| -XX:-UseParallelGC           | 不启用 | 策略为新生代使用并行清除，年老代使用单线程Mark-Sweep-Compact清除的垃圾收集器 |
| -XX:-UseParallelOldGC        | 不启用 | 策略为老年代和新生代都使用并行清除的垃圾收集器               |
| -XX:-UseSerialGC             | 不启用 | 使用串行垃圾收集器                                           |
| -XX:-UseSpinning             | 启用   | 启用多线程自旋锁优化                                         |
| -XX:+UseTLAB                 | 启用   | 启用线程本地缓存区（Thread Local）                           |
| -XX:+UseSplitVerifier        | 启用   | 使用新的Class类型校验器                                      |
| -XX:+UseThreadPriorities     | 启用   | 使用本地线程的优先级                                         |
| -XX:+UseVMInterruptibleIO    | 启用   | 在solaris中，允许运行时中断线程(限于solaris)                 |

------

# step3: 垃圾收集选项

| 参数                                 | 默认值   | 描述                                                         |
| ------------------------------------ | -------- | ------------------------------------------------------------ |
| -XX:+UseG1GC                         | 开启     | 优先使用G1收集器                                             |
| -XX:MaxGCPauseMillis=n               | 无       | 最大GC暂停时间(毫秒)()                                       |
| -XX:InitiatingHeapOccupancyPercent=n | 45       | 启动并发GC周期的(整个)堆占用率的百分比                       |
| -XX:SurvivorRatio=n                  | 8        | eden/survivor空间大小之比                                    |
| -XX:MaxTenuringThreshold=n           | 15       | 延长阈值的最大值                                             |
| -XX:ParallelGCThreads=n              |          | 设置垃圾收集器并行阶段使用的线程数                           |
| -XX:ConcGCThreads=n                  |          | 并发垃圾收集器将使用的线程数                                 |
| -XX:G1ReservePercent=n               | 10       | 设置作为错误上限保留的堆的数量，以减少升级失败的可能性       |
| -XX:G1HeapRegionSize=n               | 随堆内存 | 对于G1，java堆被细分为大小一致的区域。这设置了各个分区的大小 |
| -XX:PretenureSizeThreshold=n         |          | 设置大内存进入老年代阈值，只对Serial和ParNew收集器有效果     |

------

# step4: 性能调优选项

| 参数                          | 默认值   | 描述                                                         |
| ----------------------------- | -------- | ------------------------------------------------------------ |
| -XX:+AggressiveOpts           | 启用     | 启用JVM开发团队最新的调优成果。例如编译优化，偏向锁，并行年老代收集等 |
| -XX:CompileThreshold=10000    | 1000     | JIT将方法编译成机器码的触发阀值，可以理解为调用方法的次数，例如调1000次，这编译为机器码 |
| -XX:LargePageSizeInBytes=4m   | 4m       | 设置堆的内存页大小                                           |
| -XX:MaxHeapFreeRatio=70       | 70       | GC后，如果发现空闲堆内存占到整个预估堆内存的70%，则收缩堆内存预估最大值 |
| -XX:MaxNewSize=size           | 根据系统 | 新生代占整个堆内存的最大值                                   |
| -XX:MaxPermSize=64m           | 64m      | Perm占整个堆内存的最大值                                     |
| -XX:MinHeapFreeRatio=40       | 40       | GC后，如果发现空闲堆内存占到整个预估堆内存的40%，则放大堆内存的预估最大值，但不超过固定最大值 |
| -XX:NewRatio=2                | 老/新    | 新生代和年老代的堆内存占用比例                               |
| -XX:NewSize=2m                | 2m       | 新生代预估堆内存占用的默认值                                 |
| -XX:ReservedCodeCacheSize=32m | 32m      | 设置代码缓存的最大值，编译用                                 |
| -XX:SurvivorRatio=8           | 8        | Eden与Survivor的占用比例                                     |
| -XX:TargetSurvivorRatio=50    | 50       | 实际使用的survivor空间大小占比。默认是50%，最高90%           |
| -XX:ThreadStackSize=512       | 512      | 线程堆栈大小                                                 |
| -XX:+UseBiasedLocking         | 启用     | 启用偏向锁                                                   |
| -XX:+UseFastAccessorMethods   | 启用     | 启用原始类型的getter方法优化                                 |
| -XX:-UseISM                   | 不启用   | 启用solaris的ISM                                             |
| -XX:+UseLargePages            | 启用     | 启用大内存分页                                               |
| -XX:+UseMPSS                  | 不启用   | 启用solaris的MPSS，不能与ISM同时使用                         |
| -XX:+UseStringCache           | 启用     | 启用通常分配的字符串的缓存                                   |
| -XX:AllocatePrefetchLines=1   | 1        | 使用jit编译代码中生成的预取指令在上次对象分配后加载的缓存行数 |
| -XX:AllocatePrefetchStyle=1   | 1        | 为预取指令生成的代码样式。0-没有预取指令生成*d*，1-在每次分配后执行预取指令，2-在执行预取指令时使用TLAB分配水印指针到门 |
| -XX:+UseCompressedStrings     | 启用     | 对字符串使用字节[]，这些字符串可以表示为纯ascii              |
| -XX:+OptimizeStringConcat     | 启用     | 尽可能优化字符串连接操作                                     |

------

# step5:  调试选项

| 参数                              | 默认值 | 描述                                                         |
| --------------------------------- | ------ | ------------------------------------------------------------ |
| -XX:-CITime                       | 不启用 | 打印JIT编译器编译耗时                                        |
| -XX:ErrorFile=./hs_err_pid.log    |        | 如果JVM crash后，将错误日志输出到指定目录                    |
| -XX:-ExtendedDTraceProbes         | 不启用 | 启用[dtrace](http://java.sun.com/javase/6/docs/technotes/guides/vm/dtrace.html)诊断 |
| -XX:HeapDumpPath=./java_pid.hprof |        | 堆内存快照的存储路径                                         |
| -XX:-HeapDumpOnOutOfMemoryError   | 不启用 | 在OOM时，输出一个dump.core文件，记录当时的堆内存快照         |
| -XX:OnError=”;”                   |        | 当java每抛出一个ERROR时，运行指定命令行指令集。指令集是与OS环境相关的，在linux下多数是bash脚本，windows下是某个dos批处理 |
| -XX:OnOutOfMemoryError=”; “       |        | 当第一次OOM时，运行指定命令行指令集。指令集是与OS环境相关的，在linux下多数是bash脚本，windows下是某个dos批处理 |
| -XX:-PrintClassHistogram          | 不启用 | 打印class柱状图，图中除了class，还有该class的instance统计信息 |
| -XX:-PrintConcurrentLocks         | 不启用 | 在线程dump时，顺便打印java.util.concurrent锁状态             |
| -XX:-PrintCommandLineFlags        | 不启用 | Java启动时，往stdout打印当前启用的非稳态jvm options          |
| -XX:-PrintCompilation             | 不启用 | 打印方法被JIT编译时的信息到stdout                            |
| -XX:-PrintGC                      | 不启用 | 开启GC日志打印                                               |
| -XX:-PrintGCDetails               | 不启用 | 打印GC回收的细节                                             |
| -XX:-PrintGCTimeStamps            | 不启用 | 打印GC停顿耗时                                               |
| -XX:-PrintTenuringDistribution    | 不启用 | 打印对象的存活期限信息                                       |
| -XX:-PrintAdaptiveSizePolicy      | 不启用 | 支持有关自适应生成调整大小的信息的打印                       |
| -XX:-TraceClassLoading            | 不启用 | 打印class装载信息到stdout。记Loaded状态                      |
| -XX:-PrintTenuringDistribution    | 不启用 | 打印对象的存活期限信息                                       |
| -XX:-PrintAdaptiveSizePolicy      | 不启用 | 打印自适应收集的大小                                         |
| -XX:-TraceClassLoadingPreorder    | 不启用 | 按class的引用/依赖顺序打印类装载信息到stdout。不同于TraceClassLoading，本选项只记 Loading状态 |
| -XX:-TraceClassResolution         | 不启用 | 打印所有静态类，常量的代码引用位置。用于debug                |
| -XX:-TraceClassUnloading          | 不启用 | 打印class的卸载信息到stdout。记Unloaded状态                  |
| -XX:-TraceLoaderConstraints       | 不启用 | 打印class的装载策略变化信息到stdout                          |
| -XX:+PerfDataSaveToFile           | 不启用 | 在退出时保存jvmstat二进制数据                                |
| -XX:ParallelGCThreads=n           |        | 设置新旧并行垃圾收集器中的垃圾收集线程数                     |
| -XX:+UseCompressedOops            | 不启用 | 启用使用压缩指针(对象引用表示为32位偏移量而不是64位指针)来优化64位性能，java堆大小小于32 GB |
| -XX:+AlwaysPreTouch               | 不启用 | 在JVM初始化期间预先触摸Java堆。因此，堆的每一页在初始化时都会被要求归零，而不是在应用程序执行期间递增 |
| -XX:AllocatePrefetchDistance=n    |        | 设置对象分配的预取距离。要用新对象的值写入的内存将在上次分配对象的地址之外这个距离(以字节为单位)预取到缓存中。每个java线程都有自己的分配点。默认值随运行jvm的平台而变化 |
| -XX:InlineSmallCode=n             |        | 只有在生成的本机代码大小小于此的情况下，才能内联以前编译的方法。默认值随运行jvm的平台而变化 |
| -XX:MaxInlineSize=35              | 35     | 要内联的方法的最大字节码大小                                 |
| -XX:FreqInlineSize=n              |        | 要内联的频繁执行方法的最大字节码大小。缺省值随运行JVM的平台而变化 |
| -XX:LoopUnrollLimit=n             |        | 展开具有服务器编译器中间表示节点数小于此值的循环体。服务器编译器使用的限制是此值的函数，而不是实际值。默认值随运行jvm的平台而变化 |
| -XX:InitialTenuringThreshold=7    |        | 在并行年轻收集器中设置用于自适应GC大小调整的初始延长阈值。延长阈值是指对象在被提升到老一代或终身代之前幸存于一个年轻集合的次数 |
| -XX:MaxTenuringThreshold=n        |        | 设置用于自适应GC大小调整的最大延长阈值。当前最大值为15。对于并行收集器，默认值为15，对于cms，默认值为4 |
| -Xloggc:                          |        | 将GC详细输出记录到指定文件。详细输出由普通的详细gc标志控制   |
| -XX:-UseGCLogFileRotation         | 不启用 | 启用gc日志旋转，要求-xloggc                                  |
| -XX:NumberOfGClogFiles=1          |        | 设置旋转日志时要使用的文件数，必须为>=1                      |
| -XX:GCLogFileSize=8K              |        | 将旋转日志的日志文件的大小必须>=8k                           |
