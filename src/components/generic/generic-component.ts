// src/components/generic/generic-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';

/**
 * Processa um componente genérico quando não houver conversor específico
 * Versão externa para evitar conflitos
 */
export async function processGenericComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  const frame = figma.createFrame();
  frame.name = node.tagName || "generic-component";
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  frame.cornerRadius = 4;
  
  // Verificar se é um componente Quasar sem processador específico
  if (node.tagName && node.tagName.startsWith('q-')) {
    // Adicionar texto que indica o tipo de componente
    try {
      // Tente usar Roboto em vez de Inter, já que Roboto é carregada no início do plugin
      await figma.loadFontAsync({ family: "Roboto", style: "Medium" });
      const headerText = figma.createText();
      headerText.characters = `Componente ${node.tagName}`;
      headerText.fontSize = 16;
      headerText.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
      
      frame.appendChild(headerText);
      
      // Processar atributos relevantes
      if (node.attributes && Object.keys(node.attributes).length > 0) {
        await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
        const attrsText = figma.createText();
        
        const attrStr = Object.entries(node.attributes)
          .filter(([key, _]) => key !== 'style' && key !== 'class')
          .map(([key, value]) => `${key}="${value}"`)
          .join('\n');
        
        attrsText.characters = attrStr || "Sem atributos";
        attrsText.fontSize = 12;
        attrsText.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }];
        
        frame.appendChild(attrsText);
      }
    } catch (error) {
      console.error('Erro ao criar textos para componente genérico:', error);
    }
  }
  
  return frame;
}