# Quasar to Figma Converter

Um plugin para o Figma que converte componentes desenvolvidos com Vue.js utilizando o framework Quasar em componentes funcionais no Figma, replicando a estrutura de camadas e a nomenclatura da interface do usuário (UI) do Quasar.

![Banner do Quasar to Figma Converter](./banner.png)

## 📋 Funcionalidades

- **Conversão Precisa**: Converte código Vue.js/Quasar para componentes Figma estruturados
- **Fidelidade Visual**: Mantém cores, espaçamentos e hierarquia visual dos componentes originais
- **Preservação de Estrutura**: Reproduz a mesma estrutura de camadas do Quasar no Figma
- **Amplo Suporte**: Funciona com diversos componentes e layouts do framework Quasar

## 🧩 Componentes Suportados

### Componentes Básicos
- Botões (q-btn)
- Cards (q-card)
- Ícones (q-icon)
- Separadores (q-separator)
- Chips (q-chip)

### Componentes de Formulário
- Campos de texto (q-input)
- Checkboxes (q-checkbox)
- Radio buttons (q-radio)
- Toggles (q-toggle)
- Selects (q-select)

### Componentes de Layout
- Páginas (q-page)
- Cabeçalhos (q-header)
- Rodapés (q-footer)
- Gavetas (q-drawer)
- Toolbars (q-toolbar)

### Componentes de Navegação
- Tabs (q-tabs)
- Breadcrumbs (q-breadcrumbs)

## 🚀 Como Usar

### Instalação

1. Abra o Figma e acesse o menu "Plugins" > "Gerenciar plugins"
2. Procure por "Quasar to Figma Converter" e clique em "Instalar"

Alternativamente, para desenvolvimento:

1. Clone este repositório
2. No Figma, vá para "Plugins" > "Development" > "Import plugin from manifest..."
3. Selecione o arquivo `manifest.json` do projeto clonado

### Uso

1. Selecione "Plugins" > "Quasar to Figma Converter"
2. Cole seu código Vue.js/Quasar na área de texto (certifique-se de incluir as seções `<template>` e `<script>`)
3. Ajuste as configurações conforme necessário
4. Clique em "Converter para Figma"
5. O componente convertido será adicionado à sua página atual do Figma

### Exemplos de Código

#### Botão simples:
```vue
<template>
  <q-btn color="primary" label="Botão Exemplo" />
</template>