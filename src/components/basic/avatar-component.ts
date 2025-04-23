// src/components/basic/avatar-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { findChildByTagName } from '../../utils/quasar-utils';

export async function processAvatarComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const avatarFrame = figma.createFrame();
  avatarFrame.name = "q-avatar";
  
  // Extrair tamanho
  const size = node.attributes?.size || '42px';
  const sizeNum = parseInt(size);
  
  avatarFrame.resize(sizeNum, sizeNum);
  avatarFrame.cornerRadius = sizeNum / 2; // Circular
  
  // Processar imagem filho
  const imgNode = findChildByTagName(node, 'img');
  if (imgNode) {
    // Criar placeholder para imagem
    avatarFrame.fills = [{ 
      type: 'SOLID', 
      color: { r: 0.8, g: 0.8, b: 0.8 } // Cor cinza como placeholder
    }];
  }
  
  return avatarFrame;
}