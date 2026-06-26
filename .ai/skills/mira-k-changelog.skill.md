# Skill: mira-k-changelog

## 所属 Agent
Mira-Keeper

## 描述
根据 Git Commit 历史，自动生成符合 [Keep a Changelog](https://keepachangelog.com/) 规范的 `CHANGELOG.md` 文件。

## 输入
- `version`: 本次发布的版本号
- `commits`: 本次发布的 commit 列表（从 `git log` 读取）
- `since_tag`: 上一个 Tag 名称（用于确定 commit 范围）

## Commit Message 解析规则
| 前缀 | 分类 | CHANGELOG 章节 |
| :--- | :--- | :--- |
| `feat:` | 新增功能 | Added |
| `fix:` | Bug 修复 | Fixed |
| `docs:` | 文档更新 | Documentation |
| `style:` | 样式调整 | Changed |
| `refactor:` | 代码重构 | Changed |
| `perf:` | 性能优化 | Performance |
| `test:` | 测试相关 | Testing |
| `chore:` | 构建工具/依赖更新 | Maintenance |
| `BREAKING CHANGE` | 破坏性变更 | **⚠️ BREAKING**（置顶） |

## 输出示例
```markdown
# Changelog

## [1.3.0] - 2026-07-15

### ⚠️ BREAKING CHANGES
- 重构了用户认证模块，`/api/auth/login` 响应移除了 `refreshToken` 字段，改为从 `Set-Cookie` 读取。

### Added
- 新增微信扫码登录功能 (#123)
- 新增待办列表的拖拽排序功能 (#98)
- 支持导出为 Excel 格式 (#76)

### Fixed
- 修复了移动端输入框在快速输入时丢失焦点的 Bug (#89)
- 修复了深色模式下表格边框颜色错误的问题 (#92)

### Changed
- 升级 React 至 18.3.0
- 优化列表滚动性能，帧率从 45fps 提升至 58fps

### Deprecated
- `GET /api/todos/legacy` 将在 v2.0.0 中移除，请迁移至 `/api/todos`

## [1.2.0] - 2026-06-30

### Added
- 新增用户个人资料编辑页面
...
```

## 约束
- 若未找到上个 Tag，则从 Git 仓库初始 commit 开始遍历。
- CHANGELOG.md 存放于项目根目录。
- 每次发布后自动追加新内容，保留历史记录。
