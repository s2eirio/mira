# Skill: mira-b-anchor

## 所属 Agent
Mira-Builder

## 描述
为所有交互元素注入 `data-testid` 属性，命名规范统一，便于 QA Agent 的自动化测试定位。

## 输入
- `source_code`: 生成的组件源码（来自 `mira-b-code`）
- `gwt_cases`: GWT 用例清单（来自 `mira-b-gwt`）

## data-testid 命名规范

```text
{module}-{element}-{action}
```

| 字段 | 说明 | 示例 |
| :--- | :--- | :--- |
| module | 所属功能模块 | todo, user, cart |
| element | 元素类型 | btn, input, list, card, modal, toast |
| action | 操作或状态 | add, delete, edit, submit, cancel, empty, loading |

## 常用命名示例
| 元素 | data-testid |
| :--- | :--- |
| 新增待办按钮 | todo-btn-add |
| 待办列表 | todo-list |
| 单个待办项 | todo-item-{id} |
| 删除按钮（在待办项中） | todo-btn-delete-{id} |
| 编辑输入框 | todo-input-edit |
| 搜索框 | todo-input-search |
| 空状态提示 | todo-empty |
| 加载中状态 | todo-loading |
| Toast 提示 | toast-notification |

## 注入规则
| 元素类型 | 注入位置 | 示例 |
| :--- | :--- | :--- |
| 按钮（Button） | `<button>` 或 `<Button>` 标签 | `<button data-testid="todo-btn-add">新增</button>` |
| 输入框（Input） | `<input>` 或 `<Input>` 标签 | `<input data-testid="todo-input-search" />` |
| 列表容器 | `<ul>`、`<div>` 或 `<List>` | `<ul data-testid="todo-list">` |
| 列表项 | `<li>` 或 `<div>` | `<li data-testid="todo-item-{todo.id}">` |
| 弹窗 | `<Dialog>` 或 `<Modal>` | `<Dialog data-testid="modal-confirm">` |
| Toast | `<Toast>` 或 `<div>` | `<Toast data-testid="toast-notification">` |

## 输出示例
```typescript
// 原始代码（注入前）
<button onClick={handleAdd}>新增</button>

// 注入后
<button data-testid="todo-btn-add" onClick={handleAdd}>新增</button>
```

## 约束
- data-testid 必须使用连字符（kebab-case），禁止使用驼峰或下划线。
- 列表项（如 todo-item-{id}）的 {id} 部分使用动态值，在测试时可通过正则匹配。
- 若 GWT 用例中已定义 data_testid，必须与之一致；否则以 GWT 为准。
- 非交互元素（纯展示文本、装饰性图标）不需要注入 data-testid。
