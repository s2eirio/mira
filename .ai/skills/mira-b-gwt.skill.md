# Skill: mira-b-gwt

## 所属 Agent
Mira-Builder

## 描述
将用户故事或需求描述，转化为结构化的 GWT（Given-When-Then）测试用例清单，为后续的 QA 验收提供精确的行为标准。

## 输入
- `user_story`: 用户故事文本（或来自 `mira-o-vision` 的实体列表）
- `platforms`: 目标平台列表

## GWT 用例结构
每个用例必须包含以下 5 个字段：

| 字段 | 说明 | 示例 |
| :--- | :--- | :--- |
| `id` | 用例编号，格式 `TC-{三位数字}` | `TC-001` |
| `given` | 前置条件（初始状态） | 用户已登录，购物车为空 |
| `when` | 用户操作（触发动作） | 点击"加入购物车"按钮 |
| `then` | 预期结果（状态变化 + UI 反馈） | 按钮变为"已添加"，角标数字 +1 |
| `data_testid` | 对应元素锚点 | `btn-add-cart` |

## 输出格式（严格 JSON）
```json
{
  "test_suite": {
    "name": "购物车功能测试",
    "platforms": ["WEB", "MINIAPP"],
    "total_cases": 5,
    "cases": [
      {
        "id": "TC-001",
        "given": "用户已登录，商品库存 > 0，购物车为空",
        "when": "点击商品详情页的「加入购物车」按钮",
        "then": "按钮文案变为「添加中...」并禁用；2 秒后，购物车角标数字从 0 变为 1，按钮恢复为「已添加」",
        "data_testid": "btn-add-cart"
      },
      {
        "id": "TC-002",
        "given": "用户已登录，商品库存 = 0",
        "when": "点击「加入购物车」按钮",
        "then": "按钮保持灰色不可点击，下方出现红色提示「库存不足」",
        "data_testid": "btn-add-cart, txt-stock-error"
      },
      {
        "id": "TC-003",
        "given": "用户未登录",
        "when": "点击「加入购物车」按钮",
        "then": "弹出登录弹窗，购物车不发生变化",
        "data_testid": "modal-login"
      },
      {
        "id": "TC-004",
        "given": "购物车已有该商品 1 件",
        "when": "再次点击「加入购物车」",
        "then": "弹出 Toast 提示「已加入 2 件」，角标数字变为 2",
        "data_testid": "toast-notification"
      },
      {
        "id": "TC-005",
        "given": "网络异常（接口超时）",
        "when": "点击「加入购物车」",
        "then": "3 秒后按钮恢复为初始状态，并提示「网络开小差了，请重试」",
        "data_testid": "toast-error"
      }
    ]
  }
}
```

## 约束
- 每个用例的 data_testid 必须指向具体的交互元素（如按钮、输入框、提示文案）。
- 必须覆盖 Happy Path（主流程） + 至少 2 个 Edge Cases（边界/异常）。
- 若需求中包含明确的数据字段，须在 then 中体现数据验证（如"列表显示标题、描述、截止日期"）。
