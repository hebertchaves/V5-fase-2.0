// src/components/scrolling/infinite-scroll-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { createText, createRectangle } from '../../utils/figma-utils';

export async function processInfiniteScrollComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const scrollFrame = figma.createFrame();
  scrollFrame.name = "q-infinite-scroll";
  
  // Configuração básica de layout
  scrollFrame.layoutMode = "VERTICAL";
  scrollFrame.primaryAxisSizingMode = "AUTO";
  scrollFrame.counterAxisSizingMode = "FIXED";
  scrollFrame.resize(400, scrollFrame.height);
  scrollFrame.itemSpacing = 8;
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Simular conteúdo de scroll infinito
  const itemCount = parseInt(props.itemCount) || 5;
  
  for (let i = 1; i <= itemCount; i++) {
    const itemFrame = figma.createFrame();
    itemFrame.name = `infinite-scroll-item-${i}`;
    itemFrame.layoutMode = "HORIZONTAL";
    itemFrame.primaryAxisSizingMode = "AUTO";
    itemFrame.counterAxisSizingMode = "AUTO";
    itemFrame.paddingLeft = 16;
    itemFrame.paddingRight = 16;
    itemFrame.paddingTop = 12;
    itemFrame.paddingBottom = 12;
    
    // Item de exemplo
    const itemText = await createText(`Item ${i}`, {
      fontSize: 14
    });
    
    const itemIndicator = createRectangle(20, 20, {
      color: { r: 0.8, g: 0.8, b: 0.8 },
      cornerRadius: 4
    });
    
    itemFrame.appendChild(itemIndicator);
    itemFrame.appendChild(itemText);
    
    scrollFrame.appendChild(itemFrame);
  }
  
  // Adicionar indicador de carregamento
  const loadingIndicator = figma.createFrame();
  loadingIndicator.name = "infinite-scroll-loading";
  loadingIndicator.layoutMode = "HORIZONTAL";
  loadingIndicator.primaryAxisSizingMode = "AUTO";
  loadingIndicator.counterAxisSizingMode = "AUTO";
  loadingIndicator.paddingTop = 16;
  loadingIndicator.paddingBottom = 16;
  
  const loadingText = await createText("Carregando mais...", {
    fontSize: 12,
    color: { r: 0.6, g: 0.6, b: 0.6 }
  });
  
  loadingIndicator.appendChild(loadingText);
  scrollFrame.appendChild(loadingIndicator);
  
  return scrollFrame;
}