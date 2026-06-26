export interface VersionLockConfig {
  currentVersion: string;
  locked: boolean;
  lockReason: string;
  lockedAt?: string;
  lockedBy?: string;
  allowedChanges: string[];
  blockedChanges: string[];
}

export interface VersionLockResult {
  success: boolean;
  message: string;
  config: VersionLockConfig;
}

export class VersionLockSkill {
  private lockConfig: VersionLockConfig = {
    currentVersion: '1.0.0',
    locked: false,
    lockReason: '',
    allowedChanges: ['bugfix', 'security', 'patch'],
    blockedChanges: ['feature', 'refactor', 'breaking']
  };

  async lock(
    version: string,
    reason: string,
    lockedBy: string = 'system'
  ): Promise<VersionLockResult> {
    if (this.lockConfig.locked) {
      return {
        success: false,
        message: `版本已锁定（${this.lockConfig.currentVersion}），原因：${this.lockConfig.lockReason}`,
        config: this.lockConfig
      };
    }

    this.lockConfig = {
      currentVersion: version,
      locked: true,
      lockReason: reason,
      lockedAt: new Date().toISOString(),
      lockedBy,
      allowedChanges: ['bugfix', 'security', 'patch'],
      blockedChanges: ['feature', 'refactor', 'breaking']
    };

    return {
      success: true,
      message: `版本 ${version} 已锁定，原因：${reason}`,
      config: this.lockConfig
    };
  }

  async unlock(reason: string): Promise<VersionLockResult> {
    if (!this.lockConfig.locked) {
      return {
        success: false,
        message: '当前版本未锁定',
        config: this.lockConfig
      };
    }

    const previousVersion = this.lockConfig.currentVersion;
    this.lockConfig.locked = false;
    this.lockConfig.lockReason = '';

    return {
      success: true,
      message: `版本 ${previousVersion} 已解锁，原因：${reason}`,
      config: this.lockConfig
    };
  }

  async isLocked(): Promise<boolean> {
    return this.lockConfig.locked;
  }

  async canPerformChange(changeType: string): Promise<{
    allowed: boolean;
    reason: string;
  }> {
    if (!this.lockConfig.locked) {
      return { allowed: true, reason: '版本未锁定，允许所有变更' };
    }

    const normalizedType = changeType.toLowerCase();

    if (this.lockConfig.allowedChanges.some(c => normalizedType.includes(c))) {
      return { allowed: true, reason: '变更类型在允许列表中' };
    }

    if (this.lockConfig.blockedChanges.some(c => normalizedType.includes(c))) {
      return {
        allowed: false,
        reason: `版本已锁定（${this.lockConfig.currentVersion}），${changeType}类型变更被禁止`
      };
    }

    return {
      allowed: false,
      reason: `版本已锁定（${this.lockConfig.currentVersion}），请先解锁版本`
    };
  }

  async getLockStatus(): Promise<VersionLockConfig> {
    return { ...this.lockConfig };
  }

  async checkAndWarn(changeType: string): Promise<string | null> {
    const { allowed, reason } = await this.canPerformChange(changeType);
    
    if (!allowed) {
      return `⚠️  ${reason}\n建议：\n1. 如果是紧急修复，请确认变更类型为 bugfix/security/patch\n2. 如果是新功能，请先解锁版本：versionLock.unlock('reason')\n3. 确认是否需要创建新分支进行开发`;
    }

    return null;
  }
}
