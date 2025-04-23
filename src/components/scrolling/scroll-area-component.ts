// src/components/scrolling/scroll-area-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { createText, createRectangle } from '../../utils/figma-utils';

export async function processScrollAreaComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const scrollAreaFrame = figma.createFrame();
  scrollAreaFrame.name = "q-scroll-area";
  
  // Configuração básica de layout
  scrollAreaFrame.layoutMode = "VERTICAL";
  scrollAreaFrame.primaryAxisSizingMode = "FIXED";
  scrollAreaFrame.counterAxisSizingMode = "FIXED";
  scrollAreaFrame.resize(300, 400);
  
  // Estilo de container de scroll
  scrollAreaFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
  scrollAreaFrame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  scrollAreaFrame.strokeWeight = 1;
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Conteúdo do scroll area
  const contentHeight = parseInt(props.contentHeight) || 600;
  
  const contentFrame = figma.createFrame();
  contentFrame.name = "scroll-area-content";
  contentFrame.layoutMode = "VERTICAL";
  contentFrame.primaryAxisSizingMode = "AUTO";
  contentFrame.counterAxisSizingMode = "FIXED";
  contentFrame.resize(280, contentFrame.height);
  contentFrame.itemSpacing = 16;
  contentFrame.paddingLeft = 10;
  contentFrame.paddingRight = 10;
  
  // Criar conteúdo simulado
  for (let i = 1; i <= 10; i++) {
    const contentItem = createRectangle(260, 100, {
      color: { r: 0.9, g: 0.9, b: 0.9 },
      cornerRadius: 4
    });
    contentItem.name = `scroll-item-${i}`;
    contentFrame.appendChild(contentItem);
  }
  
  // Barra de rolagem
  const scrollBar = createRectangle(8, 100, {
    color: { r: 0.6, g: 0.6, b: 0.6 },
    cornerRadius: 4
  });
  scrollBar.name = "scroll-bar";
  scrollBar.x = 292;
  
  scrollAreaFrame.appendChild(contentFrame);
  scrollAreaFrame.appendChild(scrollBar);
  
  return scrollAreaFrame;
}