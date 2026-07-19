---
name: "mira-c-compliance"
description: "Mira ��ϵ�е� mira-c-compliance Skill"
---

# Skill: mira-c-compliance

## 所�?Agent
Mira-Checker

## 描述
扫描代码中涉�?GDPR、HIPAA、等保等合规敏感字段，确保数据脱敏、审计日志、会话超时等合规措施已落实�?
## 输入
- `domain`: 领域名称（`FINANCE` | `HEALTHCARE` | `ECOMMERCE` | `GENERAL`�?- `source_code`: 完整的项目源码路�?
## 合规检查项矩阵

### GDPR（通用数据保护条例�?| ID | 检查项 | 违规示例 | 修复建议 |
| :--- | :--- | :--- | :--- |
| GDPR-01 | 个人数据存储是否加密�?| 用户密码以明文存�?| 使用 bcrypt/Argon2 哈希存储 |
| GDPR-02 | 是否有数据导出功能？ | 未提供用户数据导出接�?| 实现 `GET /api/users/:id/export` |
| GDPR-03 | 是否有删除用户数据功能？ | 删除用户账号时未删除关联数据 | 实现级联删除或软删除 + 定期清理 |

### HIPAA（美国医疗信息安全）
| ID | 检查项 | 违规示例 | 修复建议 |
| :--- | :--- | :--- | :--- |
| HIPA-01 | PHI 字段是否脱敏�?| 姓名、身份证号、病历号明文显示 | 使用 `maskInput` 组件，仅显示部分字符 |
| HIPA-02 | 会话超时时间是否 �?5 分钟�?| 用户登录后长期保持活�?| 注入 `IdleTimeout` 中间�?|
| HIPA-03 | 访问日志是否完整�?| 未记录用�?IP 和操作时�?| 添加 `AccessLog` 中间�?|

### 金融合规
| ID | 检查项 | 违规示例 | 修复建议 |
| :--- | :--- | :--- | :--- |
| FIN-01 | 金额字段是否保留两位小数�?| 存储为浮点数导致精度丢失 | 使用 `Decimal(10, 2)` 类型 |
| FIN-02 | 交易是否记录审计日志�?| 无操作记�?| �?Service 层添加审计埋�?|
| FIN-03 | 是否存在 XSS/CSRF 防护�?| 用户输入未经转义 | 使用 DOMPurify �?CSP 配置 |

## 输出格式
```json
{
  "domain": "HEALTHCARE",
  "total_checks": 12,
  "passed": 11,
  "failed": 1,
  "failures": [
    {
      "id": "HIPA-01",
      "description": "病历号在列表页明文显示，未脱�?,
      "file": "frontend/adapters/web/components/medical-record-list.tsx",
      "line": 45,
      "recommendation": "�?{record.id} 改为 {maskId(record.id)}，显示为 ****-****-{last4}"
    }
  ],
  "status": "FAILED",
  "block_deployment": true
}
```

## 约束
- 金融/医疗领域：合规扫描结果为 FAILED 时，强制阻断上线流程，直到所有违规项修复并通过重新扫描�?- 通用领域（GENERAL）：仅输出警告，不阻断上线�?- 合规扫描结果须写�?PROJECT_INDEX.md �?compliance_status 章节�?