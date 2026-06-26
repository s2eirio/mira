# Mira — Vibe Coding 工业化体系

一个完整的 Vibe Coding Agent 系统，包含 6 个核心 Agent 和 32 个 Skill，覆盖从需求解析到部署上线的全流程。

## 架构概览

### 6 个核心 Agent

| Agent | 角色 | 职责 |
|-------|------|------|
| **Mira-O (Orchestrator)** | 总控指挥官 | 需求解析、任务分派、流程调度、冲突仲裁 |
| **Mira-P (Planner)** | 平台规划师 | 平台嗅探、技术栈匹配、复用率评估 |
| **Mira-D (Designer)** | 设计工匠 | 设计令牌、线框图、多平台样式映射 |
| **Mira-B (Builder)** | 代码织造者 | GWT用例、状态机、领域规则、Core层、UI映射、代码织造、锚点注入、数据库建模、API契约、数据仓储 |
| **Mira-C (Checker)** | 质量守护者 | 逻辑执行、视觉对比、跨平台验证、性能基准、合规扫描、API测试 |
| **Mira-K (Keeper)** | 运维管家 | 分支管理、版本推断、变更日志、多平台构建、环境部署、引擎同步 |

### Skill 层（32 个）

| Agent | Skill 数量 | Skill 列表 |
|-------|-----------|-----------|
| Mira-O | 4 | mira-o-vision, mira-o-flow, mira-o-scroll, mira-o-health |
| Mira-P | 3 | mira-p-sniffer, mira-p-matcher, mira-p-evaluator |
| Mira-D | 3 | mira-d-token, mira-d-wire, mira-d-style |
| Mira-B | 10 | mira-b-gwt, mira-b-state, mira-b-domain, mira-b-core, mira-b-ui, mira-b-code, mira-b-anchor, mira-b-db, mira-b-contract, mira-b-repo |
| Mira-C | 6 | mira-c-runner, mira-c-visual, mira-c-cross, mira-c-bench, mira-c-compliance, mira-c-api |
| Mira-K | 6 | mira-k-branch, mira-k-version, mira-k-changelog, mira-k-build, mira-k-deploy, mira-k-sync |

## 目录结构

```
mira/
├── .ai/
│   ├── agents/          # 6 个 Agent 定义
│   │   ├── orchestrator.agent.md
│   │   ├── planner.agent.md
│   │   ├── designer.agent.md
│   │   ├── builder.agent.md
│   │   ├── checker.agent.md
│   │   └── keeper.agent.md
│   └── skills/          # 32 个 Skill 定义
│       ├── mira-o-*.skill.md (4)
│       ├── mira-p-*.skill.md (3)
│       ├── mira-d-*.skill.md (3)
│       ├── mira-b-*.skill.md (10)
│       ├── mira-c-*.skill.md (6)
│       └── mira-k-*.skill.md (6)
├── templates/           # 项目脚手架模板
├── tests/ai-evals/      # 黄金评估集
├── scripts/             # 辅助工具脚本
├── manifest.json        # 引擎清单
├── README.md
├── LICENSE
└── .gitignore
```

## 工作流

1. **Mira-O** 解析需求，检测平台
2. **Mira-P** 推荐技术栈，评估复用率
3. **Mira-D** 生成设计令牌和线框图
4. **Mira-B** 生成测试用例、状态机、领域规则、Core层、UI组件、完整代码
5. **Mira-C** 执行全维度验收（功能、视觉、跨平台、性能、合规、API）
6. **Mira-K** 版本管理、构建、部署、引擎同步

## 技术栈

- TypeScript 5.7+
- Node.js 20+

## 许可证

MIT
