---
name: "mira-o-scroll"
description: "Mira ��ϵ�е� mira-o-scroll Skill"
---

# Skill: mira-o-scroll

## 所�?Agent
Mira-Orchestrator

## 描述
维护 `PROJECT_INDEX.md` 项目全景文档，确保所�?Agent 共享同一套上下文，也是交接给其他 LLM 的核心资产�?
## 输入
- `action`: `READ` | `WRITE` | `UPDATE_SECTION`
- `section`: 章节名称
- `content`: 要写入的内容

## 支持的章�?| 章节标识 | 内容 |
| :--- | :--- |
| `header` | 项目名称、版本、最后更新时�?|
| `tech_stack` | 前端/后端/数据库技术栈明细 |
| `design_tokens` | 设计变量快照 |
| `platform_matrix` | 各平台支持状�?|
| `test_coverage` | 测试用例通过�?|
| `known_debt` | 已知技术债务 |
| `api_contracts` | API 契约摘要 |
| `deployment_status` | 各环境部署状�?|
| `version_history` | 版本发布日志 |

## 约束
- 任何 Agent 不得直接写入 `PROJECT_INDEX.md`，必须通过�?Skill 操作�?- 每次写入后自动在文档末尾追加更新日志�?- 读取时若文档为空或格式错误，自动重建标准结构�?