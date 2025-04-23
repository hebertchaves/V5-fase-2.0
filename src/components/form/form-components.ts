import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText, setNodeSize, createShadowEffect } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';
import { processButtonComponent } from '../basic/button-component';

// Tipo de utilitário para verificar cores válidas
type QuasarColorKey = keyof typeof quasarColors;

// Verifica se uma string é uma chave de cor válida do Quasar
function isQuasarColorKey(key: string): key is QuasarColorKey {
  return key in quasarColors;
}

/**
 * Processa componentes de formulário Quasar
 */
export async function processFormComponents(node: QuasarNode, componentType: string, settings: PluginSettings): Promise<FrameNode> {
  const tagName = node.tagName.toLowerCase();
  
  switch (tagName) {
    case 'q-btn':
      return await processButtonComponent(node, settings);
      
    case 'q-input':
      return await processQInput(node, settings);
      
    case 'q-select':
      return await processQSelect(node, settings);
      
    case 'q-checkbox':
      return await processQCheckbox(node, settings);
      
    case 'q-radio':
      return await processQRadio(node, settings);
      
    case 'q-toggle':
      return await processQToggle(node, settings);
      
    case 'q-form':
      return await processQForm(node, settings);
      
    case 'q-field':
      return await processQField(node, settings);
      
    default:
      // Para componentes de formulário não implementados
      const fallbackFrame = figma.createFrame();
      fallbackFrame.name = tagName;
      fallbackFrame.layoutMode = "VERTICAL";
      fallbackFrame.primaryAxisSizingMode = "AUTO";
      fallbackFrame.counterAxisSizingMode = "AUTO";
      
      const textNode = await createText(`Componente ${tagName} (não implementado)`);
      if (textNode) {
        fallbackFrame.appendChild(textNode);
      }
      
      return fallbackFrame;
  }
}

/**
 * Processa um componente q-input
 */
async function processQInput(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
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
  setNodeSize(controlFrame, 250); // Usar função segura em vez de width direto
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

/**
 * Processa um componente q-select
 */
async function processQSelect(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  // Base semelhante ao q-input
  const selectFrame = await processQInput(node, settings);
  selectFrame.name = "q-select";
  
  // Adicionar ícone de dropdown
  const controlFrame = selectFrame.findChild(n => n.name === "q-input__control") as FrameNode | null;
  if (controlFrame) {
    const dropdownIcon = figma.createFrame();
    dropdownIcon.name = "q-select__dropdown-icon";
    dropdownIcon.resize(16, 16);
    dropdownIcon.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
    
    // Adicionar símbolo de seta
    const arrowText = await createText("▼", {
      fontSize: 10,
      color: { r: 0.6, g: 0.6, b: 0.6 }
    });
    if (arrowText) {
      dropdownIcon.appendChild(arrowText);
    }
    
    // Adicionar o ícone ao final
    controlFrame.appendChild(dropdownIcon);
  }
  
  return selectFrame;
}

/**
 * Processa um componente q-checkbox
 */
async function processQCheckbox(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const checkboxFrame = figma.createFrame();
  checkboxFrame.name = "q-checkbox";
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
  
  return checkboxFrame;
}

/**
 * Processa um componente q-radio
 */
async function processQRadio(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const radioFrame = figma.createFrame();
  radioFrame.name = "q-radio";
  radioFrame.layoutMode = "HORIZONTAL";
  radioFrame.primaryAxisSizingMode = "AUTO";
  radioFrame.counterAxisSizingMode = "AUTO";
  radioFrame.primaryAxisAlignItems = "CENTER";
  radioFrame.counterAxisAlignItems = "CENTER";
  radioFrame.itemSpacing = 8;
  radioFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
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
  
  // Verificar se está marcado
  const isChecked = props.value === 'true' || 'value' in props;
  
  if (isChecked && settings.preserveQuasarColors) {
    // Estilo marcado
    circleFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    circleFrame.strokes = [{ type: 'SOLID', color: radioColor }];
    circleFrame.strokeWeight = 2;
    
    // Adicionar o círculo interno
    const innerCircle = figma.createEllipse();
    innerCircle.name = "q-radio__dot";
    innerCircle.resize(10, 10);
    innerCircle.x = 5;
    innerCircle.y = 5;
    innerCircle.fills = [{ type: 'SOLID', color: radioColor }];
    
    // Criar um frame container para conter o círculo e seu indicador interno
    const circleContainer = figma.createFrame();
    circleContainer.name = "q-radio__container";
    circleContainer.resize(20, 20);
    circleContainer.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
    circleContainer.appendChild(circleFrame);
    circleContainer.appendChild(innerCircle);
    radioFrame.appendChild(circleContainer);
    
  } else {
    // Estilo desmarcado
    circleFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    circleFrame.strokes = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } }];
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
  
  return radioFrame;
}

/**
 * Processa um componente q-toggle
 */
async function processQToggle(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const toggleFrame = figma.createFrame();
  toggleFrame.name = "q-toggle";
  toggleFrame.layoutMode = "HORIZONTAL";
  toggleFrame.primaryAxisSizingMode = "AUTO";
  toggleFrame.counterAxisSizingMode = "AUTO";
  toggleFrame.primaryAxisAlignItems = "CENTER";
  toggleFrame.counterAxisAlignItems = "CENTER";
  toggleFrame.itemSpacing = 8;
  toggleFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Cor do toggle
  let toggleColor = quasarColors.primary;
  if (props.color && isQuasarColorKey(props.color) && settings.preserveQuasarColors) {
    toggleColor = quasarColors[props.color];
  }
  
  // Criar o track do toggle
  const trackFrame = figma.createFrame();
  trackFrame.name = "q-toggle__track";
  trackFrame.resize(36, 14);
  trackFrame.cornerRadius = 7;
  
  // Verificar se está ativado
  const isActive = props.value === 'true' || props.checked === 'true' ||
                  'value' in props || 'checked' in props;
  
  // Definir cor do track com base no estado
  if (isActive && settings.preserveQuasarColors) {
    trackFrame.fills = [{ type: 'SOLID', color: toggleColor, opacity: 0.5 }];
  } else {
    trackFrame.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 }, opacity: 0.3 }];
  }
  
  // Criar o thumb do toggle
  const thumbFrame = figma.createFrame();
  thumbFrame.name = "q-toggle__thumb";
  thumbFrame.resize(20, 20);
  thumbFrame.cornerRadius = 10;
  
  // Posicionar o thumb conforme o estado
  if (isActive) {
    thumbFrame.x = 16;
    thumbFrame.y = -3;
    thumbFrame.fills = [{ type: 'SOLID', color: toggleColor }];
  } else {
    thumbFrame.x = 0;
    thumbFrame.y = -3;
    thumbFrame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  }
  
  // Adicionar sombra ao thumb
  thumbFrame.effects = [
    createShadowEffect(0, 1, 3, 0.2)
  ];
  
  trackFrame.appendChild(thumbFrame);
  toggleFrame.appendChild(trackFrame);
  
  // Adicionar label
  if (props.label) {
    const labelNode = await createText(props.label, {
      fontSize: 14
    });
    if (labelNode) {
      labelNode.name = "q-toggle__label";
      toggleFrame.appendChild(labelNode);
    }
  }
  
  return toggleFrame;
}

/**
 * Processa um componente q-form
 */
async function processQForm(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const formFrame = figma.createFrame();
  formFrame.name = "q-form";
  formFrame.layoutMode = "VERTICAL";
  formFrame.primaryAxisSizingMode = "AUTO";
  formFrame.counterAxisSizingMode = "AUTO";
  formFrame.itemSpacing = 16;
  formFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Processar filhos
  for (const child of node.childNodes) {
    if (!child.tagName || child.tagName === '#text') continue;
    
    try {
      // Processar componente filho
      const childComponent = await processFormComponents(child, child.tagName.toLowerCase(), settings);
      if (childComponent) {
        formFrame.appendChild(childComponent);
      }
    } catch (error) {
      console.error(`Erro ao processar filho do form (${child.tagName}):`, error);
    }
  }
  
  // Se não tiver filhos, adicionar um exemplo de campo
  if (formFrame.children.length === 0) {
    const exampleInput = await processQInput({
      tagName: 'q-input',
      attributes: {
        label: 'Exemplo de campo',
        outlined: 'true'
      },
      childNodes: []
    }, settings);
    
    formFrame.appendChild(exampleInput);
  }
  
  return formFrame;
}

/**
 * Processa um componente q-field
 */
async function processQField(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const fieldFrame = figma.createFrame();
  fieldFrame.name = "q-field";
  fieldFrame.layoutMode = "VERTICAL";
  fieldFrame.primaryAxisSizingMode = "AUTO";
  fieldFrame.counterAxisSizingMode = "AUTO";
  fieldFrame.itemSpacing = 4;
  fieldFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
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
      labelNode.name = "q-field__label";
      fieldFrame.appendChild(labelNode);
    }
  }
  
  // Container para o campo
  const controlFrame = figma.createFrame();
  controlFrame.name = "q-field__control";
  controlFrame.layoutMode = "HORIZONTAL";
  controlFrame.primaryAxisSizingMode = "FIXED";
  controlFrame.counterAxisSizingMode = "AUTO";
  setNodeSize(controlFrame, 250); // Usar função segura em vez de width direto
  controlFrame.paddingLeft = 12;
  controlFrame.paddingRight = 12;
  controlFrame.paddingTop = 8;
  controlFrame.paddingBottom = 8;
  controlFrame.itemSpacing = 8;
  
  // Definir aparência do field
  controlFrame.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }];
  controlFrame.cornerRadius = 4;
  
  // Processar conteúdo personalizado do field
  // (Em um cenário real, precisaríamos processar os slots, mas vamos simplificar)
  
  // Texto padrão para o conteúdo
  const contentText = await createText("Conteúdo do field", {
    fontSize: 14,
    color: { r: 0.3, g: 0.3, b: 0.3 }
  });
  
  if (contentText) {
    controlFrame.appendChild(contentText);
  }
  
  fieldFrame.appendChild(controlFrame);
  
  // Adicionar mensagem de erro/hint
  if (props.hint && !props.error) {
    const hintNode = await createText(props.hint, {
      fontSize: 12,
      color: { r: 0.6, g: 0.6, b: 0.6 }
    });
    if (hintNode) {
      fieldFrame.appendChild(hintNode);
    }
  }
  
  return fieldFrame;
}