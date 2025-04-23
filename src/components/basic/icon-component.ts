// src/components/basic/icon-component.ts (atualizado)
import { QuasarNode, PluginSettings } from '../../types/settings';
import { extractStylesAndProps } from '../../utils/quasar-utils';
import { applyStylesToFigmaNode, createText } from '../../utils/figma-utils';
import { quasarColors } from '../../data/color-map';
import { logDebug } from '../../utils/logger.js';

// Mapeamento para ícones Material Design
const materialIconsMap: Record<string, string> = {

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
  
  // Navegação
  'arrow_back': '\uE5C4',
  'arrow_forward': '\uE5C8',
  'check': '\uE5CA',
  'home': '\uE88A',
  
  // Navigation
  'arrow_upward': '\uE5D8',
  'arrow_downward': '\uE5DB',
  'chevron_left': '\uE5CB',
  'chevron_right': '\uE5CC',
  'expand_less': '\uE5CE',
  'expand_more': '\uE5CF',
  'first_page': '\uE5DC',
  'last_page': '\uE5DD',
  'unfold_less': '\uE5D6',
  'unfold_more': '\uE5D7',
  
  // Actions
  'clear': '\uE14C',
  'done': '\uE876',
  'favorite': '\uE87D',
  'favorite_border': '\uE87E',
  'star': '\uE838',
  'star_border': '\uE83A',
  'visibility': '\uE8F4',
  'visibility_off': '\uE8F5',
  'info_outline': '\uE88F',
  'error_outline': '\uE001',
  
  // Content
  'add_circle': '\uE147',
  'add_circle_outline': '\uE148',
  'block': '\uE14B',
  'content_copy': '\uE14D',
  'content_cut': '\uE14E',
  'content_paste': '\uE14F',
  'create': '\uE150',
  'drafts': '\uE151',
  'file_download': '\uE2C4',
  'file_upload': '\uE2C6',
  'filter_list': '\uE152',
  'flag': '\uE153',
  'forward': '\uE154',
  'gesture': '\uE155',
  'inbox': '\uE156',
  'link': '\uE157',
  'markunread': '\uE159',
  'redo': '\uE15A',
  'remove_circle': '\uE15C',
  'remove_circle_outline': '\uE15D',
  'reply': '\uE15E',
  'reply_all': '\uE15F',
  'report': '\uE160',
  'save': '\uE161',
  'select_all': '\uE162',
  'sort': '\uE164',
  'text_format': '\uE165',
  'undo': '\uE166',
  
  // Communication
  'call': '\uE0B0',
  'call_end': '\uE0B1',
  'chat': '\uE0B7',
  'chat_bubble': '\uE0CA',
  'chat_bubble_outline': '\uE0CB',
  'mail': '\uE158',
  'email': '\uE0BE',
  'forum': '\uE0BF',
  'location_on': '\uE0C8',
  'message': '\uE0C9',
  
  // Social
  'group': '\uE7EF',
  'group_add': '\uE7F0',
  'notifications': '\uE7F4',
  'notifications_active': '\uE7F7',
  'notifications_none': '\uE7F5',
  'notifications_off': '\uE7F6',
  'person': '\uE7FD',
  'person_add': '\uE7FE',
  'person_outline': '\uE7FF',
  'public': '\uE80B',
  'share': '\uE80D',
  'whatshot': '\uE80E',
  
  // File
  'attachment': '\uE2BC',
  'cloud': '\uE2BD',
  'cloud_done': '\uE2BF',
  'cloud_download': '\uE2C0',
  'cloud_off': '\uE2C1',
  'cloud_queue': '\uE2C2',
  'cloud_upload': '\uE2C3',
  'create_new_folder': '\uE2CC',
  'folder': '\uE2C7',
  'folder_open': '\uE2C8',
  
  // Hardware
  'keyboard_arrow_down': '\uE313',
  'keyboard_arrow_left': '\uE314',
  'keyboard_arrow_right': '\uE315',
  'keyboard_arrow_up': '\uE316',
  'keyboard_backspace': '\uE317',
  'keyboard_capslock': '\uE318',
  'keyboard_hide': '\uE31A',
  'keyboard_return': '\uE31B',
  'keyboard_tab': '\uE31C',
  'keyboard_voice': '\uE31D',
  
  // Places
  'business': '\uE0AF',
  'location_city': '\uE7F1',
  'location_off': '\uE0C7',
  'restaurant': '\uE56C',
  'school': '\uE80C',
  
  // AV
  'fast_forward': '\uE01F',
  'fast_rewind': '\uE020',
  'games': '\uE021',
  'mic': '\uE029',
  'mic_none': '\uE02A',
  'mic_off': '\uE02B',
  'pause': '\uE034',
  'pause_circle_filled': '\uE035',
  'pause_circle_outline': '\uE036',
  'play_arrow': '\uE037',
  'play_circle_filled': '\uE038',
  'play_circle_outline': '\uE039',
  'repeat': '\uE040',
  'repeat_one': '\uE041',
  'replay': '\uE042',
  'shuffle': '\uE043',
  'skip_next': '\uE044',
  'skip_previous': '\uE045',
  'snooze': '\uE046',
  'stop': '\uE047',
  'volume_down': '\uE04D',
  'volume_mute': '\uE04E',
  'volume_off': '\uE04F',
  'volume_up': '\uE050',
  
  // Image
  'add_a_photo': '\uE439',
  'add_photo_alternate': '\uE43E',
  'add_to_photos': '\uE39D',
  'adjust': '\uE39E',
  'camera': '\uE3AF',
  'camera_alt': '\uE3B0',
  'camera_front': '\uE3B1',
  'camera_rear': '\uE3B2',
  'collections': '\uE3B6',
  'collections_bookmark': '\uE431',
  'color_lens': '\uE3B7',
  'crop': '\uE3BE',
  'crop_original': '\uE3C4',
  'exposure': '\uE3CA',
  'filter': '\uE3D3',
  'flash_off': '\uE3E4',
  'flash_on': '\uE3E7',
  'image': '\uE3F4',
  'image_search': '\uE43F',
  'movie_creation': '\uE404',
  'photo': '\uE410',
  'photo_camera': '\uE412',
  'photo_library': '\uE413',
  'style': '\uE41D',
  
  // Ecommerce
  'add_shopping_cart': '\uE854',
  'shopping_basket': '\uE8CB',
  'shopping_cart': '\uE8CC',
}

function extractIconName(node: QuasarNode): string {
  // Extrair o nome do ícone a partir do nó
  if (node.attributes?.name) {
    return node.attributes.name;
  }
  
  // Tentar extrair de classes
  if (node.attributes?.class) {
    const classes = node.attributes.class.split(/\s+/);
    for (const cls of classes) {
      if (cls.startsWith('fa-') || cls.startsWith('mdi-') || cls.startsWith('material-icons')) {
        return cls;
      }
    }
  }
  
  // Valor padrão
  return 'info';
}

function detectIconLibrary(iconName: string): string {
  // Lógica similar à getIconLibrary existente
  if (!iconName) return 'material';
  
  if (iconName.startsWith('fa-') || iconName.startsWith('fas ') || 
      iconName.startsWith('far ') || iconName.startsWith('fab ')) {
    return 'fontawesome';
  } else if (iconName.startsWith('ion-')) {
    return 'ionicons';
  } else if (iconName.startsWith('mdi-')) {
    return 'mdi';
  } else {
    return 'material'; // Padrão do Quasar
  }
}

async function checkMaterialIconsAvailability(): Promise<boolean> {
  try {
    // Tenta carregar a fonte
    await figma.loadFontAsync({ family: "Material Icons", style: "Regular" });
    console.log("Material Icons disponível e carregada com sucesso");
    return true;
  } catch (error) {
    console.error("Material Icons não está disponível:", error);
    return false;
  }
}

async function createIconNode(iconName: string, iconLibrary: string): Promise<FrameNode> {
  // Tentar usar uma fonte alternativa quando Material Icons não estiver disponível
  let fontAvailable = false;
  
  try {
    // Tentar carregar a fonte Material Icons
    await figma.loadFontAsync({ family: "Material Icons", style: "Regular" });
    fontAvailable = true;
  } catch (error) {
    console.log('Fonte Material Icons não disponível, usando fonte alternativa');
    try {
      // Tentar usar a fonte Roboto como alternativa
      await figma.loadFontAsync({ family: "Roboto", style: "Regular" });
      fontAvailable = true;
    } catch (innerError) {
      console.error('Erro ao carregar fonte alternativa:', innerError);
    }
  }
  
  const iconFrame = figma.createFrame();
  iconFrame.name = `q-icon-${iconName || "placeholder"}`;
  
  // Criar texto ou placeholder dependendo da disponibilidade da fonte
  if (fontAvailable) {
    const iconText = figma.createText();
    iconText.characters = getIconUnicode(iconLibrary, iconName) || "□";
    iconFrame.appendChild(iconText);
  } else {
    // Criar um placeholder visual quando nenhuma fonte está disponível
    const placeholder = figma.createRectangle();
    placeholder.resize(24, 24);
    placeholder.cornerRadius = 4;
    placeholder.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    iconFrame.appendChild(placeholder);
  }
  
  return iconFrame;
}


// Identificar a biblioteca baseada no prefixo do nome do ícone
function getIconLibrary(iconName: string): string {
  if (iconName.startsWith('fa-') || iconName.startsWith('fas ') || 
      iconName.startsWith('far ') || iconName.startsWith('fab ')) {
    return 'fontawesome';
  } else if (iconName.startsWith('ion-')) {
    return 'ionicons';
  } else if (iconName.startsWith('eva-')) {
    return 'eva';
  } else if (iconName.startsWith('ti-')) {
    return 'themify';
  } else if (iconName.startsWith('la-')) {
    return 'lineawesome';
  } else if (iconName.startsWith('mdi-')) {
    return 'mdi';
  } else {
    return 'material'; // Padrão do Quasar
  }
}

// Remover prefixos para obter o nome normalizado do ícone
function normalizeIconName(iconName: string): string {
  // Remover prefixos conhecidos
  const prefixes = ['fa-', 'fas ', 'far ', 'fab ', 'ion-', 'eva-', 'ti-', 'la-', 'mdi-'];
  
  let normalizedName = iconName;
  for (const prefix of prefixes) {
    if (normalizedName.startsWith(prefix)) {
      normalizedName = normalizedName.substring(prefix.length);
      break;
    }
  }
  
  return normalizedName;
}

// Mapear o nome do ícone para o caractere Unicode
function getIconUnicode(library: string, iconName: string): string {
  // Para Material Design Icons
  if (library === 'material' && materialIconsMap[iconName]) {
    return materialIconsMap[iconName];
  }
  
  // Fallback para um ícone genérico
  return '\uE5CD'; // close icon como fallback
}

/**
 * Processa um componente de ícone Quasar (q-icon)
 */
export async function processIconComponent(node: QuasarNode, settings: PluginSettings): Promise<FrameNode> {
  logDebug('icon', `Processando ícone: ${JSON.stringify(node.attributes)}`);
  
  const iconFrame = figma.createFrame();
  iconFrame.name = "q-icon";
  
  const { props } = extractStylesAndProps(node);
  
  // Determinar tamanho do ícone
  let iconSize = 24; // tamanho padrão
  if (props.size) {
    switch (props.size) {
      case 'xs': iconSize = 16; break;
      case 'sm': iconSize = 20; break;
      case 'md': iconSize = 24; break;
      case 'lg': iconSize = 32; break;
      case 'xl': iconSize = 40; break;
      default:
        // Tentar extrair valor numérico
        const sizeNum = parseInt(props.size);
        if (!isNaN(sizeNum)) {
          iconSize = sizeNum;
        }
    }
  }
  
  iconFrame.resize(iconSize, iconSize);
  iconFrame.layoutMode = "HORIZONTAL";
  iconFrame.primaryAxisAlignItems = "CENTER";
  iconFrame.counterAxisAlignItems = "CENTER";
  
  // Extrair nome do ícone
  const iconName = props.name || "";
  
  // Tentar carregar a fonte Material Icons
  try {
    await figma.loadFontAsync({ family: "Material Icons", style: "Regular" });
    
    // Criar o nó de texto para o ícone
    const textNode = figma.createText();
    textNode.name = `icon-${iconName || "default"}`;
    textNode.fontSize = iconSize;
    
    // Obter o caractere Unicode do ícone
    const library = getIconLibrary(iconName);
    textNode.characters = getIconUnicode(library, iconName);
    
    // Aplicar cor
    if (props.color && quasarColors[props.color]) {
      textNode.fills = [{ type: 'SOLID', color: quasarColors[props.color] }];
    }
    
    iconFrame.appendChild(textNode);
  } catch (error) {
    console.error('Erro ao processar ícone:', error);
    
    // Fallback: criar um frame colorido como placeholder
    const placeholder = figma.createRectangle();
    placeholder.resize(iconSize * 0.7, iconSize * 0.7);
    placeholder.cornerRadius = iconSize * 0.2;
    
    if (props.color && quasarColors[props.color]) {
      placeholder.fills = [{ type: 'SOLID', color: quasarColors[props.color] }];
    } else {
      placeholder.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    }
    
    iconFrame.appendChild(placeholder);
  }
  
  return iconFrame;
}

// Função auxiliar para gerar um placeholder baseado no nome do ícone
function getPlaceholderForIcon(iconName: string): string {
  if (!iconName) return "●";
  
  // Obter primeira letra ou caractere representativo
  if (iconName.includes('arrow')) return "→";
  if (iconName.includes('close') || iconName.includes('cancel')) return "✕";
  if (iconName.includes('check')) return "✓";
  if (iconName.includes('add') || iconName.includes('plus')) return "+";
  if (iconName.includes('remove') || iconName.includes('minus')) return "-";
  if (iconName.includes('star')) return "★";
  if (iconName.includes('heart')) return "♥";
  if (iconName.includes('home')) return "⌂";
  if (iconName.includes('user') || iconName.includes('person')) return "👤";
  if (iconName.includes('settings') || iconName.includes('cog')) return "⚙";
  if (iconName.includes('search')) return "🔍";
  if (iconName.includes('menu')) return "☰";
  
  // Placeholder genérico para outros ícones
  return iconName.charAt(0).toUpperCase() || "●";
}

// Exportar funções utilitárias para uso em outros componentes
export {
  getIconLibrary,
  normalizeIconName,
  getIconUnicode,
  materialIconsMap
}