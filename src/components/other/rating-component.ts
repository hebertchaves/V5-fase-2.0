// src/components/other/rating-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { createText, applyStylesToFigmaNode } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

export async function processRatingComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const ratingFrame = figma.createFrame();
  ratingFrame.name = "q-rating";
  
  // Configuração básica de layout
  ratingFrame.layoutMode = "HORIZONTAL";
  ratingFrame.primaryAxisSizingMode = "AUTO";
  ratingFrame.counterAxisSizingMode = "AUTO";
  ratingFrame.itemSpacing = 8;
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Determinar cor e tamanho
  const color = props.color 
    ? quasarColors[props.color] || { r: 0.1, g: 0.5, b: 0.9 }
    : { r: 0.1, g: 0.5, b: 0.9 };
  
  const max = parseInt(props.max) || 5;
  const value = parseInt(props.value) || 0;
  
  // Criar estrelas
  for (let i = 1; i <= max; i++) {
    const starFrame = figma.createFrame();
    starFrame.name = `rating-star-${i}`;
    starFrame.resize(24, 24);
    
    // Definir preenchimento da estrela baseado no valor
    starFrame.fills = i <= value 
      ? [{ type: 'SOLID', color: color }]
      : [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
    
    // Adicionar texto da estrela (★)
    const starText = await createText("★", {
      color: { r: 1, g: 1, b: 1 },
      fontSize: 18,
      alignment: 'CENTER',
      verticalAlignment: 'CENTER'
    });
    
    starFrame.appendChild(starText);
    ratingFrame.appendChild(starFrame);
  }
  
  return ratingFrame;
}