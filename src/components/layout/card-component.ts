// components/layout/card-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText,} from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';
import { processButtonComponent } from '../basic/button-component';
import { componentService } from '../../utils/component-service';
import { processGenericComponent } from '../converter';
import { getQuasarColor, getContrastingTextColor, analyzeComponentColors, applyQuasarColors, applyColorToTextNodes } from '../../utils/color-utils';

// Tipo de utilitário para verificar cores válidas
type QuasarColorKey = keyof typeof quasarColors;

// Verifica se uma string é uma chave de cor válida do Quasar
function isQuasarColorKey(key: string): key is QuasarColorKey {
  return key in quasarColors;
}

/**
 * Processa um componente de card do Quasar
 */
export async function processCardComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  console.log('Processando componente card:', node.tagName);
  
  const cardFrame = figma.createFrame();
  cardFrame.name = "q-card";
  
  // Configuração básica do card
  cardFrame.layoutMode = "VERTICAL";
  cardFrame.primaryAxisSizingMode = "AUTO";
  cardFrame.counterAxisSizingMode = "AUTO"; 
  cardFrame.cornerRadius = 4;
  cardFrame.itemSpacing = 0; // Sem espaçamento entre seções
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Adicionar sombra por padrão (a menos que flat seja especificado)
  if (props.flat !== 'true' && props.flat !== '') {
    cardFrame.effects = [{
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.2 },
      offset: { x: 0, y: 2 },
      radius: 4,
      visible: true,
      blendMode: 'NORMAL'
    }];
  }
  
  // Aplicar borda se especificado
  if (props.bordered === 'true' || props.bordered === '') {
    cardFrame.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
    cardFrame.strokeWeight = 1;
  }
  
  // Remover cantos arredondados se especificado
  if (props.square === 'true' || props.square === '') {
    cardFrame.cornerRadius = 0;
  }
  
  // Cor branca padrão
  cardFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Processar seções do card
  console.log('Total de nós filhos:', node.childNodes.length);
  
  for (const child of node.childNodes) {
    if (!child.tagName || child.tagName === '#text') continue;
    
    const childTag = child.tagName.toLowerCase();
    console.log('Processando filho:', childTag);
    
    if (childTag === 'q-card-section') {
      const sectionFrame = await processCardSection(child, settings);
      if (sectionFrame) {
        cardFrame.appendChild(sectionFrame);
        
        // Aplicar cores à seção com base no card pai
        const colorAnalysis = analyzeComponentColors(node);
        if (colorAnalysis.mainColor) {
          // Se o card tem cor principal, aplicar cor de texto contrastante à seção
          const textColor = getContrastingTextColor(getQuasarColor(colorAnalysis.mainColor) || { r: 1, g: 1, b: 1 });
          applyColorToTextNodes(sectionFrame.children, textColor);
        }
      }
    } 
    else if (childTag === 'q-card-actions') {
      const actionsFrame = await processCardActions(child, settings);
      if (actionsFrame) {
        cardFrame.appendChild(actionsFrame);
      }
    }
    else if (childTag === 'q-separator') {
      const separator = figma.createRectangle();
      separator.name = "q-separator";
      separator.resize(300, 1); // Largura será ajustada automaticamente
      separator.fills = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }];
      cardFrame.appendChild(separator);
    }
    else {
      // Processar outros elementos
      console.log('Processando elemento genérico dentro do card:', childTag);
      try {
        const genericFrame = await processGenericComponent(child, settings);
        if (genericFrame) {
          cardFrame.appendChild(genericFrame);
        }
      } catch (error) {
        console.error(`Erro ao processar filho do card (${childTag}):`, error);
      }
    }
  }
  
  // Aplicar análise completa de cores
  const colorAnalysis = analyzeComponentColors(node);
  applyQuasarColors(cardFrame, colorAnalysis, 'card');
  
  return cardFrame;
}

// Adicionar esta função ao arquivo card-component.ts
async function processCardActions(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  console.log('Processando ações do card');
  
  const actionsFrame = figma.createFrame();
  actionsFrame.name = "q-card-actions";
  
  // Configuração básica
  actionsFrame.layoutMode = "HORIZONTAL";
  actionsFrame.primaryAxisSizingMode = "AUTO";
  actionsFrame.counterAxisSizingMode = "AUTO";
  actionsFrame.paddingLeft = 8;
  actionsFrame.paddingRight = 8;
  actionsFrame.paddingTop = 8;
  actionsFrame.paddingBottom = 8;
  actionsFrame.itemSpacing = 8;
  
  // Cor de fundo padrão (branco)
  actionsFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Verificar alinhamento
  const { props } = extractStylesAndProps(node);
  
  if (props.align) {
    console.log('Alinhamento das ações:', props.align);
    
    switch (props.align) {
      case 'right':
        actionsFrame.primaryAxisAlignItems = 'MAX';
        break;
      case 'center':
        actionsFrame.primaryAxisAlignItems = 'CENTER';
        break;
      case 'between':
        actionsFrame.primaryAxisAlignItems = 'SPACE_BETWEEN';
        break;
      case 'around':
      case 'evenly':
        actionsFrame.primaryAxisAlignItems = 'SPACE_BETWEEN';
        break;
      case 'left':
      default:
        actionsFrame.primaryAxisAlignItems = 'MIN';
        break;
    }
  }
  
  // Processar botões e outros filhos
  for (const child of node.childNodes) {
    if (!child.tagName || child.tagName === '#text') continue;
    
    // Usar o serviço de componentes para processar filhos
    try {
      const childComponent = await componentService.processGenericComponent(child, settings);
      if (childComponent) {
        actionsFrame.appendChild(childComponent);
      }
    } catch (error) {
      console.error(`Erro ao processar filho das ações:`, error);
    }
  }
  
  return actionsFrame;
}

/**
 * Processa uma seção do card
 */
async function processCardSection(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  console.log('Processando seção do card');
  
  const sectionFrame = figma.createFrame();
  sectionFrame.name = "q-card-section";;
  
  // Configuração básica
  sectionFrame.layoutMode = "VERTICAL";
  sectionFrame.primaryAxisSizingMode = "AUTO";
  sectionFrame.counterAxisSizingMode = "AUTO";
  sectionFrame.itemSpacing = 8;
  
  // Adicionar padding adequado
  sectionFrame.paddingLeft = 16;
  sectionFrame.paddingRight = 16;
  sectionFrame.paddingTop = 16;
  sectionFrame.paddingBottom = 16;
  
  // Cor de fundo padrão (branco)
  sectionFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Processar conteúdo da seção
  for (const child of node.childNodes) {
    console.log('Processando filho da seção:', child.tagName || 'texto');
    
    // Processar texto direto
    if (child.tagName === '#text' && child.text && child.text.trim()) {
      const textNode = await createText(child.text.trim());
      sectionFrame.appendChild(textNode);
      continue;
    }
    
    // Processar elementos div com classes especiais
    if (child.tagName && child.tagName.toLowerCase() === 'div') {
      const divClasses = child.attributes && child.attributes.class 
        ? child.attributes.class.split(/\s+/).filter(Boolean) 
        : [];
        
      // Extrair texto do div
      let textContent = '';
      for (const textChild of child.childNodes) {
        if (textChild.text) {
          textContent += textChild.text;
        }
      }
      
      if (divClasses.includes('text-h6')) {
        const titleNode = await createText(textContent, {
          fontSize: 16,
          fontWeight: 'bold'
        });
        sectionFrame.appendChild(titleNode);
      }
      else if (divClasses.includes('text-subtitle2')) {
        const subtitleNode = await createText(textContent, {
          fontSize: 14,
          color: { r: 0.5, g: 0.5, b: 0.5 }
        });
        sectionFrame.appendChild(subtitleNode);
      }
      else {
        // Div genérico
        const textNode = await createText(textContent);
        sectionFrame.appendChild(textNode);
      }
    }
    else if (child.tagName) {
      // Processar componente filho usando o serviço
      try {
        let hasContent = false; // Definir a variável
        const childComponent = await componentService.processGenericComponent(child, settings);
        if (childComponent) {
          sectionFrame.appendChild(childComponent);
          hasContent = true;
        }
      } catch (error) {
        console.error(`Erro ao processar filho:`, error);
      }
    }
  }
  
  return sectionFrame;
}



// Verificar se um Paint é do tipo SolidPaint
function isSolidPaint(paint: Paint): paint is SolidPaint {
  return paint.type === 'SOLID';
}

// Função auxiliar para encontrar todos os filhos com uma tag específica
function findChildrenByTagName(node: QuasarNode, tagName: string): QuasarNode[] {
  const results: QuasarNode[] = [];
  const lowerTagName = tagName.toLowerCase();
  
  if (!node.childNodes) return results;
  
  for (const child of node.childNodes) {
    if (child.tagName && child.tagName.toLowerCase() === lowerTagName) {
      results.push(child);
    }
    
    // Buscar recursivamente nos filhos
    const childResults = findChildrenByTagName(child, tagName);
    results.push(...childResults);
  }
  
  return results;
}