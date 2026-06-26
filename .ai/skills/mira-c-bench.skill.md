# Skill: mira-c-bench

## 所属 Agent
Mira-Checker

## 描述
测量各平台的首屏加载时间、列表滚动帧率、内存占用等性能指标，输出性能基准报告。

## 输入
- `platform`: 目标平台
- `thresholds`: 性能阈值（默认：FCP < 2s, LCP < 3s, FPS > 55）

## 测量指标
| 指标 | 说明 | 默认阈值 |
| :--- | :--- | :--- |
| FCP | 首次内容绘制（First Contentful Paint） | < 2s |
| LCP | 最大内容绘制（Largest Contentful Paint） | < 3s |
| TTI | 可交互时间（Time to Interactive） | < 4s |
| FPS | 列表滚动帧率 | > 55 fps |
| Memory | 内存占用（MB） | < 200MB |

## Web 端测量方式（Lighthouse）
```bash
npx lighthouse <URL> --output=json --output-path=report.json
```

## 移动端测量方式（RN / 小程序）
- RN：使用 react-native-performance 库采集
- 小程序：使用微信开发者工具的「性能面板」数据

## 输出格式
```json
{
  "platform": "WEB",
  "metrics": {
    "fcp": { "value": 1.2, "unit": "s", "threshold": 2, "status": "PASSED" },
    "lcp": { "value": 2.8, "unit": "s", "threshold": 3, "status": "PASSED" },
    "tti": { "value": 3.5, "unit": "s", "threshold": 4, "status": "PASSED" },
    "fps": { "value": 58, "unit": "fps", "threshold": 55, "status": "PASSED" },
    "memory": { "value": 85, "unit": "MB", "threshold": 200, "status": "PASSED" }
  },
  "status": "PASSED",
  "report_url": "tests/reports/benchmark/web-lighthouse-report.json"
}
```

## 约束
- 若任一性能指标不达标，状态为 FAILED，附带优化建议。
- 性能测试须在干净环境中运行（关闭后台应用、网络稳定）。
