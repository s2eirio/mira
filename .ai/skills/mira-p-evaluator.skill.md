# Skill: mira-p-evaluator

## 所属 Agent
Mira-Planner

## 描述
评估多平台间代码复用率，输出分层建议（Core 层 vs Adapter 层），帮助用户理解多平台开发的成本分布。

## 输入
- `detected_platforms`: 平台列表
- `primary`: 主推技术栈方案（来自 `mira-p-matcher`）

## 复用率计算规则
| 代码层次 | 定义 | 跨平台复用潜力 |
| :--- | :--- | :--- |
| **Core 层** | 状态管理（Zustand/Redux）、业务逻辑（Service）、类型定义（Types）、工具函数（Utils） | **高**（80%~100%） |
| **UI 组件层** | 基础 UI 元件（Button、Input、Modal） | **中**（30%~60%，取决于是否使用跨端 UI 库） |
| **页面层** | 具体页面布局、路由配置 | **低**（10%~30%） |
| **平台适配层** | 平台特有的 API 调用（如微信 wx API、Electron IPC） | **无**（0%，必须各端独立实现） |

## 场景复用率参考值
| 场景 | 技术组合 | Core 复用率 | UI 复用率 | 总复用率（估算） |
| :--- | :--- | :---: | :---: | :---: |
| Web + 小程序（Taro） | Taro 3 + React | 95% | 70% | 75% |
| Web + App（RN Web） | React Native Web + Expo | 90% | 50% | 60% |
| Web + 小程序 + App（uni-app） | uni-app + Vue 3 | 85% | 60% | 65% |
| Web + PC（Electron） | React + Electron | 100% | 90% | 92% |
| 纯 Web 单端 | React + Vite | 100% | 100% | 100% |

## 输出格式（严格 JSON）
```json
{
  "platforms": ["WEB", "MINIAPP"],
  "reusability": {
    "core_layer": {
      "percentage": 95,
      "files": ["stores/", "services/", "types/", "utils/"],
      "note": "所有 Core 层代码可在 Web 和小程序间完全共享"
    },
    "ui_layer": {
      "percentage": 70,
      "files": ["components/", "pages/"],
      "note": "需使用 Taro 的跨端组件库（如 NutUI），部分 Web 专用组件需重写"
    },
    "adapter_layer": {
      "percentage": 0,
      "files": ["adapters/web/", "adapters/miniapp/"],
      "note": "平台适配层各端独立，无复用"
    }
  },
  "estimated_effort_saving": "相比独立双端开发，预计节省 40% 的开发时间",
  "recommendation": "建议优先开发 Core 层，确保接口抽象完备后再分端开发 UI。"
}
```

## 约束
- 总复用率 = (Core 层代码量 × 复用率 + UI 层代码量 × 复用率) / 总代码量（估算）。
- 若平台列表只有 1 个，复用率报告可简化为"单端开发，无复用问题"。
- 输出必须包含 estimated_effort_saving，帮助用户理解成本优势。
