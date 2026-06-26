export interface ComponentMappingResult {
  component: string;
  targetLibrary: string;
  mapping: {
    sourceComponent: string;
    targetComponent: string;
    propsMapping: Record<string, string>;
    compatibility: 'full' | 'partial' | 'none';
    notes?: string;
  };
}

export class ComponentMappingSkill {
  private mappings: Record<string, Record<string, Record<string, unknown>>> = {
    shadcn: {
      Button: {
        target: 'Button',
        props: {
          variant: 'variant: default | destructive | outline | secondary | ghost | link',
          size: 'size: default | sm | lg | icon',
          disabled: 'disabled: boolean',
          onClick: 'onClick: () => void',
          children: 'children: ReactNode'
        },
        compatibility: 'full'
      },
      Input: {
        target: 'Input',
        props: {
          type: 'type: string',
          placeholder: 'placeholder: string',
          value: 'value: string',
          onChange: 'onChange: (e) => void',
          disabled: 'disabled: boolean'
        },
        compatibility: 'full'
      },
      Card: {
        target: 'Card',
        props: {
          title: 'CardHeader + CardTitle',
          content: 'CardContent',
          footer: 'CardFooter'
        },
        compatibility: 'partial',
        notes: 'Card 由 CardHeader, CardTitle, CardDescription, CardContent, CardFooter 组合而成'
      },
      Modal: {
        target: 'Dialog',
        props: {
          open: 'open: boolean',
          onOpenChange: 'onOpenChange: (open: boolean) => void',
          title: 'DialogTitle',
          content: 'DialogContent',
          footer: 'DialogFooter'
        },
        compatibility: 'partial',
        notes: '使用 Dialog 组件替代 Modal'
      },
      List: {
        target: '自定义',
        props: {
          items: 'items: Array<any>',
          renderItem: 'renderItem: (item) => ReactNode'
        },
        compatibility: 'none',
        notes: 'shadcn 无内置 List 组件，需自定义实现'
      }
    },
    mui: {
      Button: { target: 'Button', props: {}, compatibility: 'full' },
      Input: { target: 'TextField', props: {}, compatibility: 'full' },
      Card: { target: 'Card', props: {}, compatibility: 'full' },
      Modal: { target: 'Dialog', props: {}, compatibility: 'full' },
      List: { target: 'List', props: {}, compatibility: 'full' }
    },
    antd: {
      Button: { target: 'Button', props: {}, compatibility: 'full' },
      Input: { target: 'Input', props: {}, compatibility: 'full' },
      Card: { target: 'Card', props: {}, compatibility: 'full' },
      Modal: { target: 'Modal', props: {}, compatibility: 'full' },
      List: { target: 'List', props: {}, compatibility: 'full' }
    }
  };

  async mapComponent(
    componentName: string,
    targetLibrary: string = 'shadcn'
  ): Promise<ComponentMappingResult | null> {
    const libraryMappings = this.mappings[targetLibrary];
    
    if (!libraryMappings) {
      return null;
    }

    const mapping = libraryMappings[componentName];
    
    if (!mapping) {
      return null;
    }

    return {
      component: componentName,
      targetLibrary,
      mapping: mapping as ComponentMappingResult['mapping']
    };
  }

  async mapAll(
    components: string[],
    targetLibrary: string = 'shadcn'
  ): Promise<{
    mapped: ComponentMappingResult[];
    unmapped: string[];
    summary: string;
  }> {
    const mapped: ComponentMappingResult[] = [];
    const unmapped: string[] = [];

    for (const comp of components) {
      const result = await this.mapComponent(comp, targetLibrary);
      if (result) {
        mapped.push(result);
      } else {
        unmapped.push(comp);
      }
    }

    const fullCompat = mapped.filter(m => m.mapping.compatibility === 'full').length;
    const partialCompat = mapped.filter(m => m.mapping.compatibility === 'partial').length;

    const summary = `共映射 ${mapped.length} 个组件（完全兼容 ${fullCompat} 个，部分兼容 ${partialCompat} 个），未映射 ${unmapped.length} 个`;

    return { mapped, unmapped, summary };
  }

  async getLibraryComponents(targetLibrary: string): Promise<string[]> {
    const libraryMappings = this.mappings[targetLibrary];
    return libraryMappings ? Object.keys(libraryMappings) : [];
  }

  async getSupportedLibraries(): Promise<string[]> {
    return Object.keys(this.mappings);
  }

  async generateImportStatement(
    componentName: string,
    targetLibrary: string = 'shadcn'
  ): Promise<string> {
    const mapping = await this.mapComponent(componentName, targetLibrary);
    
    if (!mapping) {
      return `// ${componentName} 组件在 ${targetLibrary} 中无对应映射`;
    }

    const targetComp = mapping.mapping.targetComponent;

    if (targetLibrary === 'shadcn') {
      return `import { ${targetComp} } from '@/components/ui/${targetComp.toLowerCase()}';`;
    }

    if (targetLibrary === 'mui') {
      return `import ${targetComp} from '@mui/material/${targetComp}';`;
    }

    if (targetLibrary === 'antd') {
      return `import { ${targetComp} } from 'antd';`;
    }

    return '';
  }
}
