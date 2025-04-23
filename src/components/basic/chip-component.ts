// src/components/basic/chip-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText, getContrastingTextColor } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

/**
 * Processa um componente de chip Quasar (q-chip)
 */
export async function processChipComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const chipFrame = figma.createFrame();
  chipFrame.name = "q-chip";
  
  // Configuração básica do chip
  chipFrame.layoutMode = "HORIZONTAL";
  chipFrame.primaryAxisSizingMode = "AUTO";
  chipFrame.counterAxisSizingMode = "AUTO";
  chipFrame.primaryAxisAlignItems = "CENTER";
  chipFrame.counterAxisAlignItems = "CENTER";
  chipFrame.cornerRadius = 4; // Chips geralmente são arredondados
  chipFrame.paddingLeft = 4;
  chipFrame.paddingRight = 4;
  chipFrame.paddingTop = 4;
  chipFrame.paddingBottom = 4;
  chipFrame.itemSpacing = 4;
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Determinar cor do chip
  let chipColor = { r: 0.9, g: 0.9, b: 0.9 }; // Cor padrão cinza claro
  
  if (props.color && quasarColors[props.color] && settings.preserveQuasarColors) {
    chipColor = quasarColors[props.color];
  }
  
  // Aplicar cor
  chipFrame.fills = [{ type: 'SOLID', color: chipColor }];
  
  // Extrair texto do chip
  let chipText = "Chip";
  
  // Verificar label
  if (props.label) {
    chipText = props.label;
  } else {
    // Tentar extrair texto dos filhos
    for (const child of node.childNodes) {
      if (child.text) {
        chipText = child.text.trim();
        break;
      }
    }
  }
  
  // Verificar se tem ícone
  if (props.icon) {
    // Criar o ícone
    const iconFrame = figma.createFrame();
    iconFrame.name = "q-chip__icon";
    iconFrame.resize(16, 16);
    iconFrame.cornerRadius = 8; // Circular
    
    // Cor contrastante para o ícone
    const iconColor = getContrastingTextColor(chipColor);
    iconFrame.fills = [{ type: 'SOLID', color: iconColor }];
    
    // Adicionar ao chip
    chipFrame.appendChild(iconFrame);
  }
  
  // Criar texto
  const textColor = getContrastingTextColor(chipColor);
  const textNode = await createText(chipText, {
    color: textColor,
    fontSize: 12
  });
  
  chipFrame.appendChild(textNode);
  
  // Verificar se tem ícone de fechar
  if (props.removable === 'true' || props.removable === '') {
    const closeIconFrame = figma.createFrame();
    closeIconFrame.name = "q-chip__close-icon";
    closeIconFrame.resize(16, 16);
    closeIconFrame.cornerRadius = 8; // Circular
    
    // Cor contrastante para o ícone
    closeIconFrame.fills = [{ type: 'SOLID', color: textColor, opacity: 0.7 }];
    
    // Adicionar "X" como texto
    const closeText = await createText("×", {
      fontSize: 14,
      color: textColor,
      alignment: 'CENTER',
      verticalAlignment: 'CENTER'
    });
    
    closeIconFrame.appendChild(closeText);
    chipFrame.appendChild(closeIconFrame);
  }
  
  // Configurações adicionais com base em props
  if (props.outline === 'true' || props.outline === '') {
    chipFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    chipFrame.strokes = [{ type: 'SOLID', color: chipColor }];
    chipFrame.strokeWeight = 1;
    
    // Atualizar cor do texto para a cor do chip
    if (textNode) {
      textNode.fills = [{ type: 'SOLID', color: chipColor }];
    }
  }
  
  return chipFrame;
}