---
title: '状态码映射设计'
description: '解决「统一响应 code 语义不统一」问题：三方平台（gitee/微信/阿里云等）状态码各异，需要一个**可插拔的映射层**，把三方码归一化到统一响应的 语义，且三方原始信息只进 、不污染 。'
pubDate: 'Sep 12, 2026'
heroImage: '../../../assets/blog-placeholder-3.jpg'
tags: ["ztools", "框架", "基础核心"]
category: 'ztools'
---

# 状态码映射设计

> 解决「统一响应 code 语义不统一」问题：三方平台（gitee/微信/阿里云等）状态码各异，需要一个**可插拔的映射层**，把三方码归一化到统一响应的 `200/500` 语义，且三方原始信息只进 `msg`、不污染 `code`。
>
> 适用：所有「对接三方」的模块（授权 zauth、未来支付/短信/AI 等）。

---

## 一、问题背景

统一响应 `AjaxResult` 的成功码是 `200`，但各业务模块曾出现过：

- zauth 自己发明 `2000=成功`（`AuthResponseStatus`）→ `isSuccess()` 不认，`success` 字段误判 false
- 三方原始错误码直接透传进 `code`（喜马拉雅 `error_no=207`、微信 `errcode`）→ 同一个响应的 `code` 完全不统一
- null 转默认值序列化器放在业务模块（`AuthJacksonSupport`）→ 各模块重复造轮子

根因统一：**层级边界不清，每层越界做了不属于自己的事**。

---

## 二、层级设计

三层，依赖单向：`L3 → L2 → L1`。

| 层级 | 模块 | 拥有（定义） | 使用（遵守） | 禁止（不能碰） |
|---|---|---|---|---|
| **L1 统一响应** | ztools-response | code 语义（200 成功 / 500 失败）、data 不为 null、null 转默认值 | — | — |
| **L2 业务模块** | zauth / 支付 / 短信 | 业务错误**类型**、平台抽象、状态码映射器 | 统一响应契约 | 定义 code、私有 null 序列化 |
| **L3 三方平台** | gitee / 微信 / 阿里云 | 三方原始错误信息（码 + 描述）| 状态码映射接口 | 定义 code、把三方码塞进 code |

**三层清单法**（新增模块前先填这张表，再反问三个问题）：

1. 这层有没有**发明**了本该由别的层定义的东西？
2. 这层有没有**透传**了本该在边界处归一化的东西？
3. 这层有没有**依赖**了下层的私有实现？

---

## 三、状态码映射的位置

映射发生在 **L2 → L1 的边界**：三方原始状态码在 L3 被解析后，L2 在返回统一响应之前完成归一化。

```
三方平台返回                L2 映射层（边界）              L1 统一响应
┌─────────────┐          ┌──────────────────┐        ┌───────────────────┐
│ gitee 错误   │          │ StatusMapper      │        │ code: 500（统一）   │
│ 微信 errcode │ ───────► │ 三方码+描述 → msg  │ ─────► │ msg: 三方原始错误   │
│ 阿里云 error │          │ 业务校验 → msg     │        │ data: null（→ {}） │
└─────────────┘          └──────────────────┘        └───────────────────┘
```

三条规则：

1. **成功码统一 `200`**，失败码统一 `500`，`isSuccess()` 只认 `200`
2. **三方原始码/描述只进 `msg`**（如 `"errcode=40001, errmsg=..."`），不占 `code`
3. **data 永不为 null**（由 L1 的 null 转默认值序列化器保证）

---

## 四、可插拔设计（SPI）

状态码映射器设计为**接口 + SPI**，每个业务模块实现自己的映射器，可插拔注册，新增平台零改动核心。

### 1. 接口契约（L1 定义）

```java
package cc.hongz.ztools.response.support;

/** 状态码映射器 SPI：三方状态码 → 统一响应语义。 */
public interface StatusMapper {
    /** 来源标识（如 gitee / aliyun / wechat_mp）。 */
    String source();

    /** 三方码是否成功（默认统一为 false，走失败分支）。 */
    default boolean isSuccess(int thirdPartyCode) {
        return false;
    }

    /** 三方错误信息 → 统一 msg（三方码 + 描述拼进 msg，不占 code）。 */
    String toMessage(int thirdPartyCode, String thirdPartyMsg);
}
```

### 2. 业务模块实现（L2）

```java
/** gitee 平台状态码映射。 */
public class GiteeStatusMapper implements StatusMapper {
    @Override
    public String source() {
        return "gitee";
    }

    @Override
    public String toMessage(final int code, final String msg) {
        return "gitee error: " + msg;
    }
}
```

### 3. SPI 注册

`META-INF/services/cc.hongz.ztools.response.support.StatusMapper` 写入实现类全限定名。

### 4. 加载与使用

L1 通过 `ServiceLoader` 或注册表按 `source()` 查找对应 mapper；业务模块在边界处调用 `toMessage()` 归一化后返回统一响应。

**可插拔收益**：

- 新增平台 = 新增一个 `StatusMapper` 实现 + SPI 注册，**不改 L1 核心**
- 各业务模块（zauth/支付/短信）复用同一套映射机制，不再各自发明状态码
- 映射逻辑可单测、可替换（插拔）

---

## 五、落地现状与演进

- **已完成**：`AuthResponseStatus.SUCCESS/FAILURE` 对齐 `200/500`；`isSuccess()` 撤销 `2000`；三方码透传改为进 `msg`；null 转默认值下沉为 `NullToDefaultSupport`（ztools-response）。
- **待演进**：`AuthResponseStatus` 细分码（`5001~5016`）仍在 `responseError` 透传进 `code`，需收敛为「统一 500 + 细分类型进 msg」；状态码映射器从枚举逐步演进为可插拔 `StatusMapper` SPI。

---

## 相关

- [response模块总结](/blog/ztools-response-module/) — 上级 MOC
- [ajax与拦截包总结](/blog/ztools-ajax-intercept-pkg/) — `AjaxResult` / `isSuccess` / 业务状态码体系
- [核心与工厂包总结](/blog/ztools-response-core-pkg/) — `NullToDefaultSupport` 所在的转换体系
- **zauth按平台拆分方案** — 三方平台对接案例
