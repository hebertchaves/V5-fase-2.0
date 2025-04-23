// src/components/popup/tooltip-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText, getContrastingTextColor, createShadowEffect } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

/**
 * Processa um componente de tooltip Quasar (q-tooltip)
 */
export async function processTooltipComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const tooltipFrame = figma.createFrame();
  tooltipFrame.name = "q-tooltip";
  
  // Configuração básica
  tooltipFrame.layoutMode = "HORIZONTAL";
  tooltipFrame.primaryAxisSizingMode = "AUTO";
  tooltipFrame.counterAxisSizingMode = "AUTO";
  tooltipFrame.paddingLeft = 8;
  tooltipFrame.paddingRight = 8;
  tooltipFrame.paddingTop = 4;
  tooltipFrame.paddingBottom = 4;
  tooltipFrame.cornerRadius = 4;
  tooltipFrame.effects = [createShadowEffect(0, 2, 4, 0.2)];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Determinar cor do tooltip
  let bgColor = { r: 0.2, g: 0.2, b: 0.2 }; // Cinza escuro padrão
  
  if (props.color && quasarColors[props.color] && settings.preserveQuasarColors) {
    bgColor = quasarColors[props.color];
  }
  
  tooltipFrame.fills = [{ type: 'SOLID', color: bgColor }];
  
  // Extrair texto do tooltip
  let tooltipText = "";
  
  if (props.content) {
    tooltipText = props.content;
  } else {
    // Tentar extrair texto dos filhos
    for (const child of node.childNodes) {
      if (child.text) {
        tooltipText += child.text.trim() + " ";
      }
    }
    
    tooltipText = tooltipText.trim();
  }
  
  if (!tooltipText) {
    tooltipText = "Tooltip text";
  }
  
  // Criar texto
  const textColor = getContrastingTextColor(bgColor);
  const textNode = await createText(tooltipText, {
    color: textColor,
    fontSize: 12
  });
  
  tooltipFrame.appendChild(textNode);
  
  // Adicionar seta (opcional)
  if (props.anchor && props.self) {
    const arrowSize = 6;
    const arrow = figma.createPolygon();
    arrow.name = "q-tooltip__arrow";
    arrow.fills = [{ type: 'SOLID', color: bgColor }];
    
    // Posicionar a seta com base nas props anchor e self
    // Simplificação: apenas uma seta apontando para cima
    arrow.resize(arrowSize * 2, arrowSize);
    arrow.rotation = 180;
    
    tooltipFrame.appendChild(arrow);
  }
  
  return tooltipFrame;
}