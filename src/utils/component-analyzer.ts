// src/utils/component-analyzer.ts
import { QuasarNode } from '../types/settings';
import { getContrastingTextColor, getQuasarColor, detectColorClass } from '../utils/color-utils';

/**
 * Analisa um componente Quasar para detectar configurações de cor
 */
export function analyzeComponentColors(node: QuasarNode): {
  mainColor: string | null;
  textColor: string | null;
  bgColor: string | null;
  borderColor: string | null;
  colorVariant: 'standard' | 'flat' | 'outline' | null;
} 
{
  const result = {
    mainColor: null as string | null,
    textColor: null as string | null,
    bgColor: null as string | null,
    borderColor: null as string | null,
    colorVariant: null as 'standard' | 'flat' | 'outline' | null
  };
  
  // Verificar atributos de cor
  if (node.attributes) {
    // Verificação segura para a classe
    const classStr = node.attributes.class;
    if (classStr && typeof classStr === 'string') {
      const classes = classStr.split(/\s+/).filter(c => c);
      // Resto do processamento...
    } else {
      console.log(`Nó ${node.tagName} não possui classes para processar`);
    }
    // Cor principal
    if (node.attributes.color) {
      result.mainColor = node.attributes.color;
    }
    
    // Cor do texto
    if (node.attributes['text-color']) {
      result.textColor = node.attributes['text-color'];
    }
    
    // Verificar variantes de cor
    if ('flat' in node.attributes || node.attributes.flat === 'true' || node.attributes.flat === '') {
      result.colorVariant = 'flat';
    } else if ('outline' in node.attributes || node.attributes.outline === 'true' || node.attributes.outline === '') {
      result.colorVariant = 'outline';
    } else {
      result.colorVariant = 'standard';
    }
    
    // Analisar classes para detectar cores
    if (node.attributes.class) {
      const classes = node.attributes.class.split(/\s+/).filter(c => c);
      
      for (const className of classes) {
        const colorInfo = detectColorClass(className);
        
        if (colorInfo) {
          if (colorInfo.type === 'text') {
            result.textColor = colorInfo.colorName;
          } else if (colorInfo.type === 'background') {
            result.bgColor = colorInfo.colorName;
          }
        }
      }
    }
  }
  // Função para processar classes com segurança
  function processClassesSafely(classStr: string | undefined): string[] {
    if (!classStr || typeof classStr !== 'string') {
      return [];
    }
    return classStr.split(/\s+/).filter(Boolean);
  }

  // Usar em qualquer lugar que processe classes
  const classes = processClassesSafely(node.attributes?.class);
  // Inferir cores caso estejam faltando
  if (result.colorVariant === 'flat') {
    result.bgColor = null; // Sem cor de fundo para flat
    
    if (!result.textColor && result.mainColor) {
      result.textColor = result.mainColor;
    }
  } else if (result.colorVariant === 'outline') {
    result.bgColor = null; // Sem cor de fundo para outline
    result.borderColor = result.mainColor;
    
    if (!result.textColor && result.mainColor) {
      result.textColor = result.mainColor;
    }
  } else {
    // Estilo padrão
    if (!result.bgColor && result.mainColor) {
      result.bgColor = result.mainColor;
    }
    
    // Se cor do texto não está definida, será branco ou preto dependendo da cor de fundo
    if (!result.textColor && result.bgColor) {
      const bgColor = getQuasarColor(result.bgColor);
      if (bgColor) {
        // A cor de texto será determinada automaticamente ao aplicar ao nó
      }
    }
  }
  
  return result;
}

/**
 * Converte uma análise de cor em propriedades aplicáveis ao Figma
 */
export function colorAnalysisToFigmaProps(analysis: ReturnType<typeof analyzeComponentColors>): {
  fills?: Paint[];
  strokes?: Paint[];
  textColor?: RGB;
} 

{
  const result: { fills?: Paint[]; strokes?: Paint[]; textColor?: RGB } = {};
  
  // Processar cor de fundo
  if (analysis.bgColor || (analysis.mainColor && analysis.colorVariant === 'standard')) {
    const colorName = analysis.bgColor || analysis.mainColor;
    if (colorName) {
      const color = getQuasarColor(colorName);
      if (color) {
        result.fills = [{ type: 'SOLID', color }];
      }
    }
  } else if (analysis.colorVariant === 'flat' || analysis.colorVariant === 'outline') {
    // Fundo transparente
    result.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  }
  
  // Processar borda para outline
  if (analysis.colorVariant === 'outline' && analysis.mainColor) {
    const color = getQuasarColor(analysis.mainColor);
    if (color) {
      result.strokes = [{ type: 'SOLID', color }];
    }
  }
  
  // Processar cor de texto
  if (analysis.textColor) {
    const color = getQuasarColor(analysis.textColor);
    if (color) {
      result.textColor = color;
    }
  } else if (analysis.colorVariant === 'flat' && analysis.mainColor) {
    // No modo flat, texto usa a cor principal
    const color = getQuasarColor(analysis.mainColor);
    if (color) {
      result.textColor = color;
    }
  } else if (analysis.colorVariant === 'outline' && analysis.mainColor) {
    // No modo outline, texto usa a cor principal
    const color = getQuasarColor(analysis.mainColor);
    if (color) {
      result.textColor = color;
    }
  } else if (result.fills && result.fills[0].type === 'SOLID') {
    // Cor de texto contrastante com o fundo
    const bgColor = result.fills[0].color;
    result.textColor = getContrastingTextColor(bgColor);
  }
  
  return result;
}