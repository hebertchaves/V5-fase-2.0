// src/utils/logger.js

/**
 * Sistema de logging para debug do parser
 * Fornece funções para registrar mensagens em diferentes níveis de severidade
 */

// Níveis de log disponíveis
const LOG_LEVELS = {
    ERROR: 0,  // Apenas erros
    WARN: 1,   // Erros e avisos
    INFO: 2,   // Informações gerais + erros e avisos
    DEBUG: 3   // Todos os logs, incluindo detalhes de debugging
  };
  
  // Nível de log atual
  let currentLogLevel = LOG_LEVELS.INFO;
  
  /**
   * Configura o nível de log para o sistema
   * @param {string|number} level - Nível de log (ERROR, WARN, INFO, DEBUG ou 0-3)
   */
  export function setLogLevel(level) {
    if (typeof level === 'string') {
      const upperLevel = level.toUpperCase();
      if (LOG_LEVELS[upperLevel] !== undefined) {
        currentLogLevel = LOG_LEVELS[upperLevel];
      }
    } else if (typeof level === 'number') {
      if (level >= 0 && level <= 3) {
        currentLogLevel = level;
      }
    }
  }
  
  /**
   * Registra uma mensagem de nível debug
   * @param {string} component - Nome do componente ou módulo
   * @param {string} message - Mensagem a ser registrada
   * @param {any} data - Dados adicionais (opcional)
   */
  export function logDebug(component, message, data = null) {
    if (currentLogLevel >= LOG_LEVELS.DEBUG) {
      console.log(`[DEBUG][${component}] ${message}`, data !== null ? data : '');
    }
  }
  
  /**
   * Registra uma mensagem de nível info
   * @param {string} component - Nome do componente ou módulo
   * @param {string} message - Mensagem a ser registrada
   * @param {any} data - Dados adicionais (opcional)
   */
  export function logInfo(component, message, data = null) {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.log(`[INFO][${component}] ${message}`, data !== null ? data : '');
    }
  }
  
  /**
   * Registra uma mensagem de nível warn
   * @param {string} component - Nome do componente ou módulo
   * @param {string} message - Mensagem a ser registrada
   * @param {any} data - Dados adicionais (opcional)
   */
  export function logWarn(component, message, data = null) {
    if (currentLogLevel >= LOG_LEVELS.WARN) {
      console.warn(`[WARN][${component}] ${message}`, data !== null ? data : '');
    }
  }
  
  /**
   * Registra uma mensagem de nível error
   * @param {string} component - Nome do componente ou módulo
   * @param {string} message - Mensagem a ser registrada
   * @param {Error} error - Objeto de erro (opcional)
   */
  export function logError(component, message, error = null) {
    if (currentLogLevel >= LOG_LEVELS.ERROR) {
      console.error(`[ERROR][${component}] ${message}`, error !== null ? error : '');
    }
  }
  
  /**
   * Registra o tempo de execução de uma função
   * @param {string} component - Nome do componente ou módulo
   * @param {string} name - Nome da operação
   * @param {Function} fn - Função a ser executada e cronometrada
   * @returns {any} - Resultado da função executada
   */
  export async function logTimeExecution(component, name, fn) {
    if (currentLogLevel < LOG_LEVELS.DEBUG) {
      return await fn();
    }
    
    const startTime = performance.now();
    try {
      const result = await fn();
      const endTime = performance.now();
      logDebug(component, `${name} executado em ${(endTime - startTime).toFixed(2)}ms`);
      return result;
    } catch (error) {
      const endTime = performance.now();
      logError(component, `${name} falhou após ${(endTime - startTime).toFixed(2)}ms`, error);
      throw error;
    }
  }
  
  /**
   * Inicia um temporizador para medir o tempo de uma operação
   * @param {string} component - Nome do componente ou módulo
   * @param {string} name - Nome da operação
   * @returns {Function} - Função para parar o temporizador
   */
  export function startTimer(component, name) {
    if (currentLogLevel < LOG_LEVELS.DEBUG) {
      return () => {}; // Função vazia se não estiver em modo debug
    }
    
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      logDebug(component, `${name} executado em ${(endTime - startTime).toFixed(2)}ms`);
    };
  }
  
  /**
   * Registra eventos importantes do fluxo de conversão
   * @param {string} step - Etapa atual
   * @param {string} message - Mensagem descritiva
   * @param {any} data - Dados adicionais (opcional)
   */
  export function logConversionStep(step, message, data = null) {
    if (currentLogLevel >= LOG_LEVELS.INFO) {
      console.log(`[CONVERSION][${step}] ${message}`, data !== null ? data : '');
      
      // Notificar a UI sobre o progresso
      try {
        figma.ui.postMessage({
          type: 'processing-update',
          step: step,
          message: message
        });
      } catch (e) {
        // Ignorar erros de comunicação com a UI
      }
    }
  }
  
  // Exportar uma função de inicialização para configurar o logger
  export function setupLogger(level = 'INFO') {
    setLogLevel(level);
    logInfo('logger', `Sistema de log inicializado no nível ${level}`);
  }