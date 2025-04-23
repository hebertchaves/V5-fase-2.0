// src/components/navigation/tab-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText, getContrastingTextColor } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

/**
 * Processa um componente tab Quasar (q-tab)
 */
export async function processTabComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const tabFrame = figma.createFrame();
  tabFrame.name = "q-tab";
  
  // Configuração básica
  tabFrame.layoutMode = "HORIZONTAL";
  tabFrame.primaryAxisSizingMode = "AUTO";
  tabFrame.counterAxisSizingMode = "AUTO";
  tabFrame.primaryAxisAlignItems = "CENTER";
  tabFrame.counterAxisAlignItems = "CENTER";
  tabFrame.paddingLeft = 16;
  tabFrame.paddingRight = 16;
  tabFrame.paddingTop = 12;
  tabFrame.paddingBottom = 12;
  tabFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Determinar texto do tab
  let tabLabel = props.label || "Tab";
  if (!props.label) {
    // Tentar extrair do conteúdo
    for (const child of node.childNodes) {
      if (child.text && child.text.trim()) {
        tabLabel = child.text.trim();
        break;
      }
    }
  }
  
  // Determinar cor do tab
  let tabColor = null;
  let textColor = { r: 0, g: 0, b: 0 }; // Preto por padrão
  
  if (props.color && quasarColors[props.color] && settings.preserveQuasarColors) {
    tabColor = quasarColors[props.color];
    
    // Se estiver ativo, usar como cor de indicador
    if (props.active === 'true' || props.active === '') {
      tabFrame.strokes = [{ type: 'SOLID', color: tabColor }];
      tabFrame.strokeBottomWeight = 2;
      tabFrame.strokeTopWeight = 0;
      tabFrame.strokeLeftWeight = 0;
      tabFrame.strokeRightWeight = 0;
    }
  }
  
  // Verificar se está ativo
  const isActive = props.active === 'true' || props.active === '';
  if (isActive) {
    // Estilo ativo
    tabFrame.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.97, b: 0.97 } }];
    
    // Se não tiver cor definida, usar primária para o indicador
    if (!tabColor) {
      tabFrame.strokes = [{ type: 'SOLID', color: quasarColors.primary }];
      tabFrame.strokeBottomWeight = 2;
      tabFrame.strokeTopWeight = 0;
      tabFrame.strokeLeftWeight = 0;
      tabFrame.strokeRightWeight = 0;
    }
    
    // Texto em negrito quando ativo
    const tabTextNode = await createText(tabLabel, {
      fontWeight: 'medium',
      color: tabColor || quasarColors.primary
    });
    
    if (tabTextNode) {
      tabFrame.appendChild(tabTextNode);
    }
  } else {
    // Estilo inativo
    const tabTextNode = await createText(tabLabel, {
      color: { r: 0.5, g: 0.5, b: 0.5 }
    });
    
    if (tabTextNode) {
      tabFrame.appendChild(tabTextNode);
    }
  }
  
  // Adicionar ícone se especificado
  if (props.icon) {
    const iconFrame = figma.createFrame();
    iconFrame.name = "q-tab__icon";
    iconFrame.resize(18, 18);
    
    // Cor do ícone baseada no estado ativo
    const iconColor = isActive ? (tabColor || quasarColors.primary) : { r: 0.5, g: 0.5, b: 0.5 };
    iconFrame.fills = [{ type: 'SOLID', color: iconColor }];
    
    // Posicionar ícone antes ou depois do texto
    if (props['icon-right'] === 'true' || props['icon-right'] === '') {
      // Adicionar ao final do tab
      tabFrame.appendChild(iconFrame);
    } else {
      // Adicionar no início do tab
      tabFrame.insertChild(0, iconFrame);
    }
    
    // Adicionar espaçamento
    tabFrame.itemSpacing = 8;
  }
  
  return tabFrame;
}

/**
 * Processa um componente de painéis de tabs Quasar (q-tab-panels)
 */
export async function processTabPanelsComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const panelsFrame = figma.createFrame();
  panelsFrame.name = "q-tab-panels";
  
  // Configuração básica
  panelsFrame.layoutMode = "VERTICAL";
  panelsFrame.primaryAxisSizingMode = "AUTO";
  panelsFrame.counterAxisSizingMode = "FIXED";
  panelsFrame.resize(400, panelsFrame.height);
  panelsFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Processar painéis filhos (apenas o ativo é visível)
  let activePanel = null;
  let activePanelIndex = -1;
  
  for (const child of node.childNodes) {
    if (child.tagName && child.tagName.toLowerCase() === 'q-tab-panel') {
      const panelProps = extractStylesAndProps(child).props;
      
      // Verificar se é o painel ativo
      if (panelProps.name === props.modelValue || 
          (activePanelIndex === -1 && (props.value === panelProps.name)) ||
          activePanelIndex === -1) {
        activePanel = child;
        break;
      }
      
      activePanelIndex++;
    }
  }
  
  // Se encontrou um painel ativo, processá-lo
  if (activePanel) {
    const panelFrame = await processTabPanelComponent(activePanel, settings);
    panelsFrame.appendChild(panelFrame);
  } else {
    // Painel vazio como fallback
    const emptyPanel = figma.createFrame();
    emptyPanel.name = "q-tab-panel";
    emptyPanel.layoutMode = "VERTICAL";
    emptyPanel.primaryAxisSizingMode = "AUTO";
    emptyPanel.counterAxisSizingMode = "AUTO";
    emptyPanel.paddingLeft = 16;
    emptyPanel.paddingRight = 16;
    emptyPanel.paddingTop = 16;
    emptyPanel.paddingBottom = 16;
    emptyPanel.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    
    const emptyText = await createText("Conteúdo do painel", {
      fontSize: 14
    });
    
    if (emptyText) {
      emptyPanel.appendChild(emptyText);
      panelsFrame.appendChild(emptyPanel);
    }
  }
  
  return panelsFrame;
}

/**
 * Processa um componente painel de tab Quasar (q-tab-panel)
 */
export async function processTabPanelComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const panelFrame = figma.createFrame();
  panelFrame.name = "q-tab-panel";
  
  // Configuração básica
  panelFrame.layoutMode = "VERTICAL";
  panelFrame.primaryAxisSizingMode = "AUTO";
  panelFrame.counterAxisSizingMode = "AUTO";
  panelFrame.paddingLeft = 16;
  panelFrame.paddingRight = 16;
  panelFrame.paddingTop = 16;
  panelFrame.paddingBottom = 16;
  panelFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Processar conteúdo do painel
  for (const child of node.childNodes) {
    // Verificar se é texto direto
    if (!child.tagName && child.text && child.text.trim()) {
      const textNode = await createText(child.text.trim(), {
        fontSize: 14
      });
      
      if (textNode) {
        panelFrame.appendChild(textNode);
      }
      continue;
    }
    
    // Para outros elementos, tratar como componentes genéricos
    if (child.tagName) {
      try {
        // Processamento genérico para componentes filhos
        // Normalmente aqui chamaríamos processGenericComponent, mas como não temos acesso
        // direto a ele, vamos criar um texto simples com o tipo de componente
        const childName = child.tagName.toLowerCase();
        const childNode = await createText(`Conteúdo ${childName}`, {
          fontSize: 14,
          color: { r: 0.3, g: 0.3, b: 0.3 }
        });
        
        if (childNode) {
          panelFrame.appendChild(childNode);
        }
      } catch (error) {
        console.error('Erro ao processar filho do painel:', error);
      }
    }
  }
  
  // Se não houver conteúdo, adicionar texto de exemplo
  if (panelFrame.children.length === 0) {
    const defaultText = await createText(`Conteúdo do painel ${props.name || ''}`, {
      fontSize: 14
    });
    
    if (defaultText) {
      panelFrame.appendChild(defaultText);
    }
  }
  
  return panelFrame;
}