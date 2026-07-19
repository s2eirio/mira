---
name: "mira-k-branch"
description: "Mira ��ϵ�е� mira-k-branch Skill"
---

# Skill: mira-k-branch

## 所�?Agent
Mira-Keeper

## 描述
执行 Git Flow 分支管理操作，包括创�?切换分支、合并、删除特性分支、处理冲突等�?
## 输入
- `action`: 操作类型（`CREATE` | `SWITCH` | `MERGE` | `DELETE` | `STATUS`�?- `branch_name`: 分支名称（如 `feature/wechat-login`�?- `target_branch`: 目标分支（如 `develop`、`main`�?
## Git Flow 分支模型
```text
main                    �?生产环境，仅接受 release 合并
  �?develop                 �?开发环境，日常集成
  �?feature/*               �?特性分支，�?develop 切出，合并回 develop
release/*               �?发布分支，从 develop 切出，合并回 main + develop
hotfix/*                �?热修复分支，�?main 切出，合并回 main + develop
```

## 支持的操�?
### 1. CREATE �?创建新分�?```bash
git checkout -b {branch_name} {base_branch}
git push origin {branch_name}
```

### 2. SWITCH �?切换分支
```bash
git checkout {branch_name}
git pull origin {branch_name}
```

### 3. MERGE �?合并分支（带 --no-ff�?```bash
git checkout {target_branch}
git pull origin {target_branch}
git merge --no-ff {branch_name} -m "Merge {branch_name} into {target_branch}"
git push origin {target_branch}
```

### 4. DELETE �?删除分支（本�?+ 远程�?```bash
git branch -d {branch_name}
git push origin --delete {branch_name}
```

### 5. STATUS �?查询当前状�?```bash
git branch --show-current
git status --short
```

## 输出格式
```json
{
  "action": "MERGE",
  "source_branch": "feature/wechat-login",
  "target_branch": "develop",
  "status": "SUCCESS",
  "commit_hash": "a1b2c3d",
  "conflicts": [],
  "message": "合并完成，无冲突�?
}
```

## 约束
- 禁止直接�?main 分支 push，必须通过 MERGE 操作�?develop �?release/* 合并�?- 合并时若发现冲突，暂停流程，输出冲突文件列表，等待用户解决�?- 特性分支合并后自动删除（可选，由用户确认）�?