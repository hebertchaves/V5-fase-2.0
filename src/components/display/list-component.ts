// src/components/display/list-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, findChildrenByTagName } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

/**
 * Processa um componente de lista Quasar (q-list)
 */
export async function processListComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const listFrame = figma.createFrame();
  listFrame.name = "q-list";
  
  // Configuração básica
  listFrame.layoutMode = "VERTICAL";
  listFrame.primaryAxisSizingMode = "AUTO";
  listFrame.counterAxisSizingMode = "AUTO";
  listFrame.itemSpacing = 0;
  listFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Configurações com base em props
  if (props.bordered === 'true' || props.bordered === '') {
    listFrame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    listFrame.strokeWeight = 1;
  }
  
  if (props.separator === 'true' || props.separator === '') {
    // Os separadores serão adicionados entre os itens
  }
  
  // Processar itens da lista
  const itemNodes = findChildrenByTagName(node, 'q-item');
  
  // Se não houver itens, criar alguns de exemplo
  if (itemNodes.length === 0) {
    const exampleItems = ['Item 1', 'Item 2', 'Item 3'];
    
    for (let i = 0; i < exampleItems.length; i++) {
      const itemFrame = await createListItem(exampleItems[i], i, settings);
      listFrame.appendChild(itemFrame);
      
      // Adicionar separador, exceto após o último item
      if (i < exampleItems.length - 1 && (props.separator === 'true' || props.separator === '')) {
        const separator = figma.createRectangle();
        separator.name = "q-separator";
        separator.resize(300, 1);
        separator.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        listFrame.appendChild(separator);
      }
    }
  } else {
    for (let i = 0; i < itemNodes.length; i++) {
      const itemNode = itemNodes[i];
      
      // Processar item da lista
      const itemFrame = await processListItem(itemNode, i, settings);
      listFrame.appendChild(itemFrame);
      
      // Adicionar separador, exceto após o último item
      if (i < itemNodes.length - 1 && (props.separator === 'true' || props.separator === '')) {
        const separator = figma.createRectangle();
        separator.name = "q-separator";
        separator.resize(300, 1);
        separator.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        listFrame.appendChild(separator);
      }
    }
  }
  
  return listFrame;
}

/**
 * Processa um item de lista (q-item)
 */
async function processListItem(node: QuasarNode, index: number, settings: PluginSettings): Promise<FrameNode> {
  const itemFrame = figma.createFrame();
  itemFrame.name = `q-item-${index + 1}`;
  
  // Configuração básica
  itemFrame.layoutMode = "HORIZONTAL";
  itemFrame.primaryAxisSizingMode = "AUTO";
  itemFrame.counterAxisSizingMode = "AUTO";
  itemFrame.paddingLeft = 16;
  itemFrame.paddingRight = 16;
  itemFrame.paddingTop = 12;
  itemFrame.paddingBottom = 12;
  itemFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Verificar se o item é clicável
  if (props.clickable === 'true' || props.clickable === '') {
    itemFrame.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.05 },
      offset: { x: 0, y: 1 },
      radius: 2,
      visible: true,
      blendMode: 'NORMAL'
    }];
  }
  
  // Verificar se há sections
  const sectionNodes = findChildrenByTagName(node, 'q-item-section');
  
  if (sectionNodes.length === 0) {
    // Se não houver seções, criar um texto genérico
    const textNode = await createText(`Item ${index + 1}`, {
      fontSize: 14
    });
    
    itemFrame.appendChild(textNode);
  } else {
    // Processar cada seção
    for (const sectionNode of sectionNodes) {
      const sectionProps = extractStylesAndProps(sectionNode).props;
      
      const sectionFrame = figma.createFrame();
      sectionFrame.name = "q-item-section";
      sectionFrame.layoutMode = "VERTICAL";
      sectionFrame.primaryAxisSizingMode = "AUTO";
      sectionFrame.counterAxisSizingMode = "AUTO";
      sectionFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
      sectionFrame.itemSpacing = 4;
      
      // Verificar o tipo da seção
      if (sectionProps.avatar === 'true' || sectionProps.avatar === '') {
        // Seção de avatar
        const avatarFrame = figma.createFrame();
        avatarFrame.name = "q-item-section__avatar";
        avatarFrame.resize(40, 40);
        avatarFrame.cornerRadius = 20;  // Circular
        avatarFrame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        
        sectionFrame.appendChild(avatarFrame);
      } else if (sectionProps.thumbnail === 'true' || sectionProps.thumbnail === '') {
        // Seção de thumbnail
        const thumbnailFrame = figma.createFrame();
        thumbnailFrame.name = "q-item-section__thumbnail";
        thumbnailFrame.resize(40, 40);
        thumbnailFrame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
        
        sectionFrame.appendChild(thumbnailFrame);
      } else {
        // Seção principal ou lado
        let text = "";
        
        // Tentar extrair texto
        for (const child of sectionNode.childNodes) {
          if (child.text) {
            text += child.text.trim() + " ";
          }
        }
        
        text = text.trim();
        
        if (!text) {
          text = sectionProps.side ? "Side" : `Content ${index + 1}`;
        }
        
        const textNode = await createText(text, {
          fontSize: 14
        });
        
        sectionFrame.appendChild(textNode);
      }
      
      itemFrame.appendChild(sectionFrame);
    }
  }
  
  return itemFrame;
}

/**
 * Cria um item de lista genérico
 */
async function createListItem(text: string, index: number, settings: PluginSettings): Promise<FrameNode> {
  const itemFrame = figma.createFrame();
  itemFrame.name = `q-item-${index + 1}`;
  
  // Configuração básica
  itemFrame.layoutMode = "HORIZONTAL";
  itemFrame.primaryAxisSizingMode = "AUTO";
  itemFrame.counterAxisSizingMode = "AUTO";
  itemFrame.paddingLeft = 16;
  itemFrame.paddingRight = 16;
  itemFrame.paddingTop = 12;
  itemFrame.paddingBottom = 12;
  itemFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Criar texto
  const textNode = await createText(text, {
    fontSize: 14
  });
  
  itemFrame.appendChild(textNode);
  
  return itemFrame;
}