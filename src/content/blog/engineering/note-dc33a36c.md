---
title: '常用注解说明'
description: '通过拦截请求和反射的方式判断请求的类型和实际类型是否相同'
pubDate: 'Jul 01, 2026'
heroImage: '../../../assets/blog-placeholder-2.jpg'
tags: ["笔记", "技术总结", "java"]
category: 'engineering'
---

# step1: 说明

```tex
- @NonNull可以标注在方法、字段、参数之上，表示对应的值不可以为空
- @Nullable注解可以标注在方法、字段、参数之上，表示对应的值可以为空
```

# step2: 注解失效解决办法

通过拦截请求和反射的方式判断请求的类型和实际类型是否相同

```java
package com.gientech.v2i.common.validate;

import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.log.Log;
import cn.hutool.log.LogFactory;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.gientech.v2i.common.enums.AjaxStatusEnum;
import com.gientech.v2i.common.exception.BizException;
import lombok.Builder;
import org.springframework.core.MethodParameter;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdvice;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.Type;
import java.nio.charset.StandardCharsets;

/**
 * 全局请求参数处理.
 * (用于处理springmvc 注解导致的 springboot Validate 失效问题)
 *
 * @author hongzhe.qin
 */
@RestControllerAdvice
public class GlobalAdvice implements RequestBodyAdvice {

    /**
     * 日志打印.
     */
    private static final Log LOG = LogFactory.get();

    /**
     * Invoked first to determine if this interceptor applies.
     *
     * @param methodParameter the method parameter
     * @param targetType      the target type,
     *                        not necessarily the same as the method
     *                        parameter type,
     *                        e.g. for {@code HttpEntity<String>}.
     * @param converterType   the selected converter type
     * @return whether this interceptor should be invoked or not
     */
    @Override
    public boolean supports(final MethodParameter methodParameter,
                            final Type targetType,
                            final Class<? extends HttpMessageConverter<?>>
                                    converterType) {
        Annotation[] annotations = methodParameter.getParameterAnnotations();
        for (Annotation ann : annotations) {
            Validated validatedAnn = AnnotationUtils
                    .getAnnotation(ann, Validated.class);
            if (validatedAnn != null
                    || ann.annotationType()
                    .getSimpleName().startsWith("Valid")) {
                return true;
            }
        }
        return false;
    }

    /**
     * Invoked second before the request body is read and converted.
     *
     * @param inputMessage  the request
     * @param parameter     the target method parameter
     * @param targetType    the target type,
     *                      not necessarily the same as the method
     *                      parameter type, e.g. for {@code HttpEntity<String>}.
     * @param converterType the converter used to deserialize the body
     * @return the input request or a new instance (never {@code null})
     */
    @Override
    public HttpInputMessage beforeBodyRead(
            final HttpInputMessage inputMessage,
            final MethodParameter parameter,
            final Type targetType,
            final Class<? extends HttpMessageConverter<?>>
                    converterType) throws IOException {
        // 将 inputMessage 转换字节数组
        byte[] body = new byte[inputMessage.getBody().available()];
        InputStream inputStream = inputMessage.getBody();
        int len = inputStream.read(body);
        String bodyStr = new String(body, 0, len, StandardCharsets.UTF_8);
        JSONObject obj = JSON.parseObject(bodyStr);
        String className = targetType.getTypeName();
        Class<?> clazz = null;
        try {
            clazz = Class.forName(className);
        } catch (ClassNotFoundException e) {
            throw new BizException(AjaxStatusEnum.CLASS_NOT_FOUNT.getCode(),
                    AjaxStatusEnum.CLASS_NOT_FOUNT.getMsg(), null);
        }
        Field[] fields = clazz.getDeclaredFields();
        for (Field field : fields) {
            if (field.getType().toString().equals("int")
                    || field.getType().toString().equals("Integer")) {
                String value = obj.getString(field.getName());
                if (CharSequenceUtil.isEmpty(value)) {
                    throw new BizException(
                            AjaxStatusEnum.PARAM.getCode(),
                            AjaxStatusEnum.PARAM.getCode(), null);
                }
            }
            if (field.getType().toString().equals("boolean")
                    || field.getType().toString().equals("Boolean")) {
                String value = obj.getString(field.getName());
                if (CharSequenceUtil.isEmpty(value)) {
                    throw new BizException(
                            AjaxStatusEnum.PARAM.getCode(),
                            AjaxStatusEnum.PARAM.getCode(), null);
                }
            }
        }
        return getNewInputStream(obj, inputMessage);
    }

    @Builder
    private HttpInputMessage getNewInputStream(
            final JSONObject obj,
            final HttpInputMessage inputMessage) {
        byte[] newRequestByte = obj.toJSONString().getBytes();
        InputStream rawInputStream = new ByteArrayInputStream(newRequestByte);
        return new HttpInputMessage() {
            @Override
            public HttpHeaders getHeaders() {
                return inputMessage.getHeaders();
            }

            @Override
            public InputStream getBody() {
                return rawInputStream;
            }
        };
    }

    /**
     * Invoked third (and last) after the
     * request body is converted to an Object.
     *
     * @param body          set to the converter Object
     *                      before the first advice is called
     * @param inputMessage  the request
     * @param parameter     the target method parameter
     * @param targetType    the target type,
     *                      not necessarily the same as the method
     *                      parameter type, e.g. for {@code HttpEntity<String>}.
     * @param converterType the converter used to deserialize the body
     * @return the same body or a new instance
     */
    @Override
    public Object afterBodyRead(
            final Object body,
            final HttpInputMessage inputMessage,
            final MethodParameter parameter,
            final Type targetType,
            final Class<? extends HttpMessageConverter<?>> converterType) {
        return body;
    }

    /**
     * Invoked second (and last) if the body is empty.
     *
     * @param body          usually set to {@code null}
     *                      before the first advice is called
     * @param inputMessage  the request
     * @param parameter     the method parameter
     * @param targetType    the target type, not necessarily
     *                      the same as the method
     *                      parameter type, e.g. for {@code HttpEntity<String>}.
     * @param converterType the selected converter type
     * @return the value to use, or {@code null} which may then raise an
     * {@code HttpMessageNotReadableException} if the argument is required
     */
    @Override
    public Object handleEmptyBody(
            final Object body,
            final HttpInputMessage inputMessage,
            final MethodParameter parameter,
            final Type targetType,
            final Class<? extends HttpMessageConverter<?>> converterType) {
        return body;
    }
}

```
