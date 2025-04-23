// src/components/layout/drawer-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

export async function processDrawerComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const drawerFrame = figma.createFrame();
  drawerFrame.name = "q-drawer";
  
  // Use resize() em vez de atribuição direta
  drawerFrame.resize(256, 768);
  
  // Configuração de layout
  drawerFrame.layoutMode = "VERTICAL";
  drawerFrame.primaryAxisSizingMode = "FIXED";
  drawerFrame.counterAxisSizingMode = "FIXED";
  drawerFrame.itemSpacing = 0;
  drawerFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Adicionar sombra
  drawerFrame.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 2, y: 0 },
      radius: 4,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL'
    }
  ];

  // Extrair propriedades
  const { props, styles } = extractStylesAndProps(node);
  
  // Verificar se há um atributo de cor para o drawer
  const drawerColorAttr = props.color;
  if (drawerColorAttr && quasarColors[drawerColorAttr] && settings.preserveQuasarColors) {
    drawerFrame.fills = [{ type: 'SOLID', color: quasarColors[drawerColorAttr] }];
  }

  // Adicionar lista ao drawer
  const listFrame = figma.createFrame();
  listFrame.name = "q-list";
  listFrame.layoutMode = "VERTICAL";
  listFrame.primaryAxisSizingMode = "AUTO";
  listFrame.counterAxisSizingMode = "FIXED";
  listFrame.resize(256, listFrame.height);
  listFrame.itemSpacing = 0;
  listFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  // Adicionar alguns itens de menu de exemplo
  const menuItems = ["Home", "Perfil", "Configurações", "Sobre"];
  
  for (const itemText of menuItems) {
    const itemFrame = figma.createFrame();
    itemFrame.name = "q-item";
    itemFrame.layoutMode = "HORIZONTAL";
    itemFrame.primaryAxisSizingMode = "FIXED";
    itemFrame.counterAxisSizingMode = "AUTO";
    itemFrame.resize(256, itemFrame.height);
    itemFrame.paddingLeft = 16;
    itemFrame.paddingRight = 16;
    itemFrame.paddingTop = 12;
    itemFrame.paddingBottom = 12;
    itemFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
    itemFrame.counterAxisAlignItems = "CENTER";
    itemFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    const textNode = await createText(itemText, {
      color: { r: 0, g: 0, b: 0 }
    });
    
    if (textNode) {
      itemFrame.appendChild(textNode);
      listFrame.appendChild(itemFrame);
    }
  }
  
  drawerFrame.appendChild(listFrame);
  
  return drawerFrame;
}