export interface TestReportConfig {
  includeDetails: boolean;
  includeVisual: boolean;
  includeCodeCoverage: boolean;
  format: 'html' | 'markdown' | 'json' | 'junit';
}

export interface FullTestReport {
  id: string;
  timestamp: string;
  project: string;
  version: string;
  environment: string;
  functional: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    passRate: number;
    totalDuration: number;
  };
  visual?: {
    total: number;
    passed: number;
    failed: number;
    passRate: number;
  };
  coverage?: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  summary: string;
  details?: unknown;
}

export class ReportGenerationSkill {
  async generateFullReport(options: {
    projectName: string;
    version: string;
    environment: string;
    functionalResults: {
      total: number;
      passed: number;
      failed: number;
      skipped: number;
      totalDuration: number;
    };
    visualResults?: {
      total: number;
      passed: number;
      failed: number;
    };
    coverage?: {
      statements: number;
      branches: number;
      functions: number;
      lines: number;
    };
    format?: string;
  }): Promise<FullTestReport> {
    const functionalPassRate = options.functionalResults.total > 0
      ? options.functionalResults.passed / options.functionalResults.total
      : 0;

    let visualData;
    let visualPassRate = 0;
    
    if (options.visualResults) {
      visualPassRate = options.visualResults.total > 0
        ? options.visualResults.passed / options.visualResults.total
        : 0;
      visualData = {
        ...options.visualResults,
        passRate: visualPassRate
      };
    }

    let summary = '';
    
    if (options.functionalResults.failed === 0) {
      summary = 'All functional tests passed';
    } else {
      summary = options.functionalResults.failed + ' functional tests failed';
    }

    if (options.visualResults && options.visualResults.failed > 0) {
      summary += ', ' + options.visualResults.failed + ' visual regression tests failed';
    }

    return {
      id: 'REPORT-' + Date.now(),
      timestamp: new Date().toISOString(),
      project: options.projectName,
      version: options.version,
      environment: options.environment,
      functional: {
        ...options.functionalResults,
        passRate: functionalPassRate
      },
      visual: visualData,
      coverage: options.coverage,
      summary
    };
  }

  async exportAsHtml(report: FullTestReport): Promise<string> {
    const isPass = report.functional.failed === 0;
    const html = '<!DOCTYPE html>\n' +
'<html lang="en">\n' +
'<head>\n' +
'  <meta charset="UTF-8">\n' +
'  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
'  <title>' + report.project + ' - Test Report</title>\n' +
'  <style>\n' +
'    * { margin: 0; padding: 0; box-sizing: border-box; }\n' +
'    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; background: #f8fafc; }\n' +
'    .container { max-width: 1200px; margin: 0 auto; }\n' +
'    h1 { font-size: 24px; margin-bottom: 16px; color: #1e293b; }\n' +
'    .summary-card { background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }\n' +
'    .summary.pass { border-left: 4px solid #22c55e; }\n' +
'    .summary.fail { border-left: 4px solid #ef4444; }\n' +
'    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }\n' +
'    .stat { text-align: center; padding: 16px; background: #f1f5f9; border-radius: 8px; }\n' +
'    .stat-number { font-size: 32px; font-weight: bold; margin-bottom: 4px; }\n' +
'    .pass .stat-number { color: #22c55e; }\n' +
'    .fail .stat-number { color: #ef4444; }\n' +
'    .meta { color: #64748b; font-size: 14px; margin-bottom: 24px; }\n' +
'  </style>\n' +
'</head>\n' +
'<body>\n' +
'  <div class="container">\n' +
'    <h1>' + report.project + ' - Test Report</h1>\n' +
'    <div class="meta">\n' +
'      Version: ' + report.version + ' | Environment: ' + report.environment + ' | Generated: ' + new Date(report.timestamp).toLocaleString() + '\n' +
'    </div>\n' +
'    <div class="summary-card ' + (isPass ? 'pass' : 'fail') + '">\n' +
'      <h2>' + report.summary + '</h2>\n' +
'      <div class="stats">\n' +
'        <div class="stat">\n' +
'          <div class="stat-number">' + report.functional.total + '</div>\n' +
'          <div class="stat-label">Total</div>\n' +
'        </div>\n' +
'        <div class="stat pass">\n' +
'          <div class="stat-number">' + report.functional.passed + '</div>\n' +
'          <div class="stat-label">Passed</div>\n' +
'        </div>\n' +
'        <div class="stat fail">\n' +
'          <div class="stat-number">' + report.functional.failed + '</div>\n' +
'          <div class="stat-label">Failed</div>\n' +
'        </div>\n' +
'        <div class="stat">\n' +
'          <div class="stat-number">' + (report.functional.passRate * 100).toFixed(1) + '%</div>\n' +
'          <div class="stat-label">Pass Rate</div>\n' +
'        </div>\n' +
'      </div>\n' +
'    </div>\n' +
'  </div>\n' +
'</body>\n' +
'</html>';

    return html;
  }

  async exportAsMarkdown(report: FullTestReport): Promise<string> {
    let md = '# ' + report.project + ' - Test Report\n\n';
    md += '**Version**: ' + report.version + '\n';
    md += '**Environment**: ' + report.environment + '\n';
    md += '**Generated**: ' + new Date(report.timestamp).toLocaleString() + '\n\n';
    md += '## Summary\n\n' + report.summary + '\n\n';
    md += '## Functional Tests\n\n';
    md += '| Metric | Value |\n|--------|-------|\n';
    md += '| Total | ' + report.functional.total + ' |\n';
    md += '| Passed | ' + report.functional.passed + ' |\n';
    md += '| Failed | ' + report.functional.failed + ' |\n';
    md += '| Skipped | ' + report.functional.skipped + ' |\n';
    md += '| Pass Rate | ' + (report.functional.passRate * 100).toFixed(1) + '% |\n';
    md += '| Duration | ' + (report.functional.totalDuration / 1000).toFixed(2) + 's |\n\n';

    if (report.visual) {
      md += '## Visual Regression Tests\n\n';
      md += '| Metric | Value |\n|--------|-------|\n';
      md += '| Total | ' + report.visual.total + ' |\n';
      md += '| Passed | ' + report.visual.passed + ' |\n';
      md += '| Failed | ' + report.visual.failed + ' |\n';
      md += '| Pass Rate | ' + (report.visual.passRate * 100).toFixed(1) + '% |\n\n';
    }

    if (report.coverage) {
      md += '## Code Coverage\n\n';
      md += '| Metric | Coverage |\n|--------|----------|\n';
      md += '| Statements | ' + report.coverage.statements.toFixed(1) + '% |\n';
      md += '| Branches | ' + report.coverage.branches.toFixed(1) + '% |\n';
      md += '| Functions | ' + report.coverage.functions.toFixed(1) + '% |\n';
      md += '| Lines | ' + report.coverage.lines.toFixed(1) + '% |\n\n';
    }

    return md;
  }

  async exportAsJson(report: FullTestReport): Promise<string> {
    return JSON.stringify(report, null, 2);
  }
}
