export interface GwtTestCase {
  id: string;
  category: 'happy' | 'unhappy' | 'edge' | 'ui';
  given: string;
  when: string;
  then: string;
  dataTestId: string;
  expectedValue?: string | number | boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface UiStateMatrix {
  element: string;
  states: {
    idle: { style: string; text: string };
    hover: { style: string; text: string };
    active: { style: string; text: string };
    loading: { style: string; text: string };
    success: { style: string; text: string };
    error: { style: string; text: string };
  };
}

export interface GeneratedComponent {
  name: string;
  path: string;
  content: string;
  dataTestIds: string[];
}

export class DevAgent {
  private testCaseCounter = 0;

  async generateGwtTestCases(userStory: string): Promise<GwtTestCase[]> {
    const cases: GwtTestCase[] = [];

    if (userStory.includes('登录') || userStory.includes('login')) {
      cases.push({
        id: `TC-${String(++this.testCaseCounter).padStart(3, '0')}`,
        category: 'happy',
        given: '用户在登录页面，输入框为空',
        when: '输入正确的用户名和密码，点击登录按钮',
        then: '登录成功，跳转到首页',
        dataTestId: 'btn-login',
        priority: 'high'
      });

      cases.push({
        id: `TC-${String(++this.testCaseCounter).padStart(3, '0')}`,
        category: 'unhappy',
        given: '用户在登录页面',
        when: '输入错误的密码，点击登录按钮',
        then: '显示错误提示"密码错误"',
        dataTestId: 'login-error',
        priority: 'high'
      });

      cases.push({
        id: `TC-${String(++this.testCaseCounter).padStart(3, '0')}`,
        category: 'edge',
        given: '用户在登录页面',
        when: '输入超过20个字符的用户名',
        then: '输入框显示红色边框提示',
        dataTestId: 'input-username',
        priority: 'medium'
      });
    }

    if (userStory.includes('添加') || userStory.includes('add')) {
      cases.push({
        id: `TC-${String(++this.testCaseCounter).padStart(3, '0')}`,
        category: 'happy',
        given: '列表为空',
        when: '输入内容并点击添加按钮',
        then: '内容出现在列表顶部',
        dataTestId: 'btn-add',
        priority: 'high'
      });

      cases.push({
        id: `TC-${String(++this.testCaseCounter).padStart(3, '0')}`,
        category: 'edge',
        given: '输入框为空',
        when: '点击添加按钮',
        then: '按钮保持禁用状态',
        dataTestId: 'btn-add',
        priority: 'medium'
      });
    }

    if (userStory.includes('删除') || userStory.includes('delete')) {
      cases.push({
        id: `TC-${String(++this.testCaseCounter).padStart(3, '0')}`,
        category: 'happy',
        given: '列表中有多个项',
        when: '点击某项的删除按钮',
        then: '该项淡出并从列表中移除',
        dataTestId: 'btn-delete',
        priority: 'high'
      });

      cases.push({
        id: `TC-${String(++this.testCaseCounter).padStart(3, '0')}`,
        category: 'edge',
        given: '列表中只有一项',
        when: '点击删除按钮',
        then: '列表显示空状态提示',
        dataTestId: 'empty-state',
        priority: 'medium'
      });
    }

    if (cases.length === 0) {
      cases.push({
        id: `TC-${String(++this.testCaseCounter).padStart(3, '0')}`,
        category: 'happy',
        given: '页面已加载',
        when: '用户执行主要操作',
        then: '操作成功完成',
        dataTestId: 'main-action',
        priority: 'high'
      });
    }

    return cases;
  }

  async generateUiStateMatrix(componentName: string): Promise<UiStateMatrix> {
    return {
      element: componentName,
      states: {
        idle: { style: 'cursor: pointer; opacity: 1;', text: componentName },
        hover: { style: 'cursor: pointer; opacity: 0.9; transform: scale(1.02);', text: componentName },
        active: { style: 'cursor: pointer; opacity: 0.8; transform: scale(0.98);', text: componentName },
        loading: { style: 'cursor: not-allowed; opacity: 0.6;', text: '加载中...' },
        success: { style: 'cursor: pointer; opacity: 1;', text: '✓ 成功' },
        error: { style: 'cursor: pointer; opacity: 1; border-color: #ef4444;', text: '✗ 失败' }
      }
    };
  }

  async generateReactComponent(
    componentName: string,
    testCases: GwtTestCase[],
    designTokens: Record<string, unknown>
  ): Promise<GeneratedComponent> {
    const dataTestIds = testCases.map(tc => tc.dataTestId).filter(Boolean);
    
    const containerId = dataTestIds[0] || 'container';
    const btnId = dataTestIds.find(id => id.includes('btn')) || 'action-button';
    
    const content = `import React, { useState } from 'react';

interface ${componentName}Props {
  className?: string;
}

export function ${componentName}({ className = '' }: ${componentName}Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSuccess(true);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className} data-testid="${containerId}">
      <button
        onClick={handleAction}
        disabled={isLoading}
        data-testid="${btnId}"
        className={\`
          px-4 py-2 rounded-lg font-medium transition-all duration-300
          \${isLoading ? 'bg-gray-400 cursor-not-allowed' : ''}
          \${isSuccess ? 'bg-green-500 text-white' : ''}
          \${isError ? 'bg-red-500 text-white' : ''}
          \${!isLoading && !isSuccess && !isError ? 'bg-indigo-500 text-white hover:bg-indigo-600' : ''}
        \`}
      >
        {isLoading ? 'Loading...' : isSuccess ? 'Success' : isError ? 'Error' : 'Execute'}
      </button>
    </div>
  );
}
`;

    return {
      name: componentName,
      path: `components/${componentName}.tsx`,
      content,
      dataTestIds
    };
  }

  async validateCode(content: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!content.includes('import')) {
      errors.push('缺少 import 语句');
    }

    if (!content.includes('data-testid')) {
      warnings.push('建议添加 data-testid 属性用于测试');
    }

    if (content.includes('any')) {
      warnings.push('避免使用 any 类型，建议使用具体类型');
    }

    if (content.includes('console.log')) {
      warnings.push('生产代码中不应包含 console.log');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}
