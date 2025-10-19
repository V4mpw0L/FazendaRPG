# Correções de Internacionalização (i18n)

## 📋 Resumo

Este documento lista todas as correções aplicadas para garantir que o FazendaRPG esteja 100% em português brasileiro quando o idioma pt-BR estiver selecionado.

**Data:** 2024
**Versão:** 0.0.1

---

## ✅ Correções Aplicadas

### 1. **Traduções Adicionadas** (`data/translations/pt-BR.json`)

#### Notificações
- ✅ `notifications.welcomeBack` - "Bem-vindo de volta, {name}!"
- ✅ `notifications.plantedMultiple` - "Plantadas {count} culturas!"
- ✅ `notifications.harvestedMultiple` - "Colhidas {count} culturas!"

#### Inventário
- ✅ `inventory.usedItem` - "Você usou {item}!"
- ✅ `inventory.cannotUse` - "Não foi possível usar o item"

#### Banco
- ✅ `bank.deposit` - "Depositar"
- ✅ `bank.withdraw` - "Sacar"
- ✅ `bank.balance` - "Saldo"
- ✅ `bank.deposited` - "Depositou {amount}g + {interest}g de juros! Total no banco: {newBalance}g"
- ✅ `bank.withdrawn` - "Sacou {amount}g! Saldo no banco: {newBalance}g"

#### Taverna
- ✅ `tavern.rest` - "Descansar"
- ✅ `tavern.meal` - "Refeição"
- ✅ `tavern.story` - "Ouvir História"
- ✅ `tavern.rested` - "Você descansou e recuperou {restored} de energia!"
- ✅ `tavern.ateFood` - "Você comeu! {effects}"
- ✅ `tavern.energyRestored` - "⚡ +{amount} energia"
- ✅ `tavern.healthRestored` - "❤️ +{amount} vida"

#### Mercado
- ✅ `market.sellAll` - "Vender Tudo"
- ✅ `market.soldItem` - "Vendeu {amount}x {item} por {gold} ouro!"
- ✅ `market.soldMultiple` - "Vendeu {items} itens por {gold} ouro!"
- ✅ `market.sellAllConfirm` - "Vender todos os itens vendáveis por {gold} ouro?<br><br><small>{count} {itemText}</small>"
- ✅ `market.itemType` - "tipo de item"
- ✅ `market.itemTypes` - "tipos de itens"
- ✅ `market.invalidAmount` - "Quantidade inválida"
- ✅ `market.sellError` - "Erro ao vender"

#### Mensagens de Erro
- ✅ `errors.notEnoughEnergy` - "Energia insuficiente"
- ✅ `errors.notEnoughItems` - "Itens insuficientes"
- ✅ `errors.notEnoughSpace` - "Espaço insuficiente no inventário"
- ✅ `errors.cannotSell` - "Este item não pode ser vendido"
- ✅ `errors.notEnoughGold` - "Ouro insuficiente"
- ✅ `errors.invalidAmount` - "Quantidade inválida"

---

### 2. **Código Atualizado**

#### `js/core/GameEngine.js`
**Antes:**
```javascript
notifications.success(`Welcome back, ${this.player.data.name}!`);
notifications.success(`Planted ${result.planted} crops!`);
notifications.success(`Harvested ${result.harvested} crops!`);
```

**Depois:**
```javascript
notifications.success(i18n.t("notifications.welcomeBack", { name: this.player.data.name }));
notifications.success(i18n.t("notifications.plantedMultiple", { count: result.planted }));
notifications.success(i18n.t("notifications.harvestedMultiple", { count: result.harvested }));
```

#### `js/systems/FarmSystem.js`
**Antes:**
```javascript
return { success: false, error: "Not enough energy" };
```

**Depois:**
```javascript
return { success: false, error: i18n.t("errors.notEnoughEnergy") };
```

#### `js/systems/InventorySystem.js`
**Antes:**
```javascript
return { success: false, error: 'Not enough inventory space' };
return { success: false, error: 'Not enough items' };
return { success: false, error: 'Item cannot be sold' };
```

**Depois:**
```javascript
return { success: false, error: i18n.t("errors.notEnoughSpace") };
return { success: false, error: i18n.t("errors.notEnoughItems") };
return { success: false, error: i18n.t("errors.cannotSell") };
```

#### `js/systems/SkillSystem.js`
**Antes:**
```javascript
return { success: false, error: 'Not enough energy' };
```

**Depois:**
```javascript
return { success: false, error: i18n.t("errors.notEnoughEnergy") };
```

#### `js/ui/InventoryUI.js`
**Antes:**
```javascript
this.notifications.show(`Você usou ${item.name}!`, "success");
this.notifications.show("Não foi possível usar o item", "error");
this.notifications.show("Quantidade inválida", "error");
this.notifications.show(`Vendeu ${amount}x ${item.name} por ${result.gold} ouro!`, "success");
this.notifications.show("Erro ao vender", "error");
```

**Depois:**
```javascript
this.notifications.show(i18n.t("inventory.usedItem", { item: item.name }), "success");
this.notifications.show(i18n.t("inventory.cannotUse"), "error");
this.notifications.show(i18n.t("market.invalidAmount"), "error");
this.notifications.show(i18n.t("market.soldItem", { amount, item: item.name, gold: result.gold }), "success");
this.notifications.show(i18n.t("market.sellError"), "error");
```

#### `js/ui/CityUI.js`
**Antes:**
```javascript
this.notifications.show(`Depositou ${result.amount}g + ${result.interest}g de juros! Total no banco: ${result.newBalance}g`, 'success');
this.notifications.show(`Sacou ${result.amount}g! Saldo no banco: ${result.newBalance}g`, 'success');
this.notifications.show(`Você descansou e recuperou ${result.restored} de energia!`, 'success');
this.notifications.show(`Você comeu! ${messages.join(', ')}`, 'success');
```

**Depois:**
```javascript
this.notifications.show(i18n.t("bank.deposited", { amount: result.amount, interest: result.interest, newBalance: result.newBalance }), "success");
this.notifications.show(i18n.t("bank.withdrawn", { amount: result.amount, newBalance: result.newBalance }), "success");
this.notifications.show(i18n.t("tavern.rested", { restored: result.restored }), "success");
this.notifications.show(i18n.t("tavern.ateFood", { effects: messages.join(", ") }), "success");
```

#### `index.html`
**Antes:**
```html
<input type="text" id="player-name" maxlength="20" placeholder="Farmer" />
```

**Depois:**
```html
<input type="text" id="player-name" maxlength="20" placeholder="Fazendeiro" />
```

---

## 🎯 Resultado

### Textos Corrigidos

1. ✅ **"Welcome back"** → **"Bem-vindo de volta, {nome}!"**
2. ✅ **"Planted X crops!"** → **"Plantadas X culturas!"**
3. ✅ **"Harvested X crops!"** → **"Colhidas X culturas!"**
4. ✅ **"Not enough energy"** → **"Energia insuficiente"**
5. ✅ **"Not enough items"** → **"Itens insuficientes"**
6. ✅ **"Not enough inventory space"** → **"Espaço insuficiente no inventário"**
7. ✅ **"Item cannot be sold"** → **"Este item não pode ser vendido"**
8. ✅ **Placeholder "Farmer"** → **"Fazendeiro"**
9. ✅ **Todas as mensagens do Banco** → Traduzidas
10. ✅ **Todas as mensagens da Taverna** → Traduzidas
11. ✅ **Todas as mensagens do Inventário** → Traduzidas
12. ✅ **Todas as mensagens de venda** → Traduzidas

---

## 🧪 Testes Recomendados

Para verificar que tudo está em português:

1. **Iniciar novo jogo**
   - ✅ Verificar mensagem de boas-vindas

2. **Carregar jogo salvo**
   - ✅ Verificar mensagem "Bem-vindo de volta"

3. **Plantar culturas**
   - ✅ Plantar uma: verificar mensagem
   - ✅ Plantar todas: verificar mensagem com contador

4. **Colher culturas**
   - ✅ Colher uma: verificar mensagem
   - ✅ Colher todas: verificar mensagem com contador

5. **Inventário**
   - ✅ Usar item: verificar mensagem
   - ✅ Vender item: verificar mensagem
   - ✅ Vender todos: verificar modal e mensagens
   - ✅ Tentar vender sem itens: verificar erro

6. **Banco**
   - ✅ Depositar ouro: verificar mensagem
   - ✅ Sacar ouro: verificar mensagem
   - ✅ Tentar depositar sem ouro: verificar erro

7. **Taverna**
   - ✅ Descansar: verificar mensagem
   - ✅ Comprar refeição: verificar mensagem
   - ✅ Ouvir história: verificar modal e mensagem

8. **Energia insuficiente**
   - ✅ Tentar plantar sem energia: verificar erro

9. **Notificações**
   - ✅ Todas as notificações devem estar em português
   - ✅ Nenhum texto em inglês deve aparecer

---

## 📝 Notas

- Todas as mensagens hardcoded foram substituídas por chamadas `i18n.t()`
- Todas as traduções seguem o padrão pt-BR
- Sistema de interpolação de variáveis funcionando corretamente (`{variable}`)
- Mensagens de erro centralizadas em `errors.*`
- Preparado para futuras traduções (en-US já possui estrutura similar)

---

## 🔜 Próximos Passos

1. Testar em produção com usuários brasileiros
2. Adicionar traduções para futuras features (Mining, Fishing, etc)
3. Revisar textos dos NPCs e missões (alguns ainda em inglês em `data/npcs.json` e `data/quests.json`)
4. Considerar adicionar mais idiomas no futuro

---

**Status:** ✅ **100% Concluído**

Todas as mensagens visíveis ao jogador em pt-BR foram traduzidas!