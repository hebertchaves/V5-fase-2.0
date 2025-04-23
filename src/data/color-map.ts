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

    // PRIMARY (Azul #1976D2)
    'primary-1': { r: 0.886, g: 0.933, b: 0.98 },
    'primary-2': { r: 0.792, g: 0.886, b: 0.961 },
    'primary-3': { r: 0.698, g: 0.839, b: 0.941 },
    'primary-4': { r: 0.6, g: 0.788, b: 0.925 },
    'primary-5': { r: 0.51, g: 0.741, b: 0.906 },
    'primary-6': { r: 0.098, g: 0.463, b: 0.824 }, // Base color (#1976D2)
    'primary-7': { r: 0.09, g: 0.416, b: 0.741 },
    'primary-8': { r: 0.078, g: 0.376, b: 0.667 },
    'primary-9': { r: 0.067, g: 0.329, b: 0.588 },
    'primary-10': { r: 0.055, g: 0.278, b: 0.51 },
    'primary-11': { r: 0.047, g: 0.239, b: 0.435 },
    'primary-12': { r: 0.039, g: 0.196, b: 0.361 },
    'primary-13': { r: 0.031, g: 0.157, b: 0.29 },
    'primary-14': { r: 0.024, g: 0.118, b: 0.216 },

    // SECONDARY (Azul-petróleo #26A69A)
    'secondary-1': { r: 0.89, g: 0.961, b: 0.957 },
    'secondary-2': { r: 0.788, g: 0.925, b: 0.918 },
    'secondary-3': { r: 0.698, g: 0.894, b: 0.882 },
    'secondary-4': { r: 0.608, g: 0.863, b: 0.843 },
    'secondary-5': { r: 0.518, g: 0.827, b: 0.8 },
    'secondary-6': { r: 0.149, g: 0.651, b: 0.604 }, // Base color (#26A69A)
    'secondary-7': { r: 0.133, g: 0.588, b: 0.541 },
    'secondary-8': { r: 0.122, g: 0.525, b: 0.486 },
    'secondary-9': { r: 0.106, g: 0.463, b: 0.427 },
    'secondary-10': { r: 0.09, g: 0.4, b: 0.369 },
    'secondary-11': { r: 0.078, g: 0.345, b: 0.318 },
    'secondary-12': { r: 0.063, g: 0.29, b: 0.267 },
    'secondary-13': { r: 0.051, g: 0.235, b: 0.216 },
    'secondary-14': { r: 0.039, g: 0.18, b: 0.165 },

    // ACCENT (Roxo #9C27B0)
    'accent-1': { r: 0.957, g: 0.894, b: 0.961 },
    'accent-2': { r: 0.925, g: 0.812, b: 0.937 },
    'accent-3': { r: 0.894, g: 0.725, b: 0.91 },
    'accent-4': { r: 0.859, g: 0.639, b: 0.886 },
    'accent-5': { r: 0.827, g: 0.557, b: 0.859 },
    'accent-6': { r: 0.612, g: 0.153, b: 0.69 }, // Base color (#9C27B0)
    'accent-7': { r: 0.557, g: 0.137, b: 0.627 },
    'accent-8': { r: 0.506, g: 0.125, b: 0.565 },
    'accent-9': { r: 0.447, g: 0.11, b: 0.502 },
    'accent-10': { r: 0.388, g: 0.094, b: 0.435 },
    'accent-11': { r: 0.329, g: 0.082, b: 0.369 },
    'accent-12': { r: 0.275, g: 0.067, b: 0.31 },
    'accent-13': { r: 0.224, g: 0.055, b: 0.251 },
    'accent-14': { r: 0.173, g: 0.043, b: 0.192 },

    // POSITIVE (Verde #21BA45)
    'positive-1': { r: 0.89, g: 0.973, b: 0.902 },
    'positive-2': { r: 0.792, g: 0.949, b: 0.816 },
    'positive-3': { r: 0.706, g: 0.925, b: 0.741 },
    'positive-4': { r: 0.616, g: 0.902, b: 0.663 },
    'positive-5': { r: 0.529, g: 0.875, b: 0.588 },
    'positive-6': { r: 0.129, g: 0.729, b: 0.271 }, // Base color (#21BA45)
    'positive-7': { r: 0.118, g: 0.655, b: 0.243 },
    'positive-8': { r: 0.102, g: 0.588, b: 0.22 },
    'positive-9': { r: 0.09, g: 0.518, b: 0.192 },
    'positive-10': { r: 0.078, g: 0.451, b: 0.169 },
    'positive-11': { r: 0.067, g: 0.384, b: 0.145 },
    'positive-12': { r: 0.055, g: 0.322, b: 0.122 },
    'positive-13': { r: 0.043, g: 0.259, b: 0.098 },
    'positive-14': { r: 0.035, g: 0.196, b: 0.075 },

    // NEGATIVE (Vermelho #C10015)
    'negative-1': { r: 0.973, g: 0.886, b: 0.89 },
    'negative-2': { r: 0.949, g: 0.792, b: 0.8 },
    'negative-3': { r: 0.925, g: 0.706, b: 0.722 },
    'negative-4': { r: 0.902, g: 0.616, b: 0.639 },
    'negative-5': { r: 0.878, g: 0.529, b: 0.557 },
    'negative-6': { r: 0.757, g: 0.0, b: 0.082 }, // Base color (#C10015)
    'negative-7': { r: 0.682, g: 0.0, b: 0.075 },
    'negative-8': { r: 0.612, g: 0.0, b: 0.067 },
    'negative-9': { r: 0.541, g: 0.0, b: 0.059 },
    'negative-10': { r: 0.471, g: 0.0, b: 0.051 },
    'negative-11': { r: 0.4, g: 0.0, b: 0.043 },
    'negative-12': { r: 0.333, g: 0.0, b: 0.035 },
    'negative-13': { r: 0.267, g: 0.0, b: 0.031 },
    'negative-14': { r: 0.2, g: 0.0, b: 0.024 },

    // INFO (Azul claro #31CCEC)
    'info-1': { r: 0.894, g: 0.973, b: 0.984 },
    'info-2': { r: 0.816, g: 0.949, b: 0.969 },
    'info-3': { r: 0.741, g: 0.925, b: 0.957 },
    'info-4': { r: 0.667, g: 0.902, b: 0.945 },
    'info-5': { r: 0.592, g: 0.878, b: 0.929 },
    'info-6': { r: 0.192, g: 0.8, b: 0.925 }, // Base color (#31CCEC)
    'info-7': { r: 0.173, g: 0.722, b: 0.835 },
    'info-8': { r: 0.153, g: 0.647, b: 0.753 },
    'info-9': { r: 0.133, g: 0.573, b: 0.667 },
    'info-10': { r: 0.118, g: 0.494, b: 0.58 },
    'info-11': { r: 0.098, g: 0.424, b: 0.498 },
    'info-12': { r: 0.082, g: 0.353, b: 0.412 },
    'info-13': { r: 0.067, g: 0.282, b: 0.333 },
    'info-14': { r: 0.051, g: 0.216, b: 0.255 },

    // WARNING (Amarelo/Âmbar #F2C037)
    'warning-1': { r: 0.988, g: 0.969, b: 0.898 },
    'warning-2': { r: 0.98, g: 0.941, b: 0.812 },
    'warning-3': { r: 0.973, g: 0.914, b: 0.729 },
    'warning-4': { r: 0.965, g: 0.886, b: 0.647 },
    'warning-5': { r: 0.961, g: 0.859, b: 0.565 },
    'warning-6': { r: 0.949, g: 0.753, b: 0.216 }, // Base color (#F2C037)
    'warning-7': { r: 0.855, g: 0.678, b: 0.192 },
    'warning-8': { r: 0.769, g: 0.612, b: 0.173 },
    'warning-9': { r: 0.682, g: 0.541, b: 0.153 },
    'warning-10': { r: 0.592, g: 0.471, b: 0.133 },
    'warning-11': { r: 0.51, g: 0.404, b: 0.114 },
    'warning-12': { r: 0.424, g: 0.337, b: 0.094 },
    'warning-13': { r: 0.341, g: 0.271, b: 0.078 },
    'warning-14': { r: 0.259, g: 0.208, b: 0.059 },

    // DARK (#1D1D1D)
    'dark-1': { r: 0.886, g: 0.886, b: 0.886 },
    'dark-2': { r: 0.792, g: 0.792, b: 0.792 },
    'dark-3': { r: 0.706, g: 0.706, b: 0.706 },
    'dark-4': { r: 0.616, g: 0.616, b: 0.616 },
    'dark-5': { r: 0.529, g: 0.529, b: 0.529 },
    'dark-6': { r: 0.114, g: 0.114, b: 0.114 }, // Base color (#1D1D1D)
    'dark-7': { r: 0.102, g: 0.102, b: 0.102 },
    'dark-8': { r: 0.09, g: 0.09, b: 0.09 },
    'dark-9': { r: 0.078, g: 0.078, b: 0.078 },
    'dark-10': { r: 0.067, g: 0.067, b: 0.067 },
    'dark-11': { r: 0.059, g: 0.059, b: 0.059 },
    'dark-12': { r: 0.047, g: 0.047, b: 0.047 },
    'dark-13': { r: 0.039, g: 0.039, b: 0.039 },
    'dark-14': { r: 0.031, g: 0.031, b: 0.031 },
    
    // Cores neutras
    'white': { r: 1, g: 1, b: 1 },
    'black': { r: 0, g: 0, b: 0 },
    
    // RED
    'red-1': { r: 1.0, g: 0.898, b: 0.882 },
    'red-2': { r: 1.0, g: 0.8, b: 0.782 },
    'red-3': { r: 0.988, g: 0.733, b: 0.714 },
    'red-4': { r: 0.984, g: 0.686, b: 0.686 },
    'red-5': { r: 0.976, g: 0.639, b: 0.639 },
    'red-6': { r: 0.957, g: 0.263, b: 0.212 }, // Base color
    'red-7': { r: 0.925, g: 0.255, b: 0.212 },
    'red-8': { r: 0.898, g: 0.223, b: 0.173 },
    'red-9': { r: 0.827, g: 0.184, b: 0.149 },
    'red-10': { r: 0.773, g: 0.161, b: 0.129 },
    'red-11': { r: 0.718, g: 0.133, b: 0.133 },
    'red-12': { r: 0.651, g: 0.118, b: 0.118 },
    'red-13': { r: 0.549, g: 0.094, b: 0.094 },
    'red-14': { r: 0.486, g: 0.078, b: 0.078 },

    // PINK
    'pink-1': { r: 0.988, g: 0.894, b: 0.925 },
    'pink-2': { r: 0.976, g: 0.792, b: 0.863 },
    'pink-3': { r: 0.969, g: 0.733, b: 0.824 },
    'pink-4': { r: 0.957, g: 0.678, b: 0.788 },
    'pink-5': { r: 0.945, g: 0.608, b: 0.753 },
    'pink-6': { r: 0.914, g: 0.118, b: 0.388 }, // Base color
    'pink-7': { r: 0.851, g: 0.106, b: 0.376 },
    'pink-8': { r: 0.792, g: 0.094, b: 0.353 },
    'pink-9': { r: 0.725, g: 0.071, b: 0.329 },
    'pink-10': { r: 0.667, g: 0.055, b: 0.306 },
    'pink-11': { r: 0.608, g: 0.047, b: 0.282 },
    'pink-12': { r: 0.533, g: 0.035, b: 0.247 },
    'pink-13': { r: 0.459, g: 0.024, b: 0.212 },
    'pink-14': { r: 0.384, g: 0.016, b: 0.176 },

    // PURPLE
    'purple-1': { r: 0.929, g: 0.906, b: 0.965 },
    'purple-2': { r: 0.882, g: 0.839, b: 0.937 },
    'purple-3': { r: 0.847, g: 0.776, b: 0.914 },
    'purple-4': { r: 0.792, g: 0.71, b: 0.882 },
    'purple-5': { r: 0.741, g: 0.647, b: 0.859 },
    'purple-6': { r: 0.612, g: 0.153, b: 0.69 }, // Base color
    'purple-7': { r: 0.569, g: 0.122, b: 0.655 },
    'purple-8': { r: 0.522, g: 0.102, b: 0.62 },
    'purple-9': { r: 0.482, g: 0.078, b: 0.584 },
    'purple-10': { r: 0.447, g: 0.063, b: 0.549 },
    'purple-11': { r: 0.416, g: 0.047, b: 0.514 },
    'purple-12': { r: 0.376, g: 0.039, b: 0.463 },
    'purple-13': { r: 0.329, g: 0.031, b: 0.404 },
    'purple-14': { r: 0.282, g: 0.024, b: 0.345 },

    // DEEP PURPLE
    'deep-purple-1': { r: 0.929, g: 0.906, b: 0.965 },
    'deep-purple-2': { r: 0.871, g: 0.831, b: 0.941 },
    'deep-purple-3': { r: 0.824, g: 0.769, b: 0.918 },
    'deep-purple-4': { r: 0.776, g: 0.698, b: 0.894 },
    'deep-purple-5': { r: 0.729, g: 0.635, b: 0.871 },
    'deep-purple-6': { r: 0.404, g: 0.227, b: 0.718 }, // Base color
    'deep-purple-7': { r: 0.369, g: 0.208, b: 0.698 },
    'deep-purple-8': { r: 0.341, g: 0.188, b: 0.682 },
    'deep-purple-9': { r: 0.302, g: 0.165, b: 0.667 },
    'deep-purple-10': { r: 0.263, g: 0.141, b: 0.651 },
    'deep-purple-11': { r: 0.224, g: 0.118, b: 0.635 },
    'deep-purple-12': { r: 0.18, g: 0.094, b: 0.612 },
    'deep-purple-13': { r: 0.141, g: 0.071, b: 0.592 },
    'deep-purple-14': { r: 0.102, g: 0.047, b: 0.576 },

    // INDIGO
    'indigo-1': { r: 0.91, g: 0.914, b: 0.953 },
    'indigo-2': { r: 0.835, g: 0.847, b: 0.922 },
    'indigo-3': { r: 0.773, g: 0.792, b: 0.894 },
    'indigo-4': { r: 0.706, g: 0.733, b: 0.867 },
    'indigo-5': { r: 0.647, g: 0.682, b: 0.839 },
    'indigo-6': { r: 0.247, g: 0.318, b: 0.71 }, // Base color
    'indigo-7': { r: 0.224, g: 0.286, b: 0.671 },
    'indigo-8': { r: 0.2, g: 0.255, b: 0.635 },
    'indigo-9': { r: 0.173, g: 0.224, b: 0.6 },
    'indigo-10': { r: 0.149, g: 0.196, b: 0.565 },
    'indigo-11': { r: 0.125, g: 0.169, b: 0.533 },
    'indigo-12': { r: 0.102, g: 0.141, b: 0.494 },
    'indigo-13': { r: 0.082, g: 0.118, b: 0.463 },
    'indigo-14': { r: 0.059, g: 0.094, b: 0.42 },

    // BLUE
    'blue-1': { r: 0.867, g: 0.922, b: 0.965 },
    'blue-2': { r: 0.769, g: 0.867, b: 0.949 },
    'blue-3': { r: 0.698, g: 0.824, b: 0.937 },
    'blue-4': { r: 0.627, g: 0.776, b: 0.925 },
    'blue-5': { r: 0.549, g: 0.733, b: 0.914 },
    'blue-6': { r: 0.129, g: 0.588, b: 0.953 }, // Base color
    'blue-7': { r: 0.118, g: 0.533, b: 0.898 },
    'blue-8': { r: 0.102, g: 0.478, b: 0.847 },
    'blue-9': { r: 0.082, g: 0.396, b: 0.753 },
    'blue-10': { r: 0.063, g: 0.318, b: 0.667 },
    'blue-11': { r: 0.051, g: 0.278, b: 0.631 },
    'blue-12': { r: 0.039, g: 0.235, b: 0.6 },
    'blue-13': { r: 0.031, g: 0.2, b: 0.565 },
    'blue-14': { r: 0.024, g: 0.161, b: 0.529 },

    // LIGHT BLUE
    'light-blue-1': { r: 0.882, g: 0.961, b: 0.996 },
    'light-blue-2': { r: 0.733, g: 0.898, b: 0.984 },
    'light-blue-3': { r: 0.624, g: 0.867, b: 0.98 },
    'light-blue-4': { r: 0.506, g: 0.831, b: 0.973 },
    'light-blue-5': { r: 0.427, g: 0.808, b: 0.969 },
    'light-blue-6': { r: 0.012, g: 0.663, b: 0.957 }, // Base color
    'light-blue-7': { r: 0.012, g: 0.608, b: 0.898 },
    'light-blue-8': { r: 0.008, g: 0.549, b: 0.835 },
    'light-blue-9': { r: 0.008, g: 0.475, b: 0.741 },
    'light-blue-10': { r: 0.008, g: 0.404, b: 0.651 },
    'light-blue-11': { r: 0.004, g: 0.341, b: 0.561 },
    'light-blue-12': { r: 0.004, g: 0.278, b: 0.475 },
    'light-blue-13': { r: 0.004, g: 0.216, b: 0.384 },
    'light-blue-14': { r: 0.004, g: 0.161, b: 0.298 },

    // CYAN
    'cyan-1': { r: 0.878, g: 0.969, b: 0.98 },
    'cyan-2': { r: 0.733, g: 0.925, b: 0.949 },
    'cyan-3': { r: 0.612, g: 0.894, b: 0.929 },
    'cyan-4': { r: 0.494, g: 0.859, b: 0.906 },
    'cyan-5': { r: 0.392, g: 0.827, b: 0.886 },
    'cyan-6': { r: 0.0, g: 0.737, b: 0.831 }, // Base color
    'cyan-7': { r: 0.0, g: 0.678, b: 0.776 },
    'cyan-8': { r: 0.0, g: 0.616, b: 0.714 },
    'cyan-9': { r: 0.0, g: 0.541, b: 0.639 },
    'cyan-10': { r: 0.0, g: 0.475, b: 0.565 },
    'cyan-11': { r: 0.0, g: 0.42, b: 0.502 },
    'cyan-12': { r: 0.0, g: 0.369, b: 0.443 },
    'cyan-13': { r: 0.0, g: 0.318, b: 0.384 },
    'cyan-14': { r: 0.0, g: 0.275, b: 0.329 },

    // TEAL
    'teal-1': { r: 0.878, g: 0.949, b: 0.945 },
    'teal-2': { r: 0.761, g: 0.898, b: 0.886 },
    'teal-3': { r: 0.655, g: 0.855, b: 0.835 },
    'teal-4': { r: 0.553, g: 0.808, b: 0.784 },
    'teal-5': { r: 0.459, g: 0.765, b: 0.737 },
    'teal-6': { r: 0.0, g: 0.588, b: 0.533 }, // Base color
    'teal-7': { r: 0.0, g: 0.533, b: 0.482 },
    'teal-8': { r: 0.0, g: 0.475, b: 0.42 },
    'teal-9': { r: 0.0, g: 0.408, b: 0.365 },
    'teal-10': { r: 0.0, g: 0.349, b: 0.31 },
    'teal-11': { r: 0.0, g: 0.302, b: 0.263 },
    'teal-12': { r: 0.0, g: 0.255, b: 0.22 },
    'teal-13': { r: 0.0, g: 0.208, b: 0.176 },
    'teal-14': { r: 0.0, g: 0.161, b: 0.137 },

    // GREEN
    'green-1': { r: 0.878, g: 0.969, b: 0.882 },
    'green-2': { r: 0.769, g: 0.941, b: 0.78 },
    'green-3': { r: 0.667, g: 0.902, b: 0.682 },
    'green-4': { r: 0.565, g: 0.867, b: 0.584 },
    'green-5': { r: 0.463, g: 0.827, b: 0.49 },
    'green-6': { r: 0.298, g: 0.686, b: 0.314 }, // Base color
    'green-7': { r: 0.263, g: 0.627, b: 0.278 },
    'green-8': { r: 0.231, g: 0.569, b: 0.247 },
    'green-9': { r: 0.2, g: 0.494, b: 0.212 },
    'green-10': { r: 0.18, g: 0.431, b: 0.188 },
    'green-11': { r: 0.153, g: 0.38, b: 0.157 },
    'green-12': { r: 0.129, g: 0.329, b: 0.133 },
    'green-13': { r: 0.102, g: 0.278, b: 0.106 },
    'green-14': { r: 0.078, g: 0.227, b: 0.082 },

    // LIGHT GREEN
    'light-green-1': { r: 0.945, g: 0.973, b: 0.882 },
    'light-green-2': { r: 0.882, g: 0.949, b: 0.769 },
    'light-green-3': { r: 0.827, g: 0.925, b: 0.678 },
    'light-green-4': { r: 0.773, g: 0.902, b: 0.584 },
    'light-green-5': { r: 0.722, g: 0.878, b: 0.49 },
    'light-green-6': { r: 0.545, g: 0.765, b: 0.29 }, // Base color
    'light-green-7': { r: 0.486, g: 0.698, b: 0.259 },
    'light-green-8': { r: 0.435, g: 0.631, b: 0.227 },
    'light-green-9': { r: 0.369, g: 0.561, b: 0.192 },
    'light-green-10': { r: 0.31, g: 0.494, b: 0.157 },
    'light-green-11': { r: 0.263, g: 0.427, b: 0.137 },
    'light-green-12': { r: 0.216, g: 0.353, b: 0.118 },
    'light-green-13': { r: 0.176, g: 0.29, b: 0.098 },
    'light-green-14': { r: 0.137, g: 0.227, b: 0.078 },

    // LIME
    'lime-1': { r: 0.976, g: 0.984, b: 0.906 },
    'lime-2': { r: 0.941, g: 0.969, b: 0.816 },
    'lime-3': { r: 0.916, g: 0.953, b: 0.741 },
    'lime-4': { r: 0.884, g: 0.941, b: 0.659 },
    'lime-5': { r: 0.859, g: 0.925, b: 0.569 },
    'lime-6': { r: 0.804, g: 0.863, b: 0.224 }, // Base color
    'lime-7': { r: 0.733, g: 0.796, b: 0.2 },
    'lime-8': { r: 0.667, g: 0.725, b: 0.176 },
    'lime-9': { r: 0.588, g: 0.647, b: 0.157 },
    'lime-10': { r: 0.51, g: 0.569, b: 0.137 },
    'lime-11': { r: 0.435, g: 0.49, b: 0.118 },
    'lime-12': { r: 0.361, g: 0.42, b: 0.094 },
    'lime-13': { r: 0.29, g: 0.341, b: 0.078 },
    'lime-14': { r: 0.22, g: 0.263, b: 0.059 },

    // YELLOW
    'yellow-1': { r: 1.0, g: 0.992, b: 0.906 },
    'yellow-2': { r: 1.0, g: 0.976, b: 0.816 },
    'yellow-3': { r: 1.0, g: 0.965, b: 0.741 },
    'yellow-4': { r: 1.0, g: 0.953, b: 0.667 },
    'yellow-5': { r: 1.0, g: 0.941, b: 0.588 },
    'yellow-6': { r: 1.0, g: 0.922, b: 0.231 }, // Base color
    'yellow-7': { r: 0.988, g: 0.847, b: 0.208 },
    'yellow-8': { r: 0.973, g: 0.773, b: 0.184 },
    'yellow-9': { r: 0.961, g: 0.682, b: 0.153 },
    'yellow-10': { r: 0.949, g: 0.6, b: 0.133 },
    'yellow-11': { r: 0.937, g: 0.522, b: 0.114 },
    'yellow-12': { r: 0.925, g: 0.439, b: 0.094 },
    'yellow-13': { r: 0.918, g: 0.357, b: 0.075 },
    'yellow-14': { r: 0.902, g: 0.278, b: 0.059 },

    // AMBER
    'amber-1': { r: 1.0, g: 0.973, b: 0.882 },
    'amber-2': { r: 1.0, g: 0.949, b: 0.784 },
    'amber-3': { r: 1.0, g: 0.925, b: 0.686 },
    'amber-4': { r: 1.0, g: 0.902, b: 0.588 },
    'amber-5': { r: 1.0, g: 0.878, b: 0.49 },
    'amber-6': { r: 1.0, g: 0.757, b: 0.027 }, // Base color
    'amber-7': { r: 0.988, g: 0.698, b: 0.0 },
    'amber-8': { r: 0.976, g: 0.639, b: 0.0 },
    'amber-9': { r: 0.965, g: 0.561, b: 0.0 },
    'amber-10': { r: 0.953, g: 0.486, b: 0.0 },
    'amber-11': { r: 0.941, g: 0.424, b: 0.0 },
    'amber-12': { r: 0.925, g: 0.361, b: 0.0 },
    'amber-13': { r: 0.914, g: 0.298, b: 0.0 },
    'amber-14': { r: 0.902, g: 0.235, b: 0.0 },

    // ORANGE
    'orange-1': { r: 1.0, g: 0.949, b: 0.878 },
    'orange-2': { r: 1.0, g: 0.898, b: 0.784 },
    'orange-3': { r: 1.0, g: 0.859, b: 0.698 },
    'orange-4': { r: 1.0, g: 0.82, b: 0.612 },
    'orange-5': { r: 1.0, g: 0.776, b: 0.51 },
    'orange-6': { r: 1.0, g: 0.596, b: 0.0 }, // Base color
    'orange-7': { r: 0.984, g: 0.549, b: 0.0 },
    'orange-8': { r: 0.969, g: 0.494, b: 0.0 },
    'orange-9': { r: 0.953, g: 0.427, b: 0.0 },
    'orange-10': { r: 0.937, g: 0.361, b: 0.0 },
    'orange-11': { r: 0.902, g: 0.314, b: 0.0 },
    'orange-12': { r: 0.867, g: 0.275, b: 0.0 },
    'orange-13': { r: 0.831, g: 0.235, b: 0.0 },
    'orange-14': { r: 0.8, g: 0.2, b: 0.0 },

    // DEEP ORANGE
    'deep-orange-1': { r: 0.984, g: 0.914, b: 0.906 },
    'deep-orange-2': { r: 0.976, g: 0.835, b: 0.816 },
    'deep-orange-3': { r: 0.969, g: 0.773, b: 0.745 },
    'deep-orange-4': { r: 0.957, g: 0.706, b: 0.671 },
    'deep-orange-5': { r: 0.949, g: 0.639, b: 0.6 },
    'deep-orange-6': { r: 1.0, g: 0.341, b: 0.133 }, // Base color
    'deep-orange-7': { r: 0.937, g: 0.302, b: 0.118 },
    'deep-orange-8': { r: 0.878, g: 0.275, b: 0.106 },
    'deep-orange-9': { r: 0.796, g: 0.247, b: 0.094 },
    'deep-orange-10': { r: 0.718, g: 0.22, b: 0.086 },
    'deep-orange-11': { r: 0.651, g: 0.196, b: 0.078 },
    'deep-orange-12': { r: 0.588, g: 0.173, b: 0.071 },
    'deep-orange-13': { r: 0.529, g: 0.153, b: 0.063 },
    'deep-orange-14': { r: 0.475, g: 0.133, b: 0.055 },

    // BROWN
    'brown-1': { r: 0.937, g: 0.922, b: 0.914 },
    'brown-2': { r: 0.843, g: 0.8, b: 0.784 },
    'brown-3': { r: 0.761, g: 0.714, b: 0.698 },
    'brown-4': { r: 0.678, g: 0.627, b: 0.608 },
    'brown-5': { r: 0.608, g: 0.557, b: 0.537 },
    'brown-6': { r: 0.475, g: 0.333, b: 0.282 }, // Base color
    'brown-7': { r: 0.427, g: 0.298, b: 0.255 },
    'brown-8': { r: 0.38, g: 0.259, b: 0.227 },
    'brown-9': { r: 0.325, g: 0.224, b: 0.196 },
    'brown-10': { r: 0.286, g: 0.196, b: 0.173 },
    'brown-11': { r: 0.255, g: 0.173, b: 0.153 },
    'brown-12': { r: 0.22, g: 0.149, b: 0.129 },
    'brown-13': { r: 0.188, g: 0.129, b: 0.11 },
    'brown-14': { r: 0.161, g: 0.11, b: 0.094 },

    // GREY
    'grey-1': { r: 0.98, g: 0.98, b: 0.98 },
    'grey-2': { r: 0.95, g: 0.95, b: 0.95 },
    'grey-3': { r: 0.9, g: 0.9, b: 0.9 },
    'grey-4': { r: 0.82, g: 0.82, b: 0.82 },
    'grey-5': { r: 0.74, g: 0.74, b: 0.74 },
    'grey-6': { r: 0.62, g: 0.62, b: 0.62 }, // Base color
    'grey-7': { r: 0.54, g: 0.54, b: 0.54 },
    'grey-8': { r: 0.46, g: 0.46, b: 0.46 },
    'grey-9': { r: 0.38, g: 0.38, b: 0.38 },
    'grey-10': { r: 0.26, g: 0.26, b: 0.26 },
    'grey-11': { r: 0.22, g: 0.22, b: 0.22 },
    'grey-12': { r: 0.18, g: 0.18, b: 0.18 },
    'grey-13': { r: 0.14, g: 0.14, b: 0.14 },
    'grey-14': { r: 0.1, g: 0.1, b: 0.1 },

    // BLUE GREY
    'blue-grey-1': { r: 0.925, g: 0.937, b: 0.945 },
    'blue-grey-2': { r: 0.878, g: 0.898, b: 0.91 },
    'blue-grey-3': { r: 0.816, g: 0.847, b: 0.863 },
    'blue-grey-4': { r: 0.745, g: 0.784, b: 0.804 },
    'blue-grey-5': { r: 0.678, g: 0.725, b: 0.749 },
    'blue-grey-6': { r: 0.376, g: 0.49, b: 0.545 }, // Base color
    'blue-grey-7': { r: 0.329, g: 0.431, b: 0.478 },
    'blue-grey-8': { r: 0.278, g: 0.369, b: 0.42 },
    'blue-grey-9': { r: 0.227, g: 0.302, b: 0.345 },
    'blue-grey-10': { r: 0.192, g: 0.255, b: 0.29 },
    'blue-grey-11': { r: 0.165, g: 0.216, b: 0.243 },
    'blue-grey-12': { r: 0.141, g: 0.18, b: 0.204 },
    'blue-grey-13': { r: 0.118, g: 0.149, b: 0.169 },
    'blue-grey-14': { r: 0.098, g: 0.125, b: 0.141 },
          
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