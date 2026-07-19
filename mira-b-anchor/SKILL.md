---
name: "mira-b-anchor"
description: "Mira ��ϵ�е� mira-b-anchor Skill"
---

# Skill: mira-b-anchor

## 所�?Agent
Mira-Builder

## 描述
为所有交互元素注�?`data-testid` 属性，命名规范统一，便�?QA Agent 的自动化测试定位�?
## 输入
- `source_code`: 生成的组件源码（来自 `mira-b-code`�?- `gwt_cases`: GWT 用例清单（来�?`mira-b-gwt`�?
## data-testid 命名规范

```text
{module}-{element}-{action}
```

| 字段 | 说明 | 示例 |
| :--- | :--- | :--- |
| module | 所属功能模�?| todo, user, cart |
| element | 元素类型 | btn, input, list, card, modal, toast |
| action | 操作或状�?| add, delete, edit, submit, cancel, empty, loading |

## 常用命名示例
| 元素 | data-testid |
| :--- | :--- |
| 新增待办按钮 | todo-btn-add |
| 待办列表 | todo-list |
| 单个待办�?| todo-item-{id} |
| 删除按钮（在待办项中�?| todo-btn-delete-{id} |
| 编辑输入�?| todo-input-edit |
| 搜索�?| todo-input-search |
| 空状态提�?| todo-empty |
| 加载中状�?| todo-loading |
| Toast 提示 | toast-notification |

## 注入规则
| 元素类型 | 注入位置 | 示例 |
| :--- | :--- | :--- |
| 按钮（Button�?| `<button>` �?`<Button>` 标签 | `<button data-testid="todo-btn-add">新增</button>` |
| 输入框（Input�?| `<input>` �?`<Input>` 标签 | `<input data-testid="todo-input-search" />` |
| 列表容器 | `<ul>`、`<div>` �?`<List>` | `<ul data-testid="todo-list">` |
| 列表�?| `<li>` �?`<div>` | `<li data-testid="todo-item-{todo.id}">` |
| 弹窗 | `<Dialog>` �?`<Modal>` | `<Dialog data-testid="modal-confirm">` |
| Toast | `<Toast>` �?`<div>` | `<Toast data-testid="toast-notification">` |

## 输出示例
```typescript
// 原始代码（注入前�?<button onClick={handleAdd}>新增</button>

// 注入�?<button data-testid="todo-btn-add" onClick={handleAdd}>新增</button>
```

## 约束
- data-testid 必须使用连字符（kebab-case），禁止使用驼峰或下划线�?- 列表项（�?todo-item-{id}）的 {id} 部分使用动态值，在测试时可通过正则匹配�?- �?GWT 用例中已定义 data_testid，必须与之一致；否则�?GWT 为准�?- 非交互元素（纯展示文本、装饰性图标）不需要注�?data-testid�?