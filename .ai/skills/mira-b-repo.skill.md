# Skill: mira-b-repo

## 所属 Agent
Mira-Builder

## 描述
生成后端 Repository 层 CRUD 代码，遵循 DDD（领域驱动设计）模式，封装数据库操作，供 Service 层调用。

## 输入
- `db_schema`: 来自 `mira-b-db` 的 Prisma Schema 定义
- `domain_rules`: 领域规则（来自 `mira-b-domain`）

## 输出文件结构

```text
backend/src/modules/todo/
├── todo.repository.ts             # 数据访问层
├── todo.service.ts                # 业务逻辑层
├── todo.controller.ts             # 路由层
├── dto/
│   ├── create-todo.dto.ts
│   └── update-todo.dto.ts
└── entities/
    └── todo.entity.ts             # 实体映射（可选，若使用 Prisma 可省略）
```

## Repository 层代码示例
```typescript
// backend/src/modules/todo/todo.repository.ts
import { PrismaClient } from '@prisma/client';
import type { ITodo, ICreateTodoInput, IUpdateTodoInput } from '@mira/shared-types';

const prisma = new PrismaClient();

export class TodoRepository {
  async findAll(): Promise<ITodo[]> {
    return prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<ITodo | null> {
    return prisma.todo.findUnique({
      where: { id },
    });
  }

  async findByUserId(userId: string): Promise<ITodo[]> {
    return prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: ICreateTodoInput & { userId: string }): Promise<ITodo> {
    return prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        userId: data.userId,
      },
    });
  }

  async update(id: string, data: IUpdateTodoInput): Promise<ITodo> {
    return prisma.todo.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.todo.delete({
      where: { id },
    });
  }

  // 领域规则注入示例：乐观锁（电商场景）
  async updateWithVersion(id: string, data: IUpdateTodoInput, version: number): Promise<ITodo> {
    const existing = await prisma.todo.findUnique({ where: { id } });
    if (!existing || existing.version !== version) {
      throw new Error('版本号不匹配，请刷新后重试');
    }
    return prisma.todo.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
      },
    });
  }
}
```

## 输出格式
```json
{
  "files_generated": [
    "backend/src/modules/todo/todo.repository.ts",
    "backend/src/modules/todo/todo.service.ts",
    "backend/src/modules/todo/todo.controller.ts",
    "backend/src/modules/todo/dto/create-todo.dto.ts",
    "backend/src/modules/todo/dto/update-todo.dto.ts"
  ],
  "repository_methods": ["findAll", "findById", "findByUserId", "create", "update", "delete"],
  "domain_rules_injected": ["ECO-01（乐观锁）"],
  "test_coverage": "Repository 层包含 6 个 CRUD 方法，建议补充单元测试覆盖所有方法。"
}
```

## 约束
- Repository 方法签名必须与 shared-types 中的类型定义一致，不得自行扩展。
- 若领域规则包含乐观锁，Repository 须自动添加 version 字段检查。
- Service 层调用 Repository 时，数据校验（如字段非空、长度限制）在 DTO 层完成。
