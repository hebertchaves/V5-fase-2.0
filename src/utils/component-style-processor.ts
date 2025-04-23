// src/utils/component-style-processor.ts
import { QuasarNode, PluginSettings } from '../types/settings';
import { extractStylesAndProps } from './quasar-utils';
import { processQuasarClass } from './style-utils';
import { applyStylesToFigmaNode } from './figma-utils';
import { analyzeComponentColors, applyQuasarColors } from './color-utils';

/**
 * Processa e aplica todos os estilos para um componente do Quasar
 */
export async function processComponentStyles(
  figmaNode: SceneNode, 
  quasarNode: QuasarNode, 
  componentType: string,
  settings: PluginSettings
): Promise<void> {
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(quasarNode);
  
  // Aplicar estilos inline
  applyStylesToFigmaNode(figmaNode, styles);
  
  // Processar classes CSS
  if (props.class) {
    const classes = props.class.split(/\s+/).filter(c => c);
    
    for (const className of classes) {
      const classStyles = processQuasarClass(className);
      if (classStyles) {
        applyStylesToFigmaNode(figmaNode, classStyles);
      }
    }
  }
  
  // Processar cores
  const colorAnalysis = analyzeComponentColors(quasarNode);
  applyQuasarColors(figmaNode, colorAnalysis, componentType);
  
  // Processar tamanhos e dimensões
  processComponentSize(figmaNode, quasarNode, componentType);
  
  // Processar estados (disabled, etc.)
  processComponentState(figmaNode, quasarNode);
  
  // Marcar o nó como tendo estilos processados
  if ('setPluginData' in figmaNode) {
    figmaNode.setPluginData('styles_processed', 'true');
  }
}

/**
 * Processa e aplica configurações de tamanho para um componente
 */
function processComponentSize(
  figmaNode: SceneNode, 
  quasarNode: QuasarNode, 
  componentType: string
): void {
  if (!('layoutMode' in figmaNode)) return;
  
  const { props } = extractStylesAndProps(quasarNode);
  
  // Processar tamanho denso
  if (props.dense === 'true' || props.dense === '') {
    // Reduzir padding em 25-50%
    if ('paddingTop' in figmaNode) {
      figmaNode.paddingTop = Math.max(2, Math.floor(figmaNode.paddingTop * 0.75));
      figmaNode.paddingBottom = Math.max(2, Math.floor(figmaNode.paddingBottom * 0.75));
      figmaNode.paddingLeft = Math.max(4, Math.floor(figmaNode.paddingLeft * 0.75));
      figmaNode.paddingRight = Math.max(4, Math.floor(figmaNode.paddingRight * 0.75));
    }
    
    // Reduzir espaçamento entre itens
    if ('itemSpacing' in figmaNode) {
      figmaNode.itemSpacing = Math.max(2, Math.floor(figmaNode.itemSpacing * 0.75));
    }
  }
  
  // Processar tamanhos específicos
  if (props.size) {
    processSizeAttribute(figmaNode, props.size, componentType);
  }
}

/**
 * Processa o atributo size para diferentes tipos de componentes
 */
function processSizeAttribute(figmaNode: SceneNode & LayoutMixin, size: string, componentType: string): void {
  // Mapeamento padrão de tamanhos em pixels
  const sizes = {
    'xs': 0.6,   // 60% do tamanho base
    'sm': 0.8,   // 80% do tamanho base
    'md': 1.0,   // Tamanho base
    'lg': 1.2,   // 120% do tamanho base
    'xl': 1.5    // 150% do tamanho base
  };
  
  const sizeFactor = sizes[size as keyof typeof sizes] || 1.0;
  
  // Aplicar fator de tamanho para diferentes tipos de componentes
  switch (componentType) {
    case 'btn':
      if ('paddingTop' in figmaNode) {
        // Tamanho base para botões
        const basePaddingV = 8;
        const basePaddingH = 16;
        
        figmaNode.paddingTop = Math.round(basePaddingV * sizeFactor);
        figmaNode.paddingBottom = Math.round(basePaddingV * sizeFactor);
        figmaNode.paddingLeft = Math.round(basePaddingH * sizeFactor);
        figmaNode.paddingRight = Math.round(basePaddingH * sizeFactor);
      }
      break;
      
    case 'input':
    case 'select':
      if ('paddingTop' in figmaNode) {
        // Tamanho base para inputs
        const basePaddingV = 8;
        const basePaddingH = 12;
        
        figmaNode.paddingTop = Math.round(basePaddingV * sizeFactor);
        figmaNode.paddingBottom = Math.round(basePaddingV * sizeFactor);
        figmaNode.paddingLeft = Math.round(basePaddingH * sizeFactor);
        figmaNode.paddingRight = Math.round(basePaddingH * sizeFactor);
      }
      
      // Ajustar tamanho da fonte em nós de texto filhos
      if ('children' in figmaNode) {
        adjustTextSizeInChildren(figmaNode.children, sizeFactor);
      }
      break;
      
    case 'card':
      if ('paddingTop' in figmaNode) {
        // Tamanho base para cards
        const basePadding = 16;
        
        figmaNode.paddingTop = Math.round(basePadding * sizeFactor);
        figmaNode.paddingBottom = Math.round(basePadding * sizeFactor);
        figmaNode.paddingLeft = Math.round(basePadding * sizeFactor);
        figmaNode.paddingRight = Math.round(basePadding * sizeFactor);
      }
      break;
      
    // Outros tipos de componentes podem ser adicionados aqui
  }
}

/**
 * Ajusta o tamanho da fonte em nós de texto
 */
function adjustTextSizeInChildren(nodes: readonly SceneNode[], sizeFactor: number): void {
  for (const node of nodes) {
    if (node.type === 'TEXT') {
      // Ajustar tamanho da fonte
      node.fontSize = Math.round(node.fontSize * sizeFactor);
    } else if ('children' in node) {
      // Recursão para nós filhos
      adjustTextSizeInChildren(node.children, sizeFactor);
    }
  }
}

/**
 * Processa e aplica estados de componente (disabled, etc.)
 */
function processComponentState(figmaNode: SceneNode, quasarNode: QuasarNode): void {
  const { props } = extractStylesAndProps(quasarNode);
  
  // Verificar se está desabilitado
  const isDisabled = props.disable === 'true' || props.disable === '' || 
                     props.disabled === 'true' || props.disabled === '';
  
  if (isDisabled && 'opacity' in figmaNode) {
    figmaNode.opacity = 0.7;
    
    // Adicionar marca de estado no nome (para facilitar identificação)
    figmaNode.name += " (disabled)";
  }
  
  // Verificar se está ativo
  const isActive = props.active === 'true' || props.active === '';
  
  if (isActive && 'name' in figmaNode) {
    // Adicionar marca de estado no nome
    figmaNode.name += " (active)";
  }
}