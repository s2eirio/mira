# Skill: mira-o-flow

## 所属 Agent
Mira-Orchestrator

## 描述
管理 Mira 体系的多阶段流程状态锁，防止并行冲突，记录当前阶段与进度。

## 支持的操作

### `acquire` — 获取锁
- 参数：`phase: string`（如 `"CODING"`、`"DEPLOYING"`）
- 返回：`{ success: boolean, current_holder: string }`

### `release` — 释放锁
- 参数：`phase: string`
- 返回：`{ success: boolean }`

### `status` — 查询状态
- 返回：`{ current_phase: string, holder: string, acquired_at: timestamp }`

### `force_release` — 强制释放（异常恢复用）
- 返回：`{ released_phase: string }`

## 状态机
```text
IDLE → PLANNING → DESIGNING → CODING → REVIEWING → BUILDING → DEPLOYING → DONE

允许回退：REVIEWING 失败时可回到 CODING。
```

## 存储
`.mira/flow-state.json`

## 约束
- 尝试进入被占用阶段时返回 `{ success: false, message: "Phase is locked by X" }`。
- 超过 30 分钟无心跳的锁视为"僵尸锁"，自动标记为 stale。
