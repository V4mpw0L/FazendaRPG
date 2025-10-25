# 📦 Sistema de Atualização de Versão - FazendaRPG

## 🎯 Visão Geral

Este documento descreve o sistema automatizado de atualização de versão do FazendaRPG. O script `update-version.js` atualiza automaticamente a versão em **TODOS** os arquivos do projeto.

---

## 🚀 Como Usar

### **Comando Básico:**

```bash
node update-version.js [major|minor|patch]
```

### **Exemplos:**

```bash
# Atualização Patch (0.0.17 → 0.0.18)
node update-version.js patch

# Atualização Minor (0.0.17 → 0.1.0)
node update-version.js minor

# Atualização Major (0.0.17 → 1.0.0)
node update-version.js major
```

---

## 📋 Arquivos Atualizados Automaticamente

### ✅ **Core (5 arquivos)**
- `version.js` - Arquivo principal de versão
- `sw.js` - Service Worker
- `manifest.json` - Manifest PWA
- `js/app.js` - Aplicação principal
- `index.html` - HTML principal

### ✅ **Data (8 arquivos)**
- `data/crops.json` - Cultivos
- `data/items.json` - Itens
- `data/npcs.json` - NPCs
- `data/quests.json` - Missões
- `data/skills.json` - Habilidades
- `data/news/news.json` - Notícias
- `data/translations/en-US.json` - Tradução inglês
- `data/translations/pt-BR.json` - Tradução português

### ✅ **Core Systems (3 arquivos)**
- `js/core/GameEngine.js` - Engine do jogo
- `js/core/Player.js` - Sistema de jogador
- `js/core/SaveManager.js` - Gerenciador de saves

### ✅ **Game Systems (7 arquivos)**
- `js/systems/FarmSystem.js` - Sistema de fazenda
- `js/systems/InventorySystem.js` - Inventário
- `js/systems/SkillSystem.js` - Habilidades
- `js/systems/QuestSystem.js` - Missões
- `js/systems/NotificationManager.js` - Notificações
- `js/systems/city/BankSystem.js` - Sistema bancário
- `js/systems/city/TavernSystem.js` - Taverna

### ✅ **UI Components (8 arquivos)**
- `js/ui/TopBar.js` - Barra superior
- `js/ui/SideMenu.js` - Menu lateral
- `js/ui/ScreenManager.js` - Gerenciador de telas
- `js/ui/InventoryUI.js` - Interface do inventário
- `js/ui/MarketUI.js` - Interface do mercado
- `js/ui/NPCSUI.js` - Interface de NPCs
- `js/ui/CityUI.js` - Interface da cidade
- `js/ui/AvatarSelector.js` - Seletor de avatar

### ✅ **Animations (4 arquivos)**
- `js/animations/PlantAnimation.js` - Animação de plantar
- `js/animations/HarvestAnimation.js` - Animação de colher
- `js/animations/FertilizerAnimation.js` - Animação de fertilizar
- `js/animations/WeedRemovalAnimation.js` - Animação de remover ervas

### ✅ **Utils (4 arquivos)**
- `js/utils/notifications.js` - Utilitários de notificação
- `js/utils/i18n.js` - Sistema de internacionalização
- `js/utils/iconRenderer.js` - Renderizador de ícones
- `js/utils/helpers.js` - Funções auxiliares

### ✅ **Wiki (4 arquivos)**
- `js/wiki/WikiManager.js` - Gerenciador da wiki
- `js/wiki/WikiData.js` - Dados da wiki
- `js/wiki/WikiContentGenerator.js` - Gerador de conteúdo
- `js/wiki/WikiPagesRenderer.js` - Renderizador de páginas

### ✅ **Modals (2 arquivos)**
- `js/ui/modals/Modal.js` - Modal genérico
- `js/ui/news/NewsModal.js` - Modal de notícias

### ✅ **Event System (4 arquivos)**
- `js/systems/events/EventManager.js` - Gerenciador de eventos
- `js/systems/events/HalloweenEvent.js` - Evento Halloween
- `js/systems/events/eventConfig.js` - Configuração de eventos
- `js/systems/events/eventConfig.example.js` - Exemplo de config

### ✅ **CSS (8 arquivos)**
- `style/main.css` - Estilos principais
- `style/wiki.css` - Estilos da wiki
- `style/topbar.css` - Estilos da topbar
- `style/themes.css` - Temas (claro/escuro)
- `style/skills.css` - Estilos de habilidades
- `style/mobile.css` - Estilos mobile
- `style/topbar-fix.css` - Correções da topbar
- `style/components/farm-improvements.css` - Melhorias da fazenda

---

## 📊 Total de Arquivos

**59 arquivos** são atualizados automaticamente! 🎉

---

## 🔍 O Que é Atualizado

### **JavaScript (.js):**
- `@version X.X.X` nos comentários
- `VERSION = "X.X.X"` nas constantes
- `FazendaRPG vX.X.X` em strings

### **JSON (.json):**
- `"version": "X.X.X"` no campo version

### **CSS (.css):**
- `FazendaRPG vX.X.X` nos comentários
- `@version X.X.X` nos comentários

### **HTML (.html):**
- `vX.X.X` em strings de versão

---

## ⚙️ Como Funciona

1. **Lê a versão atual** de `version.js`
2. **Incrementa conforme solicitado** (major/minor/patch)
3. **Atualiza TODOS os arquivos** da lista
4. **Usa regex patterns** para encontrar e substituir
5. **Mantém o formato** de cada arquivo
6. **Mostra relatório** de arquivos atualizados

---

## 🎨 Exemplo de Saída

```
🚀 Update Version Script
📂 Projeto: FazendaRPG
📍 Versão Atual: 0.0.17
🎯 Incrementar: patch
✨ Nova Versão: 0.0.18

📝 Atualizando arquivos...
✅ version.js atualizado
✅ sw.js atualizado
✅ manifest.json atualizado
... (59 arquivos no total)

✅ Versão atualizada com sucesso!
📦 0.0.17 → 0.0.18
📊 59 arquivos atualizados
```

---

## ⚠️ Arquivos que NÃO são Atualizados

Estes arquivos **não precisam** ter versão:

- ❌ `tests/energia-system-test.js` - Arquivo de teste
- ❌ `update-version.js` - O próprio script
- ❌ Arquivos `.md` - Documentação
- ❌ Arquivos de imagem/assets
- ❌ Arquivos de configuração do Git

---

## 🔄 Workflow Recomendado

### **Antes de Lançar Nova Versão:**

1. **Fazer todas as alterações** necessárias
2. **Testar tudo** no ambiente de desenvolvimento
3. **Rodar o script** de atualização:
   ```bash
   node update-version.js patch
   ```
4. **Commitar as alterações**:
   ```bash
   git add .
   git commit -m "chore: bump version to X.X.X"
   git push
   ```
5. **Aguardar deploy** do GitHub Pages

### **O PWA Atualiza Automaticamente!**

- ✅ Service Worker detecta nova versão
- ✅ Baixa arquivos atualizados em background
- ✅ Usuários recebem update na próxima vez que abrirem
- ✅ Saves antigos são **100% compatíveis**

---

## 🛠️ Adicionar Novo Arquivo

Se você criar um **novo arquivo** que precisa ter versão:

1. Abra `update-version.js`
2. Adicione o arquivo no array `FILES_TO_UPDATE`:

```javascript
{
  path: "caminho/do/arquivo.js",
  patterns: [
    { regex: /@version [\d.]+/g, replace: "@version VERSION_PLACEHOLDER" },
  ],
},
```

3. Certifique-se que o arquivo tenha o comentário:

```javascript
/**
 * Nome do Arquivo
 * @version 0.0.17
 */
```

---

## 📚 Versionamento Semântico

Seguimos **Semantic Versioning (SemVer)**:

### **MAJOR (X.0.0)**
- Mudanças incompatíveis com versões anteriores
- Quebra de API ou estrutura de dados
- Exemplo: `0.0.17` → `1.0.0`

### **MINOR (0.X.0)**
- Novas funcionalidades compatíveis
- Novos sistemas ou features
- Exemplo: `0.0.17` → `0.1.0`

### **PATCH (0.0.X)**
- Correções de bugs
- Pequenas melhorias
- Exemplo: `0.0.17` → `0.0.18`

---

## 🎯 Dicas

### **Sempre Incremente Patch Para:**
- 🐛 Correções de bugs
- 🎨 Melhorias visuais
- ⚡ Otimizações de performance
- 📝 Ajustes de texto/tradução

### **Incremente Minor Para:**
- ✨ Novas features
- 🎮 Novos sistemas de jogo
- 🎨 Grandes mudanças visuais
- 🌍 Novas traduções

### **Incremente Major Para:**
- 💥 Mudanças que quebram compatibilidade
- 🔄 Refatoração completa
- 📦 Mudança de estrutura de saves

---

## ✅ Checklist Antes de Atualizar Versão

- [ ] Todas as mudanças testadas
- [ ] Sem erros no console
- [ ] PWA funciona offline
- [ ] Notificações testadas
- [ ] Saves carregam corretamente
- [ ] Responsivo mobile OK
- [ ] Temas (claro/escuro) funcionando
- [ ] Traduções atualizadas (se houver)

---

## 🚀 Pronto!

Agora você tem um sistema **totalmente automatizado** de versionamento que garante que **TODOS** os arquivos do projeto estejam sincronizados com a mesma versão!

**Versão atual:** 0.0.17  
**Total de arquivos:** 59  
**Status:** ✅ 100% Completo

---

_Desenvolvido com ❤️ para FazendaRPG_