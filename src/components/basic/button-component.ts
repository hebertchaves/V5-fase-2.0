// src/components/basic/button-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, getButtonText } from '../../utils/quasar-utils';
import {  createText } from '../../utils/figma-utils';
import {  logDebug } from '../../utils/logger';
import { analyzeComponentColors, applyQuasarColors } from '../../utils/color-utils';
import { processIconComponent } from './icon-component';
import { processAvatarComponent } from '../basic/avatar-component';


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
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);

   // NOVO: Verificar explicitamente a classe full-width
   const hasFullWidth = node.attributes?.class?.includes('full-width');

  // Criar frame principal para o q-btn
  const buttonFrame = figma.createFrame();
  buttonFrame.name = "q-btn";
  buttonFrame.layoutMode = "HORIZONTAL";
  buttonFrame.primaryAxisSizingMode = hasFullWidth ? "FILL" : "AUTO"; // <-- MODIFICAÇÃO AQUI
  buttonFrame.counterAxisSizingMode = "AUTO";
  buttonFrame.primaryAxisAlignItems = "CENTER";
  buttonFrame.counterAxisAlignItems = "CENTER";
  buttonFrame.cornerRadius = 4;
  
  // Configuração básica do botão (código original)
  buttonFrame.layoutMode = "HORIZONTAL";
  buttonFrame.primaryAxisSizingMode = "AUTO";
  buttonFrame.counterAxisSizingMode = "AUTO";
  buttonFrame.primaryAxisAlignItems = "CENTER";
  buttonFrame.counterAxisAlignItems = "CENTER";
  buttonFrame.cornerRadius = 4;
  
  // NOVO: Se tiver full-width, garantir que a largura seja corretamente configurada
  if (hasFullWidth) {
    // Configurar constraints para garantir que o botão preencha o contêiner
    if ('constraints' in buttonFrame) {
      buttonFrame.constraints = { ...buttonFrame.constraints, horizontal: 'STRETCH' };
    }
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
  
  // Ajustar padding com base nas propriedades (código original)
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
  
  // AQUI COMEÇA A MODIFICAÇÃO: Usando uma abordagem mais controlada
  // Variáveis para controlar o que já foi processado
  let hasIcon = false;
  let hasText = false;
  
  // PASSO 1: Processar ícone via atributo (icon e icon-right)
  if (props.icon) {
    try {
      // Criar um nó de ícone a partir do nome
      const iconNode: QuasarNode = {
        tagName: 'q-icon',
        attributes: {
          name: props.icon,
          color: props.color || 'white', // Usar a mesma cor do botão ou branco por padrão
          size: props.dense ? 'sm' : props.size || 'md'
        },
        childNodes: [],
        parentContext: {
          tagName: 'q-btn',
          attributes: node.attributes,
          isPrimaryComponent: true
        }
      };
      
      const iconComponent = await processIconComponent(iconNode, settings);
      contentNode.insertChild(0, iconComponent);
      hasIcon = true;
    } catch (error) {
      console.error(`Erro ao processar ícone à esquerda: ${error}`);
    }
  }
  
  // PASSO 2: Processar label via atributo
  if (props.label) {
    try {
      const labelNode = await createText(props.label, {
        fontSize: getFontSizeForButtonSize(props.size),
        fontWeight: 'medium'
      });
      
      if (labelNode) {
        contentNode.appendChild(labelNode);
        hasText = true;
      }
    } catch (error) {
      console.error(`Erro ao processar label: ${error}`);
    }
  }
  
  // PASSO 3: Se não há label, processar nós filhos
  if (!hasText) {
    // Função recursiva para encontrar todos os ícones em um nó
    const findIcons = (node: QuasarNode): Array<QuasarNode> => {
      const icons: Array<QuasarNode> = [];
      
      if (node.tagName === 'q-icon') {
        icons.push(node);
      } else if (node.childNodes && node.childNodes.length > 0) {
        for (const child of node.childNodes) {
          icons.push(...findIcons(child));
        }
      }
      
      return icons;
    };
    
    // Função recursiva para extrair texto
    const extractText = (node: QuasarNode, excludeNodes: Array<QuasarNode> = []): string => {
      // Pular nós a serem excluídos
      if (excludeNodes.includes(node)) return '';
      
      if (node.tagName === '#text' && node.text) {
        return node.text.trim();
      } else if (node.tagName === 'br') {
        return '\n';
      } else if (node.childNodes && node.childNodes.length > 0) {
        return node.childNodes
          .map(child => extractText(child, excludeNodes))
          .filter(t => t)
          .join(' ');
      }
      
      return '';
    };
    
    // Processar todos os filhos do botão
    for (const child of node.childNodes) {
      if (child.tagName === 'q-icon') {
        // Ícone diretamente filho do botão
        try {
          const iconComponent = await processIconComponent({
            ...child,
            parentContext: {
              tagName: 'q-btn',
              attributes: node.attributes,
              isPrimaryComponent: true
            }
          }, settings);
          
          contentNode.appendChild(iconComponent);
          hasIcon = true;
        } catch (error) {
          console.error(`Erro ao processar ícone filho: ${error}`);
        }
      } else if (child.tagName === 'q-avatar') {
        // Avatar
        try {
          const avatarComponent = await processAvatarComponent({
            ...child,
            parentContext: {
              tagName: 'q-btn',
              attributes: node.attributes,
              isPrimaryComponent: true
            }
          }, settings);
          
          contentNode.appendChild(avatarComponent);
          hasText = true; // Tratar avatar como conteúdo principal
        } catch (error) {
          console.error(`Erro ao processar avatar: ${error}`);
        }
      } else if (child.tagName === 'div') {
        // Div que pode conter ícones e texto
        try {
          // Encontrar ícones dentro da div
          const iconsInDiv = findIcons(child);
          
          // Processar ícones encontrados
          for (const iconNode of iconsInDiv) {
            try {
              const iconComponent = await processIconComponent({
                ...iconNode,
                parentContext: {
                  tagName: 'q-btn',
                  attributes: node.attributes,
                  isPrimaryComponent: true
                }
              }, settings);
              
              contentNode.appendChild(iconComponent);
              hasIcon = true;
            } catch (error) {
              console.error(`Erro ao processar ícone dentro de div: ${error}`);
            }
          }
          
          // Extrair texto, excluindo ícones
          const textContent = extractText(child, iconsInDiv).trim();
          
          if (textContent) {
            const textNode = await createText(textContent, {
              fontSize: getFontSizeForButtonSize(props.size),
              fontWeight: 'medium'
            });
            
            if (textNode) {
              contentNode.appendChild(textNode);
              hasText = true;
            }
          }
        } catch (error) {
          console.error(`Erro ao processar div: ${error}`);
        }
      } else if (child.tagName === '#text' && child.text && child.text.trim()) {
        // Texto direto
        try {
          const text = child.text.trim();
          const lines = text.split(/<br\s*\/?>/);
          
          for (const line of lines) {
            if (line.trim()) {
              const textNode = await createText(line.trim(), {
                fontSize: getFontSizeForButtonSize(props.size),
                fontWeight: 'medium'
              });
              
              if (textNode) {
                contentNode.appendChild(textNode);
                hasText = true;
              }
            }
          }
        } catch (error) {
          console.error(`Erro ao processar texto: ${error}`);
        }
      }
    }
  }
  
  // PASSO 4: Se ainda não há conteúdo, adicionar texto padrão
  if (!hasText && !hasIcon) {
    try {
      const defaultText = await createText("Button", {
        fontSize: getFontSizeForButtonSize(props.size),
        fontWeight: 'medium'
      });
      
      if (defaultText) {
        contentNode.appendChild(defaultText);
      }
    } catch (error) {
      console.error(`Erro ao adicionar texto padrão: ${error}`);
    }
  }
  
  // MONTAR A ESTRUTURA HIERÁRQUICA
  wrapperNode.appendChild(contentNode);  // content dentro do wrapper
  buttonFrame.appendChild(wrapperNode);  // wrapper dentro do button principal
  
  // Aplicar cores do Quasar (manter o código original)
  applyQuasarColors(buttonFrame, colorAnalysis, 'btn');
  
  return buttonFrame;
}