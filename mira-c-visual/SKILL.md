---
name: "mira-c-visual"
description: "Mira ��ϵ�е� mira-c-visual Skill"
---

# Skill: mira-c-visual

## 所�?Agent
Mira-Checker

## 描述
将运行时截图与设计线框图（SVG）进行像素级对比，生成差异热力图，检�?UI 还原度�?
## 输入
- `wireframe`: 来自 `mira-d-wire` 的线框图 SVG
- `runtime_screenshot`: 运行时截图（PNG�?- `tolerance`: 像素容忍度（默认 5%�?
## 对比流程

1. 将线框图 SVG 渲染�?PNG（使�?puppeteer �?sharp�?2. 调整两张图片至相同尺寸（�?1920x1080�?3. 使用 pixelmatch 逐像素对�?4. 生成差异热力图（红色标记差异像素�?5. 计算差异像素占比
6. 若差�?> 容忍�?�?FAILED

## 输出格式
```json
{
  "platform": "WEB",
  "page": "首页",
  "total_pixels": 2073600,
  "diff_pixels": 15234,
  "diff_percentage": 0.73,
  "tolerance": 5,
  "status": "PASSED",
  "heatmap_url": "tests/reports/visual/homepage-diff.png",
  "screenshot_url": "tests/reports/visual/homepage-actual.png",
  "baseline_url": "tests/reports/visual/homepage-baseline.png"
}
```

## 约束
- 容忍度默�?5%，若用户明确要求更严格（�?2%），则按用户要求执行�?- 移动端和桌面端分别使用对应的基准截图�?75px / 1920px）�?- 动态内容（如时间戳、随�?ID）使�?ignore-regions 功能排除对比�?