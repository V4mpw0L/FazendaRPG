/**
 * HalloweenEvent - Evento de Halloween
 * Abóboras aparecem na tela e dão recompensas ao clicar
 * @version 0.0.18
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
      energyReward: 5, // Energia por clique
      goldReward: 5, // Ouro por clique
      clicksPerPumpkin: Infinity, // Cliques ilimitados enquanto estiver na tela
      // Sistema de drops de itens
      dropChances: {
        pirulo_noturno: 0.003, // 0.3% de chance (1 em ~333 cliques)
        aranha_crocante: 0.001, // 0.1% de chance (1 em ~1000 cliques)
        jujubas_toxicas: 0.0005, // 0.05% de chance (1 em ~2000 cliques)
      },
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
    console.log("🎃 Evento de Halloween Iniciado!");
    console.log("Clique nas abóboras para ganhar energia e ouro!");
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
    console.log("🎃 Evento de Halloween Encerrado");
    console.log("Até o próximo ano!");
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

    // Adiciona morcegos voando
    this.addFlyingBats();

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
   * Adiciona morcegos voando aleatoriamente pela tela
   */
  addFlyingBats() {
    const batCount = 3; // 3 morcegos voando

    for (let i = 0; i < batCount; i++) {
      const batContainer = document.createElement("div");
      batContainer.className = "flying-bat";

      // Posição inicial aleatória
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;

      // Direção aleatória (pode ser qualquer ângulo)
      const angle = Math.random() * 360;
      const duration = 8 + Math.random() * 4; // 8-12 segundos
      const delay = i * 2.5; // Delay entre cada morcego

      batContainer.style.cssText = `
        position: fixed;
        left: ${startX}%;
        top: ${startY}%;
        width: 40px;
        height: 40px;
        pointer-events: none;
        z-index: 9999;
        animation: flyBat${i} ${duration}s linear ${delay}s infinite;
        opacity: 0;
      `;

      // SVG do morcego - design mais fofo e estilizado
      const bat = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      bat.setAttribute("width", "50");
      bat.setAttribute("height", "50");
      bat.setAttribute("viewBox", "0 0 50 50");
      bat.style.filter = "drop-shadow(0 3px 6px rgba(0,0,0,0.4))";

      // Corpo redondo e fofo
      const body = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse",
      );
      body.setAttribute("cx", "25");
      body.setAttribute("cy", "28");
      body.setAttribute("rx", "6");
      body.setAttribute("ry", "8");
      body.setAttribute("fill", "#2d2d3d");
      body.setAttribute("stroke", "#1a1a1a");
      body.setAttribute("stroke-width", "0.5");
      bat.appendChild(body);

      // Cabeça maior e redonda
      const head = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      head.setAttribute("cx", "25");
      head.setAttribute("cy", "20");
      head.setAttribute("r", "7");
      head.setAttribute("fill", "#3d3d4d");
      head.setAttribute("stroke", "#1a1a1a");
      head.setAttribute("stroke-width", "0.5");
      bat.appendChild(head);

      // Orelhas arredondadas e fofas
      const ear1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse",
      );
      ear1.setAttribute("cx", "20");
      ear1.setAttribute("cy", "15");
      ear1.setAttribute("rx", "2.5");
      ear1.setAttribute("ry", "4");
      ear1.setAttribute("fill", "#3d3d4d");
      ear1.setAttribute("stroke", "#1a1a1a");
      ear1.setAttribute("stroke-width", "0.5");
      bat.appendChild(ear1);

      const ear2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "ellipse",
      );
      ear2.setAttribute("cx", "30");
      ear2.setAttribute("cy", "15");
      ear2.setAttribute("rx", "2.5");
      ear2.setAttribute("ry", "4");
      ear2.setAttribute("fill", "#3d3d4d");
      ear2.setAttribute("stroke", "#1a1a1a");
      ear2.setAttribute("stroke-width", "0.5");
      bat.appendChild(ear2);

      // Olhos grandes e expressivos
      const eye1Bg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      eye1Bg.setAttribute("cx", "22");
      eye1Bg.setAttribute("cy", "20");
      eye1Bg.setAttribute("r", "2");
      eye1Bg.setAttribute("fill", "#ffffff");
      bat.appendChild(eye1Bg);

      const eye2Bg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      eye2Bg.setAttribute("cx", "28");
      eye2Bg.setAttribute("cy", "20");
      eye2Bg.setAttribute("r", "2");
      eye2Bg.setAttribute("fill", "#ffffff");
      bat.appendChild(eye2Bg);

      // Pupilas vermelhas brilhantes
      const eye1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      eye1.setAttribute("cx", "22");
      eye1.setAttribute("cy", "20");
      eye1.setAttribute("r", "1.2");
      eye1.setAttribute("fill", "#ff3366");
      eye1.setAttribute("opacity", "0.95");
      bat.appendChild(eye1);

      const eye2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      eye2.setAttribute("cx", "28");
      eye2.setAttribute("cy", "20");
      eye2.setAttribute("r", "1.2");
      eye2.setAttribute("fill", "#ff3366");
      eye2.setAttribute("opacity", "0.95");
      bat.appendChild(eye2);

      // Brilho nos olhos
      const shine1 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      shine1.setAttribute("cx", "22.5");
      shine1.setAttribute("cy", "19.5");
      shine1.setAttribute("r", "0.5");
      shine1.setAttribute("fill", "#ffffff");
      shine1.setAttribute("opacity", "0.8");
      bat.appendChild(shine1);

      const shine2 = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      shine2.setAttribute("cx", "28.5");
      shine2.setAttribute("cy", "19.5");
      shine2.setAttribute("r", "0.5");
      shine2.setAttribute("fill", "#ffffff");
      shine2.setAttribute("opacity", "0.8");
      bat.appendChild(shine2);

      // Narizinho fofo
      const nose = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      nose.setAttribute("cx", "25");
      nose.setAttribute("cy", "23");
      nose.setAttribute("r", "0.8");
      nose.setAttribute("fill", "#ff6699");
      bat.appendChild(nose);

      // Asas arredondadas e estilizadas
      const wingLeft = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      wingLeft.setAttribute(
        "d",
        "M 19 26 Q 10 24 6 28 Q 8 32 12 32 Q 15 30 19 29 Z",
      );
      wingLeft.setAttribute("fill", "#4d4d5d");
      wingLeft.setAttribute("stroke", "#2d2d3d");
      wingLeft.setAttribute("stroke-width", "0.8");
      wingLeft.style.transformOrigin = "19px 28px";
      wingLeft.style.animation = "flapWing 0.3s ease-in-out infinite alternate";
      bat.appendChild(wingLeft);

      // Detalhes da asa esquerda
      const wingLeftDetail = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      wingLeftDetail.setAttribute("d", "M 17 27 Q 11 26 8 29");
      wingLeftDetail.setAttribute("stroke", "#3d3d4d");
      wingLeftDetail.setAttribute("stroke-width", "0.5");
      wingLeftDetail.setAttribute("fill", "none");
      wingLeftDetail.setAttribute("opacity", "0.6");
      wingLeft.appendChild(wingLeftDetail);

      const wingRight = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      wingRight.setAttribute(
        "d",
        "M 31 26 Q 40 24 44 28 Q 42 32 38 32 Q 35 30 31 29 Z",
      );
      wingRight.setAttribute("fill", "#4d4d5d");
      wingRight.setAttribute("stroke", "#2d2d3d");
      wingRight.setAttribute("stroke-width", "0.8");
      wingRight.style.transformOrigin = "31px 28px";
      wingRight.style.animation =
        "flapWing 0.3s ease-in-out infinite alternate-reverse";
      bat.appendChild(wingRight);

      // Detalhes da asa direita
      const wingRightDetail = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      wingRightDetail.setAttribute("d", "M 33 27 Q 39 26 42 29");
      wingRightDetail.setAttribute("stroke", "#3d3d4d");
      wingRightDetail.setAttribute("stroke-width", "0.5");
      wingRightDetail.setAttribute("fill", "none");
      wingRightDetail.setAttribute("opacity", "0.6");
      wingRight.appendChild(wingRightDetail);

      batContainer.appendChild(bat);
      this.decorations.appendChild(batContainer);

      // Adiciona keyframes customizados para cada morcego (direção aleatória)
      this.addBatAnimationKeyframes(i, angle);
    }
  }

  /**
   * Adiciona keyframes de animação para cada morcego
   */
  addBatAnimationKeyframes(batIndex, angle) {
    // Cria uma stylesheet se não existir
    let styleSheet = document.getElementById("bat-animations");
    if (!styleSheet) {
      styleSheet = document.createElement("style");
      styleSheet.id = "bat-animations";
      document.head.appendChild(styleSheet);
    }

    // Calcula trajetória baseada no ângulo
    const distance = 150; // Distância em % que o morcego vai percorrer
    const radians = (angle * Math.PI) / 180;
    const deltaX = Math.cos(radians) * distance;
    const deltaY = Math.sin(radians) * distance;

    // Adiciona keyframes
    const keyframes = `
      @keyframes flyBat${batIndex} {
        0% {
          transform: translate(0, 0) rotate(${angle}deg) scale(0.8);
          opacity: 0;
        }
        5% {
          opacity: 0.7;
        }
        50% {
          transform: translate(${deltaX / 2}vw, ${deltaY / 2}vh) rotate(${angle}deg) scale(1);
          opacity: 0.8;
        }
        95% {
          opacity: 0.7;
        }
        100% {
          transform: translate(${deltaX}vw, ${deltaY}vh) rotate(${angle}deg) scale(0.8);
          opacity: 0;
        }
      }
    `;

    styleSheet.sheet.insertRule(keyframes, styleSheet.sheet.cssRules.length);
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

    // Pega posição da abóbora para mostrar notificações acima dela
    const pumpkinRect = this.pumpkinElement.getBoundingClientRect();
    const pumpkinCenterX = pumpkinRect.left + pumpkinRect.width / 2;
    const pumpkinTopY = pumpkinRect.top;

    // Tenta dropar item (usa posição do clique para o efeito)
    this.tryDropItem(event.clientX, event.clientY);

    // Efeito visual de clique (usa posição da abóbora, acima dela)
    this.showClickEffect(pumpkinCenterX, pumpkinTopY);

    // Som/feedback (opcional)
    console.log(
      `🎃 +${this.config.energyReward} Energia, +${this.config.goldReward} Ouro!`,
    );
  }

  /**
   * Tenta dropar item aleatoriamente
   */
  tryDropItem(x, y) {
    // Verifica cada item pela ordem de raridade (do mais difícil ao mais fácil)
    const items = [
      { id: "jujubas_toxicas", name: "Jujubas Tóxicas", icon: "🍬" },
      { id: "aranha_crocante", name: "Aranha Crocante", icon: "🕷️" },
      { id: "pirulo_noturno", name: "Pirulito Noturno", icon: "🍭" },
    ];

    for (const item of items) {
      const chance = this.config.dropChances[item.id];
      const roll = Math.random();

      if (roll <= chance) {
        // DROP! Adiciona ao inventário
        if (this.gameEngine.inventorySystem) {
          this.gameEngine.inventorySystem.addItem(item.id, 1);

          // Efeito visual de drop
          this.showDropEffect(x, y, item);

          console.log(`🎃 DROP RARO! ${item.name} recebido!`);
        }
        return; // Só dropa 1 item por clique
      }
    }
  }

  /**
   * Mostra efeito visual de drop de item
   */
  showDropEffect(x, y, item) {
    const effect = document.createElement("div");
    effect.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      color: #ff6600;
      font-weight: bold;
      font-size: 24px;
      pointer-events: none;
      z-index: 10001;
      animation: dropFloat 2s ease-out forwards;
      text-shadow: 0 0 10px rgba(255, 102, 0, 0.8),
                   0 2px 4px rgba(0, 0, 0, 0.8);
    `;
    effect.textContent = `${item.icon} +1 ${item.name}!`;

    // Adiciona animação CSS se não existir
    if (!document.getElementById("drop-animation")) {
      const style = document.createElement("style");
      style.id = "drop-animation";
      style.textContent = `
        @keyframes dropFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(0.5);
          }
          20% {
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-100px) scale(1);
          }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(effect);

    setTimeout(() => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    }, 2000);
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
      transform: translate(-50%, -100%);
      color: #ffaa44;
      font-weight: bold;
      font-size: 26px;
      pointer-events: none;
      z-index: 10000;
      animation: floatUp 1s ease-out forwards;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
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
          transform: translate(-50%, -100%) translateY(0);
        }
        100% {
          opacity: 0;
          transform: translate(-50%, -100%) translateY(-80px);
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

      /* Animação de bater asas do morcego */
      @keyframes flapWing {
        0% {
          transform: scaleY(1);
        }
        100% {
          transform: scaleY(0.6) translateY(-2px);
        }
      }

      .flying-bat {
        will-change: transform, opacity;
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
