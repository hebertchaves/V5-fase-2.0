
import { QuasarNode, PluginSettings } from '../types/settings';

/**
 * Serviço de componentes para centralizar referências e evitar dependências circulares
 */
class ComponentService {
  private static instance: ComponentService;
  private processors: Record<string, any> = {};
  private componentTypes: Record<string, string> = {};
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): ComponentService {
    if (!ComponentService.instance) {
      ComponentService.instance = new ComponentService();
    }
    return ComponentService.instance;
  }

/**
 * Verifica se existe um processador específico para um componente
 */
public hasProcessorForComponent(category: string, type: string): boolean {
  const specificProcessorKey = `${type}Processor`;
  if (this.processors[specificProcessorKey]) {
    return true;
  }
  
  const categoryProcessorKey = `${category}Processor`;
  return !!this.processors[categoryProcessorKey];
}

  /**
   * Inicializa o serviço de componentes
   */
  public initialize(): void {
    if (this.initialized) return;
    
    // Registrar mapeamento de componentes para suas categorias
    this.registerComponentType('q-btn', 'basic');
    this.registerComponentType('q-icon', 'basic');
    this.registerComponentType('q-separator', 'basic');
    this.registerComponentType('q-chip', 'basic');    
    this.registerComponentType('q-input', 'form');
    this.registerComponentType('q-select', 'form');
    this.registerComponentType('q-checkbox', 'form');
    this.registerComponentType('q-radio', 'form');
    this.registerComponentType('q-toggle', 'form');
    this.registerComponentType('q-table', 'display');
    this.registerComponentType('q-list', 'display');
    this.registerComponentType('q-item', 'display');
    this.registerComponentType('q-tabs', 'navigation');
    this.registerComponentType('q-tab', 'navigation');
    this.registerComponentType('q-tab-panels', 'navigation');
    this.registerComponentType('q-tab-panel', 'navigation');
    this.registerComponentType('q-breadcrumbs', 'navigation');
    this.registerComponentType('q-page', 'layout');
    this.registerComponentType('q-layout', 'layout');
    this.registerComponentType('q-header', 'layout');
    this.registerComponentType('q-footer', 'layout');
    this.registerComponentType('q-drawer', 'layout');
    this.registerComponentType('q-toolbar', 'layout');
    this.registerComponentType('q-card', 'layout');    
    this.registerComponentType('q-dialog', 'popup');
    this.registerComponentType('q-tooltip', 'popup');
    
    this.initialized = true;
  }

  /**
   * Registra um processador de componente
   */
  public registerProcessor(key: string, processor: any): void {
    this.processors[key] = processor;
    console.log(`Processador '${key}' registrado com sucesso`);
  }

  /**
   * Obtém um processador de componente
   */
  public getProcessor(key: string): any {
    return this.processors[key];
  }

  /**
   * Registra categorias de componentes
   */
  public registerComponentType(tagName: string, category: string): void {
    this.componentTypes[tagName.toLowerCase()] = category;
  }

  /**
   * Obtém categoria de um componente
   */
  public getComponentCategory(tagName: string): string {
    return this.componentTypes[tagName.toLowerCase()] || 'generic';
  }

  /**
   * Processa um componente genérico
   */
  public async processGenericComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
    const processor = this.getProcessor('genericComponent');
    if (!processor) {
      // Fallback simples se o processador não estiver registrado
      const frame = figma.createFrame();
      frame.name = node.tagName || "generic-component";
      frame.layoutMode = "VERTICAL";
      frame.primaryAxisSizingMode = "AUTO";
      frame.counterAxisSizingMode = "AUTO";
      frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      return frame;
    }
    return processor(node, settings);
  }
  
  /**
   * Processa um componente com base em sua categoria
   */
  public async processComponentByCategory(
    node: QuasarNode, 
    category: string, 
    type: string, 
    settings: PluginSettings,
  ): Promise<FrameNode | null> {
    // Primeiro tenta processar pelo tipo exato do componente
    const specificProcessorKey = `${type}Processor`;
    if (this.processors[specificProcessorKey]) {
      console.log(`Usando processador específico: ${specificProcessorKey}`);
      return this.processors[specificProcessorKey](node, settings);
    }
    
    // Se não encontrar um processador específico, usa o da categoria
    const categoryProcessorKey = `${category}Processor`;
    const processor = this.getProcessor(categoryProcessorKey);
    
    if (processor) {
      console.log(`Usando processador de categoria: ${categoryProcessorKey}`);
      return processor(node, type, settings);
    }
    
    // Fallback para processador genérico
    console.log(`Nenhum processador encontrado, usando processador genérico`);
    return this.processGenericComponent(node, settings);
  }
  
  /**
   * Registra todos os processadores padrão do sistema
   */
  public registerDefaultProcessors(processors: Record<string, any>): void {
    Object.entries(processors).forEach(([key, processor]) => {
      this.registerProcessor(key, processor);
    });
  }
}

export const componentService = ComponentService.getInstance();