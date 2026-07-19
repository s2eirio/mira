---
name: "mira-p-sniffer"
description: "Mira ��ϵ�е� mira-p-sniffer Skill"
---

# Skill: mira-p-sniffer

## 所�?Agent
Mira-Planner

## 描述
从用户需求文本中提取平台关键词，推断隐含平台，并输出结构化的平台探测结果�?
## 输入
用户的原始需求文本（自然语言）�?
## 平台关键词映射表
| 关键词（含同义词�?| 映射平台 | 置信度权�?|
| :--- | :--- | :--- |
| 浏览器、网页、官网、后台管理、仪表盘、H5、PC�?| **WEB** | �?|
| 微信、支付宝、抖音、小程序、扫一扫、二维码 | **MINIAPP** | �?|
| 桌面、Windows、Mac、Linux、系统托盘、本地文件、离�?| **PC** | �?|
| 手机、iOS、Android、相机、相册、推送通知、GPS | **APP** | �?|

## 推断逻辑（当关键词不明确时）
| 需求特�?| 推断平台 | 置信�?|
| :--- | :--- | :--- |
| 提及"扫码"�?拍照"�?定位"但未明确平台 | MINIAPP + APP | �?|
| 提及"后台管理"�?数据分析"�?报表" | WEB | �?|
| 提及"离线可用"�?本地存储"�?系统快捷�? | PC | �?|
| 提及"推送通知"�?手机号登�? | APP | �?|

## 输出格式（严�?JSON�?```json
{
  "detected_platforms": [
    { "platform": "WEB", "keywords": ["后台管理", "仪表�?], "confidence": "high" },
    { "platform": "MINIAPP", "keywords": [], "confidence": "low" }
  ],
  "inferred_platforms": [],
  "missing_info": false,
  "clarification_questions": [],
  "summary": "检测到明确关键词指�?Web 平台，未检测到移动端或桌面端关键词�?
}
```

## 缺失信息时的输出示例
```json
{
  "detected_platforms": [],
  "inferred_platforms": [],
  "missing_info": true,
  "clarification_questions": [
    {
      "id": "Q1",
      "question": "这个应用主要在什么场景下使用？（如：办公室电�?/ 户外移动办公 / 微信内分享）",
      "options": ["办公室电�?, "户外移动办公", "微信内分�?, "其他"]
    },
    {
      "id": "Q2",
      "question": "是否需要调用设备硬件能力？（如：摄像头、定位、文件系统、蓝牙）",
      "options": ["需要摄像头", "需要定�?, "需要文件系�?, "不需要硬�?]
    },
    {
      "id": "Q3",
      "question": "目标用户更习惯通过什么方式访问？",
      "options": ["浏览器输入网址", "扫描小程序码", "下载安装 App"]
    }
  ],
  "summary": "未检测到任何平台关键词，需向用户澄清使用场景�?
}
```

## 约束
- �?detected_platforms 为空�?inferred_platforms 为空，必须设�?missing_info: true�?- 置信度等级：high / medium / low�?- 生成的澄清问题不超过 5 个，优先覆盖"场景、硬件、访问方�?三个维度�?