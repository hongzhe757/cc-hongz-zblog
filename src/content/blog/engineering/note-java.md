---
title: 'java官方参数列表'
description: 'Java Platform, Standard Edition Tools Reference'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["笔记", "技术总结", "java"]
category: 'engineering'
---

> 备注：  未标明是基于那个jdk那个虚拟机的！

```tex

Java Platform, Standard Edition Tools Reference
Contents Previous Next

classname

The name of the class to be launched.

filename

The name of the Java Archive (JAR) file to be called. Used only with the -jar option.

args

The arguments passed to the main() method separated by spaces.

Standard options are guaranteed to be supported by all implementations of the Java Virtual Machine (JVM). They are used for common actions, such as checking the version of the JRE, setting the class path, enabling verbose output, and so on.

Non-standard options are general purpose options that are specific to the Java HotSpot Virtual Machine, so they are not guaranteed to be supported by all JVM implementations, and are subject to change. These options start with -X.

Advanced options are not recommended for casual use. These are developer options used for tuning specific areas of the Java HotSpot Virtual Machine operation that often have specific system requirements and may require privileged access to system configuration parameters. They are also not guaranteed to be supported by all JVM implementations, and are subject to change. Advanced options start with -XX.

To keep track of the options that were deprecated or removed in the latest release, there is a section named at the end of the document.

Boolean options are used to either enable a feature that is disabled by default or disable a feature that is enabled by default. Such options do not require a parameter. Boolean -XX options are enabled using the plus sign (-XX:+OptionName) and disabled using the minus sign (-XX:-OptionName).

For options that require an argument, the argument may be separated from the option name by a space, a colon (:), or an equal sign (=), or the argument may directly follow the option (the exact syntax differs for each option). If you are expected to specify the size in bytes, you can use no suffix, or use the suffix k or K for kilobytes (KB), m or M for megabytes (MB), g or G for gigabytes (GB). For example, to set the size to 8 GB, you can specify either 8g, 8192m, 8388608k, or 8589934592 as the argument. If you are expected to specify the percentage, use a number from 0 to 1 (for example, specify 0.25 for 25%).

-agentpath:pathname[=options]

Loads the native agent library specified by the absolute path name. This option is equivalent to -agentlib but uses the full path and file name of the library.

-client

Selects the Java HotSpot Client VM. The 64-bit version of the Java SE Development Kit (JDK) currently ignores this option and instead uses the Server JVM.For default JVM selection, see Server-Class Machine Detection at http://docs.oracle.com/javase/8/docs/technotes/guides/vm/server-class.html

-Dproperty=value

Sets a system property value. The property variable is a string with no spaces that represents the name of the property. The value variable is a string that represents the value of the property. If value is a string with spaces, then enclose it in quotation marks (for example -Dfoo="foo bar").

-d32

Runs the application in a 32-bit environment. If a 32-bit environment is not installed or is not supported, then an error will be reported. By default, the application is run in a 32-bit environment unless a 64-bit system is used.

-d64

Runs the application in a 64-bit environment. If a 64-bit environment is not installed or is not supported, then an error will be reported. By default, the application is run in a 32-bit environment unless a 64-bit system is used.Currently only the Java HotSpot Server VM supports 64-bit operation, and the -server option is implicit with the use of -d64. The -client option is ignored with the use of -d64. This is subject to change in a future release.

-disableassertions[:[packagename]…|:classname]

-da[:[packagename]…|:classname]

Disables assertions. By default, assertions are disabled in all packages and classes.With no arguments, -disableassertions (-da) disables assertions in all packages and classes. With the packagename argument ending in ..., the switch disables assertions in the specified package and any subpackages. If the argument is simply ..., then the switch disables assertions in the unnamed package in the current working directory. With the classname argument, the switch disables assertions in the specified class.The -disableassertions (-da) option applies to all class loaders and to system classes (which do not have a class loader). There is one exception to this rule: if the option is provided with no arguments, then it does not apply to system classes. This makes it easy to disable assertions in all classes except for system classes. The -disablesystemassertions option enables you to disable assertions in all system classes.To explicitly enable assertions in specific packages or classes, use the -enableassertions (-ea) option. Both options can be used at the same time. For example, to run the MyClass application with assertions enabled in package com.wombat.fruitbat (and any subpackages) but disabled in class com.wombat.fruitbat.Brickbat, use the following command:java -ea:com.wombat.fruitbat... -da:com.wombat.fruitbat.Brickbat MyClass 

-disablesystemassertions

-dsa

Disables assertions in all system classes.

-enableassertions[:[packagename]…|:classname]

-ea[:[packagename]…|:classname]

Enables assertions. By default, assertions are disabled in all packages and classes.With no arguments, -enableassertions (-ea) enables assertions in all packages and classes. With the packagename argument ending in ..., the switch enables assertions in the specified package and any subpackages. If the argument is simply ..., then the switch enables assertions in the unnamed package in the current working directory. With the classname argument, the switch enables assertions in the specified class.The -enableassertions (-ea) option applies to all class loaders and to system classes (which do not have a class loader). There is one exception to this rule: if the option is provided with no arguments, then it does not apply to system classes. This makes it easy to enable assertions in all classes except for system classes. The -enablesystemassertions option provides a separate switch to enable assertions in all system classes.To explicitly disable assertions in specific packages or classes, use the -disableassertions (-da) option. If a single command contains multiple instances of these switches, then they are processed in order before loading any classes. For example, to run the MyClass application with assertions enabled only in package com.wombat.fruitbat (and any subpackages) but disabled in class com.wombat.fruitbat.Brickbat, use the following command:java -ea:com.wombat.fruitbat... -da:com.wombat.fruitbat.Brickbat MyClass 

-enablesystemassertions

-esa

Enables assertions in all system classes.

-help

-?

Displays usage information for the command without actually running the JVM.

-jar filename

Executes a program encapsulated in a JAR file. The filename argument is the name of a JAR file with a manifest that contains a line in the form Main-Class:``classname that defines the class with the public static void main(String[] args) method that serves as your application’s starting point.When you use the -jar option, the specified JAR file is the source of all user classes, and other class path settings are ignored.For more information about JAR files, see the following resources:jar(1)The Java Archive (JAR) Files guide at http://docs.oracle.com/javase/8/docs/technotes/guides/jar/index.htmlLesson: Packaging Programs in JAR Files at http://docs.oracle.com/javase/tutorial/deployment/jar/index.html

-javaagent:jarpath[=options]

Loads the specified Java programming language agent. For more information about instrumenting Java applications, see the java.lang.instrument package description in the Java API documentation at http://docs.oracle.com/javase/8/docs/api/java/lang/instrument/package-summary.html

-jre-restrict-search

Includes user-private JREs in the version search.

-no-jre-restrict-search

Excludes user-private JREs from the version search.

-server

Selects the Java HotSpot Server VM. The 64-bit version of the JDK supports only the Server VM, so in that case the option is implicit.For default JVM selection, see Server-Class Machine Detection at http://docs.oracle.com/javase/8/docs/technotes/guides/vm/server-class.html

-showversion

Displays version information and continues execution of the application. This option is equivalent to the -version option except that the latter instructs the JVM to exit after displaying version information.

-splash:imgname

Shows the splash screen with the image specified by imgname. For example, to show the splash.gif file from the images directory when starting your application, use the following option:-splash:images/splash.gif 

-verbose:class

Displays information about each loaded class.

-verbose:gc

Displays information about each garbage collection (GC) event.

-verbose:jni

Displays information about the use of native methods and other Java Native Interface (JNI) activity.

-version

Displays version information and then exits. This option is equivalent to the -showversion option except that the latter does not instruct the JVM to exit after displaying version information.

-version:release

Specifies the release version to be used for running the application. If the version of the java command called does not meet this specification and an appropriate implementation is found on the system, then the appropriate implementation will be used.The release argument specifies either the exact version string, or a list of version strings and ranges separated by spaces. A version string is the developer designation of the version number in the following form: 1.x.0_u (where x is the major version number, and u is the update version number). A version range is made up of a version string followed by a plus sign (+) to designate this version or later, or a part of a version string followed by an asterisk (*) to designate any version string with a matching prefix. Version strings and ranges can be combined using a space for a logical OR combination, or an ampersand (&) for a logical AND combination of two version strings/ranges. For example, if running the class or JAR file requires either JRE 6u13 (1.6.0_13), or any JRE 6 starting from 6u10 (1.6.0_10), specify the following:-version:"1.6.0_13 1.6* & 1.6.0_10+" Quotation marks are necessary only if there are spaces in the release parameter.For JAR files, the preference is to specify version requirements in the JAR file manifest rather than on the command line.

-Xnoclassgc

Disables garbage collection (GC) of classes. This can save some GC time, which shortens interruptions during the application run.When you specify -Xnoclassgc at startup, the class objects in the application will be left untouched during GC and will always be considered live. This can result in more memory being permanently occupied which, if not used carefully, will throw an out of memory exception.

-Xprof

Profiles the running program and sends profiling data to standard output. This option is provided as a utility that is useful in program development and is not intended to be used in production systems.

-Xrs

Reduces the use of operating system signals by the JVM.Shutdown hooks enable orderly shutdown of a Java application by running user cleanup code (such as closing database connections) at shutdown, even if the JVM terminates abruptly.The JVM catches signals to implement shutdown hooks for unexpected termination. The JVM uses SIGHUP, SIGINT, and SIGTERM to initiate the running of shutdown hooks.The JVM uses a similar mechanism to implement the feature of dumping thread stacks for debugging purposes. The JVM uses SIGQUIT to perform thread dumps.Applications embedding the JVM frequently need to trap signals such as SIGINT or SIGTERM, which can lead to interference with the JVM signal handlers. The -Xrs option is available to address this issue. When -Xrs is used, the signal masks for SIGINT, SIGTERM, SIGHUP, and SIGQUIT are not changed by the JVM, and signal handlers for these signals are not installed.There are two consequences of specifying -Xrs:SIGQUIT thread dumps are not available.User code is responsible for causing shutdown hooks to run, for example, by calling System.exit() when the JVM is to be terminated.

-Xshare:mode

Sets the class data sharing (CDS) mode. Possible mode arguments for this option include the following:autoUse CDS if possible. This is the default value for Java HotSpot 32-Bit Client VM.onRequire the use of CDS. Print an error message and exit if class data sharing cannot be used.offDo not use CDS. This is the default value for Java HotSpot 32-Bit Server VM, Java HotSpot 64-Bit Client VM, and Java HotSpot 64-Bit Server VM.dumpManually generate the CDS archive. Specify the application class path as described in “Setting the Class Path”.You should regenerate the CDS archive with each new JDK release.

-XshowSettings:category

Shows settings and continues. Possible category arguments for this option include the following:allShows all categories of settings. This is the default value.localeShows settings related to locale.propertiesShows settings related to system properties.vmShows the settings of the JVM.

-Xsssize

Sets the thread stack size (in bytes). Append the letter k or K to indicate KB, m or M to indicate MB, g or G to indicate GB. The default value depends on the platform:Linux/ARM (32-bit): 320 KBLinux/i386 (32-bit): 320 KBLinux/x64 (64-bit): 1024 KBOS X (64-bit): 1024 KBOracle Solaris/i386 (32-bit): 320 KBOracle Solaris/x64 (64-bit): 1024 KBThe following examples set the thread stack size to 1024 KB in different units:-Xss1m -Xss1024k -Xss1048576 This option is equivalent to -XX:ThreadStackSize.

-Xusealtsigs

Use alternative signals instead of SIGUSR1 and SIGUSR2 for JVM internal signals. This option is equivalent to -XX:+UseAltSigs.

-Xverify:mode

Sets the mode of the bytecode verifier. Bytecode verification ensures that class files are properly formed and satisfy the constraints listed in section 4.10, Verification of class Files in the The Java Virtual Machine Specification.Do not turn off verification as this reduces the protection provided by Java and could cause problems due to ill-formed class files.Possible mode arguments for this option include the following:remoteVerifies all bytecodes not loaded by the bootstrap class loader. This is the default behavior if you do not specify the -Xverify option.allEnables verification of all bytecodes.noneDisables verification of all bytecodes. Use of -Xverify:none is unsupported.

-XX:-PreferContainerQuotaForCPUCount

If true, then calculate the container CPU availability based on the value of its CPU CFS (Completely Fair Scheduler) quota (if set). If false, then use the CPU shares value instead, provided it is less than the CPU quota value.The VM uses the container CPU availability value to calculate the number of available processors if you haven’t specified it with the -XX:ActiveProcessorCount option.Note: The CPU count will never exceed the number of active processors available to the process. Active processors may have been limited by having them disabled or by selecting a cpuset (a list of CPUs; see the PrintContainerInfo option) for a container.

-XX:+PrintCommandLineFlags

Enables printing of ergonomically selected JVM flags that appeared on the command line. It can be useful to know the ergonomic values set by the JVM, such as the heap space size and the selected garbage collector. By default, this option is disabled and flags are not printed.

-XX:+PrintContainerInfo

Prints the following information about the container:cpuset.cpus: A comma-separated list or hyphen-separated range of CPUs or cores a container can use provided that you have more than one CPU or core. For example, the value 0-3 means that the container can use the first, second, third, and fourth CPU.cpuset.mems: A comma-separated list or hyphen-separated range of memory nodes (MEMs) in which to allow execution; running of applications; only effective on non-uniform memory access (NUMA) systems.CPU Shares: The amount of CPU shares available to the process.CPU Quota: The number of milliseconds per period process is guaranteed to run.CPU Period: The CPU Completely Fair Scheduler (CFS) period, in ms.OSContainer::active_processor_count: Number of active processors for the VM to use.Memory Limit: The maximum amount of memory the container can use, in bytes.Memory Soft Limit: The maximum amount of memory a container should use, in bytes; this limit is smaller than Memory Limit, but because this is a soft limit, the container may exceed it.Memory Usage: The amount of used memory for this process, in bytes.Maximum Memory Usage: The maximum amount of used memory for this process, in bytes.

-XX:+PrintNMTStatistics

Enables printing of collected native memory tracking data at JVM exit when native memory tracking is enabled (see -XX:NativeMemoryTracking). By default, this option is disabled and native memory tracking data is not printed.

-XX:+RelaxAccessControlCheck

Decreases the amount of access control checks in the verifier. By default, this option is disabled, and it is ignored (that is, treated as disabled) for classes with a recent bytecode version. You can enable it for classes with older versions of the bytecode.

-XX:+ResourceManagement

Enables the use of Resource Management during the runtime of the application.This is a commercial feature that requires you to also specify the -XX:+UnlockCommercialFeatures option as follows:java -XX:+UnlockCommercialFeatures -XX:+ResourceManagement

-XX:ResourceManagementSampleInterval=value (milliseconds)

Sets the parameter that controls the sampling interval for Resource Management measurements, in milliseconds.This option can be used only when Resource Management is enabled (that is, the -XX:+ResourceManagement option is specified).

-XX:SharedArchiveFile=path

Specifies the path and name of the class data sharing (CDS) archive file

-XX:SharedClassListFile=file_name

Specifies the text file that contains the names of the class files to store in the class data sharing (CDS) archive. This file contains the full name of one class file per line, except slashes (/) replace dots (.). For example, to specify the classes java.lang.Object and hello.Main, create a text file that contains the following two lines:java/lang/Object hello/Main The class files that you specify in this text file should include the classes that are commonly used by the application. They may include any classes from the application, extension, or bootstrap class paths.

-XX:+ShowMessageBoxOnError

Enables displaying of a dialog box when the JVM experiences an irrecoverable error. This prevents the JVM from exiting and keeps the process active so that you can attach a debugger to it to investigate the cause of the error. By default, this option is disabled.

-XX:StartFlightRecording=parameter=value

Starts a JFR recording for the Java application. This is a commercial feature that works in conjunction with the -XX:+UnlockCommercialFeatures option. This option is equivalent to the JFR.start diagnostic command that starts a recording during runtime. You can set the following parameters when starting a JFR recording:compress={true|false}Specifies whether to compress the JFR recording log file (of type JFR) on the disk using the gzip file compression utility. This parameter is valid only if the filename parameter is specified. By default it is set to false (recording is not compressed). To enable compression, set the parameter to true.defaultrecording={true|false}Specifies whether the recording is a continuous background recording or if it runs for a limited time. By default, this parameter is set to false (recording runs for a limited time). To make the recording run continuously, set the parameter to true.delay=timeSpecifies the delay between the Java application launch time and the start of the recording. Append s to specify the time in seconds, m for minutes, h for hours, or d for days (for example, specifying 10m means 10 minutes). By default, there is no delay, and this parameter is set to 0.dumponexit={true|false}Specifies whether a dump file of JFR data should be generated when the JVM terminates in a controlled manner. By default, this parameter is set to false (dump file on exit is not generated). To enable it, set the parameter to true.The dump file is written to the location defined by the filename parameter.Example:-XX:StartFlightRecording=name=test,filename=D:\test.jfr,dumponexit=true duration=timeSpecifies the duration of the recording. Append s to specify the time in seconds, m for minutes, h for hours, or d for days (for example, specifying 5h means 5 hours). By default, the duration is not limited, and this parameter is set to 0.filename=pathSpecifies the path and name of the JFR recording log file.name=identifierSpecifies the identifier for the JFR recording. By default, it is set to Recording x.maxage=timeSpecifies the maximum age of disk data to keep for the default recording. Append s to specify the time in seconds, m for minutes, h for hours, or d for days (for example, specifying 30s means 30 seconds). By default, the maximum age is set to 15 minutes (15m).maxsize=sizeSpecifies the maximum size (in bytes) of disk data to keep for the default recording. Append k or K, to specify the size in KB, m or M to specify the size in MB, g or G to specify the size in GB. By default, the maximum size of disk data is not limited, and this parameter is set to 0.settings=pathSpecifies the path and name of the event settings file (of type JFC). By default, the default.jfc file is used, which is located in JAVA_HOME/jre/lib/jfr.You can specify values for multiple parameters by separating them with a comma. For example, to save the recording to test.jfr in the current working directory, and instruct JFR to compress the log file, specify the following:-XX:StartFlightRecording=filename=test.jfr,compress=true 

-XX:ThreadStackSize=size

Sets the thread stack size (in bytes). Append the letter k or K to indicate kilobytes, m or M to indicate megabytes, g or G to indicate gigabytes. The default value depends on the platform:Linux/ARM (32-bit): 320 KBLinux/i386 (32-bit): 320 KBLinux/x64 (64-bit): 1024 KBOS X (64-bit): 1024 KBOracle Solaris/i386 (32-bit): 320 KBOracle Solaris/x64 (64-bit): 1024 KBThe following examples show how to set the thread stack size to 1024 KB in different units:-XX:ThreadStackSize=1m -XX:ThreadStackSize=1024k -XX:ThreadStackSize=1048576 This option is equivalent to -Xss.

-XX:+TraceClassLoading

Enables tracing of classes as they are loaded. By default, this option is disabled and classes are not traced.

-XX:+TraceClassLoadingPreorder

Enables tracing of all loaded classes in the order in which they are referenced. By default, this option is disabled and classes are not traced.

-XX:+TraceClassResolution

Enables tracing of constant pool resolutions. By default, this option is disabled and constant pool resolutions are not traced.

-XX:+TraceClassUnloading

Enables tracing of classes as they are unloaded. By default, this option is disabled and classes are not traced.

-XX:+TraceLoaderConstraints

Enables tracing of the loader constraints recording. By default, this option is disabled and loader constraints recording is not traced.

-XX:+UnlockCommercialFeatures

Enables the use of commercial features. Commercial features are included with Oracle Java SE Advanced or Oracle Java SE Suite packages, as defined on the Java SE Products page at http://www.oracle.com/technetwork/java/javase/terms/products/index.htmlBy default, this option is disabled and the JVM runs without the commercial features. Once they were enabled for a JVM process, it is not possible to disable their use for that process.If this option is not provided, commercial features can still be unlocked in a running JVM by using the appropriate jcmd diagnostic commands.

-XX:+UseAltSigs

Enables the use of alternative signals instead of SIGUSR1 and SIGUSR2 for JVM internal signals. By default, this option is disabled and alternative signals are not used. This option is equivalent to -Xusealtsigs.

-XX:+UseAppCDS

Enables application class data sharing (AppCDS). To use AppCDS, you must also specify values for the options -XX:SharedClassListFile and -XX:SharedArchiveFile during both CDS dump time (see the option -Xshare:dump) and application run time.This is a commercial feature that requires you to also specify the -XX:+UnlockCommercialFeatures option. This is also an experimental feature; it may change in future releases.See .

-XX:-UseBiasedLocking

Disables the use of biased locking. Some applications with significant amounts of uncontended synchronization may attain significant speedups with this flag enabled, whereas applications with certain patterns of locking may see slowdowns. For more information about the biased locking technique, see the example in Java Tuning White Paper at http://www.oracle.com/technetwork/java/tuning-139912.html#section4.2.5By default, this option is enabled.

-XX:-UseCompressedOops

Disables the use of compressed pointers. By default, this option is enabled, and compressed pointers are used when Java heap sizes are less than 32 GB. When this option is enabled, object references are represented as 32-bit offsets instead of 64-bit pointers, which typically increases performance when running the application with Java heap sizes less than 32 GB. This option works only for 64-bit JVMs.It is also possible to use compressed pointers when Java heap sizes are greater than 32GB. See the -XX:ObjectAlignmentInBytes option.

-XX:-UseContainerSupport

The VM provides automatic container detection support, which enables the VM to determine the amount of memory and number of processors that are available to a Java process running in docker containers. It uses this information to allocate system resources. This support is only available on Linux x64 platforms. If supported, then the default value for this flag is true and container support is enabled by default. You can disable it with -XX:-UseContainerSupport.

-XX:+UseHugeTLBFS

This option for Linux is the equivalent of specifying -XX:+UseLargePages. This option is disabled by default. This option pre-allocates all large pages up-front, when memory is reserved; consequently the JVM cannot dynamically grow or shrink large pages memory areas; see -XX:UseTransparentHugePages if you want this behavior.For more information, see .

-XX:+UseLargePages

Enables the use of large page memory. By default, this option is disabled and large page memory is not used.For more information, see .

-XX:+UseMembar

Enables issuing of membars on thread state transitions. This option is disabled by default on all platforms except ARM servers, where it is enabled. (It is recommended that you do not disable this option on ARM servers.)

-XX:+UsePerfData

Enables the perfdata feature. This option is enabled by default to allow JVM monitoring and performance testing. Disabling it suppresses the creation of the hsperfdata_userid directories. To disable the perfdata feature, specify -XX:-UsePerfData.

-XX:+UseTransparentHugePages

On Linux, enables the use of large pages that can dynamically grow or shrink. This option is disabled by default. You may encounter performance problems with transparent huge pages as the OS moves other pages around to create huge pages; this option is made available for experimentation.For more information, see .

-XX:+AllowUserSignalHandlers

Enables installation of signal handlers by the application. By default, this option is disabled and the application is not allowed to install signal handlers.

-XX:InitialRAMPercentage=percent

Sets the initial amount of memory that the JVM will use for the Java heap before applying ergonomics heuristics as a percentage of the maximum amount determined as described in the -XX:MaxRAM option. The default value is 1.5625 percent.The following example shows how to set the percentage of the initial amount of memory used for the Java heap:-XX:InitialRAMPercentage=5

-XX:InitialSurvivorRatio=ratio

Sets the initial survivor space ratio used by the throughput garbage collector (which is enabled by the -XX:+UseParallelGC and/or -XX:+UseParallelOldGC options). Adaptive sizing is enabled by default with the throughput garbage collector by using the -XX:+UseParallelGC and -XX:+UseParallelOldGC options, and survivor space is resized according to the application behavior, starting with the initial value. If adaptive sizing is disabled (using the -XX:-UseAdaptiveSizePolicy option), then the -XX:SurvivorRatio option should be used to set the size of the survivor space for the entire execution of the application.The following formula can be used to calculate the initial size of survivor space (S) based on the size of the young generation (Y), and the initial survivor space ratio (R):S=Y/(R+2) The 2 in the equation denotes two survivor spaces. The larger the value specified as the initial survivor space ratio, the smaller the initial survivor space size.By default, the initial survivor space ratio is set to 8. If the default value for the young generation space size is used (2 MB), the initial size of the survivor space will be 0.2 MB.The following example shows how to set the initial survivor space ratio to 4:-XX:InitialSurvivorRatio=4 

-XX:InitiatingHeapOccupancyPercent=percent

Sets the percentage of the heap occupancy (0 to 100) at which to start a concurrent GC cycle. It is used by garbage collectors that trigger a concurrent GC cycle based on the occupancy of the entire heap, not just one of the generations (for example, the G1 garbage collector).By default, the initiating value is set to 45%. A value of 0 implies nonstop GC cycles. The following example shows how to set the initiating heap occupancy to 75%:-XX:InitiatingHeapOccupancyPercent=75 

-XX:MaxGCPauseMillis=time

Sets a target for the maximum GC pause time (in milliseconds). This is a soft goal, and the JVM will make its best effort to achieve it. By default, there is no maximum pause time value.The following example shows how to set the maximum target pause time to 500 ms:-XX:MaxGCPauseMillis=500 

-XX:MaxHeapSize=size

Sets the maximum size (in byes) of the memory allocation pool. This value must be a multiple of 1024 and greater than 2 MB. Append the letter k or K to indicate kilobytes, m or M to indicate megabytes, g or G to indicate gigabytes. The default value is chosen at runtime based on system configuration. For server deployments, -XX:InitialHeapSize and -XX:MaxHeapSize are often set to the same value. See the section “Ergonomics” in Java SE HotSpot Virtual Machine Garbage Collection Tuning Guide at http://docs.oracle.com/javase/8/docs/technotes/guides/vm/gctuning/index.html.The following examples show how to set the maximum allowed size of allocated memory to 80 MB using various units:-XX:MaxHeapSize=83886080 -XX:MaxHeapSize=81920k -XX:MaxHeapSize=80m On Oracle Solaris 7 and Oracle Solaris 8 SPARC platforms, the upper limit for this value is approximately 4,000 MB minus overhead amounts. On Oracle Solaris 2.6 and x86 platforms, the upper limit is approximately 2,000 MB minus overhead amounts. On Linux platforms, the upper limit is approximately 2,000 MB minus overhead amounts.The -XX:MaxHeapSize option is equivalent to -Xmx.

-XX:MaxHeapFreeRatio=percent

Sets the maximum allowed percentage of free heap space (0 to 100) after a GC event. If free heap space expands above this value, then the heap will be shrunk. By default, this value is set to 70%.The following example shows how to set the maximum free heap ratio to 75%:-XX:MaxHeapFreeRatio=75 

-XX:MaxMetaspaceSize=size

Sets the maximum amount of native memory that can be allocated for class metadata. By default, the size is not limited. The amount of metadata for an application depends on the application itself, other running applications, and the amount of memory available on the system.The following example shows how to set the maximum class metadata size to 256 MB:-XX:MaxMetaspaceSize=256m 

-XX:MaxNewSize=size

Sets the maximum size (in bytes) of the heap for the young generation (nursery). The default value is set ergonomically.

-XX:MaxRAMPercentage=percent

Sets the maximum amount of memory that the JVM may use for the Java heap before applying ergonomics heuristics as a percentage of the maximum amount determined as described in the -XX:MaxRAM option. The default value is 25 percent.Specifying this option disables automatic use of compressed oops if the combined result of this and other options influencing the maximum amount of memory is larger than the range of memory addressable by compressed oops. See -XX:UseCompressedOops for further information about compressed oops.The following example shows how to set the percentage of the maximum amount of memory used for the Java heap:-XX:MaxRAMPercentage=75

-XX:MaxTenuringThreshold=threshold

Sets the maximum tenuring threshold for use in adaptive GC sizing. The largest value is 15. The default value is 15 for the parallel (throughput) collector, and 6 for the CMS collector.The following example shows how to set the maximum tenuring threshold to 10:-XX:MaxTenuringThreshold=10 

-XX:MetaspaceSize=size

Sets the size of the allocated class metadata space that will trigger a garbage collection the first time it is exceeded. This threshold for a garbage collection is increased or decreased depending on the amount of metadata used. The default size depends on the platform.

-XX:MinHeapFreeRatio=percent

Sets the minimum allowed percentage of free heap space (0 to 100) after a GC event. If free heap space falls below this value, then the heap will be expanded. By default, this value is set to 40%.The following example shows how to set the minimum free heap ratio to 25%:-XX:MinHeapFreeRatio=25 

-XX:MinRAMPercentage=percent

Sets the maximum amount of memory that the JVM may use for the Java heap before applying ergonomics heuristics as a percentage of the maximum amount determined as described in the -XX:MaxRAM option for small heaps. A small heap is a heap of approximately 125 MB. The default value is 50 percent.The following example shows how to set the percentage of the maximum amount of memory used for the Java heap for small heaps:-XX:MinRAMPercentage=75

-XX:NewRatio=ratio

Sets the ratio between young and old generation sizes. By default, this option is set to 2. The following example shows how to set the young/old ratio to 1:-XX:NewRatio=1 

-XX:NewSize=size

Sets the initial size (in bytes) of the heap for the young generation (nursery). Append the letter k or K to indicate kilobytes, m or M to indicate megabytes, g or G to indicate gigabytes.The young generation region of the heap is used for new objects. GC is performed in this region more often than in other regions. If the size for the young generation is too low, then a large number of minor GCs will be performed. If the size is too high, then only full GCs will be performed, which can take a long time to complete. Oracle recommends that you keep the size for the young generation between a half and a quarter of the overall heap size.The following examples show how to set the initial size of young generation to 256 MB using various units:-XX:NewSize=256m -XX:NewSize=262144k -XX:NewSize=268435456 The -XX:NewSize option is equivalent to -Xmn.

-XX:ParallelGCThreads=threads

Sets the number of threads used for parallel garbage collection in the young and old generations. The default value depends on the number of CPUs available to the JVM.For example, to set the number of threads for parallel GC to 2, specify the following option:-XX:ParallelGCThreads=2 

-XX:+ParallelRefProcEnabled

Enables parallel reference processing. By default, this option is disabled.

-XX:+PrintAdaptiveSizePolicy

Enables printing of information about adaptive generation sizing. By default, this option is disabled.

-XX:+PrintGC

Enables printing of messages at every GC. By default, this option is disabled.

-XX:+PrintGCApplicationConcurrentTime

Enables printing of how much time elapsed since the last pause (for example, a GC pause). By default, this option is disabled.

-XX:+PrintGCApplicationStoppedTime

Enables printing of how much time the pause (for example, a GC pause) lasted. By default, this option is disabled.

-XX:+PrintGCDateStamps

Enables printing of a date stamp at every GC. By default, this option is disabled.

-XX:+PrintGCDetails

Enables printing of detailed messages at every GC. By default, this option is disabled.

-XX:+PrintGCTaskTimeStamps

Enables printing of time stamps for every individual GC worker thread task. By default, this option is disabled.

-XX:+PrintGCTimeStamps

Enables printing of time stamps at every GC. By default, this option is disabled.

-XX:+PrintStringDeduplicationStatistics

Prints detailed deduplication statistics. By default, this option is disabled. See the -XX:+UseStringDeduplication option.

-XX:+PrintTenuringDistribution

Enables printing of tenuring age information. The following is an example of the output:Desired survivor size 48286924 bytes, new threshold 10 (max 10) - age 1: 28992024 bytes, 28992024 total - age 2: 1366864 bytes, 30358888 total - age 3: 1425912 bytes, 31784800 total ... Age 1 objects are the youngest survivors (they were created after the previous scavenge, survived the latest scavenge, and moved from eden to survivor space). Age 2 objects have survived two scavenges (during the second scavenge they were copied from one survivor space to the next). And so on.In the preceding example, 28 992 024 bytes survived one scavenge and were copied from eden to survivor space, 1 366 864 bytes are occupied by age 2 objects, etc. The third value in each row is the cumulative size of objects of age n or less.By default, this option is disabled.

-XX:+ScavengeBeforeFullGC

Enables GC of the young generation before each full GC. This option is enabled by default. Oracle recommends that you do not disable it, because scavenging the young generation before a full GC can reduce the number of objects reachable from the old generation space into the young generation space. To disable GC of the young generation before each full GC, specify -XX:-ScavengeBeforeFullGC.

-XX:SoftRefLRUPolicyMSPerMB=time

Sets the amount of time (in milliseconds) a softly reachable object is kept active on the heap after the last time it was referenced. The default value is one second of lifetime per free megabyte in the heap. The -XX:SoftRefLRUPolicyMSPerMB option accepts integer values representing milliseconds per one megabyte of the current heap size (for Java HotSpot Client VM) or the maximum possible heap size (for Java HotSpot Server VM). This difference means that the Client VM tends to flush soft references rather than grow the heap, whereas the Server VM tends to grow the heap rather than flush soft references. In the latter case, the value of the -Xmx option has a significant effect on how quickly soft references are garbage collected.The following example shows how to set the value to 2.5 seconds:-XX:SoftRefLRUPolicyMSPerMB=2500 

-XX:StringDeduplicationAgeThreshold=threshold

String objects reaching the specified age are considered candidates for deduplication. An object’s age is a measure of how many times it has survived garbage collection. This is sometimes referred to as tenuring; see the -XX:+PrintTenuringDistribution option. Note that String objects that are promoted to an old heap region before this age has been reached are always considered candidates for deduplication. The default value for this option is 3. See the -XX:+UseStringDeduplication option.

-XX:SurvivorRatio=ratio

Sets the ratio between eden space size and survivor space size. By default, this option is set to 8. The following example shows how to set the eden/survivor space ratio to 4:-XX:SurvivorRatio=4 

-XX:TargetSurvivorRatio=percent

Sets the desired percentage of survivor space (0 to 100) used after young garbage collection. By default, this option is set to 50%.The following example shows how to set the target survivor space ratio to 30%:-XX:TargetSurvivorRatio=30 

-XX:TLABSize=size

Sets the initial size (in bytes) of a thread-local allocation buffer (TLAB). Append the letter k or K to indicate kilobytes, m or M to indicate megabytes, g or G to indicate gigabytes. If this option is set to 0, then the JVM chooses the initial size automatically.The following example shows how to set the initial TLAB size to 512 KB:-XX:TLABSize=512k 

-XX:+UseAdaptiveSizePolicy

Enables the use of adaptive generation sizing. This option is enabled by default. To disable adaptive generation sizing, specify -XX:-UseAdaptiveSizePolicy and set the size of the memory allocation pool explicitly (see the -XX:SurvivorRatio option).

-XX:+UseCMSInitiatingOccupancyOnly

Enables the use of the occupancy value as the only criterion for initiating the CMS collector. By default, this option is disabled and other criteria may be used.

-XX:+UseConcMarkSweepGC

Enables the use of the CMS garbage collector for the old generation. Oracle recommends that you use the CMS garbage collector when application latency requirements cannot be met by the throughput (-XX:+UseParallelGC) garbage collector. The G1 garbage collector (-XX:+UseG1GC) is another alternative.By default, this option is disabled and the collector is chosen automatically based on the configuration of the machine and type of the JVM. When this option is enabled, the -XX:+UseParNewGC option is automatically set and you should not disable it, because the following combination of options has been deprecated in JDK 8: -XX:+UseConcMarkSweepGC -XX:-UseParNewGC.

-XX:+UseG1GC

Enables the use of the garbage-first (G1) garbage collector. It is a server-style garbage collector, targeted for multiprocessor machines with a large amount of RAM. It meets GC pause time goals with high probability, while maintaining good throughput. The G1 collector is recommended for applications requiring large heaps (sizes of around 6 GB or larger) with limited GC latency requirements (stable and predictable pause time below 0.5 seconds).By default, this option is disabled and the collector is chosen automatically based on the configuration of the machine and type of the JVM.

-XX:+UseGCOverheadLimit

Enables the use of a policy that limits the proportion of time spent by the JVM on GC before an OutOfMemoryError exception is thrown. This option is enabled, by default and the parallel GC will throw an OutOfMemoryError if more than 98% of the total time is spent on garbage collection and less than 2% of the heap is recovered. When the heap is small, this feature can be used to prevent applications from running for long periods of time with little or no progress. To disable this option, specify -XX:-UseGCOverheadLimit.

-XX:+UseNUMA

Enables performance optimization of an application on a machine with nonuniform memory architecture (NUMA) by increasing the application’s use of lower latency memory. By default, this option is disabled and no optimization for NUMA is made. The option is only available when the parallel garbage collector is used (-XX:+UseParallelGC).

-XX:+UseParallelGC

Enables the use of the parallel scavenge garbage collector (also known as the throughput collector) to improve the performance of your application by leveraging multiple processors.By default, this option is disabled and the collector is chosen automatically based on the configuration of the machine and type of the JVM. If it is enabled, then the -XX:+UseParallelOldGC option is automatically enabled, unless you explicitly disable it.

-XX:+UseParallelOldGC

Enables the use of the parallel garbage collector for full GCs. By default, this option is disabled. Enabling it automatically enables the -XX:+UseParallelGC option.

-XX:+UseParNewGC

Enables the use of parallel threads for collection in the young generation. By default, this option is disabled. It is automatically enabled when you set the -XX:+UseConcMarkSweepGC option. Using the -XX:+UseParNewGC option without the -XX:+UseConcMarkSweepGC option was deprecated in JDK 8.

-XX:+UseSerialGC

Enables the use of the serial garbage collector. This is generally the best choice for small and simple applications that do not require any special functionality from garbage collection. By default, this option is disabled and the collector is chosen automatically based on the configuration of the machine and type of the JVM.

-XX:+UseSHM

On Linux, enables the JVM to use shared memory to setup large pages.For more information, see .

-XX:+UseStringDeduplication

Enables string deduplication. By default, this option is disabled. To use this option, you must enable the garbage-first (G1) garbage collector. See the -XX:+UseG1GC option.String deduplication reduces the memory footprint of String objects on the Java heap by taking advantage of the fact that many String objects are identical. Instead of each String object pointing to its own character array, identical String objects can point to and share the same character array.

-XX:+UseTLAB

Enables the use of thread-local allocation blocks (TLABs) in the young generation space. This option is enabled by default. To disable the use of TLABs, specify -XX:-UseTLAB.

http://www.oracle.com/technetwork/server-storage/solaris10/overview/solaris9-features-scalability-135663.html.

https://docs.oracle.com/javase/8/docs/technotes/guides/vm/class-data-sharing.html) to enable classes from the standard extensions directories (specified by the system property java.ext.dirs; see https://docs.oracle.com/javase/8/docs/technotes/guides/extensions/spec.html) and the application class path (see “Setting the Class Path”) to be placed in the shared archive. AppCDS reduces the footprint and decreases start-up time of your applications provided that a substantial number of classes are loaded from the application class path.

This is a commercial feature that requires you to also specify the -XX:+UnlockCommercialFeatures option. This is also an experimental feature; it may change in future releases.

Contents Previous Next

```
