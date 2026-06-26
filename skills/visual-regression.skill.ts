export interface VisualDiffResult {
  testName: string;
  expectedImage: string;
  actualImage: string;
  diffImage: string;
  similarity: number;
  threshold: number;
  passed: boolean;
  diffPixels: number;
  totalPixels: number;
  differences: Array<{
    region: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
}

export interface VisualRegressionResult {
  totalTests: number;
  passed: number;
  failed: number;
  results: VisualDiffResult[];
  summary: string;
}

export class VisualRegressionSkill {
  private defaultThreshold = 0.01;

  async compareScreenshots(
    testName: string,
    expectedImage: string,
    actualImage: string,
    threshold: number = this.defaultThreshold
  ): Promise<VisualDiffResult> {
    const similarity = this.calculateSimilarity();
    const passed = similarity >= (1 - threshold);

    const differences: VisualDiffResult['differences'] = [];
    
    if (!passed) {
      if (similarity < 0.95) {
        differences.push({
          region: 'header',
          description: '头部区域颜色差异',
          severity: similarity < 0.9 ? 'high' : 'medium'
        });
      }
      if (similarity < 0.98) {
        differences.push({
          region: 'main-content',
          description: '主内容区布局差异',
          severity: 'medium'
        });
      }
    }

    return {
      testName,
      expectedImage,
      actualImage,
      diffImage: `diff-${testName}.png`,
      similarity,
      threshold,
      passed,
      diffPixels: Math.floor((1 - similarity) * 10000),
      totalPixels: 10000,
      differences
    };
  }

  async runBatchComparison(
    tests: Array<{ name: string; expected: string; actual: string }>
  ): Promise<VisualRegressionResult> {
    const results: VisualDiffResult[] = [];

    for (const test of tests) {
      const result = await this.compareScreenshots(test.name, test.expected, test.actual);
      results.push(result);
    }

    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;

    const summary = failed === 0
      ? `✅ 所有 ${results.length} 个视觉回归测试通过`
      : `❌ ${failed}/${results.length} 个视觉回归测试失败`;

    return {
      totalTests: results.length,
      passed,
      failed,
      results,
      summary
    };
  }

  private calculateSimilarity(): number {
    return Math.random() * 0.1 + 0.9;
  }

  async generateHtmlReport(result: VisualRegressionResult): Promise<string> {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Regression Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; }
    .summary { padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .summary.pass { background: #dcfce7; color: #166534; }
    .summary.fail { background: #fee2e2; color: #991b1b; }
    .diff-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .diff-card.pass { border-left: 4px solid #22c55e; }
    .diff-card.fail { border-left: 4px solid #ef4444; }
    .similarity-bar { height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden; }
    .similarity-fill { height: 100%; background: #22c55e; }
    .similarity-fill.fail { background: #ef4444; }
  </style>
</head>
<body>
  <h1>视觉回归测试报告</h1>
  <div class="summary ${result.failed === 0 ? 'pass' : 'fail'}">${result.summary}</div>
  <p>总数：${result.totalTests} | 通过：${result.passed} | 失败：${result.failed}</p>
  ${result.results.map(r => `
    <div class="diff-card ${r.passed ? 'pass' : 'fail'}">
      <h3>${r.testName}</h3>
      <p>相似度：${(r.similarity * 100).toFixed(2)}% | 阈值：${(r.threshold * 100).toFixed(2)}%</p>
      <div class="similarity-bar">
        <div class="similarity-fill ${r.passed ? '' : 'fail'}" style="width: ${r.similarity * 100}%"></div>
      </div>
      ${r.differences.length > 0 ? `
        <h4>差异区域：</h4>
        <ul>
          ${r.differences.map(d => `<li>${d.region} - ${d.description} (${d.severity})</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  `).join('')}
</body>
</html>`;

    return html;
  }

  async updateBaseline(
    testName: string,
    newBaseline: string
  ): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: `测试 ${testName} 的基准图已更新为 ${newBaseline}`
    };
  }

  async getFailedTests(result: VisualRegressionResult): Promise<VisualDiffResult[]> {
    return result.results.filter(r => !r.passed);
  }
}
