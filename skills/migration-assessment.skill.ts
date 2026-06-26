export interface MigrationAssessment {
  id: string;
  sourcePlatform: string;
  targetPlatform: string;
  complexity: 'low' | 'medium' | 'high' | 'very-high';
  estimatedEffort: string;
  risks: string[];
  components: Array<{
    name: string;
    migrationType: 'direct' | 'adapt' | 'rewrite' | 'unsupported';
    effort: 'small' | 'medium' | 'large';
    notes?: string;
  }>;
  recommendations: string[];
}

export interface MigrationStep {
  order: number;
  phase: string;
  description: string;
  estimatedTime: string;
  dependencies: string[];
}

export class MigrationAssessmentSkill {
  async assess(
    sourcePlatform: string,
    targetPlatform: string,
    components: string[]
  ): Promise<MigrationAssessment> {
    const migrationComponents: MigrationAssessment['components'] = [];
    let totalEffort = 0;

    for (const comp of components) {
      const result = this.assessComponent(comp, sourcePlatform, targetPlatform);
      migrationComponents.push(result);
      
      if (result.effort === 'large') totalEffort += 3;
      else if (result.effort === 'medium') totalEffort += 2;
      else totalEffort += 1;
    }

    const avgEffort = totalEffort / components.length;
    let complexity: MigrationAssessment['complexity'];
    
    if (avgEffort < 1.5) complexity = 'low';
    else if (avgEffort < 2.2) complexity = 'medium';
    else if (avgEffort < 2.8) complexity = 'high';
    else complexity = 'very-high';

    let estimatedEffort: string;
    if (complexity === 'low') estimatedEffort = '1-2 周';
    else if (complexity === 'medium') estimatedEffort = '2-4 周';
    else if (complexity === 'high') estimatedEffort = '1-2 月';
    else estimatedEffort = '2-3 月';

    const risks = this.identifyRisks(sourcePlatform, targetPlatform, migrationComponents);
    const recommendations = this.generateRecommendations(complexity, migrationComponents);

    return {
      id: `migration-${Date.now()}`,
      sourcePlatform,
      targetPlatform,
      complexity,
      estimatedEffort,
      risks,
      components: migrationComponents,
      recommendations
    };
  }

  private assessComponent(
    componentName: string,
    source: string,
    target: string
  ): MigrationAssessment['components'][0] {
    const lowEffortComponents = ['Button', 'Input', 'Card', 'List', 'Modal'];
    const mediumEffortComponents = ['Form', 'Table', 'Chart', 'Tabs', 'Stepper'];
    const highEffortComponents = ['Editor', 'Map', 'VideoPlayer', 'FileUpload', 'Calendar'];

    let effort: 'small' | 'medium' | 'large' = 'medium';
    let migrationType: MigrationAssessment['components'][0]['migrationType'] = 'adapt';
    let notes: string | undefined;

    if (lowEffortComponents.some(c => componentName.toLowerCase().includes(c.toLowerCase()))) {
      effort = 'small';
      migrationType = 'direct';
    }

    if (mediumEffortComponents.some(c => componentName.toLowerCase().includes(c.toLowerCase()))) {
      effort = 'medium';
      migrationType = 'adapt';
    }

    if (highEffortComponents.some(c => componentName.toLowerCase().includes(c.toLowerCase()))) {
      effort = 'large';
      migrationType = 'rewrite';
      notes = '复杂组件建议重写以适配目标平台';
    }

    if ((source === 'web' && target === 'mini-program') ||
        (source === 'mini-program' && target === 'web')) {
      effort = effort === 'small' ? 'medium' : effort;
      if (!notes) notes = '跨平台迁移需要适配组件 API';
    }

    if ((source === 'web' && target === 'app') ||
        (source === 'app' && target === 'web')) {
      effort = effort === 'large' ? 'large' : (effort === 'medium' ? 'large' : 'medium');
      migrationType = 'rewrite';
      if (!notes) notes = 'Web 和 App 组件差异较大，建议重写';
    }

    return {
      name: componentName,
      migrationType,
      effort,
      notes
    };
  }

  private identifyRisks(
    source: string,
    target: string,
    components: MigrationAssessment['components']
  ): string[] {
    const risks: string[] = [];

    const rewriteCount = components.filter(c => c.migrationType === 'rewrite').length;
    if (rewriteCount > 3) {
      risks.push(`有 ${rewriteCount} 个组件需要重写，开发工作量大`);
    }

    const largeEffortCount = components.filter(c => c.effort === 'large').length;
    if (largeEffortCount > 2) {
      risks.push(`${largeEffortCount} 个高复杂度组件，可能影响工期`);
    }

    if (source === 'web' && target === 'mini-program') {
      risks.push('小程序有包体大小限制（2MB），需要代码分包');
      risks.push('小程序 DOM 操作受限，需适配原生 API');
    }

    if (target === 'app') {
      risks.push('移动端性能优化需要额外工作量');
      risks.push('需要适配多种屏幕尺寸');
    }

    if (risks.length === 0) {
      risks.push('迁移风险较低，按计划执行即可');
    }

    return risks;
  }

  private generateRecommendations(
    complexity: MigrationAssessment['complexity'],
    components: MigrationAssessment['components']
  ): string[] {
    const recommendations: string[] = [];

    if (complexity === 'very-high' || complexity === 'high') {
      recommendations.push('建议采用增量迁移策略，先迁移核心功能');
      recommendations.push('建议先做 POC 验证，确认技术可行性');
    }

    const adaptCount = components.filter(c => c.migrationType === 'adapt').length;
    if (adaptCount > 5) {
      recommendations.push('建议封装统一的组件适配层，减少重复工作');
    }

    const rewriteCount = components.filter(c => c.migrationType === 'rewrite').length;
    if (rewriteCount > 3) {
      recommendations.push('重写组件较多，建议评估是否使用跨端框架');
    }

    recommendations.push('迁移前确保有完整的测试用例，用于回归验证');
    recommendations.push('建议保留旧版本一段时间，用于对比验证');

    return recommendations;
  }

  async generateMigrationPlan(assessment: MigrationAssessment): Promise<MigrationStep[]> {
    const steps: MigrationStep[] = [
      {
        order: 1,
        phase: '准备阶段',
        description: '环境搭建、依赖安装、脚手架初始化',
        estimatedTime: '1-2 天',
        dependencies: []
      },
      {
        order: 2,
        phase: '基础组件迁移',
        description: '迁移基础 UI 组件（Button、Input、Card 等）',
        estimatedTime: assessment.components.filter(c => c.effort === 'small').length > 5 ? '1 周' : '3-5 天',
        dependencies: ['准备阶段']
      },
      {
        order: 3,
        phase: '复杂组件迁移',
        description: '迁移复杂组件（Table、Form、Chart 等）',
        estimatedTime: assessment.components.filter(c => c.effort === 'medium' || c.effort === 'large').length > 3 ? '2 周' : '1 周',
        dependencies: ['基础组件迁移']
      },
      {
        order: 4,
        phase: '业务逻辑迁移',
        description: '迁移业务逻辑和状态管理',
        estimatedTime: '1-2 周',
        dependencies: ['基础组件迁移']
      },
      {
        order: 5,
        phase: '联调测试',
        description: '功能联调、测试验证、Bug 修复',
        estimatedTime: '1 周',
        dependencies: ['复杂组件迁移', '业务逻辑迁移']
      },
      {
        order: 6,
        phase: '上线准备',
        description: '性能优化、文档更新、上线部署',
        estimatedTime: '2-3 天',
        dependencies: ['联调测试']
      }
    ];

    return steps;
  }

  async generateReport(assessment: MigrationAssessment): Promise<string> {
    let report = `# 迁移评估报告\n\n`;
    report += `## 基本信息\n\n`;
    report += `- 源平台: ${assessment.sourcePlatform}\n`;
    report += `- 目标平台: ${assessment.targetPlatform}\n`;
    report += `- 复杂度: ${assessment.complexity}\n`;
    report += `- 预计工期: ${assessment.estimatedEffort}\n\n`;
    
    report += `## 组件迁移明细\n\n`;
    report += `| 组件 | 迁移方式 | 工作量 | 备注 |\n`;
    report += `|------|----------|--------|------|\n`;
    
    for (const comp of assessment.components) {
      const typeMap: Record<string, string> = {
        direct: '直接迁移',
        adapt: '适配修改',
        rewrite: '重写',
        unsupported: '不支持'
      };
      report += `| ${comp.name} | ${typeMap[comp.migrationType]} | ${comp.effort} | ${comp.notes || '-'} |\n`;
    }
    
    report += `\n## 风险评估\n\n`;
    for (const risk of assessment.risks) {
      report += `- ⚠️  ${risk}\n`;
    }
    
    report += `\n## 建议\n\n`;
    for (const rec of assessment.recommendations) {
      report += `- 💡 ${rec}\n`;
    }
    
    return report;
  }
}
