# Skill: mira-c-cross

## 所属 Agent
Mira-Checker

## 描述
对于多平台项目，验证同一操作序列在各平台上的行为、数据状态、UI 反馈是否完全一致。

## 输入
- `platforms`: 目标平台列表（至少 2 个）
- `gwt_cases`: GWT 测试用例清单
- `test_data`: 测试数据集（固定 Mock 数据，确保可复现）

## 验证维度
| 维度 | 验证方式 | 输出 |
| :--- | :--- | :--- |
| 行为一致性 | 在各平台执行相同 GWT 用例，对比操作结果 | 通过/失败 |
| 数据一致性 | 执行增删改操作后，对比各平台 store 中的状态 | 数据差异报告 |
| UI 状态一致性 | 对比各平台的 UI 元素可见性、文字内容、样式 | 差异截图 |

## 输出格式
```json
{
  "platforms": ["WEB", "MINIAPP", "APP"],
  "total_cases": 12,
  "consistent": 11,
  "inconsistent": 1,
  "inconsistencies": [
    {
      "case_id": "TC-004",
      "description": "删除待办后列表刷新",
      "web": {
        "status": "PASSED",
        "data": { "todos_count": 5 }
      },
      "miniapp": {
        "status": "FAILED",
        "data": { "todos_count": 6 },
        "error": "删除后列表未刷新，仍显示已删除项"
      },
      "recommendation": "检查小程序端的 TodoStore 是否使用了不同的状态更新逻辑"
    }
  ],
  "status": "PASSED_WITH_WARNINGS"
}
```

## 约束
- 仅在平台数 ≥ 2 时执行此检查。
- 各平台必须使用相同的测试数据集（通过 tests/fixtures/mock-data.json 统一配置）。
- 不一致项优先级高于其他检查，需优先修复。
