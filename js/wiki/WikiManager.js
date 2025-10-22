/**
 * FazendaRPG - Wiki Manager
 * Manages wiki navigation, search and dynamic content generation
 * @version 0.0.8
 */

import WikiData from "./WikiData.js";
import WikiContentGenerator from "./WikiContentGenerator.js";
import WikiPagesRenderer from "./WikiPagesRenderer.js";

export default class WikiManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.currentPage = "getting-started";
    this.searchTimeout = null;

    // Initialize wiki modules
    this.wikiData = new WikiData();
    this.contentGenerator = null;
    this.pagesRenderer = null;
  }

  /**
   * Initialize Wiki Manager
   */
  async init() {
    console.log("📚 Initializing Wiki Manager...");

    try {
      // Load game data
      const gameData = await this.loadGameData();

      // Initialize content generators with game data
      this.contentGenerator = new WikiContentGenerator(gameData);
      this.pagesRenderer = new WikiPagesRenderer(gameData, this.wikiData);

      // Setup UI
      this.setupNavigation();
      this.setupSearch();

      // Generate and show default page
      await this.showPage("getting-started");

      console.log("✅ Wiki Manager initialized");
    } catch (error) {
      console.error("❌ Error initializing Wiki Manager:", error);
    }
  }

  /**
   * Load game data from JSON files
   * @returns {Object} Game data object
   */
  async loadGameData() {
    try {
      const [crops, items, npcs, quests, skills] = await Promise.all([
        fetch("data/crops.json").then((r) => r.json()),
        fetch("data/items.json").then((r) => r.json()),
        fetch("data/npcs.json").then((r) => r.json()),
        fetch("data/quests.json").then((r) => r.json()),
        fetch("data/skills.json").then((r) => r.json()),
      ]);

      return { crops, items, npcs, quests, skills };
    } catch (error) {
      console.error("Error loading game data:", error);
      return {};
    }
  }

  /**
   * Setup wiki navigation
   */
  setupNavigation() {
    const navItems = document.querySelectorAll(".wiki-nav-item");

    navItems.forEach((item) => {
      item.addEventListener("click", async () => {
        const pageId = item.dataset.wikiPage;
        if (pageId) {
          await this.showPage(pageId);

          // Update active state
          navItems.forEach((nav) => nav.classList.remove("active"));
          item.classList.add("active");

          // Scroll to top of content
          const wikiContent = document.querySelector(".wiki-content");
          if (wikiContent) {
            wikiContent.scrollTop = 0;
          }
        }
      });
    });
  }

  /**
   * Setup search functionality
   */
  setupSearch() {
    const searchInput = document.getElementById("wiki-search");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();

      // Clear previous timeout
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Debounce search
      this.searchTimeout = setTimeout(() => {
        this.performSearch(query);
      }, 300);
    });

    // Clear search on escape
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        this.clearSearchHighlights();
      }
    });
  }

  /**
   * Perform search in wiki content
   * @param {string} query - Search query
   */
  performSearch(query) {
    if (!query || query.length < 2) {
      this.clearSearchHighlights();
      return;
    }

    // Search in current page content
    const wikiContent = document.querySelector(".wiki-content");
    if (!wikiContent) return;

    // Clear previous highlights
    this.clearSearchHighlights();

    // Find and highlight matches
    const walker = document.createTreeWalker(
      wikiContent,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // Skip script and style elements
          const parent = node.parentElement;
          if (
            !parent ||
            parent.tagName === "SCRIPT" ||
            parent.tagName === "STYLE"
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          // Check if text contains query
          if (node.textContent.toLowerCase().includes(query)) {
            return NodeFilter.FILTER_ACCEPT;
          }

          return NodeFilter.FILTER_REJECT;
        },
      },
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      textNodes.push(node);
    }

    // Highlight found text nodes
    textNodes.forEach((textNode) => {
      const parent = textNode.parentElement;
      const text = textNode.textContent;
      const regex = new RegExp(`(${this.escapeRegex(query)})`, "gi");
      const highlighted = text.replace(
        regex,
        '<mark class="wiki-search-highlight">$1</mark>',
      );

      if (highlighted !== text) {
        const span = document.createElement("span");
        span.innerHTML = highlighted;
        parent.replaceChild(span, textNode);
      }
    });

    // Scroll to first highlight
    const firstHighlight = wikiContent.querySelector(".wiki-search-highlight");
    if (firstHighlight) {
      firstHighlight.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    console.log(
      `🔍 Found ${textNodes.length} matches for "${query}" in current page`,
    );
  }

  /**
   * Escape regex special characters
   * @param {string} string - String to escape
   * @returns {string} Escaped string
   */
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Clear search highlights
   */
  clearSearchHighlights() {
    const highlights = document.querySelectorAll(".wiki-search-highlight");
    highlights.forEach((highlight) => {
      const parent = highlight.parentElement;
      if (parent && parent.tagName === "SPAN") {
        const text = parent.textContent;
        parent.replaceWith(document.createTextNode(text));
      }
    });
  }

  /**
   * Show specific wiki page
   * @param {string} pageId - Page ID to show
   */
  async showPage(pageId) {
    try {
      // Generate content based on page ID
      let content = "";

      // Try content generator first
      if (
        [
          "getting-started",
          "game-mechanics",
          "crops",
          "tools",
          "fertilizer",
        ].includes(pageId)
      ) {
        content = this.contentGenerator.generatePage(pageId);
      }
      // Try pages renderer
      else if (
        [
          "skills-system",
          "leveling",
          "npcs-guide",
          "quests",
          "all-items",
          "tips",
          "strategies",
          "faq",
          "updates",
        ].includes(pageId)
      ) {
        content = this.pagesRenderer.generatePage(pageId);
      }
      // Try other pages
      else {
        content = this.generateGenericPage(pageId);
      }

      // Update wiki content area
      const wikiContent = document.querySelector(".wiki-content");
      if (wikiContent) {
        wikiContent.innerHTML = content;
        this.currentPage = pageId;

        console.log(`📄 Showing wiki page: ${pageId}`);
      }
    } catch (error) {
      console.error(`Error showing wiki page ${pageId}:`, error);
      this.showErrorPage(pageId);
    }
  }

  /**
   * Generate generic page for unmapped pages
   * @param {string} pageId - Page ID
   * @returns {string} HTML content
   */
  generateGenericPage(pageId) {
    const pageMap = {
      "items-guide": {
        title: "🎒 Guia de Itens",
        content: `
          <div class="wiki-card">
            <h2>📦 Tipos de Itens</h2>
            <p>No FazendaRPG existem várias categorias de itens:</p>
            <ul style="margin-left: 1.5rem; margin-top: 1rem;">
              <li><strong>Sementes:</strong> Plantadas para produzir cultivos</li>
              <li><strong>Cultivos:</strong> Resultado da colheita</li>
              <li><strong>Peixes:</strong> Capturados pescando</li>
              <li><strong>Minérios:</strong> Obtidos minerando</li>
              <li><strong>Madeira:</strong> Cortada de árvores</li>
              <li><strong>Comidas:</strong> Restauram energia</li>
              <li><strong>Ferramentas:</strong> Necessárias para ações</li>
              <li><strong>Materiais:</strong> Usados em crafting</li>
            </ul>
          </div>
          <div class="wiki-card wiki-card-tip">
            <h2>💡 Dica</h2>
            <p>Veja a seção "Lista Completa de Itens" para todos os detalhes!</p>
          </div>
        `,
      },
      inventory: {
        title: "👜 Inventário",
        content: `
          <div class="wiki-card">
            <h2>🎒 Sistema de Inventário</h2>
            <p>Seu inventário armazena todos os itens que você coleta, compra ou cria.</p>
          </div>
          <div class="wiki-card">
            <h2>📊 Características</h2>
            <ul style="margin-left: 1.5rem;">
              <li><strong>Espaço Inicial:</strong> Você começa com espaço para múltiplos itens</li>
              <li><strong>Empilhamento:</strong> Itens iguais se empilham automaticamente</li>
              <li><strong>Limite por Pilha:</strong> Cada item tem um limite de empilhamento</li>
              <li><strong>Expandível:</strong> Você pode comprar mais espaço com gold</li>
            </ul>
          </div>
          <div class="wiki-card">
            <h2>💡 Dicas de Organização</h2>
            <ul style="margin-left: 1.5rem;">
              <li>Venda itens que você não precisa regularmente</li>
              <li>Mantenha ferramentas sempre no inventário</li>
              <li>Itens consumíveis são úteis para emergências</li>
              <li>Organize por categoria para facilitar localização</li>
            </ul>
          </div>
        `,
      },
      market: {
        title: "🏪 Mercado",
        content: `
          <div class="wiki-card">
            <h2>🏪 Sistema de Mercado</h2>
            <p>O mercado é onde você compra e vende itens com NPCs.</p>
          </div>
          <div class="wiki-card">
            <h2>💰 Comprando e Vendendo</h2>
            <ul style="margin-left: 1.5rem;">
              <li><strong>Comprar:</strong> NPCs vendem sementes, ferramentas e itens especiais</li>
              <li><strong>Vender:</strong> Venda suas colheitas e itens extras por gold</li>
              <li><strong>Preços Dinâmicos:</strong> Alguns NPCs têm multiplicadores de preço</li>
              <li><strong>Estoque Limitado:</strong> Alguns itens têm estoque que renova</li>
            </ul>
          </div>
          <div class="wiki-card wiki-card-tip">
            <h2>💡 Dica de Economia</h2>
            <p>Compare preços entre NPCs! Alguns vendem mais barato ou compram por mais!</p>
          </div>
        `,
      },
      "energy-system": {
        title: "⚡ Sistema de Energia",
        content: `
          <div class="wiki-card">
            <h2>⚡ Como Funciona a Energia</h2>
            <p>Energia é necessária para realizar ações no jogo. Cada ação consome uma quantidade específica de energia.</p>
          </div>
          <div class="wiki-card">
            <h2>📊 Consumo de Energia</h2>
            <table class="wiki-table">
              <thead>
                <tr>
                  <th>Ação</th>
                  <th>Energia</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Plantar Trigo</td><td>2</td></tr>
                <tr><td>Plantar Milho</td><td>3</td></tr>
                <tr><td>Plantar Tomate</td><td>4</td></tr>
                <tr><td>Pescar Camarão</td><td>2</td></tr>
                <tr><td>Minerar Pedra</td><td>3</td></tr>
                <tr><td>Cortar Árvore</td><td>3</td></tr>
              </tbody>
            </table>
          </div>
          <div class="wiki-card">
            <h2>🍗 Restaurando Energia</h2>
            <ul style="margin-left: 1.5rem;">
              <li><strong>Camarão Cozido:</strong> +10 energia</li>
              <li><strong>Peixe Cozido:</strong> +20 energia</li>
              <li><strong>Salmão Cozido:</strong> +30 energia</li>
              <li><strong>Pão:</strong> +15 energia</li>
              <li><strong>Frutas Silvestres:</strong> +5 energia</li>
              <li><strong>Poção de Energia:</strong> +50 energia</li>
            </ul>
          </div>
          <div class="wiki-card wiki-card-warning">
            <h2>⚠️ Importante</h2>
            <p>Se sua energia chegar a zero, você não poderá realizar mais ações até restaurá-la!</p>
          </div>
        `,
      },
    };

    const page = pageMap[pageId];
    if (page) {
      return `
        <h1 class="wiki-page-title">${page.title}</h1>
        ${page.content}
      `;
    }

    return this.showErrorPage(pageId);
  }

  /**
   * Show error page
   * @param {string} pageId - Page ID that failed
   * @returns {string} HTML content
   */
  showErrorPage(pageId) {
    return `
      <h1 class="wiki-page-title">❓ Página Não Encontrada</h1>
      <div class="wiki-card wiki-card-warning">
        <h2>🔍 Conteúdo em Desenvolvimento</h2>
        <p>A página "<strong>${pageId}</strong>" ainda está sendo desenvolvida ou não existe.</p>
        <p style="margin-top: 1rem;">Por favor, navegue para outra seção usando o menu lateral.</p>
      </div>
    `;
  }

  /**
   * Get current page ID
   * @returns {string} Current page ID
   */
  getCurrentPage() {
    return this.currentPage;
  }

  /**
   * Navigate to specific section
   * @param {string} pageId - Page ID
   * @param {string} sectionId - Section ID (optional)
   */
  async navigateTo(pageId, sectionId = null) {
    await this.showPage(pageId);

    // Update navigation active state
    const navItems = document.querySelectorAll(".wiki-nav-item");
    navItems.forEach((item) => {
      if (item.dataset.wikiPage === pageId) {
        navItems.forEach((nav) => nav.classList.remove("active"));
        item.classList.add("active");
      }
    });

    // Scroll to section if provided
    if (sectionId) {
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }
}
