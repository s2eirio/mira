export interface DesignSpecification {
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  typography: {
    fontFamily: string;
    headingSizes: {
      h1: string;
      h2: string;
      h3: string;
      body: string;
      caption: string;
    };
    fontWeight: {
      regular: number;
      medium: number;
      bold: number;
    };
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  shadows: Record<string, string>;
  components: Array<{
    name: string;
    variants: string[];
    states: string[];
  }>;
}

export class DesignSpecificationSkill {
  async generate(designStyle: string): Promise<DesignSpecification> {
    const spec = this.getDefaultSpec();

    if (designStyle.includes('高级感') || designStyle.includes('luxury')) {
      spec.colorScheme.primary = '#8b5cf6';
      spec.colorScheme.secondary = '#ec4899';
      spec.colorScheme.accent = '#06b6d4';
      spec.shadows.md = '0 10px 40px -10px rgba(139, 92, 246, 0.3)';
      spec.shadows.lg = '0 20px 60px -15px rgba(139, 92, 246, 0.4)';
      spec.borderRadius.lg = '16px';
      spec.borderRadius.xl = '24px';
    }

    if (designStyle.includes('极简') || designStyle.includes('minimal')) {
      spec.colorScheme.primary = '#171717';
      spec.colorScheme.secondary = '#525252';
      spec.colorScheme.border = '#e5e5e5';
      spec.shadows.md = 'none';
      spec.shadows.lg = 'none';
      spec.borderRadius.md = '4px';
      spec.borderRadius.lg = '6px';
    }

    if (designStyle.includes('暗色') || designStyle.includes('dark')) {
      spec.colorScheme.background = '#0f172a';
      spec.colorScheme.surface = '#1e293b';
      spec.colorScheme.text = '#f8fafc';
      spec.colorScheme.textSecondary = '#94a3b8';
      spec.colorScheme.border = '#334155';
    }

    if (designStyle.includes('清爽') || designStyle.includes('clean')) {
      spec.colorScheme.background = '#f0f9ff';
      spec.colorScheme.surface = '#ffffff';
      spec.colorScheme.primary = '#0ea5e9';
      spec.colorScheme.border = '#e0f2fe';
    }

    if (designStyle.includes('年轻化') || designStyle.includes('young')) {
      spec.colorScheme.primary = '#f472b6';
      spec.colorScheme.secondary = '#a78bfa';
      spec.colorScheme.accent = '#60a5fa';
      spec.borderRadius.md = '12px';
      spec.borderRadius.lg = '20px';
      spec.shadows.md = '0 8px 30px -8px rgba(244, 114, 182, 0.25)';
    }

    if (designStyle.includes('科技') || designStyle.includes('tech')) {
      spec.colorScheme.primary = '#06b6d4';
      spec.colorScheme.secondary = '#8b5cf6';
      spec.colorScheme.background = '#0f172a';
      spec.colorScheme.surface = '#1e293b';
      spec.colorScheme.text = '#f0f9ff';
      spec.shadows.md = '0 0 30px rgba(6, 182, 212, 0.2)';
    }

    return spec;
  }

  private getDefaultSpec(): DesignSpecification {
    return {
      colorScheme: {
        primary: '#6366f1',
        secondary: '#f472b6',
        accent: '#22c55e',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b',
        border: '#e2e8f0'
      },
      typography: {
        fontFamily: 'Inter, system-ui, sans-serif',
        headingSizes: {
          h1: '36px',
          h2: '28px',
          h3: '20px',
          body: '16px',
          caption: '12px'
        },
        fontWeight: {
          regular: 400,
          medium: 500,
          bold: 700
        }
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px'
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      components: [
        { name: 'Button', variants: ['primary', 'secondary', 'ghost', 'destructive'], states: ['idle', 'hover', 'active', 'disabled', 'loading'] },
        { name: 'Input', variants: ['default', 'outlined', 'filled'], states: ['idle', 'focus', 'error', 'disabled'] },
        { name: 'Card', variants: ['default', 'elevated', 'outlined'], states: ['idle', 'hover', 'pressed'] },
        { name: 'Modal', variants: ['default', 'centered', 'fullscreen'], states: ['closed', 'opening', 'open', 'closing'] }
      ]
    };
  }

  async exportAsCss(spec: DesignSpecification): Promise<string> {
    let css = ':root {\n';
    
    for (const [key, value] of Object.entries(spec.colorScheme)) {
      css += `  --color-${key}: ${value};\n`;
    }
    
    css += `  --font-family: ${spec.typography.fontFamily};\n`;
    
    for (const [key, value] of Object.entries(spec.typography.headingSizes)) {
      css += `  --font-size-${key}: ${value};\n`;
    }
    
    for (const [key, value] of Object.entries(spec.spacing)) {
      css += `  --spacing-${key}: ${value};\n`;
    }
    
    for (const [key, value] of Object.entries(spec.borderRadius)) {
      css += `  --radius-${key}: ${value};\n`;
    }
    
    for (const [key, value] of Object.entries(spec.shadows)) {
      css += `  --shadow-${key}: ${value};\n`;
    }
    
    css += '}\n';
    return css;
  }

  async generateDesignDoc(designStyle: string): Promise<string> {
    const spec = await this.generate(designStyle);
    
    let doc = `# 设计规范 - ${designStyle}\n\n`;
    doc += '## 颜色方案\n\n';
    doc += '| 名称 | 值 |\n|------|-----|\n';
    
    for (const [key, value] of Object.entries(spec.colorScheme)) {
      doc += `| ${key} | \`${value}\` |\n`;
    }
    
    doc += '\n## 排版\n\n';
    doc += `字体族: ${spec.typography.fontFamily}\n\n`;
    doc += '| 层级 | 大小 |\n|------|------|\n';
    
    for (const [key, value] of Object.entries(spec.typography.headingSizes)) {
      doc += `| ${key} | ${value} |\n`;
    }
    
    doc += '\n## 组件\n\n';
    for (const comp of spec.components) {
      doc += `### ${comp.name}\n- 变体: ${comp.variants.join(', ')}\n- 状态: ${comp.states.join(', ')}\n\n`;
    }
    
    return doc;
  }
}
