# 📦 Como Adicionar Itens e Sistema de Mercado

Guia completo de como o sistema de itens funciona no FazendaRPG.

## 📋 Índice

1. [Sistema de Itens](#sistema-de-itens)
2. [Como o Mercado Funciona](#como-o-mercado-funciona)
3. [Como Adicionar Novo Item](#como-adicionar-novo-item)
4. [Exemplos Práticos](#exemplos-práticos)

---

## 🎯 SISTEMA DE ITENS

### Arquivo Principal

**📁 Localização:** `data/items.json`

Este é o **arquivo único** que contém TODOS os itens do jogo!

### Estrutura do Arquivo

```json
{
  "version": "0.0.14",
  "categories": {
    // Categorias de itens
  },
  "items": {
    // TODOS os itens do jogo aqui
  }
}
```

### Categorias Disponíveis

```json
"categories": {
  "seeds": { "name": "Seeds", "icon": "🌱" },
  "crops": { "name": "Crops", "icon": "🌾" },
  "fish": { "name": "Fish", "icon": "🐟" },
  "minerals": { "name": "Minerals", "icon": "💎" },
  "wood": { "name": "Wood", "icon": "🪵" },
  "food": { "name": "Food", "icon": "🍞" },
  "tools": { "name": "Tools", "icon": "🔧" },
  "materials": { "name": "Materials", "icon": "📦" }
}
```

---

## 🏪 COMO O MERCADO FUNCIONA

### Fluxo do Sistema

```
1. MarketUI carrega → data/items.json
2. Lê TODOS os itens do arquivo
3. Filtra itens compráveis (buyPrice > 0)
4. Exibe no mercado
```

### Código Responsável

**Arquivo:** `js/ui/MarketUI.js`

```javascript
// Carrega items.json
const response = await fetch("./data/items.json");
const data = await response.json();
this.marketData = data.items; // TODOS os itens

// Filtra itens COMPRÁVEIS
const buyableItems = Object.values(this.marketData).filter(
  (item) => item.buyPrice > 0  // ← Se tem preço de compra, aparece!
);
```

### Regra Importante

**Um item aparece no mercado SE:**
- ✅ `buyPrice > 0` (tem preço de compra)

**Um item NÃO aparece no mercado SE:**
- ❌ `buyPrice: 0` ou sem `buyPrice`

---

## ➕ COMO ADICIONAR NOVO ITEM

### Passo 1: Abra o arquivo

```
data/items.json
```

### Passo 2: Adicione o item na seção "items"

**Template básico:**

```json
"seu_item_id": {
  "id": "seu_item_id",
  "name": "Item Name (English)",
  "namePtBR": "Nome do Item (Português)",
  "icon": "🎁",
  "category": "categoria",
  "description": "English description",
  "descriptionPtBR": "Descrição em português",
  "buyPrice": 100,
  "sellPrice": 50,
  "stackable": true,
  "maxStack": 999
}
```

### Passo 3: Propriedades Disponíveis

| Propriedade | Obrigatório | Descrição |
|-------------|-------------|-----------|
| `id` | ✅ Sim | ID único (sem espaços) |
| `name` | ✅ Sim | Nome em inglês |
| `namePtBR` | ✅ Sim | Nome em português |
| `icon` | ✅ Sim | Emoji do item |
| `category` | ✅ Sim | Categoria (seeds, crops, etc) |
| `description` | ✅ Sim | Descrição em inglês |
| `descriptionPtBR` | ✅ Sim | Descrição em português |
| `buyPrice` | ❌ Não | Preço de COMPRA (0 = não vende) |
| `sellPrice` | ❌ Não | Preço de VENDA |
| `stackable` | ❌ Não | Empilhável? (true/false) |
| `maxStack` | ❌ Não | Máximo por pilha |
| `energyRestore` | ❌ Não | Restaura energia (comidas) |
| `healthRestore` | ❌ Não | Restaura vida |
| `consumable` | ❌ Não | Pode consumir? |

### Passo 4: Salve o arquivo

Pronto! O item já está no jogo! 🎉

---

## 💡 EXEMPLOS PRÁTICOS

### Exemplo 1: Item de Comida (Aparece no Mercado)

```json
"pizza": {
  "id": "pizza",
  "name": "Pizza",
  "namePtBR": "Pizza",
  "icon": "🍕",
  "category": "food",
  "description": "Delicious pizza. Restores 50 energy.",
  "descriptionPtBR": "Pizza deliciosa. Restaura 50 de energia.",
  "buyPrice": 150,
  "sellPrice": 75,
  "stackable": true,
  "maxStack": 99,
  "consumable": true,
  "energyRestore": 50
}
```

**Resultado:**
- ✅ Aparece no mercado (buyPrice = 150)
- ✅ Pode comprar por 150 moedas
- ✅ Pode vender por 75 moedas
- ✅ Restaura 50 de energia ao consumir

---

### Exemplo 2: Item Raro (NÃO aparece no Mercado)

```json
"diamond": {
  "id": "diamond",
  "name": "Diamond",
  "namePtBR": "Diamante",
  "icon": "💎",
  "category": "minerals",
  "description": "A rare and valuable diamond.",
  "descriptionPtBR": "Um diamante raro e valioso.",
  "buyPrice": 0,
  "sellPrice": 1000,
  "stackable": true,
  "maxStack": 99
}
```

**Resultado:**
- ❌ NÃO aparece no mercado (buyPrice = 0)
- ✅ Pode vender por 1000 moedas
- ✅ Só consegue por mineração/drops

---

### Exemplo 3: Semente Nova

```json
"sunflower_seed": {
  "id": "sunflower_seed",
  "name": "Sunflower Seed",
  "namePtBR": "Semente de Girassol",
  "icon": "🌻",
  "category": "seeds",
  "description": "Plant to grow sunflowers.",
  "descriptionPtBR": "Plante para cultivar girassóis.",
  "buyPrice": 20,
  "sellPrice": 8,
  "stackable": true,
  "maxStack": 999
}
```

**Resultado:**
- ✅ Aparece no mercado (buyPrice = 20)
- ✅ Pode comprar por 20 moedas
- ✅ Pode vender por 8 moedas
- ✅ Empilhável até 999

---

### Exemplo 4: Ferramenta Única

```json
"golden_axe": {
  "id": "golden_axe",
  "name": "Golden Axe",
  "namePtBR": "Machado Dourado",
  "icon": "🪓",
  "category": "tools",
  "description": "A powerful golden axe.",
  "descriptionPtBR": "Um poderoso machado dourado.",
  "buyPrice": 5000,
  "sellPrice": 2500,
  "stackable": false,
  "maxStack": 1
}
```

**Resultado:**
- ✅ Aparece no mercado (buyPrice = 5000)
- ✅ Muito caro!
- ✅ NÃO empilhável (só 1 por slot)

---

## 📊 SISTEMA COMPLETO

### Como Tudo se Conecta

```
1. items.json (data/items.json)
   └─ Define TODOS os itens
      │
2. MarketUI (js/ui/MarketUI.js)
   └─ Carrega items.json
      └─ Filtra: buyPrice > 0
         └─ Exibe no mercado
            │
3. InventorySystem (js/systems/InventorySystem.js)
   └─ Gerencia inventário do jogador
      └─ Usa items.json para info dos itens
         │
4. NPCs (data/npcs.json)
   └─ Cada NPC vende itens específicos
      └─ Usa IDs do items.json
```

---

## ✅ CHECKLIST - Adicionar Novo Item

- [ ] Abrir `data/items.json`
- [ ] Escolher categoria correta
- [ ] Criar ID único (sem espaços)
- [ ] Definir nome em PT e EN
- [ ] Escolher emoji/ícone
- [ ] Definir descrição em PT e EN
- [ ] Definir `buyPrice` (0 = não vende no mercado)
- [ ] Definir `sellPrice`
- [ ] Definir se é `stackable`
- [ ] Definir `maxStack`
- [ ] Adicionar propriedades extras se necessário
- [ ] Salvar arquivo
- [ ] Testar no jogo!

---

## 🎮 TESTANDO SEU NOVO ITEM

### 1. Adicionar ao Inventário (Debug)

```javascript
// No console (F12)
FazendaRPG.debug.addItem("seu_item_id", 10)
```

### 2. Ver no Inventário

- Abra o menu (☰)
- Clique em "Inventário"
- Veja seu item!

### 3. Verificar no Mercado

- Abra o menu (☰)
- Clique em "Cidade" → "Mercado"
- Se `buyPrice > 0`, deve aparecer!

---

## 🔧 DICAS E TRUQUES

### Preços Balanceados

```javascript
// Regra geral:
sellPrice = buyPrice / 2  // Vende por metade do valor

// Exemplo:
"buyPrice": 100,
"sellPrice": 50
```

### Categorias Corretas

- **seeds** → Sementes
- **crops** → Colheitas
- **fish** → Peixes
- **minerals** → Minerais/Gemas
- **wood** → Madeira
- **food** → Comida (consumível)
- **tools** → Ferramentas
- **materials** → Materiais de craft

### Itens Raros

Para itens que NÃO devem estar no mercado:

```json
"buyPrice": 0,    // ← NÃO aparece no mercado
"sellPrice": 9999  // ← Mas vale muito!
```

### Itens Consumíveis

```json
"consumable": true,
"energyRestore": 50,  // Restaura energia
"healthRestore": 30   // Restaura vida (futuro)
```

---

## 🚀 RESUMO RÁPIDO

**Para adicionar um item:**
1. Edite `data/items.json`
2. Adicione na seção `"items"`
3. Salve
4. Pronto! ✅

**Para aparecer no mercado:**
- `buyPrice > 0` ← Só isso!

**Para NÃO aparecer no mercado:**
- `buyPrice: 0` ← Só isso!

---

## 📝 EXEMPLO COMPLETO

Adicionando "Bolo de Chocolate":

```json
"chocolate_cake": {
  "id": "chocolate_cake",
  "name": "Chocolate Cake",
  "namePtBR": "Bolo de Chocolate",
  "icon": "🍰",
  "category": "food",
  "description": "A delicious chocolate cake. Restores 100 energy.",
  "descriptionPtBR": "Um delicioso bolo de chocolate. Restaura 100 de energia.",
  "buyPrice": 300,
  "sellPrice": 150,
  "stackable": true,
  "maxStack": 50,
  "consumable": true,
  "energyRestore": 100
}
```

**Commit:**
```bash
git add data/items.json
git commit -m "🍰 Adicionar Bolo de Chocolate"
git push
```

**Pronto! Todos terão o novo item! 🎉**

---

**Dúvidas?** Veja os itens existentes em `data/items.json` como exemplo! 📦✨