// src/components/form/input-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText, setNodeSize } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

// Tipo de utilitário para verificar cores válidas
type QuasarColorKey = keyof typeof quasarColors;

// Verifica se uma string é uma chave de cor válida do Quasar
function isQuasarColorKey(key: string): key is QuasarColorKey {
  return key in quasarColors;
}

/**
 * Processa um componente de entrada Quasar (q-input)
 */
export async function processInputComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const inputFrame = figma.createFrame();
  inputFrame.name = "q-input";
  
  // Configuração básica
  inputFrame.layoutMode = "VERTICAL";
  inputFrame.primaryAxisSizingMode = "AUTO";
  inputFrame.counterAxisSizingMode = "AUTO";
  inputFrame.itemSpacing = 4;
  inputFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
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
      labelNode.name = "q-input__label";
      inputFrame.appendChild(labelNode);
    }
  }
  
  // Container para o input
  const controlFrame = figma.createFrame();
  controlFrame.name = "q-input__control";
  controlFrame.layoutMode = "HORIZONTAL";
  controlFrame.primaryAxisSizingMode = "FIXED";
  controlFrame.counterAxisSizingMode = "AUTO";
  setNodeSize(controlFrame, 250);
  controlFrame.paddingLeft = 12;
  controlFrame.paddingRight = 12;
  controlFrame.paddingTop = 8;
  controlFrame.paddingBottom = 8;
  controlFrame.itemSpacing = 8;
  
  // Definir estilo do input baseado nas props
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
  
  // Definir cor do input baseado na prop color
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
  
  // Adicionar texto de placeholder/valor
  const inputText = await createText(props.placeholder || props.label || props.hint || "Valor", {
    fontSize: 14,
    color: { r: 0.6, g: 0.6, b: 0.6 }
  });
  if (inputText) {
    inputText.name = "q-input__native";
    controlFrame.appendChild(inputText);
  }
  
  inputFrame.appendChild(controlFrame);
  
  // Adicionar mensagem de erro se houver
  if (props.error || props['error-message']) {
    const errorNode = await createText(props['error-message'] || "Erro", {
      fontSize: 12,
      color: { r: 0.9, g: 0.2, b: 0.2 }
    });
    if (errorNode) {
      errorNode.name = "q-input__error";
      inputFrame.appendChild(errorNode);
    }
  }
  
  // Adicionar hint se houver
  if (props.hint && !props.error) {
    const hintNode = await createText(props.hint, {
      fontSize: 12,
      color: { r: 0.6, g: 0.6, b: 0.6 }
    });
    if (hintNode) {
      hintNode.name = "q-input__hint";
      inputFrame.appendChild(hintNode);
    }
  }
  
  return inputFrame;
}