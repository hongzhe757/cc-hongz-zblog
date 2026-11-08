---
title: '积木式可插拔系统架构设计'
description: '愿景：去单体化，用「中心平台 + 独立客户系统 + 标准化 CRUD + 插件扩展 + 工作流编排」实现代码隔离与积木拼接。'
pubDate: 'Nov 08 2026'
heroImage: '../../assets/blog-placeholder-3.jpg'
---

# 积木式可插拔系统架构设计

> 愿景：去单体化，用「中心平台 + 独立客户系统 + 标准化 CRUD + 插件扩展 + 工作流编排」实现代码隔离与积木拼接。

## 一、整体拓扑（中心 + 节点 + 积木）

```mermaid
flowchart TB
    subgraph Center["中心平台（Center）"]
        AM["应用/客户管理"]
        PM["模块/插件市场（积木库）"]
        DP["代码/配置下发"]
        IR["接口注册中心（上报对接）"]
        WF["工作流编排中心"]
    end

    subgraph NodeA["客户系统 A（独立部署）"]
        A_BASE["标准化 CRUD 底座"]
        A_PLUGIN["插件（字段/业务关联）"]
        A_WF["工作流执行"]
    end

    subgraph NodeB["客户系统 B（独立部署）"]
        B_BASE["标准化 CRUD 底座"]
        B_PLUGIN["插件（字段/业务关联）"]
        B_WF["工作流执行"]
    end

    Center -- "上传下发（模块/插件/配置）" --> NodeA
    Center -- "上传下发（模块/插件/配置）" --> NodeB
    NodeA -- "接口上报（唯一 ID）" --> IR
    NodeB -- "接口上报（唯一 ID）" --> IR
    IR -- "接口目录/对接" --> Center
```

## 二、客户系统内部架构（标准化 CRUD + 插件 + 工作流）

```mermaid
flowchart TB
    subgraph Node["客户系统内部"]
        direction TB

        GEN["低代码生成器<br/>（生成标准 CRUD）"]
        BASE["标准化 CRUD 底座<br/>（每表/每方法唯一 ID）"]

        subgraph Plugins["插件层"]
            P_FIELD["字段扩展插件<br/>（表加字段）"]
            P_BIZ["业务关联插件<br/>（多表关联关系）"]
            P_CUSTOM["自定义插件"]
        end

        WF["工作流引擎<br/>（串联业务逻辑）"]

        API["接口层（对外/上报中心）"]

        GEN --> BASE
        BASE --> Plugins
        Plugins --> WF
        WF --> API
        API -- "上报接口" --> Center
    end
```

## 三、接口注册 / 上报机制

```mermaid
sequenceDiagram
    participant C as 客户系统
    participant IR as 接口注册中心
    participant O as 其他系统

    C->>IR: 上报新接口（唯一 ID + 元数据）
    IR->>IR: 注册入库、生成目录
    O->>IR: 查询接口目录
    IR-->>O: 返回接口定义
    O->>C: 按 ID 对接调用
```

## 四、插件机制（字段扩展 / 业务关联）

```mermaid
flowchart LR
    subgraph Base["标准表（低代码生成）"]
        T["表 T（基础字段）"]
    end

    subgraph Ext["扩展插件（不修改基础代码）"]
        F["字段插件：新增字段 X"]
        R["关联插件：表 T ↔ 表 U 关系"]
    end

    T --> F
    T --> R
    F -. "运行时叠加" .-> T
    R -. "运行时叠加" .-> T
```

## 五、工作流编排（积木拼接）

```mermaid
flowchart LR
    S["启动"] --> Step1["CRUD 步骤 A"]
    Step1 --> Step2["业务关联插件 B"]
    Step2 --> Step3["CRUD 步骤 C"]
    Step3 --> Step4["自定义插件 D"]
    Step4 --> E["结束"]

    Step1 -. "积木模块" .- M1["模块 1"]
    Step2 -. "积木模块" .- M2["模块 2"]
    Step3 -. "积木模块" .- M3["模块 3"]
    Step4 -. "积木模块" .- M4["模块 4"]
```

---

## 核心设计要点

| 维度 | 方案 | 解决什么 |
|------|------|---------|
| 代码隔离 | 中心 + 独立客户系统，上传下发 | 单体多租户代码泄漏 |
| 标准化 CRUD | 低代码生成，唯一 ID | 接口可识别、可上报、可对接 |
| 字段扩展 | 字段扩展插件（运行时叠加） | 表加字段不改基础代码 |
| 业务关联 | 关联插件（多表关系） | 复杂业务逻辑不堆在单体里 |
| 编排 | 工作流引擎串联 | 业务逻辑可视化、可编排 |
| 积木拼接 | 模块/插件化，任意组合 | 多系统灵活组装 |

---

## 相关

- **项目文档索引** — 上级 MOC
