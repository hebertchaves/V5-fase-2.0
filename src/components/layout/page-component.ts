// src/components/layout/page-component.ts

import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';
import { logDebug, logInfo, logError } from '../../utils/logger';
import { componentService } from '../../utils/component-service';

/**
 * Processa um componente de página Quasar (q-page)
 */
export async function processPageComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  logInfo('page', 'Processando componente q-page');
  
  try {
    const pageFrame = figma.createFrame();
    pageFrame.name = "q-page";
    
    // Configuração básica da página
    pageFrame.layoutMode = "VERTICAL";
    pageFrame.primaryAxisSizingMode = "AUTO";
    pageFrame.counterAxisSizingMode = "FIXED";
    pageFrame.resize(1024, pageFrame.height); // Largura padrão
    pageFrame.paddingLeft = 24;
    pageFrame.paddingRight = 24;
    pageFrame.paddingTop = 24;
    pageFrame.paddingBottom = 24;
    pageFrame.itemSpacing = 16;
    pageFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    // Extrair propriedades e estilos
    const { props, styles } = extractStylesAndProps(node);
    logDebug('page', 'Propriedades extraídas', props);
    
    // Aplicar estilos personalizados
    applyStylesToFigmaNode(pageFrame, styles);
    
    // Verificar configurações de padding especiais
    if (props.padding) {
      const padding = parseInt(props.padding);
      if (!isNaN(padding)) {
        pageFrame.paddingLeft = padding;
        pageFrame.paddingRight = padding;
        pageFrame.paddingTop = padding;
        pageFrame.paddingBottom = padding;
      }
    }
    
    // Criar a estrutura hierárquica correta da página
    // q-page > q-page__container > content
    
    // Criar container interno
    const pageContainer = figma.createFrame();
    pageContainer.name = "q-page__container";
    pageContainer.layoutMode = "VERTICAL";
    pageContainer.primaryAxisSizingMode = "AUTO";
    pageContainer.counterAxisSizingMode = "AUTO";
    pageContainer.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
    pageContainer.itemSpacing = 16;
    
    // Processar filhos do nó
    for (const child of node.childNodes) {
      if (!child.tagName || child.tagName === '#text') continue;
      
      try {
        // Processar componente filho
        const childComponent = await componentService.processGenericComponent(child, settings);
        if (childComponent) {
          pageContainer.appendChild(childComponent);
          logDebug('page', `Filho processado: ${child.tagName}`);
        }
      } catch (error) {
        logError('page', `Erro ao processar filho do página (${child.tagName})`, error);
      }
    }
    
    // Se não tiver filhos, adicionar conteúdo de exemplo
    if (pageContainer.children.length === 0) {
      logInfo('page', 'Criando conteúdo de exemplo para página vazia');
      
      // Título da página
      const titleText = await createText("Título da Página", {
        fontSize: 24,
        fontWeight: 'bold'
      });
      
      if (titleText) {
        pageContainer.appendChild(titleText);
      }
      
      // Conteúdo da página
      const contentText = await createText("Conteúdo da página. Esta é uma representação de uma página Quasar (q-page) gerada automaticamente pelo conversor.", {
        fontSize: 16
      });
      
      if (contentText) {
        pageContainer.appendChild(contentText);
      }
    }
    
    // Adicionar o container à página
    pageFrame.appendChild(pageContainer);
    
    logInfo('page', 'Componente q-page processado com sucesso');
    return pageFrame;
  } catch (error) {
    logError('page', 'Erro ao processar componente q-page', error);
    throw error;
  }
}

/**
 * Cria uma representação básica de uma página Quasar
 */
export async function createBasicPage(settings: PluginSettings): Promise<FrameNode> {
  const pageFrame = figma.createFrame();
  pageFrame.name = "q-page";
  
  // Configuração básica
  pageFrame.layoutMode = "VERTICAL";
  pageFrame.primaryAxisSizingMode = "AUTO";
  pageFrame.counterAxisSizingMode = "FIXED";
  pageFrame.resize(1024, pageFrame.height);
  pageFrame.paddingLeft = 24;
  pageFrame.paddingRight = 24;
  pageFrame.paddingTop = 24;
  pageFrame.paddingBottom = 24;
  pageFrame.itemSpacing = 16;
  pageFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Criar container interno
  const pageContainer = figma.createFrame();
  pageContainer.name = "q-page__container";
  pageContainer.layoutMode = "VERTICAL";
  pageContainer.primaryAxisSizingMode = "AUTO";
  pageContainer.counterAxisSizingMode = "AUTO";
  pageContainer.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 }, opacity: 0 }];
  pageContainer.itemSpacing = 16;
  
  // Adicionar conteúdo de exemplo
  const titleText = await createText("Página de Exemplo", {
    fontSize: 24,
    fontWeight: 'bold'
  });
  
  const contentText = await createText("Conteúdo da página de exemplo", {
    fontSize: 16
  });
  
  if (titleText) pageContainer.appendChild(titleText);
  if (contentText) pageContainer.appendChild(contentText);
  
  // Adicionar o container à página
  pageFrame.appendChild(pageContainer);
  
  return pageFrame;
}