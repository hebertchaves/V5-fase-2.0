// src/components/form/select-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText, setNodeSize } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

type QuasarColorKey = keyof typeof quasarColors;

function isQuasarColorKey(key: string): key is QuasarColorKey {
  return key in quasarColors;
}

/**
 * Processa um componente select Quasar (q-select)
 */
export async function processSelectComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const selectFrame = figma.createFrame();
  selectFrame.name = "q-select";
  
  // Configuração básica
  selectFrame.layoutMode = "VERTICAL";
  selectFrame.primaryAxisSizingMode = "AUTO";
  selectFrame.counterAxisSizingMode = "AUTO";
  selectFrame.itemSpacing = 4;
  selectFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Criar label se existir
  if (props.label) {
    const labelNode = await createText(props.label, {
      fontSize: 14,
      fontWeight: 'medium',
      color: { r: 0.4, g: 0.4, b: 0.4 }
    });
    if (labelNode) {
      labelNode.name = "q-select__label";
      selectFrame.appendChild(labelNode);
    }
  }
  
  // Container para o select
  const controlFrame = figma.createFrame();
  controlFrame.name = "q-select__control";
  controlFrame.layoutMode = "HORIZONTAL";
  controlFrame.primaryAxisSizingMode = "FIXED";
  controlFrame.counterAxisSizingMode = "AUTO";
  controlFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
  controlFrame.counterAxisAlignItems = "CENTER";
  setNodeSize(controlFrame, 250);
  controlFrame.paddingLeft = 12;
  controlFrame.paddingRight = 12;
  controlFrame.paddingTop = 8;
  controlFrame.paddingBottom = 8;
  
  // Definir estilo do select baseado nas props
  if (props.filled) {
    controlFrame.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }];
    controlFrame.cornerRadius = 4;
  } else if (props.outlined || props.standout) {
    controlFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    controlFrame.cornerRadius = 4;
    controlFrame.strokeWeight = 1;
    controlFrame.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
  } else {
    // Estilo padrão - underline
    controlFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    controlFrame.strokeWeight = 1;
    controlFrame.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
    controlFrame.strokeBottomWeight = 1;
    controlFrame.strokeTopWeight = 0;
    controlFrame.strokeLeftWeight = 0;
    controlFrame.strokeRightWeight = 0;
  }
  
  // Definir cor do select baseado na prop color
  if (props.color && isQuasarColorKey(props.color) && settings.preserveQuasarColors) {
    if (props.filled) {
      // Para filled, ajustamos a cor com opacidade
      const color = quasarColors[props.color];
      controlFrame.fills = [{ 
        type: 'SOLID', 
        color: color,
        opacity: 0.1
      }];
    } else {
      // Para outros estilos, ajustamos a borda
      controlFrame.strokes = [{ type: 'SOLID', color: quasarColors[props.color] }];
    }
  }
  
  // Adicionar texto de seleção/placeholder
  const displayText = props.displayValue || 
                      props.placeholder || 
                      props.label || 
                      "Selecione uma opção";
  
  const selectText = await createText(displayText, {
    fontSize: 14,
    color: props.displayValue ? { r: 0, g: 0, b: 0 } : { r: 0.6, g: 0.6, b: 0.6 }
  });
  if (selectText) {
    selectText.name = "q-select__display-value";
    controlFrame.appendChild(selectText);
  }
  
  // Adicionar ícone de dropdown
  const dropdownIcon = figma.createFrame();
  dropdownIcon.name = "q-select__dropdown-icon";
  dropdownIcon.resize(24, 24);
  dropdownIcon.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 }, opacity: 0 }];
  
  const arrowText = await createText("▼", {
    fontSize: 10,
    color: { r: 0.6, g: 0.6, b: 0.6 },
    alignment: 'CENTER',
    verticalAlignment: 'CENTER'
  });
  if (arrowText) {
    dropdownIcon.appendChild(arrowText);
  }
  
  controlFrame.appendChild(dropdownIcon);
  selectFrame.appendChild(controlFrame);
  
  // Adicionar mensagem de erro se houver
  if (props.error || props['error-message']) {
    const errorNode = await createText(props['error-message'] || "Erro", {
      fontSize: 12,
      color: { r: 0.9, g: 0.2, b: 0.2 }
    });
    if (errorNode) {
      errorNode.name = "q-select__error";
      selectFrame.appendChild(errorNode);
    }
  }
  
  // Adicionar hint se houver
  if (props.hint && !props.error) {
    const hintNode = await createText(props.hint, {
      fontSize: 12,
      color: { r: 0.6, g: 0.6, b: 0.6 }
    });
    if (hintNode) {
      hintNode.name = "q-select__hint";
      selectFrame.appendChild(hintNode);
    }
  }
  
  return selectFrame;
}