# Skill: mira-k-build

## 所属 Agent
Mira-Keeper

## 描述
并行构建多平台产物，包括 Web 静态文件、小程序包、Electron 安装包、React Native APK/IPA。

## 输入
- `platforms`: 目标平台列表
- `version`: 当前版本号（用于产物命名）
- `output_dir`: 输出目录（默认 `./build/`）

## 各平台构建命令
| 平台 | 构建命令 | 产物路径 |
| :--- | :--- | :--- |
| WEB | `cd frontend/adapters/web && npm run build` | `dist/web/` |
| MINIAPP | `cd frontend/adapters/miniapp && npm run build` | `dist/miniapp/` |
| PC (Electron) | `cd frontend/adapters/electron && npm run build` | `dist/electron/` |
| APP (RN) | `cd frontend/adapters/rn && npm run build` | `dist/rn/` |

## 构建产物命名规范
```text
build/
├── web/
│   └── v1.3.0/
│       ├── index.html
│       └── assets/
├── miniapp/
│   └── v1.3.0/
│       └── app.wxapkg
├── electron/
│   └── v1.3.0/
│       ├── mira-app-win-x64.exe
│       ├── mira-app-mac-x64.dmg
│       └── mira-app-linux-x64.AppImage
└── rn/
    └── v1.3.0/
        ├── mira-app.apk
        └── mira-app.ipa
```

## 输出格式
```json
{
  "version": "1.3.0",
  "platforms_built": ["WEB", "MINIAPP", "ELECTRON"],
  "artifacts": [
    {
      "platform": "WEB",
      "path": "dist/web/v1.3.0/",
      "size_mb": 4.2,
      "status": "SUCCESS"
    },
    {
      "platform": "MINIAPP",
      "path": "dist/miniapp/v1.3.0/app.wxapkg",
      "size_mb": 2.3,
      "status": "SUCCESS"
    },
    {
      "platform": "ELECTRON",
      "path": "dist/electron/v1.3.0/mira-app-win-x64.exe",
      "size_mb": 78.5,
      "status": "SUCCESS"
    }
  ],
  "total_duration_seconds": 145,
  "status": "PASSED"
}
```

## 约束
- 构建时使用 --mode production 或等效的生产环境变量。
- 构建前自动执行 pnpm install --frozen-lockfile，确保依赖版本一致。
- 若某个平台构建失败，不阻塞其他平台，但需在输出中明确标注失败平台及错误日志。
