/**
 * FazendaRPG - Wiki Pages Renderer
 * Renders additional wiki pages (NPCs, Skills, Items, Quests, Tips)
 * @version 0.0.8
 */

export default class WikiPagesRenderer {
  constructor(gameData, wikiData) {
    this.gameData = gameData;
    this.wikiData = wikiData;
    this.npcs = gameData?.npcs || {};
    this.items = gameData?.items || {};
    this.skills = gameData?.skills || {};
    this.quests = gameData?.quests || {};
  }

  /**
   * Generate Skills System page
   * @returns {string} HTML content
   */
  generateSkillsSystem() {
    const skillsData = this.skills.skills || {};

    let skillsHTML = '';
    for (const [key, skill] of Object.entries(skillsData)) {
      skillsHTML += `
        <div class="wiki-skill-card" style="border-left: 4px solid ${skill.color}">
          <div class="wiki-skill-header">
            <span class="wiki-skill-icon" style="font-size: 2rem;">${skill.icon}</span>
            <div>
              <h3 style="color: ${skill.color}">${skill.name}</h3>
              <p>${skill.description}</p>
            </div>
          </div>
          <div class="wiki-skill-actions">
            <h4>Ações Disponíveis:</h4>
            <ul style="margin-left: 1.5rem;">
              ${skill.actions.map(action => `
                <li>
                  <strong>${action.name}</strong> (Lvl ${action.requiredLevel}+)
                  - ${action.xp} XP | ${action.energyCost} Energia | ${action.timeSeconds}s
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      `;
    }

    return `
      <h1 class="wiki-page-title">📊 Sistema de Skills</h1>

      <div class="wiki-card">
        <h2>⭐ 8 Skills Únicas</h2>
        <p>FazendaRPG possui 8 skills diferentes, cada uma com seu próprio nível (máximo 99) e ações únicas!</p>
      </div>

      <div class="wiki-card">
        ${skillsHTML}
      </div>

      <div class="wiki-card">
        <h2>📈 Como Funciona o Sistema</h2>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <span class="wiki-icon">🎯</span>
            <div>
              <strong>Cada Skill é Independente</strong>
              <p>Você tem um nível separado para cada skill. Farming lvl 10 não afeta Mining!</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">⬆️</span>
            <div>
              <strong>Ganhe XP Fazendo Ações</strong>
              <p>Plante para ganhar Farming XP, pesque para Fishing XP, etc.</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🔓</span>
            <div>
              <strong>Desbloqueie Novas Ações</strong>
              <p>Níveis mais altos desbloqueiam ações melhores com mais XP e recompensas!</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🏆</span>
            <div>
              <strong>Milestones Especiais</strong>
              <p>Níveis 10, 25, 50, 75 e 99 têm recompensas especiais!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card wiki-card-tip">
        <h2>💡 Dica de Skills</h2>
        <p><strong>Balanceie suas skills!</strong> Não foque apenas em uma. Diversificar skills te dá acesso a mais conteúdo, missões e formas de ganhar gold!</p>
      </div>
    `;
  }

  /**
   * Generate Leveling page
   * @returns {string} HTML content
   */
  generateLeveling() {
    const xpTable = this.skills.xpTable || [];
    const milestones = this.skills.milestones || [10, 25, 50, 75, 99];

    return `
      <h1 class="wiki-page-title">🎯 Níveis e XP</h1>

      <div class="wiki-card">
        <h2>📊 Sistema de XP</h2>
        <p>Cada skill no FazendaRPG vai do nível 1 ao 99. A quantidade de XP necessária aumenta exponencialmente!</p>
      </div>

      <div class="wiki-card">
        <h2>🏆 Milestones Importantes</h2>
        <p>Ao atingir certos níveis, você recebe recompensas especiais:</p>

        <div class="wiki-milestone-grid">
          ${milestones.map(level => `
            <div class="wiki-milestone-card">
              <span class="wiki-milestone-level">${level}</span>
              <p class="wiki-milestone-desc">Nível ${level}</p>
              <span class="wiki-milestone-reward">🎁 Recompensa Especial</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="wiki-card">
        <h2>📈 Progressão de XP (Primeiros Níveis)</h2>
        <table class="wiki-table">
          <thead>
            <tr>
              <th>Nível</th>
              <th>XP Total</th>
              <th>XP Para Próximo</th>
            </tr>
          </thead>
          <tbody>
            ${xpTable.slice(0, 20).map((xp, index) => {
              const nextXP = xpTable[index + 1] || xp;
              const diff = nextXP - xp;
              return `
                <tr>
                  <td><strong>${index + 1}</strong></td>
                  <td>${xp.toLocaleString()}</td>
                  <td>${diff.toLocaleString()}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        <p style="margin-top: 1rem; text-align: center; color: var(--text-secondary);">
          <em>A tabela continua até o nível 99...</em>
        </p>
      </div>

      <div class="wiki-card">
        <h2>💡 Dicas de Nivelamento</h2>
        <ul style="margin-left: 1.5rem;">
          <li><strong>Níveis iniciais são rápidos:</strong> Aproveite para explorar diferentes skills</li>
          <li><strong>Foque em ações de alto XP:</strong> Verifique qual ação dá mais XP por tempo</li>
          <li><strong>Complete missões:</strong> Muitas missões dão XP bônus para skills</li>
          <li><strong>Use fertilizantes:</strong> Em farming, fertilizantes = mais colheitas = mais XP/hora</li>
          <li><strong>Paciência em níveis altos:</strong> Do nível 70+ cada nível demora bastante!</li>
        </ul>
      </div>

      <div class="wiki-card wiki-card-warning">
        <h2>⚠️ Importante</h2>
        <p>O nível máximo é <strong>99</strong> em cada skill. Atingir 99 em todas as skills é o objetivo final do jogo! 🏆</p>
      </div>
    `;
  }

  /**
   * Generate NPCs Guide page
   * @returns {string} HTML content
   */
  generateNPCsGuide() {
    const npcsData = this.npcs.npcs || {};

    let npcsHTML = '';
    for (const [key, npc] of Object.entries(npcsData)) {
      const questCount = npc.quests?.length || 0;
      const hasShop = npc.shop && npc.shop.items ? npc.shop.items.length : 0;

      npcsHTML += `
        <div class="wiki-npc-card">
          <div class="wiki-npc-header">
            <span class="wiki-npc-avatar">${npc.avatar}</span>
            <div class="wiki-npc-info">
              <h3>${npc.namePtBR || npc.name}</h3>
              <p class="wiki-npc-role">${npc.rolePtBR || npc.role}</p>
              <p class="wiki-npc-desc">${npc.descriptionPtBR || npc.description}</p>
            </div>
          </div>
          <div class="wiki-npc-details">
            <div class="wiki-npc-detail">
              <span class="wiki-npc-icon">📍</span>
              <strong>Localização:</strong> ${this.translateLocation(npc.location)}
            </div>
            ${questCount > 0 ? `
              <div class="wiki-npc-detail">
                <span class="wiki-npc-icon">📜</span>
                <strong>Missões:</strong> ${questCount} disponíveis
              </div>
            ` : ''}
            ${hasShop > 0 ? `
              <div class="wiki-npc-detail">
                <span class="wiki-npc-icon">🏪</span>
                <strong>Loja:</strong> ${hasShop} itens à venda
              </div>
            ` : ''}
            <div class="wiki-npc-detail">
              <span class="wiki-npc-icon">❤️</span>
              <strong>Amizade:</strong> 0/${npc.maxFriendship}
            </div>
          </div>
          ${npc.dialogue && npc.dialogue.greetingPtBR ? `
            <div class="wiki-npc-dialogue">
              <p><em>"${npc.dialogue.greetingPtBR[0]}"</em></p>
            </div>
          ` : ''}
        </div>
      `;
    }

    return `
      <h1 class="wiki-page-title">👥 Guia de NPCs</h1>

      <div class="wiki-card">
        <h2>🗣️ Conheça os NPCs</h2>
        <p>NPCs (Non-Player Characters) são personagens importantes que oferecem missões, vendem itens e podem se tornar seus amigos!</p>
      </div>

      <div class="wiki-card">
        <h2>📋 Todos os NPCs</h2>
        ${npcsHTML}
      </div>

      <div class="wiki-card">
        <h2>❤️ Sistema de Amizade</h2>
        <div class="wiki-list">
          <div class="wiki-list-item">
            <span class="wiki-icon">💬</span>
            <div>
              <strong>Converse Diariamente</strong>
              <p>Fale com NPCs todos os dias para aumentar amizade</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">📜</span>
            <div>
              <strong>Complete Missões</strong>
              <p>Completar missões de NPCs aumenta muito a amizade</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">🎁</span>
            <div>
              <strong>Dê Presentes</strong>
              <p>Cada NPC tem itens favoritos que aumentam amizade</p>
            </div>
          </div>
          <div class="wiki-list-item">
            <span class="wiki-icon">💰</span>
            <div>
              <strong>Descontos em Lojas</strong>
              <p>NPCs amigos podem dar descontos especiais!</p>
            </div>
          </div>
        </div>
      </div>

      <div class="wiki-card wiki-card-tip">
        <h2>💡 Dica de NPCs</h2>
        <p><strong>Visite todos os NPCs regularmente!</strong> Cada um oferece recursos e missões únicas. Não foque apenas em um NPC!</p>
      </div>
    `;
  }

  /**
   * Generate Quests page
   * @returns {string} HTML content
   */
  generateQuests() {
    const questsData = this.quests.quests || {};

    const uniqueQuests = [];
    const dailyQuests = [];

    for (const [key, quest] of Object.entries(questsData)) {
      if (quest.repeatable) {
        dailyQuests.push(quest);
      } else {
        uniqueQuests.push(quest);
      }
    }

    return `
      <h1 class="wiki-page-title">📜 Missões</h1>

      <div class="wiki-card">
        <h2>🎯 Sistema de Missões</h2>
        <p>Missões são tarefas dadas por NPCs que recompensam gold, XP e itens valiosos!</p>
      </div>

      <div class="wiki-card">
        <h2>⭐ Missões Únicas (${uniqueQuests.length})</h2>
        <p>Completadas uma vez. Dão recompensas grandes e desbloqueiam conteúdo:</p>

        <div class="wiki-quests-list">
          ${uniqueQuests.map(quest => `
            <div class="wiki-quest-card">
              <div class="wiki-quest-header">
                <h3>${quest.namePtBR || quest.name}</h3>
                <span class="wiki-quest-level">Nível ${quest.requiredLevel}+</span>
              </div>
              <p class="wiki-quest-desc">${quest.descriptionPtBR || quest.description}</p>
              <div class="wiki-quest-npc">
                <span>📍 NPC: <strong>${this.getNPCName(quest.npc)}</strong></span>
              </div>
              <div class="wiki-quest-rewards">
                <span class="wiki-reward">💰 ${quest.rewards.gold}g</span>
                <span class="wiki-reward">⭐ ${quest.rewards.xp} XP</span>
                ${quest.rewards.items ? Object.keys(quest.rewards.items).map(item =>
                  `<span class="wiki-reward">🎁 ${this.getItemName(item)}</span>`
                ).join('') : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="wiki-card">
        <h2>🔄 Missões Diárias (${dailyQuests.length})</h2>
        <p>Podem ser repetidas a cada 24 horas. Ótimas para farm de recursos:</p>

        <div class="wiki-quests-list">
          ${dailyQuests.map(quest => `
            <div class="wiki-quest-card wiki-quest-daily">
              <div class="wiki-quest-header">
                <h3>${quest.namePtBR || quest.name}</h3>
                <span class="wiki-quest-repeatable">🔄 Diária</span>
              </div>
              <p class="wiki-quest-desc">${quest.descriptionPtBR || quest.description}</p>
              <div class="wiki-quest-npc">
                <span>📍 NPC: <strong>${this.getNPCName(quest.npc)}</strong></span>
              </div>
              <div class="wiki-quest-rewards">
                <span class="wiki-reward">💰 ${quest.rewards.gold}g</span>
                <span class="wiki-reward">⭐ ${quest.rewards.xp} XP</span>
                ${quest.rewards.items ? Object.keys(quest.rewards.items).map(item =>
                  `<span class="wiki-reward">🎁 ${this.getItemName(item)}</span>`
                ).join('') : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="wiki-card">
        <h2>💡 Dicas de Missões</h2>
        <ul style="margin-left: 1.5rem;">
          <li><strong>Faça diárias todos os dias:</strong> São uma fonte constante de recursos</li>
          <li><strong>Leia os objetivos:</strong> Algumas missões têm requisitos específicos</li>
          <li><strong>Complete em ordem:</strong> Algumas missões desbloqueiam outras</li>
          <li><strong>Missões dão muito XP:</strong> Ótimas para subir de nível rapidamente</li>
        </ul>
      </div>
    `;
  }

  /**
   * Generate All Items page
   * @returns {string} HTML content
   */
  generateAllItems() {
    const itemsData = this.items.items || {};
    const categories = this.items.categories || {};

    let categoriesHTML = '';
    for (const [catKey, catData] of Object.entries(categories)) {
      const itemsInCategory = Object.values(itemsData).filter(item => item.category === catKey);

      if (itemsInCategory.length === 0) continue;

      categoriesHTML += `
        <div class="wiki-card">
          <h2>${catData.icon} ${catData.name}</h2>
          <div class="wiki-items-grid">
            ${itemsInCategory.map(item => `
              <div class="wiki-item-card">
                <div class="wiki-item-header">
                  ${this.getItemSprite(item.id) ?
                    `<img src="${this.getItemSprite(item.id)}" alt="${item.name}" class="wiki-item-icon">` :
                    `<span class="wiki-item-icon">${item.icon}</span>`
                  }
                  <h4>${item.namePtBR || item.name}</h4>
                </div>
                <p class="wiki-item-desc">${item.descriptionPtBR || item.description}</p>
                <div class="wiki-item-stats">
                  ${item.buyPrice ? `<span>💰 Compra: ${item.buyPrice}g</span>` : ''}
                  ${item.sellPrice ? `<span>💸 Venda: ${item.sellPrice}g</span>` : ''}
                  ${item.stackable ? `<span>📦 Max: ${item.maxStack}</span>` : '<span>📦 Não empilha</span>'}
                  ${item.energyRestore ? `<span>⚡ +${item.energyRestore} energia</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <h1 class="wiki-page-title">📋 Lista Completa de Itens</h1>

      <div class="wiki-card">
        <h2>🎒 Todos os Itens do Jogo</h2>
        <p>Aqui está a lista completa de todos os itens disponíveis no FazendaRPG:</p>
      </div>

      ${categoriesHTML}

      <div class="wiki-card wiki-card-tip">
        <h2>💡 Sobre Itens</h2>
        <p><strong>Itens empilháveis</strong> economizam espaço no inventário. <strong>Itens consumíveis</strong> podem ser usados para restaurar energia. <strong>Venda itens desnecessários</strong> para conseguir gold!</p>
      </div>
    `;
  }

  /**
   * Generate Tips page
   * @returns {string} HTML content
   */
  generateTips() {
    const tips = this.wikiData.getTips();

    const categorizedTips = {};
    tips.forEach(tip => {
      if (!categorizedTips[tip.category]) {
        categorizedTips[tip.category] = [];
      }
      categorizedTips[tip.category].push(tip);
    });

    let tipsHTML = '';
    for (const [category, categoryTips] of Object.entries(categorizedTips)) {
      tipsHTML += `
        <div class="wiki-tips-category">
          <h3>${this.translateCategory(category)}</h3>
          <div class="wiki-tips-grid">
            ${categoryTips.map(tip => `
              <div class="wiki-tip-card">
                <div class="wiki-tip-icon">${tip.icon}</div>
                <h4>${tip.title}</h4>
                <p>${tip.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    return `
      <h1 class="wiki-page-title">💎 Dicas e Truques</h1>

      <div class="wiki-card">
        <h2>🎯 Dicas Para Jogar Melhor</h2>
        <p>Aprenda truques e estratégias para se tornar um fazendeiro expert!</p>
      </div>

      ${tipsHTML}

      <div class="wiki-card wiki-card-tip">
        <h2>🏆 Dica de Ouro</h2>
        <p><strong>A chave do sucesso é diversificar!</strong> Não foque apenas em farming. Balance todas as skills, faça missões, converse com NPCs e explore tudo que o jogo oferece. Dessa forma você maximiza seus ganhos e progride mais rápido!</p>
      </div>
    `;
  }

  /**
   * Generate Strategies page
   * @returns {string} HTML content
   */
  generateStrategies() {
    const strategies = this.wikiData.getStrategies();

    return `
      <h1 class="wiki-page-title">🎯 Estratégias</h1>

      <div class="wiki-card">
        <h2>📈 Guias Estratégicos</h2>
        <p>Estratégias detalhadas para cada fase do jogo:</p>
      </div>

      ${strategies.map(strategy => `
        <div class="wiki-card">
          <div class="wiki-strategy-header">
            <span class="wiki-strategy-icon">${strategy.icon}</span>
            <h2>${strategy.title}</h2>
          </div>
          <div class="wiki-strategy-steps">
            ${strategy.steps.map((step, index) => `
              <div class="wiki-strategy-step">
                <span class="wiki-strategy-number">${index + 1}</span>
                <div class="wiki-strategy-content">
                  <h4>${step.title}</h4>
                  <p>${step.description}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <div class="wiki-card wiki-card-tip">
        <h2>💡 Lembre-se</h2>
        <p>Estas são apenas sugestões! Jogue do seu jeito e divirta-se. O mais importante é aproveitar a jornada! 🎉</p>
      </div>
    `;
  }

  /**
   * Generate FAQ page
   * @returns {string} HTML content
   */
  generateFAQ() {
    const faq = this.wikiData.getFAQ();

    return `
      <h1 class="wiki-page-title">❓ Perguntas Frequentes</h1>

      <div class="wiki-card">
        <h2>🤔 Dúvidas Comuns</h2>
        <p>Respostas para as perguntas mais frequentes sobre FazendaRPG:</p>
      </div>

      <div class="wiki-faq-list">
        ${faq.map((item, index) => `
          <div class="wiki-faq-item">
            <div class="wiki-faq-question">
              <span class="wiki-faq-number">${index + 1}</span>
              <h3>${item.question}</h3>
            </div>
            <div class="wiki-faq-answer">
              <p>${item.answer}</p>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="wiki-card wiki-card-tip">
        <h2>💬 Ainda tem dúvidas?</h2>
        <p>Se sua pergunta não foi respondida aqui, explore outras seções da Wiki ou experimente no jogo! A melhor forma de aprender é jogando! 🎮</p>
      </div>
    `;
  }

  /**
   * Generate Updates page
   * @returns {string} HTML content
   */
  generateUpdates() {
    const updates = this.wikiData.getUpdates();

    return `
      <h1 class="wiki-page-title">📰 Atualizações</h1>

      <div class="wiki-card">
        <h2>🚀 Histórico de Versões</h2>
        <p>Veja todas as atualizações e melhorias do FazendaRPG:</p>
      </div>

      <div class="wiki-updates-timeline">
        ${updates.map(update => `
          <div class="wiki-update-card">
            <div class="wiki-update-header">
              <span class="wiki-update-version">v${update.version}</span>
              <span class="wiki-update-date">${update.date}</span>
            </div>
            <h3>${update.title}</h3>
            <ul class="wiki-update-changes">
              ${update.changes.map(change => `<li>${change}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>

      <div class="wiki-card wiki-card-success">
        <h2>🎉 Mais por vir!</h2>
        <p>FazendaRPG está em desenvolvimento ativo. Novas features, cultivos, NPCs e conteúdo são adicionados regularmente. Fique ligado nas próximas atualizações! 🚀</p>
      </div>
    `;
  }

  /**
   * Helper: Translate location
   */
  translateLocation(location) {
    const translations = {
      farm: 'Fazenda',
      city: 'Cidade',
      river: 'Rio',
      tavern: 'Taverna',
      mine: 'Mina',
      workshop: 'Oficina',
      smithy: 'Ferraria',
      forest: 'Floresta'
    };
    return translations[location] || location;
  }

  /**
   * Helper: Get NPC name
   */
  getNPCName(npcId) {
    const npc = this.npcs.npcs?.[npcId];
    return npc ? (npc.namePtBR || npc.name) : npcId;
  }

  /**
   * Helper: Get item name
   */
  getItemName(itemId) {
    const item = this.items.items?.[itemId];
    return item ? (item.namePtBR || item.name) : itemId;
  }

  /**
   * Helper: Get item sprite
   */
  getItemSprite(itemId) {
    const spriteMap = {
      wheat_seed: '1247', wheat: '1247',
      corn_seed: '1249', corn: '1249',
      tomato_seed: '1579', tomato: '1579',
      potato_seed: '1250', potato: '1250',
      carrot_seed: '1248', carrot: '1248',
      pumpkin_seed: '1358', pumpkin: '1358',
      strawberry_seed: '1773', strawberry: '1773',
      fertilizer: '1299',
      trowel: '1069', hoe: '1068', rake: '1070',
      bread: '2967', energy_potion: '1302'
    };

    const spriteNum = spriteMap[itemId];
    return spriteNum ? `assets/sprites/${spriteNum}.png` : null;
  }

  /**
   * Helper: Translate category
   */
  translateCategory(category) {
    const translations = {
      farming: '🌾 Farming',
      mechanics: '⚙️ Mecânicas',
      skills: '⭐ Skills',
      quests: '📜 Missões',
      npcs: '👥 NPCs',
      economy: '💰 Economia',
      inventory: '🎒 Inventário',
      strategy: '🎯 Estratégia'
    };
    return translations[category] || category;
  }

  /**
   * Generate page by ID
   * @param {string} pageId - Page ID
   * @returns {string} HTML content
   */
  generatePage(pageId) {
    const generators = {
      'skills-system': () => this.generateSkillsSystem(),
      'leveling': () => this.generateLeveling(),
      'npcs-guide': () => this.generateNPCsGuide(),
      'quests': () => this.generateQuests(),
      'all-items': () => this.generateAllItems(),
      'tips': () => this.generateTips(),
      'strategies': () => this.generateStrategies(),
      'faq': () => this.generateFAQ(),
      'updates': () => this.generateUpdates()
    };

    const generator = generators[pageId];
    return generator ? generator() : '<p>Conteúdo não encontrado</p>';
  }
}
