// global.d.ts
declare global {
  const figma: import('@figma/plugin-typings').PluginAPI;
}

export {};

declare module 'node-html-parser' {
    export function parse(html: string, options?: {
      lowerCaseTagName?: boolean;
      comment?: boolean;
      blockTextElements?: Record<string, boolean>;
    }): any;
  }
  
  // Definições de tipos do Figma e do projeto
  declare type QuasarNode = {
    tagName: string;
    attributes: Record<string, string>;
    childNodes: QuasarNode[];
    text?: string;
  };
  
  interface PluginSettings {
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