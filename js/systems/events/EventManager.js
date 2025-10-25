/**
 * EventManager - Gerenciador de Eventos do Jogo
 * Sistema modular para gerenciar eventos sazonais (Halloween, Natal, Páscoa, etc)
 * @version 0.0.18
 */

export default class EventManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.player = gameEngine.player;
    this.events = new Map(); // Map<eventName, eventInstance>
    this.activeEvents = new Set(); // Set of active event names
    this.initialized = false;
  }

  /**
   * Inicializa o EventManager
   */
  async init() {
    if (this.initialized) {
      console.warn("⚠️ EventManager já inicializado");
      return;
    }

    console.log("🎉 Inicializando EventManager...");

    this.initialized = true;
    console.log("✅ EventManager inicializado com sucesso");
  }

  /**
   * Registra um novo evento no sistema
   * @param {string} eventName - Nome único do evento
   * @param {Object} eventInstance - Instância do evento
   */
  registerEvent(eventName, eventInstance) {
    if (this.events.has(eventName)) {
      console.warn(`⚠️ Evento '${eventName}' já está registrado`);
      return false;
    }

    this.events.set(eventName, eventInstance);
    console.log(`📝 Evento '${eventName}' registrado com sucesso`);
    return true;
  }

  /**
   * Remove um evento do sistema
   * @param {string} eventName - Nome do evento
   */
  unregisterEvent(eventName) {
    if (!this.events.has(eventName)) {
      console.warn(`⚠️ Evento '${eventName}' não encontrado`);
      return false;
    }

    // Se o evento estiver ativo, desativa antes de remover
    if (this.isEventActive(eventName)) {
      this.stopEvent(eventName);
    }

    this.events.delete(eventName);
    console.log(`🗑️ Evento '${eventName}' removido`);
    return true;
  }

  /**
   * Inicia um evento
   * @param {string} eventName - Nome do evento
   */
  startEvent(eventName) {
    const event = this.events.get(eventName);

    if (!event) {
      console.error(`❌ Evento '${eventName}' não encontrado`);
      return false;
    }

    if (this.activeEvents.has(eventName)) {
      console.warn(`⚠️ Evento '${eventName}' já está ativo`);
      return false;
    }

    try {
      // Inicializa o evento se necessário
      if (event.init && typeof event.init === 'function') {
        event.init();
      }

      // Inicia o evento
      if (event.start && typeof event.start === 'function') {
        event.start();
      }

      this.activeEvents.add(eventName);
      console.log(`🎉 Evento '${eventName}' iniciado!`);

      // Salva no localStorage
      this.saveActiveEvents();

      return true;
    } catch (error) {
      console.error(`❌ Erro ao iniciar evento '${eventName}':`, error);
      return false;
    }
  }

  /**
   * Para um evento
   * @param {string} eventName - Nome do evento
   */
  stopEvent(eventName) {
    const event = this.events.get(eventName);

    if (!event) {
      console.error(`❌ Evento '${eventName}' não encontrado`);
      return false;
    }

    if (!this.activeEvents.has(eventName)) {
      console.warn(`⚠️ Evento '${eventName}' não está ativo`);
      return false;
    }

    try {
      // Para o evento
      if (event.stop && typeof event.stop === 'function') {
        event.stop();
      }

      this.activeEvents.delete(eventName);
      console.log(`🛑 Evento '${eventName}' parado`);

      // Salva no localStorage
      this.saveActiveEvents();

      return true;
    } catch (error) {
      console.error(`❌ Erro ao parar evento '${eventName}':`, error);
      return false;
    }
  }

  /**
   * Verifica se um evento está ativo
   * @param {string} eventName - Nome do evento
   * @returns {boolean}
   */
  isEventActive(eventName) {
    return this.activeEvents.has(eventName);
  }

  /**
   * Lista todos os eventos registrados
   * @returns {Array} Array com informações dos eventos
   */
  listEvents() {
    const eventList = [];

    this.events.forEach((event, name) => {
      eventList.push({
        name: name,
        active: this.activeEvents.has(name),
        description: event.description || 'Sem descrição',
        type: event.type || 'Evento'
      });
    });

    return eventList;
  }

  /**
   * Obtém um evento específico
   * @param {string} eventName - Nome do evento
   * @returns {Object|null}
   */
  getEvent(eventName) {
    return this.events.get(eventName) || null;
  }

  /**
   * Para todos os eventos ativos
   */
  stopAllEvents() {
    const activeEventNames = Array.from(this.activeEvents);

    activeEventNames.forEach(eventName => {
      this.stopEvent(eventName);
    });

    console.log("🛑 Todos os eventos foram parados");
  }

  /**
   * Atualiza todos os eventos ativos (chamado no game loop)
   * @param {number} deltaTime - Tempo desde última atualização
   */
  update(deltaTime) {
    this.activeEvents.forEach(eventName => {
      const event = this.events.get(eventName);
      if (event && event.update && typeof event.update === 'function') {
        event.update(deltaTime);
      }
    });
  }

  /**
   * Salva eventos ativos no localStorage
   */
  saveActiveEvents() {
    const activeEventsArray = Array.from(this.activeEvents);
    localStorage.setItem('fazenda_active_events', JSON.stringify(activeEventsArray));
  }

  /**
   * Carrega eventos ativos do localStorage
   */
  loadActiveEvents() {
    try {
      const saved = localStorage.getItem('fazenda_active_events');
      if (saved) {
        const activeEventsArray = JSON.parse(saved);
        activeEventsArray.forEach(eventName => {
          // Só ativa se o evento estiver registrado
          if (this.events.has(eventName)) {
            this.startEvent(eventName);
          }
        });
      }
    } catch (error) {
      console.error("❌ Erro ao carregar eventos ativos:", error);
    }
  }

  /**
   * Limpa dados de eventos do localStorage
   */
  clearEventData() {
    localStorage.removeItem('fazenda_active_events');
    console.log("🗑️ Dados de eventos limpos");
  }

  /**
   * Destroy - limpa recursos
   */
  destroy() {
    this.stopAllEvents();
    this.events.clear();
    this.activeEvents.clear();
    this.initialized = false;
    console.log("🗑️ EventManager destruído");
  }
}
