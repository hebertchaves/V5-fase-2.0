// src/components/converter.ts
import { parseQuasarTemplate, extractTemplateContent } from '../parser/template';
import { loadRequiredFonts,applyStylesToFigmaNode, extractInlineStyles, createText } from '../utils/figma-utils';
import { PluginSettings, QuasarNode, ComponentTypeInfo } from '../types/settings';
import { detectComponentType } from '../utils/quasar-utils';
import { componentService } from '../utils/component-service';
import { analyzeComponentColors, getQuasarColor, applyQuasarColors } from '../utils/color-utils';
import { logInfo, logError, logDebug } from '../utils/logger';
import { processQuasarClass } from '../utils/style-utils';
import { processButtonComponent } from '../../src/components/basic/button-component';

// Rastreador de nós processados
const processedNodeMap = new Map<string, boolean>();

// Função para gerar ID exclusivo para nós
function getNodeId(node: QuasarNode): string {
  const tagName = node.tagName || 'text';
  const props = node.attributes ? 
    Object.entries(node.attributes)
      .filter(([k]) => !k.startsWith('v-'))
      .map(([k, v]) => `${k}=${v}`)
      .join('|') 
    : '';
  
  return `${tagName}-${props}`;
}

// Versão simplificada de applyQuasarColors que não usa setPluginData
function applyQuasarColorsSimple(node: any, analysis: ReturnType<typeof analyzeComponentColors>, componentType: string): void {
  // Verificar se o nó é válido
  if (!node) return;
  
  // Implementação simples que não depende de setPluginData
  // Pode adaptar a lógica da função original applyQuasarColors
  
  // Aplicar cores de acordo com o tipo de componente
  switch (componentType) {
    case 'btn':
      // Aplicar cores ao botão
      if ('fills' in node && analysis.mainColor) {
        const mainColorRGB = getQuasarColor(analysis.mainColor);
        if (mainColorRGB) {
          node.fills = [{ type: 'SOLID', color: mainColorRGB }];
        }
      }
      break;
    // Adicione outros casos conforme necessário
    default:
      // Aplicação genérica de cores
      if ('fills' in node && analysis.mainColor) {
        const mainColorRGB = getQuasarColor(analysis.mainColor);
        if (mainColorRGB) {
          node.fills = [{ type: 'SOLID', color: mainColorRGB }];
        }
      }
      break;
  }
}

/**
 * Função principal de conversão, agora com processamento avançado de cores
 */
export async function convertQuasarToFigma(code: string, settings: PluginSettings) {
  // CORREÇÃO: Garantir que as fontes são carregadas corretamente antes de iniciar a conversão
  try {
    // Primeira tentativa: carregar fontes explicitamente
    await loadRequiredFonts();
    logInfo('converter', 'Fontes carregadas com sucesso');
  } catch (fontError) {
    console.warn('Aviso: Erro ao carregar fontes:', fontError);
    // Tentar carregar pelo menos as fontes básicas
    try {
      await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
      logInfo('converter', 'Fonte básica Roboto carregada como fallback');
    } catch (basicFontError) {
      console.error('Erro crítico: Não foi possível carregar nem mesmo as fontes básicas:', basicFontError);
    }
  }
  
  try {
    logInfo('converter', 'Iniciando conversão de código para Figma');
    
    // Extrair o template
    const templateContent = extractTemplateContent(code);
    logDebug('converter', 'Template extraído com sucesso');
    
    // Parse do template para árvore de nós
    const rootNode = parseQuasarTemplate(templateContent);
    if (!rootNode) {
      throw new Error('Falha ao analisar o template HTML');
    }
    logDebug('converter', `Árvore de nós criada com sucesso, nó raiz: ${rootNode.tagName}`);
    
    // Criar o nó raiz do Figma
    const mainFrame = figma.createFrame();
    mainFrame.name = "Componente Quasar";
    mainFrame.layoutMode = "VERTICAL";
    mainFrame.primaryAxisSizingMode = "AUTO";
    mainFrame.counterAxisSizingMode = "AUTO";
    mainFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    mainFrame.paddingLeft = 20;
    mainFrame.paddingRight = 20;
    mainFrame.paddingTop = 20;
    mainFrame.paddingBottom = 20;
    mainFrame.itemSpacing = 16;
    
    // Processar a árvore de componentes recursivamente
    await processNodeTree(rootNode, mainFrame, settings);
    
    logInfo('converter', 'Componente processado com sucesso');
    return mainFrame;
  } catch (error) {
    logError('converter', 'Erro ao processar componente', error);
    throw error;
  }
}

// Nova função segura para processamento de nós
async function processNodeTreeSafely(node: QuasarNode, parentFigmaNode: FrameNode, settings: PluginSettings): Promise<void> {
  // Ignorar nós de texto vazios
  if (node.tagName === '#text' && (!node.text || !node.text.trim())) {
    return;
  }
  
  try {
    // Processar nós de texto
    if (node.tagName === '#text' && node.text) {
      try {
        const textNode = await createText(node.text.trim());
        if (textNode) {
          parentFigmaNode.appendChild(textNode);
        }
      } catch (textError) {
        console.error('Erro ao processar nó de texto:', textError);
      }
      return;
    }
    
    // Log para debug
    logDebug('processNode', `Processando nó: ${node.tagName}`);
    
    // Verificar se é um componente Quasar
    const isQuasarComponent = node.tagName.toLowerCase().startsWith('q-');
    let figmaNode: FrameNode | null = null;
    let componentType: ComponentTypeInfo | undefined;
    
    if (isQuasarComponent) {
      componentType = detectComponentType(node);
      logInfo('processNode', `Componente Quasar detectado: ${componentType.category}/${componentType.type}`);
      
      // Garantir que todos os componentes q-btn usem o processador de botões
      if (node.tagName.toLowerCase() === 'q-btn') {
        figmaNode = await processButtonComponent(node, settings);
      } else {
        // Processamento normal para outros componentes
        figmaNode = await componentService.processComponentByCategory(
          node,
          componentType.category,
          componentType.type,
          settings
        );
      }

      try {
        figmaNode = await componentService.processComponentByCategory(
          node,
          componentType.category,
          componentType.type,
          settings
        );
        
        if (figmaNode && !figmaNode.getPluginData('colors_applied')) {
          const colorAnalysis = analyzeComponentColors(node);
          applyQuasarColors(figmaNode, colorAnalysis, componentType.type);
          figmaNode.setPluginData('colors_applied', 'true');
        }
      } catch (componentError) {
        logError('processNode', `Erro ao processar componente Quasar: ${node.tagName}`, componentError);
        figmaNode = await processGenericComponent(node, settings);
      }
    } else {
      figmaNode = await processGenericComponent(node, settings);
    }
    
    // Verificar se o nó foi criado com sucesso
    if (!figmaNode) {
      logError('processNode', `Falha ao criar nó Figma para ${node.tagName}`);
      return;
    }
    
    // Adicionar ao nó pai
    parentFigmaNode.appendChild(figmaNode);
    
    // Processar filhos recursivamente para componentes genéricos
    if (!isQuasarComponent && node.childNodes && node.childNodes.length > 0) {
      for (const child of node.childNodes) {
        await processNodeTreeSafely(child, figmaNode, settings);
      }
    }
  } catch (error) {
    logError('processNode', `Erro não tratado ao processar nó ${node.tagName}:`, error);
  }
}
// Criar um Map para rastrear nós já processados ou tentados
const processedNodes = new Map<string, boolean>();

/**
 * Processa a árvore de nós com suporte completo a cores e elementos HTML
 */
async function processNodeTree(node: QuasarNode, parentFigmaNode: FrameNode, settings: PluginSettings): Promise<void> {
  // Ignorar nós de texto vazios
  if (node.tagName === '#text' && (!node.text || !node.text.trim())) {
    return;
  }
  
  // Processar nós de texto
  if (node.tagName === '#text' && node.text) {
    const textNode = figma.createText();
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    textNode.characters = node.text.trim();
    parentFigmaNode.appendChild(textNode);
    return;
  }
  
  // Log para debug
  logDebug('processNode', `Processando nó: ${node.tagName}`);
  
  // Verificar se é um componente Quasar
  const isQuasarComponent = node.tagName.toLowerCase().startsWith('q-');
  let figmaNode: SceneNode;
  let componentType: ComponentTypeInfo; // Declarar no escopo correto
  
  if (isQuasarComponent) {
    componentType = detectComponentType(node);
    logInfo('processNode', `Componente Quasar detectado: ${componentType.category}/${componentType.type}`);
    
    try {
      const colorAnalysis = analyzeComponentColors(node);
      logDebug('processNode', `Análise de cor: ${JSON.stringify(colorAnalysis)}`);
      
      figmaNode = await componentService.processComponentByCategory(
        node,
        componentType.category,
        componentType.type,
        settings
      );
      
      if (figmaNode && !figmaNode.getPluginData('colors_applied')) {
        applyQuasarColors(figmaNode, colorAnalysis, componentType.type);
        figmaNode.setPluginData('colors_applied', 'true');
      }
    } catch (error) {
      logError('processNode', `Erro ao processar componente Quasar: ${node.tagName}`, error);
      figmaNode = await processGenericComponent(node, settings);
      
      const colorAnalysis = analyzeComponentColors(node);
      applyQuasarColors(figmaNode, colorAnalysis, 'generic');
    }
  } else if (node.tagName && ['br', 'hr', 'img', 'span', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a'].includes(node.tagName.toLowerCase())) {
    // Processar elementos HTML comuns
    figmaNode = await processHTMLElement(node, settings);
  } else {
    figmaNode = await processGenericComponent(node, settings);
  }
  
  // Processamento específico para componentes de layout
  if (isQuasarComponent && componentType.category === 'layout') {
    // Adicionar contexto aos filhos para que saibam que estão dentro de um componente de layout
    for (const childNode of node.childNodes) {
      if (childNode.tagName && childNode.tagName !== '#text') {
        childNode.parentContext = {
          tagName: node.tagName,
          attributes: node.attributes,
          isPrimaryComponent: true
        };
      }
    }
  }

  // Adicionar ao nó pai, garantindo que é do tipo ChildrenMixin
  if ('appendChild' in parentFigmaNode) {
    parentFigmaNode.appendChild(figmaNode);
  }
  
  // Processar filhos recursivamente apenas para elementos que não são <br> ou tags similares sem filhos
  if (!['br', 'hr', 'img'].includes(node.tagName.toLowerCase()) && node.childNodes && node.childNodes.length > 0) {
    // Se o nó for um frame ou outro container que pode ter filhos
    if ('appendChild' in figmaNode) {
      for (const child of node.childNodes) {
        await processNodeTree(child, figmaNode as FrameNode, settings);
      }
    }
  }
}

/**
 * Processa elementos HTML comuns como <br>, <hr>, <img>, etc.
 */
async function processHTMLElement(node: QuasarNode, settings: PluginSettings): Promise<SceneNode> {
  const tagName = node.tagName.toLowerCase();
  
  // Tag <br> - Quebra de linha
  if (tagName === 'br') {
    // Para <br>, criamos um TextNode com uma quebra de linha
    const textNode = figma.createText();
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    textNode.characters = "\n";
    textNode.name = "br";
    return textNode;
  }
  
  // Tag <hr> - Linha horizontal
  if (tagName === 'hr') {
    const line = figma.createLine();
    line.name = "hr";
    line.strokeWeight = 1;
    line.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
    line.resize(100, 0);
    return line;
  }
  
  // Tag <img> - Imagem
  if (tagName === 'img') {
    const imgFrame = figma.createFrame();
    imgFrame.name = "img";
    
    // Tentar obter dimensões da imagem dos atributos
    const width = parseInt(node.attributes?.width || '100');
    const height = parseInt(node.attributes?.height || '100');
    
    imgFrame.resize(width, height);
    imgFrame.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    
    // Adicionar o alt text se disponível
    if (node.attributes?.alt) {
      const altText = await createText(node.attributes.alt);
      if (altText) {
        imgFrame.appendChild(altText);
      }
    }
    
    return imgFrame;
  }
  
  // Para outros elementos HTML, criar um frame genérico
  const frame = figma.createFrame();
  frame.name = tagName;
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  
  // Processar atributos e classes, se houver
  if (node.attributes) {
    // Processar classes
    if (node.attributes.class) {
      const classes = (node.attributes.class || '').split(/\s+/).filter(Boolean);
      for (const className of classes) {
        const classStyles = processQuasarClass(className);
        if (classStyles) {
          applyStylesToFigmaNode(frame, classStyles);
        }
      }
    }
    
    // Processar atributo style
    if (node.attributes.style) {
      const styles = extractInlineStyles(node.attributes.style);
      applyStylesToFigmaNode(frame, styles);
    }
  }
  
  return frame;
}

// Função auxiliar para gerar ID
function generateNodeId(node: QuasarNode): string {
  // Criar um ID baseado nas propriedades do nó
  const tagPart = node.tagName || 'text';
  const attrPart = node.attributes ? 
    Object.entries(node.attributes)
      .map(([k, v]) => `${k}=${v}`)
      .join('|') : '';
  const textPart = node.text ? node.text.substring(0, 20) : '';
  
  return `${tagPart}::${attrPart}::${textPart}`;
}

/**
 * Processa componente genérico com suporte a cores
 */
export async function processGenericComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = node.tagName || "generic-component";
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];

  // Processar estilos
  if (node.attributes) {
    // Verificação segura para a classe
    const classStr = node.attributes.class;
    if (classStr && typeof classStr === 'string') {
      const classes = classStr.split(/\s+/).filter(c => c);
      // Resto do processamento...
    } else {
      console.log(`Nó ${node.tagName} não possui classes para processar`);
    }
    // Processar classes primeiro
    if (node.attributes.class) {
      const classes = node.attributes.class.split(/\s+/).filter(c => c);
      
      // Log para diagnóstico
      console.log(`Processando classes para ${node.tagName}:`, classes);
      
      for (const className of classes) {
        console.log(`Processando classe: ${className}`);
        const classStyles = processQuasarClass(className);
        if (classStyles) {
          console.log(`Estilos encontrados para ${className}:`, classStyles);
          applyStylesToFigmaNode(frame, classStyles);
        } else {
          console.log(`Nenhum estilo encontrado para ${className}`);
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

    // Processar style attribute (se existir)
    if (node.attributes.style) {
      const styles = extractInlineStyles(node.attributes.style);
      applyStylesToFigmaNode(frame, styles);
    }
  }
  
  // Se for um elemento HTML comum (div, span, etc.) ou componente com processador específico
  if (node.tagName && !node.tagName.startsWith('q-')) {
    return frame;
  }
  
  // Verificar se este é um componente que já tem processador específico
  // Se for, não adicionar os textos informativos abaixo
  const isQuasarComponent = node.tagName.toLowerCase().startsWith('q-');
  if (isQuasarComponent) {
    const componentType = detectComponentType(node);
    
    // Verificar se existe um processador específico para este componente
    try {
      const hasSpecificProcessor = componentService.hasProcessorForComponent(
        componentType.category,
        componentType.type
      );
      
      // Se tiver processador específico, retornar frame básico sem textos adicionais
      if (hasSpecificProcessor) {
        return frame;
      }
    } catch (error) {
      console.warn(`Erro ao verificar processador para ${node.tagName}:`, error);
    }
  }
  
  // Apenas para componentes sem processador específico, adicionar informações visuais
  frame.cornerRadius = 4;
  
  // Adicionar texto que indica o tipo de componente
  const headerText = figma.createText();
  await figma.loadFontAsync({ family: "Inter", style: "Medium" });
  headerText.characters = `Componente ${node.tagName}`;
  headerText.fontSize = 16;
  headerText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  
  frame.appendChild(headerText);
  
  // Processar atributos relevantes
  if (node.attributes && Object.keys(node.attributes).length > 0) {
    const attrsText = figma.createText();
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    
    const attrStr = Object.entries(node.attributes)
      .filter(([key, _]) => key !== 'style' && key !== 'class' && !key.startsWith('v-'))
      .map(([key, value]) => `${key}="${value}"`)
      .join('\n');
    
    attrsText.characters = attrStr || "Sem atributos";
    attrsText.fontSize = 12;
    attrsText.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
    
    frame.appendChild(attrsText);
  }
  
  return frame;
}