export interface OrchestratorAgentConfig {
  maxIterations: number;
  timeout: number;
}

export interface TaskAssignment {
  agent: string;
  task: string;
  context: Record<string, unknown>;
}

export interface ConflictResolution {
  decision: string;
  reason: string;
  affectedAgents: string[];
}

export class OrchestratorAgent {
  private config: OrchestratorAgentConfig;
  private currentTask: string | null = null;
  private sharedState: Record<string, unknown> = {};

  constructor(config: OrchestratorAgentConfig) {
    this.config = config;
  }

  async parseRequirement(requirement: string): Promise<{
    designConstraints: string[];
    functionalRequirements: string[];
    platformHints: string[];
  }> {
    const designKeywords = ['高级感', '年轻化', '极简', '清爽', '现代', '毛玻璃', '渐变', '暗色'];
    const platformKeywords = ['web', '小程序', 'pc', '桌面', 'app', '移动端', 'ios', 'android'];

    const designConstraints = designKeywords.filter(keyword => 
      requirement.toLowerCase().includes(keyword.toLowerCase())
    );

    const platformHints = platformKeywords.filter(keyword => 
      requirement.toLowerCase().includes(keyword.toLowerCase())
    );

    const functionalRequirements = [requirement];

    return { designConstraints, functionalRequirements, platformHints };
  }

  async assignTask(task: string, context: Record<string, unknown>): Promise<TaskAssignment> {
    this.currentTask = task;

    if (task.includes('设计') || task.includes('颜色') || task.includes('布局')) {
      return { agent: 'design', task, context };
    }

    if (task.includes('代码') || task.includes('组件') || task.includes('实现')) {
      return { agent: 'dev', task, context };
    }

    if (task.includes('测试') || task.includes('验收') || task.includes('回归')) {
      return { agent: 'qa', task, context };
    }

    if (task.includes('分支') || task.includes('版本') || task.includes('部署')) {
      return { agent: 'ops', task, context };
    }

    if (task.includes('平台') || task.includes('技术栈')) {
      return { agent: 'platform', task, context };
    }

    return { agent: 'dev', task, context };
  }

  async resolveConflict(
    agent1: string,
    agent2: string,
    issue: string
  ): Promise<ConflictResolution> {
    let decision = 'modify_code';
    let reason = '设计稿是源头，代码应匹配设计';

    if (agent1 === 'qa' && agent2 === 'dev') {
      decision = 'modify_code';
      reason = '测试失败意味着代码逻辑有问题';
    }

    if (agent1 === 'design' && agent2 === 'dev') {
      decision = 'modify_code';
      reason = '设计稿是需求来源，代码应匹配';
    }

    if (agent1 === 'ops' && agent2 === 'dev') {
      decision = 'modify_code';
      reason = '运维规则优先，确保分支策略正确';
    }

    return { decision, reason, affectedAgents: [agent1, agent2] };
  }

  updateSharedState(key: string, value: unknown): void {
    this.sharedState[key] = value;
  }

  getSharedState(): Record<string, unknown> {
    return this.sharedState;
  }

  async runWorkflow(requirement: string): Promise<{
    success: boolean;
    artifacts: string[];
    summary: string;
  }> {
    const parsed = await this.parseRequirement(requirement);

    if (parsed.platformHints.length === 0) {
      return {
        success: false,
        artifacts: [],
        summary: '未检测到平台信息，请补充平台需求'
      };
    }

    const platformTask = await this.assignTask('平台规划', {
      requirement,
      platformHints: parsed.platformHints
    });

    const designTask = await this.assignTask('设计规范', {
      requirement,
      designConstraints: parsed.designConstraints
    });

    const devTask = await this.assignTask('代码实现', {
      requirement,
      functionalRequirements: parsed.functionalRequirements
    });

    const qaTask = await this.assignTask('验收测试', {
      requirement
    });

    return {
      success: true,
      artifacts: [platformTask.agent, designTask.agent, devTask.agent, qaTask.agent],
      summary: `任务分派完成：平台→${platformTask.agent}，设计→${designTask.agent}，开发→${devTask.agent}，测试→${qaTask.agent}`
    };
  }
}
