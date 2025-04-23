// src/components/other/skeleton-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { createRectangle } from '../../utils/figma-utils';

export async function processSkeletonComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const skeletonFrame = figma.createFrame();
  skeletonFrame.name = "q-skeleton";
  
  // Configuração básica de layout
  skeletonFrame.layoutMode = "VERTICAL";
  skeletonFrame.primaryAxisSizingMode = "AUTO";
  skeletonFrame.counterAxisSizingMode = "AUTO";
  skeletonFrame.itemSpacing = 8;
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Tipos de skeleton
  const type = props.type || 'text';
  const width = parseInt(props.width) || 300;
  const height = parseInt(props.height) || 40;
  
  switch(type) {
    case 'text':
      const textSkeleton = createRectangle(width, 20, {
        color: { r: 0.9, g: 0.9, b: 0.9 },
        cornerRadius: 4
      });
      textSkeleton.name = "skeleton-text";
      skeletonFrame.appendChild(textSkeleton);
      break;
    
    case 'rect':
      const rectSkeleton = createRectangle(width, height, {
        color: { r: 0.9, g: 0.9, b: 0.9 },
        cornerRadius: 4
      });
      rectSkeleton.name = "skeleton-rect";
      skeletonFrame.appendChild(rectSkeleton);
      break;
    
    case 'circle':
      const circleSkeleton = figma.createEllipse();
      circleSkeleton.resize(height, height);
      circleSkeleton.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
      circleSkeleton.name = "skeleton-circle";
      skeletonFrame.appendChild(circleSkeleton);
      break;
  }
  
  return skeletonFrame;
}