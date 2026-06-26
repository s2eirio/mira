export interface PlatformDetectionResult {
  detectedPlatforms: string[];
  ambiguous: boolean;
  clarificationQuestions: string[];
}

export interface TechStackRecommendation {
  platform: string;
  framework: string;
  uiLibrary: string;
  styling: string;
  stateManagement: string;
  routing: string;
  storage: string;
  reasons: string[];
}

export class PlatformSnifferSkill {
  private platformKeywords: Record<string, string[]> = {
    web: ['web', '浏览器', '官网', '网站', '后台', 'dashboard', '管理', '页面'],
    'mini-program': ['小程序', '微信', '支付宝', '抖音', '头条', '小程序'],
    pc: ['pc', '桌面', 'mac', 'windows', '客户端', '离线', '文件系统', '系统托盘'],
    app: ['app', '移动端', '手机', 'ios', 'android', '扫码', '拍照', '推送', 'gps']
  };

  private techStackMapping: Record<string, TechStackRecommendation> = {
    web: {
      platform: 'web',
      framework: 'React + Vite',
      uiLibrary: 'shadcn/ui',
      styling: 'TailwindCSS',
      stateManagement: 'Zustand',
      routing: 'React Router',
      storage: 'localStorage',
      reasons: ['生态成熟', 'UI组件丰富', '社区活跃']
    },
    'mini-program': {
      platform: 'mini-program',
      framework: 'Taro + React',
      uiLibrary: 'Taro UI',
      styling: 'CSS Modules',
      stateManagement: 'Zustand',
      routing: 'Taro Router',
      storage: 'Taro Storage',
      reasons: ['React生态', '多端发布', '开发体验一致']
    },
    pc: {
      platform: 'pc',
      framework: 'Electron + React',
      uiLibrary: 'shadcn/ui',
      styling: 'TailwindCSS',
      stateManagement: 'Zustand',
      routing: 'React Router',
      storage: 'Electron Store',
      reasons: ['复用Web代码', '原生能力', '跨平台']
    },
    app: {
      platform: 'app',
      framework: 'React Native',
      uiLibrary: 'React Native Paper',
      styling: 'StyleSheet',
      stateManagement: 'Zustand',
      routing: 'React Navigation',
      storage: 'AsyncStorage',
      reasons: ['React生态', 'Hot Reload', '社区大']
    }
  };

  async detectPlatform(requirement: string): Promise<PlatformDetectionResult> {
    const detectedPlatforms: string[] = [];
    const lowerRequirement = requirement.toLowerCase();

    for (const [platform, keywords] of Object.entries(this.platformKeywords)) {
      for (const keyword of keywords) {
        if (lowerRequirement.includes(keyword.toLowerCase())) {
          if (!detectedPlatforms.includes(platform)) {
            detectedPlatforms.push(platform);
          }
        }
      }
    }

    let ambiguous = false;
    const clarificationQuestions: string[] = [];

    if (detectedPlatforms.length === 0) {
      ambiguous = true;
      clarificationQuestions.push(
        '用户在哪里使用这个应用？（浏览器/手机/桌面）',
        '需要相机、定位等硬件功能吗？',
        '是否需要离线使用？'
      );
    } else if (detectedPlatforms.length > 2) {
      ambiguous = true;
      clarificationQuestions.push(
        `检测到多个平台：${detectedPlatforms.join('、')}，需要全部支持吗？`,
        '哪个平台是优先开发的？'
      );
    }

    return {
      detectedPlatforms,
      ambiguous,
      clarificationQuestions
    };
  }

  async recommendTechStack(platforms: string[]): Promise<TechStackRecommendation[]> {
    return platforms
      .map(p => this.techStackMapping[p])
      .filter(Boolean) as TechStackRecommendation[];
  }

  async makeDecision(requirement: string): Promise<{
    decision: TechStackRecommendation[];
    summary: string;
  }> {
    const detection = await this.detectPlatform(requirement);

    if (detection.ambiguous) {
      return {
        decision: [],
        summary: '平台需求不明确，请先回答以下问题：\n' + detection.clarificationQuestions.join('\n')
      };
    }

    const recommendations = await this.recommendTechStack(detection.detectedPlatforms);

    const summary = recommendations.length > 0
      ? `已确定目标平台：${recommendations.map(r => r.platform).join('、')}\n技术栈：${recommendations.map(r => r.framework).join('、')}`
      : '未检测到明确的平台信息';

    return { decision: recommendations, summary };
  }

  async generateDecisionDocument(requirement: string): Promise<string> {
    const { decision, summary } = await this.makeDecision(requirement);

    if (decision.length === 0) {
      return summary;
    }

    let doc = '# 平台决策报告\n\n';
    doc += `## 需求分析\n\n${requirement}\n\n`;
    doc += `## 决策摘要\n\n${summary}\n\n`;
    doc += '## 技术栈详情\n\n';

    for (const stack of decision) {
      doc += `### ${stack.platform}\n\n`;
      doc += `| 类别 | 技术方案 |\n`;
      doc += `|------|----------|\n`;
      doc += `| 框架 | ${stack.framework} |\n`;
      doc += `| UI库 | ${stack.uiLibrary} |\n`;
      doc += `| 样式 | ${stack.styling} |\n`;
      doc += `| 状态管理 | ${stack.stateManagement} |\n`;
      doc += `| 路由 | ${stack.routing} |\n`;
      doc += `| 存储 | ${stack.storage} |\n\n`;
      doc += `**选择理由**:\n\n`;
      for (const reason of stack.reasons) {
        doc += `- ${reason}\n`;
      }
      doc += '\n';
    }

    return doc;
  }
}
