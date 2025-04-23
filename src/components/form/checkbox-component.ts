// src/components/form/checkbox-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

type QuasarColorKey = keyof typeof quasarColors;

function isQuasarColorKey(key: string): key is QuasarColorKey {
  return key in quasarColors;
}

/**
 * Processa um componente checkbox Quasar (q-checkbox)
 */
export async function processCheckboxComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const checkboxFrame = figma.createFrame();
  checkboxFrame.name = "q-checkbox";
  
  // Configuração básica
  checkboxFrame.layoutMode = "HORIZONTAL";
  checkboxFrame.primaryAxisSizingMode = "AUTO";
  checkboxFrame.counterAxisSizingMode = "AUTO";
  checkboxFrame.primaryAxisAlignItems = "CENTER";
  checkboxFrame.counterAxisAlignItems = "CENTER";
  checkboxFrame.itemSpacing = 8;
  checkboxFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Cor do checkbox
  let checkColor = quasarColors.primary;
  if (props.color && isQuasarColorKey(props.color) && settings.preserveQuasarColors) {
    checkColor = quasarColors[props.color];
  }
  
  // Criar o box do checkbox
  const boxFrame = figma.createFrame();
  boxFrame.name = "q-checkbox__inner";
  boxFrame.resize(20, 20);
  boxFrame.cornerRadius = 4;
  
  // Verificar se está marcado
  const isChecked = props.value === 'true' || props.checked === 'true' ||
                    'value' in props || 'checked' in props;
  
  if (isChecked && settings.preserveQuasarColors) {
    // Estilo marcado
    boxFrame.fills = [{ type: 'SOLID', color: checkColor }];
    
    // Adicionar símbolo de check
    const checkText = await createText("✓", {
      fontSize: 14,
      color: { r: 1, g: 1, b: 1 },
      alignment: 'CENTER',
      verticalAlignment: 'CENTER'
    });
    if (checkText) {
      boxFrame.appendChild(checkText);
    }
  } else {
    // Estilo desmarcado
    boxFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    boxFrame.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } }];
    boxFrame.strokeWeight = 1;
  }
  
  checkboxFrame.appendChild(boxFrame);
  
  // Adicionar label
  if (props.label) {
    const labelNode = await createText(props.label, {
      fontSize: 14
    });
    if (labelNode) {
      labelNode.name = "q-checkbox__label";
      checkboxFrame.appendChild(labelNode);
    }
  }
  
  // Adicionar estilo disabled se necessário
  if (props.disable === 'true' || props.disable === '') {
    // Aplicar estilo desabilitado
    boxFrame.opacity = 0.5;
    if (props.label) {
      const labelNode = checkboxFrame.findChild(node => node.name === "q-checkbox__label") as TextNode;
      if (labelNode) {
        labelNode.opacity = 0.5;
      }
    }
  }
  
  return checkboxFrame;
}