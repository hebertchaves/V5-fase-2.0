/**
 * Representação de um nó no template Quasar
 */
export interface QuasarNode {
  tagName: string;
  attributes: QuasarNodeAttributes;
  childNodes: QuasarNode[];
  text?: string;
  parentContext?: QuasarParentContext; // Nova propriedade
}

/**
 * Contexto do nó pai para componentes aninhados
 */
export interface QuasarParentContext {
  tagName: string;
  type?: string;
  attributes?: QuasarNodeAttributes;
  isPrimaryComponent?: boolean;
}

// src/types/settings.ts (adicionado)
/**
 * Contexto de um componente Vue
 */
export interface ComponentContext {
  componentName?: string;
  props: Record<string, any>;
  data: Record<string, any>;
  computed: Record<string, any>;
  methods: Record<string, Function>;
  defaultState?: {
    isActive: boolean;
    isDisabled: boolean;
    isFocused: boolean;
    isHovered: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Configurações de grupos de componentes
 */
export interface ComponentGroups {
  basic: boolean;
  form: boolean;
  layout: boolean;
  navigation: boolean;
  popup: boolean;
  scrolling: boolean;
  display: boolean;
  other: boolean;
}

/**
 * Configurações gerais do plugin
 */
export interface PluginSettings {
  preserveQuasarColors: boolean;
  createComponentVariants: boolean;
  useAutoLayout: boolean;
  componentDensity: 'default' | 'comfortable' | 'compact';
  colorTheme: 'quasar-default' | 'material' | 'custom';
  componentGroups: {
    basic: boolean;
    form: boolean;
    layout: boolean;
    navigation: boolean;
    popup: boolean;
    scrolling: boolean;
    display: boolean;
    other: boolean;
  };
}

/**
 * Atributos de um nó Quasar
 */
export interface QuasarNodeAttributes {
  [key: string]: string;
}

/**
 * Representação de um nó no template Quasar
 */
export interface QuasarNode {
  tagName: string;
  attributes: QuasarNodeAttributes;
  childNodes: QuasarNode[];
  text?: string;
}

/**
 * Informações de um componente Vue
 */
export interface VueComponentInfo {
  name: string;
  props: VueComponentProp[];
  data?: Record<string, any>;
  computed?: string[];
  methods?: string[];
}

/**
 * Prop de um componente Vue
 */
export interface VueComponentProp {
  name: string;
  type: string | null;
  default?: any;
  required: boolean;
}

/**
 * Estilos de um componente Vue
 */
export interface VueComponentStyles {
  isScoped: boolean;
  content: string;
}

/**
 * Tipo de cor RGB do Figma
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Tipo de cor RGBA do Figma
 */
export interface RGBA extends RGB {
  a: number;
}

/**
 * Interface para mapeamento de estilos extraídos
 */
export interface ExtractedStyles {
  fills?: Paint[];
  strokes?: Paint[];
  effects?: Effect[];
  opacity?: number;
  cornerRadius?: number;
  strokeWeight?: number;
  fontSize?: number;
  fontName?: FontName;
  textAlignHorizontal?: string;
  textAlignVertical?: string;
  lineHeight?: number | { value: number, unit: string };
  letterSpacing?: number;
  textDecoration?: string;
  textCase?: string;
  layoutMode?: string;
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  horizontalPadding?: number;
  verticalPadding?: number;
  fontColor?: RGB;
  [key: string]: any;
}
export interface ComponentTypeInfo {
  category: string;
  type: string;
}