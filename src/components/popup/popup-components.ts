// src/components/popup/popup-components.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { processDialogComponent } from './dialog-component';
import { processTooltipComponent } from './tooltip-component';

/**
 * Processa componentes de popup do Quasar
 */
export async function processPopupComponents(node: QuasarNode, componentType: string, settings: PluginSettings): Promise<FrameNode> {
  switch(componentType) {
    case 'dialog':
      return await processDialogComponent(node, settings);
    case 'tooltip':
      return await processTooltipComponent(node, settings);
    default:
      // Componente genérico
      const frame = figma.createFrame();
      frame.name = `popup-${componentType}`;
      frame.layoutMode = "VERTICAL";
      frame.primaryAxisSizingMode = "AUTO";
      frame.counterAxisSizingMode = "AUTO";
      return frame;
  }
}