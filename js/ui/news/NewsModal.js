/**
 * NewsModal - Sistema de Notícias e Changelog
 * Exibe notícias, atualizações e changelog do jogo
 * @version 0.0.18
 */

export default class NewsModal {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.modal = null;
    this.newsData = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.initialized = false;
  }

  /**
   * Inicializa o sistema de notícias
   */
  async init() {
    if (this.initialized) {
      console.warn("⚠️ NewsModal já inicializado");
      return;
    }

    console.log("📰 Inicializando NewsModal...");

    // Carrega notícias
    await this.loadNews();

    // Cria modal
    this.createModal();

    // Verifica se deve mostrar ao abrir o jogo
    this.checkAutoShow();

    this.initialized = true;
    console.log("✅ NewsModal inicializado");
  }

  /**
   * Carrega notícias do JSON
   */
  async loadNews() {
    try {
      const response = await fetch("./data/news/news.json");
      const data = await response.json();
      this.newsData = data.news || [];
      console.log(`📰 Carregadas ${this.newsData.length} notícias`);
    } catch (error) {
      console.error("❌ Erro ao carregar notícias:", error);
      this.newsData = [];
    }
  }

  /**
   * Cria estrutura do modal
   */
  createModal() {
    // Remove modal antigo se existir
    const oldModal = document.getElementById("news-modal");
    if (oldModal) {
      oldModal.remove();
    }

    // Cria modal
    this.modal = document.createElement("div");
    this.modal.id = "news-modal";
    this.modal.className = "news-modal";
    this.modal.style.display = "none";

    this.modal.innerHTML = `
      <div class="news-modal-overlay"></div>
      <div class="news-modal-content">
        <div class="news-modal-header">
          <h2 style="display: flex; align-items: center; justify-content: center; gap: 8px;"><img src="assets/sprites/noticias.png" alt="Notícias" style="width: 24px; height: 24px;">Notícias e Atualizações<img src="assets/sprites/noticias.png" alt="Notícias" style="width: 24px; height: 24px;"></h2>
          <button class="news-modal-close" aria-label="Fechar">×</button>
        </div>
        <div class="news-modal-body">
          <div class="news-list" id="news-list">
            <!-- Notícias serão inseridas aqui -->
          </div>
        </div>
        <div class="news-modal-footer">
          <div class="news-pagination" id="news-pagination"></div>
        </div>
      </div>
    `;

    document.body.appendChild(this.modal);

    // Event listeners
    this.attachEventListeners();

    // Adiciona estilos
    this.addStyles();
  }

  /**
   * Adiciona event listeners
   */
  attachEventListeners() {
    // Botão fechar
    const closeBtn = this.modal.querySelector(".news-modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.hide());
    }

    // Clique no overlay fecha
    const overlay = this.modal.querySelector(".news-modal-overlay");
    if (overlay) {
      overlay.addEventListener("click", () => this.hide());
    }

    // ESC fecha
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible()) {
        this.hide();
      }
    });
  }

  /**
   * Renderiza lista de notícias
   */
  renderNews() {
    const newsList = this.modal.querySelector("#news-list");
    if (!newsList) return;

    // Separa notícias fixadas das normais
    const pinnedNews = this.newsData.filter((n) => n.pinned);
    const regularNews = this.newsData.filter((n) => !n.pinned);

    // Calcula paginação apenas para notícias regulares
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    const pageNews = regularNews.slice(start, end);

    // Limpa lista
    newsList.innerHTML = "";

    // Renderiza notícias fixadas primeiro (sempre visíveis)
    pinnedNews.forEach((news) => {
      const newsItem = this.createNewsItem(news);
      newsList.appendChild(newsItem);
    });

    // Renderiza notícias regulares paginadas
    pageNews.forEach((news) => {
      const newsItem = this.createNewsItem(news);
      newsList.appendChild(newsItem);
    });

    // Renderiza paginação (usa apenas notícias regulares para cálculo)
    this.renderPagination(regularNews.length);
  }

  /**
   * Cria elemento de notícia
   */
  createNewsItem(news) {
    const item = document.createElement("div");
    item.className = `news-item ${news.highlight ? "news-highlight" : ""} ${news.important ? "news-important" : ""} ${news.pinned ? "news-pinned" : ""}`;
    item.dataset.category = news.category;

    const categoryIcon = this.getCategoryIcon(news.category);
    const categoryName = this.getCategoryName(news.category);

    item.innerHTML = `
      <div class="news-item-header">
        ${news.pinned ? '<div class="news-pin-icon">📌</div>' : ""}
        <div class="news-item-meta">
          <span class="news-category ${news.category}">${categoryIcon} ${categoryName}</span>
          <span class="news-date">${this.formatDate(news.date)}</span>
          ${news.version ? `<span class="news-version">v${news.version}</span>` : ""}
        </div>
      </div>
      <div class="news-item-body">
        ${news.image ? `<img src="${news.image}" alt="${news.title}" class="news-image" loading="lazy">` : ""}
        <h3 class="news-title">${news.title}</h3>
        <p class="news-content">${news.content}</p>
        ${
          (news.tags && news.tags.length > 0) || news.author
            ? `
          <div class="news-footer-meta">
            ${
              news.tags && news.tags.length > 0
                ? `
            <div class="news-tags">
              ${news.tags.map((tag) => `<span class="news-tag">${tag}</span>`).join("")}
            </div>
            `
                : ""
            }
            ${news.author ? `<span class="news-author-badge"><span class="author-name">Autor: ${news.author}</span><img src="./assets/sprites/adm.png" alt="Staff" class="author-icon"></span>` : ""}
          </div>
        `
            : ""
        }
      </div>
    `;

    return item;
  }

  /**
   * Renderiza paginação
   */
  renderPagination(totalItems = null) {
    const pagination = this.modal.querySelector("#news-pagination");
    if (!pagination) return;

    // Usa totalItems passado ou calcula com todas as notícias
    const itemCount = totalItems !== null ? totalItems : this.newsData.length;
    const totalPages = Math.ceil(itemCount / this.itemsPerPage);

    if (totalPages <= 1) {
      pagination.innerHTML = "";
      return;
    }

    let html = '<div class="pagination-buttons">';

    // Botão anterior
    if (this.currentPage > 1) {
      html += `<button class="pagination-btn" data-page="${this.currentPage - 1}">‹ Anterior</button>`;
    }

    // Números de página
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= this.currentPage - 1 && i <= this.currentPage + 1)
      ) {
        const active = i === this.currentPage ? "active" : "";
        html += `<button class="pagination-btn ${active}" data-page="${i}">${i}</button>`;
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        html += '<span class="pagination-dots">...</span>';
      }
    }

    // Botão próximo
    if (this.currentPage < totalPages) {
      html += `<button class="pagination-btn" data-page="${this.currentPage + 1}">Próximo ›</button>`;
    }

    html += "</div>";
    pagination.innerHTML = html;

    // Event listeners para botões de paginação
    pagination.querySelectorAll(".pagination-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page);
        this.goToPage(page);
      });
    });
  }

  /**
   * Vai para página específica
   */
  goToPage(page) {
    this.currentPage = page;
    this.renderNews();

    // Scroll para o topo da lista
    const newsList = this.modal.querySelector("#news-list");
    if (newsList) {
      newsList.scrollTop = 0;
    }
  }

  /**
   * Retorna ícone da categoria
   */
  getCategoryIcon(category) {
    const icons = {
      evento: "🎉",
      sistema: "⚙️",
      melhoria: "✨",
      recurso: "🆕",
      correção: "🔧",
      visual: "🎨",
      lançamento: "🚀",
    };
    return icons[category] || "📌";
  }

  /**
   * Retorna nome da categoria
   */
  getCategoryName(category) {
    const names = {
      evento: "Evento",
      sistema: "Sistema",
      melhoria: "Melhoria",
      recurso: "Novo Recurso",
      correção: "Correção",
      visual: "Visual",
      lançamento: "Lançamento",
    };
    return names[category] || "Notícia";
  }

  /**
   * Formata data
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  /**
   * Verifica se deve mostrar automaticamente
   */
  checkAutoShow() {
    // SEMPRE mostra ao abrir o jogo
    // Delay de 1 segundo para não atrapalhar carregamento
    setTimeout(() => {
      this.show();
    }, 1000);
  }

  /**
   * Mostra modal
   */
  show() {
    if (!this.modal) return;

    this.modal.style.display = "flex";
    document.body.style.overflow = "hidden";

    // Renderiza notícias
    this.renderNews();

    console.log("📰 Modal de notícias aberto");
  }

  /**
   * Força mostrar modal (ignora configuração de "não mostrar novamente")
   */
  forceShow() {
    console.log("📰 Forçando exibição do modal de notícias");
    this.show();
  }

  /**
   * Reseta configuração (mantido para compatibilidade)
   */
  resetDontShow() {
    console.log("✅ Notícias sempre aparecem ao abrir o jogo!");
  }

  /**
   * Esconde modal
   */
  hide() {
    if (!this.modal) return;

    this.modal.style.display = "none";
    document.body.style.overflow = "";

    console.log("📰 Modal de notícias fechado");
  }

  /**
   * Verifica se modal está visível
   */
  isVisible() {
    return this.modal && this.modal.style.display === "flex";
  }

  /**
   * Adiciona estilos CSS
   */
  addStyles() {
    const styleId = "news-modal-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .news-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      .news-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
      }

      .news-modal-content {
        position: relative;
        width: 90%;
        max-width: 800px;
        max-height: 85vh;
        background: var(--bg-color, #fff);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        display: flex;
        flex-direction: column;
        animation: slideUp 0.3s ease;
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .news-modal-header {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px 24px;
        border-bottom: 2px solid var(--border-color, #e0e0e0);
        position: relative;
      }

      .news-modal-header h2 {
        margin: 0;
        font-size: 24px;
        color: var(--text-color, #333);
      }

      .news-modal-close {
        position: absolute;
        right: 24px;
        top: 50%;
        transform: translateY(-50%);
        background: #dc3545;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
      }

      .news-modal-close:hover {
        background: #c82333;
        color: white;
        transform: rotate(90deg) scale(1.1);
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.3);
      }

      .news-modal-body {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
      }

      /* Scrollbar customizada sempre visível */
      .news-modal-body::-webkit-scrollbar {
        width: 12px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 6px;
      }

      .news-modal-body::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 6px;
        margin: 8px 0;
      }

      .news-modal-body::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #5caa1f 0%, #4a8c19 100%);
        border-radius: 6px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 2px 6px rgba(92, 170, 31, 0.3);
      }

      .news-modal-body::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #6bc225 0%, #5caa1f 100%);
        box-shadow: 0 2px 8px rgba(92, 170, 31, 0.5);
      }

      .news-modal-body::-webkit-scrollbar-thumb:active {
        background: linear-gradient(180deg, #4a8c19 0%, #3d7514 100%);
      }

      /* Firefox */
      .news-modal-body {
        scrollbar-width: thin;
        scrollbar-color: #5caa1f rgba(0, 0, 0, 0.1);
      }

      .news-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .news-item {
        background: var(--card-bg, #f9f9f9);
        border-radius: 8px;
        padding: 16px;
        border-left: 4px solid var(--primary-color, #5caa1f);
        transition: all 0.3s;
      }

      .news-item:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transform: translateX(4px);
      }

      .news-item.news-highlight {
        border-left-color: #ff6600;
        background: var(--highlight-bg, #fff8f0);
      }

      .news-item.news-important {
        border-left-color: #dc3545;
        background: var(--important-bg, #fff0f0);
        box-shadow: 0 0 8px rgba(220, 53, 69, 0.2);
      }

      .news-item-header {
        margin-bottom: 12px;
        position: relative;
      }

      .news-pin-icon {
        position: absolute;
        top: -8px;
        right: -8px;
        font-size: 20px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        transform: rotate(45deg);
        animation: pinPulse 2s ease-in-out infinite;
      }

      @keyframes pinPulse {
        0%, 100% { transform: rotate(45deg) scale(1); }
        50% { transform: rotate(45deg) scale(1.1); }
      }

      .news-pinned {
        /* Borda removida - mantém apenas o ícone de PIN */
      }

      .news-item-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        font-size: 13px;
      }

      .news-category {
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 600;
        color: #fff;
      }

      .news-category.evento { background: #ff6600; }
      .news-category.sistema { background: #2196F3; }
      .news-category.melhoria { background: #9C27B0; }
      .news-category.recurso { background: #4CAF50; }
      .news-category.correção { background: #FF9800; }
      .news-category.visual { background: #E91E63; }
      .news-category.lançamento { background: #F44336; }

      .news-date {
        color: var(--text-secondary, #666);
      }

      .news-version {
        padding: 2px 8px;
        background: var(--badge-bg, #e0e0e0);
        color: var(--text-color, #333);
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
      }

      .news-author-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
        border: 1px solid #d4af37;
        border-radius: 12px;
        font-size: 10px;
        font-weight: 700;
        color: #4a3500;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
        box-shadow: 0 2px 8px rgba(212, 175, 55, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5);
        flex-shrink: 0;
      }



      .news-author-badge .author-name {
        font-weight: 700;
        letter-spacing: 0.3px;
      }

      .news-author-badge .author-icon {
        width: 14px;
        height: 14px;
        object-fit: contain;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
      }

      .news-item-body {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .news-image {
        width: 80px;
        height: 80px;
        object-fit: contain;
        border-radius: 8px;
        background: transparent;
        padding: 8px;
        float: left;
        margin-right: 16px;
        margin-bottom: 8px;
      }

      .news-title {
        margin: 0;
        font-size: 18px;
        color: var(--text-color, #333);
      }

      .news-content {
        margin: 0;
        color: var(--text-secondary, #666);
        line-height: 1.6;
      }

      /* Estilos para destacar elementos nas notícias */
      .news-content .highlight {
        font-weight: 600;
        color: #ff8800;
      }

      .news-content .number {
        font-weight: 700;
        color: #d4af37;
        padding: 0 2px;
      }

      .news-content .item-name {
        font-weight: 600;
        color: #9c27b0;
        font-style: italic;
      }

      .news-content .important {
        font-weight: 700;
        color: var(--danger-color, #f44336);
        text-shadow: 0 0 1px rgba(244, 67, 54, 0.3);
      }

      .news-footer-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-top: 12px;
        flex-wrap: wrap;
      }

      .news-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        flex: 1;
      }

      .news-tag {
        padding: 3px 10px;
        background: var(--tag-bg, #e8f5e9);
        color: var(--tag-color, #2e7d32);
        border-radius: 12px;
        font-size: 11px;
        font-weight: 500;
      }

      .news-modal-footer {
        padding: 16px 24px;
        border-top: 2px solid var(--border-color, #e0e0e0);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 12px;
      }



      .pagination-buttons {
        display: flex;
        gap: 6px;
        align-items: center;
      }

      .pagination-btn {
        padding: 6px 12px;
        border: 1px solid var(--border-color, #ddd);
        background: var(--btn-bg, #fff);
        color: var(--text-color, #333);
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
      }

      .pagination-btn:hover {
        background: var(--primary-color, #5caa1f);
        color: white;
        border-color: var(--primary-color, #5caa1f);
      }

      .pagination-btn.active {
        background: var(--primary-color, #5caa1f);
        color: white;
        border-color: var(--primary-color, #5caa1f);
        font-weight: 600;
      }

      .pagination-dots {
        color: var(--text-secondary, #999);
        padding: 0 4px;
      }

      /* Dark Theme */
      .dark-theme .news-modal-content {
        background: #2a2a2a;
      }

      /* Scrollbar Dark Theme */
      .dark-theme .news-modal-body::-webkit-scrollbar {
        background: rgba(255, 255, 255, 0.05);
      }

      .dark-theme .news-modal-body::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.03);
      }

      .dark-theme .news-modal-body::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #6bc225 0%, #5caa1f 100%);
        border: 2px solid rgba(0, 0, 0, 0.2);
        box-shadow: 0 2px 6px rgba(107, 194, 37, 0.4);
      }

      .dark-theme .news-modal-body::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #7ec850 0%, #6bc225 100%);
        box-shadow: 0 2px 8px rgba(107, 194, 37, 0.6);
      }

      .dark-theme .news-modal-body::-webkit-scrollbar-thumb:active {
        background: linear-gradient(180deg, #5caa1f 0%, #4a8c19 100%);
      }

      .dark-theme .news-modal-body {
        scrollbar-color: #6bc225 rgba(255, 255, 255, 0.05);
      }

      .dark-theme .news-pinned {
        /* Borda removida - mantém apenas o ícone de PIN */
      }

      .dark-theme .news-modal-header {
        border-bottom-color: #444;
      }

      .dark-theme .news-modal-header h2 {
        color: #fff;
      }

      .dark-theme .news-modal-close {
        background: #dc3545;
        color: white;
      }

      .dark-theme .news-modal-close:hover {
        background: #c82333;
        color: white;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.4);
      }

      .dark-theme .news-item {
        background: #333;
      }

      .dark-theme .news-item.news-highlight {
        background: #3a2a1a;
      }

      .dark-theme .news-item.news-important {
        background: #3a1a1a;
        box-shadow: 0 0 8px rgba(220, 53, 69, 0.3);
      }

      .dark-theme .news-date {
        color: #aaa;
      }

      .dark-theme .news-version {
        background: #444;
        color: #fff;
      }

      .dark-theme .news-author-badge {
        background: linear-gradient(135deg, #d4af37 0%, #f0c875 50%, #d4af37 100%);
        border-color: #b8960f;
        color: #2a1f00;
        text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);
        box-shadow: 0 2px 10px rgba(212, 175, 55, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.4);
      }

      .dark-theme .news-title {
        color: #fff;
      }

      .dark-theme .news-content {
        color: #ccc;
      }

      /* Dark theme - destacues */
      .dark-theme .news-content .highlight {
        color: #ffaa44;
      }

      .dark-theme .news-content .number {
        color: #f0c875;
      }

      .dark-theme .news-content .item-name {
        color: #ce93d8;
      }

      .dark-theme .news-content .important {
        color: #ef5350;
      }

      .dark-theme .news-tag {
        background: #1a3a1a;
        color: #66bb6a;
      }

      .dark-theme .news-modal-footer {
        border-top-color: #444;
      }

      .dark-theme .news-dont-show {
        color: #aaa;
      }

      .dark-theme .pagination-btn {
        background: #333;
        color: #fff;
        border-color: #444;
      }

      .dark-theme .pagination-btn:hover {
        background: #5caa1f;
        border-color: #5caa1f;
      }

      /* Mobile */
      @media (max-width: 768px) {
        .news-modal-content {
          width: 95%;
          max-height: 90vh;
        }

        .news-modal-header {
          padding: 16px;
        }

        .news-modal-header h2 {
          font-size: 20px;
        }

        .news-modal-body {
          padding: 16px;
        }

        .news-item {
          padding: 12px;
        }

        .news-title {
          font-size: 16px;
        }

        .news-content {
          font-size: 14px;
        }

        .news-image {
          width: 60px;
          height: 60px;
        }

        .news-modal-footer {
          flex-direction: column;
          align-items: center;
        }

        .pagination-buttons {
          width: 100%;
          justify-content: center;
        }
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Destroy - limpa recursos
   */
  destroy() {
    if (this.modal && this.modal.parentNode) {
      this.modal.parentNode.removeChild(this.modal);
    }

    const style = document.getElementById("news-modal-styles");
    if (style && style.parentNode) {
      style.parentNode.removeChild(style);
    }

    this.initialized = false;
    console.log("🗑️ NewsModal destruído");
  }
}
