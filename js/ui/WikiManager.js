/**
 * FazendaRPG - Wiki Manager
 * Manages wiki navigation, search and content display
 * @version 0.0.8
 */

export default class WikiManager {
  constructor() {
    this.currentPage = "getting-started";
    this.wikiPages = new Map();
    this.searchTimeout = null;
  }

  /**
   * Initialize Wiki Manager
   */
  init() {
    console.log("📚 Initializing Wiki Manager...");

    // Get all wiki pages
    const pages = document.querySelectorAll(".wiki-page");
    pages.forEach((page) => {
      const pageId = page.dataset.page;
      if (pageId) {
        this.wikiPages.set(pageId, {
          element: page,
          title: page.querySelector(".wiki-page-title")?.textContent || "",
          content: page.textContent.toLowerCase(),
        });
      }
    });

    // Setup navigation
    this.setupNavigation();

    // Setup search
    this.setupSearch();

    // Show default page
    this.showPage("getting-started");

    console.log("✅ Wiki Manager initialized");
  }

  /**
   * Setup wiki navigation
   */
  setupNavigation() {
    const navItems = document.querySelectorAll(".wiki-nav-item");

    navItems.forEach((item) => {
      item.addEventListener("click", () => {
        const pageId = item.dataset.wikiPage;
        if (pageId) {
          this.showPage(pageId);

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

    // Find matching pages
    const matches = [];
    this.wikiPages.forEach((page, pageId) => {
      if (page.content.includes(query)) {
        matches.push({
          id: pageId,
          title: page.title,
          relevance: this.calculateRelevance(page.content, query),
        });
      }
    });

    // Sort by relevance
    matches.sort((a, b) => b.relevance - a.relevance);

    // Show first match if any
    if (matches.length > 0) {
      this.showPage(matches[0].id);
      this.highlightSearchTerms(query);

      console.log(`🔍 Found ${matches.length} matches for "${query}"`);
    }
  }

  /**
   * Calculate relevance score
   * @param {string} content - Content to search
   * @param {string} query - Search query
   * @returns {number} Relevance score
   */
  calculateRelevance(content, query) {
    const occurrences = (content.match(new RegExp(query, "gi")) || []).length;
    return occurrences;
  }

  /**
   * Highlight search terms in current page
   * @param {string} query - Search query
   */
  highlightSearchTerms(query) {
    const activePage = document.querySelector(".wiki-page.active");
    if (!activePage) return;

    // Remove previous highlights
    this.clearSearchHighlights();

    // Add highlights
    const walker = document.createTreeWalker(
      activePage,
      NodeFilter.SHOW_TEXT,
      null,
      false,
    );

    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) {
      if (
        node.textContent.toLowerCase().includes(query) &&
        node.parentElement.tagName !== "SCRIPT"
      ) {
        textNodes.push(node);
      }
    }

    textNodes.forEach((textNode) => {
      const parent = textNode.parentElement;
      const text = textNode.textContent;
      const regex = new RegExp(`(${query})`, "gi");
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
    const firstHighlight = activePage.querySelector(".wiki-search-highlight");
    if (firstHighlight) {
      firstHighlight.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  /**
   * Clear search highlights
   */
  clearSearchHighlights() {
    const highlights = document.querySelectorAll(".wiki-search-highlight");
    highlights.forEach((highlight) => {
      const parent = highlight.parentElement;
      if (parent) {
        parent.replaceWith(document.createTextNode(parent.textContent));
      }
    });
  }

  /**
   * Show specific wiki page
   * @param {string} pageId - Page ID to show
   */
  showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll(".wiki-page");
    pages.forEach((page) => page.classList.remove("active"));

    // Show requested page
    const pageToShow = document.querySelector(
      `.wiki-page[data-page="${pageId}"]`,
    );
    if (pageToShow) {
      pageToShow.classList.add("active");
      this.currentPage = pageId;

      console.log(`📄 Showing wiki page: ${pageId}`);
    }
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
  navigateTo(pageId, sectionId = null) {
    this.showPage(pageId);

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
