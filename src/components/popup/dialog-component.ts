// src/components/popup/dialog-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText, createShadowEffect } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';
import { processButtonComponent } from '../basic/button-component';

/**
 * Processa um componente de diálogo Quasar (q-dialog)
 */
export async function processDialogComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  // Criar um container para o diálogo e o overlay
  const dialogContainer = figma.createFrame();
  dialogContainer.name = "q-dialog-container";
  dialogContainer.resize(400, 300);
  dialogContainer.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.4 }];
  
  // Criar o diálogo
  const dialogFrame = figma.createFrame();
  dialogFrame.name = "q-dialog";
  dialogFrame.layoutMode = "VERTICAL";
  dialogFrame.primaryAxisSizingMode = "AUTO";
  dialogFrame.counterAxisSizingMode = "AUTO";
  dialogFrame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  dialogFrame.cornerRadius = 4;
  dialogFrame.effects = [createShadowEffect(0, 4, 8, 0.2)];
  
  // Extrair propriedades e estilos
  const { props, styles } = extractStylesAndProps(node);
  
  // Processar conteúdo do diálogo
  // Título
  const titleText = await createText("Dialog Title", {
    fontSize: 18,
    fontWeight: 'bold',
    color: { r: 0, g: 0, b: 0 }
  });
  
  const titleContainer = figma.createFrame();
  titleContainer.name = "q-dialog__title";
  titleContainer.layoutMode = "HORIZONTAL";
  titleContainer.primaryAxisSizingMode = "AUTO";
  titleContainer.counterAxisSizingMode = "AUTO";
  titleContainer.paddingLeft = 16;
  titleContainer.paddingRight = 16;
  titleContainer.paddingTop = 16;
  titleContainer.paddingBottom = 16;
  titleContainer.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  titleContainer.appendChild(titleText);
  
  // Conteúdo
  const contentContainer = figma.createFrame();
  contentContainer.name = "q-dialog__content";
  contentContainer.layoutMode = "VERTICAL";
  contentContainer.primaryAxisSizingMode = "AUTO";
  contentContainer.counterAxisSizingMode = "AUTO";
  contentContainer.paddingLeft = 16;
  contentContainer.paddingRight = 16;
  contentContainer.paddingTop = 0;
  contentContainer.paddingBottom = 16;
  contentContainer.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  
  const contentText = await createText("Dialog content goes here. This is a sample text to demonstrate how content is displayed in a Quasar dialog component.", {
    fontSize: 14,
    color: { r: 0, g: 0, b: 0 }
  });
  
  contentContainer.appendChild(contentText);
  
  // Ações
  const actionsContainer = figma.createFrame();
  actionsContainer.name = "q-dialog__actions";
  actionsContainer.layoutMode = "HORIZONTAL";
  actionsContainer.primaryAxisSizingMode = "AUTO";
  actionsContainer.counterAxisSizingMode = "AUTO";
  actionsContainer.primaryAxisAlignItems = "MAX";
  actionsContainer.paddingLeft = 16;
  actionsContainer.paddingRight = 16;
  actionsContainer.paddingTop = 8;
  actionsContainer.paddingBottom = 16;
  actionsContainer.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  actionsContainer.itemSpacing = 8;
  
  // Botões de ação
  const cancelButton = await processButtonComponent({
    tagName: 'q-btn',
    attributes: {
      flat: 'true',
      label: 'Cancel',
      color: 'primary'
    },
    childNodes: []
  }, settings);
  
  const okButton = await processButtonComponent({
    tagName: 'q-btn',
    attributes: {
      label: 'OK',
      color: 'primary'
    },
    childNodes: []
  }, settings);
  
  actionsContainer.appendChild(cancelButton);
  actionsContainer.appendChild(okButton);
  
  // Montar o diálogo
  dialogFrame.appendChild(titleContainer);
  dialogFrame.appendChild(contentContainer);
  dialogFrame.appendChild(actionsContainer);
  
  // Centralizar o diálogo no container
  dialogFrame.x = (dialogContainer.width - dialogFrame.width) / 2;
  dialogFrame.y = (dialogContainer.height - dialogFrame.height) / 2;
  
  dialogContainer.appendChild(dialogFrame);
  
  return dialogContainer;
}