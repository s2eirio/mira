---
name: "mira-o-vision"
description: "Mira ��ϵ�е� mira-o-vision Skill"
---

# Skill: mira-o-vision

## 所�?Agent
Mira-Orchestrator

## 描述
将用户的自然语言需求解析为结构化任务对象，提取实体、动作、隐含约束，为后续流程提供标准化输入�?
## 输入
用户的原始需求文本（自然语言）�?
## 任务
1. **意图分类**：`NEW_PROJECT` / `FEATURE_ADD` / `BUG_FIX` / `DESIGN_CHANGE` / `PLATFORM_ADD` / `UNKNOWN`
2. **实体抽取**：应用名称、目标用户、核心功能列表、数据字段、性能要求、设计风格关键词�?3. **平台推断**：扫描文本中的平台关键词（WEB / MINIAPP / PC / APP）�?4. **约束提取**：时间约束、技术约束、预算约束�?5. **歧义检�?*：标记歧义点，生成澄清问题列表�?
## 输出格式（严�?JSON�?```json
{
  "intent": "NEW_PROJECT",
  "entities": {
    "app_name": "TaskFlow",
    "target_users": ["项目经理", "开发人�?],
    "core_features": ["创建任务", "分配负责�?, "截止日期提醒"],
    "data_fields": ["title", "description", "assignee", "deadline", "status"],
    "performance_requirements": null,
    "style_keywords": ["极简", "高效"]
  },
  "platform_hints": ["WEB", "MINIAPP"],
  "constraints": {
    "time_limit": "3�?,
    "tech_stack": null,
    "budget": null
  },
  "ambiguities": [
    {
      "point": "未明确是否需要多人协作实时同�?,
      "suggested_question": "任务分配后，其他成员是否能实时看到更新？"
    }
  ],
  "confidence_score": 0.85
}
```

## 约束
- �?confidence_score < 0.7，须附加"需要用户补充以下信�?.."的提示�?- 无法识别的实体字段值设�?null�?