---
name: "mira-b-core"
description: "Mira ��ϵ�е� mira-b-core Skill"
---

# Skill: mira-b-core

## 所�?Agent
Mira-Builder

## 描述
生成平台无关�?Core 层代码，包含状态管理（Stores）、业务服务（Services）、类型定义（Types）、工具函数（Utils）。Core �?*禁止引入任何平台特定 API**（如 `window`、`wx`、`localStorage`），所有平台依赖必须通过抽象接口注入�?
## 输入
- `entities`: 需求实体（来自 `mira-o-vision`�?- `domain_rules`: 领域规则（来�?`mira-b-domain`�?- `api_contracts`: API 契约（来�?`mira-b-contract`，若已生成）

## 输出文件结构

```text
frontend/core/
├── stores/
�?  └── todo.store.ts              # Zustand 状态管�?├── services/
�?  ├── http.client.ts             # 抽象 HTTP 客户端（接口定义，无具体实现�?�?  └── todo.service.ts            # 业务服务（调�?HTTP 客户端）
├── types/
�?  └── todo.types.ts              # TypeScript 类型定义
└── utils/
    ├── formatter.util.ts          # 数据格式化工�?    └── validator.util.ts          # 数据校验工具
```

## Core 层代码示�?
### 1. 类型定义（types/todo.types.ts�?```typescript
export interface ITodo {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateTodoInput {
  title: string;
  description?: string;
}

export interface IUpdateTodoInput {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}
```

### 2. 状态管理（stores/todo.store.ts�?```typescript
import { create } from 'zustand';
import type { ITodo } from '../types/todo.types';

interface TodoStore {
  todos: ITodo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (todo: ITodo) => void;
  updateTodo: (id: string, data: Partial<ITodo>) => void;
  deleteTodo: (id: string) => void;
  setTodos: (todos: ITodo[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  isLoading: false,
  error: null,
  addTodo: (todo) => set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (id, data) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  setTodos: (todos) => set({ todos }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
```

### 3. HTTP 客户端抽象（services/http.client.ts�?```typescript
// 平台无关�?HTTP 客户端接�?export interface IHttpClient {
  get<T>(url: string, config?: any): Promise<T>;
  post<T>(url: string, data?: any, config?: any): Promise<T>;
  put<T>(url: string, data?: any, config?: any): Promise<T>;
  delete<T>(url: string, config?: any): Promise<T>;
}

// 具体实现由各平台适配器注�?let _httpClient: IHttpClient | null = null;

export function setHttpClient(client: IHttpClient): void {
  _httpClient = client;
}

export function getHttpClient(): IHttpClient {
  if (!_httpClient) {
    throw new Error('HTTP client not initialized. Call setHttpClient() first.');
  }
  return _httpClient;
}
```

### 4. 业务服务（services/todo.service.ts�?```typescript
import { getHttpClient } from './http.client';
import type { ITodo, ICreateTodoInput, IUpdateTodoInput } from '../types/todo.types';

const API_BASE = '/api/todos';

export const TodoService = {
  async list(): Promise<ITodo[]> {
    const client = getHttpClient();
    return client.get<ITodo[]>(API_BASE);
  },

  async create(input: ICreateTodoInput): Promise<ITodo> {
    const client = getHttpClient();
    return client.post<ITodo>(API_BASE, input);
  },

  async update(id: string, input: IUpdateTodoInput): Promise<ITodo> {
    const client = getHttpClient();
    return client.put<ITodo>(`${API_BASE}/${id}`, input);
  },

  async delete(id: string): Promise<void> {
    const client = getHttpClient();
    return client.delete<void>(`${API_BASE}/${id}`);
  },
};
```

## 约束
- Core 层代码必�?100% 无平台特�?API，所有平台依赖（�?fetch、localStorage、window）必须通过接口抽象注入�?- 状态管理优先使�?Zustand（因其轻量且支持 React Native），若用户偏好其他方案可调整�?- 所有服务方法的返回值必须使�?ITodo 等类型定义，禁止使用 any�?- 若领域规则包含审计日志，需�?Service 层自动添加日志调用�?