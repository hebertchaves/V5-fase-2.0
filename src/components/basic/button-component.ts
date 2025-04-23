// src/components/basic/button-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, getButtonText } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';
import { analyzeComponentColors, applyQuasarColors } from '../../utils/color-utils';
import { processIconComponent } from './icon-component';
import { logDebug, logError } from '../../utils/logger.js';

function getPlaceholderForIcon(iconName: string): string {
  if (!iconName) return "●";
  
  // Obter primeira letra ou caractere representativo
  if (iconName.includes('map')) return "🗺️";
  if (iconName.includes('arrow')) return "→";
  if (iconName.includes('close') || iconName.includes('cancel')) return "✕";
  if (iconName.includes('check')) return "✓";
  if (iconName.includes('add') || iconName.includes('plus')) return "+";
  if (iconName.includes('remove') || iconName.includes('minus')) return "-";
  if (iconName.includes('star')) return "★";
  if (iconName.includes('heart')) return "♥";
  if (iconName.includes('home')) return "⌂";
  if (iconName.includes('user') || iconName.includes('person')) return "👤";
  if (iconName.includes('settings') || iconName.includes('cog')) return "⚙";
  if (iconName.includes('search')) return "🔍";
  if (iconName.includes('menu')) return "☰";
  
  // Placeholder genérico para outros ícones
  return iconName.charAt(0).toUpperCase() || "●";
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
  
  try {
    // CORREÇÃO: Certificar-se de que a estrutura hierárquica está correta
    // 1. Criar o wrapper primeiro
    const wrapperNode = figma.createFrame();
    wrapperNode.name = "q-btn__wrapper";
    wrapperNode.layoutMode = "HORIZONTAL";
    wrapperNode.primaryAxisSizingMode = "AUTO";
    wrapperNode.counterAxisSizingMode = "AUTO";
    wrapperNode.primaryAxisAlignItems = "CENTER";
    wrapperNode.counterAxisAlignItems = "CENTER";
    wrapperNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
    
    // 2. Adicionar o wrapper ao botão imediatamente
    buttonFrame.appendChild(wrapperNode);
    
    // Extrair propriedades e estilos
    const { props, styles } = extractStylesAndProps(node);
   
    // Analisar configurações de cor do componente
    const colorAnalysis = analyzeComponentColors(node);
    
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
        default:
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
    
    // 3. Criar o content e adicionar ao wrapper
    const contentNode = figma.createFrame();
    contentNode.name = "q-btn__content";
    contentNode.layoutMode = "HORIZONTAL";
    contentNode.primaryAxisSizingMode = "AUTO";
    contentNode.counterAxisSizingMode = "AUTO";
    contentNode.primaryAxisAlignItems = "CENTER";
    contentNode.counterAxisAlignItems = "CENTER";
    contentNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
    contentNode.itemSpacing = 8;
    
    // Adicionar o content ao wrapper imediatamente
    wrapperNode.appendChild(contentNode);
    
    // CORREÇÃO: Garantir que o texto é adicionado DENTRO do contentNode
    // Verificar texto do botão
    const buttonText = props.label || getButtonText(node);
    if (buttonText && buttonText !== '') {
      try {
        const fontSize = getFontSizeForButtonSize(props.size);
        
        // CORREÇÃO: Tentar carregar uma fonte mais simples primeiro
        const textFonts = [
          { family: "Roboto", style: "Medium" },
          { family: "Inter", style: "Medium" },
          { family: "Arial", style: "Regular" },
          { family: "Sans-Serif", style: "Regular" }
        ];
        
        let textNode = null;
        
        // Tentar cada fonte até encontrar uma que carregue
        for (const font of textFonts) {
          try {
            await figma.loadFontAsync(font);
            
            // Criar o nó de texto e configurar
            textNode = figma.createText();
            textNode.fontName = font;
            textNode.characters = buttonText;
            textNode.fontSize = fontSize;
            
            // Adicionar ao contentNode
            contentNode.appendChild(textNode);
            break; // Sair do loop quando conseguir criar o texto
          } catch (fontError) {
            console.warn(`Não foi possível carregar a fonte ${font.family} ${font.style}:`, fontError);
            // Continua tentando a próxima fonte
          }
        }
        
        // Se nenhuma fonte funcionar, crie um placeholder visual
        if (!textNode) {
          const textPlaceholder = figma.createRectangle();
          textPlaceholder.name = "texto-placeholder";
          textPlaceholder.resize(buttonText.length * fontSize * 0.6, fontSize * 1.2);
          textPlaceholder.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
          contentNode.appendChild(textPlaceholder);
        }
      } catch (textError) {
        console.error('Erro ao criar texto do botão:', textError);
        // Criar um placeholder para o texto
        const textPlaceholder = figma.createRectangle();
        textPlaceholder.name = "texto-placeholder";
        textPlaceholder.resize(40, 14);
        textPlaceholder.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        contentNode.appendChild(textPlaceholder);
      }
    }
    for (const childNode of node.childNodes) {
      if (childNode.tagName === 'q-icon') {
        try {
          // Criar uma cópia do nó com o parentContext adequado
          const iconNodeWithContext: QuasarNode = {
            ...childNode,
            parentContext: {
              tagName: 'q-btn',
              attributes: node.attributes,
              isPrimaryComponent: true
            }
          };
          
          const iconComponent = await processIconComponent(iconNodeWithContext, settings);
          
          // Posicionar ícone corretamente com base nos atributos
          if (childNode.attributes?.left) {
            contentNode.insertChild(0, iconComponent);
          } else {
            contentNode.appendChild(iconComponent);
          }
        } catch (error) {
          console.error(`Erro ao processar ícone dentro do botão:`, error);
        }
      }
    }
    // Aplicar cores do Quasar
    applyQuasarColors(buttonFrame, colorAnalysis, 'btn');
    
    // Aplicar estilo de forma ao botão
    if (props.rounded === 'true' || props.rounded === '') {
      buttonFrame.cornerRadius = 28; // Botão mais arredondado
    } else if (props.square === 'true' || props.square === '') {
      buttonFrame.cornerRadius = 0; // Sem arredondamento
    } else if (props.round === 'true' || props.round === '') {
      // Botão circular
      buttonFrame.cornerRadius = 9999;
    }
    
  } catch (error) {
    console.error('Erro no processamento do botão:', error);
    // Garantir que um frame válido seja retornado mesmo em caso de erro
  }
  
  return buttonFrame;


  /**
 * Retorna o tamanho de fonte adequado para um botão baseado no tamanho
 * @param size Tamanho do botão (xs, sm, md, lg, xl)
 * @returns Tamanho da fonte em pixels
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
}