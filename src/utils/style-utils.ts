import { quasarColors } from '../data/color-map';
import { ExtractedStyles } from '../types/settings';
import quasarCssClasses, { processQuasarDynamicClass } from '../data/quasar-css-classes';

/**
 * Processa uma classe do Quasar para extrair valores de estilo
 */
export function processQuasarClass(className: string): Record<string, any> | null {
  // Mostrar debug da classe sendo processada
  console.log(`Processando classe: ${className}`);
  
  // Classes de espaçamento (q-pa-*, q-ma-*)
  if (className.match(/^q-([mp])([atrblxy])?-([a-z]+)$/)) {
    const result = processSpacingClass(className);
    console.log(`Resultado para ${className}:`, result);
    return result;
  }

  // Classes de espaçamento entre itens (q-gutter-*)
  if (className.match(/^q-gutter-([xy])?-?([a-z]+)$/)) {
    const result = processGutterClass(className);
    console.log(`Resultado para ${className}:`, result);
    return result;
  }
  
  // Verificar se é uma classe estática
  const staticClass = quasarCssClasses[className];
  if (staticClass) {
    console.log(`Encontrado estilo estático para ${className}:`, staticClass);
    return staticClass;
  }
  
  // Se não for uma classe estática, tenta processar como classe dinâmica
  const dynamicResult = processQuasarDynamicClass(className);
  if (dynamicResult) {
    console.log(`Encontrado estilo dinâmico para ${className}:`, dynamicResult);
    return dynamicResult;
  }
  
  // Adicionar mais processamentos específicos aqui
  
  // Não foi possível processar a classe
  console.log(`Não foi possível processar a classe: ${className}`);
  return null;
}

// Adicionar a função parseFontSize que estava faltando
function parseFontSize(value: string): number {
  const match = value.match(/^(\d+(?:\.\d+)?)(px|rem|em)?$/);
  if (!match) return 14; // valor padrão
  
  const numValue = parseFloat(match[1]);
  const unit = match[2] || 'px';
  
  if (unit === 'px') {
    return numValue;
  } else if (unit === 'rem' || unit === 'em') {
    return numValue * 16; // assumindo 1rem = 16px
  }
  
  return numValue;
}

export function extractInlineStyles(styleString: string): ExtractedStyles {
  const styles: ExtractedStyles = {};
  
  if (!styleString) return styles;
  
  const declarations = styleString.split(';');
  
  for (const declaration of declarations) {
    if (!declaration.trim()) continue;
    
    const colonPos = declaration.indexOf(':');
    if (colonPos === -1) continue;
    
    const property = declaration.substring(0, colonPos).trim();
    const value = declaration.substring(colonPos + 1).trim();
    
    if (!property || !value) continue;
    
    // Converter propriedades CSS para Figma
    switch (property) {
      case 'color':
      case 'background-color':
        const figmaColor = cssColorToFigmaColor(value);
        if (figmaColor) {
          if (property === 'color') {
            styles.fontColor = figmaColor;
          } else {
            styles.fills = [{ type: 'SOLID', color: figmaColor }];
          }
        }
        break;
      
      case 'font-size':
        styles.fontSize = parseFontSize(value);
        break;
      
      case 'font-weight':
        styles.fontWeight = value;
        break;
      
      // Adicionar mais mapeamentos conforme necessário
    }
  }
  
  return styles;
}

/**
 * Processa classes de espaçamento entre itens (gutter)
 */
function processGutterClass(className: string): Record<string, any> | null {
  const match = className.match(/^q-gutter-([xy])?-?([a-z]+)$/);
  if (!match) return null;
  
  const [, direction, size] = match;
  
  // Mapear tamanhos para valores em pixels
  const sizeValues: Record<string, number> = {
    'none': 0,
    'xs': 4,
    'sm': 8,
    'md': 16,
    'lg': 24,
    'xl': 32
  };
  
  const sizeValue = sizeValues[size] || 16;
  
  // No Figma, isso corresponde ao itemSpacing
  if (!direction) {
    return { itemSpacing: sizeValue };
  } else if (direction === 'x') {
    return { itemSpacingX: sizeValue }; // Não suportado diretamente no Figma
  } else if (direction === 'y') {
    return { itemSpacingY: sizeValue }; // Não suportado diretamente no Figma
  }
  
  return { itemSpacing: sizeValue };
}

// Nova função para processar classes de visibilidade
function processVisibilityClass(className: string): Record<string, any> | null {
  switch (className) {
    case 'hidden':
    case 'invisible':
    case 'display-none':
      return { visible: false };
    case 'visible':
    case 'display-block':
    case 'display-inline':
    case 'display-inline-block':
      return { visible: true };
    default:
      return null;
  }
}

/**
 * Processa classes de espaçamento (margin e padding)
 */
function processSpacingClass(className: string): Record<string, number> | null {
  const match = className.match(/^q-([mp])([atrblxy])?-([a-z]+)$/);
  if (!match) return null;
  
  const [, type, direction, size] = match;
  
  // Mapear tamanhos para valores em pixels
  const sizeValues: Record<string, number> = {
    'none': 0,
    'xs': 4,
    'sm': 8,
    'md': 16,
    'lg': 24,
    'xl': 32
  };
  
  const sizeValue = sizeValues[size] || 0;
  const result: Record<string, number> = {};
  
  // Aplicar em todas as direções
  if (type === 'p') { // Padding
    if (!direction || direction === 'a') {
      result.paddingTop = sizeValue;
      result.paddingRight = sizeValue;
      result.paddingBottom = sizeValue;
      result.paddingLeft = sizeValue;
    } else {
      // Direções específicas para padding
      if (direction === 't' || direction === 'y') {
        result.paddingTop = sizeValue;
      }
      if (direction === 'r' || direction === 'x') {
        result.paddingRight = sizeValue;
      }
      if (direction === 'b' || direction === 'y') {
        result.paddingBottom = sizeValue;
      }
      if (direction === 'l' || direction === 'x') {
        result.paddingLeft = sizeValue;
      }
    }
  } else { // Margin - no Figma implementamos como padding do container
    if (!direction || direction === 'a') {
      result.marginTop = sizeValue;
      result.marginRight = sizeValue;
      result.marginBottom = sizeValue;
      result.marginLeft = sizeValue;
    } else {
      // Direções específicas para margin
      if (direction === 't' || direction === 'y') {
        result.marginTop = sizeValue;
      }
      if (direction === 'r' || direction === 'x') {
        result.marginRight = sizeValue;
      }
      if (direction === 'b' || direction === 'y') {
        result.marginBottom = sizeValue;
      }
      if (direction === 'l' || direction === 'x') {
        result.marginLeft = sizeValue;
      }
    }
  }
  
  console.log(`Resultado para ${className}:`, result);
  return result;
}

/**
 * Processa classes de texto (text-h1, text-body1, etc)
 */
function processTextClass(className: string) {
  switch (className) {
    case 'text-h1':
      return { fontSize: 48, fontWeight: 'bold', letterSpacing: -0.5 };
    case 'text-h2':
      return { fontSize: 40, fontWeight: 'bold', letterSpacing: -0.4 };
    case 'text-h3':
      return { fontSize: 34, fontWeight: 'bold', letterSpacing: -0.3 };
    case 'text-h4':
      return { fontSize: 28, fontWeight: 'bold', letterSpacing: -0.2 };
    case 'text-h5':
      return { fontSize: 24, fontWeight: 'bold', letterSpacing: -0.1 };
    case 'text-h6':
      return { fontSize: 20, fontWeight: 'bold', letterSpacing: 0 };
    case 'text-subtitle1':
      return { fontSize: 16, fontWeight: 'regular', letterSpacing: 0.15 };
    case 'text-subtitle2':
      return { fontSize: 14, fontWeight: 'medium', letterSpacing: 0.1 };
    case 'text-body1':
      return { fontSize: 16, fontWeight: 'regular', letterSpacing: 0.5 };
    case 'text-body2':
      return { fontSize: 14, fontWeight: 'regular', letterSpacing: 0.25 };
    case 'text-caption':
      return { fontSize: 12, fontWeight: 'regular', letterSpacing: 0.4 };
    case 'text-overline':
      return { fontSize: 10, fontWeight: 'medium', letterSpacing: 1.5, textTransform: 'uppercase' };
    default:
      return null;
  }
}



/**
 * Processa classes de cor (bg-primary, text-red, etc)
 */
export function processColorClass(className: string, type: 'background' | 'text'): Record<string, any> | null {
  // Verificar se é uma classe de cor
  const match = className.match(/^(bg|text)-([a-z-]+)(\-\d+)?$/);
  if (!match) return null;

  const [, prefix, colorName, toneStr] = match;
  const isTextClass = prefix === 'text';
  const tone = toneStr ? parseInt(toneStr.substring(1)) : null;
  
  // Construir o nome completo da cor
  const fullColorName = tone ? `${colorName}-${tone}` : colorName;
  
  // Verificar se a cor existe no mapa de cores
  if (!quasarColors[fullColorName]) {
    // Se for uma variação tonal não reconhecida, tentar a cor base
    if (!quasarColors[colorName]) {
      return null;
    }
    
    // Usar a cor base
    const color = quasarColors[colorName];
    
    if (isTextClass) {
      return { fontColor: color };
    } else {
      return { fills: [{ type: 'SOLID', color }] };
    }
  }
  
  // Usar a cor completa
  const color = quasarColors[fullColorName];
  
  if (isTextClass) {
    return { fontColor: color };
  } else {
    return { fills: [{ type: 'SOLID', color }] };
  }
}
/**
 * Processa classes flexbox (row, column, etc)
 */
function processFlexboxClass(className: string) {
  switch (className) {
    case 'row':
      return { layoutMode: 'HORIZONTAL' };
    case 'column':
      return { layoutMode: 'VERTICAL' };
    case 'items-start':
      return { counterAxisAlignItems: 'MIN' };
    case 'items-center':
      return { counterAxisAlignItems: 'CENTER' };
    case 'items-end':
      return { counterAxisAlignItems: 'MAX' };
    case 'justify-start':
      return { primaryAxisAlignItems: 'MIN' };
    case 'justify-center':
      return { primaryAxisAlignItems: 'CENTER' };
    case 'justify-end':
      return { primaryAxisAlignItems: 'MAX' };
    case 'justify-between':
      return { primaryAxisAlignItems: 'SPACE_BETWEEN' };
    default:
      return null;
  }
}

/**
 * Processa classes de alinhamento de texto
 */
function processTextAlignmentClass(className: string) {
  switch (className) {
    case 'text-left':
      return { textAlignHorizontal: 'LEFT' };
    case 'text-center':
      return { textAlignHorizontal: 'CENTER' };
    case 'text-right':
      return { textAlignHorizontal: 'RIGHT' };
    case 'text-justify':
      return { textAlignHorizontal: 'JUSTIFIED' };
    default:
      return null;
  }
}

/**
 * Converte uma cor CSS para o formato Figma RGB
 */
export function cssColorToFigmaColor(cssColor: string) {
  // Hex
  if (cssColor.startsWith('#')) {
    let hex = cssColor.substring(1);
    
    // Converter #RGB para #RRGGBB
    if (hex.length === 3) {
      hex = hex.split('').map(h => h + h).join('');
    }
    
    // Extrair componentes RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Extrair alpha se disponível (#RRGGBBAA)
    let a = 1;
    if (hex.length === 8) {
      a = parseInt(hex.substring(6, 8), 16) / 255;
    }
    
    return a < 1 ? { r, g, b, a } : { r, g, b };
  }
  
  // RGB/RGBA
  if (cssColor.startsWith('rgb')) {
    const values = cssColor.match(/\d+(\.\d+)?/g);
    
    if (values && values.length >= 3) {
      const r = parseInt(values[0]) / 255;
      const g = parseInt(values[1]) / 255;
      const b = parseInt(values[2]) / 255;
      const a = values.length === 4 ? parseFloat(values[3]) : 1;
      
      return a < 1 ? { r, g, b, a } : { r, g, b };
    }
  }
  
  // Cores nomeadas comuns
  const namedColors = {
    'white': { r: 1, g: 1, b: 1 },
    'black': { r: 0, g: 0, b: 0 },
    'red': { r: 1, g: 0, b: 0 },
    'green': { r: 0, g: 0.8, b: 0 },
    'blue': { r: 0, g: 0, b: 1 },
    'yellow': { r: 1, g: 1, b: 0 },
    'purple': { r: 0.5, g: 0, b: 0.5 },
    'orange': { r: 1, g: 0.65, b: 0 },
    'gray': { r: 0.5, g: 0.5, b: 0.5 },
    'transparent': { r: 0, g: 0, b: 0, a: 0 }
  };
  
  return namedColors[cssColor.toLowerCase()];
}
/**
 * Processa classes de dimensões completas (full-width, full-height)
 */
function processFullDimensionClass(className: string): Record<string, any> | null {
  if (className === 'full-width') {
    return { 
      counterAxisSizingMode: "FIXED",
      primaryAxisSizingMode: "FILL_CONTAINER",
      width: '100%'
    };
  } else if (className === 'full-height') {
    return { 
      primaryAxisSizingMode: "FIXED", 
      counterAxisSizingMode: "FILL_CONTAINER",
      height: '100%'
    };
  } else if (className === 'full-screen') {
    return { 
      primaryAxisSizingMode: "FILL_CONTAINER",
      counterAxisSizingMode: "FILL_CONTAINER",
      width: '100%',
      height: '100%'
    };
  }
  
  return null;
}

/**
 * Processa classes de arredondamento (rounded, rounded-borders)
 */
function processRoundedClass(className: string): Record<string, any> | null {
  if (className === 'rounded-borders') {
    return { cornerRadius: 4 };
  } else if (className === 'rounded') {
    return { cornerRadius: 28 }; // Mais arredondado
  } else if (className.match(/^rounded-(\d+)$/)) {
    const match = className.match(/^rounded-(\d+)$/);
    if (match) {
      const radius = parseInt(match[1]);
      return { cornerRadius: radius };
    }
  }
  
  return null;
}