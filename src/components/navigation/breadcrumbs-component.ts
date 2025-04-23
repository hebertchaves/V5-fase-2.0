// src/components/navigation/breadcrumbs-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, findChildrenByTagName } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

/**
 * Processa um componente de breadcrumbs Quasar (q-breadcrumbs)
 */
export async function processBreadcrumbsComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const breadcrumbsFrame = figma.createFrame();
  breadcrumbsFrame.name = "q-breadcrumbs";
  
  // Configuração básica
  breadcrumbsFrame.layoutMode = "HORIZONTAL";
  breadcrumbsFrame.primaryAxisSizingMode = "AUTO";
  breadcrumbsFrame.counterAxisSizingMode = "AUTO";
  breadcrumbsFrame.itemSpacing = 8;
  breadcrumbsFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Determinar cor dos breadcrumbs
  let textColor = { r: 0, g: 0, b: 0 }; // Preto por padrão
  
  if (props.color && quasarColors[props.color] && settings.preserveQuasarColors) {
    textColor = quasarColors[props.color];
  }
  
  // Determinar separador
  let separator = props.separator || "/";
  
  // Processar breadcrumb items
  const itemNodes = findChildrenByTagName(node, 'q-breadcrumbs-el');
  
  // Se não houver items, criar alguns de exemplo
  if (itemNodes.length === 0) {
    const exampleItems = ['Home', 'Category', 'Product'];
    
    for (let i = 0; i < exampleItems.length; i++) {
      // Adicionar item
      const itemText = await createText(exampleItems[i], {
        color: textColor,
        fontSize: 14
      });
      
      breadcrumbsFrame.appendChild(itemText);
      
      // Adicionar separador, exceto após o último item
      if (i < exampleItems.length - 1) {
        const separatorText = await createText(separator, {
          color: { ...textColor, opacity: 0.5 },
          fontSize: 14
        });
        
        breadcrumbsFrame.appendChild(separatorText);
      }
    }
  } else {
    for (let i = 0; i < itemNodes.length; i++) {
      const itemNode = itemNodes[i];
      const itemProps = extractStylesAndProps(itemNode).props;
      
      let itemLabel = itemProps.label || '';
      
      // Se não tem label, tentar extrair do conteúdo
      if (!itemLabel) {
        for (const child of itemNode.childNodes) {
          if (child.text) {
            itemLabel = child.text.trim();
            break;
          }
        }
      }
      
      if (!itemLabel) {
        itemLabel = `Item ${i+1}`;
      }
      
      // Criar texto do item
      const itemText = await createText(itemLabel, {
        color: textColor,
        fontSize: 14
      });
      
      breadcrumbsFrame.appendChild(itemText);
      
      // Adicionar separador, exceto após o último item
      if (i < itemNodes.length - 1) {
        const separatorText = await createText(separator, {
          color: { ...textColor, opacity: 0.5 },
          fontSize: 14
        });
        
        breadcrumbsFrame.appendChild(separatorText);
      }
    }
  }
  
  return breadcrumbsFrame;
}