---
title: '代码检查 googlechecks'
description: '<xml version="1.0"?>'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-1.jpg'
tags: ["笔记", "技术总结", "checkstyle"]
category: 'engineering'
---

```xml
<xml version="1.0"?>  
module PUBLIC  
          "-//Checkstyle//DTD Checkstyle Configuration 1.3//EN"  
          "https://checkstyle.org/dtds/configuration_1_3.dtd">  
  
    Checkstyle configuration that checks the Google coding conventions from Google Java Style    that can be found at https://google.github.io/styleguide/javaguide.html  
    Checkstyle is very configurable. Be sure to read the documentation at    http://checkstyle.org (or in your downloaded distribution).  
    To completely disable a check, just comment it out or delete it from the file.    To suppress certain violations please review suppression filters.  
    Authors: Max Vetrenko, Ruslan Diachenko, Roman Ivanov. -->  
name = "Checker">  
  name="charset" value="UTF-8"/>  
  
  name="severity" value="warning"/>  
  
  name="fileExtensions" value="java, properties, xml"/>  
    
    name="BeforeExecutionExclusionFileFilter">  
    name="fileNamePattern" value="module\-info\.java$"/>  
      
  name="SuppressionFilter">  
    name="file" value="${org.checkstyle.google.suppressionfilter.config}"  
           default="checkstyle-suppressions.xml" />  
    name="optional" value="true"/>  
    
    
    name="FileTabCharacter">  
    name="eachLine" value="true"/>  
    
  name="LineLength">  
    name="fileExtensions" value="java"/>  
    name="max" value="100"/>  
    name="ignorePattern" value="^package.*|^import.*|a href|href|http://|https://|ftp://"/>  
    
  name="TreeWalker">  
    name="OuterTypeFilename"/>  
    name="IllegalTokenText">  
      name="tokens" value="STRING_LITERAL, CHAR_LITERAL"/>  
      name="format"  
               value="\\u00(09|0(a|A)|0(c|C)|0(d|D)|22|27|5(C|c))|\\(0(10|11|12|14|15|42|47)|134)"/>  
      name="message"  
               value="Consider using special escape sequence instead of octal value or Unicode escaped value."/>  
    name="AvoidEscapedUnicodeCharacters">  
      name="allowEscapesForControlCharacters" value="true"/>  
      name="allowByTailComment" value="true"/>  
      name="allowNonPrintableEscapes" value="true"/>  
    name="AvoidStarImport"/>  
    name="OneTopLevelClass"/>  
    name="NoLineWrap">  
      name="tokens" value="PACKAGE_DEF, IMPORT, STATIC_IMPORT"/>  
    name="EmptyBlock">  
      name="option" value="TEXT"/>  
      name="tokens"  
               value="LITERAL_TRY, LITERAL_FINALLY, LITERAL_IF, LITERAL_ELSE, LITERAL_SWITCH"/>  
    name="NeedBraces">  
      name="tokens"  
               value="LITERAL_DO, LITERAL_ELSE, LITERAL_FOR, LITERAL_IF, LITERAL_WHILE"/>  
    name="LeftCurly">  
      name="tokens"  
               value="ANNOTATION_DEF, CLASS_DEF, CTOR_DEF, ENUM_CONSTANT_DEF, ENUM_DEF,  
                    INTERFACE_DEF, LAMBDA, LITERAL_CASE, LITERAL_CATCH, LITERAL_DEFAULT,                    LITERAL_DO, LITERAL_ELSE, LITERAL_FINALLY, LITERAL_FOR, LITERAL_IF,                    LITERAL_SWITCH, LITERAL_SYNCHRONIZED, LITERAL_TRY, LITERAL_WHILE, METHOD_DEF,                    OBJBLOCK, STATIC_INIT, RECORD_DEF, COMPACT_CTOR_DEF"/>  
    name="RightCurly">  
      name="id" value="RightCurlySame"/>  
      name="tokens"  
               value="LITERAL_TRY, LITERAL_CATCH, LITERAL_FINALLY, LITERAL_IF, LITERAL_ELSE,  
                    LITERAL_DO"/>  
    name="RightCurly">  
      name="id" value="RightCurlyAlone"/>  
      name="option" value="alone"/>  
      name="tokens"  
               value="CLASS_DEF, METHOD_DEF, CTOR_DEF, LITERAL_FOR, LITERAL_WHILE, STATIC_INIT,  
                    INSTANCE_INIT, ANNOTATION_DEF, ENUM_DEF, INTERFACE_DEF, RECORD_DEF,                    COMPACT_CTOR_DEF"/>  
    name="SuppressionXpathSingleFilter">  
        
      name="id" value="RightCurlyAlone"/>  
      name="query" value="//RCURLY[parent::SLIST[count(./*)=1]  
                                     or preceding-sibling::*[last()][self::LCURLY]]"/>  
    name="WhitespaceAfter">  
      name="tokens"  
               value="COMMA, SEMI, TYPECAST, LITERAL_IF, LITERAL_ELSE,  
                    LITERAL_WHILE, LITERAL_DO, LITERAL_FOR, DO_WHILE"/>  
    name="WhitespaceAround">  
      name="allowEmptyConstructors" value="true"/>  
      name="allowEmptyLambdas" value="true"/>  
      name="allowEmptyMethods" value="true"/>  
      name="allowEmptyTypes" value="true"/>  
      name="allowEmptyLoops" value="true"/>  
      name="ignoreEnhancedForColon" value="false"/>  
      name="tokens"  
               value="ASSIGN, BAND, BAND_ASSIGN, BOR, BOR_ASSIGN, BSR, BSR_ASSIGN, BXOR,  
                    BXOR_ASSIGN, COLON, DIV, DIV_ASSIGN, DO_WHILE, EQUAL, GE, GT, LAMBDA, LAND,                    LCURLY, LE, LITERAL_CATCH, LITERAL_DO, LITERAL_ELSE, LITERAL_FINALLY,                    LITERAL_FOR, LITERAL_IF, LITERAL_RETURN, LITERAL_SWITCH, LITERAL_SYNCHRONIZED,                    LITERAL_TRY, LITERAL_WHILE, LOR, LT, MINUS, MINUS_ASSIGN, MOD, MOD_ASSIGN,                    NOT_EQUAL, PLUS, PLUS_ASSIGN, QUESTION, RCURLY, SL, SLIST, SL_ASSIGN, SR,                    SR_ASSIGN, STAR, STAR_ASSIGN, LITERAL_ASSERT, TYPE_EXTENSION_AND"/>  
      key="ws.notFollowed"  
              value="WhitespaceAround: ''{0}'' is not followed by whitespace. Empty blocks may only be represented as '{}' when not part of a multi-block statement (4.1.3)"/>  
      key="ws.notPreceded"  
              value="WhitespaceAround: ''{0}'' is not preceded with whitespace."/>  
    name="OneStatementPerLine"/>  
    name="MultipleVariableDeclarations"/>  
    name="ArrayTypeStyle"/>  
    name="MissingSwitchDefault"/>  
    name="FallThrough"/>  
    name="UpperEll"/>  
    name="ModifierOrder"/>  
    name="EmptyLineSeparator">  
      name="tokens"  
               value="PACKAGE_DEF, IMPORT, STATIC_IMPORT, CLASS_DEF, INTERFACE_DEF, ENUM_DEF,  
                    STATIC_INIT, INSTANCE_INIT, METHOD_DEF, CTOR_DEF, VARIABLE_DEF, RECORD_DEF,                    COMPACT_CTOR_DEF"/>  
      name="allowNoEmptyLineBetweenFields" value="true"/>  
    name="SeparatorWrap">  
      name="id" value="SeparatorWrapDot"/>  
      name="tokens" value="DOT"/>  
      name="option" value="nl"/>  
    name="SeparatorWrap">  
      name="id" value="SeparatorWrapComma"/>  
      name="tokens" value="COMMA"/>  
      name="option" value="EOL"/>  
    name="SeparatorWrap">  
        
      name="id" value="SeparatorWrapEllipsis"/>  
      name="tokens" value="ELLIPSIS"/>  
      name="option" value="EOL"/>  
    name="SeparatorWrap">  
        
      name="id" value="SeparatorWrapArrayDeclarator"/>  
      name="tokens" value="ARRAY_DECLARATOR"/>  
      name="option" value="EOL"/>  
    name="SeparatorWrap">  
      name="id" value="SeparatorWrapMethodRef"/>  
      name="tokens" value="METHOD_REF"/>  
      name="option" value="nl"/>  
    name="PackageName">  
      name="format" value="^[a-z]+(\.[a-z][a-z0-9]*)*$"/>  
      key="name.invalidPattern"  
             value="Package name ''{0}'' must match pattern ''{1}''."/>  
    name="TypeName">  
      name="tokens" value="CLASS_DEF, INTERFACE_DEF, ENUM_DEF,  
                    ANNOTATION_DEF, RECORD_DEF"/>  
      key="name.invalidPattern"  
             value="Type name ''{0}'' must match pattern ''{1}''."/>  
    name="MemberName">  
      name="format" value="^[a-z][a-z0-9][a-zA-Z0-9]*$"/>  
      key="name.invalidPattern"  
             value="Member name ''{0}'' must match pattern ''{1}''."/>  
    name="ParameterName">  
      name="format" value="^[a-z]([a-z0-9][a-zA-Z0-9]*)?$"/>  
      key="name.invalidPattern"  
             value="Parameter name ''{0}'' must match pattern ''{1}''."/>  
    name="LambdaParameterName">  
      name="format" value="^[a-z]([a-z0-9][a-zA-Z0-9]*)?$"/>  
      key="name.invalidPattern"  
             value="Lambda parameter name ''{0}'' must match pattern ''{1}''."/>  
    name="CatchParameterName">  
      name="format" value="^[a-z]([a-z0-9][a-zA-Z0-9]*)?$"/>  
      key="name.invalidPattern"  
             value="Catch parameter name ''{0}'' must match pattern ''{1}''."/>  
    name="LocalVariableName">  
      name="format" value="^[a-z]([a-z0-9][a-zA-Z0-9]*)?$"/>  
      key="name.invalidPattern"  
             value="Local variable name ''{0}'' must match pattern ''{1}''."/>  
    name="PatternVariableName">  
      name="format" value="^[a-z]([a-z0-9][a-zA-Z0-9]*)?$"/>  
      key="name.invalidPattern"  
             value="Pattern variable name ''{0}'' must match pattern ''{1}''."/>  
    name="ClassTypeParameterName">  
      name="format" value="(^[A-Z][0-9]?)$|([A-Z][a-zA-Z0-9]*[T]$)"/>  
      key="name.invalidPattern"  
             value="Class type name ''{0}'' must match pattern ''{1}''."/>  
    name="RecordComponentName">  
      name="format" value="^[a-z]([a-z0-9][a-zA-Z0-9]*)?$"/>  
      key="name.invalidPattern"  
               value="Record component name ''{0}'' must match pattern ''{1}''."/>  
    name="RecordTypeParameterName">  
      name="format" value="(^[A-Z][0-9]?)$|([A-Z][a-zA-Z0-9]*[T]$)"/>  
      key="name.invalidPattern"  
               value="Record type name ''{0}'' must match pattern ''{1}''."/>  
    name="MethodTypeParameterName">  
      name="format" value="(^[A-Z][0-9]?)$|([A-Z][a-zA-Z0-9]*[T]$)"/>  
      key="name.invalidPattern"  
             value="Method type name ''{0}'' must match pattern ''{1}''."/>  
    name="InterfaceTypeParameterName">  
      name="format" value="(^[A-Z][0-9]?)$|([A-Z][a-zA-Z0-9]*[T]$)"/>  
      key="name.invalidPattern"  
             value="Interface type name ''{0}'' must match pattern ''{1}''."/>  
    name="NoFinalizer"/>  
    name="GenericWhitespace">  
      key="ws.followed"  
             value="GenericWhitespace ''{0}'' is followed by whitespace."/>  
      key="ws.preceded"  
             value="GenericWhitespace ''{0}'' is preceded with whitespace."/>  
      key="ws.illegalFollow"  
             value="GenericWhitespace ''{0}'' should followed by whitespace."/>  
      key="ws.notPreceded"  
             value="GenericWhitespace ''{0}'' is not preceded with whitespace."/>  
    name="Indentation">  
      name="basicOffset" value="2"/>  
      name="braceAdjustment" value="2"/>  
      name="caseIndent" value="2"/>  
      name="throwsIndent" value="4"/>  
      name="lineWrappingIndentation" value="4"/>  
      name="arrayInitIndent" value="2"/>  
    name="AbbreviationAsWordInName">  
      name="ignoreFinal" value="false"/>  
      name="allowedAbbreviationLength" value="0"/>  
      name="tokens"  
               value="CLASS_DEF, INTERFACE_DEF, ENUM_DEF, ANNOTATION_DEF, ANNOTATION_FIELD_DEF,  
                    PARAMETER_DEF, VARIABLE_DEF, METHOD_DEF, PATTERN_VARIABLE_DEF, RECORD_DEF,                    RECORD_COMPONENT_DEF"/>  
    name="NoWhitespaceBeforeCaseDefaultColon"/>  
    name="OverloadMethodsDeclarationOrder"/>  
    name="VariableDeclarationUsageDistance"/>  
    name="CustomImportOrder">  
      name="sortImportsInGroupAlphabetically" value="true"/>  
      name="separateLineBetweenGroups" value="true"/>  
      name="customImportOrderRules" value="STATIC###THIRD_PARTY_PACKAGE"/>  
      name="tokens" value="IMPORT, STATIC_IMPORT, PACKAGE_DEF"/>  
    name="MethodParamPad">  
      name="tokens"  
               value="CTOR_DEF, LITERAL_NEW, METHOD_CALL, METHOD_DEF,  
                    SUPER_CTOR_CALL, ENUM_CONSTANT_DEF, RECORD_DEF"/>  
    name="NoWhitespaceBefore">  
      name="tokens"  
               value="COMMA, SEMI, POST_INC, POST_DEC, DOT,  
                    LABELED_STAT, METHOD_REF"/>  
      name="allowLineBreaks" value="true"/>  
    name="ParenPad">  
      name="tokens"  
               value="ANNOTATION, ANNOTATION_FIELD_DEF, CTOR_CALL, CTOR_DEF, DOT, ENUM_CONSTANT_DEF,  
                    EXPR, LITERAL_CATCH, LITERAL_DO, LITERAL_FOR, LITERAL_IF, LITERAL_NEW,                    LITERAL_SWITCH, LITERAL_SYNCHRONIZED, LITERAL_WHILE, METHOD_CALL,                    METHOD_DEF, QUESTION, RESOURCE_SPECIFICATION, SUPER_CTOR_CALL, LAMBDA,                    RECORD_DEF"/>  
    name="OperatorWrap">  
      name="option" value="NL"/>  
      name="tokens"  
               value="BAND, BOR, BSR, BXOR, DIV, EQUAL, GE, GT, LAND, LE, LITERAL_INSTANCEOF, LOR,  
                    LT, MINUS, MOD, NOT_EQUAL, PLUS, QUESTION, SL, SR, STAR, METHOD_REF,                    TYPE_EXTENSION_AND "/>  
    name="AnnotationLocation">  
      name="id" value="AnnotationLocationMostCases"/>  
      name="tokens"  
               value="CLASS_DEF, INTERFACE_DEF, ENUM_DEF, METHOD_DEF, CTOR_DEF,  
                      RECORD_DEF, COMPACT_CTOR_DEF"/>  
    name="AnnotationLocation">  
      name="id" value="AnnotationLocationVariables"/>  
      name="tokens" value="VARIABLE_DEF"/>  
      name="allowSamelineMultipleAnnotations" value="true"/>  
    name="NonEmptyAtclauseDescription"/>  
    name="InvalidJavadocPosition"/>  
    name="JavadocTagContinuationIndentation"/>  
    name="SummaryJavadoc">  
      name="forbiddenSummaryFragments"  
               value="^@return the *|^This method returns |^A [{]@code [a-zA-Z0-9]+[}]( is a )"/>  
    name="JavadocParagraph"/>  
    name="RequireEmptyLineBeforeBlockTagGroup"/>  
    name="AtclauseOrder">  
      name="tagOrder" value="@param, @return, @throws, @deprecated"/>  
      name="target"  
               value="CLASS_DEF, INTERFACE_DEF, ENUM_DEF, METHOD_DEF, CTOR_DEF, VARIABLE_DEF"/>  
    name="JavadocMethod">  
      name="accessModifiers" value="public"/>  
      name="allowMissingParamTags" value="true"/>  
      name="allowMissingReturnTag" value="true"/>  
      name="allowedAnnotations" value="Override, Test"/>  
      name="tokens" value="METHOD_DEF, CTOR_DEF, ANNOTATION_FIELD_DEF, COMPACT_CTOR_DEF"/>  
    name="MissingJavadocMethod">  
      name="scope" value="public"/>  
      name="minLineCount" value="2"/>  
      name="allowedAnnotations" value="Override, Test"/>  
      name="tokens" value="METHOD_DEF, CTOR_DEF, ANNOTATION_FIELD_DEF,  
                                   COMPACT_CTOR_DEF"/>  
    name="MissingJavadocType">  
      name="scope" value="protected"/>  
      name="tokens"  
                value="CLASS_DEF, INTERFACE_DEF, ENUM_DEF,  
                      RECORD_DEF, ANNOTATION_DEF"/>  
      name="excludeScope" value="nothing"/>  
    name="MethodName">  
      name="format" value="^[a-z][a-z0-9][a-zA-Z0-9_]*$"/>  
      key="name.invalidPattern"  
             value="Method name ''{0}'' must match pattern ''{1}''."/>  
    name="SingleLineJavadoc"/>  
    name="EmptyCatchBlock">  
      name="exceptionVariableName" value="expected"/>  
    name="CommentsIndentation">  
      name="tokens" value="SINGLE_LINE_COMMENT, BLOCK_COMMENT_BEGIN"/>  
          
    name="SuppressionXpathFilter">  
      name="file" value="${org.checkstyle.google.suppressionxpathfilter.config}"  
             default="checkstyle-xpath-suppressions.xml" />  
      name="optional" value="true"/>
```
