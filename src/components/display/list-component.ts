// Novo arquivo: src/components/display/list-component.ts

import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

/**
 * Processa um componente lista (q-list) do Quasar
 */
export async function processListComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const listFrame = figma.createFrame();
  listFrame.name = "q-list";
  
  // Configuração básica
  listFrame.layoutMode = "VERTICAL";
  listFrame.primaryAxisSizingMode = "AUTO";
  listFrame.counterAxisSizingMode = "AUTO";
  listFrame.itemSpacing = 0; // Sem espaçamento entre itens
  listFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Processar filhos (q-item)
  for (const child of node.childNodes) {
    if (child.tagName && child.tagName.toLowerCase() === 'q-item') {
      const itemComponent = await processListItem(child, settings);
      listFrame.appendChild(itemComponent);
      
      // Adicionar separador se necessário
      if (props.separator === 'true' || props.separator === '') {
        const separator = figma.createRectangle();
        separator.name = "q-separator";
        separator.resize(listFrame.width, 1);
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
async function processListItem(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const itemFrame = figma.createFrame();
  itemFrame.name = "q-item";
  
  // Configuração básica
  itemFrame.layoutMode = "HORIZONTAL";
  itemFrame.primaryAxisSizingMode = "AUTO";
  itemFrame.counterAxisSizingMode = "AUTO";
  itemFrame.paddingLeft = 16;
  itemFrame.paddingRight = 16;
  itemFrame.paddingTop = 12;
  itemFrame.paddingBottom = 12;
  itemFrame.primaryAxisAlignItems = "SPACE_BETWEEN";
  itemFrame.counterAxisAlignItems = "CENTER";
  itemFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Processar seções do item (q-item-section)
  for (const child of node.childNodes) {
    if (child.tagName && child.tagName.toLowerCase() === 'q-item-section') {
      const sectionComponent = await processItemSection(child, settings);
      itemFrame.appendChild(sectionComponent);
    }
  }
  
  // Se não houver seções, adicionar conteúdo padrão
  if (itemFrame.children.length === 0) {
    const textNode = await createText("Item");
    if (textNode) {
      itemFrame.appendChild(textNode);
    }
  }
  
  // Verificar se o item é clicável
  if (props.clickable === 'true' || props.clickable === '') {
    // Adicionar efeito de hover (não é realmente aplicado no Figma, mas para documentação)
    itemFrame.name = "q-item (clickable)";
  }
  
  return itemFrame;
}

/**
 * Processa uma seção de item (q-item-section)
 */
async function processItemSection(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const sectionFrame = figma.createFrame();
  sectionFrame.name = "q-item-section";
  
  // Configuração básica
  sectionFrame.layoutMode = "VERTICAL";
  sectionFrame.primaryAxisSizingMode = "AUTO";
  sectionFrame.counterAxisSizingMode = "AUTO";
  sectionFrame.itemSpacing = 4;
  sectionFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Verificar se é uma seção de avatar
  if (props.avatar === 'true' || props.avatar === '') {
    sectionFrame.name = "q-item-section--avatar";
    sectionFrame.resize(56, 56);
    sectionFrame.primaryAxisAlignItems = "CENTER";
    sectionFrame.counterAxisAlignItems = "CENTER";
    
    // Criar placeholder para avatar
    const avatarPlaceholder = figma.createEllipse();
    avatarPlaceholder.name = "avatar-placeholder";
    avatarPlaceholder.resize(40, 40);
    avatarPlaceholder.fills = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
    
    sectionFrame.appendChild(avatarPlaceholder);
    return sectionFrame;
  }
  
  // Processar filhos
  for (const child of node.childNodes) {
    if (child.tagName === '#text' && child.text) {
      // Texto direto
      const textNode = await createText(child.text.trim());
      if (textNode) {
        sectionFrame.appendChild(textNode);
      }
    } else if (child.tagName) {
      // Processar label e caption especialmente
      if (child.tagName.toLowerCase() === 'q-item-label') {
        const labelComponent = await processItemLabel(child, settings);
        sectionFrame.appendChild(labelComponent);
      } else {
        // Outros componentes filhos podem ser processados genericamente
        // Aqui você pode chamar o processador genérico ou implementar lógica específica
      }
    }
  }
  
  return sectionFrame;
}

/**
 * Processa um label de item (q-item-label)
 */
async function processItemLabel(node: QuasarNode, settings: PluginSettings): Promise<TextNode> {
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Extrair texto
  let labelText = "";
  for (const child of node.childNodes) {
    if (child.text) {
      labelText += child.text.trim() + " ";
    }
  }
  labelText = labelText.trim() || "Label";
  
  // Criar nó de texto
  const textOptions: any = {
    fontSize: 14
  };
  
  // Verificar se é caption
  if (props.caption === 'true' || props.caption === '') {
    textOptions.fontSize = 12;
    textOptions.color = { r: 0.6, g: 0.6, b: 0.6 };
  }
  
  // Verificar se é header
  if (props.header === 'true' || props.header === '') {
    textOptions.fontSize = 16;
    textOptions.fontWeight = 'medium';
  }
  
  // Verificar se é overline
  if (props.overline === 'true' || props.overline === '') {
    textOptions.fontSize = 12;
    textOptions.letterSpacing = 1;
    textOptions.textTransform = 'uppercase';
  }
  
  const textNode = await createText(labelText, textOptions);
  textNode.name = "q-item-label";
  
  return textNode;
}