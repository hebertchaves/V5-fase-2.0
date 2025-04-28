// src/components/basic/button-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, getButtonText } from '../../utils/quasar-utils';
import {  createText } from '../../utils/figma-utils';
import {  logDebug } from '../../utils/logger';
import { analyzeComponentColors, getQuasarColor, getContrastingTextColor, applyQuasarColors } from '../../utils/color-utils';
import { getIconLibrary, getIconUnicode } from '../../utils/icon-utils';
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
  
  // Configuração básica do botão
  buttonFrame.layoutMode = "HORIZONTAL";
  buttonFrame.primaryAxisSizingMode = "AUTO";
  buttonFrame.counterAxisSizingMode = "AUTO";
  buttonFrame.primaryAxisAlignItems = "CENTER";
  buttonFrame.counterAxisAlignItems = "CENTER";
  buttonFrame.cornerRadius = 4;
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
 
  // Verificar se tem a classe full-width
  const hasFullWidth = node.attributes?.class?.includes('full-width') || false;
  
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
    // Tamanhos do Quasar conforme a implementação anterior
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
      default:
        // Padding padrão
        wrapperNode.paddingLeft = 16;
        wrapperNode.paddingRight = 16;
        wrapperNode.paddingTop = 8;
        wrapperNode.paddingBottom = 8;
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
  
  // Processar alinhamento interno do botão
  if (props.align) {
    switch (props.align) {
      case 'left':
        contentNode.primaryAxisAlignItems = "MIN";
        break;
      case 'right':
        contentNode.primaryAxisAlignItems = "MAX";
        break;
      case 'between':
        contentNode.primaryAxisAlignItems = "SPACE_BETWEEN";
        break;
      case 'around':
        contentNode.primaryAxisAlignItems = "SPACE_BETWEEN"; 
        break;
    }
  }
  
  // 3. Processar ícones e texto
  
  // Verificar se tem ícone à esquerda
  if (props.icon) {
    try {
      // Criar texto do ícone diretamente
      await figma.loadFontAsync({ family: "Material Icons", style: "Regular" });
      const iconText = figma.createText();
      iconText.name = `icon-${props.icon}`;
      iconText.fontName = { family: "Material Icons", style: "Regular" };
      
      // Usar o utilitário getIconUnicode se disponível, ou caractere padrão
      if (typeof getIconUnicode === 'function') {
        iconText.characters = getIconUnicode('material', props.icon) || "□";
      } else {
        iconText.characters = "□"; // Caractere de placeholder
      }
      
      iconText.fontSize = props.dense ? 18 : 24;
      contentNode.appendChild(iconText);
    } catch (error) {
      console.warn(`Erro ao criar ícone: ${error}`);
      // Fallback se Material Icons não estiver disponível
      const iconPlaceholder = figma.createRectangle();
      iconPlaceholder.name = `icon-placeholder-${props.icon}`;
      iconPlaceholder.resize(18, 18);
      iconPlaceholder.cornerRadius = 4;
      iconPlaceholder.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      contentNode.appendChild(iconPlaceholder);
    }
  }
  
  // Adicionar o texto do botão
  const buttonText = props.label || getButtonText(node);
  if (buttonText && buttonText !== '') {
    const textNode = await createText(buttonText, {
      fontWeight: 'medium',
      fontSize: props.size ? getFontSizeForButtonSize(props.size) : 14
    });
    
    if (textNode) {
      contentNode.appendChild(textNode);
    }
  }
  
  // Verificar se tem ícone à direita
  if (props['icon-right']) {
    try {
      // Criar texto do ícone diretamente
      await figma.loadFontAsync({ family: "Material Icons", style: "Regular" });
      const iconText = figma.createText();
      iconText.name = `icon-${props['icon-right']}`;
      iconText.fontName = { family: "Material Icons", style: "Regular" };
      
      // Usar o utilitário getIconUnicode se disponível, ou caractere padrão
      if (typeof getIconUnicode === 'function') {
        iconText.characters = getIconUnicode('material', props['icon-right']) || "□";
      } else {
        iconText.characters = "□"; // Caractere de placeholder
      }
      
      iconText.fontSize = props.dense ? 18 : 24;
      contentNode.appendChild(iconText);
    } catch (error) {
      console.warn(`Erro ao criar ícone: ${error}`);
      // Fallback se Material Icons não estiver disponível
      const iconPlaceholder = figma.createRectangle();
      iconPlaceholder.name = `icon-placeholder-${props['icon-right']}`;
      iconPlaceholder.resize(18, 18);
      iconPlaceholder.cornerRadius = 4;
      iconPlaceholder.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      contentNode.appendChild(iconPlaceholder);
    }
  }
  
  // MONTAR A ESTRUTURA HIERÁRQUICA - SEMPRE incluir essa estrutura
  wrapperNode.appendChild(contentNode);  // content dentro do wrapper
  buttonFrame.appendChild(wrapperNode);  // wrapper dentro do button principal
  
  // Aplicar cores do Quasar
  applyQuasarColors(buttonFrame, colorAnalysis, 'btn');

  // Verificar se tem a classe full-width - APLICAR DEPOIS de montar a estrutura
  if (hasFullWidth) {
    console.log('Aplicando full-width ao botão');
    
    // Aplica ao frame principal do botão
    buttonFrame.layoutAlign = "STRETCH";
    buttonFrame.layoutGrow = 1;
    buttonFrame.primaryAxisSizingMode = "FILL_CONTAINER";
    
    // Também aplicar ao wrapper para garantir que ele preencha o botão
    if (wrapperNode) {
      wrapperNode.layoutAlign = "STRETCH";
      wrapperNode.layoutGrow = 1;
      wrapperNode.primaryAxisSizingMode = "FILL_CONTAINER";
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