# Skill: mira-c-runner

## 所属 Agent
Mira-Checker

## 描述
根据 GWT 测试用例清单，驱动 E2E 测试框架（Playwright / Minium / Detox）执行自动化测试，验证应用的功能行为是否符合预期。

## 输入
- `gwt_cases`: 来自 `mira-b-gwt` 的测试用例清单
- `platform`: 目标平台（`WEB` / `MINIAPP` / `PC` / `APP`）
- `base_url`: 测试环境 URL（Web）或 App 包路径（移动端）

## 测试框架映射
| 平台 | 测试框架 | 启动命令 |
| :--- | :--- | :--- |
| WEB | Playwright | `npx playwright test` |
| MINIAPP | Minium（微信小程序自动化） | `minitest -c config.json` |
| PC (Electron) | Playwright（Electron 扩展） | `npx playwright test --project=electron` |
| APP (RN) | Detox | `detox test` |

## Playwright 测试脚本生成示例（Web）
```typescript
// tests/e2e/web/todo.spec.ts
import { test, expect } from '@playwright/test';

test.describe('待办功能测试', () => {
  test('TC-001: 用户登录后可以新增待办', async ({ page }) => {
    // Given: 用户已登录，购物车为空
    await page.goto('/login');
    await page.fill('input[data-testid="login-email"]', 'test@example.com');
    await page.fill('input[data-testid="login-password"]', 'password123');
    await page.click('button[data-testid="login-btn"]');
    await expect(page).toHaveURL('/todos');

    // When: 点击「新增待办」按钮
    await page.click('button[data-testid="todo-btn-add"]');
    await page.fill('input[data-testid="todo-input-title"]', '测试待办');
    await page.click('button[data-testid="todo-btn-submit"]');

    // Then: 列表中出现新待办，角标数字 +1
    await expect(page.locator('[data-testid="todo-list"]')).toContainText('测试待办');
    await expect(page.locator('[data-testid="badge-todo-count"]')).toHaveText('1');
  });

  test('TC-002: 库存为0时无法加入购物车', async ({ page }) => {
    // ... 类似结构
  });
});
```

## 输出格式
```json
{
  "platform": "WEB",
  "total_cases": 12,
  "passed": 11,
  "failed": 1,
  "skipped": 0,
  "duration_seconds": 45.3,
  "failures": [
    {
      "case_id": "TC-003",
      "title": "未登录用户点击加入购物车应弹出登录弹窗",
      "error": "expect(locator).toBeVisible() failed: login modal not found",
      "screenshot": "tests/reports/screenshots/TC-003-failure.png",
      "stack_trace": "..."
    }
  ],
  "report_url": "tests/reports/web-test-report.html"
}
```

## 约束
- 若测试失败率 > 10%，阻断流程，不进入其他检查项。
- 失败用例必须附带截图和错误栈，供后续修复使用。
- 测试环境须在运行前确认已就绪（数据库已迁移、Mock 服务已启动）。
