export interface UiState {
  state: string;
  style: string;
  text: string;
  disabled?: boolean;
  loading?: boolean;
}

export interface StateMatrixResult {
  element: string;
  states: UiState[];
  transitions: Array<{ from: string; to: string; trigger: string }>;
}

export class UiStateMatrixSkill {
  async generate(componentName: string, userStory: string): Promise<StateMatrixResult> {
    const states: UiState[] = [];
    const transitions: Array<{ from: string; to: string; trigger: string }> = [];

    if (componentName.toLowerCase().includes('button') || userStory.includes('按钮')) {
      states.push(
        { state: 'idle', style: 'bg-indigo-500 text-white cursor-pointer opacity-100', text: componentName },
        { state: 'hover', style: 'bg-indigo-600 text-white cursor-pointer opacity-100 transform scale-105', text: componentName },
        { state: 'active', style: 'bg-indigo-700 text-white cursor-pointer opacity-100 transform scale-95', text: componentName },
        { state: 'loading', style: 'bg-gray-400 text-white cursor-not-allowed opacity-60', text: '加载中...', loading: true },
        { state: 'success', style: 'bg-green-500 text-white cursor-pointer opacity-100', text: '✓ 成功' },
        { state: 'error', style: 'bg-red-500 text-white cursor-pointer opacity-100', text: '✗ 失败' }
      );

      transitions.push(
        { from: 'idle', to: 'hover', trigger: 'mouseenter' },
        { from: 'hover', to: 'idle', trigger: 'mouseleave' },
        { from: 'hover', to: 'active', trigger: 'mousedown' },
        { from: 'active', to: 'loading', trigger: 'click' },
        { from: 'loading', to: 'success', trigger: 'api_success' },
        { from: 'loading', to: 'error', trigger: 'api_error' },
        { from: 'success', to: 'idle', trigger: 'reset' },
        { from: 'error', to: 'idle', trigger: 'reset' }
      );
    }

    if (componentName.toLowerCase().includes('input') || userStory.includes('输入')) {
      states.push(
        { state: 'idle', style: 'border-gray-300 bg-white text-gray-900', text: '' },
        { state: 'focus', style: 'border-indigo-500 bg-white text-gray-900 ring-2 ring-indigo-200', text: '' },
        { state: 'error', style: 'border-red-500 bg-red-50 text-gray-900', text: '' },
        { state: 'disabled', style: 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed', text: '', disabled: true },
        { state: 'valid', style: 'border-green-500 bg-green-50 text-gray-900', text: '' }
      );

      transitions.push(
        { from: 'idle', to: 'focus', trigger: 'focus' },
        { from: 'focus', to: 'idle', trigger: 'blur' },
        { from: 'focus', to: 'error', trigger: 'invalid_input' },
        { from: 'focus', to: 'valid', trigger: 'valid_input' },
        { from: 'error', to: 'focus', trigger: 'focus' }
      );
    }

    if (componentName.toLowerCase().includes('modal') || userStory.includes('弹窗')) {
      states.push(
        { state: 'closed', style: 'opacity-0 pointer-events-none transform translate-y-4', text: '' },
        { state: 'opening', style: 'opacity-100 pointer-events-auto transform translate-y-0 transition-all duration-300', text: '' },
        { state: 'open', style: 'opacity-100 pointer-events-auto transform translate-y-0', text: '' },
        { state: 'closing', style: 'opacity-0 pointer-events-none transform translate-y-4 transition-all duration-300', text: '' }
      );

      transitions.push(
        { from: 'closed', to: 'opening', trigger: 'open' },
        { from: 'opening', to: 'open', trigger: 'animation_end' },
        { from: 'open', to: 'closing', trigger: 'close' },
        { from: 'closing', to: 'closed', trigger: 'animation_end' }
      );
    }

    if (states.length === 0) {
      states.push(
        { state: 'idle', style: 'default', text: componentName },
        { state: 'active', style: 'active', text: componentName }
      );
      transitions.push({ from: 'idle', to: 'active', trigger: 'interaction' });
    }

    return { element: componentName, states, transitions };
  }

  async exportAsJson(componentName: string, userStory: string): Promise<string> {
    const result = await this.generate(componentName, userStory);
    return JSON.stringify(result, null, 2);
  }

  async exportAsTable(componentName: string, userStory: string): Promise<string> {
    const result = await this.generate(componentName, userStory);
    
    let table = `## ${componentName} 状态矩阵\n\n`;
    table += `| 状态 | 样式 | 文本 | 特性 |\n`;
    table += `|------|------|------|------|\n`;
    
    for (const state of result.states) {
      table += `| ${state.state} | ${state.style} | ${state.text} | ${state.loading ? '加载中' : state.disabled ? '禁用' : '正常'} |\n`;
    }

    table += `\n## 状态转换\n\n`;
    table += `| 从 | 到 | 触发器 |\n`;
    table += `|----|----|--------|\n`;
    
    for (const transition of result.transitions) {
      table += `| ${transition.from} | ${transition.to} | ${transition.trigger} |\n`;
    }

    return table;
  }
}
