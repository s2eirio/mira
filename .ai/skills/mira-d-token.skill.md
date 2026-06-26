# Skill: mira-d-token

## 所属 Agent
Mira-Designer

## 描述
根据用户的设计风格偏好，生成结构化的 `design-tokens.json` 文件，包含颜色、字体、间距、圆角、阴影等设计变量。

## 输入
- `style_keywords`: 风格关键词列表（如 `["科技感", "暗色"]`）
- `theme_preference`: 主题偏好（`light` / `dark` / `both`）

## 设计令牌结构定义
```json
{
  "$schema": "https://design-tokens.org/schema.json",
  "version": "1.0.0",
  "theme": "light",
  "colors": {
    "primary": "#2563EB",
    "primary_foreground": "#FFFFFF",
    "secondary": "#F3F4F6",
    "secondary_foreground": "#1F2937",
    "background": "#FFFFFF",
    "foreground": "#1F2937",
    "muted": "#9CA3AF",
    "muted_foreground": "#6B7280",
    "accent": "#3B82F6",
    "destructive": "#EF4444",
    "success": "#22C55E",
    "warning": "#F59E0B",
    "border": "#E5E7EB",
    "input": "#E5E7EB",
    "ring": "#3B82F6"
  },
  "typography": {
    "font_family": "Inter, system-ui, sans-serif",
    "base_size": "16px",
    "scale_ratio": 1.25,
    "heading": {
      "h1": { "size": "2.5rem", "weight": "700", "line_height": "1.2" },
      "h2": { "size": "2rem", "weight": "600", "line_height": "1.3" },
      "h3": { "size": "1.5rem", "weight": "600", "line_height": "1.4" },
      "h4": { "size": "1.25rem", "weight": "500", "line_height": "1.5" }
    },
    "body": { "size": "1rem", "weight": "400", "line_height": "1.6" },
    "small": { "size": "0.875rem", "weight": "400", "line_height": "1.5" }
  },
  "spacing": {
    "base": "0.25rem",
    "scale": [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128]
  },
  "radius": {
    "none": "0",
    "sm": "0.125rem",
    "md": "0.375rem",
    "lg": "0.5rem",
    "xl": "0.75rem",
    "full": "9999px"
  },
  "shadow": {
    "sm": "0 1px 2px 0 rgba(0,0,0,0.05)",
    "md": "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
    "lg": "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    "xl": "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)"
  }
}
```

## 输出格式
直接输出完整的 design-tokens.json 文件内容，并附带简要的翻译说明。

## 约束
- 若 theme_preference 为 both，需同时生成 light 和 dark 两套颜色的完整定义。
- 深色主题的颜色值须满足 WCAG 对比度 ≥ 4.5:1（可参考 @wcag/color 库）。
- 字体优先级：用户指定 > 系统字体栈 > 无衬线体。
