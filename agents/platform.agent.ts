export interface PlatformDetection {
  platforms: string[];
  ambiguous: boolean;
  clarificationQuestions: string[];
}

export interface TechnologyStack {
  platform: string;
  framework: string;
  uiLibrary: string;
  styling: string;
  stateManagement: string;
  routing: string;
  storage: string;
  reasons: string[];
}

export interface PlatformDecision {
  platforms: TechnologyStack[];
  coreTech: string;
  sharedLogic: string[];
  platformSpecific: Record<string, string[]>;
}

export class PlatformAgent {
  private platformKeywords: Record<string, string[]> = {
    web: ['web', '浏览器', '官网', '网站', '后台', 'dashboard', '管理'],
    'mini-program': ['小程序', '微信', '支付宝', '抖音', '头条'],
    pc: ['pc', '桌面', 'mac', 'windows', '客户端', '离线', '文件系统', '系统托盘'],
    app: ['app', '移动端', '手机', 'ios', 'android', '扫码', '拍照', '推送', 'gps']
  };

  private techStackMapping: Record<string, Record<string, TechnologyStack>> = {
    web: {
      react: {
        platform: 'web',
        framework: 'React + Vite',
        uiLibrary: 'shadcn/ui',
        styling: 'TailwindCSS',
        stateManagement: 'Zustand',
        routing: 'React Router',
        storage: 'localStorage',
        reasons: ['生态成熟', 'UI组件丰富', '社区活跃']
      },
      vue: {
        platform: 'web',
        framework: 'Vue + Vite',
        uiLibrary: 'Element Plus',
        styling: 'TailwindCSS',
        stateManagement: 'Pinia',
        routing: 'Vue Router',
        storage: 'localStorage',
        reasons: ['轻量级', '响应式系统', '管理后台首选']
      }
    },
    'mini-program': {
      taro: {
        platform: 'mini-program',
        framework: 'Taro + React',
        uiLibrary: 'Taro UI',
        styling: 'CSS Modules',
        stateManagement: 'Zustand',
        routing: 'Taro Router',
        storage: 'Taro Storage',
        reasons: ['React生态', '多端发布', '开发体验一致']
      },
      uniapp: {
        platform: 'mini-program',
        framework: 'uni-app + Vue',
        uiLibrary: 'uView',
        styling: 'SCSS',
        stateManagement: 'Pinia',
        routing: 'uni-router',
        storage: 'uni.storage',
        reasons: ['Vue生态', '平台覆盖广', '社区成熟']
      }
    },
    pc: {
      electron: {
        platform: 'pc',
        framework: 'Electron + React',
        uiLibrary: 'shadcn/ui',
        styling: 'TailwindCSS',
        stateManagement: 'Zustand',
        routing: 'React Router',
        storage: 'Electron Store',
        reasons: ['复用Web代码', '原生能力', '跨平台']
      }
    },
    app: {
      'react-native': {
        platform: 'app',
        framework: 'React Native',
        uiLibrary: 'React Native Paper',
        styling: 'StyleSheet',
        stateManagement: 'Zustand',
        routing: 'React Navigation',
        storage: 'AsyncStorage',
        reasons: ['React生态', 'Hot Reload', '社区大']
      },
      flutter: {
        platform: 'app',
        framework: 'Flutter',
        uiLibrary: 'Material Design',
        styling: 'Flutter Widgets',
        stateManagement: 'Riverpod',
        routing: 'GoRouter',
        storage: 'SharedPreferences',
        reasons: ['跨端一致性', '性能优异', 'Skia渲染']
      }
    }
  };

  async detectPlatform(requirement: string): Promise<PlatformDetection> {
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
      platforms: detectedPlatforms,
      ambiguous,
      clarificationQuestions
    };
  }

  async recommendTechStack(platforms: string[]): Promise<TechnologyStack[]> {
    const recommendations: TechnologyStack[] = [];

    for (const platform of platforms) {
      const mappings = this.techStackMapping[platform];
      
      if (mappings) {
        const defaultKey = Object.keys(mappings)[0];
        recommendations.push(mappings[defaultKey]);
      }
    }

    return recommendations;
  }

  async makeDecision(requirement: string): Promise<PlatformDecision> {
    const detection = await this.detectPlatform(requirement);
    
    if (detection.ambiguous) {
      return {
        platforms: [],
        coreTech: '',
        sharedLogic: [],
        platformSpecific: {}
      };
    }

    const stacks = await this.recommendTechStack(detection.platforms);

    const sharedLogic = ['业务逻辑', '数据模型', 'API调用', '状态管理核心'];
    const platformSpecific: Record<string, string[]> = {};

    for (const stack of stacks) {
      platformSpecific[stack.platform] = [
        `UI层 (${stack.uiLibrary})`,
        `路由适配 (${stack.routing})`,
        `存储适配 (${stack.storage})`,
        '平台特有API'
      ];
    }

    return {
      platforms: stacks,
      coreTech: stacks.length > 0 ? stacks[0].framework.split(' ')[0] : '',
      sharedLogic,
      platformSpecific
    };
  }

  async generatePlatformDocument(decision: PlatformDecision): Promise<string> {
    if (decision.platforms.length === 0) {
      return '平台决策尚未完成，请先明确平台需求';
    }

    let doc = '# 平台决策文档\n\n';
    doc += `## 核心技术栈\n\n${decision.coreTech}\n\n`;
    doc += '## 支持平台\n\n';

    for (const stack of decision.platforms) {
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

    doc += '## 共享逻辑层\n\n';
    for (const logic of decision.sharedLogic) {
      doc += `- ${logic}\n`;
    }

    doc += '\n## 平台特定实现\n\n';
    for (const [platform, specifics] of Object.entries(decision.platformSpecific)) {
      doc += `### ${platform}\n\n`;
      for (const specific of specifics) {
        doc += `- ${specific}\n`;
      }
      doc += '\n';
    }

    return doc;
  }
}
