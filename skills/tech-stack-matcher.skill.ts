export interface TechStackOption {
  name: string;
  category: 'framework' | 'ui' | 'styling' | 'state' | 'routing' | 'storage' | 'testing' | 'build';
  pros: string[];
  cons: string[];
  maturity: 'mature' | 'growing' | 'emerging';
  popularity: number;
  learningCurve: 'easy' | 'medium' | 'hard';
}

export interface TechStackMatch {
  platform: string;
  framework: string;
  uiLibrary: string;
  styling: string;
  stateManagement: string;
  routing: string;
  storage: string;
  testing: string;
  buildTool: string;
  reasons: string[];
  overallScore: number;
}

export class TechStackMatcherSkill {
  private options: Record<string, TechStackOption[]> = {
    web: [
      {
        name: 'React',
        category: 'framework',
        pros: ['生态最丰富', '社区最大', '就业机会多', '组件化成熟'],
        cons: ['学习曲线较陡', '需要额外依赖', '配置复杂'],
        maturity: 'mature',
        popularity: 95,
        learningCurve: 'medium'
      },
      {
        name: 'Vue',
        category: 'framework',
        pros: ['学习曲线平缓', '中文文档完善', '国内生态好', '模板语法直观'],
        cons: ['大型项目生态稍弱', '英文社区相对小'],
        maturity: 'mature',
        popularity: 85,
        learningCurve: 'easy'
      }
    ],
    'mini-program': [
      {
        name: 'Taro',
        category: 'framework',
        pros: ['React生态', '多端支持', '组件丰富', '开发体验一致'],
        cons: ['多端兼容有坑', '包体稍大'],
        maturity: 'growing',
        popularity: 75,
        learningCurve: 'medium'
      },
      {
        name: 'uni-app',
        category: 'framework',
        pros: ['Vue生态', '平台覆盖广', '社区成熟', '文档完善'],
        cons: ['跨平台有差异', '原生能力有限'],
        maturity: 'growing',
        popularity: 80,
        learningCurve: 'easy'
      }
    ]
  };

  async matchStack(
    platform: string,
    requirements: {
      projectSize: 'small' | 'medium' | 'large';
      teamSize: 'solo' | 'small' | 'large';
      timeline: 'fast' | 'normal' | 'long';
      priority: 'performance' | 'development-speed' | 'maintainability';
      existingSkills?: string[];
    }
  ): Promise<TechStackMatch[]> {
    const matches: TechStackMatch[] = [];

    if (platform === 'web' || platform.includes('web')) {
      const reactMatch = await this.matchReact(requirements);
      const vueMatch = await this.matchVue(requirements);
      matches.push(reactMatch, vueMatch);
    }

    if (platform === 'mini-program' || platform.includes('小程序')) {
      matches.push(await this.matchTaro(requirements));
      matches.push(await this.matchUniApp(requirements));
    }

    if (platform === 'pc' || platform.includes('桌面')) {
      matches.push(await this.matchElectron(requirements));
    }

    if (platform === 'app' || platform.includes('移动')) {
      matches.push(await this.matchReactNative(requirements));
      matches.push(await this.matchFlutter(requirements));
    }

    matches.sort((a, b) => b.overallScore - a.overallScore);
    return matches;
  }

  private async matchReact(requirements: {
    projectSize: string;
    teamSize: string;
    timeline: string;
    priority: string;
    existingSkills?: string[];
  }): Promise<TechStackMatch> {
    let score = 75;
    const reasons: string[] = ['React 生态成熟', '社区活跃'];

    if (requirements.projectSize === 'large') {
      score += 10;
      reasons.push('适合大型项目');
    }

    if (requirements.priority === 'maintainability') {
      score += 5;
      reasons.push('可维护性好');
    }

    if (requirements.existingSkills?.includes('react')) {
      score += 10;
      reasons.push('团队已有 React 经验');
    }

    return {
      platform: 'web',
      framework: 'React + Vite',
      uiLibrary: 'shadcn/ui',
      styling: 'TailwindCSS',
      stateManagement: 'Zustand',
      routing: 'React Router',
      storage: 'localStorage',
      testing: 'Vitest + Playwright',
      buildTool: 'Vite',
      reasons,
      overallScore: Math.min(score, 100)
    };
  }

  private async matchVue(requirements: {
    projectSize: string;
    teamSize: string;
    timeline: string;
    priority: string;
    existingSkills?: string[];
  }): Promise<TechStackMatch> {
    let score = 70;
    const reasons: string[] = ['Vue 学习曲线平缓', '中文文档完善'];

    if (requirements.timeline === 'fast') {
      score += 10;
      reasons.push('开发速度快');
    }

    if (requirements.projectSize === 'small' || requirements.projectSize === 'medium') {
      score += 5;
      reasons.push('适合中小型项目');
    }

    if (requirements.existingSkills?.includes('vue')) {
      score += 10;
      reasons.push('团队已有 Vue 经验');
    }

    return {
      platform: 'web',
      framework: 'Vue + Vite',
      uiLibrary: 'Element Plus',
      styling: 'TailwindCSS',
      stateManagement: 'Pinia',
      routing: 'Vue Router',
      storage: 'localStorage',
      testing: 'Vitest + Playwright',
      buildTool: 'Vite',
      reasons,
      overallScore: Math.min(score, 100)
    };
  }

  private async matchTaro(_requirements: {
    projectSize: string;
    teamSize: string;
    timeline: string;
    priority: string;
    existingSkills?: string[];
  }): Promise<TechStackMatch> {
    return {
      platform: 'mini-program',
      framework: 'Taro + React',
      uiLibrary: 'Taro UI',
      styling: 'CSS Modules',
      stateManagement: 'Zustand',
      routing: 'Taro Router',
      storage: 'Taro Storage',
      testing: 'Jest',
      buildTool: 'Webpack',
      reasons: ['React 生态', '多端发布', '开发体验一致'],
      overallScore: 80
    };
  }

  private async matchUniApp(_requirements: {
    projectSize: string;
    teamSize: string;
    timeline: string;
    priority: string;
    existingSkills?: string[];
  }): Promise<TechStackMatch> {
    return {
      platform: 'mini-program',
      framework: 'uni-app + Vue',
      uiLibrary: 'uView',
      styling: 'SCSS',
      stateManagement: 'Pinia',
      routing: 'uni-router',
      storage: 'uni.storage',
      testing: 'Jest',
      buildTool: 'Vite',
      reasons: ['Vue 生态', '平台覆盖广', '社区成熟'],
      overallScore: 78
    };
  }

  private async matchElectron(_requirements: {
    projectSize: string;
    teamSize: string;
    timeline: string;
    priority: string;
    existingSkills?: string[];
  }): Promise<TechStackMatch> {
    return {
      platform: 'pc',
      framework: 'Electron + React',
      uiLibrary: 'shadcn/ui',
      styling: 'TailwindCSS',
      stateManagement: 'Zustand',
      routing: 'React Router',
      storage: 'Electron Store',
      testing: 'Vitest + Playwright',
      buildTool: 'Vite',
      reasons: ['复用 Web 代码', '原生能力', '跨平台'],
      overallScore: 82
    };
  }

  private async matchReactNative(_requirements: {
    projectSize: string;
    teamSize: string;
    timeline: string;
    priority: string;
    existingSkills?: string[];
  }): Promise<TechStackMatch> {
    return {
      platform: 'app',
      framework: 'React Native',
      uiLibrary: 'React Native Paper',
      styling: 'StyleSheet',
      stateManagement: 'Zustand',
      routing: 'React Navigation',
      storage: 'AsyncStorage',
      testing: 'Jest + Detox',
      buildTool: 'Metro',
      reasons: ['React 生态', 'Hot Reload', '社区大'],
      overallScore: 78
    };
  }

  private async matchFlutter(_requirements: {
    projectSize: string;
    teamSize: string;
    timeline: string;
    priority: string;
    existingSkills?: string[];
  }): Promise<TechStackMatch> {
    return {
      platform: 'app',
      framework: 'Flutter',
      uiLibrary: 'Material Design',
      styling: 'Flutter Widgets',
      stateManagement: 'Riverpod',
      routing: 'GoRouter',
      storage: 'SharedPreferences',
      testing: 'Flutter Test',
      buildTool: 'Flutter CLI',
      reasons: ['跨端一致性', '性能优异', 'Skia 渲染'],
      overallScore: 80
    };
  }

  async generateComparisonReport(matches: TechStackMatch[]): Promise<string> {
    let report = '# 技术栈对比报告\n\n';
    
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      report += `## ${i + 1}. ${match.framework} (${match.platform})\n\n`;
      report += `**综合得分**: ${match.overallScore}/100\n\n`;
      report += `| 类别 | 选择 |\n|------|------|\n`;
      report += `| UI 库 | ${match.uiLibrary} |\n`;
      report += `| 样式方案 | ${match.styling} |\n`;
      report += `| 状态管理 | ${match.stateManagement} |\n`;
      report += `| 路由 | ${match.routing} |\n`;
      report += `| 存储 | ${match.storage} |\n`;
      report += `| 测试 | ${match.testing} |\n`;
      report += `| 构建工具 | ${match.buildTool} |\n\n`;
      report += `**选择理由**:\n\n`;
      for (const reason of match.reasons) {
        report += `- ${reason}\n`;
      }
      report += '\n';
    }

    return report;
  }
}
