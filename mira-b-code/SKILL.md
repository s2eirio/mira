---
name: "mira-b-code"
description: "Mira ��ϵ�е� mira-b-code Skill"
---

# Skill: mira-b-code

## 所�?Agent
Mira-Builder

## 描述
整合所有输入（Core 层、UI 组件、设计令牌、GWT 用例），为每个目标平台生�?*完整的、可编译的源码文�?*。这�?Mira-B �?总装车间"�?
## 输入
- `core_files`: 来自 `mira-b-core` �?Core 层文件列�?- `ui_components`: 来自 `mira-b-ui` �?UI 组件代码
- `design_tokens`: 来自 `mira-d-token` 的设计令�?- `api_contracts`: 来自 `mira-b-contract` �?API 契约
- `platforms`: 目标平台列表
- `gwt_cases`: 来自 `mira-b-gwt` 的测试用�?
## 输出文件结构（以 Web 为例�?
```text
frontend/adapters/web/
├── index.html                     # 入口 HTML
├── main.tsx                       # 应用入口
├── App.tsx                        # 根组�?├── components/
�?  ├── ui/                        # 基础 UI 组件（Button, Input, Card...�?�?  �?  ├── button.tsx
�?  �?  ├── input.tsx
�?  �?  └── card.tsx
�?  └── features/                  # 业务功能组件
�?      ├── todo-list.tsx
�?      ├── todo-item.tsx
�?      └── todo-form.tsx
├── pages/                         # 页面级组�?�?  ├── home.page.tsx
�?  └── detail.page.tsx
├── hooks/                         # 自定�?Hooks
�?  └── use-todos.ts
├── styles/
�?  └── globals.css                # 全局样式 + Tailwind 导入
├── vite.config.ts                 # Vite 配置
├── tailwind.config.js             # Tailwind 配置
└── tsconfig.json                  # TypeScript 配置
```

## 代码织造规�?| 输入来源 | 织造位�?| 织造规�?|
| :--- | :--- | :--- |
| mira-b-core/stores/ | web/stores/ | 直接复制，无需修改 |
| mira-b-core/services/ | web/services/ | 注入 HTTP 客户端实现（Web 使用 axios�?|
| mira-b-core/types/ | web/types/ | 直接复制 |
| mira-d-token | web/tailwind.config.js + globals.css | 转换�?Tailwind 主题扩展 + CSS 变量 |
| mira-b-ui | web/components/ | 按平台适配器要求组�?|
| mira-b-contract | web/types/api.contracts.ts | 直接复制 |
| mira-b-gwt | web/__tests__/ | 生成 Playwright 测试脚本 |

## 输出格式
```json
{
  "platform": "WEB",
  "files_generated": 47,
  "files": [
    {
      "path": "frontend/adapters/web/index.html",
      "content": "<!DOCTYPE html>...",
      "size_kb": 2.3
    }
  ],
  "build_command": "cd frontend/adapters/web && npm run build",
  "compile_status": "PASSED",
  "compile_output": "�?47 files compiled successfully, 0 errors, 3 warnings"
}
```

## 约束
- 每个平台独立生成完整的代码树，互不干扰�?- 编译检查（tsc --noEmit）必须通过，否则阻塞后续流程�?- 若某个平台的代码生成失败，不影响其他平台，但需在输出中明确标注失败平台及原因�?