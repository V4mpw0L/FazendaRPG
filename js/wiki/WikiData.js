/**
 * FazendaRPG - Wiki Data
 * Centralized data structure for all wiki content
 * @version 0.0.9
 */

export default class WikiData {
  constructor() {
    this.sections = this.initializeSections();
  }

  /**
   * Initialize all wiki sections
   * @returns {Object} Wiki sections data
   */
  initializeSections() {
    return {
      // Getting Started
      gettingStarted: {
        id: "getting-started",
        title: "🌱 Primeiros Passos",
        titleEN: "🌱 Getting Started",
        icon: "🌱",
        category: "inicio",
      },

      // Game Mechanics
      gameMechanics: {
        id: "game-mechanics",
        title: "⚙️ Como Jogar",
        titleEN: "⚙️ How to Play",
        icon: "⚙️",
        category: "inicio",
      },

      // Crops
      crops: {
        id: "crops",
        title: "🌽 Guia de Cultivos",
        titleEN: "🌽 Crops Guide",
        icon: "🌽",
        category: "farming",
      },

      // Tools
      tools: {
        id: "tools",
        title: "🔧 Ferramentas",
        titleEN: "🔧 Tools",
        icon: "🔧",
        category: "farming",
      },

      // Fertilizer
      fertilizer: {
        id: "fertilizer",
        title: "🌿 Fertilizantes",
        titleEN: "🌿 Fertilizers",
        icon: "🌿",
        category: "farming",
      },

      // Skills System
      skillsSystem: {
        id: "skills-system",
        title: "📊 Sistema de Skills",
        titleEN: "📊 Skills System",
        icon: "📊",
        category: "skills",
      },

      // Leveling
      leveling: {
        id: "leveling",
        title: "🎯 Níveis e XP",
        titleEN: "🎯 Levels and XP",
        icon: "🎯",
        category: "skills",
      },

      // Items Guide
      itemsGuide: {
        id: "items-guide",
        title: "🎒 Guia de Itens",
        titleEN: "🎒 Items Guide",
        icon: "🎒",
        category: "items",
      },

      // All Items
      allItems: {
        id: "all-items",
        title: "📋 Lista Completa de Itens",
        titleEN: "📋 Complete Items List",
        icon: "📋",
        category: "items",
      },

      // Inventory
      inventory: {
        id: "inventory",
        title: "👜 Inventário",
        titleEN: "👜 Inventory",
        icon: "👜",
        category: "items",
      },

      // Market
      market: {
        id: "market",
        title: "🏪 Mercado",
        titleEN: "🏪 Market",
        icon: "🏪",
        category: "city",
      },

      // NPCs Guide
      npcsGuide: {
        id: "npcs-guide",
        title: "👥 Guia de NPCs",
        titleEN: "👥 NPCs Guide",
        icon: "👥",
        category: "city",
      },

      // Quests
      quests: {
        id: "quests",
        title: "📜 Missões",
        titleEN: "📜 Quests",
        icon: "📜",
        category: "city",
      },

      // Tips
      tips: {
        id: "tips",
        title: "💎 Dicas e Truques",
        titleEN: "💎 Tips and Tricks",
        icon: "💎",
        category: "tips",
      },

      // Strategies
      strategies: {
        id: "strategies",
        title: "🎯 Estratégias",
        titleEN: "🎯 Strategies",
        icon: "🎯",
        category: "tips",
      },

      // Energy System
      energySystem: {
        id: "energy-system",
        title: "⚡ Sistema de Energia",
        titleEN: "⚡ Energy System",
        icon: "⚡",
        category: "mechanics",
      },

      // FAQ
      faq: {
        id: "faq",
        title: "❓ Perguntas Frequentes",
        titleEN: "❓ FAQ",
        icon: "❓",
        category: "tips",
      },

      // Updates
      updates: {
        id: "updates",
        title: "📰 Atualizações",
        titleEN: "📰 Updates",
        icon: "📰",
        category: "tips",
      },
    };
  }

  /**
   * Get all sections
   * @returns {Object} All wiki sections
   */
  getAllSections() {
    return this.sections;
  }

  /**
   * Get section by ID
   * @param {string} id - Section ID
   * @returns {Object|null} Section data or null
   */
  getSectionById(id) {
    return (
      Object.values(this.sections).find((section) => section.id === id) || null
    );
  }

  /**
   * Get sections by category
   * @param {string} category - Category name
   * @returns {Array} Array of sections in category
   */
  getSectionsByCategory(category) {
    return Object.values(this.sections).filter(
      (section) => section.category === category,
    );
  }

  /**
   * Get navigation structure
   * @returns {Object} Navigation menu structure
   */
  getNavigationStructure() {
    return {
      inicio: {
        title: "🎮 Início",
        titleEN: "🎮 Start",
        items: [
          this.sections.gettingStarted,
          this.sections.gameMechanics,
          this.sections.energySystem,
        ],
      },
      farming: {
        title: "🌾 Farming",
        titleEN: "🌾 Farming",
        items: [
          this.sections.crops,
          this.sections.tools,
          this.sections.fertilizer,
        ],
      },
      skills: {
        title: "⭐ Skills",
        titleEN: "⭐ Skills",
        items: [this.sections.skillsSystem, this.sections.leveling],
      },
      items: {
        title: "📦 Itens",
        titleEN: "📦 Items",
        items: [
          this.sections.itemsGuide,
          this.sections.allItems,
          this.sections.inventory,
        ],
      },
      city: {
        title: "🏘️ Cidade",
        titleEN: "🏘️ City",
        items: [
          this.sections.market,
          this.sections.npcsGuide,
          this.sections.quests,
        ],
      },
      tips: {
        title: "💡 Dicas",
        titleEN: "💡 Tips",
        items: [
          this.sections.tips,
          this.sections.strategies,
          this.sections.faq,
          this.sections.updates,
        ],
      },
    };
  }

  /**
   * Get tips data
   * @returns {Array} Array of tips
   */
  getTips() {
    return [
      {
        id: "tip-fertilizer",
        icon: "🌿",
        title: "Use Fertilizantes",
        titleEN: "Use Fertilizers",
        description:
          "Fertilizantes reduzem o tempo de crescimento em 50%! Use-os em cultivos de alto valor.",
        descriptionEN:
          "Fertilizers reduce growth time by 50%! Use them on high-value crops.",
        category: "farming",
      },
      {
        id: "tip-tools",
        icon: "🔧",
        title: "Ferramentas Necessárias",
        titleEN: "Required Tools",
        description:
          "Você precisa de Pá de Mão para plantar, Enxada ou Rastelo para limpar ervas daninhas.",
        descriptionEN:
          "You need a Trowel to plant, Hoe or Rake to clear weeds.",
        category: "farming",
      },
      {
        id: "tip-weeds",
        icon: "🌱",
        title: "Ervas Daninhas",
        titleEN: "Weeds",
        description:
          "Ervas daninhas crescem em 60s em plots vazios. Limpe-as para ganhar ervas gratuitamente!",
        descriptionEN:
          "Weeds grow in 60s on empty plots. Clear them to get free herbs!",
        category: "farming",
      },
      {
        id: "tip-energy",
        icon: "⚡",
        title: "Gerencie sua Energia",
        titleEN: "Manage Your Energy",
        description:
          "Cada ação consome energia. Coma alimentos ou use poções para restaurar.",
        descriptionEN:
          "Each action consumes energy. Eat food or use potions to restore.",
        category: "mechanics",
      },
      {
        id: "tip-skills",
        icon: "📊",
        title: "Treine Múltiplas Skills",
        titleEN: "Train Multiple Skills",
        description:
          "Não foque apenas em farming! Pesca, mineração e outras skills são igualmente importantes.",
        descriptionEN:
          "Don't focus only on farming! Fishing, mining and other skills are equally important.",
        category: "skills",
      },
      {
        id: "tip-quests",
        icon: "📜",
        title: "Complete Missões",
        titleEN: "Complete Quests",
        description:
          "Missões dão recompensas valiosas como gold, XP e itens raros. Fale com NPCs!",
        descriptionEN:
          "Quests give valuable rewards like gold, XP and rare items. Talk to NPCs!",
        category: "quests",
      },
      {
        id: "tip-sell-smart",
        icon: "💰",
        title: "Venda com Inteligência",
        titleEN: "Sell Smartly",
        description:
          "Cultivos processados (como pão) valem mais que ingredientes crus!",
        descriptionEN:
          "Processed crops (like bread) are worth more than raw ingredients!",
        category: "economy",
      },
      {
        id: "tip-friendship",
        icon: "❤️",
        title: "Amizade com NPCs",
        titleEN: "NPC Friendship",
        description:
          "Converse e complete missões para aumentar amizade com NPCs. Eles podem dar descontos!",
        descriptionEN:
          "Talk and complete quests to increase friendship with NPCs. They might give discounts!",
        category: "npcs",
      },
      {
        id: "tip-inventory",
        icon: "🎒",
        title: "Organize o Inventário",
        titleEN: "Organize Inventory",
        description:
          "Itens empilháveis economizam espaço. Venda itens desnecessários regularmente.",
        descriptionEN:
          "Stackable items save space. Sell unnecessary items regularly.",
        category: "inventory",
      },
      {
        id: "tip-diversify",
        icon: "🌈",
        title: "Diversifique",
        titleEN: "Diversify",
        description:
          "Plante diferentes cultivos! Alguns são melhores para XP, outros para gold.",
        descriptionEN:
          "Plant different crops! Some are better for XP, others for gold.",
        category: "strategy",
      },
    ];
  }

  /**
   * Get strategies data
   * @returns {Array} Array of strategies
   */
  getStrategies() {
    return [
      {
        id: "strategy-early-game",
        title: "Início de Jogo (Níveis 1-10)",
        titleEN: "Early Game (Levels 1-10)",
        icon: "🌱",
        steps: [
          {
            title: "Plante Trigo",
            description:
              "Foque em trigo no início. É rápido (30s) e dá XP constante.",
          },
          {
            title: "Complete Missões Iniciais",
            description:
              "Fale com Old Farmer Joe e complete as primeiras missões.",
          },
          {
            title: "Economize Fertilizantes",
            description:
              "Guarde fertilizantes para cultivos mais demorados depois.",
          },
          {
            title: "Limpe Ervas Daninhas",
            description:
              "Sempre limpe ervas daninhas para conseguir ervas grátis.",
          },
        ],
      },
      {
        id: "strategy-mid-game",
        title: "Meio de Jogo (Níveis 10-30)",
        titleEN: "Mid Game (Levels 10-30)",
        icon: "🌽",
        steps: [
          {
            title: "Diversifique Cultivos",
            description:
              "Comece a plantar milho, tomate e batata para mais XP e gold.",
          },
          {
            title: "Explore Outras Skills",
            description:
              "Comece a pescar, minerar e coletar recursos. Balanceie suas skills.",
          },
          {
            title: "Use Fertilizantes",
            description:
              "Agora é hora de usar fertilizantes em cultivos de 90s+.",
          },
          {
            title: "Complete Missões Diárias",
            description:
              "Faça as missões diárias para ganhar recursos extras.",
          },
        ],
      },
      {
        id: "strategy-late-game",
        title: "Final de Jogo (Níveis 30+)",
        titleEN: "Late Game (Levels 30+)",
        icon: "🎃",
        steps: [
          {
            title: "Cultivos Premium",
            description:
              "Foque em abóbora, morango e melancia. Alto XP e gold.",
          },
          {
            title: "Crafting Avançado",
            description:
              "Use smithing e crafting para criar itens valiosos.",
          },
          {
            title: "Maximize Eficiência",
            description:
              "Sempre use fertilizantes e planeje plantios em ciclos.",
          },
          {
            title: "Farm de Gold",
            description:
              "Venda produtos processados para maximizar lucros.",
          },
        ],
      },
      {
        id: "strategy-energy",
        title: "Gestão de Energia",
        titleEN: "Energy Management",
        icon: "⚡",
        steps: [
          {
            title: "Cozinhe Sua Comida",
            description:
              "Comida cozida restaura mais energia que crua. Vale o esforço!",
          },
          {
            title: "Estoque Poções",
            description:
              "Sempre tenha poções de energia para emergências.",
          },
          {
            title: "Planeje Ações",
            description:
              "Não desperdice energia em ações de baixo valor.",
          },
          {
            title: "Timing é Tudo",
            description:
              "Faça ações de alta energia quando puder restaurar depois.",
          },
        ],
      },
      {
        id: "strategy-gold",
        title: "Maximizar Gold",
        titleEN: "Maximize Gold",
        icon: "💰",
        steps: [
          {
            title: "Venda Processado",
            description:
              "Pão vale mais que trigo. Salmão cozido vale mais que cru.",
          },
          {
            title: "Complete Quests",
            description: "Quests dão muito gold. Priorize as de recompensa alta.",
          },
          {
            title: "Negocie Esperto",
            description:
              "Alguns NPCs compram por mais. Verifique preços antes de vender.",
          },
          {
            title: "Invista em Ferramentas",
            description:
              "Ferramentas melhores economizam energia e tempo = mais gold.",
          },
        ],
      },
    ];
  }

  /**
   * Get FAQ data
   * @returns {Array} Array of FAQ items
   */
  getFAQ() {
    return [
      {
        id: "faq-start",
        question: "Como começar no jogo?",
        questionEN: "How do I start the game?",
        answer:
          "Você começa com 10 sementes de trigo e ferramentas básicas. Clique em um plot vazio na fazenda para plantar sua primeira semente. Aguarde 30 segundos e colha!",
        answerEN:
          "You start with 10 wheat seeds and basic tools. Click on an empty plot on the farm to plant your first seed. Wait 30 seconds and harvest!",
      },
      {
        id: "faq-tools",
        question: "Quais ferramentas eu preciso?",
        questionEN: "What tools do I need?",
        answer:
          "Você começa com 3 ferramentas essenciais: Pá de Mão (para plantar), Enxada (para limpar ervas) e Rastelo (também limpa ervas). Mantenha-as no inventário!",
        answerEN:
          "You start with 3 essential tools: Trowel (to plant), Hoe (to clear weeds) and Rake (also clears weeds). Keep them in your inventory!",
      },
      {
        id: "faq-energy",
        question: "Como funciona o sistema de energia?",
        questionEN: "How does the energy system work?",
        answer:
          "Cada ação consome energia. Você começa com 100 de energia máxima. Restaure comendo alimentos ou usando poções de energia.",
        answerEN:
          "Each action consumes energy. You start with 100 max energy. Restore by eating food or using energy potions.",
      },
      {
        id: "faq-weeds",
        question: "O que são ervas daninhas?",
        questionEN: "What are weeds?",
        answer:
          "Ervas daninhas crescem automaticamente em plots vazios após 60 segundos. Use Enxada ou Rastelo para limpá-las e ganhar ervas como item!",
        answerEN:
          "Weeds grow automatically on empty plots after 60 seconds. Use Hoe or Rake to clear them and get herbs as an item!",
      },
      {
        id: "faq-fertilizer",
        question: "Como usar fertilizante?",
        questionEN: "How do I use fertilizer?",
        answer:
          "Ao plantar uma semente, você terá a opção de usar fertilizante. Ele reduz o tempo de crescimento em 50%! Ótimo para cultivos demorados.",
        answerEN:
          "When planting a seed, you'll have the option to use fertilizer. It reduces growth time by 50%! Great for slow crops.",
      },
      {
        id: "faq-level",
        question: "Como subir de nível?",
        questionEN: "How do I level up?",
        answer:
          "Cada skill tem seu próprio nível (farming, fishing, mining, etc). Faça ações relacionadas à skill para ganhar XP e subir de nível!",
        answerEN:
          "Each skill has its own level (farming, fishing, mining, etc). Do skill-related actions to gain XP and level up!",
      },
      {
        id: "faq-quests",
        question: "Onde encontro missões?",
        questionEN: "Where do I find quests?",
        answer:
          "Fale com NPCs na cidade! Cada NPC tem missões específicas. Complete-as para ganhar gold, XP e itens especiais.",
        answerEN:
          "Talk to NPCs in the city! Each NPC has specific quests. Complete them to earn gold, XP and special items.",
      },
      {
        id: "faq-save",
        question: "O jogo salva automaticamente?",
        questionEN: "Does the game auto-save?",
        answer:
          "Sim! O jogo salva automaticamente no seu navegador. Você pode jogar offline e seus dados ficam salvos.",
        answerEN:
          "Yes! The game auto-saves in your browser. You can play offline and your data stays saved.",
      },
      {
        id: "faq-inventory",
        question: "Meu inventário está cheio, o que fazer?",
        questionEN: "My inventory is full, what do I do?",
        answer:
          "Venda itens no mercado ou organize itens empilháveis. Você também pode comprar mais espaço com gold!",
        answerEN:
          "Sell items at the market or organize stackable items. You can also buy more space with gold!",
      },
      {
        id: "faq-mobile",
        question: "Posso jogar no celular?",
        questionEN: "Can I play on mobile?",
        answer:
          "Sim! O jogo é 100% otimizado para mobile. Funciona perfeitamente em smartphones e tablets.",
        answerEN:
          "Yes! The game is 100% optimized for mobile. Works perfectly on smartphones and tablets.",
      },
    ];
  }

  /**
   * Get updates/changelog data
   * @returns {Array} Array of updates
   */
  getUpdates() {
    return [
      {
        version: "0.0.9",
        date: "2024",
        title: "Sistema Completo de Wiki",
        titleEN: "Complete Wiki System",
        changes: [
          "✅ Wiki modular e organizada",
          "✅ Guias completos de todos os sistemas",
          "✅ Integração com dados reais do jogo",
          "✅ Sistema de busca funcional",
          "✅ Dicas e estratégias",
        ],
      },
      {
        version: "0.0.7",
        date: "2024",
        title: "Sistema de NPCs e Quests",
        titleEN: "NPCs and Quests System",
        changes: [
          "✅ 8 NPCs únicos com personalidade",
          "✅ Sistema de amizade com NPCs",
          "✅ 12+ missões variadas",
          "✅ Missões diárias repetíveis",
          "✅ Lojas de NPCs funcionais",
        ],
      },
      {
        version: "0.0.6",
        date: "2024",
        title: "Sistema de Energia",
        titleEN: "Energy System",
        changes: [
          "✅ Energia máxima de 100",
          "✅ Consumo por ação",
          "✅ Comidas restauram energia",
          "✅ Poções de energia",
          "✅ UI de energia melhorada",
        ],
      },
      {
        version: "0.0.5",
        date: "2024",
        title: "Múltiplas Skills",
        titleEN: "Multiple Skills",
        changes: [
          "✅ 8 skills diferentes",
          "✅ Sistema de XP por skill",
          "✅ Níveis até 99",
          "✅ Ações específicas por skill",
          "✅ Recompensas por milestone",
        ],
      },
    ];
  }
}
