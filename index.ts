import { OrchestratorAgent } from './agents/orchestrator.agent';
import { DesignAgent } from './agents/design.agent';
import { DevAgent } from './agents/dev.agent';
import { QaAgent } from './agents/qa.agent';
import { OpsAgent } from './agents/ops.agent';
import { PlatformAgent } from './agents/platform.agent';

export class Mira {
  private orchestrator: OrchestratorAgent;
  private designAgent: DesignAgent;
  private devAgent: DevAgent;
  private qaAgent: QaAgent;
  private opsAgent: OpsAgent;
  private platformAgent: PlatformAgent;

  constructor() {
    this.orchestrator = new OrchestratorAgent({ maxIterations: 50, timeout: 300000 });
    this.designAgent = new DesignAgent();
    this.devAgent = new DevAgent();
    this.qaAgent = new QaAgent();
    this.opsAgent = new OpsAgent();
    this.platformAgent = new PlatformAgent();
  }

  async runWorkflow(requirement: string): Promise<{
    success: boolean;
    artifacts: Record<string, unknown>;
    summary: string;
  }> {
    console.log(`🚀 Mira 开始处理需求: ${requirement}`);

    const platformDecision = await this.platformAgent.makeDecision(requirement);
    
    if (platformDecision.platforms.length === 0) {
      return {
        success: false,
        artifacts: {},
        summary: '平台需求不明确，请先回答澄清问题'
      };
    }

    console.log(`📋 平台决策完成: ${platformDecision.platforms.map(p => p.platform).join(', ')}`);

    const parsed = await this.orchestrator.parseRequirement(requirement);
    const designTokens = await this.designAgent.generateDesignTokens(parsed.designConstraints);
    
    console.log(`🎨 设计令牌生成完成`);

    const testCases = await this.devAgent.generateGwtTestCases(requirement);
    
    console.log(`🧪 测试用例生成完成: ${testCases.length} 个`);

    const component = await this.devAgent.generateReactComponent(
      'MainComponent',
      testCases,
      designTokens as unknown as Record<string, unknown>
    );
    
    console.log(`💻 代码生成完成: ${component.name}`);

    const testReport = await this.qaAgent.generateTestReport(testCases);
    
    console.log(`✅ 测试报告生成完成`);

    const version = await this.opsAgent.createVersion('新功能', 'main', [requirement]);
    
    console.log(`📦 版本创建完成: ${version.version}`);

    return {
      success: true,
      artifacts: {
        platformDecision,
        designTokens,
        testCases,
        component,
        testReport,
        version
      },
      summary: `Mira 工作流执行完成！\n平台: ${platformDecision.platforms.map(p => p.platform).join(', ')}\n测试用例: ${testCases.length} 个\n代码文件: ${component.name}\n测试报告: ${testReport.summary}\n版本: ${version.version}`
    };
  }

  getAgent(agentName: string) {
    const agents: Record<string, unknown> = {
      orchestrator: this.orchestrator,
      design: this.designAgent,
      dev: this.devAgent,
      qa: this.qaAgent,
      ops: this.opsAgent,
      platform: this.platformAgent
    };
    
    return agents[agentName];
  }
}

export {
  OrchestratorAgent,
  DesignAgent,
  DevAgent,
  QaAgent,
  OpsAgent,
  PlatformAgent
};
