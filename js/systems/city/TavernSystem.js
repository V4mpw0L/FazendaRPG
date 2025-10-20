/**
 * FazendaRPG - Tavern System
 * Manages tavern activities: rest, meals, stories, and social interactions
 * @version 0.0.6
 */

export default class TavernSystem {
    constructor(player) {
        this.player = player;
        this.restCost = 50;
        this.restEnergyRestore = 50;
        this.mealCosts = {
            simple: { cost: 25, energy: 25, health: 10 },
            standard: { cost: 50, energy: 50, health: 25 },
            deluxe: { cost: 100, energy: 100, health: 50 }
        };
        this.storyCost = 10;
        this.storyXP = 5;
    }

    /**
     * Initialize tavern system
     */
    init() {
        // Initialize tavern data if not exists
        if (!this.player.data.tavern) {
            this.player.data.tavern = {
                totalVisits: 0,
                totalRests: 0,
                totalMeals: 0,
                totalStories: 0,
                favoriteStory: null,
                lastVisit: null,
                reputation: 0
            };
        }

        console.log('🍺 Tavern system initialized');
        return true;
    }

    /**
     * Rest at the tavern (restore energy)
     * @returns {Object} Result
     */
    rest() {
        // Check if already at max energy
        if (this.player.data.energy >= this.player.data.maxEnergy) {
            return {
                success: false,
                error: 'Você já está com energia máxima!'
            };
        }

        // Check gold
        if (this.player.data.gold < this.restCost) {
            return {
                success: false,
                error: `Você precisa de ${this.restCost} ouro para descansar`
            };
        }

        // Remove gold
        this.player.removeGold(this.restCost);

        // Restore energy
        const energyBefore = this.player.data.energy;
        const restored = Math.min(
            this.restEnergyRestore,
            this.player.data.maxEnergy - this.player.data.energy
        );
        this.player.addEnergy(restored);

        // Update stats
        this.player.data.tavern.totalRests++;
        this.player.data.tavern.totalVisits++;
        this.player.data.tavern.lastVisit = Date.now();
        this.player.data.tavern.reputation += 1;

        console.log(`🍺 Rested at tavern, restored ${restored} energy`);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('tavern:rest', {
            detail: { restored, cost: this.restCost }
        }));

        return {
            success: true,
            restored,
            cost: this.restCost,
            energyBefore,
            energyAfter: this.player.data.energy
        };
    }

    /**
     * Buy and eat a meal
     * @param {string} mealType - Type of meal (simple, standard, deluxe)
     * @returns {Object} Result
     */
    buyMeal(mealType) {
        const meal = this.mealCosts[mealType];

        if (!meal) {
            return {
                success: false,
                error: 'Tipo de refeição inválido!'
            };
        }

        // Check gold
        if (this.player.data.gold < meal.cost) {
            return {
                success: false,
                error: `Você precisa de ${meal.cost} ouro para esta refeição`
            };
        }

        // Remove gold
        this.player.removeGold(meal.cost);

        // Restore energy
        const energyRestored = Math.min(
            meal.energy,
            this.player.data.maxEnergy - this.player.data.energy
        );
        this.player.addEnergy(energyRestored);

        // Restore health
        if (!this.player.data.health) {
            this.player.data.health = 100;
        }
        if (!this.player.data.maxHealth) {
            this.player.data.maxHealth = 100;
        }
        const healthRestored = Math.min(
            meal.health,
            this.player.data.maxHealth - this.player.data.health
        );
        this.player.data.health = Math.min(
            this.player.data.maxHealth,
            this.player.data.health + healthRestored
        );

        // Update stats
        this.player.data.tavern.totalMeals++;
        this.player.data.tavern.totalVisits++;
        this.player.data.tavern.lastVisit = Date.now();
        this.player.data.tavern.reputation += 2;

        console.log(`🍺 Ate ${mealType} meal: +${energyRestored} energy, +${healthRestored} health`);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('tavern:meal', {
            detail: {
                mealType,
                cost: meal.cost,
                energyRestored,
                healthRestored
            }
        }));

        return {
            success: true,
            mealType,
            cost: meal.cost,
            energyRestored,
            healthRestored
        };
    }

    /**
     * Listen to a story (gain small XP)
     * @returns {Object} Result
     */
    listenToStory() {
        // Check gold
        if (this.player.data.gold < this.storyCost) {
            return {
                success: false,
                error: `Você precisa de ${this.storyCost} ouro para ouvir histórias`
            };
        }

        // Remove gold
        this.player.removeGold(this.storyCost);

        // Add XP
        this.player.addXP(this.storyXP);

        // Get random story
        const story = this.getRandomStory();

        // Update stats
        this.player.data.tavern.totalStories++;
        this.player.data.tavern.totalVisits++;
        this.player.data.tavern.lastVisit = Date.now();
        this.player.data.tavern.reputation += 1;
        this.player.data.tavern.favoriteStory = story.id;

        console.log(`🍺 Listened to story: ${story.title}`);

        // Dispatch event
        window.dispatchEvent(new CustomEvent('tavern:story', {
            detail: { story, xp: this.storyXP }
        }));

        return {
            success: true,
            story,
            xp: this.storyXP,
            cost: this.storyCost
        };
    }

    /**
     * Get random story
     * @returns {Object} Story data
     */
    getRandomStory() {
        const stories = [
            {
                id: 'dragon_tale',
                title: 'O Dragão da Montanha',
                text: 'Dizem que nas montanhas ao norte vive um antigo dragão que guarda tesouros inimagináveis...',
                icon: '🐉'
            },
            {
                id: 'lost_farm',
                title: 'A Fazenda Perdida',
                text: 'Há rumores de uma fazenda abandonada nas florestas, onde as plantas crescem sozinhas...',
                icon: '🌾'
            },
            {
                id: 'magic_seeds',
                title: 'As Sementes Mágicas',
                text: 'Um mercador misterioso vende sementes que crescem em apenas uma noite...',
                icon: '✨'
            },
            {
                id: 'underground_city',
                title: 'A Cidade Subterrânea',
                text: 'Mineiros falam de uma antiga cidade nas profundezas, cheia de riquezas esquecidas...',
                icon: '⛏️'
            },
            {
                id: 'sea_monster',
                title: 'O Monstro do Lago',
                text: 'Pescadores juraram ter visto uma criatura gigante nas águas escuras do lago...',
                icon: '🐙'
            },
            {
                id: 'magic_forest',
                title: 'A Floresta Encantada',
                text: 'Na floresta ao leste, as árvores falam e os cogumelos brilham à noite...',
                icon: '🍄'
            },
            {
                id: 'ancient_smith',
                title: 'O Ferreiro Lendário',
                text: 'Conta-se que o melhor ferreiro do mundo mora escondido nas montanhas...',
                icon: '⚒️'
            },
            {
                id: 'ghost_ship',
                title: 'O Navio Fantasma',
                text: 'Um navio fantasma aparece no porto em noites de névoa, carregado de tesouros...',
                icon: '🚢'
            }
        ];

        return stories[Math.floor(Math.random() * stories.length)];
    }

    /**
     * Get tavern reputation level
     * @returns {Object} Reputation info
     */
    getReputationLevel() {
        const rep = this.player.data.tavern.reputation || 0;

        let level = 'Desconhecido';
        let benefits = 'Nenhum';
        let discount = 0;

        if (rep >= 100) {
            level = 'Lenda Local';
            benefits = 'Descontos de 20% e refeição grátis diária';
            discount = 0.2;
        } else if (rep >= 50) {
            level = 'Frequentador Assíduo';
            benefits = 'Descontos de 15%';
            discount = 0.15;
        } else if (rep >= 25) {
            level = 'Cliente Regular';
            benefits = 'Descontos de 10%';
            discount = 0.1;
        } else if (rep >= 10) {
            level = 'Conhecido';
            benefits = 'Descontos de 5%';
            discount = 0.05;
        }

        return {
            reputation: rep,
            level,
            benefits,
            discount
        };
    }

    /**
     * Get meal price with discount
     * @param {string} mealType - Type of meal
     * @returns {number} Final price
     */
    getMealPrice(mealType) {
        const meal = this.mealCosts[mealType];
        if (!meal) return 0;

        const repLevel = this.getReputationLevel();
        const discount = meal.cost * repLevel.discount;
        return Math.floor(meal.cost - discount);
    }

    /**
     * Get rest price with discount
     * @returns {number} Final price
     */
    getRestPrice() {
        const repLevel = this.getReputationLevel();
        const discount = this.restCost * repLevel.discount;
        return Math.floor(this.restCost - discount);
    }

    /**
     * Get tavern statistics
     * @returns {Object}
     */
    getStats() {
        const repLevel = this.getReputationLevel();

        return {
            totalVisits: this.player.data.tavern?.totalVisits || 0,
            totalRests: this.player.data.tavern?.totalRests || 0,
            totalMeals: this.player.data.tavern?.totalMeals || 0,
            totalStories: this.player.data.tavern?.totalStories || 0,
            reputation: repLevel.reputation,
            reputationLevel: repLevel.level,
            benefits: repLevel.benefits,
            discount: (repLevel.discount * 100).toFixed(0) + '%',
            lastVisit: this.player.data.tavern?.lastVisit
        };
    }

    /**
     * Get available meals
     * @returns {Array}
     */
    getAvailableMeals() {
        return [
            {
                type: 'simple',
                name: 'Refeição Simples',
                description: 'Pão e sopa básica',
                icon: '🍞',
                basePrice: this.mealCosts.simple.cost,
                price: this.getMealPrice('simple'),
                energy: this.mealCosts.simple.energy,
                health: this.mealCosts.simple.health
            },
            {
                type: 'standard',
                name: 'Refeição Padrão',
                description: 'Guisado e cerveja',
                icon: '🍲',
                basePrice: this.mealCosts.standard.cost,
                price: this.getMealPrice('standard'),
                energy: this.mealCosts.standard.energy,
                health: this.mealCosts.standard.health
            },
            {
                type: 'deluxe',
                name: 'Refeição Deluxe',
                description: 'Banquete completo',
                icon: '🍖',
                basePrice: this.mealCosts.deluxe.cost,
                price: this.getMealPrice('deluxe'),
                energy: this.mealCosts.deluxe.energy,
                health: this.mealCosts.deluxe.health
            }
        ];
    }

    /**
     * Check if can rest
     * @returns {boolean}
     */
    canRest() {
        return this.player.data.gold >= this.getRestPrice() &&
               this.player.data.energy < this.player.data.maxEnergy;
    }

    /**
     * Check if can buy meal
     * @param {string} mealType - Type of meal
     * @returns {boolean}
     */
    canBuyMeal(mealType) {
        const price = this.getMealPrice(mealType);
        return this.player.data.gold >= price;
    }

    /**
     * Check if can listen to story
     * @returns {boolean}
     */
    canListenToStory() {
        return this.player.data.gold >= this.storyCost;
    }

    /**
     * Reset tavern stats (for testing/debugging)
     */
    reset() {
        this.player.data.tavern = {
            totalVisits: 0,
            totalRests: 0,
            totalMeals: 0,
            totalStories: 0,
            favoriteStory: null,
            lastVisit: null,
            reputation: 0
        };
        console.log('🍺 Tavern stats reset');
    }
}
