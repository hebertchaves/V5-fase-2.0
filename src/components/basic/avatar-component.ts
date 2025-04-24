// Novo arquivo: src/components/basic/avatar-component.ts

import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { quasarColors } from '../../data/color-map';

export async function processAvatarComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const avatarFrame = figma.createFrame();
  avatarFrame.name = "q-avatar";
  
  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Extrair tamanho
  let size = 40; // tamanho padrão
  if (props.size) {
    if (props.size.endsWith('px')) {
      size = parseInt(props.size);
    } else if (props.size.endsWith('em')) {
      size = Math.round(parseFloat(props.size) * 16);
    } else {
      const sizeNum = parseInt(props.size);
      if (!isNaN(sizeNum)) {
        size = sizeNum;
      }
    }
  }
  
  // Configurar avatar
  avatarFrame.resize(size, size);
  avatarFrame.cornerRadius = size / 2; // Circular
  avatarFrame.layoutMode = "HORIZONTAL";
  avatarFrame.primaryAxisAlignItems = "CENTER";
  avatarFrame.counterAxisAlignItems = "CENTER";
  
  // Por padrão, usar cor cinza como placeHolder
  avatarFrame.fills = [{ 
    type: 'SOLID', 
    color: { r: 0.8, g: 0.8, b: 0.8 } // Cor cinza como placeholder
  }];
  
  // Aplicar cor se especificada
  if (props.color && props.color in quasarColors) {
    avatarFrame.fills = [{ type: 'SOLID', color: quasarColors[props.color] }];
  }
  
  // Verificar por conteúdo de imagem
  const imgNode = node.childNodes.find(child => child.tagName === 'img');
  if (imgNode) {
    // No Figma não podemos carregar imagens externas, então apenas indicar que é uma imagem
    const imgPlaceholder = figma.createRectangle();
    imgPlaceholder.name = "image-placeholder";
    imgPlaceholder.resize(size * 0.8, size * 0.8);
    imgPlaceholder.cornerRadius = 4;
    imgPlaceholder.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    
    avatarFrame.appendChild(imgPlaceholder);
  } else {
    // Verificar por texto ou ícone
    const textNode = node.childNodes.find(child => child.tagName === '#text' && child.text && child.text.trim());
    if (textNode) {
      // Criar texto de avatar
      try {
        await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        const avatarText = figma.createText();
        avatarText.characters = textNode.text.trim().substring(0, 2).toUpperCase(); // Usar no máximo 2 caracteres
        avatarText.fontSize = size * 0.5;
        avatarText.textAlignHorizontal = "CENTER";
        avatarText.textAlignVertical = "CENTER";
        
        // Cor de texto contrastante
        if (props.color && props.color in quasarColors) {
          const bgColor = quasarColors[props.color];
          const brightness = bgColor.r * 0.299 + bgColor.g * 0.587 + bgColor.b * 0.114;
          if (brightness > 0.5) {
            avatarText.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
          } else {
            avatarText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
          }
        } else {
          // Default para texto escuro
          avatarText.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
        }
        
        avatarFrame.appendChild(avatarText);
      } catch (error) {
        console.error('Erro ao criar texto do avatar:', error);
      }
    }
  }
  
  return avatarFrame;
}