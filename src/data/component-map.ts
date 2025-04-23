import { quasarColors } from './color-map';

// Interface para propriedades de componentes Figma
export interface ComponentProperties {
  type: 'FRAME' | 'RECTANGLE' | 'TEXT' | 'ELLIPSE' | 'LINE';
  properties: Record<string, any>;
}

// Mapeamento de componentes Quasar para propriedades Figma
export const quasarComponentMap: Record<string, ComponentProperties> = {
  // COMPONENTES DE FORMULÁRIO
  'q-btn': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      primaryAxisAlignItems: 'CENTER',
      counterAxisAlignItems: 'CENTER',
      cornerRadius: 4,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      fills: [{ type: 'SOLID', color: quasarColors.primary }]
    }
  },
  
  'q-input': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      itemSpacing: 4,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  },
  
  'q-checkbox': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      primaryAxisAlignItems: 'CENTER',
      counterAxisAlignItems: 'CENTER',
      itemSpacing: 8,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  },
  
  'q-radio': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      primaryAxisAlignItems: 'CENTER',
      counterAxisAlignItems: 'CENTER',
      itemSpacing: 8,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  },
  
  'q-toggle': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      primaryAxisAlignItems: 'CENTER',
      counterAxisAlignItems: 'CENTER',
      itemSpacing: 8,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  },
  
  'q-select': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      itemSpacing: 4,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  },
  
  'q-form': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      itemSpacing: 16,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  },
  
  // COMPONENTES DE LAYOUT
  'q-card': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      cornerRadius: 4,
      itemSpacing: 0,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
      effects: [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.2 },
          offset: { x: 0, y: 2 },
          radius: 4,
          visible: true,
          blendMode: 'NORMAL'
        }
      ]
    }
  },
  
  'q-card-section': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 16,
      paddingBottom: 16,
      itemSpacing: 4,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    }
  },
  
  'q-card-actions': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      paddingLeft: 8,
      paddingRight: 8,
      paddingTop: 8,
      paddingBottom: 8,
      primaryAxisAlignItems: 'SPACE_BETWEEN',
      itemSpacing: 8,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    }
  },
  
  'q-separator': {
    type: 'RECTANGLE',
    properties: {
      fills: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }],
      height: 1
    }
  },
  
  // COMPONENTES DE ESTRUTURA DE PÁGINA
  'q-layout': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'FIXED',
      counterAxisSizingMode: 'FIXED',
      width: 1024,
      height: 768,
      itemSpacing: 0,
      fills: [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }]
    }
  },
  
  'q-page': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'FIXED',
      width: 1024,
      paddingLeft: 24,
      paddingRight: 24,
      paddingTop: 24,
      paddingBottom: 24,
      itemSpacing: 16,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    }
  },
  
  'q-header': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'FIXED',
      counterAxisSizingMode: 'AUTO',
      width: 1024,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      primaryAxisAlignItems: 'SPACE_BETWEEN',
      counterAxisAlignItems: 'CENTER',
      fills: [{ type: 'SOLID', color: quasarColors.primary }]
    }
  },
  
  'q-footer': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'FIXED',
      counterAxisSizingMode: 'AUTO',
      width: 1024,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8, 
      paddingBottom: 8,
      primaryAxisAlignItems: 'SPACE_BETWEEN',
      counterAxisAlignItems: 'CENTER',
      fills: [{ type: 'SOLID', color: quasarColors.dark }]
    }
  },
  
  'q-drawer': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'FIXED',
      counterAxisSizingMode: 'FIXED',
      width: 256,
      height: 768,
      itemSpacing: 0,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
      effects: [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.1 },
          offset: { x: 2, y: 0 },
          radius: 4,
          visible: true,
          blendMode: 'NORMAL'
        }
      ]
    }
  },
  
  'q-toolbar': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'FIXED',
      counterAxisSizingMode: 'AUTO',
      width: 1024,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 8,
      paddingBottom: 8,
      primaryAxisAlignItems: 'SPACE_BETWEEN',
      counterAxisAlignItems: 'CENTER',
      itemSpacing: 8,
      fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }]
    }
  },
  
  'q-toolbar-title': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      primaryAxisAlignItems: 'CENTER',
      counterAxisAlignItems: 'CENTER',
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  },
  
  // COMPONENTES DE NAVEGAÇÃO
  'q-tabs': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'FIXED',
      counterAxisSizingMode: 'AUTO',
      width: 400,
      itemSpacing: 0,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    }
  },
  
  'q-tab': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 12,
      paddingBottom: 12,
      primaryAxisAlignItems: 'CENTER',
      counterAxisAlignItems: 'CENTER',
      itemSpacing: 4,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    }
  },
  
  'q-tab-panels': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'FIXED',
      width: 400,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    }
  },
  
  'q-tab-panel': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'FIXED',
      width: 400,
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 16,
      paddingBottom: 16,
      itemSpacing: 16,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    }
  },
  
  // COMPONENTES DE LISTA
  'q-list': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      itemSpacing: 0,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    }
  },
  
  'q-item': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 12,
      paddingBottom: 12,
      primaryAxisAlignItems: 'SPACE_BETWEEN',
      counterAxisAlignItems: 'CENTER',
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
    }
  },
  
  'q-item-section': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      itemSpacing: 4,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  },
  
  'q-item-label': {
    type: 'TEXT',
    properties: {
      fontSize: 14,
      fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    }
  },
  
  // COMPONENTES DE DIÁLOGO
  'q-dialog': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      cornerRadius: 4,
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
      effects: [
        {
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.2 },
          offset: { x: 0, y: 2 },
          radius: 8,
          visible: true,
          blendMode: 'NORMAL'
        }
      ]
    }
  },
  
  // ELEMENTOS HTML COMUNS
  'div': {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  },
  
  'span': {
    type: 'FRAME',
    properties: {
      layoutMode: 'HORIZONTAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  },
  
  'p': {
    type: 'TEXT',
    properties: {
      fontSize: 14,
      fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    }
  },
  
  'h1': {
    type: 'TEXT',
    properties: {
      fontSize: 32,
      fontWeight: 'bold',
      fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    }
  },
  
  'h2': {
    type: 'TEXT',
    properties: {
      fontSize: 24,
      fontWeight: 'bold',
      fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    }
  },
  
  'h3': {
    type: 'TEXT',
    properties: {
      fontSize: 20,
      fontWeight: 'bold',
      fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }]
    }
  }
};

/**
 * Obtém as propriedades de um componente Quasar
 * Se o componente não for encontrado, retorna um frame genérico
 */
export function getComponentProperties(tagName: string): ComponentProperties {
  const lowerTagName = tagName.toLowerCase();
  
  if (quasarComponentMap[lowerTagName]) {
    return quasarComponentMap[lowerTagName];
  }
  
  // Retorna configuração padrão de frame para componentes não mapeados
  return {
    type: 'FRAME',
    properties: {
      layoutMode: 'VERTICAL',
      primaryAxisSizingMode: 'AUTO',
      counterAxisSizingMode: 'AUTO',
      fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }]
    }
  };
}

/**
 * Aplica propriedades de um componente a um nó Figma
 */
export function applyComponentProperties(node: any, tagName: string) {
  const properties = getComponentProperties(tagName);
  
  // Aplicar propriedades
  Object.keys(properties.properties).forEach(key => {
    try {
      node[key] = properties.properties[key];
    } catch (error) {
      console.warn(`Não foi possível aplicar a propriedade ${key} ao nó:`, error);
    }
  });
  
  return node;
}