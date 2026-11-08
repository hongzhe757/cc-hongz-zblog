---
title: '测试Linux 和 Windows java 命令行'
description: 'package com.gientech.ivics.modules.job.stream;'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["笔记", "技术总结", "java"]
category: 'engineering'
---

```java

package com.gientech.ivics.modules.job.stream;  
  
import cn.hutool.core.io.file.PathUtil;  
import cn.hutool.log.Log;  
import cn.hutool.log.LogFactory;  
  
import java.io.BufferedReader;  
import java.io.File;  
import java.io.IOException;  
import java.io.InputStream;  
import java.io.InputStreamReader;  
import java.io.OutputStream;  
import java.io.OutputStreamWriter;  
import java.nio.charset.StandardCharsets;  
  
public class Test {  
  
    /**  
     * 日志打印.  
     */    private static final Log LOG = LogFactory.get();  
  
    public static void main(String[] args) throws IOException {  
        for (int i = 0; i <100; i++) {  
            extracted(i);  
        }  
  
  
    }  
  
    private static void extracted(int j) throws IOException {  
        String[] commands = new String[]{"cmd","-c","D:\\mysql-8.0.22-winx64\\bin\\mysqldump.exe -h 192.168.80.132 -P 13307 -uroot -proot ivics-java-unittest"};  
        // Process process = Runtime.getRuntime().exec(commands[0]);  
        ProcessBuilder hiveProcessBuilder = new ProcessBuilder(commands);  
        hiveProcessBuilder.redirectErrorStream(true);  
        Process hiveProcess = hiveProcessBuilder.start();  
        String com = "";  
        if (commands.length > 1) {  
            for (int i = 0; i < commands.length; i++) {  
                com = new StringBuilder()  
                        .append(com)  
                        .append(commands[i])  
                        .append("\r\n")  
                        .toString();  
            }  
        }  
        // System.out.println("拼接 ："+com);  
        OutputStream os = hiveProcess.getOutputStream();  
        try (OutputStreamWriter writer = new OutputStreamWriter(os)) {  
            writer.write(com);  
            writer.flush();  
            os.close();  
        }  
        String outStr;  
        StringBuilder sb = null;  
        String inStr;  
        InputStream pIn = hiveProcess.getInputStream();  
        try (  
                InputStreamReader inputStreamReader  
                        = new InputStreamReader(  
                        pIn,  
                        StandardCharsets.UTF_8);  
                BufferedReader bufferedReader  
                        = new BufferedReader(inputStreamReader);  
                BufferedReader br = new BufferedReader(bufferedReader);  
  
        ) {  
            sb = new StringBuilder("");  
            // 组合控制台输出信息字符串  
            while ((inStr = br.readLine()) != null) {  
                sb.append(inStr + "\r\n");  
            }  
        }  
        outStr = sb.toString();  
        if ("".equals(outStr)) {  
            System.out.println("文件内容为空:" + j);  
        }else{  
            System.out.println("文件内容不为空:" + j);  
            System.out.println("文件内容不为空:" + outStr);  
        }  
    }  
}  

// process = Runtime.getRuntime().exec(restoreCommand);

```
