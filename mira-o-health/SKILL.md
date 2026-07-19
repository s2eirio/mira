---
name: "mira-o-health"
description: "Mira ��ϵ�е� mira-o-health Skill"
---

# Skill: mira-o-health

## 所�?Agent
Mira-Orchestrator

## 描述
�?Mira 体系启动时执行完整性检查，确保项目环境就绪。支持自动修复部分常见问题�?
## 输入
- `scope`: `FULL` | `MINIMAL` | `PLATFORM_ONLY`
- `auto_fix`: 布尔�?
## 检查项矩阵
| ID | 检查项 | 失败级别 | 自动修复 |
| :--- | :--- | :--- | :--- |
| HC-01 | 核心目录结构 | ERROR | 重建缺失目录 |
| HC-02 | 环境变量 `.env` | ERROR | �?`.env.example` 复制，生成随�?JWT_SECRET�?*暂停并提示用户填�?* |
| HC-03 | AI 引擎版本 | WARNING | 若落后且 `auto_fix=true`，执�?`git pull` |
| HC-04 | 数据库迁移对�?| ERROR | 执行 `npx prisma migrate dev` |
| HC-05 | 依赖包完整�?| WARNING | 执行 `pnpm install` |
| HC-06 | Docker 容器状�?| WARNING | 执行 `docker-compose up -d` |
| HC-07 | 黄金评估�?| WARNING | 仅报告，不自动修�?|
| HC-08 | 磁盘空间 | WARNING | 报告警告 |

## 失败级别
- **ERROR**：阻断流程，必须修复�?- **WARNING**：继续执行但输出警告�?
## 输出格式
```json
{
  "status": "PASSED" | "FAILED" | "PASSED_WITH_WARNINGS",
  "checks": [
    { "id": "HC-01", "status": "PASSED", "message": null }
  ],
  "summary": "7 passed, 1 failed, 0 warnings",
  "requires_user_action": true,
  "user_action_items": ["请在 .env 中配�?DATABASE_URL"]
}
```

## 约束
- 禁止自动修复：生产环�?.env、涉及表删除�?schema.prisma 变更�?- 确认闸门：HC-03 �?HC-07 即使 auto_fix=true 也需用户确认�?