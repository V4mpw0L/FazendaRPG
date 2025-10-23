/**
 * HalloweenEvent - Evento de Halloween
 * Abóboras aparecem na tela e dão recompensas ao clicar
 * @version 1.0.0
 */

export default class HalloweenEvent {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.player = gameEngine.player;
    this.active = false;
    this.initialized = false;

    // Configurações do evento
    this.config = {
      pumpkinSpawnInterval: 5000, // 5 segundos entre spawns
      pumpkinMinDuration: 8000, // Mínimo 8 segundos na tela
      pumpkinMaxDuration: 15000, // Máximo 15 segundos na tela
      pumpkinMoveInterval: 2000, // Move a cada 2 segundos
      pumpkinSize: 80, // Tamanho da abóbora em pixels
      energyReward: 1, // Energia por clique
      goldReward: 1, // Ouro por clique
      clicksPerPumpkin: Infinity, // Cliques ilimitados enquanto estiver na tela
    };

    // Controles
    this.pumpkinElement = null;
    this.spawnTimer = null;
    this.moveTimer = null;
    this.despawnTimer = null;
    this.currentPumpkin = null;
    this.pumpkinImages = [
      './assets/sprites/events/pumpkin2.png',
      './assets/sprites/events/pumpkin3.png'
    ];

    // Decorações
    this.decorations = null;

    // Descrição do evento
    this.description = 'Evento de Halloween - Clique nas abóboras para ganhar energia e ouro!';
    this.type = 'Halloween';
  }

  /**
   * Inicializa o evento
   */
  init() {
    if (this.initialized) {
      console.warn("⚠️ HalloweenEvent já inicializado");
      return;
    }

    console.log("🎃 Inicializando HalloweenEvent...");
    this.initialized = true;
    console.log("✅ HalloweenEvent inicializado");
  }

  /**
   * Inicia o evento
   */
  start() {
    if (this.active) {
      console.warn("⚠️ HalloweenEvent já está ativo");
      return;
    }

    console.log("🎃 Iniciando evento de Halloween!");
    this.active = true;

    // Adiciona decorações de Halloween
    this.addDecorations();

    // Começa a spawnar abóboras
    this.startPumpkinSpawning();

    // Notificação
    if (this.gameEngine.notificationManager) {
      this.gameEngine.notificationManager.show(
        '🎃 Evento de Halloween Iniciado!',
        'Clique nas abóboras para ganhar energia e ouro!',
        'success'
      );
    }
  }

  /**
   * Para o evento
   */
  stop() {
    if (!this.active) {
      console.warn("⚠️ HalloweenEvent não está ativo");
      return;
    }

    console.log("🎃 Parando evento de Halloween...");
    this.active = false;

    // Para timers
    this.stopPumpkinSpawning();

    // Remove abóbora atual
    if (this.pumpkinElement) {
      this.removePumpkin();
    }

    // Remove decorações
    this.removeDecorations();

    // Notificação
    if (this.gameEngine.notificationManager) {
      this.gameEngine.notificationManager.show(
        '🎃 Evento de Halloween Encerrado',
        'Até o próximo ano!',
        'info'
      );
    }
  }

  /**
   * Adiciona decorações de Halloween
   */
  addDecorations() {
    // Remove decorações antigas se existirem
    this.removeDecorations();

    // Cria container de decorações
    this.decorations = document.createElement('div');
    this.decorations.id = 'halloween-decorations';
    this.decorations.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
    `;

    // Teias de aranha nos cantos
    const webPositions = [
      { top: '0', left: '0', transform: 'rotate(0deg)' },
      { top: '0', right: '0', transform: 'rotate(90deg)' },
      { bottom: '0', left: '0', transform: 'rotate(-90deg)' },
      { bottom: '0', right: '0', transform: 'rotate(180deg)' }
    ];

    webPositions.forEach(pos => {
      const web = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      web.setAttribute('width', '150');
      web.setAttribute('height', '150');
      web.style.position = 'absolute';
      web.style.opacity = '0.6';

      Object.keys(pos).forEach(key => {
        web.style[key] = pos[key];
      });

      // Desenha teia de aranha
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M 0 0 L 150 0 L 0 150 Z M 25 0 Q 40 40 0 25 M 50 0 Q 60 60 0 50 M 75 0 Q 75 75 0 75 M 100 0 Q 90 90 0 100 M 125 0 Q 100 100 0 125');
      path.setAttribute('stroke', '#666');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      web.appendChild(path);

      this.decorations.appendChild(web);
    });

    // Adiciona ao body
    document.body.appendChild(this.decorations);
  }

  /**
   * Remove decorações
   */
  removeDecorations() {
    if (this.decorations && this.decorations.parentNode) {
      this.decorations.parentNode.removeChild(this.decorations);
    }
    this.decorations = null;
  }

  /**
   * Inicia o spawn de abóboras
   */
  startPumpkinSpawning() {
    // Spawna a primeira abóbora imediatamente
    this.spawnPumpkin();

    // Continua spawnando
    this.spawnTimer = setInterval(() => {
      if (this.active && !this.pumpkinElement) {
        this.spawnPumpkin();
      }
    }, this.config.pumpkinSpawnInterval);
  }

  /**
   * Para o spawn de abóboras
   */
  stopPumpkinSpawning() {
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
      this.spawnTimer = null;
    }
    if (this.moveTimer) {
      clearInterval(this.moveTimer);
      this.moveTimer = null;
    }
    if (this.despawnTimer) {
      clearTimeout(this.despawnTimer);
      this.despawnTimer = null;
    }
  }

  /**
   * Spawna uma abóbora na tela
   */
  spawnPumpkin() {
    if (this.pumpkinElement) {
      return; // Já existe uma abóbora
    }

    // Cria elemento da abóbora
    this.pumpkinElement = document.createElement('div');
    this.pumpkinElement.className = 'halloween-pumpkin';
    this.pumpkinElement.style.cssText = `
      position: fixed;
      width: ${this.config.pumpkinSize}px;
      height: ${this.config.pumpkinSize}px;
      cursor: pointer;
      z-index: 9999;
      transition: all 1s ease-in-out;
      animation: pumpkinBounce 1s infinite;
    `;

    // Escolhe imagem aleatória
    const randomImage = this.pumpkinImages[Math.floor(Math.random() * this.pumpkinImages.length)];

    const img = document.createElement('img');
    img.src = randomImage;
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
    `;
    this.pumpkinElement.appendChild(img);

    // Adiciona CSS de animação se não existir
    this.addPumpkinAnimation();

    // Posição inicial aleatória
    this.movePumpkinToRandomPosition();

    // Evento de clique
    this.pumpkinElement.addEventListener('click', this.handlePumpkinClick.bind(this));

    // Adiciona ao body
    document.body.appendChild(this.pumpkinElement);

    // Timer de movimento
    this.moveTimer = setInterval(() => {
      this.movePumpkinToRandomPosition();
    }, this.config.pumpkinMoveInterval);

    // Timer de despawn
    const duration = this.config.pumpkinMinDuration +
      Math.random() * (this.config.pumpkinMaxDuration - this.config.pumpkinMinDuration);

    this.despawnTimer = setTimeout(() => {
      this.removePumpkin();
    }, duration);

    console.log('🎃 Abóbora apareceu!');
  }

  /**
   * Move abóbora para posição aleatória
   */
  movePumpkinToRandomPosition() {
    if (!this.pumpkinElement) return;

    const maxX = window.innerWidth - this.config.pumpkinSize - 20;
    const maxY = window.innerHeight - this.config.pumpkinSize - 20;

    // Evita área do menu superior (primeiros 100px)
    const minY = 100;

    const x = Math.random() * maxX;
    const y = minY + Math.random() * (maxY - minY);

    this.pumpkinElement.style.left = `${x}px`;
    this.pumpkinElement.style.top = `${y}px`;
  }

  /**
   * Manipula clique na abóbora
   */
  handlePumpkinClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.active) return;

    // Adiciona energia e ouro
    this.player.addEnergy(this.config.energyReward);
    this.player.addGold(this.config.goldReward);

    // Atualiza UI
    if (this.gameEngine.topBar) {
      this.gameEngine.topBar.update();
    }

    // Efeito visual de clique
    this.showClickEffect(event.clientX, event.clientY);

    // Som/feedback (opcional)
    console.log(`🎃 +${this.config.energyReward} Energia, +${this.config.goldReward} Ouro!`);
  }

  /**
   * Mostra efeito visual de clique
   */
  showClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      color: #ff6600;
      font-weight: bold;
      font-size: 20px;
      pointer-events: none;
      z-index: 10000;
      animation: floatUp 1s ease-out forwards;
    `;
    effect.textContent = `+${this.config.energyReward} ⚡ +${this.config.goldReward} 💰`;

    document.body.appendChild(effect);

    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    }, 1000);
  }

  /**
   * Remove abóbora da tela
   */
  removePumpkin() {
    if (this.pumpkinElement && this.pumpkinElement.parentNode) {
      this.pumpkinElement.parentNode.removeChild(this.pumpkinElement);
    }
    this.pumpkinElement = null;

    if (this.moveTimer) {
      clearInterval(this.moveTimer);
      this.moveTimer = null;
    }
    if (this.despawnTimer) {
      clearTimeout(this.despawnTimer);
      this.despawnTimer = null;
    }
  }

  /**
   * Adiciona animação CSS para abóbora
   */
  addPumpkinAnimation() {
    // Verifica se já existe
    if (document.getElementById('halloween-animations')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'halloween-animations';
    style.textContent = `
      @keyframes pumpkinBounce {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-10px) scale(1.05); }
      }

      @keyframes floatUp {
        0% {
          opacity: 1;
          transform: translateY(0);
        }
        100% {
          opacity: 0;
          transform: translateY(-50px);
        }
      }

      .halloween-pumpkin:hover {
        transform: scale(1.1);
        filter: brightness(1.2);
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Remove animação CSS
   */
  removeAnimations() {
    const style = document.getElementById('halloween-animations');
    if (style && style.parentNode) {
      style.parentNode.removeChild(style);
    }
  }

  /**
   * Update (chamado pelo EventManager se necessário)
   */
  update(deltaTime) {
    // Pode ser usado para lógica adicional no futuro
  }

  /**
   * Destroy - limpa recursos
   */
  destroy() {
    this.stop();
    this.removeAnimations();
    this.initialized = false;
  }
}
