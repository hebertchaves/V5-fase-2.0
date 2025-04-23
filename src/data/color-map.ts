// Função auxiliar para gerar variações tonais
function generateTonalVariations(baseColor: RGB, baseName: string): Record<string, RGB> {
  const variations: Record<string, RGB> = {};
  
  // Gerar tons mais claros (1-5)
  for (let i = 1; i <= 5; i++) {
    const factor = 1 - (0.1 * (5 - i));
    const whiteAmount = 0.9 - (i * 0.1);
    
    variations[`${baseName}-${i}`] = {
      r: baseColor.r * factor + whiteAmount,
      g: baseColor.g * factor + whiteAmount,
      b: baseColor.b * factor + whiteAmount
    };
  }
  
  // Cor base (para o índice 6)
  variations[`${baseName}-6`] = {...baseColor};
  
  // Tom médio (para o índice 7)
  variations[`${baseName}-7`] = {
    r: baseColor.r * 0.9,
    g: baseColor.g * 0.9,
    b: baseColor.b * 0.9
  };
  
  // Gerar tons mais escuros (8-14)
  for (let i = 8; i <= 14; i++) {
    const factor = 0.9 - ((i - 8) * 0.1);
    
    variations[`${baseName}-${i}`] = {
      r: baseColor.r * factor,
      g: baseColor.g * factor,
      b: baseColor.b * factor
    };
  }
  
  return variations;
}

// Gerar todas as variações de cores principais do Quasar
function generateAllColorVariations(): Record<string, RGB> {
  const allColors: Record<string, RGB> = {
    
    // Cores principais
    'primary': { r: 0.1, g: 0.5, b: 0.9 },
    'secondary': { r: 0.15, g: 0.65, b: 0.6 },
    'accent': { r: 0.61, g: 0.15, b: 0.69 },
    'positive': { r: 0.13, g: 0.73, b: 0.27 },
    'negative': { r: 0.76, g: 0.0, b: 0.08 },
    'info': { r: 0.19, g: 0.8, b: 0.93 },
    'warning': { r: 0.95, g: 0.75, b: 0.22 },
    'dark': { r: 0.19, g: 0.19, b: 0.19 },
    'light': { r: 0.95, g: 0.95, b: 0.95 },

    // Cores base do Material Design
    'red': { r: 0.957, g: 0.263, b: 0.212 },        // #F44336
    'pink': { r: 0.914, g: 0.118, b: 0.388 },       // #E91E63
    'purple': { r: 0.612, g: 0.153, b: 0.69 },      // #9C27B0
    'deep-purple': { r: 0.404, g: 0.227, b: 0.718 }, // #673AB7
    'indigo': { r: 0.247, g: 0.318, b: 0.71 },      // #3F51B5
    'blue': { r: 0.129, g: 0.588, b: 0.953 },       // #2196F3
    'light-blue': { r: 0.012, g: 0.663, b: 0.957 }, // #03A9F4
    'cyan': { r: 0, g: 0.737, b: 0.831 },           // #00BCD4
    'teal': { r: 0, g: 0.588, b: 0.533 },           // #009688
    'green': { r: 0.298, g: 0.686, b: 0.314 },      // #4CAF50
    'light-green': { r: 0.545, g: 0.765, b: 0.29 }, // #8BC34A
    'lime': { r: 0.804, g: 0.863, b: 0.224 },       // #CDDC39
    'yellow': { r: 1, g: 0.922, b: 0.231 },         // #FFEB3B
    'amber': { r: 1, g: 0.757, b: 0.027 },          // #FFC107
    'orange': { r: 1, g: 0.596, b: 0 },             // #FF9800
    'deep-orange': { r: 1, g: 0.341, b: 0.133 },    // #FF5722
    'brown': { r: 0.475, g: 0.333, b: 0.282 },      // #795548
    'grey': { r: 0.62, g: 0.62, b: 0.62 },          // #9E9E9E
    'blue-grey': { r: 0.376, g: 0.49, b: 0.545 },    // #607D8B


          
  };
  
  // Gerar variações tonais para as cores principais
  const colorNames = ['primary', 'secondary', 'accent', 'positive', 'negative', 'info', 'warning', 'black', 'white','red', 'pink',];
  
  for (const colorName of colorNames) {
    const baseColor = allColors[colorName];
    const variations = generateTonalVariations(baseColor, colorName);
    
    // Adicionar variações ao mapa de cores
    Object.entries(variations).forEach(([name, color]) => {
      allColors[name] = color;
    });
  }
  
  return allColors;
}

// Exportar o mapa completo de cores
export const quasarColors: Record<string, RGB> = generateAllColorVariations();

// Cores adicionais do Material Design que o Quasar também suporta
export const materialColors: Record<string, RGB> = {
  'red': { r: 0.957, g: 0.263, b: 0.212 },
  'red-1': { r: 1.0, g: 0.898, b: 0.882 },
  'red-2': { r: 1.0, g: 0.8, b: 0.782 },
  'red-3': { r: 0.988, g: 0.733, b: 0.714 },
  'red-4': { r: 0.984, g: 0.686, b: 0.686 },
  'red-5': { r: 0.976, g: 0.639, b: 0.639 },
  'red-6': { r: 0.957, g: 0.576, b: 0.561 },
  'red-7': { r: 0.925, g: 0.475, b: 0.447 },
  'red-8': { r: 0.898, g: 0.384, b: 0.349 },
  'red-9': { r: 0.827, g: 0.255, b: 0.212 },
  'red-10': { r: 0.773, g: 0.161, b: 0.129 },
  'red-11': { r: 0.698, g: 0.133, b: 0.133 },
  'red-12': { r: 0.612, g: 0.153, b: 0.137 },
  'red-13': { r: 0.549, g: 0.133, b: 0.122 },
  'red-14': { r: 0.486, g: 0.122, b: 0.106 },
  
  'pink': { r: 0.914, g: 0.118, b: 0.388 },
  'purple': { r: 0.612, g: 0.153, b: 0.69 },
  'deep-purple': { r: 0.404, g: 0.227, b: 0.718 },
  'indigo': { r: 0.247, g: 0.318, b: 0.71 },
  'blue': { r: 0.129, g: 0.588, b: 0.953 },
  'light-blue': { r: 0.012, g: 0.663, b: 0.957 },
  'cyan': { r: 0, g: 0.737, b: 0.831 },
  'teal': { r: 0, g: 0.588, b: 0.533 },
  'green': { r: 0.298, g: 0.686, b: 0.314 },
  'light-green': { r: 0.545, g: 0.765, b: 0.29 },
  'lime': { r: 0.804, g: 0.863, b: 0.224 },
  'yellow': { r: 1, g: 0.922, b: 0.231 },
  'amber': { r: 1, g: 0.757, b: 0.027 },
  'orange': { r: 1, g: 0.596, b: 0 },
  'deep-orange': { r: 1, g: 0.341, b: 0.133 },
  'brown': { r: 0.475, g: 0.333, b: 0.282 },
  'blue-grey': { r: 0.376, g: 0.49, b: 0.545 }
};

// Adicionar variações tonais para todas as cores do Material Design
// Para simplificar, estou omitindo essas definições, mas elas seguiriam o padrão acima

// Mapeamento de classes CSS Quasar para propriedades Figma
export const quasarClassesMap: Record<string, Record<string, any>> = {
  // Margens
  'q-ma-none': { marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0 },
  'q-ma-xs': { marginTop: 4, marginRight: 4, marginBottom: 4, marginLeft: 4 },
  'q-ma-sm': { marginTop: 8, marginRight: 8, marginBottom: 8, marginLeft: 8 },
  'q-ma-md': { marginTop: 16, marginRight: 16, marginBottom: 16, marginLeft: 16 },
  'q-ma-lg': { marginTop: 24, marginRight: 24, marginBottom: 24, marginLeft: 24 },
  'q-ma-xl': { marginTop: 32, marginRight: 32, marginBottom: 32, marginLeft: 32 },
  
  // Padding
  'q-pa-none': { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
  'q-pa-xs': { paddingTop: 4, paddingRight: 4, paddingBottom: 4, paddingLeft: 4 },
  'q-pa-sm': { paddingTop: 8, paddingRight: 8, paddingBottom: 8, paddingLeft: 8 },
  'q-pa-md': { paddingTop: 16, paddingRight: 16, paddingBottom: 16, paddingLeft: 16 },
  'q-pa-lg': { paddingTop: 24, paddingRight: 24, paddingBottom: 24, paddingLeft: 24 },
  'q-pa-xl': { paddingTop: 32, paddingRight: 32, paddingBottom: 32, paddingLeft: 32 },
  
  // Classes de texto
  'text-h1': { fontSize: 48, fontWeight: 'bold', letterSpacing: -0.5 },
  'text-h2': { fontSize: 40, fontWeight: 'bold', letterSpacing: -0.4 },
  'text-h3': { fontSize: 34, fontWeight: 'bold', letterSpacing: -0.3 },
  'text-h4': { fontSize: 28, fontWeight: 'bold', letterSpacing: -0.2 },
  'text-h5': { fontSize: 24, fontWeight: 'bold', letterSpacing: -0.1 },
  'text-h6': { fontSize: 20, fontWeight: 'bold', letterSpacing: 0 },
  'text-subtitle1': { fontSize: 16, fontWeight: 'regular', letterSpacing: 0.15 },
  'text-subtitle2': { fontSize: 14, fontWeight: 'medium', letterSpacing: 0.1 },
  'text-body1': { fontSize: 16, fontWeight: 'regular', letterSpacing: 0.5 },
  'text-body2': { fontSize: 14, fontWeight: 'regular', letterSpacing: 0.25 },
  
  // Classes de alinhamento
  'text-left': { textAlignHorizontal: 'LEFT' },
  'text-right': { textAlignHorizontal: 'RIGHT' },
  'text-center': { textAlignHorizontal: 'CENTER' },
  'text-justify': { textAlignHorizontal: 'JUSTIFIED' },
  
  // Classes de flexbox
  'row': { layoutMode: 'HORIZONTAL' },
  'column': { layoutMode: 'VERTICAL' },
  'items-start': { counterAxisAlignItems: 'MIN' },
  'items-center': { counterAxisAlignItems: 'CENTER' },
  'items-end': { counterAxisAlignItems: 'MAX' },
  'justify-start': { primaryAxisAlignItems: 'MIN' },
  'justify-center': { primaryAxisAlignItems: 'CENTER' },
  'justify-end': { primaryAxisAlignItems: 'MAX' },
  'justify-between': { primaryAxisAlignItems: 'SPACE_BETWEEN' },
  'content-start': { counterAxisAlignContent: 'MIN' },
  'content-center': { counterAxisAlignContent: 'CENTER' },
  'content-end': { counterAxisAlignContent: 'MAX' }
};