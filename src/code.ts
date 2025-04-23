
import { convertQuasarToFigma } from '../src/components/converter';
import { loadRequiredFonts } from './utils/figma-utils';
import { setupLogger, logInfo, logError } from './utils/logger.js';
import { registerAllComponentProcessors } from './component-registry';
import { PluginSettings } from './types/settings';

// Configuração padrão do plugin
export const defaultSettings: PluginSettings = {
  preserveQuasarColors: true,
  createComponentVariants: true,
  useAutoLayout: true,
  componentDensity: 'default',
  colorTheme: 'quasar-default',
  componentGroups: {
    basic: true,
    form: true,
    layout: true,
    navigation: true,
    popup: true,
    scrolling: true,
    display: true,
    other: true
  }
};

// Configuração atual
let currentSettings = { ...defaultSettings };

// Mostrar a UI
figma.showUI(__html__, { width: 450, height: 550 });

// Configurar logger
setupLogger('INFO');

// Inicializar o plugin
async function initializePlugin() {
  // Carregar fontes necessárias antecipadamente - CERTIFICAR QUE ISTO OCORRE PRIMEIRO
  await loadRequiredFonts();
  
  // Registrar todos os processadores de componentes
  registerAllComponentProcessors();
  
  // Enviar configurações iniciais para a UI
  figma.ui.postMessage({
    type: 'init-settings',
    settings: currentSettings
  });
  
  logInfo('main', 'Plugin inicializado com sucesso');
}

// Handler para mensagens da UI
figma.ui.onmessage = async function(msg) {
  console.log('Mensagem recebida da UI:', msg);
  
  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
  
  else if (msg.type === 'update-settings') {
    // Atualizar configurações
    currentSettings = { ...currentSettings, ...msg.settings };
    
    // Confirmar atualização
    figma.ui.postMessage({
      type: 'settings-updated',
      settings: currentSettings
    });
  }
  
  else if (msg.type === 'convert-code') {
    try {
      // Atualizar configurações se fornecidas
      if (msg.settings) {
        currentSettings = { ...currentSettings, ...msg.settings };
      }
      
      // Notificar UI sobre início do processamento
      figma.ui.postMessage({
        type: 'processing-update',
        message: 'Analisando código...'
      });
      
      // Executar a conversão
      const result = await convertQuasarToFigma(msg.code, currentSettings);
      
      // Verificar se a conversão foi bem-sucedida
      if (!result) {
        throw new Error('Falha na conversão: resultado não retornado');
      }
      
      // Gerar representação da estrutura do componente
      const componentStructure = generateComponentStructure(result);
      
      // Notificar a UI sobre o sucesso
      figma.ui.postMessage({
        type: 'conversion-success',
        structure: componentStructure
      });
      
      // Selecionar o nó recém-criado
      figma.currentPage.selection = [result];
      figma.viewport.scrollAndZoomIntoView([result]);
      
    } catch (error) {
      console.error('Erro na conversão:', error);
      
      // Notificar a UI sobre o erro
      figma.ui.postMessage({
        type: 'conversion-error',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
};

/**
 * Gera uma representação em texto da estrutura do componente
 */
function generateComponentStructure(node: SceneNode, depth: number = 0): string {
  const indent = '  '.repeat(depth);
  let result = `${indent}${node.name} (${node.type})`;
  
  if ('layoutMode' in node && node.layoutMode) {
    const layoutMode = node.layoutMode === 'HORIZONTAL' ? 'Row' : 'Column';
    result += ` [${layoutMode}]`;
  }
  
  result += '\n';
  
  // Recursão para nós filhos
  if ('children' in node && node.children) {
    for (const child of node.children) {
      result += generateComponentStructure(child, depth + 1);
    }
  }
  
  return result;
}

// Inicializar o plugin
initializePlugin();