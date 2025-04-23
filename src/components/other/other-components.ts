// src/components/other/other-components.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { processRatingComponent } from './rating-component';
import { processSkeletonComponent } from './skeleton-component';

/**
 * Processa outros componentes do Quasar
 */
export async function processOtherComponents(node: QuasarNode, componentType: string, settings: PluginSettings): Promise<FrameNode> {
  switch(componentType) {
    case 'rating':
      return await processRatingComponent(node, settings);
    case 'skeleton':
      return await processSkeletonComponent(node, settings);
    default:
      // Componente genérico
      const frame = figma.createFrame();
      frame.name = `other-${componentType}`;
      frame.layoutMode = "VERTICAL";
      frame.primaryAxisSizingMode = "AUTO";
      frame.counterAxisSizingMode = "AUTO";
      return frame;
  }
}