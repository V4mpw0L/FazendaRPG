/**
 * HalloweenEvent - Evento de Halloween
 * Abóboras aparecem na tela e dão recompensas ao clicar
 * @version 0.0.14
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
      "./assets/sprites/events/pumpkin2.png",
      "./assets/sprites/events/pumpkin3.png",
    ];

    // Decorações
    this.decorations = null;

    // Descrição do evento
    this.description =
      "Evento de Halloween - Clique nas abóboras para ganhar energia e ouro!";
    this.type = "Halloween";
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
        "🎃 Evento de Halloween Iniciado!",
        "Clique nas abóboras para ganhar energia e ouro!",
        "success",
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
        "🎃 Evento de Halloween Encerrado",
        "Até o próximo ano!",
        "info",
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
    this.decorations = document.createElement("div");
    this.decorations.id = "halloween-decorations";
    this.decorations.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
      overflow: hidden;
    `;

    // Teias de aranha nos cantos (mais elaboradas)
    const webPositions = [
      { top: "0", left: "0", transform: "rotate(0deg)" },
      { top: "0", right: "0", transform: "rotate(90deg)" },
      { bottom: "0", left: "0", transform: "rotate(-90deg)" },
      { bottom: "0", right: "0", transform: "rotate(180deg)" },
    ];

    webPositions.forEach((pos, index) => {
      const webContainer = document.createElement("div");
      webContainer.style.position = "absolute";
      Object.keys(pos).forEach((key) => {
        webContainer.style[key] = pos[key];
      });

      // Cria teia mais elaborada
      const web = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      web.setAttribute("width", "200");
      web.setAttribute("height", "200");
      web.style.opacity = "0.7";

      // Teia principal (mais detalhada)
      const webGroup = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );

      // Linhas radiais da teia (mais irregulares e naturais)
      const radialLines = [
        "M 0 0 Q 50 -5 200 0",
        "M 0 0 Q 85 10 185 35",
        "M 0 0 Q 75 25 165 75",
        "M 0 0 Q 55 45 135 115",
        "M 0 0 Q 40 55 95 145",
        "M 0 0 Q 25 75 65 175",
        "M 0 0 Q 10 90 25 195",
        "M 0 0 Q -5 100 0 200",
        "M 200 0 Q 105 5 0 0", // Linha que fecha a teia
      ];

      radialLines.forEach((d) => {
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        line.setAttribute("d", d);
        line.setAttribute("stroke", "#4a4a4a");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("fill", "none");
        line.setAttribute("opacity", "0.6");
        webGroup.appendChild(line);
      });

      // Linhas conectoras irregulares (mais orgânicas)
      const connectors = [
        "M 30 0 Q 28 32 0 30",
        "M 65 0 Q 60 70 0 65",
        "M 95 0 Q 88 100 0 95",
        "M 125 0 Q 115 135 0 125",
        "M 160 0 Q 145 170 0 160",
      ];

      connectors.forEach((d) => {
        const connector = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        connector.setAttribute("d", d);
        connector.setAttribute("stroke", "#555");
        connector.setAttribute("stroke-width", "1");
        connector.setAttribute("fill", "none");
        connector.setAttribute("opacity", "0.5");
        webGroup.appendChild(connector);
      });

      web.appendChild(webGroup);

      // Adiciona aranha estática na teia
      const spider = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "g",
      );
      spider.setAttribute("transform", "translate(40, 40)");

      // Corpo da aranha
      const body = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse",
      );
      body.setAttribute("cx", "0");
      body.setAttribute("cy", "0");
      body.setAttribute("rx", "8");
      body.setAttribute("ry", "10");
      body.setAttribute("fill", "#1a1a1a");
      spider.appendChild(body);

      // Cabeça da aranha
      const head = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      head.setAttribute("cx", "0");
      head.setAttribute("cy", "-8");
      head.setAttribute("r", "5");
      head.setAttribute("fill", "#1a1a1a");
      spider.appendChild(head);

      // Pernas da aranha (8 pernas)
      const legs = [
        "M 0 -3 Q -12 -8 -15 -12",
        "M 0 -1 Q -14 -3 -18 -5",
        "M 0 1 Q -14 3 -18 5",
        "M 0 3 Q -12 8 -15 12",
        "M 0 -3 Q 12 -8 15 -12",
        "M 0 -1 Q 14 -3 18 -5",
        "M 0 1 Q 14 3 18 5",
        "M 0 3 Q 12 8 15 12",
      ];

      legs.forEach((d) => {
        const leg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        leg.setAttribute("d", d);
        leg.setAttribute("stroke", "#1a1a1a");
        leg.setAttribute("stroke-width", "1.5");
        leg.setAttribute("fill", "none");
        spider.appendChild(leg);
      });

      web.appendChild(spider);
      webContainer.appendChild(web);
      this.decorations.appendChild(webContainer);
    });

    // Adiciona aranhas descendo (animadas)
    this.addDescendingSpiders();

    // Adiciona ao body
    document.body.appendChild(this.decorations);
  }

  /**
   * Adiciona aranhas descendo com animação
   */
  addDescendingSpiders() {
    const spiderCount = 3; // 3 aranhas descendo

    for (let i = 0; i < spiderCount; i++) {
      const spiderContainer = document.createElement("div");
      spiderContainer.className = "descending-spider";
      spiderContainer.style.cssText = `
        position: absolute;
        left: ${20 + i * 30}%;
        top: -50px;
        animation: descendSpider ${6 + Math.random() * 3}s linear infinite;
        animation-delay: ${i * 2}s;
      `;

      // Fio da aranha
      const thread = document.createElement("div");
      thread.style.cssText = `
        width: 1px;
        height: 100px;
        background: linear-gradient(to bottom, transparent, #666, transparent);
        margin: 0 auto;
      `;
      spiderContainer.appendChild(thread);

      // SVG da aranha
      const spider = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      spider.setAttribute("width", "30");
      spider.setAttribute("height", "30");
      spider.setAttribute("viewBox", "-15 -15 30 30");
      spider.style.display = "block";
      spider.style.margin = "0 auto";

      // Corpo da aranha
      const body = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse",
      );
      body.setAttribute("cx", "0");
      body.setAttribute("cy", "0");
      body.setAttribute("rx", "6");
      body.setAttribute("ry", "8");
      body.setAttribute("fill", "#2a2a2a");
      body.setAttribute("stroke", "#1a1a1a");
      body.setAttribute("stroke-width", "0.5");
      spider.appendChild(body);

      // Cabeça
      const head = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      head.setAttribute("cx", "0");
      head.setAttribute("cy", "-6");
      head.setAttribute("r", "4");
      head.setAttribute("fill", "#2a2a2a");
      head.setAttribute("stroke", "#1a1a1a");
      head.setAttribute("stroke-width", "0.5");
      spider.appendChild(head);

      // Olhos vermelhos brilhantes
      const eye1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      eye1.setAttribute("cx", "-1.5");
      eye1.setAttribute("cy", "-6.5");
      eye1.setAttribute("r", "0.8");
      eye1.setAttribute("fill", "#ff0000");
      eye1.setAttribute("opacity", "0.8");
      spider.appendChild(eye1);

      const eye2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      eye2.setAttribute("cx", "1.5");
      eye2.setAttribute("cy", "-6.5");
      eye2.setAttribute("r", "0.8");
      eye2.setAttribute("fill", "#ff0000");
      eye2.setAttribute("opacity", "0.8");
      spider.appendChild(eye2);

      // Pernas animadas
      const legs = [
        "M 0 -2 Q -10 -6 -12 -10",
        "M 0 -1 Q -11 -2 -14 -3",
        "M 0 1 Q -11 2 -14 3",
        "M 0 2 Q -10 6 -12 10",
        "M 0 -2 Q 10 -6 12 -10",
        "M 0 -1 Q 11 -2 14 -3",
        "M 0 1 Q 11 2 14 3",
        "M 0 2 Q 10 6 12 10",
      ];

      legs.forEach((d, idx) => {
        const leg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        leg.setAttribute("d", d);
        leg.setAttribute("stroke", "#1a1a1a");
        leg.setAttribute("stroke-width", "1.2");
        leg.setAttribute("fill", "none");
        leg.setAttribute("stroke-linecap", "round");
        spider.appendChild(leg);
      });

      spiderContainer.appendChild(spider);
      this.decorations.appendChild(spiderContainer);
    }
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
    this.pumpkinElement = document.createElement("div");
    this.pumpkinElement.className = "halloween-pumpkin";
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
    const randomImage =
      this.pumpkinImages[Math.floor(Math.random() * this.pumpkinImages.length)];

    const img = document.createElement("img");
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
    this.pumpkinElement.addEventListener(
      "click",
      this.handlePumpkinClick.bind(this),
    );

    // Adiciona ao body
    document.body.appendChild(this.pumpkinElement);

    // Timer de movimento
    this.moveTimer = setInterval(() => {
      this.movePumpkinToRandomPosition();
    }, this.config.pumpkinMoveInterval);

    // Timer de despawn
    const duration =
      this.config.pumpkinMinDuration +
      Math.random() *
        (this.config.pumpkinMaxDuration - this.config.pumpkinMinDuration);

    this.despawnTimer = setTimeout(() => {
      this.removePumpkin();
    }, duration);

    console.log("🎃 Abóbora apareceu!");
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
    console.log(
      `🎃 +${this.config.energyReward} Energia, +${this.config.goldReward} Ouro!`,
    );
  }

  /**
   * Mostra efeito visual de clique
   */
  showClickEffect(x, y) {
    const effect = document.createElement("div");
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
    if (document.getElementById("halloween-animations")) {
      return;
    }

    const style = document.createElement("style");
    style.id = "halloween-animations";
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

      @keyframes descendSpider {
        0% {
          transform: translateY(-100px) rotate(0deg);
          opacity: 0;
        }
        5% {
          opacity: 0.7;
        }
        25% {
          transform: translateY(50px) rotate(5deg);
        }
        50% {
          transform: translateY(250px) rotate(-5deg);
        }
        75% {
          transform: translateY(450px) rotate(3deg);
          opacity: 0.7;
        }
        95% {
          opacity: 0;
        }
        100% {
          transform: translateY(600px) rotate(0deg);
          opacity: 0;
        }
      }

      .halloween-pumpkin:hover {
        transform: scale(1.1);
        filter: brightness(1.2);
      }

      .descending-spider {
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Remove animação CSS
   */
  removeAnimations() {
    const style = document.getElementById("halloween-animations");
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
