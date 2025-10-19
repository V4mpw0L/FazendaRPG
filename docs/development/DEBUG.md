# FazendaRPG - DEBUG & TEST GUIDE

## 🐛 Problemas Reportados

### 1. Itens sumindo do inventário
- **Status**: Investigando
- **Possível causa**: Problema no save/load ou no InventorySystem

### 2. XP não aparece na barra de "Sua Fazenda"
- **Status**: Investigando
- **Possível causa**: Evento `player:xpChanged` não está sendo disparado corretamente

### 3. Dessincronização geral
- **Status**: Investigando
- **Possível causa**: Múltiplos sistemas não estão se comunicando corretamente

---

## 🔍 Como Testar

### Teste 1: Verificar LocalStorage
1. Abra `test-debug.html` no navegador
2. Clique em "Check LocalStorage"
3. Verifique se há dados salvos
4. Verifique a estrutura do `player.inventory`

### Teste 2: Console do Navegador
Abra o DevTools (F12) e digite:

```javascript
// Ver dados do player
console.log(window.game?.player?.data);

// Ver inventário
console.log(window.game?.player?.data?.inventory);

// Ver XP atual
console.log('XP:', window.game?.player?.data?.xp);
console.log('Level:', window.game?.player?.data?.level);

// Ver skills
console.log(window.game?.player?.data?.skills);
```

### Teste 3: Plantar e Colher
1. Inicie um novo jogo
2. Plante sementes
3. Aguarde crescer
4. Colha
5. Verifique no console:
   - `inventory:itemAdded` deve ser disparado
   - `player:xpChanged` deve ser disparado
   - `player:skillXpChanged` deve ser disparado

### Teste 4: Verificar Eventos
Cole no console:

```javascript
// Escutar TODOS os eventos
['player:xpChanged', 'player:skillXpChanged', 'inventory:itemAdded', 'farm:harvested'].forEach(eventName => {
    window.addEventListener(eventName, (e) => {
        console.log(`🔔 EVENT: ${eventName}`, e.detail);
    });
});
```

Depois plante e colha para ver se os eventos são disparados.

---

## 🔧 Fluxo Correto

### Plantar
1. User clica em tile
2. FarmSystem.plant() é chamado
3. Verifica se tem semente no inventário
4. Remove semente do inventário
5. Planta no tile
6. Dispara evento `farm:planted`

### Colher
1. User clica em tile pronto
2. FarmSystem.harvest() é chamado
3. Adiciona item colhido ao inventário → `player.addItem()`
4. Adiciona XP de skill → `skillSystem.addXP('farming', xp)`
5. SkillSystem.addXP() chama:
   - `player.addSkillXP(skill, amount)` → dispara `player:skillXpChanged`
   - `player.addXP(baseXP)` → dispara `player:xpChanged`
6. Dispara evento `farm:harvested`

### Eventos que DEVEM ser disparados
- ✅ `player:xpChanged` - Quando ganha XP base
- ✅ `player:skillXpChanged` - Quando ganha XP de skill
- ✅ `inventory:itemAdded` - Quando adiciona item
- ✅ `inventory:itemRemoved` - Quando remove item
- ✅ `farm:planted` - Quando planta
- ✅ `farm:harvested` - Quando colhe

---

## 🚨 Checklist de Verificação

### Player.js
- [ ] `addXP()` dispara evento `player:xpChanged`
- [ ] `addSkillXP()` dispara evento `player:skillXpChanged`
- [ ] `addItem()` funciona corretamente
- [ ] `removeItem()` funciona corretamente
- [ ] `getData()` retorna inventário completo

### InventorySystem.js
- [ ] Dispara evento `inventory:itemAdded`
- [ ] Dispara evento `inventory:itemRemoved`
- [ ] `addItem()` atualiza `player.inventory`
- [ ] Inventário persiste após save/load

### FarmSystem.js
- [ ] `harvest()` adiciona item ao inventário
- [ ] `harvest()` adiciona XP via SkillSystem
- [ ] Dispara eventos corretos

### SkillSystem.js
- [ ] `addXP()` chama `player.addSkillXP()`
- [ ] `addXP()` chama `player.addXP()` para XP base
- [ ] XP base = 10% do XP de skill

### GameEngine.js
- [ ] Escuta `player:xpChanged` e atualiza barra
- [ ] Escuta `inventory:itemAdded` e atualiza UI
- [ ] `saveGame()` salva inventário completo
- [ ] `loadGame()` carrega inventário completo

### SaveManager.js
- [ ] `save()` salva tudo corretamente
- [ ] `load()` carrega tudo corretamente
- [ ] Validação de dados funciona

---

## 🛠️ Comandos de Debug no Console

### Forçar adicionar XP
```javascript
window.game.player.addXP(100);
```

### Forçar adicionar item
```javascript
window.game.player.addItem('wheat', 10);
```

### Ver estado do jogo
```javascript
console.table({
    Gold: window.game.player.data.gold,
    Energy: window.game.player.data.energy,
    Level: window.game.player.data.level,
    XP: window.game.player.data.xp,
    'Farming Level': window.game.player.data.skills.farming.level,
    'Farming XP': window.game.player.data.skills.farming.xp
});
```

### Forçar save
```javascript
window.game.saveGame();
console.log('Saved!');
```

### Limpar save e recarregar
```javascript
localStorage.clear();
location.reload();
```

---

## 📝 Logs Esperados

Ao plantar e colher 1 wheat, você DEVE ver no console:

```
🌱 Planting wheat_seed at tile 0
✅ Planted wheat at tile 0
🔔 EVENT: farm:planted { tileIndex: 0, crop: 'wheat_seed' }
🧺 Harvesting tile 0
✅ Harvested 2x wheat from tile 0
🔔 EVENT: inventory:itemAdded { itemId: 'wheat', amount: 2 }
🎉 farming level up! New level: 2 (ou apenas ganhou XP)
🔔 EVENT: player:skillXpChanged { skill: 'farming', xp: 25, level: 1 }
🔔 EVENT: player:xpChanged { xp: 2, level: 1 }
🔔 EVENT: farm:harvested { tileIndex: 0, crop: 'wheat', amount: 2, xp: 25 }
```

---

## 🔴 Se NADA Funcionar

### Reset Completo
1. Abra DevTools (F12)
2. Application → Local Storage
3. Delete tudo de `fazendarpg_*`
4. Recarregue a página (CTRL+SHIFT+R)
5. Comece novo jogo
6. Teste plantar e colher
7. Verifique console para erros

### Verificar Arquivos Carregados
No console:
```javascript
console.log('GameEngine:', window.game);
console.log('Player:', window.game?.player);
console.log('FarmSystem:', window.game?.farmSystem);
console.log('InventorySystem:', window.game?.inventorySystem);
```

Se algum for `undefined`, o módulo não foi carregado!

---

## ✅ Teste de Aceitação Final

1. [ ] Inicia novo jogo sem erros
2. [ ] Planta semente → inventário diminui
3. [ ] Colhe crop → inventário aumenta
4. [ ] XP aparece na topbar (barra de cima)
5. [ ] XP aparece na tela de Skills
6. [ ] Vende item → gold aumenta
7. [ ] Salva e recarrega → tudo persiste
8. [ ] Topbar fica FIXA ao rolar página

Se TODOS os 8 itens funcionarem, o jogo está OK!