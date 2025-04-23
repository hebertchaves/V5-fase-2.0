// src/components/navigation/tabs-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps, findChildrenByTagName } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText, getContrastingTextColor } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';

/**
 * Processa um componente de tabs Quasar (q-tabs)
 */
export async function processTabsComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const tabsFrame = figma.createFrame();
  tabsFrame.name = "q-tabs";
  
  // Configuração básica
  tabsFrame.layoutMode = "HORIZONTAL";
  tabsFrame.primaryAxisSizingMode = "FIXED";
  tabsFrame.counterAxisSizingMode = "AUTO";
  tabsFrame.resize(400, tabsFrame.height); // Largura padrão
  tabsFrame.itemSpacing = 0;
  tabsFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Determinar cor das tabs
  let tabsColor = null;
  
  if (props.color && quasarColors[props.color] && settings.preserveQuasarColors) {
    tabsColor = quasarColors[props.color];
    tabsFrame.fills = [{ type: 'SOLID', color: tabsColor }];
  }
  
  // Processar tabs individuais
  const tabNodes = findChildrenByTagName(node, 'q-tab');
  let activeTabIndex = 0; // Por padrão, a primeira tab é ativa
  
  // Se não houver tabs, criar algumas de exemplo
  if (tabNodes.length === 0) {
    const exampleTabs = ['Tab 1', 'Tab 2', 'Tab 3'];
    
    for (let i = 0; i < exampleTabs.length; i++) {
      const tabFrame = figma.createFrame();
      tabFrame.name = `q-tab-${i+1}`;
      tabFrame.layoutMode = "HORIZONTAL";
      tabFrame.primaryAxisSizingMode = "FIXED";
      tabFrame.counterAxisSizingMode = "AUTO";
      tabFrame.resize(400 / exampleTabs.length, tabFrame.height);
      tabFrame.paddingLeft = 16;
      tabFrame.paddingRight = 16;
      tabFrame.paddingTop = 12;
      tabFrame.paddingBottom = 12;
      tabFrame.primaryAxisAlignItems = "CENTER";
      tabFrame.counterAxisAlignItems = "CENTER";
      tabFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      
      // Primeira tab ativa
      if (i === activeTabIndex) {
        const indicatorColor = tabsColor || quasarColors.primary;
        tabFrame.strokes = [{ type: 'SOLID', color: indicatorColor }];
        tabFrame.strokeBottomWeight = 2;
      }
      
      const textColor = tabsColor ? getContrastingTextColor(tabsColor) : { r: 0, g: 0, b: 0 };
      const tabTextNode = await createText(exampleTabs[i], {
        color: textColor
      });
      
      tabFrame.appendChild(tabTextNode);
      tabsFrame.appendChild(tabFrame);
    }
  } else {
    for (let i = 0; i < tabNodes.length; i++) {
      const tabNode = tabNodes[i];
      const tabProps = extractStylesAndProps(tabNode).props;
      
      // Verificar se a tab está ativa
      if (tabProps.active === 'true' || tabProps.active === '') {
        activeTabIndex = i;
      }
      
      let tabLabel = tabProps.label || `Tab ${i+1}`;
      
      // Se não tem label, tentar extrair do conteúdo
      if (!tabProps.label) {
        for (const child of tabNode.childNodes) {
          if (child.text) {
            tabLabel = child.text.trim();
            break;
          }
        }
      }
      
      const tabFrame = figma.createFrame();
      tabFrame.name = `q-tab-${tabLabel}`;
      tabFrame.layoutMode = "HORIZONTAL";
      tabFrame.primaryAxisSizingMode = "FIXED";
      tabFrame.counterAxisSizingMode = "AUTO";
      tabFrame.resize(400, tabFrame.height);
      tabFrame.paddingLeft = 16;
      tabFrame.paddingRight = 16;
      tabFrame.paddingTop = 12;
      tabFrame.paddingBottom = 12;
      tabFrame.primaryAxisAlignItems = "CENTER";
      tabFrame.counterAxisAlignItems = "CENTER";
      tabFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      
      // Tab ativa
      if (i === activeTabIndex) {
        const indicatorColor = tabsColor || quasarColors.primary;
        tabFrame.strokes = [{ type: 'SOLID', color: indicatorColor }];
        tabFrame.strokeBottomWeight = 2;
      }
      
      const textColor = tabsColor ? getContrastingTextColor(tabsColor) : { r: 0, g: 0, b: 0 };
      const tabTextNode = await createText(tabLabel, {
        color: textColor
      });
      
      tabFrame.appendChild(tabTextNode);
      tabsFrame.appendChild(tabFrame);
    }
  }
  
  return tabsFrame;
}