export interface DesignTokens {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: {
    base: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  typography: {
    family: string;
    heading: string;
    body: string;
    caption: string;
    mono: string;
    weight: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface LayoutStructure {
  type: 'header' | 'sidebar' | 'content' | 'footer' | 'card' | 'modal';
  name: string;
  children?: LayoutStructure[];
}

export interface ComponentMapping {
  name: string;
  library: 'shadcn' | 'mui' | 'antd' | 'native';
  props?: Record<string, unknown>;
  variants?: string[];
}

export class DesignAgent {
  private defaultTokens: DesignTokens = {
    colors: {
      primary: '#6366f1',
      primaryLight: '#818cf8',
      primaryDark: '#4f46e5',
      secondary: '#f472b6',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      success: '#22c55e',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    spacing: {
      base: '8px',
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px'
    },
    typography: {
      family: 'Inter, system-ui, sans-serif',
      heading: '24px',
      body: '16px',
      caption: '12px',
      mono: 'Monaco, monospace',
      weight: {
        light: 300,
        normal: 400,
        medium: 500,
        bold: 700
      }
    },
    radius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px'
    },
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    }
  };

  async generateDesignTokens(
    designConstraints: string[]
  ): Promise<DesignTokens> {
    const tokens = { ...this.defaultTokens };

    if (designConstraints.includes('暗色') || designConstraints.includes('dark')) {
      tokens.colors.background = '#0f172a';
      tokens.colors.surface = '#1e293b';
      tokens.colors.text = '#f8fafc';
      tokens.colors.textSecondary = '#94a3b8';
      tokens.colors.border = '#334155';
    }

    if (designConstraints.includes('高级感') || designConstraints.includes('luxury')) {
      tokens.colors.primary = '#8b5cf6';
      tokens.colors.primaryLight = '#a78bfa';
      tokens.colors.primaryDark = '#7c3aed';
      tokens.radius.md = '12px';
      tokens.radius.lg = '16px';
    }

    if (designConstraints.includes('极简') || designConstraints.includes('minimal')) {
      tokens.colors.primary = '#000000';
      tokens.colors.secondary = '#666666';
      tokens.radius.sm = '0px';
      tokens.radius.md = '4px';
    }

    if (designConstraints.includes('清爽') || designConstraints.includes('clean')) {
      tokens.colors.background = '#f8fafc';
      tokens.colors.surface = '#ffffff';
      tokens.colors.border = '#e2e8f0';
    }

    return tokens;
  }

  async generateLayoutStructure(requirement: string): Promise<LayoutStructure[]> {
    const structures: LayoutStructure[] = [];

    if (requirement.includes('页面') || requirement.includes('dashboard')) {
      structures.push({
        type: 'header',
        name: 'Header',
        children: [
          { type: 'card', name: 'Logo' },
          { type: 'card', name: 'Navigation' },
          { type: 'card', name: 'UserProfile' }
        ]
      });
      structures.push({
        type: 'sidebar',
        name: 'Sidebar'
      });
      structures.push({
        type: 'content',
        name: 'MainContent'
      });
    }

    if (requirement.includes('表单') || requirement.includes('form')) {
      structures.push({
        type: 'card',
        name: 'FormCard',
        children: [
          { type: 'card', name: 'FormField' },
          { type: 'card', name: 'SubmitButton' }
        ]
      });
    }

    if (requirement.includes('弹窗') || requirement.includes('modal')) {
      structures.push({
        type: 'modal',
        name: 'Modal',
        children: [
          { type: 'card', name: 'ModalHeader' },
          { type: 'card', name: 'ModalBody' },
          { type: 'card', name: 'ModalFooter' }
        ]
      });
    }

    return structures;
  }

  async mapComponents(
    requirement: string,
    uiLibrary: string = 'shadcn'
  ): Promise<ComponentMapping[]> {
    const mappings: ComponentMapping[] = [];

    if (requirement.includes('按钮') || requirement.includes('button')) {
      mappings.push({
        name: 'Button',
        library: uiLibrary as ComponentMapping['library'],
        variants: ['primary', 'secondary', 'ghost', 'destructive']
      });
    }

    if (requirement.includes('输入') || requirement.includes('input')) {
      mappings.push({
        name: 'Input',
        library: uiLibrary as ComponentMapping['library'],
        variants: ['default', 'disabled', 'error']
      });
    }

    if (requirement.includes('卡片') || requirement.includes('card')) {
      mappings.push({
        name: 'Card',
        library: uiLibrary as ComponentMapping['library'],
        variants: ['default', 'hoverable']
      });
    }

    if (requirement.includes('弹窗') || requirement.includes('modal')) {
      mappings.push({
        name: 'Modal',
        library: uiLibrary as ComponentMapping['library']
      });
    }

    if (requirement.includes('列表') || requirement.includes('list')) {
      mappings.push({
        name: 'List',
        library: uiLibrary as ComponentMapping['library'],
        variants: ['default', 'hoverable', 'selectable']
      });
    }

    return mappings;
  }

  async exportDesignSpecification(
    requirement: string,
    designConstraints: string[],
    uiLibrary: string = 'shadcn'
  ): Promise<string> {
    const tokens = await this.generateDesignTokens(designConstraints);
    const layout = await this.generateLayoutStructure(requirement);
    const components = await this.mapComponents(requirement, uiLibrary);

    return JSON.stringify({
      tokens,
      layout,
      components,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }
}
