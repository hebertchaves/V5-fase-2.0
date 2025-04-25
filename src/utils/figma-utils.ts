// src/utils/figma-utils.ts

import { RGB, RGBA, ExtractedStyles } from '../types/settings';



/**
 * Carrega as fontes necessárias para uso no Figma
 */
export async function loadRequiredFonts() {
  // Lista de fontes primárias e alternativas, priorizando Material Icons
  const fontOptions = [
    // Primeiro carregar as fontes de ícones - prioridade alta
    { family: "Material Icons", style: "Regular" },
    { family: "Material Icons Outlined", style: "Regular" },
    { family: "Material Symbols Outlined", style: "Regular" },
    
    // Depois carregar as fontes de texto - prioridade média
    { family: "Roboto", style: "Regular" },
    { family: "Roboto", style: "Medium" },
    { family: "Roboto", style: "Bold" },
    
    // Fontes alternativas - prioridade baixa
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Bold" },
    { family: "Arial", style: "Regular" },
    { family: "San Francisco", style: "Regular" },
    { family: "Helvetica", style: "Regular" }
  ];
  
  // Carregando fontes com tratamento de erro
  const loadedFonts = [];
  
  // Primeira tentativa: carregar as fontes de alta prioridade (ícones)
  for (let i = 0; i < 3; i++) {
    try {
      await figma.loadFontAsync(fontOptions[i]);
      loadedFonts.push(fontOptions[i].family + " " + fontOptions[i].style);
      console.log(`Fonte de ícones carregada com sucesso: ${fontOptions[i].family} ${fontOptions[i].style}`);
    } catch (error) {
      console.warn(`Falha ao carregar fonte de ícones ${fontOptions[i].family} ${fontOptions[i].style}: ${error}`);
    }
  }
  
  // Segunda tentativa: carregar as outras fontes
  const fontLoadPromises = [];
  for (let i = 3; i < fontOptions.length; i++) {
    try {
      const fontPromise = figma.loadFontAsync(fontOptions[i])
        .then(() => {
          loadedFonts.push(fontOptions[i].family + " " + fontOptions[i].style);
          console.log(`Fonte carregada com sucesso: ${fontOptions[i].family} ${fontOptions[i].style}`);
        })
        .catch(error => {
          console.warn(`Falha ao carregar fonte ${fontOptions[i].family} ${fontOptions[i].style}: ${error}`);
        });
      
      fontLoadPromises.push(fontPromise);
    } catch (error) {
      console.warn(`Erro ao iniciar carregamento da fonte ${fontOptions[i].family} ${fontOptions[i].style}: ${error}`);
    }
  }
  
  // Aguardar todas as tentativas de carregamento de fontes regulares
  await Promise.allSettled(fontLoadPromises);
  
  // Se nenhuma fonte de ícones for carregada, emitir aviso mais claro
  if (!loadedFonts.some(font => font.includes("Material Icons") || font.includes("Material Symbols"))) {
    console.warn('AVISO: Nenhuma fonte de ícones foi carregada. Os ícones serão exibidos como placeholders.');
  }
  
  return loadedFonts.length > 0;
}

// Melhorar a função createText com retry e fallback robustos
// Modificação em src/utils/figma-utils.ts

export async function createText(content: string, options: any = {}): Promise<TextNode | null> {
  if (!content) content = '';
  
  try {
    const textNode = figma.createText();
    
    // Determinar a fonte a ser usada
    const fontFamily = options.fontFamily || "Roboto";
    const fontStyle = options.fontStyle || (options.fontWeight === 'bold' ? "Bold" : 
                                           options.fontWeight === 'medium' ? "Medium" : "Regular");
    
    // Tentar carregar a fonte primária
    try {
      await figma.loadFontAsync({ family: fontFamily, style: fontStyle });
      textNode.fontName = { family: fontFamily, style: fontStyle };
    } catch (error) {
      console.warn(`Não foi possível carregar a fonte ${fontFamily} ${fontStyle}, tentando alternativas`);
      
      // Tentar fontes alternativas em ordem de preferência
      const alternativeFonts = [
        { family: "Roboto", style: fontStyle },
        { family: "Inter", style: fontStyle },
        { family: "Roboto", style: "Regular" },
        { family: "Inter", style: "Regular" }
      ];
      
      let fontLoaded = false;
      for (const alternativeFont of alternativeFonts) {
        try {
          await figma.loadFontAsync(alternativeFont);
          textNode.fontName = alternativeFont;
          fontLoaded = true;
          console.log(`Usando fonte alternativa: ${alternativeFont.family} ${alternativeFont.style}`);
          break;
        } catch (innerError) {
          continue;
        }
      }
      
      if (!fontLoaded) {
        throw new Error("Não foi possível carregar nenhuma fonte");
      }
    }
    
    // Definir o texto
    textNode.characters = content;
    
    // Configurações de texto
    if (options.fontSize) textNode.fontSize = options.fontSize;
    
    // Cor do texto
    if (options.color) {
      textNode.fills = [{ type: 'SOLID', color: options.color }];
    }
    
    // Opacidade
    if (options.opacity !== undefined && textNode.fills && Array.isArray(textNode.fills) && textNode.fills.length > 0) {
      const newFills = [];
      for (let i = 0; i < textNode.fills.length; i++) {
        const fill = textNode.fills[i];
        // Criar uma cópia do objeto fill
        const newFill = {...fill};
        // Definir opacidade na cópia
        if (newFill.type === 'SOLID') {
          newFill.opacity = options.opacity;
        }
        newFills.push(newFill);
      }
      // Atribuir os novos fills
      textNode.fills = newFills;
    }
    
    // Alinhamento
    if (options.alignment) {
      textNode.textAlignHorizontal = options.alignment;
    }
    
    if (options.verticalAlignment) {
      textNode.textAlignVertical = options.verticalAlignment;
    }
    
    return textNode;
  } catch (error) {
    console.error('Erro ao criar texto:', error);
    return null;
  }
}
// Função existente que precisa ser exportada
export function setNodeSize(node: SceneNode, width: number, height?: number) {
  if ('resize' in node) {
    node.resize(width, height !== undefined ? height : (node as any).height);
  }
}

/**
 * Aplica estilos a um nó do Figma
 */
export function applyStylesToFigmaNode(node: any, styles: Record<string, any>) {
  if (!styles || typeof styles !== 'object') return;
  
  // Processa cada propriedade de estilo
  Object.entries(styles).forEach(([key, value]) => {
    try {
      switch (key) {
        case 'fills':
        case 'strokes':
        case 'effects':
          if (Array.isArray(value)) {
            node[key] = value;
          }
          break;
          
        case 'fontColor':
          if (node.type === 'TEXT' || (node.fills && Array.isArray(node.fills))) {
            const fills = node.fills ? [...node.fills] : [];
            if (fills.length > 0 && fills[0].type === 'SOLID') {
              fills[0].color = value;
            } else {
              fills[0] = { type: 'SOLID', color: value };
            }
            node.fills = fills;
          }
          break;
          
        case 'textCase':
          if (node.type === 'TEXT') {
            switch (value) {
              case 'UPPER':
                node.textCase = 'UPPER';
                break;
              case 'LOWER':
                node.textCase = 'LOWER';
                break;
              case 'TITLE':
                node.textCase = 'TITLE';
                break;
              default:
                node.textCase = 'ORIGINAL';
            }
          }
          break;
          
        case 'fontStyle':
          if (node.type === 'TEXT' && value === 'italic') {
            // Carregar a fonte itálica antes de aplicar
            figma.loadFontAsync({ family: node.fontName.family, style: 'Italic' })
              .then(() => {
                node.fontName = { ...node.fontName, style: 'Italic' };
              })
              .catch(() => {
                console.warn('Não foi possível carregar a fonte itálica');
              });
          }
          break;
          
        case 'fontSize':
        case 'fontWeight':
        case 'lineHeight':
        case 'letterSpacing':
        case 'textDecoration':
          if (node.type === 'TEXT') {
            node[key] = value;
          }
          break;
          
        case 'cornerRadius':
          if ('cornerRadius' in node) {
            node.cornerRadius = value;
          }
          break;
          
        case 'opacity':
          if ('opacity' in node) {
            node.opacity = value;
          }
          break;
          
        case 'rotation':
          if ('rotation' in node) {
            node.rotation = value;
          }
          break;
          
        case 'width':
        case 'height':
          if (value === '100%') {
            // Tentar todas as abordagens possíveis para aplicar largura total
            if ('layoutAlign' in node) {
              node.layoutAlign = "STRETCH";
            }
            if ('layoutGrow' in node) {
              node.layoutGrow = 1;
            }
            if ('primaryAxisSizingMode' in node && key === 'width') {
              node.primaryAxisSizingMode = "FILL_CONTAINER";
            }
            if ('counterAxisSizingMode' in node && key === 'height') {
              node.counterAxisSizingMode = "FILL_CONTAINER";
            }
            if ('constraints' in node) {
              if (key === 'width') {
                node.constraints = { ...node.constraints, horizontal: 'STRETCH' };
              } else {
                node.constraints = { ...node.constraints, vertical: 'STRETCH' };
              }
            }
            // Log para debug
            console.log(`Aplicando ${key}=100% ao nó ${node.name}`);
          } else if (typeof value === 'number') {
            if ('resize' in node) {
              if (key === 'width') {
                node.resize(value, node.height);
              } else {
                node.resize(node.width, value);
              }
            }
          }
          break;
          
        case 'constraints':
          if ('constraints' in node) {
            node.constraints = { ...node.constraints, ...value };
          }
          break;
          
        case 'clipsContent':
          if ('clipsContent' in node) {
            node.clipsContent = value;
          }
          break;
          
        case 'textTruncation':
        case 'maxLines':
          if (node.type === 'TEXT') {
            if (key === 'textTruncation') {
              node.textTruncation = value;
            } else if (key === 'maxLines') {
              node.maxLines = value;
            }
          }
          break;
          
        case 'itemSpacing':
          if ('itemSpacing' in node) {
            if (typeof value === 'number' && !isNaN(value)) {
              console.log(`Aplicando itemSpacing=${value} a ${node.name}`);
              node.itemSpacing = value;
            }
          }
          break;
          
        case 'itemSpacingX':
        case 'itemSpacingY':
          if ((key === 'itemSpacingX' || key === 'itemSpacingY') && 'layoutMode' in node) {
            // No Figma, itemSpacing é unidirecional baseado no layoutMode
            if ((node.layoutMode === 'HORIZONTAL' && key === 'itemSpacingX') ||
                (node.layoutMode === 'VERTICAL' && key === 'itemSpacingY')) {
              if (typeof value === 'number' && !isNaN(value)) {
                node.itemSpacing = value;
              }
            }
          }
          break;
          
        case 'paddingTop':
        case 'paddingRight':
        case 'paddingBottom':
        case 'paddingLeft':
          if (key in node) {
            // Verificar se é um número válido
            if (typeof value === 'number' && !isNaN(value)) {
              console.log(`Aplicando ${key}=${value} a ${node.name}`);
              node[key] = value;
            }
          }
          break;
          
        case 'marginTop':
        case 'marginRight':
        case 'marginBottom':
        case 'marginLeft':
          // Margins são tratados através de Auto Layout no Figma
          // Podemos simular com um frame wrapper se necessário
          console.info(`Margem ${key} não é diretamente suportada no Figma, use Auto Layout`);
          break;
          
        case 'scaleX':
        case 'scaleY':
          if ('rescale' in node) {
            const scaleX = key === 'scaleX' ? value : 1;
            const scaleY = key === 'scaleY' ? value : 1;
            node.rescale(scaleX, scaleY);
          }
          break;
          
        case 'layoutAlign':
          if ('layoutAlign' in node) {
            node.layoutAlign = value;
          }
          break;
          
        case 'layoutGrow':
          if ('layoutGrow' in node) {
            node.layoutGrow = value;
          }
          break;
          
        case 'primaryAxisSizingMode':
          if ('primaryAxisSizingMode' in node) {
            node.primaryAxisSizingMode = value;
          }
          break;
          
        case 'counterAxisSizingMode':
          if ('counterAxisSizingMode' in node) {
            node.counterAxisSizingMode = value;
          }
          break;
          
        case 'primaryAxisAlignItems':
          if ('primaryAxisAlignItems' in node) {
            node.primaryAxisAlignItems = value;
          }
          break;
          
        case 'counterAxisAlignItems':
          if ('counterAxisAlignItems' in node) {
            node.counterAxisAlignItems = value;
          }
          break;
          
        case 'layoutMode':
          if ('layoutMode' in node) {
            node.layoutMode = value;
          }
          break;
          
        default:
          // Tentar aplicar a propriedade diretamente
          if (key in node) {
            node[key] = value;
          }
      }
    } catch (error) {
      console.warn(`Não foi possível aplicar a propriedade ${key} ao nó:`, error);
    }
  });

  // Garantir que a aplicação de propriedades de estilo foi concluída
  console.log(`Estilos aplicados ao nó ${node.name}`);
}

/**
 * Cria um efeito de sombra para nós Figma
 */
export function createShadowEffect(
  offsetX: number, 
  offsetY: number, 
  radius: number, 
  opacity: number, 
  color: RGB = { r: 0, g: 0, b: 0 }
): Effect {
  return {
    type: 'DROP_SHADOW',
    color: { ...color, a: opacity },
    offset: { x: offsetX, y: offsetY },
    radius: radius,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  } as Effect;
}

/**
 * Determina a cor de texto contrastante com base na cor de fundo
 */
export function getContrastingTextColor(bgColor: RGB): RGB {
  // Calcular luminosidade aproximada
  const luminance = 0.299 * bgColor.r + 0.587 * bgColor.g + 0.114 * bgColor.b;
  
  // Se a luminosidade for alta, usar texto escuro, caso contrário usar texto claro
  return luminance > 0.5 ? { r: 0, g: 0, b: 0 } : { r: 1, g: 1, b: 1 };
}

/**
 * Verifica se um Paint é do tipo SolidPaint
 */
export function isSolidPaint(paint: Paint): paint is SolidPaint {
  return paint.type === 'SOLID';
}

/**
 * Converte uma cor CSS para o formato Figma
 */
export function cssColorToFigmaColor(cssColor: string): RGB | RGBA | null {
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
    
    return { r, g, b, a };
  }
  
  // RGB/RGBA
  if (cssColor.startsWith('rgb')) {
    const values = cssColor.match(/\d+(\.\d+)?/g);
    
    if (values && values.length >= 3) {
      const r = parseInt(values[0]) / 255;
      const g = parseInt(values[1]) / 255;
      const b = parseInt(values[2]) / 255;
      const a = values.length === 4 ? parseFloat(values[3]) : 1;
      
      return { r, g, b, a };
    }
  }
  
  // Cores nomeadas comuns
  const namedColors: Record<string, RGB> = {
    'white': { r: 1, g: 1, b: 1 },
    'black': { r: 0, g: 0, b: 0 },
    'red': { r: 1, g: 0, b: 0 },
    'green': { r: 0, g: 0.8, b: 0 },
    'blue': { r: 0, g: 0, b: 1 },
    'yellow': { r: 1, g: 1, b: 0 },
    'gray': { r: 0.5, g: 0.5, b: 0.5 },
    'transparent': { r: 0, g: 0, b: 0 }
  };
  
  if (namedColors[cssColor.toLowerCase()]) {
    return namedColors[cssColor.toLowerCase()];
  }
  
  return null;
}

/**
 * Extrai estilos de uma string CSS inline
 */
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
    
    // Converter para camelCase para compatibilidade com API do Figma
    const camelProperty = property.replace(/-([a-z])/g, (_, g1) => g1.toUpperCase());
    
    // Processar valores específicos
    if (property.includes('color')) {
      const figmaColor = cssColorToFigmaColor(value);
      if (figmaColor) {
        if (property === 'color') {
          styles.fontColor = figmaColor;
        } else if (property === 'background-color') {
          styles.fills = [{ type: 'SOLID', color: figmaColor }];
        }
        continue;
      }
    }
    
    // Processar padding e margin
    if (property.startsWith('padding')) {
      processPaddingProperty(property, value, styles);
      continue;
    }
    
    if (property.startsWith('margin')) {
      processMarginProperty(property, value, styles);
      continue;
    }
    
    // Processar propriedades de texto
    if (property === 'font-size') {
      styles.fontSize = parseFontSize(value);
      continue;
    }
    
    if (property === 'font-weight') {
      styles.fontWeight = value;
      continue;
    }
    
    if (property === 'text-align') {
      styles.textAlignHorizontal = getTextAlignment(value);
      continue;
    }
    
    // Processar bordas
    if (property === 'border-radius') {
      styles.cornerRadius = parseInt(value);
      continue;
    }
    
    // Adicionar outras propriedades diretamente
    styles[camelProperty] = value;
  }
  
  return styles;
}

/**
 * Funções auxiliares para processar propriedades CSS específicas
 */
function processPaddingProperty(property: string, value: string, styles: ExtractedStyles) {
  const pixels = parsePixelValue(value);
  if (pixels === null) return;
  
  if (property === 'padding') {
    // Valor único aplica a todos os lados
    styles.paddingTop = pixels;
    styles.paddingRight = pixels;
    styles.paddingBottom = pixels;
    styles.paddingLeft = pixels;
  } else if (property === 'padding-top') {
    styles.paddingTop = pixels;
  } else if (property === 'padding-right') {
    styles.paddingRight = pixels;
  } else if (property === 'padding-bottom') {
    styles.paddingBottom = pixels;
  } else if (property === 'padding-left') {
    styles.paddingLeft = pixels;
  }
}

function processMarginProperty(property: string, value: string, styles: ExtractedStyles) {
  // Implementação similar ao padding
  // (Omitido por brevidade, já que margin geralmente não tem impacto direto no Figma)
}

/**
 * Cria um retângulo com as dimensões e propriedades especificadas
 */
export function createRectangle(width: number, height: number, options: {
  color?: RGB;
  cornerRadius?: number;
  stroke?: RGB;
  strokeWeight?: number;
} = {}): RectangleNode {
  const rect = figma.createRectangle();
  rect.resize(width, height);
  
  if (options.color) {
    rect.fills = [{ type: 'SOLID', color: options.color }];
  }
  
  if (options.cornerRadius !== undefined) {
    rect.cornerRadius = options.cornerRadius;
  }
  
  if (options.stroke) {
    rect.strokes = [{ type: 'SOLID', color: options.stroke }];
    rect.strokeWeight = options.strokeWeight || 1;
  }
  
  return rect;
}

function parsePixelValue(value: string): number | null {
  const match = value.match(/^(\d+)(px|rem|em)?$/);
  if (!match) return null;
  
  const numValue = parseInt(match[1]);
  const unit = match[2] || 'px';
  
  if (unit === 'px') {
    return numValue;
  } else if (unit === 'rem' || unit === 'em') {
    // Considerando 1rem/em = 16px (aproximação)
    return numValue * 16;
  }
  
  return numValue;
}

function parseFontSize(value: string): number {
  // Extrair valor numérico de qualquer unidade
  const pixels = parsePixelValue(value);
  if (pixels !== null) return pixels;
  
  // Valores nomeados comuns
  const fontSizes: Record<string, number> = {
    'small': 12,
    'medium': 14,
    'large': 16,
    'x-large': 20,
    'xx-large': 24
  };
  
  return fontSizes[value] || 14; // 14px como padrão
}

function getTextAlignment(value: string): 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED' | 'BETWEEN' | 'AROUND' {
  switch (value) {
    case 'left': return 'LEFT';
    case 'center': return 'CENTER';
    case 'right': return 'RIGHT';
    case 'justify': return 'JUSTIFIED';
    case 'between': return 'CENTER';
    case 'around': return 'CENTER';
    default: return 'LEFT';
  }
}