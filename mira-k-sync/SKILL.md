---
name: "mira-k-sync"
description: "Mira ��ϵ�е� mira-k-sync Skill"
---

# Skill: mira-k-sync

## 所�?Agent
Mira-Keeper

## 描述
�?GitHub 拉取最�?Mira 体系定义（`.ai/` 目录），运行黄金评估集验证后生效，确�?Mira 体系自身持续进化�?
## 输入
- `engine_repo`: Mira 引擎仓库地址（如 `git@github.com:your-org/mira-engine.git`�?- `auto_update`: 是否自动更新（布尔值）
- `run_evals`: 是否运行黄金评估集（布尔值，默认 true�?
## 同步流程

1. 检查本地引擎版本（读取 .ai/manifest.json�?2. 获取远程最新版本（git ls-remote --tags�?3. 对比版本�?4. 若远程版本更高：
   a. 备份当前 .ai/ 目录�?.ai/backup/v{current_version}/
   b. git pull 更新 .ai/ 目录
   c. 运行黄金评估集（tests/ai-evals/�?   d. 若评估通过 �?更新 manifest.json 中的版本�?   e. 若评估失�?�?自动回滚至备份版本，输出失败报告
5. 若远程版本与本地一�?�?输出"已是最新版�?

## 黄金评估集示�?```json
// tests/ai-evals/eval-suite.json
{
  "cases": [
    {
      "name": "platform-sniffer 识别 Web 关键�?,
      "skill": "mira-p-sniffer",
      "input": "做一个后台管理系�?,
      "expected_output": { "detected_platforms": [{ "platform": "WEB" }] }
    },
    {
      "name": "GWT 生成器包含异常用�?,
      "skill": "mira-b-gwt",
      "input": "用户登录功能",
      "expected_contains": ["TC-002", "网络异常", "TC-003", "密码错误"]
    }
  ]
}
```

## 输出格式
```json
{
  "current_version": "1.2.0",
  "latest_version": "1.3.0",
  "action": "UPDATED",
  "backup_path": ".ai/backup/v1.2.0",
  "eval_results": {
    "total": 12,
    "passed": 12,
    "failed": 0
  },
  "status": "SUCCESS",
  "recommendation": "引擎已升级至 v1.3.0，请重启 Mira-O 以加载新能力�?
}
```

## 约束
- 自动更新仅在小版本（Patch）和次版本（Minor）时启用，主版本（Major）升级须用户手动确认�?- 黄金评估集全部通过是更新的硬性条件，任何用例失败都会触发自动回滚�?- 引擎升级后自动更�?PROJECT_INDEX.md 中的 engine_version 字段�?- 支持从私�?Git 仓库拉取（通过 SSH Key �?Personal Access Token 认证）�?