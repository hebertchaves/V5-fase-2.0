/**
 * Utilitários para o parser do plugin Quasar to Figma Converter
 * Este arquivo contém funções auxiliares para o processamento do código Vue/Quasar
 */

import { parse } from 'node-html-parser';
import { logDebug, logError } from './logger';

/**
 * Parse um componente Vue/Quasar e converte para um nó Figma
 * @param {string} vueCode - Código do componente Vue
 * @returns {Promise<FrameNode>} - Nó raiz Figma criado
 */
export async function parseComponent(vueCode) {
  try {
    // Extrair o template
    const template = extractTemplate(vueCode);
    logDebug('parser', 'Template extraído', template.substring(0, 100) + '...');
    
    // Criar DOM virtual
    const dom = createVirtualDOM(template);
    
    // Criar o nó raiz Figma
    const rootNode = figma.createFrame();
    rootNode.name = "Quasar Component";
    rootNode.layoutMode = "VERTICAL";
    rootNode.primaryAxisSizingMode = "AUTO";
    rootNode.counterAxisSizingMode = "AUTO";
    rootNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    // Processar o DOM
    await processNode(dom.body.firstChild, rootNode);
    
    return rootNode;
  } catch (error) {
    logError('parser', 'Erro ao fazer parsing do código Vue', error);
    throw error;
  }
}

/**
 * Cria um DOM virtual a partir de uma string HTML
 * @param {string} htmlString - String HTML para parse
 * @returns {Document} - O documento DOM
 */
export function createVirtualDOM(htmlString) {
  try {
    const dom = parse(`<div>${htmlString}</div>`, {
      lowerCaseTagName: true,
      comment: false,
      blockTextElements: {
        script: true,
        noscript: true,
        style: true,
        pre: true
      }
    });
    return dom;
  } catch (error) {
    logError('parser', 'Erro ao criar DOM virtual', error);
    throw new Error(`Falha ao analisar o HTML: ${error.message}`);
  }
}

/**
 * Extrai o conteúdo do template de um código Vue
 * @param {string} vueCode - Código do componente Vue
 * @returns {string} - Conteúdo do template
 */
export function extractTemplate(vueCode) {
  const templateMatch = vueCode.match(/<template>([\s\S]*?)<\/template>/i);
  
  if (!templateMatch) {
    throw new Error("Não foi possível encontrar a seção <template> no código");
  }
  
  return templateMatch[1].trim();
}

/**
 * Extrai o script de um componente Vue
 * @param {string} vueCode - Código do componente Vue
 * @returns {string} - Conteúdo do script
 */
export function extractScript(vueCode) {
  const scriptMatch = vueCode.match(/<script>([\s\S]*?)<\/script>/i);
  return scriptMatch ? scriptMatch[1].trim() : '';
}

/**
 * Processa um nó do DOM e cria a estrutura Figma correspondente
 * @param {Node} vNode - Nó DOM
 * @param {SceneNode} figmaParent - Nó pai no Figma
 */
async function processNode(vNode, figmaParent) {
  // Pular nós que não são elementos
  if (!vNode || vNode.nodeType !== 1) return;
  
  const nodeName = vNode.tagName.toLowerCase();
  logDebug('parser', `Processando nó: ${nodeName}`, {
    attributes: Array.from(vNode.attributes || []).map(attr => `${attr.name}="${attr.value}"`),
    childNodes: vNode.childNodes ? vNode.childNodes.length : 0
  });
  
  // Detectar se é um componente Quasar
  const isQuasarComponent = nodeName.startsWith('q-');
  
  // Extrair tipo de componente para componentes Quasar
  let componentType = '';
  if (isQuasarComponent) {
    componentType = nodeName.substring(2); // Remove 'q-'
    logDebug('parser', `Componente Quasar detectado: ${componentType}`);
  }
  
  // Mapear componentes Quasar para processadores específicos
  if (isQuasarComponent) {
    try {
      // Criar nó Figma adequado para o componente
      const figmaNode = await createFigmaNodeForComponent(nodeName, vNode);
      
      // Adicionar ao pai
      if (figmaNode) {
        figmaParent.appendChild(figmaNode);
        
        // Processar filhos se necessário
        if (shouldProcessChildren(nodeName)) {
          await processChildren(vNode, figmaNode);
        }
        
        return;
      }
    } catch (error) {
      logError('parser', `Erro ao processar componente ${nodeName}`, error);
      // Continuar com o processamento padrão em caso de erro
    }
  }
  
  // Processamento padrão para elementos HTML comuns
  let figmaNode;
  
  if (nodeName === 'div' || nodeName === 'section') {
    figmaNode = figma.createFrame();
    figmaNode.name = vNode.getAttribute('class') || nodeName;
    figmaNode.layoutMode = "VERTICAL";
    figmaNode.primaryAxisSizingMode = "AUTO";
    figmaNode.counterAxisSizingMode = "AUTO";
    figmaNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  } else if (nodeName === 'span' || nodeName === 'p' || nodeName === 'h1' || 
             nodeName === 'h2' || nodeName === 'h3' || nodeName === 'h4') {
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    figmaNode = figma.createText();
    
    // Extrair texto do nó
    let textContent = '';
    if (vNode.childNodes) {
      for (const child of vNode.childNodes) {
        if (child.text) {
          textContent += child.text.trim() + ' ';
        }
      }
    }
    
    figmaNode.characters = textContent.trim() || '';
    figmaNode.name = vNode.getAttribute('class') || nodeName;
  } else {
    // Para outros elementos, criar um frame genérico
    figmaNode = figma.createFrame();
    figmaNode.name = nodeName;
    figmaNode.layoutMode = "VERTICAL";
    figmaNode.primaryAxisSizingMode = "AUTO";
    figmaNode.counterAxisSizingMode = "AUTO";
    figmaNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  }
  
  // Aplicar estilos básicos
  applyAttributes(figmaNode, vNode);
  
  // Adicionar ao pai
  figmaParent.appendChild(figmaNode);
  
  // Processar filhos recursivamente
  await processChildren(vNode, figmaNode);
}

/**
 * Processa os filhos de um nó
 * @param {Node} vNode - Nó DOM pai
 * @param {SceneNode} figmaNode - Nó Figma pai
 */
async function processChildren(vNode, figmaNode) {
  if (!vNode.childNodes || vNode.childNodes.length === 0) return;
  
  for (let i = 0; i < vNode.childNodes.length; i++) {
    const child = vNode.childNodes[i];
    
    // Pular nós de texto que só contêm espaços em branco
    if (child.nodeType === 3 && (!child.text || !child.text.trim())) {
      continue;
    }
    
    if (child.nodeType === 1) { // Elemento
      await processNode(child, figmaNode);
    } else if (child.nodeType === 3 && child.text && child.text.trim()) { // Texto
      // Somente processa texto se o nó pai for um TextNode
      if (figmaNode.type === 'TEXT') {
        // O texto já foi definido na criação do nó
      } else if ('appendChild' in figmaNode) {
        // Criar um nó de texto para o conteúdo
        await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        const textNode = figma.createText();
        textNode.characters = child.text.trim();
        textNode.name = "text";
        figmaNode.appendChild(textNode);
      }
    }
  }
}

/**
 * Cria um nó Figma apropriado para o tipo de componente Quasar
 * @param {string} componentName - Nome do componente (q-btn, q-card, etc.)
 * @param {Node} vNode - Nó DOM do componente
 * @returns {SceneNode} - Nó Figma criado
 */
async function createFigmaNodeForComponent(componentName, vNode) {
  // Extrair atributos do nó
  const attributes = {};
  if (vNode.attributes) {
    Object.keys(vNode.attributes).forEach(key => {
      attributes[key] = vNode.attributes[key];
    });
  }
  
  // Implementações específicas para componentes comuns
  switch (componentName) {
    case 'q-btn': {
      // Criar a estrutura correta do botão
      const btnNode = figma.createFrame();
      btnNode.name = "q-btn";
      btnNode.layoutMode = "HORIZONTAL";
      btnNode.primaryAxisSizingMode = "AUTO";
      btnNode.counterAxisSizingMode = "AUTO";
      btnNode.cornerRadius = 4;
      
      // Criar wrapper
      const wrapperNode = figma.createFrame();
      wrapperNode.name = "q-btn__wrapper";
      wrapperNode.layoutMode = "HORIZONTAL";
      wrapperNode.primaryAxisSizingMode = "AUTO";
      wrapperNode.counterAxisSizingMode = "AUTO";
      wrapperNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
      wrapperNode.paddingLeft = 16;
      wrapperNode.paddingRight = 16;
      wrapperNode.paddingTop = 16;
      wrapperNode.paddingBottom = 16;
      
      // Criar content
      const contentNode = figma.createFrame();
      contentNode.name = "q-btn__content";
      contentNode.layoutMode = "HORIZONTAL";
      contentNode.primaryAxisSizingMode = "AUTO";
      contentNode.counterAxisSizingMode = "AUTO";
      contentNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
      contentNode.itemSpacing = 8;
      
      // Extrair texto do botão
      let buttonText = attributes.label || '';
      if (!buttonText) {
        // Buscar texto nos filhos
        if (vNode.childNodes) {
          for (const child of vNode.childNodes) {
            if (child.text && child.text.trim()) {
              buttonText += child.text.trim() + ' ';
            }
          }
        }
        buttonText = buttonText.trim() || 'Button';
      }
      
      // Criar texto
      await figma.loadFontAsync({ family: "Roboto", style: "Medium" });
      const textNode = figma.createText();
      textNode.characters = buttonText;
      textNode.name = "btn-text";
      textNode.fontSize = 14;
      
      // Montar a estrutura hierárquica
      contentNode.appendChild(textNode);
      wrapperNode.appendChild(contentNode);
      btnNode.appendChild(wrapperNode);
      
      return btnNode;
    }
    
    case 'q-card': {
      const cardNode = figma.createFrame();
      cardNode.name = "q-card";
      cardNode.layoutMode = "VERTICAL";
      cardNode.primaryAxisSizingMode = "AUTO";
      cardNode.counterAxisSizingMode = "AUTO";
      cardNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      cardNode.cornerRadius = 4;
      
      // Adicionar sombra
      cardNode.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.2 },
        offset: { x: 0, y: 2 },
        radius: 4,
        visible: true,
        blendMode: 'NORMAL'
      }];
      
      return cardNode;
    }
    
    // Implementar mais componentes conforme necessário
    
    default: {
      // Componente genérico
      const genericNode = figma.createFrame();
      genericNode.name = componentName;
      genericNode.layoutMode = "VERTICAL";
      genericNode.primaryAxisSizingMode = "AUTO";
      genericNode.counterAxisSizingMode = "AUTO";
      genericNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
      
      return genericNode;
    }
  }
}

/**
 * Determina se um componente deve processar seus filhos diretamente
 * @param {string} componentName - Nome do componente
 * @returns {boolean} - true se deve processar filhos
 */
function shouldProcessChildren(componentName) {
  // Componentes que têm tratamento especial para filhos
  const specialComponents = ['q-btn', 'q-input', 'q-select'];
  
  return !specialComponents.includes(componentName);
}

/**
 * Aplica atributos HTML para um nó Figma
 * @param {SceneNode} figmaNode - Nó Figma
 * @param {Node} vNode - Nó DOM
 */
function applyAttributes(figmaNode, vNode) {
  if (!vNode.attributes) return;
  
  // Aplicar classe
  // Aplicar classe
  if (vNode.attributes.class) {
    // Processar classes do Quasar e aplicar estilos correspondentes
    const classes = vNode.attributes.class.split(/\s+/).filter(c => c);
    for (const className of classes) {
      if (className.startsWith('q-')) {
        applyQuasarClass(figmaNode, className);
      }
    }
  }
  
  // Aplicar estilo inline
  if (vNode.attributes.style) {
    applyInlineStyle(figmaNode, vNode.attributes.style);
  }
  
  // Aplicar outros atributos específicos
  applySpecificAttributes(figmaNode, vNode);
}

/**
 * Aplica classes do Quasar para um nó Figma
 * @param {SceneNode} figmaNode - Nó Figma
 * @param {string} className - Nome da classe Quasar
 */
function applyQuasarClass(figmaNode, className) {
  // Classes de margens e padding (q-pa-*, q-ma-*)
  if (className.match(/^q-([mp])([atrblxy])?-([a-z]+)$/)) {
    applySpacingClass(figmaNode, className);
    return;
  }
  
  // Classes de cor (text-primary, bg-secondary, etc)
  if (className.match(/^(text|bg)-([a-z-]+)$/)) {
    applyColorClass(figmaNode, className);
    return;
  }
  
  // Classes de texto (text-h1, text-body1, etc)
  if (className.match(/^text-([a-z][1-6]|body[12]|subtitle[12]|caption|overline)$/)) {
    applyTextClass(figmaNode, className);
    return;
  }
  
  // Classes de layout (row, column, etc)
  if (['row', 'column', 'items-start', 'items-center', 'items-end',
       'justify-start', 'justify-center', 'justify-end', 'justify-between'].includes(className)) {
    applyLayoutClass(figmaNode, className);
    return;
  }
}

/**
 * Aplica estilos inline para um nó Figma
 * @param {SceneNode} figmaNode - Nó Figma
 * @param {string} styleString - String de estilo CSS
 */
function applyInlineStyle(figmaNode, styleString) {
  if (!styleString) return;
  
  const styles = parseInlineStyles(styleString);
  
  // Aplicar estilos
  Object.entries(styles).forEach(([prop, value]) => {
    applyStyleProperty(figmaNode, prop, value);
  });
}

/**
 * Converte uma string de estilo CSS para um objeto de estilos
 * @param {string} styleString - String de estilo CSS
 * @returns {Object} - Objeto de estilos
 */
function parseInlineStyles(styleString) {
  const styles = {};
  
  // Separar por ponto e vírgula
  const declarations = styleString.split(';');
  
  for (const declaration of declarations) {
    const parts = declaration.split(':');
    if (parts.length === 2) {
      const property = parts[0].trim();
      const value = parts[1].trim();
      styles[property] = value;
    }
  }
  
  return styles;
}

/**
 * Aplica uma propriedade de estilo a um nó Figma
 * @param {SceneNode} node - Nó Figma
 * @param {string} property - Propriedade CSS
 * @param {string} value - Valor da propriedade
 */
function applyStyleProperty(node, property, value) {
  // Cores
  if (property === 'color' && node.type === 'TEXT') {
    const color = parseColor(value);
    if (color) {
      node.fills = [{ type: 'SOLID', color }];
    }
    return;
  }
  
  if (property === 'background-color') {
    const color = parseColor(value);
    if (color) {
      node.fills = [{ type: 'SOLID', color }];
    }
    return;
  }
  
  // Padding
  if (property === 'padding') {
    const padding = parseSpacing(value);
    if (padding) {
      node.paddingTop = padding;
      node.paddingRight = padding;
      node.paddingBottom = padding;
      node.paddingLeft = padding;
    }
    return;
  }
  
  if (property === 'padding-top') {
    const padding = parseSpacing(value);
    if (padding) node.paddingTop = padding;
    return;
  }
  
  if (property === 'padding-right') {
    const padding = parseSpacing(value);
    if (padding) node.paddingRight = padding;
    return;
  }
  
  if (property === 'padding-bottom') {
    const padding = parseSpacing(value);
    if (padding) node.paddingBottom = padding;
    return;
  }
  
  if (property === 'padding-left') {
    const padding = parseSpacing(value);
    if (padding) node.paddingLeft = padding;
    return;
  }
  
  // Bordas
  if (property === 'border-radius') {
    const radius = parseSpacing(value);
    if (radius) node.cornerRadius = radius;
    return;
  }
  
  // Tamanho da fonte
  if (property === 'font-size' && node.type === 'TEXT') {
    const fontSize = parseFontSize(value);
    if (fontSize) node.fontSize = fontSize;
    return;
  }
  
  // Peso da fonte
  if (property === 'font-weight' && node.type === 'TEXT') {
    applyFontWeight(node, value);
    return;
  }
}

/**
 * Aplica classes de espaçamento (margin e padding)
 * @param {SceneNode} node - Nó Figma
 * @param {string} className - Nome da classe
 */
function applySpacingClass(node, className) {
  const match = className.match(/^q-([mp])([atrblxy])?-([a-z]+)$/);
  if (!match) return;
  
  const [, type, direction, size] = match;
  
  // Mapear tamanhos para valores em pixels
  const sizeValues = {
    'none': 0,
    'xs': 4,
    'sm': 8,
    'md': 16,
    'lg': 24,
    'xl': 32
  };
  
  const sizeValue = sizeValues[size] || 0;
  
  // Aplicar padding ou margin
  if (type === 'p') {
    if (!direction || direction === 'a') {
      node.paddingTop = sizeValue;
      node.paddingRight = sizeValue;
      node.paddingBottom = sizeValue;
      node.paddingLeft = sizeValue;
    } else {
      if (direction === 't' || direction === 'y') node.paddingTop = sizeValue;
      if (direction === 'r' || direction === 'x') node.paddingRight = sizeValue;
      if (direction === 'b' || direction === 'y') node.paddingBottom = sizeValue;
      if (direction === 'l' || direction === 'x') node.paddingLeft = sizeValue;
    }
  }
  // Margin não é diretamente aplicável no Figma, mas pode ser simulado com ajustes de layout
}

/**
 * Aplica classes de cor
 * @param {SceneNode} node - Nó Figma
 * @param {string} className - Nome da classe
 */
function applyColorClass(node, className) {
  const match = className.match(/^(text|bg)-([a-z-]+)$/);
  if (!match) return;
  
  const [, type, colorName] = match;
  
  // Mapeamento básico de cores
  const colors = {
    'primary': { r: 0.1, g: 0.5, b: 0.9 },
    'secondary': { r: 0.15, g: 0.65, b: 0.6 },
    'accent': { r: 0.6, g: 0.15, b: 0.7 },
    'dark': { r: 0.2, g: 0.2, b: 0.2 },
    'positive': { r: 0.1, g: 0.7, b: 0.3 },
    'negative': { r: 0.8, g: 0.1, b: 0.1 },
    'info': { r: 0.2, g: 0.8, b: 0.9 },
    'warning': { r: 0.95, g: 0.75, b: 0.2 },
    'white': { r: 1, g: 1, b: 1 },
    'black': { r: 0, g: 0, b: 0 },
    'red': { r: 0.957, g: 0.263, b: 0.212 },
    'brown': { r: 0.475, g: 0.333, b: 0.282 },
  };
  
  const color = colors[colorName] || { r: 0.5, g: 0.5, b: 0.5 };
  
  if (type === 'text' && node.type === 'TEXT') {
    node.fills = [{ type: 'SOLID', color }];
  } else if (type === 'bg') {
    node.fills = [{ type: 'SOLID', color }];
  }
}

/**
 * Aplica classes de texto
 * @param {SceneNode} node - Nó Figma
 * @param {string} className - Nome da classe
 */
function applyTextClass(node, className) {
  if (node.type !== 'TEXT') return;
  
  // Mapear classes para propriedades de texto
  const textStyles = {
    'text-h1': { fontSize: 48, fontWeight: 'bold' },
    'text-h2': { fontSize: 40, fontWeight: 'bold' },
    'text-h3': { fontSize: 34, fontWeight: 'bold' },
    'text-h4': { fontSize: 28, fontWeight: 'bold' },
    'text-h5': { fontSize: 24, fontWeight: 'bold' },
    'text-h6': { fontSize: 20, fontWeight: 'bold' },
    'text-subtitle1': { fontSize: 16, fontWeight: 'medium' },
    'text-subtitle2': { fontSize: 14, fontWeight: 'medium' },
    'text-body1': { fontSize: 16, fontWeight: 'regular' },
    'text-body2': { fontSize: 14, fontWeight: 'regular' },
    'text-caption': { fontSize: 12, fontWeight: 'regular' },
    'text-overline': { fontSize: 10, fontWeight: 'medium' }
  };
  
  const style = textStyles[className];
  if (style) {
    node.fontSize = style.fontSize;
    applyFontWeight(node, style.fontWeight);
  }
}

/**
 * Aplica classes de layout
 * @param {SceneNode} node - Nó Figma
 * @param {string} className - Nome da classe
 */
function applyLayoutClass(node, className) {
  if (!('layoutMode' in node)) return;
  
  switch (className) {
    case 'row':
      node.layoutMode = 'HORIZONTAL';
      break;
    case 'column':
      node.layoutMode = 'VERTICAL';
      break;
    case 'items-start':
      node.counterAxisAlignItems = 'MIN';
      break;
    case 'items-center':
      node.counterAxisAlignItems = 'CENTER';
      break;
    case 'items-end':
      node.counterAxisAlignItems = 'MAX';
      break;
    case 'justify-start':
      node.primaryAxisAlignItems = 'MIN';
      break;
    case 'justify-center':
      node.primaryAxisAlignItems = 'CENTER';
      break;
    case 'justify-end':
      node.primaryAxisAlignItems = 'MAX';
      break;
    case 'justify-between':
      node.primaryAxisAlignItems = 'SPACE_BETWEEN';
      break;
  }
}

/**
 * Aplica atributos específicos para diferentes tipos de elementos
 * @param {SceneNode} figmaNode - Nó Figma
 * @param {Node} vNode - Nó DOM
 */
function applySpecificAttributes(figmaNode, vNode) {
  const nodeName = vNode.tagName.toLowerCase();
  const attributes = vNode.attributes || {};
  
  // Botões Quasar
  if (nodeName === 'q-btn') {
    applyButtonAttributes(figmaNode, attributes);
  }
  
  // Cards Quasar
  else if (nodeName === 'q-card') {
    applyCardAttributes(figmaNode, attributes);
  }
  
  // Inputs Quasar
  else if (nodeName === 'q-input') {
    applyInputAttributes(figmaNode, attributes);
  }
}

/**
 * Aplica atributos específicos de botão
 * @param {FrameNode} btnNode - Nó de botão
 * @param {Object} attributes - Atributos do botão
 */
function applyButtonAttributes(btnNode, attributes) {
  // Determinar cor do botão
  if (attributes.color) {
    const color = getQuasarColor(attributes.color);
    
    // Aplicar cor com base no tipo de botão
    const isFlat = 'flat' in attributes;
    const isOutline = 'outline' in attributes;
    
    if (isFlat) {
      // Botão flat - sem fundo, apenas texto colorido
      btnNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
      
      // Cor do texto deve ser aplicada ao texto dentro da hierarquia
      const textNode = findTextNodeInHierarchy(btnNode);
      if (textNode) {
        textNode.fills = [{ type: 'SOLID', color }];
      }
    } else if (isOutline) {
      // Botão outline - borda colorida
      btnNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
      btnNode.strokes = [{ type: 'SOLID', color }];
      btnNode.strokeWeight = 1;
      
      // Cor do texto deve ser aplicada ao texto dentro da hierarquia
      const textNode = findTextNodeInHierarchy(btnNode);
      if (textNode) {
        textNode.fills = [{ type: 'SOLID', color }];
      }
    } else {
      // Botão padrão - fundo colorido
      btnNode.fills = [{ type: 'SOLID', color }];
      
      // Texto em branco para contraste
      const textNode = findTextNodeInHierarchy(btnNode);
      if (textNode) {
        textNode.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      }
    }
  }
  
  // Tamanho do botão
  if (attributes.size) {
    const btnSize = attributes.size;
    const wrapperNode = btnNode.findChild(n => n.name === 'q-btn__wrapper');
    
    if (wrapperNode) {
      switch (btnSize) {
        case 'xs':
          wrapperNode.paddingLeft = 8;
          wrapperNode.paddingRight = 8;
          wrapperNode.paddingTop = 4;
          wrapperNode.paddingBottom = 4;
          break;
        case 'sm':
          wrapperNode.paddingLeft = 10;
          wrapperNode.paddingRight = 10;
          wrapperNode.paddingTop = 6;
          wrapperNode.paddingBottom = 6;
          break;
        case 'lg':
          wrapperNode.paddingLeft = 20;
          wrapperNode.paddingRight = 20;
          wrapperNode.paddingTop = 12;
          wrapperNode.paddingBottom = 12;
          break;
        case 'xl':
          wrapperNode.paddingLeft = 24;
          wrapperNode.paddingRight = 24;
          wrapperNode.paddingTop = 16;
          wrapperNode.paddingBottom = 16;
          break;
      }
    }
  }
  
  // Botão arredondado
  if ('rounded' in attributes) {
    btnNode.cornerRadius = 28;
  }
  
  // Botão denso
  if ('dense' in attributes) {
    const wrapperNode = btnNode.findChild(n => n.name === 'q-btn__wrapper');
    if (wrapperNode) {
      wrapperNode.paddingLeft = Math.max(4, wrapperNode.paddingLeft - 4);
      wrapperNode.paddingRight = Math.max(4, wrapperNode.paddingRight - 4);
      wrapperNode.paddingTop = Math.max(2, wrapperNode.paddingTop - 4);
      wrapperNode.paddingBottom = Math.max(2, wrapperNode.paddingBottom - 4);
    }
  }
}

/**
 * Aplica atributos específicos de card
 * @param {FrameNode} cardNode - Nó de card
 * @param {Object} attributes - Atributos do card
 */
function applyCardAttributes(cardNode, attributes) {
  // Card flat (sem sombra)
  if ('flat' in attributes) {
    cardNode.effects = [];
  }
  
  // Card bordered
  if ('bordered' in attributes) {
    cardNode.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    cardNode.strokeWeight = 1;
  }
  
  // Card square (sem bordas arredondadas)
  if ('square' in attributes) {
    cardNode.cornerRadius = 0;
  }
  
  // Card dark
  if ('dark' in attributes) {
    cardNode.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
  }
}

/**
 * Aplica atributos específicos de input
 * @param {FrameNode} inputNode - Nó de input
 * @param {Object} attributes - Atributos do input
 */
function applyInputAttributes(inputNode, attributes) {
  // TODO: Implementar conforme necessário
}

/**
 * Funções auxiliares
 */

/**
 * Encontra um nó de texto na hierarquia de um nó
 * @param {SceneNode} node - Nó pai
 * @returns {TextNode|null} - Nó de texto encontrado ou null
 */
function findTextNodeInHierarchy(node) {
  if (!('children' in node)) return null;
  
  for (const child of node.children) {
    if (child.type === 'TEXT') {
      return child;
    }
    
    if ('children' in child) {
      const found = findTextNodeInHierarchy(child);
      if (found) return found;
    }
  }
  
  return null;
}

/**
 * Analisa um valor de cor CSS e retorna um objeto de cor Figma
 * @param {string} colorStr - String de cor CSS
 * @returns {Object|null} - Objeto de cor Figma ou null
 */
function parseColor(colorStr) {
  // Cores nomeadas
  const namedColors = {
    'white': { r: 1, g: 1, b: 1 },
    'black': { r: 0, g: 0, b: 0 },
    'red': { r: 1, g: 0, b: 0 },
    'green': { r: 0, g: 0.8, b: 0 },
    'blue': { r: 0, g: 0, b: 1 },
    'yellow': { r: 1, g: 1, b: 0 },
    'gray': { r: 0.5, g: 0.5, b: 0.5 }
  };
  
  if (namedColors[colorStr]) {
    return namedColors[colorStr];
  }
  
  // Cores hex
  if (colorStr.startsWith('#')) {
    let hex = colorStr.substring(1);
    
    // Converter #RGB para #RRGGBB
    if (hex.length === 3) {
      hex = hex.split('').map(h => h + h).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    
    return { r, g, b };
  }
  
  // Cores rgb(a)
  const rgbMatch = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]) / 255;
    const g = parseInt(rgbMatch[2]) / 255;
    const b = parseInt(rgbMatch[3]) / 255;
    
    return { r, g, b };
  }
  
  return null;
}

/**
 * Analisa um valor de espaçamento CSS
 * @param {string} value - Valor de espaçamento (px, rem, etc)
 * @returns {number|null} - Valor em pixels ou null
 */
function parseSpacing(value) {
  const match = value.match(/^(\d+(?:\.\d+)?)(px|rem|em|%)?$/);
  if (!match) return null;
  
  const num = parseFloat(match[1]);
  const unit = match[2] || 'px';
  
  if (unit === 'px') {
    return num;
  } else if (unit === 'rem' || unit === 'em') {
    return num * 16; // Assumindo 1rem = 16px
  } else if (unit === '%') {
    // % não pode ser convertido diretamente sem conhecer o contexto
    return num;
  }
  
  return num;
}

/**
 * Analisa um valor de tamanho de fonte CSS
 * @param {string} value - Valor de tamanho de fonte
 * @returns {number|null} - Tamanho de fonte em pixels ou null
 */
function parseFontSize(value) {
  return parseSpacing(value);
}

/**
 * Aplica um peso de fonte ao nó de texto
 * @param {TextNode} node - Nó de texto
 * @param {string|number} weight - Peso da fonte (bold, 700, etc)
 */
async function applyFontWeight(node, weight) {
  // Mapear pesos para estilos de fonte
  let fontStyle = 'Regular';
  
  if (weight === 'bold' || weight >= 700) {
    fontStyle = 'Bold';
  } else if (weight === 'medium' || (weight >= 500 && weight < 700)) {
    fontStyle = 'Medium';
  }
  
  try {
    await figma.loadFontAsync({ family: "Roboto", style: fontStyle });
    node.fontName = { family: "Roboto", style: fontStyle };
  } catch (error) {
    console.warn(`Não foi possível carregar a fonte: ${error.message}`);
  }
}

/**
 * Obtém a cor correspondente ao nome de cor do Quasar
 * @param {string} colorName - Nome da cor Quasar
 * @returns {Object} - Objeto de cor RGB
 */
function getQuasarColor(colorName) {
  const colors = {
    'primary': { r: 0.1, g: 0.5, b: 0.9 },
    'secondary': { r: 0.15, g: 0.65, b: 0.6 },
    'accent': { r: 0.6, g: 0.15, b: 0.7 },
    'dark': { r: 0.2, g: 0.2, b: 0.2 },
    'positive': { r: 0.1, g: 0.7, b: 0.3 },
    'negative': { r: 0.8, g: 0.1, b: 0.1 },
    'info': { r: 0.2, g: 0.8, b: 0.9 },
    'warning': { r: 0.95, g: 0.75, b: 0.2 },
    'white': { r: 1, g: 1, b: 1 },
    'black': { r: 0, g: 0, b: 0 }
  };
  
  return colors[colorName] || { r: 0.5, g: 0.5, b: 0.5 };
}