# Skill: mira-k-version

## 所属 Agent
Mira-Keeper

## 描述
根据变更范围（新增功能、修复 Bug、破坏性变更）推断语义化版本号（SemVer），并自动打 Git Tag。

## 输入
- `change_type`: 变更类型（`MAJOR` | `MINOR` | `PATCH` | `AUTO`）
- `current_version`: 当前版本号（从 `package.json` 或 `manifest.json` 读取）
- `commits`: 本次发布的 commit 列表（来自 `git log`）

## 语义化版本规则
| 变更类型 | 触发条件 | 版本号变化 |
| :--- | :--- | :--- |
| **MAJOR** | 破坏性变更：API 不兼容、删除功能、重构核心架构 | `1.0.0` → `2.0.0` |
| **MINOR** | 新增功能：新增 API、新增页面、新增平台支持 | `1.0.0` → `1.1.0` |
| **PATCH** | 错误修复：Bug 修复、性能优化、文档更新 | `1.0.0` → `1.0.1` |

## AUTO 模式的推断逻辑

扫描 commit message 前缀：
- 包含 `"BREAKING CHANGE"` 或 `"feat!"` → MAJOR
- 包含 `"feat:"` → MINOR
- 包含 `"fix:"` → PATCH
- 其他 → PATCH
- 若无 commit 记录 → 不升级版本号

## 输出格式
```json
{
  "current_version": "1.2.3",
  "new_version": "1.3.0",
  "change_type": "MINOR",
  "reason": "本次发布包含新增功能：微信登录集成",
  "commit_range": "a1b2c3d..e4f5g6h",
  "tag_command": "git tag -a v1.3.0 -m 'Release v1.3.0: 新增微信登录功能'"
}
```

## 约束
- 版本号存储在 package.json 的 version 字段和 manifest.json 的 version 字段，两者必须保持一致。
- 打 Tag 后自动推送至远程：`git push origin v{version}`。
- 预发布版本使用 `-beta.{n}` 或 `-rc.{n}` 后缀（如 `1.3.0-beta.1`）。
