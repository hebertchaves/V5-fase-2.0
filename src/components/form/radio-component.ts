// src/components/form/radio-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

// Remover importação incorreta
// import { FrameNode, EllipseNode } from '@figma/plugin-typings';

type QuasarColorKey = keyof typeof quasarColors;

function isQuasarColorKey(key: string): key is QuasarColorKey {
  return key in quasarColors;
}

/**
 * Processa um componente radio Quasar (q-radio)
 */
export async function processRadioComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  // Criação de FrameNode sem type assertion específica
  const radioFrame = figma.createFrame();
  radioFrame.name = "q-radio";
  
  // Configuração básica
  radioFrame.layoutMode = "HORIZONTAL";
  radioFrame.primaryAxisSizingMode = "AUTO";
  radioFrame.counterAxisSizingMode = "AUTO";
  radioFrame.primaryAxisAlignItems = "CENTER";
  radioFrame.counterAxisAlignItems = "CENTER";
  radioFrame.itemSpacing = 8;
  
  // Definição de fills de forma mais segura
  radioFrame.fills = [{ 
    type: 'SOLID', 
    color: { r: 1, g: 1, b: 1 }, 
    opacity: 0 
  }];
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Cor do radio
  let radioColor = quasarColors.primary;
  if (props.color && isQuasarColorKey(props.color) && settings.preserveQuasarColors) {
    radioColor = quasarColors[props.color];
  }
  
  // Criar o círculo do radio
  const circleFrame = figma.createEllipse();
  circleFrame.name = "q-radio__inner";
  circleFrame.resize(20, 20);
  
  // Definição de fills para o círculo
  circleFrame.fills = [{ 
    type: 'SOLID', 
    color: { r: 1, g: 1, b: 1 } 
  }];
  
  // Verificar se está marcado
  const isChecked = props.value === 'true' || 
                    extractAttributeValue(props, 'value') === extractAttributeValue(props, 'val') ||
                    props.checked === 'true';
  
  if (isChecked && settings.preserveQuasarColors) {
    // Estilo marcado
    circleFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    // Adicionar strokes
    circleFrame.strokes = [{ type: 'SOLID', color: radioColor }];
    circleFrame.strokeWeight = 2;
    
    // Adicionar o círculo interno
    const innerCircle = figma.createEllipse();
    innerCircle.name = "q-radio__dot";
    innerCircle.resize(10, 10);
    innerCircle.x = 5;
    innerCircle.y = 5;
    
    // Definição de fills para o círculo interno
    innerCircle.fills = [{ type: 'SOLID', color: radioColor }];
    
    // Criar um frame container para conter o círculo e seu indicador interno
    const circleContainer = figma.createFrame();
    circleContainer.name = "q-radio__container";
    circleContainer.resize(20, 20);
    
    // Definição de fills para o container
    circleContainer.fills = [{ 
      type: 'SOLID', 
      color: { r: 1, g: 1, b: 1 }, 
      opacity: 0 
    }];
    
    circleContainer.appendChild(circleFrame);
    circleContainer.appendChild(innerCircle);
    radioFrame.appendChild(circleContainer);
    
  } else {
    // Estilo desmarcado
    circleFrame.fills = [{ 
      type: 'SOLID', 
      color: { r: 1, g: 1, b: 1 } 
    }];
    
    circleFrame.strokes = [{ 
      type: 'SOLID', 
      color: { r: 0.7, g: 0.7, b: 0.7 } 
    }];
    circleFrame.strokeWeight = 1;
    radioFrame.appendChild(circleFrame);
  }
  
  // Adicionar label
  if (props.label) {
    const labelNode = await createText(props.label, {
      fontSize: 14
    });
    if (labelNode) {
      labelNode.name = "q-radio__label";
      radioFrame.appendChild(labelNode);
    }
  }
  
  // Adicionar estilo disabled se necessário
  if (props.disable === 'true' || props.disable === '') {
    // Aplicar estilo desabilitado
    const circleNode = radioFrame.findChild(node => 
      node.name === "q-radio__container" || node.name === "q-radio__inner"
    );
    if ('opacity' in circleNode) {
      (circleNode as any).opacity = 0.5;
    }
    
    if (props.label) {
      const labelNode = radioFrame.findChild(node => node.name === "q-radio__label") as TextNode;
      if (labelNode) {
        labelNode.opacity = 0.5;
      }
    }
  }
  
  return radioFrame;
}

// Função auxiliar para extrair valor de atributo
function extractAttributeValue(props: Record<string, string>, key: string): string {
  if (key in props) {
    return props[key];
  }
  return '';
}