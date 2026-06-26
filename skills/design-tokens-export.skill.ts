export interface DesignTokens {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, unknown>;
  radius: Record<string, string>;
  shadow: Record<string, string>;
}

export interface DesignTokensExport {
  tokens: DesignTokens;
  exportedAt: string;
  format: 'json' | 'css' | 'js';
}

export class DesignTokensExportSkill {
  async exportAsJson(tokens: DesignTokens): Promise<DesignTokensExport> {
    return {
      tokens,
      exportedAt: new Date().toISOString(),
      format: 'json'
    };
  }

  async exportAsCss(tokens: DesignTokens): Promise<string> {
    let css = ':root {\n';

    for (const [key, value] of Object.entries(tokens.colors)) {
      css += `  --color-${key}: ${value};\n`;
    }

    for (const [key, value] of Object.entries(tokens.spacing)) {
      css += `  --spacing-${key}: ${value};\n`;
    }

    if (typeof tokens.typography.family === 'string') {
      css += `  --font-family: ${tokens.typography.family};\n`;
    }

    for (const [key, value] of Object.entries(tokens.radius)) {
      css += `  --radius-${key}: ${value};\n`;
    }

    for (const [key, value] of Object.entries(tokens.shadow)) {
      css += `  --shadow-${key}: ${value};\n`;
    }

    css += '}\n';

    return css;
  }

  async exportAsJs(tokens: DesignTokens): Promise<string> {
    return `export const designTokens = ${JSON.stringify(tokens, null, 2)};`;
  }

  async exportAsTailwindConfig(tokens: DesignTokens): Promise<string> {
    const config = {
      theme: {
        extend: {
          colors: tokens.colors,
          spacing: tokens.spacing,
          borderRadius: tokens.radius,
          fontFamily: {
            sans: typeof tokens.typography.family === 'string' 
              ? tokens.typography.family.split(',').map(s => s.trim()) 
              : ['Inter', 'system-ui']
          }
        }
      }
    };

    return `/** @type {import('tailwindcss').Config} */\nexport default ${JSON.stringify(config, null, 2)};`;
  }

  async exportAll(tokens: DesignTokens): Promise<Record<string, string>> {
    return {
      'design-tokens.json': JSON.stringify(tokens, null, 2),
      'design-tokens.css': await this.exportAsCss(tokens),
      'design-tokens.ts': await this.exportAsJs(tokens),
      'tailwind.config.js': await this.exportAsTailwindConfig(tokens)
    };
  }
}
