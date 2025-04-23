
export const materialIconsMap: Record<string, string> = {
    
  
  'send': '\uE163',
  'phone': '\uE0CD',
  
  // Ícones de interface comum
  'menu': '\uE5D2',
  'close': '\uE5CD',
  'add': '\uE145',
  'remove': '\uE15B',
  'search': '\uE8B6',
  'settings': '\uE8B8',
  'delete': '\uE872',
  'edit': '\uE3C9',
  'help': '\uE887',
  'info': '\uE88E',
  'warning': '\uE002',
  'error': '\uE000',
  
  };
     
  // Mapas para outras bibliotecas de ícones
  export const fontAwesomeMap: Record<string, string> = {
    // Implementar mapeamentos para Font Awesome
  };
  
  export const ioniconsMap: Record<string, string> = {
    // Implementar mapeamentos para Ionicons
  };
  
  // Função para obter o caractere Unicode baseado no nome do ícone e biblioteca
  export function getIconUnicode(library: string, iconName: string): string {
    switch (library) {
      case 'material':
        return materialIconsMap[iconName] || '\uE5CD'; // default: close
      case 'fontawesome':
        return fontAwesomeMap[iconName] || '\uF057'; // default: fa-times-circle
      case 'ionicons':
        return ioniconsMap[iconName] || '\uF2C0'; // default: ion-close
      default:
        return '\uE5CD'; // Material Icons close como fallback padrão
    }
  }