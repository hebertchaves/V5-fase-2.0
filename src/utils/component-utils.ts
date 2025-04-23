import { QuasarNode, PluginSettings } from '../types/settings';
import { analyzeComponentColors, applyQuasarColors } from './color-utils';

/**
 * Processa propriedades comuns de componentes Quasar
 */
export function processCommonComponentProps(
  figmaNode: SceneNode, 
  quasarNode: QuasarNode, 
  componentType: string,
  settings: PluginSettings
): void {
  // Analisa todas as propriedades do componente
  const analysis = analyzeComponentColors(quasarNode);
  
  // Aplica cores e variantes específicas do componente
  applyQuasarColors(figmaNode, analysis, componentType);
}

/**
 * Função universal para aplicar tamanho e densidade a qualquer componente
 */
export function applyComponentSize(
  figmaNode: FrameNode, 
  size: string | null, 
  isDense: boolean, 
  componentType: string
): void {
  // Fatores de escala base para cada tipo de componente
  const sizeFactors: Record<string, Record<string, number>> = {
    'btn': {
      'xs': 0.6,
      'sm': 0.8,
      'md': 1.0,
      'lg': 1.2,
      'xl': 1.5
    },
    'card': {
      'xs': 0.7,
      'sm': 0.85,
      'md': 1.0,
      'lg': 1.15,
      'xl': 1.3
    },
    // Outros componentes
  };
  
  // Padding base para cada componente
  const basePadding: Record<string, { horizontal: number, vertical: number }> = {
    'btn': { horizontal: 16, vertical: 8 },
    'card': { horizontal: 16, vertical: 16 },
    // Outros componentes
  };
  
  // Obter os valores de referência para este componente
  const componentFactors = sizeFactors[componentType] || sizeFactors['btn'];
  const componentPadding = basePadding[componentType] || basePadding['btn'];
  
  // Calcular o fator de escala
  const scaleFactor = size ? (componentFactors[size] || 1.0) : 1.0;
  
  // Aplicar fator de densidade se necessário
  const densityFactor = isDense ? 0.75 : 1.0;
  
  // Calcular o padding final
  const paddingH = Math.round(componentPadding.horizontal * scaleFactor * densityFactor);
  const paddingV = Math.round(componentPadding.vertical * scaleFactor * densityFactor);
  
  // Aplicar ao nó Figma
  figmaNode.paddingLeft = paddingH;
  figmaNode.paddingRight = paddingH;
  figmaNode.paddingTop = paddingV;
  figmaNode.paddingBottom = paddingV;
  
  // Ajustar tamanho do texto e outros elementos internos
  adjustTextSize(figmaNode, scaleFactor * densityFactor);
}

/**
 * Ajusta o tamanho do texto em componentes
 */
function adjustTextSize(node: FrameNode, scaleFactor: number): void {
  for (const child of node.children) {
    if (child.type === 'TEXT') {
      // Tamanho base padrão é 14
      const baseFontSize = 14;
      child.fontSize = Math.round(baseFontSize * scaleFactor);
    } else if ('children' in child) {
      // Aplicar recursivamente para frames aninhados
      adjustTextSize(child as FrameNode, scaleFactor);
    }
  }
}