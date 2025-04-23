// src/components/basic/basic-components.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { processButtonComponent } from './button-component';
import { processChipComponent } from './chip-component';
import { processSeparatorComponent } from './separator-component';
import { processIconComponent } from './icon-component';
import { 
  getQuasarColor, 
  getContrastingTextColor, 
  analyzeComponentColors, 
  colorAnalysisToFigmaProps,
  applyQuasarColors
} from '../../utils/color-utils';

/**
 * Processa componentes básicos do Quasar
 * MODIFICADO: Usar a versão corrigida do processador de botão
 */
export async function processBasicComponents(node: QuasarNode, componentType: string, settings: PluginSettings): Promise<FrameNode> {
  console.log(`Processando componente básico: ${componentType}`);
  
  switch(componentType) {
    case 'btn':
      console.log('Utilizando processador de botão atualizado');
      return await processButtonComponent(node, settings);
    // Outros componentes permanecem inalterados...
    default:
      // Componente genérico
      const frame = figma.createFrame();
      frame.name = `basic-${componentType}`;
      frame.layoutMode = "VERTICAL";
      frame.primaryAxisSizingMode = "AUTO";
      frame.counterAxisSizingMode = "AUTO";
      
      // Analisar configurações de cor do componente
      const colorAnalysis = analyzeComponentColors(node);
      
      // Aplicar cores
      applyQuasarColors(frame, colorAnalysis, componentType);
      
      return frame;
  }
}

