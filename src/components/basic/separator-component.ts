// src/components/basic/separator-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, setNodeSize } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

/**
 * Processa um componente separador Quasar (q-separator)
 */
export async function processSeparatorComponent(node: QuasarNode, settings: PluginSettings): Promise<RectangleNode> {
  const separator = figma.createRectangle();
  separator.name = "q-separator";
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Definir espessura (height ou width, dependendo da orientação)
  const thickness = props.size ? parseInt(props.size) : 1;
  
  // Verificar orientação
  const isVertical = props.vertical === 'true' || props.vertical === '';
  
  if (isVertical) {
    separator.resize(thickness, 100);
  } else {
    separator.resize(300, thickness);
  }
  
  // Definir cor
  let separatorColor = { r: 0.9, g: 0.9, b: 0.9 }; // Cinza claro padrão
  
  if (props.color && settings.preserveQuasarColors) {
    const colorName = props.color;
    if (quasarColors[colorName]) {
      separatorColor = quasarColors[colorName];
    }
  }
  
  separator.fills = [{ type: 'SOLID', color: separatorColor }];
  
  // Verificar se tem espaçamento
  if (props.spaced === 'true' || props.spaced === '') {
    // Adicionar margem interna
    const spacedValue = typeof props.spaced === 'string' && props.spaced !== 'true' ? 
      parseInt(props.spaced) : 
      16; // Valor padrão de espaçamento
      
    if (isVertical) {
      // Não podemos modificar diretamente y, height
      const newY = spacedValue;
      const newHeight = separator.height - (2 * spacedValue);
      // Criar um novo separador com as dimensões corretas
      const newSeparator = figma.createRectangle();
      newSeparator.name = separator.name;
      newSeparator.fills = separator.fills;
      newSeparator.resize(separator.width, newHeight);
      newSeparator.y = newY;
      return newSeparator;
    } else {
      // Não podemos modificar diretamente x, width
      const newX = spacedValue;
      const newWidth = separator.width - (2 * spacedValue);
      // Criar um novo separador com as dimensões corretas
      const newSeparator = figma.createRectangle();
      newSeparator.name = separator.name;
      newSeparator.fills = separator.fills;
      newSeparator.resize(newWidth, separator.height);
      newSeparator.x = newX;
      return newSeparator;
    }
  }
  
  // Bordas arredondadas
  if (props.inset === 'true' || props.inset === '') {
    separator.cornerRadius = thickness / 2;
  }
  
  return separator;
}