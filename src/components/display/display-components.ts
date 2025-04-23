// src/components/display/display-components.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { processListComponent } from './list-component';
import { processCarouselComponent } from './carousel-component';
import { processTableComponent } from './table-component';

/**
 * Processa componentes de display do Quasar
 */
export async function processDisplayComponents(node: QuasarNode, componentType: string, settings: PluginSettings): Promise<FrameNode> {
  switch(componentType) {
    case 'list':
      return await processListComponent(node, settings);
    case 'carousel':
      return await processCarouselComponent(node, settings);
    case 'table':
      return await processTableComponent(node, settings);
    default:
      // Componente genérico
      const frame = figma.createFrame();
      frame.name = `display-${componentType}`;
      frame.layoutMode = "VERTICAL";
      frame.primaryAxisSizingMode = "AUTO";
      frame.counterAxisSizingMode = "AUTO";
      return frame;
  }
}