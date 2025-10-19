/**
 * FazendaRPG - Market UI
 * Manages market display, buying and selling items
 * @version 0.0.2
 */

export default class MarketUI {
    constructor(player, inventorySystem, modal, notifications) {
        this.player = player;
        this.inventorySystem = inventorySystem;
        this.modal = modal;
        this.notifications = notifications;
        this.container = null;
        this.itemsData = null;
        this.currentTab = 'buy';
    }

    /**
     * Initialize Market UI
     */
    async init() {
        this.container = document.getElementById('market-grid');
        if (!this.container) {
            console.error('❌ Market container not found');
            return false;
        }

        // Load items data
        try {
            const response = await fetch('./data/items.json');
            if (!response.ok) {
                throw new Error('Failed to load items data');
            }

            const data = await response.json();
            this.itemsData = data.items;

            this.setupControls();

            console.log('✅ Market UI initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize Market UI:', error);
            return false;
        }
    }

    /**
     * Setup market controls
     */
    setupControls() {
        const screenHeader = document.querySelector('#market-screen .screen-header');
        if (!screenHeader) return;

        // Check if controls already exist
        if (screenHeader.querySelector('.market-controls')) return;

        const controlsHTML = `
            <div class="market-controls">
                <div class="market-tabs">
                    <button id="market-tab-buy" class="market-tab active" data-tab="buy">
                        🛒 Comprar
                    </button>
                    <button id="market-tab-sell" class="market-tab" data-tab="sell">
                        💰 Vender
                    </button>
                </div>
                <div class="market-stats">
                    <span class="stat-badge">💰 <span id="market-player-gold">0</span>g</span>
                </div>
            </div>
        `;

        screenHeader.insertAdjacentHTML('beforeend', controlsHTML);

        // Add event listeners
        document.querySelectorAll('.market-tab').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Add styles
        this.addStyles();
    }

    /**
     * Add market styles
     */
    addStyles() {
        if (document.getElementById('market-ui-styles')) return;

        const style = document.createElement('style');
        style.id = 'market-ui-styles';
        style.textContent = `
            .market-controls {
                margin-top: var(--spacing-md);
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }

            .market-tabs {
                display: flex;
                gap: var(--spacing-sm);
            }

            .market-tab {
                flex: 1;
                padding: 12px 24px;
                background: var(--bg-secondary);
                border: 2px solid var(--border-color);
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                color: var(--text-primary);
                cursor: pointer;
                transition: all var(--transition-fast);
            }

            .market-tab:hover {
                border-color: var(--brand-primary);
                transform: translateY(-2px);
            }

            .market-tab.active {
                background: var(--brand-primary);
                color: white;
                border-color: var(--brand-tertiary);
            }

            .market-stats {
                display: flex;
                justify-content: center;
                gap: var(--spacing-sm);
            }

            .market-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: var(--spacing-md);
                padding: var(--spacing-md) 0;
            }

            .market-item {
                background: var(--bg-secondary);
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius-sm);
                padding: var(--spacing-md);
                cursor: pointer;
                transition: all var(--transition-fast);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: var(--spacing-sm);
                position: relative;
            }

            .market-item:hover {
                transform: translateY(-4px);
                box-shadow: 0 6px 16px var(--shadow-color);
                border-color: var(--brand-primary);
            }

            .market-item-icon {
                font-size: 3rem;
                line-height: 1;
            }

            .market-item-name {
                font-weight: 600;
                font-size: 0.875rem;
                color: var(--text-primary);
                text-align: center;
                word-break: break-word;
            }

            .market-item-price {
                background: var(--brand-primary);
                color: white;
                padding: 6px 12px;
                border-radius: 12px;
                font-size: 0.875rem;
                font-weight: 700;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .market-item-stock {
                font-size: 0.75rem;
                color: var(--text-secondary);
                font-weight: 600;
            }

            .market-item.out-of-stock {
                opacity: 0.5;
                cursor: not-allowed;
            }

            .market-item.out-of-stock:hover {
                transform: none;
                box-shadow: none;
                border-color: var(--border-color);
            }

            .market-empty {
                grid-column: 1 / -1;
                text-align: center;
                padding: var(--spacing-xl);
                color: var(--text-secondary);
            }

            .npc-card {
                background: var(--bg-secondary);
                border: 2px solid var(--border-color);
                border-radius: var(--border-radius);
                padding: var(--spacing-lg);
                cursor: pointer;
                transition: all var(--transition-fast);
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }

            .npc-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 6px 16px var(--shadow-color);
                border-color: var(--brand-primary);
            }

            .npc-avatar {
                font-size: 4rem;
                text-align: center;
                line-height: 1;
            }

            .npc-info {
                text-align: center;
            }

            .npc-name {
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--text-primary);
                margin: 0 0 0.25rem 0;
            }

            .npc-role {
                font-size: 0.875rem;
                color: var(--brand-primary);
                font-weight: 600;
                margin: 0 0 0.5rem 0;
            }

            .npc-description {
                font-size: 0.875rem;
                color: var(--text-secondary);
                margin: 0 0 0.5rem 0;
            }

            .npc-badge {
                display: inline-block;
                padding: 4px 8px;
                background: var(--bg-accent);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                font-size: 0.75rem;
                font-weight: 600;
                margin: 2px;
            }

            .npc-friendship {
                margin-top: var(--spacing-sm);
            }

            .friendship-label {
                font-size: 0.75rem;
                font-weight: 600;
                color: var(--text-secondary);
                margin-bottom: 0.25rem;
            }

            .friendship-bar {
                height: 12px;
                background: var(--bg-accent);
                border-radius: 6px;
                overflow: hidden;
                border: 2px solid var(--border-color);
            }

            .friendship-fill {
                height: 100%;
                background: linear-gradient(90deg, #e74c3c, #f39c12, #5caa1f);
                transition: width 0.3s;
            }

            @media (max-width: 480px) {
                .market-grid {
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: var(--spacing-sm);
                }

                .market-item-icon {
                    font-size: 2.5rem;
                }

                .market-tab {
                    padding: 8px 16px;
                    font-size: 0.875rem;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * Switch tab
     * @param {string} tab - Tab name (buy/sell)
     */
    switchTab(tab) {
        this.currentTab = tab;

        // Update active tab
        document.querySelectorAll('.market-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        this.render();
    }

    /**
     * Render market
     */
    render() {
        if (!this.container) return;

        this.updatePlayerGold();

        this.container.innerHTML = '';

        if (this.currentTab === 'buy') {
            this.renderBuyTab();
        } else {
            this.renderSellTab();
        }
    }

    /**
     * Update player gold display
     */
    updatePlayerGold() {
        const goldEl = document.getElementById('market-player-gold');
        if (goldEl) {
            goldEl.textContent = this.player.data.gold || 0;
        }
    }

    /**
     * Render buy tab
     */
    renderBuyTab() {
        const buyableItems = Object.values(this.itemsData).filter(item => item.buyPrice > 0);

        if (buyableItems.length === 0) {
            this.container.innerHTML = `
                <div class="market-empty">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🛒</div>
                    <p>Nenhum item disponível para compra</p>
                </div>
            `;
            return;
        }

        buyableItems.forEach(item => {
            const itemEl = this.createMarketItem(item, 'buy');
            this.container.appendChild(itemEl);
        });
    }

    /**
     * Render sell tab
     */
    renderSellTab() {
        const sellableItems = this.inventorySystem.getSellables();

        if (sellableItems.length === 0) {
            this.container.innerHTML = `
                <div class="market-empty">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">💰</div>
                    <p>Você não tem itens para vender</p>
                    <p style="margin-top: 0.5rem; font-size: 0.875rem;">Plante e colha para conseguir itens!</p>
                </div>
            `;
            return;
        }

        sellableItems.forEach(item => {
            const itemEl = this.createMarketItem(item, 'sell');
            this.container.appendChild(itemEl);
        });
    }

    /**
     * Create market item element
     * @param {Object} item - Item data
     * @param {string} mode - 'buy' or 'sell'
     * @returns {HTMLElement}
     */
    createMarketItem(item, mode) {
        const itemEl = document.createElement('div');
        itemEl.className = 'market-item';

        const price = mode === 'buy' ? item.buyPrice : item.sellPrice;
        const priceLabel = mode === 'buy' ? 'Comprar' : 'Vender';

        itemEl.innerHTML = `
            <div class="market-item-icon">${item.icon || '📦'}</div>
            <div class="market-item-name">${item.name}</div>
            <div class="market-item-price">${priceLabel}: ${price}g</div>
            ${mode === 'sell' && item.count ? `<div class="market-item-stock">Estoque: ${item.count}</div>` : ''}
        `;

        itemEl.addEventListener('click', () => {
            if (mode === 'buy') {
                this.showBuyDialog(item);
            } else {
                this.showSellDialog(item);
            }
        });

        return itemEl;
    }

    /**
     * Show buy dialog
     * @param {Object} item - Item to buy
     */
    showBuyDialog(item) {
        const unitPrice = item.buyPrice || 0;
        const playerGold = this.player.data.gold || 0;
        const maxAmount = Math.floor(playerGold / unitPrice);

        if (maxAmount === 0) {
            this.notifications.show('Você não tem ouro suficiente!', 'error');
            return;
        }

        let amount = 1;
        const updatePreview = () => {
            const total = amount * unitPrice;
            const previewEl = document.getElementById('buy-preview');
            if (previewEl) {
                previewEl.innerHTML = `
                    <div style="font-size: 1.25rem; font-weight: 700;">Total: ${total}g</div>
                    <div style="font-size: 0.875rem; margin-top: 0.25rem;">Restante: ${playerGold - total}g</div>
                `;
            }
        };

        const content = `
            <div style="padding: 1rem 0;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${item.icon || '📦'}</div>
                    <h3 style="margin: 0;">${item.name}</h3>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0;">
                        ${item.description || 'Sem descrição'}
                    </p>
                    <p style="color: var(--brand-primary); font-weight: 700; margin: 0.5rem 0;">
                        Preço unitário: ${unitPrice} ouro
                    </p>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                        Quantidade (máx: ${maxAmount})
                    </label>
                    <input
                        type="number"
                        id="buy-amount"
                        min="1"
                        max="${maxAmount}"
                        value="1"
                        style="width: 100%; padding: 0.75rem; font-size: 1rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--bg-accent); color: var(--text-primary);"
                    />
                    <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-secondary" onclick="document.getElementById('buy-amount').value = 1; document.getElementById('buy-amount').dispatchEvent(new Event('input'));">1</button>
                        <button class="btn btn-sm btn-secondary" onclick="document.getElementById('buy-amount').value = Math.floor(${maxAmount} / 2); document.getElementById('buy-amount').dispatchEvent(new Event('input'));">50%</button>
                        <button class="btn btn-sm btn-secondary" onclick="document.getElementById('buy-amount').value = ${maxAmount}; document.getElementById('buy-amount').dispatchEvent(new Event('input'));">Máx</button>
                    </div>
                </div>

                <div id="buy-preview" style="padding: 1rem; background: var(--brand-primary); color: white; border-radius: 8px; text-align: center;">
                    <div style="font-size: 1.25rem; font-weight: 700;">Total: ${unitPrice}g</div>
                    <div style="font-size: 0.875rem; margin-top: 0.25rem;">Restante: ${playerGold - unitPrice}g</div>
                </div>
            </div>
        `;

        this.modal.show({
            title: '🛒 Comprar Item',
            content,
            buttons: [
                {
                    text: 'Cancelar',
                    class: 'btn-secondary',
                    onClick: () => true
                },
                {
                    text: 'Comprar',
                    class: 'btn-success',
                    onClick: () => {
                        const input = document.getElementById('buy-amount');
                        amount = parseInt(input?.value || '1');

                        if (amount < 1 || amount > maxAmount) {
                            this.notifications.show('Quantidade inválida', 'error');
                            return false;
                        }

                        const totalCost = amount * unitPrice;

                        if (this.player.data.gold < totalCost) {
                            this.notifications.show('Ouro insuficiente!', 'error');
                            return false;
                        }

                        // Remove gold
                        this.player.removeGold(totalCost);

                        // Add item
                        const result = this.inventorySystem.addItem(item.id, amount);

                        if (result.success) {
                            this.notifications.show(
                                `Comprou ${amount}x ${item.name} por ${totalCost} ouro!`,
                                'success'
                            );
                            this.render();
                            return true;
                        } else {
                            // Refund gold
                            this.player.addGold(totalCost);
                            this.notifications.show(result.error || 'Erro ao comprar', 'error');
                            return false;
                        }
                    }
                }
            ],
            closable: true
        }).then(() => {
            // Setup amount input listener after modal is shown
            setTimeout(() => {
                const input = document.getElementById('buy-amount');
                if (input) {
                    input.addEventListener('input', (e) => {
                        amount = parseInt(e.target.value) || 1;
                        amount = Math.max(1, Math.min(maxAmount, amount));
                        e.target.value = amount;
                        updatePreview();
                    });
                }
            }, 100);
        });
    }

    /**
     * Show sell dialog
     * @param {Object} item - Item to sell
     */
    showSellDialog(item) {
        const maxAmount = item.count;
        const unitPrice = item.sellPrice || 0;

        if (unitPrice === 0) {
            this.notifications.show('Este item não pode ser vendido', 'warning');
            return;
        }

        let amount = 1;
        const updatePreview = () => {
            const total = amount * unitPrice;
            const previewEl = document.getElementById('sell-preview');
            if (previewEl) {
                previewEl.textContent = `Total: ${total} ouro`;
            }
        };

        const content = `
            <div style="padding: 1rem 0;">
                <div style="text-align: center; margin-bottom: 1.5rem;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">${item.icon || '📦'}</div>
                    <h3 style="margin: 0;">${item.name}</h3>
                    <p style="color: var(--text-secondary); margin: 0.5rem 0;">
                        Valor unitário: ${unitPrice} ouro
                    </p>
                </div>

                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                        Quantidade (máx: ${maxAmount})
                    </label>
                    <input
                        type="number"
                        id="sell-amount"
                        min="1"
                        max="${maxAmount}"
                        value="1"
                        style="width: 100%; padding: 0.75rem; font-size: 1rem; border: 2px solid var(--border-color); border-radius: 8px; background: var(--bg-accent); color: var(--text-primary);"
                    />
                    <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                        <button class="btn btn-sm btn-secondary" onclick="document.getElementById('sell-amount').value = 1; document.getElementById('sell-amount').dispatchEvent(new Event('input'));">1</button>
                        <button class="btn btn-sm btn-secondary" onclick="document.getElementById('sell-amount').value = Math.floor(${maxAmount} / 2); document.getElementById('sell-amount').dispatchEvent(new Event('input'));">50%</button>
                        <button class="btn btn-sm btn-secondary" onclick="document.getElementById('sell-amount').value = ${maxAmount}; document.getElementById('sell-amount').dispatchEvent(new Event('input'));">Tudo</button>
                    </div>
                </div>

                <div id="sell-preview" style="padding: 1rem; background: var(--brand-primary); color: white; border-radius: 8px; text-align: center; font-size: 1.25rem; font-weight: 700;">
                    Total: ${unitPrice} ouro
                </div>
            </div>
        `;

        this.modal.show({
            title: '💰 Vender Item',
            content,
            buttons: [
                {
                    text: 'Cancelar',
                    class: 'btn-secondary',
                    onClick: () => true
                },
                {
                    text: 'Vender',
                    class: 'btn-success',
                    onClick: () => {
                        const input = document.getElementById('sell-amount');
                        amount = parseInt(input?.value || '1');

                        if (amount < 1 || amount > maxAmount) {
                            this.notifications.show('Quantidade inválida', 'error');
                            return false;
                        }

                        const result = this.inventorySystem.sellItem(item.id, amount);
                        if (result.success) {
                            this.notifications.show(
                                `Vendeu ${amount}x ${item.name} por ${result.gold} ouro!`,
                                'success'
                            );
                            this.render();
                            return true;
                        } else {
                            this.notifications.show(result.error || 'Erro ao vender', 'error');
                            return false;
                        }
                    }
                }
            ],
            closable: true
        }).then(() => {
            // Setup amount input listener after modal is shown
            setTimeout(() => {
                const input = document.getElementById('sell-amount');
                if (input) {
                    input.addEventListener('input', (e) => {
                        amount = parseInt(e.target.value) || 1;
                        amount = Math.max(1, Math.min(maxAmount, amount));
                        e.target.value = amount;
                        updatePreview();
                    });
                }
            }, 100);
        });
    }

    /**
     * Refresh render
     */
    refresh() {
        this.render();
    }
}
