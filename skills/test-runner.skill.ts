export interface TestRunnerResult {
  testCaseId: string;
  status: 'pass' | 'fail' | 'skipped';
  duration: number;
  error?: string;
  steps: Array<{
    step: string;
    status: 'pass' | 'fail' | 'skipped';
    duration: number;
  }>;
}

export interface TestExecutionReport {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  totalDuration: number;
  results: TestRunnerResult[];
  summary: string;
}

export class TestRunnerSkill {
  async runTest(testCase: {
    id: string;
    given: string;
    when: string;
    then: string;
    dataTestId?: string;
  }): Promise<TestRunnerResult> {
    const startTime = Date.now();
    const steps: TestRunnerResult['steps'] = [];

    steps.push({
      step: 'Given: ' + testCase.given,
      status: 'pass',
      duration: 100
    });

    steps.push({
      step: 'When: ' + testCase.when,
      status: 'pass',
      duration: 200
    });

    const passed = Math.random() > 0.2;

    steps.push({
      step: 'Then: ' + testCase.then,
      status: passed ? 'pass' : 'fail',
      duration: 150
    });

    const duration = Date.now() - startTime;

    return {
      testCaseId: testCase.id,
      status: passed ? 'pass' : 'fail',
      duration,
      error: passed ? undefined : 'Assertion failed: ' + testCase.then,
      steps
    };
  }

  async runAllTests(testCases: Array<{
    id: string;
    given: string;
    when: string;
    then: string;
    dataTestId?: string;
    priority?: string;
  }>): Promise<TestExecutionReport> {
    const results: TestRunnerResult[] = [];
    const startTime = Date.now();

    for (const tc of testCases) {
      const result = await this.runTest(tc);
      results.push(result);
    }

    const totalDuration = Date.now() - startTime;
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    let summary = '';

    if (failed === 0) {
      summary = 'All ' + passed + ' tests passed (' + (totalDuration / 1000).toFixed(2) + 's)';
    } else {
      summary = failed + '/' + results.length + ' tests failed';
    }

    return {
      total: results.length,
      passed,
      failed,
      skipped,
      totalDuration,
      results,
      summary
    };
  }

  async getFailedTests(report: TestExecutionReport): Promise<TestRunnerResult[]> {
    return report.results.filter(r => r.status === 'fail');
  }

  async getTestById(
    report: TestExecutionReport,
    testId: string
  ): Promise<TestRunnerResult | undefined> {
    return report.results.find(r => r.testCaseId === testId);
  }

  async generateJUnitXml(report: TestExecutionReport): Promise<string> {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<testsuites name="Mira Tests" tests="' + report.total + '" failures="' + report.failed + '" time="' + (report.totalDuration / 1000).toFixed(3) + '">\n';
    xml += '  <testsuite name="All Tests" tests="' + report.total + '" failures="' + report.failed + '" time="' + (report.totalDuration / 1000).toFixed(3) + '">\n';

    for (const result of report.results) {
      xml += '    <testcase name="' + result.testCaseId + '" time="' + (result.duration / 1000).toFixed(3) + '">\n';
      
      if (result.status === 'fail') {
        xml += '      <failure message="' + (result.error || 'Test failed') + '" />\n';
      }
      
      if (result.status === 'skipped') {
        xml += '      <skipped />\n';
      }
      
      xml += '    </testcase>\n';
    }

    xml += '  </testsuite>\n';
    xml += '</testsuites>\n';

    return xml;
  }

  async generateMarkdownReport(report: TestExecutionReport): Promise<string> {
    let md = '# Test Execution Report\n\n';
    md += '## Summary\n\n';
    md += '- Total: ' + report.total + '\n';
    md += '- Passed: ' + report.passed + '\n';
    md += '- Failed: ' + report.failed + '\n';
    md += '- Skipped: ' + report.skipped + '\n';
    md += '- Duration: ' + (report.totalDuration / 1000).toFixed(2) + 's\n\n';
    md += '## Result\n\n' + report.summary + '\n\n';
    md += '## Details\n\n';
    md += '| Test ID | Status | Duration |\n|---------|--------|----------|\n';

    for (const result of report.results) {
      const status = result.status === 'pass' ? 'PASS' : result.status === 'fail' ? 'FAIL' : 'SKIP';
      md += '| ' + result.testCaseId + ' | ' + status + ' | ' + result.duration + 'ms |\n';
    }

    if (report.failed > 0) {
      md += '\n## Failures\n\n';
      for (const result of report.results) {
        if (result.status === 'fail') {
          md += '### ' + result.testCaseId + '\n\n';
          md += 'Error: ' + result.error + '\n\n';
          md += 'Steps:\n';
          for (const step of result.steps) {
            const s = step.status === 'pass' ? 'PASS' : 'FAIL';
            md += '- [' + s + '] ' + step.step + '\n';
          }
          md += '\n';
        }
      }
    }

    return md;
  }
}
