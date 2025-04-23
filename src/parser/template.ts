// src/parser/template.ts
import { QuasarNode} from '../types/settings';
import { parse } from 'node-html-parser';

export async function enhancedParseQuasarTemplate(code: string): Promise<QuasarNode> {
  try {
    // Simplificado para usar as funções existentes
    const templateContent = extractTemplateContent(code);
    return parseQuasarTemplate(templateContent);
  } catch (error) {
    console.error('Erro ao analisar template HTML:', error);
    throw new Error(`Falha ao analisar o template HTML: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Analisa um template HTML e retorna uma árvore de nós Quasar
 */
export function parseQuasarTemplate(html: string, contextData?: Record<string, any>): QuasarNode {
  try {
    const root = parse(html, {
      lowerCaseTagName: true,
      comment: false,
      blockTextElements: {
        script: true,
        noscript: true,
        style: true,
        pre: true
      }
    });
    
    const firstElement = findFirstElement(root);
    if (!firstElement) {
      throw new Error('Não foi possível encontrar um elemento raiz válido');
    }
    
    // Converter de maneira recursiva para QuasarNode com contexto
    return convertToQuasarNode(firstElement, contextData || {});
  } catch (error) {
    console.error('Erro ao analisar template HTML:', error);
    throw new Error(`Falha ao analisar o template HTML: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function findFirstElement(node: any): any {
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

// src/parser/template.ts
export function extractTemplateContent(code: string): string {
  const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
  
  if (!templateMatch) {
    throw new Error("Não foi possível encontrar a seção <template> no código");
  }
  
  return templateMatch[1].trim();
}
/**
 * Avalia uma condição no contexto do componente
 */
function evaluateCondition(condition: string, context: ComponentContext): boolean {
  // Condição simples de variável
  if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(condition)) {
    const value = context.data[condition] || context.props[condition] || context.computed[condition];
    return Boolean(value);
  }
  
  // Negação
  if (condition.startsWith('!')) {
    return !evaluateCondition(condition.substring(1), context);
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
      const leftValue = evaluateVueExpression(leftSide.trim(), context);
      const rightValue = evaluateVueExpression(rightSide.trim(), context);
      
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
    return parts.every(part => evaluateCondition(part.trim(), context));
  }
  
  if (condition.includes('||')) {
    const parts = condition.split('||');
    return parts.some(part => evaluateCondition(part.trim(), context));
  }
  
  // Fallback
  return false;
}

/**
 * Converte um nó DOM para um QuasarNode
 * Corrigido para evitar uso do operador opcional
 */
function convertToQuasarNode(node: any, context: Record<string, any>): QuasarNode {
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
  
  const attributes: Record<string, string> = {};
  if (node.attributes) {
    Object.entries(node.attributes).forEach(([key, value]) => {
      attributes[key] = value as string;
    });
    
    for (const [key, value] of Object.entries(attributes)) {
      if (key.startsWith('v-bind:') || key.startsWith(':')) {
        const propName = key.startsWith(':') ? key.substring(1) : key.substring(7);
        const evaluatedValue = evaluateVueExpression(value, context);
        attributes[propName] = typeof evaluatedValue === 'string' 
          ? evaluatedValue 
          : JSON.stringify(evaluatedValue);
      }
      else if (key.startsWith('v-model')) {
        const modelName = value;
        const modelValue = context.data[modelName];
        
        if (node.tagName.toLowerCase() === 'q-input') {
          attributes['value'] = modelValue !== undefined ? String(modelValue) : '';
        } else if (node.tagName.toLowerCase() === 'q-checkbox') {
          attributes['value'] = modelValue ? 'true' : 'false';
        } else if (node.tagName.toLowerCase() === 'q-toggle') {
          attributes['value'] = modelValue ? 'true' : 'false';
        }
      }
    }
  }

    // Adicionar processamento de diretivas Vue com contexto
    if (attributes['v-if']) {
      const condition = attributes['v-if'];
      const isConditionMet = evaluateExpression(condition, context);
      
      if (!isConditionMet) {
        // Retornar nó vazio se condição não for atendida
        return {
          tagName: 'empty',
          attributes: {},
          childNodes: []
        };
      }
      
      // Remover v-if para evitar processamento repetido
      delete attributes['v-if'];
    }
  
  const childNodes: QuasarNode[] = [];
  if (node.childNodes && node.childNodes.length > 0) {
    node.childNodes.forEach((child: any) => {
      if (child.nodeType === 3 && (!child.text || !child.text.trim())) {
        return;
      }
      
      try {
        const quasarChild = convertToQuasarNode(child, context);
        // Adicionar apenas se não for um nó vazio (v-if=false)
        if (quasarChild.tagName !== 'empty') {
          childNodes.push(quasarChild);
        }
      } catch (error) {
        console.warn('Erro ao converter nó filho:', error);
      }
    });
  }
  
  if ('v-if' in attributes) {
    const condition = attributes['v-if'];
    const isConditionMet = evaluateCondition(condition, context);
    
    if (!isConditionMet) {
      return {
        tagName: 'empty',
        attributes: {},
        childNodes: []
      };
    }
    
    delete attributes['v-if'];
  }
  
  return {
    tagName: node.tagName ? node.tagName.toLowerCase() : '#unknown',
    attributes,
    childNodes,
    text: node.text ? node.text.trim() : undefined
  };
}




// Interface simplificada para exportação
export class TemplateParser {
  static parse(html: string): QuasarNode {
    return parseQuasarTemplate(html);
  }
  
  static extractContent(code: string): string {
    return extractTemplateContent(code);
  }
}

function processNode(node: QuasarNode, context: ComponentContext): QuasarNode[] {
  // Implementação simplificada: processamento básico ou nenhum
  // Verificar v-if, v-for, etc. conforme necessário
  return [node];
}

function evaluateVueExpression(expression: string, context: Record<string, any>): any {
  // Caso simples: detectar ternários
  const ternaryMatch = expression.match(/(.+?)\s*\?\s*['"](.+?)['"]\s*:\s*['"](.+?)['"]/);
  if (ternaryMatch) {
    const [_, condition, trueValue, falseValue] = ternaryMatch;
    
    // Avaliar a condição no contexto fornecido
    try {
      // Para expressões como "isActive"
      if (condition in context) {
        return context[condition] ? trueValue : falseValue;
      }
      
      // Para expressões como "item.active"
      return new Function(...Object.keys(context), `return ${condition};`)(...Object.values(context))
        ? trueValue
        : falseValue;
    } catch (e) {
      console.warn(`Erro ao avaliar expressão: ${expression}`, e);
      return falseValue; // Valor padrão em caso de erro
    }
  }
  
  // Outras expressões comuns podem ser adicionadas aqui
  
  // Fallback: retornar a expressão como está
  return expression;
}

/**
 * Extrai componentes Quasar e elementos HTML usando regex
 */
function extractComponents(html: string, targetNode: QuasarNode): void {
  // Expressão regular para capturar tags HTML/Quasar com seus atributos e conteúdo
  const tagRegex = /<([\w-]+)([^>]*)>([\s\S]*?)<\/\1>|<([\w-]+)([^>]*?)\/>/g;
  let match;
  
  while ((match = tagRegex.exec(html)) !== null) {
    // Elementos com conteúdo: <tag attrs>content</tag>
    const tagName = match[1] || match[4];
    const attrsStr = match[2] || match[5] || '';
    const content = match[3] || '';
    
    // Criar nó para o componente atual
    const node: QuasarNode = {
      tagName: tagName,
      attributes: parseAttributes(attrsStr),
      childNodes: [],
      text: undefined
    };
    
    // Processar conteúdo interno recursivamente
    if (content.trim()) {
      // Verificar se o conteúdo é texto simples (sem tags)
      if (!content.includes('<')) {
        node.text = content.trim();
      } else {
        extractComponents(content, node);
      }
    }
    
    // Adicionar ao nó alvo
    targetNode.childNodes.push(node);
  }
  
  // Captura texto solto entre as tags
  extractTextNodes(html, targetNode);
}

/**
 * Extrai nós de texto entre tags
 */
function extractTextNodes(html: string, parentNode: QuasarNode): void {
  // Remover todas as tags
  const textContent = html.replace(/<[^>]+>|<\/[^>]+>/g, '###TAG###');
  const textParts = textContent.split('###TAG###');
  
  for (const part of textParts) {
    const trimmed = part.trim();
    if (trimmed) {
      parentNode.childNodes.push({
        tagName: '#text',
        attributes: {},
        childNodes: [],
        text: trimmed
      });
    }
  }
}

/**
 * Analisa string de atributos para um objeto
 */
function parseAttributes(attrsStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrRegex = /(\w+(?:-\w+)*)(?:=["']([^"']*)["'])?/g;
  
  let match;
  while ((match = attrRegex.exec(attrsStr)) !== null) {
    const name = match[1];
    const value = match[2] || '';
    attrs[name] = value;
  }
  
  return attrs;
}



function processVueDirectives(node: QuasarNode, context: ComponentContext): QuasarNode[] {
  const results: QuasarNode[] = [];
  
  // Processar v-if, v-else-if, v-else
  if ('v-if' in node.attributes) {
    const condition = node.attributes['v-if'];
    const isConditionMet = evaluateVueExpression(condition, context);
    
    if (isConditionMet) {
      results.push(node);
    }
    // Buscar nós irmãos com v-else ou v-else-if
  }
  // Processar v-for
  else if ('v-for' in node.attributes) {
    const forExpression = node.attributes['v-for'];
    // Extrair item e coleção: "item in items" ou "(item, index) in items"
    const forMatch = forExpression.match(/\(?(\w+)(?:,\s*(\w+))?\)?\s+in\s+(\w+)/);
    
    if (forMatch) {
      const [_, itemName, indexName, collectionName] = forMatch;
      const collection = context.data[collectionName] || [];
      
      if (Array.isArray(collection)) {
        // Criar um nó para cada item na coleção
        for (let i = 0; i < collection.length; i++) {
          const itemContext = {
            ...context,
            [itemName]: collection[i]
          };
          if (indexName) {
            itemContext[indexName] = i;
          }
          
          // Clonar o nó e processar no contexto do item atual
          const clonedNode = {...node};
          // Remover a diretiva v-for para evitar processamento infinito
          delete clonedNode.attributes['v-for'];
          
          // Processar o nó clonado com o contexto específico deste item
          results.push(...processNode(clonedNode, itemContext));
        }
      }
    }
  }
  // Processar v-model
  else if ('v-model' in node.attributes) {
    const modelName = node.attributes['v-model'];
    const modelValue = context.data[modelName];
    
    // Converter v-model em propriedades específicas do componente
    const updatedNode = {...node};
    delete updatedNode.attributes['v-model'];
    
    // Para input, transformar em value
    if (node.tagName === 'input' || node.tagName === 'q-input') {
      updatedNode.attributes['value'] = modelValue?.toString() || '';
    }
    // Para checkbox, transformar em checked
    else if (node.tagName === 'input' && node.attributes.type === 'checkbox' || 
             node.tagName === 'q-checkbox') {
      updatedNode.attributes['checked'] = modelValue ? 'true' : 'false';
    }
    // Outros casos específicos...
    
    results.push(updatedNode);
  }
  else {
    // Para nós sem diretivas especiais, processar normalmente
    results.push(node);
  }
  
  return results;
}

interface ComponentContext {
  props: Record<string, any>;
  data: Record<string, any>;
  computed: Record<string, any>;
  methods: Record<string, Function>;
}

function extractScriptContext(scriptContent: string): ComponentContext {
  const context: ComponentContext = {
    props: {},
    data: {},
    computed: {},
    methods: {}
  };
  
  // Extrair props
  const propsMatch = scriptContent.match(/props:\s*{([^}]+)}/);
  if (propsMatch) {
    const propsContent = propsMatch[1];
    const propEntries = propsContent.split(',').map(p => p.trim());
    
    for (const propEntry of propEntries) {
      const [propName, propConfig] = propEntry.split(':').map(p => p.trim());
      
      // Extrair valor padrão
      const defaultMatch = propConfig.match(/default:\s*(?:['"]([^'"]+)['"]|([^,]+))/);
      if (defaultMatch) {
        context.props[propName] = defaultMatch[1] || defaultMatch[2];
      }
    }
  }
  
  // Extrair data
  const dataMatch = scriptContent.match(/data\s*\(\s*\)\s*{\s*return\s*{([^}]+)}/);
  if (dataMatch) {
    const dataContent = dataMatch[1];
    const dataEntries = dataContent.split(',').map(d => d.trim());
    
    for (const dataEntry of dataEntries) {
      const [dataName, dataValue] = dataEntry.split(':').map(d => d.trim());
      try {
        // Tentar analisar como JSON
        if (dataValue.trim().startsWith('{') || 
            dataValue.trim().startsWith('[') || 
            dataValue.trim() === 'true' || 
            dataValue.trim() === 'false' || 
            !isNaN(Number(dataValue.trim()))) {
            context.data[dataName] = JSON.parse(dataValue);
        } else {
            // Strings sem aspas
            context.data[dataName] = dataValue.replace(/^['"](.*)['"]$/, '$1');
        }
    } catch {
        // Se falhar, armazenar como string
        context.data[dataName] = dataValue;
    }
    }
  }
  
  // Similar para computed e methods
  
  return context;
}