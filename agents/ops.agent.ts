export interface BranchInfo {
  name: string;
  type: 'feature' | 'develop' | 'release' | 'hotfix' | 'main';
  baseBranch?: string;
  status: 'active' | 'merged' | 'closed';
  createdAt: string;
}

export interface VersionInfo {
  version: string;
  type: 'major' | 'minor' | 'patch';
  branch: string;
  changes: string[];
  createdAt: string;
}

export interface DeploymentTarget {
  name: string;
  environment: 'dev' | 'staging' | 'production';
  url: string;
  branch: string;
}

export class OpsAgent {
  private branches: BranchInfo[] = [];
  private versions: VersionInfo[] = [];

  async createBranch(
    name: string,
    type: BranchInfo['type'],
    baseBranch: string = 'main'
  ): Promise<BranchInfo> {
    const branch: BranchInfo = {
      name,
      type,
      baseBranch,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    this.branches.push(branch);
    return branch;
  }

  async mergeBranch(
    sourceBranch: string,
    targetBranch: string
  ): Promise<{ success: boolean; message: string }> {
    const source = this.branches.find(b => b.name === sourceBranch);
    const target = this.branches.find(b => b.name === targetBranch);

    if (!source || !target) {
      return { success: false, message: '分支不存在' };
    }

    if (source.status !== 'active') {
      return { success: false, message: '源分支已关闭' };
    }

    source.status = 'merged';
    return { success: true, message: `已将 ${sourceBranch} 合并到 ${targetBranch}` };
  }

  async inferVersion(changeType: string): Promise<{
    currentVersion: string;
    nextVersion: string;
    versionType: 'major' | 'minor' | 'patch';
    reason: string;
  }> {
    const currentVersion = this.versions.length > 0 
      ? this.versions[this.versions.length - 1].version 
      : '1.0.0';

    let versionType: 'major' | 'minor' | 'patch' = 'patch';
    let reason = 'Bug修复或微小改进';

    if (changeType.includes('破坏性') || changeType.includes('重写') || changeType.includes('主色')) {
      versionType = 'major';
      reason = '破坏性变更或重大设计变更';
    } else if (changeType.includes('新功能') || changeType.includes('新增') || changeType.includes('feature')) {
      versionType = 'minor';
      reason = '新增功能';
    }

    const [major, minor, patch] = currentVersion.split('.').map(Number);
    let nextVersion = '';

    switch (versionType) {
      case 'major':
        nextVersion = `${major + 1}.0.0`;
        break;
      case 'minor':
        nextVersion = `${major}.${minor + 1}.0`;
        break;
      case 'patch':
        nextVersion = `${major}.${minor}.${patch + 1}`;
        break;
    }

    return { currentVersion, nextVersion, versionType, reason };
  }

  async createVersion(
    changeType: string,
    branch: string,
    changes: string[]
  ): Promise<VersionInfo> {
    const { nextVersion, versionType } = await this.inferVersion(changeType);

    const version: VersionInfo = {
      version: nextVersion,
      type: versionType,
      branch,
      changes,
      createdAt: new Date().toISOString()
    };

    this.versions.push(version);
    return version;
  }

  async generateChangelog(versions?: VersionInfo[]): Promise<string> {
    const targetVersions = versions || [...this.versions].reverse();

    let changelog = '# Changelog\n\n';

    for (const version of targetVersions) {
      changelog += `## ${version.version} (${new Date(version.createdAt).toLocaleDateString()})\n\n`;
      changelog += `- **Type**: ${version.type === 'major' ? '重大变更' : version.type === 'minor' ? '新功能' : 'Bug修复'}\n`;
      changelog += `- **Branch**: ${version.branch}\n`;
      
      if (version.changes.length > 0) {
        changelog += `- **Changes**:\n`;
        for (const change of version.changes) {
          changelog += `  - ${change}\n`;
        }
      }
      
      changelog += '\n';
    }

    return changelog;
  }

  async getBranchStrategy(): Promise<{
    strategy: string;
    rules: string[];
    protectedBranches: string[];
  }> {
    return {
      strategy: 'Git Flow',
      rules: [
        'main 分支不允许直接 push，只能通过 PR',
        'feature/* 分支基于 develop 创建',
        'release/* 分支用于预发布测试',
        'hotfix/* 分支基于 main 创建，修复后合并回 main 和 develop'
      ],
      protectedBranches: ['main', 'develop']
    };
  }

  async getActiveBranches(): Promise<BranchInfo[]> {
    return this.branches.filter(b => b.status === 'active');
  }

  async getVersionHistory(): Promise<VersionInfo[]> {
    return [...this.versions].reverse();
  }
}
