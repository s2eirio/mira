# Skill: mira-b-contract

## 所属 Agent
Mira-Builder

## 描述
生成前后端共用的 API 契约类型定义，存放于 `packages/shared-types/`，确保前后端接口请求/响应体结构完全一致。

## 输入
- `data_fields`: 数据字段列表（来自 `mira-o-vision`）
- `domain_rules`: 领域规则（来自 `mira-b-domain`）

## 输出文件结构

```text
packages/shared-types/
├── package.json
├── src/
│   ├── index.ts                   # 统一导出
│   ├── api.contracts.ts           # API 请求/响应类型
│   ├── models/                    # 实体模型
│   │   ├── todo.model.ts
│   │   └── user.model.ts
│   └── common/                    # 通用类型
│       ├── pagination.types.ts
│       └── error.types.ts
└── tsconfig.json
```

## API 契约类型生成示例
```typescript
// packages/shared-types/src/api.contracts.ts

// ----- 待办模块 -----
export interface ICreateTodoReq {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface IUpdateTodoReq {
  title?: string;
  description?: string;
  status?: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}

export interface ITodoRes {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
  userId: string;
}

// ----- 用户模块 -----
export interface ILoginReq {
  email: string;
  password: string;
}

export interface ILoginRes {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// ----- 通用响应包装 -----
export interface IApiResponse<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
}

// ----- 分页 -----
export interface IPaginationReq {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IPaginationRes<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## 输出格式
```json
{
  "contracts": {
    "todo": {
      "create_req": "ICreateTodoReq",
      "update_req": "IUpdateTodoReq",
      "response": "ITodoRes"
    },
    "user": {
      "login_req": "ILoginReq",
      "login_res": "ILoginRes"
    }
  },
  "shared_types_file": "packages/shared-types/src/api.contracts.ts",
  "usage_instructions": "前端和后端均通过 `import { ITodoRes } from '@mira/shared-types'` 引用"
}
```

## 约束
- 所有类型名必须以 I 开头（Interface 惯例），或使用 type 关键字但加上 T 前缀（如 TTodo）。
- 日期字段统一使用 string（ISO 8601 格式），后端返回时序列化，前端展示时使用 new Date() 解析。
- 分页参数统一使用 page 和 limit 字段名，便于跨模块复用。
