---
title: '代码检查 sunchecks'
description: '<xml version="1.0"?>'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["笔记", "技术总结", "checkstyle"]
category: 'engineering'
---

```xml
<xml version="1.0"?>  
module PUBLIC  
          "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"  
          "https://checkstyle.org/dtds/configuration_1_3.dtd">  
  
  
  Checkstyle configuration that checks the sun coding conventions from:  
    - the Java Language Specification at      https://docs.oracle.com/javase/specs/jls/se11/html/index.html  
    - the Sun Code Conventions at https://www.oracle.com/java/technologies/javase/codeconventions-contents.html  
    - the Javadoc guidelines at      https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html  
    - the JDK Api documentation https://docs.oracle.com/en/java/javase/11/  
    - some best practices  
  Checkstyle is very configurable. Be sure to read the documentation at  https://checkstyle.org (or in your downloaded distribution).  
  Most Checks are configurable, be sure to consult the documentation.  
  To completely disable a check, just comment it out or delete it from the file.  To suppress certain violations please review suppression filters.  
  Finally, it is worth reading the documentation.  
-->  
  
name="Checker">  
        If you set the basedir property below, then all reported file      names will be relative to the specified directory. See      https://checkstyle.org/config.html#Checker  
        -->  
  name="severity" value="error"/>  
  
  name="fileExtensions" value="java, properties, xml"/>  
  
    
    name="BeforeExecutionExclusionFileFilter">  
    name="fileNamePattern" value="module\-info\.java$"/>  
    
    
  name="SuppressionFilter">  
    name="file" value="${org.checkstyle.sun.suppressionfilter.config}"  
              default="checkstyle-suppressions.xml" />  
    name="optional" value="true"/>  
    
    
    name="JavadocPackage"/>  
  
    
    name="NewlineAtEndOfFile"/>  
  
    
    name="Translation"/>  
  
    
    name="FileLength"/>  
  name="LineLength">  
    name="fileExtensions" value="java"/>  
    
    
    name="FileTabCharacter"/>  
  
    
    name="RegexpSingleline">  
    name="format" value="\s+$"/>  
    name="minimum" value="0"/>  
    name="maximum" value="0"/>  
    name="message" value="Line has trailing spaces."/>  
    
    
      
    
    
    
  
  name="TreeWalker">  
  
      
        name="InvalidJavadocPosition"/>  
    name="JavadocMethod"/>  
    name="JavadocType"/>  
    name="JavadocVariable"/>  
    name="JavadocStyle"/>  
    name="MissingJavadocMethod"/>  
  
      
        name="ConstantName"/>  
    name="LocalFinalVariableName"/>  
    name="LocalVariableName"/>  
    name="MemberName"/>  
    name="MethodName"/>  
    name="PackageName"/>  
    name="ParameterName"/>  
    name="StaticVariableName"/>  
    name="TypeName"/>  
  
      
        name="AvoidStarImport"/>  
    name="IllegalImport"/>   
    name="RedundantImport"/>  
    name="UnusedImports">  
      name="processJavadoc" value="false"/>  
      
      
        name="MethodLength"/>  
    name="ParameterNumber"/>  
  
      
        name="EmptyForIteratorPad"/>  
    name="GenericWhitespace"/>  
    name="MethodParamPad"/>  
    name="NoWhitespaceAfter"/>  
    name="NoWhitespaceBefore"/>  
    name="OperatorWrap"/>  
    name="ParenPad"/>  
    name="TypecastParenPad"/>  
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
    name="HiddenField"/>  
    name="IllegalInstantiation"/>  
    name="InnerAssignment"/>  
    name="MagicNumber"/>  
    name="MissingSwitchDefault"/>  
    name="MultipleVariableDeclarations"/>  
    name="SimplifyBooleanExpression"/>  
    name="SimplifyBooleanReturn"/>  
  
      
        name="DesignForExtension"/>  
    name="FinalClass"/>  
    name="HideUtilityClassConstructor"/>  
    name="InterfaceIsType"/>  
    name="VisibilityModifier"/>  
  
      
        name="ArrayTypeStyle"/>  
    name="FinalParameters"/>  
    name="TodoComment"/>  
    name="UpperEll"/>  
  
      
    name="SuppressionXpathFilter">  
      name="file" value="${org.checkstyle.sun.suppressionxpathfilter.config}"  
                default="checkstyle-xpath-suppressions.xml" />  
      name="optional" value="true"/>
```
