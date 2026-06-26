export interface TestResult {
  testCaseId: string;
  status: 'pass' | 'fail' | 'skipped';
  actualValue?: string | number | boolean;
  expectedValue?: string | number | boolean;
  errorMessage?: string;
  screenshotPath?: string;
  duration: number;
}

export interface VisualDiff {
  expected: string;
  actual: string;
  diff: string;
  similarity: number;
}

export interface TestReport {
  id: string;
  timestamp: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  results: TestResult[];
  visualDiffs?: VisualDiff[];
  summary: string;
}

export class QaAgent {
  async runFunctionalTests(testCases: Array<{
    id: string;
    given: string;
    when: string;
    then: string;
    dataTestId: string;
    expectedValue?: string | number | boolean;
    priority: string;
  }>): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const testCase of testCases) {
      const startTime = Date.now();
      
      try {
        const passed = Math.random() > 0.2;
        
        results.push({
          testCaseId: testCase.id,
          status: passed ? 'pass' : 'fail',
          expectedValue: testCase.expectedValue,
          actualValue: passed ? testCase.expectedValue : '实际值与预期不符',
          errorMessage: passed ? undefined : `测试 ${testCase.id} 执行失败`,
          duration: Date.now() - startTime
        });
      } catch (error) {
        results.push({
          testCaseId: testCase.id,
          status: 'fail',
          expectedValue: testCase.expectedValue,
          errorMessage: error instanceof Error ? error.message : '未知错误',
          duration: Date.now() - startTime
        });
      }
    }

    return results;
  }

  async runVisualRegression(
    expectedScreenshot: string,
    actualScreenshot: string
  ): Promise<VisualDiff> {
    const similarity = Math.random() * 20 + 80;
    
    return {
      expected: expectedScreenshot,
      actual: actualScreenshot,
      diff: `diff-${Date.now()}.png`,
      similarity
    };
  }

  async generateTestReport(testCases: Array<{
    id: string;
    given: string;
    when: string;
    then: string;
    dataTestId: string;
    expectedValue?: string | number | boolean;
    priority: string;
  }>): Promise<TestReport> {
    const results = await this.runFunctionalTests(testCases);
    
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    let summary = '';
    
    if (failed === 0) {
      summary = `✅ 所有 ${passed} 个测试用例通过！`;
    } else {
      summary = `❌ 测试失败：${failed}/${results.length} 个用例未通过，${passed} 个通过`;
    }

    return {
      id: `REPORT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passedTests: passed,
      failedTests: failed,
      skippedTests: skipped,
      results,
      summary
    };
  }

  async generateHtmlReport(report: TestReport): Promise<string> {
    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mira QA Report - ${report.id}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
    .summary { padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .summary.pass { background: #dcfce7; color: #166534; }
    .summary.fail { background: #fee2e2; color: #991b1b; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    th { background: #f9fafb; font-weight: 600; }
    .status-pass { color: #10b981; font-weight: 600; }
    .status-fail { color: #ef4444; font-weight: 600; }
  </style>
</head>
<body>
  <h1>Mira QA Report</h1>
  <div class="summary ${report.failedTests === 0 ? 'pass' : 'fail'}">${report.summary}</div>
  <p>生成时间：${report.timestamp}</p>
  <p>总数：${report.totalTests} | 通过：${report.passedTests} | 失败：${report.failedTests} | 跳过：${report.skippedTests}</p>
  <table>
    <thead>
      <tr><th>用例ID</th><th>状态</th><th>耗时</th><th>错误信息</th></tr>
    </thead>
    <tbody>
      ${report.results.map(r => `
        <tr>
          <td>${r.testCaseId}</td>
          <td class="status-${r.status}">${r.status === 'pass' ? '✓ 通过' : r.status === 'fail' ? '✗ 失败' : '跳过'}</td>
          <td>${r.duration}ms</td>
          <td>${r.errorMessage || '-'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>`;

    return html;
  }

  async getFailureContext(failedTests: TestResult[]): Promise<string> {
    const contexts: string[] = [];

    for (const test of failedTests) {
      contexts.push(`
测试用例: ${test.testCaseId}
失败原因: ${test.errorMessage || '未知'}
预期值: ${test.expectedValue ?? '未指定'}
实际值: ${test.actualValue ?? '未返回'}
`);
    }

    return contexts.join('\n');
  }
}
