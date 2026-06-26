# Skill: mira-k-deploy

## 所属 Agent
Mira-Keeper

## 描述
将构建产物部署至目标环境（Dev / Staging / Production），管理环境变量注入，记录部署历史。

## 输入
- `platform`: 目标平台
- `environment`: 目标环境（`DEV` | `STAGING` | `PRODUCTION`）
- `artifacts_path`: 构建产物路径（来自 `mira-k-build`）

## 部署策略
| 环境 | 部署方式 | 访问地址 |
| :--- | :--- | :--- |
| DEV | 本地启动 | `http://localhost:3000` |
| STAGING | 云服务（Vercel/阿里云） | `https://staging.your-app.com` |
| PRODUCTION | 云服务（Vercel/阿里云） | `https://your-app.com` |

## 各平台部署详情
| 平台 | 目标环境 | 部署方式 |
| :--- | :--- | :--- |
| WEB | Staging/生产 | Vercel CLI：`vercel --prod` |
| WEB | Dev | `npm run dev` |
| MINIAPP | 体验版 | 微信开发者工具「上传」 |
| MINIAPP | 审核版 | 微信公众平台「提交审核」 |
| MINIAPP | 线上版 | 微信公众平台「发布」 |
| PC (Electron) | 生产 | 推送至 OSS + 触发 `electron-updater` |
| APP (RN) | 生产 | 推送至 TestFlight / 应用宝 |

## 输出格式
```json
{
  "platform": "WEB",
  "environment": "PRODUCTION",
  "deployment_url": "https://your-app.com",
  "deployment_id": "vercel_12345",
  "status": "SUCCESS",
  "previous_version": "1.2.0",
  "current_version": "1.3.0",
  "rollback_command": "vercel rollback vercel_12345 --to vercel_12344"
}
```

## 约束
- 生产环境部署前须执行手动确认（通过 approve 参数控制）。
- 部署后自动执行健康检查：`curl -f https://your-app.com/health`，失败则自动回滚。
- 部署历史记录在 PROJECT_INDEX.md 的 deployment_status 章节。
