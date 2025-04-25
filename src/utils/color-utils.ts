// src/utils/color-utils.ts (versão corrigida)
import { QuasarNode } from '../types/settings';
import { quasarColors } from '../data/color-map';

/**
 * Obtém a cor RGB do Quasar a partir do nome da cor
 */
export function getQuasarColor(colorName: string): RGB | null {
  // Verificar se é uma variação tonal (ex: "primary-7")
  const colorMatch = colorName.match(/^([a-z-]+)-(\d+)$/);
  if (colorMatch) {
    const baseColor = colorMatch[1];
    const tone = parseInt(colorMatch[2]);
    
    const fullColorName = `${baseColor}-${tone}`;
    return quasarColors[fullColorName] || quasarColors[baseColor] || null;
  }
  
  return quasarColors[colorName] || null;
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
 * Detecta classes de cor
 */
export function detectColorClass(className: string): { type: 'text' | 'background', colorName: string } | null {
  // Verificar se é uma classe de cor
  const match = className.match(/^(bg|text)-([a-z-]+)(\-\d+)?$/);
  if (!match) return null;

  const [, prefix, colorName, toneStr] = match;
  const isTextClass = prefix === 'text';
  const tone = toneStr ? parseInt(toneStr.substring(1)) : null;
  
  // Construir o nome completo da cor
  const fullColorName = tone ? `${colorName}-${tone}` : colorName;
  
  return {
    type: isTextClass ? 'text' : 'background',
    colorName: fullColorName
  };
}

/**
 * Analisa um componente Quasar para detectar configurações de cor
 */
export function analyzeComponentColors(node: QuasarNode): {
  mainColor: string | null;
  textColor: string | null;
  bgColor: string | null;
  borderColor: string | null;
  // Adicionar novas propriedades
  colorVariant: 'standard' | 'flat' | 'outline' | 'push' | 'glossy' | 'unelevated' | null;
  shapeVariant: 'default' | 'rounded' | 'round' | 'square' | null;
  sizeVariant: string | null;
  isDense: boolean;
  isDisabled: boolean;
  isLoading: boolean;
} {
  const result = {
    mainColor: null as string | null,
    textColor: null as string | null,
    bgColor: null as string | null,
    borderColor: null as string | null,
    colorVariant: null as 'standard' | 'flat' | 'outline' | 'push' | 'glossy' | 'unelevated' | null,
    shapeVariant: null as 'default' | 'rounded' | 'round' | 'square' | null,
    sizeVariant: null as string | null,
    isDense: false,
    isDisabled: false,
    isLoading: false
  };
  
  // Código existente para detecção de cores
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
    } else if ('push' in node.attributes || node.attributes.push === 'true' || node.attributes.push === '') {
      result.colorVariant = 'push';
    } else if ('glossy' in node.attributes || node.attributes.glossy === 'true' || node.attributes.glossy === '') {
      result.colorVariant = 'glossy';
    } else if ('unelevated' in node.attributes || node.attributes.unelevated === 'true' || node.attributes.unelevated === '') {
      result.colorVariant = 'unelevated';
    } else {
      result.colorVariant = 'standard';
    }
    
    // Verificar variantes de forma
    if ('rounded' in node.attributes || node.attributes.rounded === 'true' || node.attributes.rounded === '') {
      result.shapeVariant = 'rounded';
    } else if ('round' in node.attributes || node.attributes.round === 'true' || node.attributes.round === '') {
      result.shapeVariant = 'round';
    } else if ('square' in node.attributes || node.attributes.square === 'true' || node.attributes.square === '') {
      result.shapeVariant = 'square';
    } else {
      result.shapeVariant = 'default';
    }
    
    // Verificar tamanho
    if (node.attributes.size) {
      result.sizeVariant = node.attributes.size;
    }
    
    // Verificar densidade
    if ('dense' in node.attributes || node.attributes.dense === 'true' || node.attributes.dense === '') {
      result.isDense = true;
    }
    
    // Verificar se está desabilitado
    if ('disable' in node.attributes || node.attributes.disable === 'true' || node.attributes.disable === '' ||
        'disabled' in node.attributes || node.attributes.disabled === 'true' || node.attributes.disabled === '') {
      result.isDisabled = true;
    }
    
    // Verificar se está carregando
    if ('loading' in node.attributes || node.attributes.loading === 'true' || node.attributes.loading === '') {
      result.isLoading = true;
    }
    
    // Restante do código existente para análise de classes...

        // Função para processar classes com segurança
        function processClassesSafely(classStr: string | undefined): string[] {
          if (!classStr || typeof classStr !== 'string') {
            return [];
          }
          return classStr.split(/\s+/).filter(Boolean);
        }
    
        // Usar em qualquer lugar que processe classes
        const classes = processClassesSafely(node.attributes?.class);
  }
  
  // Código existente para inferir cores...
  
  return result;
}

/**
 * Converte uma análise de cor em propriedades aplicáveis ao Figma
 */
export function colorAnalysisToFigmaProps(analysis: ReturnType<typeof analyzeComponentColors>): {
  fills?: Paint[];
  strokes?: Paint[];
  textColor?: RGB;
} {
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

/**
 * Função unificada para aplicar cores a componentes Figma
 */
export function applyQuasarColors(
  node: any,
  analysis: ReturnType<typeof analyzeComponentColors>,
  componentType: string
): void {
  // Verificar se o nó é válido
  if (!node) {
    console.warn('Nó inválido passado para applyQuasarColors');
    return;
  }
  
  // Aplicar cores de acordo com o tipo de componente
  switch (componentType) {
    case 'btn':
      applyButtonColors(node, analysis);
      break;
    case 'card':
      applyCardColors(node, analysis);
      break;
    // Adicionar mais tipos de componentes conforme necessário
    default:
      applyGenericColors(node, analysis);
      break;
  }
  
  // NÃO usar setPluginData para evitar erros
}

/**
 * Aplica cores a botões
 */
function applyButtonColors(node: SceneNode, analysis: ReturnType<typeof analyzeComponentColors>): void {
  if (!('fills' in node)) return;
  
  const { 
    mainColor, 
    textColor, 
    colorVariant, 
    shapeVariant, 
    sizeVariant, 
    isDense, 
    isDisabled, 
    isLoading 
  } = analysis;
  
  // Obter as cores RGB
  const mainColorRGB = mainColor ? getQuasarColor(mainColor) : null;
  const textColorRGB = textColor ? getQuasarColor(textColor) : null;
  
  // Aplicar variantes de forma - verificar se a propriedade existe e é editável
  if ('cornerRadius' in node && node.cornerRadius !== undefined) {
    // Verificar se estamos lidando com um tipo que permite editar cornerRadius
    const editableNode = node as unknown as { cornerRadius: number };
    
    try {
      switch (shapeVariant) {
        case 'rounded':
          editableNode.cornerRadius = 28; // Botão mais arredondado
          break;
        case 'round':
          editableNode.cornerRadius = 9999; // Valor grande para garantir forma circular
          break;
        case 'square':
          editableNode.cornerRadius = 0; // Sem arredondamento
          break;
        default:
          editableNode.cornerRadius = 4; // Valor padrão
          break;
      }
    } catch (error) {
      console.warn('Não foi possível modificar cornerRadius:', error);
    }
  }
  
  // Aplicar cor com base na variante
  switch (colorVariant) {
    case 'flat':
      // Botão flat: fundo transparente, texto colorido
      node.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
      
      // Procurar nós de texto filhos e aplicar cor
      if ('children' in node) {
        applyColorToTextNodes(
          node.children, 
          textColorRGB || mainColorRGB || { r: 0, g: 0, b: 0 },
          isDisabled ? 0.5 : 1
        );
      }
      break;
      
    case 'outline':
      // Botão outline: borda colorida, fundo transparente
      node.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
      
      if (mainColorRGB && 'strokes' in node) {
        node.strokes = [{ type: 'SOLID', color: mainColorRGB }];
        node.strokeWeight = 1;
      }
      
      // Procurar nós de texto filhos e aplicar cor
      if ('children' in node) {
        applyColorToTextNodes(
          node.children,
          textColorRGB || mainColorRGB || { r: 0, g: 0, b: 0 },
          isDisabled ? 0.5 : 1
        );
      }
      break;
      
    case 'push':
      // Botão push: cor sólida com sombra mais pronunciada
      if (mainColorRGB) {
        node.fills = [{ type: 'SOLID', color: mainColorRGB }];
      }
      
      // Adicionar sombra mais pronunciada
      if ('effects' in node) {
        node.effects = [
          {
            type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.3 },
            offset: { x: 0, y: 3 },
            radius: 5,
            spread: 1,
            visible: true,
            blendMode: 'NORMAL'
          }
        ];
      }
      
      // Procurar nós de texto filhos e aplicar cor contrastante
      if ('children' in node && mainColorRGB) {
        const contrastText = textColorRGB || getContrastingTextColor(mainColorRGB);
        applyColorToTextNodes(node.children, contrastText, isDisabled ? 0.5 : 1);
      }
      break;
      
    case 'glossy':
      // Botão glossy: gradiente baseado na cor principal
      if (mainColorRGB && 'fills' in node) {
        // Criar gradiente baseado na cor principal
        const lighterColor = {
          r: Math.min(1, mainColorRGB.r * 1.2),
          g: Math.min(1, mainColorRGB.g * 1.2),
          b: Math.min(1, mainColorRGB.b * 1.2)
        };
        
        node.fills = [
          {
            type: 'GRADIENT_LINEAR',
            gradientTransform: [
              [0, 1, 0],
              [-1, 0, 1]
            ],
            gradientStops: [
              { position: 0, color: { ...lighterColor, a: 1 } },
              { position: 1, color: { ...mainColorRGB, a: 1 } }
            ]
          }
        ];
      }
      
      // Procurar nós de texto filhos e aplicar cor contrastante
      if ('children' in node && mainColorRGB) {
        const contrastText = textColorRGB || getContrastingTextColor(mainColorRGB);
        applyColorToTextNodes(node.children, contrastText, isDisabled ? 0.5 : 1);
      }
      break;
      
    case 'unelevated':
      // Botão unelevated: cor sólida sem sombra
      if (mainColorRGB) {
        node.fills = [{ type: 'SOLID', color: mainColorRGB }];
      }
      
      // Remover sombras
      if ('effects' in node) {
        node.effects = [];
      }
      
      // Procurar nós de texto filhos e aplicar cor contrastante
      if ('children' in node && mainColorRGB) {
        const contrastText = textColorRGB || getContrastingTextColor(mainColorRGB);
        applyColorToTextNodes(node.children, contrastText, isDisabled ? 0.5 : 1);
      }
      break;
      
    default:
      // Botão padrão: cor sólida com sombra leve
      if (mainColorRGB) {
        node.fills = [{ type: 'SOLID', color: mainColorRGB }];
      }
      
      // Adicionar sombra padrão
      if ('effects' in node) {
        node.effects = [
          {
            type: 'DROP_SHADOW',
            color: { r: 0, g: 0, b: 0, a: 0.2 },
            offset: { x: 0, y: 2 },
            radius: 3,
            visible: true,
            blendMode: 'NORMAL'
          }
        ];
      }
      
      // Procurar nós de texto filhos e aplicar cor contrastante
      if ('children' in node && mainColorRGB) {
        const contrastText = textColorRGB || getContrastingTextColor(mainColorRGB);
        applyColorToTextNodes(node.children, contrastText, isDisabled ? 0.5 : 1);
      }
      break;
  }
  
  // Aplicar tamanho e densidade
  applyButtonSize(node, sizeVariant, isDense);
  
  // Aplicar estado de loading
  if (isLoading && 'children' in node) {
    addLoadingIndicator(node);
  }
  
  // Aplicar opacidade para botões desabilitados
  if (isDisabled && 'opacity' in node) {
    node.opacity = 0.7;
  }
}

/**
 * Aplica as configurações de tamanho para um botão
 */
function applyButtonSize(node: SceneNode, size: string | null, isDense: boolean): void {
  if (!('children' in node)) return;
  
  // Buscar o wrapper do botão (o nó interno que controla o padding)
  const wrapperNode = (node as FrameNode).findChild(n => n.name === 'q-btn__wrapper') as FrameNode | null;
  if (!wrapperNode) return;
  
  // Valores de padding padrão
  let paddingH = 16; // Horizontal
  let paddingV = 16;  // Vertical
  
  // Aplicar tamanho, se especificado
  if (size) {
    switch (size) {
      case 'xs':
        paddingH = 8;
        paddingV = 4;
        break;
      case 'sm':
        paddingH = 10;
        paddingV = 6;
        break;
      case 'md':
        // Tamanho padrão
        break;
      case 'lg':
        paddingH = 20;
        paddingV = 12;
        break;
      case 'xl':
        paddingH = 24;
        paddingV = 16;
        break;
    }
  }
  
  // Se for denso, reduzir o padding em 25%
  if (isDense) {
    paddingH = Math.max(4, Math.floor(paddingH * 0.75));
    paddingV = Math.max(2, Math.floor(paddingV * 0.75));
  }
  
  // Aplicar o padding
  wrapperNode.paddingLeft = paddingH;
  wrapperNode.paddingRight = paddingH;
  wrapperNode.paddingTop = paddingV;
  wrapperNode.paddingBottom = paddingV;
  
  // Ajustar tamanho do texto baseado no tamanho do botão
  const contentNode = wrapperNode.findChild(n => n.name === 'q-btn__content') as FrameNode | null;
  if (contentNode) {
    for (const child of contentNode.children) {
      if (child.type === 'TEXT') {
        switch (size) {
          case 'xs':
            child.fontSize = 12;
            break;
          case 'sm':
            child.fontSize = 13;
            break;
          case 'md':
            child.fontSize = 14;
            break;
          case 'lg':
            child.fontSize = 16;
            break;
          case 'xl':
            child.fontSize = 18;
            break;
        }
      }
    }
  }
}

/**
 * Adiciona um indicador de loading ao botão
 */
function addLoadingIndicator(node: SceneNode & ChildrenMixin): void {
  // Buscar o content node
  const contentNode = node.findChild(n => n.name === 'q-btn__content') as FrameNode | null;
  if (!contentNode) return;
  
  // Criar indicador de loading
  const loadingIndicator = figma.createFrame();
  loadingIndicator.name = "loading-indicator";
  loadingIndicator.resize(16, 16);
  loadingIndicator.cornerRadius = 8; // Circular
  
  // Determinar a cor do indicador de loading
  let loadingColor = { r: 1, g: 1, b: 1 }; // Branco por padrão
  
  // Assumir que o primeiro nó de texto determina a cor do indicador
  for (const child of contentNode.children) {
    if (child.type === 'TEXT' && child.fills && child.fills.length > 0) {
      const firstFill = child.fills[0];
      if (firstFill.type === 'SOLID') {
        loadingColor = firstFill.color;
        break;
      }
    }
  }
  
  loadingIndicator.fills = [{ type: 'SOLID', color: loadingColor }];
  
  // Adicionar o indicador no início do conteúdo
  contentNode.insertChild(0, loadingIndicator);
  
  // Adicionar espaço entre o indicador e o texto
  contentNode.itemSpacing = 8;
}

/**
 * Função auxiliar para aplicar cor aos nós de texto filhos
 */
export function applyColorToTextNodes(nodes: readonly SceneNode[], color: RGB, opacity: number = 1): void {
  for (const node of nodes) {
    if (node.type === 'TEXT') {
      node.fills = [{ type: 'SOLID', color, opacity }];
    } else if ('children' in node) {
      applyColorToTextNodes(node.children, color, opacity);
    }
  }
}

/**
 * Aplica cores a cartões
 */
function applyCardColors(node: SceneNode, analysis: ReturnType<typeof analyzeComponentColors>): void {
  if (!('fills' in node)) return;
  
  const { mainColor, textColor, colorVariant } = analysis;
  
  // Obter as cores RGB
  const mainColorRGB = mainColor ? getQuasarColor(mainColor) : null;
  
  // Aplicar cor principal ao card
  if (mainColorRGB) {
    node.fills = [{ type: 'SOLID', color: mainColorRGB }];
    
    // Ajustar textos com cor contrastante
    if ('children' in node) {
      const contrastText = textColor ? 
        getQuasarColor(textColor) : 
        getContrastingTextColor(mainColorRGB);
      
      if (contrastText) {
        applyColorToTextNodes(node.children, contrastText);
      }
    }
  }
}

/**
 * Aplica cores a componentes genéricos
 */
function applyGenericColors(node: SceneNode, analysis: ReturnType<typeof analyzeComponentColors>): void {
  if (!('fills' in node)) return;
  
  const { mainColor, textColor, bgColor, colorVariant } = analysis;
  
  // Priorizar cor de fundo se especificada
  if (bgColor) {
    const bgColorRGB = getQuasarColor(bgColor);
    if (bgColorRGB) {
      node.fills = [{ type: 'SOLID', color: bgColorRGB }];
    }
  } 
  // Caso contrário, usar cor principal
  else if (mainColor && colorVariant !== 'flat' && colorVariant !== 'outline') {
    const mainColorRGB = getQuasarColor(mainColor);
    if (mainColorRGB) {
      node.fills = [{ type: 'SOLID', color: mainColorRGB }];
    }
  }
  
  // Aplicar cor de texto em nós de texto
  if (textColor && node.type === 'TEXT') {
    const textColorRGB = getQuasarColor(textColor);
    if (textColorRGB) {
      node.fills = [{ type: 'SOLID', color: textColorRGB }];
    }
  }
}