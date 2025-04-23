// Exportar explicitamente os tipos
export type QuasarNode = {
  tagName: string;
  attributes: Record<string, string>;
  childNodes: QuasarNode[];
  text?: string;
};

export interface PluginSettings {
  preserveQuasarColors: boolean;
  createComponentVariants: boolean;
  useAutoLayout: boolean;
  componentDensity: 'default' | 'comfortable' | 'compact';
  colorTheme: 'quasar-default' | 'material' | 'custom';
  componentGroups: {
    basic: boolean;
    form: boolean;
    layout: boolean;
    navigation: boolean;
    popup: boolean;
    scrolling: boolean;
    display: boolean;
    other: boolean;
  };
}

// Definições globais adicionais podem ser mantidas
declare global {
  const figma: {
    createFrame(): FrameNode;
    createText(): TextNode;
    currentPage: PageNode;
    ui: {
      postMessage(msg: any): void;
      onmessage: ((event: { data: { pluginMessage: any } }) => void) | null;
    };
    closePlugin(): void;
    showUI(html: string, options?: { width?: number; height?: number }): void;
  };

  // Outras definições globais...
  interface FrameNode extends BaseNode {
    layoutMode: string;
    primaryAxisSizingMode: string;
    counterAxisSizingMode: string;
    fills: Paint[];
    resize(width: number, height: number): void;
    appendChild(child: SceneNode): void;
  }

  interface TextNode extends BaseNode {
    characters: string;
    fontSize: number;
    fills: Paint[];
  }

  interface BaseNode {
    name: string;
  }
}

// Exportação padrão para garantir que o módulo seja tratado como um módulo
export {};