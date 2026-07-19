---
name: "mira-p-evaluator"
description: "Mira ��ϵ�е� mira-p-evaluator Skill"
---

# Skill: mira-p-evaluator

## 所�?Agent
Mira-Planner

## 描述
评估多平台间代码复用率，输出分层建议（Core �?vs Adapter 层），帮助用户理解多平台开发的成本分布�?
## 输入
- `detected_platforms`: 平台列表
- `primary`: 主推技术栈方案（来�?`mira-p-matcher`�?
## 复用率计算规�?| 代码层次 | 定义 | 跨平台复用潜�?|
| :--- | :--- | :--- |
| **Core �?* | 状态管理（Zustand/Redux）、业务逻辑（Service）、类型定义（Types）、工具函数（Utils�?| **�?*�?0%~100%�?|
| **UI 组件�?* | 基础 UI 元件（Button、Input、Modal�?| **�?*�?0%~60%，取决于是否使用跨端 UI 库） |
| **页面�?* | 具体页面布局、路由配�?| **�?*�?0%~30%�?|
| **平台适配�?* | 平台特有�?API 调用（如微信 wx API、Electron IPC�?| **�?*�?%，必须各端独立实现） |

## 场景复用率参考�?| 场景 | 技术组�?| Core 复用�?| UI 复用�?| 总复用率（估算） |
| :--- | :--- | :---: | :---: | :---: |
| Web + 小程序（Taro�?| Taro 3 + React | 95% | 70% | 75% |
| Web + App（RN Web�?| React Native Web + Expo | 90% | 50% | 60% |
| Web + 小程�?+ App（uni-app�?| uni-app + Vue 3 | 85% | 60% | 65% |
| Web + PC（Electron�?| React + Electron | 100% | 90% | 92% |
| �?Web 单端 | React + Vite | 100% | 100% | 100% |

## 输出格式（严�?JSON�?```json
{
  "platforms": ["WEB", "MINIAPP"],
  "reusability": {
    "core_layer": {
      "percentage": 95,
      "files": ["stores/", "services/", "types/", "utils/"],
      "note": "所�?Core 层代码可�?Web 和小程序间完全共�?
    },
    "ui_layer": {
      "percentage": 70,
      "files": ["components/", "pages/"],
      "note": "需使用 Taro 的跨端组件库（如 NutUI），部分 Web 专用组件需重写"
    },
    "adapter_layer": {
      "percentage": 0,
      "files": ["adapters/web/", "adapters/miniapp/"],
      "note": "平台适配层各端独立，无复�?
    }
  },
  "estimated_effort_saving": "相比独立双端开发，预计节省 40% 的开发时�?,
  "recommendation": "建议优先开�?Core 层，确保接口抽象完备后再分端开�?UI�?
}
```

## 约束
- 总复用率 = (Core 层代码量 × 复用�?+ UI 层代码量 × 复用�? / 总代码量（估算）�?- 若平台列表只�?1 个，复用率报告可简化为"单端开发，无复用问�?�?- 输出必须包含 estimated_effort_saving，帮助用户理解成本优势�?