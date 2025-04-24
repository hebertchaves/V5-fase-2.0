// src/components/basic/avatar-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

/**
 * Processa um componente q-avatar
 */
export async function processAvatarComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const avatarFrame = figma.createFrame();
  avatarFrame.name = "q-avatar";
  
  const { props, styles } = extractStylesAndProps(node);
  
  // Processar tamanho
  let size = 40; // Tamanho padrão
  
  if (props.size) {
    if (typeof props.size === 'string') {
      if (props.size.endsWith('px')) {
        const sizeNum = parseInt(props.size);
        if (!isNaN(sizeNum)) {
          size = sizeNum;
        }
      } else {
        switch(props.size) {
          case 'xs': size = 24; break;
          case 'sm': size = 32; break;
          case 'md': size = 40; break;
          case 'lg': size = 56; break;
          case 'xl': size = 72; break;
          default:
            // Tentar extrair valor numérico
            const sizeNum = parseInt(props.size);
            if (!isNaN(sizeNum)) {
              size = sizeNum;
            }
        }
      }
    }
  }
  
  // Configurar o avatar como um círculo
  avatarFrame.resize(size, size);
  avatarFrame.cornerRadius = size / 2; // Círculo perfeito
  avatarFrame.layoutMode = "HORIZONTAL";
  avatarFrame.primaryAxisAlignItems = "CENTER";
  avatarFrame.counterAxisAlignItems = "CENTER";
  
  // Cor do avatar
  if (props.color && quasarColors[props.color]) {
    avatarFrame.fills = [{ type: 'SOLID', color: quasarColors[props.color] }];
  } else {
    // Cor padrão - cinza claro
    avatarFrame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
  }
  
  // Verificar se há uma imagem no avatar
  for (const child of node.childNodes) {
    if (child.tagName === 'img') {
      // Criar um placeholder para a imagem
      const imagePlaceholder = figma.createRectangle();
      imagePlaceholder.resize(size, size);
      imagePlaceholder.cornerRadius = size / 2;
      
      // Cor cinza mais escura para indicar que é uma imagem
      imagePlaceholder.fills = [{ type: 'SOLID', color: { r: 0.7, g: 0.7, b: 0.7 } }];
      
      avatarFrame.appendChild(imagePlaceholder);
      break;
    }
  }
  
  return avatarFrame;
}