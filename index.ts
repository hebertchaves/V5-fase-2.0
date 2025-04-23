/**
 * Quasar to Figma Converter
 * Módulo principal que exporta todas as funcionalidades do plugin
 */

// Tipos
export * from './src/types/settings';

// Parser
export { 
  parseQuasarTemplate, 
  extractTemplateContent,
} from './src/parser/template';

// Conversor principal
export { 
  convertQuasarToFigma,
  processGenericComponent
} from './src/components/converter';

// Utilitários
export * from './src/utils/figma-utils';
export * from './src/utils/quasar-utils';
// Re-exportar explicitamente para resolver a ambiguidade
export { 
  processQuasarClass,
} from './src/utils/style-utils';
export * from './src/utils/component-service';

// Componentes específicos
export { processButtonComponent } from './src/components/basic/button-component';
export { processCardComponent } from './src/components/layout/card-component';
export { processFormComponents } from './src/components/form/form-components';
export { processLayoutComponents } from './src/components/layout/layout-components';

// Mapeamento de componentes
export * from './src/data/component-map';
export * from './src/data/color-map';

// Inicializando registros de componentes
import { componentService } from './src/utils/component-service';
import { processButtonComponent } from './src/components/basic/button-component';
import { processCardComponent } from './src/components/layout/card-component';
import { processFormComponents } from './src/components/form/form-components';
import { processLayoutComponents } from './src/components/layout/layout-components';
import { processGenericComponent } from './src/components/converter';

// Registrar componentes no serviço para evitar dependências circulares
componentService.registerProcessor('genericComponent', processGenericComponent);
componentService.registerProcessor('buttonProcessor', processButtonComponent);
componentService.registerProcessor('cardProcessor', processCardComponent);
componentService.registerProcessor('formProcessor', processFormComponents);
componentService.registerProcessor('layoutProcessor', processLayoutComponents);

// Registrar tipos de componentes
componentService.registerComponentType('q-btn', 'basic');
componentService.registerComponentType('q-card', 'layout');
componentService.registerComponentType('q-input', 'form');
// Registrar mais tipos conforme necessário...