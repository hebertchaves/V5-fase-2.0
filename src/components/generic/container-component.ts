// src/components/generic/container-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, detectComponentType } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { processQuasarClass } from '../../utils/style-utils';
import { processGenericComponent } from '../generic/generic-component';
import { processBasicComponents } from '../basic/basic-components';
import { processLayoutComponents } from '../layout/layout-components';


/**
 * Processa um container HTML genérico (div, span, etc)
 */
export async function processGenericContainer(node: QuasarNode, settings: PluginSettings): Promise<FrameNode | null> {
  if (!node.tagName || node.tagName === '#text') {
    // Se for um nó de texto, retornar texto
    if (node.text && node.text.trim()) {
      const textNode = await createText(node.text.trim());
      return textNode as unknown as FrameNode; // Casting necessário
    }
    return null;
  }
  
  const containerFrame = figma.createFrame();
  containerFrame.name = node.tagName;
  
  // Configuração básica baseada na tag
  if (node.tagName === 'div') {
    containerFrame.layoutMode = "VERTICAL";
  } else if (node.tagName === 'span') {
    containerFrame.layoutMode = "HORIZONTAL";
  } else {
    containerFrame.layoutMode = "VERTICAL";
  }
  
  containerFrame.primaryAxisSizingMode = "AUTO";
  containerFrame.counterAxisSizingMode = "AUTO";
  containerFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Aplicar classes CSS do Quasar
  if (props.class) {
    const classes = props.class.split(/\s+/).filter(c => c);
    for (const className of classes) {
      const classStyles = processQuasarClass(className);
      if (classStyles) {
        applyStylesToFigmaNode(containerFrame, classStyles);
      }
    }
  }
  
  // Aplicar estilos inline
  applyStylesToFigmaNode(containerFrame, styles);
  
  // Processar filhos recursivamente
  for (const child of node.childNodes) {
    let childNode: FrameNode | null = null;
    
    if (child.tagName && child.tagName.startsWith('q-')) {
      // É um componente Quasar - usar conversor principal
      const componentType = detectComponentType(child);
      
      switch (componentType.category) {
        case 'basic':
          childNode = await processBasicComponents(child, componentType.type, settings);
          break;
        case 'layout':
          childNode = await processLayoutComponents(child, componentType.type, settings);
          break;
        // ... outros casos
        default:
          childNode = await processGenericComponent(child, settings);
          break;
      }
    } else {
      // É um elemento HTML comum ou texto
      childNode = await processGenericContainer(child, settings);
    }
    
    if (childNode) {
      containerFrame.appendChild(childNode);
    }
  }
  
  return containerFrame;
}