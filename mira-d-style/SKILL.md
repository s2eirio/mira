---
name: "mira-d-style"
description: "Mira ��ϵ�е� mira-d-style Skill"
---

# Skill: mira-d-style

## 所�?Agent
Mira-Designer

## 描述
�?`design-tokens.json` 中的设计变量，映射为各平台（Web / 小程�?/ RN / Electron）的样式代码，确保多端视觉一致性�?
## 输入
- `design_tokens`: 来自 `mira-d-token` 的完�?JSON
- `platforms`: 目标平台列表（来�?`mira-p-sniffer`�?
## 样式映射规则�?| 设计令牌 | Web (Tailwind) | 小程�?(rpx) | React Native (StyleSheet) |
| :--- | :--- | :--- | :--- |
| `colors.primary` | `bg-primary` | `background-color: var(--primary)` | `backgroundColor: theme.colors.primary` |
| `colors.primary_foreground` | `text-primary-foreground` | `color: var(--primary-foreground)` | `color: theme.colors.primaryForeground` |
| `spacing.base` | `p-1`�?px�?| `padding: 4rpx` | `padding: 4` |
| `radius.md` | `rounded-md` | `border-radius: 6rpx` | `borderRadius: 6` |
| `typography.body.size` | `text-base`�?6px�?| `font-size: 32rpx` | `fontSize: 16` |
| `shadow.md` | `shadow-md` | `box-shadow: 0 4rpx 6rpx ...` | `shadowColor: '#000', shadowOffset: { width: 0, height: 2 }` |

## 输出格式（三套样式代码）

### 1. Web（Tailwind config 扩展�?```javascript
// tailwind.config.js 扩展
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-foreground': '#FFFFFF',
        // ...
      },
      borderRadius: {
        md: '0.375rem',
        // ...
      }
    }
  }
}
```

### 2. 小程序（全局 CSS 变量 + rpx�?```css
/* app.wxss 或全局样式 */
page {
  --primary: #2563EB;
  --primary-foreground: #FFFFFF;
  --radius-md: 6rpx;
  --spacing-base: 4rpx;
  --font-body: 32rpx;
  --shadow-md: 0 4rpx 6rpx rgba(0,0,0,0.1);
}
```

### 3. React Native（Theme Provider�?```typescript
// theme.ts
export const theme = {
  colors: {
    primary: '#2563EB',
    primaryForeground: '#FFFFFF',
    // ...
  },
  spacing: {
    base: 4,
    // ...
  },
  borderRadius: {
    md: 6,
    // ...
  },
  typography: {
    body: { fontSize: 16, fontWeight: '400', lineHeight: 25.6 },
    // ...
  },
  shadow: {
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    }
  }
} as const;
```

## 输出结构
```json
{
  "platform_styles": {
    "web": { "tailwind_config": "...", "css_variables": "..." },
    "miniapp": { "rpx_variables": "...", "global_css": "..." },
    "react_native": { "theme_typescript": "..." }
  },
  "conversion_rules": [
    { "token": "colors.primary", "web": "bg-primary", "miniapp": "var(--primary)", "rn": "theme.colors.primary" }
  ],
  "note": "样式映射已生成，可直接复制至对应项目的配置文件�?
}
```

## 约束
- 必须为每个目标平台输出完整的样式代码�?- 小程�?rpx 转换规则�?px = 2rpx（以 375px 设计稿为基准）�?- React Native 尺寸使用 逻辑像素（pt），�?Web �?px 值保持一致�?- 若平台列表只包含 1 个，只输出对应平台的样式映射�?