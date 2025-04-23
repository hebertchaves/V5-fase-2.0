// src/components/navigation/navigation-components.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { processTabsComponent } from './tabs-component';
import { processTabComponent, processTabPanelsComponent, processTabPanelComponent } from './tab-component';
import { processBreadcrumbsComponent } from './breadcrumbs-component';

/**
 * Processa componentes de navegação do Quasar
 */
export async function processNavigationComponents(node: QuasarNode, componentType: string, settings: PluginSettings): Promise<FrameNode> {
  switch(componentType) {
    case 'tabs':
      return await processTabsComponent(node, settings);
    case 'tab':
      return await processTabComponent(node, settings);
    case 'tab-panels':
      return await processTabPanelsComponent(node, settings);
    case 'tab-panel':
      return await processTabPanelComponent(node, settings);
    case 'breadcrumbs':
      return await processBreadcrumbsComponent(node, settings);
    default:
      // Componente genérico
      const frame = figma.createFrame();
      frame.name = `navigation-${componentType}`;
      frame.layoutMode = "VERTICAL";
      frame.primaryAxisSizingMode = "AUTO";
      frame.counterAxisSizingMode = "AUTO";
      return frame;
  }
}