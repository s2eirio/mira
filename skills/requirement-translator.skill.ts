export interface TranslatedRequirement {
  original: string;
  translated: string;
  userStories: string[];
  acceptanceCriteria: string[];
  extractedConstraints: {
    design: string[];
    functional: string[];
    platform: string[];
    nonFunctional: string[];
  };
}

export class RequirementTranslatorSkill {
  async translate(requirement: string): Promise<TranslatedRequirement> {
    const userStories = this.extractUserStories(requirement);
    const acceptanceCriteria = this.extractAcceptanceCriteria(requirement);
    const extractedConstraints = this.extractConstraints(requirement);

    return {
      original: requirement,
      translated: requirement,
      userStories,
      acceptanceCriteria,
      extractedConstraints
    };
  }

  private extractUserStories(requirement: string): string[] {
    const stories: string[] = [];

    if (requirement.includes('作为') || requirement.includes('作为用户')) {
      const storyRegex = /作为[^，,。.]+[，,][^。.]+[。.]/g;
      const matches = requirement.match(storyRegex);
      if (matches) {
        stories.push(...matches);
      }
    }

    if (stories.length === 0) {
      stories.push(`作为用户，我希望${requirement}，以便完成我的任务`);
    }

    return stories;
  }

  private extractAcceptanceCriteria(requirement: string): string[] {
    const criteria: string[] = [];

    if (requirement.includes('必须') || requirement.includes('需要')) {
      const mustRegex = /[^，,。.]+必须[^。.]+[。.]/g;
      const matches = requirement.match(mustRegex);
      if (matches) {
        criteria.push(...matches);
      }
    }

    if (criteria.length === 0) {
      criteria.push('功能正常运行');
      criteria.push('用户界面响应及时');
      criteria.push('操作流程符合直觉');
    }

    return criteria;
  }

  private extractConstraints(requirement: string): TranslatedRequirement['extractedConstraints'] {
    const design: string[] = [];
    const functional: string[] = [];
    const platform: string[] = [];
    const nonFunctional: string[] = [];

    const designKeywords = ['高级感', '年轻化', '极简', '清爽', '现代', '毛玻璃', '渐变', '暗色', '清新', '科技'];
    const platformKeywords = ['web', '浏览器', '小程序', '微信', 'pc', '桌面', 'app', '移动端', 'ios', 'android'];
    const nonFunctionalKeywords = ['性能', '响应', '加载', '安全', '兼容', '离线', '多语言'];

    for (const keyword of designKeywords) {
      if (requirement.toLowerCase().includes(keyword.toLowerCase())) {
        design.push(keyword);
      }
    }

    for (const keyword of platformKeywords) {
      if (requirement.toLowerCase().includes(keyword.toLowerCase())) {
        platform.push(keyword);
      }
    }

    for (const keyword of nonFunctionalKeywords) {
      if (requirement.toLowerCase().includes(keyword.toLowerCase())) {
        nonFunctional.push(keyword);
      }
    }

    functional.push(requirement);

    return { design, functional, platform, nonFunctional };
  }

  async generateUserStoryFormat(requirement: string): Promise<string> {
    const translated = await this.translate(requirement);
    
    let output = '## 用户故事\n\n';
    for (const story of translated.userStories) {
      output += `- ${story}\n`;
    }
    
    output += '\n## 验收标准\n\n';
    for (const criteria of translated.acceptanceCriteria) {
      output += `- ${criteria}\n`;
    }
    
    output += '\n## 约束条件\n\n';
    output += `### 设计约束: ${translated.extractedConstraints.design.join(', ')}\n`;
    output += `### 平台约束: ${translated.extractedConstraints.platform.join(', ')}\n`;
    output += `### 非功能约束: ${translated.extractedConstraints.nonFunctional.join(', ')}\n`;
    
    return output;
  }
}
