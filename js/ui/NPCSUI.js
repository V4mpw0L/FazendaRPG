/**
 * FazendaRPG - NPCs UI
 * Manages NPC display and interactions
 * @version 0.0.1
 */

export default class NPCSUI {
    constructor(player, modal, notifications) {
        this.player = player;
        this.modal = modal;
        this.notifications = notifications;
        this.container = null;
        this.npcsData = null;
    }

    /**
     * Initialize NPCs UI
     */
    async init() {
        this.container = document.getElementById('npcs-grid');
        if (!this.container) {
            console.error('❌ NPCs container not found');
            return false;
        }

        // Load NPCs data
        try {
            const response = await fetch('./data/npcs.json');
            if (!response.ok) {
                throw new Error('Failed to load NPCs data');
            }

            const data = await response.json();
            this.npcsData = data.npcs;

            console.log('✅ NPCs UI initialized');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize NPCs UI:', error);
            return false;
        }
    }

    /**
     * Render NPCs
     */
    render() {
        if (!this.container || !this.npcsData) return;

        this.container.innerHTML = '';

        const npcs = Object.values(this.npcsData);

        if (npcs.length === 0) {
            this.container.innerHTML = `
                <div class="npcs-empty">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">👥</div>
                    <p>Nenhum NPC disponível</p>
                </div>
            `;
            return;
        }

        npcs.forEach(npc => {
            const npcCard = this.createNPCCard(npc);
            this.container.appendChild(npcCard);
        });
    }

    /**
     * Create NPC card element
     * @param {Object} npc - NPC data
     * @returns {HTMLElement}
     */
    createNPCCard(npc) {
        const card = document.createElement('div');
        card.className = 'npc-card';

        const friendshipPercent = (npc.friendship / npc.maxFriendship) * 100;
        const name = npc.namePtBR || npc.name;
        const role = npc.rolePtBR || npc.role;
        const description = npc.descriptionPtBR || npc.description;

        card.innerHTML = `
            <div class="npc-avatar">${npc.avatar}</div>
            <div class="npc-info">
                <h3 class="npc-name">${name}</h3>
                <p class="npc-role">${role}</p>
                <p class="npc-description">${description}</p>
                ${npc.shop ? '<div class="npc-badge">🛒 Loja</div>' : ''}
                ${npc.quests && npc.quests.length > 0 ? '<div class="npc-badge">📜 Missões</div>' : ''}
            </div>
            <div class="npc-friendship">
                <div class="friendship-label">Amizade: ${Math.floor(friendshipPercent)}%</div>
                <div class="friendship-bar">
                    <div class="friendship-fill" style="width: ${friendshipPercent}%"></div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.showNPCDialog(npc);
        });

        return card;
    }

    /**
     * Show NPC dialog
     * @param {Object} npc - NPC data
     */
    showNPCDialog(npc) {
        const name = npc.namePtBR || npc.name;
        const greetings = npc.dialogue?.greetingPtBR || npc.dialogue?.greeting || ['Olá!'];
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];

        const buttons = [];

        // Shop button
        if (npc.shop) {
            buttons.push({
                text: '🛒 Ver Loja',
                class: 'btn-primary',
                onClick: () => {
                    this.showNPCShop(npc);
                    return false; // Don't close modal
                }
            });
        }

        // Quests button
        if (npc.quests && npc.quests.length > 0) {
            buttons.push({
                text: '📜 Missões',
                class: 'btn-success',
                onClick: () => {
                    this.notifications.show('Sistema de missões em breve!', 'info');
                    return false;
                }
            });
        }

        // Talk button
        buttons.push({
            text: '💬 Conversar',
            class: 'btn-secondary',
            onClick: () => {
                this.increaseFriendship(npc.id, 1);
                this.notifications.show('Você conversou com ' + name, 'success');
                this.render();
                return true;
            }
        });

        buttons.push({
            text: 'Sair',
            class: 'btn-secondary',
            onClick: () => true
        });

        const content = `
            <div style="text-align: center; padding: 1rem 0;">
                <div style="font-size: 5rem; margin-bottom: 1rem;">${npc.avatar}</div>
                <h2 style="margin: 0.5rem 0;">${name}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">${npc.rolePtBR || npc.role}</p>
                <div style="background: var(--bg-accent); padding: 1rem; border-radius: 8px; border-left: 4px solid var(--brand-primary); margin-bottom: 1rem;">
                    <p style="font-style: italic; margin: 0;">"${greeting}"</p>
                </div>
                <div style="margin-top: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; justify-content: center;">
                        <span style="font-weight: 600;">Amizade:</span>
                        <div style="flex: 1; max-width: 200px; background: var(--bg-accent); height: 20px; border-radius: 10px; overflow: hidden; border: 2px solid var(--border-color);">
                            <div style="height: 100%; background: linear-gradient(90deg, #e74c3c, #f39c12, #5caa1f); width: ${(npc.friendship / npc.maxFriendship) * 100}%; transition: width 0.3s;"></div>
                        </div>
                        <span style="font-weight: 700;">${npc.friendship}/${npc.maxFriendship}</span>
                    </div>
                </div>
            </div>
        `;

        this.modal.show({
            title: `👥 ${name}`,
            content,
            buttons,
            closable: true,
            size: 'medium'
        });
    }

    /**
     * Show NPC shop
     * @param {Object} npc - NPC data
     */
    showNPCShop(npc) {
        this.notifications.show('Sistema de loja em desenvolvimento!', 'info');
        // TODO: Implement shop system
    }

    /**
     * Increase friendship with NPC
     * @param {string} npcId - NPC ID
     * @param {number} amount - Amount to increase
     */
    increaseFriendship(npcId, amount) {
        if (!this.npcsData[npcId]) return;

        this.npcsData[npcId].friendship = Math.min(
            this.npcsData[npcId].maxFriendship,
            this.npcsData[npcId].friendship + amount
        );

        // TODO: Save to player data
    }

    /**
     * Refresh render
     */
    refresh() {
        this.render();
    }
}
