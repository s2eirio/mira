# Skill: mira-c-api

## 所属 Agent
Mira-Checker

## 描述
对后端 Controller 执行 Supertest 集成测试，验证 API 契约是否正确实现，请求/响应体是否符合 `api.contracts.ts` 中的类型定义。

## 输入
- `api_contracts`: 来自 `mira-b-contract` 的契约类型
- `backend_url`: 后端服务地址（`http://localhost:3000`）
- `test_data`: 测试数据（Mock 数据）

## 测试内容
| 测试类型 | 说明 | 验证点 |
| :--- | :--- | :--- |
| 契约测试 | 调用每个 API 端点，验证响应体结构 | 字段类型、必填字段、枚举值 |
| 边界测试 | 发送非法数据（如空字段、超长字符串） | 返回 400 错误，错误信息明确 |
| 认证测试 | 访问需要认证的 API | 无 Token 返回 401，Token 过期返回 403 |
| 幂等性测试 | 重复执行相同请求（如 DELETE） | 第二次返回 404 或成功但无副作用 |

## 测试代码生成示例
```typescript
// tests/api/todo.api.spec.ts
import request from 'supertest';
import { app } from '../../backend/src/app';
import { ICreateTodoReq, ITodoRes } from '@mira/shared-types';

describe('Todo API 集成测试', () => {
  let authToken: string;

  beforeAll(async () => {
    // 获取认证 Token
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    authToken = res.body.data.token;
  });

  test('POST /api/todos 应返回正确的待办结构', async () => {
    const payload: ICreateTodoReq = {
      title: '测试待办',
      description: '这是测试描述',
    };

    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      code: 0,
      message: 'success',
      data: expect.objectContaining({
        id: expect.any(String),
        title: '测试待办',
        description: '这是测试描述',
        status: 'pending',
      }),
    });

    // 验证符合 ITodoRes 类型
    const todo: ITodoRes = res.body.data;
    expect(todo).toHaveProperty('id');
    expect(todo).toHaveProperty('createdAt');
  });

  test('POST /api/todos 空标题应返回 400', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: '' });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('title is required');
  });
});
```

## 输出格式
```json
{
  "total_apis": 12,
  "passed": 12,
  "failed": 0,
  "duration_seconds": 8.2,
  "coverage": {
    "contracts_covered": 12,
    "contracts_total": 12,
    "percentage": 100
  },
  "status": "PASSED"
}
```

## 约束
- API 测试与 E2E 测试独立运行，API 测试失败不影响 E2E 测试执行。
- 所有 API 测试必须覆盖 api.contracts.ts 中定义的每一个端点。
- 测试数据使用独立的测试数据库（test 环境），避免污染开发数据。
