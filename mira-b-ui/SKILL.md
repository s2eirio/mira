---
name: "mira-b-ui"
description: "Mira ��ϵ�е� mira-b-ui Skill"
---

# Skill: mira-b-ui

## 所�?Agent
Mira-Builder

## 描述
根据设计令牌和线框图，生成平台特定的 UI 组件代码，包括基础组件（Button、Input、Card 等）和业务组件（TodoList、TodoItem 等）�?
## 输入
- `design_tokens`: 设计令牌（来�?`mira-d-token`�?- `wireframe`: 线框图（来自 `mira-d-wire`�?- `platform`: 目标平台
- `core_types`: Core 层类型定义（来自 `mira-b-core`�?
## 输出文件结构（以 Web 为例�?
```text
frontend/adapters/web/components/
├── ui/                              # 基础 UI 组件
�?  ├── button.tsx
�?  ├── input.tsx
�?  ├── card.tsx
�?  ├── modal.tsx
�?  ├── toast.tsx
�?  └── table.tsx
└── features/                        # 业务功能组件
    ├── todo/
    �?  ├── todo-list.tsx
    �?  ├── todo-item.tsx
    �?  └── todo-form.tsx
    └── common/
        ├── header.tsx
        ├── sidebar.tsx
        └── footer.tsx
```

## 组件生成规范

### 基础组件（ui/�?- 必须支持 `variant` 属性（primary / secondary / ghost / destructive�?- 必须支持 `size` 属性（sm / md / lg�?- 必须支持 `disabled`、`loading` 状�?- 必须转发 `ref`
- 必须包含 `data-testid` 注入�?
### 业务组件（features/�?- 必须�?Core 层的 store 对接
- 必须使用 mira-b-anchor 规范�?data-testid
- 必须包含完整�?TypeScript 类型
- 必须处理 loading、error、empty 三种状�?
## 输出示例（Button 组件�?```typescript
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

## 约束
- 组件必须遵循设计令牌的颜色、间距、圆角、阴影规范�?- 所有交互组件必须支持键盘无障碍访问（Tab 聚焦、Enter/Space 触发）�?- 组件命名使用 PascalCase，文件名使用 kebab-case�?- 业务组件必须�?Core 层的 store �?service 解耦，通过 props �?hooks 连接�?