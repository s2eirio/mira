export interface DocumentSyncItem {
  id: string;
  name: string;
  type: 'readme' | 'api-doc' | 'design-doc' | 'changelog' | 'architecture';
  source: string;
  target: string;
  lastSync?: string;
  status: 'synced' | 'outdated' | 'conflict';
}

export interface SyncResult {
  total: number;
  synced: number;
  skipped: number;
  failed: number;
  updatedDocs: DocumentSyncItem[];
  summary: string;
}

export class DocSyncSkill {
  private documents: DocumentSyncItem[] = [
    {
      id: 'doc-001',
      name: 'README',
      type: 'readme',
      source: 'docs/README.md',
      target: 'README.md',
      status: 'synced'
    },
    {
      id: 'doc-002',
      name: 'API 文档',
      type: 'api-doc',
      source: 'docs/api.md',
      target: 'API.md',
      status: 'outdated'
    },
    {
      id: 'doc-003',
      name: '设计文档',
      type: 'design-doc',
      source: 'docs/design.md',
      target: 'DESIGN.md',
      status: 'synced'
    },
    {
      id: 'doc-004',
      name: '变更日志',
      type: 'changelog',
      source: 'docs/CHANGELOG.md',
      target: 'CHANGELOG.md',
      status: 'outdated'
    },
    {
      id: 'doc-005',
      name: '架构文档',
      type: 'architecture',
      source: 'docs/architecture.md',
      target: 'ARCHITECTURE.md',
      status: 'synced'
    }
  ];

  async getAllDocs(): Promise<DocumentSyncItem[]> {
    return this.documents;
  }

  async getOutdatedDocs(): Promise<DocumentSyncItem[]> {
    return this.documents.filter(d => d.status === 'outdated');
  }

  async syncAll(): Promise<SyncResult> {
    const updatedDocs: DocumentSyncItem[] = [];
    let skipped = 0;
    let failed = 0;

    for (const doc of this.documents) {
      if (doc.status === 'synced') {
        skipped++;
        continue;
      }

      if (doc.status === 'conflict') {
        failed++;
        continue;
      }

      doc.status = 'synced';
      doc.lastSync = new Date().toISOString();
      updatedDocs.push(doc);
    }

    const synced = updatedDocs.length;
    const summary = synced > 0
      ? `✅ 已同步 ${synced} 个文档，跳过 ${skipped} 个，失败 ${failed} 个`
      : '所有文档已是最新';

    return {
      total: this.documents.length,
      synced,
      skipped,
      failed,
      updatedDocs,
      summary
    };
  }

  async syncDoc(docId: string): Promise<{
    success: boolean;
    doc?: DocumentSyncItem;
    message: string;
  }> {
    const doc = this.documents.find(d => d.id === docId);
    
    if (!doc) {
      return { success: false, message: `找不到文档: ${docId}` };
    }

    if (doc.status === 'conflict') {
      return { success: false, message: '文档存在冲突，请手动解决' };
    }

    doc.status = 'synced';
    doc.lastSync = new Date().toISOString();

    return {
      success: true,
      doc,
      message: `${doc.name} 同步成功`
    };
  }

  async generateDocTemplate(docType: DocumentSyncItem['type']): Promise<string> {
    switch (docType) {
      case 'readme':
        return this.generateReadmeTemplate();
      case 'api-doc':
        return this.generateApiDocTemplate();
      case 'design-doc':
        return this.generateDesignDocTemplate();
      case 'changelog':
        return this.generateChangelogTemplate();
      case 'architecture':
        return this.generateArchitectureTemplate();
      default:
        return '';
    }
  }

  private generateReadmeTemplate(): string {
    return `# 项目名称

## 简介

项目简介...

## 功能特性

- 功能 1
- 功能 2
- 功能 3

## 快速开始

\`\`\`bash
npm install
npm run dev
\`\`\`

## 使用说明

...

## 贡献指南

...

## 许可证

MIT
`;
  }

  private generateApiDocTemplate(): string {
    return `# API 文档

## 基础信息

- Base URL: /api/v1
- 认证: Bearer Token

## 接口列表

### 1. 获取用户信息

\`\`\`
GET /users/:id
\`\`\`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 用户 ID |

**响应示例**

\`\`\`json
{
  "id": "1",
  "name": "示例用户"
}
\`\`\`
`;
  }

  private generateDesignDocTemplate(): string {
    return `# 设计文档

## 设计目标

...

## 设计规范

### 颜色方案

- 主色: #6366f1
- 辅助色: #f472b6

### 排版

- 标题: 24px, Bold
- 正文: 16px, Regular

## 组件设计

### Button

状态: idle, hover, active, loading, success, error

## 页面布局

...
`;
  }

  private generateChangelogTemplate(): string {
    return `# Changelog

## [1.0.0] - 2024-01-01

### Added

- 新功能 1
- 新功能 2

### Fixed

- 修复 Bug 1

### Changed

- 变更 1
`;
  }

  private generateArchitectureTemplate(): string {
    return `# 架构文档

## 系统架构

...

## 模块划分

### 模块 A

职责: ...

### 模块 B

职责: ...

## 数据流

...

## 技术栈

- 前端: React + TypeScript
- 后端: Node.js + Express
- 数据库: PostgreSQL
`;
  }

  async checkDocCoverage(): Promise<{
    total: number;
    existing: number;
    missing: string[];
    coverage: number;
  }> {
    const requiredDocs = ['readme', 'api-doc', 'changelog'];
    const existing = this.documents.filter(d => requiredDocs.includes(d.type)).length;
    const missing = requiredDocs.filter(type => 
      !this.documents.some(d => d.type === type)
    );

    return {
      total: requiredDocs.length,
      existing,
      missing,
      coverage: Math.round((existing / requiredDocs.length) * 100)
    };
  }
}
