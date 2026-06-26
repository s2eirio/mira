export interface GwtGenerationResult {
  testCases: Array<{
    id: string;
    category: 'happy' | 'unhappy' | 'edge' | 'ui';
    given: string;
    when: string;
    then: string;
    dataTestId: string;
    expectedValue?: string | number | boolean;
    priority: 'high' | 'medium' | 'low';
  }>;
  summary: string;
}

export class GwtTestCaseGeneratorSkill {
  private counter = 0;

  async generate(userStory: string): Promise<GwtGenerationResult> {
    this.counter = 0;
    const testCases: GwtGenerationResult['testCases'] = [];

    this.extractLoginCases(userStory, testCases);
    this.extractFormCases(userStory, testCases);
    this.extractListCases(userStory, testCases);
    this.extractButtonCases(userStory, testCases);
    this.extractCommonCases(userStory, testCases);

    if (testCases.length === 0) {
      testCases.push(this.createDefaultCase(userStory));
    }

    return {
      testCases,
      summary: `已生成 ${testCases.length} 个测试用例，其中高优先级 ${testCases.filter(t => t.priority === 'high').length} 个`
    };
  }

  private extractLoginCases(story: string, cases: GwtGenerationResult['testCases']) {
    if (story.includes('登录') || story.includes('login') || story.includes('认证')) {
      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'happy',
        given: '用户在登录页面，输入框为空',
        when: '输入正确的用户名和密码，点击登录按钮',
        then: '登录成功，跳转到首页',
        dataTestId: 'btn-login',
        priority: 'high'
      });

      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'unhappy',
        given: '用户在登录页面',
        when: '输入错误的密码，点击登录按钮',
        then: '显示错误提示"密码错误"',
        dataTestId: 'login-error',
        priority: 'high'
      });

      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'edge',
        given: '用户在登录页面',
        when: '输入超过20个字符的用户名',
        then: '输入框显示红色边框提示',
        dataTestId: 'input-username',
        priority: 'medium'
      });
    }
  }

  private extractFormCases(story: string, cases: GwtGenerationResult['testCases']) {
    if (story.includes('表单') || story.includes('form') || story.includes('提交')) {
      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'happy',
        given: '表单所有字段已正确填写',
        when: '点击提交按钮',
        then: '表单提交成功，显示成功提示',
        dataTestId: 'btn-submit',
        priority: 'high'
      });

      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'unhappy',
        given: '必填字段为空',
        when: '点击提交按钮',
        then: '显示必填字段错误提示',
        dataTestId: 'form-error',
        priority: 'high'
      });
    }
  }

  private extractListCases(story: string, cases: GwtGenerationResult['testCases']) {
    if (story.includes('列表') || story.includes('list') || story.includes('展示')) {
      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'happy',
        given: '列表数据已加载',
        when: '滚动到列表底部',
        then: '自动加载更多数据',
        dataTestId: 'list-container',
        priority: 'medium'
      });

      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'edge',
        given: '列表为空',
        when: '页面加载完成',
        then: '显示空状态提示',
        dataTestId: 'empty-state',
        priority: 'medium'
      });
    }
  }

  private extractButtonCases(story: string, cases: GwtGenerationResult['testCases']) {
    if (story.includes('按钮') || story.includes('button') || story.includes('点击')) {
      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'ui',
        given: '鼠标悬停在按钮上',
        when: '保持悬停状态',
        then: '按钮颜色变深，出现阴影',
        dataTestId: 'action-button',
        priority: 'medium'
      });

      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'edge',
        given: '按钮处于禁用状态',
        when: '点击按钮',
        then: '按钮无响应，保持禁用样式',
        dataTestId: 'disabled-button',
        priority: 'medium'
      });
    }
  }

  private extractCommonCases(story: string, cases: GwtGenerationResult['testCases']) {
    if (story.includes('添加') || story.includes('add')) {
      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'happy',
        given: '输入框有内容',
        when: '点击添加按钮',
        then: '内容添加到列表',
        dataTestId: 'btn-add',
        priority: 'high'
      });
    }

    if (story.includes('删除') || story.includes('delete')) {
      cases.push({
        id: `TC-${String(++this.counter).padStart(3, '0')}`,
        category: 'happy',
        given: '列表中有项',
        when: '点击删除按钮',
        then: '项从列表移除',
        dataTestId: 'btn-delete',
        priority: 'high'
      });
    }
  }

  private createDefaultCase(story: string): GwtGenerationResult['testCases'][0] {
    return {
      id: `TC-${String(++this.counter).padStart(3, '0')}`,
      category: 'happy',
      given: '页面已加载完成',
      when: '用户执行主要操作',
      then: '操作成功完成',
      dataTestId: 'main-action',
      priority: 'high'
    };
  }
}
