export interface ChangelogEntry {
  version: string;
  date: string;
  type: 'major' | 'minor' | 'patch';
  changes: string[];
}

export interface ChangelogGenerationResult {
  content: string;
  entries: ChangelogEntry[];
}

export class ChangelogGenerationSkill {
  async generate(entries: ChangelogEntry[]): Promise<ChangelogGenerationResult> {
    const sortedEntries = [...entries].sort((a, b) => {
      const va = a.version.split('.').map(Number);
      const vb = b.version.split('.').map(Number);
      
      for (let i = 0; i < 3; i++) {
        if (va[i] !== vb[i]) return vb[i] - va[i];
      }
      return 0;
    });

    let content = '# Changelog\n\n';
    content += 'All notable changes to this project will be documented in this file.\n\n';

    for (const entry of sortedEntries) {
      const typeLabel = entry.type === 'major' ? '重大变更' : entry.type === 'minor' ? '新功能' : 'Bug修复';
      
      content += `## ${entry.version} (${entry.date})\n\n`;
      content += `- **类型**: ${typeLabel}\n`;
      
      if (entry.changes.length > 0) {
        content += `- **变更**:\n`;
        for (const change of entry.changes) {
          content += `  - ${change}\n`;
        }
      }
      
      content += '\n';
    }

    return { content, entries: sortedEntries };
  }

  async generateFromCommits(commits: Array<{
    hash: string;
    message: string;
    date: string;
  }>): Promise<ChangelogGenerationResult> {
    const entries: ChangelogEntry[] = [];
    const versionMap: Record<string, ChangelogEntry> = {};

    for (const commit of commits) {
      let version = '1.0.0';
      let type: 'major' | 'minor' | 'patch' = 'patch';

      if (commit.message.includes('feat:')) {
        type = 'minor';
      } else if (commit.message.includes('fix:')) {
        type = 'patch';
      } else if (commit.message.includes('refactor:') || commit.message.includes('BREAKING')) {
        type = 'major';
      }

      if (!versionMap[version]) {
        versionMap[version] = {
          version,
          date: commit.date,
          type,
          changes: []
        };
      }

      versionMap[version].changes.push(commit.message.replace(/^(feat|fix|refactor|chore):\s*/, ''));
    }

    entries.push(...Object.values(versionMap));
    return this.generate(entries);
  }

  async appendEntry(
    existingChangelog: string,
    newEntry: ChangelogEntry
  ): Promise<string> {
    const lines = existingChangelog.split('\n');
    const firstHeaderIndex = lines.findIndex(line => line.startsWith('## '));
    
    const typeLabel = newEntry.type === 'major' ? '重大变更' : newEntry.type === 'minor' ? '新功能' : 'Bug修复';
    
    let newContent = `## ${newEntry.version} (${newEntry.date})\n\n` +
      `- **类型**: ${typeLabel}\n` +
      `- **变更**:\n`;
    
    for (const change of newEntry.changes) {
      newContent += `  - ${change}\n`;
    }
    
    newContent += '\n';

    if (firstHeaderIndex !== -1) {
      lines.splice(firstHeaderIndex, 0, newContent);
    } else {
      lines.push('\n', newContent);
    }

    return lines.join('\n');
  }
}
