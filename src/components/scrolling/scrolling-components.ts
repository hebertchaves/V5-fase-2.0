// src/components/scrolling/scrolling-components.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { processInfiniteScrollComponent } from './infinite-scroll-component';
import { processScrollAreaComponent } from './scroll-area-component';

export async function processScrollingComponents(node: QuasarNode, componentType: string, settings: PluginSettings): Promise<FrameNode> {
  switch (componentType) {
    case 'infinite-scroll':
      return await processInfiniteScrollComponent(node, settings);
    
    case 'scroll-area':
      return await processScrollAreaComponent(node, settings);
    
    default:
      const fallbackFrame = figma.createFrame();
      fallbackFrame.name = `scrolling-${componentType}`;
      fallbackFrame.layoutMode = "VERTICAL";
      fallbackFrame.primaryAxisSizingMode = "AUTO";
      
      return fallbackFrame;
  }
}