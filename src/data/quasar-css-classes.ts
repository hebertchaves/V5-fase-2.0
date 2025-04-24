import { quasarColors } from './color-map';

// Interface para valores de espaçamento
interface SpacingValue {
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
}

// Interface para propriedades de layout
interface LayoutProps {
  layoutMode?: 'HORIZONTAL' | 'VERTICAL';
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  itemSpacing?: number;
  layoutWrap?: string;
  flexDirection?: string;
}

// Interface para efeitos
interface Effect {
  type: 'DROP_SHADOW' | 'INNER_SHADOW';
  color: { r: number; g: number; b: number; a: number };
  offset: { x: number; y: number };
  radius: number;
  visible?: boolean;
  blendMode?: string;
  spread?: number;
}

// Mapeamento completo de classes CSS do Quasar
export const quasarCssClasses: Record<string, any> = {
  // LAYOUT - Direção e Wrap
  'row': { layoutMode: 'HORIZONTAL' },
  'column': { layoutMode: 'VERTICAL' },
  'reverse-row': { layoutMode: 'HORIZONTAL', flexDirection: 'row-reverse' },
  'reverse-column': { layoutMode: 'VERTICAL', flexDirection: 'column-reverse' },
  'wrap': { layoutWrap: 'WRAP' },
  'no-wrap': { layoutWrap: 'NO_WRAP' },
  'reverse-wrap': { layoutWrap: 'WRAP_REVERSE' },
  
  // LAYOUT - Justify Content (Alinhamento principal)
  'justify-start': { primaryAxisAlignItems: 'MIN' },
  'justify-center': { primaryAxisAlignItems: 'CENTER' },
  'justify-end': { primaryAxisAlignItems: 'MAX' },
  'justify-between': { primaryAxisAlignItems: 'SPACE_BETWEEN' },
  'justify-around': { primaryAxisAlignItems: 'SPACE_AROUND' },
  'justify-evenly': { primaryAxisAlignItems: 'SPACE_EVENLY' },
  
  // LAYOUT - Align Items (Alinhamento cruzado)
  'items-start': { counterAxisAlignItems: 'MIN' },
  'items-center': { counterAxisAlignItems: 'CENTER' },
  'items-end': { counterAxisAlignItems: 'MAX' },
  'items-stretch': { counterAxisAlignItems: 'STRETCH' },
  'items-baseline': { counterAxisAlignItems: 'BASELINE' },
  
  // LAYOUT - Align Content
  'content-start': { counterAxisAlignContent: 'MIN' },
  'content-center': { counterAxisAlignContent: 'CENTER' },
  'content-end': { counterAxisAlignContent: 'MAX' },
  'content-between': { counterAxisAlignContent: 'SPACE_BETWEEN' },
  'content-around': { counterAxisAlignContent: 'SPACE_AROUND' },
  'content-stretch': { counterAxisAlignContent: 'STRETCH' },
  
  // LAYOUT - Self Alignment
  'self-start': { alignSelf: 'MIN' },
  'self-center': { alignSelf: 'CENTER' },
  'self-end': { alignSelf: 'MAX' },
  'self-stretch': { alignSelf: 'STRETCH' },
  'self-baseline': { alignSelf: 'BASELINE' },
  
  // ESPAÇAMENTO - Padding (todas as direções)
  'q-pa-none': { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
  'q-pa-xs': { paddingTop: 4, paddingRight: 4, paddingBottom: 4, paddingLeft: 4 },
  'q-pa-sm': { paddingTop: 8, paddingRight: 8, paddingBottom: 8, paddingLeft: 8 },
  'q-pa-md': { paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16 },
  'q-pa-lg': { paddingTop: 24, paddingRight: 24, paddingBottom: 24, paddingLeft: 24 },
  'q-pa-xl': { paddingTop: 32, paddingRight: 32, paddingBottom: 32, paddingLeft: 32 },
  
  // ESPAÇAMENTO - Margem (todas as direções)
  'q-ma-none': { marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0 },
  'q-ma-xs': { marginTop: 4, marginRight: 4, marginBottom: 4, marginLeft: 4 },
  'q-ma-sm': { marginTop: 8, marginRight: 8, marginBottom: 8, marginLeft: 8 },
  'q-ma-md': { marginTop: 16, marginRight: 16, marginBottom: 16, marginLeft: 16 },
  'q-ma-lg': { marginTop: 24, marginRight: 24, marginBottom: 24, marginLeft: 24 },
  'q-ma-xl': { marginTop: 32, marginRight: 32, marginBottom: 32, marginLeft: 32 },
  
  // ESPAÇAMENTO - Padding específico por direção
  'q-pt-none': { paddingTop: 0 },
  'q-pt-xs': { paddingTop: 4 },
  'q-pt-sm': { paddingTop: 8 },
  'q-pt-md': { paddingTop: 16 },
  'q-pt-lg': { paddingTop: 24 },
  'q-pt-xl': { paddingTop: 32 },
  
  'q-pr-none': { paddingRight: 0 },
  'q-pr-xs': { paddingRight: 4 },
  'q-pr-sm': { paddingRight: 8 },
  'q-pr-md': { paddingRight: 16 },
  'q-pr-lg': { paddingRight: 24 },
  'q-pr-xl': { paddingRight: 32 },
  
  'q-pb-none': { paddingBottom: 0 },
  'q-pb-xs': { paddingBottom: 4 },
  'q-pb-sm': { paddingBottom: 8 },
  'q-pb-md': { paddingBottom: 16 },
  'q-pb-lg': { paddingBottom: 24 },
  'q-pb-xl': { paddingBottom: 32 },
  
  'q-pl-none': { paddingLeft: 0 },
  'q-pl-xs': { paddingLeft: 4 },
  'q-pl-sm': { paddingLeft: 8 },
  'q-pl-md': { paddingLeft: 16 },
  'q-pl-lg': { paddingLeft: 24 },
  'q-pl-xl': { paddingLeft: 32 },
  
  // ESPAÇAMENTO - Padding por eixo
  'q-px-none': { paddingLeft: 0, paddingRight: 0 },
  'q-px-xs': { paddingLeft: 4, paddingRight: 4 },
  'q-px-sm': { paddingLeft: 8, paddingRight: 8 },
  'q-px-md': { paddingLeft: 16, paddingRight: 16 },
  'q-px-lg': { paddingLeft: 24, paddingRight: 24 },
  'q-px-xl': { paddingLeft: 32, paddingRight: 32 },
  
  'q-py-none': { paddingTop: 0, paddingBottom: 0 },
  'q-py-xs': { paddingTop: 4, paddingBottom: 4 },
  'q-py-sm': { paddingTop: 8, paddingBottom: 8 },
  'q-py-md': { paddingTop: 16, paddingBottom: 16 },
  'q-py-lg': { paddingTop: 24, paddingBottom: 24 },
  'q-py-xl': { paddingTop: 32, paddingBottom: 32 },
  
  // ESPAÇAMENTO - Margem específica por direção
  'q-mt-none': { marginTop: 0 },
  'q-mt-xs': { marginTop: 4 },
  'q-mt-sm': { marginTop: 8 },
  'q-mt-md': { marginTop: 16 },
  'q-mt-lg': { marginTop: 24 },
  'q-mt-xl': { marginTop: 32 },
  
  'q-mr-none': { marginRight: 0 },
  'q-mr-xs': { marginRight: 4 },
  'q-mr-sm': { marginRight: 8 },
  'q-mr-md': { marginRight: 16 },
  'q-mr-lg': { marginRight: 24 },
  'q-mr-xl': { marginRight: 32 },
  
  'q-mb-none': { marginBottom: 0 },
  'q-mb-xs': { marginBottom: 4 },
  'q-mb-sm': { marginBottom: 8 },
  'q-mb-md': { marginBottom: 16 },
  'q-mb-lg': { marginBottom: 24 },
  'q-mb-xl': { marginBottom: 32 },
  
  'q-ml-none': { marginLeft: 0 },
  'q-ml-xs': { marginLeft: 4 },
  'q-ml-sm': { marginLeft: 8 },
  'q-ml-md': { marginLeft: 16 },
  'q-ml-lg': { marginLeft: 24 },
  'q-ml-xl': { marginLeft: 32 },
  
  // ESPAÇAMENTO - Margem por eixo
  'q-mx-none': { marginLeft: 0, marginRight: 0 },
  'q-mx-xs': { marginLeft: 4, marginRight: 4 },
  'q-mx-sm': { marginLeft: 8, marginRight: 8 },
  'q-mx-md': { marginLeft: 16, marginRight: 16 },
  'q-mx-lg': { marginLeft: 24, marginRight: 24 },
  'q-mx-xl': { marginLeft: 32, marginRight: 32 },
  
  'q-my-none': { marginTop: 0, marginBottom: 0 },
  'q-my-xs': { marginTop: 4, marginBottom: 4 },
  'q-my-sm': { marginTop: 8, marginBottom: 8 },
  'q-my-md': { marginTop: 16, marginBottom: 16 },
  'q-my-lg': { marginTop: 24, marginBottom: 24 },
  'q-my-xl': { marginTop: 32, marginBottom: 32 },
  
  // TIPOGRAFIA - Títulos
  'text-h1': { fontSize: 48, fontWeight: 700, letterSpacing: -1.5 },
  'text-h2': { fontSize: 36, fontWeight: 700, letterSpacing: -0.5 },
  'text-h3': { fontSize: 30, fontWeight: 600, letterSpacing: 0 },
  'text-h4': { fontSize: 24, fontWeight: 600, letterSpacing: 0.25 },
  'text-h5': { fontSize: 20, fontWeight: 500, letterSpacing: 0 },
  'text-h6': { fontSize: 16, fontWeight: 500, letterSpacing: 0.15 },
  
  // TIPOGRAFIA - Subtítulos e Corpo
  'text-subtitle1': { fontSize: 16, fontWeight: 400, letterSpacing: 0.15 },
  'text-subtitle2': { fontSize: 14, fontWeight: 500, letterSpacing: 0.1 },
  'text-body1': { fontSize: 16, fontWeight: 400, letterSpacing: 0.5 },
  'text-body2': { fontSize: 14, fontWeight: 400, letterSpacing: 0.25 },
  'text-caption': { fontSize: 12, fontWeight: 400, letterSpacing: 0.4 },
  'text-overline': { fontSize: 10, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase' },
  
  // TIPOGRAFIA - Alinhamento
  'text-left': { textAlignHorizontal: 'LEFT' },
  'text-center': { textAlignHorizontal: 'CENTER' },
  'text-right': { textAlignHorizontal: 'RIGHT' },
  'text-justify': { textAlignHorizontal: 'JUSTIFIED' },
  
  // TIPOGRAFIA - Peso
  'text-weight-thin': { fontWeight: 100 },
  'text-weight-light': { fontWeight: 300 },
  'text-weight-regular': { fontWeight: 400 },
  'text-weight-medium': { fontWeight: 500 },
  'text-weight-bold': { fontWeight: 700 },
  'text-weight-bolder': { fontWeight: 900 },
  
  // CORES - Texto
  'text-primary': { fills: [{ type: 'SOLID', color: quasarColors.primary }] },
  'text-secondary': { fills: [{ type: 'SOLID', color: quasarColors.secondary }] },
  'text-accent': { fills: [{ type: 'SOLID', color: quasarColors.accent }] },
  'text-positive': { fills: [{ type: 'SOLID', color: quasarColors.positive }] },
  'text-negative': { fills: [{ type: 'SOLID', color: quasarColors.negative }] },
  'text-info': { fills: [{ type: 'SOLID', color: quasarColors.info }] },
  'text-warning': { fills: [{ type: 'SOLID', color: quasarColors.warning }] },
  'text-white': { fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }] },
  'text-black': { fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }] },
  
  // CORES - Background
  'bg-primary': { fills: [{ type: 'SOLID', color: quasarColors.primary }] },
  'bg-secondary': { fills: [{ type: 'SOLID', color: quasarColors.secondary }] },
  'bg-accent': { fills: [{ type: 'SOLID', color: quasarColors.accent }] },
  'bg-positive': { fills: [{ type: 'SOLID', color: quasarColors.positive }] },
  'bg-negative': { fills: [{ type: 'SOLID', color: quasarColors.negative }] },
  'bg-info': { fills: [{ type: 'SOLID', color: quasarColors.info }] },
  'bg-warning': { fills: [{ type: 'SOLID', color: quasarColors.warning }] },
  'bg-white': { fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }] },
  'bg-black': { fills: [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }] },
  
  // VISIBILIDADE
  'hidden': { visible: false },
  'invisible': { opacity: 0 },
  'visible': { visible: true, opacity: 1 },
  
  // RESPONSIVIDADE - Greater Than
  'gt-xs': { constraints: { horizontal: 'MIN', vertical: 'MIN' } },
  'gt-sm': { constraints: { horizontal: 'MIN', vertical: 'MIN' } },
  'gt-md': { constraints: { horizontal: 'MIN', vertical: 'MIN' } },
  'gt-lg': { constraints: { horizontal: 'MIN', vertical: 'MIN' } },
  'gt-xl': { constraints: { horizontal: 'MIN', vertical: 'MIN' } },
  
  // RESPONSIVIDADE - Less Than
  'lt-sm': { constraints: { horizontal: 'MAX', vertical: 'MAX' } },
  'lt-md': { constraints: { horizontal: 'MAX', vertical: 'MAX' } },
  'lt-lg': { constraints: { horizontal: 'MAX', vertical: 'MAX' } },
  'lt-xl': { constraints: { horizontal: 'MAX', vertical: 'MAX' } },
  
  // DIMENSÕES
  'full-width': { width: '100%', constraints: { horizontal: 'STRETCH' } },
  'full-height': { height: '100%', constraints: { vertical: 'STRETCH' } },
  'fit': { primaryAxisSizingMode: 'AUTO', counterAxisSizingMode: 'AUTO' },
  
  // SOMBRAS
  'shadow-1': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 1 }, radius: 2, visible: true, blendMode: 'NORMAL' }] },
  'shadow-2': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 2 }, radius: 4, visible: true, blendMode: 'NORMAL' }] },
  'shadow-3': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 3 }, radius: 6, visible: true, blendMode: 'NORMAL' }] },
  'shadow-4': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 4 }, radius: 8, visible: true, blendMode: 'NORMAL' }] },
  'shadow-5': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 5 }, radius: 10, visible: true, blendMode: 'NORMAL' }] },
  'shadow-6': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 6 }, radius: 12, visible: true, blendMode: 'NORMAL' }] },
  'shadow-8': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 8 }, radius: 16, visible: true, blendMode: 'NORMAL' }] },
  'shadow-10': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 10 }, radius: 20, visible: true, blendMode: 'NORMAL' }] },
  'shadow-12': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 12 }, radius: 24, visible: true, blendMode: 'NORMAL' }] },
  'shadow-16': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 16 }, radius: 32, visible: true, blendMode: 'NORMAL' }] },
  'shadow-24': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: 24 }, radius: 48, visible: true, blendMode: 'NORMAL' }] },
  
  // SOMBRAS - Up
  'shadow-up-1': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -1 }, radius: 2, visible: true, blendMode: 'NORMAL' }] },
  'shadow-up-2': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -2 }, radius: 4, visible: true, blendMode: 'NORMAL' }] },
  'shadow-up-3': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -3 }, radius: 6, visible: true, blendMode: 'NORMAL' }] },
  'shadow-up-4': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -4 }, radius: 8, visible: true, blendMode: 'NORMAL' }] },
  'shadow-up-5': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -5 }, radius: 10, visible: true, blendMode: 'NORMAL' }] },
  'shadow-up-6': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -6 }, radius: 12, visible: true, blendMode: 'NORMAL' }] },
  'shadow-up-8': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -8 }, radius: 16, visible: true, blendMode: 'NORMAL' }] },
  'shadow-up-10': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -10 }, radius: 20, visible: true, blendMode: 'NORMAL' }] },
  'shadow-up-12': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -12 }, radius: 24, visible: true, blendMode: 'NORMAL' }] },
  'shadow-up-16': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -16 }, radius: 32, visible: true, blendMode: 'NORMAL' }] },
  'shadow-up-24': { effects: [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.2 }, offset: { x: 0, y: -24 }, radius: 48, visible: true, blendMode: 'NORMAL' }] },
  
  // BORDAS
  'rounded-borders': { cornerRadius: 4 },
  'rounded-borders-sm': { cornerRadius: 2 },
  'rounded-borders-md': { cornerRadius: 6 },
  'rounded-borders-lg': { cornerRadius: 8 },
  'rounded-borders-xl': { cornerRadius: 12 },
  'round-borders': { cornerRadius: 9999 }, // Para criar círculos perfeitos
  'no-border': { strokes: [] },
  'no-border-radius': { cornerRadius: 0 },
  
  // GUTTER (Espaçamento entre elementos)
  'q-gutter-none': { itemSpacing: 0 },
  'q-gutter-xs': { itemSpacing: 4 },
  'q-gutter-sm': { itemSpacing: 8 },
  'q-gutter-md': { itemSpacing: 16 },
  'q-gutter-lg': { itemSpacing: 24 },
  'q-gutter-xl': { itemSpacing: 32 },
  
  'q-gutter-x-none': { itemSpacingX: 0 },
  'q-gutter-x-xs': { itemSpacingX: 4 },
  'q-gutter-x-sm': { itemSpacingX: 8 },
  'q-gutter-x-md': { itemSpacingX: 16 },
  'q-gutter-x-lg': { itemSpacingX: 24 },
  'q-gutter-x-xl': { itemSpacingX: 32 },
  
  'q-gutter-y-none': { itemSpacingY: 0 },
  'q-gutter-y-xs': { itemSpacingY: 4 },
  'q-gutter-y-sm': { itemSpacingY: 8 },
  'q-gutter-y-md': { itemSpacingY: 16 },
  'q-gutter-y-lg': { itemSpacingY: 24 },
  'q-gutter-y-xl': { itemSpacingY: 32 },
  
  // CORES ADICIONAIS (Material Design)
  'text-red': { fills: [{ type: 'SOLID', color: quasarColors.red }] },
  'text-pink': { fills: [{ type: 'SOLID', color: quasarColors.pink }] },
  'text-purple': { fills: [{ type: 'SOLID', color: quasarColors.purple }] },
  'text-deep-purple': { fills: [{ type: 'SOLID', color: quasarColors['deep-purple'] }] },
  'text-indigo': { fills: [{ type: 'SOLID', color: quasarColors.indigo }] },
  'text-blue': { fills: [{ type: 'SOLID', color: quasarColors.blue }] },
  'text-light-blue': { fills: [{ type: 'SOLID', color: quasarColors['light-blue'] }] },
  'text-cyan': { fills: [{ type: 'SOLID', color: quasarColors.cyan }] },
  'text-teal': { fills: [{ type: 'SOLID', color: quasarColors.teal }] },
  'text-green': { fills: [{ type: 'SOLID', color: quasarColors.green }] },
  'text-light-green': { fills: [{ type: 'SOLID', color: quasarColors['light-green'] }] },
  'text-lime': { fills: [{ type: 'SOLID', color: quasarColors.lime }] },
  'text-yellow': { fills: [{ type: 'SOLID', color: quasarColors.yellow }] },
  'text-amber': { fills: [{ type: 'SOLID', color: quasarColors.amber }] },
  'text-orange': { fills: [{ type: 'SOLID', color: quasarColors.orange }] },
  'text-deep-orange': { fills: [{ type: 'SOLID', color: quasarColors['deep-orange'] }] },
  'text-brown': { fills: [{ type: 'SOLID', color: quasarColors.brown }] },
  'text-grey': { fills: [{ type: 'SOLID', color: quasarColors.grey }] },
  'text-blue-grey': { fills: [{ type: 'SOLID', color: quasarColors['blue-grey'] }] },
  
  'bg-red': { fills: [{ type: 'SOLID', color: quasarColors.red }] },
  'bg-pink': { fills: [{ type: 'SOLID', color: quasarColors.pink }] },
  'bg-purple': { fills: [{ type: 'SOLID', color: quasarColors.purple }] },
  'bg-deep-purple': { fills: [{ type: 'SOLID', color: quasarColors['deep-purple'] }] },
  'bg-indigo': { fills: [{ type: 'SOLID', color: quasarColors.indigo }] },
  'bg-blue': { fills: [{ type: 'SOLID', color: quasarColors.blue }] },
  'bg-light-blue': { fills: [{ type: 'SOLID', color: quasarColors['light-blue'] }] },
  'bg-cyan': { fills: [{ type: 'SOLID', color: quasarColors.cyan }] },
  'bg-teal': { fills: [{ type: 'SOLID', color: quasarColors.teal }] },
  'bg-green': { fills: [{ type: 'SOLID', color: quasarColors.green }] },
  'bg-light-green': { fills: [{ type: 'SOLID', color: quasarColors['light-green'] }] },
  'bg-lime': { fills: [{ type: 'SOLID', color: quasarColors.lime }] },
  'bg-yellow': { fills: [{ type: 'SOLID', color: quasarColors.yellow }] },
  'bg-amber': { fills: [{ type: 'SOLID', color: quasarColors.amber }] },
  'bg-orange': { fills: [{ type: 'SOLID', color: quasarColors.orange }] },
  'bg-deep-orange': { fills: [{ type: 'SOLID', color: quasarColors['deep-orange'] }] },
  'bg-brown': { fills: [{ type: 'SOLID', color: quasarColors.brown }] },
  'bg-grey': { fills: [{ type: 'SOLID', color: quasarColors.grey }] },
  'bg-blue-grey': { fills: [{ type: 'SOLID', color: quasarColors['blue-grey'] }] },
  
  // CLASSES UTILITÁRIAS ADICIONAIS
  'text-uppercase': { textCase: 'UPPER' },
  'text-lowercase': { textCase: 'LOWER' },
  'text-capitalize': { textCase: 'TITLE' },
  'text-no-wrap': { textAutoResize: 'WIDTH_AND_HEIGHT' },
  'text-italic': { fontStyle: 'italic' },
  'text-strike': { textDecoration: 'STRIKETHROUGH' },
  'text-underline': { textDecoration: 'UNDERLINE' },
  
  // DISPLAY
  'inline': { layoutMode: 'HORIZONTAL', primaryAxisSizingMode: 'AUTO' },
  'inline-block': { layoutMode: 'HORIZONTAL', primaryAxisSizingMode: 'AUTO' },
  'block': { layoutMode: 'VERTICAL', primaryAxisSizingMode: 'FIXED', counterAxisSizingMode: 'FIXED' },
  'flex': { layoutMode: 'VERTICAL' },
  'inline-flex': { layoutMode: 'HORIZONTAL', primaryAxisSizingMode: 'AUTO' },
  
  // POSITION
  'absolute': { constraints: { horizontal: 'MIN', vertical: 'MIN' }, positioning: 'ABSOLUTE' },
  'relative': { positioning: 'RELATIVE' },
  'fixed': { constraints: { horizontal: 'SCALE', vertical: 'SCALE' } },
  
  // OVERFLOW
  'overflow-auto': { clipsContent: true },
  'overflow-hidden': { clipsContent: true },
  'overflow-visible': { clipsContent: false },
  
  // OPACITY
  'opacity-25': { opacity: 0.25 },
  'opacity-50': { opacity: 0.5 },
  'opacity-75': { opacity: 0.75 },
  'opacity-100': { opacity: 1 },
  
  // BORDAS INDIVIDUAIS
  'border-top': { strokeTopWeight: 1, strokes: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }] },
  'border-right': { strokeRightWeight: 1, strokes: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }] },
  'border-bottom': { strokeBottomWeight: 1, strokes: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }] },
  'border-left': { strokeLeftWeight: 1, strokes: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }] },
  
  // Z-INDEX
  'z-fab': { zIndex: 999 },
  'z-side': { zIndex: 1000 },
  'z-marginals': { zIndex: 2000 },
  'z-fixed-drawer': { zIndex: 3000 },
  'z-fullscreen': { zIndex: 6000 },
  'z-menu': { zIndex: 7000 },
  'z-top': { zIndex: 7100 },
  'z-tooltip': { zIndex: 9000 },
  'z-notify': { zIndex: 9500 },
  'z-max': { zIndex: 9998 },
  
  // CURSOR
  'cursor-pointer': { cursor: 'pointer' },
  'cursor-not-allowed': { cursor: 'not-allowed' },
  'cursor-default': { cursor: 'default' },
  'cursor-inherit': { cursor: 'inherit' },
  'cursor-none': { cursor: 'none' },
  
  // ESPAÇAMENTO AUTO
  'q-mx-auto': { marginLeft: 'auto', marginRight: 'auto' },
  'q-my-auto': { marginTop: 'auto', marginBottom: 'auto' },
  'q-ml-auto': { marginLeft: 'auto' },
  'q-mr-auto': { marginRight: 'auto' },
  'q-mt-auto': { marginTop: 'auto' },
  'q-mb-auto': { marginBottom: 'auto' },
  
  // ROTAÇÃO
  'rotate-45': { rotation: 45 },
  'rotate-90': { rotation: 90 },
  'rotate-135': { rotation: 135 },
  'rotate-180': { rotation: 180 },
  'rotate-225': { rotation: 225 },
  'rotate-270': { rotation: 270 },
  'rotate-315': { rotation: 315 },
  
  // FLIP
  'flip-horizontal': { scaleX: -1 },
  'flip-vertical': { scaleY: -1 },
  
  // OVERFLOW TEXT
  'ellipsis': { 
    textTruncation: 'ENDING',
    maxLines: 1,
    textAutoResize: 'TRUNCATE'
  },
  'ellipsis-2-lines': { 
    textTruncation: 'ENDING',
    maxLines: 2,
    textAutoResize: 'TRUNCATE'
  },
  'ellipsis-3-lines': { 
    textTruncation: 'ENDING',
    maxLines: 3,
    textAutoResize: 'TRUNCATE'
  },
  
  // CENTRALIZAÇÃO
  'absolute-center': { 
    constraints: { horizontal: 'CENTER', vertical: 'CENTER' },
    positioning: 'ABSOLUTE'
  },
  'absolute-full': { 
    constraints: { horizontal: 'STRETCH', vertical: 'STRETCH' },
    positioning: 'ABSOLUTE'
  },
  'fixed-center': { 
    constraints: { horizontal: 'CENTER', vertical: 'CENTER' },
    positioning: 'FIXED'
  },
  'fixed-full': { 
    constraints: { horizontal: 'STRETCH', vertical: 'STRETCH' },
    positioning: 'FIXED'
  },
  
  // TAMANHO DE TEXTO RESPONSIVO
  'text-h1-responsive': { fontSize: 36, lineHeight: 1.2 },
  'text-h2-responsive': { fontSize: 30, lineHeight: 1.2 },
  'text-h3-responsive': { fontSize: 24, lineHeight: 1.2 },
  'text-h4-responsive': { fontSize: 20, lineHeight: 1.3 },
  'text-h5-responsive': { fontSize: 18, lineHeight: 1.3 },
  'text-h6-responsive': { fontSize: 16, lineHeight: 1.4 },
  
  // GRADIENTES DE TEXTO
  'text-gradient': { 
    fills: [{ 
      type: 'GRADIENT_LINEAR', 
      gradientTransform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: [
        { position: 0, color: quasarColors.primary },
        { position: 1, color: quasarColors.secondary }
      ]
    }] 
  }
};

// Função auxiliar para processar classes específicas de gutter
export function processGutterClass(className: string): Record<string, any> | null {
  const match = className.match(/^q-gutter-([x|y])?-?([a-z]+)$/);
  if (!match) return null;
  
  const [, direction, size] = match;
  const gutterSizes: Record<string, number> = {
    'none': 0,
    'xs': 4,
    'sm': 8,
    'md': 16,
    'lg': 24,
    'xl': 32
  };
  
  const gutterValue = gutterSizes[size] || 16;
  
  if (!direction) {
    return { itemSpacing: gutterValue };
  } else if (direction === 'x') {
    return { itemSpacingX: gutterValue };
  } else if (direction === 'y') {
    return { itemSpacingY: gutterValue };
  }
  
  return null;
}

// Função para processar classes com variações tonais
export function processTonalColorClass(className: string): Record<string, any> | null {
  const match = className.match(/^(text|bg)-([a-z-]+)(-\d+)?$/);
  if (!match) return null;
  
  const [, type, baseColor, tone] = match;
  let colorName = baseColor;
  
  if (tone) {
    colorName = `${baseColor}${tone}`;
  }
  
  if (!quasarColors[colorName]) return null;
  
  if (type === 'text') {
    return { fills: [{ type: 'SOLID', color: quasarColors[colorName] }] };
  } else if (type === 'bg') {
    return { fills: [{ type: 'SOLID', color: quasarColors[colorName] }] };
  }
  
  return null;
}

// Função para processar classes dinâmicas
export function processQuasarDynamicClass(className: string): Record<string, any> | null {
  // Primeiro tenta processar como classe estática
  if (quasarCssClasses[className]) {
    return quasarCssClasses[className];
  }
  
  // Tenta processar como classe de gutter
  const gutterResult = processGutterClass(className);
  if (gutterResult) return gutterResult;
  
  // Tenta processar como cor com variação tonal
  const tonalResult = processTonalColorClass(className);
  if (tonalResult) return tonalResult;
  
  // Tenta processar classes dinâmicas adicionais
  // Ex: text-[color]-[tone], bg-[color]-[tone]
  
  return null;
}

// Exportar função principal para uso em outros módulos
export default quasarCssClasses;