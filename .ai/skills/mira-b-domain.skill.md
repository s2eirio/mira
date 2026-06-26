# Skill: mira-b-domain

## 所属 Agent
Mira-Builder

## 描述
根据项目所属垂直领域（金融、医疗、电商等），加载对应的行业规则包，并在代码生成时自动注入合规约束。

## 输入
- `domain`: 领域名称（`FINANCE` | `HEALTHCARE` | `ECOMMERCE` | `EDUCATION` | `SAAS` | `GENERAL`）
- `entities`: 需求实体（来自 `mira-o-vision`）

## 领域规则包定义

### 金融（FINANCE）
| 规则 ID | 规则描述 | 代码约束 |
| :--- | :--- | :--- |
| FIN-01 | 金额必须保留两位小数 | 所有 `amount` 字段使用 `Decimal` 类型，显示时调用 `toFixed(2)` |
| FIN-02 | 金额禁止为负数 | 输入框自动添加 `min="0"` 和 `step="0.01"` |
| FIN-03 | 千位分隔符 | 金额展示时自动添加 `toLocaleString('zh-CN')` |
| FIN-04 | 所有交易必须记录审计日志 | 自动生成 `AuditLog` 模型，每次 CRUD 操作写一条日志 |

### 医疗（HEALTHCARE）
| 规则 ID | 规则描述 | 代码约束 |
| :--- | :--- | :--- |
| HEA-01 | PHI（受保护健康信息）字段须脱敏 | 姓名、身份证号、病历号自动使用 `maskInput` 组件 |
| HEA-02 | 会话超时时间为 5 分钟 | 自动注入 `IdleTimeout` 逻辑，超时自动登出 |
| HEA-03 | 所有数据操作须记录访问日志 | 生成 `AccessLog` 中间件，记录用户 IP、操作时间、操作对象 |

### 电商（ECOMMERCE）
| 规则 ID | 规则描述 | 代码约束 |
| :--- | :--- | :--- |
| ECO-01 | 库存扣减须使用乐观锁 | Repository 层自动添加 `version` 字段，更新时检查版本号 |
| ECO-02 | 购物车保留 7 天 | 自动注入 `cartExpiry` 定时任务（使用 `node-cron` 或 `bull`） |
| ECO-03 | 价格计算含阶梯折扣 | 自动生成 `DiscountEngine` 类，支持多级折扣规则 |

### 通用（GENERAL）
无特定规则，使用默认行为。

## 输出格式
```json
{
  "domain": "ECOMMERCE",
  "applied_rules": ["ECO-01", "ECO-02", "ECO-03"],
  "code_constraints": {
    "models": ["AuditLog", "Cart", "Order", "Inventory"],
    "middlewares": ["AuditMiddleware", "IdleTimeoutMiddleware"],
    "utils": ["DiscountEngine", "PriceFormatter"],
    "configs": ["sessionTimeout: 600s", "cartExpiry: 7d"]
  },
  "files_to_generate": [
    "backend/src/modules/common/middlewares/audit.middleware.ts",
    "backend/src/modules/common/utils/discount.engine.ts",
    "database/prisma/models/audit-log.prisma"
  ]
}
```

## 约束
- 若用户未指定领域，默认使用 GENERAL。
- 领域规则包可扩展，用户可通过 mira-b-domain --add-rule <rule> 自定义规则。
- 每个规则必须对应一条代码约束（否则视为无效规则）。
