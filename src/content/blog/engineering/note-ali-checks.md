---
title: '代码检查 ali checks'
description: '<xml version="1.0"?>'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-5.jpg'
tags: ["笔记", "技术总结", "checkstyle"]
category: 'engineering'
---

```xml
<xml version="1.0"?>  
module PUBLIC  
        "-//Puppy Crawl//DTD Check Configuration 1.3//EN"  
        "http://www.puppycrawl.com/dtds/configuration_1_3.dtd">  
  
name="Checker">  
  
      
    name="NewlineAtEndOfFile"/>  
  
      
    name="FileLength">  
        name="max" value="1500"/>  
      
      
    name="TreeWalker">  
          
                name="AvoidStarImport">  
            name="excludes" value="java.io,java.net,java.lang.Math"/>  
              
            name="allowClassImports" value="false"/>  
              
            name="allowStaticMemberImports" value="true"/>  
                  
        name="IllegalImport"/>  
          
        name="RedundantImport"/>  
          
        name="UnusedImports" />  
  
  
          
                name="JavadocType">  
            name="allowUnknownTags" value="true"/>  
            key="javadoc.missing" value="类注释：缺少Javadoc注释。"/>  
        name="JavadocMethod">  
            name="tokens" value="METHOD_DEF" />  
              
            name="allowMissingPropertyJavadoc" value="true"/>  
            key="javadoc.missing" value="方法注释：缺少Javadoc注释。"/>  
          
          
                name="LocalFinalVariableName" />  
          
        name="LocalVariableName" />  
          
        name="PackageName">  
            name="format" value="^[a-z]+(\.[a-z][a-z0-9]*)*$" />  
            key="name.invalidPattern" value="包名 ''{0}'' 要符合 ''{1}''格式."/>  
                  
        name="StaticVariableName" />  
          
        name="TypeName">  
            name="severity" value="warning"/>  
            key="name.invalidPattern" value="名称 ''{0}'' 要符合 ''{1}''格式."/>  
                  
        name="MemberName" />  
          
        name="MethodName" />  
          
        name="ParameterName " />  
          
        name="ConstantName" />  
  
          
                name="ArrayTypeStyle"/>  
          
        name="UpperEll"/>  
  
          
                name="LineLength">  
            name="max" value="120" />  
                  
        name="MethodLength">  
            name="tokens" value="METHOD_DEF" />  
            name="max" value="50" />  
                  
        name="ParameterNumber">  
            name="max" value="5" />  
            name="ignoreOverriddenMethods" value="true"/>  
            name="tokens" value="METHOD_DEF" />  
          
          
                name="MethodParamPad" />  
          
        name="TypecastParenPad" />  
          
        name="NoWhitespaceAfter"/>  
          
        name="NoWhitespaceBefore"/>  
          
        name="OperatorWrap"/>  
          
        name="ParenPad"/>  
          
        name="WhitespaceAfter"/>  
          
        name="WhitespaceAround"/>  
  
          
                name="ModifierOrder"/>  
          
        name="RedundantModifier"/>  
  
          
                name="AvoidNestedBlocks"/>  
          
        name="EmptyBlock"/>  
          
        name="LeftCurly"/>  
          
        name="NeedBraces"/>  
          
        name="RightCurly"/>  
  
          
                name="EmptyStatement"/>  
          
        name="EqualsHashCode"/>  
          
        name="HiddenField">  
            name="tokens" value="VARIABLE_DEF"/>  
                  
        name="IllegalInstantiation"/>  
          
        name="InnerAssignment"/>  
          
        name="MagicNumber">  
            name="ignoreNumbers" value="0, 1"/>  
            name="ignoreAnnotation" value="true"/>  
                  
        name="MissingSwitchDefault"/>  
          
        name="SimplifyBooleanExpression"/>  
          
        name="SimplifyBooleanReturn"/>  
  
          
                  
        name="FinalClass"/>  
          
        name="HideUtilityClassConstructor"/>  
          
        name="InterfaceIsType"/>  
                除非在本检查的protectedAllowed和packagedAllowed属性中进行了设置-->        name="VisibilityModifier">  
            name="packageAllowed" value="true"/>  
            name="protectedAllowed" value="true"/>  
          
          
                name="StringLiteralEquality"/>  
          
        name="NestedForDepth">  
            name="max" value="2"/>  
                  
        name="NestedIfDepth">  
            name="max" value="3"/>  
                  
        name="UncommentedMain">  
            name="excludedClasses" value=".*Application$"/>  
                  
        name="Regexp">  
            name="format" value="System\.out\.println"/>  
            name="illegalPattern" value="true"/>  
                  
        name="ReturnCount">  
            name="max" value="3"/>  
                  
        name="NestedTryDepth ">  
            name="max" value="3"/>  
                  
        name="SuperClone" />  
          
        name="SuperFinalize" />
```
