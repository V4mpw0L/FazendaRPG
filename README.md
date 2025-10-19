# 🌾 FazendaRPG

> Um jogo RPG de fazenda completo, modular e mobile-first inspirado em RuneScape e FarmRPG

![Version](https://img.shields.io/badge/version-0.0.1-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-orange.svg)

## 📖 Sobre o Projeto

FazendaRPG é um jogo de gerenciamento de fazenda completo desenvolvido com tecnologias web modernas. O jogo apresenta um sistema de habilidades inspirado em RuneScape (níveis 1-99), agricultura, mineração, pesca, culinária e muito mais!

### ✨ Características Principais

- 🌱 **Sistema de Agricultura Completo** - Plante, cultive e colha diversos tipos de cultivos
- 📊 **8 Habilidades Únicas** - Farming, Mining, Fishing, Cooking, Woodcutting, Crafting, Smithing, Foraging
- 🎯 **Sistema de Missões** - Missões diárias e de história com NPCs
- 🎒 **Sistema de Inventário** - Gerenciamento completo de itens com stacking
- 🏘️ **Cidade e NPCs** - Interaja com diversos NPCs e estabelecimentos
- 🌍 **Multi-idioma** - Suporte para Português (BR) e Inglês (US)
- 🌓 **Temas Claro/Escuro** - Interface adaptável com temas de fazenda
- 📱 **Mobile-First** - Totalmente otimizado para dispositivos móveis
- 💾 **PWA** - Instalável como aplicativo no celular
- 🔄 **Auto-Save** - Salvamento automático a cada 60 segundos
- 📦 **Sistema de Backup** - Exportação e importação de saves

## 🚀 Tecnologias Utilizadas

### Frontend
- **HTML5** - Estrutura semântica moderna
- **CSS3** - Design responsivo com CSS Grid/Flexbox
- **JavaScript (ES6+)** - Módulos, Classes, Async/Await
- **Service Workers** - Cache offline e PWA

### Arquitetura
- **Modular** - Sistema baseado em módulos ES6
- **MVC Pattern** - Separação clara de lógica e UI
- **Event-Driven** - Comunicação entre sistemas via eventos
- **Data-Driven** - Configurações em JSON

## 📁 Estrutura do Projeto

```
FazendaRPG/
├── index.html              # Página principal
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
│
├── assets/                 # Assets do jogo
│   └── generate-icons.html # Gerador de ícones
│
├── data/                   # Dados do jogo (JSON)
│   ├── crops.json         # Definições de cultivos
│   ├── items.json         # Database de itens
│   ├── skills.json        # Configurações de skills
│   ├── quests.json        # Missões e objetivos
│   ├── npcs.json          # NPCs e diálogos
│   └── translations/      # Traduções
│       ├── pt-BR.json     # Português (Brasil)
│       └── en-US.json     # English (US)
│
├── style/                  # Estilos CSS
│   ├── main.css           # Estilos principais
│   ├── topbar.css         # Top bar e status
│   ├── skills.css         # Cards de habilidades
│   ├── themes.css         # Temas claro/escuro
│   └── mobile.css         # Responsividade e footer
│
└── js/                     # JavaScript
    ├── app.js             # Entry point
    │
    ├── core/              # Sistemas principais
    │   ├── GameEngine.js  # Engine principal do jogo
    │   ├── Player.js      # Gerenciamento do jogador
    │   └── SaveManager.js # Sistema de salvamento
    │
    ├── systems/           # Sistemas de jogo
    │   ├── SkillSystem.js    # Sistema de habilidades
    │   ├── FarmSystem.js     # Sistema de agricultura
    │   ├── InventorySystem.js # Sistema de inventário
    │   └── QuestSystem.js    # Sistema de missões
    │
    ├── ui/                # Componentes de UI
    │   ├── TopBar.js      # Barra superior
    │   ├── SideMenu.js    # Menu lateral
    │   └── ScreenManager.js # Gerenciador de telas
    │
    └── utils/             # Utilitários
        ├── i18n.js        # Internacionalização
        ├── notifications.js # Sistema de notificações
        └── helpers.js     # Funções auxiliares
```

## 🎮 Como Jogar

### Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/FazendaRPG.git
cd FazendaRPG
```

2. Inicie um servidor local:
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server)
npx http-server -p 8000

# PHP
php -S localhost:8000
```

3. Abra o navegador em `http://localhost:8000`

### Instalação como PWA

1. Acesse o jogo pelo navegador mobile
2. Toque em "Adicionar à tela inicial"
3. O jogo será instalado como um aplicativo

## 🎯 Sistemas do Jogo

### Sistema de Habilidades (1-99)

Inspirado em RuneScape, cada habilidade evolui até o nível 99:

- **🌾 Farming** - Plante e colha cultivos (Core do jogo)
- **⛏️ Mining** - Mine pedras e minérios preciosos
- **🎣 Fishing** - Pesque diversos tipos de peixes
- **🍳 Cooking** - Cozinhe alimentos nutritivos
- **🪓 Woodcutting** - Corte árvores para madeira
- **🔨 Crafting** - Crie ferramentas e itens úteis
- **⚒️ Smithing** - Forje armas e armaduras
- **🌿 Foraging** - Colete ervas e recursos selvagens

### Fórmula de XP

O jogo usa a mesma fórmula de XP do RuneScape:

```javascript
XP para próximo nível = Σ(level + 300 * 2^(level/7)) / 4
```

### Sistema de Cultivos

Cada cultivo tem:
- **Tempo de Crescimento** - Tempo real até a colheita
- **Nível Requerido** - Nível mínimo de Farming
- **XP Ganho** - Experiência ao colher
- **Produtos** - Quantidade de items produzidos
- **Valor de Venda** - Preço base no mercado

### Sistema de Missões

- **Missões de História** - Progresso único
- **Missões Diárias** - Repetíveis com cooldown
- **Objetivos Variados** - Plantar, colher, pescar, minerar, etc.
- **Recompensas** - Ouro, XP, items e XP de skills

## 🛠️ Desenvolvimento

### Adicionar Novo Item

Edite `data/items.json`:

```json
{
  "new_item": {
    "id": "new_item",
    "name": "New Item",
    "namePtBR": "Novo Item",
    "icon": "🎁",
    "category": "materials",
    "description": "A new item",
    "descriptionPtBR": "Um novo item",
    "buyPrice": 100,
    "sellPrice": 75,
    "stackable": true,
    "maxStack": 999
  }
}
```

### Adicionar Novo Cultivo

Edite `data/crops.json`:

```json
{
  "new_crop": {
    "id": "new_crop",
    "name": "New Crop",
    "namePtBR": "Novo Cultivo",
    "icon": "🌺",
    "seedId": "new_crop_seed",
    "growthTime": 120,
    "requiredLevel": 25,
    "xpGain": 50,
    "energyCost": 7,
    "harvestAmount": 3,
    "stages": ["🌱", "🌿", "🌺"],
    "sellPrice": 60
  }
}
```

### Adicionar Nova Missão

Edite `data/quests.json`:

```json
{
  "new_quest": {
    "id": "new_quest",
    "name": "New Quest",
    "namePtBR": "Nova Missão",
    "description": "Complete this quest",
    "descriptionPtBR": "Complete esta missão",
    "npc": "old_farmer",
    "requiredLevel": 5,
    "objectives": [
      {
        "type": "harvest",
        "amount": 10,
        "current": 0
      }
    ],
    "rewards": {
      "gold": 200,
      "xp": 100,
      "items": {
        "fertilizer": 5
      }
    },
    "repeatable": false,
    "completed": false
  }
}
```

### Debug Commands

O jogo expõe comandos de debug no console:

```javascript
// Adicionar ouro
FazendaRPG.debug.addGold(1000)

// Adicionar XP
FazendaRPG.debug.addXP(500)

// Adicionar item
FazendaRPG.debug.addItem('wheat_seed', 100)

// Definir energia
FazendaRPG.debug.setEnergy(100)

// Subir nível de skill
FazendaRPG.debug.levelUpSkill('farming', 10)

// Ver dados do jogador
FazendaRPG.debug.getPlayer()

// Salvar jogo
FazendaRPG.debug.saveGame()

// Resetar jogo
FazendaRPG.debug.resetGame()
```

## 🔧 Configuração

### Mudar Idioma Padrão

Em `js/utils/i18n.js`:
```javascript
this.currentLanguage = 'en-US'; // ou 'pt-BR'
this.fallbackLanguage = 'pt-BR';
```

### Ajustar Tempo de Auto-Save

Em `js/core/SaveManager.js`:
```javascript
this.autoSaveInterval = 60000; // 60 segundos
```

### Modificar Regeneração de Energia

Em `js/core/GameEngine.js`:
```javascript
// Regenerar 1 energia a cada 60 segundos
if (now - lastRegen >= 60000) {
    // Ajuste o valor aqui
}
```

## 📱 Compatibilidade

### Navegadores Suportados

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+
- ✅ Chrome Mobile
- ✅ Safari iOS

### Dispositivos Testados

- ✅ iPhone (iOS 14+)
- ✅ Android (Chrome)
- ✅ iPad
- ✅ Desktop (Windows, Mac, Linux)

## 🎨 Personalização de Temas

### Modificar Cores do Tema Claro

Em `style/themes.css`:

```css
.light-theme {
    --bg-primary-light: #f5f9f0;
    --brand-primary: #5caa1f;
    /* ... outras cores */
}
```

### Modificar Cores do Tema Escuro

```css
.dark-theme {
    --bg-primary-dark: #1a2520;
    --brand-primary: #5caa1f;
    /* ... outras cores */
}
```

## 🚀 Roadmap

### v0.0.2 (Próxima versão)
- [ ] Sistema de NPCs completo com diálogos
- [ ] Loja funcional com compra/venda
- [ ] Banco para guardar items
- [ ] Mais cultivos (10+ tipos)
- [ ] Sistema de clima
- [ ] Eventos aleatórios

### v0.1.0 (Futuro)
- [ ] Sistema de combate
- [ ] Dungeons e exploração
- [ ] Pets e animais da fazenda
- [ ] Casamento e relacionamentos
- [ ] Construção de edifícios
- [ ] Multiplayer (Firebase)

### v1.0.0 (Longo prazo)
- [ ] Backend completo
- [ ] Trading entre jogadores
- [ ] Guildas
- [ ] Eventos sazonais
- [ ] Conquistas globais
- [ ] Leaderboards

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvido por

**[Gennisys](https://gennisys.com)**

Website: [gennisys.com](https://gennisys.com)

## 🙏 Agradecimentos

- Inspirado por [RuneScape](https://runescape.com) e [FarmRPG](https://farmrpg.com)
- Emojis por [Twemoji](https://twemoji.twitter.com/)
- Comunidade de desenvolvedores JavaScript

## 📞 Suporte

- 🐛 [Reportar Bug](https://github.com/seu-usuario/FazendaRPG/issues)
- 💡 [Sugerir Feature](https://github.com/seu-usuario/FazendaRPG/issues)
- 📧 Email: contato@gennisys.com

---

**🌾 FazendaRPG v0.0.1** - *Cultivando diversão, colhendo aventuras!*

Feito com ❤️ e muito ☕