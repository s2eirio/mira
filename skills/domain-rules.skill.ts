export interface DomainRule {
  id: string;
  name: string;
  category: 'design' | 'development' | 'testing' | 'security' | 'performance';
  description: string;
  priority: 'high' | 'medium' | 'low';
  examples: string[];
  appliesTo: string[];
}

export interface RuleCheckResult {
  ruleId: string;
  ruleName: string;
  passed: boolean;
  details: string;
  suggestions?: string[];
}

export class DomainRulesSkill {
  private rules: DomainRule[] = [
    {
      id: 'DR-001',
      name: '按钮状态完整性',
      category: 'design',
      description: '所有交互按钮必须包含 6 种状态：idle、hover、active、loading、success、error',
      priority: 'high',
      examples: [
        '正确：按钮有 idle、hover、active、loading、success、error 六种状态',
        '错误：按钮只有 idle 和 hover 两种状态'
      ],
      appliesTo: ['button', 'submit-button', 'action-button']
    },
    {
      id: 'DR-002',
      name: '颜色层级限制',
      category: 'design',
      description: '设计中最多使用 3 种主色（主色、辅助色、强调色）',
      priority: 'medium',
      examples: [
        '正确：主色+辅助色+强调色，共3种',
        '错误：使用了5种不同的主色调'
      ],
      appliesTo: ['color-scheme', 'design-tokens']
    },
    {
      id: 'DR-003',
      name: '测试锚点必须存在',
      category: 'testing',
      description: '所有需要测试的交互元素必须有 data-testid 属性',
      priority: 'high',
      examples: [
        '正确：<button data-testid="btn-submit">提交</button>',
        '错误：<button>提交</button>'
      ],
      appliesTo: ['button', 'input', 'form', 'modal']
    },
    {
      id: 'DR-004',
      name: 'GWT 用例完整性',
      category: 'testing',
      description: '每个用户故事至少包含 1 个 happy path、1 个 unhappy path、1 个 edge case',
      priority: 'high',
      examples: [
        '正确：登录功能有 正常登录、密码错误、用户名过长 三个用例',
        '错误：登录功能只有 正常登录 一个用例'
      ],
      appliesTo: ['user-story', 'test-cases']
    },
    {
      id: 'DR-005',
      name: '异步操作必须有加载状态',
      category: 'development',
      description: '所有 API 调用和异步操作必须显示加载状态',
      priority: 'high',
      examples: [
        '正确：点击提交后按钮显示 loading 状态',
        '错误：点击提交后无任何反馈'
      ],
      appliesTo: ['async', 'api-call', 'form-submit']
    },
    {
      id: 'DR-006',
      name: '错误必须可恢复',
      category: 'development',
      description: '所有错误状态必须提供用户可操作的恢复方式',
      priority: 'high',
      examples: [
        '正确：加载失败显示"重试"按钮',
        '错误：加载失败只显示错误文字，无操作选项'
      ],
      appliesTo: ['error-state', 'failure']
    },
    {
      id: 'DR-007',
      name: '表单验证即时反馈',
      category: 'design',
      description: '表单输入错误应在失焦或输入时即时提示，不要等到提交才报错',
      priority: 'medium',
      examples: [
        '正确：邮箱格式错误在输入时就显示红色提示',
        '错误：邮箱格式错误点击提交后才提示'
      ],
      appliesTo: ['form', 'input', 'validation']
    },
    {
      id: 'DR-008',
      name: '空状态必须有指引',
      category: 'design',
      description: '列表为空时必须显示空状态和引导操作',
      priority: 'medium',
      examples: [
        '正确：空列表显示"暂无数据，点击添加"按钮',
        '错误：空列表什么都不显示'
      ],
      appliesTo: ['list', 'empty-state']
    }
  ];

  async getRulesByCategory(category: DomainRule['category']): Promise<DomainRule[]> {
    return this.rules.filter(r => r.category === category);
  }

  async getHighPriorityRules(): Promise<DomainRule[]> {
    return this.rules.filter(r => r.priority === 'high');
  }

  async getAllRules(): Promise<DomainRule[]> {
    return this.rules;
  }

  async addRule(rule: Omit<DomainRule, 'id'>): Promise<DomainRule> {
    const newRule: DomainRule = {
      ...rule,
      id: `DR-${String(this.rules.length + 1).padStart(3, '0')}`
    };
    this.rules.push(newRule);
    return newRule;
  }

  async checkDesignTokens(tokens: Record<string, unknown>): Promise<RuleCheckResult[]> {
    const results: RuleCheckResult[] = [];

    const colors = tokens.colors as Record<string, string>;
    if (colors) {
      const mainColors = Object.keys(colors).filter(k => 
        ['primary', 'secondary', 'accent'].includes(k)
      );
      
      results.push({
        ruleId: 'DR-002',
        ruleName: '颜色层级限制',
        passed: mainColors.length <= 3,
        details: `检测到 ${mainColors.length} 种主色`,
        suggestions: mainColors.length > 3 ? ['建议减少主色数量到 3 种以内'] : undefined
      });
    }

    return results;
  }

  async checkComponentCode(sourceCode: string): Promise<RuleCheckResult[]> {
    const results: RuleCheckResult[] = [];

    const hasDataTestId = sourceCode.includes('data-testid');
    results.push({
      ruleId: 'DR-003',
      ruleName: '测试锚点必须存在',
      passed: hasDataTestId,
      details: hasDataTestId ? '检测到 data-testid 属性' : '未检测到 data-testid 属性',
      suggestions: !hasDataTestId ? ['为交互元素添加 data-testid 属性'] : undefined
    });

    const hasLoading = sourceCode.includes('loading') || sourceCode.includes('isLoading');
    results.push({
      ruleId: 'DR-005',
      ruleName: '异步操作必须有加载状态',
      passed: hasLoading,
      details: hasLoading ? '检测到加载状态' : '未检测到加载状态',
      suggestions: !hasLoading ? ['为异步操作添加 loading 状态'] : undefined
    });

    return results;
  }

  async checkTestCases(testCases: Array<{ category: string }>): Promise<RuleCheckResult[]> {
    const results: RuleCheckResult[] = [];
    const categories = new Set(testCases.map(tc => tc.category));

    const hasHappy = categories.has('happy');
    const hasUnhappy = categories.has('unhappy');
    const hasEdge = categories.has('edge');

    results.push({
      ruleId: 'DR-004',
      ruleName: 'GWT 用例完整性',
      passed: hasHappy && hasUnhappy && hasEdge,
      details: `happy: ${hasHappy ? '✓' : '✗'}, unhappy: ${hasUnhappy ? '✓' : '✗'}, edge: ${hasEdge ? '✓' : '✗'}`,
      suggestions: !hasHappy || !hasUnhappy || !hasEdge ? ['建议补充缺失的测试用例类型'] : undefined
    });

    return results;
  }

  async generateRuleDocument(): Promise<string> {
    let doc = '# 领域规则库\n\n';
    doc += `共 ${this.rules.length} 条规则\n\n`;

    const categories = ['design', 'development', 'testing', 'security', 'performance'] as const;
    
    for (const cat of categories) {
      const catRules = this.rules.filter(r => r.category === cat);
      if (catRules.length === 0) continue;

      doc += `## ${cat} (${catRules.length} 条)\n\n`;
      
      for (const rule of catRules) {
        const priorityIcon = rule.priority === 'high' ? '🔴' : rule.priority === 'medium' ? '🟡' : '🟢';
        doc += `### ${priorityIcon} ${rule.id} - ${rule.name}\n\n`;
        doc += `${rule.description}\n\n`;
        doc += `**优先级**: ${rule.priority}\n\n`;
        doc += `**适用范围**: ${rule.appliesTo.join(', ')}\n\n`;
        
        if (rule.examples.length > 0) {
          doc += `**示例**:\n\n`;
          for (const ex of rule.examples) {
            doc += `- ${ex}\n`;
          }
          doc += '\n';
        }
      }
    }

    return doc;
  }
}
