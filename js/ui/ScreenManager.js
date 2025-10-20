/**
 * FazendaRPG - Screen Manager
 * Manages different game screens and transitions between them
 * @version 0.0.5
 */

export default class ScreenManager {
    constructor() {
        this.currentScreen = null;
        this.screens = new Map();
        this.history = [];
        this.maxHistory = 10;
    }

    /**
     * Initialize screen manager
     */
    init() {
        this.cacheScreens();
        this.attachEventListeners();
        console.log('✅ Screen manager initialized');
    }

    /**
     * Cache all screen elements
     */
    cacheScreens() {
        const screenElements = document.querySelectorAll('.screen');

        screenElements.forEach(screen => {
            const id = screen.id;
            this.screens.set(id, {
                element: screen,
                id: id,
                active: screen.classList.contains('active')
            });

            if (screen.classList.contains('active')) {
                this.currentScreen = id;
            }
        });

        console.log(`📺 Cached ${this.screens.size} screens`);
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Listen for navigation events
        window.addEventListener('navigate', (e) => {
            this.showScreen(e.detail.screenId);
        });

        // Browser back button
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.screenId) {
                this.showScreen(e.state.screenId, false);
            }
        });
    }

    /**
     * Show a specific screen
     * @param {string} screenId - Screen ID to show
     * @param {boolean} addToHistory - Whether to add to history
     * @returns {boolean} Success
     */
    showScreen(screenId, addToHistory = true) {
        if (!this.screens.has(screenId)) {
            console.warn(`⚠️ Screen not found: ${screenId}`);
            return false;
        }

        const previousScreen = this.currentScreen;

        // Hide all screens
        this.screens.forEach((screen) => {
            screen.element.classList.remove('active');
            screen.active = false;
        });

        // Show requested screen
        const screen = this.screens.get(screenId);
        screen.element.classList.add('active');
        screen.active = true;

        // Update current screen
        this.currentScreen = screenId;

        // Add to history
        if (addToHistory && previousScreen !== screenId) {
            this.addToHistory(screenId);
        }

        // Dispatch event
        window.dispatchEvent(new CustomEvent('screen:changed', {
            detail: {
                screenId,
                previousScreen
            }
        }));

        console.log(`📺 Screen changed: ${previousScreen} → ${screenId}`);

        return true;
    }

    /**
     * Get current screen ID
     * @returns {string|null} Current screen ID
     */
    getCurrentScreen() {
        return this.currentScreen;
    }

    /**
     * Check if screen is active
     * @param {string} screenId - Screen ID
     * @returns {boolean} True if active
     */
    isScreenActive(screenId) {
        const screen = this.screens.get(screenId);
        return screen ? screen.active : false;
    }

    /**
     * Add screen to history
     * @param {string} screenId - Screen ID
     */
    addToHistory(screenId) {
        this.history.push(screenId);

        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        // Update browser history
        if (window.history && window.history.pushState) {
            window.history.pushState(
                { screenId },
                '',
                `#${screenId.replace('-screen', '')}`
            );
        }
    }

    /**
     * Go back to previous screen
     * @returns {boolean} Success
     */
    goBack() {
        if (this.history.length < 2) {
            return false;
        }

        // Remove current screen from history
        this.history.pop();

        // Get previous screen
        const previousScreen = this.history[this.history.length - 1];

        // Show previous screen without adding to history
        return this.showScreen(previousScreen, false);
    }

    /**
     * Clear history
     */
    clearHistory() {
        this.history = [];
        console.log('🗑️ Screen history cleared');
    }

    /**
     * Get screen element
     * @param {string} screenId - Screen ID
     * @returns {HTMLElement|null} Screen element
     */
    getScreenElement(screenId) {
        const screen = this.screens.get(screenId);
        return screen ? screen.element : null;
    }

    /**
     * Refresh current screen
     */
    refreshCurrentScreen() {
        if (this.currentScreen) {
            // Dispatch refresh event for current screen
            window.dispatchEvent(new CustomEvent('screen:refresh', {
                detail: { screenId: this.currentScreen }
            }));
        }
    }

    /**
     * Show screen with transition
     * @param {string} screenId - Screen ID
     * @param {string} transition - Transition type (fade, slide, etc.)
     */
    showScreenWithTransition(screenId, transition = 'fade') {
        const currentElement = this.getScreenElement(this.currentScreen);
        const nextElement = this.getScreenElement(screenId);

        if (!currentElement || !nextElement) {
            return this.showScreen(screenId);
        }

        // Add transition class
        currentElement.classList.add(`transition-${transition}-out`);

        setTimeout(() => {
            this.showScreen(screenId);
            nextElement.classList.add(`transition-${transition}-in`);

            setTimeout(() => {
                currentElement.classList.remove(`transition-${transition}-out`);
                nextElement.classList.remove(`transition-${transition}-in`);
            }, 300);
        }, 300);
    }

    /**
     * Add a new screen dynamically
     * @param {string} screenId - Screen ID
     * @param {HTMLElement} element - Screen element
     */
    addScreen(screenId, element) {
        if (this.screens.has(screenId)) {
            console.warn(`⚠️ Screen already exists: ${screenId}`);
            return false;
        }

        element.classList.add('screen');
        element.id = screenId;

        this.screens.set(screenId, {
            element,
            id: screenId,
            active: false
        });

        console.log(`➕ Screen added: ${screenId}`);
        return true;
    }

    /**
     * Remove a screen
     * @param {string} screenId - Screen ID
     */
    removeScreen(screenId) {
        if (!this.screens.has(screenId)) {
            console.warn(`⚠️ Screen not found: ${screenId}`);
            return false;
        }

        const screen = this.screens.get(screenId);
        screen.element.remove();
        this.screens.delete(screenId);

        console.log(`➖ Screen removed: ${screenId}`);
        return true;
    }

    /**
     * Get all screen IDs
     * @returns {Array<string>} Array of screen IDs
     */
    getAllScreenIds() {
        return Array.from(this.screens.keys());
    }

    /**
     * Get history
     * @returns {Array<string>} Screen history
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Clean up
     */
    destroy() {
        this.screens.clear();
        this.history = [];
        this.currentScreen = null;
    }
}
