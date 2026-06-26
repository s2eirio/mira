export interface VersionInferenceResult {
  currentVersion: string;
  nextVersion: string;
  versionType: 'major' | 'minor' | 'patch';
  reason: string;
  changeLogEntry: string;
}

export class VersionInferenceSkill {
  private majorKeywords = ['破坏性', '重写', '主色', '架构', '重构', '全新'];
  private minorKeywords = ['新功能', '新增', 'feature', '模块', '页面'];
  private patchKeywords = ['修复', 'bug', '优化', '调整', '改进'];

  async inferVersion(
    changeDescription: string,
    currentVersion: string = '1.0.0'
  ): Promise<VersionInferenceResult> {
    const lowerDesc = changeDescription.toLowerCase();
    let versionType: 'major' | 'minor' | 'patch' = 'patch';
    let reason = 'Bug修复或微小改进';

    for (const keyword of this.majorKeywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        versionType = 'major';
        reason = '破坏性变更或重大设计变更';
        break;
      }
    }

    if (versionType === 'patch') {
      for (const keyword of this.minorKeywords) {
        if (lowerDesc.includes(keyword.toLowerCase())) {
          versionType = 'minor';
          reason = '新增功能';
          break;
        }
      }
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

    const changeLogEntry = await this.generateChangeLogEntry(nextVersion, versionType, changeDescription);

    return {
      currentVersion,
      nextVersion,
      versionType,
      reason,
      changeLogEntry
    };
  }

  async generateChangeLogEntry(
    version: string,
    type: 'major' | 'minor' | 'patch',
    changes: string
  ): Promise<string> {
    const typeLabel = type === 'major' ? '重大变更' : type === 'minor' ? '新功能' : 'Bug修复';
    
    return `## ${version}\n\n**类型**: ${typeLabel}\n\n**变更**: ${changes}\n`;
  }

  async validateVersionFormat(version: string): Promise<{
    valid: boolean;
    message: string;
  }> {
    const regex = /^(\d+)\.(\d+)\.(\d+)$/;
    
    if (!regex.test(version)) {
      return { valid: false, message: '版本格式应为 x.y.z（如 1.0.0）' };
    }

    const [, major, minor, patch] = version.match(regex) || [];
    
    if (parseInt(major) < 0 || parseInt(minor) < 0 || parseInt(patch) < 0) {
      return { valid: false, message: '版本号不能为负数' };
    }

    return { valid: true, message: '版本格式正确' };
  }
}
