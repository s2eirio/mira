export interface ComplianceCheck {
  id: string;
  name: string;
  category: 'accessibility' | 'security' | 'performance' | 'best-practice';
  description: string;
  severity: 'critical' | 'warning' | 'info';
}

export interface ComplianceResult {
  checkId: string;
  checkName: string;
  passed: boolean;
  severity: 'critical' | 'warning' | 'info';
  details: string;
  suggestions?: string[];
  affectedFiles?: string[];
}

export interface ComplianceReport {
  total: number;
  passed: number;
  failed: number;
  critical: number;
  warnings: number;
  results: ComplianceResult[];
  summary: string;
}

export class ComplianceCheckSkill {
  private checks: ComplianceCheck[] = [
    {
      id: 'COMP-001',
      name: '图片必须有 alt 属性',
      category: 'accessibility',
      description: '所有 img 标签必须有 alt 属性，装饰性图片使用空 alt',
      severity: 'warning'
    },
    {
      id: 'COMP-002',
      name: '按钮必须有可访问名称',
      category: 'accessibility',
      description: '按钮必须有文本内容或 aria-label',
      severity: 'warning'
    },
    {
      id: 'COMP-003',
      name: '禁止内联事件处理器',
      category: 'security',
      description: '禁止使用 onclick、onerror 等内联事件',
      severity: 'critical'
    },
    {
      id: 'COMP-004',
      name: '禁止 eval 和危险操作',
      category: 'security',
      description: '禁止使用 eval、innerHTML、document.write 等危险 API',
      severity: 'critical'
    },
    {
      id: 'COMP-005',
      name: '敏感信息不得硬编码',
      category: 'security',
      description: '密码、密钥、Token 等敏感信息不能硬编码在代码中',
      severity: 'critical'
    },
    {
      id: 'COMP-006',
      name: '颜色对比度',
      category: 'accessibility',
      description: '文本与背景颜色对比度需符合 WCAG AA 标准',
      severity: 'warning'
    },
    {
      id: 'COMP-007',
      name: '代码中不得有 console.log',
      category: 'best-practice',
      description: '生产代码中不应包含 console.log 调试语句',
      severity: 'info'
    },
    {
      id: 'COMP-008',
      name: '禁止使用 any 类型',
      category: 'best-practice',
      description: 'TypeScript 代码中应避免使用 any 类型',
      severity: 'warning'
    },
    {
      id: 'COMP-009',
      name: '表单必须有标签',
      category: 'accessibility',
      description: '所有输入框必须有关联的 label 标签',
      severity: 'warning'
    },
    {
      id: 'COMP-010',
      name: '链接必须有有意义的文本',
      category: 'accessibility',
      description: '链接文本不应使用"点击这里"等无意义文本',
      severity: 'info'
    }
  ];

  async checkCode(sourceCode: string): Promise<ComplianceReport> {
    const results: ComplianceResult[] = [];

    results.push(this.checkImageAlt(sourceCode));
    results.push(this.checkButtonAccessibleName(sourceCode));
    results.push(this.checkInlineHandlers(sourceCode));
    results.push(this.checkDangerousApis(sourceCode));
    results.push(this.checkHardcodedSecrets(sourceCode));
    results.push(this.checkConsoleLog(sourceCode));
    results.push(this.checkAnyType(sourceCode));

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    const critical = results.filter(r => !r.passed && r.severity === 'critical').length;
    const warnings = results.filter(r => !r.passed && r.severity === 'warning').length;

    let summary = '';
    if (critical > 0) {
      summary = `❌ 检测到 ${critical} 个严重合规问题，必须修复`;
    } else if (warnings > 0) {
      summary = `⚠️  检测到 ${warnings} 个警告，建议修复`;
    } else {
      summary = '✅ 所有合规检查通过';
    }

    return {
      total: results.length,
      passed,
      failed,
      critical,
      warnings,
      results,
      summary
    };
  }

  private checkImageAlt(code: string): ComplianceResult {
    const imgRegex = /<img[^>]*>/g;
    const images = code.match(imgRegex) || [];
    const withoutAlt = images.filter(img => !img.includes('alt='));

    return {
      checkId: 'COMP-001',
      checkName: '图片必须有 alt 属性',
      passed: withoutAlt.length === 0,
      severity: 'warning',
      details: withoutAlt.length > 0
        ? `检测到 ${withoutAlt.length} 个图片缺少 alt 属性`
        : '所有图片都有 alt 属性',
      suggestions: withoutAlt.length > 0
        ? ['为所有图片添加 alt 属性', '装饰性图片使用 alt=""']
        : undefined
    };
  }

  private checkButtonAccessibleName(code: string): ComplianceResult {
    const buttonRegex = /<button[^>]*>([\s\S]*?)<\/button>/g;
    const buttons = code.match(buttonRegex) || [];
    const withoutName = buttons.filter(btn => {
      const hasText = btn.replace(/<[^>]+>/g, '').trim().length > 0;
      const hasAriaLabel = btn.includes('aria-label=');
      return !hasText && !hasAriaLabel;
    });

    return {
      checkId: 'COMP-002',
      checkName: '按钮必须有可访问名称',
      passed: withoutName.length === 0,
      severity: 'warning',
      details: withoutName.length > 0
        ? `检测到 ${withoutName.length} 个按钮缺少可访问名称`
        : '所有按钮都有可访问名称',
      suggestions: withoutName.length > 0
        ? ['为按钮添加文本内容或 aria-label 属性']
        : undefined
    };
  }

  private checkInlineHandlers(code: string): ComplianceResult {
    const hasInlineHandlers = /on\w+=/g.test(code);

    return {
      checkId: 'COMP-003',
      checkName: '禁止内联事件处理器',
      passed: !hasInlineHandlers,
      severity: 'critical',
      details: hasInlineHandlers ? '检测到内联事件处理器' : '未检测到内联事件处理器',
      suggestions: hasInlineHandlers
        ? ['使用事件监听替代内联事件处理器']
        : undefined
    };
  }

  private checkDangerousApis(code: string): ComplianceResult {
    const dangerousApis = ['eval(', 'innerHTML', 'document.write('];
    const found = dangerousApis.filter(api => code.includes(api));

    return {
      checkId: 'COMP-004',
      checkName: '禁止 eval 和危险操作',
      passed: found.length === 0,
      severity: 'critical',
      details: found.length > 0
        ? `检测到危险 API: ${found.join(', ')}`
        : '未检测到危险 API',
      suggestions: found.length > 0
        ? ['使用安全的 API 替代', '如使用 textContent 替代 innerHTML']
        : undefined
    };
  }

  private checkHardcodedSecrets(code: string): ComplianceResult {
    const secretPatterns = [
      /password\s*=\s*['"][^'"]+['"]/gi,
      /api[_-]?key\s*=\s*['"][^'"]+['"]/gi,
      /secret\s*=\s*['"][^'"]+['"]/gi,
      /token\s*=\s*['"][^'"]+['"]/gi
    ];

    let foundSecrets: string[] = [];
    for (const pattern of secretPatterns) {
      const matches = code.match(pattern);
      if (matches) {
        foundSecrets = [...foundSecrets, ...matches];
      }
    }

    return {
      checkId: 'COMP-005',
      checkName: '敏感信息不得硬编码',
      passed: foundSecrets.length === 0,
      severity: 'critical',
      details: foundSecrets.length > 0
        ? `检测到 ${foundSecrets.length} 处可能的硬编码敏感信息`
        : '未检测到硬编码敏感信息',
      suggestions: foundSecrets.length > 0
        ? ['使用环境变量存储敏感信息', '使用 .env 文件和 dotenv']
        : undefined
    };
  }

  private checkConsoleLog(code: string): ComplianceResult {
    const hasConsoleLog = /console\.log\(/.test(code);

    return {
      checkId: 'COMP-007',
      checkName: '代码中不得有 console.log',
      passed: !hasConsoleLog,
      severity: 'info',
      details: hasConsoleLog ? '检测到 console.log 语句' : '未检测到 console.log 语句',
      suggestions: hasConsoleLog
        ? ['生产代码中移除 console.log', '使用专业的日志库替代']
        : undefined
    };
  }

  private checkAnyType(code: string): ComplianceResult {
    const hasAny = /:\s*any\b/.test(code) || /<any\b/.test(code);

    return {
      checkId: 'COMP-008',
      checkName: '禁止使用 any 类型',
      passed: !hasAny,
      severity: 'warning',
      details: hasAny ? '检测到 any 类型使用' : '未检测到 any 类型使用',
      suggestions: hasAny
        ? ['使用具体类型替代 any', '使用 unknown 替代 any']
        : undefined
    };
  }

  async getChecksByCategory(category: ComplianceCheck['category']): Promise<ComplianceCheck[]> {
    return this.checks.filter(c => c.category === category);
  }

  async getAllChecks(): Promise<ComplianceCheck[]> {
    return this.checks;
  }
}
