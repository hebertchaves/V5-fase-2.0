// src/components/converter.ts
import { parseQuasarTemplate, extractTemplateContent } from '../parser/template';
import { loadRequiredFonts,applyStylesToFigmaNode, extractInlineStyles, createText } from '../utils/figma-utils';
import { PluginSettings, QuasarNode, ComponentTypeInfo } from '../types/settings';
import { detectComponentType } from '../utils/quasar-utils';
import { componentService } from '../utils/component-service';
import { analyzeComponentColors, colorAnalysisToFigmaProps, applyQuasarColors } from '../utils/color-utils';
import { logInfo, logError, logDebug } from '../utils/logger';
import { processQuasarClass } from '../utils/style-utils';



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

/**
 * Processa a árvore de nós com suporte completo a cores
 */
async function processNodeTree(node: QuasarNode, parentFigmaNode: FrameNode, settings: PluginSettings): Promise<void> {
  // Processar nós de texto de forma simplificada
  if (node.tagName === '#text' && node.text && node.text.trim()) {
    try {
      // Método simplificado para texto
      await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
      const textNode = figma.createText();
      textNode.characters = node.text.trim();
      parentFigmaNode.appendChild(textNode);
      return;
    } catch (error) {
      console.error('Erro ao criar nó de texto:', error);
    }
  }
  
  // Processar nós de texto
  if (node.tagName === '#text' && node.text) {
    try {
      // PRIMEIRO carregar a fonte - é fundamental fazer isso antes de qualquer operação
      await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
      
      // DEPOIS criar o nó de texto
      const textNode = figma.createText();
      
      // Definir a fonte explicitamente
      textNode.fontName = { family: "Roboto", style: "Regular" };
      
      // Definir o texto
      textNode.characters = node.text.trim();
      
      // Adicionar ao pai
      parentFigmaNode.appendChild(textNode);
      return;
    } catch (error) {
      console.error('Erro ao criar nó de texto:', error);
    }
  }
  
  // Log para debug
  logDebug('processNode', `Processando nó: ${node.tagName}`);
  
  // Verificar se é um componente Quasar
  const isQuasarComponent = node.tagName.toLowerCase().startsWith('q-');
  let figmaNode: FrameNode;
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

  // Adicionar ao nó pai
  parentFigmaNode.appendChild(figmaNode);
  
  // Processar filhos recursivamente
  // NOTA: Apenas processa filhos para contêineres genéricos, 
  // componentes Quasar específicos devem processar seus próprios filhos
  if (!isQuasarComponent && node.childNodes && node.childNodes.length > 0) {
    for (const child of node.childNodes) {
      await processNodeTree(child, figmaNode, settings);
    }
  }
    
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

  // Processar estilos de forma mais robusta
  if (node.attributes) {
    // Processar classes primeiro (para garantir a ordem correta de aplicação)
    if (node.attributes.class) {
      const classes = node.attributes.class.split(/\s+/).filter(c => c);
      
      // Ordenar classes para aplicar na ordem correta (layout > spacing > cores > tipografia > outros)
      const sortedClasses = classes.sort((a, b) => {
        const order = ['row', 'column', 'q-pa-', 'q-ma-', 'q-gutter-', 'text-', 'bg-'];
        const getOrder = (className: string) => {
          for (let i = 0; i < order.length; i++) {
            if (className.startsWith(order[i])) return i;
          }
          return order.length;
        };
        return getOrder(a) - getOrder(b);
      });
      
      for (const className of sortedClasses) {
        const classStyles = processQuasarClass(className);
        if (classStyles) {
          // Para texto, garantir que as propriedades são aplicadas apenas em nós de texto
          if (className.startsWith('text-') && node.tagName === '#text') {
            applyStylesToFigmaNode(frame, classStyles);
          } else if (!className.startsWith('text-') || node.tagName !== '#text') {
            applyStylesToFigmaNode(frame, classStyles);
          }
        }
      }
    }
  }
    // Processar style attribute
    if (node.attributes.style) {
      const styles = extractInlineStyles(node.attributes.style);
      applyStylesToFigmaNode(frame, styles);
    }
    // Analisar configurações de cor
    if (node.attributes) {
    const colorAnalysis = analyzeComponentColors(node);
    const figmaColorProps = colorAnalysisToFigmaProps(colorAnalysis);
    
    // Aplicar cores
    if (figmaColorProps.fills) {
      frame.fills = figmaColorProps.fills;
    }
    
    if (figmaColorProps.strokes) {
      frame.strokes = figmaColorProps.strokes;
      frame.strokeWeight = 1;
    }
    
    // Processar atributos comuns como classe
    if (node.attributes.class) {
      frame.name = `${node.tagName} (${node.attributes.class})`;
    }
  }
  
  // Se for um elemento HTML comum (div, span, etc.)
  if (node.tagName && !node.tagName.startsWith('q-')) {
    return frame;
  }
  
  // Caso seja um componente Quasar sem processador específico
  frame.cornerRadius = 4;
  
  // Adicionar texto que indica o tipo de componente
  const headerText = figma.createText();
  await figma.loadFontAsync({ family: "Roboto", style: "Medium" });
  headerText.characters = `Componente ${node.tagName}`;
  headerText.fontSize = 16;
  headerText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  
  frame.appendChild(headerText);
  
  // Processar atributos relevantes
  if (node.attributes && Object.keys(node.attributes).length > 0) {
    const attrsText = figma.createText();
    await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
    
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