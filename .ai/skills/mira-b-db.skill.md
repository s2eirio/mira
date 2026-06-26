# Skill: mira-b-db

## 所属 Agent
Mira-Builder

## 描述
根据需求中的数据字段和领域规则，设计 Prisma Schema 或 SQL DDL，生成迁移文件，为后端提供数据持久化基础。

## 输入
- `data_fields`: 数据字段列表（来自 `mira-o-vision`）
- `domain_rules`: 领域规则（来自 `mira-b-domain`）
- `db_type`: 数据库类型（`POSTGRESQL` | `MYSQL` | `SQLITE`）

## 输出文件结构

```text
database/
├── prisma/
│   ├── schema.prisma              # 核心 Schema 定义
│   ├── migrations/
│   │   ├── 20260627000000_init/
│   │   │   └── migration.sql
│   │   └── 20260628000000_add_user_table/
│   │       └── migration.sql
│   └── seed.ts                    # 种子数据
├── docker-compose.yml             # 本地开发数据库容器
└── .env                           # DATABASE_URL 配置
```

## Prisma Schema 生成示例
```prisma
// database/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Todo {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      Status   @default(PENDING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String?  @map("user_id")
  user        User?    @relation(fields: [userId], references: [id])
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String   // 存储哈希值，明文仅用于演示
  createdAt DateTime @default(now())
  todos     Todo[]
}

enum Status {
  PENDING
  IN_PROGRESS
  COMPLETED
}
```

## 领域规则注入示例
| 领域 | Schema 注入 |
| :--- | :--- |
| 金融（FINANCE） | 所有金额字段使用 Decimal 类型，添加 @db.Decimal(10, 2) |
| 医疗（HEALTHCARE） | 添加 AuditLog 模型，记录所有表的 CRUD 操作 |
| 电商（ECOMMERCE） | 添加 version 字段，实现乐观锁 |

## 输出格式
```json
{
  "db_type": "POSTGRESQL",
  "models": ["Todo", "User"],
  "enums": ["Status"],
  "migration_file": "database/prisma/migrations/20260627000000_init/migration.sql",
  "seed_file": "database/prisma/seed.ts",
  "commands": {
    "generate": "npx prisma generate",
    "migrate_dev": "npx prisma migrate dev --name init",
    "migrate_deploy": "npx prisma migrate deploy",
    "seed": "npx prisma db seed"
  }
}
```

## 约束
- 若数据库类型为 SQLite，则使用 Sqlite 作为 provider，并调整字段类型（如 DateTime → String 需注意兼容性）。
- 所有表必须包含 id、createdAt、updatedAt 三个基础字段。
- 迁移文件必须可重复执行（使用 prisma migrate 的幂等性机制）。
