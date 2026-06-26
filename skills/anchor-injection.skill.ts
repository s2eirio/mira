export interface AnchorPoint {
  id: string;
  type: 'data-testid' | 'css-selector' | 'xpath' | 'aria-label';
  value: string;
  description: string;
  component: string;
  page: string;
}

export interface AnchorInjectionResult {
  originalCode: string;
  modifiedCode: string;
  injectedAnchors: AnchorPoint[];
  skippedAnchors: AnchorPoint[];
  summary: string;
}

export class AnchorInjectionSkill {
  injectReactComponent(
    sourceCode: string,
    anchors: AnchorPoint[]
  ): AnchorInjectionResult {
    let modifiedCode = sourceCode;
    const injected: AnchorPoint[] = [];
    const skipped: AnchorPoint[] = [];

    for (const anchor of anchors) {
      let injectedFlag = false;

      if (anchor.type === 'data-testid') {
        const tagRegex = /<([a-zA-Z][a-zA-Z0-9]*)([^>]*?)>/g;
        let match: RegExpExecArray | null;
        
        while ((match = tagRegex.exec(sourceCode)) !== null) {
          const tag = match[1];
          const attrs = match[2];
          
          if (attrs.includes(anchor.description) || attrs.includes(anchor.component)) {
            if (!attrs.includes('data-testid')) {
              const newAttrs = attrs + ` data-testid="${anchor.value}"`;
              modifiedCode = modifiedCode.replace(
                match[0],
                `<${tag}${newAttrs}>`
              );
              injected.push(anchor);
              injectedFlag = true;
            } else {
              skipped.push(anchor);
              injectedFlag = true;
            }
            break;
          }
        }
      }

      if (!injectedFlag) {
        skipped.push(anchor);
      }
    }

    const summary = `注入 ${injected.length} 个锚点，跳过 ${skipped.length} 个锚点`;

    return {
      originalCode: sourceCode,
      modifiedCode,
      injectedAnchors: injected,
      skippedAnchors: skipped,
      summary
    };
  }

  generateAnchorsFromTestCases(
    testCases: Array<{
      id: string;
      dataTestId?: string;
      given: string;
      when: string;
      then: string;
    }>,
    componentName: string
  ): AnchorPoint[] {
    const anchors: AnchorPoint[] = [];

    for (const tc of testCases) {
      if (tc.dataTestId) {
        anchors.push({
          id: `anchor-${tc.id}`,
          type: 'data-testid',
          value: tc.dataTestId,
          description: `${tc.given} - ${tc.then}`,
          component: componentName,
          page: 'default'
        });
      }
    }

    return anchors;
  }

  extractAnchorsFromCode(sourceCode: string): AnchorPoint[] {
    const anchors: AnchorPoint[] = [];
    
    const dataTestIdRegex = /data-testid="([^"]+)"/g;
    let match: RegExpExecArray | null;

    while ((match = dataTestIdRegex.exec(sourceCode)) !== null) {
      anchors.push({
        id: `anchor-${anchors.length + 1}`,
        type: 'data-testid',
        value: match[1],
        description: '从代码中提取',
        component: 'unknown',
        page: 'default'
      });
    }

    const ariaLabelRegex = /aria-label="([^"]+)"/g;
    
    while ((match = ariaLabelRegex.exec(sourceCode)) !== null) {
      anchors.push({
        id: `anchor-${anchors.length + 1}`,
        type: 'aria-label',
        value: match[1],
        description: '从代码中提取',
        component: 'unknown',
        page: 'default'
      });
    }

    return anchors;
  }

  validateAnchors(
    sourceCode: string,
    anchors: AnchorPoint[]
  ): {
    valid: AnchorPoint[];
    invalid: Array<{ anchor: AnchorPoint; reason: string }>;
  } {
    const valid: AnchorPoint[] = [];
    const invalid: Array<{ anchor: AnchorPoint; reason: string }> = [];

    for (const anchor of anchors) {
      if (anchor.type === 'data-testid') {
        const regex = new RegExp(`data-testid="${anchor.value}"`);
        if (regex.test(sourceCode)) {
          valid.push(anchor);
        } else {
          invalid.push({ anchor, reason: '代码中未找到 data-testid' });
        }
      } else if (anchor.type === 'aria-label') {
        const regex = new RegExp(`aria-label="${anchor.value}"`);
        if (regex.test(sourceCode)) {
          valid.push(anchor);
        } else {
          invalid.push({ anchor, reason: '代码中未找到 aria-label' });
        }
      } else {
        invalid.push({ anchor, reason: `不支持的锚点类型: ${anchor.type}` });
      }
    }

    return { valid, invalid };
  }

  generateAnchorReport(anchors: AnchorPoint[]): string {
    let report = '# 测试锚点报告\n\n';
    report += `共 ${anchors.length} 个锚点\n\n`;
    
    const byType: Record<string, AnchorPoint[]> = {};
    for (const anchor of anchors) {
      if (!byType[anchor.type]) {
        byType[anchor.type] = [];
      }
      byType[anchor.type].push(anchor);
    }

    for (const [type, typeAnchors] of Object.entries(byType)) {
      report += `## ${type} (${typeAnchors.length} 个)\n\n`;
      report += '| ID | 值 | 组件 | 描述 |\n';
      report += '|----|----|------|------|\n';
      for (const a of typeAnchors) {
        report += `| ${a.id} | \`${a.value}\` | ${a.component} | ${a.description} |\n`;
      }
      report += '\n';
    }

    return report;
  }
}
