---
name: "mira-p-matcher"
description: "Mira ��ϵ�е� mira-p-matcher Skill"
---

# Skill: mira-p-matcher

## 所�?Agent
Mira-Planner

## 描述
根据需求特征（平台、复杂度、性能要求、团队背景），推荐最优技术栈，输出主推方案与备选方案，并附评分与理由�?
## 输入
- `detected_platforms`: 平台列表（来�?`mira-p-sniffer`�?- `entities`: 需求实体（来自 Mira-O �?`mira-o-vision`�?- `constraints`: 约束条件（如时间、预算、技术偏好）

## 技术栈匹配规则�?| 平台 | 需求特�?| 主推方案 | 备选方�?| 评分逻辑 |
| :--- | :--- | :--- | :--- | :--- |
| **WEB** | 后台管理、CRUD 为主 | React + Vite + shadcn/ui + Tailwind | Vue 3 + Vite + Element Plus | 主推生态成熟度 95%，备�?85% |
| **WEB** | 需要极�?SEO、内容展示型 | Next.js (App Router) + Tailwind | Nuxt 3 + Tailwind | 主推 SEO 友好�?98%，备�?90% |
| **MINIAPP** | 微信生态内、轻�?| Taro 3 + React + NutUI | uni-app + Vue 3 + Vant | 主推 Taro 文档质量 92%，备�?85% |
| **PC** | 强离线、系统级权限 | Electron + React + SQLite | Tauri + React + SQLite | 主推生态成熟度 95%，备选安装包体积 80% |
| **APP** | 高性能动画、跨端一致�?| Flutter 3 | React Native + Expo | 主推性能 90%，备选开发速度 85% |
| **混合（WEB + MINIAPP�?* | 需最大化复用 | Taro 3 + React（一套代码双端） | Next.js + Taro 独立双端 | 主推复用�?85%，备选复用率 40% |
| **混合（WEB + APP�?* | 需最大化复用 | React Native Web + Expo | Flutter Web + Flutter Mobile | 主推 Web 兼容�?80%，备选一致�?90% |

## 评分维度
| 维度 | 权重 | 说明 |
| :--- | :--- | :--- |
| 生态成熟度 | 25% | npm 包数量、社区活跃度、Stack Overflow 问题�?|
| 开发效�?| 25% | 脚手架完善度、热更新速度、调试体�?|
| 学习曲线 | 15% | 团队现有技术栈匹配度、文档质�?|
| 性能表现 | 20% | 首屏加载、运行时帧率、内存占�?|
| 长期维护�?| 15% | 大厂背书、版本迭代频率、迁移成�?|

## 输出格式（严�?JSON�?```json
{
  "primary": {
    "platform": "WEB",
    "framework": "React 18.3",
    "build_tool": "Vite 5.0",
    "ui_lib": "shadcn/ui",
    "css": "Tailwind 3.4",
    "state_management": "Zustand",
    "score": 94,
    "reasons": [
      "生态成熟，招聘成本�?,
      "与需求中�?后台管理'高度匹配",
      "shadcn/ui 组件库覆盖所有需要的表格/表单场景"
    ]
  },
  "alternative": {
    "platform": "WEB",
    "framework": "Vue 3.4",
    "build_tool": "Vite 5.0",
    "ui_lib": "Element Plus",
    "css": "SCSS",
    "state_management": "Pinia",
    "score": 85,
    "reasons": [
      "学习曲线略高，但同样是成熟方�?,
      "Element Plus 对中后台场景覆盖全面"
    ]
  },
  "recommendation": "主推 React + shadcn/ui 方案，因其与需求匹配度最高且团队招聘成本最低�?
}
```

## 约束
- 必须输出至少一个备选方案，提供对比选择空间�?- 评分必须附带详细理由，每个理由不超过 20 字�?- 若需求中包含明确技术约束（�?必须使用 Vue"），�?primary 必须优先满足约束�?