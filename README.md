# Mira - Vibe Coding Agent System

一个完整的 Vibe Coding Agent 系统，包含 6 个核心 Agent 和 20+ Skill。

## 架构概览

### 6 个核心 Agent

| Agent | 角色 | 职责 |
|-------|------|------|
| **Orchestrator** | 项目经理 | 需求解析、任务分派、冲突仲裁 |
| **Design** | 设计总监 | 设计令牌、线框图、组件库映射 |
| **Dev** | 技术主管 | GWT清单、组件代码、编译自检 |
| **QA** | 测试总监 | 视觉回归、逻辑测试、报告生成 |
| **Ops** | DevOps | 分支管理、版本控制、环境部署 |
| **Platform** | 架构师 | 平台嗅探、技术栈匹配、跨平台策略 |

### 核心 Skill

| Skill | 功能 |
|-------|------|
| GwtGenerator | GWT 测试用例生成 |
| UiStateMatrix | UI 状态矩阵生成 |
| CodeGeneration | React/Vue 代码生成 |
| PlatformSniffer | 平台检测与技术栈推荐 |
| VersionInference | 语义化版本推断 |
| ChangelogGeneration | 变更日志生成 |
| DesignTokensExport | 设计令牌导出 |

## 快速开始

```bash
# 安装依赖
npm install

# 编译项目
npm run build

# 开发模式
npm run dev
```

## 使用示例

```typescript
import { Mira } from 'mira';

const mira = new Mira();

const result = await mira.runWorkflow('创建一个极简风格的待办事项 Web 应用');

console.log(result.summary);
```

## 目录结构

```
mira/
├── agents/          # 6 个核心 Agent
│   ├── orchestrator.agent.ts
│   ├── design.agent.ts
│   ├── dev.agent.ts
│   ├── qa.agent.ts
│   ├── ops.agent.ts
│   └── platform.agent.ts
├── skills/          # 核心 Skill
│   ├── gwt-generator.skill.ts
│   ├── ui-state-matrix.skill.ts
│   ├── code-generation.skill.ts
│   ├── platform-sniffer.skill.ts
│   ├── version-inference.skill.ts
│   ├── changelog-generation.skill.ts
│   └── design-tokens-export.skill.ts
├── schemas/         # JSON Schema 定义
├── config/          # 配置文件
├── lib/             # 工具函数
├── docs/            # 文档
├── index.ts         # 主入口
├── package.json
├── tsconfig.json
└── .gitignore
```

## 工作流

1. **总控 Agent** 解析需求，检测平台
2. **平台规划 Agent** 推荐技术栈
3. **设计 Agent** 生成设计令牌和布局结构
4. **开发 Agent** 生成测试用例和组件代码
5. **验收 Agent** 执行测试并生成报告
6. **运维 Agent** 创建版本和变更日志

## 技术栈

- TypeScript 5.7+
- Node.js 20+

## 许可证

MIT
