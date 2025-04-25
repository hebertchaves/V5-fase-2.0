// enhanced-template-parser.ts

import { QuasarNode, ComponentContext } from '../types/settings';
import { parse } from 'node-html-parser';

/**
 * Parser avançado para templates Vue.js/Quasar
 */
export class EnhancedTemplateParser {
  /**
   * Extrai o conteúdo do template e do script
   */
  extractVueContent(code: string): { template: string, script: string } {
    const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
    const scriptMatch = code.match(/<script>([\s\S]*?)<\/script>/);
    
    return {
      template: templateMatch ? templateMatch[1].trim() : '',
      script: scriptMatch ? scriptMatch[1].trim() : ''
    };
  }
  
  /**
   * Extrai o contexto do componente a partir do script
   */
  extractComponentContext(scriptContent: string): ComponentContext {
    const context: ComponentContext = {
      props: {},
      data: {},
      computed: {},
      methods: {},
      // Estado padrão para alguns casos comuns
      defaultState: {
        isActive: false,
        isDisabled: false,
        isFocused: false,
        isHovered: false
      }
    };
    
    // Extrair nome do componente
    const nameMatch = scriptContent.match(/name:\s*['"]([^'"]+)['"]/);
    if (nameMatch) {
      context.componentName = nameMatch[1];
    }
    
    // Extrair props
    const propsMatch = scriptContent.match(/props:\s*{([^}]+)}/);
    if (propsMatch) {
      this.extractProps(propsMatch[1], context);
    }
    
    // Extrair data
    const dataMatch = scriptContent.match(/data\s*\(\s*\)\s*{\s*return\s*{([^}]+)}/);
    if (dataMatch) {
      this.extractData(dataMatch[1], context);
    }
    
    // Extrair computed
    const computedMatch = scriptContent.match(/computed:\s*{([^}]+)}/);
    if (computedMatch) {
      this.extractComputed(computedMatch[1], context);
    }
    
    return context;
  }
  
  /**
   * Extrai props do componente
   */
  private extractProps(propsContent: string, context: ComponentContext): void {
    // Regex para capturar cada prop individualmente
    const propRegex = /(\w+):\s*(?:{([^}]+)}|([A-Za-z]+))/g;
    let match;
    
    while ((match = propRegex.exec(propsContent)) !== null) {
      const propName = match[1];
      const propDefStr = match[2] || match[3];
      
      // Se a prop é apenas um tipo (e.g., props: { title: String })
      if (match[3]) {
        context.props[propName] = this.getDefaultForType(match[3]);
        continue;
      }
      
      // Para props com definição de objeto
      const typeMatch = propDefStr.match(/type:\s*([A-Za-z]+)/);
      const defaultMatch = propDefStr.match(/default:\s*(?:['"]([^'"]+)['"]|([^,\s]+))/);
      const requiredMatch = propDefStr.match(/required:\s*(true|false)/);
      
      if (typeMatch) {
        const type = typeMatch[1];
        // Se há um valor padrão explícito
        if (defaultMatch) {
          const defaultValue = defaultMatch[1] || defaultMatch[2];
          context.props[propName] = this.parseValue(defaultValue);
        } else {
          context.props[propName] = this.getDefaultForType(type);
        }
      }
      
      // Se a prop é obrigatória mas não tem valor padrão, usamos um valor padrão sensato
      if (requiredMatch && requiredMatch[1] === 'true' && !context.props[propName]) {
        context.props[propName] = this.getSensibleDefault(propName);
      }
    }
  }
  
  /**
   * Extrai variáveis de data
   */
  private extractData(dataContent: string, context: ComponentContext): void {
    const dataEntryRegex = /(\w+):\s*(?:'([^']+)'|"([^"]+)"|([^,]+))/g;
    let match;
    
    while ((match = dataEntryRegex.exec(dataContent)) !== null) {
      const name = match[1];
      const value = match[2] || match[3] || match[4];
      context.data[name] = this.parseValue(value);
    }
  }
  
  /**
   * Extrai propriedades computed
   */
  private extractComputed(computedContent: string, context: ComponentContext): void {
    // Esta é uma simplificação, já que computed properties precisariam ser avaliadas
    const properties = computedContent.split(',')
      .map(prop => prop.trim())
      .filter(prop => prop.length > 0);
    
    for (const prop of properties) {
      const nameMatch = prop.match(/(\w+):/);
      if (nameMatch) {
        const name = nameMatch[1];
        // Atribuir um valor padrão sensato com base no nome
        context.computed[name] = this.getSensibleDefault(name);
      }
    }
  }
  
  /**
   * Converte um valor de string para o tipo apropriado
   */
  private parseValue(valueStr: string): any {
    valueStr = valueStr.trim();
    
    // Boolean
    if (valueStr === 'true') return true;
    if (valueStr === 'false') return false;
    
    // Number
    if (!isNaN(Number(valueStr)) && valueStr !== '') {
      return Number(valueStr);
    }
    
    // Array (simplificado)
    if (valueStr.startsWith('[') && valueStr.endsWith(']')) {
      try {
        return JSON.parse(valueStr);
      } catch {
        return [];
      }
    }
    
    // Object (simplificado)
    if (valueStr.startsWith('{') && valueStr.endsWith('}')) {
      try {
        return JSON.parse(valueStr);
      } catch {
        return {};
      }
    }
    
    // Default: string
    return valueStr.replace(/^['"](.*)['"]$/, '$1'); // Remove aspas extras
  }
  
  /**
   * Retorna um valor padrão para um tipo
   */
  private getDefaultForType(type: string): any {
    switch (type.toLowerCase()) {
      case 'string': return '';
      case 'number': return 0;
      case 'boolean': return false;
      case 'array': return [];
      case 'object': return {};
      case 'function': return function() {};
      default: return null;
    }
  }
  
  /**
   * Retorna um valor padrão sensato com base no nome da propriedade
   */
  private getSensibleDefault(name: string): any {
    const lowerName = name.toLowerCase();
    
    // Cores comuns
    if (lowerName.includes('color')) return 'primary';
    
    // Estados
    if (lowerName.includes('active') || lowerName.includes('selected')) return false;
    if (lowerName.includes('disabled')) return false;
    
    // Texto
    if (lowerName.includes('label') || lowerName.includes('title')) return 'Label';
    if (lowerName.includes('description') || lowerName.includes('content')) return 'Content';
    
    // Dimensões
    if (lowerName.includes('size')) return 'md';
    if (lowerName.includes('width')) return '100%';
    if (lowerName.includes('height')) return 'auto';
    
    // Ícones
    if (lowerName.includes('icon')) return 'icon';
    
    // Outros casos comuns em componentes Quasar
    if (lowerName === 'dense') return false;
    if (lowerName === 'outlined') return false;
    if (lowerName === 'flat') return false;
    if (lowerName === 'bordered') return false;
    
    return '';
  }
  
  /**
   * Analisa o template HTML com contexto do componente
   */
  parseTemplate(templateContent: string, context: ComponentContext): QuasarNode {
    try {
      // Usar node-html-parser para analisar o HTML
      const root = parse(templateContent, {
        lowerCaseTagName: true,
        comment: false,
        blockTextElements: {
          script: true,
          noscript: true,
          style: true,
          pre: true
        }
      });
      
      // Encontrar o primeiro elemento real (ignorando texto puro)
      const firstElement = this.findFirstElement(root);
      if (!firstElement) {
        throw new Error('Não foi possível encontrar um elemento raiz válido');
      }
      
      // Converter para QuasarNode com avaliação contextual
      return this.convertToQuasarNode(firstElement, context);
    } catch (error) {
      console.error('Erro ao analisar template HTML:', error);
      throw new Error(`Falha ao analisar o template HTML: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Encontra o primeiro elemento não-texto em um nó
   */
  private findFirstElement(node: any): any {
    if (!node) return null;
    
    if (node.childNodes && node.childNodes.length > 0) {
      for (const child of node.childNodes) {
        if (child.nodeType === 1) { // Elemento
          return child;
        }
      }
    }
    
    return node.firstChild; // Fallback
  }
  
  /**
   * Converte um nó da AST para QuasarNode com avaliação contextual
   */
  private convertToQuasarNode(node: any, context: ComponentContext): QuasarNode {
    // Verificar se o nó é válido
    if (!node) {
      throw new Error('Nó inválido: nulo ou indefinido');
    }
    
    // Tratar nós de texto
    if (node.nodeType === 3) {
      return {
        tagName: '#text',
        attributes: {},
        childNodes: [],
        text: node.text ? node.text.trim() : ''
      };
    }
    
    // Processar atributos com avaliação contextual
    const attributes: Record<string, string> = {};
    if (node.attributes) {
      // Verificação segura para a classe
      const classStr = node.attributes.class;
      if (classStr && typeof classStr === 'string') {
        const classes = classStr.split(/\s+/).filter(c => c);
        // Resto do processamento...
      } else {
        console.log(`Nó ${node.tagName} não possui classes para processar`);
      }
      Object.entries(node.attributes).forEach(([key, value]) => {
        attributes[key] = value as string;
      });
        // Função para processar classes com segurança
        function processClassesSafely(classStr: string | undefined): string[] {
          if (!classStr || typeof classStr !== 'string') {
            return [];
          }
          return classStr.split(/\s+/).filter(Boolean);
        }

        // Usar em qualquer lugar que processe classes
        const classes = processClassesSafely(node.attributes?.class);
      // Processar atributos especiais do Vue com avaliação contextual
      for (const [key, value] of Object.entries(attributes)) {
        // v-bind:prop ou :prop
        if (key.startsWith('v-bind:') || key.startsWith(':')) {
          const propName = key.startsWith(':') ? key.substring(1) : key.substring(7);
          // Avaliar a expressão no contexto
          const evaluatedValue = this.evaluateExpression(value, context);
          attributes[propName] = typeof evaluatedValue === 'string' 
            ? evaluatedValue 
            : JSON.stringify(evaluatedValue);
        }
        // v-model
        else if (key.startsWith('v-model')) {
          const modelName = value;
          const modelValue = context.data[modelName];
          
          // Para componentes Quasar comuns, mapear v-model para propriedades apropriadas
          if (node.tagName.toLowerCase() === 'q-input') {
            attributes['value'] = modelValue !== undefined ? String(modelValue) : '';
          } else if (node.tagName.toLowerCase() === 'q-checkbox') {
            attributes['value'] = modelValue ? 'true' : 'false';
          } else if (node.tagName.toLowerCase() === 'q-toggle') {
            attributes['value'] = modelValue ? 'true' : 'false';
          }
          // Outros mapeamentos para componentes específicos
        }
      }
    }
    
    // Processar diretivas v-if
    if ('v-if' in attributes) {
      const condition = attributes['v-if'];
      const isConditionMet = this.evaluateCondition(condition, context);
      
      if (!isConditionMet) {
        // Se a condição não for atendida, retornar nó vazio
        return {
          tagName: 'empty',
          attributes: {},
          childNodes: []
        };
      }
      
      // Remover a diretiva v-if para evitar processamento repetido
      delete attributes['v-if'];
    }
    
    // Processar filhos recursivamente
    const childNodes: QuasarNode[] = [];
    if (node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach((child: any) => {
        // Ignorar nós de texto vazios
        if (child.nodeType === 3 && (!child.text || !child.text.trim())) {
          return;
        }
        
        try {
          const quasarChild = this.convertToQuasarNode(child, context);
          // Adicionar apenas se não for um nó vazio (v-if=false)
          if (quasarChild.tagName !== 'empty') {
            childNodes.push(quasarChild);
          }
        } catch (error) {
          console.warn('Erro ao converter nó filho:', error);
        }
      });
    }
    
    // Processar diretivas v-for
    if ('v-for' in attributes) {
      return this.processVFor(node, attributes['v-for'], childNodes, context, attributes);
    }
    
    // Construir o nó Quasar
    return {
      tagName: node.tagName ? node.tagName.toLowerCase() : '#unknown',
      attributes,
      childNodes,
      text: node.text ? node.text.trim() : undefined
    };
  }
  
  /**
   * Processa a diretiva v-for
   */
  private processVFor(
    node: any, 
    expression: string, 
    originalChildren: QuasarNode[], 
    context: ComponentContext,
    attributes: Record<string, string>
  ): QuasarNode {
    // Placeholder para v-for com resultado vazio
    const emptyForNode: QuasarNode = {
      tagName: 'div',
      attributes: { class: 'v-for-container' },
      childNodes: []
    };
    
    // Extrair item e coleção da expressão v-for
    const forMatch = expression.match(/\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(\w+)/);
    if (!forMatch) return emptyForNode;
    
    const [_, itemName, indexName, collectionName] = forMatch;
    const collection = this.evaluateExpression(collectionName, context);
    
    // Se a coleção não for um array ou for vazia
    if (!Array.isArray(collection) || collection.length === 0) {
      return emptyForNode;
    }
    
    // Criar um nó para cada item na coleção
    const forResults: QuasarNode[] = [];
    
    for (let i = 0; i < collection.length; i++) {
      // Criar contexto para este item
      const itemContext: ComponentContext = {
        ...context,
        data: {
          ...context.data,
          [itemName]: collection[i]
        }
      };
      
      if (indexName) {
        itemContext.data[indexName] = i;
      }
      
      // Criar nó para este item
      const itemAttributes = {...attributes};
      delete itemAttributes['v-for']; // Remover v-for para evitar recursão infinita
      
      const itemNode: QuasarNode = {
        tagName: node.tagName.toLowerCase(),
        attributes: itemAttributes,
        childNodes: [...originalChildren], // Clone das crianças originais
        // Processar filhos com o contexto do item atual seria feito aqui em uma implementação completa
      };
      
      forResults.push(itemNode);
    }
    
    // Retornar nó de container para os resultados do v-for
    return {
      tagName: 'div',
      attributes: { class: 'v-for-container' },
      childNodes: forResults
    };
  }
  
  /**
   * Avalia uma expressão no contexto do componente
   */
  private evaluateExpression(expression: string, context: ComponentContext): any {
    try {
      // Criar um ambiente seguro para avaliação
      const safeEnv = {
        ...context.data,
        ...context.props,
        ...context.computed
      };
      
      // Usar Function para avaliar a expressão de forma segura
      const evaluator = new Function(...Object.keys(safeEnv), `return ${expression}`);
      return evaluator(...Object.values(safeEnv));
    } catch (error) {
      console.warn(`Erro ao avaliar expressão: ${expression}`, error);
      return null;
    }
    
    // Se a expressão é um nome de variável simples
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expression)) {
      // Procurar na data, props, computed
      return context.data[expression] !== undefined 
             ? context.data[expression] 
             : context.props[expression] !== undefined
               ? context.props[expression]
               : context.computed[expression] !== undefined
                 ? context.computed[expression]
                 : expression; // Fallback para o texto original
    }
    
    // Expressões condicionais (ternárias)
    const ternaryMatch = expression.match(/(.+?)\s*\?\s*(['"](.+?)['"]|(.+?))\s*:\s*(['"](.+?)['"]|(.+))/);
    if (ternaryMatch) {
      const condition = ternaryMatch[1].trim();
      const trueValue = ternaryMatch[3] || ternaryMatch[4];
      const falseValue = ternaryMatch[6] || ternaryMatch[7];
      
      const conditionResult = this.evaluateCondition(condition, context);
      return conditionResult ? trueValue : falseValue;
    }
    
    // Expressões de acesso a propriedades (item.property)
    const propertyAccessMatch = expression.match(/(\w+)\.(\w+)/);
    if (propertyAccessMatch) {
      const [_, objName, propName] = propertyAccessMatch;
      const obj = context.data[objName] || context.props[objName];
      
      if (obj && typeof obj === 'object') {
        return obj[propName];
      }
    }
    
    // Para casos mais complexos, seria necessário um evaluador de JavaScript completo
    
    // Fallback: retornar a expressão como está
    return expression;
  }
  
  /**
   * Avalia uma condição no contexto do componente
   */
  private evaluateCondition(condition: string, context: ComponentContext): boolean {
    // Condição simples de variável
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(condition)) {
      const value = context.data[condition] || context.props[condition] || context.computed[condition];
      return Boolean(value);
    }
    
    // Negação
    if (condition.startsWith('!')) {
      return !this.evaluateCondition(condition.substring(1), context);
    }
    
    // Comparações
    const comparisons = [
      /^(.+?)\s*===\s*(.+)$/,   // ===
      /^(.+?)\s*!==\s*(.+)$/,   // !==
      /^(.+?)\s*==\s*(.+)$/,    // ==
      /^(.+?)\s*!=\s*(.+)$/,    // !=
      /^(.+?)\s*>=\s*(.+)$/,    // >=
      /^(.+?)\s*<=\s*(.+)$/,    // <=
      /^(.+?)\s*>\s*(.+)$/,     // >
      /^(.+?)\s*<\s*(.+)$/      // 
    ];
    
    for (const regex of comparisons) {
      const match = condition.match(regex);
      if (match) {
        const [_, leftSide, rightSide] = match;
        const leftValue = this.evaluateExpression(leftSide.trim(), context);
        const rightValue = this.evaluateExpression(rightSide.trim(), context);
        
        // Realizar a comparação
        if (regex.source.includes('===')) return leftValue === rightValue;
        if (regex.source.includes('!==')) return leftValue !== rightValue;
        if (regex.source.includes('==')) return leftValue == rightValue;
        if (regex.source.includes('!=')) return leftValue != rightValue;
        if (regex.source.includes('>=')) return leftValue >= rightValue;
        if (regex.source.includes('<=')) return leftValue <= rightValue;
        if (regex.source.includes('>')) return leftValue > rightValue;
        if (regex.source.includes('<')) return leftValue < rightValue;
      }
    }
    
    // Operadores lógicos AND e OR
    if (condition.includes('&&')) {
      const parts = condition.split('&&');
      return parts.every(part => this.evaluateCondition(part.trim(), context));
    }
    
    if (condition.includes('||')) {
      const parts = condition.split('||');
      return parts.some(part => this.evaluateCondition(part.trim(), context));
    }
    
    // Fallback
    return false;
  }
}