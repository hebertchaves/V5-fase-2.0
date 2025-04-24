// src/components/basic/button-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, getButtonText } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';
import { analyzeComponentColors, applyQuasarColors } from '../../utils/color-utils';
import { processIconComponent } from './icon-component';
import { logDebug, logError } from '../../utils/logger.js';

/**
 * Retorna o tamanho de fonte adequado para um botão baseado no tamanho
 */
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
    // Tamanhos do Quasar: xs, sm, md, lg, xl
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
  
  // 3. Processar ícones e texto
  
  // Variáveis para controle de conteúdo
  let hasLeftIcon = false;
  let hasRightIcon = false;
  let hasContent = false;
  
  // Verificar ícone à esquerda
  if (props.icon) {
    try {
      // Criar um nó de ícone a partir do nome
      const iconNode: QuasarNode = {
        tagName: 'q-icon',
        attributes: {
          name: props.icon,
          color: props.color || 'white',
          size: props.size || 'md',
          left: 'true'
        },
        childNodes: [],
        parentContext: {
          tagName: 'q-btn',
          attributes: node.attributes,
          isPrimaryComponent: true
        }
      };
      
      const iconComponent = await processIconComponent(iconNode, settings);
      
      // Processar tamanho do ícone
      const iconSize = getFontSizeForButtonSize(props.size) * 1.2;
      if ('resize' in iconComponent) {
        iconComponent.resize(Math.round(iconSize), Math.round(iconSize));
      }
      
      contentNode.insertChild(0, iconComponent);
      hasLeftIcon = true;
      hasContent = true;
    } catch (error) {
      console.error(`Erro ao processar ícone à esquerda: ${error}`);
    }
  }
  
  // Verificar ícone à direita
  if (props['icon-right']) {
    try {
      // Similar ao ícone à esquerda, mas com nome diferente
      const iconNode: QuasarNode = {
        tagName: 'q-icon',
        attributes: {
          name: props['icon-right'],
          color: props.color || 'white',
          size: props.size || 'md',
          right: 'true'
        },
        childNodes: [],
        parentContext: {
          tagName: 'q-btn',
          attributes: node.attributes,
          isPrimaryComponent: true
        }
      };
      
      const iconComponent = await processIconComponent(iconNode, settings);
      
      // Ajustar tamanho baseado no tamanho do botão
      const iconSize = getFontSizeForButtonSize(props.size) * 1.2;
      if ('resize' in iconComponent) {
        iconComponent.resize(Math.round(iconSize), Math.round(iconSize));
      }
      
      contentNode.appendChild(iconComponent);
      hasRightIcon = true;
      hasContent = true;
    } catch (error) {
      console.error(`Erro ao processar ícone à direita: ${error}`);
    }
  }
  
  // MELHORADO: Processar componentes filhos diretos (q-icon)
  for (const child of node.childNodes) {
    if (child.tagName === 'q-icon') {
      try {
        // Criar uma cópia do nó com o parentContext adequado
        const iconNodeWithContext: QuasarNode = {
          ...child,
          parentContext: {
            tagName: 'q-btn',
            attributes: node.attributes,
            isPrimaryComponent: true
          }
        };
        
        const iconComponent = await processIconComponent(iconNodeWithContext, settings);
        
        // Garantir tamanho adequado do ícone
        const iconSize = Math.max(24, getFontSizeForButtonSize(props.size) * 1.2);
        if ('resize' in iconComponent) {
          iconComponent.resize(iconSize, iconSize);
        }
        
        // Posicionar ícone corretamente
        const isLeftIcon = child.attributes?.left === 'true' || child.attributes?.left === '';
        if (isLeftIcon) {
          contentNode.insertChild(0, iconComponent);
          hasLeftIcon = true;
        } else {
          contentNode.appendChild(iconComponent);
          hasRightIcon = true;
        }
        
        hasContent = true;
      } catch (error) {
        console.error(`Erro ao processar ícone filho direto: ${error}`);
      }
    }
    else if (child.tagName === 'div') {
      try {
        // Processar div como conteúdo personalizado
        const customContent = figma.createFrame();
        customContent.name = "custom-content";
        customContent.layoutMode = "VERTICAL";
        customContent.primaryAxisSizingMode = "AUTO";
        customContent.counterAxisSizingMode = "AUTO";
        customContent.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
        
        // Procurar por texto dentro da div
        let divText = "";
        for (const textChild of child.childNodes) {
          if (textChild.tagName === '#text' && textChild.text) {
            divText += textChild.text.trim() + ' ';
          }
        }
        
        if (divText.trim()) {
          const textNode = await createText(divText.trim());
          customContent.appendChild(textNode);
          contentNode.appendChild(customContent);
          hasContent = true;
        }
      } catch (error) {
        console.error(`Erro ao processar div no botão: ${error}`);
      }
    }
    else if (child.tagName === '#text' && child.text && child.text.trim()) {
      // Texto direto
      try {
        const buttonText = child.text.trim();
        // Substituir <br> por quebras de linha reais
        const formattedText = buttonText.replace(/<br\s*\/?>/gi, '\n');
        
        const textNode = await createText(formattedText, {
          fontWeight: 'medium',
          fontSize: getFontSizeForButtonSize(props.size)
        });
        
        contentNode.appendChild(textNode);
        hasContent = true;
      } catch (error) {
        console.error(`Erro ao processar texto direto no botão: ${error}`);
      }
    }
  }
  
  // Verificar texto do botão apenas se não houver conteúdo processado
  if (!hasContent) {
    const buttonText = props.label || getButtonText(node);
    if (buttonText && buttonText !== '') {
      const textNode = await createText(buttonText, {
        fontWeight: 'medium',
        fontSize: getFontSizeForButtonSize(props.size)
      });
      
      if (textNode) {
        contentNode.appendChild(textNode);
      }
    } else {
      // Fallback: texto padrão
      const defaultText = await createText("Button", {
        fontWeight: 'medium',
        fontSize: getFontSizeForButtonSize(props.size)
      });
      contentNode.appendChild(defaultText);
    }
  }
  
  // Se estiver carregando, adicionar indicador de carregamento
  if (props.loading === 'true' || props.loading === '') {
    // Criar indicador de carregamento
    const loadingIndicator = figma.createFrame();
    loadingIndicator.name = "loading-indicator";
    loadingIndicator.resize(16, 16);
    loadingIndicator.cornerRadius = 8;
    loadingIndicator.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    contentNode.insertChild(0, loadingIndicator);
  }
  
  // Verificar se é um botão apenas com ícone (sem texto)
  const isIconOnlyButton = (hasLeftIcon || hasRightIcon) && contentNode.children.length === 1;
  
  // Para botões somente com ícone, remover padding horizontal extra
  if (isIconOnlyButton && props.round !== 'true' && props.round !== '') {
    wrapperNode.paddingLeft = wrapperNode.paddingTop;
    wrapperNode.paddingRight = wrapperNode.paddingTop;
  }
  
  // Aplicar estilo de forma ao botão
  if (props.rounded === 'true' || props.rounded === '') {
    buttonFrame.cornerRadius = 28; // Botão mais arredondado
  } else if (props.square === 'true' || props.square === '') {
    buttonFrame.cornerRadius = 0; // Sem arredondamento
  } else if (props.round === 'true' || props.round === '') {
    // Botão circular
    const maxPadding = Math.max(
      wrapperNode.paddingTop, 
      wrapperNode.paddingRight,
      wrapperNode.paddingBottom,
      wrapperNode.paddingLeft
    );
    
    // Ajustar padding para ser igual em todas as direções
    wrapperNode.paddingTop = maxPadding;
    wrapperNode.paddingRight = maxPadding;
    wrapperNode.paddingBottom = maxPadding;
    wrapperNode.paddingLeft = maxPadding;
    
    // Botão perfeitamente redondo
    buttonFrame.cornerRadius = 9999;
  }
  
  // MONTAR A ESTRUTURA HIERÁRQUICA
  wrapperNode.appendChild(contentNode);  // content dentro do wrapper
  buttonFrame.appendChild(wrapperNode);  // wrapper dentro do button principal
  
  // Aplicar cores do Quasar
  applyQuasarColors(buttonFrame, colorAnalysis, 'btn');

  return buttonFrame;
}