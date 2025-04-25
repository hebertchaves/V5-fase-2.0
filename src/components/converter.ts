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
 * Processa a árvore de nós com suporte completo a cores
 */
async function processNodeTree(node: QuasarNode, parentFigmaNode: FrameNode, settings: PluginSettings): Promise<void> {
  // Gerar ID único para o nó
  const nodeId = generateNodeId(node);
  
  // Adicione uma variável de estado para rastrear nós processados
    const processedNodes = new Set<string>();

  // Verificar se já foi processado
  if (processedNodes.has(nodeId)) {
    logDebug('processNode', `Nó já processado: ${nodeId}, pulando.`);
    return;
  }
  
  // Marcar como processado
  processedNodes.add(nodeId);

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


  // Função para gerar ID único para nós
  function generateNodeId(node: QuasarNode): string {
    const path = [];
    let current = node;
    let parent = current.parentContext;
    
    // Construir caminho único com base na hierarquia
    while (parent) {
      path.unshift(parent.tagName);
      current = parent as unknown as QuasarNode;
      parent = current.parentContext;
    }
    
    const nodeIdentifier = `${node.tagName}-${node.attributes?.label || ''}-${node.attributes?.class || ''}`;
    return [...path, nodeIdentifier].join('/');
  }
  // Log para debug
  logDebug('processNode', `Processando nó: ${node.tagName}`);
  
  // Verificar se é um componente Quasar
  const isQuasarComponent = node.tagName.toLowerCase().startsWith('q-');
  let figmaNode: FrameNode | null = null;
  
  if (isQuasarComponent) {
    const componentType = detectComponentType(node);
    logInfo('processNode', `Componente Quasar detectado: ${componentType.category}/${componentType.type}`);
    
    try {
      // Tentar processar com processador específico
      figmaNode = await componentService.processComponentByCategory(
        node,
        componentType.category,
        componentType.type,
        settings
      );
      
      if (figmaNode) {
        // Aplicar cores e adicionar ao nó pai
        const colorAnalysis = analyzeComponentColors(node);
        applyQuasarColors(figmaNode, colorAnalysis, componentType.type);
        
        // Adicionar ao pai
        parentFigmaNode.appendChild(figmaNode);
        
        // Processar filhos do componente se necessário
        // Por exemplo, para q-btn com q-tooltip dentro
        if (node.childNodes && node.childNodes.length > 0) {
          // Processar apenas componentes filhos que sejam Quasar
          for (const child of node.childNodes) {
            if (child.tagName && child.tagName.startsWith('q-')) {
              await processNodeTree(child, figmaNode, settings);
            }
          }
        }
        
        return; // Retornar apenas após processar completamente o componente
      }
    } catch (error) {
      logError('processNode', `Erro ao processar componente Quasar: ${node.tagName}`, error);
      // Fallback para processador genérico abaixo
    }
  }

  const classes = node.attributes.class.split(/\s+/);
  
  // Ordenar classes para aplicar na ordem correta
  const sortedClasses = classes.sort((a, b) => {
  const order = ['full-width', 'full-height', 'row', 'column', 'q-pa-', 'q-ma-', 'q-gutter-', 'text-', 'bg-'];
  const getOrder = (className: string) => {
    for (let i = 0; i < order.length; i++) {
      if (className.startsWith(order[i])) return i;
    }
    return order.length;
  };
  return getOrder(a) - getOrder(b);
});
  
  // Processamento genérico (apenas para nós que não foram processados por processadores específicos)
  figmaNode = await processGenericComponent(node, settings);
  parentFigmaNode.appendChild(figmaNode);
  
  // Processar filhos recursivamente
  if (node.childNodes && node.childNodes.length > 0) {
    for (const child of node.childNodes) {
      await processNodeTree(child, figmaNode, settings);
    }
  }
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