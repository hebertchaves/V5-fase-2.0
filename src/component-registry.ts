// src/component-registry.ts

import { componentService } from './utils/component-service';

// Importações de processadores
import { processGenericComponent } from './components/converter';
import { processButtonComponent } from './components/basic/button-component';
import { processCardComponent } from './components/layout/card-component';
import { processFormComponents } from './components/form/form-components';
import { processLayoutComponents } from './components/layout/layout-components';
import { processNavigationComponents } from './components/navigation/navigation-components';
import { processPopupComponents } from './components/popup/popup-components';
import { processDisplayComponents } from './components/display/display-components';
import { processOtherComponents } from './components/other/other-components';
import { processScrollingComponents } from './components/scrolling/scrolling-components';
import { processListComponent } from './components/display/list-component';
import { processAvatarComponent } from './components/basic/avatar-component';

/**
 * Registra todos os processadores de componentes no serviço
 */
export function registerAllComponentProcessors() {
  // Inicializar o serviço de componentes
  componentService.initialize();
  
  // Registrar todos os processadores
  componentService.registerProcessor('genericComponent', processGenericComponent);
  componentService.registerProcessor('buttonProcessor', processButtonComponent);
  componentService.registerProcessor('cardProcessor', processCardComponent);
  componentService.registerProcessor('listProcessor', processListComponent);
  componentService.registerProcessor('avatarProcessor', processAvatarComponent);

  // Registrar tipos de componentes
  componentService.registerComponentType('q-list', 'display');
  componentService.registerComponentType('q-item', 'display');
  componentService.registerComponentType('q-item-section', 'display');
  componentService.registerComponentType('q-item-label', 'display');
  componentService.registerComponentType('q-avatar', 'basic');
  // Processadores por categoria
  componentService.registerProcessor('basicProcessor', (node, type, settings) => {
    switch (type) {
      case 'btn':
        return processButtonComponent(node, settings);
      default:
        return processGenericComponent(node, settings);
    }
  });
  componentService.registerProcessor('avatarProcessor', processAvatarComponent);
  componentService.registerComponentType('q-avatar', 'basic');
  componentService.registerProcessor('formProcessor', processFormComponents);
  componentService.registerProcessor('layoutProcessor', processLayoutComponents);
  componentService.registerProcessor('navigationProcessor', processNavigationComponents);
  componentService.registerProcessor('popupProcessor', processPopupComponents);
  componentService.registerProcessor('displayProcessor', processDisplayComponents);
  componentService.registerProcessor('scrollingProcessor', processScrollingComponents);
  componentService.registerProcessor('otherProcessor', processOtherComponents);
  
  console.log('Todos os processadores de componentes foram registrados com sucesso');
}