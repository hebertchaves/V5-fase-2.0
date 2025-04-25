// src/components/basic/button-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, getButtonText } from '../../utils/quasar-utils';
import {  createText } from '../../utils/figma-utils';
import {  logDebug } from '../../utils/logger';
import { analyzeComponentColors, getQuasarColor, getContrastingTextColor, applyQuasarColors } from '../../utils/color-utils';
import { processIconComponent } from './icon-component';
import { processAvatarComponent } from '../basic/avatar-component';


/**
 * Processa um componente de botão Quasar (q-btn)
 */
export async function processButtonComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  logDebug('button', `Processando botão: ${JSON.stringify(node.attributes)}`);

  // Criar frame principal para o q-btn
  const buttonFrame = figma.createFrame();
  buttonFrame.name = "q-btn";
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // IMPORTANTE: Verificar full-width ANTES de configurar o layout, não depois
  const isFullWidth = props.fullWidth === 'true' || props.fullWidth === '' || 
                      (props.class && props.class.includes('full-width'));
  
  // Configuração básica do botão
  buttonFrame.layoutMode = "HORIZONTAL";
  buttonFrame.primaryAxisSizingMode = "AUTO";
  buttonFrame.counterAxisSizingMode = "AUTO";
  buttonFrame.primaryAxisAlignItems = "CENTER";
  buttonFrame.counterAxisAlignItems = "CENTER";
  buttonFrame.cornerRadius = 4;
  
  // Se for full-width, ajustar nome e largura
  if (isFullWidth) {
    buttonFrame.name = "q-btn (full-width)";
    // Usar uma largura fixa grande para simular full-width
    buttonFrame.resize(400, buttonFrame.height);
  }
 
  // Analisar configurações de cor do componente
  const colorAnalysis = analyzeComponentColors(node);
  
  // ESTRUTURA HIERÁRQUICA CORRETA - 1. Criar o wrapper
  const wrapperNode = figma.createFrame();
  wrapperNode.name = "q-btn__wrapper";
  wrapperNode.layoutMode = "HORIZONTAL";
  wrapperNode.primaryAxisSizingMode = "AUTO";
  wrapperNode.counterAxisSizingMode = "AUTO";
  wrapperNode.primaryAxisAlignItems = "CENTER";
  wrapperNode.counterAxisAlignItems = "CENTER";
  wrapperNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
  // Ajustar padding com base nas propriedades
  if (props.dense === 'true' || props.dense === '') {
    wrapperNode.paddingLeft = 8;
    wrapperNode.paddingRight = 8;
    wrapperNode.paddingTop = 4;
    wrapperNode.paddingBottom = 4;
  } else if (props.size) {
    // Usar o código existente para ajustar tamanho baseado em props.size
    switch(props.size) {
      case 'xs':
        wrapperNode.paddingLeft = 8;
        wrapperNode.paddingRight = 8;
        wrapperNode.paddingTop = 4;
        wrapperNode.paddingBottom = 4;
        break;
      case 'sm':
        wrapperNode.paddingLeft = 10;
        wrapperNode.paddingRight = 10;
        wrapperNode.paddingTop = 6;
        wrapperNode.paddingBottom = 6;
        break;
      case 'md':
        wrapperNode.paddingLeft = 16;
        wrapperNode.paddingRight = 16;
        wrapperNode.paddingTop = 8;
        wrapperNode.paddingBottom = 8;
        break;
      case 'lg':
        wrapperNode.paddingLeft = 20;
        wrapperNode.paddingRight = 20;
        wrapperNode.paddingTop = 12;
        wrapperNode.paddingBottom = 12;
        break;
      case 'xl':
        wrapperNode.paddingLeft = 24;
        wrapperNode.paddingRight = 24;
        wrapperNode.paddingTop = 16;
        wrapperNode.paddingBottom = 16;
        break;
    }
  } else {
    // Padding padrão
    wrapperNode.paddingLeft = 16;
    wrapperNode.paddingRight = 16;
    wrapperNode.paddingTop = 8;
    wrapperNode.paddingBottom = 8;
  }
  
  // 2. Criar o content
  const contentNode = figma.createFrame();
  contentNode.name = "q-btn__content";
  contentNode.layoutMode = "HORIZONTAL";
  contentNode.primaryAxisSizingMode = "AUTO";
  contentNode.counterAxisSizingMode = "AUTO";
  contentNode.primaryAxisAlignItems = "CENTER";
  contentNode.counterAxisAlignItems = "CENTER";
  contentNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  contentNode.itemSpacing = 8;
  
  // Processar ícones se existirem
  let hasLeftIcon = false;
  let hasRightIcon = false;
  
  // Ícone à esquerda
  if (props.icon) {
    // Código para processar ícone à esquerda
    hasLeftIcon = true;
  }
  
  // Ícone à direita
  if (props['icon-right']) {
    // Código para processar ícone à direita
    hasRightIcon = true;
  }
  
  // Verificar texto do botão
  const buttonText = props.label || getButtonText(node);
  if (buttonText && buttonText !== '') {
    const textNode = await createText(buttonText, {
      fontWeight: 'medium',
      fontSize: getFontSizeForButtonSize(props.size)
    });
    
    if (textNode) {
      contentNode.appendChild(textNode);
    }
  }
  
  // MONTAR A ESTRUTURA HIERÁRQUICA - CRUCIAL
  wrapperNode.appendChild(contentNode);  // content dentro do wrapper
  buttonFrame.appendChild(wrapperNode);  // wrapper dentro do button principal
  
  // Aplicar cores do Quasar diretamente
  if (colorAnalysis.mainColor) {
    const mainColorRGB = getQuasarColor(colorAnalysis.mainColor);
    if (mainColorRGB) {
      buttonFrame.fills = [{ type: 'SOLID', color: mainColorRGB }];
      
      // Encontrar e ajustar cor do texto, se existir
      for (const child of buttonFrame.findAll(node => node.type === 'TEXT')) {
        const textNode = child as TextNode;
        const textColor = colorAnalysis.textColor 
          ? getQuasarColor(colorAnalysis.textColor) 
          : getContrastingTextColor(mainColorRGB);
          
        textNode.fills = [{ type: 'SOLID', color: textColor }];
      }
    }
  }
   
  return buttonFrame;
}
// Função auxiliar já existente
function getFontSizeForButtonSize(size?: string): number {
  if (!size) return 14; // tamanho padrão
  
  switch (size) {
    case 'xs': return 12;
    case 'sm': return 13;
    case 'md': return 14;
    case 'lg': return 16;
    case 'xl': return 18;
    default: return 14;
  }
}

// Função auxiliar para encontrar nós de texto em uma estrutura
function findTextNodesInChildren(node: FrameNode): TextNode[] {
  const textNodes: TextNode[] = [];
  
  if (!node || !('children' in node)) {
    return textNodes;
  }
  
  for (const child of node.children) {
    if (child.type === 'TEXT') {
      textNodes.push(child as TextNode);
    } else if ('children' in child) {
      // Recursivamente buscar em nós filhos
      const childTextNodes = findTextNodesInChildren(child as FrameNode);
      textNodes.push(...childTextNodes);
    }
  }
  
  return textNodes;
}