import { QuasarNode, ComponentTypeInfo } from '../types/settings';
import { cssColorToFigmaColor } from './style-utils';

/**
 * Verifica se um nó tem um pai específico
 */
export function hasParentOfType(node: QuasarNode, parentTagName: string): boolean {
  return node.parentContext?.tagName === parentTagName;
}

/**
 * Obtém um atributo do pai se existir
 */
export function getParentAttribute(node: QuasarNode, attributeName: string): string | undefined {
  return node.parentContext?.attributes?.[attributeName];
}

/**
 * Verifica se o pai é um componente Quasar primário
 */
export function isInsidePrimaryComponent(node: QuasarNode): boolean {
  return node.parentContext?.isPrimaryComponent === true;
}

// Adicionar ao arquivo src/utils/quasar-utils.ts

/**
 * Extrai o texto de um botão a partir de várias fontes possíveis
 * MODIFICADO: Melhor detecção do texto do botão
 */
export function getButtonText(node: QuasarNode): string {
  // Verificar atributo label
  if (node.attributes) {
    if ((node.attributes.round === 'true' || node.attributes.round === '') && 
        node.attributes.icon && 
        !node.attributes.label) {
      return '';
    }
  }
  
  // Verificar conteúdo de texto direto
  let textContent = '';
  for (const child of node.childNodes) {
    if (child.tagName === '#text' && child.text) {
      textContent += child.text.trim() + ' ';
    } else if (child.childNodes && child.childNodes.length > 0) {
      // Buscar texto em filhos de forma recursiva
      for (const grandChild of child.childNodes) {
        if (grandChild.tagName === '#text' && grandChild.text) {
          textContent += grandChild.text.trim() + ' ';
        }
      }
    }
  }
  
  textContent = textContent.trim();
  if (textContent) {
    return textContent;
  }
  
  // Se não houver texto e tiver ícone, não retornar texto padrão
  if ((node.attributes && node.attributes.icon) || 
      (node.attributes && node.attributes['icon-right'])) {
    return '';
  }
  
  // Texto padrão se nada for encontrado e não houver ícone
  return "Button";
}

/**
 * Extrai estilos e props de um nó Quasar
 */
export function extractStylesAndProps(node: QuasarNode) {
  const props: Record<string, string> = {};
  const styles: Record<string, any> = {};
  
  // Extrair atributos do nó
  if (node.attributes) {
    Object.entries(node.attributes).forEach(([attr, value]) => {
      // Props do Quasar ou atributos personalizados v-model, :value, etc.
      if (attr.startsWith(':') || attr.startsWith('v-')) {
        const propName = attr.replace(/^[v:][-:]?/, '');
        props[propName] = value;
      } else if (attr === 'style') {
        const styleObj = parseInlineStyles(value);
        Object.assign(styles, styleObj);
      } else if (attr === 'class') {
        props['class'] = value;
      } else {
        props[attr] = value;
      }
    });
  }
  
  return { props, styles };
}

function parseInlineStyles(styleString: string) {
  const styles: Record<string, any> = {};
  
  if (!styleString) return styles;
  
  const declarations = styleString.split(';');
  
  for (const declaration of declarations) {
    const [property, value] = declaration.split(':').map(s => s.trim());
    if (property && value) {
      styles[property] = value;
    }
  }
  
  return styles;
}

/**
 * Encontra um filho com uma determinada tag
 */
export function findChildByTagName(node: QuasarNode, tagName: string): QuasarNode | null {
  if (!node.childNodes || node.childNodes.length === 0) {
    return null;
  }
  
  // Converter para minúsculas para comparação case-insensitive
  const targetTag = tagName.toLowerCase();
  
  for (const child of node.childNodes) {
    if (child.tagName && child.tagName.toLowerCase() === targetTag) {
      return child;
    }
    
    // Busca recursiva
    const found = findChildByTagName(child, tagName);
    if (found) {
      return found;
    }
  }
  
  return null;
}

/**
 * Encontra todos os filhos com uma determinada tag
 */
export function findChildrenByTagName(node: QuasarNode, tagName: string): QuasarNode[] {
  const results: QuasarNode[] = [];
  
  if (!node.childNodes || node.childNodes.length === 0) {
    return results;
  }
  
  // Converter para minúsculas para comparação case-insensitive
  const targetTag = tagName.toLowerCase();
  
  for (const child of node.childNodes) {
    if (child.tagName && child.tagName.toLowerCase() === targetTag) {
      results.push(child);
    }
    
    // Busca recursiva
    const childResults = findChildrenByTagName(child, tagName);
    results.push(...childResults);
  }
  
  return results;
}

/**
 * Detecta o tipo e categoria de um componente Quasar
 */
export function detectComponentType(node: QuasarNode): ComponentTypeInfo {
  // Console logging para debug
  console.log('Detectando tipo para componente:', node.tagName);
  
  if (!node.tagName) {
    return { category: 'unknown', type: 'generic' };
  }
  
  const tagName = node.tagName.toLowerCase();
  
  // Componentes Quasar
  if (tagName.startsWith('q-')) {
    const componentName = tagName.substring(2); // Remove 'q-'
    
    // Componentes básicos
    if (['btn', 'icon', 'avatar', 'badge', 'chip', 'separator'].includes(componentName)) {
      return { category: 'basic', type: componentName };
    }
    
    // Card e subcomponentes
    if (['card', 'card-section', 'card-actions'].includes(componentName)) {
      return { category: 'layout', type: componentName };
    }
    
    // Componentes de formulário
    if (['input', 'select', 'checkbox', 'radio', 'toggle', 'option', 'form', 'field'].includes(componentName)) {
      return { category: 'form', type: componentName };
    }
    
    // Componentes de layout
    if (['layout', 'page', 'header', 'footer', 'drawer', 'toolbar', 'page-container'].includes(componentName)) {
      return { category: 'layout', type: componentName };
    }
    
    // Componentes de navegação
    if (['tabs', 'tab', 'tab-panels', 'tab-panel', 'breadcrumbs', 'breadcrumbs-el'].includes(componentName)) {
      return { category: 'navigation', type: componentName };
    }
    
    // Componentes de display
    if (['table', 'list', 'item', 'carousel', 'carousel-slide', 'banner'].includes(componentName)) {
      return { category: 'display', type: componentName };
    }
    
    // Se for um componente Quasar mas não está mapeado explicitamente
    return { category: 'quasar', type: componentName };
  }
  
  // Elementos HTML comuns
  return { category: 'html', type: tagName };
}

/**
 * Encontra o nó pai de um nó
 */
export function findParentNode(node: QuasarNode, parentNodes: QuasarNode[]): QuasarNode | null {
  for (const parentNode of parentNodes) {
    if (parentNode.childNodes && parentNode.childNodes.includes(node)) {
      return parentNode;
    }
    
    if (parentNode.childNodes && parentNode.childNodes.length > 0) {
      const result = findParentByChildRecursive(node, parentNode);
      if (result) return result;
    }
  }
  
  return null;
}

/**
 * Função auxiliar recursiva para encontrar o nó pai
 */
function findParentByChildRecursive(childNode: QuasarNode, currentNode: QuasarNode): QuasarNode | null {
  if (!currentNode.childNodes || currentNode.childNodes.length === 0) {
    return null;
  }
  
  if (currentNode.childNodes.includes(childNode)) {
    return currentNode;
  }
  
  for (const node of currentNode.childNodes) {
    const result = findParentByChildRecursive(childNode, node);
    if (result) return result;
  }
  
  return null;
}

/**
 * Verifica se um nó está dentro de um slot específico
 */
export function isNodeInSlot(node: QuasarNode, slotName: string, parentNodes: QuasarNode[]): boolean {
  const parentNode = findParentNode(node, parentNodes);
  
  if (!parentNode) return false;
  
  if (parentNode.tagName.toLowerCase() === 'template') {
    // Verificar atributos do template para determinar o slot
    return parentNode.attributes && (
      parentNode.attributes[`v-slot:${slotName}`] !== undefined ||
      parentNode.attributes[`#${slotName}`] !== undefined
    );
  }
  
  return false;
}