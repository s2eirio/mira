export interface CodeGenerationResult {
  fileName: string;
  content: string;
  dataTestIds: string[];
  dependencies: string[];
  validation: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  };
}

export class CodeGenerationSkill {
  async generateReactComponent(
    componentName: string,
    testCases: Array<{ dataTestId: string }>,
    designTokens?: Record<string, unknown>
  ): Promise<CodeGenerationResult> {
    const dataTestIds = testCases.map(tc => tc.dataTestId).filter(Boolean);
    const tokens = designTokens || {
      colors: { primary: '#6366f1', success: '#22c55e', error: '#ef4444' },
      radius: { md: '8px' },
      spacing: { md: '16px' }
    } as { colors: Record<string, string>, radius: Record<string, string>, spacing: Record<string, string> };

    const colors = (tokens.colors || {}) as Record<string, string>;

    const content = `import React, { useState, type ReactNode } from 'react';

interface ${componentName}Props {
  className?: string;
  children?: ReactNode;
  onAction?: () => void;
}

export function ${componentName}({ className = '', children, onAction }: ${componentName}Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);

    try {
      await onAction?.();
      setIsSuccess(true);
    } catch {
      setIsError(true);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(false);
        setIsError(false);
      }, 2000);
    }
  };

  return (
    <div className={className} data-testid="${dataTestIds.find(id => id.includes('container')) || 'container'}">
      <button
        onClick={handleClick}
        disabled={isLoading}
        data-testid="${dataTestIds.find(id => id.includes('btn')) || 'action-button'}"
        className={\`
          px-4 py-2 rounded-lg font-medium transition-all duration-300
          \${isLoading ? 'bg-gray-400 cursor-not-allowed' : ''}
          \${isSuccess ? 'bg-${colors.success} text-white' : ''}
          \${isError ? 'bg-${colors.error} text-white' : ''}
          \${!isLoading && !isSuccess && !isError ? 'bg-${colors.primary} text-white hover:opacity-90' : ''}
        \`}
      >
        {isLoading ? '加载中...' : isSuccess ? '✓ 成功' : isError ? '✗ 失败' : children || '执行操作'}
      </button>
    </div>
  );
}
`;

    const validation = await this.validateCode(content);

    return {
      fileName: `${componentName}.tsx`,
      content,
      dataTestIds,
      dependencies: ['react'],
      validation
    };
  }

  async generateVueComponent(
    componentName: string,
    testCases: Array<{ dataTestId: string }>
  ): Promise<CodeGenerationResult> {
    const dataTestIds = testCases.map(tc => tc.dataTestId).filter(Boolean);

    const content = `<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  className?: string;
}

defineProps<Props>();
const emit = defineEmits<{
  action: [];
}>();

const isLoading = ref(false);
const isSuccess = ref(false);
const isError = ref(false);

const handleClick = async () => {
  if (isLoading.value) return;
  
  isLoading.value = true;
  isSuccess.value = false;
  isError.value = false;

  try {
    emit('action');
    isSuccess.value = true;
  } catch {
    isError.value = true;
  } finally {
    setTimeout(() => {
      isLoading.value = false;
      isSuccess.value = false;
      isError.value = false;
    }, 2000);
  }
};
</script>

<template>
  <div :class="className" :data-testid="${dataTestIds.find(id => id.includes('container')) || 'container'}">
    <button
      @click="handleClick"
      :disabled="isLoading"
      :data-testid="${dataTestIds.find(id => id.includes('btn')) || 'action-button'}"
      :class="[
        'px-4 py-2 rounded-lg font-medium transition-all duration-300',
        isLoading ? 'bg-gray-400 cursor-not-allowed' : '',
        isSuccess ? 'bg-green-500 text-white' : '',
        isError ? 'bg-red-500 text-white' : '',
        !isLoading && !isSuccess && !isError ? 'bg-indigo-500 text-white hover:opacity-90' : ''
      ]"
    >
      {{ isLoading ? '加载中...' : isSuccess ? '✓ 成功' : isError ? '✗ 失败' : '执行操作' }}
    </button>
  </div>
</template>
`;

    const validation = await this.validateCode(content);

    return {
      fileName: `${componentName}.vue`,
      content,
      dataTestIds,
      dependencies: ['vue'],
      validation
    };
  }

  async generateDataTestIdSuggestions(componentName: string): Promise<string[]> {
    return [
      `${componentName.toLowerCase()}-container`,
      `${componentName.toLowerCase()}-btn`,
      `${componentName.toLowerCase()}-input`,
      `${componentName.toLowerCase()}-error`,
      `${componentName.toLowerCase()}-success`
    ];
  }

  private async validateCode(content: string): Promise<{
    valid: boolean;
    errors: string[];
    warnings: string[];
  }> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!content.includes('import') && !content.includes('script setup')) {
      errors.push('缺少 import 语句');
    }

    if (!content.includes('data-testid') && !content.includes(':data-testid')) {
      warnings.push('建议添加 data-testid 属性用于测试');
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
