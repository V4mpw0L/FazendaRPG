# 📚 FazendaRPG Wiki System

## Visão Geral

Sistema de Wiki modular e dinâmico para o FazendaRPG. Todo o conteúdo é gerado dinamicamente a partir de dados do jogo, garantindo que a wiki esteja sempre atualizada e alinhada com o projeto.

## 🏗️ Arquitetura

A wiki é composta por 4 módulos principais:

### 1. WikiData.js
Estrutura de dados centralizada da wiki:
- Define todas as seções e categorias
- Armazena dicas, estratégias, FAQ e atualizações
- Fornece navegação estruturada
- Gerencia metadados das páginas

### 2. WikiContentGenerator.js
Gerador de conteúdo para páginas de mecânicas:
- Primeiros Passos (Getting Started)
- Como Jogar (Game Mechanics)
- Guia de Cultivos (Crops)
- Ferramentas (Tools)
- Fertilizantes (Fertilizer)

**Características:**
- Usa dados reais de `crops.json`, `items.json`
- Gera tabelas de eficiência automaticamente
- Integra sprites PNG do projeto
- Cria comparações e estatísticas dinâmicas

### 3. WikiPagesRenderer.js
Renderizador de páginas de conteúdo:
- Sistema de Skills
- Níveis e XP
- Guia de NPCs (com dados de `npcs.json`)
- Missões (com dados de `quests.json`)
- Lista Completa de Itens
- Dicas e Truques
- Estratégias
- FAQ
- Atualizações

**Características:**
- Renderização baseada em dados reais do jogo
- Categorização automática de conteúdo
- Integração com sistema de amizade de NPCs
- Exibição de recompensas de quests

### 4. WikiManager.js
Gerenciador principal da wiki:
- Carrega dados do jogo via fetch
- Coordena geradores de conteúdo
- Gerencia navegação entre páginas
- Sistema de busca em tempo real
- Highlights de termos de busca
- Cache de páginas visitadas

## 📂 Estrutura de Arquivos

```
js/wiki/
├── README.md                    # Este arquivo
├── WikiData.js                  # Dados estruturados
├── WikiContentGenerator.js      # Gerador de páginas de mecânicas
├── WikiPagesRenderer.js         # Renderizador de páginas de conteúdo
└── WikiManager.js               # Gerenciador principal
```

## 🎨 Estilos

Todos os estilos da wiki estão em `style/wiki.css`:
- Layout responsivo em grid
- Cards modulares
- Tabelas de dados
- Grids de itens/cultivos/NPCs
- Listas e timelines
- Estados hover e animações
- Tema claro/escuro
- Mobile-first design

## 🔄 Fluxo de Dados

```
1. GameEngine inicializa WikiManager
2. WikiManager carrega dados JSON:
   - crops.json
   - items.json
   - npcs.json
   - quests.json
   - skills.json
3. WikiContentGenerator recebe dados
4. WikiPagesRenderer recebe dados
5. Usuário navega → WikiManager gera página dinamicamente
6. Conteúdo é renderizado no DOM
```

## 🎯 Páginas Disponíveis

### 🎮 Início
- `getting-started` - Primeiros passos no jogo
- `game-mechanics` - Como jogar e mecânicas
- `energy-system` - Sistema de energia

### 🌾 Farming
- `crops` - Guia completo de cultivos (10 cultivos)
- `tools` - Ferramentas necessárias (5 ferramentas)
- `fertilizer` - Sistema de fertilizantes

### ⭐ Skills
- `skills-system` - 8 skills do jogo
- `leveling` - Sistema de XP e níveis

### 📦 Itens
- `items-guide` - Guia de categorias
- `all-items` - Lista completa de itens
- `inventory` - Sistema de inventário

### 🏘️ Cidade
- `market` - Sistema de mercado
- `npcs-guide` - 8 NPCs com diálogos e lojas
- `quests` - 12+ missões (únicas e diárias)

### 💡 Dicas
- `tips` - 10+ dicas categorizadas
- `strategies` - 5 guias estratégicos
- `faq` - 10 perguntas frequentes
- `updates` - Changelog de versões

## 🔍 Sistema de Busca

O WikiManager implementa busca em tempo real:
- Debounce de 300ms
- Busca em conteúdo da página atual
- Highlights visuais em amarelo
- Scroll automático para primeiro resultado
- Escape para limpar busca

## 🎨 Componentes Visuais

### Cards
- `wiki-card` - Card padrão
- `wiki-card-tip` - Dica (amarelo)
- `wiki-card-warning` - Aviso (vermelho)
- `wiki-card-success` - Sucesso (verde)

### Grids
- `wiki-crop-grid` - Grid de cultivos
- `wiki-items-grid` - Grid de itens
- `wiki-skills-grid` - Grid de skills
- `wiki-tips-grid` - Grid de dicas

### Listas
- `wiki-list` - Lista com ícones
- `wiki-steps` - Lista numerada de passos
- `wiki-timeline` - Timeline horizontal

### Tabelas
- `wiki-table` - Tabela responsiva
- Header colorido
- Hover em linhas
- Bordas arredondadas

## 📱 Responsividade

Mobile-first design:
- Grid muda para 1 coluna em mobile
- Sidebar com altura máxima
- Fontes reduzidas
- Imagens responsivas
- Touch-friendly

## 🚀 Como Adicionar Conteúdo

### Adicionar Nova Página

1. **Definir seção em WikiData.js:**
```javascript
newSection: {
  id: "new-section",
  title: "🆕 Nova Seção",
  icon: "🆕",
  category: "categoria",
}
```

2. **Adicionar à navegação:**
```javascript
getNavigationStructure() {
  categoria: {
    items: [this.sections.newSection]
  }
}
```

3. **Criar gerador:**
```javascript
// Em WikiContentGenerator.js ou WikiPagesRenderer.js
generateNewSection() {
  return `<h1>Conteúdo</h1>`;
}
```

4. **Registrar no switch:**
```javascript
generatePage(pageId) {
  if (pageId === 'new-section') {
    return this.generateNewSection();
  }
}
```

### Adicionar Dica

Em `WikiData.js → getTips()`:
```javascript
{
  id: "tip-new",
  icon: "💡",
  title: "Nova Dica",
  description: "Descrição...",
  category: "categoria",
}
```

### Adicionar Estratégia

Em `WikiData.js → getStrategies()`:
```javascript
{
  id: "strategy-new",
  title: "Nova Estratégia",
  icon: "🎯",
  steps: [
    { title: "Passo 1", description: "..." }
  ]
}
```

## 🔧 Manutenção

### Atualizar Dados do Jogo

Os dados são carregados automaticamente de:
- `data/crops.json`
- `data/items.json`
- `data/npcs.json`
- `data/quests.json`
- `data/skills.json`

Quando você atualiza esses arquivos, a wiki **atualiza automaticamente** na próxima visita!

### Adicionar Sprite

1. Adicione PNG em `assets/sprites/`
2. Mapear em `getCropSprite()` ou `getItemSprite()`
3. Sprite aparece automaticamente na wiki

## 🎯 Melhorias Futuras

- [ ] Cache de páginas visitadas
- [ ] Histórico de navegação
- [ ] Favoritos
- [ ] Modo offline completo
- [ ] Exportar wiki para PDF
- [ ] Modo de impressão
- [ ] Links internos entre páginas
- [ ] Breadcrumbs
- [ ] Índice lateral em páginas longas
- [ ] Galeria de screenshots
- [ ] Vídeos tutoriais
- [ ] Calculadoras (XP, Gold, etc)

## 📊 Estatísticas

- **Páginas:** 20+
- **Categorias:** 6
- **Dicas:** 10+
- **Estratégias:** 5
- **FAQ:** 10
- **NPCs:** 8
- **Quests:** 12+
- **Cultivos:** 10
- **Skills:** 8
- **Itens:** 40+

## 🤝 Contribuindo

Para contribuir com a wiki:
1. Adicione conteúdo nos geradores
2. Use dados reais do jogo sempre que possível
3. Mantenha o padrão visual (classes CSS)
4. Teste em mobile
5. Adicione comentários JSDoc
6. Atualize este README

## 📝 Convenções

- **Títulos:** Emoji + Texto (ex: "🌾 Farming")
- **IDs:** kebab-case (ex: "getting-started")
- **Classes CSS:** `.wiki-` prefix
- **Ícones:** Emoji ou PNG sprites
- **Cores:** Variáveis CSS do tema
- **Idioma:** PT-BR primário, EN-US secundário

## 🐛 Debug

Para debugar a wiki:
```javascript
// No console do navegador
const wiki = game.wikiManager;
wiki.showPage('page-id');  // Mostra página específica
wiki.getCurrentPage();      // Página atual
wiki.wikiData.getAllSections();  // Lista seções
```

## 📄 Licença

Este sistema é parte do FazendaRPG v0.0.8+

---

**Desenvolvido com ❤️ para FazendaRPG**