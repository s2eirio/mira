export interface WireframeBlock {
  id: string;
  type: 'header' | 'hero' | 'feature' | 'content' | 'sidebar' | 'footer' | 'card' | 'list' | 'form' | 'modal';
  label: string;
  children?: WireframeBlock[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  columns?: number;
}

export interface WireframeResult {
  blocks: WireframeBlock[];
  layout: string;
  sections: string[];
}

export class WireframeSkill {
  async generate(requirement: string): Promise<WireframeResult> {
    const blocks: WireframeBlock[] = [];
    const sections: string[] = [];

    blocks.push({
      id: 'header',
      type: 'header',
      label: 'Header / 导航栏',
      layout: 'horizontal',
      children: [
        { id: 'logo', type: 'card', label: 'Logo' },
        { id: 'nav', type: 'card', label: '导航菜单' },
        { id: 'user', type: 'card', label: '用户区' }
      ]
    });
    sections.push('header');

    if (requirement.includes('首页') || requirement.includes('首页') || requirement.includes('landing')) {
      blocks.push({
        id: 'hero',
        type: 'hero',
        label: 'Hero / 主视觉区',
        layout: 'horizontal',
        children: [
          { id: 'hero-text', type: 'content', label: '标题 + 副标题 + CTA按钮' },
          { id: 'hero-image', type: 'card', label: '主视觉图片' }
        ]
      });
      sections.push('hero');

      blocks.push({
        id: 'features',
        type: 'feature',
        label: 'Features / 功能特性',
        layout: 'grid',
        columns: 3,
        children: [
          { id: 'feat-1', type: 'card', label: '功能1' },
          { id: 'feat-2', type: 'card', label: '功能2' },
          { id: 'feat-3', type: 'card', label: '功能3' }
        ]
      });
      sections.push('features');
    }

    if (requirement.includes('列表') || requirement.includes('dashboard')) {
      blocks.push({
        id: 'sidebar',
        type: 'sidebar',
        label: 'Sidebar / 侧边栏',
        layout: 'vertical',
        children: [
          { id: 'menu', type: 'list', label: '菜单列表' }
        ]
      });
      sections.push('sidebar');

      blocks.push({
        id: 'main-content',
        type: 'content',
        label: 'Main Content / 主内容区',
        layout: 'vertical',
        children: [
          { id: 'stats', type: 'feature', label: '数据统计卡片', layout: 'grid', columns: 4, children: [
            { id: 'stat-1', type: 'card', label: '统计1' },
            { id: 'stat-2', type: 'card', label: '统计2' },
            { id: 'stat-3', type: 'card', label: '统计3' },
            { id: 'stat-4', type: 'card', label: '统计4' }
          ]},
          { id: 'list', type: 'list', label: '数据列表' }
        ]
      });
      sections.push('main-content');
    }

    if (requirement.includes('表单') || requirement.includes('form')) {
      blocks.push({
        id: 'form-section',
        type: 'form',
        label: 'Form / 表单区',
        layout: 'vertical',
        children: [
          { id: 'form-title', type: 'content', label: '表单标题' },
          { id: 'form-fields', type: 'list', label: '输入字段列表' },
          { id: 'form-actions', type: 'card', label: '操作按钮' }
        ]
      });
      sections.push('form-section');
    }

    blocks.push({
      id: 'footer',
      type: 'footer',
      label: 'Footer / 页脚',
      layout: 'horizontal',
      children: [
        { id: 'footer-links', type: 'list', label: '链接列表' },
        { id: 'footer-copyright', type: 'content', label: '版权信息' }
      ]
    });
    sections.push('footer');

    if (requirement.includes('弹窗') || requirement.includes('modal')) {
      blocks.push({
        id: 'modal',
        type: 'modal',
        label: 'Modal / 弹窗',
        layout: 'vertical',
        children: [
          { id: 'modal-header', type: 'card', label: '弹窗标题' },
          { id: 'modal-body', type: 'content', label: '弹窗内容' },
          { id: 'modal-footer', type: 'card', label: '操作按钮' }
        ]
      });
      sections.push('modal');
    }

    const layout = blocks.some(b => b.type === 'sidebar') 
      ? 'sidebar + content 布局' 
      : '单列布局';

    return { blocks, layout, sections };
  }

  async generateAsciiWireframe(requirement: string): Promise<string> {
    const result = await this.generate(requirement);
    
    let wireframe = '';
    
    wireframe += '┌' + '─'.repeat(78) + '┐\n';
    wireframe += '│' + ' Header / Navigation '.padEnd(78, ' ') + '│\n';
    wireframe += '├' + '─'.repeat(78) + '┤\n';

    const hasSidebar = result.blocks.some(b => b.type === 'sidebar');
    
    if (hasSidebar) {
      for (let i = 0; i < 10; i++) {
        wireframe += '│' + ' Sidebar '.padEnd(20, ' ') + '│' + ' Main Content '.padEnd(57, ' ') + '│\n';
      }
    } else {
      wireframe += '│' + ' Hero Section '.padEnd(78, ' ') + '│\n';
      wireframe += '│' + ' '.padEnd(78, ' ') + '│\n';
      wireframe += '│' + ' Feature Grid '.padEnd(78, ' ') + '│\n';
      wireframe += '│' + ' [1]  [2]  [3]  [4] '.padEnd(78, ' ') + '│\n';
      wireframe += '│' + ' '.padEnd(78, ' ') + '│\n';
      wireframe += '│' + ' Content Section '.padEnd(78, ' ') + '│\n';
      wireframe += '│' + ' '.padEnd(78, ' ') + '│\n';
    }
    
    wireframe += '├' + '─'.repeat(78) + '┤\n';
    wireframe += '│' + ' Footer '.padEnd(78, ' ') + '│\n';
    wireframe += '└' + '─'.repeat(78) + '┘\n';

    return wireframe;
  }

  async exportAsMarkdown(requirement: string): Promise<string> {
    const result = await this.generate(requirement);
    
    let md = `# 线框图设计\n\n`;
    md += `**布局类型**: ${result.layout}\n\n`;
    md += `## 页面结构\n\n`;
    md += `\`\`\`\n${await this.generateAsciiWireframe(requirement)}\n\`\`\`\n\n`;
    md += `## 区块详情\n\n`;
    
    for (const block of result.blocks) {
      md += `### ${block.label} (${block.type})\n\n`;
      if (block.children && block.children.length > 0) {
        for (const child of block.children) {
          md += `- ${child.label}\n`;
        }
      }
      md += '\n';
    }
    
    return md;
  }
}
