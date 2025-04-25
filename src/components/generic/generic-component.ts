// src/components/generic/generic-component.ts
import { QuasarNode, PluginSettings } from '../../types/settings';
import { detectComponentType } from '../../utils/quasar-utils';
import { componentService } from '../../utils/component-service';

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
      
// Se for um elemento HTML comum (div, span, etc.)
if (node.tagName && !node.tagName.startsWith('q-')) {
  return frame;
}

// Para componentes Quasar, verificar se deve adicionar informações visuais
const isQuasarComponent = node.tagName.toLowerCase().startsWith('q-');

if (isQuasarComponent) {
  const componentType = detectComponentType(node);
  
  // Verificar se existe um processador específico para este componente
  // Isso evita adicionar informações visuais a componentes que têm processadores dedicados
  if (componentService.hasProcessorForComponent && 
      componentService.hasProcessorForComponent(componentType.category, componentType.type)) {
    // Se tiver processador específico, retornar frame básico sem textos adicionais
    return frame;
  }
}

// Se chegou aqui, é um componente sem processador específico
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
  // Código existente para criar texto de atributos...
}

return frame;
}