export interface BranchInfo {
  name: string;
  type: 'feature' | 'bugfix' | 'release' | 'hotfix' | 'main' | 'develop';
  base: string;
  description: string;
  createdAt: string;
  status: 'active' | 'merged' | 'closed';
}

export interface BranchStrategy {
  strategyName: string;
  mainBranch: string;
  developBranch?: string;
  allowedBranches: BranchInfo[];
  rules: string[];
  namingConvention: Record<string, string>;
}

export class BranchStrategySkill {
  async getGitFlowStrategy(): Promise<BranchStrategy> {
    return {
      strategyName: 'Git Flow',
      mainBranch: 'main',
      developBranch: 'develop',
      allowedBranches: [
        { name: 'main', type: 'main', base: '-', description: '生产环境代码', createdAt: '-', status: 'active' },
        { name: 'develop', type: 'develop', base: 'main', description: '开发集成分支', createdAt: '-', status: 'active' }
      ],
      rules: [
        'feature/* 分支从 develop 创建，完成后合并回 develop',
        'release/* 分支从 develop 创建，完成后合并回 main 和 develop',
        'hotfix/* 分支从 main 创建，完成后合并回 main 和 develop',
        'main 分支只通过 PR 合并，不允许直接 push',
        '所有合并前必须通过 CI 测试'
      ],
      namingConvention: {
        feature: 'feature/<issue-number>-<short-description>',
        bugfix: 'bugfix/<issue-number>-<short-description>',
        release: 'release/<version>',
        hotfix: 'hotfix/<version>'
      }
    };
  }

  async getTrunkBasedStrategy(): Promise<BranchStrategy> {
    return {
      strategyName: 'Trunk-Based Development',
      mainBranch: 'main',
      allowedBranches: [
        { name: 'main', type: 'main', base: '-', description: '主干分支', createdAt: '-', status: 'active' }
      ],
      rules: [
        '所有开发直接在 main 分支上进行',
        '使用 feature flags 控制功能发布',
        '短生命周期分支（不超过1天）',
        '频繁合并，每天至少合并一次',
        'CI/CD 自动化测试和部署'
      ],
      namingConvention: {
        feature: '<short-description>',
        hotfix: 'hotfix/<short-description>'
      }
    };
  }

  async getGithubFlowStrategy(): Promise<BranchStrategy> {
    return {
      strategyName: 'GitHub Flow',
      mainBranch: 'main',
      allowedBranches: [
        { name: 'main', type: 'main', base: '-', description: '生产就绪代码', createdAt: '-', status: 'active' }
      ],
      rules: [
        '所有功能在 feature 分支开发',
        'feature 分支从 main 创建',
        '通过 Pull Request 合并回 main',
        'PR 必须通过代码审查和 CI 测试',
        'main 分支随时可以部署'
      ],
      namingConvention: {
        feature: '<username>/<short-description>',
        bugfix: '<username>/fix-<description>',
        hotfix: 'hotfix/<version>'
      }
    };
  }

  async recommendStrategy(projectType: string): Promise<BranchStrategy> {
    if (projectType.includes('enterprise') || projectType.includes('企业') || projectType.includes('多团队')) {
      return this.getGitFlowStrategy();
    }

    if (projectType.includes('startup') || projectType.includes('创业') || projectType.includes('快速迭代')) {
      return this.getTrunkBasedStrategy();
    }

    return this.getGithubFlowStrategy();
  }

  async validateBranchName(
    branchName: string,
    strategy: BranchStrategy
  ): Promise<{
    valid: boolean;
    suggestions: string[];
    reason: string;
  }> {
    const suggestions: string[] = [];
    let valid = true;
    let reason = '分支名称有效';

    if (branchName === strategy.mainBranch) {
      return { valid: true, suggestions: [], reason: '主分支' };
    }

    if (strategy.developBranch && branchName === strategy.developBranch) {
      return { valid: true, suggestions: [], reason: '开发分支' };
    }

    const prefixes = Object.keys(strategy.namingConvention);
    const matchedPrefix = prefixes.find(p => branchName.startsWith(`${p}/`));

    if (!matchedPrefix) {
      valid = false;
      reason = '分支名称不符合命名规范';
      for (const prefix of prefixes) {
        suggestions.push(strategy.namingConvention[prefix]);
      }
    }

    return { valid, suggestions, reason };
  }

  async createBranchPlan(
    featureName: string,
    strategy: BranchStrategy
  ): Promise<{
    branchName: string;
    baseBranch: string;
    mergeTarget: string;
    steps: string[];
  }> {
    const naming = strategy.namingConvention.feature;
    const branchName = naming
      .replace('<issue-number>', '001')
      .replace('<short-description>', featureName.toLowerCase().replace(/\s+/g, '-'))
      .replace('<username>', 's2eirio');

    const baseBranch = strategy.developBranch || strategy.mainBranch;
    const mergeTarget = strategy.developBranch || strategy.mainBranch;

    const steps = [
      `git checkout ${baseBranch}`,
      `git pull origin ${baseBranch}`,
      `git checkout -b ${branchName}`,
      '开发功能并提交',
      `git push origin ${branchName}`,
      '创建 Pull Request',
      `合并到 ${mergeTarget}`
    ];

    return { branchName, baseBranch, mergeTarget, steps };
  }
}
