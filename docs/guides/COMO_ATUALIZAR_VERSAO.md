# 🔄 Como Atualizar a Versão do FazendaRPG

## 🎯 Sistema Centralizado de Versionamento

A partir da versão **0.0.12**, o FazendaRPG usa um sistema **CENTRALIZADO** de versionamento que atualiza TODOS os arquivos automaticamente!

---

## ⚡ FORMA RÁPIDA (Recomendada)

### Atualizar Patch (0.0.12 → 0.0.13)
```bash
node update-version.js --patch
```

### Atualizar Minor (0.0.12 → 0.1.0)
```bash
node update-version.js --minor
```

### Atualizar Major (0.0.12 → 1.0.0)
```bash
node update-version.js --major
```

### Definir Versão Manualmente
```bash
node update-version.js 0.0.13
```

---

## 📦 O Que é Atualizado Automaticamente

O script `update-version.js` atualiza **44 arquivos**:

### ✅ Core
- `version.js` - Fonte central da versão
- `sw.js` - Service Worker (OBRIGATÓRIO!)
- `manifest.json` - PWA manifest
- `index.html` - Footer e welcome screen
- `js/app.js` - Aplicação principal

### ✅ Sistemas
- `js/core/GameEngine.js`
- `js/core/Player.js`
- `js/core/SaveManager.js`
- `js/systems/FarmSystem.js`
- `js/systems/InventorySystem.js`
- `js/systems/SkillSystem.js`
- `js/systems/QuestSystem.js`
- `js/systems/NotificationManager.js`
- `js/systems/city/BankSystem.js`
- `js/systems/city/TavernSystem.js`

### ✅ UI
- `js/ui/TopBar.js`
- `js/ui/SideMenu.js`
- `js/ui/ScreenManager.js`
- `js/ui/InventoryUI.js`
- `js/ui/MarketUI.js`
- `js/ui/NPCSUI.js`
- `js/ui/CityUI.js`
- `js/ui/AvatarSelector.js`
- `js/ui/modals/Modal.js`

### ✅ Animações
- `js/animations/PlantAnimation.js`
- `js/animations/HarvestAnimation.js`
- `js/animations/FertilizerAnimation.js`
- `js/animations/WeedRemovalAnimation.js`

### ✅ Utils
- `js/utils/notifications.js`
- `js/utils/i18n.js`
- `js/utils/iconRenderer.js`
- `js/utils/helpers.js`

### ✅ Wiki
- `js/wiki/WikiManager.js`
- `js/wiki/WikiData.js`
- `js/wiki/WikiContentGenerator.js`
- `js/wiki/WikiPagesRenderer.js`

### ✅ Data
- `data/crops.json`
- `data/items.json`
- `data/npcs.json`
- `data/quests.json`
- `data/skills.json`
- `data/translations/en-US.json`
- `data/translations/pt-BR.json`

### ✅ Styles
- `style/wiki.css`

---

## 🎨 Exemplo de Uso

```bash
# 1. Verificar versão atual
grep "VERSION =" version.js
# Output: export const VERSION = "0.0.12";

# 2. Atualizar para 0.0.13
node update-version.js --patch

# 3. Verificar mudanças
git diff

# 4. Commitar
git add .
git commit -m "chore: bump version to 0.0.13"

# 5. Testar
# - Limpe o cache do navegador
# - Recarregue a página
# - Verifique o console: "🌾 FazendaRPG v0.0.13"
# - Verifique o footer: "v0.0.13"
```

---

## 📝 Saída do Script

```
═══════════════════════════════════════════════════
  🌾 FazendaRPG Version Update Tool
═══════════════════════════════════════════════════

📌 Current version: 0.0.12

🔼 Incrementing patch version...
✨ New version: 0.0.13

📝 Updating files...

✅ Updated: version.js
✅ Updated: sw.js
✅ Updated: manifest.json
✅ Updated: index.html
... (40 more files)

═══════════════════════════════════════════════════
✅ Version update complete!
═══════════════════════════════════════════════════

Old version: 0.0.12
New version: 0.0.13
Files updated: 44
Files skipped: 0

📋 Next steps:
  1. Review changes: git diff
  2. Test the application
  3. Commit changes: git commit -am "chore: bump version to 0.0.13"
  4. Clear browser cache and reload

🌾 FazendaRPG is now at version 0.0.13!
```

---

## 🔍 Onde a Versão Aparece

### No Console do Navegador (F12)
```
🌾 FazendaRPG v0.0.12
📦 Build: NotificationFix
📅 Date: 2024
ℹ️  Sistema de notificações corrigido - notifica apenas com app fechado
```

### No Footer da Página
```
v0.0.12
```

### Na Tela de Boas-Vindas
```
v0.0.12
```

### No Service Worker
```
🔧 Service Worker: Installing...
📦 Service Worker: Caching app shell
✅ Service Worker: Installation complete
```

---

## ⚙️ Como Funciona

### 1. Arquivo Central: `version.js`
```javascript
export const VERSION = "0.0.12";

export const VERSION_PARTS = {
  major: 0,
  minor: 0,
  patch: 12,
};
```

### 2. Script de Atualização: `update-version.js`
- Lê a versão atual de `version.js`
- Incrementa ou define nova versão
- Busca e substitui em **44 arquivos**
- Usa regex para encontrar padrões como:
  - `@version 0.0.11` → `@version 0.0.12`
  - `"version": "0.0.11"` → `"version": "0.0.12"`
  - `v0.0.11` → `v0.0.12`
  - `fazendarpg-v0.0.11` → `fazendarpg-v0.0.12`

### 3. Import nos Arquivos
```javascript
import { VERSION, getVersionString } from '../version.js';

console.log(getVersionString()); // "FazendaRPG v0.0.12"
```

---

## 🚨 IMPORTANTE: Por Que Atualizar a Versão?

### Service Worker (sw.js)
O Service Worker é **CACHEADO** pelo navegador. Se você não mudar a versão do cache:

❌ **SEM atualizar versão:**
- Navegador usa cache antigo
- Mudanças no código não aparecem
- Usuários veem versão bugada

✅ **COM atualização de versão:**
- Navegador detecta nova versão
- Baixa arquivos atualizados
- Cache antigo é deletado
- Usuários veem versão corrigida

### Cache Name no sw.js
```javascript
const VERSION = "0.0.12";
const CACHE_NAME = `fazendarpg-v${VERSION}`;
```

Quando muda de `v0.0.11` para `v0.0.12`:
1. Navegador vê que cache mudou
2. Baixa novos arquivos
3. Deleta cache `fazendarpg-v0.0.11`
4. Cria cache `fazendarpg-v0.0.12`

---

## 🎯 Quando Atualizar Versão?

### Patch (0.0.X)
- Correções de bugs
- Pequenas melhorias
- Ajustes de UI
- **Exemplo:** Correção de notificações

### Minor (0.X.0)
- Novas funcionalidades
- Novos sistemas
- Mudanças médias
- **Exemplo:** Novo sistema de quests

### Major (X.0.0)
- Grandes mudanças
- Refatorações completas
- Breaking changes
- **Exemplo:** Mudança de arquitetura

---

## ✅ Checklist de Atualização

- [ ] Rodar script: `node update-version.js --patch`
- [ ] Verificar saída: "44 files updated"
- [ ] Revisar mudanças: `git diff`
- [ ] Testar no navegador
- [ ] Verificar console: versão correta
- [ ] Verificar footer: versão correta
- [ ] Commitar mudanças
- [ ] Documentar no CHANGELOG.md

---

## 🐛 Troubleshooting

### "Error: No version specified"
```bash
# Você esqueceu de passar a versão ou flag
node update-version.js --patch  # ✅ Correto
```

### "Error: Invalid version format"
```bash
# Formato incorreto
node update-version.js 0.0  # ❌ Errado
node update-version.js 0.0.13  # ✅ Correto
```

### "Skipping (not found): some-file.js"
```bash
# Arquivo foi movido ou deletado
# Edite update-version.js e remova da lista FILES_TO_UPDATE
```

### Versão não atualiza no navegador
```bash
# 1. Limpe o cache do navegador (Ctrl+Shift+Del)
# 2. Hard refresh (Ctrl+Shift+R)
# 3. Desregistre Service Workers:
# Chrome DevTools → Application → Service Workers → Unregister
# 4. Recarregue a página
```

---

## 📚 Arquivos Relacionados

- `version.js` - Fonte central da versão
- `update-version.js` - Script de atualização
- `COMO_ATUALIZAR_VERSAO.md` - Este guia (você está aqui)
- `CHANGELOG.md` - Histórico de mudanças

---

## 🎉 Vantagens do Sistema Centralizado

✅ **Antes (manual):**
- Editar 44 arquivos um por um
- Fácil esquecer algum arquivo
- Versões inconsistentes
- Demorado e chato

✅ **Agora (automático):**
- 1 comando atualiza TUDO
- Impossível esquecer arquivos
- Versões sempre sincronizadas
- Rápido e confiável

---

🌾 **FazendaRPG** - Sistema de versionamento centralizado e robusto! 🚀